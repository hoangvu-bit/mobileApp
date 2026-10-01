import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
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

const removeVietnameseTones = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

const TRENDING_SEARCH_TAGS = [
  'Núi Bà Đen',
  'Cáp treo',
  'Buffet Vân Sơn',
  'Phú Quốc',
  'Đà Nẵng',
  'Nha Trang',
  'Khách sạn',
];

const ALL_SEARCH_ITEMS = [
  {
    id: 's1',
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    category: 'Vé du lịch',
    badgeType: 'ticket',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '245.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqVXZ8F0ZEGdzLQ7AZKFoFE134YhpBxkEVB2onrC8asFTuDxYPrXytUCqb2YvMVJFKPBL4H3zkLfSV6FlUybL1y0UKbTdJD1s-GXBfC6dPxxoLBZ1-4DomPtKOoPuFO_T3FqSEGufm3mWUBaUdK7r02mibbb24yESeClIn4TFJSpWd0Z22fw9HqLDENx-DphzFeAFSYL7Div2L5XDQLybUdEylUnqZmfS0nClJmLngW-D4OwthDD0azQ',
    desc: 'Tuyến cáp treo Chùa Hang dẫn thẳng đến quần thể Chùa Bà hơn 300 năm tuổi, thuận tiện cho hành hương lễ Phật.',
  },
  {
    id: 's2',
    name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
    category: 'Vé du lịch',
    badgeType: 'ticket',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '400.000đ',
    image: 'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
    desc: 'Cáp treo khứ hồi chinh phục "Nóc nhà Nam Bộ" ở độ cao 986m, chiêm bái tượng Phật Bà Tây Bổ Đà Sơn.',
  },
  {
    id: 's3',
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    category: 'Ẩm thực & Buffet',
    badgeType: 'ticket',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '250.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCTuj_eUkEwd2SlqCUgxyQa3RPi8VS00IOFXzVrHMzp_xJhdonkEZZoF6vOB4fTrrSmqSXs580PWJ6WHmqvfGId42KF5rnUENfsNYAbczEWU7YN8EsAOrTZaaun9DBScKQr-QOWBP6mXBpsFMl-BWIsfGAJ_r84Bu1tderCiRG_rcV0KBB3nY7hg-hsdPMocz8IE2Ym70ygz4_FLrYHr6IyYq8nWyekvq-I5HYg3nvIBmMwHEmA_m8dQ',
    desc: 'Vé buffet trưa tại nhà hàng Vân Sơn Đỉnh Núi Bà Đen với hơn 80 món ăn phong phú từ đặc sản Tây Ninh đến ẩm thực Á Âu.',
  },
  {
    id: 's4',
    name: 'Combo Núi Bà Đen: Cáp treo Đỉnh Vân Sơn + buffet trưa',
    category: 'Combo Ưu đãi',
    badgeType: 'ticket',
    location: 'TP. Tây Ninh, Tây Ninh',
    price: '550.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
    desc: 'Combo ưu đãi trọn gói vé cáp treo đỉnh Vân Sơn và tiệc buffet Vân Sơn đỉnh núi.',
  },
  {
    id: 's5',
    name: 'Vé VinWonders & Vinpearl Safari Phú Quốc',
    category: 'Vé vui chơi',
    badgeType: 'ticket',
    location: 'Phú Quốc, Kiên Giang',
    price: '950.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD-1vQn-N-xHfg9t-p_Xl0bH03jH1wX-p-FjC4Bwz2f0R1s7Bw_q_Y7t7Lh_eD9t2Xb9M8VJg',
    desc: 'Khám phá công viên chủ đề lớn nhất Việt Nam và công viên chăm sóc bảo tồn động vật bán hoang dã.',
  },
  {
    id: 's6',
    name: 'Tour 3 Đảo Nha Trang VIP ngắm san hô bằng cano',
    category: 'Tour trong ngày',
    badgeType: 'ticket',
    location: 'Nha Trang, Khánh Hòa',
    price: '450.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzHjzUMOeqqzHj81H3SNLia_ugFZzw_hIAN5XIeHFR--kc3f2yC4BpqXBAypam-IFxp50YwO8yftKIjOWjuEYOSTUyJ0uH9ZG3Dep7LLe9xATRVy2-UdLWUvN6LEwPo4iebvP7mEHkx1IlM1uD1WAcBnLNO2Uk7Md88uyrBvCqw-jh-a-x6UikSLrCEOn6w4TIyi1p77QI_5IFDi78wNrb33UMykd_xmGlnFFYxa3m6Vx_vnY5xTbUnQ',
    desc: 'Khám phá Hòn Mun, Làng Chài và Bãi Tranh kèm bữa trưa hải sản tươi sống.',
  },
  {
    id: 's7',
    name: 'Vé cáp treo Bà Nà Hills Đà Nẵng & Cầu Vàng',
    category: 'Vé du lịch',
    badgeType: 'ticket',
    location: 'Hòa Vang, Đà Nẵng',
    price: '850.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCD9Oq_RPEGEGzH7qtJdclfBsbGzfPmDloHZ4U7RrOu2qRr7Ki4yM9OP4Uldg66L2Q_XG4YImiinDBZKuSuEvSiwCx48c93YSajNx1y9W9CcJjjJQsUr4bZMyOZPMxfYmfkDMCSldWm0RN8xPGbBsT2XnmI5rVnDoN-_r_qkK1LsOj2AVFGW69ROkz1h9Yd4TRk7ahLYht3mz_tcE2Hked3YmtkAQfU6IPHL5fG2Ii_bDV_rxeZbrAy0w',
    desc: 'Trải nghiệm cáp treo đạt nhiều kỷ lục thế giới, check-in Cầu Vàng và Làng Pháp cổ kính.',
  },
  {
    id: 's8',
    name: 'Vé tham quan Làng nổi Tân Lập',
    category: 'Vé du lịch',
    badgeType: 'ticket',
    location: 'Mộc Hóa, Long An',
    price: '85.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjkighYpG_LrLjQ61PUillxA-9CqiV88O0Pw1486FdGZOdWKslZZ4J3SZHqYo545GvqRkS1fbJyA8ixJg8WLHkv2Rv6W1rq2vmUFHzQs2sKtftB7eOZPwMLPJ150mVw0hvLP0T25Lb1Wut8AeOGFKzV9SdMxopcgPdwMdGX-ZmkRSzh3j3WJQw-oIsH8JyhokpYwdJXIOh1DPUAc4_Tq31QO4xJaBhx1MNK_xQfVnVUy2EGp6QdpyDxA',
    desc: 'Vé vào cổng khám phá rừng tràm nguyên sinh Tân Lập, tản bộ trên cung đường đan xuyên rừng rợp mát.',
  },
  {
    id: 's9',
    name: 'Vé tham quan Khu du lịch Tràm Chim Đồng Tháp',
    category: 'Vé du lịch',
    badgeType: 'ticket',
    location: 'Tam Nông, Đồng Tháp',
    price: '120.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjE11xrEgPVl0sKSOWc72cucCJGrxpa4xwNPhTHJxtTsI5UJiycjD9-0ufyUV_H1sAAjSgqm9wCYujS5_YmjvGzAWXRDjydbjREdvN4RB1uZbu6vTXzZRwZJsvHVbz5XLd3yF95qAzQTYeMonIFNNsV3blGb7TbK25eUaRGKQVFKasZoGqOXZbp0L1cdoX_1y-q2iER6a5LVT2backDHdB5IIMo6QfqbzQIkBPK30fPGKXLxA-FYCsyA',
    desc: 'Chiêm ngưỡng hệ sinh thái đất ngập nước quý hiếm với sếu đầu đỏ và thảm thực vật đặc trưng Đồng Tháp Mười.',
  },
  {
    id: 's10',
    name: 'Khách sạn Meliá Vinpearl Tây Ninh',
    category: 'Lưu trú',
    badgeType: 'hotel',
    location: 'Lê Duẩn, TP. Tây Ninh',
    price: '1.350.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAluqKY48UCquc5770tGQjKIOIG0FOubIxG-k2IjRal4E1lX-lhZPdaqd8d6yl7y94HE3dua0WycKusXWWMZhYa1SEMhgD4TaxdIkFBF5s2OuTzKGd8PJFXgqOzbF5MrzbRBbOaY5FZsxzvrEbRAmZZlSnSBR218k_Fmnw8Z5pybkbGVhbHyoBY3s6yf0ybfFfHRxnVTEhkIxEc9GhudSXirueNgPmY3gjRDD3lSPVdszGTRbN2G4z-lQ',
    desc: 'Khách sạn 5 sao cao cấp nhất Tây Ninh với tầm nhìn bao trọn Núi Bà Đen.',
  },
  {
    id: 's11',
    name: 'Khách sạn Sunrise Tây Ninh',
    category: 'Lưu trú',
    badgeType: 'hotel',
    location: 'Đường 30/4, TP. Tây Ninh',
    price: '820.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcb8x7bGBANPtEmwliCGFXD9IEm7ucJC-rEFPjRDGna348yDqfIVr3zbq3Z89AOwSV9OEjAt-fBuw0TDSO9VM5BvExDQzfqWNLIukEsxTDDbvzHi2_lBWmKu_ENUDCGOtP1kyihFKXRQvhrrqvc6EPF2SY1b6LlI-sosXkQJh9y_KVgEtvVXe1U8dAwogbKk3Z4ceHRiuLzCv1WbPNi5TspUYQ_UwvHxh4iqPJfhgoEK7gMyIhEVOIOg',
    desc: 'Khách sạn tiện nghi, gần trung tâm hành chính và các điểm ẩm thực địa phương.',
  },
  {
    id: 's12',
    name: 'Điểm đến Tây Ninh - Nóc nhà Nam Bộ',
    category: 'Điểm đến',
    badgeType: 'destination',
    location: 'Tây Ninh',
    price: 'Từ 245.000đ',
    image: 'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
    desc: 'Chinh phục Núi Bà Đen, viếng Tòa Thánh Tây Ninh và thưởng thức đặc sản bánh tráng phơi sương.',
  },
  {
    id: 's13',
    name: 'Điểm đến Phú Quốc - Thiên đường Đảo Ngọc',
    category: 'Điểm đến',
    badgeType: 'destination',
    location: 'Phú Quốc, Kiên Giang',
    price: 'Từ 450.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACHeSsmNtGW73oPHbTnkoOjwojVbnAi_q-4FwEjticQ1CpkieRivPIb-gAw4tS1l4Cv-JqNVSzTVL3uwVaaWcYlmXMvRzGvVM0XyFvN_l4afVQjmxtBGxPoDvA5sMcOE_42ml1pUm1YGpBXgwhLMOfENsw0MYIdVfgs4tXeJ9Bdozh-oDqHUV9FvFg7LEkCke4NYFI2hTP1XwpvJGTDgNyPSk5scMWHb0yNaXZB_Jwy92D4fLU3rNEPQ',
    desc: 'Thiên đường biển đảo với Bãi Sao, Grand World, VinWonders và cáp treo Hòn Thơm vượt biển.',
  },
  {
    id: 's14',
    name: 'Điểm đến Đà Nẵng - Thành phố đáng sống',
    category: 'Điểm đến',
    badgeType: 'destination',
    location: 'Đà Nẵng',
    price: 'Từ 350.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCD9Oq_RPEGEGzH7qtJdclfBsbGzfPmDloHZ4U7RrOu2qRr7Ki4yM9OP4Uldg66L2Q_XG4YImiinDBZKuSuEvSiwCx48c93YSajNx1y9W9CcJjjJQsUr4bZMyOZPMxfYmfkDMCSldWm0RN8xPGbBsT2XnmI5rVnDoN-_r_qkK1LsOj2AVFGW69ROkz1h9Yd4TRk7ahLYht3mz_tcE2Hked3YmtkAQfU6IPHL5fG2Ii_bDV_rxeZbrAy0w',
    desc: 'Cầu Rồng, Bà Nà Hills, Bán đảo Sơn Trà và bãi biển Mỹ Khê xinh đẹp.',
  },
  {
    id: 's15',
    name: 'Điểm đến Nha Trang - Vịnh biển thiên đường',
    category: 'Điểm đến',
    badgeType: 'destination',
    location: 'Nha Trang, Khánh Hòa',
    price: 'Từ 260.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzHjzUMOeqqzHj81H3SNLia_ugFZzw_hIAN5XIeHFR--kc3f2yC4BpqXBAypam-IFxp50YwO8yftKIjOWjuEYOSTUyJ0uH9ZG3Dep7LLe9xATRVy2-UdLWUvN6LEwPo4iebvP7mEHkx1IlM1uD1WAcBnLNO2Uk7Md88uyrBvCqw-jh-a-x6UikSLrCEOn6w4TIyi1p77QI_5IFDi78wNrb33UMykd_xmGlnFFYxa3m6Vx_vnY5xTbUnQ',
    desc: 'Khám phá các vịnh đảo ngọc, tắm bùn khoáng nóng, lặn ngắm rạn san hô kỳ thú.',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredSearchResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    const normalizedQ = removeVietnameseTones(q);
    return ALL_SEARCH_ITEMS.filter((item) => {
      const matchName = removeVietnameseTones(item.name).includes(normalizedQ);
      const matchLoc = removeVietnameseTones(item.location).includes(normalizedQ);
      const matchCat = removeVietnameseTones(item.category).includes(normalizedQ);
      const matchDesc = item.desc ? removeVietnameseTones(item.desc).includes(normalizedQ) : false;
      return matchName || matchLoc || matchCat || matchDesc;
    });
  }, [searchQuery]);

  const handleSelectSearchResult = (item: (typeof ALL_SEARCH_ITEMS)[0]) => {
    Keyboard.dismiss();
    if (item.badgeType === 'destination') {
      router.push({
        pathname: '/ve-du-lich',
        params: { location: item.location },
      } as any);
    } else if (item.badgeType === 'hotel') {
      router.push('/luu-tru');
    } else {
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
    }
  };

  const handleSelectService = (item: any) => {
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

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (!searchQuery.trim()) {
      inputRef.current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#073B2E" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        {/* ========================================================================= */}
        {/* BEGIN: MainHeader (Deep Emerald Header with Search & Quick Profile) */}
        {/* ========================================================================= */}
        <View style={[styles.mainHeader, { paddingTop: Math.max(insets.top, 14) }]}>
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
                accessibilityLabel="Thông báo đơn hàng và vé"
              >
                <Ionicons name="notifications-outline" size={19} color="#FFFFFF" />
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
          <View style={styles.searchPillWrapper}>
            <View style={styles.searchPillBar}>
              <View style={styles.searchGlassIcon}>
                <Ionicons name="search" size={18} color="#94A3B8" />
              </View>

              <TextInput
                ref={inputRef}
                style={styles.searchInputField}
                placeholder="Tìm vé cáp treo, tour, khách sạn..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />

              {searchQuery.length > 0 && (
                <Pressable
                  style={styles.searchClearBtn}
                  onPress={() => {
                    setSearchQuery('');
                    Keyboard.dismiss();
                  }}
                  hitSlop={8}
                  accessibilityLabel="Xóa tìm kiếm"
                >
                  <Text style={styles.searchClearText}>✕</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.searchSubmitCircle}
                onPress={() => {
                  Keyboard.dismiss();
                  if (!searchQuery.trim()) {
                    inputRef.current?.focus();
                  }
                }}
                hitSlop={6}
                accessibilityLabel="Tìm kiếm"
              >
                <Ionicons
                  name={searchQuery.trim() ? "arrow-forward" : "search"}
                  size={16}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {/* Quick Trending Keywords Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingChipsScroll}
            >
              <Text style={styles.trendingChipsLabel}>Gợi ý:</Text>
              {TRENDING_SEARCH_TAGS.map((tag) => {
                const isActive = searchQuery.toLowerCase().trim() === tag.toLowerCase();
                return (
                  <Pressable
                    key={tag}
                    style={[styles.trendingChip, isActive && styles.trendingChipActive]}
                    onPress={() => {
                      setSearchQuery(tag);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={[styles.trendingChipText, isActive && styles.trendingChipTextActive]}>
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {searchQuery.trim().length > 0 ? (
          <View style={styles.searchResultsContainer}>
            {/* Header info */}
            <View style={styles.searchResultsHeaderRow}>
              <View style={styles.searchResultsHeaderLeft}>
                <Ionicons name="search-circle" size={24} color="#047857" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.searchResultsTitle}>
                    Kết quả cho <Text style={styles.searchKeywordHighlight}>&ldquo;{searchQuery.trim()}&rdquo;</Text>
                  </Text>
                  <Text style={styles.searchResultsCountText}>
                    Tìm thấy {filteredSearchResults.length} dịch vụ & điểm đến
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.clearSearchBtn}
                onPress={() => {
                  setSearchQuery('');
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.clearSearchBtnText}>Xóa lọc ✕</Text>
              </Pressable>
            </View>

            {/* Result items */}
            {filteredSearchResults.length > 0 ? (
              <View style={styles.searchResultsList}>
                {filteredSearchResults.map((item) => (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.searchResultCard,
                      pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
                    ]}
                    onPress={() => handleSelectSearchResult(item)}
                  >
                    <View style={styles.searchResultThumbWrap}>
                      <Image source={{ uri: item.image }} style={styles.searchResultThumb} contentFit="cover" />
                      <View
                        style={[
                          styles.searchResultBadge,
                          item.badgeType === 'hotel'
                            ? styles.badgeHotel
                            : item.badgeType === 'destination'
                            ? styles.badgeDest
                            : styles.badgeTicket,
                        ]}
                      >
                        <Text style={styles.searchResultBadgeText}>{item.category}</Text>
                      </View>
                    </View>

                    <View style={styles.searchResultBody}>
                      <Text style={styles.searchResultName} numberOfLines={2}>
                        {item.name}
                      </Text>

                      <View style={styles.searchResultLocRow}>
                        <Ionicons name="location" size={12} color="#047857" />
                        <Text style={styles.searchResultLocText} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>

                      <Text style={styles.searchResultDesc} numberOfLines={2}>
                        {item.desc}
                      </Text>

                      <View style={styles.searchResultFooterRow}>
                        <View>
                          <Text style={styles.searchResultPriceLabel}>Giá tham khảo</Text>
                          <Text style={styles.searchResultPriceVal}>{item.price}</Text>
                        </View>

                        <View style={styles.searchResultActionBtn}>
                          <Text style={styles.searchResultActionBtnText}>
                            {item.badgeType === 'destination' ? 'Khám phá' : item.badgeType === 'hotel' ? 'Xem phòng' : 'Đặt vé'}
                          </Text>
                          <Ionicons name="arrow-forward" size={11} color="#FFFFFF" />
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}

                {/* Banner link to ve-du-lich */}
                <Pressable
                  style={styles.moreTicketsBanner}
                  onPress={() =>
                    router.push({
                      pathname: '/ve-du-lich',
                      params: { search: searchQuery.trim() },
                    } as any)
                  }
                >
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.moreTicketsTitle}>Xem thêm vé liên quan trên Chuyên mục Vé</Text>
                    <Text style={styles.moreTicketsSub}>
                      Tìm kiếm toàn bộ bảng giá và ưu đãi tại trang Vé du lịch
                    </Text>
                  </View>
                  <View style={styles.moreTicketsArrow}>
                    <Ionicons name="chevron-forward" size={14} color="#047857" />
                  </View>
                </Pressable>
              </View>
            ) : (
              <View style={styles.emptySearchContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="search" size={30} color="#94A3B8" />
                </View>
                <Text style={styles.emptySearchTitle}>Không tìm thấy kết quả nào</Text>
                <Text style={styles.emptySearchDesc}>
                  Không có dịch vụ hoặc điểm đến nào khớp với &ldquo;{searchQuery.trim()}&rdquo;. Bạn hãy thử các từ khóa gợi ý bên dưới:
                </Text>
                <View style={styles.emptyTagsWrap}>
                  {TRENDING_SEARCH_TAGS.map((t) => (
                    <Pressable
                      key={t}
                      style={styles.emptyTagBtn}
                      onPress={() => setSearchQuery(t)}
                    >
                      <Text style={styles.emptyTagBtnText}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <>

        {/* ========================================================================= */}
        {/* BEGIN: QuickServicesGrid (5 Custom Category Logos) */}
        {/* ========================================================================= */}
        <View style={styles.quickServicesWrapper}>
          <View style={styles.quickServicesCard}>
            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/ve-du-lich')}
            >
              <View style={styles.categoryIconBox}>
                <Image
                  source={require('../../assets/images/categories/ticket.png')}
                  style={styles.categoryImg}
                  contentFit="cover"
                />
              </View>
              <Text style={styles.categoryLabel}>Vé du lịch</Text>
            </Pressable>

            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/luu-tru')}
            >
              <View style={styles.categoryIconBox}>
                <Image
                  source={require('../../assets/images/categories/hotel.png')}
                  style={styles.categoryImg}
                  contentFit="cover"
                />
              </View>
              <Text style={styles.categoryLabel}>Lưu trú</Text>
            </Pressable>

            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/tour')}
            >
              <View style={styles.categoryIconBox}>
                <Image
                  source={require('../../assets/images/categories/tour.png')}
                  style={styles.categoryImg}
                  contentFit="cover"
                />
              </View>
              <Text style={styles.categoryLabel}>Tour</Text>
            </Pressable>

            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/khu-sinh-thai')}
            >
              <View style={styles.categoryIconBox}>
                <Image
                  source={require('../../assets/images/categories/eco.png')}
                  style={styles.categoryImg}
                  contentFit="cover"
                />
              </View>
              <Text style={styles.categoryLabel}>Sinh thái</Text>
            </Pressable>

            <Pressable
              style={styles.categoryItem}
              onPress={() => router.push('/am-thuc')}
            >
              <View style={styles.categoryIconBox}>
                <Image
                  source={require('../../assets/images/categories/food.png')}
                  style={styles.categoryImg}
                  contentFit="cover"
                />
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
              <Ionicons name="chevron-forward" size={13} color="#059669" />
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
                      <Ionicons name="checkmark-sharp" size={10} color="#34D399" />
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
              <Ionicons name="chevron-forward" size={13} color="#059669" />
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
              <Ionicons name="chevron-forward" size={13} color="#059669" />
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
                    <Ionicons name="checkmark-sharp" size={10} color="#34D399" />
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
              <Ionicons name="chevron-forward" size={13} color="#059669" />
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
                    <Ionicons name="checkmark-sharp" size={10} color="#34D399" />
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
              <Ionicons name="chevron-forward" size={13} color="#F97316" />
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
              <Ionicons name="chevron-forward" size={13} color="#059669" />
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
              <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
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
      </>
    )}

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

  /* Search Results UI */
  searchResultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  searchResultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchResultsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  searchResultsTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchKeywordHighlight: {
    color: '#047857',
    fontWeight: '900',
  },
  searchResultsCountText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  clearSearchBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  clearSearchBtnText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
  },
  searchResultsList: {
    gap: 12,
  },
  searchResultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchResultThumbWrap: {
    height: 140,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  searchResultThumb: {
    width: '100%',
    height: '100%',
  },
  searchResultBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTicket: {
    backgroundColor: '#F97316',
  },
  badgeHotel: {
    backgroundColor: '#0D9488',
  },
  badgeDest: {
    backgroundColor: '#047857',
  },
  searchResultBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  searchResultBody: {
    padding: 12,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  searchResultLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  searchResultLocText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    marginLeft: 4,
  },
  searchResultDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  searchResultFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  searchResultPriceLabel: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  searchResultPriceVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F97316',
  },
  searchResultActionBtn: {
    backgroundColor: '#073B2E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  searchResultActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  moreTicketsBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  moreTicketsTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 2,
  },
  moreTicketsSub: {
    fontSize: 10.5,
    color: '#047857',
  },
  moreTicketsArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  emptySearchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptySearchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySearchDesc: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 16,
  },
  emptyTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTagBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  emptyTagBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  trendingChipsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    gap: 6,
  },
  trendingChipsLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '800',
    marginRight: 2,
  },
  trendingChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  trendingChipActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  trendingChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  trendingChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
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
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImg: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
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
