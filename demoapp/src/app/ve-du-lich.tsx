import React, { useState, useEffect, useRef } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalFooter from '../components/global-footer';

const { width } = Dimensions.get('window');

export default function VeDuLichScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ location?: string; search?: string }>();

  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voucherSaved, setVoucherSaved] = useState(false);

  const mainScrollRef = useRef<ScrollView>(null);
  const scrollRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (params.location) {
      const loc = params.location;
      const timer = setTimeout(() => {
        setSelectedTag(loc);
        setAppliedKeyword('');
        setSearchKeyword('');
        mainScrollRef.current?.scrollTo({ y: 520, animated: true });
      }, 50);
      return () => clearTimeout(timer);
    }
    if (params.search) {
      const s = params.search;
      const timer = setTimeout(() => {
        setSearchKeyword(s);
        setAppliedKeyword(s);
        mainScrollRef.current?.scrollTo({ y: 520, animated: true });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [params.location, params.search]);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= FEATURED.length) {
        nextIndex = 0;
      }
      scrollRef.current?.scrollTo({ x: nextIndex * (width - 32), animated: true });
      setCurrentIndex(nextIndex);
    }, 7000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleBookTicket = (ticket: any) => {
    router.push({
      pathname: '/chi-tiet-ve',
      params: {
        name: ticket.name,
        price: ticket.price,
        location: ticket.location,
        image: ticket.image,
        desc: ticket.desc,
      },
    });
  };

  const heroCardWidth = width - 32;

  const displaySuggestions = TICKETS.filter(t => {
    if (
      searchKeyword &&
      !t.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !t.location.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }
    return true;
  }).slice(0, 5);

  const filteredTickets = TICKETS.filter(t => {
    const matchTag =
      selectedTag === 'Tất cả' ||
      t.location.toLowerCase().includes(selectedTag.toLowerCase()) ||
      t.name.toLowerCase().includes(selectedTag.toLowerCase());
    const matchKeyword =
      !appliedKeyword ||
      t.name.toLowerCase().includes(appliedKeyword.toLowerCase()) ||
      t.location.toLowerCase().includes(appliedKeyword.toLowerCase());
    return matchTag && matchKeyword;
  });

  const CITY_FILTERS = [
    'Tất cả',
    'Tây Ninh',
    'Nha Trang',
    'Long An',
    'Đồng Tháp',
    'Bến Tre',
    'An Giang',
    'Lâm Đồng',
    'Phú Quốc',
    'Đà Nẵng',
    'Hạ Long',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B4A37" />

      {/* BEGIN: Header (TopBar & Header chuẩn Stitch) */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={8}
            accessibilityLabel="Quay lại"
          >
            <SymbolView name="chevron.left" size={17} tintColor="#FFFFFF" />
          </Pressable>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitleText}>Vé du lịch & Trải nghiệm</Text>
            <View style={styles.headerSubRow}>
              <SymbolView name="safari" size={11} tintColor="#6EE7B7" />
              <Text style={styles.headerSubText}>Khám phá & đặt vé ngay</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => {
              mainScrollRef.current?.scrollTo({ y: 0, animated: true });
            }}
            hitSlop={8}
          >
            <SymbolView name="magnifyingglass" size={15} tintColor="#FFFFFF" />
          </Pressable>

          <Pressable
            style={styles.headerIconBtn}
            onPress={() => router.push('/don-hang-ve')}
            hitSlop={8}
          >
            <SymbolView name="bell" size={15} tintColor="#FFFFFF" />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={mainScrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* BEGIN: Search Input Box (Pill search with button) */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarBox}>
            <SymbolView name="magnifyingglass" size={16} tintColor="#94A3B8" style={{ marginLeft: 4 }} />
            <TextInput
              style={styles.searchInputField}
              placeholder="Tìm vé, điểm đến hoặc cáp treo..."
              placeholderTextColor="#94A3B8"
              value={searchKeyword}
              onChangeText={(text) => {
                setSearchKeyword(text);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 250);
              }}
              onSubmitEditing={() => {
                setAppliedKeyword(searchKeyword);
                setShowSuggestions(false);
              }}
            />

            {searchKeyword.length > 0 && (
              <Pressable
                onPress={() => {
                  setSearchKeyword('');
                  setAppliedKeyword('');
                }}
                hitSlop={8}
                style={{ marginRight: 6 }}
              >
                <SymbolView name="xmark.circle.fill" size={15} tintColor="#94A3B8" />
              </Pressable>
            )}

            <Pressable
              style={styles.searchActionBtn}
              onPress={() => {
                setAppliedKeyword(searchKeyword);
                setShowSuggestions(false);
              }}
            >
              <Text style={styles.searchActionBtnText}>Tìm vé</Text>
            </Pressable>
          </View>

          {/* Autocomplete suggestions dropdown */}
          {showSuggestions && displaySuggestions.length > 0 && (
            <View style={styles.suggestionsBox}>
              {displaySuggestions.map((t, idx) => (
                <Pressable
                  key={idx}
                  style={styles.suggestionItemRow}
                  onPress={() => {
                    setSearchKeyword(t.name);
                    setAppliedKeyword(t.name);
                    setShowSuggestions(false);
                  }}
                >
                  <SymbolView name="ticket" size={14} tintColor="#0B4A37" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.suggestionTitle} numberOfLines={1}>{t.name}</Text>
                    <Text style={styles.suggestionSub}>{t.location}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* BEGIN: Hero Highlight Card (Carousel Núi Bà Đen & Vé Nổi Bật) */}
        <View style={styles.heroSectionWrapper}>
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={heroCardWidth}
            snapToAlignment="center"
            contentContainerStyle={{ paddingHorizontal: 0 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(e) => {
              const contentOffsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffsetX / heroCardWidth);
              setCurrentIndex(index);
            }}
          >
            {FEATURED.map((item, idx) => {
              const inputRange = [
                (idx - 1) * heroCardWidth,
                idx * heroCardWidth,
                (idx + 1) * heroCardWidth,
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [1.06, 1, 1.06],
                extrapolate: 'clamp',
              });

              return (
                <View key={idx} style={[styles.heroCard, { width: heroCardWidth }]}>
                  <Animated.Image
                    source={{ uri: item.image }}
                    style={[styles.heroCardImage, { transform: [{ scale }] }]}
                  />

                  {/* Gradient overlays */}
                  <View style={styles.heroCardGradientTop} />
                  <View style={styles.heroCardGradientBottom} />

                  {/* Top Badges */}
                  <View style={styles.heroTopBadges}>
                    <View style={styles.heroBadgeRow}>
                      <View style={styles.heroBadgeOrange}>
                        <Text style={styles.heroBadgeOrangeText}>VÉ NỔI BẬT</Text>
                      </View>
                      <View style={styles.heroBadgeGlass}>
                        <Text style={styles.heroBadgeGlassText}>ĐẶT VÉ TRỰC TUYẾN</Text>
                      </View>
                    </View>

                    <View style={styles.heroRatingPill}>
                      <Text style={styles.heroRatingStar}>★</Text>
                      <Text style={styles.heroRatingText}>4.9</Text>
                    </View>
                  </View>

                  {/* Bottom Content Area */}
                  <View style={styles.heroBottomContent}>
                    <Text style={styles.heroCardTitle} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.heroCardDesc} numberOfLines={2}>
                      {item.desc}
                    </Text>

                    {/* Metadata Row */}
                    <View style={styles.heroMetaRow}>
                      <View style={styles.heroMetaItem}>
                        <SymbolView name="mappin.and.ellipse" size={13} tintColor="#34D399" />
                        <Text style={styles.heroMetaText} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                      <Text style={styles.heroMetaBullet}>•</Text>
                      <View style={styles.heroMetaItem}>
                        <View style={styles.heroLivePulseDot} />
                        <Text style={styles.heroLiveAvailText}>3 lịch khả dụng</Text>
                      </View>
                    </View>

                    {/* Price and CTA */}
                    <View style={styles.heroActionFooter}>
                      <View>
                        <Text style={styles.heroPriceLabel}>GIÁ THAM KHẢO</Text>
                        <View style={styles.heroPriceValRow}>
                          <Text style={styles.heroPricePrefix}>Từ</Text>
                          <Text style={styles.heroPriceVal}>{item.price}</Text>
                        </View>
                      </View>

                      <Pressable
                        style={styles.heroCtaBtn}
                        onPress={() => handleBookTicket(item)}
                      >
                        <Text style={styles.heroCtaBtnText}>XEM VÉ</Text>
                        <SymbolView name="arrow.right" size={12} tintColor="#FFFFFF" />
                      </Pressable>
                    </View>

                    {/* Carousel Dots */}
                    <View style={styles.heroDotsContainer}>
                      {FEATURED.map((_, dIdx) => (
                        <View
                          key={dIdx}
                          style={[
                            styles.heroDot,
                            currentIndex === dIdx && styles.heroDotActive,
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}
          </Animated.ScrollView>
        </View>

        {/* BEGIN: Quick City Filter (Khám phá nhanh) */}
        <View style={styles.cityFilterSection}>
          <View style={styles.cityFilterHeader}>
            <Text style={styles.cityFilterHeading}>Khám phá nhanh</Text>
            <Text style={styles.cityCountText}>
              {selectedTag === 'Tất cả' ? `${filteredTickets.length} vé du lịch` : `${selectedTag}: ${filteredTickets.length} vé`}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cityChipsScroll}
          >
            {CITY_FILTERS.map((city, idx) => {
              const isActive = selectedTag === city;
              return (
                <Pressable
                  key={idx}
                  style={[styles.cityChip, isActive && styles.cityChipActive]}
                  onPress={() => {
                    setSelectedTag(city);
                    setAppliedKeyword('');
                    setSearchKeyword('');
                  }}
                >
                  <Text style={[styles.cityChipText, isActive && styles.cityChipTextActive]}>
                    {city}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* BEGIN: Coupon Voucher Banner ("Săn deal cuối tuần - IGOVI80K") */}
        <View style={styles.voucherSection}>
          <View style={styles.voucherCard}>
            {/* Cutouts */}
            <View style={styles.voucherCutoutLeft} />
            <View style={styles.voucherCutoutRight} />

            <View style={styles.voucherContent}>
              <View style={styles.voucherLeft}>
                <View style={styles.voucherBadgeRow}>
                  <Text style={styles.voucherTagText}>CHÀO BẠN MỚI</Text>
                  <Text style={styles.voucherBullet}>•</Text>
                  <Text style={styles.voucherStarText}>★ Ưu đãi độc quyền</Text>
                </View>

                <Text style={styles.voucherTitle}>Săn deal cuối tuần</Text>
                <Text style={styles.voucherSub}>
                  Giảm ngay <Text style={{ fontWeight: '800', color: '#FEF08A' }}>80.000đ</Text> cho vé điểm đến
                </Text>

                <View style={styles.voucherCodeRow}>
                  <View style={styles.voucherCodeBox}>
                    <Text style={styles.voucherCodeText}>IGOVI80K</Text>
                  </View>
                  <Pressable onPress={() => router.push('/uu-dai')}>
                    <Text style={styles.voucherDetailsLink}>Chi tiết mã ›</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={[styles.voucherClaimBtn, voucherSaved && styles.voucherClaimBtnSaved]}
                onPress={() => setVoucherSaved(!voucherSaved)}
              >
                <Text style={[styles.voucherClaimBtnText, voucherSaved && styles.voucherClaimBtnTextSaved]}>
                  {voucherSaved ? 'Đã lưu' : 'Lưu mã'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* BEGIN: All Tickets List (Horizontal Card Style - Traveloka/Klook Standard) */}
        <View style={styles.ticketsListSection}>
          <View style={styles.listHeaderRow}>
            <View>
              <Text style={styles.listSubTitle}>GỢI Ý NỔI BẬT</Text>
              <Text style={styles.listMainTitle}>
                {selectedTag === 'Tất cả' ? 'Tất cả vé & dịch vụ tham quan' : `Vé tham quan tại ${selectedTag}`}
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{filteredTickets.length} vé</Text>
            </View>
          </View>

          {filteredTickets.length === 0 ? (
            <View style={styles.emptyStateBox}>
              <SymbolView name="magnifyingglass" size={40} tintColor="#94A3B8" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyStateText}>
                Không tìm thấy vé phù hợp với tìm kiếm của bạn.
              </Text>
              <Pressable
                style={styles.resetFilterBtn}
                onPress={() => {
                  setSelectedTag('Tất cả');
                  setAppliedKeyword('');
                  setSearchKeyword('');
                }}
              >
                <Text style={styles.resetFilterBtnText}>Xem tất cả vé</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.horizontalCardGrid}>
              {filteredTickets.map((ticket, idx) => (
                <Pressable
                  key={idx}
                  style={styles.horizontalTicketCard}
                  onPress={() => handleBookTicket(ticket)}
                >
                  {/* Left Square Thumbnail */}
                  <View style={styles.ticketThumbBox}>
                    <Image source={{ uri: ticket.image }} style={styles.ticketThumbImg} contentFit="cover" />
                    <View style={styles.thumbRatingPill}>
                      <Text style={styles.thumbStar}>★</Text>
                      <Text style={styles.thumbRatingVal}>4.9</Text>
                    </View>
                    <View style={styles.thumbCategoryBadge}>
                      <Text style={styles.thumbCategoryText}>Vé du lịch</Text>
                    </View>
                  </View>

                  {/* Right Content Column */}
                  <View style={styles.ticketRightCol}>
                    <View>
                      <Text style={styles.ticketCardTitle} numberOfLines={2}>
                        {ticket.name}
                      </Text>

                      <View style={styles.ticketCardLocRow}>
                        <SymbolView name="mappin" size={11} tintColor="#0B4A37" />
                        <Text style={styles.ticketCardLocText} numberOfLines={1}>
                          {ticket.location}
                        </Text>
                      </View>

                      <View style={styles.ticketCardPerksRow}>
                        <View style={styles.perkChip}>
                          <Text style={styles.perkChipText}>Có lịch gần nhất</Text>
                        </View>
                        <View style={styles.liveAvailRow}>
                          <View style={styles.liveAvailDot} />
                          <Text style={styles.liveAvailText}>3 lịch khả dụng</Text>
                        </View>
                      </View>
                    </View>

                    {/* Bottom Price & Button */}
                    <View style={styles.ticketCardBottomRow}>
                      <View>
                        <Text style={styles.pricePrefix}>Giá từ</Text>
                        <Text style={styles.priceVal}>{ticket.price}</Text>
                      </View>

                      <View style={styles.bookTicketBtn}>
                        <Text style={styles.bookTicketBtnText}>Đặt vé</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* BEGIN: Destination Inspiration (Asymmetric Grid) */}
        <View style={styles.destinationSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubtitle}>CẢM HỨNG CHO CHUYẾN ĐI</Text>
              <Text style={styles.sectionTitle}>Bạn muốn đi đâu tiếp theo?</Text>
            </View>
            <Pressable
              style={styles.sectionSeeAllBtn}
              onPress={() => {
                setSelectedTag('Tất cả');
                mainScrollRef.current?.scrollTo({ y: 520, animated: true });
              }}
            >
              <Text style={styles.sectionSeeAllText}>Xem tất cả</Text>
              <SymbolView name="chevron.right" size={12} tintColor="#0B4A37" />
            </Pressable>
          </View>

          <View style={styles.destinationGridRow}>
            {/* Left Hero Destination: Rừng Tràm Tân Lập */}
            <Pressable
              style={styles.destLeftCard}
              onPress={() => {
                setSelectedTag('Long An');
                mainScrollRef.current?.scrollTo({ y: 520, animated: true });
              }}
            >
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjkighYpG_LrLjQ61PUillxA-9CqiV88O0Pw1486FdGZOdWKslZZ4J3SZHqYo545GvqRkS1fbJyA8ixJg8WLHkv2Rv6W1rq2vmUFHzQs2sKtftB7eOZPwMLPJ150mVw0hvLP0T25Lb1Wut8AeOGFKzV9SdMxopcgPdwMdGX-ZmkRSzh3j3WJQw-oIsH8JyhokpYwdJXIOh1DPUAc4_Tq31QO4xJaBhx1MNK_xQfVnVUy2EGp6QdpyDxA',
                }}
                style={styles.fullCardImg}
                contentFit="cover"
              />
              <View style={styles.destOverlayDark} />

              <View style={styles.destTagBadgeTop}>
                <View style={styles.destTagDot} />
                <Text style={styles.destTagText}>Gần Sài Gòn</Text>
              </View>

              <View style={styles.destLeftBottom}>
                <Text style={styles.destLocationPin}>📍 Long An</Text>
                <Text style={styles.destHeroTitle}>Rừng Tràm Tân Lập</Text>
                <Text style={styles.destHeroDesc} numberOfLines={2}>
                  Sông nước mênh mông, xuồng chèo len lỏi & khám phá ẩm thực...
                </Text>
                <Text style={styles.destLinkYellow}>Khám phá tour ›</Text>
              </View>
            </Pressable>

            {/* Right Column Stacked: Đồng Tháp & Bến Tre */}
            <View style={styles.destRightCol}>
              <Pressable
                style={styles.destRightCard}
                onPress={() => {
                  setSelectedTag('Đồng Tháp');
                  mainScrollRef.current?.scrollTo({ y: 520, animated: true });
                }}
              >
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjE11xrEgPVl0sKSOWc72cucCJGrxpa4xwNPhTHJxtTsI5UJiycjD9-0ufyUV_H1sAAjSgqm9wCYujS5_YmjvGzAWXRDjydbjREdvN4RB1uZbu6vTXzZRwZJsvHVbz5XLd3yF95qAzQTYeMonIFNNsV3blGb7TbK25eUaRGKQVFKasZoGqOXZbp0L1cdoX_1y-q2iER6a5LVT2backDHdB5IIMo6QfqbzQIkBPK30fPGKXLxA-FYCsyA',
                  }}
                  style={styles.fullCardImg}
                  contentFit="cover"
                />
                <View style={styles.destOverlayDark} />
                <View style={[styles.destMiniBadge, { backgroundColor: '#F43F5E' }]}>
                  <Text style={styles.destMiniBadgeText}>Đồng Sen</Text>
                </View>
                <View style={styles.destMiniBottom}>
                  <Text style={styles.destMiniTitle}>Đồng Tháp</Text>
                  <Text style={styles.destMiniSub}>Làng hoa Sa Đéc</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.destRightCard}
                onPress={() => {
                  setSelectedTag('Bến Tre');
                  mainScrollRef.current?.scrollTo({ y: 520, animated: true });
                }}
              >
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjrcfNU9N0GRT3-AUJmLvX3H_Edrw-JiIhUegf7VWaBgAHK_vNhDSu98iE9IwFLdY7AmbVvvOn8ji-pxElGiC8MjvZVd_d9RvHSskHujUzhbDVBNn3OpcLtnNvr0jc-9BCPUYYvy416os10xFkh_BtQl_8yrw6nNsLHRgnu1Nj1MIUey-k2m8p5KEPZUgLVHnrC8JXFV74al6K5jjXYOGOC34o7xcxfrkRrsCvMGXFHE0emA_rLwaIBQ',
                  }}
                  style={styles.fullCardImg}
                  contentFit="cover"
                />
                <View style={styles.destOverlayDark} />
                <View style={[styles.destMiniBadge, { backgroundColor: '#D97706' }]}>
                  <Text style={styles.destMiniBadgeText}>Miệt Vườn</Text>
                </View>
                <View style={styles.destMiniBottom}>
                  <Text style={styles.destMiniTitle}>Bến Tre</Text>
                  <Text style={styles.destMiniSub}>Chèo xuồng ven sông</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* BEGIN: Trust Guarantee Banner */}
        <View style={styles.trustBannerWrapper}>
          <View style={styles.trustBanner}>
            <View style={styles.trustLeft}>
              <View style={styles.trustIconCircle}>
                <SymbolView name="qrcode" size={17} tintColor="#A7F3D0" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.trustTitle}>Vé chuẩn đại lý – Đi ngay không chờ</Text>
                <Text style={styles.trustSub}>Hỗ trợ đối soát mã QR 24/7 trực tiếp tại quầy</Text>
              </View>
            </View>
            <Pressable
              style={styles.trustSupportBtn}
              onPress={() => router.push('/tai-khoan')}
            >
              <Text style={styles.trustSupportBtnText}>Hỗ trợ</Text>
            </Pressable>
          </View>
        </View>

        {/* Global Footer */}
        <GlobalFooter />
      </ScrollView>
    </View>
  );
}

const FEATURED = [
  {
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé buffet trưa dùng trong ngày cho khách đã có vé tham quan hoặc muốn đặt thêm dịch vụ ăn uống.',
    price: '250.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGv8YEDYir1rxZzLIoGF1S1RZJKxLrebwXKeF_zutkrcQNDOauO7va_abxuwwD_OTCoInhvuNxdRbQYSk4dRngwqZH8O4oJM5E9r38Ww_lZdw6mwVDbSBclPLLGQ5L_k2ONef9BcSUv8R4PDwIFXvugFoZoP-mejqlMyZYS5BxKLZ_lm4eKPvGlAyftTqYOUeEdz8v3Q-Bh1MeRFtjlKK5g_zzLC1_d50mLhkAcCNVl-p1nrNwskBnGw',
  },
  {
    name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé cáp treo khứ hồi lên khu vực Đỉnh Vân Sơn, phù hợp khách săn mây và ngắm toàn cảnh Tây Ninh.',
    price: '400.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBuxVWvbjBiwwxVRphX18n1i95In0JNX97veDMLWdEsG0oRdLXA7Gt43J8T8-C5rnR3bNOdB10Xqcz03syqzbzmyPKtSnU76V1i1bjjZRTZN2JMAwDB8obwiunvZLCxeJgN_KlFJepKvszWK4e_EMy-llbJNpYIL8CEFJfBw9LY7YoMaWMFVWDPGtV-YkyOTxYWyskvUFB2Saq0ZtUnCPXRWvFJgvqawM7HZVu5JTt1qHKzfLcq9M8VJg',
  },
  {
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé tuyến cáp treo Chùa Hang cho du khách kết hợp hành hương lễ Phật và chiêm bái cảnh quan hùng vĩ Núi Bà Đen.',
    price: '245.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBP1r1nI7OHn1Je1P6iSjFZC0vsAEwmi7QAjbEYIzyXR2VcBCmxmFgxI8PPSyB6FI-hFizrshC4hJmEh76BCzJWaSZ5qs2pmyYrlqgP9I-Az9ealNVWZNsMtUUWKfzLuXbvKQOP6pnACYzLPoFy30wnrDiXkRbCqtcefRZr50VvA9P9gmvm-2dLm2T3sAuz0BAesErhjnFbAJwbMocrykfizaiK5pj-66EcDwsmigtmdNs8Gf6BUlGelQ',
  },
  {
    name: 'Tour 3 Đảo Nha Trang VIP ngắm san hô',
    location: 'Nha Trang, Khánh Hòa',
    desc: 'Khám phá Hòn Mun, Làng Chài và Bãi Tranh kèm bữa trưa hải sản tươi sống.',
    price: '450.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzHjzUMOeqqzHj81H3SNLia_ugFZzw_hIAN5XIeHFR--kc3f2yC4BpqXBAypam-IFxp50YwO8yftKIjOWjuEYOSTUyJ0uH9ZG3Dep7LLe9xATRVy2-UdLWUvN6LEwPo4iebvP7mEHkx1IlM1uD1WAcBnLNO2Uk7Md88uyrBvCqw-jh-a-x6UikSLrCEOn6w4TIyi1p77QI_5IFDi78wNrb33UMykd_xmGlnFFYxa3m6Vx_vnY5xTbUnQ',
  },
];

const TICKETS = [
  ...FEATURED,
  {
    name: 'Vé Tắm bùn khoáng nóng I-Resort Nha Trang',
    location: 'Nha Trang, Khánh Hòa',
    desc: 'Trải nghiệm ngâm khoáng nóng và bùn khoáng thiên nhiên tốt cho sức khỏe.',
    price: '260.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAA8Uv8nswwLjwwEQON26RB6-oQbi_TqG_IEImeKXfvBsfxX5zP4F0IKPv7Ce80u5Ppbms9YALhNBlXAkwTxqg8Nv5MkpOCRV4wQ9Iuc3UUAYWVbugrQbA7-S_mshFQnRyzmtnWiW0VdhVNUbBSdX_UvSDvb5aJJ2kbqSgGvLK_VdZ8A6PENgbpo_3NDFtem6omeVpx6zQpwIx5HmroBapJh8U8v6bVBblQGbr5gxnMg_gCB34gNDcoHQ',
  },
  {
    name: 'Combo Núi Bà Đen: Cáp treo Đỉnh Vân Sơn + buffet trưa',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Combo ưu đãi cho khách muốn trải nghiệm ngắm cảnh Đỉnh Vân Sơn và dùng buffet trưa tại nhà hàng.',
    price: '550.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
  },
  {
    name: 'Vé tham quan Làng nổi Tân Lập',
    location: 'Mộc Hóa, Long An',
    desc: 'Vé vào cổng khám phá rừng tràm nguyên sinh Tân Lập, tản bộ trên cung đường đan xuyên rừng rợp mát.',
    price: '85.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjkighYpG_LrLjQ61PUillxA-9CqiV88O0Pw1486FdGZOdWKslZZ4J3SZHqYo545GvqRkS1fbJyA8ixJg8WLHkv2Rv6W1rq2vmUFHzQs2sKtftB7eOZPwMLPJ150mVw0hvLP0T25Lb1Wut8AeOGFKzV9SdMxopcgPdwMdGX-ZmkRSzh3j3WJQw-oIsH8JyhokpYwdJXIOh1DPUAc4_Tq31QO4xJaBhx1MNK_xQfVnVUy2EGp6QdpyDxA',
  },
  {
    name: 'Vé chèo thuyền Kayak & Xuồng ba lá Rừng tràm Tân Lập',
    location: 'Mộc Hóa, Long An',
    desc: 'Trải nghiệm chèo kayak hoặc ngồi xuồng ba lá lướt trên mặt nước rừng tràm thanh bình.',
    price: '120.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
  },
  {
    name: 'Vé tham quan Khu du lịch Tràm Chim Đồng Tháp',
    location: 'Tam Nông, Đồng Tháp',
    desc: 'Chiêm ngưỡng hệ sinh thái đất ngập nước quý hiếm với sếu đầu đỏ và thảm thực vật đặc trưng Đồng Tháp Mười.',
    price: '120.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjE11xrEgPVl0sKSOWc72cucCJGrxpa4xwNPhTHJxtTsI5UJiycjD9-0ufyUV_H1sAAjSgqm9wCYujS5_YmjvGzAWXRDjydbjREdvN4RB1uZbu6vTXzZRwZJsvHVbz5XLd3yF95qAzQTYeMonIFNNsV3blGb7TbK25eUaRGKQVFKasZoGqOXZbp0L1cdoX_1y-q2iER6a5LVT2backDHdB5IIMo6QfqbzQIkBPK30fPGKXLxA-FYCsyA',
  },
  {
    name: 'Vé tham quan & Trải nghiệm Đồng Sen Tháp Mười',
    location: 'Tháp Mười, Đồng Tháp',
    desc: 'Check-in cầu gỗ giữa bạt ngàn hoa sen hồng, chèo thuyền hái sen và thưởng thức các món ăn từ sen.',
    price: '80.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFHF8ErsJ_s8qgcwRohNXlIBpRLRCDLHaOHBkAWPH503Yc1EvQtOwca06hCMby8KRlHW5pI3LDUDBaDijFOjxqJ9wzOBa-h1nHbFJo73HSFD_pVnfXVjb9_Mh9yaCewyocdgtetta0cQ4UTa74tycWNIQCBUev62FWlMEVMtUq0zavNNnXM3-j5mT3HADgoyxBE1b2z57gDb7XYfTZzNcsBWRKREaCc_MwrCT9UAyLx9nBtM7s86U1A',
  },
  {
    name: 'Vé chèo xuồng & Tour miệt vườn Bến Tre',
    location: 'Châu Thành, Bến Tre',
    desc: 'Đi xuồng ba lá len lỏi trong rạch dừa nước, thưởng thức trà mật ong và kẹo dừa nóng tại lò.',
    price: '150.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjrcfNU9N0GRT3-AUJmLvX3H_Edrw-JiIhUegf7VWaBgAHK_vNhDSu98iE9IwFLdY7AmbVvvOn8ji-pxElGiC8MjvZVd_d9RvHSskHujUzhbDVBNn3OpcLtnNvr0jc-9BCPUYYvy416os10xFkh_BtQl_8yrw6nNsLHRgnu1Nj1MIUey-k2m8p5KEPZUgLVHnrC8JXFV74al6K5jjXYOGOC34o7xcxfrkRrsCvMGXFHE0emA_rLwaIBQ',
  },
  {
    name: 'Vé Khu du lịch sinh thái Lan Vương Bến Tre',
    location: 'TP. Bến Tre, Bến Tre',
    desc: 'Vui chơi tát mương bắt cá, chèo xuồng ba lá, đu dây giăng và thưởng thức ẩm thực dân dã Nam Bộ.',
    price: '100.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmV0Qj6Ln0Aq34P5R3c1dBEgTgrA0-xEWyN-eZJDInuVVQLX83mx9BcHmFCmRNyWtVbRy_FsYV5pus8EN4af2_Y49Y7rD0XF3ls-K7InReje95_M_9PiqZAfwsAdMTocTNnhBOO4Ll_SYeAIeeKLoyOVC66M-7gkrGkIIRce20en1D3EJexzlely7gfPcPuyUoli5emmo-8o5H0un3klDhI-ATbuxm_Us83vdsLmXaB9aO9QBJsIYpqg',
  },
  {
    name: 'Vé tắc ráng tham quan Rừng tràm Trà Sư',
    location: 'Tịnh Biên, An Giang',
    desc: 'Trải nghiệm tắc ráng lướt trên thảm bèo cám xanh mướt ngắm các loài chim nước quý hiếm tại Trà Sư.',
    price: '100.000đ',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Vé Cáp treo Núi Cấm An Giang (Khu du lịch Lâm Viên)',
    location: 'Tịnh Biên, An Giang',
    desc: 'Cáp treo lên đỉnh Núi Cấm viếng tượng Phật Di Lặc khổng lồ trên đỉnh núi và ngắm hồ Thủy Liêm.',
    price: '200.000đ',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Vé Cáp treo Hòn Thơm Phú Quốc (Sun World)',
    location: 'Phú Quốc, Kiên Giang',
    desc: 'Cáp treo 3 dây vượt biển dài nhất thế giới ngắm nhìn toàn cảnh quần đảo An Thới tuyệt đẹp.',
    price: '650.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
  },
  {
    name: 'Vé Vinpearl Safari Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    desc: 'Công viên chăm sóc và bảo tồn động vật bán hoang dã lớn nhất Việt Nam.',
    price: '650.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAGzag4JWCmqBtN4mYGy6MERp-frzyeBC6nRoGOAPRwvo_KRQv212W5LFMkH4h-aNMgVbvRcmo8YRhRZ0xjAevClzlZ2h59cQeAt_-ciE-QVymPMePoC1eTnJmazNG68usffuP6JhObJw0K-OPnLmNotdYxlLwsizfiP-xNl_jtEmdYKUE-iVJqyk2pdB5IxCECOQwlcjkzH29D3-Kqy2z0oEo2wI1YxaRAjBBi4fQOaqWRaGrdT_Q',
  },
  {
    name: 'Vé Show Tinh Hoa Việt Nam & Grand World Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    desc: 'Mãn nhãn với đại cảnh nghệ thuật sân khấu mặt nước hoành tráng tái hiện lịch sử ngàn năm.',
    price: '250.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
  },
  {
    name: 'Vé Sun World Ba Na Hills',
    location: 'Đà Nẵng',
    desc: 'Trải nghiệm cáp treo dài nhất thế giới và khám phá Làng Pháp, Cầu Vàng nổi tiếng.',
    price: '900.000đ',
    image: 'https://tixgo.vn/sites/default/files/ve-sunworld-ba-na-hills-ava.jpg',
  },
  {
    name: 'Vé Công viên Châu Á Asia Park',
    location: 'Đà Nẵng',
    desc: 'Vui chơi thoả thích với hàng loạt trò chơi cảm giác mạnh và ngắm vòng quay Sun Wheel.',
    price: '200.000đ',
    image: 'https://hoangphuan.com/wp-content/uploads/2024/05/otv8vrjkqxriwlvbld8o.jpg',
  },
  {
    name: 'Vé Suối khoáng nóng Núi Thần Tài',
    location: 'Đà Nẵng',
    desc: 'Thư giãn ngâm khoáng nóng tự nhiên giữa cảnh sắc thiên nhiên hùng vĩ Bà Nà.',
    price: '450.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpdnq32CxUpTr_pSlBgV5-jfSeK_Q2H14FGBJ9aSfxvNintVaIatDLrTyN5abKcqlW9OYN9rNk7zVMFTBjHwiHwEOXSRnfLlbt_eJ5PxYK4EIJ7AL7pkvzYVrK7PAW8kZf_xT9ifr9MeCVD6I6GCmhTuEuQOZlWmv7GoSR9lmx7aekv8lVxqX2uUksmK4tbS2Zaj9_y3gENTL3Vr05K_BO8EHjX4xokTVc4UpCf9IMc1ABZ0QjJOc',
  },
  {
    name: 'Vé Sun World Hạ Long Complex',
    location: 'Hạ Long, Quảng Ninh',
    desc: 'Khám phá Công viên Rồng, Công viên Nước Vịnh Lốc Xoáy và Cáp treo Nữ Hoàng.',
    price: '350.000đ',
    image:
      'https://res.klook.com/image/upload/w_1265,h_791,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/sytsmedhoitvwcasveut.webp',
  },
  {
    name: 'Vé Tắm suối khoáng nóng Yoko Onsen Quang Hanh',
    location: 'Hạ Long, Quảng Ninh',
    desc: 'Thư giãn trong làn nước khoáng nóng đậm chất Nhật Bản tại thung lũng Quang Hanh.',
    price: '1.200.000đ',
    image: 'https://tanthoidai.com.vn/images/products/2020/11/06/132491321181670064.jpeg',
  },
  {
    name: 'Vé Du thuyền tham quan Vịnh Hạ Long',
    location: 'Hạ Long, Quảng Ninh',
    desc: 'Hành trình 4 tiếng chiêm ngưỡng kỳ quan thiên nhiên thế giới Vịnh Hạ Long.',
    price: '550.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
  },
  {
    name: 'Tour Săn Mây Cầu Đất Đà Lạt 1 ngày',
    location: 'Đà Lạt, Lâm Đồng',
    desc: 'Đón bình minh trên đồi chè Cầu Đất và săn biển mây bồng bềnh tuyệt đẹp.',
    price: '280.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
  },
  {
    name: 'Vé Máng trượt Datanla New Alpine Coaster',
    location: 'Đà Lạt, Lâm Đồng',
    desc: 'Tuyến máng trượt băng rừng dài nhất Đông Nam Á dẫn xuống thác Datanla tuyệt đẹp.',
    price: '250.000đ',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Vé Cáp treo Đồi Robin - Thiền Viện Trúc Lâm',
    location: 'Đà Lạt, Lâm Đồng',
    desc: 'Ngắm nhìn toàn cảnh thành phố sương mù và rừng thông bạt ngàn từ trên cao.',
    price: '120.000đ',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  fullCardImg: {
    width: '100%',
    height: '100%',
  },

  /* ========================================================================= */
  /* TopBar & Header */
  /* ========================================================================= */
  headerContainer: {
    backgroundColor: '#0B4A37',
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  headerSubText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5722',
    borderWidth: 1,
    borderColor: '#0B4A37',
  },

  /* ========================================================================= */
  /* Search Input Box */
  /* ========================================================================= */
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    zIndex: 20,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInputField: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  searchActionBtn: {
    backgroundColor: '#0B4A37',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  searchActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  suggestionsBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    marginTop: 6,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  suggestionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  suggestionSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },

  /* ========================================================================= */
  /* Hero Highlight Card (Carousel Núi Bà Đen) */
  /* ========================================================================= */
  heroSectionWrapper: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  heroCard: {
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 5,
  },
  heroCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroCardGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  heroCardGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 230,
    backgroundColor: 'rgba(5, 23, 17, 0.88)',
  },
  heroTopBadges: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeOrange: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  heroBadgeOrangeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  heroBadgeGlass: {
    backgroundColor: 'rgba(6, 53, 39, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  heroBadgeGlassText: {
    color: '#6EE7B7',
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  heroRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    gap: 4,
  },
  heroRatingStar: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: 'bold',
  },
  heroRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroBottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 2,
  },
  heroCardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 4,
  },
  heroCardDesc: {
    color: 'rgba(241, 245, 249, 0.85)',
    fontSize: 11.5,
    lineHeight: 17,
    marginBottom: 8,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 8,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMetaText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  heroMetaBullet: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  heroLivePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  heroLiveAvailText: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '700',
  },
  heroActionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroPriceLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  heroPriceValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  heroPricePrefix: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  heroPriceVal: {
    color: '#FBBF24',
    fontSize: 20,
    fontWeight: '900',
  },
  heroCtaBtn: {
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  heroCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  heroDot: {
    width: 6,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroDotActive: {
    width: 20,
    backgroundColor: '#FF5722',
  },

  /* ========================================================================= */
  /* Quick City Filter (Khám phá nhanh) */
  /* ========================================================================= */
  cityFilterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cityFilterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityFilterHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cityCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B4A37',
  },
  cityChipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  cityChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cityChipActive: {
    backgroundColor: '#0B4A37',
    borderColor: '#0B4A37',
  },
  cityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  cityChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* ========================================================================= */
  /* Coupon Voucher Banner */
  /* ========================================================================= */
  voucherSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  voucherCard: {
    backgroundColor: '#FF5722',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  voucherCutoutLeft: {
    position: 'absolute',
    left: -8,
    top: '50%',
    marginTop: -10,
    width: 16,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F4F7F5',
    zIndex: 5,
  },
  voucherCutoutRight: {
    position: 'absolute',
    right: -8,
    top: '50%',
    marginTop: -10,
    width: 16,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F4F7F5',
    zIndex: 5,
  },
  voucherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
  },
  voucherLeft: {
    flex: 1,
    marginRight: 10,
  },
  voucherBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  voucherTagText: {
    color: '#FFEDD5',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  voucherBullet: {
    color: '#FFEDD5',
    fontSize: 10,
  },
  voucherStarText: {
    color: '#FEF08A',
    fontSize: 10,
    fontWeight: '700',
  },
  voucherTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 2,
  },
  voucherSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 6,
  },
  voucherCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voucherCodeBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  voucherCodeText: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  voucherDetailsLink: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  voucherClaimBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  voucherClaimBtnSaved: {
    backgroundColor: '#ECFDF5',
  },
  voucherClaimBtnText: {
    color: '#FF5722',
    fontWeight: '900',
    fontSize: 12,
  },
  voucherClaimBtnTextSaved: {
    color: '#0B4A37',
  },

  /* ========================================================================= */
  /* All Tickets List (Horizontal Card Layout) */
  /* ========================================================================= */
  ticketsListSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  listSubTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF5722',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  listMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  countBadge: {
    backgroundColor: '#EAF6F0',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countBadgeText: {
    color: '#0B4A37',
    fontSize: 11,
    fontWeight: '700',
  },
  horizontalCardGrid: {
    gap: 12,
  },
  horizontalTicketCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  ticketThumbBox: {
    width: 112,
    height: 112,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  ticketThumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbRatingPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  thumbStar: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: 'bold',
  },
  thumbRatingVal: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  thumbCategoryBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(11, 74, 55, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  thumbCategoryText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  ticketRightCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  ticketCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 4,
  },
  ticketCardLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ticketCardLocText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  ticketCardPerksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  perkChip: {
    backgroundColor: '#EAF6F0',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  perkChipText: {
    color: '#0B4A37',
    fontSize: 9,
    fontWeight: '700',
  },
  liveAvailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveAvailDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  liveAvailText: {
    color: '#059669',
    fontSize: 9.5,
    fontWeight: '700',
  },
  ticketCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
    marginTop: 6,
  },
  pricePrefix: {
    fontSize: 9.5,
    color: '#64748B',
  },
  priceVal: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FF5722',
  },
  bookTicketBtn: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookTicketBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyStateBox: {
    padding: 36,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  resetFilterBtn: {
    backgroundColor: '#0B4A37',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resetFilterBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  /* ========================================================================= */
  /* Destination Inspiration Section */
  /* ========================================================================= */
  destinationSection: {
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B4A37',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSeeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionSeeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B4A37',
  },
  destinationGridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  destLeftCard: {
    flex: 1,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  destOverlayDark: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  destTagBadgeTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(5, 150, 105, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  destTagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  destTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  destLeftBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  destLocationPin: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  destHeroTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  destHeroDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 6,
  },
  destLinkYellow: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '800',
  },
  destRightCol: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
  destRightCard: {
    flex: 1,
    height: 120,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  destMiniBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  destMiniBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  destMiniBottom: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  destMiniTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  destMiniSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9,
  },

  /* ========================================================================= */
  /* Trust Banner */
  /* ========================================================================= */
  trustBannerWrapper: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  trustBanner: {
    backgroundColor: '#EAF6F0',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trustLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  trustIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0B4A37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  trustSub: {
    fontSize: 10,
    color: '#047857',
    marginTop: 1,
  },
  trustSupportBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
  },
  trustSupportBtnText: {
    color: '#0B4A37',
    fontSize: 11,
    fontWeight: '800',
  },
});
