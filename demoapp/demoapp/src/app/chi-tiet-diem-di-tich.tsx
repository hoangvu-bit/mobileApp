import GlobalFooter from '../components/global-footer';
import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChiTietDiemDiTichScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    location?: string;
    category?: string;
    ticketPrice?: string;
    hours?: string;
    period?: string;
    desc?: string;
    image?: string;
  }>();

  const name = params.name || 'Tòa Thánh Tây Ninh';
  const location = params.location || 'Thị xã Hòa Thành, Tây Ninh';
  const category = params.category || 'Di tích Tôn giáo & Kiến trúc';
  const ticketPrice = params.ticketPrice || 'Miễn phí vé vào cửa';
  const hours = params.hours || '06:00 - 20:00 hàng ngày';
  const period = params.period || 'Khởi công năm 1931';
  const desc = params.desc || 'Trung tâm của Đạo Cao Đài với kiến trúc nghệ thuật độc đáo kết hợp giữa văn hóa phương Đông và phương Tây, nổi bật với hai lầu chuông và trống cao vút.';
  const image = params.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80';

  const handleAction = () => {
    Alert.alert('Chỉ đường đến di tích', `Đang kết nối GPS dẫn đường đến ${name} tại ${location}...`);
  };

  return (
    <View style={styles.container}>
      {/* Sub navigation bar */}
      <View style={styles.subBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#7c3aed" />
          <Text style={styles.backText}>Quay lại điểm di tích</Text>
        </Pressable>
        <Text style={styles.subBarTitle} numberOfLines={1}>Thông tin di tích</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: image }} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <SymbolView name="building.columns.fill" size={12} tintColor="#7c3aed" />
              <Text style={styles.badgeText}>{category}</Text>
            </View>
            <View style={styles.locationBadge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#7c3aed" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>

          <Text style={styles.title}>{name}</Text>
          <Text style={styles.price}>{ticketPrice}</Text>
          <Text style={styles.desc}>{desc}</Text>

          {/* Quick Info Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickItem}>
              <SymbolView name="clock" size={20} tintColor="#7c3aed" />
              <Text style={styles.quickItemLabel}>Giờ mở cửa</Text>
              <Text style={styles.quickItemValue}>{hours}</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="calendar" size={20} tintColor="#7c3aed" />
              <Text style={styles.quickItemLabel}>Niên đại</Text>
              <Text style={styles.quickItemValue}>{period}</Text>
            </View>
            <View style={styles.quickItem}>
              <SymbolView name="ticket.fill" size={20} tintColor="#7c3aed" />
              <Text style={styles.quickItemLabel}>Vé tham quan</Text>
              <Text style={styles.quickItemValue}>{ticketPrice}</Text>
            </View>
          </View>

          {/* Significance */}
          <View style={styles.significanceBox}>
            <Text style={styles.sectionTitle}>Giá trị lịch sử & kiến trúc</Text>
            <Text style={styles.significanceItem}>• Công trình biểu tượng văn hóa tâm linh độc nhất vô nhị của Đạo Cao Đài</Text>
            <Text style={styles.significanceItem}>• Nghệ thuật đắp nổi rồng phượng và biểu tượng Thiên Nhãn đầy huyền bí</Text>
            <Text style={styles.significanceItem}>• Nơi diễn ra các đại lễ tôn giáo lớn thu hút hàng vạn tín đồ và du khách quốc tế</Text>
            <Text style={styles.significanceItem}>• Không gian thanh tịnh rợp bóng cây cổ thụ giữa trung tâm thị xã</Text>
          </View>

          {/* Guidelines */}
          <View style={styles.guidelineBox}>
            <Text style={styles.guidelineTitle}>Quy định khi vào tham quan</Text>
            <Text style={styles.guidelineText}>⬢ Trang phục lịch sự, kín đáo (không mặc váy ngắn, quần đùi, áo sát nách).</Text>
            <Text style={styles.guidelineText}>⬢ Bỏ giày dép bên ngoài trước khi bước vào đại điện chánh sảnh.</Text>
            <Text style={styles.guidelineText}>⬢ Giữ trật tự, không chụp ảnh quay phim hướng trực tiếp vào lúc đang hành lễ nghiêm trang.</Text>
          </View>
        </View>
        <GlobalFooter />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Vé tham quan</Text>
          <Text style={styles.bottomPrice}>{ticketPrice}</Text>
        </View>
        <Pressable style={styles.actionBtn} onPress={handleAction}>
          <SymbolView name="location.fill" size={16} tintColor="#fff" />
          <Text style={styles.actionBtnText}>Mở bản đồ chỉ đường</Text>
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
    backgroundColor: '#f5f3ff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd6fe',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, fontWeight: '700', color: '#7c3aed' },
  subBarTitle: { fontSize: 13, color: '#6d28d9', fontWeight: '500' },

  scrollContent: { paddingBottom: 100 },
  heroImage: { width: '100%', height: 240 },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f5f3ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#7c3aed', fontSize: 11, fontWeight: 'bold' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  locationText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', lineHeight: 28, color: '#0f172a', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: '900', color: '#7c3aed', marginBottom: 12 },
  desc: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  quickItem: { flex: 1, backgroundColor: '#fcfaff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#f3e8ff', alignItems: 'center' },
  quickItemLabel: { fontSize: 10, color: '#64748b', marginTop: 4, marginBottom: 2 },
  quickItemValue: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },

  significanceBox: { backgroundColor: '#fdf4ff', padding: 16, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#fae8ff' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  significanceItem: { fontSize: 13, color: '#86198f', lineHeight: 20, marginBottom: 6 },

  guidelineBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  guidelineTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  guidelineText: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 6 },

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
  bottomPrice: { fontSize: 15, fontWeight: '900', color: '#7c3aed' },
  actionBtn: { backgroundColor: '#7c3aed', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
});
