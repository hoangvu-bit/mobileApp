import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { matchVietnameseSearch, removeVietnameseTones } from '../utils/vietnamese';

// Quick destination filter tags
const DESTINATION_TAGS = [
  'Tất cả',
  'Đà Lạt',
  'Tây Ninh',
  'Phú Quốc',
  'Đà Nẵng',
  'Cần Thơ',
  'Hạ Long',
  'Ninh Bình',
  'Vũng Tàu',
  'Sa Pa',
  'Nha Trang',
  'Đồng Tháp',
  'Hà Giang',
  'Quy Nhơn',
];

// Popular search suggestions
const POPULAR_SUGGESTIONS = [
  { id: 's-dl', title: 'Đà Lạt', subtitle: 'Săn mây Cầu Đất, Thác Datanla, Rừng thông', tag: 'Đà Lạt' },
  { id: 's-tn', title: 'Tây Ninh', subtitle: 'Núi Bà Đen, Tòa Thánh, Cáp treo Vân Sơn', tag: 'Tây Ninh' },
  { id: 's-pq', title: 'Phú Quốc', subtitle: 'Cáp treo Hòn Thơm, Grand World, 4 đảo', tag: 'Phú Quốc' },
  { id: 's-dn', title: 'Đà Nẵng - Hội An', subtitle: 'Cầu Vàng Bà Nà Hills, Phố cổ Hội An', tag: 'Đà Nẵng' },
  { id: 's-ct', title: 'Cần Thơ (Miền Tây)', subtitle: 'Chợ nổi Cái Răng, Miệt vườn sông nước', tag: 'Cần Thơ' },
  { id: 's-hl', title: 'Vịnh Hạ Long', subtitle: 'Du thuyền 5 sao, Hang Luồn, Đảo Ti Tốp', tag: 'Hạ Long' },
  { id: 's-nb', title: 'Ninh Bình', subtitle: 'Tràng An, Hang Múa, Chùa Bái Đính', tag: 'Ninh Bình' },
  { id: 's-sp', title: 'Sa Pa', subtitle: 'Đỉnh Fansipan, Bản Cát Cát, Mường Hoa', tag: 'Sa Pa' },
];

export interface TourItem {
  id: string;
  title: string;
  location: string;
  destinationAddress: string;
  province: string;
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
  travelTips: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: string; title: string; desc: string; meals: string; stay: string }[];
  phone: string;
  rating?: string;
  typeTag?: string;
  featureHighlight?: string;
}

