import GlobalFooter from '../components/global-footer';
import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function TourNinhBinhScreen() {
  const router = useRouter();

  const handleBook = () => {
    Alert.alert(
      'Đặt tour thành công',
      'Yêu cầu đặt "Tour Ninh Bình di sản 2N1Đ: Tràng An, Hang Múa & Cố đô Hoa Lư" đã được tiếp nhận. Đội ngũ igovi sẽ liên hệ với bạn trong ít phút.',
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
        <Text style={styles.subBarTitle} numberOfLines={1}>Tour Ninh Bình</Text>
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
              <Text style={styles.locationText}>Hoa Lư, Ninh Bình</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#f3e8ff' }]}>
              <Text style={[styles.badgeText, { color: '#7c3aed' }]}>Di sản thế giới</Text>
            </View>
          </View>

          <Text style={styles.title}>Tour Ninh Bình 2N1Đ: Tràng An, Hang Múa & Cố đô Hoa Lư</Text>
          <Text style={styles.price}>Từ 2.190.000 đ <Text style={styles.priceSub}>/ khách</Text></Text>
          <Text style={styles.desc}>
            Khám phá vùng đất cố đô ngàn năm văn hiến và di sản hỗn hợp Tràng An. Xuôi thuyền ngắm non nước hữu tình qua các hang động kỳ thú, leo 500 bậc đá đỉnh Hang Múa ngắm toàn cảnh Tam Cốc thơ mộng.
          </Text>

          {/* Quick Info Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickItem}>
              <SymbolView name="bus.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Di chuyển</Text>
              <Text style={styles.quickItemValue}>Xe Limousine</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="bed.double.fill" size={20} tintColor="#00897b" />
              <Text style={styles.quickItemLabel}>Khách sạn</Text>
              <Text style={styles.quickItemValue}>Boutique Resort</Text>
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
            <Text style={styles.checkItem}>✓ Đi thuyền truyền thống khám phá Quần thể danh thắng Tràng An</Text>
            <Text style={styles.checkItem}>✓ Chinh phục đỉnh Ngọa Long - Hang Múa ngắm thung lũng Tam Cốc</Text>
            <Text style={styles.checkItem}>✓ Thăm Cố đô Hoa Lư – Đền vua Đinh, vua Lê tôn nghiêm</Text>
            <Text style={styles.checkItem}>✓ Chiêm bái Chùa Bái Đính – ngôi chùa sở hữu nhiều kỷ lục Châu Á</Text>
            <Text style={styles.checkItem}>✓ Thưởng thức đặc sản cơm cháy, dê núi Ninh Bình 7 món</Text>
          </View>

          {/* Detailed Itinerary */}
          <View style={styles.section}>
            <Text style={styles.sectionHeaderTitle}>Lịch trình chi tiết</Text>
            
            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 1: HÀ NỘI → CỐ ĐÔ HOA LƯ → HANG MÚA → TAM CỐC</Text>
              <Text style={styles.dayDesc}>
                ⬢ 07:30: Xe Limousine đón khách tại Hà Nội, khởi hành đi Ninh Bình.{'\n'}
                ⬢ 09:30: Tham quan Cố đô Hoa Lư, dâng hương Đền vua Đinh Tiên Hoàng.{'\n'}
                ⬢ 11:30: Thưởng thức bữa trưa đặc sản dê núi tại nhà hàng địa phương.{'\n'}
                ⬢ 13:30: Check-in resort nghỉ ngơi.{'\n'}
                ⬢ 15:30: Chinh phục Hang Múa, ngắm hoàng hôn rực rỡ từ đỉnh Ngọa Long.{'\n'}
                ⬢ 18:30: Dùng bữa tối và dạo phố cổ Hoa Lư rực rỡ ánh đèn lồng.
              </Text>
            </View>

            <View style={styles.dayBox}>
              <Text style={styles.dayTitle}>NGÀY 2: DANH THẮNG TRÀNG AN → CHÙA BÁI ĐÍNH → HÀ NỘI</Text>
              <Text style={styles.dayDesc}>
                ⬢ 07:30: Dùng điểm tâm sáng tại resort.{'\n'}
                ⬢ 08:30: Ngồi thuyền nan xuôi dòng sông Sào Khê khám phá các hang động Tràng An.{'\n'}
                ⬢ 11:30: Thưởng thức cơm cháy Ninh Bình, trả phòng.{'\n'}
                ⬢ 13:30: Chiêm bái Quần thể Chùa Bái Đính nguy nga và thanh tịnh.{'\n'}
                ⬢ 16:00: Lên xe trở về Hà Nội, đến nơi khoảng 18:30 tối.
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
          <Text style={styles.bottomPrice}>2.190.000 đ</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleBook}>
          <Text style={styles.bookNowText}>Đặt tour Ninh Bình</Text>
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
