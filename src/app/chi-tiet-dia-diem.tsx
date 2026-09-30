import React from 'react';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
    province?: string;
    description?: string;
    ticketPrice?: string;
    rating?: string;
  }>();

  const name = params.name || 'KDL Quốc Gia Núi Bà Đen';
  const type = params.type || 'Danh lam thắng cảnh';
  const distance = params.distance || 'Điểm du lịch nổi bật';
  const hours = params.hours || '06:00 - 22:00';
  const image = params.image || 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80';
  const address = params.address || 'Khu phố Ninh Phú, Phường Ninh Sơn, TP. Tây Ninh';
  const phone = params.phone || '0276 353 6666';
  const province = params.province || 'Tây Ninh';
  const rating = params.rating || '4.9';
  const ticketPrice = params.ticketPrice || 'Miễn phí / Tuỳ dịch vụ';
  const description = params.description || `Khám phá vẻ đẹp kỳ vĩ và những nét văn hoá đặc sắc của ${name} tại ${province}. Nơi đây thu hút hàng triệu lượt du khách mỗi năm với cảnh quan thiên nhiên tráng lệ cùng nhiều hoạt động trải nghiệm hấp dẫn.`;

  const handleStartNav = () => {
    const query = encodeURIComponent(`${name}, ${address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {
      Alert.alert('Chỉ đường', `Mở Google Maps dẫn đường đến: ${name}`);
    });
  };

  const handleCall = () => {
    if (phone && phone !== 'Chưa cập nhật') {
      Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {
        Alert.alert('Gọi hỗ trợ', `Hotline: ${phone}`);
      });
    } else {
      Alert.alert('Hotline', 'Số điện thoại đang được cập nhật.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Sub navigation bar */}
      <View style={styles.subBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color="#004d40" />
          <Text style={styles.backText}>Bản đồ số</Text>
        </Pressable>
        <Text style={styles.subBarTitle} numberOfLines={1}>{province}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.imageOverlay} />
          <View style={styles.provinceBadge}>
            <Ionicons name="location-sharp" size={12} color="#fff" />
            <Text style={styles.provinceBadgeText}>{province}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="bookmark" size={12} color="#00897b" />
              <Text style={styles.badgeText}>{type}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Đang mở cửa</Text>
            </View>
          </View>

          <Text style={styles.title}>{name}</Text>
          <Text style={styles.address}>📍 {address}</Text>

          {/* Quick Action Buttons */}
          <View style={styles.actionRow}>
            <Pressable style={styles.actionBtn} onPress={handleStartNav}>
              <View style={[styles.actionIconBox, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="navigate" size={18} color="#0284c7" />
              </View>
              <Text style={styles.actionBtnText}>Chỉ đường</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={handleCall}>
              <View style={[styles.actionIconBox, { backgroundColor: '#e6fffa' }]}>
                <Ionicons name="call" size={18} color="#00897b" />
              </View>
              <Text style={styles.actionBtnText}>Gọi điện</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => Alert.alert('Đã lưu', `Đã lưu "${name}" vào danh sách yêu thích.`)}>
              <View style={[styles.actionIconBox, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="heart" size={18} color="#d97706" />
              </View>
              <Text style={styles.actionBtnText}>Yêu thích</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => Alert.alert('Chia sẻ', `Đã sao chép liên kết địa điểm: ${name}`)}>
              <View style={[styles.actionIconBox, { backgroundColor: '#f1f5f9' }]}>
                <Ionicons name="share-social" size={18} color="#475569" />
              </View>
              <Text style={styles.actionBtnText}>Chia sẻ</Text>
            </Pressable>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu địa danh</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          {/* Location Details Box */}
          <View style={styles.detailsBox}>
            <Text style={styles.sectionTitle}>Thông tin tham quan</Text>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#00897b" />
              <Text style={styles.detailLabel}>Giờ mở cửa:</Text>
              <Text style={styles.detailValue}>{hours}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="pricetag-outline" size={16} color="#00897b" />
              <Text style={styles.detailLabel}>Vé tham quan:</Text>
              <Text style={styles.detailValue}>{ticketPrice}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color="#00897b" />
              <Text style={styles.detailLabel}>Hotline hỗ trợ:</Text>
              <Text style={[styles.detailValue, { color: '#00897b', fontWeight: 'bold' }]}>{phone}</Text>
            </View>
          </View>

          {/* Amenities & Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiện ích phục vụ</Text>
            <View style={styles.amenityList}>
              {[
                'Bãi đỗ xe ô tô & xe máy rộng rãi',
                'Điểm check-in chụp ảnh ấn tượng',
                'Khu ẩm thực & giải khát địa phương',
                'Nhà vệ sinh sạch sẽ, đạt chuẩn du lịch',
              ].map((item, idx) => (
                <View key={idx} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bottomSub}>{province} • {type}</Text>
          <Text style={styles.bottomMain} numberOfLines={1}>{name}</Text>
        </View>
        <Pressable style={styles.navNowBtn} onPress={handleStartNav}>
          <Ionicons name="navigate" size={16} color="#fff" />
          <Text style={styles.navNowText}>Chỉ đường ngay</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faf9' },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, fontWeight: '700', color: '#004d40' },
  subBarTitle: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  scrollContent: { paddingBottom: 100 },
  imageWrapper: { position: 'relative', width: '100%', height: 260 },
  heroImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
  provinceBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  provinceBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  content: { padding: 18 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#e6fffa', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#00897b', fontSize: 11, fontWeight: '700' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20 },
  ratingText: { color: '#b45309', fontSize: 11, fontWeight: 'bold' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16a34a' },
  statusText: { color: '#16a34a', fontSize: 11, fontWeight: '600' },

  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  address: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 18 },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  actionBtn: { alignItems: 'center', gap: 6, flex: 1 },
  actionIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 11, fontWeight: '600', color: '#334155' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 10 },
  descriptionText: { fontSize: 13, color: '#475569', lineHeight: 21 },

  detailsBox: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#64748b', width: 110 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#0f172a', flex: 1 },

  amenityList: { gap: 10 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amenityText: { fontSize: 13, color: '#334155' },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 8,
  },
  bottomSub: { fontSize: 11, color: '#00897b', fontWeight: '600' },
  bottomMain: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  navNowBtn: { backgroundColor: '#004d40', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginLeft: 12 },
  navNowText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
