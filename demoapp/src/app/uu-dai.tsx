import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  accentColor: string;
  lightBg: string;
  borderTint: string;
  badgeTag: string;
  badgeBg: string;
  badgeText: string;
  terms: string[];
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
    accentColor: '#DC2626',
    lightBg: '#FEF2F2',
    borderTint: '#FECACA',
    badgeTag: 'Cáp treo',
    badgeBg: '#FEE2E2',
    badgeText: '#B91C1C',
    terms: [
      'Áp dụng cho mọi vé cáp treo Sun World Núi Bà Đen trên hệ thống iGovi.',
      'Giảm trực tiếp 50.000đ cho đơn hàng từ 300.000đ.',
      'Mỗi khách hàng được áp dụng 1 lần trong suốt thời gian diễn ra chương trình.',
      'Hạn sử dụng đến hết ngày 28/02/2026.',
    ],
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
    accentColor: '#D97706',
    lightBg: '#FFFBEB',
    borderTint: '#FDE68A',
    badgeTag: 'Buffet ẩm thực',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    terms: [
      'Áp dụng cho vé Buffet trưa Vân Sơn đỉnh núi Bà Đen.',
      'Giảm 100.000đ cho đơn đặt vé ẩm thực từ 500.000đ.',
      'Vé áp dụng sử dụng trực tiếp tại quầy check-in nhà hàng Vân Sơn.',
      'Mã ưu đãi đặc biệt có hiệu lực trong ngày hôm nay.',
    ],
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
    accentColor: '#0B4A37',
    lightBg: '#F0FDF4',
    borderTint: '#BBF7D0',
    badgeTag: 'Tour du lịch',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    terms: [
      'Áp dụng cho các tour trọn gói Tây Ninh, Rừng Tràm, Đồng Tháp.',
      'Giảm trực tiếp 70.000đ cho nhóm từ 2 người trở lên.',
      'Bao gồm hướng dẫn viên, xe đưa đón và vé các điểm tham quan.',
      'Hạn sử dụng đến ngày 15/03/2026.',
    ],
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
    accentColor: '#2563EB',
    lightBg: '#EFF6FF',
    borderTint: '#BFDBFE',
    badgeTag: 'Ví điện tử',
    badgeBg: '#DBEAFE',
    badgeText: '#1D4ED8',
    terms: [
      'Áp dụng khi chọn phương thức thanh toán ví ZaloPay hoặc MoMo.',
      'Giảm thêm 30.000đ cho đơn đặt dịch vụ từ 200.000đ.',
      'Không áp dụng đồng thời với một số chương trình đối tác thẻ khác.',
      'Hạn sử dụng đến hết ngày 31/03/2026.',
    ],
  },
];

