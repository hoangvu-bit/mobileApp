import GlobalFooter from '../components/global-footer';
import React, { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function DiemDiTichScreen() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState('Tất cả');

  const filteredPlaces = selectedRegion === 'Tất cả' 
    ? RELIC_PLACES 
    : RELIC_PLACES.filter(p => p.region === selectedRegion);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=84' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <SymbolView name="building.columns.fill" size={14} tintColor="#ffd89a" />
              <Text style={styles.badgeText}>Di sản & Văn hóa</Text>
            </View>
            <Text style={styles.heroTitle}>Khám phá dấu ấn lịch sử hào hùng</Text>
            <Text style={styles.heroSubtitle}>
              Hành trình trở về nguồn cội với những công trình kiến trúc cổ kính, di tích kháng chiến và danh thắng tâm linh ngàn năm.
            </Text>

            {/* Search Input */}
            <View style={styles.searchForm}>
              <SymbolView name="magnifyingglass" size={18} tintColor="#7c3aed" />
              <TextInput 
                placeholder="Tìm tên di tích, địa danh..." 
                style={styles.searchInput}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>

        {/* Region Filter Tabs */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {['Tất cả', 'Miền Nam', 'Tây Ninh', 'Miền Bắc', 'Miền Trung'].map((region, idx) => {
              const active = selectedRegion === region;
              return (
                <Pressable 
                  key={idx} 
                  style={[styles.filterTab, active && styles.filterTabActive]}
                  onPress={() => setSelectedRegion(region)}
                >
                  <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
                    {region}
                  </Text>
                </Pressable>
              );
            })}
      </ScrollView>
        </View>

        {/* Relic List */}
        <View style={styles.listSection}>
          <Text style={styles.listSubTitle}>ĐỊA ĐIỂM TIÊU BIỂU</Text>
          <Text style={styles.listTitle}>Di tích nổi tiếng cả nước</Text>

          <View style={styles.cardGrid}>
            {filteredPlaces.map((place, idx) => (
              <Pressable 
                key={idx} 
                style={styles.card}
                onPress={() => router.push({
                  pathname: '/chi-tiet-diem-di-tich',
                  params: {
                    name: place.name,
                    location: place.location,
                    category: place.category,
                    ticketPrice: place.ticketPrice,
                    hours: place.hours,
                    period: place.period,
                    desc: place.desc,
                    image: place.image,
                  }
                })}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: place.image }} style={styles.cardImage} />
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{place.category}</Text>
                  </View>
                  <View style={styles.ticketBadge}>
                    <Text style={styles.ticketBadgeText}>{place.ticketPrice}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.locationRow}>
                    <SymbolView name="mappin.and.ellipse" size={12} tintColor="#7c3aed" />
                    <Text style={styles.locationText}>{place.location}</Text>
                  </View>

                  <Text style={styles.cardTitle}>{place.name}</Text>
                  <Text style={styles.cardDesc}>{place.desc}</Text>

                  <View style={styles.infoRow}>
                    <View style={styles.infoCol}>
                      <SymbolView name="clock" size={13} tintColor="#64748b" />
                      <Text style={styles.infoText}>{place.hours}</Text>
                    </View>
                    <View style={styles.infoCol}>
                      <SymbolView name="shield.lefthalf.filled" size={13} tintColor="#64748b" />
                      <Text style={styles.infoText}>{place.period}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.detailBtn}>
                      <Text style={styles.detailBtnText}>Xem chi tiết</Text>
                    </View>
                    <Pressable 
                      style={styles.directBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        Alert.alert('Chỉ đường', `Đang mở bản đồ dẫn đường tới ${place.name}...`);
                      }}
                    >
                      <SymbolView name="location.fill" size={14} tintColor="#7c3aed" />
                      <Text style={styles.directBtnText}>Chỉ đường</Text>
                    </Pressable>
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

