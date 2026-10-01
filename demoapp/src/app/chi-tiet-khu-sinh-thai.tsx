import React, { useState, useMemo, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Modal,
  TextInput,
  Linking,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ECO_PLACES, EcoPlace } from './khu-sinh-thai';

const { width } = Dimensions.get('window');

export default function ChiTietKhuSinhThaiScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    location?: string;
    desc?: string;
    image?: string;
    tag?: string;
    price?: string;
    tab?: string;
  }>();

  // Find destination matching id or name
  const placeData: EcoPlace = useMemo(() => {
    const found = ECO_PLACES.find((p) => p.id === params.id || p.name === params.name);
    if (found) return found;
    return {
      id: 'default',
      name: params.name || 'Khu Sinh Thái Chavi Garden',
      location: params.location || 'Bến Lức, Long An (Tiếp giáp Tây Ninh)',
      province: 'Long An',
      desc: params.desc || 'Khu du lịch sinh thái nông nghiệp công nghệ cao rộng hơn 40ha với vườn chanh bạt ngàn, tắm bùn khoáng, chèo SUP, ẩm thực đồng quê.',
      longDesc: 'Chavi Garden là tổ hợp sinh thái giáo dục trải nghiệm lớn nhất khu vực miền Nam, sở hữu hệ thống suối khoáng nhân tạo, vườn chanh chuẩn quốc tế, khu chế biến nông sản organic và không gian dã ngoại trong lành.',
      price: params.price || 'Từ 150.000đ',
      priceNum: 150000,
      image: params.image || 'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        params.image || 'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=80',
      ],
      operatingHours: '08:00 - 17:30',
      availableDates: 'Có sẵn hàng ngày',
      targetAudience: 'Gia đình & Đoàn tham quan',
      tag: params.tag || 'Sinh thái nông nghiệp',
      ticketCount: '4 gói vé',
      rating: '4.9',
      activities: [
        'Tham quan vườn chanh không hạt công nghệ cao rộng 40ha',
        'Tắm suối khoáng nhân tạo và ngâm bùn khoáng thư giãn',
        'Chèo thuyền kayak, đạp vịt trên hồ cảnh quan thơ mộng',
        'Thưởng thức lẩu cá linh bông điên điển và gà nướng lu',
      ],
      facilities: [
        { icon: 'car-outline', label: 'Bãi đỗ xe rộng rãi' },
        { icon: 'wifi-outline', label: 'Wifi miễn phí' },
        { icon: 'restaurant-outline', label: 'Nhà hàng ẩm thực quê' },
        { icon: 'water-outline', label: 'Hồ tắm khoáng bùn' },
      ],
      policies: [
        'Trẻ em dưới 1m được miễn phí vé vào cổng',
        'Không mang theo thức ăn tươi sống vào khu du lịch',
        'Có trang bị áo phao bắt buộc khi tham gia chèo thuyền',
      ],
      ticketTypes: [
        {
          id: 't1',
          name: 'Vé vào cổng & Tham quan sinh thái',
          price: 150000,
          desc: 'Bao gồm vé vào cổng, nước ép chanh tươi welcome và xe điện tham quan toàn khu',
        },
        {
          id: 't2',
          name: 'Combo Tham quan + Tắm bùn khoáng',
          price: 280000,
          desc: 'Vé vào cổng + 60 phút ngâm khoáng nóng thư giãn + tặng khăn tắm cao cấp',
        },
        {
          id: 't3',
          name: 'Combo Trọn gói Chèo Kayak & Ăn trưa',
          price: 450000,
          desc: 'Trọn gói vé cổng + chèo Kayak 2 giờ + Set menu ẩm thực đồng quê 5 món',
        },
      ],
      address: 'Ấp 4, Xã Thạnh Lợi, Huyện Bến Lức, Tỉnh Long An',
    };
  }, [params]);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Active tab: 'tong-quan' | 'trai-nghiem' | 'tien-ich' | 'chinh-sach' | 'vi-tri'
  const [activeTab, setActiveTab] = useState<string>(params.tab || 'tong-quan');

  // Selected Ticket in booking view
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    placeData.ticketTypes[0]?.id || 't1'
  );

  // Date picker generation (14 days)
  const datesList = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

      let mainLabel = `${dd}/${mm}`;
      if (i === 0) mainLabel = 'Hôm nay';
      else if (i === 1) mainLabel = 'Ngày mai';

      dates.push({
        id: `${dd}/${mm}/${d.getFullYear()}`,
        mainLabel,
        subLabel: dayNames[d.getDay()],
        fullLabel: `${dayNames[d.getDay()]}, ${dd}/${mm}/${d.getFullYear()}`,
      });
    }
    return dates;
  }, []);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Ticket quantities
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);

  // Current chosen ticket object
  const currentTicket = useMemo(() => {
    return placeData.ticketTypes.find((t) => t.id === selectedTicketId) || placeData.ticketTypes[0];
  }, [selectedTicketId, placeData]);

  // Price calculations
  const adultPrice = currentTicket ? currentTicket.price : placeData.priceNum;
  const childPrice = Math.round(adultPrice * 0.7); // 30% off for children
  const totalPrice = adultCount * adultPrice + childCount * childPrice;
  const totalGuests = adultCount + childCount;

  // Booking Checkout Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      placeData.name + ' ' + placeData.address
    )}`;
    Linking.openURL(url);
  };

  const handleOpenBooking = () => {
    if (totalGuests === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 vé tham quan.');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      Alert.alert('Vui lòng nhập thông tin', 'Vui lòng điền họ tên và số điện thoại người nhận vé.');
      return;
    }
    setBookingSuccess(true);
  };

  const TABS = [
    { id: 'tong-quan', label: 'Tổng quan' },
    { id: 'trai-nghiem', label: 'Trải nghiệm' },
    { id: 'tien-ich', label: 'Tiện ích' },
    { id: 'chinh-sach', label: 'Chính sách' },
    { id: 'vi-tri', label: 'Vị trí' },
  ];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header Bar (Matching Tour / Hotel Detail Screens) */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBarBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
          <Text style={styles.topBarBackText}>Quay lại khu sinh thái</Text>
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

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Badges Section (Matching Screenshot 1) */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{placeData.name}</Text>

          <View style={styles.tagBadgeRow}>
            <View style={styles.starBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.starBadgeText}>Điểm đến mới được cập nhật</Text>
            </View>

            <View style={styles.calendarBadge}>
              <Ionicons name="leaf-outline" size={13} color="#065f46" />
              <Text style={styles.calendarBadgeText}>{placeData.tag || 'Sinh thái & Trải nghiệm'}</Text>
            </View>
          </View>

          <View style={styles.groupBadgeRow}>
            <View style={styles.purpleGroupBadge}>
              <Ionicons name="people" size={13} color="#6d28d9" />
              <Text style={styles.purpleGroupBadgeText}>
                {placeData.targetAudience || 'Mọi lứa tuổi & Gia đình'}
              </Text>
            </View>
          </View>

          {/* Pricing Highlight Card (Matching Screenshot 1) */}
          <View style={styles.priceHighlightCard}>
            <View style={styles.priceHighlightRight}>
              <Text style={styles.priceHeaderLabel}>GIÁ VÉ TỪ</Text>
              <Text style={styles.priceHighlightText}>
                {placeData.priceNum.toLocaleString('vi-VN')}đ
                <Text style={styles.pricePerPersonSub}>/khách</Text>
              </Text>
              <View style={styles.taxIncludedBadge}>
                <Text style={styles.taxIncludedText}>Giá đã gồm thuế phí & bảo hiểm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Gallery Image & Thumbnails (Matching Screenshot 2) */}
        <View style={styles.galleryWrapper}>
          <Image
            source={{ uri: placeData.gallery[selectedImageIndex] || placeData.image }}
            style={styles.heroImage}
            contentFit="cover"
          />

          <View style={styles.thumbnailRow}>
            {placeData.gallery.slice(0, 3).map((img, idx) => (
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
                Xem tất cả {placeData.gallery.length} ảnh
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Facts Card (Matching Screenshot 2) */}
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
                <Text style={styles.factLabel}>GIỜ MỞ CỬA</Text>
                <Text style={styles.factValue}>{placeData.operatingHours}</Text>
              </View>
            </View>

            <View style={styles.factRow}>
              <View style={styles.factIconBox}>
                <Ionicons name="location-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>ĐỊA ĐIỂM</Text>
                <Text style={styles.factValue} numberOfLines={1}>{placeData.location}</Text>
              </View>
            </View>

            <View style={styles.factRow}>
              <View style={styles.factIconBox}>
                <Ionicons name="ticket-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>GÓI VÉ</Text>
                <Text style={styles.factValue}>{placeData.ticketCount}</Text>
              </View>
            </View>

            <View style={[styles.factRow, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
              <View style={styles.factIconBox}>
                <Ionicons name="calendar-outline" size={22} color="#168b58" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factLabel}>LỊCH MỞ CỬA</Text>
                <Text style={styles.factValue}>{placeData.availableDates}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date Selector & Ticket Package Selection Card (Matching Screenshot 3) */}
        <View style={styles.bookingOptionsCard}>
          <View style={styles.optionsHeaderRow}>
            <Text style={styles.optionsSectionTitle}>Chọn ngày trải nghiệm</Text>
            <View style={styles.fastResponseBadge}>
              <Text style={styles.fastResponseText}>Phản hồi tức thì</Text>
            </View>
          </View>

          <View style={styles.seatsLeftRow}>
            <Text style={styles.flameIcon}>🌿</Text>
            <Text style={styles.seatsLeftText}>
              Đang mở đặt vé cho ngày {datesList[selectedDateIndex]?.fullLabel}
            </Text>
          </View>

          {/* Date Selector Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroller}>
            {datesList.map((item, idx) => {
              const isSelected = selectedDateIndex === idx;
              return (
                <Pressable
                  key={idx}
                  style={[styles.dateBtn, isSelected && styles.dateBtnSelected]}
                  onPress={() => setSelectedDateIndex(idx)}
                >
                  <Text style={[styles.dateBtnDate, isSelected && styles.dateBtnDateSelected]}>
                    {item.mainLabel}
                  </Text>
                  <Text style={[styles.dateBtnDay, isSelected && styles.dateBtnDaySelected]}>
                    {item.subLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Ticket Package Radio Selection */}
          <Text style={styles.packageHeaderLabel}>CHỌN GÓI VÉ TRẢI NGHIỆM</Text>
          <View style={{ gap: 8, marginBottom: 16 }}>
            {placeData.ticketTypes.map((ticket) => {
              const isSelected = selectedTicketId === ticket.id;
              return (
                <Pressable
                  key={ticket.id}
                  style={[styles.packageCard, isSelected && styles.packageCardSelected]}
                  onPress={() => setSelectedTicketId(ticket.id)}
                >
                  <View style={styles.packageRadioCircle}>
                    {isSelected && <View style={styles.packageRadioDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.packageName}>{ticket.name}</Text>
                      <Text style={styles.packagePriceText}>{ticket.price.toLocaleString('vi-VN')}đ</Text>
                    </View>
                    <Text style={styles.packageDesc}>{ticket.desc}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Passenger Quantity Controls */}
          <View style={styles.passengersHeaderRow}>
            <Text style={styles.packageHeaderLabel}>SỐ LƯỢNG VÉ</Text>
            <Text style={styles.maxGuestsNote}>Trẻ em dưới 1m miễn phí</Text>
          </View>

          {/* Adult Counter */}
          <View style={styles.guestRow}>
            <View style={styles.guestInfoCol}>
              <Text style={styles.guestTypeLabel}>Người lớn</Text>
              <Text style={styles.guestPriceSub}>{adultPrice.toLocaleString('vi-VN')}đ /vé</Text>
            </View>
            <View style={styles.counterControl}>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setAdultCount(Math.max(1, adultCount - 1))}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </Pressable>
              <Text style={styles.counterValueText}>{adultCount}</Text>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setAdultCount(adultCount + 1)}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* Child Counter */}
          <View style={styles.guestRow}>
            <View style={styles.guestInfoCol}>
              <Text style={styles.guestTypeLabel}>Trẻ em (1m - 1m3)</Text>
              <Text style={styles.guestPriceSub}>{childPrice.toLocaleString('vi-VN')}đ /vé (giảm 30%)</Text>
            </View>
            <View style={styles.counterControl}>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setChildCount(Math.max(0, childCount - 1))}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </Pressable>
              <Text style={styles.counterValueText}>{childCount}</Text>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setChildCount(childCount + 1)}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Tab Navigation Bar */}
        <View style={styles.tabBarWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarScroll}>
            {TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[styles.tabItem, isSelected && styles.tabItemActive]}
                >
                  <Text style={[styles.tabItemText, isSelected && styles.tabItemTextActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Tab Contents */}
        <View style={styles.tabContentContainer}>
          {/* TAB 1: TỔNG QUAN */}
          {activeTab === 'tong-quan' && (
            <View style={styles.cardBox}>
              <Text style={styles.sectionHeaderTitle}>Giới thiệu điểm đến</Text>
              <Text style={styles.paragraphText}>{placeData.longDesc || placeData.desc}</Text>

              <Text style={[styles.sectionHeaderTitle, { marginTop: 18 }]}>Hoạt động nổi bật</Text>
              <View style={{ gap: 8, marginTop: 8 }}>
                {placeData.activities.map((act, idx) => (
                  <View key={idx} style={styles.activityItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" style={{ marginTop: 2 }} />
                    <Text style={styles.activityText}>{act}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 2: TRẢI NGHIỆM */}
          {activeTab === 'trai-nghiem' && (
            <View style={styles.cardBox}>
              <Text style={styles.sectionHeaderTitle}>Các trải nghiệm xanh độc đáo</Text>
              <View style={{ gap: 10, marginTop: 8 }}>
                {placeData.activities.map((act, idx) => (
                  <View key={idx} style={styles.highlightCard}>
                    <View style={styles.highlightNumberBox}>
                      <Text style={styles.highlightNumberText}>0{idx + 1}</Text>
                    </View>
                    <Text style={styles.highlightContentText}>{act}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 3: TIỆN ÍCH */}
          {activeTab === 'tien-ich' && (
            <View style={styles.cardBox}>
              <Text style={styles.sectionHeaderTitle}>Tiện ích & Dịch vụ đi kèm</Text>
              <View style={styles.facilitiesGrid}>
                {placeData.facilities.map((fac, idx) => (
                  <View key={idx} style={styles.facilityItem}>
                    <Ionicons name={fac.icon || 'leaf'} size={20} color="#065f46" />
                    <Text style={styles.facilityText}>{fac.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 4: CHÍNH SÁCH */}
          {activeTab === 'chinh-sach' && (
            <View style={styles.cardBox}>
              <Text style={styles.sectionHeaderTitle}>Chính sách & Quy định tham quan</Text>
              <View style={{ gap: 8, marginTop: 8 }}>
                {placeData.policies.map((pol, idx) => (
                  <View key={idx} style={styles.policyItem}>
                    <Ionicons name="alert-circle-outline" size={16} color="#ea580c" style={{ marginTop: 2 }} />
                    <Text style={styles.policyText}>{pol}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 5: VỊ TRÍ & BẢN ĐỒ */}
          {activeTab === 'vi-tri' && (
            <View style={styles.cardBox}>
              <Text style={styles.sectionHeaderTitle}>Vị trí & Đường đi</Text>
              <Text style={styles.addressText}>{placeData.address}</Text>
              <Pressable style={styles.openMapBtn} onPress={handleOpenGoogleMaps}>
                <Ionicons name="navigate" size={16} color="#ffffff" />
                <Text style={styles.openMapBtnText}>Xem chỉ đường trên Google Maps</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Total Summary Card */}
        <View style={styles.totalSummaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryTitle}>Tạm tính thanh toán</Text>
              <Text style={styles.summarySub}>
                {adultCount} người lớn{childCount > 0 ? `, ${childCount} trẻ em` : ''} • {datesList[selectedDateIndex]?.mainLabel}
              </Text>
            </View>
            <Text style={styles.summaryTotalNumber}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
          </View>
          <Text style={styles.summaryPackageName}>
            Gói: {currentTicket?.name}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View style={[styles.bottomCheckoutBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View>
          <Text style={styles.checkoutTotalLabel}>Tổng tạm tính ({totalGuests} vé)</Text>
          <Text style={styles.checkoutTotalPrice}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
        </View>

        <Pressable style={styles.checkoutConfirmBtn} onPress={handleOpenBooking}>
          <Text style={styles.checkoutConfirmBtnText}>Đặt vé ngay</Text>
          <Ionicons name="arrow-forward" size={15} color="#ffffff" />
        </Pressable>
      </View>

      {/* Fullscreen Gallery Modal */}
      <Modal visible={isGalleryModalOpen} transparent={true} animationType="fade">
        <View style={styles.galleryModalOverlay}>
          <View style={[styles.galleryModalHeader, { top: insets.top + 10 }]}>
            <Text style={styles.galleryModalTitle}>{placeData.name}</Text>
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
            {placeData.gallery.map((img, idx) => (
              <View key={idx} style={{ width, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={{ uri: img }} style={styles.modalImage} contentFit="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Booking Checkout Modal */}
      <Modal visible={isBookingModalOpen} transparent={true} animationType="slide">
        <View style={styles.bookingModalOverlay}>
          <View style={[styles.bookingModalCard, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            {!bookingSuccess ? (
              <View>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalHeading}>Xác nhận đặt vé</Text>
                  <Pressable onPress={() => setIsBookingModalOpen(false)} hitSlop={10}>
                    <Ionicons name="close" size={24} color="#64748b" />
                  </Pressable>
                </View>

                <View style={styles.orderSummaryBox}>
                  <Text style={styles.orderSpotName}>{placeData.name}</Text>
                  <Text style={styles.orderDetailText}>📅 Ngày: {datesList[selectedDateIndex]?.fullLabel}</Text>
                  <Text style={styles.orderDetailText}>🎟️ Gói: {currentTicket?.name}</Text>
                  <Text style={styles.orderDetailText}>
                    👥 Số lượng: {adultCount} người lớn{childCount > 0 ? `, ${childCount} trẻ em` : ''}
                  </Text>
                  <View style={styles.orderTotalRow}>
                    <Text style={styles.orderTotalLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.orderTotalValue}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Họ và tên người đặt vé *</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    placeholderTextColor="#94a3b8"
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Số điện thoại nhận vé điện tử *</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="Ví dụ: 0912 345 678"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                  />
                </View>

                <Pressable style={styles.modalSubmitBtn} onPress={handleConfirmBooking}>
                  <Text style={styles.modalSubmitBtnText}>Xác nhận thanh toán ngay</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={32} color="#ffffff" />
                </View>
                <Text style={styles.successTitle}>Đặt vé thành công!</Text>
                <Text style={styles.successSub}>
                  Mã vé điện tử đã được gửi đến số điện thoại {customerPhone}.
                </Text>

                <View style={styles.qrTicketCard}>
                  <Text style={styles.qrTicketSpot}>{placeData.name}</Text>
                  <Text style={styles.qrTicketDate}>Ngày: {datesList[selectedDateIndex]?.fullLabel}</Text>
                  <Text style={styles.qrTicketType}>{currentTicket?.name}</Text>
                  <Text style={styles.qrTicketQty}>{adultCount} người lớn{childCount > 0 ? `, ${childCount} trẻ em` : ''}</Text>
                  <Text style={styles.qrTicketTotal}>Tổng tiền: {totalPrice.toLocaleString('vi-VN')}đ</Text>

                  <View style={styles.qrBox}>
                    <Ionicons name="qr-code-outline" size={100} color="#0b3528" />
                    <Text style={styles.qrCodeText}>ECO-{Math.floor(100000 + Math.random() * 900000)}</Text>
                  </View>
                  <Text style={styles.qrInstruction}>Xuất trình mã QR này tại quầy vé để vào cổng</Text>
                </View>

                <Pressable
                  style={styles.successCloseBtn}
                  onPress={() => {
                    setBookingSuccess(false);
                    setIsBookingModalOpen(false);
                  }}
                >
                  <Text style={styles.successCloseBtnText}>Hoàn tất & Đóng</Text>
                </Pressable>
              </View>
            )}
          </View>
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
    fontSize: 20,
    fontWeight: '900',
    color: '#ea580c',
  },
  pricePerPersonSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
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

  /* Booking Options Card */
  bookingOptionsCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  optionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionsSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  fastResponseBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
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
    color: '#059669',
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

  packageHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064e3b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  packageCardSelected: {
    backgroundColor: '#fff7ed',
    borderColor: '#ea580c',
    borderWidth: 1.5,
  },
  packageRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  packageRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ea580c',
  },
  packageName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  packagePriceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ea580c',
  },
  packageDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 16,
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

  /* Tab Bar */
  tabBarWrapper: {
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBarScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#00897b',
  },
  tabItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabItemTextActive: {
    color: '#00897b',
    fontWeight: '800',
  },

  /* Tab Content */
  tabContentContainer: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  cardBox: {
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  activityText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  highlightNumberBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065f46',
  },
  highlightContentText: {
    fontSize: 12,
    color: '#0f172a',
    flex: 1,
    fontWeight: '600',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcfce7',
    width: '48%',
  },
  facilityText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#065f46',
    flex: 1,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  policyText: {
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
    marginBottom: 8,
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
  summaryTotalNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ea580c',
  },
  summaryPackageName: {
    fontSize: 11.5,
    color: '#059669',
    fontWeight: '700',
  },

  /* Sticky Bottom Bar */
  bottomCheckoutBar: {
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
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  checkoutTotalLabel: { fontSize: 10, color: '#64748b', fontWeight: '600' },
  checkoutTotalPrice: { fontSize: 18, fontWeight: '900', color: '#ea580c' },
  checkoutConfirmBtn: {
    backgroundColor: '#ff5722',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutConfirmBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },

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

  /* Booking Checkout Modal */
  bookingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  bookingModalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeading: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  orderSummaryBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
    marginBottom: 14,
  },
  orderSpotName: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  orderDetailText: { fontSize: 11, color: '#475569' },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 6,
  },
  orderTotalLabel: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  orderTotalValue: { fontSize: 16, fontWeight: '900', color: '#ea580c' },

  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 6 },
  modalTextInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0f172a',
  },
  modalSubmitBtn: {
    backgroundColor: '#ff5722',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modalSubmitBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },

  /* Success Screen */
  successContainer: { alignItems: 'center', paddingVertical: 10 },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: { fontSize: 18, fontWeight: '900', color: '#064e3b', marginBottom: 4 },
  successSub: { fontSize: 11, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  qrTicketCard: {
    width: '100%',
    backgroundColor: '#fdfaf6',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrTicketSpot: { fontSize: 13, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 6 },
  qrTicketDate: { fontSize: 11, color: '#475569', marginBottom: 2 },
  qrTicketType: { fontSize: 11, color: '#475569', marginBottom: 2 },
  qrTicketQty: { fontSize: 11, color: '#475569', marginBottom: 2 },
  qrTicketTotal: { fontSize: 13, fontWeight: '800', color: '#ea580c', marginVertical: 6 },
  qrBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginVertical: 8,
  },
  qrCodeText: { fontSize: 11, fontWeight: '800', color: '#0f172a', marginTop: 4 },
  qrInstruction: { fontSize: 10, color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' },
  successCloseBtn: {
    backgroundColor: '#0b3528',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  successCloseBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },
});
