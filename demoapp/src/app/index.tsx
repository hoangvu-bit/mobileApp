import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Keyboard,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalFooter from '../components/global-footer';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [savedCoupons, setSavedCoupons] = useState<Record<string, boolean>>({});

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 13, minutes: 5, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSaveCoupon = (code: string) => {
    setSavedCoupons(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return TOP_SERVICES;
    const q = searchQuery.toLowerCase().trim();
    return TOP_SERVICES.filter(
      item => item.name.toLowerCase().includes(q) || item.location.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return TRENDING_DESTINATIONS;
    const q = searchQuery.toLowerCase().trim();
    return TRENDING_DESTINATIONS.filter(
      item => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectService = (item: (typeof TOP_SERVICES)[0]) => {
    setShowDropdown(false);
    Keyboard.dismiss();
    router.push({
      pathname: '/chi-tiet-ve',
      params: {
        name: item.name,
        price: item.price,
        location: item.location,
        image: item.image,
        desc: item.desc,
      },
    });
  };

  const handleSelectDestination = (dest: { name: string }) => {
    setShowDropdown(false);
    Keyboard.dismiss();
    router.push({
      pathname: '/ve-du-lich',
      params: {
        location: dest.name,
      },
    });
  };

  const handleSearchSubmit = () => {
    setShowDropdown(false);
    Keyboard.dismiss();
    if (searchQuery.trim()) {
      router.push({ pathname: '/ve-du-lich', params: { search: searchQuery.trim() } } as any);
    } else {
      router.push('/ve-du-lich');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#073B2E" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!showDropdown}
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        {/* Dismiss Backdrop when dropdown is open */}
        {showDropdown && (
          <Pressable
            style={styles.outsideBackdrop}
            onPress={() => {
              setShowDropdown(false);
              Keyboard.dismiss();
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* BEGIN: TopAppBanner (Smart Acquisition Banner) */}
        {/* ========================================================================= */}
        {showTopBanner && (
          <View style={[styles.topAppBanner, { paddingTop: Math.max(insets.top, 8) }]}>
            <View style={styles.bannerLeft}>
              <View style={styles.bannerIconBadge}>
                <Text style={styles.bannerIconText}>i</Text>
              </View>
              <View>
                <View style={styles.bannerTitleRow}>
                  <Text style={styles.bannerTitleText}>igovi trên điện thoại</Text>
                  <View style={styles.bannerOfferTag}>
                    <Text style={styles.bannerOfferTagText}>Ưu đãi</Text>
                  </View>
                </View>
                <Text style={styles.bannerSubtitleText}>Vé điện tử QR quét vào cổng tức thì</Text>
              </View>
            </View>
            <View style={styles.bannerRight}>
              <Pressable
                style={styles.bannerOpenBtn}
                onPress={() => router.push('/ve-du-lich')}
              >
                <Text style={styles.bannerOpenBtnText}>Mở App</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowTopBanner(false)}
                hitSlop={10}
                style={styles.bannerCloseBtn}
              >
                <Text style={styles.bannerCloseText}>✕</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* BEGIN: MainHeader (Deep Emerald Header with Search & Quick Profile) */}
        {/* ========================================================================= */}
        <View style={styles.mainHeader}>
          {/* Top Brand & Actions Row */}
          <View style={styles.headerTopRow}>
            <View style={styles.brandTitleRow}>
              <Text style={styles.logoText}>igovi</Text>
              <View style={styles.logoDot} />
              <View style={styles.countryTag}>
                <Text style={styles.countryTagText}>VIỆT NAM</Text>
              </View>
            </View>

            <View style={styles.headerActionsRow}>
              <Pressable
                style={styles.bellBtn}
                onPress={() => router.push('/don-hang-ve')}
                hitSlop={6}
              >
                <SymbolView name="bell" size={17} tintColor="#FFFFFF" />
                <View style={styles.bellAlertDot} />
              </Pressable>

              <Pressable
                style={styles.avatarCircleRing}
                onPress={() => router.push('/tai-khoan')}
                hitSlop={6}
              >
                <Text style={styles.avatarText}>TL</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.sloganText}>Đi để yêu Việt Nam hơn</Text>

          {/* Search Bar with Circular Action Button */}
          <View style={[styles.searchPillWrapper, showDropdown && { zIndex: 30 }]}>
            <Pressable
              style={styles.searchPillBar}
              onPress={() => {
                setShowDropdown(true);
                inputRef.current?.focus();
              }}
            >
              <View style={styles.searchGlassIcon}>
                <SymbolView name="magnifyingglass" size={17} tintColor="#94A3B8" />
              </View>

              <TextInput
                ref={inputRef}
                style={styles.searchInputField}
                placeholder="Tìm điểm đến, vé tour, cáp treo..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (!showDropdown) setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onSubmitEditing={handleSearchSubmit}
              />

              {searchQuery.length > 0 && (
                <Pressable
                  style={styles.searchClearBtn}
                  onPress={() => {
                    setSearchQuery('');
                    inputRef.current?.focus();
                  }}
                  hitSlop={8}
                >
                  <Text style={styles.searchClearText}>✕</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.searchSubmitCircle}
                onPress={() => {
                  if (searchQuery.trim()) {
                    handleSearchSubmit();
                  } else {
                    setShowDropdown(!showDropdown);
                    if (!showDropdown) inputRef.current?.focus();
                  }
                }}
              >
                <SymbolView name="arrow.right" size={14} tintColor="#FFFFFF" />
              </Pressable>
            </Pressable>

            {/* Dropdown Card */}
            {showDropdown && (
              <View style={styles.dropdownCard}>
                <View style={styles.dropdownTopBar}>
                  <View style={styles.dropdownIndicator} />
                  <Pressable
                    onPress={() => {
                      setShowDropdown(false);
                      Keyboard.dismiss();
                    }}
                    hitSlop={10}
                    style={styles.collapseBtn}
                  >
                    <Text style={styles.collapseBtnText}>Thu gọn ▲</Text>
                  </Pressable>
                </View>

                <ScrollView
                  style={styles.dropdownInnerScroll}
                  contentContainerStyle={styles.dropdownInnerContent}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Top Dịch Vụ Nổi Bật */}
                  <View style={styles.dropdownSection}>
                    <View style={styles.dropdownSectionHeader}>
                      <View style={styles.sectionHeaderLeft}>
                        <Text style={styles.fireEmoji}>🔥</Text>
                        <Text style={styles.dropdownSectionTitle}>Top dịch vụ nổi bật</Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          setShowDropdown(false);
                          Keyboard.dismiss();
                          router.push('/ve-du-lich');
                        }}
                        hitSlop={8}
                      >
                        <Text style={styles.seeAllOrange}>Xem tất cả →</Text>
                      </Pressable>
                    </View>

                    {filteredServices.length > 0 ? (
                      filteredServices.map((item) => (
                        <Pressable
                          key={item.id}
                          style={({ pressed }) => [
                            styles.serviceItemRow,
                            pressed && { backgroundColor: '#F8FAFC' },
                          ]}
                          onPress={() => handleSelectService(item)}
                        >
                          <View style={styles.thumbContainer}>
                            <Image source={{ uri: item.image }} style={styles.serviceThumb} contentFit="cover" />
                            <View style={styles.rankBadgeOrange}>
                              <Text style={styles.rankBadgeText}>{item.rank}</Text>
                            </View>
                          </View>
                          <View style={styles.serviceInfoCol}>
                            <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.serviceSub} numberOfLines={1}>{item.category} · {item.location}</Text>
                          </View>
                          <View style={styles.servicePriceCol}>
                            <Text style={styles.servicePrice}>Từ {item.price}</Text>
                          </View>
                        </Pressable>
                      ))
                    ) : (
                      <Text style={styles.emptyResultText}>Không tìm thấy dịch vụ phù hợp</Text>
                    )}
                  </View>

                  <View style={styles.dropdownDivider} />

                  {/* Điểm Đến Theo Xu Hướng */}
                  <View style={styles.dropdownSection}>
                    <View style={styles.dropdownSectionHeader}>
                      <View style={styles.sectionHeaderLeft}>
                        <SymbolView name="mappin.circle.fill" size={17} tintColor="#0B4736" style={{ marginRight: 6 }} />
                        <Text style={styles.dropdownSectionTitle}>Điểm đến theo xu hướng</Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          setShowDropdown(false);
                          Keyboard.dismiss();
                          router.push('/ban-do-so');
                        }}
                        hitSlop={8}
                      >
                        <Text style={styles.seeAllGreen}>Bản đồ →</Text>
                      </Pressable>
                    </View>

                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map((dest) => (
                        <Pressable
                          key={dest.id}
                          style={({ pressed }) => [
                            styles.serviceItemRow,
                            pressed && { backgroundColor: '#F8FAFC' },
                          ]}
                          onPress={() => handleSelectDestination(dest)}
                        >
                          <View style={styles.thumbContainer}>
                            <Image source={{ uri: dest.image }} style={styles.serviceThumb} contentFit="cover" />
                            <View style={styles.rankBadgeGreen}>
                              <Text style={styles.rankBadgeText}>{dest.rank}</Text>
                            </View>
                          </View>
                          <View style={styles.serviceInfoCol}>
                            <Text style={styles.serviceName} numberOfLines={1}>{dest.name}</Text>
                            <Text style={styles.serviceSub} numberOfLines={1}>{dest.desc}</Text>
                          </View>
                          <SymbolView name="chevron.right" size={14} tintColor="#CBD5E1" />
                        </Pressable>
                      ))
                    ) : (
                      <Text style={styles.emptyResultText}>Không tìm thấy điểm đến phù hợp</Text>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: QuickServicesGrid (5 Squircle Categories -mt-8 from Stitch) */}
        {/* ========================================================================= */}
        <View style={styles.quickServicesWrapper}>
          <View style={styles.quickServicesCard}>
            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/ve-du-lich')}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                <Text style={styles.categoryEmoji}>🎟️</Text>
              </View>
              <Text style={styles.categoryLabel}>Vé du lịch</Text>
            </Pressable>

            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/luu-tru')}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: '#F0FDFA', borderColor: '#99F6E4' }]}>
                <Text style={styles.categoryEmoji}>🏨</Text>
              </View>
              <Text style={styles.categoryLabel}>Lưu trú</Text>
            </Pressable>

            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/tour')}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
                <Text style={styles.categoryEmoji}>🧭</Text>
              </View>
              <Text style={styles.categoryLabel}>Tour</Text>
            </Pressable>

            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/khu-sinh-thai')}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                <Text style={styles.categoryEmoji}>🌿</Text>
              </View>
              <Text style={styles.categoryLabel}>Sinh thái</Text>
            </Pressable>

            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/am-thuc')}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }]}>
                <Text style={styles.categoryEmoji}>🍜</Text>
              </View>
              <Text style={styles.categoryLabel}>Ẩm thực</Text>
            </Pressable>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: ExclusiveOffers (Đặc quyền igovi - Ưu đãi dành cho bạn) */}
        {/* ========================================================================= */}
        <View style={styles.offersSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubTagEmerald}>ĐẶC QUYỀN IGOVI</Text>
              <Text style={styles.sectionTitleBlack}>Ưu đãi dành cho bạn</Text>
            </View>
            <Pressable
              style={styles.seeAllBtnRow}
              onPress={() => router.push('/uu-dai')}
              hitSlop={8}
            >
              <Text style={styles.seeAllEmeraldText}>Xem tất cả</Text>
              <SymbolView name="chevron.right" size={13} tintColor="#059669" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollList}
          >
            {/* Promo Card 1: Chào bạn mới */}
            <View style={[styles.promoCard, { backgroundColor: '#FF5E1E' }]}>
              <View style={styles.promoDecorativeCircle} />
              <View>
                <View style={styles.promoTagBadge}>
                  <Text style={styles.promoTagBadgeText}>CHÀO BẠN MỚI</Text>
                </View>
                <Text style={styles.promoCardTitle}>Ưu đãi khách mới</Text>
                <Text style={styles.promoCardSub} numberOfLines={1}>
                  Giảm 15% cho đơn tour đầu tiên
                </Text>
              </View>

              <View style={styles.promoCardBottom}>
                <Text style={styles.promoCodeLine}>
                  Mã: <Text style={styles.promoCodeMono}>IGOVI15</Text>
                </Text>
                <Pressable
                  style={[styles.promoClaimBtn, savedCoupons['IGOVI15'] && styles.promoClaimBtnActive]}
                  onPress={() => toggleSaveCoupon('IGOVI15')}
                >
                  <Text style={[styles.promoClaimBtnText, savedCoupons['IGOVI15'] && { color: '#0B4736' }]}>
                    {savedCoupons['IGOVI15'] ? 'Đã lưu' : 'Lưu mã'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Promo Card 2: Cuối tuần rực rỡ */}
            <View style={[styles.promoCard, { backgroundColor: '#0D9488' }]}>
              <View style={styles.promoDecorativeCircle} />
              <View>
                <View style={styles.promoTagBadge}>
                  <Text style={styles.promoTagBadgeText}>CUỐI TUẦN RỰC RỠ</Text>
                </View>
                <Text style={styles.promoCardTitle}>Săn deal chớp nhoáng</Text>
                <Text style={styles.promoCardSub} numberOfLines={1}>
                  Giảm đến 80.000đ vé cáp treo & buffet
                </Text>
              </View>

              <View style={styles.promoCardBottom}>
                <Text style={styles.promoCodeLine}>Áp dụng T7 & CN</Text>
                <Pressable
                  style={styles.promoClaimBtn}
                  onPress={() => router.push('/ve-du-lich')}
                >
                  <Text style={[styles.promoClaimBtnText, { color: '#047857' }]}>Khám phá</Text>
                </Pressable>
              </View>
            </View>

            {/* Promo Card 3: Đại tiệc buffet */}
            <View style={[styles.promoCard, { backgroundColor: '#7C3AED' }]}>
              <View style={styles.promoDecorativeCircle} />
              <View>
                <View style={styles.promoTagBadge}>
                  <Text style={styles.promoTagBadgeText}>HỘI VIÊN THÂN THIẾT</Text>
                </View>
                <Text style={styles.promoCardTitle}>Đại tiệc vé buffet</Text>
                <Text style={styles.promoCardSub} numberOfLines={1}>
                  Mua 3 vé buffet tặng 1 vé Chùa Hang
                </Text>
              </View>

              <View style={styles.promoCardBottom}>
                <Text style={styles.promoCodeLine}>
                  Mã: <Text style={styles.promoCodeMono}>BUFFETVANSON</Text>
                </Text>
                <Pressable
                  style={[styles.promoClaimBtn, savedCoupons['BUFFETVANSON'] && styles.promoClaimBtnActive]}
                  onPress={() => toggleSaveCoupon('BUFFETVANSON')}
                >
                  <Text style={[styles.promoClaimBtnText, savedCoupons['BUFFETVANSON'] && { color: '#0B4736' }]}>
                    {savedCoupons['BUFFETVANSON'] ? 'Đã lưu' : 'Lưu mã'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: FlashSaleSection (Giá tốt trong ngày - Ưu đãi chớp nhoáng) */}
        {/* ========================================================================= */}
        <View style={styles.flashSaleContainer}>
          <View style={styles.flashSaleCard}>
            {/* Header Flash Sale */}
            <View style={styles.flashSaleTopRow}>
              <View style={styles.flashSaleTagRow}>
                <Text style={styles.flashSaleBolt}>⚡</Text>
                <Text style={styles.flashSaleTagText}>GIÁ TỐT TRONG NGÀY</Text>
              </View>
              <Pressable
                onPress={() => router.push('/uu-dai')}
                hitSlop={8}
              >
                <Text style={styles.flashSaleSeeAll}>Xem tất cả →</Text>
              </Pressable>
            </View>

            <Text style={styles.flashSaleTitle}>Ưu đãi chớp nhoáng, đặt nhanh giá hời</Text>
            <Text style={styles.flashSaleSub}>
              Giá, mức giảm và điều kiện hiển thị rõ ràng trước khi đặt.
            </Text>

            {/* Countdown timer pill */}
            <View style={styles.countdownPill}>
              <Text style={styles.countdownLabel}>KẾT THÚC SAU</Text>
              <View style={styles.countdownDigitRow}>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownNum}>
                    {String(timeLeft.hours).padStart(2, '0')}
                  </Text>
                </View>
                <Text style={styles.countdownColon}>:</Text>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownNum}>
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </Text>
                </View>
                <Text style={styles.countdownColon}>:</Text>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownNum}>
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Flash Sale Horizontal Cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flashSaleCardsScroll}
            >
              {FLASH_SALE_ITEMS.map((item, idx) => (
                <View key={idx} style={styles.flashItemCard}>
                  <View style={styles.flashItemThumbWrap}>
                    <Image source={{ uri: item.image }} style={styles.flashItemImage} contentFit="cover" />
                    <View style={styles.flashBadgeCategory}>
                      <Text style={styles.flashBadgeCategoryText}>{item.category}</Text>
                    </View>
                    <View style={styles.flashBadgeDiscount}>
                      <Text style={styles.flashBadgeDiscountText}>{item.discount}</Text>
                    </View>
                    <View style={styles.flashConfirmBadge}>
                      <SymbolView name="checkmark" size={10} tintColor="#34D399" />
                      <Text style={styles.flashConfirmText}>Xác nhận tức thì</Text>
                    </View>
                  </View>

                  <View style={styles.flashItemBody}>
                    <Text style={styles.flashItemLocation}>{item.location}</Text>
                    <Text style={styles.flashItemName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <View style={styles.flashPerksRow}>
                      {item.perks.map((p, pIdx) => (
                        <View key={pIdx} style={styles.flashPerkPill}>
                          <Text style={styles.flashPerkText}>{p}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.flashItemFooter}>
                      <View>
                        <Text style={styles.flashOldPrice}>{item.oldPrice}</Text>
                        <Text style={styles.flashNewPrice}>{item.price}</Text>
                      </View>
                      <Pressable
                        style={styles.flashBookBtn}
                        onPress={() => {
                          if (item.category === 'Lưu trú') {
                            router.push('/luu-tru');
                          } else {
                            router.push({
                              pathname: '/chi-tiet-ve',
                              params: {
                                name: item.name,
                                price: item.price,
                                location: item.location,
                                image: item.image,
                                desc: item.name,
                              },
                            });
                          }
                        }}
                      >
                        <Text style={styles.flashBookBtnText}>Đặt ngay</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: RecommendedExperiences (Vé & Dịch vụ nổi bật - Gợi ý để bắt đầu) */}
        {/* ========================================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubTagEmerald}>VÉ & DỊCH VỤ NỔI BẬT</Text>
              <Text style={styles.sectionTitleBlack}>Gợi ý để bắt đầu</Text>
            </View>
            <Pressable
              style={styles.seeAllBtnRow}
              onPress={() => router.push('/ve-du-lich')}
              hitSlop={8}
            >
              <Text style={styles.seeAllEmeraldText}>Khám phá</Text>
              <SymbolView name="chevron.right" size={13} tintColor="#059669" />
            </Pressable>
          </View>

          {/* 2-Column Cards Grid */}
          <View style={styles.twoColumnGrid}>
            {/* Card 1: Buffet Núi Bà Đen */}
            <Pressable
              style={styles.ticketGridCard}
              onPress={() => handleSelectService(TOP_SERVICES[0])}
            >
              <View style={styles.ticketGridThumbBox}>
                <Image
                  source={{ uri: TOP_SERVICES[0].image }}
                  style={styles.fullCardImg}
                  contentFit="cover"
                />
                <View style={styles.ticketBadgeGreen}>
                  <Text style={styles.ticketBadgeGreenText}>Vé QR tức thì</Text>
                </View>
                <View style={styles.ratingBadgePill}>
                  <Text style={styles.ratingBadgeText}>★ 4.9</Text>
                </View>
              </View>

              <View style={styles.ticketGridContent}>
                <Text style={styles.ticketGridProv}>Tây Ninh</Text>
                <Text style={styles.ticketGridTitle} numberOfLines={2}>
                  Buffet trưa Vân Sơn Núi Bà Đen đỉnh núi
                </Text>

                <View style={styles.ticketGridPriceRow}>
                  <Text style={styles.ticketGridPricePrefix}>Từ</Text>
                  <Text style={styles.ticketGridPriceVal}>250.000đ</Text>
                </View>
                <Text style={styles.ticketPerkTag}>✓ Miễn phí hủy 24h</Text>
              </View>
            </Pressable>

            {/* Card 2: Cáp treo Chùa Hang */}
            <Pressable
              style={styles.ticketGridCard}
              onPress={() => handleSelectService(TOP_SERVICES[1])}
            >
              <View style={styles.ticketGridThumbBox}>
                <Image
                  source={{ uri: TOP_SERVICES[1].image }}
                  style={styles.fullCardImg}
                  contentFit="cover"
                />
                <View style={styles.ticketBadgeOrange}>
                  <Text style={styles.ticketBadgeOrangeText}>Bán chạy</Text>
                </View>
                <View style={styles.ratingBadgePill}>
                  <Text style={styles.ratingBadgeText}>★ 4.8</Text>
                </View>
              </View>

              <View style={styles.ticketGridContent}>
                <Text style={styles.ticketGridProv}>Tây Ninh</Text>
                <Text style={styles.ticketGridTitle} numberOfLines={2}>
                  Vé cáp treo Chùa Hang Tuyến Tâm Linh
                </Text>

                <View style={styles.ticketGridPriceRow}>
                  <Text style={styles.ticketGridPricePrefix}>Từ</Text>
                  <Text style={styles.ticketGridPriceVal}>245.000đ</Text>
                </View>
                <Text style={styles.ticketPerkTag}>✓ Xác nhận tức thì</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: Hotels & Homestays (Khách sạn & Homestay dành cho bạn) */}
        {/* ========================================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubTagEmerald}>KHÁM PHÁ THÊM</Text>
              <Text style={styles.sectionTitleBlack}>Khách sạn & Homestay dành cho bạn</Text>
            </View>
            <Pressable
              style={styles.seeAllBtnRow}
              onPress={() => router.push('/luu-tru')}
              hitSlop={8}
            >
              <Text style={styles.seeAllEmeraldText}>Xem tất cả</Text>
              <SymbolView name="chevron.right" size={13} tintColor="#059669" />
            </Pressable>
          </View>
          <Text style={styles.sectionSublead}>
            Tìm chỗ ở phù hợp và kiểm tra giá phòng trực tuyến trước khi đặt.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollList}
          >
            {HOTEL_ITEMS.map((hotel, idx) => (
              <View key={idx} style={styles.hotelCardItem}>
                <View style={styles.hotelThumbWrap}>
                  <Image source={{ uri: hotel.image }} style={styles.fullCardImg} contentFit="cover" />
                  <View style={styles.hotelCategoryBadge}>
                    <Text style={styles.hotelCategoryText}>Lưu trú</Text>
                  </View>
                  {hotel.discount && (
                    <View style={styles.hotelDiscountBadge}>
                      <Text style={styles.hotelDiscountText}>{hotel.discount}</Text>
                    </View>
                  )}
                  <View style={styles.hotelInstantBadge}>
                    <SymbolView name="checkmark" size={9} tintColor="#34D399" />
                    <Text style={styles.hotelInstantText}>Xác nhận tức thì</Text>
                  </View>
                </View>

                <View style={styles.hotelBody}>
                  <Text style={styles.hotelLocText}>{hotel.location}</Text>
                  <Text style={styles.hotelTitleText} numberOfLines={1}>{hotel.name}</Text>

                  <View style={styles.hotelAmenitiesRow}>
                    {hotel.amenities.map((am, aIdx) => (
                      <View key={aIdx} style={styles.hotelAmenityPill}>
                        <Text style={styles.hotelAmenityText}>{am}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.hotelVerifiedText}>✓ Đối tác đã xác minh</Text>

                  <View style={styles.hotelFooterRow}>
                    <View>
                      {hotel.oldPrice && (
                        <Text style={styles.hotelOldPrice}>{hotel.oldPrice}</Text>
                      )}
                      <Text style={styles.hotelPriceVal}>{hotel.price}</Text>
                    </View>
                    <Pressable
                      style={styles.hotelViewRoomBtn}
                      onPress={() => router.push('/luu-tru')}
                    >
                      <Text style={styles.hotelViewRoomText}>Xem phòng</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: TravelersFavorites (Lựa chọn yêu thích của du khách) */}
        {/* ========================================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubTagEmerald}>DU KHÁCH YÊU THÍCH</Text>
              <Text style={styles.sectionTitleBlack}>Lựa chọn yêu thích của du khách</Text>
            </View>
            <Pressable
              style={styles.seeAllBtnRow}
              onPress={() => router.push('/ve-du-lich')}
              hitSlop={8}
            >
              <Text style={styles.seeAllEmeraldText}>Xem tất cả</Text>
              <SymbolView name="chevron.right" size={13} tintColor="#059669" />
            </Pressable>
          </View>
          <Text style={styles.sectionSublead}>
            Vé tham quan và tour trải nghiệm được đánh giá cao cho chuyến đi sắp tới.
          </Text>

          <View style={styles.twoColumnGrid}>
            {TRAVELER_FAVORITES.map((ticket, idx) => (
              <Pressable
                key={idx}
                style={styles.ticketGridCard}
                onPress={() => {
                  router.push({
                    pathname: '/chi-tiet-ve',
                    params: {
                      name: ticket.name,
                      price: ticket.price,
                      location: ticket.location,
                      image: ticket.image,
                      desc: ticket.name,
                    },
                  });
                }}
              >
                <View style={styles.ticketGridThumbBox}>
                  <Image source={{ uri: ticket.image }} style={styles.fullCardImg} contentFit="cover" />
                  <View style={styles.ticketBadgeGreen}>
                    <Text style={styles.ticketBadgeGreenText}>{ticket.tag}</Text>
                  </View>
                  <View style={styles.hotelInstantBadge}>
                    <SymbolView name="checkmark" size={9} tintColor="#34D399" />
                    <Text style={styles.hotelInstantText}>Xác nhận tức thì</Text>
                  </View>
                </View>

                <View style={styles.ticketGridContent}>
                  <Text style={styles.ticketGridProv}>{ticket.location}</Text>
                  <Text style={styles.ticketGridTitle} numberOfLines={2}>{ticket.name}</Text>

                  <View style={styles.ticketPerksWrap}>
                    {ticket.perks.map((p, pIdx) => (
                      <View key={pIdx} style={styles.ticketPerkPill}>
                        <Text style={styles.ticketPerkPillText}>{p}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.ticketCardFooterRow}>
                    <View>
                      <Text style={styles.ticketGridPricePrefix}>Giá từ</Text>
                      <Text style={styles.ticketGridPriceVal}>{ticket.price}</Text>
                    </View>
                    <View style={styles.ticketBookBtnMini}>
                      <Text style={styles.ticketBookBtnMiniText}>Đặt ngay</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: Local Cuisine (Ẩm thực ba miền đặc sắc) */}
        {/* ========================================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubTagOrange}>VĂN HOÁ MỸ VỊ</Text>
              <Text style={styles.sectionTitleBlack}>Ẩm thực ba miền đặc sắc</Text>
            </View>
            <Pressable
              style={styles.seeAllBtnRow}
              onPress={() => router.push('/am-thuc')}
              hitSlop={8}
            >
              <Text style={styles.seeAllOrangeText}>Xem thêm</Text>
              <SymbolView name="chevron.right" size={13} tintColor="#F97316" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollList}
          >
            {FOOD_ITEMS.map((food, idx) => (
              <Pressable
                key={idx}
                style={styles.foodCardItem}
                onPress={() => router.push('/am-thuc')}
              >
                <View style={styles.foodThumbWrap}>
                  <Image source={{ uri: food.image }} style={styles.fullCardImg} contentFit="cover" />
                  <View style={[styles.foodRegionBadge, { backgroundColor: food.tagColor }]}>
                    <Text style={styles.foodRegionText}>{food.region}</Text>
                  </View>
                </View>
                <View style={styles.foodInfoWrap}>
                  <Text style={styles.foodNameText} numberOfLines={1}>{food.name}</Text>
                  <Text style={styles.foodSubText} numberOfLines={1}>{food.sub}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: Destination Inspiration (Asymmetric Grid) */}
        {/* ========================================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubTagEmerald}>CẢM HỨNG CHO CHUYẾN ĐI</Text>
              <Text style={styles.sectionTitleBlack}>Bạn muốn đi đâu tiếp theo?</Text>
            </View>
            <Pressable
              style={styles.seeAllBtnRow}
              onPress={() => router.push('/ve-du-lich')}
              hitSlop={8}
            >
              <Text style={styles.seeAllEmeraldText}>Xem điểm đến</Text>
              <SymbolView name="chevron.right" size={13} tintColor="#059669" />
            </Pressable>
          </View>
          <Text style={styles.sectionSublead}>
            Những điểm đến được quan tâm với nhiều lựa chọn vé, tour và lưu trú trên igovi.
          </Text>

          <View style={styles.asymmetricGridRow}>
            {/* Left Hero Destination: Rừng Tràm Tân Lập */}
            <Pressable
              style={styles.asymLeftCard}
              onPress={() => router.push({ pathname: '/ve-du-lich', params: { location: 'Long An' } })}
            >
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcb8x7bGBANPtEmwliCGFXD9IEm7ucJC-rEFPjRDGna348yDqfIVr3zbq3Z89AOwSV9OEjAt-fBuw0TDSO9VM5BvExDQzfqWNLIukEsxTDDbvzHi2_lBWmKu_ENUDCGOtP1kyihFKXRQvhrrqvc6EPF2SY1b6LlI-sosXkQJh9y_KVgEtvVXe1U8dAwogbKk3Z4ceHRiuLzCv1WbPNi5TspUYQ_UwvHxh4iqPJfhgoEK7gMyIhEVOIOg',
                }}
                style={styles.fullCardImg}
                contentFit="cover"
              />
              <View style={styles.darkScrim} />

              <View style={styles.asymBadgeTop}>
                <Text style={styles.asymBadgeTopText}>Gần Sài Gòn</Text>
              </View>

              <View style={styles.asymLeftBottom}>
                <Text style={styles.asymProvYellow}>Long An</Text>
                <Text style={styles.asymTitleWhite}>Rừng Tràm Tân Lập</Text>
                <Text style={styles.asymSubWhite} numberOfLines={2}>
                  Sông nước mênh mông, xuồng chèo len lỏi & khám phá ẩm thực bản địa.
                </Text>
                <View style={styles.asymExploreBtn}>
                  <Text style={styles.asymExploreBtnText}>Khám phá tour →</Text>
                </View>
              </View>
            </Pressable>

            {/* Right Column Stacked: Đồng Tháp & Bến Tre */}
            <View style={styles.asymRightCol}>
              <Pressable
                style={styles.asymRightCard}
                onPress={() => router.push({ pathname: '/ve-du-lich', params: { location: 'Đồng Tháp' } })}
              >
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACHeSsmNtGW73oPHbTnkoOjwojVbnAi_q-4FwEjticQ1CpkieRivPIb-gAw4tS1l4Cv-JqNVSzTVL3uwVaaWcYlmXMvRzGvVM0XyFvN_l4afVQjmxtBGxPoDvA5sMcOE_42ml1pUm1YGpBXgwhLMOfENsw0MYIdVfgs4tXeJ9Bdozh-oDqHUV9FvFg7LEkCke4NYFI2hTP1XwpvJGTDgNyPSk5scMWHb0yNaXZB_Jwy92D4fLU3rNEPQ',
                  }}
                  style={styles.fullCardImg}
                  contentFit="cover"
                />
                <View style={styles.darkScrim} />
                <View style={[styles.asymMiniBadge, { backgroundColor: '#F97316' }]}>
                  <Text style={styles.asymMiniBadgeText}>Đồng Sen</Text>
                </View>
                <View style={styles.asymRightBottom}>
                  <Text style={styles.asymMiniTitle}>Đồng Tháp</Text>
                  <Text style={styles.asymMiniSub}>Làng hoa Sa Đéc</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.asymRightCard}
                onPress={() => router.push({ pathname: '/ve-du-lich', params: { location: 'Bến Tre' } })}
              >
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAluqKY48UCquc5770tGQjKIOIG0FOubIxG-k2IjRal4E1lX-lhZPdaqd8d6yl7y94HE3dua0WycKusXWWMZhYa1SEMhgD4TaxdIkFBF5s2OuTzKGd8PJFXgqOzbF5MrzbRBbOaY5FZsxzvrEbRAmZZlSnSBR218k_Fmnw8Z5pybkbGVhbHyoBY3s6yf0ybfFfHRxnVTEhkIxEc9GhudSXirueNgPmY3gjRDD3lSPVdszGTRbN2G4z-lQ',
                  }}
                  style={styles.fullCardImg}
                  contentFit="cover"
                />
                <View style={styles.darkScrim} />
                <View style={[styles.asymMiniBadge, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.asymMiniBadgeText}>Miệt Vườn</Text>
                </View>
                <View style={styles.asymRightBottom}>
                  <Text style={styles.asymMiniTitle}>Bến Tre</Text>
                  <Text style={styles.asymMiniSub}>Chèo xuồng ven sông</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* BEGIN: TrustBanner (Cam kết chất lượng igovi) */}
        {/* ========================================================================= */}
        <View style={styles.trustBannerWrapper}>
          <View style={styles.trustCard}>
            <View style={styles.trustIconCircle}>
              <SymbolView name="checkmark.shield.fill" size={18} tintColor="#FFFFFF" />
            </View>
            <View style={styles.trustTextCol}>
              <Text style={styles.trustTitle}>Vé chuẩn đại lý - Đi ngay không chờ</Text>
              <Text style={styles.trustSub}>Hỗ trợ đối soát mã QR 24/7 trực tiếp tại quầy</Text>
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