const RELIC_PLACES = [
  {
    name: 'Tòa Thánh Tây Ninh',
    location: 'Thị xã Hòa Thành, Tây Ninh',
    region: 'Tây Ninh',
    category: 'Di tích Tôn giáo',
    ticketPrice: 'Miễn phí',
    hours: '06:00 - 20:00 hàng ngày',
    period: 'Khởi công năm 1931',
    desc: 'Trung tâm của Đạo Cao Đài với kiến trúc nghệ thuật độc đáo kết hợp giữa văn hóa phương Đông và phương Tây, nổi bật với hai lầu chuông và trống cao vút.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Quần thể Di tích Cố Đô Hoa Lư',
    location: 'Hoa Lư, Ninh Bình',
    region: 'Miền Bắc',
    category: 'Di tích Quốc gia đặc biệt',
    ticketPrice: '20.000 đ / vé',
    hours: '07:00 - 17:00',
    period: 'Thế kỷ X (Nhà Đinh - Tiền Lê)',
    desc: 'Kinh đô đầu tiên của nhà nước phong kiến tập quyền Việt Nam, lưu giữ đền thờ vua Đinh Tiên Hoàng và vua Lê Đại Hành uy nghiêm giữa núi non trùng điệp.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Địa Đạo Củ Chi',
    location: 'Củ Chi, TP. Hồ Chí Minh',
    region: 'Miền Nam',
    category: 'Di tích Lịch sử Quân sự',
    ticketPrice: '35.000 đ / vé',
    hours: '07:30 - 17:00',
    period: 'Kháng chiến chống Mỹ',
    desc: 'Hệ thống đường hầm ngầm kỳ vĩ dài hơn 250km được ví như "thành phố dưới lòng đất", minh chứng cho ý chí quật cường và sự sáng tạo quân sự.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Tháp Cổ Bình Thạnh (Văn hóa Óc Eo)',
    location: 'Trảng Bàng, Tây Ninh',
    region: 'Tây Ninh',
    category: 'Di tích Kiến trúc Cổ',
    ticketPrice: 'Miễn phí',
    hours: 'Mở cửa cả ngày',
    period: 'Thế kỷ VIII - IX',
    desc: 'Một trong những tháp cổ hiếm hoi của nền văn hóa Óc Eo còn nguyên vẹn ở Nam Bộ, xây dựng bằng gạch nung tinh xảo không dùng vữa kết dính.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Di tích Lịch sử Nhà tù Côn Đảo',
    location: 'Côn Đảo, Bà Rịa - Vũng Tàu',
    region: 'Miền Nam',
    category: 'Di tích Quốc gia đặc biệt',
    ticketPrice: '50.000 đ / vé',
    hours: '07:30 - 16:30',
    period: '1862 - 1975',
    desc: 'Hệ thống nhà tù giam giữ các chiến sĩ cách mạng kiên trung, nơi ghi dấu bản anh hùng ca bất diệt của người con gái đất đỏ Võ Thị Sáu.',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
  }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfaff' },
  scrollContent: { paddingBottom: 80 },

  heroSection: { height: 320, position: 'relative' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(59, 19, 94, 0.82)', padding: 20, justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, gap: 6, marginBottom: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8, lineHeight: 30 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 16, lineHeight: 18 },

  searchForm: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '600', color: '#0f172a', marginLeft: 8 },

  filterSection: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3e8ff' },
  filterTab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f5f3ff', marginRight: 8 },
  filterTabActive: { backgroundColor: '#7c3aed' },
  filterTabText: { fontSize: 12, fontWeight: '700', color: '#6d28d9' },
  filterTabTextActive: { color: '#fff' },

  listSection: { padding: 16, paddingTop: 16 },
  listSubTitle: { fontSize: 11, fontWeight: '900', color: '#7c3aed', letterSpacing: 0.5, marginBottom: 4 },
  listTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 16 },

  cardGrid: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f3e8ff', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardImageContainer: { height: 180, width: '100%', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  cardBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(124,58,237,0.9)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  cardBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  ticketBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  ticketBadgeText: { color: '#7c3aed', fontSize: 11, fontWeight: '900' },

  cardContent: { padding: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locationText: { fontSize: 12, color: '#7c3aed', fontWeight: '600' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  cardDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f8fafc', paddingTop: 10, marginBottom: 12 },
  infoCol: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { fontSize: 11, color: '#64748b', fontWeight: '500' },

  cardFooter: { flexDirection: 'row', gap: 10 },
  detailBtn: { flex: 1, backgroundColor: '#7c3aed', paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  detailBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  directBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#7c3aed', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8 },
  directBtnText: { color: '#7c3aed', fontSize: 12, fontWeight: 'bold' },
});
