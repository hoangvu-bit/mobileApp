import React, { useMemo } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Alert, 
  Linking 
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { CULINARY_ITEMS, CulinaryItem } from './am-thuc';

export default function ChiTietAmThucScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    restaurantName?: string;
    location?: string;
    address?: string;
    openHours?: string;
    phone?: string;
    price?: string;
    desc?: string;
    tag?: string;
    image?: string;
  }>();

  // Find dish from database or fallback to params
  const dishData: CulinaryItem = useMemo(() => {
    const found = CULINARY_ITEMS.find(d => d.id === params.id || d.name === params.name);
    if (found) return found;

    return {
      id: 'custom',
      name: params.name || 'Bò tơ Tây Ninh nướng y & lẩu đuôi bò',
      restaurantName: params.restaurantName || 'Bò Tơ Năm Sánh 17 (Cơ sở chính)',
      location: params.location || 'Hòa Thành, Tây Ninh',
      province: 'Tây Ninh',
      address: params.address || 'QL22B, Xã Hiệp Tân, Thị xã Hòa Thành, Tây Ninh',
      openHours: params.openHours || '08:30 - 22:30 hàng ngày',
      phone: params.phone || '0913 888 777',
      price: params.price || '150.000đ - 350.000đ / món',
      priceNum: 150000,
      rating: 4.9,
      reviewCount: 2350,
      desc: params.desc || 'Bò tơ non nướng than hoa thơm lừng, thịt ngọt mềm mọng nước, da nướng giòn sần sật cuốn rau rừng.',
      longDesc: 'Bò tơ Năm Sánh là thương hiệu nổi danh khắp miền Nam. Thịt bò được tuyển chọn từ những con bê non thả đồi Tây Ninh khoảng 5-6 tháng tuổi nên thịt mềm ngọt, da mỏng giòn và không có mùi gây.',
      flavorHighlights: [
        'Thịt bò tơ non mềm ngọt tự nhiên, nướng xèo xèo trên than hồng rực lửa',
        'Bò lụi sả cay the chấm chao sa tế hoặc mắm nêm thơm nồng',
        'Lẩu đuôi bò hầm sâm bố chính ngọt mát, bổ dưỡng',
        'Ăn kèm hơn 10 loại rau rừng Tây Ninh tươi rói và bánh phở cuốn'
      ],
      recommendedMenu: [
        { name: 'Bò tơ nướng y chấm muối ớt đỏ', price: '180.000đ' },
        { name: 'Bò lụi sả nướng than hoa', price: '160.000đ' },
        { name: 'Bò tơ nhúng giấm cuốn bánh tráng', price: '190.000đ' },
        { name: 'Lẩu xí quách & đuôi bò tơ', price: '280.000đ' }
      ],
      tag: params.tag || 'Đặc sản trứ danh',
      categories: ['Ăn gia đình', 'Cuối tuần', 'Đặc sản địa phương'],
      image: params.image || 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        params.image || 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80'
      ],
      diningTips: [
        'Không gian sân vườn rộng rãi, bãi đỗ xe ô tô thoải mái.',
        'Đi nhóm từ 4-6 người là lý tưởng nhất để gọi được nhiều món nướng và lẩu.'
      ]
    };
  }, [params]);

  const handleOpenGoogleMaps = () => {
    const query = `${dishData.restaurantName} ${dishData.address}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  const handleCallPhone = () => {
    if (!dishData.phone) {
      Alert.alert('Thông báo', 'Quán chưa cập nhật số điện thoại bàn.');
      return;
    }
    Linking.openURL(`tel:${dishData.phone.replace(/[^\d+]/g, '')}`);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>
        <Text style={styles.topHeaderTitle} numberOfLines={1}>Chi tiết món ngon & Quán ăn</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.homeBtn} hitSlop={10}>
          <Ionicons name="home-outline" size={20} color="#ea580c" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: dishData.image }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroBadgeOverlay}>
            <View style={styles.badgeTag}>
              <Ionicons name="flame" size={12} color="#ea580c" />
              <Text style={styles.badgeTagText}>{dishData.tag}</Text>
            </View>
            <View style={styles.badgeRating}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.badgeRatingText}>{dishData.rating} ({dishData.reviewCount} đánh giá)</Text>
            </View>
          </View>
        </View>

        {/* Content Details */}
        <View style={styles.content}>
          
          {/* Location pill */}
          <View style={styles.locRow}>
            <Ionicons name="location-sharp" size={13} color="#ea580c" />
            <Text style={styles.locText}>{dishData.location}</Text>
          </View>

          {/* Dish Name */}
          <Text style={styles.dishTitle}>{dishData.name}</Text>
          <Text style={styles.priceTag}>{dishData.price}</Text>
          <Text style={styles.dishDesc}>{dishData.longDesc || dishData.desc}</Text>

          {/* CARD: THÔNG TIN QUÁN ĂN & ĐỊA ĐIỂM CHI TIẾT (Requirement 4) */}
          <View style={styles.restaurantDetailCard}>
            <View style={styles.restaurantCardHeader}>
              <View style={styles.restaurantIconCircle}>
                <Ionicons name="storefront" size={18} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.restaurantLabel}>QUÁN ĂN NỔI TIẾNG</Text>
                <Text style={styles.restaurantTitle}>{dishData.restaurantName}</Text>
              </View>
            </View>

            {/* Address */}
            <View style={styles.restaurantInfoRow}>
              <Ionicons name="location-outline" size={18} color="#ea580c" style={styles.infoRowIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoRowLabel}>Địa chỉ quán:</Text>
                <Text style={styles.infoRowValue}>{dishData.address}</Text>
              </View>
            </View>

            {/* Opening and Closing Hours */}
            <View style={styles.restaurantInfoRow}>
              <Ionicons name="time-outline" size={18} color="#00897b" style={styles.infoRowIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoRowLabel}>Thời gian mở - đóng cửa:</Text>
                <Text style={styles.infoRowValueGreen}>{dishData.openHours}</Text>
              </View>
            </View>

            {/* Phone */}
            <View style={styles.restaurantInfoRow}>
              <Ionicons name="call-outline" size={18} color="#ea580c" style={styles.infoRowIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoRowLabel}>Hotline đặt bàn:</Text>
                <Text style={styles.infoRowValue}>{dishData.phone}</Text>
              </View>
            </View>

            {/* Action Buttons for Map & Calling */}
            <View style={styles.restaurantActionRow}>
              <Pressable style={styles.mapBtn} onPress={handleOpenGoogleMaps}>
                <Ionicons name="map" size={15} color="#ffffff" />
                <Text style={styles.mapBtnText}>Mở Google Maps chỉ đường</Text>
              </Pressable>

              <Pressable style={styles.callBtn} onPress={handleCallPhone}>
                <Ionicons name="call" size={15} color="#c2410c" />
                <Text style={styles.callBtnText}>Gọi quán</Text>
              </Pressable>
            </View>
          </View>

          {/* Hương vị & Bí quyết chế biến */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons name="silverware-clean" size={20} color="#ea580c" />
              <Text style={styles.sectionTitle}>Hương vị & Điểm đặc sắc</Text>
            </View>
            <View style={styles.flavorList}>
              {dishData.flavorHighlights.map((item, idx) => (
                <View key={idx} style={styles.flavorItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#ea580c" style={{ marginTop: 2 }} />
                  <Text style={styles.flavorText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Thực đơn gợi ý của quán */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="restaurant-outline" size={18} color="#00897b" />
              <Text style={styles.sectionTitle}>Món ngon nên thử tại quán</Text>
            </View>
            <View style={styles.menuCard}>
              {dishData.recommendedMenu.map((menuItem, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.menuItemRow, 
                    idx === dishData.recommendedMenu.length - 1 && { borderBottomWidth: 0 }
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.menuItemName}>{menuItem.name}</Text>
                  </View>
                  <Text style={styles.menuItemPrice}>{menuItem.price}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Kinh nghiệm ăn uống */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="bulb-outline" size={18} color="#f59e0b" />
              <Text style={styles.sectionTitle}>Kinh nghiệm ăn uống</Text>
            </View>
            <View style={styles.tipsCard}>
              {dishData.diningTips.map((tip, idx) => (
                <View key={idx} style={styles.tipRow}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Mức giá trung bình</Text>
          <Text style={styles.bottomPriceVal}>{dishData.price}</Text>
        </View>
        <Pressable style={styles.bottomDirectBtn} onPress={handleOpenGoogleMaps}>
          <Ionicons name="navigate-circle" size={18} color="#ffffff" />
          <Text style={styles.bottomDirectBtnText}>Chỉ đường đến quán</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  backBtn: { padding: 4 },
  topHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  homeBtn: { padding: 4 },
  scrollContent: { paddingBottom: 110 },

  /* Hero Image */
  heroImageContainer: { height: 230, width: '100%', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroBadgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badgeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3
  },
  badgeTagText: { color: '#ea580c', fontSize: 11, fontWeight: '800' },
  badgeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeRatingText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  /* Content */
  content: { padding: 16, gap: 14 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locText: { fontSize: 12, color: '#ea580c', fontWeight: '700' },
  dishTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', lineHeight: 28 },
  priceTag: { fontSize: 18, fontWeight: '900', color: '#ea580c' },
  dishDesc: { fontSize: 13, color: '#475569', lineHeight: 20 },

  /* Restaurant Card (Requirement 4) */
  restaurantDetailCard: {
    backgroundColor: '#fffaf5',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    padding: 16,
    marginTop: 4,
    gap: 12
  },
  restaurantCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa'
  },
  restaurantIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center'
  },
  restaurantLabel: { fontSize: 10, fontWeight: '800', color: '#c2410c', letterSpacing: 0.5 },
  restaurantTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 1 },

  restaurantInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  infoRowIcon: { marginTop: 2 },
  infoRowLabel: { fontSize: 10, fontWeight: '700', color: '#64748b' },
  infoRowValue: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginTop: 1 },
  infoRowValueGreen: { fontSize: 13, fontWeight: '800', color: '#00897b', marginTop: 1 },

  restaurantActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  mapBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ea580c',
    paddingVertical: 11,
    borderRadius: 10
  },
  mapBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ffedd5',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fed7aa'
  },
  callBtnText: { color: '#c2410c', fontSize: 12, fontWeight: '800' },

  /* Details Blocks */
  sectionBlock: { marginTop: 4 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  flavorList: { gap: 8 },
  flavorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10
  },
  flavorText: { fontSize: 12, color: '#334155', flex: 1, lineHeight: 18 },

  menuCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 4
  },
  menuItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  menuItemName: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  menuItemPrice: { fontSize: 12, fontWeight: '800', color: '#ea580c' },

  tipsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 12,
    gap: 6
  },
  tipRow: { flexDirection: 'row', gap: 6 },
  tipBullet: { color: '#d97706', fontWeight: 'bold' },
  tipText: { fontSize: 12, color: '#92400e', flex: 1, lineHeight: 18 },

  /* Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingTop: 10,
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
  bottomPriceLabel: { fontSize: 10, color: '#64748b', fontWeight: '600' },
  bottomPriceVal: { fontSize: 16, fontWeight: '900', color: '#ea580c' },
  bottomDirectBtn: {
    backgroundColor: '#ea580c',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10
  },
  bottomDirectBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' }
});
