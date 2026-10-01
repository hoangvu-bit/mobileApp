import GlobalFooter from '../components/global-footer';
import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChiTietKhuSinhThaiScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    location?: string;
    desc?: string;
    image?: string;
    tag?: string;
    ticket?: string;
  }>();

  const name = params.name || 'Một ngày về rừng Ma Thiên Lãnh';
  const location = params.location || 'TP. Tây Ninh, Tây Ninh';
  const desc = params.desc || 'Trekking nhẹ, ăn trưa địa phương và khám phá thung lũng xanh mát mẻ dưới chân Núi Bà Đen.';
  const image = params.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=84';
  const tag = params.tag || 'Sinh thái nghỉ dưỡng';
  const ticket = params.ticket || 'Từ 250.000đ / người';

  const handleBook = () => {
    Alert.alert(
      'Đặt trải nghiệm thành công',
      `Yêu cầu trải nghiệm "${name}" đã được ghi nhận. Hướng dẫn viên sinh thái sẽ liên hệ hỗ trợ bạn chuẩn bị đồ dùng.`,
      [{ text: 'Đồng ý', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <SymbolView name="chevron.left" size={22} tintColor="#0f172a" />
        </Pressable>
        <Text style={styles.topHeaderTitle} numberOfLines={1}>Chi tiết Khu sinh thái</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.homeBtn} hitSlop={10}>
          <SymbolView name="house.fill" size={20} tintColor="#00897b" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: image }} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <SymbolView name="leaf.fill" size={12} tintColor="#16a34a" />
              <Text style={styles.badgeText}>{tag}</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#00897b" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>

          <Text style={styles.title}>{name}</Text>
          <Text style={styles.price}>{ticket}</Text>
          <Text style={styles.desc}>{desc}</Text>

          {/* Highlights Box */}
          <View style={styles.highlightBox}>
            <Text style={styles.sectionTitle}>Hoạt động nổi bật tại điểm đến</Text>
            <Text style={styles.highlightItem}>• Chèo SUP, tắm suối tự nhiên và chụp ảnh check-in rừng xanh</Text>
            <Text style={styles.highlightItem}>• Thưởng thức bữa trưa gà nướng cơm lam và rau rừng Tây Ninh</Text>
            <Text style={styles.highlightItem}>• Trải nghiệm cắm trại glamping bên suối dưới tán cây cổ thụ</Text>
            <Text style={styles.highlightItem}>• Hướng dẫn viên bản địa am hiểu địa hình, trang bị áo phao an toàn</Text>
          </View>

          {/* Facilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiện ích có sẵn</Text>
            <View style={styles.facilityGrid}>
              {[
                { icon: 'car.fill', label: 'Bãi đỗ xe rộng rãi' },
                { icon: 'wifi', label: 'Wifi miễn phí' },
                { icon: 'tent.fill', label: 'Cho thuê lều trại' },
                { icon: 'fork.knife', label: 'Khu ẩm thực dã ngoại' },
              ].map((f, i) => (
                <View key={i} style={styles.facilityItem}>
                  <SymbolView name={f.icon as any} size={18} tintColor="#00897b" />
                  <Text style={styles.facilityText}>{f.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Preparation tips */}
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>Lưu ý khi tham quan</Text>
            <Text style={styles.tipText}>⬢ Nên mang giày thể thao chống trơn trượt khi đi bộ trong rừng.</Text>
            <Text style={styles.tipText}>⬢ Mang theo kem chống nắng, xịt chống côn trùng và túi chống nước cho điện thoại.</Text>
            <Text style={styles.tipText}>⬢ Giữ gìn vệ sinh chung, không vứt rác trong khu bảo tồn tự nhiên.</Text>
          </View>
        </View>
        <GlobalFooter />
      </ScrollView>

      {/* Bottom Sticky Booking Bar */}
      <View style={[styles.bottomBar]}>
        <View>
          <Text style={styles.bottomPriceLabel}>Chi phí tham khảo</Text>
          <Text style={styles.bottomPrice}>{ticket}</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleBook}>
          <Text style={styles.bookNowText}>Đặt trải nghiệm ngay</Text>
          <SymbolView name="arrow.right" size={16} tintColor="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  backBtn: { padding: 6, marginLeft: -6 },
  topHeaderTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  homeBtn: { padding: 6, marginRight: -6 },
  scrollContent: { paddingBottom: 100 },
  heroImage: { width: '100%', height: 260 },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ecfdf5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#16a34a', fontSize: 11, fontWeight: 'bold' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  locationText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', lineHeight: 30, color: '#0f172a', marginBottom: 8 },
  price: { fontSize: 20, fontWeight: '900', color: '#16a34a', marginBottom: 12 },
  desc: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 20 },

  highlightBox: { backgroundColor: '#f0fdf4', padding: 18, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#dcfce7' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  highlightItem: { fontSize: 13, color: '#14532d', lineHeight: 22, marginBottom: 6 },

  section: { marginBottom: 24 },
  facilityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  facilityItem: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  facilityText: { fontSize: 12, color: '#334155', fontWeight: '600' },

  tipBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  tipTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  tipText: { fontSize: 12, color: '#64748b', lineHeight: 20, marginBottom: 4 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomPriceLabel: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  bottomPrice: { fontSize: 18, fontWeight: '900', color: '#16a34a' },
  bookNowBtn: { backgroundColor: '#16a34a', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 },
  bookNowText: { color: '#fff', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
});
