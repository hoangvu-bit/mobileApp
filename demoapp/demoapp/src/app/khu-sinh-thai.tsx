import GlobalFooter from '../components/global-footer';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function KhuSinhThaiScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=84' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <SymbolView name="leaf.fill" size={14} tintColor="#ffd89a" />
              <Text style={styles.badgeText}>Cẩm nang khu sinh thái</Text>
            </View>
            <Text style={styles.heroTitle}>Khám phá khu sinh thái trước khi chọn vé</Text>
            <Text style={styles.heroSubtitle}>Xem câu chuyện điểm đến, hoạt động nổi bật, tiện ích và kinh nghiệm đi chơi.</Text>

            <View style={styles.searchForm}>
              <View style={styles.searchInputGroup}>
                <SymbolView name="magnifyingglass" size={20} tintColor="#168b58" />
                <TextInput 
                  placeholder="Tìm khu sinh thái, tỉnh thành..." 
                  style={styles.searchInput}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <Pressable style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Khám phá</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickTags}>
              {['Tây Ninh', 'Đà Lạt', 'Cần Thơ', 'Phú Quốc', 'Ninh Bình'].map((item, idx) => (
                <Pressable key={idx} style={styles.quickTagItem}>
                  <Text style={styles.quickTagText}>{item}</Text>
                </Pressable>
              ))}
      </ScrollView>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsLabel}>Nội dung nổi bật</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statDesc}>Điểm đến</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statDesc}>Lịch vé</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statDesc}>Khu vực</Text>
            </View>
          </View>
        </View>

        {/* List Section */}
        <View style={styles.listSection}>
          <Text style={styles.listSubTitle}>Điểm đến gợi ý</Text>
          <Text style={styles.listTitle}>Câu chuyện khu sinh thái đáng xem</Text>
          
          <View style={styles.cardGrid}>
            {PLACES.map((place, idx) => (
              <Pressable 
                key={idx} 
                style={styles.card}
                onPress={() => router.push({
                  pathname: '/chi-tiet-khu-sinh-thai',
                  params: {
                    name: place.name,
                    location: place.location,
                    desc: place.desc,
                    image: place.image,
                    tag: 'Sinh thái & Trải nghiệm',
                    ticket: 'Từ 200.000đ / người',
                  }
                })}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: place.image }} style={styles.cardImage} />
                  <View style={styles.cardOverlay}>
                    <View style={styles.cardBadge}>
                      <Text style={styles.cardBadgeText}>Câu chuyện điểm đến</Text>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>{place.name}</Text>
                    <Text style={styles.cardLocation}>{place.location}</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.cardDesc} numberOfLines={3}>{place.desc}</Text>
                  <View style={styles.tagsRow}>
                    <Text style={styles.tagPrimary}>Thông tin điểm đến</Text>
                    <Text style={styles.tagSecondary}>Chờ lịch vé</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.readMoreText}>Xem giới thiệu</Text>
                    <View style={styles.bookBtn}>
                      <Text style={styles.bookBtnText}>Đặt vé</Text>
                      <SymbolView name="arrow.right" size={12} tintColor="#0f172a" />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        <GlobalFooter />
      </ScrollView>

    </View>
  );
}

const PLACES = [
  {
    name: 'Chèo SUP đón bình minh Vũng Tàu',
    location: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
    desc: 'Buổi chèo riêng theo nhóm nhỏ, có hướng dẫn an toàn và ảnh hành trình.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Nông trại cà phê Đà Lạt nửa ngày',
    location: 'Đà Lạt, Lâm Đồng',
    desc: 'Theo chân người trồng cà phê, thử rang thủ công và dùng bữa giữa vườn thông.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Một ngày về rừng Ma Thiên Lãnh',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Trekking nhẹ, ăn trưa địa phương và khám phá thung lũng xanh dưới chân Núi Bà Đen.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Khu Du Lịch Sinh Thái Chavi Garden',
    location: 'Bến Lức, Tây Ninh',
    desc: 'Chavi Garden là Khu du lịch sinh thái trải nghiệm rộng hơn 40ha, tại Bến Lức - Tây Ninh. Nằm cách Sài Gòn chỉ 40km, di chuyển thuận tiện trong ngày. Các dịch vụ tại Chavi như: tắm suối, tắm khoáng, tắm bùn khoáng.',
    image: 'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'KHU DU LỊCH SINH THÁI VÀM CỎ FARMSTAY',
    location: 'Bến Lức, Tây Ninh',
    desc: 'Khu Du Lịch Sinh Thái Vàm Cỏ và nhà hàng Vàm Cỏ được lấy cảm hứng và bắt nguồn từ con sông Vàm Cỏ Đông thơ mộng uốn lượn chảy quanh địa bàn các huyện Đức Hòa, Đức Huệ, Bến Lức, Cần Đước của tỉnh Long An.',
    image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80',
  }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8f2' },
  scrollContent: { paddingBottom: 80 },

  heroSection: { height: 420, position: 'relative' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(18,59,52,0.85)', padding: 20, paddingTop: 40, justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, marginBottom: 16 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 12, lineHeight: 34 },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 20, lineHeight: 20 },
  
  searchForm: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 8, alignItems: 'center', marginBottom: 16 },
  searchInputGroup: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingHorizontal: 12 },
  searchInput: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginLeft: 8, flex: 1 },
  searchButton: { backgroundColor: '#102923', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  searchButtonText: { color: '#fff', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },

  quickTags: { flexDirection: 'row' },
  quickTagItem: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  quickTagText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  statsContainer: { backgroundColor: '#fff', margin: 16, marginTop: -40, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  statsHeader: { marginBottom: 12 },
  statsLabel: { fontSize: 10, fontWeight: 'bold', color: '#f59e0b', textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1, backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  statValue: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  statDesc: { fontSize: 9, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginTop: 4 },

  listSection: { padding: 16, paddingTop: 8 },
  listSubTitle: { fontSize: 11, fontWeight: 'bold', color: '#c85a32', textTransform: 'uppercase' },
  listTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 16, marginTop: 4 },
  
  cardGrid: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  cardImageContainer: { height: 220, width: '100%', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', padding: 16, justifyContent: 'space-between' },
  cardBadge: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  cardBadgeText: { color: '#168b58', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  cardLocation: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  
  cardContent: { padding: 16 },
  cardDesc: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tagPrimary: { backgroundColor: '#eef5f0', color: '#1e293b', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagSecondary: { backgroundColor: '#f7f3ea', color: '#1e293b', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  readMoreText: { fontSize: 11, fontWeight: 'bold', color: '#168b58' },
  bookBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookBtnText: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' },
});
