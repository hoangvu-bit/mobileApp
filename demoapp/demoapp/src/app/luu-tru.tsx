import GlobalFooter from '../components/global-footer';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


export default function LuuTruScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <SymbolView name="chevron.left" size={22} tintColor="#0f172a" />
        </Pressable>
        <Text style={styles.topHeaderTitle}>Khách sạn & Lưu trú</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.homeBtn} hitSlop={10}>
          <SymbolView name="house.fill" size={20} tintColor="#00897b" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header Hero Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lưu trú du l�9ch</Text>
          <Text style={styles.headerSubtitle}>Khách sạn, homestay, resort và nơi ngh�0 phù hợp</Text>
        </View>

        {/* Search Form */}
        <View style={styles.searchSection}>
          <View style={styles.searchForm}>
            <View style={styles.searchInputGroup}>
              <SymbolView name="magnifyingglass" size={16} tintColor="#168b58" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.searchLabel}>Tên hoặc khu vực</Text>
                <TextInput
                  placeholder="Resort, Hội An, Phú Quốc..."
                style={styles.searchInput}
                placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            <View style={styles.separator} />

            <View style={styles.searchRow}>
              <View style={[styles.searchInputGroup, { flex: 1 }]}>
                <SymbolView name="calendar" size={16} tintColor="#168b58" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.searchLabel}>Nhận - Trả phòng</Text>
                  <Text style={styles.searchText}>29/09 - 30/09</Text>
                </View>
              </View>
              <View style={[styles.searchInputGroup, { flex: 1, marginLeft: 8 }]}>
                <SymbolView name="person.2.fill" size={16} tintColor="#168b58" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.searchLabel}>Khách & Phòng</Text>
                  <Text style={styles.searchText}>2 khách, 1 phòng</Text>
                </View>
              </View>
            </View>

            <Pressable style={styles.searchButton}>
              <SymbolView name="magnifyingglass" size={16} tintColor="#fff" />
              <Text style={styles.searchButtonText}>Tìm phòng</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFilters}>
            {['Cần Thơ', 'Đà Nẵng', 'Kiên Giang', 'Lào Cai', 'Ninh Bình', 'Tây Ninh'].map((item, idx) => (
              <Pressable key={idx} style={styles.quickFilterItem}>
                <Text style={styles.quickFilterItemText}>{item}</Text>
              </Pressable>
            ))}
      </ScrollView>

          {/* Special Offer Banner */}
          <View style={styles.offerBanner}>
            <SymbolView name="percent" size={24} tintColor="#168b58" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.offerBannerTitle}>Ưu ãi khách sạn ến 20%</Text>
              <Text style={styles.offerBannerSub}>1 ch ngh0 ang giảm giá</Text>
            </View>
            <Pressable style={styles.offerBannerBtn}>
              <Text style={styles.offerBannerBtnText}>Xem ngay</Text>
            </Pressable>
          </View>
        </View>

        {/* List of Hotels */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <View>
              <Text style={styles.listSubTitle}>Khám phá ch ngh0</Text>
              <Text style={styles.listTitle}>12 ch ngh0</Text>
            </View>
            <Pressable style={styles.filterBtn}>
              <SymbolView name="slider.horizontal.3" size={14} tintColor="#0f2b28" />
              <Text style={styles.filterBtnText}>Lọc</Text>
            </Pressable>
          </View>

          <View style={styles.hotelGrid}>
            {HOTELS.map((hotel, idx) => (
              <View key={idx} style={styles.hotelCard}>
                <View style={styles.hotelImageContainer}>
                  <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                  <View style={styles.hotelBadgeCount}>
                    <SymbolView name="camera.fill" size={12} tintColor="#fff" />
                    <Text style={styles.hotelBadgeCountText}>{hotel.imageCount} ảnh</Text>
                  </View>
                </View>

                <View style={styles.hotelContent}>
                  <View style={styles.hotelTagsRow}>
                    <Text style={styles.tagPrimary}>M�:i trên igovi</Text>
                    <Text style={styles.tagSecondary}>�a� Xác nhận tức thì</Text>
                  </View>

                  <Text style={styles.hotelName} numberOfLines={2}>{hotel.name}</Text>
                  <View style={styles.hotelLocationRow}>
                    <SymbolView name="mappin.and.ellipse" size={12} tintColor="#168b58" />
                    <Text style={styles.hotelLocation}>{hotel.location}</Text>
                  </View>

                  <View style={styles.hotelRoomInfo}>
                    <Text style={styles.roomType}>{hotel.roomType}</Text>
                    <Text style={styles.roomDesc}>{hotel.guests} ⬢ {hotel.size} ⬢ {hotel.bed}</Text>
                  </View>

                  <View style={styles.hotelAmenities}>
                    <Text style={styles.amenityText}>�S Linh hoạt trư�:c 72h</Text>
                    <Text style={styles.amenityText}>�S Dọn phòng</Text>
                    <Text style={styles.amenityText}>�S Wi-Fi mi�&n phí</Text>
                  </View>
                </View>

                <View style={styles.hotelFooter}>
                  <View>
                    <View style={styles.discountBadge}><Text style={styles.discountBadgeText}>Ưu �ãi -20%</Text></View>
                    <Text style={styles.oldPrice}>{hotel.oldPrice}</Text>
                    <Text style={styles.newPrice}>{hotel.newPrice}</Text>
                    <Text style={styles.priceDesc}>/ phòng / �êm</Text>
                  </View>
                  <Pressable style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Chọn phòng</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>

        <GlobalFooter />
      </ScrollView>

    </View>
  );
}

const HOTELS = [
  {
    name: 'Resort Vườn Cau Tây Ninh - Bình yên thôn quê',
    location: 'Gò Dầu, Tây Ninh',
    roomType: 'Garden View Villa',
    guests: '2 người l�:n, 2 trẻ em',
    size: '45 m²',
    bed: '1 giường �ôi l�:n & 1 �ơn',
    oldPrice: '1.100.000 ��',
    newPrice: '880.000 ��',
    imageCount: 31,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mekong Tani Hotel - Chuẩn 4 Sao Trung Tâm',
    location: 'TP. Tây Ninh, Tây Ninh',
    roomType: 'Deluxe Double City View',
    guests: '2 người l�:n',
    size: '35 m²',
    bed: '1 giường �ôi l�:n',
    oldPrice: '950.000 ��',
    newPrice: '750.000 ��',
    imageCount: 24,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
  }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8f6' },
  scrollContent: { paddingBottom: 80 },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    padding: 6,
    marginLeft: -6,
  },
  topHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  homeBtn: {
    padding: 6,
    marginRight: -6,
  },

  header: { padding: 16, backgroundColor: '#34348c', paddingBottom: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  searchSection: { marginTop: -20, paddingHorizontal: 16, zIndex: 10 },
  searchForm: { backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  searchInputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbfaf6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  searchLabel: { fontSize: 9, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 2 },
  searchInput: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', padding: 0 },
  searchText: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  separator: { height: 8 },
  searchRow: { flexDirection: 'row' },
  searchButton: { backgroundColor: '#c85a32', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 8, marginTop: 8, gap: 8 },
  searchButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 },

  quickFilters: { marginTop: 16, flexDirection: 'row' },
  quickFilterItem: { backgroundColor: '#eef5f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 8 },
  quickFilterItemText: { fontSize: 11, fontWeight: 'bold', color: '#1e514d' },

  offerBanner: { marginTop: 16, backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  offerBannerTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f2b28' },
  offerBannerSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  offerBannerBtn: { backgroundColor: '#0f2b28', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  offerBannerBtnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  listSection: { padding: 16, marginTop: 8 },
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  listSubTitle: { fontSize: 10, fontWeight: 'bold', color: '#c85a32', textTransform: 'uppercase' },
  listTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  filterBtnText: { fontSize: 12, fontWeight: 'bold', color: '#0f2b28' },

  hotelGrid: { gap: 16 },
  hotelCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#e2e8f0' },
  hotelImageContainer: { height: 200, width: '100%', position: 'relative' },
  hotelImage: { width: '100%', height: '100%' },
  hotelBadgeCount: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  hotelBadgeCountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  hotelContent: { padding: 16 },
  hotelTagsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tagPrimary: { backgroundColor: '#edf8f3', color: '#168b58', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagSecondary: { color: '#168b58', fontSize: 10, fontWeight: 'bold' },

  hotelName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  hotelLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  hotelLocation: { fontSize: 11, color: '#64748b' },

  hotelRoomInfo: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12, marginBottom: 12 },
  roomType: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  roomDesc: { fontSize: 11, color: '#64748b' },

  hotelAmenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityText: { fontSize: 10, color: '#1e514d', fontWeight: '600' },

  hotelFooter: { backgroundColor: '#fbfcfb', padding: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  discountBadge: { backgroundColor: '#fff0f3', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  discountBadgeText: { color: '#c2234d', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  oldPrice: { fontSize: 11, color: '#94a3b8', textDecorationLine: 'line-through' },
  newPrice: { fontSize: 18, fontWeight: 'bold', color: '#e34f21' },
  priceDesc: { fontSize: 10, color: '#64748b' },
  bookBtn: { backgroundColor: '#168b58', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  bookBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