export default function TourScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Pagination State (10 tours per page)
  const ITEMS_PER_PAGE = 10;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleSearch = () => {
    Keyboard.dismiss();
    setIsSearchFocused(false);
    setAppliedSearch(searchText.trim());
  };

  const handleClear = () => {
    setSearchText('');
    setAppliedSearch('');
    setIsSearchFocused(false);
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setSearchText('');
    setAppliedSearch('');
    setIsSearchFocused(false);
  };

  const handleSelectSuggestion = (suggestion: { title: string; tag: string }) => {
    setSelectedTag(suggestion.tag);
    setSearchText(suggestion.title);
    setAppliedSearch(suggestion.title);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleOpenTour = (tour: TourItem) => {
    router.push({
      pathname: '/chi-tiet-tour',
      params: {
        tourData: JSON.stringify(tour),
      },
    });
  };

  // Filter Search Suggestions based on typing
  const searchSuggestions = useMemo(() => {
    const q = searchText.trim();
    if (!q) {
      return POPULAR_SUGGESTIONS;
    }
    return POPULAR_SUGGESTIONS.filter(
      (s) => matchVietnameseSearch(s.title, q) || matchVietnameseSearch(s.subtitle, q)
    );
  }, [searchText]);

  // Main Filtered Tours
  const filteredTours = useMemo(() => {
    const activeQ = appliedSearch || searchText;

    return ALL_REAL_TOURS.filter((tour) => {
      // Search query filter
      if (activeQ.trim()) {
        const matchTitle = matchVietnameseSearch(tour.title, activeQ);
        const matchLoc = matchVietnameseSearch(tour.location, activeQ);
        const matchDesc = matchVietnameseSearch(tour.desc, activeQ);
        const matchProv = matchVietnameseSearch(tour.province, activeQ);
        if (!matchTitle && !matchLoc && !matchDesc && !matchProv) {
          return false;
        }
      }

      // Tag filter
      if (selectedTag !== 'Tất cả' && !activeQ.trim()) {
        const matchTag =
          matchVietnameseSearch(tour.province, selectedTag) ||
          matchVietnameseSearch(tour.location, selectedTag) ||
          matchVietnameseSearch(tour.title, selectedTag);
        if (!matchTag) return false;
      }

      return true;
    });
  }, [appliedSearch, searchText, selectedTag]);

  // Reset pagination when search or tag changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [appliedSearch, selectedTag]);

  // Paginated Tours to display
  const displayedTours = useMemo(() => {
    return filteredTours.slice(0, visibleCount);
  }, [filteredTours, visibleCount]);

  const hasMore = visibleCount < filteredTours.length;
  const remainingCount = Math.max(0, filteredTours.length - visibleCount);

  // Featured Hero Tour (Đà Lạt 3N2Đ)
  const featuredTour = ALL_REAL_TOURS[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b3528" />

      {/* BEGIN: MainHeader (Dark Emerald Header matching Stitch design) */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 16) }]}>
        
        {/* Top Action Row */}
        <View style={styles.topActionBar}>
          {/* Back Button */}
          <Pressable
            style={styles.headerBlurBtn}
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </Pressable>

          {/* Center Title & Status Indicator */}
          <View style={styles.headerCenterTitle}>
            <Text style={styles.headerMainTitle}>Tour du lịch & Khám phá</Text>
            <View style={styles.headerSubtitleRow}>
              <View style={styles.liveIndicatorDot} />
              <Text style={styles.headerSubtext}>Khám phá & trải nghiệm tour trọn gói</Text>
            </View>
          </View>

          {/* Right Header Actions */}
          <View style={styles.headerRightActions}>
            <Pressable
              style={styles.headerBlurBtn}
              onPress={() => setIsSearchFocused(true)}
              hitSlop={6}
              accessibilityLabel="Tìm kiếm nhanh"
            >
              <Ionicons name="search" size={18} color="#ffffff" />
            </Pressable>
            <Pressable
              style={styles.headerBlurBtn}
              onPress={() => {}}
              hitSlop={6}
              accessibilityLabel="Thông báo"
            >
              <Ionicons name="notifications-outline" size={18} color="#ffffff" />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>

        {/* Integrated Search Bar Pill */}
        <View style={styles.headerSearchPill}>
          <Ionicons name="search" size={18} color="#0b3528" style={{ opacity: 0.7, marginLeft: 4 }} />
          <TextInput
            style={styles.headerSearchInput}
            placeholder="Tìm tour, điểm đến, trải nghiệm..."
            placeholderTextColor="#94a3b8"
            value={searchText}
            onFocus={() => setIsSearchFocused(true)}
            onChangeText={(val) => {
              setSearchText(val);
              setIsSearchFocused(true);
              if (val === '') {
                setAppliedSearch('');
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
            <Text style={styles.headerSearchActionBtnText}>Tìm tour</Text>
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
                  <View style={styles.suggestionIconBox}>
                    <Ionicons name="location-sharp" size={14} color="#0b3528" />
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
      {/* END: MainHeader */}

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* BEGIN: QuickFilterSection (Horizontal Chips) */}
        <View style={styles.quickFilterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFilterScroll}
          >
            {DESTINATION_TAGS.map((item, idx) => {
              const isActive =
                (selectedTag === item && !appliedSearch) ||
                (appliedSearch && matchVietnameseSearch(item, appliedSearch)) ||
                (item === 'Tất cả' && !appliedSearch && selectedTag === 'Tất cả');

              return (
                <Pressable
                  key={idx}
                  style={[styles.quickFilterChip, isActive && styles.quickFilterChipActive]}
                  onPress={() => handleSelectTag(item)}
                >
                  <Text style={[styles.quickFilterChipText, isActive && styles.quickFilterChipTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        {/* END: QuickFilterSection */}

        {/* BEGIN: HeroFeaturedCard (Hành trình đáng cân nhắc) */}
        <View style={styles.heroFeaturedSection}>
          <View style={styles.heroFeaturedContainer}>
            {/* Ambient Graphic Glow */}
            <View style={styles.ambientGlow} />

            {/* Section Label & Title */}
            <View style={styles.heroHeaderRow}>
              <Text style={styles.heroEyebrow}>GỢI Ý ĐANG MỞ</Text>
              <View style={styles.heroProposalBadge}>
                <Text style={styles.heroProposalBadgeText}>Tour đề xuất</Text>
              </View>
            </View>
            <Text style={styles.heroMainTitle}>Hành trình đáng cân nhắc</Text>
            <Text style={styles.heroSubtitle}>
              Những lựa chọn có thông tin giá và lịch trình 100% thực tế được cập nhật mới nhất.
            </Text>

            {/* Nested Featured Tour Card */}
            <Pressable
              style={styles.nestedFeaturedCard}
              onPress={() => handleOpenTour(featuredTour)}
            >
              <View style={styles.nestedImageContainer}>
                <Image
                  source={{ uri: featuredTour.images[0] }}
                  style={styles.nestedImage}
                  contentFit="cover"
                />
                <View style={styles.nestedGradientOverlay} />

                {/* Badges Overlay */}
                <View style={styles.nestedBadgesTop}>
                  <View style={styles.nestedBadgesLeft}>
                    <View style={styles.featuredBadgeCoral}>
                      <Text style={styles.featuredBadgeCoralText}>Hành trình nổi bật</Text>
                    </View>
                    <View style={styles.durationBadgeGlass}>
                      <Text style={styles.durationBadgeGlassText}>{featuredTour.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.ratingBadgeGold}>
                    <Text style={styles.ratingBadgeGoldText}>★ {featuredTour.rating || '4.9'}</Text>
                  </View>
                </View>

                {/* Bottom Image Meta */}
                <View style={styles.nestedMetaBottom}>
                  <Text style={styles.nestedMetaTitle} numberOfLines={1}>
                    {featuredTour.title}
                  </Text>
                  <View style={styles.nestedMetaRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="location-sharp" size={13} color="#fcd34d" />
                      <Text style={styles.nestedMetaLocation}>{featuredTour.location}</Text>
                    </View>
                    <Text style={styles.nestedMetaDivider}>•</Text>
                    <Text style={styles.nestedMetaTransport}>{featuredTour.transport}</Text>
                  </View>
                </View>
              </View>

              {/* Hero Card Footer Content */}
              <View style={styles.nestedFooter}>
                <View>
                  <Text style={styles.nestedPriceLabel}>Giá tham khảo</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                    <Text style={styles.nestedPriceValue}>{featuredTour.priceText}</Text>
                    <Text style={styles.nestedPriceUnit}>/khách</Text>
                  </View>
                </View>
                <Pressable
                  style={styles.nestedCtaBtn}
                  onPress={() => handleOpenTour(featuredTour)}
                >
                  <Text style={styles.nestedCtaBtnText}>Xem chi tiết</Text>
                  <Ionicons name="arrow-forward" size={13} color="#ffffff" style={{ marginLeft: 3 }} />
                </Pressable>
              </View>
            </Pressable>
          </View>
        </View>
        {/* END: HeroFeaturedCard */}

        {/* BEGIN: TourListingsSection (Horizontal Cards Architecture) */}
        <View style={styles.listingsSection}>
          {/* Header with Counter Badge */}
          <View style={styles.listingsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listingsEyebrow}>DANH SÁCH HÀNH TRÌNH</Text>
              <Text style={styles.listingsTitle}>
                {appliedSearch
                  ? `Kết quả cho "${appliedSearch}"`
                  : selectedTag !== 'Tất cả'
                  ? `Tour du lịch tại ${selectedTag}`
                  : `${filteredTours.length} Tour du lịch nổi bật`}
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredTours.length} tour
              </Text>
            </View>
          </View>

          {/* Empty State */}
          {filteredTours.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="trail-sign-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Không tìm thấy tour phù hợp</Text>
              <Text style={styles.emptyStateSub}>
                Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh sách.
              </Text>
              <Pressable
                style={styles.resetFilterBtn}
                onPress={() => {
                  setSelectedTag('Tất cả');
                  setSearchText('');
                  setAppliedSearch('');
                }}
              >
                <Text style={styles.resetFilterBtnText}>Xem tất cả tour</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {/* Listings Stack (Horizontal Dark Emerald Cards) */}
              <View style={styles.cardsStack}>
                {displayedTours.map((tour) => (
                  <Pressable
                    key={tour.id}
                    style={styles.tourCard}
                    onPress={() => handleOpenTour(tour)}
                  >
                    {/* Thumbnail Container */}
                    <View style={styles.thumbnailContainer}>
                      <Image
                        source={{ uri: tour.images[0] }}
                        style={styles.thumbnailImage}
                        contentFit="cover"
                      />
                      {/* Rating badge */}
                      <View style={styles.cardRatingBadge}>
                        <Text style={styles.cardRatingStar}>★</Text>
                        <Text style={styles.cardRatingValue}>{tour.rating || '4.9'}</Text>
                      </View>
                      {/* Type Badge */}
                      <View style={styles.cardTypeBadge}>
                        <Text style={styles.cardTypeBadgeText} numberOfLines={1}>
                          {tour.typeTag || tour.duration}
                        </Text>
                      </View>
                    </View>

                    {/* Content Container */}
                    <View style={styles.cardContent}>
                      <View>
                        <Text style={styles.cardTitle} numberOfLines={2}>
                          {tour.title}
                        </Text>
                        <View style={styles.cardLocationRow}>
                          <Ionicons name="location-sharp" size={13} color="#059669" />
                          <Text style={styles.cardLocationText} numberOfLines={1}>
                            {tour.location}
                          </Text>
                        </View>
                        {/* Feature Highlight Pill */}
                        <View style={styles.cardFeaturePill}>
                          <View style={styles.cardFeatureDot} />
                          <Text style={styles.cardFeatureText} numberOfLines={1}>
                            {tour.featureHighlight || tour.highlights[0] || 'Dịch vụ chu đáo, bao gồm đưa đón'}
                          </Text>
                        </View>
                      </View>

                      {/* Price & Booking Button Row */}
                      <View style={styles.cardFooterRow}>
                        <View>
                          <Text style={styles.cardPriceLabel}>Giá từ</Text>
                          <Text style={styles.cardPriceValue}>{tour.priceText}</Text>
                        </View>

                        <Pressable
                          style={styles.cardBookBtn}
                          onPress={() => handleOpenTour(tour)}
                        >
                          <Text style={styles.cardBookBtnText}>Đặt tour</Text>
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
                        Xem thêm {Math.min(ITEMS_PER_PAGE, remainingCount)} tour du lịch
                      </Text>
                      <Text style={styles.loadMoreBtnSubtitle}>
                        Đang hiển thị {displayedTours.length} / {filteredTours.length} tour
                      </Text>
                    </View>
                    <View style={styles.loadMoreIconCircle}>
                      <Ionicons name="chevron-down" size={18} color="#ffffff" />
                    </View>
                  </Pressable>
                </View>
              )}

              {/* All loaded footer */}
              {!hasMore && filteredTours.length > ITEMS_PER_PAGE && (
                <View style={styles.allLoadedSection}>
                  <View style={styles.allLoadedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    <Text style={styles.allLoadedText}>
                      Đã hiển thị tất cả {filteredTours.length} tour du lịch
                    </Text>
                  </View>
                  <Pressable
                    style={styles.collapseBtn}
                    onPress={() => {
                      setVisibleCount(ITEMS_PER_PAGE);
                      scrollViewRef.current?.scrollTo({ y: 380, animated: true });
                    }}
                  >
                    <Text style={styles.collapseBtnText}>Thu gọn</Text>
                    <Ionicons name="chevron-up" size={13} color="#0b3528" />
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
        {/* END: TourListingsSection */}

        {/* BEGIN: DestinationInspirationGrid (Cảm hứng cho chuyến đi) */}
        <View style={styles.inspirationSection}>
          <View style={styles.inspirationHeader}>
            <View>
              <Text style={styles.inspirationEyebrow}>CẢM HỨNG CHO CHUYẾN ĐI</Text>
              <Text style={styles.inspirationTitle}>Điểm đến trải nghiệm nổi bật</Text>
            </View>
            <Pressable
              onPress={() => {
                setSelectedTag('Tất cả');
                setSearchText('');
                setAppliedSearch('');
              }}
            >
              <Text style={styles.inspirationViewAll}>Xem tất cả</Text>
            </Pressable>
          </View>

          {/* 2 Column Cards Grid */}
          <View style={styles.inspirationGrid}>
            {INSPIRATION_DESTINATIONS.map((item, idx) => (
              <Pressable
                key={idx}
                style={styles.inspirationCard}
                onPress={() => {
                  setSelectedTag(item.filterTag);
                  setSearchText('');
                  setAppliedSearch('');
                }}
              >
                <View style={styles.inspirationImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.inspirationImage} contentFit="cover" />
                  <View style={styles.inspirationBadge}>
                    <Text style={styles.inspirationBadgeText}>{item.category}</Text>
                  </View>
                </View>
                <View style={styles.inspirationContent}>
                  <Text style={styles.inspirationName} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.inspirationCount}>{item.countSubtitle}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        {/* END: DestinationInspirationGrid */}

      </ScrollView>
    </View>
  );
}

// Destination Inspiration Grid Data
const INSPIRATION_DESTINATIONS = [
  {
    id: 'insp-1',
    title: 'Rừng Tràm Tân Lập',
    category: 'Sinh thái',
    countSubtitle: 'Hơn 12+ tour đang mở',
    filterTag: 'Đồng Tháp',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-2',
    title: 'Làng hoa Sa Đéc',
    category: 'Văn hóa',
    countSubtitle: '8 tour trong tuần',
    filterTag: 'Đồng Tháp',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-3',
    title: 'Đỉnh Fansipan Sa Pa',
    category: 'Núi cao',
    countSubtitle: '15 tour khám phá',
    filterTag: 'Sa Pa',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-4',
    title: 'Vịnh Hạ Long',
    category: 'Biển đảo',
    countSubtitle: '20+ du thuyền 5 sao',
    filterTag: 'Hạ Long',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
  },
];

// 100% REAL TOUR DATASETS ACROSS TOP POPULAR VIETNAMESE DESTINATIONS
export const ALL_REAL_TOURS: TourItem[] = [
  // 1. Đà Lạt
  {
    id: 'tour-dalat-3n2d',
    title: 'Tour Đà Lạt 3N2Đ: săn mây, rừng thông & đồi chè',
    location: 'Đà Lạt, Lâm Đồng',
    destinationAddress: 'Đà Lạt, Lâm Đồng, Việt Nam',
    province: 'Đà Lạt',
    pricePerPerson: 2790000,
    priceText: '2.790.000đ',
    duration: '3 ngày 2 đêm',
    departure: 'Đà Lạt / TP. Hồ Chí Minh',
    transport: 'Xe Limousine VIP',
    groupType: 'Nhóm linh hoạt',
    openDatesCount: '7 ngày khởi hành',
    availableSeats: 18,
    availableDateStr: '07/10',
    rating: '4.9',
    typeTag: 'Tour trọn gói',
    featureHighlight: 'Bao gồm xe đưa đón & BBQ',
    departureDates: [
      { date: '07/10', dayName: 'Thứ 4', seatsLeft: 18 },
      { date: '14/10', dayName: 'Thứ 4', seatsLeft: 12 },
      { date: '21/10', dayName: 'Thứ 4', seatsLeft: 15 },
      { date: '28/10', dayName: 'Thứ 4', seatsLeft: 20 },
    ],
    images: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Hành trình nhẹ nhàng cho nhóm thích khí hậu mát mẻ, cảnh đẹp và nhiều quán cà phê. Tour tập trung vào bình minh săn mây Cầu Đất, rừng thông bạt ngàn, nông nghiệp công nghệ cao và những trải nghiệm đặc trưng của xứ sở sương mù.',
    highlights: [
      'Đón bình minh & săn mây kỳ ảo tại Đồi Chè Cầu Đất',
      'Check-in Ga Đà Lạt cổ kính & Quảng trường Lâm Viên',
      'Trải nghiệm máng trượt alpine coaster tại Thác Datanla',
      'Thưởng thức tiệc nướng BBQ giữa không gian rừng thông se lạnh',
      'Hái dâu tây sạch công nghệ cao tại vườn',
    ],
    travelTips: [
      'Mang áo khoác ấm vì sáng sớm nhiệt độ tại đồi chè khoảng 14-16°C.',
      'Chuẩn bị pin sạc dự phòng vì có rất nhiều góc check-in tuyệt đẹp.',
    ],
    inclusions: [
      'Xe Limousine VIP đời mới đưa đón tận nơi',
      'Khách sạn 3-4 sao trung tâm (2 khách/phòng)',
      '2 bữa sáng buffet + 4 bữa chính đặc sản (bao gồm 1 bữa tiệc BBQ)',
      'Vé tham quan tất cả các điểm trong lịch trình',
      'Bảo hiểm du lịch mức bồi thường 50.000.000đ',
    ],
    exclusions: ['Chi phí giặt ủi cá nhân', 'Nước uống gọi ngoài thực đơn', 'Thuế VAT 8%'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'ĐÓN KHÁCH → GA ĐÀ LẠT → QUẢNG TRƯỜNG LÂM VIÊN',
        desc: 'Xe đón quý khách tại điểm hẹn khởi hành đi Đà Lạt. Nhận phòng khách sạn, tham quan Ga Đà Lạt cổ kính và Quảng trường Lâm Viên ngắm nụ hoa Atiso khổng lồ.',
        meals: 'Ăn trưa, Ăn tối BBQ',
        stay: 'Khách sạn 4 sao trung tâm',
      },
      {
        day: 'NGÀY 2',
        title: 'SĂN MÂY CẦU ĐẤT → THÁC DATANLA → VƯỜN DÂU',
        desc: 'Đón bình minh săn biển mây Cầu Đất. Trải nghiệm máng trượt thác Datanla và hái dâu tây công nghệ cao.',
        meals: 'Ăn sáng buffet, Ăn trưa, Ăn tối',
        stay: 'Khách sạn 4 sao trung tâm',
      },
      {
        day: 'NGÀY 3',
        title: 'THIỀN VIỆN TRÚC LÂM → MUA ĐẶC SẢN → TRỞ VỀ',
        desc: 'Chiêm bái Thiền Viện Trúc Lâm, ngắm Hồ Tuyền Lâm thơ mộng và mua đặc sản mứt dâu về làm quà.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc chuyến đi',
      },
    ],
    phone: '1900 1888',
  },

  // 2. Tây Ninh
  {
    id: 'tour-tayninh-1n',
    title: 'Tour Tây Ninh 1 ngày: Chinh phục đỉnh Núi Bà Đen & Tòa Thánh',
    location: 'TP. Tây Ninh, Tây Ninh',
    destinationAddress: 'Khu du lịch Quốc gia Núi Bà Đen, TP. Tây Ninh',
    province: 'Tây Ninh',
    pricePerPerson: 950000,
    priceText: '950.000đ',
    duration: '1 ngày',
    departure: 'TP. Hồ Chí Minh / Tây Ninh',
    transport: 'Xe du lịch 16 - 29 chỗ',
    groupType: 'Ghép đoàn / Đi riêng',
    openDatesCount: 'Khởi hành hàng ngày',
    availableSeats: 25,
    availableDateStr: 'Hôm nay & Ngày mai',
    rating: '4.9',
    typeTag: 'Tour 1 Ngày',
    featureHighlight: 'Vé cáp treo & Buffet Vân Sơn',
    departureDates: [
      { date: 'Hàng ngày', dayName: 'Thứ 2 - CN', seatsLeft: 25 },
      { date: 'Thứ 7 tuần này', dayName: 'Thứ 7', seatsLeft: 10 },
      { date: 'Chủ nhật tuần này', dayName: 'Chủ nhật', seatsLeft: 8 },
    ],
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Hành trình tâm linh và trải nghiệm văn hóa độc đáo tại Núi Bà Đen - Nóc nhà Nam Bộ, chiêm bái tượng Phật Bà bằng đồng cao nhất Châu Á và Tòa Thánh Cao Đài tráng lệ.',
    highlights: [
      'Vé cáp treo khứ hồi Sun World Ba Den Mountain lên đỉnh núi 986m',
      'Chiêm bái tượng Phật Bà Tây Bổ Đà Sơn bằng đồng kỷ lục Châu Á',
      'Thưởng thức đại tiệc Buffet Vân Sơn hơn 80 món trên đỉnh núi',
      'Tham quan Tòa Thánh Cao Đài Tây Ninh - kiến trúc tôn giáo độc nhất',
      'Thưởng thức đặc sản Bò Tơ Tây Ninh và Bánh canh Trảng Bàng',
    ],
    travelTips: [
      'Nên mặc trang phục lịch sự, kín đáo khi vào chiêm bái Tòa Thánh và chùa chiền.',
      'Đỉnh Núi Bà Đen có nhiều góc chụp ảnh tuyệt đẹp với biển mây và vườn hoa tulip bốn mùa.',
    ],
    inclusions: [
      'Xe du lịch máy lạnh đưa đón khứ hồi TP.HCM - Tây Ninh',
      'Vé cáp treo khứ hồi đỉnh Vân Sơn + Chùa Hang',
      'Bữa trưa buffet tại nhà hàng Vân Sơn trên đỉnh núi',
      'Hướng dẫn viên chuyên nghiệp suốt tuyến',
      'Bảo hiểm du lịch 50.000.000đ',
    ],
    exclusions: ['Chi phí cá nhân', 'Nước uống ngoài menu'],
    itinerary: [
      {
        day: 'BUỔI SÁNG',
        title: 'TP.HCM → BÁNH CANH TRẢNG BÀNG → NÚI BÀ ĐEN',
        desc: '06:00 đón khách tại TP.HCM. Dùng điểm tâm bánh canh Trảng Bàng. Đến Núi Bà Đen đi cáp treo lên đỉnh núi săn mây, chiêm bái tượng Phật Bà Tây Bổ Đà Sơn.',
        meals: 'Ăn sáng, Ăn trưa Buffet Vân Sơn',
        stay: 'Trong ngày',
      },
      {
        day: 'BUỔI CHIỀU',
        title: 'TÒA THÁNH CAO ĐÀI → THƯỞNG THỨC BÒ TƠ → VỀ TP.HCM',
        desc: 'Tham quan Tòa Thánh Tây Ninh dự lễ cúng trưa. Mua đặc sản muối tôm, bánh tráng phơi sương. Thưởng thức bò tơ trước khi về lại TP.HCM.',
        meals: 'Ăn chiều nhẹ đặc sản Bò Tơ',
        stay: 'Kết thúc tour',
      },
    ],
    phone: '0276 353 6666',
  },

  // 3. Phú Quốc
  {
    id: 'tour-phuquoc-3n2d',
    title: 'Tour Phú Quốc 3N2Đ: Câu mực đêm, lặn ngắm san hô 4 đảo',
    location: 'TP. Phú Quốc, Kiên Giang',
    destinationAddress: 'Dương Đông & Nam Đảo, Phú Quốc, Kiên Giang',
    province: 'Phú Quốc',
    pricePerPerson: 3450000,
    priceText: '3.450.000đ',
    duration: '3 ngày 2 đêm',
    departure: 'Phú Quốc / TP.HCM / Hà Nội',
    transport: 'Cano cao tốc & Xe du lịch',
    groupType: 'Nhóm gia đình / Ghép đoàn',
    openDatesCount: 'Khởi hành Thứ 6 hàng tuần',
    availableSeats: 16,
    availableDateStr: 'Thứ 6 tuần này',
    rating: '4.8',
    typeTag: 'Resort & Tour',
    featureHighlight: 'Tặng quay flycam & chèo SUP',
    departureDates: [
      { date: 'Thứ 6 tuần này', dayName: 'Thứ 6', seatsLeft: 16 },
      { date: 'Thứ 6 tuần sau', dayName: 'Thứ 6', seatsLeft: 20 },
      { date: 'Thứ 7 hàng tuần', dayName: 'Thứ 7', seatsLeft: 14 },
    ],
    images: [
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Trải nghiệm biển đảo tuyệt vời nhất Phú Quốc: lướt cano 4 đảo ngọc Hòn Móng Tay, Mây Rút, Gầm Ghì, lặn ngắm san hô tự nhiên và bay trên cáp treo vượt biển Hòn Thơm.',
    highlights: [
      'Cano cao tốc khám phá Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút',
      'Lặn ngắm rạn san hô tự nhiên, tặng bộ ảnh flycam & chèo thuyền SUP',
      'Vé cáp treo Hòn Thơm 3 dây vượt biển dài nhất thế giới',
      'Vui chơi công viên nước Aquatopia đẳng cấp Đông Nam Á',
      'Khám phá Thành phố không ngủ Grand World và xem show Sắc màu Venice',
    ],
    travelTips: [
      'Mang theo đồ bơi, kem chống nắng, kính râm và túi chống nước cho điện thoại.',
      'Show diễn nhạc nước tại Grand World bắt đầu lúc 21:30 tối.',
    ],
    inclusions: [
      '2 đêm resort 4 sao sát biển có hồ bơi vô cực',
      'Cano cao tốc tham quan 4 đảo + SUP chụp ảnh flycam miễn phí',
      'Vé cáp treo Hòn Thơm + vé công viên nước Aquatopia',
      'Các bữa ăn hải sản tiêu chuẩn 200.000đ/suất',
      'Xe du lịch máy lạnh đưa đón sân bay và các điểm tham quan',
    ],
    exclusions: ['Vé máy bay khứ hồi', 'Dịch vụ đi bộ dưới đáy biển seawalker'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'ĐÓN BAY PHÚ QUỐC → GRAND WORLD → SHOW VENICE',
        desc: 'Xe đón quý khách tại sân bay Phú Quốc. Nhận phòng resort nghỉ ngơi. Chiều khám phá Grand World, đi thuyền Gondola trên kênh đào Venice và xem show biểu diễn ánh sáng.',
        meals: 'Ăn trưa, Ăn tối hải sản',
        stay: 'Resort 4 sao sát biển',
      },
      {
        day: 'NGÀY 2',
        title: 'TOUR CANO 4 ĐẢO → LẶN SAN HÔ → CÁP TREO HÒN THƠM',
        desc: 'Cano đưa đoàn đến Hòn Móng Tay, Hòn Mây Rút, Hòn Gầm Ghì lặn ngắm san hô. Chiều đi cáp treo Hòn Thơm vượt biển ngắm hoàng hôn.',
        meals: 'Ăn sáng buffet, Ăn trưa hải sản, Ăn tối',
        stay: 'Resort 4 sao sát biển',
      },
      {
        day: 'NGÀY 3',
        title: 'LÀNG CHÀI HÀM NINH → MUA NGỌC TRAI & NƯỚC MẮM → TIỄN BAY',
        desc: 'Tham quan cơ sở nuôi cấy ngọc trai, nhà thùng nước mắm truyền thống Phú Quốc. Mua hải sản và tiễn sân bay.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc tour',
      },
    ],
    phone: '0297 354 6666',
  },

  // 4. Cần Thơ - Miền Tây
  {
    id: 'tour-cantho-2n1d',
    title: 'Tour Cần Thơ: Chợ nổi Cái Răng & Trải nghiệm miệt vườn sông nước',
    location: 'Ninh Kiều, Cần Thơ',
    destinationAddress: 'Bến Ninh Kiều, Quận Ninh Kiều, TP. Cần Thơ',
    province: 'Cần Thơ',
    pricePerPerson: 1350000,
    priceText: '1.350.000đ',
    duration: '2 ngày 1 đêm',
    departure: 'TP. Hồ Chí Minh / Cần Thơ',
    transport: 'Xe du lịch cao cấp & Tàu thuyền',
    groupType: 'Nhóm gia đình / Ghép đoàn',
    openDatesCount: 'Khởi hành Thứ 7 hàng tuần',
    availableSeats: 20,
    availableDateStr: 'Thứ 7 tuần này',
    rating: '4.8',
    typeTag: '2N1Đ Miền Tây',
    featureHighlight: 'Bao gồm tàu tham quan chợ nổi',
    departureDates: [
      { date: 'Thứ 7 tuần này', dayName: 'Thứ 7', seatsLeft: 20 },
      { date: 'Thứ 7 tuần sau', dayName: 'Thứ 7', seatsLeft: 18 },
    ],
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Hành trình văn hóa sông nước đậm chất miền Tây Nam Bộ: dậy sớm đi tàu khám phá Chợ nổi Cái Răng, thưởng thức hủ tiếu gõ trên sông, đi cầu khỉ và hái trái cây chín mọng tại miệt vườn.',
    highlights: [
      'Đi thuyền máy tham quan Chợ Nổi Cái Răng - chợ nổi lớn nhất ĐBSCL',
      'Thưởng thức bữa sáng hủ tiếu / bánh mì bồng bềnh trên sông nước',
      'Ghé thăm lò hủ tiếu truyền thống và thưởng thức "Pizza hủ tiếu" giòn rụm',
      'Thả ga thưởng thức trái cây miệt vườn tươi ngon quanh năm',
      'Dạo Bến Ninh Kiều lung linh về đêm và cầu đi bộ Tình Yêu',
    ],
    travelTips: ['Nên thức dậy sớm từ 5:30 sáng để ngắm bình minh chợ nổi lúc tấp nập nhất.'],
    inclusions: [
      'Xe du lịch máy lạnh khứ hồi TP.HCM - Cần Thơ',
      '1 đêm khách sạn 3-4 sao trung tâm Bến Ninh Kiều',
      'Tàu du lịch tham quan chợ nổi Cái Răng',
      '1 bữa sáng + 3 bữa chính đặc sản miền Tây (cá lóc nướng trui, lẩu mắm)',
      'Vé tham quan tất cả các điểm miệt vườn',
    ],
    exclusions: ['Chi phí cá nhân', 'Đồ uống gọi thêm'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'TP.HCM → MỸ THO → CẦN THƠ → DU THUYỀN NINH KIỀU',
        desc: 'Khởi hành từ TP.HCM đi Tiền Giang, đi xuồng ba lá cồn Thới Sơn. Chiều về Cần Thơ nhận phòng. Tối đi du thuyền dùng bữa ngắm sông Hậu.',
        meals: 'Ăn trưa đặc sản, Ăn tối du thuyền',
        stay: 'Khách sạn 4 sao Ninh Kiều',
      },
      {
        day: 'NGÀY 2',
        title: 'CHỢ NỔI CÁI RĂNG → LÒ HỦ TIẾU → MIỆT VƯỜN → VỀ TP.HCM',
        desc: 'Sáng sớm đi tàu tham quan Chợ nổi Cái Răng. Thưởng thức trái cây tại vườn Mỹ Khánh. Chiều khởi hành về lại TP.HCM.',
        meals: 'Ăn sáng hủ tiếu nổi, Ăn trưa',
        stay: 'Kết thúc tour',
      },
    ],
    phone: '0292 383 9999',
  },

  // 5. Vũng Tàu
  {
    id: 'tour-vungtau-2n1d',
    title: 'Tour Vũng Tàu 2N1Đ: Biển sáng sớm, Tượng Chúa Kito & Hải sản Gành Hào',
    location: 'TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
    destinationAddress: 'Bãi Sau & Bãi Trước, TP. Vũng Tàu',
    province: 'Vũng Tàu',
    pricePerPerson: 1490000,
    priceText: '1.490.000đ',
    duration: '2 ngày 1 đêm',
    departure: 'TP. Hồ Chí Minh / Vũng Tàu',
    transport: 'Xe du lịch cao cấp',
    groupType: 'Nhóm linh hoạt',
    openDatesCount: 'Khởi hành Thứ 7 hàng tuần',
    availableSeats: 22,
    availableDateStr: 'Thứ 7 tuần này',
    rating: '4.8',
    typeTag: 'Nghỉ dưỡng biển',
    featureHighlight: 'Khách sạn 4 sao sát biển & BBQ',
    departureDates: [
      { date: 'Thứ 7 tuần này', dayName: 'Thứ 7', seatsLeft: 22 },
      { date: 'Thứ 7 tuần sau', dayName: 'Thứ 7', seatsLeft: 18 },
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Chuyến đi nghỉ dưỡng biển ngắn ngày thư thái từ TP.HCM: tắm biển Bãi Sau, leo Núi Nhỏ ngắm toàn cảnh thành phố và thưởng thức bữa tối hải sản tươi ngon bên bờ sóng.',
    highlights: [
      'Chinh phục gần 1.000 bậc thang lên Tượng Chúa Kito Vua trên đỉnh Núi Nhỏ',
      'Ngắm hoàng hôn lãng mạn tại Mũi Nghinh Phong & Bến thuyền Marina',
      'Tắm biển thỏa thích tại Bãi Sau với bờ cát phẳng mịn',
      'Thưởng thức hải sản tươi sống và bánh khọt Gốc Vú Sữa danh tiếng',
    ],
    travelTips: ['Nên leo tượng Chúa vào sáng sớm để đón gió biển mát lành và tránh nắng gắt.'],
    inclusions: [
      'Xe du lịch máy lạnh đưa đón khứ hồi TP.HCM - Vũng Tàu',
      '1 đêm khách sạn 3-4 sao gần biển Bãi Sau',
      '1 bữa sáng + 3 bữa chính hải sản',
      'Vé tham quan tất cả các điểm',
      'Bảo hiểm du lịch 50.000.000đ',
    ],
    exclusions: ['Chi phí cá nhân', 'Đồ uống gọi thêm'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'TP.HCM → MŨI NGHINH PHONG → TẮM BIỂN BÃI SAU → HẢI SẢN GÀNH HÀO',
        desc: 'Khởi hành từ TP.HCM đến Vũng Tàu. Check-in Mũi Nghinh Phong và Cổng Trời. Chiều tắm biển Bãi Sau. Tối thưởng thức hải sản tươi sống tại Gành Hào.',
        meals: 'Ăn trưa, Ăn tối hải sản',
        stay: 'Khách sạn 4 sao Bãi Sau',
      },
      {
        day: 'NGÀY 2',
        title: 'TƯỢNG CHÚA KITO → HẢI ĐĂNG CỔ → BÁNH KHỌT → VỀ TP.HCM',
        desc: 'Sáng sớm leo núi tham quan Tượng Chúa Kito Vua và Ngọn Hải Đăng cổ nhất Việt Nam. Ăn trưa bánh khọt và trở về TP.HCM.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc chuyến đi',
      },
    ],
    phone: '0254 362 8888',
  },

  // 6. Đà Nẵng - Hội An
  {
    id: 'tour-danang-4n3d',
    title: 'Tour Đà Nẵng - Hội An 4N3Đ: Cầu Vàng Bà Nà Hills & Phố Cổ Hội An',
    location: 'Đà Nẵng & Hội An, Quảng Nam',
    destinationAddress: 'Sơn Trà & Bà Nà Hills, TP. Đà Nẵng',
    province: 'Đà Nẵng',
    pricePerPerson: 3890000,
    priceText: '3.890.000đ',
    duration: '4 ngày 3 đêm',
    departure: 'Đà Nẵng / Hà Nội / TP.HCM',
    transport: 'Xe du lịch đời mới & Cáp treo',
    groupType: 'Ghép đoàn hàng tuần',
    openDatesCount: 'Khởi hành Thứ 5 hàng tuần',
    availableSeats: 15,
    availableDateStr: 'Thứ 5 tuần này',
    rating: '4.9',
    typeTag: 'Di sản miền Trung',
    featureHighlight: 'Vé cáp treo Cầu Vàng & Du thuyền',
    departureDates: [
      { date: 'Thứ 5 tuần này', dayName: 'Thứ 5', seatsLeft: 15 },
      { date: 'Thứ 5 tuần sau', dayName: 'Thứ 5', seatsLeft: 18 },
    ],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Hành trình di sản miền Trung: chiêm ngưỡng Cầu Vàng bàn tay khổng lồ trên đỉnh Bà Nà, thả hoa đăng trên sông Hoài phố cổ Hội An và chiêm bái Chùa Linh Ứng Sơn Trà.',
    highlights: [
      'Vé cáp treo Sun World Bà Nà Hills & check-in Cầu Vàng nổi tiếng thế giới',
      'Dạo bộ Phố Cổ Hội An lung linh đèn lồng, Chùa Cầu và thả hoa đăng',
      'Trải nghiệm ngồi thuyền thúng bồng bềnh tại Rừng Dừa Bảy Mẫu',
      'Chiêm bái tượng Phật Bà Quan Âm 67m tại Chùa Linh Ứng Bán đảo Sơn Trà',
    ],
    travelTips: ['Hội An đẹp nhất từ 17:30 chiều khi các dãy phố bắt đầu thắp sáng đèn lồng.'],
    inclusions: [
      'Khách sạn 4 sao gần biển Mỹ Khê Đà Nẵng',
      'Vé cáp treo Bà Nà Hills + buffet trưa quốc tế trên đỉnh Bà Nà',
      'Vé thuyền thúng rừng dừa Bảy Mẫu',
      'Các bữa ăn đặc sản mì Quảng, bê thui Cầu Mống, cơm gà Hội An',
      'Xe du lịch máy lạnh đưa đón suốt tuyến',
    ],
    exclusions: ['Vé máy bay khứ hồi', 'Bảo tàng tượng sáp Bà Nà'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'ĐÓN BAY ĐÀ NẴNG → BÁN ĐẢO SƠN TRÀ → BIỂN MỸ KHÊ',
        desc: 'Đón khách tại sân bay Đà Nẵng. Tham quan Chùa Linh Ứng ngắm vịnh biển Đà Nẵng, tắm biển Mỹ Khê.',
        meals: 'Ăn trưa, Ăn tối',
        stay: 'Khách sạn 4 sao Đà Nẵng',
      },
      {
        day: 'NGÀY 2',
        title: 'SUN WORLD BÀ NÀ HILLS → CẦU VÀNG → LÀNG PHÁP',
        desc: 'Trọn ngày vui chơi tại Bà Nà Hills: Cầu Vàng, Làng Pháp, Hầm rượu Debay, công viên Fantasy Park.',
        meals: 'Ăn sáng, Ăn trưa buffet Bà Nà, Ăn tối',
        stay: 'Khách sạn 4 sao Đà Nẵng',
      },
      {
        day: 'NGÀY 3',
        title: 'RỪNG DỪA BẢY MẪU → PHỐ CỔ HỘI AN',
        desc: 'Đi thuyền thúng xem quăng chài tại Rừng dừa Bảy Mẫu. Chiều dạo phố cổ Hội An và thả hoa đăng.',
        meals: 'Ăn sáng, Ăn trưa, Ăn tối Hội An',
        stay: 'Khách sạn 4 sao Đà Nẵng',
      },
      {
        day: 'NGÀY 4',
        title: 'NGŨ HÀNH SƠN → CHỢ HÀN → TIỄN BAY',
        desc: 'Khám phá danh thắng Ngũ Hành Sơn, mua đặc sản chả bò tại Chợ Hàn và tiễn bay.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc chuyến đi',
      },
    ],
    phone: '0236 393 8888',
  },

  // 7. Vịnh Hạ Long
  {
    id: 'tour-halong-2n1d',
    title: 'Tour Vịnh Hạ Long 2N1Đ: Du thuyền 5 sao sang trọng & Chèo Kayak hang Luồn',
    location: 'Hạ Long, Quảng Ninh',
    destinationAddress: 'Cảng tàu khách Quốc tế Tuần Châu, TP. Hạ Long',
    province: 'Hạ Long',
    pricePerPerson: 3250000,
    priceText: '3.250.000đ',
    duration: '2 ngày 1 đêm',
    departure: 'Hà Nội / Hạ Long',
    transport: 'Du thuyền 5 sao & Xe Limousine',
    groupType: 'Nghỉ dưỡng cao cấp',
    openDatesCount: 'Khởi hành hàng ngày',
    availableSeats: 14,
    availableDateStr: 'Hàng ngày',
    rating: '4.9',
    typeTag: 'Du thuyền 5 sao',
    featureHighlight: 'Phòng ban công riêng & Buffet hải sản',
    departureDates: [
      { date: 'Hôm nay', dayName: 'Hôm nay', seatsLeft: 14 },
      { date: 'Ngày mai', dayName: 'Ngày mai', seatsLeft: 12 },
      { date: 'Thứ 7 tuần này', dayName: 'Thứ 7', seatsLeft: 8 },
    ],
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Trải nghiệm nghỉ dưỡng đẳng cấp giữa kỳ quan thiên nhiên thế giới UNESCO. Chèo kayak tại Hang Luồn, tắm biển đảo Ti Tốp, ngắm hoàng hôn vịnh biển và thưởng thức tiệc BBQ hải sản thượng hạng.',
    highlights: [
      'Nghỉ dưỡng trên Du thuyền 5 sao với phòng ngủ có ban công riêng view vịnh',
      'Trải nghiệm tự tay chèo thuyền Kayak hoặc đi thuyền nan tại Hang Luồn',
      'Chinh phục đỉnh núi Đảo Ti Tốp ngắm toàn cảnh 360 độ Vịnh Hạ Long',
      'Tiệc trà chiều Sunset Party ngắm hoàng hôn tuyệt mỹ trên boong tàu',
      'Lớp học nấu ăn làm nem rán truyền thống và câu mực đêm trên biển',
    ],
    travelTips: ['Mang theo đồ bơi, kính mát và máy ảnh để ghi lại những khoảnh khắc hoàng hôn lộng lẫy.'],
    inclusions: [
      'Xe Limousine cao cấp đưa đón Hà Nội - Hạ Long khứ hồi',
      '1 đêm phòng nghỉ cao cấp trên du thuyền 5 sao',
      '4 bữa ăn cao cấp: 1 trưa buffet hải sản, 1 tối set menu Âu-Á, 1 sáng nhẹ, 1 trưa brunch',
      'Vé tham quan tất cả các điểm trên Vịnh Hạ Long',
      'Hoạt động chèo kayak, tắm biển, câu mực đêm, tập Taichi buổi sáng',
    ],
    exclusions: ['Đồ uống bar rượu cao cấp', 'Dịch vụ spa massage trên tàu'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'HÀ NỘI → CẢNG TUẦN CHÂU → CHECK-IN DU THUYỀN → HANG SỬNG SỐT → ĐẢO TI TỐP',
        desc: '08:30 đón khách tại Hà Nội. Đến Tuần Châu làm thủ tục lên tàu, thưởng thức đồ uống chào mừng và ăn trưa buffet. Chiều tham quan Hang Sửng Sốt và tắm biển đảo Ti Tốp.',
        meals: 'Ăn trưa buffet hải sản, Ăn tối gala',
        stay: 'Du thuyền 5 sao trên vịnh',
      },
      {
        day: 'NGÀY 2',
        title: 'TẬP TAICHI BÌNH MINH → CHÈO KAYAK HANG LUỒN → BRUNCH → VỀ HÀ NỘI',
        desc: 'Tập thái cực quyền đón bình minh trên sundeck. Chèo thuyền Kayak khám phá vẻ đẹp Hang Luồn. Trả phòng, dùng bữa brunch và cập bến Tuần Châu về lại Hà Nội.',
        meals: 'Ăn sáng nhẹ, Ăn trưa buffet brunch',
        stay: 'Kết thúc hải trình',
      },
    ],
    phone: '0243 926 8888',
  },

  // 8. Ninh Bình
  {
    id: 'tour-ninhbinh-2n1d',
    title: 'Tour Ninh Bình 2N1Đ: Quần thể Tràng An, Đỉnh Hang Múa & Bái Đính',
    location: 'Hoa Lư & Gia Viễn, Ninh Bình',
    destinationAddress: 'Quần thể danh thắng Tràng An, Hoa Lư, Ninh Bình',
    province: 'Ninh Bình',
    pricePerPerson: 2190000,
    priceText: '2.190.000đ',
    duration: '2 ngày 1 đêm',
    departure: 'Hà Nội / Ninh Bình',
    transport: 'Xe Limousine cao cấp',
    groupType: 'Nhóm gia đình / Ghép đoàn',
    openDatesCount: 'Khởi hành Thứ 7 hàng tuần',
    availableSeats: 18,
    availableDateStr: 'Thứ 7 tuần này',
    rating: '4.9',
    typeTag: 'Di sản UNESCO',
    featureHighlight: 'Đi thuyền đò nan & Đặc sản dê núi',
    departureDates: [
      { date: 'Thứ 7 tuần này', dayName: 'Thứ 7', seatsLeft: 18 },
      { date: 'Thứ 7 tuần sau', dayName: 'Thứ 7', seatsLeft: 15 },
    ],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Hành trình khám phá Di sản Văn hóa và Thiên nhiên Thế giới Tràng An, leo đỉnh Hang Múa ngắm toàn cảnh sông Ngô Đồng và chiêm bái ngôi chùa lớn nhất Đông Nam Á.',
    highlights: [
      'Ngồi đò nan chèo tay luồn lách qua các hang động kỳ vĩ của Tràng An',
      'Chinh phục gần 500 bậc đá lên đỉnh Ngọa Long - Hang Múa ngắm thung lũng Tam Cốc',
      'Chiêm bái Chùa Bái Đính với hàng loạt kỷ lục tượng đồng và hành lang La Hán',
      'Thưởng thức đặc sản Cơm cháy Ninh Bình & Dê núi 7 món trứ danh',
    ],
    travelTips: ['Nên đi giày thể thao có độ bám tốt để leo Hang Múa dễ dàng và không bị mỏi chân.'],
    inclusions: [
      'Xe Limousine đưa đón khứ hồi Hà Nội - Ninh Bình',
      '1 đêm resort/khách sạn sinh thái tại Ninh Bình',
      'Vé thuyền đò Tràng An + vé Hang Múa + xe điện Bái Đính',
      'Các bữa ăn đặc sản dê núi Ninh Bình',
      'Hướng dẫn viên suốt tuyến',
    ],
    exclusions: ['Chi phí cá nhân', 'Đồ uống tự gọi ngoài menu'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'HÀ NỘI → CHÙA BÁI ĐÍNH → ĐÒ NAN TRÀNG AN',
        desc: 'Đón khách tại Hà Nội đến Ninh Bình. Chiêm bái Chùa Bái Đính. Chiều đi thuyền đò Tràng An luồn qua các hang động kỳ ảo.',
        meals: 'Ăn trưa đặc sản dê núi, Ăn tối',
        stay: 'Resort sinh thái Ninh Bình',
      },
      {
        day: 'NGÀY 2',
        title: 'CHINH PHỤC HANG MÚA → CỐ ĐÔ HOA LƯ → HÀ NỘI',
        desc: 'Sáng leo đỉnh Hang Múa ngắm toàn cảnh Tam Cốc. Tham quan Cố đô Hoa Lư đền vua Đinh - vua Lê. Chiều về lại Hà Nội.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc chuyến đi',
      },
    ],
    phone: '0229 365 8333',
  },

  // 9. Sa Pa
  {
    id: 'tour-sapa-3n2d',
    title: 'Tour Sa Pa 3N2Đ: Chinh phục đỉnh Fansipan, Bản Cát Cát & Mường Hoa',
    location: 'Sa Pa, Lào Cai',
    destinationAddress: 'Thị xã Sa Pa, Tỉnh Lào Cai',
    province: 'Sa Pa',
    pricePerPerson: 2650000,
    priceText: '2.650.000đ',
    duration: '3 ngày 2 đêm',
    departure: 'Hà Nội / Sa Pa',
    transport: 'Xe giường nằm Cabin đôi VIP',
    groupType: 'Nhóm gia đình / Cặp đôi',
    openDatesCount: 'Khởi hành hàng ngày',
    availableSeats: 16,
    availableDateStr: 'Hàng ngày',
    rating: '4.9',
    typeTag: 'Tây Bắc hùng vĩ',
    featureHighlight: 'Vé cáp treo Fansipan & Tàu Mường Hoa',
    departureDates: [
      { date: 'Hàng ngày', dayName: 'Thứ 2 - CN', seatsLeft: 16 },
      { date: 'Thứ 6 tuần này', dayName: 'Thứ 6', seatsLeft: 10 },
    ],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Chinh phục nóc nhà Đông Dương 3.143m, ngắm thung lũng Mường Hoa tuyệt đẹp, tìm hiểu nét văn hóa độc đáo của người H’Mông tại bản Cát Cát và thưởng thức lẩu cá hồi Tây Bắc.',
    highlights: [
      'Chinh phục đỉnh Fansipan bằng cáp treo 3 dây hiện đại nhất thế giới',
      'Check-in Cột cờ Fansipan và quần thể tâm linh trên mây',
      'Đi tàu hỏa leo núi Mường Hoa băng qua thung lũng ruộng bậc thang',
      'Khám phá Bản Cát Cát, thử trang phục truyền thống dân tộc',
      'Thưởng thức Lẩu cá hồi cá tầm và đặc sản thắng cố Tây Bắc',
    ],
    travelTips: ['Nhiệt độ trên đỉnh Fansipan có thể xuống dưới 10°C, cần mang áo ấm dày.'],
    inclusions: [
      'Xe cabin đôi cao cấp đưa đón Hà Nội - Sa Pa khứ hồi',
      '2 đêm khách sạn 4 sao view núi Hàm Rồng',
      'Vé cáp treo Fansipan khứ hồi + vé tàu Mường Hoa',
      'Các bữa ăn đặc sản cá hồi Sa Pa, thịt lợn bản nướng',
    ],
    exclusions: ['Vé tàu hỏa lên đỉnh Fansipan chặng cuối', 'Chi phí thuê trang phục'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'HÀ NỘI → SA PA → BẢN CÁT CÁT → NHÀ THỜ ĐÁ',
        desc: 'Xe đón quý khách khởi hành đi Sa Pa. Nhận phòng khách sạn, tham quan Bản Cát Cát, Nhà thờ đá cổ và dạo chợ đêm Sa Pa.',
        meals: 'Ăn trưa, Ăn tối Lẩu cá hồi',
        stay: 'Khách sạn 4 sao view núi',
      },
      {
        day: 'NGÀY 2',
        title: 'CÁP TREO FANSIPAN → QUẦN THỂ TÂM LINH → MOANA SA PA',
        desc: 'Đi cáp treo lên đỉnh Fansipan 3.143m ngắm biển mây. Chiều check-in Moana Sa Pa với tượng cô gái Bali sống ảo.',
        meals: 'Ăn sáng buffet, Ăn trưa, Ăn tối',
        stay: 'Khách sạn 4 sao view núi',
      },
      {
        day: 'NGÀY 3',
        title: 'ĐÈO Ô QUY HỒ → CẦU KÍNH RỒNG MÂY → VỀ HÀ NỘI',
        desc: 'Chinh phục một trong "Tứ đại đỉnh đèo" Ô Quy Hồ, check-in Cổng trời và trở về Hà Nội.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc tour',
      },
    ],
    phone: '0214 387 1999',
  },

  // 10. Nha Trang
  {
    id: 'tour-nhatrang-3n2d',
    title: 'Tour Nha Trang 3N2Đ: Khám phá 3 đảo VIP, Lặn biển ngắm san hô & Tắm bùn',
    location: 'TP. Nha Trang, Khánh Hòa',
    destinationAddress: 'Vịnh Nha Trang, TP. Nha Trang, Tỉnh Khánh Hòa',
    province: 'Nha Trang',
    pricePerPerson: 2850000,
    priceText: '2.850.000đ',
    duration: '3 ngày 2 đêm',
    departure: 'Nha Trang / TP.HCM / Hà Nội',
    transport: 'Cano cao tốc & Xe du lịch',
    groupType: 'Nhóm gia đình / Bạn bè',
    openDatesCount: 'Khởi hành hàng ngày',
    availableSeats: 20,
    availableDateStr: 'Hàng ngày',
    rating: '4.8',
    typeTag: 'Biển đảo VIP',
    featureHighlight: 'Cano cao tốc & Vé tắm bùn I-Resort',
    departureDates: [
      { date: 'Hàng ngày', dayName: 'Thứ 2 - CN', seatsLeft: 20 },
      { date: 'Thứ 6 tuần này', dayName: 'Thứ 6', seatsLeft: 14 },
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Tận hưởng trọn vẹn vẻ đẹp của một trong những vịnh biển đẹp nhất thế giới: lướt cano cao tốc tham quan Vịnh San Hô, Làng Chài, Hòn Tằm và trải nghiệm ngâm bùn khoáng nóng thư giãn.',
    highlights: [
      'Cano cao tốc tham quan Vịnh San Hô, Hòn Tằm, Làng Chài',
      'Lặn biển ngắm san hô rực rỡ và các sinh vật biển kỳ thú',
      'Gói ngâm bùn khoáng nóng cao cấp tại thiên đường Hòn Tằm / I-Resort',
      'Check-in Tháp Bà Ponagar nghìn năm tuổi và Chùa Long Sơn',
      'Thưởng thức nem nướng Ninh Hòa và tiệc hải sản tôm hùm tươi sống',
    ],
    travelTips: ['Tắm bùn khoáng rất tốt cho da và cơ khớp, nên mang theo đồ bơi tối màu.'],
    inclusions: [
      'Khách sạn 4 sao trung tâm đường Trần Phú sát biển',
      'Cano cao tốc tham quan các đảo + vé tắm bùn khoáng Hòn Tằm',
      'Các bữa ăn hải sản và đặc sản Nha Trang',
      'Xe du lịch máy lạnh đưa đón sân bay Cam Ranh và các điểm',
    ],
    exclusions: ['Vé máy bay khứ hồi', 'Trò chơi thể thao biển bay dù lượn, môtô nước'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'ĐÓN BAY CAM RANH → THÁP BÀ PONAGAR → BIỂN TRẦN PHÚ',
        desc: 'Đón khách tại sân bay Cam Ranh. Nhận phòng khách sạn, tham quan quần thể Tháp Bà Ponagar và dạo biển đêm Trần Phú.',
        meals: 'Ăn trưa, Ăn tối nem nướng Ninh Hòa',
        stay: 'Khách sạn 4 sao Trần Phú',
      },
      {
        day: 'NGÀY 2',
        title: 'CANO 3 ĐẢO VIP → VỊNH SAN HÔ → TẮM BÙN HÒN TẰM',
        desc: 'Lướt cano tham quan Vịnh San Hô lặn ngắm san hô. Dùng bữa trưa hải sản tại Làng Chài. Chiều sang Hòn Tằm tắm bùn khoáng.',
        meals: 'Ăn sáng buffet, Ăn trưa hải sản, Ăn tối',
        stay: 'Khách sạn 4 sao Trần Phú',
      },
      {
        day: 'NGÀY 3',
        title: 'CHÙA LONG SƠN → CHỢ ĐẦM MUA ĐẶC SẢN → TIỄN BAY',
        desc: 'Chiêm bái tượng Kim Thân Phật Tổ tại Chùa Long Sơn, mua mực một nắng tại Chợ Đầm và tiễn sân bay.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc tour',
      },
    ],
    phone: '0258 388 9999',
  },

  // 11. Đồng Tháp
  {
    id: 'tour-dongthap-1n',
    title: 'Tour Đồng Tháp 1 Ngày: Rừng Tràm Gáo Giồng & Làng Hoa Sa Đéc',
    location: 'Cao Lãnh & Sa Đéc, Đồng Tháp',
    destinationAddress: 'Khu du lịch sinh thái Gáo Giồng, Cao Lãnh, Đồng Tháp',
    province: 'Đồng Tháp',
    pricePerPerson: 890000,
    priceText: '890.000đ',
    duration: '1 ngày',
    departure: 'TP. Hồ Chí Minh / Đồng Tháp',
    transport: 'Xe du lịch máy lạnh & Xuồng ba lá',
    groupType: 'Gia đình / Đoàn bạn bè',
    openDatesCount: 'Khởi hành Thứ 7 & Chủ nhật',
    availableSeats: 24,
    availableDateStr: 'Cuối tuần này',
    rating: '4.8',
    typeTag: 'Sinh thái miền Tây',
    featureHighlight: 'Chèo xuồng ba lá & Thưởng thức sen',
    departureDates: [
      { date: 'Thứ 7 tuần này', dayName: 'Thứ 7', seatsLeft: 24 },
      { date: 'Chủ nhật tuần này', dayName: 'Chủ nhật', seatsLeft: 18 },
    ],
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Hành trình về với xứ sở Sen Hồng: ngồi xuồng ba lá len lỏi trong rừng tràm bạt ngàn ngắm sân chim hoang dã, thưởng thức cơm gói lá sen và ngắm muôn sắc hoa tại Làng hoa Sa Đéc.',
    highlights: [
      'Đi xuồng chèo ngắm hàng vạn loài chim nước tại sân chim Gáo Giồng',
      'Thưởng thức tiệc trưa đặc sản: Cơm gói lá sen, cá lóc nướng lá sen non',
      'Tham quan Làng hoa kiểng Sa Đéc hơn 100 năm tuổi',
      'Ghé thăm Nhà cổ Huỳnh Thủy Lê gắn liền với thiên tình sử "Người Tình"',
    ],
    travelTips: ['Nên mang theo nón lá hoặc mũ rộng vành để đi xuồng ba lá che mát.'],
    inclusions: [
      'Xe du lịch chất lượng cao TP.HCM - Đồng Tháp khứ hồi',
      'Vé vào cổng tất cả điểm tham quan + xuồng chèo Gáo Giồng',
      'Bữa trưa đặc sản miền Tây đậm vị sen Đồng Tháp',
      'Bảo hiểm du lịch',
    ],
    exclusions: ['Chi phí mua hoa kiểng mang về'],
    itinerary: [
      {
        day: 'BUỔI SÁNG',
        title: 'TP.HCM → CAO LÃNH → RỪNG TRÀM GÁO GIỒNG',
        desc: '06:00 đón khách khởi hành đi Đồng Tháp. Đi xuồng ba lá vào sân chim Gáo Giồng ngắm cò vạc về tổ, leo đài quan sát ngắm toàn cảnh rừng tràm.',
        meals: 'Ăn sáng, Ăn trưa cơm sen',
        stay: 'Trong ngày',
      },
      {
        day: 'BUỔI CHIỀU',
        title: 'LÀNG HOA SA ĐÉC → NHÀ CỔ HUỲNH THỦY LÊ → VỀ TP.HCM',
        desc: 'Tham quan muôn sắc hoa tại làng hoa Sa Đéc, khám phá kiến trúc Đông - Tây kết hợp tại Nhà cổ Huỳnh Thủy Lê và về lại TP.HCM.',
        meals: 'Ăn nhẹ bánh xèo',
        stay: 'Kết thúc tour',
      },
    ],
    phone: '0277 385 6666',
  },

  // 12. Hà Giang
  {
    id: 'tour-hagiang-3n2d',
    title: 'Tour Hà Giang 3N2Đ: Đèo Mã Pí Lèng, Hẻm Tu Sản & Sông Nho Quế',
    location: 'Đồng Văn & Mèo Vạc, Hà Giang',
    destinationAddress: 'Cao nguyên đá Đồng Văn, Hà Giang',
    province: 'Hà Giang',
    pricePerPerson: 3390000,
    priceText: '3.390.000đ',
    duration: '3 ngày 2 đêm',
    departure: 'Hà Nội / Hà Giang',
    transport: 'Xe Limousine giường nằm cao cấp',
    groupType: 'Nhóm trải nghiệm / Phượt an toàn',
    openDatesCount: 'Khởi hành Thứ 6 hàng tuần',
    availableSeats: 15,
    availableDateStr: 'Thứ 6 tuần này',
    rating: '4.9',
    typeTag: 'Vòng cung Đông Bắc',
    featureHighlight: 'Du thuyền sông Nho Quế & Đèo Mã Pí Lèng',
    departureDates: [
      { date: 'Thứ 6 tuần này', dayName: 'Thứ 6', seatsLeft: 15 },
      { date: 'Thứ 6 tuần sau', dayName: 'Thứ 6', seatsLeft: 18 },
    ],
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Hành trình chinh phục cực Bắc Tổ quốc: đi thuyền trên dòng sông Nho Quế xanh ngọc bích qua Hẻm vực Tu Sản sâu nhất Đông Nam Á, vượt đỉnh đèo Mã Pí Lèng huyền thoại và ngắm hoa tam giác mạch.',
    highlights: [
      'Đi du thuyền ngắm hẻm vực Tu Sản trên dòng sông Nho Quế xanh biếc',
      'Chinh phục Đèo Mã Pí Lèng - vua của các con đèo Việt Nam',
      'Check-in Cột cờ Lũng Cú - điểm cực Bắc thiêng liêng của Tổ quốc',
      'Thăm Dinh thự Vua Mèo Vương Chính Đức và Phố cổ Đồng Văn',
      'Thưởng thức bánh tam giác mạch, rượu ngô men lá và thắng cố',
    ],
    travelTips: ['Hà Giang đường đèo dốc uốn lượn, nên chuẩn bị thuốc say xe nếu cần.'],
    inclusions: [
      'Xe giường nằm cao cấp khứ hồi Hà Nội - Hà Giang',
      'Xe máy kèm tài xế bản địa hoặc xe du lịch máy lạnh suốt tuyến',
      '2 đêm khách sạn/homestay tiêu chuẩn tại Đồng Văn & Yên Minh',
      'Vé du thuyền sông Nho Quế + vé tham quan các điểm',
      'Các bữa ăn đặc sản Đông Bắc',
    ],
    exclusions: ['Chi phí thuê trang phục dân tộc chụp ảnh'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'HÀ NỘI → HÀ GIANG → CỔNG TRỜI QUẢN BẠ → YÊN MINH',
        desc: 'Khởi hành từ Hà Nội. Check-in km 0 Hà Giang, Dốc Bắc Sum, Núi Đôi Quản Bạ, Rừng thông Yên Minh.',
        meals: 'Ăn trưa, Ăn tối',
        stay: 'Khách sạn tại Yên Minh',
      },
      {
        day: 'NGÀY 2',
        title: 'CỘT CỜ LŨNG CÚ → DINH VUA MÈO → ĐÈO MÃ PÍ LÈNG → SÔNG NHO QUẾ',
        desc: 'Chinh phục Cột cờ Lũng Cú. Chiều vượt đèo Mã Pí Lèng, đi thuyền ngắm Hẻm Tu Sản trên sông Nho Quế. Tối dạo phố cổ Đồng Văn.',
        meals: 'Ăn sáng, Ăn trưa, Ăn tối',
        stay: 'Khách sạn/homestay Phố Cổ Đồng Văn',
      },
      {
        day: 'NGÀY 3',
        title: 'CHỢ PHIÊN ĐỒNG VĂN → DỐC THẨM MÃ → HÀ NỘI',
        desc: 'Tham quan Chợ phiên Đồng Văn rực rỡ sắc màu, check-in Dốc Thẩm Mã và lên xe trở về Hà Nội.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc chuyến đi',
      },
    ],
    phone: '0219 386 8888',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5',
  },
  scrollContent: {
    paddingBottom: 90,
  },

  // HEADER STYLES (Dark Emerald Theme)
  headerContainer: {
    backgroundColor: '#0b3528',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 50,
  },
  topActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 4,
  },
  headerBlurBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenterTitle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  headerMainTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34d399',
  },
  headerSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(209, 250, 229, 0.85)',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
    borderWidth: 1.5,
    borderColor: '#0b3528',
  },

  // SEARCH PILL
  headerSearchPill: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerSearchActionBtn: {
    backgroundColor: '#0f382c',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSearchActionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  // SEARCH SUGGESTIONS OVERLAY
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 999,
    marginTop: 6,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 6,
  },
  suggestionsHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  suggestionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
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

  // QUICK FILTERS
  quickFilterSection: {
    marginTop: 14,
  },
  quickFilterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  quickFilterChipActive: {
    backgroundColor: '#0b3528',
    borderColor: '#0b3528',
  },
  quickFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  quickFilterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // HERO FEATURED SECTION (Hành trình đáng cân nhắc)
  heroFeaturedSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  heroFeaturedContainer: {
    backgroundColor: '#0b3528',
    borderRadius: 24,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  ambientGlow: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fcd34d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroProposalBadge: {
    backgroundColor: 'rgba(6, 35, 26, 0.8)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(27, 94, 75, 0.6)',
  },
  heroProposalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6ee7b7',
  },
  heroMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(209, 250, 229, 0.85)',
    lineHeight: 18,
    marginBottom: 14,
  },

  // NESTED FEATURED CARD
  nestedFeaturedCard: {
    backgroundColor: '#07241b',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nestedImageContainer: {
    height: 175,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  nestedImage: {
    width: '100%',
    height: '100%',
  },
  nestedGradientOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  nestedBadgesTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nestedBadgesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuredBadgeCoral: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  featuredBadgeCoralText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  durationBadgeGlass: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  durationBadgeGlassText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  ratingBadgeGold: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingBadgeGoldText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '900',
  },
  nestedMetaBottom: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  nestedMetaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  nestedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  nestedMetaLocation: {
    color: '#fcd34d',
    fontSize: 11,
    fontWeight: '700',
  },
  nestedMetaDivider: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
  },
  nestedMetaTransport: {
    color: 'rgba(209, 250, 229, 0.9)',
    fontSize: 11,
    fontWeight: '600',
  },

  // NESTED FOOTER
  nestedFooter: {
    backgroundColor: '#07241b',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(27, 94, 75, 0.4)',
  },
  nestedPriceLabel: {
    fontSize: 9,
    color: 'rgba(209, 250, 229, 0.7)',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  nestedPriceValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#fcd34d',
  },
  nestedPriceUnit: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  nestedCtaBtn: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nestedCtaBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  // LISTINGS SECTION
  listingsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  listingsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  listingsEyebrow: {
    fontSize: 11,
    fontWeight: '900',
    color: '#eb4916',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listingsTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0b3528',
  },

  // CARDS STACK (Horizontal Dark Emerald Architecture)
  cardsStack: {
    gap: 12,
  },
  tourCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 10,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnailContainer: {
    width: 122,
    height: 126,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  cardRatingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cardRatingStar: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardRatingValue: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  cardTypeBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(11, 53, 40, 0.88)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  cardTypeBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },

  // CARD CONTENT
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  cardLocationText: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },
  cardFeaturePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: 'rgba(209, 250, 229, 0.8)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  cardFeatureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10b981',
  },
  cardFeatureText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#065f46',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cardPriceLabel: {
    fontSize: 9,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  cardPriceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#eb4916',
    marginTop: 1,
  },
  cardBookBtn: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardBookBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },

  // PAGINATION (Xem thêm 10 items)
  paginationSection: {
    marginTop: 16,
  },
  loadMoreBtn: {
    backgroundColor: '#0b3528',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  loadMoreBtnTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  loadMoreBtnSubtitle: {
    color: 'rgba(209, 250, 229, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  loadMoreIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allLoadedSection: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  allLoadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allLoadedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  collapseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  collapseBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0b3528',
  },

  // INSPIRATION DESTINATION GRID
  inspirationSection: {
    marginTop: 26,
    paddingHorizontal: 16,
  },
  inspirationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inspirationEyebrow: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#eb4916',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  inspirationViewAll: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0b3528',
  },
  inspirationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inspirationCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  inspirationImageContainer: {
    height: 105,
    width: '100%',
    position: 'relative',
    backgroundColor: '#e2e8f0',
  },
  inspirationImage: {
    width: '100%',
    height: '100%',
  },
  inspirationBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  inspirationBadgeText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '700',
  },
  inspirationContent: {
    padding: 10,
  },
  inspirationName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  inspirationCount: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyStateSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: '#0b3528',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  resetFilterBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
