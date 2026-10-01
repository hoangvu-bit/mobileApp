import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';

interface Voucher {
  id: string;
  code: string;
  title: string;
  desc: string;
  category: string;
  discount: string;
  minSpend: string;
  hsd: string;
  expiryUrgent?: boolean;
  usedPercent: number;
  isSaved: boolean;
  badgeBg: string;
  badgeText: string;
}

const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    code: 'SUNWORLD50',
    title: 'Sun World Núi Bà Đen',
    desc: 'Áp dụng tuyến đỉnh Vân Sơn & Chùa Hang',
    category: 'cap-treo',
    discount: '50K',
    minSpend: 'Đơn từ 300K',
    hsd: 'HSD: 28/02',
    usedPercent: 78,
    isSaved: false,
    badgeBg: '#ffdad4',
    badgeText: '#b32113',
  },
  {
    id: 'v2',
    code: 'BUFFETVANSON',
    title: 'Buffet nướng & lẩu Vân Sơn',
    desc: 'Vé ăn trưa kèm đồ uống giải khát',
    category: 'am-thuc',
    discount: '100K',
    minSpend: 'Đơn từ 500K',
    hsd: 'Hết hạn hôm nay',
    expiryUrgent: true,
    usedPercent: 92,
    isSaved: false,
    badgeBg: '#ffdcbe',
    badgeText: '#874e00',
  },
  {
    id: 'v3',
    code: 'TOURTAYNINH',
    title: 'Tour Trải Nghiệm Tây Ninh 1 Ngày',
    desc: 'Giảm trực tiếp cho nhóm từ 2 người',
    category: 'tour',
    discount: '70K',
    minSpend: 'Đơn từ 400K',
    hsd: 'HSD: 15/03',
    usedPercent: 64,
    isSaved: false,
    badgeBg: '#dee8ff',
    badgeText: '#006b5f',
  },
  {
    id: 'v4',
    code: 'VIMOI30',
    title: 'Ưu đãi thanh toán Ví ZaloPay / MoMo',
    desc: 'Giảm thêm khi liên kết thanh toán lần đầu',
    category: 'vi',
    discount: '30K',
    minSpend: 'Đơn từ 200K',
    hsd: 'HSD: 31/03',
    usedPercent: 45,
    isSaved: false,
    badgeBg: '#f0f3ff',
    badgeText: '#693c00',
  },
];

const DESTINATION_DEALS = [
  {
    id: 'd1',
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    sub: 'Hơn 80 món Á - Âu đặc sắc',
    tag: 'Vé QR tức thì',
    tagColor: '#006b5f',
    oldPrice: '290.000đ',
    discount: '-14%',
    price: '250.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpdnq32CxUpTr_pSlBgV5-jfSeK_Q2H14FGBJ9aSfxvNintVaIatDLrTyN5abKcqlW9OYN9rNk7zVMFTBjHwiHwEOXSRnfLlbt_eJ5PxYK4EIJ7AL7pkvzYVrK7PAW8kZf_xT9ifr9MeCVD6I6GCmhTuEuQOZlWmv7GoSR9lmx7aekv8lVxqX2uUksmK4tbS2Zaj9_y3gENTL3Vr05K_BO8EHjX4xokTVc4UpCf9IMc1ABZ0QjJOc',
    location: 'Tây Ninh',
    route: '/chi-tiet-ve',
  },
  {
    id: 'd2',
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    sub: 'Khứ hồi tuyến Chùa Hang',
    tag: 'Bán chạy',
    tagColor: '#aa6400',
    oldPrice: '280.000đ',
    discount: '-12%',
    price: '245.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAGzag4JWCmqBtN4mYGy6MERp-frzyeBC6nRoGOAPRwvo_KRQv212W5LFMkH4h-aNMgVbvRcmo8YRhRZ0xjAevClzlZ2h59cQeAt_-ciE-QVymPMePoC1eTnJmazNG68usffuP6JhObJw0K-OPnLmNotdYxlLwsizfiP-xNl_jtEmdYKUE-iVJqyk2pdB5IxCECOQwlcjkzH29D3-Kqy2z0oEo2wI1YxaRAjBBi4fQOaqWRaGrdT_Q',
    location: 'Tây Ninh',
    route: '/chi-tiet-ve',
  },
  {
    id: 'd3',
    name: 'Tour Săn Mây Cầu Đất Đà Lạt 1 ngày',
    sub: 'Đón tận nơi tại khách sạn',
    tag: 'Ưu đãi tuần',
    tagColor: '#b32113',
    oldPrice: '350.000đ',
    discount: '-20%',
    price: '280.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
    location: 'Đà Lạt',
    route: '/tour-da-lat',
  },
  {
    id: 'd4',
    name: 'Vé show Tinh Hoa Việt Nam Phú Quốc',
    sub: 'Trực tiếp qua cổng không xếp hàng',
    tag: 'Vé QR tức thì',
    tagColor: '#006b5f',
    oldPrice: '300.000đ',
    discount: '-16%',
    price: '250.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
    location: 'Phú Quốc',
    route: '/chi-tiet-ve',
  },
];

