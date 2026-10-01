import GlobalFooter from '../components/global-footer';
import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChiTietAmThucScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    location?: string;
    desc?: string;
    image?: string;
    tag?: string;
    price?: string;
  }>();

  const name = params.name || 'Bò tơ Tây Ninh cho bữa trưa đông người';
  const location = params.location || 'TP. Tây Ninh';
  const desc = params.desc || 'Gợi ý gọi món bò tơ nướng tảng, bò nhúng giấm, rau rừng và bánh tráng phơi sương cho nhóm đông người.';
  const image = params.image || 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80';
  const tag = params.tag || 'Đặc sản trứ danh';
  const price = params.price || '150.000 đ - 350.000 đ / món';

  const handleOpenMap = () => {
    Alert.alert('Chỉ đường quán ăn', `Đang tìm lộ trình dẫn đường đến quán phục vụ "${name}" gần nhất...`);
  };

  return (
    <View style={styles.container}>
      {/* Sub navigation bar */}
      <View style={styles.subBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#ea580c" />
          <Text style={styles.backText}>Quay lại ẩm thực</Text>
        </Pressable>
        <Text style={styles.subBarTitle} numberOfLines={1}>Chi tiết món ngon</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: image }} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <SymbolView name="fork.knife" size={12} tintColor="#ea580c" />
              <Text style={styles.badgeText}>{tag}</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#ea580c" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>

          <Text style={styles.title}>{name}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.desc}>{desc}</Text>

          {/* Flavor Profile Box */}
          <View style={styles.flavorBox}>
            <Text style={styles.sectionTitle}>Hương vị & Bí quyết chế biến</Text>
            <Text style={styles.flavorItem}>• Thịt bò non mềm ngọt tự nhiên, da giòn sần sật không bị dai</Text>
            <Text style={styles.flavorItem}>• Ăn kèm hơn 10 loại rau rừng Tây Ninh như lá cóc, quế vị, sao nhái</Text>
            <Text style={styles.flavorItem}>• Chấm cùng mắm nêm đậm đà pha dứa và ớt hiểm cay nồng</Text>
            <Text style={styles.flavorItem}>• Nướng trên than hoa đỏ rực giữ trọn độ mọng nước của thịt</Text>
          </View>

          {/* Recommended Restaurants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quán ăn gợi ý chuẩn vị nhất</Text>

            <View style={styles.restaurantCard}>
              <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>1. Bò Tơ Năm Sánh 17</Text>
                <Text style={styles.restaurantRating}>⭐ 4.8 / 5</Text>
              </View>
              <Text style={styles.restaurantAddr}>QL22B, Hiệp Tân, Hòa Thành, Tây Ninh</Text>
              <Text style={styles.restaurantHours}>⏰ 08:30 - 22:00 hàng ngày</Text>
              <Text style={styles.restaurantDish}>Món nên thử: Bò lụi sả, bò tơ nướng y, lẩu đuôi bò</Text>
            </View>

            <View style={styles.restaurantCard}>
              <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>2. Bò Tơ Nhật Khương</Text>
                <Text style={styles.restaurantRating}>⭐ 4.7 / 5</Text>
              </View>
              <Text style={styles.restaurantAddr}>Đường 30/4, Phường 3, TP. Tây Ninh</Text>
              <Text style={styles.restaurantHours}>⏰ 10:00 - 22:30 hàng ngày</Text>
              <Text style={styles.restaurantDish}>Món nên thử: Bò tơ cuốn bánh tráng phơi sương, lòng bò hấp gừng</Text>
            </View>
          </View>

          {/* Dining Tips */}
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>Kinh nghiệm ăn uống</Text>
            <Text style={styles.tipText}>⬢ Đi nhóm từ 4-6 người là lý tưởng nhất để gọi được nhiều món phong phú.</Text>
            <Text style={styles.tipText}>⬢ Nên đến trước 18:30 vào dịp cuối tuần để tránh hết bàn hoặc chờ lâu.</Text>
          </View>
        </View>
        <GlobalFooter />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Mức giá trung bình</Text>
          <Text style={styles.bottomPrice}>{price}</Text>
        </View>
        <Pressable style={styles.bookNowBtn} onPress={handleOpenMap}>
          <SymbolView name="location.fill" size={16} tintColor="#fff" />
          <Text style={styles.bookNowText}>Tìm quán gần đây</Text>
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
    backgroundColor: '#fff7ed',
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, fontWeight: '700', color: '#ea580c' },
  subBarTitle: { fontSize: 13, color: '#9a3412', fontWeight: '500' },

  scrollContent: { paddingBottom: 100 },
  heroImage: { width: '100%', height: 240 },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff1ee', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#ea580c', fontSize: 11, fontWeight: 'bold' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  locationText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', lineHeight: 28, color: '#0f172a', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: '900', color: '#ea580c', marginBottom: 12 },
  desc: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

  flavorBox: { backgroundColor: '#fff7ed', padding: 16, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#ffedd5' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  flavorItem: { fontSize: 13, color: '#9a3412', lineHeight: 20, marginBottom: 6 },

  section: { marginBottom: 20 },
  restaurantCard: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
  restaurantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  restaurantName: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  restaurantRating: { fontSize: 12, fontWeight: 'bold', color: '#ea580c' },
  restaurantAddr: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  restaurantHours: { fontSize: 11, color: '#64748b', marginBottom: 6 },
  restaurantDish: { fontSize: 12, color: '#0f172a', fontWeight: '600' },

  tipBox: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  tipTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  tipText: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 4 },

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
  bottomPrice: { fontSize: 15, fontWeight: '900', color: '#ea580c' },
  bookNowBtn: { backgroundColor: '#ea580c', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  bookNowText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
});
