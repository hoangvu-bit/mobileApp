import React, { useState, useMemo, useRef } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalFooter from '../components/global-footer';

export default function HomeScreen() {
  // const insets = useSafeAreaInsets();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

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
      }
    });
  };

  const handleSelectDestination = (dest: { name: string }) => {
    setShowDropdown(false);
    Keyboard.dismiss();
    router.push({
      pathname: '/ve-du-lich',
      params: {
        location: dest.name,
      }
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
    <View style={[styles.container]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!showDropdown}
        onScrollBeginDrag={() => {
          Keyboard.dismiss();
        }}
      >
        {/* Dismiss Backdrop when dropdown is open (placed before searchSection so touches inside search/dropdown take priority) */}
        {showDropdown && (
          <Pressable
            style={styles.outsideBackdrop}
            onPress={() => {
              setShowDropdown(false);
              Keyboard.dismiss();
            }}
          />
        )}

        {/* Search Hero Section with Dropdown */}
        <View style={[styles.searchSection, showDropdown && { zIndex: 30 }]}>
          <Pressable 
            style={styles.searchBox}
            onPress={() => {
              setShowDropdown(true);
              inputRef.current?.focus();
            }}
          >
            <SymbolView name="magnifyingglass" size={20} tintColor="#94a3b8" style={{ marginLeft: 12 }} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Tìm điểm đến, tour, vé, khách sạn, ẩm thực..."
              placeholderTextColor="#94a3b8"
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
                style={styles.clearButton} 
                onPress={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </Pressable>
            )}
            <Pressable 
              style={styles.searchButton} 
              onPress={() => {
                if (searchQuery.trim()) {
                  handleSearchSubmit();
                } else {
                  setShowDropdown(!showDropdown);
                  if (!showDropdown) inputRef.current?.focus();
                }
              }}
            >
              <SymbolView name="magnifyingglass" size={16} tintColor="#fff" />
            </Pressable>
          </Pressable>

          {/* Search Dropdown: Top Dịch Vụ Nổi Bật & Điểm Đến Theo Xu Hướng */}
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

              {/* Scrollable list inside dropdown: user can scroll up and down smoothly */}
              <ScrollView 
                style={styles.dropdownInnerScroll}
                contentContainerStyle={styles.dropdownInnerContent}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                bounces={true}
              >
                {/* Section 1: Top dịch vụ nổi bật */}
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
                        style={({ pressed }) => [styles.serviceItemRow, pressed && { backgroundColor: '#f8fafc' }]}
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

                {/* Section Divider */}
                <View style={styles.dropdownDivider} />

                {/* Section 2: Điểm đến theo xu hướng */}
                <View style={styles.dropdownSection}>
                  <View style={styles.dropdownSectionHeader}>
                    <View style={styles.sectionHeaderLeft}>
                      <SymbolView name="mappin.circle.fill" size={18} tintColor="#168b58" style={{ marginRight: 6 }} />
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
                        style={({ pressed }) => [styles.serviceItemRow, pressed && { backgroundColor: '#f8fafc' }]}
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
                        <SymbolView name="chevron.right" size={14} tintColor="#cbd5e1" />
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

        {/* Categories Horizontal Scroll */}
        <View style={styles.categoryScrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  if (cat.link) router.push(cat.link as any);
                }}
              >
                <View style={styles.categoryItemHorizontal}>
                  <View style={[styles.categoryIconBoxHorizontal, { backgroundColor: cat.bgColor }]}>
                    {cat.image ? (
                      <Image source={cat.image} style={styles.categoryIconImage} contentFit="contain" />
                    ) : (
                      <SymbolView name={cat.icon as any} size={28} tintColor={cat.color} />
                    )}
                  </View>
                  <Text style={styles.categoryTextHorizontal} numberOfLines={2}>{cat.name}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Cảm Hứng Cho Chuyến Đi - Bạn muốn đi đâu tiếp theo? */}
        <View style={styles.destinationSection}>
          <View style={styles.destinationHeader}>
            <View style={styles.destinationHeaderLeft}>
              <Text style={styles.destinationSubTitle}>CẢM HỨNG CHO CHUYẾN ĐI</Text>
              <Text style={styles.destinationMainTitle}>Bạn muốn đi đâu tiếp theo?</Text>
              <Text style={styles.destinationDesc}>Những điểm đến được quan tâm với nhiều lựa chọn vé, tour và lưu trú trên igovi.</Text>
            </View>
            <Pressable 
              style={styles.seeAllDestBtn}
              onPress={() => router.push('/ve-du-lich')}
              hitSlop={8}
            >
              <Text style={styles.seeAllDestText}>Xem điểm đến →</Text>
            </Pressable>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.destinationScroll}
          >
            {INSPIRATION_DESTINATIONS.map((dest) => (
              <Pressable
                key={dest.id}
                style={styles.destCard}
                onPress={() => handleSelectDestination(dest)}
              >
                <Image source={{ uri: dest.image }} style={styles.destCardImage} contentFit="cover" />
                <View style={styles.destCardOverlay}>
                  <Text style={styles.destCardTitle}>{dest.name}</Text>
                  <Text style={styles.destCardDesc} numberOfLines={2}>{dest.desc}</Text>
                  <View style={styles.destActionRow}>
                    <Text style={styles.destActionText}>Xem trải nghiệm →</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Exclusive Offers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionSubTitle}>ĐẶC QUYỀN IGOVI</Text>
              <Text style={styles.sectionTitle}>Ưu đãi dành cho bạn</Text>
            </View>
            <Pressable onPress={() => router.push('/uu-dai')}>
              <Text style={styles.seeAllText}>Xem tất cả ›</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            <Pressable 
              style={[styles.offerCard, { backgroundColor: '#ea4435' }]}
              onPress={() => router.push({ pathname: '/chi-tiet-uu-dai', params: { code: 'CHAOBANMOI' } })}
            >
              <View>
                <View style={styles.offerTag}><Text style={styles.offerTagText}>Chào bạn mới</Text></View>
                <Text style={styles.offerTitle}>Ưu đãi khách mới</Text>
                <Text style={styles.offerDesc}>Giảm 15% cho đơn tour đầu tiên</Text>
              </View>
              <View style={styles.offerButton}>
                <Text style={styles.offerButtonText}>Xem chi tiết ›</Text>
              </View>
            </Pressable>
            <Pressable 
              style={[styles.offerCard, { backgroundColor: '#00897b' }]}
              onPress={() => router.push({ pathname: '/chi-tiet-uu-dai', params: { code: 'DEALCUOITUAN' } })}
            >
              <View>
                <View style={styles.offerTag}><Text style={styles.offerTagText}>Cuối tuần rực rỡ</Text></View>
                <Text style={styles.offerTitle}>Săn deal cuối tuần</Text>
                <Text style={styles.offerDesc}>Giảm đến 80.000đ vé vào cổng</Text>
              </View>
              <View style={[styles.offerButton, { backgroundColor: '#fff' }]}>
                <Text style={[styles.offerButtonText, { color: '#00897b' }]}>Xem chi tiết ›</Text>
              </View>
            </Pressable>
          </ScrollView>
        </View>

        {/* Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gợi ý để bắt đầu</Text>
            <Pressable onPress={() => router.push('/ve-du-lich')}>
              <Text style={[styles.seeAllText, { color: '#ea580c' }]}>Khám phá ›</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {SUGGESTIONS.map((item, idx) => (
              <Pressable
                key={idx}
                style={styles.suggestionCard}
                onPress={() => router.push('/ve-du-lich')}
              >
                <View style={styles.suggestionImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.suggestionImage} />
                  <View style={[styles.suggestionBadge, { backgroundColor: item.badgeColor }]}>
                    <Text style={styles.suggestionBadgeText}>{item.badge}</Text>
                  </View>
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.suggestionPriceContainer}>
                    <Text style={styles.suggestionPriceLabel}>Từ</Text>
                    <Text style={styles.suggestionPrice}>{item.price}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <GlobalFooter />
      </ScrollView>
    </View>
  );
}

const CATEGORIES = [
  {
    name: 'Vé du lịch',
    image: require('../../assets/images/categories/ticket.jpg'),
    icon: 'ticket.fill',
    bgColor: '#fffbeb',
    color: '#d97706',
    link: '/ve-du-lich'
  },
  {
    name: 'Lưu trú',
    image: require('../../assets/images/categories/hotel.jpg'),
    icon: 'bed.double.fill',
    bgColor: '#eff6ff',
    color: '#2563eb',
    link: '/luu-tru'
  },
  {
    name: 'Tour trải nghiệm',
    image: require('../../assets/images/categories/tour.jpg'),
    icon: 'mountain.2.fill',
    bgColor: '#f5f3ff',
    color: '#9333ea',
    link: '/tour'
  },
  {
    name: 'Khu sinh thái',
    image: require('../../assets/images/categories/eco.jpg'),
    icon: 'leaf.fill',
    bgColor: '#ecfdf5',
    color: '#16a34a',
    link: '/khu-sinh-thai'
  },
  {
    name: 'Ẩm thực',
    image: require('../../assets/images/categories/food.jpg'),
    icon: 'fork.knife',
    bgColor: '#fff1ee',
    color: '#ea580c',
    link: '/am-thuc'
  },
  {
    name: 'Điểm di tích',
    image: require('../../assets/images/categories/heritage.jpg'),
    icon: 'building.columns.fill',
    bgColor: '#fef2f2',
    color: '#dc2626',
    link: '/diem-di-tich'
  },
  {
    name: 'Bản đồ số',
    image: require('../../assets/images/categories/map.jpg'),
    icon: 'map.fill',
    bgColor: '#eef2ff',
    color: '#4f46e5',
    link: '/ban-do-so'
  },
  {
    name: 'Cẩm nang',
    image: require('../../assets/images/categories/guide.jpg'),
    icon: 'book.closed.fill',
    bgColor: '#f0fdfa',
    color: '#0d9488',
    link: '/cam-nang'
  },
  {
    name: 'Ưu đãi tiết kiệm',
    image: require('../../assets/images/categories/deals.jpg'),
    icon: 'percent',
    bgColor: '#fee2e2',
    color: '#dc2626',
    link: '/uu-dai'
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
    desc: 'Vé buffet trưa tại nhà hàng Vân Sơn Đỉnh Núi Bà Đen với hơn 80 món ăn phong phú từ đặc sản Tây Ninh đến ẩm thực Á Âu.',
  },
  {
    id: 2,
    rank: 2,
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    category: 'Vé du lịch',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '250.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAQuEjb-Bt5eFuEplUPQGqLDhhRhxOjsE5gF4uv78cqB0WC9ZH3ZB_f7ctnG6NrQJdp13H09dTGE_26sEeXUYIouHmEFqK164P99sYk8fiYe3791lOmhL7AIDV9VDvE8lxk98uJjOi9vqYAphBTeFO6yuYjtcZB6-DZDKF8zfPfmIhgWmHg3RVOw71JKBm-wsZUUOES4ZfOFwkY4PYjEePrGp2UjHhZTn34YIenlI70ZgzeMXwy7H',
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
  {
    id: 4,
    rank: 4,
    name: 'Combo Núi Bà Đen: Cáp treo Đỉnh Vân Sơn + buffet trưa',
    category: 'Vé du lịch',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '550.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
    desc: 'Combo trọn gói tiết kiệm trải nghiệm đỉnh cao: cáp treo Vân Sơn khứ hồi kết hợp đại tiệc buffet trưa tại nhà hàng Vân Sơn.',
  },
  {
    id: 5,
    rank: 5,
    name: 'Vé tham quan Làng nổi Tân Lập',
    category: 'Vé du lịch',
    location: 'Mộc Hóa, Long An',
    price: '85.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
    desc: 'Vé vào cổng khám phá rừng tràm nguyên sinh Tân Lập, tản bộ trên con đường xi măng xuyên rừng tràm độc đáo nhất Việt Nam.',
  },
];

const INSPIRATION_DESTINATIONS = [
  {
    id: 1,
    name: 'Long An',
    desc: 'Rừng tràm, sông nước và trải nghiệm bản địa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
  },
  {
    id: 2,
    name: 'Đồng Tháp',
    desc: 'Đồng sen, làng nghề và mùa nước nổi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFHF8ErsJ_s8qgcwRohNXlIBpRLRCDLHaOHBkAWPH503Yc1EvQtOwca06hCMby8KRlHW5pI3LDUDBaDijFOjxqJ9wzOBa-h1nHbFJo73HSFD_pVnfXVjb9_Mh9yaCewyocdgtetta0cQ4UTa74tycWNIQCBUev62FWlMEVMtUq0zavNNnXM3-j5mT3HADgoyxBE1b2z57gDb7XYfTZzNcsBWRKREaCc_MwrCT9UAyLx9nBtM7s86U1A',
  },
  {
    id: 3,
    name: 'Bến Tre',
    desc: 'Vườn dừa, miệt vườn và nhịp sống Mekong',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmV0Qj6Ln0Aq34P5R3c1dBEgTgrA0-xEWyN-eZJDInuVVQLX83mx9BcHmFCmRNyWtVbRy_FsYV5pus8EN4af2_Y49Y7rD0XF3ls-K7InReje95_M_9PiqZAfwsAdMTocTNnhBOO4Ll_SYeAIeeKLoyOVC66M-7gkrGkIIRce20en1D3EJexzlely7gfPcPuyUoli5emmo-8o5H0un3klDhI-ATbuxm_Us83vdsLmXaB9aO9QBJsIYpqg',
  },
  {
    id: 4,
    name: 'An Giang',
    desc: 'Núi rừng, văn hóa và ẩm thực miền Tây',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Tây Ninh',
    desc: 'Núi Bà Đen, cáp treo và văn hóa Nam Bộ',
    image: 'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
  },
  {
    id: 6,
    name: 'Lâm Đồng',
    desc: 'Cao nguyên, rừng thông và khí hậu trong lành',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
  },
];

const TRENDING_DESTINATIONS = INSPIRATION_DESTINATIONS.map((d, index) => ({
  ...d,
  rank: index + 1,
}));

const SUGGESTIONS = [
  {
    title: 'Buffet trưa Vân Sơn Núi Bà Đen',
    price: '250.000đ',
    badge: 'Vé QR tức thì',
    badgeColor: '#059669',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ'
  },
  {
    title: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    price: '245.000đ',
    badge: 'Bán chạy',
    badgeColor: '#f97316',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAQuEjb-Bt5eFuEplUPQGqLDhhRhxOjsE5gF4uv78cqB0WC9ZH3ZB_f7ctnG6NrQJdp13H09dTGE_26sEeXUYIouHmEFqK164P99sYk8fiYe3791lOmhL7AIDV9VDvE8lxk98uJjOi9vqYAphBTeFO6yuYjtcZB6-DZDKF8zfPfmIhgWmHg3RVOw71JKBm-wsZUUOES4ZfOFwkY4PYjEePrGp2UjHhZTn34YIenlI70ZgzeMXwy7H'
  },
  {
    title: 'Vé cáp treo Đỉnh Núi Vân Sơn khứ hồi',
    price: '350.000đ',
    badge: 'Ưu đãi',
    badgeColor: '#0d9488',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTQM5ESMJevGiwAHx1fFX_wLxgo4itlZDhgJ0eONMbSIMMreLqKuDxt6UsiNe3g8LFfA6CLUOVA0o9BgptYKQx61G4wgUb4oS8u-xxLVFuFRFEJMSjpeYMlCHQejlxE2kE8GG_xxKf4IIxncz8mNRlPp2ZeKrTfc-rDsS4bgdda0ANDJgvow6DnsBt2bHFl_DQIDR0B36w9PxRynWGkhj9VCsArrnJg3XcoFUP220Cu0-aksICe5UM'
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scrollContent: { paddingBottom: 80 },

  searchSection: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 16, 
    paddingTop: 12, 
    paddingBottom: 16,
    zIndex: 30,
  },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    borderWidth: 1.5, 
    borderColor: '#e2e8f0', 
    overflow: 'hidden',
    paddingRight: 4,
  },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 10, fontSize: 14, color: '#1e293b' },
  clearButton: { paddingHorizontal: 8, paddingVertical: 6, justifyContent: 'center', alignItems: 'center' },
  clearButtonText: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold' },
  searchButton: { 
    backgroundColor: '#ea580c', 
    padding: 10, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginVertical: 4 
  },

  outsideBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    zIndex: 10,
  },

  dropdownCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  dropdownIndicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },
  collapseBtn: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  collapseBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  dropdownInnerScroll: {
    maxHeight: 440,
  },
  dropdownInnerContent: {
    paddingBottom: 16,
  },

  dropdownSection: {
    marginTop: 4,
  },
  dropdownSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  dropdownSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  seeAllOrange: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ea580c',
  },
  seeAllGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: '#168b58',
  },

  serviceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f8fafc',
  },
  thumbContainer: {
    position: 'relative',
    marginRight: 12,
    width: 48,
    height: 48,
  },
  serviceThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  rankBadgeOrange: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: '#ea580c',
    width: 17,
    height: 17,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  rankBadgeGreen: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: '#168b58',
    width: 17,
    height: 17,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  rankBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  serviceInfoCol: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 3,
  },
  serviceSub: {
    fontSize: 11,
    color: '#64748b',
  },
  servicePriceCol: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
  },

  dropdownDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  emptyResultText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 12,
  },

  categoryScrollContainer: { backgroundColor: '#fff', paddingBottom: 20, paddingTop: 10 },
  categoryScroll: { paddingHorizontal: 16, gap: 14, alignItems: 'flex-start' },
  categoryItemHorizontal: { width: 72, alignItems: 'center' },
  categoryIconBoxHorizontal: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  categoryIconImage: { width: 52, height: 52, borderRadius: 14 },
  categoryTextHorizontal: { fontSize: 11, fontWeight: '700', color: '#1e293b', textAlign: 'center', lineHeight: 16 },

  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionSubTitle: { fontSize: 10, fontWeight: '900', color: '#00897b', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  seeAllText: { fontSize: 12, fontWeight: '600', color: '#00897b' },

  hScroll: { gap: 12 },
  offerCard: { width: 280, height: 142, borderRadius: 16, padding: 16, justifyContent: 'space-between' },
  offerTag: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  offerTagText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  offerTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  offerDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  offerButton: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  offerButtonText: { color: '#ea4435', fontSize: 11, fontWeight: 'bold' },

  suggestionCard: { width: 150, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9' },
  suggestionImageContainer: { height: 112, width: '100%', backgroundColor: '#f1f5f9' },
  suggestionImage: { width: '100%', height: '100%' },
  suggestionBadge: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  suggestionBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  suggestionContent: { padding: 10, justifyContent: 'space-between', flex: 1 },
  suggestionTitle: { fontSize: 12, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  suggestionPriceContainer: { marginTop: 'auto' },
  suggestionPriceLabel: { fontSize: 10, color: '#94a3b8' },
  suggestionPrice: { fontSize: 12, fontWeight: '900', color: '#ea580c' },

  destinationSection: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    marginBottom: 8,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  destinationHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  destinationSubTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#168b58',
    letterSpacing: 0.6,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  destinationMainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  destinationDesc: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 18,
  },
  seeAllDestBtn: {
    paddingTop: 6,
  },
  seeAllDestText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#168b58',
  },
  destinationScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  destCard: {
    width: 172,
    height: 250,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  destCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  destCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 36,
    backgroundColor: 'rgba(5, 25, 21, 0.72)',
  },
  destCardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  destCardDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  destActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destActionText: {
    color: '#6ee7b7',
    fontSize: 12,
    fontWeight: '700',
  },
});
