import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CULINARY_ITEMS, CulinaryItem } from './am-thuc';

const { width } = Dimensions.get('window');

export default function ChiTietAmThucScreen() {
  const insets = useSafeAreaInsets();
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
    const found = CULINARY_ITEMS.find((d) => d.id === params.id || d.name === params.name);
    if (found) return found;

    return {
      id: 'custom',
      name: params.name || 'Bánh Canh Trảng Bàng Hoàng Minh',
      restaurantName: params.restaurantName || 'Bánh Canh Trảng Bàng Hoàng Minh',
      location: params.location || 'Trảng Bàng, Tây Ninh',
      province: 'Tây Ninh',
      address: params.address || '38 Quốc Lộ 22, Thị xã Trảng Bàng, Tây Ninh',
      openHours: params.openHours || '06:00 - 21:30 hàng ngày',
      phone: params.phone || '0276 3880 120',
      price: params.price || '50.000đ - 80.000đ / tô',
      priceNum: 50000,
      rating: 4.9,
      reviewCount: 1240,
      desc: params.desc || 'Sợi bánh canh bột gạo dai mềm thơm lừng mùi gạo nàng thơm, nước dùng ninh xương ngọt thanh trong vắt ăn kèm đĩa thịt luộc và rau rừng.',
      longDesc: 'Bánh canh Trảng Bàng là niềm tự hào ẩm thực Tây Ninh. Bột bánh được làm từ gạo nàng thơm phơi sương tạo độ dẻo dai đặc trưng. Ăn kèm đĩa thịt bắp giò heo luộc cuốn bánh tráng phơi sương và rổ rau rừng hơn 10 vị thuốc Nam tươi non.',
      flavorHighlights: [
        'Nước dùng ninh từ xương ống heo hơn 6 tiếng, trong veo và ngọt hậu thanh khiết',
        'Sợi bánh canh trắng ngần, dẻo dai mềm mại làm từ gạo nàng thơm',
        'Đĩa thịt bắp giò heo cắt lát mỏng cuốn bánh tráng phơi sương chấm nước mắm tiêu',
        'Kèm đĩa rau rừng Tây Ninh tươi rói: lá cóc, quế vị, sao nhái, đọt choại',
      ],
      recommendedMenu: [
        { name: 'Tô bánh canh giò nạc đặc biệt', price: '65.000đ' },
        { name: 'Bánh canh thịt bắp giò khoanh', price: '55.000đ' },
        { name: 'Đĩa thịt luộc cuốn bánh tráng rau rừng', price: '120.000đ' },
        { name: 'Nước mía sầu riêng nguyên chất', price: '20.000đ' },
      ],
      tag: params.tag || 'Đặc sản trứ danh',
      categories: ['Ăn sáng', 'Đặc sản địa phương', 'Ăn gia đình'],
      image: params.image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        params.image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80',
      ],
      diningTips: [
        'Quán bán cả ngày từ 6h sáng, rất đông vào khung giờ sáng 7h-8h30 và trưa 11h30-13h.',
        'Nên gọi thêm phần bánh tráng phơi sương và đĩa rau rừng để trải nghiệm trọn vẹn vị Tây Ninh.',
      ],
    };
  }, [params]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header Bar (Matching Tour / Eco Detail Screens) */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBarBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
          <Text style={styles.topBarBackText}>Quay lại ẩm thực</Text>
        </Pressable>
        <View style={styles.topBarRight}>
          <Pressable onPress={() => setIsSaved(!isSaved)} style={styles.topBarBtn} hitSlop={10}>
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={22}
              color={isSaved ? '#e11d48' : '#0f172a'}
            />
          </Pressable>
          <Pressable onPress={handleOpenGoogleMaps} style={styles.topBarBtn} hitSlop={10}>
            <Ionicons name="map-outline" size={20} color="#168b58" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title & Badges Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{dishData.name}</Text>

          <View style={styles.tagBadgeRow}>
            <View style={styles.starBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.starBadgeText}>Món ngon chuẩn vị địa phương</Text>
            </View>

            <View style={styles.calendarBadge}>
              <Text style={{ fontSize: 11 }}>🥢</Text>
              <Text style={styles.calendarBadgeText}>{dishData.tag || 'Đặc sản ẩm thực'}</Text>
            </View>
          </View>

          <View style={styles.groupBadgeRow}>
            <View style={styles.purpleGroupBadge}>
              <Ionicons name="restaurant-outline" size={13} color="#6d28d9" />
              <Text style={styles.purpleGroupBadgeText}>
                {dishData.categories ? dishData.categories.join(' • ') : 'Ăn gia đình & Đặc sản'}
              </Text>
            </View>
          </View>

          {/* Pricing Highlight Card */}
          <View style={styles.priceHighlightCard}>
            <View style={styles.priceHighlightRight}>
              <Text style={styles.priceHeaderLabel}>GIÁ THAM KHẢO</Text>
              <Text style={styles.priceHighlightText}>
                {dishData.price}
              </Text>
              <View style={styles.taxIncludedBadge}>
                <Text style={styles.taxIncludedText}>Đã cập nhật bảng giá mới nhất</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Gallery Image & Thumbnails */}
        <View style={styles.galleryWrapper}>
          <Image
            source={{ uri: dishData.gallery[selectedImageIndex] || dishData.image }}
            style={styles.heroImage}
            contentFit="cover"
          />

          <View style={styles.thumbnailRow}>
            {dishData.gallery.slice(0, 3).map((img, idx) => (
              <Pressable
                key={idx}
                onPress={() => setSelectedImageIndex(idx)}
                style={[
                  styles.thumbnailBox,
                  selectedImageIndex === idx && styles.thumbnailBoxActive,
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImg} contentFit="cover" />
              </Pressable>
            ))}

            <Pressable
              style={styles.viewAllPhotosBtn}
              onPress={() => setIsGalleryModalOpen(true)}
            >
              <Ionicons name="images-outline" size={15} color="#0f172a" />
              <Text style={styles.viewAllPhotosText}>
                Xem tất cả {dishData.gallery.length} ảnh
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Facts Card */}
        <View style={styles.quickFactsCard}>
          <View style={styles.quickFactsHeader}>
            <View style={styles.clockIconBg}>
              <Ionicons name="restaurant" size={16} color="#fff" />
            </View>
            <Text style={styles.quickFactsTitle}>THÔNG TIN QUÁN ĂN</Text>
          </View>

          <View style={styles.factsContainer}>
            <View style={styles.factRow}>
              <View style={styles.factIconBox}>
                <Ionicons name="storefront-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>TÊN QUÁN</Text>
                <Text style={styles.factValue}>{dishData.restaurantName}</Text>
              </View>
            </View>

            <View style={styles.factRow}>
              <View style={styles.factIconBox}>
                <Ionicons name="time-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>GIỜ MỞ CỬA</Text>
                <Text style={styles.factValue}>{dishData.openHours}</Text>
              </View>
            </View>

            <View style={styles.factRow}>
              <View style={styles.factIconBox}>
                <Ionicons name="location-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>ĐỊA CHỈ</Text>
                <Text style={styles.factValue} numberOfLines={2}>{dishData.address}</Text>
              </View>
            </View>

            <View style={[styles.factRow, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
              <View style={styles.factIconBox}>
                <Ionicons name="call-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>HOTLINE ĐẶT BÀN</Text>
                <Text style={styles.factValue}>{dishData.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Gợi ý Section */}
        <View style={styles.cardBox}>
          <Text style={styles.sectionHeaderTitle}>Menu gợi ý & Bảng giá</Text>
          <View style={{ gap: 8, marginTop: 10 }}>
            {dishData.recommendedMenu.map((item, idx) => (
              <View key={idx} style={styles.menuItemRow}>
                <View style={styles.menuDot} />
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuPrice}>{item.price}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Giới thiệu & Hương vị Section */}
        <View style={styles.cardBox}>
          <Text style={styles.sectionHeaderTitle}>Đặc trưng hương vị</Text>
          <Text style={styles.paragraphText}>{dishData.longDesc || dishData.desc}</Text>

          <View style={{ gap: 8, marginTop: 12 }}>
            {dishData.flavorHighlights.map((hl, idx) => (
              <View key={idx} style={styles.highlightItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" style={{ marginTop: 2 }} />
                <Text style={styles.highlightText}>{hl}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mẹo ăn uống & Lưu ý */}
        <View style={styles.cardBox}>
          <Text style={styles.sectionHeaderTitle}>Mẹo thưởng thức ngon nhất</Text>
          <View style={{ gap: 8, marginTop: 10 }}>
            {dishData.diningTips.map((tip, idx) => (
              <View key={idx} style={styles.tipItem}>
                <Ionicons name="bulb-outline" size={16} color="#ea580c" style={{ marginTop: 2 }} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vị trí bản đồ Button */}
        <View style={[styles.cardBox, { marginBottom: 20 }]}>
          <Text style={styles.sectionHeaderTitle}>Vị trí quán trên bản đồ</Text>
          <Text style={styles.addressText}>{dishData.address}</Text>
          <Pressable style={styles.openMapBtn} onPress={handleOpenGoogleMaps}>
            <Ionicons name="navigate" size={16} color="#ffffff" />
            <Text style={styles.openMapBtnText}>Xem chỉ đường trên Google Maps</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Pressable style={styles.callBtn} onPress={handleCallPhone}>
          <Ionicons name="call" size={18} color="#065f46" />
          <Text style={styles.callBtnText}>Gọi đặt bàn</Text>
        </Pressable>

        <Pressable style={styles.directBtn} onPress={handleOpenGoogleMaps}>
          <Ionicons name="navigate" size={18} color="#ffffff" />
          <Text style={styles.directBtnText}>Chỉ đường đến quán</Text>
        </Pressable>
      </View>

      {/* Fullscreen Gallery Modal */}
      <Modal visible={isGalleryModalOpen} transparent={true} animationType="fade">
        <View style={styles.galleryModalOverlay}>
          <View style={[styles.galleryModalHeader, { top: insets.top + 10 }]}>
            <Text style={styles.galleryModalTitle}>{dishData.name}</Text>
            <Pressable onPress={() => setIsGalleryModalOpen(false)} hitSlop={10}>
              <Ionicons name="close-circle" size={30} color="#ffffff" />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {dishData.gallery.map((img, idx) => (
              <View key={idx} style={{ width, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={{ uri: img }} style={styles.modalImage} contentFit="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf9',
  },
  scrollContent: {
    paddingBottom: 100,
  },

  /* Top Navigation Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBarBackText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  /* Title & Badges Section */
  titleSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  mainTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#064e3b',
    lineHeight: 28,
    marginBottom: 12,
  },
  tagBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  starIcon: {
    color: '#d97706',
    fontSize: 11,
    marginRight: 4,
  },
  starBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400e',
  },
  calendarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 4,
  },
  calendarBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  groupBadgeRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  purpleGroupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    gap: 4,
  },
  purpleGroupBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6d28d9',
  },

  /* Pricing Highlight Card */
  priceHighlightCard: {
    backgroundColor: '#fff7ed',
    borderWidth: 1.5,
    borderColor: '#ea580c',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  priceHighlightRight: {
    width: '100%',
  },
  priceHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  priceHighlightText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#ea580c',
  },
  taxIncludedBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  taxIncludedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },

  /* Gallery Section */
  galleryWrapper: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  heroImage: {
    width: '100%',
    height: 210,
    borderRadius: 14,
  },
  thumbnailRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  thumbnailBox: {
    flex: 1,
    height: 62,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  thumbnailBoxActive: {
    borderColor: '#168b58',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  viewAllPhotosBtn: {
    flex: 1.2,
    height: 62,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  viewAllPhotosText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* Quick Facts Card */
  quickFactsCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  quickFactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  clockIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#168b58',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFactsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  factsContainer: {
    gap: 12,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
    gap: 12,
  },
  factIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  factContent: {
    flex: 1,
  },
  factLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  factValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },

  /* Card Box */
  cardBox: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  paragraphText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 20,
    marginTop: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ea580c',
    marginRight: 8,
  },
  menuName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  menuPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ea580c',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  highlightText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 18,
  },
  addressText: {
    fontSize: 12.5,
    color: '#475569',
    marginTop: 8,
    lineHeight: 18,
  },
  openMapBtn: {
    backgroundColor: '#00897b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
  },
  openMapBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  /* Sticky Bottom Action Bar */
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  callBtn: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  callBtnText: {
    color: '#065f46',
    fontSize: 13,
    fontWeight: '800',
  },
  directBtn: {
    flex: 1.3,
    backgroundColor: '#ff5722',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  directBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },

  /* Gallery Modal */
  galleryModalOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  galleryModalHeader: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  galleryModalTitle: { color: '#ffffff', fontSize: 14, fontWeight: '700', flex: 1, marginRight: 10 },
  modalImage: { width: width - 20, height: 350, borderRadius: 12 },
});