const DESTINATION_DEALS = [
  {
    id: 'd1',
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    sub: 'Hơn 80 món Á - Âu đặc sắc',
    tag: 'Vé QR tức thì',
    tagBg: '#059669',
    oldPrice: '299.000đ',
    discount: '-14%',
    price: '250.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzCzUaEIkgyaBM0AO8x2GMnrVs48dNGNrP1aBW6oOmB6cEPc2zjRsd--8Phv4oD9BCLI8PktLj0HmkG2y9TR9z2gxV2pHs6afcjIGZYivn6tQx5q-oz8Xvphdwd3fqGp7HOKA2Nbtt07mnNudoMUAS9u7Li9ET4p9xdDFL9MYiNcZLp2LoV7Tq-nQyDima0U2dC5ywZ4fvBHbMN2_XZVsxq6D_98h3eI-XwMiiPOtOlNo3YVzxagMrOA',
    location: 'Tây Ninh',
    route: '/chi-tiet-ve',
  },
  {
    id: 'd2',
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    sub: 'Khứ hồi tuyến Chùa Hang',
    tag: 'Bán chạy',
    tagBg: '#D97706',
    oldPrice: '280.000đ',
    discount: '-12%',
    price: '245.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfcIvOC1gxYFDSQ6Ub1DGTVu-8zNRyt2SsoqTiWlxDODsCB-aR8dJF97wKhehXxbOurfZVxIJTK8p6RJ1T4D9zNvmvy2THEX77I7EBrxPbQ5yZ_c0XqO9Cugacww1NoHfAjQLa3ztKsPB7JtJ9G-mfxCqQ2HB5798_brtvWzBLy6ppWWOyy5q8Eb1VQVYDQS2dNL7Zx8d-ZavEPyyuq8HAkEo-GyHgtgNJw9OiCnwZbOcWiJq7hqInAQ',
    location: 'Tây Ninh',
    route: '/chi-tiet-ve',
  },
  {
    id: 'd3',
    name: 'Tour Săn Mây Cầu Đất Đà Lạt 1 ngày',
    sub: 'Đón tận nơi tại khách sạn',
    tag: 'Ưu đãi tuần',
    tagBg: '#EA580C',
    oldPrice: '350.000đ',
    discount: '-15%',
    price: '299.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQm2J5lQsCHqP78bWx11PBfyeMHukqq_Mjg_-u9io_z3jJiJpNND9jjJQGpagvFRy5KsvXdCNP8dBQl3xfW-ZpEyK0a2--B40Da78-_oxFvTqHCn7QyAjoXSlrw8EejENPsyLbCr4ba4VzCfgQ6slyy6MfVCDIgBm3xJeFwCWUymuPQCDnD7AVuwcNwdffMUrmyz7nZhbbn6Mlg7wlLaIGbQOyh-rG4Bcp5eo4E_rp5XEJKUnK27s8kA',
    location: 'Đà Lạt',
    route: '/tour-da-lat',
  },
  {
    id: 'd4',
    name: 'Vé show Tinh Hoa Việt Nam Phú Quốc',
    sub: 'Trực tiếp qua cổng không xếp hàng',
    tag: 'Vé QR tức thì',
    tagBg: '#059669',
    oldPrice: '300.000đ',
    discount: '-10%',
    price: '270.000đ',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC9tlLHc-CdP2a-kZWrTLAZXAeAQhjLtQuoxOepwRjXl0fjXZkdLH6xEiWA5JKQfr0uua4qljuuQErKQviYWP64ZY5YuEDCWdTljq79tD7FJeW5GuHZW_LdbFU_aIIjrxVEkR56MvOCs0r5qk1KdBSR1ZpaCN5z7a7p_3NuXi2RMB6GEz-lUfE60yxnerfi21seexglcfxI9K_5AcWwJ16YQdavNrKWYz0afh_-ovDglVCH1e4PZ9KSuQ',
    location: 'Phú Quốc',
    route: '/chi-tiet-ve',
  },
];

const CATEGORY_CHIPS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'cap-treo', label: 'Vé cáp treo & Tham quan' },
  { id: 'am-thuc', label: 'Ẩm thực & Buffet' },
  { id: 'luu-tru', label: 'Lưu trú & Homestay' },
  { id: 'tour', label: 'Tour du lịch' },
  { id: 'vi', label: 'Ví điện tử' },
];

