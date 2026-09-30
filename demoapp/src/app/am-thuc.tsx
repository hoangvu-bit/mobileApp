import GlobalFooter from '../components/global-footer';
import React, { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function AmThucScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả nhu cầu');

  return (
    <View style={styles.container}>ty
    You create a few icons for the categories on the mobile app.
    
    
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1100&q=82' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <SymbolView name="fork.knife" size={14} tintColor="#ffd89a" />
              <Text style={styles.badgeText}>Food guide</Text>
            </View>
            <Text style={styles.heroTitle}>Ăn gì, ở đâu, theo đúng vị chuyến đi</Text>
            <Text style={styles.heroSubtitle}>Món ngon địa phương, quán đáng thử và đặc sản theo vùng. Chọn khu vực, gu ăn uống và kiểu trải nghiệm để mở nhanh những quán, món đặc sản.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickTags} contentContainerStyle={{ gap: 8 }}>
              {['Đặc sản', 'Quán địa phương', 'Cà phê', 'Mua làm quà'].map((item, idx) => (
                <Pressable key={idx} style={styles.quickTagItem}>
                  <Text style={styles.quickTagText}>{item}</Text>
                </Pressable>
              ))}
      </ScrollView>
          </View>
        </View>

        {/* Filter Box */}
        <View style={styles.filterBox}>
          <View style={styles.filterItem}>
            <SymbolView name="magnifyingglass" size={16} tintColor="#ea580c" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.filterLabel}>Tìm món hoặc quán</Text>
              <TextInput placeholder="Bò tơ, bánh canh, bún bò..." style={styles.filterInput} placeholderTextColor="#94a3b8" />
            </View>
          </View>
          <View style={styles.filterSeparator} />
          <View style={styles.filterItem}>
            <SymbolView name="mappin.and.ellipse" size={16} tintColor="#ea580c" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.filterLabel}>Khu vực</Text>
              <TextInput placeholder="Tất cả khu vực" style={styles.filterInput} placeholderTextColor="#94a3b8" />
            </View>
          </View>
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Tìm kiếm</Text>
          </Pressable>
        </View>

        {/* Categories Scroller */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          {['Tất cả nhu cầu', 'Ăn sáng', 'Đi gia đình', 'Cuối tuần'].map((cat, idx) => (
            <Pressable 
              key={idx} 
              style={[styles.categoryItem, selectedCategory === cat && styles.categoryItemActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryItemText, selectedCategory === cat && styles.categoryItemTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Taste Collection */}
        <View style={styles.collectionSection}>
          <Text style={styles.collectionLabel}>Khám phá theo khẩu vị</Text>
          <Text style={styles.collectionTitle}>Bộ sưu tập món ngon đang hợp lịch trình của bạn</Text>
          
          <Pressable 
            style={styles.collectionHeroCard}
            onPress={() => router.push({
              pathname: '/chi-tiet-am-thuc',
              params: {
                name: 'Bún bò Huế – Quốc hồn ẩm thực miền Trung',
                location: 'TP. Huế, Thừa Thiên Huế',
                desc: 'Hương vị đậm đà thơm nồng mùi mắm ruốc, sả, nước dùng hầm từ xương bò và giò heo thơm ngọt.',
                tag: 'Quán địa phương',
                price: '45.000 đ - 65.000 đ / tô',
                image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1100&q=82',
              }
            })}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1100&q=82' }} 
              style={styles.collectionHeroImage} 
            />
            <View style={styles.collectionHeroOverlay}>
              <View style={styles.collectionHeroTop}>
                <View style={styles.badgeWhite}>
                  <SymbolView name="flame.fill" size={12} tintColor="#ea580c" />
                  <Text style={styles.badgeWhiteText}>Nên thử trước</Text>
                </View>
                <View style={styles.heroNumberBox}>
                  <Text style={styles.heroNumber}>01</Text>
                  <Text style={styles.heroNumberLabel}>Taste pick</Text>
                </View>
              </View>
              <View style={styles.collectionHeroBottom}>
                <View style={styles.tagsRow}>
                  <Text style={styles.tagDark}>Quán địa phương</Text>
                  <Text style={styles.tagDark}>TP. Huế</Text>
                </View>
                <Text style={styles.collectionHeroName}>Bún bò Huế – Quốc hồn ẩm thực miền Trung</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <Text style={styles.viewReviewText}>Xem review</Text>
                  <SymbolView name="arrow.right" size={12} tintColor="#ffd89a" style={{ marginLeft: 4 }} />
                </View>
              </View>
            </View>
          </Pressable>

          <View style={styles.cardGrid}>
            {PLACES.map((place, idx) => (
              <Pressable 
                key={idx} 
                style={styles.card}
                onPress={() => router.push({
                  pathname: '/chi-tiet-am-thuc',
                  params: {
                    name: place.name,
                    location: place.location,
                    desc: place.desc,
                    tag: place.tag,
                    image: place.image,
                    price: '50.000 đ - 250.000 đ / phần',
                  }
                })}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: place.image }} style={styles.cardImage} />
                  <View style={styles.cardOverlay}>
                    <View style={styles.cardBadge}>
                      <Text style={styles.cardBadgeText}>{place.tag}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.locationRow}>
                    <SymbolView name="mappin.and.ellipse" size={12} tintColor="#00897b" />
                    <Text style={styles.locationText}>{place.location}</Text>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={2}>{place.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{place.desc}</Text>
                  
                  <View style={styles.cardFooter}>
                    <Text style={styles.readMoreText}>Xem chi tiết</Text>
                    <SymbolView name="arrow.right" size={14} tintColor="#00897b" />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        <GlobalFooter />
      </ScrollView>
    </View>
  );
}

const PLACES = [
  {
    name: 'Bún ốc Ninh Bình và hương vị đồng quê',
    location: 'TP. Ninh Bình',
    desc: 'Thưởng thức bún ốc nóng hổi với nước dùng đậm đà thơm mùi dấm bỗng tại Ninh Bình.',
    tag: 'Quán địa phương',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bò tơ Tây Ninh cho bữa trưa đông người',
    location: 'TP. Tây Ninh',
    desc: 'Gợi ý gọi món bò tơ nướng y, lẩu bò tơ, rau rừng và bánh tráng cho nhóm bạn.',
    tag: 'Bò tơ đặc sản',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cao lầu Hội An – Món ngon xứ Quảng',
    location: 'Hội An, Quảng Nam',
    desc: 'Sợi mì vàng đặc trưng dẻo dai, thịt xá xíu đậm đà và rau thơm Trà Quế nức tiếng.',
    tag: 'Đặc sản phố cổ',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de1b100?auto=format&fit=crop&w=800&q=80',
  }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 80 },

  heroSection: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(8,34,29,0.72)', padding: 20, justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  badgeText: { color: '#ffd89a', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8, lineHeight: 30 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 18, marginBottom: 14 },

  quickTags: { flexDirection: 'row' },
  quickTagItem: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, marginRight: 8 },
  quickTagText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  filterBox: { marginHorizontal: 16, marginTop: -20, backgroundColor: '#fff', borderRadius: 16, padding: 14, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  filterItem: { flexDirection: 'row', alignItems: 'center' },
  filterLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 2 },
  filterInput: { fontSize: 13, fontWeight: '600', color: '#0f172a', padding: 0 },
  filterSeparator: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 8 },
  filterButton: { backgroundColor: '#ea580c', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  filterButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },

  categoriesRow: { marginTop: 14 },
  categoryItem: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  categoryItemActive: { backgroundColor: '#00897b', borderColor: '#00897b' },
  categoryItemText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  categoryItemTextActive: { color: '#fff', fontWeight: '700' },

  collectionSection: { padding: 16, marginTop: 10 },
  collectionLabel: { fontSize: 11, fontWeight: '800', color: '#ea580c', textTransform: 'uppercase', letterSpacing: 0.5 },
  collectionTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 16, marginTop: 4 },

  collectionHeroCard: { height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', marginBottom: 20 },
  collectionHeroImage: { width: '100%', height: '100%', position: 'absolute' },
  collectionHeroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', padding: 16, justifyContent: 'space-between' },
  collectionHeroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeWhite: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeWhiteText: { color: '#ea580c', fontSize: 10, fontWeight: 'bold' },
  heroNumberBox: { alignItems: 'flex-end' },
  heroNumber: { color: '#fff', fontSize: 18, fontWeight: '900' },
  heroNumberLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  collectionHeroBottom: {},
  tagsRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  tagDark: { backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  collectionHeroName: { color: '#fff', fontSize: 18, fontWeight: '800', lineHeight: 24 },
  viewReviewText: { color: '#ffd89a', fontSize: 12, fontWeight: 'bold' },

  cardGrid: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
  cardImageContainer: { height: 160, width: '100%', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { position: 'absolute', top: 10, left: 10 },
  cardBadge: { backgroundColor: '#00897b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cardBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardContent: { padding: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locationText: { fontSize: 11, color: '#64748b' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 8 },
  readMoreText: { fontSize: 12, fontWeight: '700', color: '#00897b' },
});
