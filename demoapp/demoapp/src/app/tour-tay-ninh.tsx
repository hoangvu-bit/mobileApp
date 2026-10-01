import GlobalFooter from '../components/global-footer';
import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function TourTayNinhScreen() {
  const router = useRouter();

  const handleBook = () => {
    Alert.alert(
      'Đặt tour thành công',
      'Yêu cầu đặt "Tour Tây Ninh 1 ngày: Chinh phục đỉnh Vân Sơn Núi Bà Đen" đã được tiếp nhận. Đội ngũ igovi sẽ liên hệ với bạn trong ít phút.',
      [{ text: 'Tuyệt vời', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Sub navigation bar */}
      <View style={styles.subBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#00897b" />
          <Text style={styles.backText}>Quay lại tour</Text>
        </Pressable>
        <Text style={styles.subBarTitle} numberOfLines={1}>Tour Núi Bà Đen Tây Ninh</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80' }} 
          style={styles.heroImage} 
        />
        
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1 ngày</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#00897b" />
              <Text style={styles.locationText}>Núi Bà Đen, Tây Ninh</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#e6f7f2' }]}>
              <Text style={[styles.badgeText, { color: '#009b77' }]}>Khởi hành hàng ngày</Text>
            </View>
          </View>

          <Text style={styles.title}>Tây Ninh 1 ngày: Chinh phục đỉnh Vân Sơn Núi Bà Đen</Text>
          <Text style={styles.price}>Từ 950.000 đ <Text style={styles.priceSub}>/ khách</Text></Text>
          <Text style={styles.desc}>
            Hành trình tâm linh và khám phá nóc nhà Nam Bộ. Đi cáp treo hiện đại Sun World BaDen Mountain, chiêm bái tượng Phật Bà Tây Bổ Đà Sơn bằng đồng cao nhất Châu Á và thưởng thức buffet ẩm thực đỉnh núi.
          </Text>

          {/* Quick Info Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickItem}>
              <SymbolView name="bus.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Phương tiện</Text>
              <Text style={styles.quickItemValue}>Xe Limousine 9 chỗ</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="ticket.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Vé cáp treo</Text>
              <Text style={styles.quickItemValue}>Bao gồm khứ hồi</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="calendar" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Thời gian</Text>
              <Text style={styles.quickItemValue}>Đi về trong ngày</Text>
            </View>
          </View>

          {/* Highlights */}
          <View style={styles.highlightBox}>
            <Text style={styles.sectionHeaderTitle}>Điểm nổi bật của tour</Text>
            <Text style={styles.checkItem}>✓ Vé cáp treo khứ hồi tuyến Đỉnh Vân Sơn & tuyến Chùa Hang</Text>
            <Text style={styles.checkItem}>✓ Chiêm bái Tượng Phật Bà Tây Bổ Đà Sơn & Cột mốc 986m</Text>
            <Text style={styles.checkItem}>✓ Thưởng thức đại tiệc buffet hơn 80 món tại Nhà hàng Vân Sơn</Text>
            <Text style={styles.checkItem}>✓ Tham quan Tòa Thánh Tây Ninh – kiến trúc tôn giáo độc nhất vô nhị</Text>
            <Text style={styles.checkItem}>✓ Thưởng thức bò tơ Tây Ninh chính hiệu và mua muối tôm làm quà</Text>
          </View>

          {/* Detailed Itinerary */}
          <View style={styles.section}>
            <Text style={styles.sectionHeaderTitle}>Lịch trình chi tiết trong ngày</Text>
            
            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>BUỔI SÁNG: TP.HCM → NÚI BÀ ĐEN → ĐỈNH VÂN SƠN</Text>
              <Text style={styles.dayDesc}>
                ⬢ 06:00: Xe Limousine đón khách tại trung tâm TP.HCM khởi hành đi Tây Ninh.{'\n'}
                ⬢ 07:30: Dừng chân thưởng thức đặc sản Bánh canh Trảng Bàng nức tiếng.{'\n'}
                ⬢ 09:00: Đến KDL Quốc gia Núi Bà Đen. Trải nghiệm hệ thống cáp treo hiện đại lên Đỉnh Vân Sơn.{'\n'}
                ⬢ 10:00: Chiêm bái Tượng Phật Bà Tây Bổ Đà Sơn, ngắm vườn hoa rực rỡ và săn mây trên độ cao 986m.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>BUỔI TRƯA: BUFFET ĐỈNH NÚI → CHÙA HANG</Text>
              <Text style={styles.dayDesc}>
                ⬢ 11:30: Dùng tiệc buffet trưa phong phú tại Nhà hàng Vân Sơn trên đỉnh núi.{'\n'}
                ⬢ 13:00: Đi cáp treo tuyến Chùa Hang xuống chiêm bái Linh Sơn Tiên Thạch Tự (Chùa Bà) cầu an lành.{'\n'}
                ⬢ 14:30: Xuống chân núi, lên xe di chuyển về trung tâm thành phố.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>BUỔI CHIỀU: TÒA THÁNH TÂY NINH → BÒ TƠ NĂM SÁNH → TP.HCM</Text>
              <Text style={styles.dayDesc}>
                ⬢ 15:00: Tham quan công trình tôn giáo kỳ vĩ Tòa Thánh Tây Ninh.{'\n'}
                ⬢ 16:30: Thưởng thức bữa xế với bò tơ Năm Sánh nướng y chấm mắm nêm.{'\n'}
                ⬢ 17:30: Ghé cửa hàng đặc sản mua muối tôm, bánh tráng me làm quà.{'\n'}
                ⬢ 19:30: Về đến TP.HCM, kết thúc chuyến đi trọn vẹn và an yên.
              </Text>
            </View>
          </View>
        </View>
        <GlobalFooter />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Trọn gói mỗi khách</Text>
          <Text style={styles.bottomPrice}>950.000 đ</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleBook}>
          <Text style={styles.bookNowText}>Đặt tour Tây Ninh</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0fdfa',
    borderBottomWidth: 1,
    borderBottomColor: '#ccfbf1',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, fontWeight: '700', color: '#00897b' },
  subBarTitle: { fontSize: 13, color: '#0f766e', fontWeight: '500' },

  scrollContent: { paddingBottom: 100 },
  heroImage: { width: '100%', height: 250 },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  badge: { backgroundColor: '#e6f7f2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#00897b', fontSize: 11, fontWeight: 'bold' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  locationText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', lineHeight: 28, color: '#0f172a', marginBottom: 10 },
  price: { fontSize: 22, fontWeight: '900', color: '#ea580c', marginBottom: 2 },
  priceSub: { fontSize: 13, fontWeight: 'normal', color: '#64748b' },
  desc: { fontSize: 13, color: '#475569', lineHeight: 20, marginVertical: 14 },

  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  quickItem: { flex: 1, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  quickItemLabel: { fontSize: 10, color: '#64748b', marginTop: 4, marginBottom: 2 },
  quickItemValue: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },

  highlightBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionHeaderTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  checkItem: { fontSize: 13, color: '#334155', lineHeight: 22, marginBottom: 4 },

  section: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  dayBox: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  dayTitle: { fontSize: 12, fontWeight: 'bold', color: '#00897b', marginBottom: 8 },
  dayDesc: { fontSize: 12, color: '#475569', lineHeight: 20 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
  },
  bottomPriceLabel: { fontSize: 10, color: '#64748b', fontWeight: '600' },
  bottomPrice: { fontSize: 18, fontWeight: '900', color: '#ea580c' },
  bookNowBtn: { backgroundColor: '#00897b', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  bookNowText: { color: '#fff', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
});
