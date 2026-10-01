import GlobalFooter from '../components/global-footer';
import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChiTietTourScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title?: string;
    price?: string;
    duration?: string;
    location?: string;
    image?: string;
    desc?: string;
  }>();

  const title = params.title || 'Tour Đà Lạt 3N2Đ: săn mây, rừng thông và cà phê cao nguyên';
  const price = params.price || 'Từ 2.790.000 đ';
  const duration = params.duration || '3 ngày 2 đêm';
  const location = params.location || 'Đà Lạt, Lâm Đồng';
  const image = params.image || 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=84';
  const desc = params.desc || 'Hành trình nhẹ nhàng cho nhóm thích khí hậu mát, ảnh đẹp và nhiều quán cà phê.';

  const handleBookTour = () => {
    Alert.alert(
      'Đặt tour thành công',
      `Yêu cầu đặt "${title}" đã được ghi nhận. Chuyên viên igovi sẽ liên hệ xác nhận trong 15 phút.`,
      [{ text: 'Đồng ý', onPress: () => router.back() }]
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
        <Text style={styles.subBarTitle} numberOfLines={1}>Chi tiết hành trình</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: image }} 
          style={styles.heroImage} 
        />
        
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{duration}</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#00897b" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.desc}>{desc}</Text>
          
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>Điểm nổi bật của tour</Text>
            <Text style={styles.highlightItem}>✓ Xe du lịch chất lượng cao đưa đón tận nơi</Text>
            <Text style={styles.highlightItem}>✓ Hướng dẫn viên nhiệt tình, am hiểu văn hóa bản địa</Text>
            <Text style={styles.highlightItem}>✓ Bao gồm bảo hiểm du lịch & bữa ăn tiêu chuẩn</Text>
            <Text style={styles.highlightItem}>✓ Hỗ trợ xuất hóa đơn VAT theo yêu cầu</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lịch trình dự kiến</Text>
            <Text style={styles.sectionContent}>
              ⬢ Ngày 1: Đón khách tại điểm hẹn, di chuyển đến điểm tham quan chính. Thưởng thức đặc sản vùng miền.{"\n\n"}
              ⬢ Ngày 2: Khám phá các danh thắng nổi tiếng, check-in điểm đến được yêu thích nhất.{"\n\n"}
              ⬢ Ngày 3: Tự do mua sắm quà lưu niệm và khởi hành về lại điểm đón ban đầu.
            </Text>
          </View>
          
          <Pressable style={styles.bookBtn} onPress={handleBookTour}>
            <Text style={styles.bookBtnText}>Đặt tour ngay</Text>
          </Pressable>
        </View>
        <GlobalFooter />
      </ScrollView>
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
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, fontWeight: '700', color: '#00897b' },
  subBarTitle: { fontSize: 13, color: '#64748b', fontWeight: '500' },

  scrollContent: { paddingBottom: 60 },
  heroImage: { width: '100%', height: 240 },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 },
  badge: { backgroundColor: '#e6f7f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#00897b', fontSize: 11, fontWeight: 'bold' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  locationText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', lineHeight: 28, color: '#0f172a', marginBottom: 10 },
  price: { fontSize: 22, fontWeight: '900', color: '#ea580c', marginBottom: 14 },
  desc: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 20 },
  highlightBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  highlightTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  highlightItem: { fontSize: 13, color: '#334155', lineHeight: 22, marginBottom: 4 },
  section: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 20, marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  sectionContent: { fontSize: 13, color: '#475569', lineHeight: 22 },
  bookBtn: { backgroundColor: '#00897b', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 3 },
  bookBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase' },
});
