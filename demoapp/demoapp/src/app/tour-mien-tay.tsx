import GlobalFooter from '../components/global-footer';
import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function TourMienTayScreen() {
  const router = useRouter();

  const handleBook = () => {
    Alert.alert(
      'Đặt tour thành công',
      'Yêu cầu đặt "Tour miền Tây 2N1Đ: Chợ nổi Cái Răng & miệt vườn Cần Thơ" đã được tiếp nhận. Đội ngũ igovi sẽ liên hệ với bạn trong ít phút.',
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
        <Text style={styles.subBarTitle} numberOfLines={1}>Tour Miền Tây</Text>
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
              <Text style={styles.locationText}>Cần Thơ - Tiền Giang</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
              <Text style={[styles.badgeText, { color: '#16a34a' }]}>Sông nước miệt vườn</Text>
            </View>
          </View>

          <Text style={styles.title}>Hành trình miền Tây 2N1Đ: Chợ nổi Cái Răng & Miệt vườn</Text>
          <Text style={styles.price}>Từ 1.850.000 đ <Text style={styles.priceSub}>/ khách</Text></Text>
          <Text style={styles.desc}>
            Trải nghiệm văn hóa sông nước đậm chất miền Tây Nam Bộ, đi xuồng ba lá len lỏi trong rạch dừa nước, thưởng thức trái cây chín mọng tại vườn và lắng nghe giai điệu đờn ca tài tử Nam Bộ.
          </Text>

          {/* Quick Info Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickItem}>
              <SymbolView name="bus.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Di chuyển</Text>
              <Text style={styles.quickItemValue}>Xe du lịch cao cấp</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="bed.double.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Khách sạn</Text>
              <Text style={styles.quickItemValue}>4 sao Cần Thơ</Text>
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
            <Text style={styles.checkItem}>✓ Đi tàu du lịch khám phá Chợ nổi Cái Răng buổi sớm mai</Text>
            <Text style={styles.checkItem}>✓ Thưởng thức hủ tiếu pizza và bún nước lèo đậm đà trên thuyền</Text>
            <Text style={styles.checkItem}>✓ Tham quan vườn trái cây Cái Bè: sầu riêng, chôm chôm, măng cụt</Text>
            <Text style={styles.checkItem}>✓ Trải nghiệm chèo xuồng ba lá xuyên qua rặng dừa nước Bến Tre</Text>
            <Text style={styles.checkItem}>✓ Giao lưu đờn ca tài tử và thưởng thức trà mật ong hoa nhãn</Text>
          </View>

          {/* Detailed Itinerary */}
          <View style={styles.section}>
            <Text style={styles.sectionHeaderTitle}>Lịch trình chi tiết</Text>
            
            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 1: TP.HCM → MỸ THO → BẾN TRE → CẦN THƠ</Text>
              <Text style={styles.dayDesc}>
                ⬢ 06:30: Khởi hành từ TP.HCM xuôi về miền Tây.{'\n'}
                ⬢ 08:30: Đến Mỹ Tho, đi thuyền trên sông Tiền ngắm cù lao Long, Lân, Quy, Phụng.{'\n'}
                ⬢ 10:30: Đi xuồng chèo trong rạch nhỏ rợp bóng dừa nước tại Bến Tre.{'\n'}
                ⬢ 12:30: Dùng cơm trưa với món cá tai tượng chiên xù cuốn bánh tráng.{'\n'}
                ⬢ 14:30: Di chuyển về Cần Thơ, nhận phòng khách sạn 4 sao.{'\n'}
                ⬢ 18:30: Thưởng thức bữa tối trên Du thuyền Cần Thơ ngắm bến Ninh Kiều lung linh.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 2: CHỢ NỔI CÁI RĂNG → LÒ HỦ TIẾU → VƯỜN TRÁI CÂY → TP.HCM</Text>
              <Text style={styles.dayDesc}>
                ⬢ 05:30: Xuống thuyền tham quan Chợ nổi Cái Răng nhộn nhịp cảnh mua bán trên sông.{'\n'}
                ⬢ 07:30: Ăn sáng tô bún riêu cua đồng hoặc hủ tiếu nóng hổi ngay trên thuyền.{'\n'}
                ⬢ 08:30: Tham quan lò sản xuất hủ tiếu truyền thống, thưởng thức pizza hủ tiếu giòn tan.{'\n'}
                ⬢ 10:00: Ghé vườn sinh thái hái trái cây theo mùa.{'\n'}
                ⬢ 12:00: Trả phòng khách sạn, dùng cơm trưa.{'\n'}
                ⬢ 13:30: Khởi hành về TP.HCM, kết thúc chuyến đi đậm đà tình người miền Tây.
              </Text>
            </View>
          </View>
        </View>
        <GlobalFooter />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Giá mỗi khách</Text>
          <Text style={styles.bottomPrice}>1.850.000 đ</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleBook}>
          <Text style={styles.bookNowText}>Đặt tour miền Tây</Text>
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
