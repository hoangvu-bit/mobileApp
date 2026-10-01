import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  TextInput,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { matchVietnameseSearch } from '../utils/vietnamese';

export interface FavoriteItem {
  id: string;
  name: string;
  category: 'ticket' | 'hotel' | 'tour' | 'eco' | 'food';
  categoryLabel: string;
  location: string;
  rating: string;
  reviewsCount: number;
  oldPrice?: string;
  price: string;
  priceNum: number;
  tag: string;
  image: string;
  route: string;
  params?: any;
}

const INITIAL_FAVORITES: FavoriteItem[] = [
  {
    id: 'fav-1',
    name: 'Vé Cáp Treo Chùa Hang Núi Bà Đen (Khứ hồi)',
    category: 'ticket',
    categoryLabel: 'Vé du lịch',
    location: 'Tây Ninh',
    rating: '4.9',
    reviewsCount: 1240,
    oldPrice: '280.000đ',
    price: '245.000đ',
    priceNum: 245000,
    tag: 'Bán chạy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChgKX0pBpmZQZSbbegc2H-pjrcpCjRpzgwgK8m6YBFWCmdJdfVqq87KsljgFmZ096l2WJynvxb4AAuvJp0wHBTIJDAowY4jQOxRApfHfgcfVADO3JqxLCAg8s2D7Me73_tUnNmKejEMHdqT7pQ0DruhOCoSrvq1vggGe8ZSaypJJQXEhuQMoZhjYumhRPDXlF8HEvVpzFR-9e0_oRm9ytV-NAUNHC9Bb065_uhiy9fw6tay1VXQcp9tA',
    route: '/chi-tiet-ve',
    params: {
      name: 'Vé Cáp Treo Chùa Hang Núi Bà Đen',
      price: '245.000đ',
      location: 'Tây Ninh',
    },
  },
  {
    id: 'fav-2',
    name: 'Buffet Trưa Vân Sơn Núi Bà Đen - Hơn 80 món',
    category: 'food',
    categoryLabel: 'Ẩm thực',
    location: 'Tây Ninh',
    rating: '4.8',
    reviewsCount: 860,
    oldPrice: '290.000đ',
    price: '250.000đ',
    priceNum: 250000,
    tag: 'Vé QR tức thì',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLEeqMa_BCFrGa-M6XDdf8O7w8SH88I_8stT74Dp1OwzTKG5Nem2rdu4_Bg7AkUaQsVjAfbOYTD2IhX12DCerZalhymtTZLr8N_FhYCGArG7cpJlbWRM5lJ162jMtZsU3fZHz527LFVbVC2hTqBJF1oVzQg7biMUZLFd4C7r0V2UrxYriMWiyo5VK_BwAnD8K9oTafvExsVrMjGqMzbgebvCcctgDGK2M9dv7c7xqT8BWGbM54VbUxRA',
    route: '/chi-tiet-ve',
    params: {
      name: 'Buffet Trưa Vân Sơn Núi Bà Đen',
      price: '250.000đ',
      location: 'Tây Ninh',
    },
  },
  {
    id: 'fav-3',
    name: 'Tour 3 Đảo Nha Trang VIP Ngắm San Hô Bằng Cano',
    category: 'tour',
    categoryLabel: 'Tour',
    location: 'Nha Trang',
    rating: '4.9',
    reviewsCount: 350,
    oldPrice: '520.000đ',
    price: '450.000đ',
    priceNum: 450000,
    tag: 'Tour VIP',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzHjzUMOeqqzHj81H3SNLia_ugFZzw_hIAN5XIeHFR--kc3f2yC4BpqXBAypam-IFxp50YwO8yftKIjOWjuEYOSTUyJ0uH9ZG3Dep7LLe9xATRVy2-UdLWUvN6LEwPo4iebvP7mEHkx1IlM1uD1WAcBnLNO2Uk7Md88uyrBvCqw-jh-a-x6UikSLrCEOn6w4TIyi1p77QI_5IFDi78wNrb33UMykd_xmGlnFFYxa3m6Vx_vnY5xTbUnQ',
    route: '/tour',
  },
  {
    id: 'fav-4',
    name: 'Khách Sạn Meliá Vinpearl Tây Ninh 5 Sao Hướng Núi',
    category: 'hotel',
    categoryLabel: 'Lưu trú',
    location: 'TP. Tây Ninh',
    rating: '4.9',
    reviewsCount: 520,
    oldPrice: '1.450.000đ',
    price: '1.250.000đ',
    priceNum: 1250000,
    tag: '5 Sao VIP',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAluqKY48UCquc5770tGQjKIOIG0FOubIxG-k2IjRal4E1lX-lhZPdaqd8d6yl7y94HE3dua0WycKusXWWMZhYa1SEMhgD4TaxdIkFBF5s2OuTzKGd8PJFXgqOzbF5MrzbRBbOaY5FZsxzvrEbRAmZZlSnSBR218k_Fmnw8Z5pybkbGVhbHyoBY3s6yf0ybfFfHRxnVTEhkIxEc9GhudSXirueNgPmY3gjRDD3lSPVdszGTRbN2G4z-lQ',
    route: '/luu-tru',
  },
  {
    id: 'fav-5',
    name: 'Vé Vào Cổng & Xe Điện KDL Sinh Thái Chavi Garden',
    category: 'eco',
    categoryLabel: 'Sinh thái',
    location: 'Long An',
    rating: '4.8',
    reviewsCount: 410,
    oldPrice: '150.000đ',
    price: '110.000đ',
    priceNum: 110000,
    tag: 'Sinh thái HOT',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    route: '/khu-sinh-thai',
  },
  {
    id: 'fav-6',
    name: 'Tour Săn Mây Cầu Đất Đà Lạt 1 Ngày Trọn Gói',
    category: 'tour',
    categoryLabel: 'Tour',
    location: 'Đà Lạt',
    rating: '5.0',
    reviewsCount: 520,
    oldPrice: '350.000đ',
    price: '280.000đ',
    priceNum: 280000,
    tag: 'Ưu đãi tuần',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
    route: '/tour',
  },
  {
    id: 'fav-7',
    name: 'Vé Show Tinh Hoa Việt Nam Phú Quốc (Ghế VIP)',
    category: 'ticket',
    categoryLabel: 'Vé du lịch',
    location: 'Phú Quốc',
    rating: '4.9',
    reviewsCount: 930,
    oldPrice: '300.000đ',
    price: '250.000đ',
    priceNum: 250000,
    tag: 'Vé QR tức thì',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
    route: '/chi-tiet-ve',
    params: {
      name: 'Vé Show Tinh Hoa Việt Nam Phú Quốc',
      price: '250.000đ',
      location: 'Phú Quốc',
    },
  },
  {
    id: 'fav-8',
    name: 'Set Đặc Sản Bánh Canh Trảng Bàng Hoàng Minh',
    category: 'food',
    categoryLabel: 'Ẩm thực',
    location: 'Tây Ninh',
    rating: '4.9',
    reviewsCount: 780,
    oldPrice: '180.000đ',
    price: '150.000đ',
    priceNum: 150000,
    tag: 'Đặc sản trứ danh',
    image:
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80',
    route: '/am-thuc',
  },
  {
    id: 'fav-9',
    name: 'Vé Cáp Treo Hòn Thơm Khứ Hồi & Công Viên Aquatopia',
    category: 'ticket',
    categoryLabel: 'Vé du lịch',
    location: 'Phú Quốc',
    rating: '4.9',
    reviewsCount: 1560,
    oldPrice: '650.000đ',
    price: '570.000đ',
    priceNum: 570000,
    tag: 'Siêu Ưu Đãi',
    image:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    route: '/chi-tiet-ve',
  },
  {
    id: 'fav-10',
    name: 'Khách Sạn Dalat Palace Heritage 5 Sao Phong Cách Cổ',
    category: 'hotel',
    categoryLabel: 'Lưu trú',
    location: 'Đà Lạt',
    rating: '4.9',
    reviewsCount: 680,
    oldPrice: '1.950.000đ',
    price: '1.680.000đ',
    priceNum: 1680000,
    tag: 'Sang trọng',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    route: '/luu-tru',
  },
  {
    id: 'fav-11',
    name: 'Vé Tham Quan & Check-in KDL Sinh Thái Mỹ Luông',
    category: 'eco',
    categoryLabel: 'Sinh thái',
    location: 'An Giang',
    rating: '4.7',
    reviewsCount: 310,
    oldPrice: '80.000đ',
    price: '60.000đ',
    priceNum: 60000,
    tag: 'Sông nước',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    route: '/khu-sinh-thai',
  },
  {
    id: 'fav-12',
    name: 'Tour Miền Tây Sông Nước Chợ Nổi Cái Răng Cần Thơ',
    category: 'tour',
    categoryLabel: 'Tour',
    location: 'Cần Thơ',
    rating: '4.8',
    reviewsCount: 440,
    oldPrice: '380.000đ',
    price: '280.000đ',
    priceNum: 280000,
    tag: 'Miệt vườn',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80',
    route: '/tour',
  },
  {
    id: 'fav-13',
    name: 'Bún Bò Huế Cố Đô Đậm Đà Gia Truyền',
    category: 'food',
    categoryLabel: 'Ẩm thực',
    location: 'Huế',
    rating: '4.9',
    reviewsCount: 920,
    oldPrice: '75.000đ',
    price: '55.000đ',
    priceNum: 55000,
    tag: 'Đặc sản',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1WuU9IbZDa22JQR5ArZNO7CJShmZbxxynnSwkGED9XuKPAfQIu0a59pSQrsJDZTajo_Zo-HNX3dkckPNw3RpKPhCS8FFguyEJt_mYqrAn7gXJWVTGpARYlw_hUUEs0fmdMKmIEMy2Zjsnkr60x1FRO-MjswjEbI1_2ZKyZKIqDd1CmA9JQvb1JviTtk9Mg6kYHJ2SgAmYoik6Eux4nNYlnwk3lHafsOMikF0TkZaRow20k6KBlY_02Jc-0M',
    route: '/am-thuc',
  },
  {
    id: 'fav-14',
    name: 'Vé Trekking Vườn Quốc Gia Cát Tiên & Safari Đêm',
    category: 'eco',
    categoryLabel: 'Sinh thái',
    location: 'Đồng Nai',
    rating: '4.8',
    reviewsCount: 390,
    oldPrice: '350.000đ',
    price: '260.000đ',
    priceNum: 260000,
    tag: 'Trải nghiệm',
    image:
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    route: '/khu-sinh-thai',
  },
];

