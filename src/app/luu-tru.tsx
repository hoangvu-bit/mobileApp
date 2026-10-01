import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Keyboard,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useMemo, useRef } from 'react';
import { matchVietnameseSearch, removeVietnameseTones } from '../utils/vietnamese';

// Helper to remove Vietnamese accents and special characters
function normalizeText(text: string): string {
  if (!text) return '';
  return removeVietnameseTones(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const PROVINCES = [
  'Tất cả',
  'Tây Ninh',
  'Cần Thơ',
  'Đà Nẵng',
  'Kiên Giang',
  'Lào Cai',
  'Ninh Bình',
  'Lâm Đồng',
  'Bà Rịa - Vũng Tàu',
  'Hà Nội',
  'TP. Hồ Chí Minh',
];

const POPULAR_DESTINATIONS = [
  { id: 'tn', title: 'Tây Ninh', subtitle: 'Núi Bà Đen, Tòa Thánh Tây Ninh', province: 'Tây Ninh', isHotel: false },
  { id: 'dn', title: 'Đà Nẵng', subtitle: 'Bà Nà Hills, Cầu Rồng, Biển Mỹ Khê', province: 'Đà Nẵng', isHotel: false },
  { id: 'dl', title: 'Đà Lạt (Lâm Đồng)', subtitle: 'Thành phố ngàn hoa, Hồ Xuân Hương', province: 'Lâm Đồng', isHotel: false },
  { id: 'pq', title: 'Kiên Giang (Phú Quốc)', subtitle: 'Đảo ngọc Phú Quốc, Bãi Dài, Grand World', province: 'Kiên Giang', isHotel: false },
  { id: 'vt', title: 'Bà Rịa - Vũng Tàu', subtitle: 'Bãi Sau, Bãi Trước, Đảo Long Sơn', province: 'Bà Rịa - Vũng Tàu', isHotel: false },
  { id: 'nb', title: 'Ninh Bình', subtitle: 'Quần thể danh thắng Tràng An, Bái Đính', province: 'Ninh Bình', isHotel: false },
  { id: 'sp', title: 'Lào Cai (Sa Pa)', subtitle: 'Đỉnh Fansipan, Bản Cát Cát, Mường Hoa', province: 'Lào Cai', isHotel: false },
  { id: 'ct', title: 'Cần Thơ', subtitle: 'Bến Ninh Kiều, Chợ nổi Cái Răng', province: 'Cần Thơ', isHotel: false },
];

export default function LuuTruScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [searchText, setSearchText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Tất cả');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  
  // Search Suggestions State
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Date Range State
  const [datesText, setDatesText] = useState('Hôm nay - Ngày mai (1 đêm)');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('Hôm nay - Ngày mai (1 đêm)');
  const [checkInDay, setCheckInDay] = useState(0); // Offset days from today
  const [stayNights, setStayNights] = useState(1);

  // Guests & Rooms State
  const [guestsText, setGuestsText] = useState('2 người lớn, 1 phòng');
  const [isGuestsPickerOpen, setIsGuestsPickerOpen] = useState(false);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);

  // Generate 14-day selectable calendar list
  const calendarDays = useMemo(() => {
    const list = [];
    const today = new Date();
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      list.push({
        index: i,
        dayNum: dd,
        monthStr: mm,
        dayName: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : dayNames[d.getDay()],
        fullLabel: `${dd}/${mm}`,
      });
    }
    return list;
  }, []);

  // Filter Search Suggestions (Provinces & Hotels matching query)
  const searchSuggestions = useMemo(() => {
    const query = searchText.trim();
    if (!query) {
      return POPULAR_DESTINATIONS.slice(0, 6);
    }

    const results: { id: string; title: string; subtitle: string; province: string; isHotel: boolean }[] = [];

    // Match provinces
    PROVINCES.filter(p => p !== 'Tất cả').forEach((prov, idx) => {
      if (matchVietnameseSearch(prov, query)) {
        results.push({
          id: `prov-${idx}`,
          title: prov,
          subtitle: 'Tỉnh / Thành phố du lịch',
          province: prov,
          isHotel: false,
        });
      }
    });

    // Match hotels
    HOTELS.forEach((hotel) => {
      if (
        matchVietnameseSearch(hotel.name, query) ||
        matchVietnameseSearch(hotel.location, query) ||
        matchVietnameseSearch(hotel.province, query)
      ) {
        results.push({
          id: hotel.id,
          title: hotel.name,
          subtitle: `${hotel.province} • ★ ${hotel.rating || '4.8'} (${hotel.newPrice})`,
          province: hotel.province,
          isHotel: true,
        });
      }
    });

    return results.slice(0, 7);
  }, [searchText]);

  // Handle Suggestion Click
  const handleSelectSuggestion = (item: { title: string; province: string; isHotel: boolean }) => {
    Keyboard.dismiss();
    setIsSearchFocused(false);
    setSearchText(item.title);
    setAppliedQuery(item.title);

    if (!item.isHotel) {
      setSelectedProvince(item.province || item.title);
    } else {
      setSelectedProvince('Tất cả');
    }

    // Scroll down to hotel list
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 280, animated: true });
    }, 100);
  };

  // Handle Search Submission
  const handleSearch = () => {
    Keyboard.dismiss();
    setIsSearchFocused(false);
    const trimmed = searchText.trim();
    setAppliedQuery(trimmed);

    // Sync quick filter chip if input matches a province name
    const matchedProv = PROVINCES.find(
      (p) => p !== 'Tất cả' && matchVietnameseSearch(p, trimmed)
    );
    if (matchedProv) {
      setSelectedProvince(matchedProv);
    } else {
      setSelectedProvince('Tất cả');
    }

    // Smooth scroll down to hotel list
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 280, animated: true });
    }, 150);
  };

  // Quick Filter Chip Click
  const handleSelectProvince = (province: string) => {
    Keyboard.dismiss();
    setIsSearchFocused(false);
    setSelectedProvince(province);
    setOnlyDiscount(false);
    setSearchText('');
    setAppliedQuery('');

    // Smooth scroll down to results
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 280, animated: true });
    }, 100);
  };

  // Clear search and reset filters
  const handleClear = () => {
    Keyboard.dismiss();
    setIsSearchFocused(false);
    setSearchText('');
    setAppliedQuery('');
    setSelectedProvince('Tất cả');
    setOnlyDiscount(false);
  };

  // Apply Selected Dates from Modal
  const handleApplyDates = () => {
    const startDay = calendarDays[checkInDay] || calendarDays[0];
    const endDay = calendarDays[Math.min(checkInDay + stayNights, calendarDays.length - 1)] || calendarDays[1];
    setDatesText(`${startDay.fullLabel} - ${endDay.fullLabel} (${stayNights} đêm)`);
    setIsDatePickerOpen(false);
  };

  // Apply Quick Date Preset
  const handleApplyPreset = (presetName: string, startOffset: number, nights: number) => {
    setSelectedPreset(presetName);
    setCheckInDay(startOffset);
    setStayNights(nights);
    const startDay = calendarDays[startOffset] || calendarDays[0];
    const endDay = calendarDays[Math.min(startOffset + nights, calendarDays.length - 1)] || calendarDays[1];
    setDatesText(`${startDay.fullLabel} - ${endDay.fullLabel} (${nights} đêm)`);
    setIsDatePickerOpen(false);
  };

  // Apply Selected Guests from Modal
  const handleApplyGuests = () => {
    let text = `${adultsCount} người lớn`;
    if (childrenCount > 0) {
      text += `, ${childrenCount} trẻ em`;
    }
    text += `, ${roomsCount} phòng`;
    setGuestsText(text);
    setIsGuestsPickerOpen(false);
  };

  // Navigate to Hotel Detail Screen
  const handleViewHotel = (hotel: HotelItem) => {
    router.push({
      pathname: '/chi-tiet-khach-san',
      params: {
        hotelData: JSON.stringify(hotel),
      },
    });
  };

  // Active query used for keyword matching
  const activeQuery = appliedQuery.trim() || searchText.trim();

  // Strict & Accurate Filtering logic supporting unaccented search
  const filteredHotels = useMemo(() => {
    return HOTELS.filter((hotel) => {
      // 1. Discount filter
      if (onlyDiscount && !hotel.discount) {
        return false;
      }

      // 2. If user is searching with keywords in the search bar
      if (activeQuery) {
        return (
          matchVietnameseSearch(hotel.name, activeQuery) ||
          matchVietnameseSearch(hotel.location, activeQuery) ||
          matchVietnameseSearch(hotel.province, activeQuery) ||
          matchVietnameseSearch(hotel.roomType, activeQuery) ||
          matchVietnameseSearch(hotel.description, activeQuery)
        );
      }

      // 3. If user clicked a Quick Filter province
      if (selectedProvince !== 'Tất cả') {
        return (
          matchVietnameseSearch(hotel.province, selectedProvince) ||
          matchVietnameseSearch(hotel.location, selectedProvince)
        );
      }

      return true;
    });
  }, [activeQuery, selectedProvince, onlyDiscount]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Hero Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lưu trú du lịch</Text>
          <Text style={styles.headerSubtitle}>Khách sạn, homestay, resort và nơi nghỉ dưỡng phù hợp</Text>
        </View>

        {/* Search Form */}
        <View style={styles.searchSection}>
          <View style={styles.searchForm}>
            
            {/* Destination Search Input Group */}
            <View style={styles.searchInputGroup}>
              <Ionicons name="search" size={18} color="#168b58" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.searchLabel}>Tên tỉnh, thành phố hoặc khách sạn</Text>
                <TextInput
                  placeholder="Nhập tỉnh/thành (Tây Ninh, Đà Nẵng, Phú Quốc...)"
                  style={styles.searchInput}
                  placeholderTextColor="#94a3b8"
                  value={searchText}
                  onFocus={() => setIsSearchFocused(true)}
                  onChangeText={(val) => {
                    setSearchText(val);
                    setIsSearchFocused(true);
                    if (val === '') {
                      setAppliedQuery('');
                    }
                  }}
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                />
              </View>
              {searchText.length > 0 && (
                <Pressable onPress={handleClear} hitSlop={10} style={styles.clearBtn}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </Pressable>
              )}
            </View>

            {/* Floating Search Suggestions Dropdown (Requirement 1) */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionsHeader}>
                  <Text style={styles.suggestionsHeaderText}>
                    {searchText.trim() ? 'GỢI Ý PHÙ HỢP' : 'ĐỊA ĐIỂM DU LỊCH PHỔ BIẾN'}
                  </Text>
                  <Pressable onPress={() => setIsSearchFocused(false)} hitSlop={8}>
                    <Ionicons name="close" size={16} color="#64748b" />
                  </Pressable>
                </View>
                <ScrollView style={{ maxHeight: 210 }} keyboardShouldPersistTaps="always">
                  {searchSuggestions.map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(item)}
                    >
                      <View style={[styles.suggestionIconBox, item.isHotel && { backgroundColor: '#e0f2fe' }]}>
                        <Ionicons 
                          name={item.isHotel ? "bed" : "location-sharp"} 
                          size={15} 
                          color={item.isHotel ? "#0284c7" : "#168b58"} 
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.suggestionSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={14} color="#cbd5e1" />
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.separator} />

            {/* Check-in / Check-out & Guests Row (Requirement 2) */}
            <View style={styles.searchRow}>
              
              {/* Nhận - Trả phòng Selector */}
              <Pressable
                style={[styles.searchInputGroup, { flex: 1 }]}
                onPress={() => setIsDatePickerOpen(true)}
              >
                <Ionicons name="calendar-outline" size={17} color="#168b58" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.searchLabel}>Nhận - Trả phòng</Text>
                  <Text style={styles.searchText} numberOfLines={1}>{datesText}</Text>
                </View>
              </Pressable>

              {/* Khách & Phòng Selector */}
              <Pressable
                style={[styles.searchInputGroup, { flex: 1, marginLeft: 8 }]}
                onPress={() => setIsGuestsPickerOpen(true)}
              >
                <Ionicons name="people-outline" size={17} color="#168b58" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.searchLabel}>Khách & Phòng</Text>
                  <Text style={styles.searchText} numberOfLines={1}>{guestsText}</Text>
                </View>
              </Pressable>
            </View>

            {/* Search Action Button */}
            <Pressable style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={17} color="#fff" />
              <Text style={styles.searchButtonText}>Tìm phòng</Text>
            </Pressable>
          </View>

          {/* Quick Filter Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickFilters}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {PROVINCES.map((item, idx) => {
              const isActive =
                (selectedProvince === item && !activeQuery) ||
                (activeQuery && normalizeText(activeQuery) === normalizeText(item)) ||
                (item === 'Tất cả' && !activeQuery && selectedProvince === 'Tất cả');

              return (
                <Pressable
                  key={idx}
                  style={[styles.quickFilterItem, isActive && styles.quickFilterItemActive]}
                  onPress={() => handleSelectProvince(item)}
                >
                  <Text style={[styles.quickFilterItemText, isActive && styles.quickFilterItemTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Special Offer Banner */}
          <View style={styles.offerBanner}>
            <Ionicons name="pricetag" size={22} color="#168b58" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.offerBannerTitle}>Ưu đãi khách sạn đến 20%</Text>
              <Text style={styles.offerBannerSub}>Khám phá các nơi lưu trú giá ưu đãi nhất</Text>
            </View>
            <Pressable
              style={[styles.offerBannerBtn, onlyDiscount && { backgroundColor: '#c85a32' }]}
              onPress={() => setOnlyDiscount(!onlyDiscount)}
            >
              <Text style={styles.offerBannerBtnText}>
                {onlyDiscount ? 'Xem tất cả' : 'Xem ngay'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* List of Hotels */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listSubTitle}>
                {activeQuery
                  ? `Kết quả tìm kiếm "${activeQuery}"`
                  : selectedProvince !== 'Tất cả'
                  ? `Khách sạn tại ${selectedProvince}`
                  : 'Khám phá chỗ nghỉ'}
              </Text>
              <Text style={styles.listTitle}>
                {filteredHotels.length} chỗ nghỉ {activeQuery || selectedProvince !== 'Tất cả' ? `phù hợp` : `nổi bật`}
              </Text>
            </View>
            {(activeQuery !== '' || selectedProvince !== 'Tất cả' || onlyDiscount) && (
              <Pressable style={styles.filterBtn} onPress={handleClear}>
                <Ionicons name="refresh" size={14} color="#0f2b28" />
                <Text style={styles.filterBtnText}>Đặt lại</Text>
              </Pressable>
            )}
          </View>

          {filteredHotels.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Không tìm thấy khách sạn</Text>
              <Text style={styles.emptyStateText}>
                Không có khách sạn nào phù hợp với từ khóa "{activeQuery || selectedProvince}". Bạn hãy thử tìm tỉnh/thành khác như Tây Ninh, Đà Nẵng, Cần Thơ, Sa Pa, Phú Quốc nhé!
              </Text>
              <Pressable style={styles.resetBtn} onPress={handleClear}>
                <Text style={styles.resetBtnText}>Xem tất cả khách sạn</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.hotelGrid}>
              {filteredHotels.map((hotel, idx) => (
                <Pressable
                  key={idx}
                  style={styles.hotelCard}
                  onPress={() => handleViewHotel(hotel)}
                >
                  <View style={styles.hotelImageContainer}>
                    <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                    <View style={styles.hotelBadgeCount}>
                      <Ionicons name="camera" size={12} color="#fff" />
                      <Text style={styles.hotelBadgeCountText}>{hotel.imageCount} ảnh</Text>
                    </View>
                    {hotel.discount && (
                      <View style={styles.discountFloatingBadge}>
                        <Text style={styles.discountFloatingBadgeText}>{hotel.discount}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.hotelContent}>
                    <View style={styles.hotelTagsRow}>
                      <Text style={styles.tagPrimary}>Mới trên iGovi</Text>
                      <Text style={styles.tagSecondary}>★ {hotel.rating || '4.8'} Google Maps</Text>
                    </View>

                    <Text style={styles.hotelName} numberOfLines={2}>{hotel.name}</Text>
                    <View style={styles.hotelLocationRow}>
                      <Ionicons name="location-sharp" size={12} color="#168b58" />
                      <Text style={styles.hotelLocation}>{hotel.location}</Text>
                    </View>

                    <View style={styles.hotelRoomInfo}>
                      <Text style={styles.roomType}>{hotel.roomType}</Text>
                      <Text style={styles.roomDesc}>{hotel.guests} • {hotel.size} • {hotel.bed}</Text>
                    </View>

                    <View style={styles.hotelAmenities}>
                      {hotel.amenities.map((amenity, aIdx) => (
                        <Text key={aIdx} style={styles.amenityText}>✓ {amenity}</Text>
                      ))}
                    </View>
                  </View>

                  <View style={styles.hotelFooter}>
                    <View>
                      {hotel.discount && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountBadgeText}>Ưu đãi {hotel.discount}</Text>
                        </View>
                      )}
                      <Text style={styles.oldPrice}>{hotel.oldPrice}</Text>
                      <Text style={styles.newPrice}>{hotel.newPrice}</Text>
                      <Text style={styles.priceDesc}>/ phòng / đêm</Text>
                    </View>
                    <Pressable
                      style={styles.bookBtn}
                      onPress={() => handleViewHotel(hotel)}
                    >
                      <Text style={styles.bookBtnText}>Xem phòng</Text>
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Date Range Picker Modal (Requirement 2) */}
      <Modal visible={isDatePickerOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBottomSheet}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Chọn ngày nhận & trả phòng</Text>
                <Text style={styles.modalSubtitle}>Nhận phòng từ 14:00 • Trả phòng trước 12:00</Text>
              </View>
              <Pressable onPress={() => setIsDatePickerOpen(false)} hitSlop={10} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color="#64748b" />
              </Pressable>
            </View>

            {/* Quick Presets */}
            <Text style={styles.sectionLabel}>LỰA CHỌN NHANH:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll} contentContainerStyle={{ gap: 8 }}>
              {[
                { label: 'Hôm nay - Ngày mai (1 đêm)', offset: 0, nights: 1 },
                { label: 'Ngày mai - Ngày kia (1 đêm)', offset: 1, nights: 1 },
                { label: 'Cuối tuần này (T7 - CN, 1 đêm)', offset: 4, nights: 1 },
                { label: 'Cuối tuần (T6 - CN, 2 đêm)', offset: 3, nights: 2 },
                { label: '3 ngày 2 đêm', offset: 0, nights: 2 },
                { label: '4 ngày 3 đêm', offset: 0, nights: 3 },
              ].map((p, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.presetChip, selectedPreset === p.label && styles.presetChipActive]}
                  onPress={() => handleApplyPreset(p.label, p.offset, p.nights)}
                >
                  <Text style={[styles.presetChipText, selectedPreset === p.label && styles.presetChipTextActive]}>
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* 14-day Calendar Grid */}
            <Text style={[styles.sectionLabel, { marginTop: 14 }]}>CHỌN NGÀY TRỰC QUAN (14 NGÀY TỚI):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarDayList}>
              {calendarDays.map((item) => {
                const isCheckIn = checkInDay === item.index;
                const isCheckOut = checkInDay + stayNights === item.index;
                const isInRange = item.index > checkInDay && item.index < checkInDay + stayNights;

                return (
                  <Pressable
                    key={item.index}
                    style={[
                      styles.calendarDayCard,
                      (isCheckIn || isCheckOut) && styles.calendarDayCardActive,
                      isInRange && styles.calendarDayCardInRange
                    ]}
                    onPress={() => {
                      setSelectedPreset('');
                      if (item.index < checkInDay || item.index === checkInDay) {
                        setCheckInDay(item.index);
                        setStayNights(1);
                      } else {
                        setStayNights(item.index - checkInDay);
                      }
                    }}
                  >
                    <Text style={[
                      styles.calendarDayName, 
                      (isCheckIn || isCheckOut) && styles.calendarDayNameActive,
                      isInRange && { color: '#168b58' }
                    ]}>
                      {item.dayName}
                    </Text>
                    <Text style={[
                      styles.calendarDayNum, 
                      (isCheckIn || isCheckOut) && styles.calendarDayNumActive,
                      isInRange && { color: '#168b58', fontWeight: '800' }
                    ]}>
                      {item.dayNum}
                    </Text>
                    <Text style={[
                      styles.calendarMonthText,
                      (isCheckIn || isCheckOut) && { color: '#ffffff' }
                    ]}>
                      Th.{item.monthStr}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Summary Box */}
            <View style={styles.dateSummaryBox}>
              <View style={styles.dateSummaryCol}>
                <Text style={styles.dateSummaryLabel}>NHẬN PHÒNG (14:00)</Text>
                <Text style={styles.dateSummaryVal}>
                  {calendarDays[checkInDay]?.fullLabel || 'Hôm nay'}
                </Text>
              </View>
              <View style={styles.dateSummaryCenter}>
                <Ionicons name="moon" size={14} color="#168b58" />
                <Text style={styles.dateSummaryNights}>{stayNights} đêm</Text>
              </View>
              <View style={[styles.dateSummaryCol, { alignItems: 'flex-end' }]}>
                <Text style={styles.dateSummaryLabel}>TRẢ PHÒNG (12:00)</Text>
                <Text style={styles.dateSummaryVal}>
                  {calendarDays[Math.min(checkInDay + stayNights, calendarDays.length - 1)]?.fullLabel || 'Ngày mai'}
                </Text>
              </View>
            </View>

            {/* Confirm Button */}
            <Pressable style={styles.modalApplyBtn} onPress={handleApplyDates}>
              <Text style={styles.modalApplyBtnText}>ÁP DỤNG NGÀY NÀY</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Guests & Rooms Selector Modal (Requirement 2) */}
      <Modal visible={isGuestsPickerOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBottomSheet}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Chọn số lượng khách & phòng</Text>
                <Text style={styles.modalSubtitle}>Để nhận báo giá và gợi ý loại phòng phù hợp nhất</Text>
              </View>
              <Pressable onPress={() => setIsGuestsPickerOpen(false)} hitSlop={10} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color="#64748b" />
              </Pressable>
            </View>

            {/* Steppers */}
            <View style={styles.stepperContainer}>
              
              {/* Adults */}
              <View style={styles.stepperRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepperTitle}>Người lớn</Text>
                  <Text style={styles.stepperSubtitle}>Từ 18 tuổi trở lên</Text>
                </View>
                <View style={styles.stepperControls}>
                  <Pressable 
                    style={[styles.stepperBtn, adultsCount <= 1 && styles.stepperBtnDisabled]}
                    onPress={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                    disabled={adultsCount <= 1}
                  >
                    <Ionicons name="remove" size={18} color={adultsCount <= 1 ? '#cbd5e1' : '#0f172a'} />
                  </Pressable>
                  <Text style={styles.stepperValueText}>{adultsCount}</Text>
                  <Pressable 
                    style={[styles.stepperBtn, adultsCount >= 10 && styles.stepperBtnDisabled]}
                    onPress={() => setAdultsCount(Math.min(10, adultsCount + 1))}
                    disabled={adultsCount >= 10}
                  >
                    <Ionicons name="add" size={18} color={adultsCount >= 10 ? '#cbd5e1' : '#0f172a'} />
                  </Pressable>
                </View>
              </View>

              {/* Children */}
              <View style={styles.stepperRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepperTitle}>Trẻ em</Text>
                  <Text style={styles.stepperSubtitle}>0 - 17 tuổi đi cùng</Text>
                </View>
                <View style={styles.stepperControls}>
                  <Pressable 
                    style={[styles.stepperBtn, childrenCount <= 0 && styles.stepperBtnDisabled]}
                    onPress={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                    disabled={childrenCount <= 0}
                  >
                    <Ionicons name="remove" size={18} color={childrenCount <= 0 ? '#cbd5e1' : '#0f172a'} />
                  </Pressable>
                  <Text style={styles.stepperValueText}>{childrenCount}</Text>
                  <Pressable 
                    style={[styles.stepperBtn, childrenCount >= 6 && styles.stepperBtnDisabled]}
                    onPress={() => setChildrenCount(Math.min(6, childrenCount + 1))}
                    disabled={childrenCount >= 6}
                  >
                    <Ionicons name="add" size={18} color={childrenCount >= 6 ? '#cbd5e1' : '#0f172a'} />
                  </Pressable>
                </View>
              </View>

              {/* Rooms */}
              <View style={[styles.stepperRow, { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepperTitle}>Số phòng nghỉ</Text>
                  <Text style={styles.stepperSubtitle}>Số lượng phòng cần đặt</Text>
                </View>
                <View style={styles.stepperControls}>
                  <Pressable 
                    style={[styles.stepperBtn, roomsCount <= 1 && styles.stepperBtnDisabled]}
                    onPress={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                    disabled={roomsCount <= 1}
                  >
                    <Ionicons name="remove" size={18} color={roomsCount <= 1 ? '#cbd5e1' : '#0f172a'} />
                  </Pressable>
                  <Text style={styles.stepperValueText}>{roomsCount}</Text>
                  <Pressable 
                    style={[styles.stepperBtn, roomsCount >= 5 && styles.stepperBtnDisabled]}
                    onPress={() => setRoomsCount(Math.min(5, roomsCount + 1))}
                    disabled={roomsCount >= 5}
                  >
                    <Ionicons name="add" size={18} color={roomsCount >= 5 ? '#cbd5e1' : '#0f172a'} />
                  </Pressable>
                </View>
              </View>

            </View>

            {/* Confirm Button */}
            <Pressable style={styles.modalApplyBtn} onPress={handleApplyGuests}>
              <Text style={styles.modalApplyBtnText}>XÁC NHẬN SỐ KHÁCH & PHÒNG</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}

export interface HotelItem {
  id: string;
  name: string;
  province: string;
  location: string;
  roomType: string;
  guests: string;
  size: string;
  bed: string;
  oldPrice: string;
  newPrice: string;
  discount?: string;
  imageCount: number;
  image: string;
  gallery: string[];
  rating: string;
  reviewsCount: number;
  phone: string;
  description: string;
  amenities: string[];
  rooms?: any[];
}

// Accurate and robust search matching function
function matchesHotel(hotel: HotelItem, rawQuery: string): boolean {
  if (!rawQuery) return true;
  const q = normalizeText(rawQuery);
  if (!q) return true;

  const normName = normalizeText(hotel.name);
  const normLoc = normalizeText(hotel.location);
  const normProv = normalizeText(hotel.province);
  const normRoom = normalizeText(hotel.roomType);
  const fullText = `${normName} ${normLoc} ${normProv} ${normRoom}`;

  // 1. Direct contains check (exact substring match)
  if (
    normName.includes(q) ||
    normLoc.includes(q) ||
    normProv.includes(q) ||
    normRoom.includes(q)
  ) {
    return true;
  }

  // 2. Query contains exact province name (e.g. user typed "khách sạn ở đà nẵng", "tỉnh kiên giang", "resort tây ninh")
  if (q.includes(normProv)) {
    return true;
  }

  // 3. Known Popular Destination Aliases
  const aliasMap: { [province: string]: string[] } = {
    'kien giang': ['phu quoc', 'duong dong', 'an thoi', 'bai dai', 'bai truong', 'hon thom', 'rach gia', 'ha tien'],
    'lao cai': ['sa pa', 'sapa', 'fansipan', 'muong hoa'],
    'lam dong': ['da lat', 'dalat', 'tuyen lam', 'langbiang', 'bao loc'],
    'ba ria - vung tau': ['vung tau', 'ho tram', 'long hai', 'con dao'],
    'da nang': ['da nang', 'danang', 'my khe', 'son tra', 'ba na'],
    'tay ninh': ['tay ninh', 'go dau', 'nui ba den', 'toa thanh', 'trang bang'],
    'can tho': ['can tho', 'ninh kieu', 'song hau', 'cai rang'],
    'ninh binh': ['ninh binh', 'trang an', 'tam coc', 'hoa lu', 'van long', 'bai dinh'],
    'ha noi': ['ha noi', 'hanoi', 'hoan kiem', 'ba dinh', 'tay ho'],
    'tp. ho chi minh': ['ho chi minh', 'hcm', 'tphcm', 'sai gon', 'saigon', 'quan 1', 'quan 3', 'ben thanh', 'nguyen hue'],
  };

  const aliases = aliasMap[normProv] || [];
  for (const alias of aliases) {
    if (q.includes(alias)) {
      return true;
    }
  }

  // 4. Token-based matching (ALL meaningful words in search query must exist in hotel info)
  const stopWords = new Set([
    'tinh',
    'tp',
    'thanh',
    'pho',
    'khach',
    'san',
    'ks',
    'resort',
    'homestay',
    'hotel',
    'o',
    'tai',
    'gan',
    'khu',
    'vuc',
    'du',
    'lich',
    'gia',
    're',
    'dep',
    'tot',
    'view',
  ]);
  const tokens = q.split(/\s+/).filter((w) => w.length >= 2 && !stopWords.has(w));

  if (tokens.length > 0) {
    const allTokensMatch = tokens.every((token) => fullText.includes(token));
    if (allTokensMatch) {
      return true;
    }
  }

  return false;
}

const HOTELS: HotelItem[] = [
  // 1. Tây Ninh
  {
    id: 'tn-1',
    name: 'Resort Vườn Cau Tây Ninh - Bình yên thôn quê',
    province: 'Tây Ninh',
    location: 'Ấp Phước Đức A, Xã Phước Đông, Gò Dầu, Tây Ninh',
    roomType: 'Garden View Villa',
    guests: '2 người lớn, 2 trẻ em',
    size: '45 m²',
    bed: '1 giường đôi lớn & 1 đơn',
    oldPrice: '1.100.000 đ',
    newPrice: '880.000 đ',
    discount: '-20%',
    imageCount: 31,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.7',
    reviewsCount: 185,
    phone: '0276 385 6789',
    description: 'Khu nghỉ dưỡng sinh thái Vườn Cau mang đậm phong vị làng quê Nam Bộ yên bình với khuôn viên vườn cây xanh mát, hồ bơi ngoài trời và các căn villa riêng tư. Nơi lý tưởng để thư giãn cuối tuần gần TP.HCM và Tây Ninh.',
    amenities: ['Linh hoạt trước 72h', 'Dọn phòng', 'Wi-Fi miễn phí', 'Hồ bơi ngoài trời', 'Bữa sáng theo yêu cầu', 'Chỗ đỗ xe miễn phí'],
    rooms: [
      {
        id: 'r-tn1-1',
        name: 'Garden View Villa',
        size: '45 m²',
        maxGuests: '2 người lớn, 2 trẻ em',
        bed: '1 giường đôi King & 1 đơn',
        price: '880.000 đ',
        priceNum: 880000,
        images: [
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['View sân vườn', 'Ban công riêng', 'Điều hòa', 'Minibar'],
        policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
      {
        id: 'r-tn1-2',
        name: 'Family Poolside Bungalow',
        size: '60 m²',
        maxGuests: '4 người lớn',
        bed: '2 giường đôi lớn',
        price: '1.350.000 đ',
        priceNum: 1350000,
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['Cạnh hồ bơi', 'Bồn tắm gỗ', 'Bữa sáng miễn phí'],
        policies: ['4 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
    ],
  },
  {
    id: 'tn-2',
    name: 'Mekong Tani Hotel - Chuẩn 4 Sao Trung Tâm',
    province: 'Tây Ninh',
    location: 'Số 125 Hoàng Lê Kha, Phường 3, TP. Tây Ninh, Tây Ninh',
    roomType: 'Deluxe Double City View',
    guests: '2 người lớn',
    size: '35 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '950.000 đ',
    newPrice: '750.000 đ',
    discount: '-21%',
    imageCount: 24,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 240,
    phone: '0276 388 9999',
    description: 'Mekong Tani Hotel nằm ngay trục đường trung tâm sầm uất của TP. Tây Ninh, thuận tiện đến Núi Bà Đen và Tòa Thánh Cao Đài. Phòng ốc trang bị hiện đại, hồ bơi trên cao và buffet sáng tiêu chuẩn 4 sao.',
    amenities: ['Bữa sáng miễn phí', 'Hồ bơi', 'Wi-Fi tốc độ cao', 'Phòng Gym', 'Chỗ đỗ xe', 'Lễ tân 24/7'],
    rooms: [
      {
        id: 'r-tn2-1',
        name: 'Business Queen',
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
        id: 'r-tn2-2',
        name: 'Deluxe King City View',
        size: '35 m²',
        maxGuests: 'Tối đa 2 người lớn, 1 trẻ em',
        bed: '1 giường King Size lớn',
        price: '1.150.000đ',
        priceNum: 1150000,
        images: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['View thành phố', 'Bồn tắm nằm', 'Ban công thoáng mát', 'Bữa sáng miễn phí'],
        policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
    ],
  },
  {
    id: 'tn-3',
    name: 'Melia Vinpearl Tây Ninh - Đẳng cấp 5 Sao',
    province: 'Tây Ninh',
    location: 'Số 90 Đường Lê Duẩn, Phường 3, TP. Tây Ninh',
    roomType: 'Executive Suite Panorama',
    guests: '2 người lớn, 1 trẻ em',
    size: '52 m²',
    bed: '1 giường King Size',
    oldPrice: '1.800.000 đ',
    newPrice: '1.450.000 đ',
    discount: '-19%',
    imageCount: 42,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 520,
    phone: '0276 372 8888',
    description: 'Tòa khách sạn cao nhất Tây Ninh với tầm nhìn 360 độ ngắm trọn Núi Bà Đen hùng vĩ. Dịch vụ chuẩn quốc tế của tập đoàn Melia Hotels International mang đến trải nghiệm thượng lưu không thể quên.',
    amenities: ['View Núi Bà Đen', 'Spa & Massage', 'Bể bơi 4 mùa', 'Nhà hàng Á - Âu', 'Sky Lounge tầng 21'],
    rooms: [
      {
        id: 'r-tn3-1',
        name: 'Deluxe King Mountain View',
        size: '38 m²',
        maxGuests: '2 người lớn, 1 trẻ em',
        bed: '1 giường King Size',
        price: '1.450.000 đ',
        priceNum: 1450000,
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['Trực diện Núi Bà Đen', 'Bồn tắm kính', 'Buffet sáng quốc tế'],
        policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
      {
        id: 'r-tn3-2',
        name: 'Executive Suite Panorama',
        size: '52 m²',
        maxGuests: '2 người lớn, 2 trẻ em',
        bed: '1 giường King Size siêu lớn',
        price: '2.100.000 đ',
        priceNum: 2100000,
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['Phòng khách riêng', 'Đặc quyền Executive Lounge', 'Trà chiều miễn phí'],
        policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
    ],
  },
  {
    id: 'tn-4',
    name: 'Sunrise Hotel Tây Ninh - Trung tâm Thành Phố',
    province: 'Tây Ninh',
    location: 'Số 81 Hoàng Lê Kha, Phường 3, TP. Tây Ninh',
    roomType: 'Superior King Room',
    guests: '2 người lớn',
    size: '30 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '750.000 đ',
    newPrice: '620.000 đ',
    discount: '-17%',
    imageCount: 18,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.6',
    reviewsCount: 120,
    phone: '0276 371 4567',
    description: 'Khách sạn đạt tiêu chuẩn 3 sao với vị trí thuận lợi, giá cả phải chăng, phòng ốc sạch sẽ, nhân viên phục vụ tận tình.',
    amenities: ['Gần Toà Thánh Tây Ninh', 'Chỗ đỗ xe miễn phí', 'Wi-Fi miễn phí', 'Điều hòa', 'Thang máy'],
  },

  // 2. Kiên Giang / Phú Quốc
  {
    id: 'kg-1',
    name: 'Premier Village Phu Quoc Resort - Mũi Ông Đội',
    province: 'Kiên Giang',
    location: 'Mũi Ông Đội, An Thới, TP. Phú Quốc, Kiên Giang',
    roomType: 'Island Villa Private Pool',
    guests: '4 người lớn, 2 trẻ em',
    size: '120 m²',
    bed: '2 phòng ngủ (2 giường King)',
    oldPrice: '6.000.000 đ',
    newPrice: '4.800.000 đ',
    discount: '-20%',
    imageCount: 45,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 680,
    phone: '0297 354 6666',
    description: 'Tọa lạc tại Mũi Ông Đội - dải đất hai mặt biển độc nhất vô nhị ở Phú Quốc, nơi bạn có thể ngắm cả bình minh và hoàng hôn tại cùng một vị trí. Hệ thống villa sang trọng với bể bơi riêng biệt lập.',
    amenities: ['Hồ bơi riêng từng căn', 'Ngắm bình minh & hoàng hôn', 'Đưa đón sân bay VIP', 'Bãi biển riêng tư', 'Plumeria Spa'],
    rooms: [
      {
        id: 'r-kg1-1',
        name: 'Island Villa Private Pool',
        size: '120 m²',
        maxGuests: '4 người lớn, 2 trẻ em',
        bed: '2 phòng ngủ (2 giường King)',
        price: '4.800.000 đ',
        priceNum: 4800000,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['Hồ bơi riêng', 'Phòng khách & bếp', 'Bồn tắm view biển', 'Quản gia'],
        policies: ['4 người lớn / villa', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
    ],
  },
  {
    id: 'kg-2',
    name: 'Sunset Beach Resort & Spa Phú Quốc',
    province: 'Kiên Giang',
    location: 'Số 100C/2 Trần Hưng Đạo, Dương Đông, Phú Quốc, Kiên Giang',
    roomType: 'Deluxe Sea View Balcony',
    guests: '2 người lớn',
    size: '36 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '1.950.000 đ',
    newPrice: '1.550.000 đ',
    discount: '-20%',
    imageCount: 32,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 390,
    phone: '0297 356 7890',
    description: 'Resort sát biển tại trung tâm Dương Đông với Sunset Bar sôi động ngắm trọn hoàng hôn tuyệt đẹp của đảo ngọc Phú Quốc.',
    amenities: ['Sunset Bar trên bãi biển', 'Hồ bơi trong nhà & ngoài trời', 'Gần chợ đêm', 'Bữa sáng buffet', 'Spa'],
    rooms: [
      {
        id: 'r-kg2-1',
        name: 'Deluxe Sea View Balcony',
        size: '36 m²',
        maxGuests: '2 người lớn',
        bed: '1 giường Queen lớn',
        price: '1.550.000 đ',
        priceNum: 1550000,
        images: [
          'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['Ban công ngắm biển', 'Bồn tắm', 'Trà & cà phê miễn phí'],
        policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
    ],
  },
  {
    id: 'kg-3',
    name: 'Sol by Meliá Phú Quốc - Bãi Trường',
    province: 'Kiên Giang',
    location: 'Khu du lịch Đức Việt, Bãi Trường, Dương Tơ, Phú Quốc, Kiên Giang',
    roomType: 'Standard Room Sea View',
    guests: '2 người lớn',
    size: '34 m²',
    bed: '1 giường King hoặc 2 giường đơn',
    oldPrice: '2.400.000 đ',
    newPrice: '1.950.000 đ',
    discount: '-19%',
    imageCount: 35,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 410,
    phone: '0297 386 9999',
    description: 'Resort mang phong cách Địa Trung Hải trẻ trung, tọa lạc tại Bãi Trường yên tĩnh với bãi cát dài trắng mịn.',
    amenities: ['Bãi biển riêng Bãi Trường', 'Hồ bơi tự do', 'Beach Club', 'Yoga buổi sáng', 'Xe đạp miễn phí'],
  },
  {
    id: 'kg-4',
    name: 'Vinpearl Resort & Spa Phú Quốc - Bãi Dài',
    province: 'Kiên Giang',
    location: 'Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang',
    roomType: 'Deluxe Garden View Room',
    guests: '2 người lớn, 2 trẻ em',
    size: '46 m²',
    bed: '1 giường King Size',
    oldPrice: '3.200.000 đ',
    newPrice: '2.600.000 đ',
    discount: '-18%',
    imageCount: 48,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 890,
    phone: '0297 355 5555',
    description: 'Khu phức hợp nghỉ dưỡng cao cấp nằm cạnh VinWonders và Vinpearl Safari với công viên nước, bãi biển riêng và sân golf 18 lỗ.',
    amenities: ['Gần VinWonders & Safari', 'Hồ bơi rộng 5.000m²', 'Akoya Spa trên mặt hồ', 'Xe buýt đưa đón'],
  },

  // 3. Đà Nẵng
  {
    id: 'dn-1',
    name: 'InterContinental Danang Sun Peninsula Resort',
    province: 'Đà Nẵng',
    location: 'Bãi Bắc, Bán đảo Sơn Trà, TP. Đà Nẵng',
    roomType: 'Classic Ocean View Villa',
    guests: '2 người lớn, 2 trẻ em',
    size: '70 m²',
    bed: '1 giường King Size siêu lớn',
    oldPrice: '9.200.000 đ',
    newPrice: '7.500.000 đ',
    discount: '-18%',
    imageCount: 50,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 950,
    phone: '0236 393 8888',
    description: 'Kiệt tác kiến trúc của KTS lừng danh Bill Bensley ẩn mình giữa thiên nhiên hoang sơ của Bán đảo Sơn Trà. Khu nghỉ dưỡng nhiều lần được vinh danh là sang trọng bậc nhất thế giới.',
    amenities: ['Bãi biển riêng tư', 'Cáp treo ngắm cảnh', 'Nhà hàng sao Michelin La Maison 1888', 'HARNN Heritage Spa', 'Club InterContinental Lounge'],
    rooms: [
      {
        id: 'r-dn1-1',
        name: 'Classic Ocean View Villa',
        size: '70 m²',
        maxGuests: '2 người lớn, 2 trẻ em',
        bed: '1 giường King Size siêu lớn',
        price: '7.500.000 đ',
        priceNum: 7500000,
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['View biển Sơn Trà', 'Bồn tắm đá cẩm thạch', 'Ban công siêu rộng', 'Cáp treo nội bộ'],
        policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
    ],
  },
  {
    id: 'dn-2',
    name: 'TMS Hotel Da Nang Beach - Trực diện Biển Mỹ Khê',
    province: 'Đà Nẵng',
    location: 'Số 292 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng',
    roomType: 'Premier Ocean Front Double',
    guests: '2 người lớn',
    size: '36 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '1.800.000 đ',
    newPrice: '1.400.000 đ',
    discount: '-22%',
    imageCount: 30,
    image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 510,
    phone: '0236 375 5999',
    description: 'Nằm ngay mặt đường biển Võ Nguyên Giáp, TMS Hotel sở hữu bể bơi vô cực đáy kính tầng 25 cao nhất Đà Nẵng với tầm nhìn bao quát toàn bộ vịnh biển.',
    amenities: ['Bể bơi vô cực tầng 25', 'Bữa sáng chuẩn quốc tế', 'Đưa đón sân bay', 'Mélange Spa', 'Magic Lounge'],
    rooms: [
      {
        id: 'r-dn2-1',
        name: 'Premier Ocean Front Double',
        size: '36 m²',
        maxGuests: '2 người lớn',
        bed: '1 giường Queen lớn',
        price: '1.400.000 đ',
        priceNum: 1400000,
        images: [
          'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['Ban công hướng biển Mỹ Khê', 'Bồn tắm nằm', 'Buffet sáng'],
        policies: ['2 người lớn / phòng', 'Linh hoạt trước 72 giờ', 'Đặt trực tuyến', 'Tối thiểu 1 đêm'],
      },
    ],
  },
  {
    id: 'dn-3',
    name: 'Sala Danang Beach Hotel - View Biển Mỹ Khê',
    province: 'Đà Nẵng',
    location: 'Số 36 Lâm Hoành, Phước Mỹ, Sơn Trà, Đà Nẵng',
    roomType: 'Superior Partial Ocean View',
    guests: '2 người lớn',
    size: '32 m²',
    bed: '1 giường đôi hoặc 2 đơn',
    oldPrice: '1.450.000 đ',
    newPrice: '1.150.000 đ',
    discount: '-20%',
    imageCount: 26,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.7',
    reviewsCount: 380,
    phone: '0236 365 8585',
    description: 'Cách bãi tắm Mỹ Khê chỉ 100m, Sala Danang mang lại sự tiện nghi, hồ bơi tầng thượng và tiệc trà chiều miễn phí mỗi ngày.',
    amenities: ['Cách biển Mỹ Khê 100m', 'Hồ bơi vô cực trên cao', 'Miễn phí trà chiều', 'Nhà hàng ẩm thực Á - Âu'],
  },
  {
    id: 'dn-4',
    name: 'Chicland Hotel Danang - Khách Sạn Xanh Ven Biển',
    province: 'Đà Nẵng',
    location: 'Số 210 Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng',
    roomType: 'Ocean Front King Suite',
    guests: '2 người lớn',
    size: '42 m²',
    bed: '1 giường King Size',
    oldPrice: '1.750.000 đ',
    newPrice: '1.350.000 đ',
    discount: '-23%',
    imageCount: 32,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 420,
    phone: '0236 223 2222',
    description: 'Khách sạn xanh với toàn bộ mặt ngoài phủ đầy cây xanh nhiệt đới của kiến trúc sư Võ Trọng Nghĩa, không gian sống xanh thân thiện môi trường.',
    amenities: ['Kiến trúc xanh độc đáo', 'Bể bơi vô cực tầng thượng', 'Nhà hàng thực dưỡng Lá Hẹ'],
  },

  // 4. Cần Thơ
  {
    id: 'ct-1',
    name: 'Victoria Can Tho Resort - Nét Đẹp Đông Dương',
    province: 'Cần Thơ',
    location: 'Phường Cái Khế, Ninh Kiều, Cần Thơ',
    roomType: 'Deluxe River View Room',
    guests: '2 người lớn',
    size: '38 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '2.300.000 đ',
    newPrice: '1.850.000 đ',
    discount: '-20%',
    imageCount: 36,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 340,
    phone: '0292 381 0111',
    description: 'Resort mang đậm phong cách kiến trúc Pháp cổ điển bên bờ sông Hậu với khuôn viên cây cổ thụ rợp bóng mát và dịch vụ chuẩn 4 sao quốc tế.',
    amenities: ['Ven sông Hậu', 'Hồ bơi ngoài trời', 'Nhà hàng ẩm thực miền Tây', 'Du thuyền Victoria'],
  },
  {
    id: 'ct-2',
    name: 'Sheraton Cần Thơ Hotel - 5 Sao Bên Bến Ninh Kiều',
    province: 'Cần Thơ',
    location: 'Số 209 Đường 30/4, Xuân Khánh, Ninh Kiều, Cần Thơ',
    roomType: 'Premier Double City View',
    guests: '2 người lớn',
    size: '42 m²',
    bed: '1 giường King Size',
    oldPrice: '2.100.000 đ',
    newPrice: '1.650.000 đ',
    discount: '-21%',
    imageCount: 28,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 620,
    phone: '0292 376 1888',
    description: 'Khách sạn 5 sao cao nhất khu vực Đồng bằng Sông Cửu Long với tầm nhìn bao quát toàn bộ thành phố Cần Thơ và sông Hậu hiền hòa.',
    amenities: ['Buffet sáng quốc tế', 'Phòng Gym & Yoga', 'Sky Bar ngắm toàn cảnh', 'Hồ bơi ngoài trời'],
  },

  // 5. Lào Cai / Sa Pa
  {
    id: 'lc-1',
    name: 'Hotel de la Coupole - MGallery Sa Pa',
    province: 'Lào Cai',
    location: 'Số 1 Hoàng Liên, Thị xã Sa Pa, Lào Cai',
    roomType: 'Classic King Room - Thung Lũng Mường Hoa',
    guests: '2 người lớn',
    size: '38 m²',
    bed: '1 giường King Size',
    oldPrice: '3.500.000 đ',
    newPrice: '2.850.000 đ',
    discount: '-19%',
    imageCount: 40,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 1120,
    phone: '0214 362 9999',
    description: 'Sự hòa quyện tuyệt mỹ giữa văn hóa các dân tộc thiểu số Sa Pa và thời trang Haute Couture Pháp của thế kỷ 20, có ga tàu hỏa leo núi nội bộ lên đỉnh Fansipan.',
    amenities: ['Ga tàu hỏa leo núi nội bộ', 'Hồ bơi nước nóng Le Grand Bassin', 'Kiến trúc Haute Couture', 'Chic Restaurant', 'Absinthe Bar'],
  },
  {
    id: 'lc-2',
    name: 'Topas Ecolodge Sapa - Khu Nghỉ Dưỡng Trên Mây',
    province: 'Lào Cai',
    location: 'Bản Lếch, Thanh Bình, Sa Pa, Lào Cai',
    roomType: 'Premium Executive Bungalow',
    guests: '2 người lớn',
    size: '48 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '5.500.000 đ',
    newPrice: '4.500.000 đ',
    discount: '-18%',
    imageCount: 38,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 890,
    phone: '024 3715 1005',
    description: 'Nằm trên đỉnh đồi hình nón với 2 hồ bơi vô cực nước nóng tràn mây ngắm trọn thung lũng Mường Hoa kỳ vĩ của Vườn Quốc gia Hoàng Liên.',
    amenities: ['Bể bơi vô cực tràn mây', 'Ẩn mình giữa ruộng bậc thang', 'Trải nghiệm văn hóa bản địa', 'Bungalow đá tự nhiên'],
  },

  // 6. Ninh Bình
  {
    id: 'nb-1',
    name: 'Emeralda Resort Ninh Bình - Làng Quê Bắc Bộ',
    province: 'Ninh Bình',
    location: 'Khu bảo tồn Vân Long, Xã Gia Vân, Gia Viễn, Ninh Bình',
    roomType: 'Superior Garden Bungalow',
    guests: '2 người lớn, 1 trẻ em',
    size: '50 m²',
    bed: '1 giường King Size',
    oldPrice: '2.200.000 đ',
    newPrice: '1.750.000 đ',
    discount: '-20%',
    imageCount: 34,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 560,
    phone: '0229 365 8333',
    description: 'Tái hiện không gian làng quê Bắc Bộ xưa với mái ngói cổ kính, ao sen, giàn trầu và vườn cau rợp mát cạnh Đầm Vân Long.',
    amenities: ['Xe đạp dạo quanh resort', 'Không gian xanh truyền thống', 'Hồ bơi & Spa cao cấp', 'Nhà hàng Sen'],
  },
  {
    id: 'nb-2',
    name: 'Tam Coc Garden Resort - Thiên Nhiên Hòa Quyện',
    province: 'Ninh Bình',
    location: 'Thôn Hải Nham, Ninh Hải, Hoa Lư, Ninh Bình',
    roomType: 'Deluxe Panorama View',
    guests: '2 người lớn',
    size: '42 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '3.800.000 đ',
    newPrice: '3.100.000 đ',
    discount: '-18%',
    imageCount: 28,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 430,
    phone: '0378 253 555',
    description: 'Ẩn mình giữa cánh đồng lúa và núi đá vôi hùng vĩ của Tam Cốc, khu nghỉ dưỡng sinh thái cao cấp với triết lý phát triển bền vững.',
    amenities: ['Giữa cánh đồng lúa Tam Cốc', 'Trà chiều hữu cơ', 'Nhà hàng thực dưỡng', 'Hồ bơi thiên nhiên'],
  },

  // 7. Lâm Đồng / Đà Lạt
  {
    id: 'ld-1',
    name: 'Dalat Edensee Lake Resort & Spa',
    province: 'Lâm Đồng',
    location: 'Khu chức năng VII.2, Khu du lịch Hồ Tuyền Lâm, Đà Lạt, Lâm Đồng',
    roomType: 'Mimosa Superior Lake View',
    guests: '2 người lớn',
    size: '40 m²',
    bed: '1 giường đôi King',
    oldPrice: '2.600.000 đ',
    newPrice: '2.100.000 đ',
    discount: '-19%',
    imageCount: 35,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 780,
    phone: '0263 383 1515',
    description: 'Khu biệt thự nghỉ dưỡng sang trọng theo phong cách Châu Âu nép mình bên rừng thông và mặt nước xanh ngắt của hồ Tuyền Lâm.',
    amenities: ['Ven hồ Tuyền Lâm', 'Chèo thuyền Kayak', 'Bữa sáng buffet phong phú', 'Sân tennis', 'Bắn cung'],
  },
  {
    id: 'ld-2',
    name: 'Hôtel Colline Đà Lạt - Trung Tâm Thành Phố',
    province: 'Lâm Đồng',
    location: 'Số 10 Phan Bội Châu, Phường 1, TP. Đà Lạt, Lâm Đồng',
    roomType: 'Deluxe Double City Center',
    guests: '2 người lớn',
    size: '32 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '1.950.000 đ',
    newPrice: '1.600.000 đ',
    discount: '-18%',
    imageCount: 27,
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.7',
    reviewsCount: 890,
    phone: '0263 366 5588',
    description: 'Khách sạn phong cách Nhật Bản tinh tế nằm ngay khu trung tâm Đà Lạt Center, chỉ vài bước chân là đến Chợ Đêm Đà Lạt.',
    amenities: ['Cạnh chợ đêm Đà Lạt', 'Phòng tập Gym', 'Quán cà phê tầng thượng view đẹp', 'Nhà hàng ẩm thực Nhật & Âu'],
  },

  // 8. Bà Rịa - Vũng Tàu
  {
    id: 'vt-1',
    name: 'The Imperial Hotel Vũng Tàu - 5 Sao Cổ Điển Hoàng Gia',
    province: 'Bà Rịa - Vũng Tàu',
    location: 'Số 159 Thùy Vân, Phường Thắng Tam, TP. Vũng Tàu',
    roomType: 'Deluxe Ocean View Double',
    guests: '2 người lớn',
    size: '45 m²',
    bed: '1 giường King Size',
    oldPrice: '2.800.000 đ',
    newPrice: '2.300.000 đ',
    discount: '-18%',
    imageCount: 40,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 1450,
    phone: '0254 362 8888',
    description: 'Khách sạn 5 sao duy nhất tại Bãi Sau mang phong cách kiến trúc thời kỳ phục hưng Victoria hoàng gia Anh, sở hữu Imperial Beach Club riêng biệt.',
    amenities: ['Beach Club riêng tại Bãi Sau', 'Hồ bơi hoàng gia', 'Ẩm thực hải sản cao cấp', 'Cầu bộ hành ra biển'],
  },

  // 9. Hà Nội
  {
    id: 'hn-1',
    name: 'Capella Hanoi - Nghệ Thuật Pháp Cổ Điển',
    province: 'Hà Nội',
    location: 'Số 11 Lê Phụng Hiểu, Hoàn Kiếm, Hà Nội',
    roomType: 'Premier Opera Suite',
    guests: '2 người lớn',
    size: '55 m²',
    bed: '1 giường King Size',
    oldPrice: '8.000.000 đ',
    newPrice: '6.500.000 đ',
    discount: '-19%',
    imageCount: 48,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 480,
    phone: '024 3987 8888',
    description: 'Tác phẩm nghệ thuật tôn vinh thời kỳ hoàng kim của nhà hát Opera Hà Nội do Bill Bensley thiết kế, sở hữu nhà hàng Hibana đạt 1 sao Michelin danh giá.',
    amenities: ['Gần Hồ Hoàn Kiếm & Nhà hát Lớn', 'Nhà hàng Hibana đạt sao Michelin', 'Dịch vụ quản gia', 'Auriga Spa'],
  },

  // 10. TP. Hồ Chí Minh
  {
    id: 'hcm-1',
    name: 'The Reverie Saigon - Đẳng Cấp Thượng Lưu',
    province: 'TP. Hồ Chí Minh',
    location: 'Số 22-36 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    roomType: 'Grand Deluxe Panorama Room',
    guests: '2 người lớn',
    size: '53 m²',
    bed: '1 giường King Size',
    oldPrice: '7.200.000 đ',
    newPrice: '5.800.000 đ',
    discount: '-19%',
    imageCount: 52,
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 1280,
    phone: '028 3823 6688',
    description: 'Khách sạn 6 sao sang trọng bậc nhất Sài Gòn trên phố đi bộ Nguyễn Huệ với nội thất Ý hoàng gia xa hoa, hồ bơi ngoài trời trên cao và dịch vụ siêu xe đưa đón.',
    amenities: ['Phố đi bộ Nguyễn Huệ', 'Hồ bơi ngoài trời trên cao', 'Spa hoàng gia', 'Nhà hàng The Royal Pavilion'],
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8f6' },
  scrollContent: { paddingBottom: 40 },

  header: { padding: 16, backgroundColor: '#34348c', paddingBottom: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  searchSection: { marginTop: -20, paddingHorizontal: 16, zIndex: 10 },
  searchForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfaf6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  searchInput: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    padding: 0,
    marginTop: 1,
  },
  clearBtn: {
    padding: 4,
  },
  searchText: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  separator: { height: 8 },
  searchRow: { flexDirection: 'row' },
  searchButton: {
    backgroundColor: '#c85a32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 0.5,
  },

  /* Floating Search Suggestions Dropdown (Requirement 1) */
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 6,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  suggestionsHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  suggestionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  suggestionSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },

  /* Quick Filter Horizontal Scroll */
  quickFilters: { marginTop: 14, flexDirection: 'row' },
  quickFilterItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
  },
  quickFilterItemActive: {
    backgroundColor: '#168b58',
    borderColor: '#168b58',
  },
  quickFilterItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  quickFilterItemTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  offerBanner: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offerBannerTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f2b28' },
  offerBannerSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  offerBannerBtn: {
    backgroundColor: '#0f2b28',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  offerBannerBtnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  listSection: { padding: 16, marginTop: 8 },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  listSubTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#c85a32',
    textTransform: 'uppercase',
  },
  listTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 3 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterBtnText: { fontSize: 12, fontWeight: 'bold', color: '#0f2b28' },

  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetBtn: {
    backgroundColor: '#168b58',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  hotelGrid: { gap: 16 },
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  hotelImageContainer: { height: 190, width: '100%', position: 'relative' },
  hotelImage: { width: '100%', height: '100%' },
  hotelBadgeCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hotelBadgeCountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  discountFloatingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#e34f21',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountFloatingBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  hotelContent: { padding: 16 },
  hotelTagsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tagPrimary: {
    backgroundColor: '#edf8f3',
    color: '#168b58',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagSecondary: { color: '#168b58', fontSize: 10, fontWeight: 'bold' },

  hotelName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  hotelLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  hotelLocation: { fontSize: 11, color: '#64748b' },

  hotelRoomInfo: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12, marginBottom: 12 },
  roomType: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  roomDesc: { fontSize: 11, color: '#64748b' },

  hotelAmenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityText: { fontSize: 10, color: '#1e514d', fontWeight: '600' },

  hotelFooter: {
    backgroundColor: '#fbfcfb',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  discountBadge: {
    backgroundColor: '#fff0f3',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  discountBadgeText: { color: '#c2234d', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  oldPrice: { fontSize: 11, color: '#94a3b8', textDecorationLine: 'line-through' },
  newPrice: { fontSize: 18, fontWeight: 'bold', color: '#e34f21' },
  priceDesc: { fontSize: 10, color: '#64748b' },
  bookBtn: { backgroundColor: '#168b58', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  bookBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  /* Modals & Bottom Sheets (Requirement 2) */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetChipActive: {
    backgroundColor: '#168b58',
    borderColor: '#168b58',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  presetChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  /* Calendar Days */
  calendarDayList: {
    gap: 8,
    paddingVertical: 6,
  },
  calendarDayCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 64,
  },
  calendarDayCardActive: {
    backgroundColor: '#168b58',
    borderColor: '#168b58',
  },
  calendarDayCardInRange: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  calendarDayName: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  calendarDayNameActive: {
    color: '#ffffff',
  },
  calendarDayNum: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  calendarDayNumActive: {
    color: '#ffffff',
  },
  calendarMonthText: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },

  /* Date Summary */
  dateSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginVertical: 16,
  },
  dateSummaryCol: {
    flex: 1,
  },
  dateSummaryCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateSummaryNights: {
    fontSize: 11,
    fontWeight: '800',
    color: '#168b58',
  },
  dateSummaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 2,
  },
  dateSummaryVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },

  /* Steppers */
  stepperContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  stepperTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  stepperSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  stepperValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    minWidth: 20,
    textAlign: 'center',
  },

  modalApplyBtn: {
    backgroundColor: '#168b58',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalApplyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
