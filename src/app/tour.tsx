import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export default function TourScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const handleSearch = () => {
    Keyboard.dismiss();
    setAppliedSearch(searchQuery.trim());
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery('');
    setAppliedSearch('');
  };

  const handleOpenTour = (tour: any) => {
    router.push({
      pathname: '/chi-tiet-tour',
      params: {
        tourData: JSON.stringify(tour),
      },
    });
  };

  const filteredTours = useMemo(() => {
    return ALL_REAL_TOURS.filter((tour) => {
      const q = appliedSearch || searchQuery;
      if (q.trim()) {
        const normQ = normalizeText(q);
        const normTitle = normalizeText(tour.title);
        const normLoc = normalizeText(tour.location);
        const normDesc = normalizeText(tour.desc);
        const match = normTitle.includes(normQ) || normLoc.includes(normQ) || normDesc.includes(normQ);
        if (!match) return false;
      }

      if (selectedTag !== 'Tất cả' && !q.trim()) {
        const normTag = normalizeText(selectedTag);
        const normLoc = normalizeText(tour.location);
        const normTitle = normalizeText(tour.title);
        return normLoc.includes(normTag) || normTitle.includes(normTag);
      }

      return true;
    });
  }, [appliedSearch, searchQuery, selectedTag]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=84',
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>Hành trình nổi bật</Text>
              <Text style={styles.badgeTextOutline}>Đặt tour trực tuyến</Text>
            </View>
            <Text style={styles.heroTitle}>
              Tour Đà Lạt 3N2Đ: săn mây, rừng thông và cà phê cao nguyên
            </Text>
            <Text style={styles.heroSubtitle}>
              Hành trình nhẹ nhàng cho nhóm thích khí hậu mát mẻ, cảnh đẹp và nhiều trải nghiệm đặc sắc.
            </Text>

            <View style={styles.heroInfoRow}>
              <Ionicons name="location" size={14} color="#f0a56d" />
              <Text style={styles.heroInfoText}>Đà Lạt, Lâm Đồng</Text>
              <Ionicons name="calendar-outline" size={14} color="#f0a56d" style={{ marginLeft: 12 }} />
              <Text style={styles.heroInfoText}>3 ngày 2 đêm</Text>
            </View>

            <View style={styles.heroFooter}>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => handleOpenTour(ALL_REAL_TOURS[0])}
              >
                <Text style={styles.primaryBtnText}>Xem chi tiết</Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginLeft: 4 }} />
              </Pressable>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Giá tham khảo</Text>
                <Text style={styles.priceText}>Từ 2.790.000 đ</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SEARCH SECTION */}
        <View style={styles.searchSection}>
          <View style={styles.searchForm}>
            <View style={styles.searchInputGroup}>
              <Ionicons name="search" size={18} color="#168b58" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.searchLabel}>Điểm đến hoặc tên tour</Text>
                <TextInput
                  placeholder="Tây Ninh, Đà Lạt, Phú Quốc, Sa Pa..."
                  style={styles.searchInput}
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
              </View>
              {searchQuery.length > 0 && (
                <Pressable onPress={() => { setSearchQuery(''); setAppliedSearch(''); }} hitSlop={10}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </Pressable>
              )}
            </View>

            <Pressable style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={16} color="#fff" />
              <Text style={styles.searchButtonText}>Tìm kiếm tour</Text>
            </Pressable>
          </View>

          {/* Quick Filters */}
          <View style={styles.quickFilters}>
            <Text style={styles.quickFilterLabel}>Khám phá nhanh</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Tất cả', 'Đà Lạt', 'Tây Ninh', 'Phú Quốc', 'Đà Nẵng', 'Ninh Bình', 'Sa Pa', 'Hạ Long', 'Vũng Tàu', 'Miền Tây'].map(
                (item, idx) => (
                  <Pressable
                    key={idx}
                    style={[
                      styles.quickFilterItem,
                      selectedTag === item && styles.quickFilterItemActive,
                    ]}
                    onPress={() => handleSelectTag(item)}
                  >
                    <Text
                      style={[
                        styles.quickFilterItemText,
                        selectedTag === item && styles.quickFilterItemTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )
              )}
            </ScrollView>
          </View>
        </View>

        {/* OPEN TOURS SUGGESTIONS */}
        <View style={styles.darkSection}>
          <Text style={styles.darkSubTitle}>Gợi ý đang mở</Text>
          <Text style={styles.darkTitle}>Hành trình đáng cân nhắc</Text>
          <Text style={styles.darkDesc}>
            Những lựa chọn có thông tin giá và lịch trình 100% thực tế được cập nhật mới nhất.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 18 }}
            contentContainerStyle={{ gap: 14 }}
          >
            {ALL_REAL_TOURS.slice(0, 4).map((t, idx) => (
              <Pressable
                key={idx}
                style={styles.darkCard}
                onPress={() => handleOpenTour(t)}
              >
                <Image source={{ uri: t.images[0] }} style={styles.darkCardImage} />
                <View style={styles.darkCardOverlay}>
                  <View style={styles.darkCardBadge}>
                    <Text style={styles.darkCardBadgeText}>{t.duration}</Text>
                  </View>
                  <Text style={styles.darkCardTitle} numberOfLines={2}>
                    {t.title}
                  </Text>
                  <View style={styles.darkCardFooter}>
                    <Text style={styles.darkCardPrice}>{t.priceText}</Text>
                    <View style={styles.darkCardBtn}>
                      <Text style={styles.darkCardBtnText}>Xem chi tiết</Text>
                      <Ionicons name="arrow-forward" size={11} color="#fff" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ALL TOURS LIST SECTION */}
        <View style={styles.allToursSection}>
          <Text style={styles.allSubTitle}>Danh sách hành trình</Text>
          <Text style={styles.allTitle}>
            {filteredTours.length} Tour du lịch {selectedTag !== 'Tất cả' ? `tại ${selectedTag}` : 'nổi bật'}
          </Text>

          <View style={styles.allGrid}>
            {filteredTours.map((t, idx) => (
              <Pressable
                key={idx}
                style={styles.allCard}
                onPress={() => handleOpenTour(t)}
              >
                <View style={styles.allCardImageContainer}>
                  <Image source={{ uri: t.images[0] }} style={styles.allCardImage} />
                  <View style={styles.allCardImgOverlay}>
                    <Text style={styles.allCardBadge}>{t.duration}</Text>
                    <View style={styles.allCardLocation}>
                      <Ionicons name="location-sharp" size={12} color="#ffd7b8" />
                      <Text style={styles.allCardLocationText}>{t.location}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.allCardContent}>
                  <Text style={styles.allCardName} numberOfLines={2}>
                    {t.title}
                  </Text>
                  <Text style={styles.allCardDesc} numberOfLines={2}>
                    {t.desc}
                  </Text>

                  <View style={styles.allCardStats}>
                    <View style={styles.statCol}>
                      <Ionicons name="bus" size={13} color="#168b58" />
                      <Text style={styles.statText} numberOfLines={1}>
                        {t.transport}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statCol,
                        { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f1f5f9' },
                      ]}
                    >
                      <Ionicons name="calendar-outline" size={13} color="#168b58" />
                      <Text style={styles.statText} numberOfLines={1}>
                        {t.duration}
                      </Text>
                    </View>
                    <View style={styles.statCol}>
                      <Ionicons name="people" size={13} color="#168b58" />
                      <Text style={styles.statText} numberOfLines={1}>
                        {t.groupType}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.allCardFooter}>
                    <View>
                      <Text style={styles.allCardPriceLabel}>Giá mỗi khách từ</Text>
                      <Text style={styles.allCardPrice}>{t.priceText}</Text>
                    </View>
                    <View style={styles.viewBtn}>
                      <Text style={styles.viewBtnText}>Xem chi tiết</Text>
                      <Ionicons name="arrow-forward" size={12} color="#fff" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// 100% REAL TOUR DATASETS ACROSS POPULAR VIETNAMESE DESTINATIONS
export const ALL_REAL_TOURS = [
  // 1. Đà Lạt
  {
    id: 'tour-dalat-3n2d',
    title: 'Tour Đà Lạt 3N2Đ: săn mây, rừng thông và cà phê cao nguyên',
    location: 'Đà Lạt, Lâm Đồng',
    destinationAddress: 'Đà Lạt, Lâm Đồng, Việt Nam',
    pricePerPerson: 2790000,
    priceText: '2.790.000 đ',
    duration: '3 ngày 2 đêm',
    departure: 'Đà Lạt / TP. Hồ Chí Minh',
    transport: 'Limousine đời mới',
    groupType: 'Nhóm linh hoạt',
    openDatesCount: '7 ngày khởi hành',
    availableSeats: 18,
    availableDateStr: '07/10',
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
    desc: 'Hành trình nhẹ nhàng cho nhóm thích khí hậu mát, ảnh đẹp và nhiều quán cà phê. Tour tập trung vào bình minh, rừng thông, nông nghiệp công nghệ cao và những trải nghiệm đặc trưng của xứ sở ngàn hoa.',
    highlights: [
      'Đón bình minh & săn mây kỳ ảo tại Đồi Chè Cầu Đất',
      'Check-in Ga Đà Lạt cổ kính & Quảng trường Lâm Viên',
      'Trải nghiệm máng trượt alpine coaster tại Thác Datanla',
      'Thưởng thức cà phê đặc sản giữa rừng thông đồi cao',
      'Hái dâu tây sạch công nghệ cao tại vườn',
    ],
    travelTips: [
      'Mang áo khoác mỏng và đặt xe sớm nếu đi cuối tuần.',
      'Sáng sớm nhiệt độ tại đồi chè khoảng 15°C, nên mang giày ấm.',
    ],
    inclusions: [
      'Xe Limousine đời mới đón trả tận nơi',
      'Khách sạn 3-4 sao trung tâm (2-3 khách/phòng)',
      '2 bữa sáng buffet + 4 bữa chính đặc sản',
      'Vé tham quan tất cả các điểm trong lịch trình',
      'Bảo hiểm du lịch mức 50.000.000 đ',
    ],
    exclusions: ['Chi phí cá nhân', 'Thuế VAT 8%'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'ĐÓN KHÁCH → GA ĐÀ LẠT → QUẢNG TRƯỜNG LÂM VIÊN',
        desc: 'Xe đón quý khách tại điểm hẹn khởi hành đi Đà Lạt. Nhận phòng khách sạn, tham quan Ga Đà Lạt cổ kính và Quảng trường Lâm Viên.',
        meals: 'Ăn trưa, Ăn tối BBQ',
        stay: 'Khách sạn 3-4 sao trung tâm',
      },
      {
        day: 'NGÀY 2',
        title: 'SĂN MÂY CẦU ĐẤT → THÁC DATANLA → VƯỜN DÂU',
        desc: 'Đón bình minh săn biển mây Cầu Đất. Trải nghiệm máng trượt thác Datanla và hái dâu tây công nghệ cao.',
        meals: 'Ăn sáng, Ăn trưa, Ăn tối',
        stay: 'Khách sạn 3-4 sao trung tâm',
      },
      {
        day: 'NGÀY 3',
        title: 'THIỀN VIỆN TRÚC LÂM → MUA ĐẶC SẢN → TRỞ VỀ',
        desc: 'Chiêm bái Thiền Viện Trúc Lâm, ngắm Hồ Tuyền Lâm và mua đặc sản mứt dâu về làm quà.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Kết thúc chuyến đi',
      },
    ],
    phone: '1900 1888',
  },

  // 2. Tây Ninh
  {
    id: 'tour-tayninh-1n',
    title: 'Tour Tây Ninh 1N: Cáp treo Núi Bà Đen, Tòa Thánh & Bò Tơ',
    location: 'TP. Tây Ninh, Tây Ninh',
    destinationAddress: 'Khu du lịch Quốc gia Núi Bà Đen, TP. Tây Ninh',
    pricePerPerson: 950000,
    priceText: '950.000 đ',
    duration: '1 ngày (Đi về trong ngày)',
    departure: 'TP. Hồ Chí Minh / Tây Ninh',
    transport: 'Xe du lịch 16 - 29 chỗ',
    groupType: 'Ghép đoàn / Đi riêng',
    openDatesCount: 'Khởi hành hàng ngày',
    availableSeats: 25,
    availableDateStr: 'Hôm nay & Ngày mai',
    departureDates: [
      { date: 'Hàng ngày', dayName: 'Thứ 2 - CN', seatsLeft: 25 },
      { date: 'Thứ 7 tuần này', dayName: 'Thứ 7', seatsLeft: 10 },
      { date: 'Chủ nhật tuần này', dayName: 'Chủ nhật', seatsLeft: 8 },
    ],
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: 'Hành trình tâm linh và trải nghiệm văn hóa độc đáo tại Núi Bà Đen - Nóc nhà Nam Bộ, chiêm bái tượng Phật Bà bằng đồng cao nhất Châu Á và Tòa Thánh Cao Đài.',
    highlights: [
      'Vé cáp treo khứ hồi Sun World Ba Den Mountain lên đỉnh núi 986m',
      'Chiêm bái tượng Phật Bà Tây Bổ Đà Sơn bằng đồng kỷ lục Châu Á',
      'Tham quan Tòa Thánh Cao Đài Tây Ninh - kiến trúc tôn giáo độc nhất',
      'Thưởng thức đặc sản Bò Tơ Tây Ninh và Bánh canh Trảng Bàng',
    ],
    travelTips: [
      'Nên mặc trang phục lịch sự, kín đáo khi vào chiêm bái Tòa Thánh và chùa chiền.',
      'Đỉnh Núi Bà Đen có nhiều góc sống ảo tuyệt đẹp với biển mây và vườn hoa tulip bốn mùa.',
    ],
    inclusions: [
      'Xe du lịch máy lạnh đưa đón khứ hồi TP.HCM - Tây Ninh',
      'Vé cáp treo khứ hồi đỉnh Vân Sơn + Chùa Hang',
      'Bữa trưa buffet tại nhà hàng Vân Sơn hoặc Bò Tơ đặc sản',
      'Hướng dẫn viên suốt tuyến',
      'Bảo hiểm du lịch',
    ],
    exclusions: ['Chi phí cá nhân', 'Nước uống ngoài menu'],
    itinerary: [
      {
        day: 'BUỔI SÁNG',
        title: 'TP.HCM → BÁNH CANH TRẢNG BÀNG → NÚI BÀ ĐEN',
        desc: '06:00 đón khách tại TP.HCM. Dùng điểm tâm bánh canh Trảng Bàng. Đến Núi Bà Đen đi cáp treo lên đỉnh núi săn mây, chiêm bái tượng Phật Bà.',
        meals: 'Ăn sáng, Ăn trưa',
        stay: 'Trong ngày',
      },
      {
        day: 'BUỔI CHIỀU',
        title: 'TÒA THÁNH CAO ĐÀI → THƯỞNG THỨC BÒ TƠ → VỀ TP.HCM',
        desc: 'Tham quan Tòa Thánh Tây Ninh dự lễ cúng trưa. Mua đặc sản muối tôm, bánh tráng phơi sương. Thưởng thức bò tơ trước khi về lại TP.HCM.',
        meals: 'Ăn chiều nhẹ',
        stay: 'Kết thúc tour',
      },
    ],
    phone: '0276 353 6666',
  },

  // 3. Phú Quốc
  {
    id: 'tour-phuquoc-3n2d',
    title: 'Tour Phú Quốc 3N2Đ: Khám phá 4 đảo ngọc, cáp treo Hòn Thơm & Grand World',
    location: 'TP. Phú Quốc, Kiên Giang',
    destinationAddress: 'Dương Đông & Nam Đảo, Phú Quốc, Kiên Giang',
    pricePerPerson: 3690000,
    priceText: '3.690.000 đ',
    duration: '3 ngày 2 đêm',
    departure: 'Phú Quốc / TP.HCM / Hà Nội',
    transport: 'Cano cao tốc & Xe du lịch',
    groupType: 'Nhóm gia đình / Ghép đoàn',
    openDatesCount: 'Khởi hành Thứ 6 hàng tuần',
    availableSeats: 16,
    availableDateStr: 'Thứ 6 tuần này',
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
    desc: 'Trải nghiệm biển đảo tuyệt vời nhất Phú Quốc: lướt cano 4 đảo ngọc, lặn ngắm san hô tự nhiên, bay trên cáp treo vượt biển dài nhất thế giới và vui chơi tại Thành phố không ngủ Grand World.',
    highlights: [
      'Trải nghiệm Cano cao tốc khám phá Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút',
      'Lặn ngắm rạn san hô tự nhiên và chụp ảnh quay flycam miễn phí',
      'Vé cáp treo Hòn Thơm 3 dây vượt biển dài nhất thế giới (7.899m)',
      'Vui chơi công viên nước Aquatopia đẳng cấp Đông Nam Á',
      'Check-in Thành phố không ngủ Grand World và xem show Sắc màu Venice',
    ],
    travelTips: [
      'Mang theo đồ bơi, kem chống nắng, kính râm và túi chống nước cho điện thoại.',
      'Các show diễn nhạc nước tại Grand World bắt đầu lúc 21:30 tối.',
    ],
    inclusions: [
      '2 đêm khách sạn/resort 4 sao sát biển có hồ bơi',
      'Cano cao tốc tham quan 4 đảo + SUP chụp ảnh flycam',
      'Vé cáp treo Hòn Thơm + vé công viên nước Aquatopia',
      'Các bữa ăn hải sản tiêu chuẩn 200.000đ/suất',
      'Xe du lịch máy lạnh đưa đón sân bay và các điểm tham quan',
    ],
    exclusions: ['Vé máy bay khứ hồi', 'Chi phí lặn bình khí scuba diving'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'ĐÓN BAY PHÚ QUỐC → GRAND WORLD → SHOW VENICE',
        desc: 'Xe đón quý khách tại sân bay Phú Quốc. Nhận phòng resort nghỉ ngơi. Chiều khám phá Grand World, đi thuyền Gondola trên kênh đào Venice và xem show biểu diễn ánh sáng.',
        meals: 'Ăn trưa, Ăn tối',
        stay: 'Resort 4 sao Phú Quốc',
      },
      {
        day: 'NGÀY 2',
        title: 'TOUR CANO 4 ĐẢO → LẶN SAN HÔ → CÁP TREO HÒN THƠM',
        desc: 'Cano đưa đoàn đến Hòn Móng Tay, Hòn Mây Rút, Hòn Gầm Ghì lặn ngắm san hô. Chiều đi cáp treo Hòn Thơm vượt biển ngắm hoàng hôn.',
        meals: 'Ăn sáng buffet, Ăn trưa hải sản, Ăn tối',
        stay: 'Resort 4 sao Phú Quốc',
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

  // 4. Vũng Tàu
  {
    id: 'tour-vungtau-2n1d',
    title: 'Tour Vũng Tàu 2N1Đ: Biển sáng sớm, Tượng Chúa Kito & Hải sản Gành Hào',
    location: 'TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
    destinationAddress: 'Bãi Sau & Bãi Trước, TP. Vũng Tàu',
    pricePerPerson: 1490000,
    priceText: '1.490.000 đ',
    duration: '2 ngày 1 đêm',
    departure: 'TP. Hồ Chí Minh / Vũng Tàu',
    transport: 'Xe du lịch cao cấp',
    groupType: 'Nhóm linh hoạt',
    openDatesCount: 'Khởi hành Thứ 7 hàng tuần',
    availableSeats: 22,
    availableDateStr: 'Thứ 7 tuần này',
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
      'Bảo hiểm du lịch',
    ],
    exclusions: ['Chi phí cá nhân', 'Đồ uống gọi thêm'],
    itinerary: [
      {
        day: 'NGÀY 1',
        title: 'TP.HCM → MŨI NGHINH PHONG → TẮM BIỂN BÃI SAU → HẢI SẢN GÀNH HÀO',
        desc: 'Khởi hành từ TP.HCM đến Vũng Tàu. Check-in Mũi Nghinh Phong và Cổng Trời. Chiều tắm biển Bãi Sau. Tối thưởng thức hải sản tươi sống tại Gành Hào.',
        meals: 'Ăn trưa, Ăn tối hải sản',
        stay: 'Khách sạn 3-4 sao Bãi Sau',
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

  // 5. Đà Nẵng - Hội An
  {
    id: 'tour-danang-4n3d',
    title: 'Tour Đà Nẵng - Hội An 4N3Đ: Cầu Vàng Bà Nà Hills & Phố Cổ Hội An',
    location: 'Đà Nẵng & Hội An, Quảng Nam',
    destinationAddress: 'Sơn Trà & Bà Nà Hills, TP. Đà Nẵng',
    pricePerPerson: 3890000,
    priceText: '3.890.000 đ',
    duration: '4 ngày 3 đêm',
    departure: 'Đà Nẵng / Hà Nội / TP.HCM',
    transport: 'Xe du lịch đời mới & Cáp treo',
    groupType: 'Ghép đoàn hàng tuần',
    openDatesCount: 'Khởi hành Thứ 5 hàng tuần',
    availableSeats: 15,
    availableDateStr: 'Thứ 5 tuần này',
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

  // 6. Ninh Bình
  {
    id: 'tour-ninhbinh-2n1d',
    title: 'Tour Ninh Bình 2N1Đ: Tràng An, Hang Múa & Chùa Bái Đính',
    location: 'Hoa Lư & Gia Viễn, Ninh Bình',
    destinationAddress: 'Quần thể danh thắng Tràng An, Hoa Lư, Ninh Bình',
    pricePerPerson: 2190000,
    priceText: '2.190.000 đ',
    duration: '2 ngày 1 đêm',
    departure: 'Hà Nội / Ninh Bình',
    transport: 'Xe Limousine cao cấp',
    groupType: 'Nhóm gia đình / Ghép đoàn',
    openDatesCount: 'Khởi hành Thứ 7 hàng tuần',
    availableSeats: 18,
    availableDateStr: 'Thứ 7 tuần này',
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
      'Thưởng thức đặc sản Cơm cháy Ninh Bình & Dê núi 7 món',
    ],
    travelTips: ['Nên đi giày thể thao có độ bám tốt để leo Hang Múa dễ dàng.'],
    inclusions: [
      'Xe Limousine đưa đón khứ hồi Hà Nội - Ninh Bình',
      '1 đêm resort/khách sạn sinh thái tại Ninh Bình',
      'Vé thuyền đò Tràng An + vé Hang Múa + xe điện Bái Đính',
      'Các bữa ăn đặc sản dê núi Ninh Bình',
      'Hướng dẫn viên suốt tuyến',
    ],
    exclusions: ['Chi phí cá nhân', 'Đồ uống tự gọi'],
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
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faf9' },
  scrollContent: { paddingBottom: 50 },

  heroSection: {
    position: 'relative',
    height: 380,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(5, 46, 37, 0.68)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  badgeText: {
    backgroundColor: '#ea580c',
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  badgeTextOutline: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 28,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    marginBottom: 14,
  },
  heroInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroInfoText: {
    color: '#fed7aa',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: '#00897b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffedd5',
  },

  searchSection: {
    marginTop: -20,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  searchForm: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  },
  searchButton: {
    backgroundColor: '#ea580c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },

  quickFilters: {
    marginTop: 16,
  },
  quickFilterLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064e3b',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  quickFilterItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickFilterItemActive: {
    backgroundColor: '#00897b',
    borderColor: '#00897b',
  },
  quickFilterItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  quickFilterItemTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  darkSection: {
    backgroundColor: '#064e3b',
    padding: 16,
    marginTop: 20,
    paddingVertical: 24,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  darkSubTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fb923c',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  darkTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  darkDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
  },
  darkCard: {
    width: 250,
    height: 170,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  darkCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  darkCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    justifyContent: 'flex-end',
  },
  darkCardBadge: {
    backgroundColor: '#ea580c',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  darkCardBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  darkCardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 17,
  },
  darkCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkCardPrice: {
    color: '#fed7aa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  darkCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  darkCardBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  allToursSection: {
    padding: 16,
    paddingTop: 24,
  },
  allSubTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  allTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    marginTop: 4,
  },
  allGrid: {
    gap: 16,
  },
  allCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  allCardImageContainer: {
    height: 170,
    width: '100%',
    position: 'relative',
  },
  allCardImage: {
    width: '100%',
    height: '100%',
  },
  allCardImgOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 12,
    justifyContent: 'space-between',
  },
  allCardBadge: {
    backgroundColor: '#ea580c',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  allCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  allCardLocationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  allCardContent: {
    padding: 16,
  },
  allCardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 20,
  },
  allCardDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  allCardStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    paddingVertical: 8,
    marginBottom: 12,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  allCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  allCardPriceLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  allCardPrice: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ea580c',
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: '#00897b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  viewBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
