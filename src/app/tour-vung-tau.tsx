import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function TourVungTauScreen() {
  const router = useRouter();

  const handleBook = () => {
    Alert.alert(
      'Đặt tour thành công',
      'Yêu cầu đặt "Tour Vũng Tàu 2N1Đ: Biển sáng sớm và hải sản địa phương" đã được tiếp nhận. Đội ngũ igovi sẽ liên hệ với bạn trong ít phút.',
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
        <Text style={styles.subBarTitle} numberOfLines={1}>Tour Vũng Tàu</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' }} 
          style={styles.heroImage} 
        />
        
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2 ngày 1 đêm</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#00897b" />
              <Text style={styles.locationText}>Vũng Tàu, BR-VT</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#e0f2fe' }]}>
              <Text style={[styles.badgeText, { color: '#0284c7' }]}>Ưu đãi cuối tuần</Text>
            </View>
          </View>

          <Text style={styles.title}>Tour Vũng Tàu 2N1Đ: Biển sáng sớm & hải sản địa phương</Text>
          <Text style={styles.price}>Từ 1.490.000 đ <Text style={styles.priceSub}>/ khách</Text></Text>
          <Text style={styles.desc}>
            Tour ngắn ngày hoàn hảo cho gia đình hoặc nhóm bạn đổi gió cuối tuần gần Sài Gòn. Tắm biển Bãi Sau, ngắm hoàng hôn ngọn Hải Đăng và thưởng thức hải sản tươi rói tại chợ đêm.
          </Text>

          {/* Quick Info Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickItem}>
              <SymbolView name="bus.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Di chuyển</Text>
              <Text style={styles.quickItemValue}>Xe du lịch đời mới</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="bed.double.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Khách sạn</Text>
              <Text style={styles.quickItemValue}>3 sao sát biển</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="calendar" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Khởi hành</Text>
              <Text style={styles.quickItemValue}>Thứ 7 hàng tuần</Text>
            </View>
          </View>

          {/* Highlights */}
          <View style={styles.highlightBox}>
            <Text style={styles.sectionHeaderTitle}>Điểm nổi bật của tour</Text>
            <Text style={styles.checkItem}>✓ Check-in Ngọn Hải Đăng Vũng Tàu ngắm toàn cảnh vịnh biển</Text>
            <Text style={styles.checkItem}>✓ Viếng Tượng Chúa Kito Vua trên đỉnh Tao Phùng</Text>
            <Text style={styles.checkItem}>✓ Đại tiệc hải sản tươi sống: tôm sú, cua gạch, lẩu cá bớp</Text>
            <Text style={styles.checkItem}>✓ Tự do tắm biển và tham gia các trò chơi thể thao nước</Text>
            <Text style={styles.checkItem}>✓ Thưởng thức bánh khọt Gốc Vú Sữa nổi tiếng</Text>
          </View>

          {/* Detailed Itinerary */}
          <View style={styles.section}>
            <Text style={styles.sectionHeaderTitle}>Lịch trình chi tiết</Text>
            
            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 1: TP.HCM → ĐỒI CỪU SUỐI NGHỆ → VŨNG TÀU → TIỆC HẢI SẢN</Text>
              <Text style={styles.dayDesc}>
                ⬢ 06:00: Đón khách tại TP.HCM, khởi hành đi Vũng Tàu.{'\n'}
                ⬢ 08:30: Dừng chân chụp ảnh tại Đồi cừu Suối Nghệ.{'\n'}
                ⬢ 11:30: Đến Vũng Tàu, dùng bữa trưa bánh khọt đặc sản.{'\n'}
                ⬢ 13:30: Nhận phòng khách sạn 3 sao sát biển nghỉ ngơi.{'\n'}
                ⬢ 15:30: Tự do tắm biển tại Bãi Sau.{'\n'}
                ⬢ 18:30: Thưởng thức bữa tối hải sản phong phú và dạo biển đêm.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 2: TƯỢNG CHÚA KITO → NGỌN HẢI ĐĂNG → TP.HCM</Text>
              <Text style={styles.dayDesc}>
                ⬢ 06:30: Tắm biển sớm đón bình minh, dùng điểm tâm buffet sáng.{'\n'}
                ⬢ 08:00: Chinh phục gần 1000 bậc thang lên Tượng Chúa Kito.{'\n'}
                ⬢ 10:00: Tham quan Ngọn Hải Đăng cổ kính ngắm vịnh biển.{'\n'}
                ⬢ 12:00: Trả phòng khách sạn, dùng bữa trưa cơm niêu.{'\n'}
                ⬢ 14:00: Khởi hành về TP.HCM, ghé mua bò sữa Long Thành.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Giá mỗi khách</Text>
          <Text style={styles.bottomPrice}>1.490.000 đ</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleBook}>
          <Text style={styles.bookNowText}>Đặt tour Vũng Tàu</Text>
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
