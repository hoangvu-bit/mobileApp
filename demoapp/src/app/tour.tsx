import GlobalFooter from '../components/global-footer';
import React, { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function TourScreen() {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState('Tất cả');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=84' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>Hành trình nổi bật</Text>
              <Text style={styles.badgeTextOutline}>Đặt tour trực tuyến</Text>
            </View>
            <Text style={styles.heroTitle}>Tour Đà Lạt 3N2Đ: săn mây, rừng thông và cà phê cao nguyên</Text>
            <Text style={styles.heroSubtitle}>Hành trình nhẹ nhàng cho nhóm thích khí hậu mát mẻ, cảnh đẹp và nhiều quán cà phê sống ảo.</Text>
            
            <View style={styles.heroInfoRow}>
              <SymbolView name="map.fill" size={14} tintColor="#f0a56d" />
              <Text style={styles.heroInfoText}>Đà Lạt, Lâm Đồng</Text>
              <SymbolView name="calendar" size={14} tintColor="#f0a56d" style={{ marginLeft: 12 }} />
              <Text style={styles.heroInfoText}>3 ngày 2 đêm</Text>
            </View>
            
            <View style={styles.heroFooter}>
              <Pressable 
                style={styles.primaryBtn}
                onPress={() => router.push('/tour-da-lat')}
              >
                <Text style={styles.primaryBtnText}>Xem chi tiết</Text>
                <SymbolView name="arrow.right" size={14} tintColor="#fff" style={{ marginLeft: 4 }} />
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
              <SymbolView name="magnifyingglass" size={20} tintColor="#168b58" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.searchLabel}>Điểm đến hoặc tên tour</Text>
                <TextInput 
                  placeholder="Tây Ninh, Đà Lạt, Phú Quốc..." 
                  style={styles.searchInput}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.searchInputGroup}>
              <SymbolView name="clock" size={20} tintColor="#168b58" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.searchLabel}>Thời lượng</Text>
                <TextInput 
                  placeholder="Tất cả hành trình" 
                  style={styles.searchInput}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            <Pressable style={styles.searchButton}>
              <SymbolView name="magnifyingglass" size={16} tintColor="#fff" />
              <Text style={styles.searchButtonText}>Tìm tour</Text>
            </Pressable>
          </View>

          <View style={styles.quickFilters}>
            <Text style={styles.quickFilterLabel}>Khám phá nhanh</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Tất cả', 'Đà Lạt', 'Lâm Đồng', 'Vũng Tàu', 'Phú Quốc', 'Hạ Long', 'Ninh Bình'].map((item, idx) => (
                <Pressable 
                  key={idx} 
                  style={[styles.quickFilterItem, selectedTag === item && styles.quickFilterItemActive]}
                  onPress={() => setSelectedTag(item)}
                >
                  <Text style={[styles.quickFilterItemText, selectedTag === item && styles.quickFilterItemTextActive]}>{item}</Text>
                </Pressable>
              ))}
      </ScrollView>
          </View>
        </View>

        {/* DARK SECTION: Gợi ý đang mở */}
        <View style={styles.darkSection}>
          <Text style={styles.darkSubTitle}>Gợi ý đang mở</Text>
          <Text style={styles.darkTitle}>Hành trình đáng cân nhắc</Text>
          <Text style={styles.darkDesc}>Những lựa chọn có thông tin giá và lịch trình rõ ràng trên hệ thống.</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 20 }} contentContainerStyle={{ gap: 16 }}>
            {OPEN_TOURS.map((tour, idx) => (
              <Pressable 
                key={idx} 
                style={styles.darkCard}
                onPress={() => router.push(tour.route as any)}
              >
                <Image source={{ uri: tour.image }} style={styles.darkCardImage} />
                <View style={styles.darkCardOverlay}>
                  <View style={styles.darkCardBadge}>
                    <Text style={styles.darkCardBadgeText}>{tour.badge}</Text>
                  </View>
                  <Text style={styles.darkCardTitle} numberOfLines={2}>{tour.name}</Text>
                  <View style={styles.darkCardFooter}>
                    <Text style={styles.darkCardPrice}>{tour.price}</Text>
                    <View style={styles.darkCardBtn}>
                      <Text style={styles.darkCardBtnText}>Xem tour</Text>
                      <SymbolView name="arrow.right" size={12} tintColor="#fff" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ALL TOURS SECTION */}
        <View style={styles.allToursSection}>
          <Text style={styles.allSubTitle}>Được khách quan tâm</Text>
          <Text style={styles.allTitle}>Khám phá tất cả tour</Text>
          
          <View style={styles.allGrid}>
            {ALL_TOURS.map((tour, idx) => (
              <Pressable 
                key={idx} 
                style={styles.allCard}
                onPress={() => router.push(tour.route as any)}
              >
                <View style={styles.allCardImageContainer}>
                  <Image source={{ uri: tour.image }} style={styles.allCardImage} />
                  <View style={styles.allCardImgOverlay}>
                    <Text style={styles.allCardBadge}>{tour.duration}</Text>
                    <View style={styles.allCardLocation}>
                      <SymbolView name="mappin.and.ellipse" size={12} tintColor="#ffd7b8" />
                      <Text style={styles.allCardLocationText}>{tour.location}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.allCardContent}>
                  <Text style={styles.allCardName} numberOfLines={2}>{tour.name}</Text>
                  <Text style={styles.allCardDesc} numberOfLines={2}>{tour.desc}</Text>
                  
                  <View style={styles.allCardStats}>
                    <View style={styles.statCol}>
                      <SymbolView name="bus.fill" size={14} tintColor="#168b58" />
                      <Text style={styles.statText} numberOfLines={1}>{tour.transport}</Text>
                    </View>
                    <View style={[styles.statCol, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f1f5f9' }]}>
                      <SymbolView name="calendar" size={14} tintColor="#168b58" />
                      <Text style={styles.statText} numberOfLines={1}>{tour.duration}</Text>
                    </View>
                    <View style={styles.statCol}>
                      <SymbolView name="person.3.fill" size={14} tintColor="#168b58" />
                      <Text style={styles.statText} numberOfLines={1}>{tour.group}</Text>
                    </View>
                  </View>

                  <View style={styles.allCardFooter}>
                    <View>
                      <Text style={styles.allCardPriceLabel}>Giá mỗi khách từ</Text>
                      <Text style={styles.allCardPrice}>{tour.price}</Text>
                    </View>
                    <View style={styles.viewBtn}>
                      <Text style={styles.viewBtnText}>Xem chi tiết</Text>
                      <SymbolView name="arrow.right" size={12} tintColor="#fff" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* FEATURES SECTION */}
        <View style={styles.featuresSection}>
          <Text style={styles.featSubTitle}>Đặt tour rõ ràng hơn</Text>
          <Text style={styles.featTitle}>Từ lúc chọn tour đến ngày khởi hành</Text>
          <Text style={styles.featDesc}>Mọi thông tin quan trọng được trình bày trước khi khách gửi yêu cầu hoặc hoàn tất đặt chỗ.</Text>
          
          <View style={styles.featGrid}>
            {[
              { icon: 'calendar.badge.clock', title: 'Lịch trình cụ thể', desc: 'Biết trước thời lượng và các điểm dừng chính.' },
              { icon: 'dollarsign.circle', title: 'Giá minh bạch', desc: 'Mức giá tham khảo hiển thị ngay trên từng tour.' },
              { icon: 'checkmark.shield.fill', title: 'Thông tin xác nhận', desc: 'Theo dõi yêu cầu và trạng thái đặt chỗ rõ ràng.' },
              { icon: 'headphones', title: 'Hỗ trợ khi cần', desc: 'Kết nối với đơn vị vận hành tour từ trang chi tiết.' },
            ].map((f, i) => (
              <View key={i} style={styles.featItem}>
                <View style={styles.featIconBox}>
                  <SymbolView name={f.icon as any} size={20} tintColor="#168b58" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featItemTitle}>{f.title}</Text>
                  <Text style={styles.featItemDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ SECTION */}
        <View style={styles.faqSection}>
          <Text style={styles.faqSubTitle}>Thông tin cần biết</Text>
          <Text style={styles.faqTitle}>Câu hỏi thường gặp</Text>
          <View style={styles.faqList}>
            {[
              { q: 'Tôi có thể xem lịch trình trước khi đặt không?', a: 'Có. Trang chi tiết tour hiển thị mô tả hành trình, và các thông tin vận hành đã được cung cấp.' },
              { q: 'Giá hiển thị có phải giá cuối cùng không?', a: 'Giá trên danh sách là mức tham khảo từ tour. Tổng tiền và các điều kiện áp dụng được xác nhận tại bước đặt chỗ.' },
              { q: 'Tôi theo dõi yêu cầu đặt tour ở đâu?', a: 'Sau khi gửi thông tin, bạn có thể theo dõi lịch sử và trạng thái xử lý trong khu vực tài khoản.' }
            ].map((item, idx) => (
              <View key={idx} style={styles.faqItem}>
                <View style={styles.faqRow}>
                  <Text style={styles.faqQ}>{item.q}</Text>
                  <SymbolView name="plus" size={16} tintColor="#168b58" />
                </View>
                <Text style={styles.faqA}>{item.a}</Text>
              </View>
            ))}
          </View>
        </View>

        <GlobalFooter />
      </ScrollView>
    </View>
  );
}

const OPEN_TOURS = [
  {
    name: 'Tour Đà Lạt 3N2Đ: săn mây, rừng thông và cà phê cao nguyên',
    badge: 'Đề xuất hôm nay',
    price: 'Từ 2.790.000 đ',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    route: '/tour-da-lat',
  },
  {
    name: 'Tour Vũng Tàu 2N1Đ: biển sáng sớm và hải sản địa phương',
    badge: 'Lựa chọn nổi bật',
    price: 'Từ 1.490.000 đ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    route: '/tour-vung-tau',
  },
  {
    name: 'Tour Phú Quốc Nam đảo 3N2Đ: cáp treo, biển xanh và hoàng hôn',
    badge: 'Lựa chọn nổi bật',
    price: 'Từ 3.690.000 đ',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    route: '/tour-phu-quoc',
  }
];

const ALL_TOURS = [
  {
    name: 'Tour Đà Lạt 3N2Đ: săn mây, rừng thông và cà phê cao nguyên',
    desc: 'Hành trình nhẹ nhàng cho nhóm thích khí hậu mát, ảnh đẹp và nhiều quán cà phê.',
    location: 'Đà Lạt, Lâm Đồng',
    duration: '3 ngày 2 đêm',
    transport: 'Đà Lạt / TP. HCM',
    group: 'Nhóm linh hoạt',
    price: '2.790.000 đ',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    route: '/tour-da-lat',
  },
  {
    name: 'Tour Vũng Tàu 2N1Đ: biển sáng sớm và hải sản địa phương',
    desc: 'Tour ngắn ngày cho gia đình hoặc nhóm bạn muốn đổi gió cuối tuần gần Sài Gòn.',
    location: 'Vũng Tàu, BR-VT',
    duration: '2 ngày 1 đêm',
    transport: 'TP. Hồ Chí Minh',
    group: 'Nhóm linh hoạt',
    price: '1.490.000 đ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    route: '/tour-vung-tau',
  },
  {
    name: 'Tour Phú Quốc Nam đảo 3N2Đ: cáp treo, biển xanh và hoàng hôn',
    desc: 'Hòn ngọc thiên đường với cáp treo Hòn Thơm, lặn ngắm san hô 4 đảo và hoàng hôn Sunset Sanato.',
    location: 'Phú Quốc, Kiên Giang',
    duration: '3 ngày 2 đêm',
    transport: 'Máy bay khứ hồi',
    group: 'Resort 4 sao',
    price: '3.690.000 đ',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    route: '/tour-phu-quoc',
  },
  {
    name: 'Hành trình miền Tây 2N1Đ: chợ nổi Cái Răng & miệt vườn Cần Thơ',
    desc: 'Trải nghiệm văn hóa sông nước đậm chất Tây Nam Bộ, đi xuồng ba lá và thưởng thức trái cây tại vườn.',
    location: 'Cần Thơ - Bến Tre',
    duration: '2 ngày 1 đêm',
    transport: 'Ô tô đời mới',
    group: 'Đoàn gia đình',
    price: '1.850.000 đ',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    route: '/tour-mien-tay',
  },
  {
    name: 'Khám phá Vịnh Hạ Long trên du thuyền sang trọng 2N1Đ',
    desc: 'Nghỉ dưỡng du thuyền 5 sao, chèo kayak qua hang Luồn, tắm biển đảo Ti Tốp ngắm toàn cảnh kỳ quan.',
    location: 'Hạ Long, Quảng Ninh',
    duration: '2 ngày 1 đêm',
    transport: 'Du thuyền 5 sao',
    group: 'Khách ghép đoàn',
    price: '3.250.000 đ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    route: '/tour-ha-long',
  },
  {
    name: 'Tây Ninh 1 ngày: Chinh phục đỉnh Vân Sơn Núi Bà Đen',
    desc: 'Viếng cụm chùa Hang tâm linh, chiêm bái tượng Phật Bà Tây Bổ Đà Sơn và thưởng thức buffet ẩm thực đỉnh núi.',
    location: 'Núi Bà Đen, Tây Ninh',
    duration: '1 ngày',
    transport: 'Xe Limousine',
    group: 'Khởi hành hàng ngày',
    price: '950.000 đ',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    route: '/tour-tay-ninh',
  },
  {
    name: 'Tour Ninh Bình 2N1Đ: Tràng An, Hang Múa và cố đô Hoa Lư',
    desc: 'Hành trình cảnh quan núi đá vôi, xuôi thuyền theo dòng Sào Khê và ngắm hoàng hôn trên đỉnh Ngọa Long.',
    location: 'Hoa Lư, Ninh Bình',
    duration: '2 ngày 1 đêm',
    transport: 'Hà Nội / Ninh Bình',
    group: 'Nhóm linh hoạt',
    price: '2.190.000 đ',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    route: '/tour-ninh-binh',
  }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 80 },

  heroSection: { height: 380, position: 'relative' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(8,34,29,0.72)', padding: 20, justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  badgeText: { backgroundColor: '#ea580c', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, textTransform: 'uppercase' },
  badgeTextOutline: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, textTransform: 'uppercase' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8, lineHeight: 32 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 16, lineHeight: 18 },
  heroInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  heroInfoText: { color: 'rgba(255,255,255,0.95)', fontSize: 12, fontWeight: '700' },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  primaryBtn: { backgroundColor: '#ea580c', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  priceContainer: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.3)', paddingLeft: 14 },
  priceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  priceText: { color: '#fed7aa', fontSize: 16, fontWeight: '800', marginTop: 2 },

  searchSection: { marginTop: -25, paddingHorizontal: 16, zIndex: 10 },
  searchForm: { backgroundColor: '#fff', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  searchLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 2 },
  searchInput: { fontSize: 14, fontWeight: '600', color: '#0f172a', padding: 0 },
  separator: { height: 8 },
  searchButton: { backgroundColor: '#00897b', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, marginTop: 8, gap: 8 },
  searchButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13 },
  
  quickFilters: { marginTop: 14, flexDirection: 'row', alignItems: 'center' },
  quickFilterLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginRight: 10 },
  quickFilterItem: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  quickFilterItemActive: { backgroundColor: '#00897b', borderColor: '#00897b' },
  quickFilterItemText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  quickFilterItemTextActive: { color: '#fff', fontWeight: '700' },

  darkSection: { backgroundColor: '#0f2b28', padding: 20, marginTop: 28, paddingVertical: 32, borderRadius: 20, marginHorizontal: 16 },
  darkSubTitle: { fontSize: 10, fontWeight: 'bold', color: '#fb923c', textTransform: 'uppercase', marginBottom: 4 },
  darkTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6 },
  darkDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  darkCard: { width: 260, height: 180, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  darkCardImage: { width: '100%', height: '100%', position: 'absolute' },
  darkCardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', padding: 14, justifyContent: 'flex-end' },
  darkCardBadge: { backgroundColor: '#ea580c', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 6 },
  darkCardBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  darkCardTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 10, lineHeight: 18 },
  darkCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  darkCardPrice: { color: '#fed7aa', fontSize: 12, fontWeight: 'bold' },
  darkCardBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  darkCardBtnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  allToursSection: { padding: 16, paddingTop: 28 },
  allSubTitle: { fontSize: 11, fontWeight: '800', color: '#ea580c', textTransform: 'uppercase', letterSpacing: 0.5 },
  allTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 16, marginTop: 4 },
  allGrid: { gap: 16 },
  allCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9' },
  allCardImageContainer: { height: 180, width: '100%', position: 'relative' },
  allCardImage: { width: '100%', height: '100%' },
  allCardImgOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)', padding: 12, justifyContent: 'space-between' },
  allCardBadge: { backgroundColor: '#ea580c', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, color: '#fff', fontSize: 10, fontWeight: 'bold' },
  allCardLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  allCardLocationText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  allCardContent: { padding: 16 },
  allCardName: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  allCardDesc: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 14 },
  allCardStats: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f1f5f9', paddingVertical: 10, marginBottom: 14 },
  statCol: { flex: 1, alignItems: 'center', gap: 4 },
  statText: { fontSize: 10, fontWeight: '600', color: '#475569' },
  allCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  allCardPriceLabel: { fontSize: 9, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' },
  allCardPrice: { fontSize: 17, fontWeight: '900', color: '#ea580c', marginTop: 2 },
  viewBtn: { backgroundColor: '#00897b', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  viewBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  featuresSection: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingVertical: 24, marginTop: 16 },
  featSubTitle: { fontSize: 11, fontWeight: '800', color: '#ea580c', textTransform: 'uppercase' },
  featTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 6, marginTop: 4 },
  featDesc: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 20 },
  featGrid: { gap: 14 },
  featItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  featIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center' },
  featItemTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
  featItemDesc: { fontSize: 11, color: '#64748b', lineHeight: 16 },

  faqSection: { padding: 16, paddingVertical: 24 },
  faqSubTitle: { fontSize: 11, fontWeight: '800', color: '#ea580c', textTransform: 'uppercase' },
  faqTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 16, marginTop: 4 },
  faqList: { borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 14 },
  faqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', flex: 1, paddingRight: 12 },
  faqA: { fontSize: 12, color: '#64748b', lineHeight: 18, marginTop: 8 },
});
