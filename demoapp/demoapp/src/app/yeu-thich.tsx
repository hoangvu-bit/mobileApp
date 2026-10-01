import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';

interface FavoriteItem {
  id: string;
  name: string;
  category: 'ticket' | 'tour' | 'food' | 'deal';
  location: string;
  rating: string;
  reviewsCount: number;
  oldPrice?: string;
  price: string;
  tag: string;
  image: string;
  route: string;
  params?: any;
}

const FAVORITES: FavoriteItem[] = [
  {
    id: 'fav-1',
    name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
    category: 'ticket',
    location: 'Tây Ninh',
    rating: '4.9',
    reviewsCount: 1240,
    oldPrice: '280.000đ',
    price: '245.000đ',
    tag: 'Bán chạy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAGzag4JWCmqBtN4mYGy6MERp-frzyeBC6nRoGOAPRwvo_KRQv212W5LFMkH4h-aNMgVbvRcmo8YRhRZ0xjAevClzlZ2h59cQeAt_-ciE-QVymPMePoC1eTnJmazNG68usffuP6JhObJw0K-OPnLmNotdYxlLwsizfiP-xNl_jtEmdYKUE-iVJqyk2pdB5IxCECOQwlcjkzH29D3-Kqy2z0oEo2wI1YxaRAjBBi4fQOaqWRaGrdT_Q',
    route: '/chi-tiet-ve',
    params: { name: 'Vé cáp treo Chùa Hang Núi Bà Đen', price: '245.000đ', location: 'Tây Ninh' },
  },
  {
    id: 'fav-2',
    name: 'Buffet trưa Vân Sơn Núi Bà Đen',
    category: 'food',
    location: 'Tây Ninh',
    rating: '4.8',
    reviewsCount: 860,
    oldPrice: '290.000đ',
    price: '250.000đ',
    tag: 'Vé QR tức thì',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpdnq32CxUpTr_pSlBgV5-jfSeK_Q2H14FGBJ9aSfxvNintVaIatDLrTyN5abKcqlW9OYN9rNk7zVMFTBjHwiHwEOXSRnfLlbt_eJ5PxYK4EIJ7AL7pkvzYVrK7PAW8kZf_xT9ifr9MeCVD6I6GCmhTuEuQOZlWmv7GoSR9lmx7aekv8lVxqX2uUksmK4tbS2Zaj9_y3gENTL3Vr05K_BO8EHjX4xokTVc4UpCf9IMc1ABZ0QjJOc',
    route: '/chi-tiet-ve',
    params: { name: 'Buffet trưa Vân Sơn Núi Bà Đen', price: '250.000đ', location: 'Tây Ninh' },
  },
  {
    id: 'fav-3',
    name: 'Tour Săn Mây Cầu Đất Đà Lạt 1 ngày',
    category: 'tour',
    location: 'Đà Lạt',
    rating: '5.0',
    reviewsCount: 520,
    oldPrice: '350.000đ',
    price: '280.000đ',
    tag: 'Ưu đãi tuần',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
    route: '/tour-da-lat',
  },
  {
    id: 'fav-4',
    name: 'Vé show Tinh Hoa Việt Nam Phú Quốc',
    category: 'ticket',
    location: 'Phú Quốc',
    rating: '4.9',
    reviewsCount: 930,
    oldPrice: '300.000đ',
    price: '250.000đ',
    tag: 'Vé QR tức thì',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
    route: '/chi-tiet-ve',
    params: { name: 'Vé show Tinh Hoa Việt Nam Phú Quốc', price: '250.000đ', location: 'Phú Quốc' },
  },
];

