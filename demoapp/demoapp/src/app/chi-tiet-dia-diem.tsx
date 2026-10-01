import GlobalFooter from '../components/global-footer';
import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChiTietDiaDiemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    type?: string;
    distance?: string;
    hours?: string;
    image?: string;
    address?: string;
    phone?: string;
  }>();

  const name = params.name || 'KDL Quốc Gia Núi Bà Đen';
  const type = params.type || 'Điểm tham quan';
  const distance = params.distance || 'Cách bạn 3.2 km';
  const hours = params.hours || '06:00 - 21:00 hàng ngày';
  const image = params.image || 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80';
  const address = params.address || 'Khu phố Ninh Phú, Phường Ninh Sơn, TP. Tây Ninh';
  const phone = params.phone || '0276 353 6666';

  const handleStartNav = () => {
    Alert.alert('Bắt đầu lộ trình', `Hệ thống bản đồ số đang kích hoạt chỉ đường bằng giọng nói đến "${name}"...`);
  };

  const handleCall = () => {
    Alert.alert('Gọi hỗ trợ', `Đang kết nối tới hotline: ${phone}`);
  };

  return (
    <View style={styles.container}>
      {/* Sub navigation bar */}
      <View style={styles.subBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#4f46e5" />
          <Text style={styles.backText}>Quay lại bản đồ</Text>
        </Pressable>
        <Text style={styles.subBarTitle} numberOfLines={1}>Thông tin địa điểm</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: image }} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <SymbolView name="mappin.and.ellipse" size={12} tintColor="#4f46e5" />
              <Text style={styles.badgeText}>{type}</Text>
            </View>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>● Đang mở cửa</Text>
            </View>
          </View>

          <Text style={styles.title}>{name}</Text>
          <Text style={styles.address}>📍 {address}</Text>

          {/* Quick Action Buttons */}
          <View style={styles.actionRow}>
            <Pressable style={styles.actionBtn} onPress={handleStartNav}>
              <SymbolView name="arrow.triangle.turn.up.right.diamond.fill" size={20} tintColor="#4f46e5" />
              <Text style={styles.actionBtnText}>Chỉ đường</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={handleCall}>
              <SymbolView name="phone.fill" size={20} tintColor="#059669" />
              <Text style={styles.actionBtnText}>Gọi điện</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => Alert.alert('Lưu địa điểm', `Đã lưu "${name}" vào danh sách yêu thích.`)}>
              <SymbolView name="bookmark.fill" size={20} tintColor="#f59e0b" />
              <Text style={styles.actionBtnText}>Lưu lại</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => Alert.alert('Chia sẻ', `Đã sao chép liên kết địa điểm: ${name}`)}>
              <SymbolView name="square.and.arrow.up.fill" size={20} tintColor="#0284c7" />
              <Text style={styles.actionBtnText}>Chia sẻ</Text>
            </Pressable>
          </View>

          {/* Location Details Box */}
          <View style={styles.detailsBox}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
            <View style={styles.detailRow}>
              <SymbolView name="clock.fill" size={14} tintColor="#64748b" />
              <Text style={styles.detailLabel}>Giờ hoạt động:</Text>
              <Text style={styles.detailValue}>{hours}</Text>
            </View>
            <View style={styles.detailRow}>
              <SymbolView name="phone.circle.fill" size={14} tintColor="#64748b" />
              <Text style={styles.detailLabel}>Hotline hỗ trợ:</Text>
              <Text style={[styles.detailValue, { color: '#4f46e5' }]}>{phone}</Text>
            </View>
          </View>

          {/* Amenities & Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiện ích xung quanh</Text>
            <View style={styles.amenityList}>
              {[
                'Bãi đỗ xe ô tô & xe máy rộng rãi',
                'Điểm sạc xe điện VinFast',
                'Cây ATM & quầy rút tiền tự động',
                'Nhà vệ sinh đạt chuẩn du lịch',
              ].map((item, idx) => (
                <View key={idx} style={styles.amenityItem}>
                  <SymbolView name="checkmark.circle.fill" size={16} tintColor="#059669" />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <GlobalFooter />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomSub}>{distance}</Text>
          <Text style={styles.bottomMain}>{type}</Text>
        </View>
        <Pressable style={styles.navNowBtn} onPress={handleStartNav}>
          <SymbolView name="location.fill" size={16} tintColor="#fff" />
          <Text style={styles.navNowText}>Bắt đầu dẫn đường</Text>
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
    backgroundColor: '#eef2ff',
    borderBottomWidth: 1,
    borderBottomColor: '#c7d2fe',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, fontWeight: '700', color: '#4f46e5' },
  subBarTitle: { fontSize: 13, color: '#3730a3', fontWeight: '500' },

  scrollContent: { paddingBottom: 100 },
  heroImage: { width: '100%', height: 240 },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#4f46e5', fontSize: 11, fontWeight: 'bold' },
  distanceBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  distanceText: { color: '#059669', fontSize: 11, fontWeight: '600' },
  statusBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText: { color: '#16a34a', fontSize: 11, fontWeight: '600' },

  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  address: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 20 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 14, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  actionBtn: { alignItems: 'center', gap: 4, flex: 1 },
  actionBtnText: { fontSize: 11, fontWeight: '600', color: '#0f172a' },

  detailsBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#64748b', width: 120 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#0f172a', flex: 1 },

  section: { marginBottom: 20 },
  amenityList: { gap: 10 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amenityText: { fontSize: 13, color: '#334155' },

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
  bottomSub: { fontSize: 11, color: '#059669', fontWeight: '600' },
  bottomMain: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  navNowBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  navNowText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
});
