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
  Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { ECO_PLACES, EcoPlace } from './khu-sinh-thai';

const { width } = Dimensions.get('window');

export default function ChiTietKhuSinhThaiScreen() {
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
    const found = ECO_PLACES.find(p => p.id === params.id || p.name === params.name);
    if (found) return found;
    return {
      id: 'default',
      name: params.name || 'Khu Sinh Thái Chèo SUP Rừng Ngập Mặn Vũng Tàu',
      location: params.location || 'Vũng Tàu, Bà Rịa - Vũng Tàu',
      province: 'Vũng Tàu',
      desc: params.desc || 'Buổi chèo riêng theo nhóm nhỏ, có hướng dẫn an toàn và ảnh hành trình.',
      longDesc: 'Trải nghiệm thể thao sinh thái độc đáo tại sông Rạng và đảo Long Sơn. Du khách sẽ được lướt ván chèo đứng len lỏi giữa những rặng đước, sú vẹt cổ thụ, hít thở không khí biển trong lành và chụp ảnh flycam chuyên nghiệp.',
      price: params.price || 'Từ 550.000đ',
      priceNum: 550000,
      image: params.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=84',
      gallery: [
        params.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=84',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80'
      ],
      operatingHours: '05:30 - 18:00 (Theo lịch đã chọn)',
      availableDates: 'Có sẵn hàng ngày',
      targetAudience: 'Mọi du khách',
      tag: params.tag || 'Sinh thái & Trải nghiệm',
      ticketCount: '3 gói vé',
      activities: [
        'Được huấn luyện kỹ thuật chèo SUP cơ bản trong 15 phút',
        'Chèo lướt trên mặt nước đón bình minh rực rỡ trên vịnh',
        'Tặng bộ ảnh chụp bằng máy cơ và quay Flycam góc rộng',
        'Ghé nhà bè Long Sơn thưởng thức hàu tươi nướng mỡ hành'
      ],
      facilities: [
        { icon: 'boat-outline', label: 'Ván SUP & Áo phao xịn' },
        { icon: 'camera-outline', label: 'Chụp ảnh Flycam miễn phí' },
        { icon: 'shirt-outline', label: 'Phòng thay đồ & Tắm tráng' },
        { icon: 'shield-checkmark-outline', label: 'Cứu hộ chuyên nghiệp 24/7' }
      ],
      policies: [
        'Bắt buộc mặc áo phao cứu sinh trong suốt buổi chèo',
        'Trẻ em từ 6 tuổi có thể tham gia cùng người lớn',
        'Được dời lịch miễn phí nếu thời tiết có mưa bão'
      ],
      ticketTypes: [
        {
          id: 'sup1',
          name: 'Vé tham quan & Trải nghiệm Chèo SUP',
          price: 550000,
          desc: 'Bao gồm SUP, mái chèo, áo phao, HDV hướng dẫn và chụp ảnh kỷ niệm'
        },
        {
          id: 'sup2',
          name: 'Combo SUP Hoàng Hôn & Thưởng Thức Hàu',
          price: 680000,
          desc: 'Ca chiều 15:30 - 18:00 + Set hàu nướng mỡ hành tại bè Long Sơn'
        }
      ],
      address: 'Bến thuyền Sông Rạng, Xã Long Sơn, TP. Vũng Tàu'
    };
  }, [params]);

  // Active tab: 'tong-quan' | 'trai-nghiem' | 'tien-ich' | 'chinh-sach' | 'vi-tri' | 'xem-ve'
  const [activeTab, setActiveTab] = useState<string>(params.tab || 'tong-quan');

  // Selected Ticket in booking view
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    placeData.ticketTypes[0]?.id || 'sup1'
  );
  
  // Date picker generation
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
        fullLabel: `${dayNames[d.getDay()]}, ${dd}/${mm}/${d.getFullYear()}`
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(datesList[0].id);

  // Ticket quantities
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);

  // Current chosen ticket object
  const currentTicket = useMemo(() => {
    return placeData.ticketTypes.find(t => t.id === selectedTicketId) || placeData.ticketTypes[0];
  }, [selectedTicketId, placeData]);

  // Price calculations
  const adultPrice = currentTicket ? currentTicket.price : placeData.priceNum;
  const childPrice = Math.round(adultPrice * 0.7); // 30% off for children
  const totalPrice = (adultCount * adultPrice) + (childCount * childPrice);

  // Gallery Modal
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Booking Checkout Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeData.name + ' ' + placeData.address)}`;
    Linking.openURL(url);
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
    { id: 'xem-ve', label: 'Xem vé', isButton: true },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>
        <Text style={styles.topHeaderTitle} numberOfLines={1}>{placeData.name}</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.homeBtn} hitSlop={10}>
          <Ionicons name="home-outline" size={20} color="#00897b" />
        </Pressable>
      </View>

      <ScrollView 
        ref={scrollRef} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image Banner with "Xem tất cả ảnh" Button (Matching Image 1) */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: placeData.image }} style={styles.heroImage} contentFit="cover" />
          <Pressable 
            style={styles.viewAllPhotosBtn} 
            onPress={() => setIsGalleryOpen(true)}
            hitSlop={5}
          >
            <Ionicons name="images-outline" size={15} color="#00674f" />
            <Text style={styles.viewAllPhotosText}>Xem tất cả {placeData.gallery.length} ảnh</Text>
          </Pressable>
        </View>

        {/* Tab Bar (Matching Image 1: Sticky/Top tabs with highlighted "Xem vé" button) */}
        <View style={styles.tabBarWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarScroll}>
            {TABS.map((tab) => {
              if (tab.isButton) {
                const isActive = activeTab === 'xem-ve';
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setActiveTab('xem-ve')}
                    style={[styles.ticketTabBtn, isActive && styles.ticketTabBtnActive]}
                  >
                    <Text style={styles.ticketTabBtnText}>Xem vé</Text>
                  </Pressable>
                );
              }

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

        {/* Main Content Sections */}
        <View style={styles.contentBody}>
          
          {/* TAB 1: TỔNG QUAN (Matching Image 1) */}
          {(activeTab === 'tong-quan' || activeTab === 'trai-nghiem' || activeTab === 'tien-ich' || activeTab === 'chinh-sach' || activeTab === 'vi-tri') && (
            <View style={styles.overviewSection}>
              
              {/* Badge & Title */}
              <View style={styles.badgeRow}>
                <View style={styles.tagBadge}>
                  <Ionicons name="leaf" size={12} color="#00897b" />
                  <Text style={styles.tagBadgeText}>{placeData.tag}</Text>
                </View>
                <View style={styles.locBadge}>
                  <Ionicons name="location" size={12} color="#475569" />
                  <Text style={styles.locBadgeText}>{placeData.location}</Text>
                </View>
              </View>

              <Text style={styles.placeTitle}>{placeData.name}</Text>
              <Text style={styles.placeDesc}>{placeData.longDesc}</Text>

              {/* CARD ĐẶT VÉ THAM QUAN (Exact Match to Image 1) */}
              <View style={styles.bookingNoticeCard}>
                <Text style={styles.bookingNoticeBadge}>ĐẶT VÉ THAM QUAN</Text>
                <Text style={styles.bookingNoticeTitle}>Lịch và thanh toán nằm ở Vé du lịch</Text>
                <Text style={styles.bookingNoticeDesc}>
                  Trang này dùng để giới thiệu điểm đến. Vé, số lượng còn lại, QR và thanh toán được quản lý tập trung trong luồng Vé du lịch để khách đặt rõ ràng hơn.
                </Text>

                {/* 2 Summary Boxes (Giá từ, Lịch vé) */}
                <View style={styles.summaryBoxRow}>
                  <View style={styles.summaryBox}>
                    <View style={styles.summaryBoxLabelRow}>
                      <Ionicons name="ticket-outline" size={15} color="#00897b" />
                      <Text style={styles.summaryBoxLabel}>GIÁ TỪ</Text>
                    </View>
                    <Text style={styles.summaryBoxValue}>{placeData.price}</Text>
                  </View>

                  <View style={styles.summaryBox}>
                    <View style={styles.summaryBoxLabelRow}>
                      <Ionicons name="calendar-outline" size={15} color="#00897b" />
                      <Text style={styles.summaryBoxLabel}>LỊCH VÉ</Text>
                    </View>
                    <Text style={styles.summaryBoxValue}>{placeData.availableDates}</Text>
                  </View>
                </View>

                {/* Big Green Action Button: XEM VÉ VÀ LỊCH -> */}
                <Pressable 
                  style={styles.viewTicketsMainBtn}
                  onPress={() => setActiveTab('xem-ve')}
                >
                  <Text style={styles.viewTicketsMainBtnText}>XEM VÉ VÀ LỊCH</Text>
                  <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                </Pressable>
              </View>

              {/* Green Border Information Card (Exact Match to Image 1) */}
              <View style={styles.unifiedFlowCard}>
                <View style={styles.unifiedFlowHeader}>
                  <Ionicons name="shield-checkmark" size={18} color="#00897b" />
                  <Text style={styles.unifiedFlowTitle}>Một luồng đặt vé thống nhất</Text>
                </View>
                <Text style={styles.unifiedFlowDesc}>
                  Khi khách chuyển sang Vé du lịch, hệ thống sẽ giữ lịch, kiểm tra tồn, thanh toán và gửi QR theo cùng một quy trình.
                </Text>
              </View>

              {/* Trải nghiệm nổi bật */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <MaterialCommunityIcons name="star-shooting" size={20} color="#e65100" />
                  <Text style={styles.sectionBlockTitle}>Hoạt động & Trải nghiệm nổi bật</Text>
                </View>
                <View style={styles.activityList}>
                  {placeData.activities.map((act, idx) => (
                    <View key={idx} style={styles.activityItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#00897b" style={styles.activityIcon} />
                      <Text style={styles.activityText}>{act}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Tiện ích có sẵn */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="grid-outline" size={18} color="#00897b" />
                  <Text style={styles.sectionBlockTitle}>Tiện ích có sẵn</Text>
                </View>
                <View style={styles.facilityGrid}>
                  {placeData.facilities.map((fac, idx) => (
                    <View key={idx} style={styles.facilityCard}>
                      <Ionicons name={fac.icon} size={20} color="#00897b" />
                      <Text style={styles.facilityCardText}>{fac.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Chính sách & Lưu ý */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="information-circle-outline" size={20} color="#c2410c" />
                  <Text style={styles.sectionBlockTitle}>Chính sách & Lưu ý tham quan</Text>
                </View>
                <View style={styles.policyCard}>
                  {placeData.policies.map((pol, idx) => (
                    <View key={idx} style={styles.policyItem}>
                      <Text style={styles.policyBullet}>•</Text>
                      <Text style={styles.policyText}>{pol}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Vị trí & Bản đồ */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="map-outline" size={18} color="#00897b" />
                  <Text style={styles.sectionBlockTitle}>Vị trí & Đường đi</Text>
                </View>
                <View style={styles.locationCard}>
                  <View style={styles.locationInfoRow}>
                    <Ionicons name="navigate-circle" size={24} color="#00897b" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.locationNameText}>{placeData.name}</Text>
                      <Text style={styles.locationAddressText}>{placeData.address}</Text>
                    </View>
                  </View>
                  <Pressable style={styles.mapsBtn} onPress={handleOpenGoogleMaps}>
                    <Ionicons name="map" size={14} color="#ffffff" />
                    <Text style={styles.mapsBtnText}>Mở Google Maps chỉ đường</Text>
                  </Pressable>
                </View>
              </View>

            </View>
          )}

          {/* TAB 2 / VIEW: XEM VÉ VÀ LỊCH (Exact Match to Image 2) */}
          {activeTab === 'xem-ve' && (
            <View style={styles.ticketDetailSection}>
              
              {/* CARD 1: THÔNG TIN NHANH (Exact Match to Image 2) */}
              <View style={styles.quickInfoCard}>
                <View style={styles.quickInfoCardHeader}>
                  <View style={styles.clockCircleIcon}>
                    <Ionicons name="time" size={16} color="#ffffff" />
                  </View>
                  <Text style={styles.quickInfoCardTitle}>THÔNG TIN NHANH</Text>
                </View>

                <View style={styles.quickInfoContainer}>
                  {/* Item 1: GIỜ HOẠT ĐỘNG */}
                  <View style={styles.quickInfoRowItem}>
                    <View style={styles.quickInfoSquareIcon}>
                      <Ionicons name="time-outline" size={18} color="#00897b" />
                    </View>
                    <View style={styles.quickInfoTextCol}>
                      <Text style={styles.quickInfoLabel}>GIỜ HOẠT ĐỘNG</Text>
                      <Text style={styles.quickInfoValue}>{placeData.operatingHours}</Text>
                    </View>
                  </View>

                  {/* Item 2: KHU VỰC */}
                  <View style={styles.quickInfoRowItem}>
                    <View style={styles.quickInfoSquareIcon}>
                      <Ionicons name="location-outline" size={18} color="#00897b" />
                    </View>
                    <View style={styles.quickInfoTextCol}>
                      <Text style={styles.quickInfoLabel}>KHU VỰC</Text>
                      <Text style={styles.quickInfoValue}>{placeData.location}</Text>
                    </View>
                  </View>

                  {/* Item 3: LỊCH ĐANG MỞ */}
                  <View style={styles.quickInfoRowItem}>
                    <View style={styles.quickInfoSquareIcon}>
                      <Ionicons name="calendar-outline" size={18} color="#00897b" />
                    </View>
                    <View style={styles.quickInfoTextCol}>
                      <Text style={styles.quickInfoLabel}>LỊCH ĐANG MỞ</Text>
                      <Text style={styles.quickInfoValue}>{placeData.availableDates}</Text>
                    </View>
                  </View>

                  {/* Item 4: PHÙ HỢP */}
                  <View style={[styles.quickInfoRowItem, { borderBottomWidth: 0 }]}>
                    <View style={styles.quickInfoSquareIcon}>
                      <Ionicons name="people-outline" size={18} color="#00897b" />
                    </View>
                    <View style={styles.quickInfoTextCol}>
                      <Text style={styles.quickInfoLabel}>PHÙ HỢP</Text>
                      <Text style={styles.quickInfoValue}>{placeData.targetAudience}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* CARD 2: Chọn ngày sử dụng (Exact Match to Image 2) */}
              <View style={styles.datePickerCard}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Chọn ngày sử dụng</Text>
                  <View style={styles.instantConfirmBadge}>
                    <Text style={styles.instantConfirmText}>Xác nhận nhanh</Text>
                  </View>
                </View>
                <Text style={styles.datePickerSubtitle}>
                  Lịch mới đang được đơn vị vận hành cập nhật hàng ngày
                </Text>

                {/* Horizontal Date Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
                  {datesList.map((item) => {
                    const isSelected = selectedDate === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setSelectedDate(item.id)}
                        style={[styles.dateChip, isSelected && styles.dateChipActive]}
                      >
                        <Ionicons 
                          name="calendar" 
                          size={14} 
                          color={isSelected ? '#ffffff' : '#00897b'} 
                          style={{ marginBottom: 2 }}
                        />
                        <Text style={[styles.dateChipMain, isSelected && styles.dateChipMainActive]}>
                          {item.mainLabel}
                        </Text>
                        <Text style={[styles.dateChipSub, isSelected && styles.dateChipSubActive]}>
                          {item.subLabel}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* CARD 3: Loại vé / combo (Exact Match to Image 2) */}
              <View style={styles.ticketOptionsCard}>
                <Text style={styles.ticketSectionTitle}>Loại vé / combo</Text>
                
                <View style={styles.ticketList}>
                  {placeData.ticketTypes.map((ticket) => {
                    const isChecked = selectedTicketId === ticket.id;
                    return (
                      <Pressable
                        key={ticket.id}
                        onPress={() => setSelectedTicketId(ticket.id)}
                        style={[styles.ticketRadioCard, isChecked && styles.ticketRadioCardActive]}
                      >
                        <View style={styles.ticketRadioTop}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.ticketName, isChecked && styles.ticketNameActive]}>
                              {ticket.name}
                            </Text>
                            <Text style={styles.ticketPrice}>
                              Từ {ticket.price.toLocaleString('vi-VN')}đ
                            </Text>
                          </View>
                          
                          <View style={[styles.radioCircle, isChecked && styles.radioCircleActive]}>
                            {isChecked && (
                              <Ionicons name="checkmark" size={14} color="#ffffff" />
                            )}
                          </View>
                        </View>
                        <Text style={styles.ticketDescText}>{ticket.desc}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Quantity Stepper for Adult and Child */}
                <View style={styles.stepperContainer}>
                  <Text style={styles.stepperHeaderTitle}>Số lượng người tham quan</Text>
                  
                  {/* Adult */}
                  <View style={styles.stepperRow}>
                    <View>
                      <Text style={styles.stepperLabel}>Người lớn</Text>
                      <Text style={styles.stepperPriceNote}>{adultPrice.toLocaleString('vi-VN')}đ / người</Text>
                    </View>
                    <View style={styles.stepperControls}>
                      <Pressable 
                        onPress={() => setAdultCount(Math.max(1, adultCount - 1))}
                        style={styles.stepperBtn}
                      >
                        <Ionicons name="remove" size={16} color="#0f172a" />
                      </Pressable>
                      <Text style={styles.stepperCount}>{adultCount}</Text>
                      <Pressable 
                        onPress={() => setAdultCount(adultCount + 1)}
                        style={styles.stepperBtn}
                      >
                        <Ionicons name="add" size={16} color="#0f172a" />
                      </Pressable>
                    </View>
                  </View>

                  {/* Child */}
                  <View style={styles.stepperRow}>
                    <View>
                      <Text style={styles.stepperLabel}>Trẻ em (1m - 1m4)</Text>
                      <Text style={styles.stepperPriceNote}>{childPrice.toLocaleString('vi-VN')}đ / bé (-30%)</Text>
                    </View>
                    <View style={styles.stepperControls}>
                      <Pressable 
                        onPress={() => setChildCount(Math.max(0, childCount - 1))}
                        style={styles.stepperBtn}
                      >
                        <Ionicons name="remove" size={16} color="#0f172a" />
                      </Pressable>
                      <Text style={styles.stepperCount}>{childCount}</Text>
                      <Pressable 
                        onPress={() => setChildCount(childCount + 1)}
                        style={styles.stepperBtn}
                      >
                        <Ionicons name="add" size={16} color="#0f172a" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>

            </View>
          )}

        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar (When in Xem vé mode) */}
      {activeTab === 'xem-ve' ? (
        <View style={styles.bottomCheckoutBar}>
          <View>
            <Text style={styles.checkoutTotalLabel}>
              Tổng tiền ({adultCount + childCount} vé)
            </Text>
            <Text style={styles.checkoutTotalPrice}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <Pressable 
            style={styles.checkoutConfirmBtn}
            onPress={() => {
              setBookingSuccess(false);
              setIsBookingModalOpen(true);
            }}
          >
            <Text style={styles.checkoutConfirmBtnText}>TIẾP TỤC ĐẶT VÉ</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.bottomStickyBar}>
          <View>
            <Text style={styles.bottomPriceLabel}>Chi phí tham khảo</Text>
            <Text style={styles.bottomPriceVal}>{placeData.price}</Text>
          </View>
          <Pressable 
            style={styles.bottomActionBtn}
            onPress={() => setActiveTab('xem-ve')}
          >
            <Ionicons name="ticket-outline" size={16} color="#ffffff" />
            <Text style={styles.bottomActionBtnText}>Xem vé và lịch</Text>
          </Pressable>
        </View>
      )}

      {/* Fullscreen Photo Gallery Modal */}
      <Modal visible={isGalleryOpen} transparent animationType="fade">
        <View style={styles.galleryModalOverlay}>
          <View style={styles.galleryModalHeader}>
            <Text style={styles.galleryModalTitle}>Hình ảnh {placeData.name}</Text>
            <Pressable onPress={() => setIsGalleryOpen(false)} hitSlop={10}>
              <Ionicons name="close-circle" size={28} color="#ffffff" />
            </Pressable>
          </View>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {placeData.gallery.map((img, idx) => (
              <View key={idx} style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: img }} style={styles.modalImage} contentFit="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Checkout & QR Ticket Confirmation Modal */}
      <Modal visible={isBookingModalOpen} transparent animationType="slide">
        <View style={styles.bookingModalOverlay}>
          <View style={styles.bookingModalCard}>
            
            {bookingSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-done" size={36} color="#ffffff" />
                </View>
                <Text style={styles.successTitle}>ĐẶT VÉ THÀNH CÔNG!</Text>
                <Text style={styles.successSub}>
                  Mã vé điện tử đã được khởi tạo và gửi tin nhắn SMS xác nhận.
                </Text>

                {/* Ticket Pass Preview */}
                <View style={styles.qrTicketCard}>
                  <Text style={styles.qrTicketSpot}>{placeData.name}</Text>
                  <Text style={styles.qrTicketDate}>📅 Ngày: {selectedDate}</Text>
                  <Text style={styles.qrTicketType}>🎟️ {currentTicket.name}</Text>
                  <Text style={styles.qrTicketQty}>👥 Số lượng: {adultCount} Người lớn, {childCount} Trẻ em</Text>
                  <Text style={styles.qrTicketTotal}>💰 Tổng: {totalPrice.toLocaleString('vi-VN')}đ</Text>
                  
                  <View style={styles.qrBox}>
                    <Ionicons name="qr-code-outline" size={110} color="#0f172a" />
                    <Text style={styles.qrCodeText}>MÃ VÉ: ECO-{Math.floor(100000 + Math.random() * 900000)}</Text>
                  </View>
                  <Text style={styles.qrInstruction}>Xuất trình mã này tại quầy vé để vào cổng trực tiếp.</Text>
                </View>

                <Pressable 
                  style={styles.successCloseBtn}
                  onPress={() => {
                    setIsBookingModalOpen(false);
                    setActiveTab('tong-quan');
                  }}
                >
                  <Text style={styles.successCloseBtnText}>HOÀN TẤT & QUAY VỀ</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalHeading}>Thông tin đặt vé</Text>
                  <Pressable onPress={() => setIsBookingModalOpen(false)} hitSlop={10}>
                    <Ionicons name="close" size={22} color="#64748b" />
                  </Pressable>
                </View>

                <View style={styles.orderSummaryBox}>
                  <Text style={styles.orderSpotName}>{placeData.name}</Text>
                  <Text style={styles.orderDetailText}>📅 Ngày sử dụng: <Text style={{ fontWeight: '700' }}>{selectedDate}</Text></Text>
                  <Text style={styles.orderDetailText}>🎟️ {currentTicket.name}</Text>
                  <Text style={styles.orderDetailText}>👥 {adultCount} Người lớn, {childCount} Trẻ em</Text>
                  <View style={styles.orderTotalRow}>
                    <Text style={styles.orderTotalLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.orderTotalValue}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Họ và tên người nhận vé *</Text>
                  <TextInput
                    placeholder="VD: Nguyễn Văn A"
                    value={customerName}
                    onChangeText={setCustomerName}
                    style={styles.modalTextInput}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Số điện thoại nhận mã QR vé *</Text>
                  <TextInput
                    placeholder="VD: 0912345678"
                    keyboardType="phone-pad"
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                    style={styles.modalTextInput}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <Pressable 
                  style={styles.modalSubmitBtn}
                  onPress={handleConfirmBooking}
                >
                  <Text style={styles.modalSubmitBtnText}>XÁC NHẬN & NHẬN MÃ VÉ QR</Text>
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

  /* Hero Image Banner (Image 1) */
  heroImageContainer: { height: 230, width: '100%', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  viewAllPhotosBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  },
  viewAllPhotosText: { fontSize: 11, fontWeight: '700', color: '#00674f' },

  /* Sticky Tab Bar (Image 1) */
  tabBarWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBarScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabItem: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#00674f',
  },
  tabItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b'
  },
  tabItemTextActive: {
    color: '#00674f',
    fontWeight: '800'
  },
  ticketTabBtn: {
    backgroundColor: '#00674f',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6
  },
  ticketTabBtnActive: {
    backgroundColor: '#004d3b',
  },
  ticketTabBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  /* Content Body */
  contentBody: { padding: 16 },

  /* Overview section */
  overviewSection: { gap: 16 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14
  },
  tagBadgeText: { fontSize: 11, fontWeight: '700', color: '#00897b' },
  locBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14
  },
  locBadgeText: { fontSize: 11, fontWeight: '600', color: '#475569' },
  placeTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', lineHeight: 28 },
  placeDesc: { fontSize: 13, color: '#475569', lineHeight: 20 },

  /* Card: ĐẶT VÉ THAM QUAN (Exact Match to Image 1) */
  bookingNoticeCard: {
    backgroundColor: '#fdfaf6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    padding: 16,
    marginTop: 4
  },
  bookingNoticeBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#c2410c',
    letterSpacing: 0.8,
    marginBottom: 6
  },
  bookingNoticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00382b',
    lineHeight: 26,
    marginBottom: 8
  },
  bookingNoticeDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14
  },
  summaryBoxRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
  },
  summaryBoxLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4
  },
  summaryBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  summaryBoxValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#00382b',
  },
  viewTicketsMainBtn: {
    backgroundColor: '#00674f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 10,
  },
  viewTicketsMainBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  },

  /* Card: Một luồng đặt vé thống nhất (Exact Match to Image 1) */
  unifiedFlowCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 14,
    padding: 14,
  },
  unifiedFlowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  unifiedFlowTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065f46'
  },
  unifiedFlowDesc: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 17
  },

  /* Details Blocks */
  sectionBlock: { marginTop: 8 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  sectionBlockTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  activityList: { gap: 8 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10
  },
  activityIcon: { marginTop: 2 },
  activityText: { fontSize: 12, color: '#334155', flex: 1, lineHeight: 18 },

  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  facilityCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  facilityCardText: { fontSize: 11, color: '#334155', fontWeight: '600' },

  policyCard: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6
  },
  policyItem: { flexDirection: 'row', gap: 6 },
  policyBullet: { color: '#c2410c', fontWeight: 'bold' },
  policyText: { fontSize: 12, color: '#475569', flex: 1, lineHeight: 18 },

  locationCard: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10
  },
  locationInfoRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  locationNameText: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  locationAddressText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  mapsBtn: {
    backgroundColor: '#00897b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8
  },
  mapsBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  /* ------------------------------------------------------------- */
  /* TAB 2 / VIEW: XEM VÉ VÀ LỊCH (Exact Match to Image 2) */
  /* ------------------------------------------------------------- */
  ticketDetailSection: { gap: 16 },

  /* Card 1: THÔNG TIN NHANH */
  quickInfoCard: {
    backgroundColor: '#fdfaf6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    padding: 16,
  },
  quickInfoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14
  },
  clockCircleIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickInfoCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#c2410c',
    letterSpacing: 0.5
  },
  quickInfoContainer: {
    backgroundColor: '#f3ece3',
    borderRadius: 14,
    padding: 14,
    gap: 12
  },
  quickInfoRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ded4'
  },
  quickInfoSquareIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e6f7ef',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickInfoTextCol: { flex: 1 },
  quickInfoLabel: { fontSize: 9, fontWeight: '800', color: '#64748b', letterSpacing: 0.5, marginBottom: 2 },
  quickInfoValue: { fontSize: 13, fontWeight: '800', color: '#00382b' },

  /* Card 2: Chọn ngày sử dụng */
  datePickerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    padding: 16,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  datePickerTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  instantConfirmBadge: {
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12
  },
  instantConfirmText: { fontSize: 10, fontWeight: '800', color: '#00897b' },
  datePickerSubtitle: { fontSize: 11, color: '#64748b', marginBottom: 12 },
  dateScroll: { gap: 10, paddingVertical: 4 },
  dateChip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 70
  },
  dateChipActive: {
    backgroundColor: '#00674f',
    borderColor: '#00674f'
  },
  dateChipMain: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
  dateChipMainActive: { color: '#ffffff' },
  dateChipSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  dateChipSubActive: { color: '#86efac' },

  /* Card 3: Loại vé / combo */
  ticketOptionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    padding: 16,
  },
  ticketSectionTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  ticketList: { gap: 10, marginBottom: 16 },
  ticketRadioCard: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#ffffff'
  },
  ticketRadioCardActive: {
    borderColor: '#ea580c',
    backgroundColor: '#fffaf5'
  },
  ticketRadioTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  ticketName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  ticketNameActive: { color: '#c2410c' },
  ticketPrice: { fontSize: 13, fontWeight: '800', color: '#00897b', marginTop: 2 },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c'
  },
  ticketDescText: { fontSize: 11, color: '#64748b', lineHeight: 16 },

  /* Stepper */
  stepperContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    gap: 12
  },
  stepperHeaderTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10
  },
  stepperLabel: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  stepperPriceNote: { fontSize: 10, color: '#64748b', marginTop: 1 },
  stepperControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepperCount: { fontSize: 14, fontWeight: '800', color: '#0f172a', minWidth: 20, textAlign: 'center' },

  /* Sticky Bottom Bars */
  bottomStickyBar: {
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
  bottomPriceVal: { fontSize: 16, fontWeight: '900', color: '#00897b' },
  bottomActionBtn: {
    backgroundColor: '#00674f',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10
  },
  bottomActionBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },

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
  checkoutTotalLabel: { fontSize: 10, color: '#64748b', fontWeight: '600' },
  checkoutTotalPrice: { fontSize: 18, fontWeight: '900', color: '#00674f' },
  checkoutConfirmBtn: {
    backgroundColor: '#00674f',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10
  },
  checkoutConfirmBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },

  /* Gallery Modal */
  galleryModalOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  galleryModalHeader: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
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
    paddingBottom: 36,
    maxHeight: '85%'
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  modalHeading: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  orderSummaryBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
    marginBottom: 14
  },
  orderSpotName: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  orderDetailText: { fontSize: 11, color: '#475569' },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 6
  },
  orderTotalLabel: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  orderTotalValue: { fontSize: 15, fontWeight: '900', color: '#00897b' },

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
    color: '#0f172a'
  },
  modalSubmitBtn: {
    backgroundColor: '#00674f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6
  },
  modalSubmitBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },

  /* Success Screen */
  successContainer: { alignItems: 'center', paddingVertical: 10 },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00897b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  successTitle: { fontSize: 18, fontWeight: '900', color: '#00674f', marginBottom: 4 },
  successSub: { fontSize: 11, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  qrTicketCard: {
    width: '100%',
    backgroundColor: '#fdfaf6',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  qrTicketSpot: { fontSize: 13, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 6 },
  qrTicketDate: { fontSize: 11, color: '#475569', marginBottom: 2 },
  qrTicketType: { fontSize: 11, color: '#475569', marginBottom: 2 },
  qrTicketQty: { fontSize: 11, color: '#475569', marginBottom: 2 },
  qrTicketTotal: { fontSize: 13, fontWeight: '800', color: '#00897b', marginVertical: 6 },
  qrBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginVertical: 8
  },
  qrCodeText: { fontSize: 11, fontWeight: '800', color: '#0f172a', marginTop: 4 },
  qrInstruction: { fontSize: 10, color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' },
  successCloseBtn: {
    backgroundColor: '#00674f',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  successCloseBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' }
});
