import React, { useState, useEffect, useRef } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function VeDuLichScreen() {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const scrollRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= FEATURED.length) {
        nextIndex = 0;
      }
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 10000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleBookTicket = (ticket: any) => {
    router.push({
      pathname: '/chi-tiet-ve',
      params: {
        name: ticket.name,
        price: ticket.price,
        location: ticket.location,
        image: ticket.image,
        desc: ticket.desc,
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header Hero Section */}
        <View style={styles.heroContainer}>
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false } // Required false for width/color interpolation
            )}
            onMomentumScrollEnd={(e) => {
              const contentOffsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffsetX / width);
              setCurrentIndex(index);
            }}
          >
            {FEATURED.map((item, idx) => {
              const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
              
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [1.15, 1, 1.15],
                extrapolate: 'clamp',
              });
              
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.6, 1, 0.6],
                extrapolate: 'clamp',
              });

              return (
                <View key={idx} style={styles.heroSection}>
                  <Animated.Image 
                    source={{ uri: item.image }} 
                    style={[styles.heroImage, { transform: [{ scale }] }]} 
                  />
                  <Animated.View style={[styles.heroOverlay, { opacity }]}>
                    <View style={styles.badgeRow}>
                      <Text style={styles.badgeText}>Vé nổi bật</Text>
                      <Text style={styles.badgeTextOutline}>Đặt vé trực tuyến</Text>
                    </View>
                    <Text style={styles.heroTitle}>{item.name}</Text>
                    <Text style={styles.heroSubtitle} numberOfLines={2}>{item.desc}</Text>
                    <View style={styles.heroInfoRow}>
                      <View style={styles.heroLocation}>
                        <SymbolView name="mappin.and.ellipse" size={14} tintColor="#f0a56d" />
                        <Text style={styles.heroInfoText}>{item.location}</Text>
                      </View>
                      <View style={styles.heroLocation}>
                        <SymbolView name="calendar" size={14} tintColor="#f0a56d" />
                        <Text style={styles.heroInfoText}>3 lịch khả dụng</Text>
                      </View>
                    </View>

                    <View style={styles.heroActionRow}>
                      <Pressable style={styles.heroBtn} onPress={() => handleBookTicket(item)}>
                        <Text style={styles.heroBtnText}>XEM VÉ</Text>
                        <SymbolView name="arrow.right" size={16} tintColor="#fff" />
                      </Pressable>
                      <View style={styles.heroPriceBox}>
                        <Text style={styles.heroPriceLabel}>Giá tham khảo</Text>
                        <Text style={styles.heroPriceVal}>Từ {item.price}</Text>
                      </View>
                    </View>
                  </Animated.View>
                </View>
              );
            })}
          </Animated.ScrollView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {FEATURED.map((_, idx) => {
              const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
              
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [6, 24, 6],
                extrapolate: 'clamp',
              });
              
              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              
              const dotColor = scrollX.interpolate({
                inputRange,
                outputRange: ['#ffffff', '#ea580c', '#ffffff'],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={idx}
                  style={[
                    styles.dot,
                    { width: dotWidth, opacity: dotOpacity, backgroundColor: dotColor }
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchForm}>
            <View style={styles.searchInputGroup}>
              <SymbolView name="magnifyingglass" size={20} tintColor="#168b58" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.searchLabel}>Điểm đến hoặc tên vé</Text>
                <TextInput
                  placeholder="Tìm vé ở đâu? Phú Quốc, Hạ Long..."
                  style={styles.searchInput}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.searchInputGroup}>
              <SymbolView name="map" size={20} tintColor="#168b58" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.searchLabel}>Khu vực</Text>
                <TextInput
                  placeholder="Tất cả điểm đến"
                  style={styles.searchInput}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            <Pressable style={styles.searchButton}>
              <SymbolView name="magnifyingglass" size={16} tintColor="#fff" />
              <Text style={styles.searchButtonText}>Tìm vé</Text>
            </Pressable>
          </View>

          <View style={styles.quickFilters}>
            <Text style={styles.quickFilterLabel}>Khám phá nhanh</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Tất cả', 'Phú Quốc', 'Đà Nẵng', 'Hạ Long', 'Tây Ninh', 'Vũng Tàu'].map((item, idx) => (
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

        {/* List of Tickets */}
        <View style={styles.listSection}>
          <Text style={styles.listSubTitle}>Gợi ý nổi bật</Text>
          <Text style={styles.listTitle}>Dịch vụ nổi bật cho chuyến đi</Text>

          <View style={styles.ticketGrid}>
            {TICKETS.map((ticket, idx) => (
              <TicketCard key={idx} ticket={ticket} onBook={() => handleBookTicket(ticket)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TicketCard({ ticket, onBook }: any) {
  return (
    <Pressable
      style={styles.ticketCard}
      onPress={() => onBook(ticket)}
    >
      <View style={styles.ticketImageContainer}>
        <Image
          source={{ uri: ticket.image }}
          style={styles.ticketImage}
        />
        <View style={styles.ticketImageOverlay} />

        <View style={styles.ticketBadge}>
          <Text style={styles.ticketBadgeText}>Vé du lịch</Text>
        </View>

        <View style={styles.ticketTitleContainer}>
          <Text style={styles.ticketName} numberOfLines={2}>
            {ticket.name}
          </Text>
          <Text style={styles.ticketLocation}>
            {ticket.location}
          </Text>
        </View>
      </View>

      <View style={styles.ticketContent}>
        <Text style={styles.ticketDesc} numberOfLines={2}>
          {ticket.desc}
        </Text>

        <View style={styles.ticketTags}>
          <View style={styles.tagBadge}><Text style={styles.tagText}>Có lịch gần nhất</Text></View>
          <View style={styles.tagBadgeOutline}><Text style={styles.tagTextOutline}>Từ {ticket.price}</Text></View>
        </View>

        <View style={styles.ticketFooter}>
          <Text style={styles.availText}>3 lịch khả dụng</Text>
          <View style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>XEM</Text>
            <SymbolView name="arrow.right" size={14} tintColor="#0f172a" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const FEATURED = [
  {
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé buffet trưa dùng trong ngày cho khách đã có vé tham quan hoặc muốn đặt thêm dịch vụ ăn uống.',
    price: '250.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
  },
  {
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé tuyến cáp treo Chùa Hang cho khách muốn kết hợp hành hương và tham quan cảnh quan Núi Bà Đen.',
    price: '245.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAQuEjb-Bt5eFuEplUPQGqLDhhRhxOjsE5gF4uv78cqB0WC9ZH3ZB_f7ctnG6NrQJdp13H09dTGE_26sEeXUYIouHmEFqK164P99sYk8fiYe3791lOmhL7AIDV9VDvE8lxk98uJjOi9vqYAphBTeFO6yuYjtcZB6-DZDKF8zfPfmIhgWmHg3RVOw71JKBm-wsZUUOES4ZfOFwkY4PYjEePrGp2UjHhZTn34YIenlI70ZgzeMXwy7H',
  },
  {
    name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Vé cáp treo khứ hồi lên khu vực Đỉnh Vân Sơn, phù hợp khách săn mây và ngắm toàn cảnh Tây Ninh.',
    price: '400.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTQM5ESMJevGiwAHx1fFX_wLxgo4itlZDhgJ0eONMbSIMMreLqKuDxt6UsiNe3g8LFfA6CLUOVA0o9BgptYKQx61G4wgUb4oS8u-xxLVFuFRFEJMSjpeYMlCHQejlxE2kE8GG_xxKf4IIxncz8mNRlPp2ZeKrTfc-rDsS4bgdda0ANDJgvow6DnsBt2bHFl_DQIDR0B36w9PxRynWGkhj9VCsArrnJg3XcoFUP220Cu0-aksICe5UM',
  },
  {
    name: 'Vé VinWonders Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    desc: 'Khám phá công viên chủ đề lớn nhất Việt Nam với hàng trăm trò chơi hấp dẫn và show diễn triệu đô.',
    price: '950.000đ',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=84',
  }
];

const TICKETS = [
  ...FEATURED,
  {
    name: 'Combo Núi Bà Đen: Cáp treo Đỉnh Vân Sơn + buffet trưa',
    location: 'TP. Tây Ninh, Tây Ninh',
    desc: 'Combo ưu đãi cho khách muốn trải nghiệm ngắm cảnh Đỉnh Vân Sơn và dùng buffet trưa tại nhà hàng.',
    price: '550.000đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
  }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8f2' },
  scrollContent: { paddingBottom: 80 },

  heroContainer: { height: 440, width: '100%', position: 'relative' },
  heroSection: { width: width, height: 440, position: 'relative', backgroundColor: '#102923', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 25, 21, 0.75)',
    padding: 24,
    justifyContent: 'center'
  },
  badgeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  badgeText: { backgroundColor: '#c85e3a', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4, textTransform: 'uppercase' },
  badgeTextOutline: { backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4, textTransform: 'uppercase', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },

  heroTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 16, lineHeight: 40 },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22, marginBottom: 16 },

  heroInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  heroLocation: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroInfoText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },

  heroActionRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  heroBtn: { backgroundColor: '#c85e3a', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, gap: 8 },
  heroBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  heroPriceBox: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)', paddingLeft: 16 },
  heroPriceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  heroPriceVal: { color: '#ffd7b8', fontSize: 20, fontWeight: '700' },

  pagination: {
    position: 'absolute',
    bottom: 54, // Positioned above the search box which is -30 margin top
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    zIndex: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },

  searchSection: { marginTop: -30, paddingHorizontal: 16, zIndex: 10 },
  searchForm: { backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#0e2a23', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.16, shadowRadius: 30, elevation: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  searchInputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbfaf6', paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  searchLabel: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', marginBottom: 4, opacity: 0.5 },
  searchInput: { fontSize: 14, fontWeight: '600', color: '#0f172a', padding: 0 },
  separator: { height: 6 },
  searchButton: { backgroundColor: '#12382f', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 6, marginTop: 6, gap: 8 },
  searchButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },

  quickFilters: { marginTop: 16, flexDirection: 'row', alignItems: 'center' },
  quickFilterLabel: { fontSize: 10, fontWeight: 'bold', color: 'rgba(15,23,42,0.42)', textTransform: 'uppercase', marginRight: 12, letterSpacing: 1 },
  quickFilterItem: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  quickFilterItemActive: { borderColor: 'rgba(22,139,88,0.35)', backgroundColor: '#f0fdf4' },
  quickFilterItemText: { fontSize: 12, fontWeight: '600', color: 'rgba(15,23,42,0.72)' },
  quickFilterItemTextActive: { color: '#168b58' },

  listSection: { padding: 16, marginTop: 16 },
  listSubTitle: { fontSize: 12, fontWeight: 'bold', color: '#c85e3a', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  listTitle: { fontSize: 26, fontWeight: '700', color: '#0f172a', marginBottom: 20 },

  ticketGrid: { gap: 16 },
  ticketCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  ticketImageContainer: { height: 200, width: '100%', position: 'relative' },
  ticketImage: { width: '100%', height: '100%' },
  ticketImageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  ticketBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  ticketBadgeText: { color: '#168b58', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },

  ticketTitleContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 16,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ticketName: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4, lineHeight: 24 },
  ticketLocation: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },

  ticketContent: { padding: 16 },
  ticketDesc: { fontSize: 13, color: 'rgba(15,23,42,0.56)', lineHeight: 22, marginBottom: 12 },

  ticketTags: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tagBadge: { backgroundColor: '#eef5f0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  tagText: { color: 'rgba(15,23,42,0.54)', fontSize: 10, fontWeight: '700' },
  tagBadgeOutline: { backgroundColor: '#f7f3ea', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  tagTextOutline: { color: 'rgba(15,23,42,0.54)', fontSize: 10, fontWeight: '700' },

  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  availText: { color: '#168b58', fontSize: 11, fontWeight: '700' },
  viewMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewMoreText: { fontSize: 11, fontWeight: '700', color: '#0f172a', textTransform: 'uppercase' },
});
