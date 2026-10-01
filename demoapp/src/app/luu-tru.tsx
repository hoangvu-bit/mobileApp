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
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  'Đà Lạt',
  'Phú Quốc',
  'Cần Thơ',
  'Đà Nẵng',
  'Nha Trang',
  'Vũng Tàu',
  'Sa Pa',
  'Ninh Bình',
  'Hà Nội',
  'TP. Hồ Chí Minh',
];

const POPULAR_DESTINATIONS = [
  { id: 'tn', title: 'Tây Ninh', subtitle: 'Núi Bà Đen, Tòa Thánh Tây Ninh', province: 'Tây Ninh', isHotel: false },
  { id: 'dl', title: 'Đà Lạt (Lâm Đồng)', subtitle: 'Thành phố ngàn hoa, Hồ Xuân Hương', province: 'Lâm Đồng', isHotel: false },
  { id: 'pq', title: 'Kiên Giang (Phú Quốc)', subtitle: 'Đảo ngọc Phú Quốc, Bãi Dài, Grand World', province: 'Kiên Giang', isHotel: false },
  { id: 'dn', title: 'Đà Nẵng', subtitle: 'Bà Nà Hills, Cầu Rồng, Biển Mỹ Khê', province: 'Đà Nẵng', isHotel: false },
  { id: 'nt', title: 'Khánh Hòa (Nha Trang)', subtitle: 'Vịnh Nha Trang, VinWonders, Hòn Mun', province: 'Khánh Hòa', isHotel: false },
  { id: 'vt', title: 'Bà Rịa - Vũng Tàu', subtitle: 'Bãi Sau, Bãi Trước, Đảo Long Sơn', province: 'Bà Rịa - Vũng Tàu', isHotel: false },
  { id: 'sp', title: 'Lào Cai (Sa Pa)', subtitle: 'Đỉnh Fansipan, Bản Cát Cát, Mường Hoa', province: 'Lào Cai', isHotel: false },
  { id: 'nb', title: 'Ninh Bình', subtitle: 'Quần thể danh thắng Tràng An, Bái Đính', province: 'Ninh Bình', isHotel: false },
  { id: 'ct', title: 'Cần Thơ', subtitle: 'Bến Ninh Kiều, Chợ nổi Cái Răng', province: 'Cần Thơ', isHotel: false },
];

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
  typeTag?: string;
  featureHighlight?: string;
  rooms?: any[];
}