export default function UuDaiScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mainScrollRef = useRef<ScrollView>(null);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyValid, setOnlyValid] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [voucherList, setVoucherList] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [savedCount, setSavedCount] = useState(4);
  const [customCode, setCustomCode] = useState('');
  const [heroClaimed, setHeroClaimed] = useState(false);

  // Modal detail
  const [selectedModalVoucher, setSelectedModalVoucher] = useState<Voucher | null>(null);

  // Toggle save voucher
  const handleToggleSaveVoucher = (id: string, code: string) => {
    setVoucherList((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const nextState = !v.isSaved;
          if (nextState) {
            setSavedCount((c) => c + 1);
            Alert.alert('Thành công', `Đã lưu mã [${code}] vào ví voucher của bạn!`);
          } else {
            setSavedCount((c) => Math.max(0, c - 1));
          }
          return { ...v, isSaved: nextState };
        }
        return v;
      })
    );
  };

  // Claim hero promo
  const handleClaimHeroPromo = () => {
    if (heroClaimed) {
      Alert.alert('Thông báo', 'Bạn đã nhận mã ưu đãi hè [IGOVI150] rồi!');
      return;
    }
    setHeroClaimed(true);
    setSavedCount((c) => c + 1);
    Alert.alert('Chúc mừng!', 'Đã nhận thành công mã [IGOVI150] giảm đến 150K cho đơn trải nghiệm!');
  };

  // Apply custom code
  const handleApplyCode = () => {
    const code = customCode.trim().toUpperCase();
    if (!code) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã voucher!');
      return;
    }

    if (
      code === 'CHAOBANMOI' ||
      code === 'IGOVI150' ||
      code === 'SUNWORLD50' ||
      code === 'BUFFETVANSON' ||
      code === 'TOURTAYNINH' ||
      code === 'VIMOI30'
    ) {
      setSavedCount((c) => c + 1);
      Alert.alert('Áp dụng thành công!', `Mã [${code}] hợp lệ! Đã thêm vào ví ưu đãi của bạn.`);
      setCustomCode('');
    } else {
      Alert.alert('Thông báo mã', `Mã [${code}] đã được ghi nhận. Bạn có thể sử dụng tại bước thanh toán!`);
      setCustomCode('');
    }
  };

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    return voucherList.filter((v) => {
      const matchCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const matchSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchValid = onlyValid ? !v.expiryUrgent : true;
      return matchCategory && matchSearch && matchValid;
    });
  }, [voucherList, selectedCategory, searchQuery, onlyValid]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B4A37" />

      {/* BEGIN: Header (TopBar & Header chuẩn Stitch đồng bộ phong cách vé du lịch) */}
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
            <Text style={styles.headerTitleText}>Ưu Đãi & Khuyến Mãi</Text>
            <View style={styles.headerSubRow}>
              <SymbolView name="sparkles" size={11} tintColor="#6EE7B7" />
              <Text style={styles.headerSubText}>Mã giảm giá & voucher độc quyền</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => {
              mainScrollRef.current?.scrollTo({ y: 140, animated: true });
            }}
            hitSlop={8}
            accessibilityLabel="Tìm kiếm"
          >
            <SymbolView name="magnifyingglass" size={15} tintColor="#FFFFFF" />
          </Pressable>

          <Pressable
            style={styles.headerIconBtn}
            onPress={() =>
              Alert.alert('Ví voucher & Ưu đãi', `Bạn đang có ${savedCount} mã voucher sẵn sàng sử dụng!`)
            }
            hitSlop={8}
            accessibilityLabel="Thông báo ưu đãi"
          >
            <SymbolView name="bell" size={15} tintColor="#FFFFFF" />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      </View>

      {/* BEGIN: Scrollable Content Body */}
      <ScrollView
        ref={mainScrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* BEGIN: Featured Promo Banner Hero ("Săn mã giảm đến 150K") */}
        <View style={styles.heroPromoBanner}>
          <View style={styles.heroGlowCircle} />
          <View style={styles.heroPromoContent}>
            <View style={styles.heroPromoLeft}>
              <View style={styles.heroExclusivePill}>
                <Text style={styles.heroExclusiveText}>★ Ưu đãi độc quyền iGovi</Text>
              </View>
              <Text style={styles.heroPromoTitle}>Săn mã giảm đến 150K</Text>
              <Text style={styles.heroPromoDesc}>Áp dụng cho mọi đơn trải nghiệm hè này</Text>
            </View>

            <Pressable
              style={[styles.heroClaimBtn, heroClaimed && styles.heroClaimBtnActive]}
              onPress={handleClaimHeroPromo}
            >
              <Text style={[styles.heroClaimBtnText, heroClaimed && styles.heroClaimBtnTextActive]}>
                {heroClaimed ? 'Đã nhận ✓' : 'Nhận ngay'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* BEGIN: Search & Filter Segment */}
        <View style={styles.searchFilterSection}>
          <View style={styles.searchRow}>
            {/* Search Input Box */}
            <View style={styles.searchBox}>
              <SymbolView name="magnifyingglass" size={16} tintColor="#94A3B8" />
              <TextInput
                placeholder="Tìm kiếm mã giảm giá, ưu đãi..."
                style={styles.searchInput}
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                  <SymbolView name="xmark.circle.fill" size={15} tintColor="#94A3B8" />
                </Pressable>
              )}
            </View>

            {/* Quick Filter Pill: "Còn hạn" */}
            <Pressable
              style={[styles.filterPillBtn, onlyValid && styles.filterPillBtnActive]}
              onPress={() => setOnlyValid(!onlyValid)}
            >
              <Text style={[styles.filterPillText, onlyValid && styles.filterPillTextActive]}>
                Còn hạn
              </Text>
              <SymbolView
                name={onlyValid ? 'checkmark' : 'chevron.down'}
                size={11}
                tintColor={onlyValid ? '#FFFFFF' : '#64748B'}
              />
            </Pressable>
          </View>

          {/* Category Chips Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsScroll}
          >
            {CATEGORY_CHIPS.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.catChip, isActive && styles.catChipActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* BEGIN: User Voucher Wallet & Redeem Box ("Kho voucher của bạn") */}
        <View style={styles.walletCard}>
          <View style={styles.walletTopRow}>
            <View style={styles.walletInfoLeft}>
              <View style={styles.walletIconBox}>
                <SymbolView name="ticket.fill" size={18} tintColor="#EA580C" />
              </View>
              <View>
                <Text style={styles.walletTitle}>Kho voucher của bạn</Text>
                <Text style={styles.walletSubtitle}>
                  Bạn đang có <Text style={styles.walletCountHighlight}>{savedCount} voucher</Text> sẵn sàng dùng
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Ví voucher',
                  `Bạn đang sở hữu ${savedCount} mã voucher đã lưu trong tài khoản.`
                )
              }
            >
              <Text style={styles.walletLink}>Ví voucher ›</Text>
            </Pressable>
          </View>

          {/* Quick Voucher Code Input */}
          <View style={styles.walletInputRow}>
            <TextInput
              style={styles.walletInput}
              placeholder="Nhập mã voucher iGovi..."
              placeholderTextColor="#94A3B8"
              value={customCode}
              onChangeText={setCustomCode}
              autoCapitalize="characters"
            />
            <Pressable style={styles.applyCodeBtn} onPress={handleApplyCode}>
              <Text style={styles.applyCodeBtnText}>Áp dụng</Text>
            </Pressable>
          </View>
        </View>

        {/* BEGIN: New Customer Special Highlight Card ("Ưu đãi khách mới") */}
        <Pressable
          style={styles.newUserBannerCard}
          onPress={() =>
            setSelectedModalVoucher({
              id: 'new_user',
              code: 'CHAOBANMOI',
              title: 'Ưu đãi khách mới - iGovi',
              desc: 'Giảm ngay 15% (tối đa 150.000đ) khi đặt vé tham quan hoặc tour đầu tiên.',
              category: 'all',
              discount: '15%',
              minSpend: 'Cho đơn đầu tiên',
              hsd: 'HSD: 31/03/2026',
              usedPercent: 20,
              isSaved: false,
              accentColor: '#EA580C',
              lightBg: '#FFF7ED',
              borderTint: '#FED7AA',
              badgeTag: 'Khách mới',
              badgeBg: '#FFEDD5',
              badgeText: '#C2410C',
              terms: [
                'Áp dụng cho tài khoản đăng ký mới và đặt dịch vụ lần đầu trên iGovi.',
                'Mức giảm 15% tối đa 150.000đ.',
                'Áp dụng cho toàn bộ danh mục vé du lịch, buffet và tour trọn gói.',
                'Hạn sử dụng đến hết ngày 31/03/2026.',
              ],
            })
          }
        >
          <View style={styles.newUserTopRow}>
            <View style={styles.newUserPillBadge}>
              <Text style={styles.newUserPillText}>CHÀO BẠN MỚI</Text>
            </View>
            <View style={styles.newUserDataCode}>
              <Text style={styles.newUserDataCodeText}>Mã: CHAOBANMOI</Text>
            </View>
          </View>

          <Text style={styles.newUserTitle}>Ưu đãi khách mới</Text>
          <Text style={styles.newUserDesc}>
            Giảm ngay 15% (tối đa 150.000đ) khi đặt vé tham quan hoặc tour đầu tiên.
          </Text>

          <View style={styles.newUserBottomRow}>
            <View style={styles.newUserBtn}>
              <Text style={styles.newUserBtnText}>Xem chi tiết ›</Text>
            </View>
            <Text style={styles.newUserHsd}>HSD: 31/03/2026</Text>
          </View>
        </Pressable>

        {/* BEGIN: Exclusive Voucher List ("Ưu đãi dành cho bạn") */}
        <View style={styles.voucherSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubtitle}>ĐẶC QUYỀN IGOVI</Text>
              <Text style={styles.sectionTitle}>Ưu đãi dành cho bạn</Text>
            </View>
            <Pressable onPress={() => setSelectedCategory('all')}>
              <Text style={styles.sectionSeeAllLink}>Xem tất cả</Text>
            </Pressable>
          </View>

          {filteredVouchers.length === 0 ? (
            <View style={styles.emptyStateBox}>
              <SymbolView name="tag.slash" size={36} tintColor="#94A3B8" />
              <Text style={styles.emptyStateText}>
                Không tìm thấy voucher phù hợp với bộ lọc hiện tại.
              </Text>
              <Pressable
                style={styles.emptyResetBtn}
                onPress={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyValid(false);
                }}
              >
                <Text style={styles.emptyResetBtnText}>Xem lại tất cả ưu đãi</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.vouchersListWrap}>
              {filteredVouchers.map((voucher) => (
                <View key={voucher.id} style={styles.ticketStubContainer}>
                  {/* Perforation Cutouts */}
                  <View style={styles.notchLeft} />
                  <View style={styles.notchRight} />

                  {/* Left Discount Stub */}
                  <View style={[styles.stubLeft, { backgroundColor: voucher.lightBg }]}>
                    <Text style={[styles.stubTagGiam, { color: voucher.accentColor }]}>
                      GIẢM
                    </Text>
                    <Text style={[styles.stubDiscountVal, { color: voucher.accentColor }]}>
                      {voucher.discount}
                    </Text>
                    <Text style={styles.stubMinSpend}>{voucher.minSpend}</Text>
                  </View>

                  {/* Dashed Vertical Divider */}
                  <View style={styles.dashedDivider} />

                  {/* Right Details Stub */}
                  <View style={styles.stubRight}>
                    <View style={styles.stubMetaRow}>
                      <View style={[styles.stubCategoryTag, { backgroundColor: voucher.badgeBg }]}>
                        <Text style={[styles.stubCategoryTagText, { color: voucher.badgeText }]}>
                          {voucher.badgeTag}
                        </Text>
                      </View>

                      <Pressable
                        style={styles.stubHsdRow}
                        onPress={() => setSelectedModalVoucher(voucher)}
                        hitSlop={6}
                      >
                        <Text
                          style={[
                            styles.stubHsdText,
                            voucher.expiryUrgent && styles.stubHsdUrgent,
                          ]}
                        >
                          {voucher.hsd}
                        </Text>
                        <Text style={styles.stubDetailsLink}>· Chi tiết ›</Text>
                      </Pressable>
                    </View>

                    <Text style={styles.stubTitle} numberOfLines={1}>
                      {voucher.title}
                    </Text>
                    <Text style={styles.stubDesc} numberOfLines={1}>
                      {voucher.desc}
                    </Text>

                    {/* Progress Bar & Save Action */}
                    <View style={styles.stubBottomRow}>
                      <View style={styles.progressBarWrapper}>
                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${voucher.usedPercent}%`,
                                backgroundColor: voucher.accentColor,
                              },
                            ]}
                          />
                        </View>
                        <Text
                          style={[
                            styles.progressText,
                            voucher.usedPercent >= 90 && { color: '#DC2626', fontWeight: '800' },
                          ]}
                        >
                          {voucher.usedPercent >= 90
                            ? `Sắp hết - ${voucher.usedPercent}%`
                            : `Đã dùng ${voucher.usedPercent}%`}
                        </Text>
                      </View>

                      <Pressable
                        style={[
                          styles.claimVoucherBtn,
                          voucher.isSaved && styles.claimVoucherBtnSaved,
                        ]}
                        onPress={() => handleToggleSaveVoucher(voucher.id, voucher.code)}
                        hitSlop={6}
                      >
                        <Text
                          style={[
                            styles.claimVoucherBtnText,
                            voucher.isSaved && styles.claimVoucherBtnTextSaved,
                          ]}
                        >
                          {voucher.isSaved ? 'Đã lưu ✓' : 'Lưu mã'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* BEGIN: Destination Deals Grid ("Ưu đãi theo điểm đến") */}
        <View style={styles.destDealsSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubtitle}>GỢI Ý ĐỂ BẮT ĐẦU</Text>
              <Text style={styles.sectionTitle}>Ưu đãi theo điểm đến</Text>
            </View>
            <Pressable onPress={() => router.push('/ve-du-lich')}>
              <Text style={styles.sectionSeeAllLink}>Khám phá</Text>
            </Pressable>
          </View>

          {/* 2-Column Responsive Deals Grid */}
          <View style={styles.destGrid}>
            {DESTINATION_DEALS.map((deal) => (
              <Pressable
                key={deal.id}
                style={styles.dealCard}
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
                {/* Image & Top Badge */}
                <View style={styles.dealImageContainer}>
                  <Image source={{ uri: deal.image }} style={styles.dealImage} contentFit="cover" />
                  <View style={styles.dealDarkOverlay} />
                  <View style={[styles.dealBadgeTop, { backgroundColor: deal.tagBg }]}>
                    <Text style={styles.dealBadgeTopText}>{deal.tag}</Text>
                  </View>
                </View>

                {/* Deal Card Content */}
                <View style={styles.dealCardBody}>
                  <Text style={styles.dealTitle} numberOfLines={2}>
                    {deal.name}
                  </Text>
                  <Text style={styles.dealSub} numberOfLines={1}>
                    {deal.sub}
                  </Text>

                  {/* Price Row */}
                  <View style={styles.dealPriceContainer}>
                    <View style={styles.dealOldPriceRow}>
                      <Text style={styles.dealOldPrice}>{deal.oldPrice}</Text>
                      <View style={styles.dealDiscountPill}>
                        <Text style={styles.dealDiscountText}>{deal.discount}</Text>
                      </View>
                    </View>
                    <View style={styles.dealCurrentPriceRow}>
                      <Text style={styles.dealPricePrefix}>Từ </Text>
                      <Text style={styles.dealPriceVal}>{deal.price}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* BEGIN: Trust & Guarantee Banner */}
        <View style={styles.trustBanner}>
          <View style={styles.trustLeft}>
            <View style={styles.trustIconBox}>
              <SymbolView name="checkmark.shield.fill" size={17} tintColor="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.trustTitle}>Vé chuẩn đại lý – Đi ngay không chờ</Text>
              <Text style={styles.trustSubtitle}>
                Hỗ trợ đối soát mã QR 24/7 trực tiếp tại quầy
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() =>
              Alert.alert('Hỗ trợ iGovi', 'Hotline hỗ trợ đối soát mã QR 24/7: 1900 6868')
            }
          >
            <Text style={styles.trustActionText}>Hỗ trợ</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* BEGIN: Voucher Detail Modal */}
      <Modal
        visible={!!selectedModalVoucher}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedModalVoucher(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleCol}>
                <Text style={styles.modalVoucherCode}>MÃ: {selectedModalVoucher?.code}</Text>
                <Text style={styles.modalVoucherTitle}>{selectedModalVoucher?.title}</Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setSelectedModalVoucher(null)}
                hitSlop={8}
              >
                <SymbolView name="xmark" size={16} tintColor="#64748B" />
              </Pressable>
            </View>

            <View style={styles.modalDiscountBox}>
              <Text style={styles.modalDiscountLabel}>MỨC GIẢM ƯU ĐÃI</Text>
              <Text style={styles.modalDiscountValue}>{selectedModalVoucher?.discount}</Text>
              <Text style={styles.modalMinSpendText}>{selectedModalVoucher?.minSpend}</Text>
            </View>

            <Text style={styles.modalSectionTitle}>Điều kiện áp dụng</Text>
            <View style={styles.modalTermsList}>
              {selectedModalVoucher?.terms?.map((term, tIdx) => (
                <View key={tIdx} style={styles.modalTermRow}>
                  <Text style={styles.modalTermBullet}>•</Text>
                  <Text style={styles.modalTermText}>{term}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modalActionsRow}>
              <Pressable
                style={styles.modalCopyBtn}
                onPress={() => {
                  if (selectedModalVoucher) {
                    Alert.alert(
                      'Đã sao chép!',
                      `Mã [${selectedModalVoucher.code}] đã được sao chép vào bộ nhớ tạm.`
                    );
                  }
                }}
              >
                <SymbolView name="doc.on.doc" size={15} tintColor="#0B4A37" />
                <Text style={styles.modalCopyBtnText}>Sao chép mã</Text>
              </Pressable>

              <Pressable
                style={styles.modalUseNowBtn}
                onPress={() => {
                  const v = selectedModalVoucher;
                  setSelectedModalVoucher(null);
                  if (v) {
                    if (v.category === 'tour') {
                      router.push('/tour');
                    } else {
                      router.push('/ve-du-lich');
                    }
                  }
                }}
              >
                <Text style={styles.modalUseNowBtnText}>Sử dụng ngay</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* Header Top Bar & Nav (Đồng bộ chuẩn phong cách xanh #0B4A37 của Vé du lịch) */
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

  /* Scroll Content */
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  /* Hero Promo Banner */
  heroPromoBanner: {
    backgroundColor: '#C2410C',
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#C2410C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroGlowCircle: {
    position: 'absolute',
    right: -20,
    bottom: -25,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroPromoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroPromoLeft: {
    flex: 1,
  },
  heroExclusivePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroExclusiveText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FEF08A',
    letterSpacing: 0.4,
  },
  heroPromoTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroPromoDesc: {
    fontSize: 11,
    color: '#FFEDD5',
    marginTop: 2,
  },
  heroClaimBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  heroClaimBtnActive: {
    backgroundColor: '#FEF08A',
  },
  heroClaimBtnText: {
    color: '#C2410C',
    fontSize: 11.5,
    fontWeight: '800',
  },
  heroClaimBtnTextActive: {
    color: '#7C2D12',
  },

  /* Search & Filter Section */
  searchFilterSection: {
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 38,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 11.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 24,
    gap: 4,
  },
  filterPillBtnActive: {
    backgroundColor: '#0B4A37',
    borderColor: '#0B4A37',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  categoryChipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  catChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  catChipActive: {
    backgroundColor: '#0B4A37',
    borderColor: '#0B4A37',
  },
  catChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* User Voucher Wallet & Redeem Box */
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  walletTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  walletSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  walletCountHighlight: {
    color: '#EA580C',
    fontWeight: '800',
  },
  walletLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
  },
  walletInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 38,
    fontSize: 11.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  applyCodeBtn: {
    backgroundColor: '#0B4A37',
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyCodeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  /* New Customer Highlight Card */
  newUserBannerCard: {
    backgroundColor: '#EA580C',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  newUserTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  newUserPillBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  newUserPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  newUserDataCode: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  newUserDataCodeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#FFFFFF',
  },
  newUserTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  newUserDesc: {
    fontSize: 11.5,
    color: '#FFEDD5',
    marginTop: 4,
    lineHeight: 16,
  },
  newUserBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  newUserBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  newUserBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#C2410C',
  },
  newUserHsd: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },

  /* Exclusive Voucher Section */
  voucherSection: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionSubtitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0B4A37',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  sectionSeeAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B4A37',
  },

  /* Empty State */
  emptyStateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  emptyResetBtn: {
    marginTop: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  emptyResetBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0B4A37',
  },

  /* Ticket Stub Cards */
  vouchersListWrap: {
    gap: 12,
  },
  ticketStubContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0B4A37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  notchLeft: {
    position: 'absolute',
    left: 88,
    top: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  notchRight: {
    position: 'absolute',
    left: 88,
    bottom: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  stubLeft: {
    width: 96,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  stubTagGiam: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stubDiscountVal: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 26,
    marginTop: 1,
  },
  stubMinSpend: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  dashedDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  stubRight: {
    flex: 1,
    padding: 12,
    paddingLeft: 14,
    justifyContent: 'space-between',
  },
  stubMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stubCategoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stubCategoryTagText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  stubHsdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stubHsdText: {
    fontSize: 10,
    color: '#64748B',
  },
  stubHsdUrgent: {
    color: '#DC2626',
    fontWeight: '800',
  },
  stubDetailsLink: {
    fontSize: 10,
    color: '#EA580C',
    fontWeight: '700',
    marginLeft: 2,
  },
  stubTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  stubDesc: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  stubBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  progressBarWrapper: {
    flex: 1,
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 3,
  },
  claimVoucherBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  claimVoucherBtnSaved: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  claimVoucherBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  claimVoucherBtnTextSaved: {
    color: '#059669',
  },

  /* Destination Deals Grid */
  destDealsSection: {
    gap: 12,
    paddingTop: 4,
  },
  destGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dealCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dealImageContainer: {
    height: 105,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  dealDarkOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  dealBadgeTop: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    zIndex: 10,
  },
  dealBadgeTopText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  dealCardBody: {
    padding: 10,
    justifyContent: 'space-between',
    minHeight: 95,
  },
  dealTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 15,
  },
  dealSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  dealPriceContainer: {
    marginTop: 6,
  },
  dealOldPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dealOldPrice: {
    fontSize: 9.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  dealDiscountPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dealDiscountText: {
    fontSize: 8.5,
    color: '#DC2626',
    fontWeight: '800',
  },
  dealCurrentPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 1,
  },
  dealPricePrefix: {
    fontSize: 9.5,
    color: '#64748B',
  },
  dealPriceVal: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#EA580C',
  },

  /* Trust Banner */
  trustBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  trustLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trustIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0B4A37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B4A37',
  },
  trustSubtitle: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  trustActionText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0B4A37',
    textDecorationLine: 'underline',
  },

  /* Modal Details */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    gap: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalHeaderTitleCol: {
    flex: 1,
  },
  modalVoucherCode: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.8,
  },
  modalVoucherTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDiscountBox: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  modalDiscountLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#C2410C',
    letterSpacing: 0.5,
  },
  modalDiscountValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#EA580C',
    marginVertical: 2,
  },
  modalMinSpendText: {
    fontSize: 11,
    color: '#64748B',
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalTermsList: {
    gap: 6,
  },
  modalTermRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  modalTermBullet: {
    fontSize: 14,
    color: '#0B4A37',
    lineHeight: 18,
  },
  modalTermText: {
    flex: 1,
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 17,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  modalCopyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  modalCopyBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0B4A37',
  },
  modalUseNowBtn: {
    flex: 1,
    backgroundColor: '#0B4A37',
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalUseNowBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
// TEST GIT