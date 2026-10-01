import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function TourHaLongScreen() {
  const router = useRouter();

  const handleBook = () => {
    Alert.alert(
      'Đặt tour thành công',
      'Yêu cầu đặt "Tour Khám phá Vịnh Hạ Long trên du thuyền sang trọng 2N1Đ" đã được tiếp nhận. Đội ngũ igovi sẽ liên hệ với bạn trong ít phút.',
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
        <Text style={styles.subBarTitle} numberOfLines={1}>Tour Vịnh Hạ Long</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80' }} 
          style={styles.heroImage} 
        />
        
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2 ngày 1 đêm</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#00897b" />
              <Text style={styles.locationText}>Hạ Long, Quảng Ninh</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#fef3c7' }]}>
              <Text style={[styles.badgeText, { color: '#d97706' }]}>Du thuyền 5 sao</Text>
            </View>
          </View>

          <Text style={styles.title}>Khám phá Vịnh Hạ Long trên du thuyền sang trọng 2N1Đ</Text>
          <Text style={styles.price}>Từ 3.250.000 đ <Text style={styles.priceSub}>/ khách</Text></Text>
          <Text style={styles.desc}>
            Trải nghiệm nghỉ dưỡng đẳng cấp giữa kỳ quan thiên nhiên thế giới UNESCO. Chèo kayak tại Hang Luồn, tắm biển đảo Ti Tốp, ngắm hoàng hôn vịnh biển và thưởng thức tiệc BBQ hải sản thượng hạng.
          </Text>

          {/* Quick Info Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickItem}>
              <SymbolView name="ferry.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Nghỉ dưỡng</Text>
              <Text style={styles.quickItemValue}>Du thuyền 5 sao</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="fork.knife" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Ẩm thực</Text>
              <Text style={styles.quickItemValue}>Buffet & Hải sản</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="calendar" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Khởi hành</Text>
              <Text style={styles.quickItemValue}>Hàng ngày</Text>
            </View>
          </View>

          {/* Highlights */}
          <View style={styles.highlightBox}>
            <Text style={styles.sectionHeaderTitle}>Điểm nổi bật của tour</Text>
            <Text style={styles.checkItem}>✓ Phòng nghỉ ban công riêng view trọn vịnh Hạ Long kỳ vĩ</Text>
            <Text style={styles.checkItem}>✓ Chèo thuyền Kayak hoặc đi thuyền nan tham quan Hang Luồn</Text>
            <Text style={styles.checkItem}>✓ Tắm biển và leo đỉnh núi ngắm 360 độ vịnh đảo Ti Tốp</Text>
            <Text style={styles.checkItem}>✓ Tiệc trà chiều ngắm hoàng hôn Sunset Party trên sundeck</Text>
            <Text style={styles.checkItem}>✓ Trải nghiệm câu mực đêm & lớp học nấu ăn truyền thống</Text>
          </View>

          {/* Detailed Itinerary */}
          <View style={styles.section}>
            <Text style={styles.sectionHeaderTitle}>Lịch trình chi tiết</Text>
            
            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 1: HÀ NỘI → TUẦN CHÂU → VỊNH HẠ LONG → HANG SỬNG SỐT</Text>
              <Text style={styles.dayDesc}>
                ⬢ 08:30: Xe Limousine đón khách tại phố cổ Hà Nội, chạy cao tốc đi Hạ Long.{"\n"}
                ⬢ 11:30: Đến Cảng tàu quốc tế Tuần Châu, check-in lên du thuyền 5 sao.{"\n"}
                ⬢ 12:30: Dùng buffet trưa thịnh soạn trong khi du thuyền di chuyển qua hòn Đỉnh Hương, hòn Gà Chọi.{"\n"}
                ⬢ 14:30: Khám phá Hang Sửng Sốt – hang động thạch nhũ đẹp nhất vịnh.{"\n"}
                ⬢ 16:00: Chèo kayak tại Hang Luồn hoặc tắm biển đảo Ti Tốp.{"\n"}
                ⬢ 17:30: Sunset Party trên boong tàu ngắm hoàng hôn lãng mạn.{"\n"}
                ⬢ 19:00: Bữa tối ẩm thực fine dining sang trọng. Tối tự do câu mực đêm hoặc thư giãn tại spa.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 2: TẬP TAI CHI → ĐẢO TI TỐP → TUẦN CHÂU → HÀ NỘI</Text>
              <Text style={styles.dayDesc}>
                ⬢ 06:15: Tập Thái Cực Quyền (Tai Chi) đón bình minh trên sundeck.{"\n"}
                ⬢ 07:00: Dùng điểm tâm sáng nhẹ nhàng với trà và cà phê.{"\n"}
                ⬢ 08:00: Leo đỉnh Ti Tốp ngắm toàn cảnh kỳ quan vịnh Hạ Long từ trên cao.{"\n"}
                ⬢ 09:30: Trở lại du thuyền làm thủ tục trả phòng, tham gia lớp học cuốn chả nem rán.{"\n"}
                ⬢ 10:30: Bữa trưa buffet sớm trong lúc tàu cập bến Tuần Châu.{"\n"}
                ⬢ 12:00: Xe Limousine đón quý khách trở về Hà Nội, kết thúc chuyến đi tuyệt vời.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Giá mỗi khách</Text>
          <Text style={styles.bottomPrice}>3.250.000 đ</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleBook}>
          <Text style={styles.bookNowText}>Đặt tour du thuyền</Text>
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