export default function LuuTruScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [searchText, setSearchText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Tất cả');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  
  // Search Suggestions State
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Pagination State (Display 10 hotels initially)
  const ITEMS_PER_PAGE = 10;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

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
      scrollViewRef.current?.scrollTo({ y: 240, animated: true });
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
      scrollViewRef.current?.scrollTo({ y: 240, animated: true });
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
      scrollViewRef.current?.scrollTo({ y: 240, animated: true });
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
        const provNorm = normalizeText(selectedProvince);
        const hotelProvNorm = normalizeText(hotel.province);
        const hotelLocNorm = normalizeText(hotel.location);

        if (provNorm === 'da lat' || provNorm === 'lam dong') {
          return hotelProvNorm.includes('lam dong') || hotelLocNorm.includes('da lat');
        }
        if (provNorm === 'phu quoc' || provNorm === 'kien giang') {
          return hotelProvNorm.includes('kien giang') || hotelLocNorm.includes('phu quoc');
        }
        if (provNorm === 'sa pa' || provNorm === 'lao cai') {
          return hotelProvNorm.includes('lao cai') || hotelLocNorm.includes('sa pa');
        }
        if (provNorm === 'vung tau' || provNorm === 'ba ria - vung tau') {
          return hotelProvNorm.includes('vung tau') || hotelLocNorm.includes('vung tau');
        }
        if (provNorm === 'nha trang' || provNorm === 'khanh hoa') {
          return hotelProvNorm.includes('khanh hoa') || hotelLocNorm.includes('nha trang');
        }

        return (
          matchVietnameseSearch(hotel.province, selectedProvince) ||
          matchVietnameseSearch(hotel.location, selectedProvince)
        );
      }

      return true;
    });
  }, [activeQuery, selectedProvince, onlyDiscount]);

  // Reset pagination to 10 whenever search keyword or filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeQuery, selectedProvince, onlyDiscount]);

  // Paginated list of hotels to render (10 hotels per page)
  const displayedHotels = useMemo(() => {
    return filteredHotels.slice(0, visibleCount);
  }, [filteredHotels, visibleCount]);

  const hasMore = visibleCount < filteredHotels.length;
  const remainingCount = Math.max(0, filteredHotels.length - visibleCount);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b3b2c" />

      {/* BEGIN: Top Dark Emerald Header (Matching Stitch Screen) */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 16) }]}>
        
        {/* Action Bar */}
        <View style={styles.topActionBar}>
          <View style={styles.headerLeft}>
            <Pressable
              style={styles.backBtn}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color="#ffffff" />
            </Pressable>
            <View>
              <Text style={styles.headerMainTitle}>Lưu trú & Khách sạn</Text>
              <View style={styles.headerSubtitleRow}>
                <View style={styles.liveIndicatorDot} />
                <Text style={styles.headerSubtext}>Khám phá & đặt phòng giá độc quyền</Text>
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Pressable
              style={styles.headerIconBtn}
              onPress={() => {
                setIsSearchFocused(true);
              }}
              hitSlop={6}
            >
              <Ionicons name="search-outline" size={19} color="#ffffff" />
            </Pressable>

            <Pressable
              style={styles.headerIconBtn}
              onPress={() => setOnlyDiscount(!onlyDiscount)}
              hitSlop={6}
            >
              <Ionicons name="notifications-outline" size={19} color="#ffffff" />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>

        {/* Integrated Search Bar Pill */}
        <View style={styles.headerSearchPill}>
          <Ionicons name="search" size={18} color="#94a3b8" style={{ marginLeft: 6 }} />
          <TextInput
            style={styles.headerSearchInput}
            placeholder="Tìm khách sạn, resort, homestay..."
            placeholderTextColor="#9ca3af"
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

          {searchText.length > 0 && (
            <Pressable onPress={handleClear} hitSlop={8} style={{ paddingHorizontal: 6 }}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </Pressable>
          )}

          <Pressable style={styles.headerSearchActionBtn} onPress={handleSearch}>
            <Text style={styles.headerSearchActionBtnText}>Tìm phòng</Text>
          </Pressable>
        </View>

        {/* Search Suggestions Dropdown Overlay */}
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
            <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="always">
              {searchSuggestions.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <View style={[styles.suggestionIconBox, item.isHotel && { backgroundColor: '#e6f7f2' }]}>
                    <Ionicons 
                      name={item.isHotel ? "bed" : "location-sharp"} 
                      size={14} 
                      color={item.isHotel ? "#008b74" : "#0a382a"} 
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.suggestionSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#cbd5e1" />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

      </View>
      {/* END: Top Dark Emerald Header */}

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* Quick Filter Horizontal Scroll Categories */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContainer}
          >
            {PROVINCES.map((item, idx) => {
              const isActive =
                (selectedProvince === item && !activeQuery) ||
                (activeQuery && normalizeText(activeQuery) === normalizeText(item)) ||
                (item === 'Tất cả' && !activeQuery && selectedProvince === 'Tất cả');

              return (
                <Pressable
                  key={idx}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => handleSelectProvince(item)}
                >
                  <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Hotel Listings Section (Horizontal Stitch Dark Emerald Cards) */}
        <View style={styles.listSection}>
          
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionEyebrow}>GỢI Ý NỔI BẬT</Text>
              <Text style={styles.sectionTitle}>
                {activeQuery
                  ? `Kết quả cho "${activeQuery}"`
                  : selectedProvince !== 'Tất cả'
                  ? `Khách sạn tại ${selectedProvince}`
                  : 'Chỗ nghỉ giá tốt nhất hôm nay'}
              </Text>
            </View>
            <View style={styles.hotelCountBadge}>
              <Text style={styles.hotelCountBadgeText}>{filteredHotels.length} khách sạn</Text>
            </View>
          </View>

          {/* Hotel Grid / Cards */}
          {filteredHotels.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="business-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Không tìm thấy chỗ nghỉ phù hợp</Text>
              <Text style={styles.emptyStateText}>
                Không có khách sạn nào khớp với "{activeQuery || selectedProvince}". Bạn hãy thử tìm tỉnh/thành khác như Tây Ninh, Đà Lạt, Phú Quốc, Nha Trang nhé!
              </Text>
              <Pressable style={styles.resetBtn} onPress={handleClear}>
                <Text style={styles.resetBtnText}>Xem tất cả khách sạn</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <View style={styles.cardsContainer}>
                {displayedHotels.map((hotel) => (
                  <Pressable
                    key={hotel.id}
                    style={styles.hotelCard}
                    onPress={() => handleViewHotel(hotel)}
                  >
                    {/* Left Thumbnail */}
                    <View style={styles.cardImageContainer}>
                      <Image
                        source={{ uri: hotel.image }}
                        style={styles.cardImage}
                        contentFit="cover"
                        transition={200}
                      />
                      {/* Top-Left Rating Overlay */}
                      <View style={styles.cardRatingBadge}>
                        <Text style={styles.cardRatingText}>★ {hotel.rating || '4.8'}</Text>
                      </View>
                      {/* Bottom-Left Type Tag Overlay */}
                      <View style={styles.cardTypeTag}>
                        <Text style={styles.cardTypeTagText}>
                          {hotel.typeTag || (hotel.newPrice.includes('4.') || hotel.newPrice.includes('6.') || hotel.newPrice.includes('7.') ? 'Resort 5★' : 'Khách sạn')}
                        </Text>
                      </View>
                      {/* Top-Right Discount Badge */}
                      {hotel.discount && (
                        <View style={styles.cardDiscountBadge}>
                          <Text style={styles.cardDiscountBadgeText}>{hotel.discount}</Text>
                        </View>
                      )}
                    </View>

                    {/* Right Content */}
                    <View style={styles.cardContent}>
                      <View>
                        <Text style={styles.cardHotelName} numberOfLines={1}>
                          {hotel.name}
                        </Text>
                        
                        <View style={styles.cardLocationRow}>
                          <Ionicons name="location-sharp" size={13} color="#059669" />
                          <Text style={styles.cardLocationText} numberOfLines={1}>
                            {hotel.location}
                          </Text>
                        </View>

                        {/* Feature Highlight Pill */}
                        <View style={styles.cardFeaturePill}>
                          <View style={styles.cardFeatureDot} />
                          <Text style={styles.cardFeatureText} numberOfLines={1}>
                            {hotel.featureHighlight || hotel.amenities[0] || 'Dịch vụ chu đáo, vị trí đắc địa'}
                          </Text>
                        </View>
                      </View>

                      {/* Price & Booking Button Row */}
                      <View style={styles.cardFooterRow}>
                        <View style={styles.cardPriceBlock}>
                          <Text style={styles.cardPriceLabel}>Giá từ</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                            <Text style={styles.cardPriceValue}>{hotel.newPrice}</Text>
                            {hotel.oldPrice && (
                              <Text style={styles.cardOldPrice}>{hotel.oldPrice}</Text>
                            )}
                          </View>
                        </View>

                        <Pressable
                          style={styles.cardBookBtn}
                          onPress={() => handleViewHotel(hotel)}
                        >
                          <Text style={styles.cardBookBtnText}>Đặt phòng</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Pagination / Load More with Down Arrow */}
              {hasMore && (
                <View style={styles.paginationSection}>
                  <Pressable
                    style={styles.loadMoreBtn}
                    onPress={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.loadMoreBtnTitle}>
                        Xem thêm {Math.min(ITEMS_PER_PAGE, remainingCount)} chỗ nghỉ
                      </Text>
                      <Text style={styles.loadMoreBtnSubtitle}>
                        Đang hiển thị {displayedHotels.length} / {filteredHotels.length} khách sạn
                      </Text>
                    </View>
                    <View style={styles.loadMoreIconCircle}>
                      <Ionicons name="chevron-down" size={18} color="#ffffff" />
                    </View>
                  </Pressable>
                </View>
              )}

              {/* All loaded footer */}
              {!hasMore && filteredHotels.length > ITEMS_PER_PAGE && (
                <View style={styles.allLoadedSection}>
                  <View style={styles.allLoadedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    <Text style={styles.allLoadedText}>
                      Đã hiển thị tất cả {filteredHotels.length} chỗ nghỉ
                    </Text>
                  </View>
                  <Pressable
                    style={styles.collapseBtn}
                    onPress={() => {
                      setVisibleCount(ITEMS_PER_PAGE);
                      scrollViewRef.current?.scrollTo({ y: 240, animated: true });
                    }}
                  >
                    <Text style={styles.collapseBtnText}>Thu gọn</Text>
                    <Ionicons name="chevron-up" size={13} color="#0a382a" />
                  </Pressable>
                </View>
              )}
            </View>
          )}

        </View>

      </ScrollView>

    </View>
  );
}

const HOTELS: HotelItem[] = [
  // 1. Tây Ninh
  {
    id: 'tn-3',
    name: 'Melia Vinpearl Tây Ninh',
    province: 'Tây Ninh',
    location: 'Số 90 Đường Lê Duẩn, Phường 3, TP. Tây Ninh',
    roomType: 'Executive Suite Panorama',
    guests: '2 người lớn, 1 trẻ em',
    size: '52 m²',
    bed: '1 giường King Size',
    oldPrice: '1.800.000 đ',
    newPrice: '1.250.000đ',
    discount: '-30%',
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
    description: 'Tòa khách sạn 5 sao cao nhất Tây Ninh với tầm nhìn 360 độ ngắm trọn Núi Bà Đen hùng vĩ. Dịch vụ chuẩn quốc tế của tập đoàn Melia Hotels International mang đến trải nghiệm thượng lưu không thể quên.',
    amenities: ['Phòng view núi Bà Đen', 'Spa & Massage', 'Bể bơi 4 mùa', 'Nhà hàng Á - Âu', 'Sky Lounge tầng 21'],
    typeTag: 'Khách sạn 5★',
    featureHighlight: 'Phòng view núi Bà Đen',
    rooms: [
      {
        id: 'r-tn3-1',
        name: 'Deluxe King Mountain View',
        size: '38 m²',
        maxGuests: '2 người lớn, 1 trẻ em',
        bed: '1 giường King Size',
        price: '1.250.000 đ',
        priceNum: 1250000,
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
    id: 'tn-1',
    name: 'Resort Vườn Cau Tây Ninh',
    province: 'Tây Ninh',
    location: 'Ấp Phước Đức A, Xã Phước Đông, Gò Dầu, Tây Ninh',
    roomType: 'Garden View Villa',
    guests: '2 người lớn, 2 trẻ em',
    size: '45 m²',
    bed: '1 giường đôi lớn & 1 đơn',
    oldPrice: '1.100.000 đ',
    newPrice: '880.000đ',
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
    description: 'Khu nghỉ dưỡng sinh thái Vườn Cau mang đậm phong vị làng quê Nam Bộ yên bình với khuôn viên vườn cây xanh mát, hồ bơi ngoài trời và các căn villa riêng tư.',
    amenities: ['Linh hoạt trước 72h', 'Dọn phòng', 'Wi-Fi miễn phí', 'Hồ bơi ngoài trời', 'Bữa sáng theo yêu cầu', 'Chỗ đỗ xe miễn phí'],
    typeTag: 'Resort Sinh Thái',
    featureHighlight: 'Không gian xanh miệt vườn yên bình',
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
    ],
  },
  {
    id: 'tn-2',
    name: 'Mekong Tani Hotel Tây Ninh',
    province: 'Tây Ninh',
    location: 'Số 125 Hoàng Lê Kha, Phường 3, TP. Tây Ninh, Tây Ninh',
    roomType: 'Deluxe Double City View',
    guests: '2 người lớn',
    size: '35 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '950.000 đ',
    newPrice: '750.000đ',
    discount: '-21%',
    imageCount: 24,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 240,
    phone: '0276 388 9999',
    description: 'Mekong Tani Hotel nằm ngay trục đường trung tâm sầm uất của TP. Tây Ninh, thuận tiện đến Núi Bà Đen và Tòa Thánh Cao Đài.',
    amenities: ['Bữa sáng miễn phí', 'Hồ bơi', 'Wi-Fi tốc độ cao', 'Phòng Gym', 'Chỗ đỗ xe', 'Lễ tân 24/7'],
    typeTag: 'Khách sạn 4★',
    featureHighlight: 'Gần Tòa Thánh & Núi Bà Đen',
  },

  // 2. Nha Trang / Khánh Hòa
  {
    id: 'nt-1',
    name: 'Amiana Resort Nha Trang',
    province: 'Khánh Hòa',
    location: 'Vịnh Rùa, Đường Phạm Văn Đồng, Nha Trang',
    roomType: 'Deluxe Ocean View Villa',
    guests: '2 người lớn, 1 trẻ em',
    size: '65 m²',
    bed: '1 giường King Size',
    oldPrice: '3.100.000 đ',
    newPrice: '2.450.000đ',
    discount: '-21%',
    imageCount: 38,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 650,
    phone: '0258 355 3333',
    description: 'Nằm nép mình bên bờ vịnh Nha Trang xinh đẹp với hồ bơi nước mặn tự nhiên rộng 2.500m² và dịch vụ tắm bùn khoáng cao cấp.',
    amenities: ['Hồ bơi nước mặn 2500m²', 'Tắm bùn khoáng riêng', 'Bãi biển riêng tư', 'Bữa sáng buffet hảo hạng'],
    typeTag: 'Resort Biển',
    featureHighlight: 'Bao gồm tắm bùn khoáng',
  },

  // 3. Lâm Đồng / Đà Lạt
  {
    id: 'ld-2',
    name: 'Hôtel Colline Đà Lạt',
    province: 'Lâm Đồng',
    location: 'Số 10 Phan Bội Châu, Phường 1, TP. Đà Lạt',
    roomType: 'Deluxe Double City Center',
    guests: '2 người lớn',
    size: '32 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '1.250.000 đ',
    newPrice: '980.000đ',
    discount: '-22%',
    imageCount: 27,
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 890,
    phone: '0263 366 5588',
    description: 'Khách sạn phong cách Nhật Bản tinh tế nằm ngay khu trung tâm Đà Lạt Center, chỉ vài bước chân là đến Chợ Đêm Đà Lạt.',
    amenities: ['Cạnh chợ đêm Đà Lạt', 'Phòng tập Gym', 'Quán cà phê tầng thượng view đẹp', 'Nhà hàng ẩm thực Nhật & Âu'],
    typeTag: 'Trung tâm',
    featureHighlight: 'Gần chợ đêm Đà Lạt',
  },
  {
    id: 'ld-1',
    name: 'Dalat Edensee Lake Resort & Spa',
    province: 'Lâm Đồng',
    location: 'Khu du lịch Hồ Tuyền Lâm, TP. Đà Lạt, Lâm Đồng',
    roomType: 'Mimosa Superior Lake View',
    guests: '2 người lớn',
    size: '40 m²',
    bed: '1 giường đôi King',
    oldPrice: '2.600.000 đ',
    newPrice: '2.100.000đ',
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
    typeTag: 'Resort Hồ',
    featureHighlight: 'View trực diện Hồ Tuyền Lâm',
  },

  // 4. Kiên Giang / Phú Quốc
  {
    id: 'kg-1',
    name: 'Premier Village Phu Quoc Resort',
    province: 'Kiên Giang',
    location: 'Mũi Ông Đội, An Thới, TP. Phú Quốc, Kiên Giang',
    roomType: 'Island Villa Private Pool',
    guests: '4 người lớn, 2 trẻ em',
    size: '120 m²',
    bed: '2 phòng ngủ (2 giường King)',
    oldPrice: '6.000.000 đ',
    newPrice: '4.800.000đ',
    discount: '-20%',
    imageCount: 45,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 680,
    phone: '0297 354 6666',
    description: 'Tọa lạc tại Mũi Ông Đội - dải đất hai mặt biển độc nhất vô nhị ở Phú Quốc, nơi bạn có thể ngắm cả bình minh và hoàng hôn tại cùng một vị trí.',
    amenities: ['Hồ bơi riêng từng căn', 'Ngắm bình minh & hoàng hôn', 'Đưa đón sân bay VIP', 'Bãi biển riêng tư', 'Plumeria Spa'],
    typeTag: 'Villa Biển 5★',
    featureHighlight: 'Hai mặt biển ngắm hoàng hôn',
  },
  {
    id: 'kg-2',
    name: 'Sunset Beach Resort & Spa Phú Quốc',
    province: 'Kiên Giang',
    location: 'Số 100C/2 Trần Hưng Đạo, Dương Đông, Phú Quốc',
    roomType: 'Deluxe Sea View Balcony',
    guests: '2 người lớn',
    size: '36 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '1.950.000 đ',
    newPrice: '1.550.000đ',
    discount: '-20%',
    imageCount: 32,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 390,
    phone: '0297 356 7890',
    description: 'Resort sát biển tại trung tâm Dương Đông với Sunset Bar sôi động ngắm trọn hoàng hôn tuyệt đẹp của đảo ngọc Phú Quốc.',
    amenities: ['Sunset Bar trên bãi biển', 'Hồ bơi trong nhà & ngoài trời', 'Gần chợ đêm', 'Bữa sáng buffet'],
    typeTag: 'Resort Biển',
    featureHighlight: 'Sát bãi biển & Sunset Bar',
  },

  // 5. Đà Nẵng
  {
    id: 'dn-1',
    name: 'InterContinental Danang Sun Peninsula',
    province: 'Đà Nẵng',
    location: 'Bãi Bắc, Bán đảo Sơn Trà, TP. Đà Nẵng',
    roomType: 'Classic Ocean View Villa',
    guests: '2 người lớn, 2 trẻ em',
    size: '70 m²',
    bed: '1 giường King Size siêu lớn',
    oldPrice: '9.200.000 đ',
    newPrice: '7.500.000đ',
    discount: '-18%',
    imageCount: 50,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 950,
    phone: '0236 393 8888',
    description: 'Kiệt tác kiến trúc của KTS lừng danh Bill Bensley ẩn mình giữa thiên nhiên hoang sơ của Bán đảo Sơn Trà.',
    amenities: ['Bãi biển riêng tư', 'Cáp treo ngắm cảnh', 'Nhà hàng sao Michelin La Maison 1888', 'HARNN Heritage Spa'],
    typeTag: 'Siêu Sang 5★',
    featureHighlight: 'Khu nghỉ dưỡng đỉnh cao thế giới',
  },
  {
    id: 'dn-2',
    name: 'TMS Hotel Da Nang Beach',
    province: 'Đà Nẵng',
    location: 'Số 292 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng',
    roomType: 'Premier Ocean Front Double',
    guests: '2 người lớn',
    size: '36 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '1.800.000 đ',
    newPrice: '1.400.000đ',
    discount: '-22%',
    imageCount: 30,
    image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 510,
    phone: '0236 375 5999',
    description: 'Nằm ngay mặt đường biển Võ Nguyên Giáp, TMS Hotel sở hữu bể bơi vô cực đáy kính tầng 25 cao nhất Đà Nẵng.',
    amenities: ['Bể bơi vô cực tầng 25', 'Bữa sáng chuẩn quốc tế', 'Đưa đón sân bay', 'Mélange Spa'],
    typeTag: 'Mặt Biển',
    featureHighlight: 'Bể bơi vô cực đáy kính tầng 25',
  },

  // 6. Cần Thơ
  {
    id: 'ct-1',
    name: 'Victoria Can Tho Resort',
    province: 'Cần Thơ',
    location: 'Phường Cái Khế, Ninh Kiều, Cần Thơ',
    roomType: 'Deluxe River View Room',
    guests: '2 người lớn',
    size: '38 m²',
    bed: '1 giường đôi lớn',
    oldPrice: '2.300.000 đ',
    newPrice: '1.850.000đ',
    discount: '-20%',
    imageCount: 36,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 340,
    phone: '0292 381 0111',
    description: 'Resort mang đậm phong cách kiến trúc Pháp cổ điển bên bờ sông Hậu với khuôn viên cây cổ thụ rợp bóng mát.',
    amenities: ['Ven sông Hậu', 'Hồ bơi ngoài trời', 'Nhà hàng ẩm thực miền Tây', 'Du thuyền Victoria'],
    typeTag: 'Resort Sông',
    featureHighlight: 'Phong cách Pháp cổ ven sông Hậu',
  },

  // 7. Sa Pa / Lào Cai
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
    newPrice: '2.850.000đ',
    discount: '-19%',
    imageCount: 40,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 1120,
    phone: '0214 362 9999',
    description: 'Sự hòa quyện tuyệt mỹ giữa văn hóa các dân tộc thiểu số Sa Pa và thời trang Haute Couture Pháp của thế kỷ 20.',
    amenities: ['Ga tàu hỏa leo núi nội bộ', 'Hồ bơi nước nóng Le Grand Bassin', 'Kiến trúc Haute Couture'],
    typeTag: 'Khách sạn 5★',
    featureHighlight: 'Ga tàu hỏa Fansipan ngay tại sảnh',
  },

  // 8. Ninh Bình
  {
    id: 'nb-1',
    name: 'Emeralda Resort Ninh Bình',
    province: 'Ninh Bình',
    location: 'Khu bảo tồn Vân Long, Xã Gia Vân, Gia Viễn, Ninh Bình',
    roomType: 'Superior Garden Bungalow',
    guests: '2 người lớn, 1 trẻ em',
    size: '50 m²',
    bed: '1 giường King Size',
    oldPrice: '2.200.000 đ',
    newPrice: '1.750.000đ',
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
    amenities: ['Xe đạp dạo quanh resort', 'Không gian xanh truyền thống', 'Hồ bơi & Spa cao cấp'],
    typeTag: 'Resort Sinh Thái',
    featureHighlight: 'Làng quê Bắc Bộ cạnh Đầm Vân Long',
  },

  // 9. Vũng Tàu
  {
    id: 'vt-1',
    name: 'The Imperial Hotel Vũng Tàu',
    province: 'Bà Rịa - Vũng Tàu',
    location: 'Số 159 Thùy Vân, Phường Thắng Tam, TP. Vũng Tàu',
    roomType: 'Deluxe Ocean View Double',
    guests: '2 người lớn',
    size: '45 m²',
    bed: '1 giường King Size',
    oldPrice: '2.800.000 đ',
    newPrice: '2.300.000đ',
    discount: '-18%',
    imageCount: 40,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.8',
    reviewsCount: 1450,
    phone: '0254 362 8888',
    description: 'Khách sạn 5 sao duy nhất tại Bãi Sau mang phong cách kiến trúc thời kỳ phục hưng Victoria hoàng gia Anh.',
    amenities: ['Beach Club riêng tại Bãi Sau', 'Hồ bơi hoàng gia', 'Ẩm thực hải sản cao cấp'],
    typeTag: 'Khách sạn 5★',
    featureHighlight: 'Beach Club riêng tại Bãi Sau',
  },

  // 10. Hà Nội
  {
    id: 'hn-1',
    name: 'Capella Hanoi',
    province: 'Hà Nội',
    location: 'Số 11 Lê Phụng Hiểu, Hoàn Kiếm, Hà Nội',
    roomType: 'Premier Opera Suite',
    guests: '2 người lớn',
    size: '55 m²',
    bed: '1 giường King Size',
    oldPrice: '8.000.000 đ',
    newPrice: '6.500.000đ',
    discount: '-19%',
    imageCount: 48,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 480,
    phone: '024 3987 8888',
    description: 'Tác phẩm nghệ thuật tôn vinh thời kỳ hoàng kim của nhà hát Opera Hà Nội do Bill Bensley thiết kế.',
    amenities: ['Gần Hồ Hoàn Kiếm & Nhà hát Lớn', 'Nhà hàng Hibana đạt sao Michelin', 'Dịch vụ quản gia'],
    typeTag: 'Khách sạn 5★',
    featureHighlight: 'Nhà hàng Hibana 1 sao Michelin',
  },

  // 11. TP. Hồ Chí Minh
  {
    id: 'hcm-1',
    name: 'The Reverie Saigon',
    province: 'TP. Hồ Chí Minh',
    location: 'Số 22-36 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    roomType: 'Grand Deluxe Panorama Room',
    guests: '2 người lớn',
    size: '53 m²',
    bed: '1 giường King Size',
    oldPrice: '7.200.000 đ',
    newPrice: '5.800.000đ',
    discount: '-19%',
    imageCount: 52,
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
    ],
    rating: '4.9',
    reviewsCount: 1280,
    phone: '028 3823 6688',
    description: 'Khách sạn 6 sao sang trọng bậc nhất Sài Gòn trên phố đi bộ Nguyễn Huệ với nội thất Ý hoàng gia xa hoa.',
    amenities: ['Phố đi bộ Nguyễn Huệ', 'Hồ bơi ngoài trời trên cao', 'Spa hoàng gia'],
    typeTag: 'Thượng Lưu 6★',
    featureHighlight: 'Ngay mặt tiền phố đi bộ Nguyễn Huệ',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  scrollContent: {
    paddingBottom: 110,
  },

  /* Top Dark Emerald Header (Stitch Match) */
  headerContainer: {
    backgroundColor: '#0b3b2c',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 40,
  },
  topActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34d399',
  },
  headerSubtext: {
    fontSize: 11,
    color: '#a7f3d0',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fbbf24',
    borderWidth: 1.5,
    borderColor: '#0b3b2c',
  },

  /* Header Search Bar Pill */
  headerSearchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerSearchActionBtn: {
    backgroundColor: '#0a382a',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSearchActionBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Suggestions Dropdown */
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  suggestionSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },

  /* Quick Category / Destination Filter Chips */
  categorySection: {
    marginTop: 10,
  },
  categoryScrollContainer: {
    paddingHorizontal: 14,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#0a382a',
    borderColor: '#0a382a',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  categoryChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  /* List Section Header */
  listSection: {
    paddingHorizontal: 14,
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#f05a28',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  hotelCountBadge: {
    backgroundColor: '#e6f7f2',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  hotelCountBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#008b74',
  },

  /* Cards Container */
  cardsContainer: {
    gap: 10,
  },
  hotelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  cardImageContainer: {
    width: 105,
    height: 105,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f3f4f6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardRatingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardRatingText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '800',
  },
  cardTypeTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(10, 56, 42, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTypeTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600',
  },
  cardDiscountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#f05a28',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardDiscountBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },

  /* Card Right Content */
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  cardHotelName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 17,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  cardLocationText: {
    fontSize: 11,
    color: '#6b7280',
    flex: 1,
  },
  cardFeaturePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7f2',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 5,
    gap: 4,
    maxWidth: '100%',
  },
  cardFeatureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10b981',
  },
  cardFeatureText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#008b74',
    flexShrink: 1,
  },

  /* Card Footer Row */
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cardPriceBlock: {
    justifyContent: 'flex-end',
  },
  cardPriceLabel: {
    fontSize: 9,
    color: '#9ca3af',
    fontWeight: '500',
  },
  cardPriceValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f05a28',
  },
  cardOldPrice: {
    fontSize: 10,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  cardBookBtn: {
    backgroundColor: '#f05a28',
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 10,
    shadowColor: '#f05a28',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  cardBookBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Empty State */
  emptyStateContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 8,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginTop: 10,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetBtn: {
    backgroundColor: '#0a382a',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 14,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },



  /* Pagination / Load More Styles */
  paginationSection: {
    marginTop: 14,
    marginBottom: 6,
  },
  loadMoreBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#0a382a',
    shadowColor: '#0a382a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  loadMoreBtnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0a382a',
  },
  loadMoreBtnSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  loadMoreIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0a382a',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  allLoadedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#e6f7f2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  allLoadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allLoadedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#008b74',
  },
  collapseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  collapseBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0a382a',
  },
});