export default function YeuThichScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(FAVORITES);
  const [selectedCat, setSelectedCat] = useState<'all' | 'ticket' | 'tour' | 'food'>('all');

  const handleRemoveFavorite = (id: string, name: string) => {
    Alert.alert(
      'Bỏ yêu thích',
      `Bạn muốn bỏ "${name}" khỏi danh sách yêu thích?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Bỏ lưu',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const filteredFavorites = favorites.filter(
    item => selectedCat === 'all' || item.category === selectedCat
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9ff" />

      {/* Sub Navigation Bar */}
      <View style={styles.subHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#b32113" />
          <Text style={styles.backBtnText}>Quay lại</Text>
        </Pressable>
        <View style={styles.subHeaderCenter}>
          <Text style={styles.subHeaderTitle}>Danh Sách Yêu Thích</Text>
          <Text style={styles.subHeaderSubtitle}>{favorites.length} địa điểm & dịch vụ đã lưu</Text>
        </View>
        <Pressable
          style={styles.shareBtn}
          onPress={() => Alert.alert('Chia sẻ danh sách', 'Đã sao chép link danh sách yêu thích của bạn!')}
        >
          <SymbolView name="square.and.arrow.up" size={18} tintColor="#111c2d" />
        </Pressable>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Pressable
            style={[styles.catPill, selectedCat === 'all' && styles.catPillActive]}
            onPress={() => setSelectedCat('all')}
          >
            <Text style={[styles.catPillText, selectedCat === 'all' && styles.catPillTextActive]}>
              Tất cả ({favorites.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.catPill, selectedCat === 'ticket' && styles.catPillActive]}
            onPress={() => setSelectedCat('ticket')}
          >
            <Text style={[styles.catPillText, selectedCat === 'ticket' && styles.catPillTextActive]}>
              Vé tham quan ({favorites.filter(f => f.category === 'ticket').length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.catPill, selectedCat === 'tour' && styles.catPillActive]}
            onPress={() => setSelectedCat('tour')}
          >
            <Text style={[styles.catPillText, selectedCat === 'tour' && styles.catPillTextActive]}>
              Tour du lịch ({favorites.filter(f => f.category === 'tour').length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.catPill, selectedCat === 'food' && styles.catPillActive]}
            onPress={() => setSelectedCat('food')}
          >
            <Text style={[styles.catPillText, selectedCat === 'food' && styles.catPillTextActive]}>
              Ẩm thực ({favorites.filter(f => f.category === 'food').length})
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredFavorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <SymbolView name="heart" size={48} tintColor="#cbd5e1" />
            <Text style={styles.emptyTitle}>Chưa có mục yêu thích nào</Text>
            <Text style={styles.emptySub}>
              Nhấn biểu tượng trái tim khi xem vé hoặc tour để lưu vào đây nhé!
            </Text>
            <Pressable style={styles.exploreBtn} onPress={() => router.push('/ve-du-lich')}>
              <Text style={styles.exploreBtnText}>Khám phá ngay</Text>
            </Pressable>
          </View>
        ) : (
          filteredFavorites.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardImageWrap}>
                <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />
                <View style={styles.tagWrap}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
                <Pressable
                  style={styles.heartBtn}
                  onPress={() => handleRemoveFavorite(item.id, item.name)}
                >
                  <SymbolView name="heart.fill" size={18} tintColor="#b32113" />
                </Pressable>
              </View>

              <View style={styles.cardBody}>
                <View>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.locationText}>📍 {item.location}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.ratingText}>⭐ {item.rating} ({item.reviewsCount})</Text>
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <View>
                    {item.oldPrice && (
                      <Text style={styles.oldPrice}>{item.oldPrice}</Text>
                    )}
                    <View style={styles.priceWrap}>
                      <Text style={styles.fromText}>Từ</Text>
                      <Text style={styles.price}>{item.price}</Text>
                    </View>
                  </View>

                  <Pressable
                    style={styles.bookBtn}
                    onPress={() => {
                      if (item.params) {
                        router.push({ pathname: item.route as any, params: item.params });
                      } else {
                        router.push(item.route as any);
                      }
                    }}
                  >
                    <Text style={styles.bookBtnText}>Đặt ngay</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3ff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  backBtnText: { color: '#b32113', fontSize: 14, fontWeight: '600' },
  subHeaderCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  subHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#111c2d' },
  subHeaderSubtitle: { fontSize: 11, color: '#5b403c', marginTop: 1 },
  shareBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f0f3ff', justifyContent: 'center', alignItems: 'center' },

  filterRow: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  catPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f1f5f9' },
  catPillActive: { backgroundColor: '#b32113' },
  catPillText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  catPillTextActive: { color: '#ffffff', fontWeight: '700' },

  scrollContent: { padding: 16, paddingBottom: 32 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f3ff',
  },
  cardImageWrap: { width: 110, height: 120, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  tagWrap: { position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,107,95,0.9)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { color: '#ffffff', fontSize: 9, fontWeight: '700' },
  heartBtn: { position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },

  cardBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#111c2d', lineHeight: 18 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: 11, color: '#64748b' },
  dot: { color: '#cbd5e1' },
  ratingText: { fontSize: 11, color: '#874e00', fontWeight: '600' },

  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  oldPrice: { fontSize: 10, color: '#8f706b', textDecorationLine: 'line-through' },
  priceWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  fromText: { fontSize: 10, color: '#64748b' },
  price: { fontSize: 14, fontWeight: '800', color: '#b32113' },
  bookBtn: { backgroundColor: '#b32113', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  bookBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111c2d', marginTop: 12 },
  emptySub: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 4, lineHeight: 18 },
  exploreBtn: { marginTop: 16, backgroundColor: '#b32113', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  exploreBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