type CategoryFilter = 'all' | 'ticket' | 'hotel' | 'tour' | 'eco' | 'food';

export default function YeuThichScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [favorites, setFavorites] = useState<FavoriteItem[]>(INITIAL_FAVORITES);
  const [selectedCat, setSelectedCat] = useState<CategoryFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [pageLimit, setPageLimit] = useState(10);

  // Dynamic tab counts
  const catCounts = useMemo(() => {
    return {
      all: favorites.length,
      ticket: favorites.filter((f) => f.category === 'ticket').length,
      hotel: favorites.filter((f) => f.category === 'hotel').length,
      tour: favorites.filter((f) => f.category === 'tour').length,
      eco: favorites.filter((f) => f.category === 'eco').length,
      food: favorites.filter((f) => f.category === 'food').length,
    };
  }, [favorites]);

  // Filtered list based on category & search text
  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      // Category filter
      if (selectedCat !== 'all' && item.category !== selectedCat) {
        return false;
      }
      // Search filter
      if (searchText.trim()) {
        const matchName = matchVietnameseSearch(item.name, searchText);
        const matchLoc = matchVietnameseSearch(item.location, searchText);
        const matchTag = matchVietnameseSearch(item.tag, searchText);
        const matchCat = matchVietnameseSearch(item.categoryLabel, searchText);
        if (!matchName && !matchLoc && !matchTag && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }, [favorites, selectedCat, searchText]);

  // Paginated list (10 items)
  const visibleFavorites = useMemo(() => {
    return filteredFavorites.slice(0, pageLimit);
  }, [filteredFavorites, pageLimit]);

  const hasMore = filteredFavorites.length > pageLimit;

  // Actions
  const handleToggleFavorite = (item: FavoriteItem) => {
    Alert.alert(
      'Bỏ yêu thích',
      `Bạn muốn bỏ "${item.name}" khỏi danh sách yêu thích?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Bỏ lưu',
          style: 'destructive',
          onPress: () => {
            setFavorites((prev) => prev.filter((f) => f.id !== item.id));
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (favorites.length === 0) return;
    Alert.alert(
      'Xóa toàn bộ danh sách',
      'Bạn có chắc chắn muốn xóa toàn bộ các mục đã lưu trong danh sách yêu thích?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: () => setFavorites([]),
        },
      ]
    );
  };

  const handleShareList = async () => {
    try {
      await Share.share({
        message: `Khám phá danh sách ${favorites.length} địa điểm & dịch vụ du lịch yêu thích của tôi trên iGovi Travel!`,
      });
    } catch (e) {
      // ignore
    }
  };

  const handleBookNow = (item: FavoriteItem) => {
    if (item.params) {
      router.push({
        pathname: item.route as any,
        params: item.params,
      });
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F382C" />

      {/* ================= HEADER SECTION (Dark Emerald Synchronized) ================= */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) }]}>
        {/* Top Header Row */}
        <View style={styles.topHeaderRow}>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerMainTitle}>Danh Sách Yêu Thích</Text>
            <View style={styles.headerSubtitleRow}>
              <View style={styles.livePulseDot} />
              <Text style={styles.headerSubtext}>
                {favorites.length} địa điểm & dịch vụ đã lưu
              </Text>
            </View>
          </View>

          <View style={styles.headerActionsRow}>
            {/* Share button */}
            <Pressable
              style={styles.headerGlassBtn}
              onPress={handleShareList}
              hitSlop={6}
              accessibilityLabel="Chia sẻ danh sách"
            >
              <Ionicons name="share-social-outline" size={19} color="#86efac" />
            </Pressable>

            {/* Notification Bell button */}
            <Pressable
              style={styles.headerGlassBtn}
              onPress={() =>
                Alert.alert(
                  'Thông báo yêu thích',
                  'Các dịch vụ trong danh sách yêu thích đang có ưu đãi giảm giá đến 25% trong tuần này!'
                )
              }
              hitSlop={6}
              accessibilityLabel="Thông báo"
            >
              <Ionicons name="notifications-outline" size={19} color="#86efac" />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>

        {/* Search Bar Pill */}
        <View style={styles.searchBarPill}>
          <Ionicons name="search" size={17} color="#86efac" style={{ marginLeft: 4 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm trong danh sách yêu thích..."
            placeholderTextColor="rgba(167, 243, 208, 0.65)"
            value={searchText}
            onChangeText={(val) => {
              setSearchText(val);
              setPageLimit(10);
            }}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchText('');
                setPageLimit(10);
              }}
              hitSlop={8}
              style={{ paddingHorizontal: 6 }}
            >
              <Ionicons name="close-circle" size={17} color="#86efac" />
            </Pressable>
          )}
          <View style={styles.searchActionBtn}>
            <Text style={styles.searchActionBtnText}>Tìm</Text>
            <Ionicons name="arrow-forward" size={12} color="#86efac" />
          </View>
        </View>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {/* Tab: Tất cả */}
          <Pressable
            style={[
              styles.tabPill,
              selectedCat === 'all' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setSelectedCat('all');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                selectedCat === 'all' && styles.tabPillTextActive,
              ]}
            >
              Tất cả
            </Text>
            <View
              style={[
                styles.tabBadge,
                selectedCat === 'all'
                  ? styles.tabBadgeActiveMint
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  selectedCat === 'all'
                    ? styles.tabBadgeTextMint
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {catCounts.all}
              </Text>
            </View>
          </Pressable>

          {/* Tab: Vé du lịch */}
          <Pressable
            style={[
              styles.tabPill,
              selectedCat === 'ticket' && styles.tabPillActiveOrange,
            ]}
            onPress={() => {
              setSelectedCat('ticket');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                selectedCat === 'ticket' && styles.tabPillTextActive,
              ]}
            >
              Vé tham quan
            </Text>
            <View
              style={[
                styles.tabBadge,
                selectedCat === 'ticket'
                  ? styles.tabBadgeActiveOrange
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  selectedCat === 'ticket'
                    ? styles.tabBadgeTextOrange
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {catCounts.ticket}
              </Text>
            </View>
          </Pressable>

          {/* Tab: Lưu trú */}
          <Pressable
            style={[
              styles.tabPill,
              selectedCat === 'hotel' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setSelectedCat('hotel');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                selectedCat === 'hotel' && styles.tabPillTextActive,
              ]}
            >
              Lưu trú
            </Text>
            <View
              style={[
                styles.tabBadge,
                selectedCat === 'hotel'
                  ? styles.tabBadgeActiveMint
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  selectedCat === 'hotel'
                    ? styles.tabBadgeTextMint
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {catCounts.hotel}
              </Text>
            </View>
          </Pressable>

          {/* Tab: Tour */}
          <Pressable
            style={[
              styles.tabPill,
              selectedCat === 'tour' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setSelectedCat('tour');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                selectedCat === 'tour' && styles.tabPillTextActive,
              ]}
            >
              Tour du lịch
            </Text>
            <View
              style={[
                styles.tabBadge,
                selectedCat === 'tour'
                  ? styles.tabBadgeActiveMint
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  selectedCat === 'tour'
                    ? styles.tabBadgeTextMint
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {catCounts.tour}
              </Text>
            </View>
          </Pressable>

          {/* Tab: Sinh thái */}
          <Pressable
            style={[
              styles.tabPill,
              selectedCat === 'eco' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setSelectedCat('eco');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                selectedCat === 'eco' && styles.tabPillTextActive,
              ]}
            >
              Sinh thái
            </Text>
            <View
              style={[
                styles.tabBadge,
                selectedCat === 'eco'
                  ? styles.tabBadgeActiveMint
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  selectedCat === 'eco'
                    ? styles.tabBadgeTextMint
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {catCounts.eco}
              </Text>
            </View>
          </Pressable>

          {/* Tab: Ẩm thực */}
          <Pressable
            style={[
              styles.tabPill,
              selectedCat === 'food' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setSelectedCat('food');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                selectedCat === 'food' && styles.tabPillTextActive,
              ]}
            >
              Ẩm thực
            </Text>
            <View
              style={[
                styles.tabBadge,
                selectedCat === 'food'
                  ? styles.tabBadgeActiveMint
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  selectedCat === 'food'
                    ? styles.tabBadgeTextMint
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {catCounts.food}
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>

      {/* ================= BODY CONTENT ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.bodyScrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 65 },
        ]}
      >
        {/* Quick Action Sub-bar */}
        <View style={styles.quickActionRow}>
          <Text style={styles.quickActionCountText}>
            Đang hiển thị{' '}
            <Text style={{ color: '#0F382C', fontWeight: '800' }}>
              {filteredFavorites.length}
            </Text>{' '}
            kết quả
          </Text>

          {favorites.length > 0 && (
            <Pressable
              style={styles.clearAllBtn}
              onPress={handleClearAll}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={13} color="#ef4444" />
              <Text style={styles.clearAllBtnText}>Xóa tất cả</Text>
            </Pressable>
          )}
        </View>

        {/* Empty State */}
        {filteredFavorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-outline" size={44} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có mục yêu thích nào</Text>
            <Text style={styles.emptySub}>
              Hãy bấm vào biểu tượng trái tim ❤️ ở bất kỳ điểm đến, vé hay tour nào để lưu lại chuyến đi bạn thích nhé!
            </Text>
            <Pressable
              style={styles.emptyActionBtn}
              onPress={() => router.push('/')}
            >
              <Ionicons name="compass-outline" size={18} color="#ffffff" />
              <Text style={styles.emptyActionBtnText}>Khám phá ngay</Text>
            </Pressable>
          </View>
        ) : (
          /* List of Favorite Cards */
          visibleFavorites.map((item) => (
            <View key={item.id} style={styles.favoriteCard}>
              {/* Thumbnail Container */}
              <View style={styles.thumbContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.thumbImage}
                  contentFit="cover"
                  transition={200}
                />

                {/* Badge Tag Overlay */}
                <View style={styles.tagBadgeOverlay}>
                  <Text style={styles.tagBadgeOverlayText}>{item.tag}</Text>
                </View>

                {/* Heart Button Overlay */}
                <Pressable
                  style={styles.heartBtnOverlay}
                  onPress={() => handleToggleFavorite(item)}
                  hitSlop={8}
                  accessibilityLabel="Bỏ yêu thích"
                >
                  <Ionicons name="heart" size={16} color="#ef4444" />
                </Pressable>
              </View>

              {/* Content Details */}
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.name}
                  </Text>

                  {/* Location & Rating */}
                  <View style={styles.cardMetaRow}>
                    <View style={styles.locRow}>
                      <Ionicons name="location" size={13} color="#ea580c" />
                      <Text style={styles.locText} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                    <Text style={styles.metaDot}>•</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#f59e0b" />
                      <Text style={styles.ratingText}>
                        {item.rating}{' '}
                        <Text style={styles.reviewCountText}>
                          ({item.reviewsCount})
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Price & Action Button */}
                <View style={styles.cardFooterRow}>
                  <View style={styles.priceCol}>
                    {item.oldPrice && (
                      <Text style={styles.oldPriceText}>{item.oldPrice}</Text>
                    )}
                    <Text style={styles.currentPriceText}>
                      <Text style={styles.pricePrefix}>Từ </Text>
                      {item.price}
                    </Text>
                  </View>

                  <Pressable
                    style={styles.bookNowBtn}
                    onPress={() => handleBookNow(item)}
                  >
                    <Text style={styles.bookNowBtnText}>
                      {item.category === 'hotel'
                        ? 'Đặt phòng'
                        : item.category === 'tour'
                        ? 'Đặt tour'
                        : 'Đặt ngay'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}

        {/* ================= PAGINATION BUTTON ================= */}
        {filteredFavorites.length > 10 && (
          <View style={styles.paginationRow}>
            {hasMore ? (
              <Pressable
                style={styles.expandPaginationBtn}
                onPress={() => setPageLimit((prev) => prev + 10)}
              >
                <Text style={styles.expandPaginationBtnText}>
                  Xem thêm mục yêu thích (còn {filteredFavorites.length - pageLimit} mục)
                </Text>
                <Ionicons name="chevron-down" size={16} color="#0F382C" />
              </Pressable>
            ) : (
              <Pressable
                style={styles.collapsePaginationBtn}
                onPress={() => setPageLimit(10)}
              >
                <Text style={styles.collapsePaginationBtnText}>
                  Thu gọn danh sách yêu thích
                </Text>
                <Ionicons name="chevron-up" size={16} color="#64748b" />
              </Pressable>
            )}
          </View>
        )}

        {/* ================= RECOMMENDATION / ASSURANCE BANNER ================= */}
        <View style={styles.assuranceCard}>
          <View style={styles.assuranceIconCircle}>
            <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.assuranceTitle}>
              Vé chuẩn đại lý - Vào cổng ngay
            </Text>
            <Text style={styles.assuranceSub}>
              Quét mã QR trực tiếp không cần xếp hàng đổi vé giấy tại quầy.
            </Text>
          </View>
          <Pressable
            style={styles.assuranceDetailBtn}
            onPress={() =>
              Alert.alert(
                'Cam kết vé iGovi',
                'Tất cả dịch vụ và vé đặt qua iGovi đều có mã QR điện tử hợp lệ 100%, bảo hiểm chuyến đi và hỗ trợ hoàn tiền linh hoạt theo chính sách.'
              )
            }
          >
            <Text style={styles.assuranceDetailBtnText}>Chi tiết</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6F5',
  },

  /* ================= HEADER STYLES ================= */
  headerContainer: {
    backgroundColor: '#0F382C',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 20,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#86efac',
  },
  headerSubtext: {
    fontSize: 11.5,
    color: 'rgba(209, 250, 229, 0.85)',
    fontWeight: '500',
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerGlassBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#ea580c',
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 1,
    borderColor: '#0F382C',
  },

  /* Search Pill */
  searchBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 4,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#0a271f',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchActionBtnText: {
    color: '#86efac',
    fontSize: 11.5,
    fontWeight: '700',
  },

  /* Filter Tabs */
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
    paddingBottom: 2,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  tabPillActiveEmerald: {
    backgroundColor: '#059669',
    borderColor: 'rgba(110, 231, 183, 0.4)',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabPillActiveOrange: {
    backgroundColor: '#ea580c',
    borderColor: 'rgba(251, 146, 60, 0.5)',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(209, 250, 229, 0.9)',
  },
  tabPillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  tabBadgeActiveMint: {
    backgroundColor: '#ffffff',
  },
  tabBadgeActiveOrange: {
    backgroundColor: '#ffffff',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tabBadgeTextInactive: {
    color: '#d1fae5',
  },
  tabBadgeTextMint: {
    color: '#059669',
  },
  tabBadgeTextOrange: {
    color: '#ea580c',
  },

  /* ================= BODY CONTENT STYLES ================= */
  bodyScrollContent: {
    padding: 16,
  },
  quickActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  quickActionCountText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  clearAllBtnText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '700',
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F382C',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  emptyActionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* ================= FAVORITE CARD ================= */
  favoriteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbContainer: {
    width: 105,
    height: 105,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  tagBadgeOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15, 56, 44, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeOverlayText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  heartBtnOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  /* Card Content */
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
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  metaDot: {
    color: '#94a3b8',
    fontSize: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewCountText: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '500',
  },

  /* Card Footer */
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  priceCol: {},
  oldPriceText: {
    fontSize: 10,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    lineHeight: 12,
  },
  currentPriceText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#ea580c',
    letterSpacing: -0.3,
  },
  pricePrefix: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748b',
  },
  bookNowBtn: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  bookNowBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  /* ================= PAGINATION STYLES ================= */
  paginationRow: {
    marginTop: 4,
    marginBottom: 16,
  },
  expandPaginationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#0F382C',
    borderRadius: 14,
    paddingVertical: 12,
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  expandPaginationBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F382C',
  },
  collapsePaginationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingVertical: 10,
  },
  collapsePaginationBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748b',
  },

  /* ================= ASSURANCE BANNER ================= */
  assuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    marginTop: 4,
  },
  assuranceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F382C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assuranceTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#064e3b',
  },
  assuranceSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 1,
  },
  assuranceDetailBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  assuranceDetailBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F382C',
  },
});