const FLASH_SALE_ITEMS = [
  {
    name: 'Khách sạn Làng Nổi Tân Lập',
    location: 'TP. HCM, Tây Ninh',
    category: 'Lưu trú',
    discount: '-20%',
    oldPrice: '500.000đ',
    price: '400.000đ',
    perks: ['Wi-Fi miễn phí', 'Điều hòa'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcb8x7bGBANPtEmwliCGFXD9IEm7ucJC-rEFPjRDGna348yDqfIVr3zbq3Z89AOwSV9OEjAt-fBuw0TDSO9VM5BvExDQzfqWNLIukEsxTDDbvzHi2_lBWmKu_ENUDCGOtP1kyihFKXRQvhrrqvc6EPF2SY1b6LlI-sosXkQJh9y_KVgEtvVXe1U8dAwogbKk3Z4ceHRiuLzCv1WbPNi5TspUYQ_UwvHxh4iqPJfhgoEK7gMyIhEVOIOg',
  },
  {
    name: 'Resort Vườn Cau Tây Ninh - Bình yên',
    location: 'Gò Dầu, Tây Ninh',
    category: 'Lưu trú',
    discount: '-20%',
    oldPrice: '1.100.000đ',
    price: '880.000đ',
    perks: ['Wi-Fi miễn phí', 'Bể bơi'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAluqKY48UCquc5770tGQjKIOIG0FOubIxG-k2IjRal4E1lX-lhZPdaqd8d6yl7y94HE3dua0WycKusXWWMZhYa1SEMhgD4TaxdIkFBF5s2OuTzKGd8PJFXgqOzbF5MrzbRBbOaY5FZsxzvrEbRAmZZlSnSBR218k_Fmnw8Z5pybkbGVhbHyoBY3s6yf0ybfFfHRxnVTEhkIxEc9GhudSXirueNgPmY3gjRDD3lSPVdszGTRbN2G4z-lQ',
  },
  {
    name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
    location: 'TP. Tây Ninh, Tây Ninh',
    category: 'Vé du lịch',
    discount: '-15%',
    oldPrice: '400.000đ',
    price: '340.000đ',
    perks: ['Săn mây', 'Khứ hồi'],
    image:
      'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
  },
];

const HOTEL_ITEMS = [
  {
    name: 'Khách sạn Làng Nổi Tân Lập',
    location: 'TP. HCM, Tây Ninh',
    discount: '-20%',
    oldPrice: '500.000đ',
    price: '400.000đ',
    amenities: ['Wi-Fi miễn phí', 'Điều hòa'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcb8x7bGBANPtEmwliCGFXD9IEm7ucJC-rEFPjRDGna348yDqfIVr3zbq3Z89AOwSV9OEjAt-fBuw0TDSO9VM5BvExDQzfqWNLIukEsxTDDbvzHi2_lBWmKu_ENUDCGOtP1kyihFKXRQvhrrqvc6EPF2SY1b6LlI-sosXkQJh9y_KVgEtvVXe1U8dAwogbKk3Z4ceHRiuLzCv1WbPNi5TspUYQ_UwvHxh4iqPJfhgoEK7gMyIhEVOIOg',
  },
  {
    name: 'Mekong Tani Resort',
    location: 'Tây Ninh, Tây Ninh',
    price: 'Giá từ 500.000đ',
    amenities: ['Bể bơi', 'Sân vườn'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACHeSsmNtGW73oPHbTnkoOjwojVbnAi_q-4FwEjticQ1CpkieRivPIb-gAw4tS1l4Cv-JqNVSzTVL3uwVaaWcYlmXMvRzGvVM0XyFvN_l4afVQjmxtBGxPoDvA5sMcOE_42ml1pUm1YGpBXgwhLMOfENsw0MYIdVfgs4tXeJ9Bdozh-oDqHUV9FvFg7LEkCke4NYFI2hTP1XwpvJGTDgNyPSk5scMWHb0yNaXZB_Jwy92D4fLU3rNEPQ',
  },
  {
    name: 'La Siesta Resort Tràng An',
    location: 'Hoa Lư, Ninh Bình',
    price: 'Giá từ 1.350.000đ',
    amenities: ['Wi-Fi miễn phí', 'Hồ bơi núi'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3p7T_c8O4M0uC1Q6r-T-H_d9p9a5Q6r-T-H_d=w600',
  },
  {
    name: 'Sông Hoài Boutique Hotel',
    location: 'Hội An, Quảng Nam',
    price: 'Giá từ 980.000đ',
    amenities: ['Wi-Fi miễn phí', 'Gần phố cổ'],
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1U5bZ3p1PbOEW2hwQ9RWQYOZJMamn1s-vnJmwWpoJwU_9VKWTrd_XyS7kUKI-11xaBynVwXtd0N45u7c6DbP8ewp77hyu-K0Jpc-nW2z80QRLpl8ClNjmv_qOY-j3nj500o0-48DgSwHbS7uX77pCRov3DQCZVGVASwNBRauInOzqOmX5lm7RCqI-MKx2yDatwqQLYwsxoxpLmpQd2RuojTgqTWXPsX3phsbCLH4XuOG-THXSCMHBp63yoM',
  },
];

const TRAVELER_FAVORITES = [
  {
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    location: 'TP. Tây Ninh',
    tag: 'Vé du lịch',
    price: '250.000đ',
    perks: ['Buffet trưa', 'Mã điện tử'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCTuj_eUkEwd2SlqCUgxyQa3RPi8VS00IOFXzVrHMzp_xJhdonkEZZoF6vOB4fTrrSmqSXs580PWJ6WHmqvfGId42KF5rnUENfsNYAbczEWU7YN8EsAOrTZaaun9DBScKQr-QOWBP6mXBpsFMl-BWIsfGAJ_r84Bu1tderCiRG_rcV0KBB3nY7hg-hsdPMocz8IE2Ym70ygz4_FLrYHr6IyYq8nWyekvq-I5HYg3nvIBmMwHEmA_m8dQ',
  },
  {
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    location: 'TP. Tây Ninh',
    tag: 'Vé du lịch',
    price: '245.000đ',
    perks: ['Tuyến Chùa Hang', 'Mã booking'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqVXZ8F0ZEGdzLQ7AZKFoFE134YhpBxkEVB2onrC8asFTuDxYPrXytUCqb2YvMVJFKPBL4H3zkLfSV6FlUybL1y0UKbTdJD1s-GXBfC6dPxxoLBZ1-4DomPtKOoPuFO_T3FqSEGufm3mWUBaUdK7r02mibbb24yESeClIn4TFJSpWd0Z22fw9HqLDENx-DphzFeAFSYL7Div2L5XDQLybUdEylUnqZmfS0nClJmLngW-D4OwthDD0azQ',
  },
  {
    name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
    location: 'TP. Tây Ninh',
    tag: 'Vé du lịch',
    price: '400.000đ',
    perks: ['Khứ hồi', 'Mã booking'],
    image:
      'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
  },
  {
    name: 'Combo Núi Bà Đen: Cáp treo + buffet',
    location: 'TP. Tây Ninh',
    tag: 'Combo HOT',
    price: '550.000đ',
    perks: ['Khứ hồi', 'Buffet trưa'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
  },
];

const FOOD_ITEMS = [
  {
    name: 'Bún bò Huế',
    region: 'Cố đô Huế',
    sub: 'Nước dùng đậm đà',
    tagColor: '#F97316',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1WuU9IbZDa22JQR5ArZNO7CJShmZbxxynnSwkGED9XuKPAfQIu0a59pSQrsJDZTajo_Zo-HNX3dkckPNw3RpKPhCS8FFguyEJt_mYqrAn7gXJWVTGpARYlw_hUUEs0fmdMKmIEMy2Zjsnkr60x1FRO-MjswjEbI1_2ZKyZKIqDd1CmA9JQvb1JviTtk9Mg6kYHJ2SgAmYoik6Eux4nNYlnwk3lHafsOMikF0TkZaRow20k6KBlY_02Jc-0M',
  },
  {
    name: 'Cao lầu Hội An',
    region: 'Hội An',
    sub: 'Sợi mì giòn thơm',
    tagColor: '#059669',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1U5bZ3p1PbOEW2hwQ9RWQYOZJMamn1s-vnJmwWpoJwU_9VKWTrd_XyS7kUKI-11xaBynVwXtd0N45u7c6DbP8ewp77hyu-K0Jpc-nW2z80QRLpl8ClNjmv_qOY-j3nj500o0-48DgSwHbS7uX77pCRov3DQCZVGVASwNBRauInOzqOmX5lm7RCqI-MKx2yDatwqQLYwsxoxpLmpQd2RuojTgqTWXPsX3phsbCLH4XuOG-THXSCMHBp63yoM',
  },
  {
    name: 'Bún ốc gia truyền',
    region: 'Ninh Bình',
    sub: 'Ốc nhồi giòn sần sật',
    tagColor: '#D97706',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCD9Oq_RPEGEGzH7qtJdclfBsbGzfPmDloHZ4U7RrOu2qRr7Ki4yM9OP4Uldg66L2Q_XG4YImiinDBZKuSuEvSiwCx48c93YSajNx1y9W9CcJjjJQsUr4bZMyOZPMxfYmfkDMCSldWm0RN8xPGbBsT2XnmI5rVnDoN-_r_qkK1LsOj2AVFGW69ROkz1h9Yd4TRk7ahLYht3mz_tcE2Hked3YmtkAQfU6IPHL5fG2Ii_bDV_rxeZbrAy0w',
  },
  {
    name: 'Bánh tráng phơi sương',
    region: 'Tây Ninh',
    sub: 'Đặc sản trứ danh',
    tagColor: '#EA580C',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
  },
];

const TOP_SERVICES = [
  {
    id: 1,
    rank: 1,
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    category: 'Vé du lịch',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '250.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCTuj_eUkEwd2SlqCUgxyQa3RPi8VS00IOFXzVrHMzp_xJhdonkEZZoF6vOB4fTrrSmqSXs580PWJ6WHmqvfGId42KF5rnUENfsNYAbczEWU7YN8EsAOrTZaaun9DBScKQr-QOWBP6mXBpsFMl-BWIsfGAJ_r84Bu1tderCiRG_rcV0KBB3nY7hg-hsdPMocz8IE2Ym70ygz4_FLrYHr6IyYq8nWyekvq-I5HYg3nvIBmMwHEmA_m8dQ',
    desc: 'Vé buffet trưa tại nhà hàng Vân Sơn Đỉnh Núi Bà Đen với hơn 80 món ăn phong phú từ đặc sản Tây Ninh đến ẩm thực Á Âu.',
  },
  {
    id: 2,
    rank: 2,
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    category: 'Vé du lịch',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '245.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqVXZ8F0ZEGdzLQ7AZKFoFE134YhpBxkEVB2onrC8asFTuDxYPrXytUCqb2YvMVJFKPBL4H3zkLfSV6FlUybL1y0UKbTdJD1s-GXBfC6dPxxoLBZ1-4DomPtKOoPuFO_T3FqSEGufm3mWUBaUdK7r02mibbb24yESeClIn4TFJSpWd0Z22fw9HqLDENx-DphzFeAFSYL7Div2L5XDQLybUdEylUnqZmfS0nClJmLngW-D4OwthDD0azQ',
    desc: 'Tuyến cáp treo Chùa Hang dẫn thẳng đến quần thể Chùa Bà hơn 300 năm tuổi, thuận tiện cho hành hương lễ Phật.',
  },
  {
    id: 3,
    rank: 3,
    name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
    category: 'Vé du lịch',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '400.000đ',
    image: 'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
    desc: 'Cáp treo khứ hồi chinh phục "Nóc nhà Nam Bộ" ở độ cao 986m, chiêm bái tượng Phật Bà Tây Bổ Đà Sơn và ngắm biển mây.',
  },
];

const TRENDING_DESTINATIONS = [
  {
    id: 1,
    rank: 1,
    name: 'Long An',
    desc: 'Rừng tràm Tân Lập, sông nước mênh mông',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcb8x7bGBANPtEmwliCGFXD9IEm7ucJC-rEFPjRDGna348yDqfIVr3zbq3Z89AOwSV9OEjAt-fBuw0TDSO9VM5BvExDQzfqWNLIukEsxTDDbvzHi2_lBWmKu_ENUDCGOtP1kyihFKXRQvhrrqvc6EPF2SY1b6LlI-sosXkQJh9y_KVgEtvVXe1U8dAwogbKk3Z4ceHRiuLzCv1WbPNi5TspUYQ_UwvHxh4iqPJfhgoEK7gMyIhEVOIOg',
  },
  {
    id: 2,
    rank: 2,
    name: 'Đồng Tháp',
    desc: 'Đồng sen Tháp Mười, làng hoa Sa Đéc',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACHeSsmNtGW73oPHbTnkoOjwojVbnAi_q-4FwEjticQ1CpkieRivPIb-gAw4tS1l4Cv-JqNVSzTVL3uwVaaWcYlmXMvRzGvVM0XyFvN_l4afVQjmxtBGxPoDvA5sMcOE_42ml1pUm1YGpBXgwhLMOfENsw0MYIdVfgs4tXeJ9Bdozh-oDqHUV9FvFg7LEkCke4NYFI2hTP1XwpvJGTDgNyPSk5scMWHb0yNaXZB_Jwy92D4fLU3rNEPQ',
  },
  {
    id: 3,
    rank: 3,
    name: 'Bến Tre',
    desc: 'Xứ Dừa, miệt vườn chèo xuồng ven sông',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAluqKY48UCquc5770tGQjKIOIG0FOubIxG-k2IjRal4E1lX-lhZPdaqd8d6yl7y94HE3dua0WycKusXWWMZhYa1SEMhgD4TaxdIkFBF5s2OuTzKGd8PJFXgqOzbF5MrzbRBbOaY5FZsxzvrEbRAmZZlSnSBR218k_Fmnw8Z5pybkbGVhbHyoBY3s6yf0ybfFfHRxnVTEhkIxEc9GhudSXirueNgPmY3gjRDD3lSPVdszGTRbN2G4z-lQ',
  },
  {
    id: 4,
    rank: 4,
    name: 'Tây Ninh',
    desc: 'Núi Bà Đen, cáp treo Sun World',
    image: 'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  fullCardImg: {
    width: '100%',
    height: '100%',
  },
  darkScrim: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  /* ========================================================================= */
  /* Top App Banner */
  /* ========================================================================= */
  topAppBanner: {
    backgroundColor: '#073B2E',
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11, 71, 54, 0.5)',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bannerIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIconText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bannerTitleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  bannerOfferTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 0.5,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  bannerOfferTagText: {
    color: '#A7F3D0',
    fontSize: 9,
    fontWeight: '800',
  },
  bannerSubtitleText: {
    color: 'rgba(209, 250, 229, 0.75)',
    fontSize: 9.5,
    fontWeight: '500',
  },
  bannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerOpenBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
  },
  bannerOpenBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  bannerCloseBtn: {
    padding: 3,
  },
  bannerCloseText: {
    color: 'rgba(209, 250, 229, 0.7)',
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* ========================================================================= */
  /* Main Header */
  /* ========================================================================= */
  mainHeader: {
    backgroundColor: '#073B2E',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 36,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#073B2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  logoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F97316',
    marginLeft: 2,
    marginBottom: 8,
  },
  countryTag: {
    backgroundColor: '#0F4D3D',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginLeft: 8,
  },
  countryTagText: {
    color: '#6EE7B7',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sloganText: {
    color: 'rgba(209, 250, 229, 0.85)',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 12,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0F4D3D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  bellAlertDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F97316',
  },
  avatarCircleRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#073B2E',
    borderWidth: 2,
    borderColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },

  /* Search Bar */
  searchPillWrapper: {
    position: 'relative',
    zIndex: 20,
  },
  searchPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 4,
    paddingLeft: 14,
    paddingRight: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchGlassIcon: {
    marginRight: 6,
  },
  searchInputField: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    paddingVertical: 5,
  },
  searchClearBtn: {
    paddingHorizontal: 6,
  },
  searchClearText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchSubmitCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Search Dropdown */
  outsideBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    zIndex: 15,
  },
  dropdownCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#073B2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
    maxHeight: 380,
  },
  dropdownTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownIndicator: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  collapseBtn: {
    padding: 2,
  },
  collapseBtnText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  dropdownInnerScroll: {
    maxHeight: 340,
  },
  dropdownInnerContent: {
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  dropdownSection: {
    marginTop: 8,
  },
  dropdownSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireEmoji: {
    fontSize: 13,
    marginRight: 4,
  },
  dropdownSectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  seeAllOrange: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F97316',
  },
  seeAllGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  serviceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  thumbContainer: {
    position: 'relative',
    marginRight: 9,
  },
  serviceThumb: {
    width: 44,
    height: 44,
    borderRadius: 9,
  },
  rankBadgeOrange: {
    position: 'absolute',
    top: -3,
    left: -3,
    backgroundColor: '#F97316',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeGreen: {
    position: 'absolute',
    top: -3,
    left: -3,
    backgroundColor: '#059669',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  serviceInfoCol: {
    flex: 1,
  },
  serviceName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  serviceSub: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  servicePriceCol: {
    marginLeft: 6,
  },
  servicePrice: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F97316',
  },
  emptyResultText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 10,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },

  /* ========================================================================= */
  /* QuickServicesGrid (5 Squircle Categories -mt-8) */
  /* ========================================================================= */
  quickServicesWrapper: {
    paddingHorizontal: 16,
    marginTop: -22,
    zIndex: 10,
  },
  quickServicesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#073B2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },

  /* ========================================================================= */
  /* Section Header Shared */
  /* ========================================================================= */
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  sectionSubTagEmerald: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.8,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  sectionSubTagOrange: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 0.8,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  sectionTitleBlack: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSublead: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
  },
  seeAllBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllEmeraldText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  seeAllOrangeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F97316',
  },
  horizontalScrollList: {
    gap: 12,
    paddingVertical: 2,
  },

  /* ========================================================================= */
  /* Exclusive Offers */
  /* ========================================================================= */
  offersSection: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  promoCard: {
    width: 280,
    height: 150,
    borderRadius: 22,
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  promoDecorativeCircle: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  promoTagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  promoTagBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoCardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 2,
  },
  promoCardSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '500',
  },
  promoCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  promoCodeLine: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 11,
    fontWeight: '600',
  },
  promoCodeMono: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontWeight: '800',
  },
  promoClaimBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  promoClaimBtnActive: {
    backgroundColor: '#ECFDF5',
  },
  promoClaimBtnText: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '800',
  },

  /* ========================================================================= */
  /* Flash Sale Section */
  /* ========================================================================= */
  flashSaleContainer: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  flashSaleCard: {
    backgroundColor: '#073B2E',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#073B2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  flashSaleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  flashSaleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flashSaleBolt: {
    fontSize: 14,
  },
  flashSaleTagText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  flashSaleSeeAll: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  flashSaleTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 2,
  },
  flashSaleSub: {
    color: 'rgba(167, 243, 208, 0.85)',
    fontSize: 11,
    marginBottom: 10,
  },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4D3D',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 14,
  },
  countdownLabel: {
    color: '#A7F3D0',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  countdownDigitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  countdownBox: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countdownNum: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  countdownColon: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  flashSaleCardsScroll: {
    gap: 12,
    paddingRight: 6,
  },
  flashItemCard: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  flashItemThumbWrap: {
    height: 110,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  flashItemImage: {
    width: '100%',
    height: '100%',
  },
  flashBadgeCategory: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#047857',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  flashBadgeCategoryText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  flashBadgeDiscount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F97316',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  flashBadgeDiscountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  flashConfirmBadge: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  flashConfirmText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '600',
  },
  flashItemBody: {
    padding: 10,
  },
  flashItemLocation: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  flashItemName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  flashPerksRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  flashPerkPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  flashPerkText: {
    fontSize: 8.5,
    color: '#475569',
    fontWeight: '500',
  },
  flashItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  flashOldPrice: {
    fontSize: 9,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  flashNewPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F97316',
  },
  flashBookBtn: {
    backgroundColor: '#047857',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  flashBookBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  /* ========================================================================= */
  /* 2-Column Grid Cards (Recommended Experiences & Travelers' Favorites) */
  /* ========================================================================= */
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  ticketGridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  ticketGridThumbBox: {
    height: 110,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  ticketBadgeGreen: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#047857',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
  },
  ticketBadgeGreenText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  ticketBadgeOrange: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F97316',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
  },
  ticketBadgeOrangeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  ratingBadgePill: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: '#FBBF24',
    fontSize: 9.5,
    fontWeight: '800',
  },
  ticketGridContent: {
    padding: 10,
  },
  ticketGridProv: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  ticketGridTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 16,
    minHeight: 32,
    marginBottom: 4,
  },
  ticketGridPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  ticketGridPricePrefix: {
    fontSize: 9.5,
    color: '#64748B',
  },
  ticketGridPriceVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F97316',
  },
  ticketPerkTag: {
    fontSize: 9,
    color: '#047857',
    fontWeight: '700',
    marginTop: 2,
  },
  ticketPerksWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
    marginBottom: 6,
  },
  ticketPerkPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ticketPerkPillText: {
    fontSize: 8.5,
    color: '#475569',
  },
  ticketCardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  ticketBookBtnMini: {
    backgroundColor: '#047857',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ticketBookBtnMiniText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },

  /* ========================================================================= */
  /* Hotels & Homestays */
  /* ========================================================================= */
  hotelCardItem: {
    width: 210,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  hotelThumbWrap: {
    height: 110,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  hotelCategoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#047857',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  hotelCategoryText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  hotelDiscountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F97316',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  hotelDiscountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  hotelInstantBadge: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  hotelInstantText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '600',
  },
  hotelBody: {
    padding: 10,
  },
  hotelLocText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  hotelTitleText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  hotelAmenitiesRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  hotelAmenityPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotelAmenityText: {
    fontSize: 8.5,
    color: '#475569',
  },
  hotelVerifiedText: {
    fontSize: 9,
    color: '#047857',
    fontWeight: '700',
    marginBottom: 6,
  },
  hotelFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  hotelOldPrice: {
    fontSize: 9,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  hotelPriceVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F97316',
  },
  hotelViewRoomBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hotelViewRoomText: {
    color: '#047857',
    fontSize: 9.5,
    fontWeight: '800',
  },

  /* ========================================================================= */
  /* Local Cuisine */
  /* ========================================================================= */
  foodCardItem: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  foodThumbWrap: {
    height: 105,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  foodRegionBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  foodRegionText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  foodInfoWrap: {
    padding: 9,
  },
  foodNameText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  foodSubText: {
    fontSize: 10,
    color: '#64748B',
  },

  /* ========================================================================= */
  /* Destination Inspiration (Asymmetric Grid) */
  /* ========================================================================= */
  asymmetricGridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  asymLeftCard: {
    flex: 1,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  asymBadgeTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  asymBadgeTopText: {
    color: '#A7F3D0',
    fontSize: 9,
    fontWeight: '700',
  },
  asymLeftBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  asymProvYellow: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  asymTitleWhite: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  asymSubWhite: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 6,
  },
  asymExploreBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  asymExploreBtnText: {
    color: '#F97316',
    fontSize: 9.5,
    fontWeight: '800',
  },
  asymRightCol: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
  asymRightCard: {
    flex: 1,
    height: 120,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  asymMiniBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  asymMiniBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  asymRightBottom: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  asymMiniTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  asymMiniSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9,
  },

  /* ========================================================================= */
  /* Trust Banner */
  /* ========================================================================= */
  trustBannerWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  trustCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trustIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
  trustTextCol: {
    flex: 1,
    marginRight: 8,
  },
  trustTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  trustSub: {
    fontSize: 9.5,
    color: '#047857',
    marginTop: 1,
  },
  trustSupportBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  trustSupportBtnText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
  },
});
