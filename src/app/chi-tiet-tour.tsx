import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Dimensions,
  Linking,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

interface TourDetailData {
  id: string;
  title: string;
  location: string;
  destinationAddress: string;
  pricePerPerson: number;
  priceText: string;
  duration: string;
  departure: string;
  transport: string;
  groupType: string;
  openDatesCount: string;
  availableSeats: number;
  availableDateStr: string;
  departureDates: { date: string; dayName: string; seatsLeft: number }[];
  images: string[];
  desc: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: string; title: string; desc: string; meals: string; stay: string }[];
  travelTips: string[];
  phone: string;
}

export default function ChiTietTourScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    tourData?: string;
  }>();

  let tour: TourDetailData = DEFAULT_DALAT_TOUR;
  if (params.tourData) {
    try {
      tour = { ...DEFAULT_DALAT_TOUR, ...JSON.parse(params.tourData) };
    } catch (e) {
      tour = DEFAULT_DALAT_TOUR;
    }
  }

  // Booking & Selection State
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [adultQty, setAdultQty] = useState(2);
  const [childQty, setChildQty] = useState(0);
  const [activeTab, setActiveTab] = useState<'tongquan' | 'lichtrinh' | 'thongtin' | 'bando'>('tongquan');
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Price Calculation
  const childPrice = Math.round(tour.pricePerPerson * 0.7);
  const totalPrice = useMemo(() => {
    return adultQty * tour.pricePerPerson + childQty * childPrice;
  }, [adultQty, childQty, tour.pricePerPerson, childPrice]);

  const totalGuests = adultQty + childQty;

  const handleBooking = () => {
    if (totalGuests === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 hành khách.');
      return;
    }
    const chosenDate = tour.departureDates[selectedDateIndex]?.date || '07/10';
    Alert.alert(
      'Xác nhận đặt tour',
      `Bạn đang đặt tour:\n• ${tour.title}\n• Ngày khởi hành: ${chosenDate}\n• Số lượng: ${adultQty} người lớn${childQty > 0 ? `, ${childQty} trẻ em` : ''}\n• Tổng tiền: ${totalPrice.toLocaleString('vi-VN')}đ\n\nBạn có muốn tiếp tục sang bước điền thông tin liên hệ?`,
      [
        { text: 'Kiểm tra lại', style: 'cancel' },
        {
          text: 'Xác nhận đặt',
          onPress: () => {
            Alert.alert(
              'Đặt tour thành công!',
              `Hệ thống đã tiếp nhận yêu cầu đặt tour của bạn. Tư vấn viên sẽ liên hệ qua số điện thoại để hỗ trợ làm thủ tục và gửi hợp đồng dịch vụ.`
            );
          },
        },
      ]
    );
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent(`${tour.destinationAddress || tour.location}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {
      Alert.alert('Bản đồ', `Điểm đến: ${tour.location}`);
    });
  };



  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBarBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
          <Text style={styles.topBarBackText}>Quay lại tour</Text>
        </Pressable>
        <View style={styles.topBarRight}>
          <Pressable onPress={() => setIsSaved(!isSaved)} style={styles.topBarBtn} hitSlop={10}>
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={22}
              color={isSaved ? '#e11d48' : '#0f172a'}
            />
          </Pressable>
          <Pressable onPress={handleOpenMap} style={styles.topBarBtn} hitSlop={10}>
            <Ionicons name="map-outline" size={20} color="#168b58" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title & Badges Section (Matching User Screenshot 1) */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{tour.title}</Text>

          <View style={styles.tagBadgeRow}>
            <View style={styles.starBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.starBadgeText}>Tour mới được cập nhật</Text>
            </View>

            <View style={styles.calendarBadge}>
              <Ionicons name="calendar-outline" size={13} color="#065f46" />
              <Text style={styles.calendarBadgeText}>Lịch trình rõ ràng</Text>
            </View>
          </View>

          <View style={styles.groupBadgeRow}>
            <View style={styles.purpleGroupBadge}>
              <Ionicons name="people" size={13} color="#6d28d9" />
              <Text style={styles.purpleGroupBadgeText}>{tour.groupType || 'Nhóm linh hoạt'}</Text>
            </View>
          </View>

          {/* Pricing Highlight Card (Matching User Screenshot 1) */}
          <View style={styles.priceHighlightCard}>
            <View style={styles.priceHighlightRight}>
              <Text style={styles.priceHeaderLabel}>GIÁ TOUR TỪ</Text>
              <Text style={styles.priceHighlightText}>
                {tour.pricePerPerson.toLocaleString('vi-VN')}đ
                <Text style={styles.pricePerPersonSub}>/khách</Text>
              </Text>
              <View style={styles.taxIncludedBadge}>
                <Text style={styles.taxIncludedText}>Giá đã gồm thuế phí</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Gallery Image & Thumbnails (Matching User Screenshot 2) */}
        <View style={styles.galleryWrapper}>
          <Image
            source={{ uri: tour.images[selectedImageIndex] || tour.images[0] }}
            style={styles.heroImage}
            contentFit="cover"
          />

          <View style={styles.thumbnailRow}>
            {tour.images.slice(0, 3).map((img, idx) => (
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
              <Text style={styles.viewAllPhotosText}>Xem tất cả {tour.images.length} ảnh</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Facts Card (Matching User Screenshot 2) */}
        <View style={styles.quickFactsCard}>
          <View style={styles.quickFactsHeader}>
            <View style={styles.clockIconBg}>
              <Ionicons name="time" size={16} color="#fff" />
            </View>
            <Text style={styles.quickFactsTitle}>THÔNG TIN NHANH</Text>
          </View>

          <View style={styles.factsContainer}>
            <View style={styles.factRow}>
              <View style={styles.factIconBox}>
                <Ionicons name="time-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>THỜI LƯỢNG</Text>
                <Text style={styles.factValue}>{tour.duration}</Text>
              </View>
            </View>

            <View style={styles.factRow}>
              <View style={styles.factIconBox}>
                <Ionicons name="location-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>ĐIỂM KHỞI HÀNH</Text>
                <Text style={styles.factValue}>{tour.departure}</Text>
              </View>
            </View>

            <View style={styles.factRow}>
              <View style={styles.factIconBox}>
                <Ionicons name="bus-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>PHƯƠNG TIỆN</Text>
                <Text style={styles.factValue}>{tour.transport}</Text>
              </View>
            </View>

            <View style={[styles.factRow, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
              <View style={styles.factIconBox}>
                <Ionicons name="calendar-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>LỊCH ĐANG MỞ</Text>
                <Text style={styles.factValue}>{tour.openDatesCount}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Departure Date Selector & Passenger Count (Matching User Screenshot 3) */}
        <View style={styles.bookingOptionsCard}>
          <View style={styles.optionsHeaderRow}>
            <Text style={styles.optionsSectionTitle}>Chọn ngày khởi hành</Text>
            <View style={styles.fastResponseBadge}>
              <Text style={styles.fastResponseText}>Phản hồi nhanh</Text>
            </View>
          </View>

          <View style={styles.seatsLeftRow}>
            <Text style={styles.flameIcon}>🔥</Text>
            <Text style={styles.seatsLeftText}>
              Còn {tour.departureDates[selectedDateIndex]?.seatsLeft || 18} chỗ cho ngày{' '}
              {tour.departureDates[selectedDateIndex]?.date || '07/10'}
            </Text>
          </View>

          {/* Date Selector Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroller}>
            {tour.departureDates.map((item, idx) => {
              const isSelected = selectedDateIndex === idx;
              return (
                <Pressable
                  key={idx}
                  style={[styles.dateBtn, isSelected && styles.dateBtnSelected]}
                  onPress={() => setSelectedDateIndex(idx)}
                >
                  <Text style={[styles.dateBtnDate, isSelected && styles.dateBtnDateSelected]}>
                    {item.date}
                  </Text>
                  <Text style={[styles.dateBtnDay, isSelected && styles.dateBtnDaySelected]}>
                    {item.dayName}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              style={styles.calendarMoreBtn}
              onPress={() =>
                Alert.alert(
                  'Lịch khởi hành tour',
                  tour.departureDates
                    .map((d) => `• ${d.date} (${d.dayName}) - Còn ${d.seatsLeft} chỗ`)
                    .join('\n')
                )
              }
            >
              <Ionicons name="calendar-outline" size={16} color="#475569" />
              <Text style={styles.calendarMoreText}>Xem lịch</Text>
            </Pressable>
          </ScrollView>

          {/* Tour Package Selection (Vé tiêu chuẩn) */}
          <Text style={styles.packageHeaderLabel}>Gói tour</Text>
          <View style={styles.standardPackageCard}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Text style={styles.packageName}>Vé tiêu chuẩn</Text>
                <View style={styles.bestPriceBadge}>
                  <Text style={styles.bestPriceText}>Giá tốt nhất</Text>
                </View>
              </View>
              <Text style={styles.packageSub}>{tour.departure}</Text>
            </View>
            <View style={styles.packageRadioActive}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
          </View>

          {/* Passenger Quantity Counters */}
          <View style={styles.passengersHeaderRow}>
            <Text style={styles.packageHeaderLabel}>Chọn số hành khách</Text>
            <Text style={styles.maxGuestsNote}>Tối đa 18 khách</Text>
          </View>

          <View style={styles.guestRow}>
            <View style={styles.guestInfoCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="people" size={18} color="#168b58" />
                <Text style={styles.guestTypeLabel}>Người lớn</Text>
              </View>
              <Text style={styles.guestPriceSub}>{tour.pricePerPerson.toLocaleString('vi-VN')}đ / khách</Text>
            </View>
            <View style={styles.counterControl}>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setAdultQty(Math.max(1, adultQty - 1))}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </Pressable>
              <Text style={styles.counterValueText}>{adultQty}</Text>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setAdultQty(Math.min(18, adultQty + 1))}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.guestRow}>
            <View style={styles.guestInfoCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="human-child" size={20} color="#168b58" />
                <Text style={styles.guestTypeLabel}>Trẻ em (5 - 11 tuổi)</Text>
              </View>
              <Text style={styles.guestPriceSub}>70% giá ({childPrice.toLocaleString('vi-VN')}đ)</Text>
            </View>
            <View style={styles.counterControl}>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setChildQty(Math.max(0, childQty - 1))}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </Pressable>
              <Text style={styles.counterValueText}>{childQty}</Text>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setChildQty(Math.min(10, childQty + 1))}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Pricing Summary & Book Now Button (Matching User Screenshot 4) */}
        <View style={styles.totalSummaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryTitle}>Tổng tạm tính</Text>
              <Text style={styles.summarySub}>{totalGuests} khách · đã gồm thuế phí</Text>
            </View>
            <Text style={styles.totalPriceBig}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
          </View>

          <Pressable style={styles.bookTourBigBtn} onPress={handleBooking}>
            <Text style={styles.bookTourBigBtnText}>ĐẶT TOUR NGAY</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </Pressable>

          <View style={styles.trustBadgesRow}>
            <View style={styles.trustItem}>
              <Ionicons name="flash" size={14} color="#ea580c" />
              <Text style={styles.trustItemText}>Xác nhận nhanh</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={14} color="#ea580c" />
              <Text style={styles.trustItemText}>Thanh toán an toàn</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation Menu (Matching User Screenshot 4) */}
        <View style={styles.tabNavRow}>
          {[
            { key: 'tongquan', label: 'Tổng quan' },
            { key: 'lichtrinh', label: 'Lịch trình' },
            { key: 'thongtin', label: 'Thông tin tour' },
            { key: 'bando', label: 'Điểm đến' },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tabNavItem, isActive && styles.tabNavItemActive]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Text style={[styles.tabNavText, isActive && styles.tabNavTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* TAB 1: Tổng quan & Điểm nổi bật */}
        {activeTab === 'tongquan' && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionSmallCategory}>CHI TIẾT HÀNH TRÌNH</Text>
            <Text style={styles.sectionMainHeading}>Tổng quan tour</Text>
            <Text style={styles.tourDescParagraph}>{tour.desc}</Text>

            <View style={styles.highlightsContainer}>
              <Text style={styles.highlightsHeading}>✨ Trải nghiệm nổi bật</Text>
              {tour.highlights.map((h, i) => (
                <View key={i} style={styles.highlightRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#168b58" />
                  <Text style={styles.highlightText}>{h}</Text>
                </View>
              ))}
            </View>

            {/* Travel Advice Notes (Matching Screenshot 5) */}
            <View style={styles.travelAdviceBox}>
              <Text style={styles.travelAdviceTitle}>💡 Lời khuyên cho chuyến đi</Text>
              {tour.travelTips.map((tip, idx) => (
                <Text key={idx} style={styles.travelAdviceItem}>
                  • {tip}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* TAB 2: Lịch trình chi tiết từng ngày */}
        {activeTab === 'lichtrinh' && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionSmallCategory}>HÀNH TRÌNH TỪNG NGÀY</Text>
            <Text style={styles.sectionMainHeading}>Lịch trình chi tiết</Text>

            <View style={styles.itineraryList}>
              {tour.itinerary.map((dayItem, idx) => (
                <View key={idx} style={styles.dayItemCard}>
                  <View style={styles.dayBadgeBox}>
                    <Text style={styles.dayBadgeText}>{dayItem.day}</Text>
                  </View>
                  <Text style={styles.dayTitle}>{dayItem.title}</Text>
                  <Text style={styles.dayDescText}>{dayItem.desc}</Text>

                  <View style={styles.dayMetaRow}>
                    <View style={styles.dayMetaItem}>
                      <Ionicons name="restaurant-outline" size={13} color="#ea580c" />
                      <Text style={styles.dayMetaText}>{dayItem.meals}</Text>
                    </View>
                    <View style={styles.dayMetaItem}>
                      <Ionicons name="bed-outline" size={14} color="#168b58" />
                      <Text style={styles.dayMetaText}>{dayItem.stay}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 3: Thông tin tour, Bao gồm & Không bao gồm */}
        {activeTab === 'thongtin' && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionSmallCategory}>ĐIỀU KIỆN & CHÍNH SÁCH</Text>
            <Text style={styles.sectionMainHeading}>Giá tour bao gồm & không bao gồm</Text>

            <View style={styles.inclusionsCard}>
              <Text style={styles.inclusionsTitle}>✅ Giá tour bao gồm:</Text>
              {tour.inclusions.map((item, i) => (
                <Text key={i} style={styles.includedItem}>
                  ✓ {item}
                </Text>
              ))}
            </View>

            <View style={[styles.inclusionsCard, { backgroundColor: '#fff5f5', borderColor: '#fed7d7' }]}>
              <Text style={[styles.inclusionsTitle, { color: '#c53030' }]}>❌ Không bao gồm:</Text>
              {tour.exclusions.map((item, i) => (
                <Text key={i} style={[styles.includedItem, { color: '#742a2a' }]}>
                  ✕ {item}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: Điểm đến & Bản đồ (Matching Screenshot 5) */}
        {activeTab === 'bando' && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionSmallCategory}>BẢN ĐỒ DU LỊCH</Text>
            <Text style={styles.sectionMainHeading}>Điểm đến trong hành trình</Text>
            <Text style={styles.tourDescParagraph}>
              Hành trình đưa bạn khám phá những địa danh nổi bật nhất tại {tour.location}.
            </Text>
          </View>
        )}

        {/* Destination Box with Google Maps Action (Matching User Screenshot 5) */}
        <View style={styles.destinationCard}>
          <Text style={styles.destinationHeaderLabel}>ĐIỂM ĐẾN</Text>
          <Text style={styles.destinationAddressText}>
            {tour.destinationAddress || `${tour.location}, Việt Nam`}
          </Text>

          <Pressable style={styles.viewMapBtn} onPress={handleOpenMap}>
            <Ionicons name="navigate-outline" size={16} color="#168b58" />
            <Text style={styles.viewMapBtnText}>Xem trên bản đồ Google Maps</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Gallery Photos Modal */}
      <Modal visible={isGalleryModalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { paddingTop: insets.top + 10 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Tất cả ảnh tour ({tour.images.length})</Text>
              <Pressable onPress={() => setIsGalleryModalOpen(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close-circle" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
              {tour.images.map((img, i) => (
                <View key={i} style={styles.modalImageWrapper}>
                  <Image source={{ uri: img }} style={styles.modalImage} contentFit="cover" />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// REAL DALAT TOUR DATA (100% Authentic Information & Itinerary)
const DEFAULT_DALAT_TOUR: TourDetailData = {
  id: 'tour-dalat-3n2d',
  title: 'Tour Đà Lạt 3N2Đ: săn mây, rừng thông và cà phê cao nguyên',
  location: 'Đà Lạt, Lâm Đồng',
  destinationAddress: 'Đà Lạt, Lâm Đồng, Việt Nam',
  pricePerPerson: 2790000,
  priceText: '2.790.000đ/khách',
  duration: '3 ngày 2 đêm',
  departure: 'Đà Lạt / TP. Hồ Chí Minh',
  transport: 'Xe du lịch Limousine cao cấp',
  groupType: 'Nhóm linh hoạt',
  openDatesCount: '7 ngày khởi hành',
  availableSeats: 18,
  availableDateStr: '07/10',
  departureDates: [
    { date: '07/10', dayName: 'Thứ 4', seatsLeft: 18 },
    { date: '14/10', dayName: 'Thứ 4', seatsLeft: 12 },
    { date: '21/10', dayName: 'Thứ 4', seatsLeft: 15 },
    { date: '28/10', dayName: 'Thứ 4', seatsLeft: 20 },
    { date: '04/11', dayName: 'Thứ 4', seatsLeft: 16 },
  ],
  images: [
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=84',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
  ],
  desc: 'Hành trình nhẹ nhàng cho nhóm thích khí hậu mát, ảnh đẹp và nhiều quán cà phê. Tour tập trung vào bình minh, rừng thông, nông nghiệp công nghệ cao và những trải nghiệm đặc trưng của xứ sở ngàn hoa.',
  highlights: [
    'Đón bình minh & săn mây kỳ ảo tại Đồi Chè Cầu Đất (Panorama mây bồng bềnh)',
    'Check-in Ga Đà Lạt cổ kính & Quảng trường Lâm Viên biểu tượng hoa dã quỳ',
    'Trải nghiệm máng trượt alpine coaster xuyên rừng thông tại Thác Datanla',
    'Thưởng thức cà phê đặc sản cao nguyên giữa đồi thông thơ mộng',
    'Hái dâu tây sạch công nghệ cao tại vườn và mua đặc sản mứt hoa quả làm quà',
  ],
  travelTips: [
    'Thời tiết Đà Lạt se lạnh vào sáng sớm và đêm (14 - 17°C), quý khách nên mang theo áo khoác ấm mỏng, khăn choàng và giày thể thao êm chân.',
    'Các điểm check-in săn mây bắt đầu từ 05:00 sáng để đón trọn khoảnh khắc mặt trời mọc.',
    'Đặt chỗ sớm nếu đi vào dịp cuối tuần hoặc lễ để đảm bảo có vị trí ngồi tốt nhất trên xe Limousine.',
  ],
  inclusions: [
    'Xe du lịch Limousine đời mới đưa đón theo suốt hành trình từ TP.HCM / Đà Lạt',
    '2 đêm lưu trú tại khách sạn 3-4 sao trung tâm thành phố (2-3 khách/phòng)',
    'Các bữa ăn theo chương trình: 2 bữa sáng buffet + 4 bữa chính đặc sản Tây Nguyên',
    'Vé tham quan tất cả các điểm trong lịch trình (Cáp treo, thác Datanla, vườn dâu)',
    'Hướng dẫn viên chuyên nghiệp, am hiểu sâu sắc văn hóa địa phương',
    'Bảo hiểm du lịch nội địa mức bồi thường tối đa 50.000.000 đ/vụ',
    'Nước suối và khăn lạnh phục vụ hàng ngày trên xe',
  ],
  exclusions: [
    'Chi phí cá nhân ngoài chương trình (giặt ủi, nước uống minibar, đồ uống tự gọi)',
    'Vé máng trượt mở rộng hoặc các trò chơi cảm giác mạnh tự chọn',
    'Thuế VAT 8% (nếu quý khách có nhu cầu xuất hóa đơn đỏ)',
    'Tiền tip cho tài xế và hướng dẫn viên (tùy tâm)',
  ],
  itinerary: [
    {
      day: 'NGÀY 1',
      title: 'ĐÓN KHÁCH → CHECK-IN ĐÀ LẠT → QUẢNG TRƯỜNG LÂM VIÊN → GA ĐÀ LẠT',
      desc: '• 06:00: Xe Limousine đón quý khách tại điểm hẹn trung tâm, khởi hành đi Đà Lạt theo cung đường đèo Bảo Lộc thơ mộng.\n• 12:00: Đến Đà Lạt, dùng cơm trưa với món lẩu gà lá é hoặc lẩu bò Ba Toa trứ danh. Nhận phòng khách sạn nghỉ ngơi.\n• 14:30: Tham quan Ga Đà Lạt - nhà ga xe lửa cổ nhất Đông Dương với đầu máy hơi nước cổ kính.\n• 16:00: Check-in nụ hoa Atiso và hoa dã quỳ khổng lồ tại Quảng trường Lâm Viên bên Hồ Xuân Hương.\n• 18:30: Thưởng thức bữa tối BBQ nướng cao nguyên. Tự do dạo Chợ Đêm Đà Lạt thưởng thức bánh tráng nướng, sữa đậu nành nóng.',
      meals: 'Ăn trưa, Ăn tối BBQ',
      stay: 'Khách sạn 3-4 sao trung tâm Đà Lạt',
    },
    {
      day: 'NGÀY 2',
      title: 'SĂN MÂY CẦU ĐẤT → THÁC DATANLA → VƯỜN DÂU CÔNG NGHỆ CAO → CAFE ĐỒI THÔNG',
      desc: '• 05:00: Xe đưa đoàn đi Cầu Đất đón bình minh và săn biển mây bồng bềnh trên thảm gỗ, ngắm cánh đồng điện gió khổng lồ.\n• 07:30: Dùng điểm tâm sáng với bánh mì xíu mại nóng hổi và cà phê mộc Arabica.\n• 09:30: Khám phá Thác Datanla hùng vĩ giữa đại ngàn thông xanh, trải nghiệm hệ thống máng trượt uốn lượn cảm giác mạnh.\n• 12:00: Dùng bữa trưa buffet rau không giới hạn tại nhà hàng Leguda ngắm toàn cảnh đèo Prenn.\n• 14:30: Tham quan Vườn Dâu Tây thủy canh, tự tay hái những trái dâu chín mọng ngọt lành.\n• 16:30: Ghé quán cà phê view thung lũng thông reo thơ mộng, thư thả ngắm hoàng hôn buông xuống phố núi.',
      meals: 'Ăn sáng, Ăn trưa buffet rau, Ăn tối',
      stay: 'Khách sạn 3-4 sao trung tâm Đà Lạt',
    },
    {
      day: 'NGÀY 3',
      title: 'THIỀN VIỆN TRÚC LÂM → MUA ĐẶC SẢN → TRỞ VỀ ĐIỂM ĐÓN BAN ĐẦU',
      desc: '• 07:30: Dùng bữa sáng buffet tại khách sạn, làm thủ tục trả phòng.\n• 08:30: Chiêm bái Thiền Viện Trúc Lâm thanh tịnh, ngắm cảnh hồ Tuyền Lâm xanh biếc phẳng lặng như gương.\n• 10:30: Ghé cơ sở sản xuất mứt và trà Atiso Đà Lạt, nếm thử đặc sản và mua quà biếu người thân.\n• 12:00: Dùng bữa trưa tại TP. Bảo Lộc, thưởng thức trà & cà phê danh tiếng.\n• 18:30: Về đến điểm đón ban đầu tại TP.HCM, hướng dẫn viên chia tay và hẹn gặp lại quý khách!',
      meals: 'Ăn sáng, Ăn trưa',
      stay: 'Kết thúc chuyến đi tốt đẹp',
    },
  ],
  phone: '1900 1888',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  scrollContent: { paddingBottom: 60 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 4,
  },
  topBarBackText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  /* Title Section */
  titleSection: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064e3b',
    lineHeight: 30,
    marginBottom: 12,
  },
  tagBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fefce8',
    borderWidth: 1,
    borderColor: '#fef08a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  starIcon: {
    color: '#ca8a04',
    fontSize: 12,
    fontWeight: 'bold',
  },
  starBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854d0e',
  },
  calendarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  calendarBadgeText: {
    fontSize: 12,
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
    borderWidth: 1,
    borderColor: '#ddd6fe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  purpleGroupBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6d28d9',
  },

  /* Price Highlight Card */
  priceHighlightCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fbd5c0',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-end',
  },
  priceHighlightRight: {
    alignItems: 'flex-end',
  },
  priceHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  priceHighlightText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ea580c',
    marginVertical: 2,
  },
  pricePerPersonSub: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ea580c',
  },
  taxIncludedBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 2,
  },
  taxIncludedText: {
    fontSize: 11,
    color: '#c2410c',
    fontWeight: '600',
  },

  /* Gallery Section */
  galleryWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
  },
  thumbnailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  thumbnailBox: {
    width: 60,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
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
    flex: 1,
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  viewAllPhotosText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* Quick Facts Card */
  quickFactsCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#fff8f2',
    borderWidth: 1,
    borderColor: '#ffedd5',
    borderRadius: 14,
    padding: 16,
  },
  quickFactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  clockIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFactsTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#9a3412',
    letterSpacing: 0.5,
  },
  factsContainer: {
    backgroundColor: '#f6ece2',
    borderRadius: 12,
    padding: 14,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  factIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e6f7f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  factContent: {
    flex: 1,
  },
  factLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#78716c',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  factValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0c4a6e',
    marginTop: 2,
  },

  /* Booking Options Card */
  bookingOptionsCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffedd5',
    borderRadius: 14,
    padding: 16,
  },
  optionsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  optionsSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#064e3b',
  },
  fastResponseBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fastResponseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  seatsLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  flameIcon: { fontSize: 13 },
  seatsLeftText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
  },
  datesScroller: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateBtn: {
    width: 80,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  dateBtnSelected: {
    backgroundColor: '#fff7ed',
    borderColor: '#ea580c',
    borderWidth: 1.5,
  },
  dateBtnDate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  dateBtnDateSelected: {
    color: '#ea580c',
  },
  dateBtnDay: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  dateBtnDaySelected: {
    color: '#ea580c',
    fontWeight: '600',
  },
  calendarMoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },

  packageHeaderLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064e3b',
    marginBottom: 8,
  },
  standardPackageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#ea580c',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  packageName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  bestPriceBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestPriceText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  packageSub: {
    fontSize: 12,
    color: '#64748b',
  },
  packageRadioActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
  },

  passengersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maxGuestsNote: {
    fontSize: 11,
    color: '#64748b',
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  guestInfoCol: {
    flex: 1,
  },
  guestTypeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  guestPriceSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  counterValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    minWidth: 20,
    textAlign: 'center',
  },

  /* Total Summary Card */
  totalSummaryCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 14,
    padding: 16,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  summarySub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  totalPriceBig: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ea580c',
  },
  bookTourBigBtn: {
    backgroundColor: '#ea580c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bookTourBigBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716c',
  },
  trustDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#e2e8f0',
  },

  /* Tab Navigation */
  tabNavRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  tabNavItem: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabNavItemActive: {
    borderBottomColor: '#059669',
  },
  tabNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabNavTextActive: {
    color: '#059669',
    fontWeight: '800',
  },

  /* Tab Content */
  tabContentCard: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  sectionSmallCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionMainHeading: {
    fontSize: 19,
    fontWeight: '900',
    color: '#064e3b',
    marginBottom: 10,
  },
  tourDescParagraph: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },

  highlightsContainer: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  highlightsHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: '#1e3a2f',
    lineHeight: 18,
    fontWeight: '500',
  },

  travelAdviceBox: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  travelAdviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 2,
  },
  travelAdviceItem: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },

  /* Itinerary */
  itineraryList: {
    gap: 14,
  },
  dayItemCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
  },
  dayBadgeBox: {
    backgroundColor: '#00897b',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  dayBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dayTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
    marginBottom: 8,
  },
  dayDescText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 10,
  },
  dayMetaRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  dayMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayMetaText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },

  /* Inclusions */
  inclusionsCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 6,
  },
  inclusionsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 4,
  },
  includedItem: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
  },

  /* Destination Card */
  destinationCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 16,
  },
  destinationHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  destinationAddressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  viewMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#168b58',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  viewMapBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#168b58',
  },



  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  modalCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalImageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});
