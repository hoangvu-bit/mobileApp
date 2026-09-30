import React, { useState, useEffect, useRef } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert, Dimensions, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function VeDuLichScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ location?: string; search?: string }>();
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const mainScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (params.location) {
      setSelectedTag(params.location);
      setAppliedLocation(params.location);
      setSearchLocation(params.location);
      setAppliedKeyword('');
      setSearchKeyword('');
      setTimeout(() => {
        mainScrollRef.current?.scrollTo({ y: 440, animated: true });
      }, 350);
    }
    if (params.search) {
      setSearchKeyword(params.search);
      setAppliedKeyword(params.search);
      setTimeout(() => {
        mainScrollRef.current?.scrollTo({ y: 440, animated: true });
      }, 350);
    }
  }, [params.location, params.search]);
  const ALL_LOCATIONS = Array.from(new Set(TICKETS.map(t => t.location)));

  const scrollRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= FEATURED.length) {
        nextIndex = 0;
      }
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 10000);

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
      }
    });
  };

  const displaySuggestions = TICKETS.filter(t => {
    if (searchLocation && t.location !== searchLocation) return false;
    if (searchKeyword && !t.name.toLowerCase().includes(searchKeyword.toLowerCase()) && !t.location.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  }).slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView ref={mainScrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header Hero Section */}
        <View style={styles.heroContainer}>
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false } // Required false for width/color interpolation
            )}
            onMomentumScrollEnd={(e) => {
              const contentOffsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffsetX / width);
              setCurrentIndex(index);
            }}
          >
            {FEATURED.map((item, idx) => {
              const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [1.15, 1, 1.15],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.6, 1, 0.6],
                extrapolate: 'clamp',
              });

              return (
                <View key={idx} style={styles.heroSection}>
                  <Animated.Image
                    source={{ uri: item.image }}
                    style={[styles.heroImage, { transform: [{ scale }] }]}
                  />
                  <Animated.View style={[styles.heroOverlay, { opacity }]}>
                    <View style={styles.badgeRow}>
                      <Text style={styles.badgeText}>Vé nổi bật</Text>
                      <Text style={styles.badgeTextOutline}>Đặt vé trực tuyến</Text>
                    </View>
                    <Text style={styles.heroTitle}>{item.name}</Text>
                    <Text style={styles.heroSubtitle} numberOfLines={2}>{item.desc}</Text>
                    <View style={styles.heroInfoRow}>
                      <View style={styles.heroLocation}>
                        <SymbolView name="mappin.and.ellipse" size={14} tintColor="#f0a56d" />
                        <Text style={styles.heroInfoText}>{item.location}</Text>
                      </View>
                      <View style={styles.heroLocation}>
                        <SymbolView name="calendar" size={14} tintColor="#f0a56d" />
                        <Text style={styles.heroInfoText}>3 lịch khả dụng</Text>
                      </View>
                    </View>

                    <View style={styles.heroActionRow}>
                      <Pressable style={styles.heroBtn} onPress={() => handleBookTicket(item)}>
                        <Text style={styles.heroBtnText}>XEM VÉ</Text>
                        <SymbolView name="arrow.right" size={16} tintColor="#fff" />
                      </Pressable>
                      <View style={styles.heroPriceBox}>
                        <Text style={styles.heroPriceLabel}>Giá tham khảo</Text>
                        <Text style={styles.heroPriceVal}>Từ {item.price}</Text>
                      </View>
                    </View>
                  </Animated.View>
                </View>
              );
            })}
          </Animated.ScrollView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {FEATURED.map((_, idx) => {
              const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [6, 24, 6],
                extrapolate: 'clamp',
              });

              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });

              const dotColor = scrollX.interpolate({
                inputRange,
                outputRange: ['#ffffff', '#ea580c', '#ffffff'],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={idx}
                  style={[
                    styles.dot,
                    { width: dotWidth, opacity: dotOpacity, backgroundColor: dotColor }
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchForm}>
            <View style={styles.searchInputGroup}>
              <SymbolView name="magnifyingglass" size={20} tintColor="#168b58" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.searchLabel}>Điểm đến hoặc tên vé</Text>
                <TextInput
                  placeholder="Tìm vé ở đâu? Phú Quốc, Hạ Long..."
                  style={styles.searchInput}
                  placeholderTextColor="#94a3b8"
                  value={searchKeyword}
                  onChangeText={(text) => {
                    setSearchKeyword(text);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
              </View>
            </View>

            {showSuggestions && displaySuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {displaySuggestions.map((t, idx) => (
                  <Pressable key={idx} style={styles.suggestionItem} onPress={() => {
                    setSearchKeyword(t.name);
                    setSearchLocation(t.location);
                    setShowSuggestions(false);
                  }}>
                    <SymbolView name="ticket" size={14} tintColor="#94a3b8" />
                    <View>
                      <Text style={styles.suggestionText}>{t.name}</Text>
                      <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{t.location}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.separator} />
            <Pressable style={styles.searchInputGroup} onPress={() => setShowLocationDropdown(!showLocationDropdown)}>
              <SymbolView name="map" size={20} tintColor="#168b58" />
              <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.searchLabel}>Khu vực</Text>
                  <Text style={[styles.searchInput, { color: searchLocation ? '#0f172a' : '#94a3b8', paddingVertical: 2 }]}>
                    {searchLocation || 'Tất cả điểm đến'}
                  </Text>
                </View>
                <SymbolView name={showLocationDropdown ? "chevron.up" : "chevron.down"} size={16} tintColor="#94a3b8" />
              </View>
            </Pressable>

            {showLocationDropdown && (
              <View style={styles.suggestionsContainer}>
                {['Tất cả điểm đến', ...ALL_LOCATIONS].map((loc, idx) => (
                  <Pressable key={idx} style={styles.suggestionItem} onPress={() => {
                    const newLocation = loc === 'Tất cả điểm đến' ? '' : loc;
                    setSearchLocation(newLocation);
                    setShowLocationDropdown(false);
                    // Clear keyword if it doesn't match the new location
                    if (searchKeyword && newLocation !== '') {
                      const isValid = TICKETS.some(t => t.location === newLocation && (t.name === searchKeyword || t.name.toLowerCase().includes(searchKeyword.toLowerCase())));
                      if (!isValid) {
                        setSearchKeyword('');
                      }
                    }
                  }}>
                    <Text style={[styles.suggestionText, searchLocation === loc || (searchLocation === '' && loc === 'Tất cả điểm đến') ? { color: '#168b58', fontWeight: 'bold' } : {}]}>{loc}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            <Pressable style={styles.searchButton} onPress={() => {
              setAppliedKeyword(searchKeyword);
              setAppliedLocation(searchLocation);
              setSelectedTag('Tất cả'); // Reset tag when manual search is applied
            }}>
              <SymbolView name="magnifyingglass" size={16} tintColor="#fff" />
              <Text style={styles.searchButtonText}>Tìm vé</Text>
            </Pressable>
          </View>

          <View style={styles.quickFilters}>
            <Text style={styles.quickFilterLabel}>Khám phá nhanh</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Tất cả', 'Tây Ninh', 'Long An', 'Đồng Tháp', 'Bến Tre', 'An Giang', 'Lâm Đồng', 'Phú Quốc', 'Đà Nẵng', 'Hạ Long'].map((item, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.quickFilterItem, selectedTag === item && styles.quickFilterItemActive]}
                  onPress={() => {
                    setSelectedTag(item);
                    setAppliedKeyword('');
                    setAppliedLocation('');
                    setSearchKeyword('');
                    setSearchLocation('');
                  }}
                >
                  <Text style={[styles.quickFilterItemText, selectedTag === item && styles.quickFilterItemTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* List of Tickets */}
        <View style={styles.listSection}>
          {(() => {
            const filtered = TICKETS.filter(t => {
              const matchTag = selectedTag === 'Tất cả' || t.location.toLowerCase().includes(selectedTag.toLowerCase()) || t.name.toLowerCase().includes(selectedTag.toLowerCase());
              const matchKeyword = !appliedKeyword || t.name.toLowerCase().includes(appliedKeyword.toLowerCase()) || t.location.toLowerCase().includes(appliedKeyword.toLowerCase());
              const matchLocation = !appliedLocation || t.location.toLowerCase().includes(appliedLocation.toLowerCase());
              return matchTag && matchKeyword && matchLocation;
            });

            return (
              <>
                {selectedTag !== 'Tất cả' && (
                  <View style={styles.provinceHighlightCard}>
                    <View style={styles.provinceHighlightLeft}>
                      <View style={styles.provincePinBox}>
                        <SymbolView name="mappin.circle.fill" size={22} tintColor="#fff" />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.provinceHighlightTag}>ĐIỂM ĐẾN BẠN CHỌN</Text>
                          <View style={styles.liveFilterDot} />
                        </View>
                        <Text style={styles.provinceHighlightName}>{selectedTag}</Text>
                        <Text style={styles.provinceHighlightDesc}>
                          Hiển thị {filtered.length} vé du lịch & trải nghiệm liên quan tại {selectedTag}
                        </Text>
                      </View>
                    </View>
                    <Pressable 
                      style={styles.clearFilterBadgeBtn}
                      onPress={() => {
                        setSelectedTag('Tất cả');
                        setAppliedLocation('');
                        setSearchLocation('');
                        setAppliedKeyword('');
                        setSearchKeyword('');
                      }}
                      hitSlop={8}
                    >
                      <Text style={styles.clearFilterBadgeText}>✕ Xem tất cả</Text>
                    </Pressable>
                  </View>
                )}

                <View style={styles.listHeaderRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.listSubTitle}>
                      {selectedTag === 'Tất cả' ? 'GỢI Ý NỔI BẬT' : `TỈNH / THÀNH PHỐ: ${selectedTag.toUpperCase()}`}
                    </Text>
                    <Text style={styles.listTitle}>
                      {selectedTag === 'Tất cả'
                        ? 'Tất cả vé & dịch vụ tham quan'
                        : `Các vé có liên quan tới ${selectedTag}`}
                    </Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{filtered.length} vé</Text>
                  </View>
                </View>

                <View style={styles.ticketGrid}>
                  {filtered.length === 0 ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                      <SymbolView name="magnifyingglass" size={40} tintColor="#cbd5e1" style={{ marginBottom: 12 }} />
                      <Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center' }}>Không tìm thấy vé phù hợp với tìm kiếm của bạn.</Text>
                    </View>
                  ) : (
                    filtered.map((ticket, idx) => (
                      <TicketCard key={idx} ticket={ticket} onBook={() => handleBookTicket(ticket)} />
                    ))
                  )}
                </View>
              </>
            );
          })()}
        </View>

        {/* Offers Section */}
        <View style={styles.offersSection}>
          <Pressable style={styles.sectionHeader} onPress={() => router.push('/uu-dai')}>
            <View>
              <Text style={styles.sectionBadge}>ĐẶC QUYỀN IGOVI</Text>
              <Text style={styles.sectionTitle}>Ưu đãi dành cho bạn</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.sectionLink}>Xem tất cả</Text>
              <SymbolView name="chevron.right" size={14} tintColor="#168b58" />
            </View>
          </Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersScroll}>
            {OFFERS.map((offer, idx) => (
              <Pressable 
                key={idx} 
                style={styles.offerCard}
                onPress={() => {
                  router.push({
                    pathname: '/chi-tiet-uu-dai',
                    params: {
                      code: offer.code,
                      title: offer.title,
                      desc: offer.desc,
                    },
                  });
                }}
              >
                <Image source={{ uri: offer.image }} style={styles.offerImage} />
                <View style={styles.offerContent}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDesc}>{offer.desc}</Text>
                  <Text style={{ fontSize: 10, color: '#168b58', fontWeight: '700', marginTop: 4 }}>Chi tiết mã ưu đãi ›</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Destinations Section */}
        <View style={styles.destinationsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionBadge}>CẢM HỨNG CHO CHUYẾN ĐI</Text>
              <Text style={styles.sectionTitle}>Bạn muốn đi đâu tiếp theo?</Text>
            </View>
            <Pressable>
              <Text style={styles.sectionLink}>Khám phá</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destinationsScroll}>
            {DESTINATIONS.map((dest, idx) => (
              <Pressable key={idx} style={styles.destinationCard}>
                <Image source={{ uri: dest.image }} style={styles.destinationImage} />
                <View style={styles.destinationOverlay} />
                <View style={styles.destinationContent}>
                  <Text style={styles.destinationTitle}>{dest.name}</Text>
                  <Text style={styles.destinationDesc}>{dest.desc}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

function TicketCard({ ticket, onBook }: any) {
  return (
    <Pressable
      style={styles.ticketCard}
      onPress={() => onBook(ticket)}
    >
      <View style={styles.ticketImageContainer}>
        <Image
          source={{ uri: ticket.image }}
          style={styles.ticketImage}
        />
        <View style={styles.ticketImageOverlay} />

        <View style={styles.ticketBadge}>
          <Text style={styles.ticketBadgeText}>Vé du lịch</Text>
        </View>

        <View style={styles.ticketTitleContainer}>
          <Text style={styles.ticketName} numberOfLines={2}>
            {ticket.name}
          </Text>
          <Text style={styles.ticketLocation}>
            {ticket.location}
          </Text>
        </View>
      </View>

      <View style={styles.ticketContent}>
        <Text style={styles.ticketDesc} numberOfLines={2}>
          {ticket.desc}
        </Text>

        <View style={styles.ticketTags}>
          <View style={styles.tagBadge}><Text style={styles.tagText}>Có lịch gần nhất</Text></View>
          <View style={styles.tagBadgeOutline}><Text style={styles.tagTextOutline}>Từ {ticket.price}</Text></View>
        </View>

        <View style={styles.ticketFooter}>
          <Text style={styles.availText}>3 lịch khả dụng</Text>
          <View style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>XEM</Text>
            <SymbolView name="arrow.right" size={14} tintColor="#0f172a" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const OFFERS = [
  { id: 1, code: 'DEALCUOITUAN', title: 'Săn deal cuối tuần', desc: 'Giảm 80.000đ', image: 'https://igovi.vn/offers/weekend.webp' },
  { id: 2, code: 'HOIVIEN10', title: 'Ưu đãi tài khoản', desc: 'Giảm 10% tối đa 150K', image: 'https://igovi.vn/offers/member.webp' },
  { id: 3, code: 'SUNWORLD50', title: 'Du lịch giá tốt', desc: 'Giảm 50.000đ', image: 'https://igovi.vn/offers/travel.webp' },
  { id: 4, code: 'BUFFETVANSON', title: 'Đại tiệc vé buffet', desc: 'Mua 3 tặng 1', image: 'https://igovi.vn/demo/sunworld/buffet-food.jpg' },
  { id: 5, code: 'CHAOBANMOI', title: 'Flash sale cáp treo', desc: 'Chỉ từ 199K', image: 'https://igovi.vn/demo/sunworld/cable-car.jpg' },
];

const DESTINATIONS = [
  { id: 1, name: 'Long An', desc: 'Rừng tràm, sông nước', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ' },
  { id: 2, name: 'Đồng Tháp', desc: 'Đồng sen, làng nghề', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFHF8ErsJ_s8qgcwRohNXlIBpRLRCDLHaOHBkAWPH503Yc1EvQtOwca06hCMby8KRlHW5pI3LDUDBaDijFOjxqJ9wzOBa-h1nHbFJo73HSFD_pVnfXVjb9_Mh9yaCewyocdgtetta0cQ4UTa74tycWNIQCBUev62FWlMEVMtUq0zavNNnXM3-j5mT3HADgoyxBE1b2z57gDb7XYfTZzNcsBWRKREaCc_MwrCT9UAyLx9nBtM7s86U1A' },
  { id: 3, name: 'Tây Ninh', desc: 'Núi Bà Đen, cáp treo', image: 'https://igovi.vn/demo/sunworld/cable-car.jpg' },
  { id: 4, name: 'Bến Tre', desc: 'Vườn dừa, miệt vườn', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmV0Qj6Ln0Aq34P5R3c1dBEgTgrA0-xEWyN-eZJDInuVVQLX83mx9BcHmFCmRNyWtVbRy_FsYV5pus8EN4af2_Y49Y7rD0XF3ls-K7InReje95_M_9PiqZAfwsAdMTocTNnhBOO4Ll_SYeAIeeKLoyOVC66M-7gkrGkIIRce20en1D3EJexzlely7gfPcPuyUoli5emmo-8o5H0un3klDhI-ATbuxm_Us83vdsLmXaB9aO9QBJsIYpqg' },
];

const FEATURED = [
  {
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé buffet trưa dùng trong ngày cho khách đã có vé tham quan hoặc muốn đặt thêm dịch vụ ăn uống.',
    price: '250.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
  },
  {
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé tuyến cáp treo Chùa Hang cho khách muốn kết hợp hành hương và tham quan cảnh quan Núi Bà Đen.',
    price: '245.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAQuEjb-Bt5eFuEplUPQGqLDhhRhxOjsE5gF4uv78cqB0WC9ZH3ZB_f7ctnG6NrQJdp13H09dTGE_26sEeXUYIouHmEFqK164P99sYk8fiYe3791lOmhL7AIDV9VDvE8lxk98uJjOi9vqYAphBTeFO6yuYjtcZB6-DZDKF8zfPfmIhgWmHg3RVOw71JKBm-wsZUUOES4ZfOFwkY4PYjEePrGp2UjHhZTn34YIenlI70ZgzeMXwy7H',
  },
  {
    name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé cáp treo khứ hồi lên khu vực Đỉnh Vân Sơn, phù hợp khách săn mây và ngắm toàn cảnh Tây Ninh.',
    price: '400.000đ',
    image: 'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
  },
  {
    name: 'Vé VinWonders Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    desc: 'Khám phá công viên chủ đề lớn nhất Việt Nam với hàng trăm trò chơi hấp dẫn và show diễn triệu đô.',
    price: '950.000đ',
    image: 'https://labantour.com/wp-content/uploads/2020/11/103423248_3588209407868560_8677725992511001004_n.jpg',
  }
];

const TICKETS = [
  ...FEATURED,
  {
    name: 'Combo Núi Bà Đen: Cáp treo Đỉnh Vân Sơn + buffet trưa',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Combo ưu đãi cho khách muốn trải nghiệm ngắm cảnh Đỉnh Vân Sơn và dùng buffet trưa tại nhà hàng.',
    price: '550.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
  },
  {
    name: 'Vé tham quan Làng nổi Tân Lập',
    location: 'Mộc Hóa, Long An',
    desc: 'Vé vào cổng khám phá rừng tràm nguyên sinh Tân Lập, tản bộ trên cung đường đan xuyên rừng rợp mát.',
    price: '85.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
  },
  {
    name: 'Vé chèo thuyền Kayak & Xuồng ba lá Rừng tràm Tân Lập',
    location: 'Mộc Hóa, Long An',
    desc: 'Trải nghiệm chèo kayak hoặc ngồi xuồng ba lá lướt trên mặt nước rừng tràm thanh bình.',
    price: '120.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
  },
  {
    name: 'Vé tham quan Khu du lịch Tràm Chim Đồng Tháp',
    location: 'Tam Nông, Đồng Tháp',
    desc: 'Chiêm ngưỡng hệ sinh thái đất ngập nước quý hiếm với sếu đầu đỏ và thảm thực vật đặc trưng Đồng Tháp Mười.',
    price: '120.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFHF8ErsJ_s8qgcwRohNXlIBpRLRCDLHaOHBkAWPH503Yc1EvQtOwca06hCMby8KRlHW5pI3LDUDBaDijFOjxqJ9wzOBa-h1nHbFJo73HSFD_pVnfXVjb9_Mh9yaCewyocdgtetta0cQ4UTa74tycWNIQCBUev62FWlMEVMtUq0zavNNnXM3-j5mT3HADgoyxBE1b2z57gDb7XYfTZzNcsBWRKREaCc_MwrCT9UAyLx9nBtM7s86U1A',
  },
  {
    name: 'Vé tham quan & Trải nghiệm Đồng Sen Tháp Mười',
    location: 'Tháp Mười, Đồng Tháp',
    desc: 'Check-in cầu gỗ giữa bạt ngàn hoa sen hồng, chèo thuyền hái sen và thưởng thức các món ăn từ sen.',
    price: '80.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFHF8ErsJ_s8qgcwRohNXlIBpRLRCDLHaOHBkAWPH503Yc1EvQtOwca06hCMby8KRlHW5pI3LDUDBaDijFOjxqJ9wzOBa-h1nHbFJo73HSFD_pVnfXVjb9_Mh9yaCewyocdgtetta0cQ4UTa74tycWNIQCBUev62FWlMEVMtUq0zavNNnXM3-j5mT3HADgoyxBE1b2z57gDb7XYfTZzNcsBWRKREaCc_MwrCT9UAyLx9nBtM7s86U1A',
  },
  {
    name: 'Vé chèo xuồng & Tour miệt vườn Bến Tre',
    location: 'Châu Thành, Bến Tre',
    desc: 'Đi xuồng ba lá len lỏi trong rạch dừa nước, thưởng thức trà mật ong và kẹo dừa nóng tại lò.',
    price: '150.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmV0Qj6Ln0Aq34P5R3c1dBEgTgrA0-xEWyN-eZJDInuVVQLX83mx9BcHmFCmRNyWtVbRy_FsYV5pus8EN4af2_Y49Y7rD0XF3ls-K7InReje95_M_9PiqZAfwsAdMTocTNnhBOO4Ll_SYeAIeeKLoyOVC66M-7gkrGkIIRce20en1D3EJexzlely7gfPcPuyUoli5emmo-8o5H0un3klDhI-ATbuxm_Us83vdsLmXaB9aO9QBJsIYpqg',
  },
  {
    name: 'Vé Khu du lịch sinh thái Lan Vương Bến Tre',
    location: 'TP. Bến Tre, Bến Tre',
    desc: 'Vui chơi tát mương bắt cá, chèo xuồng ba lá, đu dây giăng và thưởng thức ẩm thực dân dã Nam Bộ.',
    price: '100.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmV0Qj6Ln0Aq34P5R3c1dBEgTgrA0-xEWyN-eZJDInuVVQLX83mx9BcHmFCmRNyWtVbRy_FsYV5pus8EN4af2_Y49Y7rD0XF3ls-K7InReje95_M_9PiqZAfwsAdMTocTNnhBOO4Ll_SYeAIeeKLoyOVC66M-7gkrGkIIRce20en1D3EJexzlely7gfPcPuyUoli5emmo-8o5H0un3klDhI-ATbuxm_Us83vdsLmXaB9aO9QBJsIYpqg',
  },
  {
    name: 'Vé tắc ráng tham quan Rừng tràm Trà Sư',
    location: 'Tịnh Biên, An Giang',
    desc: 'Trải nghiệm tắc ráng lướt trên thảm bèo cám xanh mướt ngắm các loài chim nước quý hiếm tại Trà Sư.',
    price: '100.000đ',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Vé Cáp treo Núi Cấm An Giang (Khu du lịch Lâm Viên)',
    location: 'Tịnh Biên, An Giang',
    desc: 'Cáp treo lên đỉnh Núi Cấm viếng tượng Phật Di Lặc khổng lồ trên đỉnh núi và ngắm hồ Thủy Liêm.',
    price: '200.000đ',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Vé Cáp treo Hòn Thơm Phú Quốc (Sun World)',
    location: 'Phú Quốc, Kiên Giang',
    desc: 'Cáp treo 3 dây vượt biển dài nhất thế giới ngắm nhìn toàn cảnh quần đảo An Thới tuyệt đẹp.',
    price: '650.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
  },
  {
    name: 'Vé Vinpearl Safari Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    desc: 'Công viên chăm sóc và bảo tồn động vật bán hoang dã lớn nhất Việt Nam.',
    price: '650.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAGzag4JWCmqBtN4mYGy6MERp-frzyeBC6nRoGOAPRwvo_KRQv212W5LFMkH4h-aNMgVbvRcmo8YRhRZ0xjAevClzlZ2h59cQeAt_-ciE-QVymPMePoC1eTnJmazNG68usffuP6JhObJw0K-OPnLmNotdYxlLwsizfiP-xNl_jtEmdYKUE-iVJqyk2pdB5IxCECOQwlcjkzH29D3-Kqy2z0oEo2wI1YxaRAjBBi4fQOaqWRaGrdT_Q',
  },
  {
    name: 'Vé Show Tinh Hoa Việt Nam & Grand World Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    desc: 'Mãn nhãn với đại cảnh nghệ thuật sân khấu mặt nước hoành tráng tái hiện lịch sử ngàn năm.',
    price: '250.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpdnq32CxUpTr_pSlBgV5-jfSeK_Q2H14FGBJ9aSfxvNintVaIatDLrTyN5abKcqlW9OYN9rNk7zVMFTBjHwiHwEOXSRnfLlbt_eJ5PxYK4EIJ7AL7pkvzYVrK7PAW8kZf_xT9ifr9MeCVD6I6GCmhTuEuQOZlWmv7GoSR9lmx7aekv8lVxqX2uUksmK4tbS2Zaj9_y3gENTL3Vr05K_BO8EHjX4xokTVc4UpCf9IMc1ABZ0QjJOc',
  },
  {
    name: 'Vé Sun World Hạ Long Complex',
    location: 'Hạ Long, Quảng Ninh',
    desc: 'Khám phá Công viên Rồng, Công viên Nước Vịnh Lốc Xoáy và Cáp treo Nữ Hoàng.',
    price: '350.000đ',
    image: 'https://res.klook.com/image/upload/w_1265,h_791,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/sytsmedhoitvwcasveut.webp',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
  },
  {
    name: 'Tour Săn Mây Cầu Đất Đà Lạt 1 ngày',
    location: 'Đà Lạt, Lâm Đồng',
    desc: 'Đón bình minh trên đồi chè Cầu Đất và săn biển mây bồng bềnh tuyệt đẹp.',
    price: '280.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
  },
  {
    name: 'Vé Máng trượt Datanla New Alpine Coaster',
    location: 'Đà Lạt, Lâm Đồng',
    desc: 'Tuyến máng trượt băng rừng dài nhất Đông Nam Á dẫn xuống thác Datanla tuyệt đẹp.',
    price: '250.000đ',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Vé Cáp treo Đồi Robin - Thiền Viện Trúc Lâm',
    location: 'Đà Lạt, Lâm Đồng',
    desc: 'Ngắm nhìn toàn cảnh thành phố sương mù và rừng thông bạt ngàn từ trên cao.',
    price: '120.000đ',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Vé Khu du lịch Cáp treo Hồ Mây Park trọn gói',
    location: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
    desc: 'Tổ hợp vui chơi giải trí trên đỉnh Núi Lớn bao gồm cáp treo khứ hồi và hơn 100 trò chơi.',
    price: '400.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAQuEjb-Bt5eFuEplUPQGqLDhhRhxOjsE5gF4uv78cqB0WC9ZH3ZB_f7ctnG6NrQJdp13H09dTGE_26sEeXUYIouHmEFqK164P99sYk8fiYe3791lOmhL7AIDV9VDvE8lxk98uJjOi9vqYAphBTeFO6yuYjtcZB6-DZDKF8zfPfmIhgWmHg3RVOw71JKBm-wsZUUOES4ZfOFwkY4PYjEePrGp2UjHhZTn34YIenlI70ZgzeMXwy7H',
  },
  {
    name: 'Vé Công viên nước Vũng Tàu Marina & Du thuyền',
    location: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
    desc: 'Trải nghiệm chèo kayak, cano và chụp ảnh tại bến du thuyền rực rỡ sắc màu.',
    price: '180.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
  },
  {
    name: 'Vé Công viên Tropicana Park Hồ Tràm',
    location: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
    desc: 'Thiên đường giải trí công viên nước lấy cảm hứng từ văn hóa Polynesia độc đáo.',
    price: '190.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpdnq32CxUpTr_pSlBgV5-jfSeK_Q2H14FGBJ9aSfxvNintVaIatDLrTyN5abKcqlW9OYN9rNk7zVMFTBjHwiHwEOXSRnfLlbt_eJ5PxYK4EIJ7AL7pkvzYVrK7PAW8kZf_xT9ifr9MeCVD6I6GCmhTuEuQOZlWmv7GoSR9lmx7aekv8lVxqX2uUksmK4tbS2Zaj9_y3gENTL3Vr05K_BO8EHjX4xokTVc4UpCf9IMc1ABZ0QjJOc',
  },
  {
    name: 'Vé VinWonders Nha Trang (Hòn Tre)',
    location: 'Nha Trang, Khánh Hòa',
    desc: 'Khu vui chơi giải trí kỷ lục với cáp treo vượt biển, show Tata và công viên nước.',
    price: '800.000đ',
    image: 'https://labantour.com/wp-content/uploads/2020/11/103423248_3588209407868560_8677725992511001004_n.jpg',
  },
  {
    name: 'Tour 3 Đảo Nha Trang VIP ngắm san hô',
    location: 'Nha Trang, Khánh Hòa',
    desc: 'Khám phá Hòn Mun, Làng Chài và Bãi Tranh kèm bữa trưa hải sản tươi sống.',
    price: '450.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
  },
  {
    name: 'Vé Tắm bùn khoáng nóng I-Resort Nha Trang',
    location: 'Nha Trang, Khánh Hòa',
    desc: 'Trải nghiệm ngâm khoáng nóng và bùn khoáng thiên nhiên tốt cho sức khỏe.',
    price: '260.000đ',
    image: 'https://tanthoidai.com.vn/images/products/2020/11/06/132491321181670064.jpeg',
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8f2' },
  scrollContent: { paddingBottom: 80 },

  heroContainer: { height: 440, width: '100%', position: 'relative' },
  heroSection: { width: width, height: 440, position: 'relative', backgroundColor: '#102923', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 25, 21, 0.75)',
    padding: 24,
    justifyContent: 'center'
  },
  badgeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  badgeText: { backgroundColor: '#c85e3a', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4, textTransform: 'uppercase' },
  badgeTextOutline: { backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4, textTransform: 'uppercase', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },

  heroTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 16, lineHeight: 40 },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22, marginBottom: 16 },

  heroInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  heroLocation: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroInfoText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },

  heroActionRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  heroBtn: { backgroundColor: '#c85e3a', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, gap: 8 },
  heroBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  heroPriceBox: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)', paddingLeft: 16 },
  heroPriceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  heroPriceVal: { color: '#ffd7b8', fontSize: 20, fontWeight: '700' },

  pagination: {
    position: 'absolute',
    bottom: 54, // Positioned above the search box which is -30 margin top
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    zIndex: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },

  searchSection: { marginTop: -30, paddingHorizontal: 16, zIndex: 10 },
  searchForm: { backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#0e2a23', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.16, shadowRadius: 30, elevation: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  searchInputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbfaf6', paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  searchLabel: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', marginBottom: 4, opacity: 0.5 },
  searchInput: { fontSize: 14, fontWeight: '600', color: '#0f172a', padding: 0 },
  separator: { height: 6 },
  searchButton: { backgroundColor: '#12382f', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 6, marginTop: 6, gap: 8 },
  searchButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },

  quickFilters: { marginTop: 16, flexDirection: 'row', alignItems: 'center' },
  quickFilterLabel: { fontSize: 10, fontWeight: 'bold', color: 'rgba(15,23,42,0.42)', textTransform: 'uppercase', marginRight: 12, letterSpacing: 1 },
  quickFilterItem: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  quickFilterItemActive: { borderColor: 'rgba(22,139,88,0.35)', backgroundColor: '#f0fdf4' },
  quickFilterItemText: { fontSize: 12, fontWeight: '600', color: 'rgba(15,23,42,0.72)' },
  quickFilterItemTextActive: { color: '#168b58' },

  listSection: { padding: 16, marginTop: 16 },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  listSubTitle: { fontSize: 12, fontWeight: 'bold', color: '#c85e3a', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  listTitle: { fontSize: 22, fontWeight: '700', color: '#0f172a', maxWidth: width - 110 },
  countBadge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 4,
  },
  countBadgeText: {
    color: '#168b58',
    fontSize: 12,
    fontWeight: '700',
  },

  ticketGrid: { gap: 16 },
  ticketCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  ticketImageContainer: { height: 200, width: '100%', position: 'relative' },
  ticketImage: { width: '100%', height: '100%' },
  ticketImageOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  ticketBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  ticketBadgeText: { color: '#168b58', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },

  ticketTitleContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 16,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ticketName: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4, lineHeight: 24 },
  ticketLocation: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },

  ticketContent: { padding: 16 },
  ticketDesc: { fontSize: 13, color: 'rgba(15,23,42,0.56)', lineHeight: 22, marginBottom: 12 },

  ticketTags: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tagBadge: { backgroundColor: '#eef5f0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  tagText: { color: 'rgba(15,23,42,0.54)', fontSize: 10, fontWeight: '700' },
  tagBadgeOutline: { backgroundColor: '#f7f3ea', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  tagTextOutline: { color: 'rgba(15,23,42,0.54)', fontSize: 10, fontWeight: '700' },

  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  availText: { color: '#168b58', fontSize: 11, fontWeight: '700' },
  viewMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewMoreText: { fontSize: 11, fontWeight: '700', color: '#0f172a', textTransform: 'uppercase' },

  suggestionsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#334155',
  },
  

  offersSection: { paddingVertical: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 16, marginBottom: 16 },
  sectionBadge: { fontSize: 10, fontWeight: '800', color: '#168b58', marginBottom: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  sectionLink: { fontSize: 13, fontWeight: '700', color: '#168b58' },
  offersScroll: { paddingHorizontal: 16, gap: 16, paddingBottom: 10 },
  offerCard: { width: 280, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5 },
  offerImage: { width: '100%', height: 130 },
  offerContent: { padding: 16 },
  offerTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  offerDesc: { fontSize: 13, fontWeight: '600', color: '#f45b0b' },
  
  destinationsSection: { paddingVertical: 24, backgroundColor: '#f8fafc' },
  destinationsScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 10 },
  destinationCard: { width: 140, height: 180, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  destinationImage: { width: '100%', height: '100%' },
  destinationOverlay: { ...(StyleSheet.absoluteFill as any), backgroundColor: 'rgba(0,0,0,0.25)' },
  destinationContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12 },
  destinationTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 2 },
  destinationDesc: { fontSize: 10, fontWeight: '500', color: 'rgba(255,255,255,0.9)', lineHeight: 14 },

  provinceHighlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  provinceHighlightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  provincePinBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#168b58',
    justifyContent: 'center',
    alignItems: 'center',
  },
  provinceHighlightTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  liveFilterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginLeft: 6,
  },
  provinceHighlightName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#064e3b',
    marginTop: 2,
  },
  provinceHighlightDesc: {
    fontSize: 12,
    color: '#065f46',
    marginTop: 2,
  },
  clearFilterBadgeBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  clearFilterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
});
