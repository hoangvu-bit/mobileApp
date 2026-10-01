import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function TourDaLatScreen() {
  const router = useRouter();

  const handleBook = () => {
    Alert.alert(
      'Đặt tour thành công',
      'Yêu cầu đặt "Tour Đà Lạt 3N2Đ: Săn mây, rừng thông và cà phê cao nguyên" đã được tiếp nhận. Đội ngũ igovi sẽ liên hệ với bạn trong ít phút.',
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
        <Text style={styles.subBarTitle} numberOfLines={1}>Tour Đà Lạt</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=84' }} 
          style={styles.heroImage} 
        />
        
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3 ngày 2 đêm</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#00897b" />
              <Text style={styles.locationText}>Đà Lạt, Lâm Đồng</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#fff1ee' }]}>
              <Text style={[styles.badgeText, { color: '#ea580c' }]}>Bán chạy nhất</Text>
            </View>
          </View>

          <Text style={styles.title}>Tour Đà Lạt 3N2Đ: Săn mây, rừng thông & cà phê cao nguyên</Text>
          <Text style={styles.price}>Từ 2.790.000 đ <Text style={styles.priceSub}>/ khách</Text></Text>
          <Text style={styles.desc}>
            Hành trình thư giãn cho nhóm bạn hoặc gia đình yêu thích khí hậu se lạnh, cảnh quan đồi thông, trải nghiệm săn mây Cầu Đất lúc bình minh và thưởng thức đặc sản cao nguyên.
          </Text>

          {/* Quick Info Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickItem}>
              <SymbolView name="bus.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Di chuyển</Text>
              <Text style={styles.quickItemValue}>Xe Limousine VIP</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="bed.double.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Khách sạn</Text>
              <Text style={styles.quickItemValue}>3 sao trung tâm</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="calendar" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Khởi hành</Text>
              <Text style={styles.quickItemValue}>Thứ 6 hàng tuần</Text>
            </View>
          </View>

          {/* Highlights */}
          <View style={styles.highlightBox}>
            <Text style={styles.sectionHeaderTitle}>Điểm nổi bật của tour</Text>
            <Text style={styles.checkItem}>✓ Đón bình minh và săn mây tại đồi chè Cầu Đất</Text>
            <Text style={styles.checkItem}>✓ Check-in đồi thông lá kim & quán cà phê thung lũng đèn</Text>
            <Text style={styles.checkItem}>✓ Thưởng thức lẩu gà lá é, lẩu bò Ba Toa trứ danh</Text>
            <Text style={styles.checkItem}>✓ Tham quan vườn dâu tây công nghệ cao, tự hái dâu</Text>
            <Text style={styles.checkItem}>✓ Hướng dẫn viên địa phương nhiệt tình suốt tuyến</Text>
          </View>

          {/* Detailed Itinerary */}
          <View style={styles.section}>
            <Text style={styles.sectionHeaderTitle}>Lịch trình chi tiết</Text>
            
            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 1: TP.HCM → ĐÀ LẠT → CHECK-IN THUNG LŨNG ĐÈN</Text>
              <Text style={styles.dayDesc}>
                ⬢ 05:30: Xe Limousine đón khách tại điểm hẹn ở TP.HCM, khởi hành lên Đà Lạt.{"\n"}
                ⬢ 12:00: Đến Đà Lạt, thưởng thức bữa trưa với món nem nướng Bà Hùng.{"\n"}
                ⬢ 14:00: Nhận phòng khách sạn nghỉ ngơi.{"\n"}
                ⬢ 16:30: Tham quan Quảng trường Lâm Viên, dạo quanh Hồ Xuân Hương.{"\n"}
                ⬢ 18:30: Ăn tối với lẩu gà lá é Tao Ngộ, tự do khám phá chợ đêm Đà Lạt.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 2: SĂN MÂY CẦU ĐẤT → VƯỜN DÂU → GA ĐÀ LẠT</Text>
              <Text style={styles.dayDesc}>
                ⬢ 04:30: Khởi hành đi đồi chè Cầu Đất săn mây và ngắm bình minh tuyệt đẹp.{"\n"}
                ⬢ 07:30: Ăn sáng bánh mì xíu mại nóng hổi.{"\n"}
                ⬢ 09:00: Check-in Ga Đà Lạt cổ kính với kiến trúc đường xe lửa răng cưa.{"\n"}
                ⬢ 11:30: Dùng bữa trưa lẩu bò quán gỗ Ba Toa.{"\n"}
                ⬢ 14:00: Trải nghiệm hái dâu tây chín mọng tại vườn công nghệ cao.{"\n"}
                ⬢ 18:00: Thưởng thức cà phê ngắm hoàng hôn và view thung lũng đèn lung linh.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 3: CHỢ ĐÀ LẠT → MUA ĐẶC SẢN → TP.HCM</Text>
              <Text style={styles.dayDesc}>
                ⬢ 07:00: Điểm tâm sáng tại khách sạn, tự do mua mứt dâu, trà atiso làm quà.{"\n"}
                ⬢ 10:30: Làm thủ tục trả phòng khách sạn.{"\n"}
                ⬢ 11:30: Dùng cơm trưa niêu đất Đà Lạt thanh đạm.{"\n"}
                ⬢ 13:00: Khởi hành về lại TP.HCM, đến nơi vào khoảng 19:30 tối.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Giá mỗi khách</Text>
          <Text style={styles.bottomPrice}>2.790.000 đ</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleBook}>
          <Text style={styles.bookNowText}>Đặt tour Đà Lạt</Text>
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
