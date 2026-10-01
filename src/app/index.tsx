import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  // const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Search Hero Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <SymbolView name="magnifyingglass" size={20} tintColor="#94a3b8" style={{ marginLeft: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm điểm đến, tour, vé, khách sạn..."
              placeholderTextColor="#94a3b8"
              onSubmitEditing={() => router.push('/ve-du-lich')}
            />
            <Pressable style={styles.searchButton} onPress={() => router.push('/ve-du-lich')}>
              <SymbolView name="magnifyingglass" size={16} tintColor="#fff" />
            </Pressable>
          </View>
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

        {/* Exclusive Offers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionSubTitle}>ĐẶC QUYỀN IGOVI</Text>
              <Text style={styles.sectionTitle}>Ưu đãi dành cho bạn</Text>
            </View>
            <Pressable onPress={() => router.push('/tour')}>
              <Text style={styles.seeAllText}>Xem tất cả ›</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            <View style={[styles.offerCard, { backgroundColor: '#ea4435' }]}>
              <View>
                <View style={styles.offerTag}><Text style={styles.offerTagText}>Chào bạn mới</Text></View>
                <Text style={styles.offerTitle}>Ưu đãi khách mới</Text>
                <Text style={styles.offerDesc}>Giảm 15% cho đơn tour đầu tiên</Text>
              </View>
              <Pressable style={styles.offerButton} onPress={() => router.push('/tour')}>
                <Text style={styles.offerButtonText}>Lấy mã ngay</Text>
              </Pressable>
            </View>
            <View style={[styles.offerCard, { backgroundColor: '#00897b' }]}>
              <View>
                <View style={styles.offerTag}><Text style={styles.offerTagText}>Cuối tuần rực rỡ</Text></View>
                <Text style={styles.offerTitle}>Săn deal cuối tuần</Text>
                <Text style={styles.offerDesc}>Giảm đến 80.000đ vé vào cổng</Text>
              </View>
              <Pressable style={[styles.offerButton, { backgroundColor: '#fff' }]} onPress={() => router.push('/ve-du-lich')}>
                <Text style={[styles.offerButtonText, { color: '#00897b' }]}>Xem ưu đãi</Text>
              </Pressable>
            </View>
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
    link: '/'
  },
];

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

  searchSection: { backgroundColor: '#fff', padding: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  searchInput: { flex: 1, padding: 10, fontSize: 14, color: '#1e293b' },
  searchButton: { backgroundColor: '#f97316', padding: 10, borderRadius: 12, margin: 4 },

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
});
