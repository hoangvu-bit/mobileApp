import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function TourPhuQuocScreen() {
  const router = useRouter();

  const handleBook = () => {
    Alert.alert(
      'Đặt tour thành công',
      'Yêu cầu đặt "Tour Phú Quốc Nam đảo 3N2Đ: Cáp treo, biển xanh và hoàng hôn" đã được tiếp nhận. Đội ngũ igovi sẽ liên hệ với bạn trong ít phút.',
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
        <Text style={styles.subBarTitle} numberOfLines={1}>Tour Phú Quốc</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80' }} 
          style={styles.heroImage} 
        />
        
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3 ngày 2 đêm</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#00897b" />
              <Text style={styles.locationText}>Phú Quốc, Kiên Giang</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#fef3c7' }]}>
              <Text style={[styles.badgeText, { color: '#d97706' }]}>Resort 4 sao</Text>
            </View>
          </View>

          <Text style={styles.title}>Tour Phú Quốc Nam đảo 3N2Đ: Cáp treo, biển xanh & hoàng hôn</Text>
          <Text style={styles.price}>Từ 3.690.000 đ <Text style={styles.priceSub}>/ khách</Text></Text>
          <Text style={styles.desc}>
            Khám phá hòn đảo ngọc thiên đường với trải nghiệm cáp treo vượt biển Hòn Thơm dài nhất thế giới, lặn ngắm san hô tại 4 đảo Nam Phú Quốc và ngắm hoàng hôn rực rỡ tại Sunset Sanato.
          </Text>

          {/* Quick Info Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickItem}>
              <SymbolView name="airplane" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Máy bay</Text>
              <Text style={styles.quickItemValue}>Vé khứ hồi</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="bed.double.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Resort</Text>
              <Text style={styles.quickItemValue}>4 sao có hồ bơi</Text>
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
            <Text style={styles.checkItem}>✓ Vé cáp treo Hòn Thơm 2 chiều & công viên nước Aquatopia</Text>
            <Text style={styles.checkItem}>✓ Cano cao tốc tham quan 4 đảo: Hòn Móng Tay, Gầm Ghì, Mây Rút</Text>
            <Text style={styles.checkItem}>✓ Miễn phí chụp ảnh máy cơ và quay video flycam chuyên nghiệp</Text>
            <Text style={styles.checkItem}>✓ Tặng vé check-in Cầu Hôn Kiss Bridge & Thị trấn Hoàng Hôn</Text>
            <Text style={styles.checkItem}>✓ Thưởng thức đặc sản gỏi cá trích, bún quậy Kiến Xây</Text>
          </View>

          {/* Detailed Itinerary */}
          <View style={styles.section}>
            <Text style={styles.sectionHeaderTitle}>Lịch trình chi tiết</Text>
            
            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 1: ĐÓN SÂN BAY → SUNSET SANATO → CHỢ ĐÊM PHÚ QUỐC</Text>
              <Text style={styles.dayDesc}>
                ⬢ Sáng: Xe đón khách tại Sân bay Phú Quốc về resort nhận phòng.{'\n'}
                ⬢ 12:00: Ăn trưa với món bún quậy trứ danh.{'\n'}
                ⬢ 16:00: Check-in Sunset Sanato ngắm hoàng hôn đẹp nhất đảo ngọc.{'\n'}
                ⬢ 18:30: Tự do khám phá Chợ đêm Phú Quốc, ăn hải sản và kem cuộn.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 2: CANO 4 ĐẢO → CÁP TREO HÒN THƠM → CẦU HÔN</Text>
              <Text style={styles.dayDesc}>
                ⬢ 08:00: Lên cano siêu tốc đi Hòn Móng Tay, Gầm Ghì lặn ngắm san hô.{'\n'}
                ⬢ 12:00: Ăn trưa hải sản trên Hòn Mây Rút, chụp ảnh SUP và flycam.{'\n'}
                ⬢ 14:30: Đi cáp treo vượt biển ngắm toàn cảnh Nam Phú Quốc.{'\n'}
                ⬢ 17:30: Ngắm hoàng hôn tại Thị trấn Hoàng Hôn Sunset Town & Cầu Hôn.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 3: LÀNG CHÀI HÀM NINH → MUA ĐẶC SẢN → TIỄN BAY</Text>
              <Text style={styles.dayDesc}>
                ⬢ 07:30: Ăn sáng buffet resort, tự do tắm biển hoặc bơi hồ vô cực.{'\n'}
                ⬢ 09:30: Tham quan cơ sở ngọc trai, vườn tiêu và nhà thùng nước mắm.{'\n'}
                ⬢ 12:00: Thưởng thức ghẹ Hàm Ninh chắc thịt, trả phòng.{'\n'}
                ⬢ 14:00: Xe tiễn đoàn ra sân bay Phú Quốc, kết thúc hành trình.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Giá mỗi khách</Text>
          <Text style={styles.bottomPrice}>3.690.000 đ</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleBook}>
          <Text style={styles.bookNowText}>Đặt tour Phú Quốc</Text>
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
