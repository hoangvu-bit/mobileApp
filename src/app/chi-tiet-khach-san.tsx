import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

interface RoomType {
  id: string;
  name: string;
  size: string;
  maxGuests: string;
  bed: string;
  price: string;
  priceNum: number;
  oldPrice?: string;
  images: string[];
  amenities: string[];
  policies: string[];
}

export default function ChiTietKhachSanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    hotelData?: string;
  }>();

  // Parse passed hotel data or find from fallback
  let hotel: any = null;
  if (params.hotelData) {
    try {
      hotel = JSON.parse(params.hotelData);
    } catch (e) {
      hotel = null;
    }
  }

  if (!hotel) {
    hotel = DEFAULT_HOTEL;
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState<{ [roomId: string]: number }>({});
  const [roomImageIndexes, setRoomImageIndexes] = useState<{ [roomId: string]: number }>({});
  const [isSaved, setIsSaved] = useState(false);

  const images: string[] = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : [hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'];
  const rooms: RoomType[] = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms : DEFAULT_ROOMS;

  const handlePrevMainImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextMainImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevRoomImage = (roomId: string, total: number) => {
    setRoomImageIndexes((prev) => {
      const current = prev[roomId] || 0;
      return { ...prev, [roomId]: current === 0 ? total - 1 : current - 1 };
    });
  };

  const handleNextRoomImage = (roomId: string, total: number) => {
    setRoomImageIndexes((prev) => {
      const current = prev[roomId] || 0;
      return { ...prev, [roomId]: current === total - 1 ? 0 : current + 1 };
    });
  };

  const handleSelectRoomCount = (roomId: string) => {
    Alert.alert(
      'Chọn số lượng phòng',
      'Vui lòng chọn số lượng phòng bạn muốn đặt:',
      [
        { text: '1 phòng', onPress: () => setSelectedRooms((prev) => ({ ...prev, [roomId]: 1 })) },
        { text: '2 phòng', onPress: () => setSelectedRooms((prev) => ({ ...prev, [roomId]: 2 })) },
        { text: '3 phòng', onPress: () => setSelectedRooms((prev) => ({ ...prev, [roomId]: 3 })) },
        { text: 'Bỏ chọn', onPress: () => setSelectedRooms((prev) => ({ ...prev, [roomId]: 0 })), style: 'destructive' },
        { text: 'Đóng', style: 'cancel' },
      ]
    );
  };

  const handleBookRoom = (room: RoomType) => {
    const count = selectedRooms[room.id] || 1;
    const total = room.priceNum * count;
    Alert.alert(
      'Xác nhận đặt phòng',
      `Bạn đang đặt:\n• Khách sạn: ${hotel.name}\n• Hạng phòng: ${room.name}\n• Số lượng: ${count} phòng\n• Tổng tiền: ${total.toLocaleString('vi-VN')} đ/đêm\n\nBạn có muốn tiếp tục sang bước điền thông tin khách hàng?`,
      [
        { text: 'Xem lại', style: 'cancel' },
        {
          text: 'Tiếp tục',
          onPress: () => {
            Alert.alert(
              'Thành công',
              `Yêu cầu đặt phòng "${room.name}" tại "${hotel.name}" đã được ghi nhận. Lễ tân khách sạn sẽ liên hệ xác nhận trong ít phút!`
            );
          },
        },
      ]
    );
  };

  const handleOpenGoogleMaps = () => {
    const address = encodeURIComponent(`${hotel.name}, ${hotel.location}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Bản đồ Google Maps', `Địa chỉ: ${hotel.location}`);
    });
  };

  const handleCallHotel = () => {
    const phone = hotel.phone || '0276 388 9999';
    Alert.alert('Liên hệ khách sạn', `Hotline lễ tân: ${phone}`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Gọi ngay', onPress: () => Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`) },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBarBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {hotel.name}
        </Text>
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
        {/* Main Google Maps Image Carousel */}
        <View style={styles.galleryContainer}>
          <Image
            source={{ uri: images[activeImageIndex] }}
            style={styles.galleryImage}
            contentFit="cover"
          />

          {/* Left / Right Arrow Navigation */}
          {images.length > 1 && (
            <>
              <Pressable style={[styles.arrowBtn, styles.arrowLeft]} onPress={handlePrevMainImage}>
                <Ionicons name="chevron-back" size={16} color="#fff" />
              </Pressable>
              <Pressable style={[styles.arrowBtn, styles.arrowRight]} onPress={handleNextMainImage}>
                <Ionicons name="chevron-forward" size={16} color="#fff" />
              </Pressable>
            </>
          )}

          {/* Image Counter Badge */}
          <View style={styles.imageCounterBadge}>
            <Ionicons name="camera" size={13} color="#fff" />
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1}/{images.length} ảnh trên Google Maps
            </Text>
          </View>
        </View>

        {/* Hotel Main Information */}
        <View style={styles.infoCard}>
          <View style={styles.ratingBadgeRow}>
            <View style={styles.gmapsRatingBadge}>
              <Text style={styles.starText}>★</Text>
              <Text style={styles.gmapsRatingScore}>{hotel.rating || '4.8'}</Text>
              <Text style={styles.gmapsRatingMax}>/5.0</Text>
            </View>
            <Text style={styles.gmapsReviewCount}>
              ({hotel.reviewsCount ? `${hotel.reviewsCount} đánh giá trên Google Maps` : '280+ đánh giá thực tế'})
            </Text>
          </View>

          <Text style={styles.hotelTitle}>{hotel.name}</Text>

          {/* Address & Google Maps Location */}
          <Pressable style={styles.addressRow} onPress={handleOpenGoogleMaps}>
            <Ionicons name="location-sharp" size={15} color="#168b58" />
            <Text style={styles.addressText} numberOfLines={2}>
              {hotel.location}
            </Text>
            <Ionicons name="open-outline" size={15} color="#168b58" />
          </Pressable>

          {/* Hotel Highlights Badges */}
          <View style={styles.hotelBadgesRow}>
            <View style={styles.highlightBadge}>
              <Ionicons name="shield-checkmark" size={13} color="#168b58" />
              <Text style={styles.highlightBadgeText}>Xác thực Google Maps</Text>
            </View>
            <View style={styles.highlightBadge}>
              <Ionicons name="sparkles" size={13} color="#168b58" />
              <Text style={styles.highlightBadgeText}>Vệ sinh đạt chuẩn</Text>
            </View>
            {hotel.discount && (
              <View style={[styles.highlightBadge, { backgroundColor: '#fff0f3' }]}>
                <Text style={[styles.highlightBadgeText, { color: '#c2234d' }]}>
                  Ưu đãi {hotel.discount}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Amenities Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tiện nghi chỗ nghỉ</Text>
          <Text style={styles.sectionSubtitle}>Dịch vụ & tiện ích thực tế được xác nhận tại khách sạn</Text>

          <View style={styles.amenitiesGrid}>
            {(hotel.amenities && hotel.amenities.length > 0 ? hotel.amenities : DEFAULT_AMENITIES).map(
              (item: string, idx: number) => (
                <View key={idx} style={styles.amenityItem}>
                  <View style={styles.amenityIconBox}>
                    <Ionicons name="checkmark-circle" size={16} color="#168b58" />
                  </View>
                  <Text style={styles.amenityItemText}>{item}</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* About Hotel Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Giới thiệu khách sạn</Text>
          <Text style={styles.descText}>
            {hotel.description ||
              `${hotel.name} tọa lạc tại ${hotel.location}. Với không gian nghỉ dưỡng sang trọng, phòng ốc tiện nghi đạt tiêu chuẩn cao cấp cùng đội ngũ nhân viên nhiệt tình, chu đáo. Nơi đây là điểm dừng chân lý tưởng cho cả chuyến công tác lẫn du lịch nghỉ dưỡng cùng gia đình và bạn bè.`}
          </Text>

          <View style={styles.policyRow}>
            <View style={styles.policyItem}>
              <Text style={styles.policyLabel}>Nhận phòng</Text>
              <Text style={styles.policyValue}>Từ 14:00</Text>
            </View>
            <View style={styles.policyDivider} />
            <View style={styles.policyItem}>
              <Text style={styles.policyLabel}>Trả phòng</Text>
              <Text style={styles.policyValue}>Trước 12:00</Text>
            </View>
            <View style={styles.policyDivider} />
            <View style={styles.policyItem}>
              <Text style={styles.policyLabel}>Lễ tân</Text>
              <Text style={styles.policyValue}>Phục vụ 24/7</Text>
            </View>
          </View>
        </View>

        {/* ROOMS & PRICING TABLE SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.roomsHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Bảng giá & Các loại phòng</Text>
              <Text style={styles.sectionSubtitle}>Chọn phòng phù hợp với nhu cầu lưu trú của bạn</Text>
            </View>
          </View>

          <View style={styles.roomsList}>
            {rooms.map((room) => {
              const currentImgIdx = roomImageIndexes[room.id] || 0;
              const count = selectedRooms[room.id] || 1;
              const roomImages = room.images && room.images.length > 0 ? room.images : [hotel.image];

              return (
                <View key={room.id} style={styles.roomCard}>
                  {/* Top Room Header: Image + Room Specifications */}
                  <View style={styles.roomTopSection}>
                    <View style={styles.roomImageWrapper}>
                      <Image
                        source={{ uri: roomImages[currentImgIdx] }}
                        style={styles.roomImage}
                        contentFit="cover"
                      />
                      {roomImages.length > 1 && (
                        <>
                          <Pressable
                            style={[styles.roomArrowBtn, styles.roomArrowLeft]}
                            onPress={() => handlePrevRoomImage(room.id, roomImages.length)}
                          >
                            <Ionicons name="chevron-back" size={13} color="#fff" />
                          </Pressable>
                          <Pressable
                            style={[styles.roomArrowBtn, styles.roomArrowRight]}
                            onPress={() => handleNextRoomImage(room.id, roomImages.length)}
                          >
                            <Ionicons name="chevron-forward" size={13} color="#fff" />
                          </Pressable>
                        </>
                      )}
                      <View style={styles.roomImageBadge}>
                        <Text style={styles.roomImageBadgeText}>
                          {currentImgIdx + 1}/{roomImages.length}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.roomDetailsCol}>
                      <Text style={styles.roomTitle}>{room.name}</Text>
                      <Text style={styles.roomSpecText}>{room.size}</Text>
                      <Text style={styles.roomSpecText}>{room.maxGuests}</Text>
                      <Text style={styles.roomSpecText}>{room.bed}</Text>
                      <Pressable
                        onPress={() =>
                          Alert.alert(
                            `Chi tiết: ${room.name}`,
                            `• Diện tích: ${room.size}\n• Sức chứa: ${room.maxGuests}\n• Giường: ${room.bed}\n• Tiện ích: ${room.amenities.join(', ')}`
                          )
                        }
                      >
                        <Text style={styles.roomDetailLink}>Xem ảnh và chi tiết</Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* Green Standard Price Header Banner */}
                  <View style={styles.greenBannerHeader}>
                    <Text style={styles.greenBannerTitle}>Giá tiêu chuẩn</Text>
                  </View>

                  {/* Included Policies & Inclusions */}
                  <View style={styles.greenBannerBody}>
                    <View style={styles.policyLine}>
                      <Ionicons name="people" size={15} color="#1e514d" />
                      <Text style={styles.policyLineText}>{room.maxGuests} / phòng</Text>
                    </View>
                    <View style={styles.policyLine}>
                      <Ionicons name="shield-checkmark" size={15} color="#1e514d" />
                      <Text style={styles.policyLineText}>Linh hoạt trước 72 giờ</Text>
                    </View>
                    <View style={styles.policyLine}>
                      <Ionicons name="checkmark" size={14} color="#1e514d" />
                      <Text style={styles.policyLineText}>Đặt trực tuyến xác nhận tức thì</Text>
                    </View>
                    <View style={styles.policyLine}>
                      <Ionicons name="time" size={14} color="#1e514d" />
                      <Text style={styles.policyLineText}>Tối thiểu 1 đêm</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        Alert.alert(
                          'Chính sách phòng tiêu chuẩn',
                          '• Miễn phí hủy phòng trước 72h trước ngày nhận phòng.\n• Nhận phòng từ 14:00, trả phòng trước 12:00.\n• Bữa sáng buffet được phục vụ từ 06:30 - 09:30 hàng ngày.'
                        )
                      }
                    >
                      <Text style={styles.viewPolicyLink}>Xem chi tiết</Text>
                    </Pressable>
                  </View>

                  {/* Bottom Pricing & Action Section */}
                  <View style={styles.roomFooterSection}>
                    <View style={styles.priceLeftCol}>
                      <Text style={styles.priceMainText}>{room.price}</Text>
                      <Text style={styles.priceUnitText}>Mỗi phòng / đêm</Text>
                      <View style={styles.calcSummaryBox}>
                        <Text style={styles.calcSummaryText}>
                          {count} phòng × 1 đêm
                        </Text>
                        <Text style={styles.calcTotalText}>
                          {(room.priceNum * count).toLocaleString('vi-VN')}đ
                        </Text>
                      </View>
                      <Text style={styles.priceTaxNote}>
                        Giá tham khảo, thuế và phí xác nhận ở bước tiếp theo
                      </Text>
                    </View>

                    <View style={styles.actionRightCol}>
                      <Text style={styles.qtyLabel}>Số phòng</Text>
                      <Pressable
                        style={styles.qtyDropdown}
                        onPress={() => handleSelectRoomCount(room.id)}
                      >
                        <Text style={styles.qtyDropdownText}>{count} phòng</Text>
                        <Ionicons name="chevron-down" size={12} color="#168b58" />
                      </Pressable>

                      <Pressable
                        style={styles.bookNowBtn}
                        onPress={() => handleBookRoom(room)}
                      >
                        <Text style={styles.bookNowBtnText}>Đặt ngay</Text>
                        <Ionicons name="arrow-forward" size={14} color="#fff" />
                      </Pressable>
                      <Text style={styles.subActionNote}>Chuyển đến thông tin đặt phòng</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const DEFAULT_AMENITIES = [
  'Wi-Fi miễn phí toàn bộ khu vực',
  'Hồ bơi ngoài trời',
  'Điều hòa không khí',
  'Bữa sáng chuẩn bị theo yêu cầu',
  'Dọn phòng hàng ngày',
  'Chỗ đỗ xe ô tô & xe máy',
  'Lễ tân phục vụ 24/7',
  'Truyền hình cáp màn hình phẳng',
];

const DEFAULT_HOTEL = {
  name: 'Mekong Tani Hotel - Chuẩn 4 Sao Trung Tâm',
  location: 'TP. Tây Ninh, Tây Ninh',
  rating: '4.8',
  reviewsCount: 240,
  phone: '0276 388 9999',
  image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80',
  ],
  description:
    'Khách sạn tọa lạc ngay trung tâm thành phố, thuận tiện di chuyển đến các điểm du lịch nổi tiếng như Núi Bà Đen, Toà Thánh Tây Ninh. Phòng nghỉ được thiết kế hiện đại, đầy đủ tiện nghi với tầm nhìn tuyệt đẹp ngắm toàn cảnh thành phố.',
  amenities: DEFAULT_AMENITIES,
};

const DEFAULT_ROOMS: RoomType[] = [
  {
    id: 'room-1',
    name: 'Business Queen Room',
    size: '26 m²',
    maxGuests: 'Tối đa 2 người lớn',
    bed: '1 giường Queen',
    price: '890.000đ',
    priceNum: 890000,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Wi-Fi miễn phí', 'Điều hòa', 'TV thông minh', 'Tủ lạnh mini', 'Két an toàn'],
    policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
  },
  {
    id: 'room-2',
    name: 'Deluxe King City View',
    size: '35 m²',
    maxGuests: 'Tối đa 2 người lớn, 1 trẻ em',
    bed: '1 giường King Size lớn',
    price: '1.150.000đ',
    priceNum: 1150000,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['View thành phố', 'Bồn tắm nằm', 'Ban công thoáng mát', 'Bữa sáng miễn phí'],
    policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
  },
  {
    id: 'room-3',
    name: 'Executive Suite Panorama',
    size: '52 m²',
    maxGuests: 'Tối đa 4 người (Gia đình)',
    bed: '2 giường đôi lớn (hoặc 1 King + 2 đơn)',
    price: '1.750.000đ',
    priceNum: 1750000,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Phòng khách riêng', 'Bồn sục Jacuzzi', 'Quầy bar mini', 'Trà & Cà phê cao cấp'],
    policies: ['4 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faf9' },
  scrollContent: { paddingBottom: 100 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topBarBtn: {
    padding: 6,
  },
  topBarTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginHorizontal: 8,
    textAlign: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  galleryContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: '#000',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: { left: 12 },
  arrowRight: { right: 12 },
  imageCounterBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  imageCounterText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  ratingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  gmapsRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#168b58',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  starText: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold' },
  gmapsRatingScore: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  gmapsRatingMax: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
  gmapsReviewCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  hotelTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 26,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: '#168b58',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  hotelBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf8f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  highlightBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#168b58',
  },

  sectionCard: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
    marginBottom: 14,
  },

  amenitiesGrid: {
    gap: 10,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityIconBox: {
    width: 20,
    alignItems: 'center',
  },
  amenityItemText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },

  descText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 14,
  },
  policyRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  policyItem: {
    flex: 1,
    alignItems: 'center',
  },
  policyLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  policyValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  policyDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#cbd5e1',
  },

  roomsHeaderRow: {
    marginBottom: 8,
  },
  roomsList: {
    gap: 16,
  },

  /* ROOM CARD EXACTLY MATCHING USER SCREENSHOT */
  roomCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1e3d9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  roomTopSection: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
  },
  roomImageWrapper: {
    width: 110,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
  roomArrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomArrowLeft: { left: 4 },
  roomArrowRight: { right: 4 },
  roomImageBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roomImageBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },

  roomDetailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f4c3a',
    marginBottom: 4,
  },
  roomSpecText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 2,
  },
  roomDetailLink: {
    fontSize: 12,
    color: '#168b58',
    fontWeight: '700',
    marginTop: 4,
  },

  greenBannerHeader: {
    backgroundColor: '#168b58',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  greenBannerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  greenBannerBody: {
    backgroundColor: '#f6fbf8',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  policyLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  policyLineText: {
    fontSize: 13,
    color: '#1e514d',
    fontWeight: '600',
  },
  viewPolicyLink: {
    fontSize: 12,
    color: '#168b58',
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginTop: 4,
  },

  roomFooterSection: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#ffffff',
  },
  priceLeftCol: {
    flex: 1,
    paddingRight: 10,
  },
  priceMainText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#d94814',
  },
  priceUnitText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
    marginBottom: 6,
  },
  calcSummaryBox: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 6,
    marginBottom: 4,
  },
  calcSummaryText: {
    fontSize: 11,
    color: '#64748b',
  },
  calcTotalText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 1,
  },
  priceTaxNote: {
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 13,
    marginTop: 4,
  },

  actionRightCol: {
    width: 140,
    justifyContent: 'flex-start',
  },
  qtyLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 3,
  },
  qtyDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#168b58',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  qtyDropdownText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#168b58',
  },
  bookNowBtn: {
    backgroundColor: '#168b58',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  bookNowBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  subActionNote: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },

  floatingChatBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#168b58',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