export default function UuDaiScreen() {
  const router = useRouter();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyValid, setOnlyValid] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [voucherList, setVoucherList] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [savedCount, setSavedCount] = useState(4);
  const [customCode, setCustomCode] = useState('');

  // Countdown timer for Flash Deal
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  // Handle saving voucher
  const handleToggleSaveVoucher = (id: string, code: string) => {
    setVoucherList(prev =>
      prev.map(v => {
        if (v.id === id) {
          const nextState = !v.isSaved;
          if (nextState) {
            setSavedCount(c => c + 1);
            Alert.alert('Thành công', `Đã lưu mã [${code}] vào kho voucher của bạn!`);
          } else {
            setSavedCount(c => Math.max(0, c - 1));
          }
          return { ...v, isSaved: nextState };
        }
        return v;
      })
    );
  };

  // Handle applying input voucher
  const handleApplyCode = () => {
    const code = customCode.trim().toUpperCase();
    if (!code) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã voucher!');
      return;
    }

    if (code === 'CHAOBANMOI' || code === 'IGOVI150' || code === 'IGOVI50') {
      setSavedCount(c => c + 1);
      Alert.alert('Thành công', `Mã [${code}] hợp lệ! Đã lưu vào ví voucher của bạn.`);
      setCustomCode('');
    } else {
      Alert.alert('Ưu đãi', `Mã [${code}] đã được ghi nhận. Bạn có thể sử dụng tại bước thanh toán!`);
      setCustomCode('');
    }
  };

  // Filter vouchers
  const filteredVouchers = voucherList.filter(v => {
    const matchCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchValid = onlyValid ? !v.expiryUrgent : true;
    return matchCategory && matchSearch && matchValid;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9ff" />

      {/* Subpage Header with Navigation Back */}
      <View style={styles.subHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#b32113" />
          <Text style={styles.backBtnText}>Quay lại</Text>
        </Pressable>
        <View style={styles.subHeaderCenter}>
          <Text style={styles.subHeaderTitle}>Ưu Đãi & Khuyến Mãi</Text>
          <Text style={styles.subHeaderSubtitle}>Mã giảm giá, voucher độc quyền iGovi</Text>
        </View>
        <Pressable 
          style={styles.walletPill}
          onPress={() => Alert.alert('Ví voucher', `Bạn đang có ${savedCount} mã voucher sẵn sàng sử dụng khi thanh toán!`)}
        >
          <SymbolView name="creditcard.fill" size={16} tintColor="#b32113" />
          <Text style={styles.walletPillCount}>{savedCount}</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Dynamic Notification / Top Incentive Ribbon */}
        <View style={styles.ribbon}>
          <View style={styles.ribbonLeft}>
            <View style={styles.ribbonIconWrap}>
              <SymbolView name="flame.fill" size={20} tintColor="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ribbonSubtitle}>ƯU ĐÃI ĐỘC QUYỀN IGOVI</Text>
              <Text style={styles.ribbonTitle}>Săn mã giảm đến 150K</Text>
            </View>
          </View>
          <Pressable 
            style={styles.ribbonBtn}
            onPress={() => {
              setSavedCount(c => c + 1);
              Alert.alert('Chúc mừng!', 'Bạn đã nhận thành công mã [IGOVI150] giảm 150.000đ!');
            }}
          >
            <Text style={styles.ribbonBtnText}>Nhận ngay</Text>
          </Pressable>
        </View>

        {/* Search & Filter Controls */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <SymbolView name="magnifyingglass" size={20} tintColor="#b32113" />
            <TextInput
              placeholder="Tìm kiếm mã giảm giá, ưu đãi..."
              style={styles.searchInput}
              placeholderTextColor="#8f706b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                <SymbolView name="xmark.circle.fill" size={18} tintColor="#8f706b" />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.validFilterBtn, onlyValid && styles.validFilterBtnActive]}
            onPress={() => setOnlyValid(!onlyValid)}
          >
            <SymbolView
              name="checkmark.seal.fill"
              size={18}
              tintColor={onlyValid ? '#ffffff' : '#006b5f'}
            />
            <Text style={[styles.validFilterText, onlyValid && styles.validFilterTextActive]}>
              Còn hạn
            </Text>
          </Pressable>
        </View>

        {/* Category Pills (Horizontal Scrolling Band) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <Pressable
            style={[styles.catPill, selectedCategory === 'all' && styles.catPillActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <SymbolView name="star.fill" size={16} tintColor={selectedCategory === 'all' ? '#fff' : '#b32113'} />
            <Text style={[styles.catPillText, selectedCategory === 'all' && styles.catPillTextActive]}>Tất cả</Text>
          </Pressable>

          <Pressable
            style={[styles.catPill, selectedCategory === 'cap-treo' && styles.catPillActive]}
            onPress={() => setSelectedCategory('cap-treo')}
          >
            <SymbolView name="ticket.fill" size={16} tintColor={selectedCategory === 'cap-treo' ? '#fff' : '#b32113'} />
            <Text style={[styles.catPillText, selectedCategory === 'cap-treo' && styles.catPillTextActive]}>Vé cáp treo & Tham quan</Text>
          </Pressable>

          <Pressable
            style={[styles.catPill, selectedCategory === 'am-thuc' && styles.catPillActive]}
            onPress={() => setSelectedCategory('am-thuc')}
          >
            <SymbolView name="fork.knife" size={16} tintColor={selectedCategory === 'am-thuc' ? '#fff' : '#874e00'} />
            <Text style={[styles.catPillText, selectedCategory === 'am-thuc' && styles.catPillTextActive]}>Ẩm thực & Buffet</Text>
          </Pressable>

          <Pressable
            style={[styles.catPill, selectedCategory === 'tour' && styles.catPillActive]}
            onPress={() => setSelectedCategory('tour')}
          >
            <SymbolView name="map.fill" size={16} tintColor={selectedCategory === 'tour' ? '#fff' : '#006b5f'} />
            <Text style={[styles.catPillText, selectedCategory === 'tour' && styles.catPillTextActive]}>Tour du lịch</Text>
          </Pressable>

          <Pressable
            style={[styles.catPill, selectedCategory === 'khach-san' && styles.catPillActive]}
            onPress={() => setSelectedCategory('khach-san')}
          >
            <SymbolView name="building.2.fill" size={16} tintColor={selectedCategory === 'khach-san' ? '#fff' : '#5b403c'} />
            <Text style={[styles.catPillText, selectedCategory === 'khach-san' && styles.catPillTextActive]}>Khách sạn & Resort</Text>
          </Pressable>

          <Pressable
            style={[styles.catPill, selectedCategory === 'vi' && styles.catPillActive]}
            onPress={() => setSelectedCategory('vi')}
          >
            <SymbolView name="creditcard.fill" size={16} tintColor={selectedCategory === 'vi' ? '#fff' : '#b32113'} />
            <Text style={[styles.catPillText, selectedCategory === 'vi' && styles.catPillTextActive]}>Thanh toán ví</Text>
          </Pressable>
        </ScrollView>

        {/* Hero Deal Carousel (Horizontal Bleed with High Tactile Impact) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionSubtitle}>ĐẶC QUYỀN IGOVI</Text>
            <Text style={styles.sectionTitle}>Ưu đãi dành cho bạn</Text>
          </View>
          <Pressable style={styles.viewAllBtn} onPress={() => setSelectedCategory('all')}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
            <SymbolView name="chevron.right" size={16} tintColor="#006b5f" />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heroScroll}>
          {/* Card 1: Vermilion Orange-Red Hero Banner */}
          <Pressable 
            style={[styles.heroCard, { backgroundColor: '#FF5330' }]}
            onPress={() => router.push({ pathname: '/chi-tiet-uu-dai', params: { code: 'CHAOBANMOI' } })}
          >
            <View style={styles.heroCardTop}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>CHÀO BẠN MỚI</Text>
              </View>
              <Text style={styles.heroCode}>Mã: CHAOBANMOI</Text>
            </View>
            <View style={styles.heroCardContent}>
              <Text style={styles.heroCardTitle}>Ưu đãi khách mới</Text>
              <Text style={styles.heroCardDesc}>Giảm ngay 15% (tối đa 150.000đ) khi đặt vé tham quan hoặc tour đầu tiên.</Text>
            </View>
            <View style={styles.heroCardBottom}>
              <View style={styles.getBtn}>
                <Text style={styles.getBtnText}>Xem chi tiết ›</Text>
              </View>
              <Text style={styles.heroDate}>HSD: 31/03/2026</Text>
            </View>
          </Pressable>

          {/* Card 2: Deep Emerald Teal Hero Banner */}
          <Pressable 
            style={[styles.heroCard, { backgroundColor: '#008779' }]}
            onPress={() => router.push({ pathname: '/chi-tiet-uu-dai', params: { code: 'DEALCUOITUAN' } })}
          >
            <View style={styles.heroCardTop}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>CUỐI TUẦN RỰC RỠ</Text>
              </View>
              <Text style={styles.heroCode}>Giờ vàng T7 & CN</Text>
            </View>
            <View style={styles.heroCardContent}>
              <Text style={styles.heroCardTitle}>Săn deal chớp nhoáng</Text>
              <Text style={styles.heroCardDesc}>Giảm trực tiếp 80.000đ khi mua từ 2 vé cáp treo Sun World bất kỳ.</Text>
            </View>
            <View style={styles.heroCardBottom}>
              <View style={[styles.getBtn, { backgroundColor: '#fff' }]}>
                <Text style={[styles.getBtnText, { color: '#006b5f' }]}>Xem chi tiết ›</Text>
              </View>
              <Text style={styles.heroDate}>Số lượng có hạn</Text>
            </View>
          </Pressable>

          {/* Card 3: Royal Purple Hero Banner */}
          <Pressable 
            style={[styles.heroCard, { backgroundColor: '#6366f1' }]}
            onPress={() => router.push({ pathname: '/chi-tiet-uu-dai', params: { code: 'HOIVIEN10' } })}
          >
            <View style={styles.heroCardTop}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>HỘI VIÊN IGOVI</Text>
              </View>
              <Text style={styles.heroCode}>Mã: HOIVIEN10</Text>
            </View>
            <View style={styles.heroCardContent}>
              <Text style={styles.heroCardTitle}>Tri ân hội viên thân thiết</Text>
              <Text style={styles.heroCardDesc}>Giảm 10% tối đa 100.000đ cho mọi đơn đặt vé combo & tour trên 500K.</Text>
            </View>
            <View style={styles.heroCardBottom}>
              <View style={[styles.getBtn, { backgroundColor: '#fff' }]}>
                <Text style={[styles.getBtnText, { color: '#6366f1' }]}>Xem chi tiết ›</Text>
              </View>
              <Text style={styles.heroDate}>HSD: 30/04/2026</Text>
            </View>
          </Pressable>
        </ScrollView>

        {/* Wallet Quick Status & Code Input Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletHeaderLeft}>
              <View style={styles.walletIconWrap}>
                <SymbolView name="creditcard.fill" size={18} tintColor="#b32113" />
              </View>
              <View>
                <Text style={styles.walletTitle}>Kho voucher của bạn</Text>
                <Text style={styles.walletSub}>
                  Bạn đang có <Text style={{ color: '#b32113', fontWeight: 'bold' }}>{savedCount} voucher</Text> sẵn sàng dùng
                </Text>
              </View>
            </View>
            <Pressable onPress={() => Alert.alert('Ví voucher', `Bạn có ${savedCount} mã voucher đã lưu trong tài khoản.`)}>
              <Text style={styles.walletLink}>Ví voucher</Text>
            </Pressable>
          </View>
          
          <View style={styles.walletInputRow}>
            <View style={styles.walletInputBox}>
              <SymbolView name="tag.fill" size={18} tintColor="#8f706b" />
              <TextInput
                placeholder="Nhập mã voucher iGovi..."
                style={styles.walletInput}
                placeholderTextColor="#8f706b"
                value={customCode}
                onChangeText={setCustomCode}
                autoCapitalize="characters"
              />
            </View>
            <Pressable style={styles.applyBtn} onPress={handleApplyCode}>
              <Text style={styles.applyBtnText}>Áp dụng</Text>
            </Pressable>
          </View>
        </View>

        {/* Flash Deal Section with Cut-out Ticket Vouchers ("Giờ vàng săn mã") */}
        <View style={styles.flashDealHeader}>
          <View style={styles.flashDealHeaderLeft}>
            <SymbolView name="bolt.fill" size={24} tintColor="#b32113" />
            <Text style={styles.flashDealTitle}>Giờ vàng săn mã</Text>
          </View>
          <View style={styles.timerBadge}>
            <SymbolView name="timer" size={15} tintColor="#b32113" />
            <Text style={styles.timerText}>
              {formatTwoDigits(timeLeft.hours)}:{formatTwoDigits(timeLeft.minutes)}:{formatTwoDigits(timeLeft.seconds)}
            </Text>
          </View>
        </View>

        {/* Vouchers list with ticket cutouts */}
        {filteredVouchers.map((voucher, idx) => (
          <Pressable
            key={voucher.id}
            style={[styles.ticketCard, idx > 0 && { marginTop: 14 }]}
            onPress={() => {
              router.push({
                pathname: '/chi-tiet-uu-dai',
                params: {
                  code: voucher.code,
                  id: voucher.id,
                  title: voucher.title,
                  desc: voucher.desc,
                  discount: voucher.discount,
                  minSpend: voucher.minSpend,
                },
              });
            }}
          >
            {/* Cutouts on left & right edges */}
            <View style={styles.ticketLeftCutout} />
            <View style={styles.ticketRightCutout} />

            {/* Badge Graphic */}
            <View style={[styles.ticketBadgeWrap, { backgroundColor: voucher.badgeBg }]}>
              <Text style={[styles.ticketBadgeText, { color: voucher.badgeText }]}>GIẢM</Text>
              <Text style={[styles.ticketBadgeValue, { color: voucher.badgeText }]}>{voucher.discount}</Text>
              <Text style={styles.ticketBadgeCondition}>{voucher.minSpend}</Text>
            </View>

            {/* Info */}
            <View style={styles.ticketContent}>
              <View style={styles.ticketMetaRow}>
                <View style={[styles.ticketTag, { backgroundColor: voucher.badgeBg }]}>
                  <Text style={[styles.ticketTagText, { color: voucher.badgeText }]}>
                    {voucher.category === 'cap-treo' ? 'Cáp treo' : voucher.category === 'am-thuc' ? 'Buffet ẩm thực' : voucher.category === 'tour' ? 'Tour du lịch' : 'Ví điện tử'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.ticketHsd, voucher.expiryUrgent && { color: '#ba1a1a', fontWeight: '700' }]}>
                    {voucher.hsd}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#b32113', fontWeight: '700' }}>Chi tiết ›</Text>
                </View>
              </View>

              <Text style={styles.ticketTitle} numberOfLines={1}>{voucher.title}</Text>
              <Text style={styles.ticketDesc} numberOfLines={1}>{voucher.desc}</Text>

              {/* Progress & Action */}
              <View style={styles.ticketBottomRow}>
                <View style={styles.progressWrap}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${voucher.usedPercent}%` }]} />
                  </View>
                  <Text style={[styles.progressText, voucher.usedPercent >= 90 && { color: '#b32113', fontWeight: '700' }]}>
                    {voucher.usedPercent >= 90 ? `Sắp hết - ${voucher.usedPercent}%` : `Đã dùng ${voucher.usedPercent}%`}
                  </Text>
                </View>

                <Pressable
                  style={[styles.saveCodeBtn, voucher.isSaved && styles.saveCodeBtnActive]}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    handleToggleSaveVoucher(voucher.id, voucher.code);
                  }}
                >
                  <Text style={[styles.saveCodeBtnText, voucher.isSaved && styles.saveCodeBtnTextActive]}>
                    {voucher.isSaved ? 'Đã lưu ✓' : 'Lưu mã'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}

        {/* Featured Travel Spots & Hot Deals ("Ưu đãi theo điểm đến") */}
        <View style={styles.destHeader}>
          <View>
            <Text style={styles.destSubtitle}>GỢI Ý ĐỂ BẮT ĐẦU</Text>
            <Text style={styles.destTitle}>Ưu đãi theo điểm đến</Text>
          </View>
          <Pressable
            style={styles.viewAllBtn}
            onPress={() => router.push('/ve-du-lich')}
          >
            <Text style={styles.destLinkText}>Khám phá</Text>
            <SymbolView name="chevron.right" size={16} tintColor="#b32113" />
          </Pressable>
        </View>

        {/* 2-column Product Grid */}
        <View style={styles.destGrid}>
          {DESTINATION_DEALS.map((deal) => (
            <Pressable
              key={deal.id}
              style={styles.productCard}
              onPress={() => {
                if (deal.route === '/chi-tiet-ve') {
                  router.push({
                    pathname: '/chi-tiet-ve',
                    params: {
                      name: deal.name,
                      price: deal.price,
                      location: deal.location,
                      image: deal.image,
                      desc: deal.sub,
                    },
                  });
                } else {
                  router.push(deal.route as any);
                }
              }}
            >
              <View style={styles.productImageWrap}>
                <Image source={{ uri: deal.image }} style={styles.productImage} contentFit="cover" />
                <View style={styles.productBadgeWrap}>
                  <Text style={[styles.productBadge, { backgroundColor: deal.tagColor }]}>
                    {deal.tag}
                  </Text>
                </View>
              </View>

              <View style={styles.productBody}>
                <View>
                  <Text style={styles.productName} numberOfLines={2}>{deal.name}</Text>
                  <Text style={styles.productSub} numberOfLines={1}>{deal.sub}</Text>
                </View>

                <View style={styles.productPriceRow}>
                  <View style={styles.oldPriceWrap}>
                    <Text style={styles.oldPrice}>{deal.oldPrice}</Text>
                    <Text style={styles.discountBadge}>{deal.discount}</Text>
                  </View>
                  <View style={styles.finalPriceWrap}>
                    <Text style={styles.pricePrefix}>Từ</Text>
                    <Text style={styles.finalPrice}>{deal.price}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Helpful Tips & Guidelines ("Mẹo săn mã cùng iGovi") */}
        <View style={styles.tipsCard}>
          <View style={styles.tipIconWrap}>
            <SymbolView name="lightbulb.fill" size={20} tintColor="#006b5f" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Mẹo săn mã cùng iGovi</Text>
            <Text style={styles.tipText}>
              Nhấn <Text style={{ fontWeight: '700', color: '#111c2d' }}>&apos;Lưu mã&apos;</Text> để tự động áp dụng tại bước thanh toán. Mỗi đơn hàng có thể kết hợp mã giảm giá iGovi cùng ưu đãi thanh toán ví điện tử!
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9ff',
  },

  // Sub Navigation Bar
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3ff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  backBtnText: {
    color: '#b32113',
    fontSize: 14,
    fontWeight: '600',
  },
  subHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111c2d',
  },
  subHeaderSubtitle: {
    fontSize: 11,
    color: '#5b403c',
    marginTop: 1,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffdad4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  walletPillCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b32113',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Ribbon
  ribbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#b32113',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#b32113',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  ribbonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  ribbonIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ribbonSubtitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  ribbonTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  ribbonBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ribbonBtnText: {
    color: '#b32113',
    fontSize: 12,
    fontWeight: '700',
  },

  // Search & Filter
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111c2d',
  },
  validFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  validFilterBtnActive: {
    backgroundColor: '#006b5f',
  },
  validFilterText: {
    color: '#006b5f',
    fontSize: 12,
    fontWeight: '600',
  },
  validFilterTextActive: {
    color: '#ffffff',
  },

  // Category Pills
  categoryScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  catPillActive: {
    backgroundColor: '#b32113',
    shadowColor: '#b32113',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  catPillText: {
    color: '#111c2d',
    fontSize: 13,
    fontWeight: '600',
  },
  catPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // Hero Deal Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionSubtitle: {
    color: '#006b5f',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sectionTitle: {
    color: '#111c2d',
    fontSize: 18,
    fontWeight: '800',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingBottom: 2,
  },
  viewAllText: {
    color: '#006b5f',
    fontSize: 12,
    fontWeight: '600',
  },

  heroScroll: {
    gap: 14,
    paddingBottom: 18,
  },
  heroCard: {
    width: 290,
    borderRadius: 20,
    padding: 16,
    minHeight: 175,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  heroCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroCode: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  heroCardContent: {
    marginTop: 8,
    flex: 1,
  },
  heroCardTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroCardDesc: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 12,
    lineHeight: 17,
  },
  heroCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  getBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  getBtnText: {
    color: '#b32113',
    fontSize: 13,
    fontWeight: '700',
  },
  heroDate: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '600',
  },

  // Wallet Card
  walletCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f3ff',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffdad4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletTitle: {
    color: '#111c2d',
    fontSize: 13,
    fontWeight: '700',
  },
  walletSub: {
    color: '#5b403c',
    fontSize: 12,
    marginTop: 1,
  },
  walletLink: {
    color: '#b32113',
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  walletInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  walletInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f3ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  walletInput: {
    flex: 1,
    fontSize: 12,
    color: '#111c2d',
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: '#111c2d',
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Flash Deal Section
  flashDealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flashDealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flashDealTitle: {
    color: '#111c2d',
    fontSize: 18,
    fontWeight: '800',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dee8ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  timerText: {
    color: '#111c2d',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Ticket Voucher Card
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  ticketLeftCutout: {
    position: 'absolute',
    left: -11,
    top: '50%',
    marginTop: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f9f9ff',
    zIndex: 2,
  },
  ticketRightCutout: {
    position: 'absolute',
    right: -11,
    top: '50%',
    marginTop: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f9f9ff',
    zIndex: 2,
  },
  ticketBadgeWrap: {
    width: 76,
    height: 76,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    padding: 4,
  },
  ticketBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  ticketBadgeValue: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 26,
  },
  ticketBadgeCondition: {
    color: '#5b403c',
    fontSize: 9,
    marginTop: 2,
  },
  ticketContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ticketMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ticketTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ticketTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ticketHsd: {
    color: '#5b403c',
    fontSize: 11,
  },
  ticketTitle: {
    color: '#111c2d',
    fontSize: 14,
    fontWeight: '700',
  },
  ticketDesc: {
    color: '#5b403c',
    fontSize: 11,
    marginTop: 1,
  },
  ticketBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressWrap: {
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#dee8ff',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#b32113',
    borderRadius: 3,
  },
  progressText: {
    color: '#5b403c',
    fontSize: 9,
    fontWeight: '600',
  },
  saveCodeBtn: {
    backgroundColor: '#b32113',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  saveCodeBtnActive: {
    backgroundColor: '#006b5f',
  },
  saveCodeBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  saveCodeBtnTextActive: {
    color: '#ffffff',
  },

  // Destination Deals Section
  destHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    marginBottom: 12,
  },
  destSubtitle: {
    color: '#b32113',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  destTitle: {
    color: '#111c2d',
    fontSize: 18,
    fontWeight: '800',
  },
  destLinkText: {
    color: '#b32113',
    fontSize: 12,
    fontWeight: '700',
  },
  destGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  productImageWrap: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#dee8ff',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadgeWrap: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  productBadge: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  productBody: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111c2d',
    lineHeight: 17,
  },
  productSub: {
    fontSize: 10,
    color: '#5b403c',
    marginTop: 2,
  },
  productPriceRow: {
    marginTop: 10,
  },
  oldPriceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  oldPrice: {
    fontSize: 10,
    color: '#8f706b',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b32113',
  },
  finalPriceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 1,
  },
  pricePrefix: {
    fontSize: 10,
    color: '#5b403c',
  },
  finalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#b32113',
  },

  // Tips Card
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: '#dee8ff',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTitle: {
    color: '#111c2d',
    fontSize: 13,
    fontWeight: '700',
  },
  tipText: {
    color: '#5b403c',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
});
