import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { matchVietnameseSearch } from '../utils/vietnamese';

export interface OrderItem {
  id: string;
  code: string;
  title: string;
  categoryTag: string;
  location: string;
  date: string;
  quantity: string;
  totalPrice: string;
  totalPriceNum: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'refund';
  image: string;
  hasReviewed?: boolean;
  rating?: number;
  reviewComment?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  bookedAt?: string;
  routeTarget?: string;
}

const ORDERS: OrderItem[] = [
  {
    id: 'ord-1',
    code: 'IGV-928371',
    title: 'Vé Cáp Treo Chùa Hang Núi Bà Đen (Khứ hồi)',
    categoryTag: 'Khứ hồi',
    location: 'Tây Ninh',
    date: 'Ngày mai, 01/10/2026 - Tuyến cáp treo',
    quantity: '2 vé Người lớn',
    totalPrice: '490.000đ',
    totalPriceNum: 490000,
    status: 'upcoming',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChgKX0pBpmZQZSbbegc2H-pjrcpCjRpzgwgK8m6YBFWCmdJdfVqq87KsljgFmZ096l2WJynvxb4AAuvJp0wHBTIJDAowY4jQOxRApfHfgcfVADO3JqxLCAg8s2D7Me73_tUnNmKejEMHdqT7pQ0DruhOCoSrvq1vggGe8ZSaypJJQXEhuQMoZhjYumhRPDXlF8HEvVpzFR-9e0_oRm9ytV-NAUNHC9Bb065_uhiy9fw6tay1VXQcp9tA',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'VNPay QR (Đã thanh toán)',
    bookedAt: '30/09/2026 14:25',
    routeTarget: '/ve-du-lich',
  },
  {
    id: 'ord-2',
    code: 'IGV-817290',
    title: 'Buffet Trưa Vân Sơn Núi Bà Đen - Hơn 80 món',
    categoryTag: 'Ẩm thực',
    location: 'Tây Ninh',
    date: '05/10/2026 - 11:30',
    quantity: '2 vé Người lớn, 1 vé Trẻ em',
    totalPrice: '675.000đ',
    totalPriceNum: 675000,
    status: 'upcoming',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLEeqMa_BCFrGa-M6XDdf8O7w8SH88I_8stT74Dp1OwzTKG5Nem2rdu4_Bg7AkUaQsVjAfbOYTD2IhX12DCerZalhymtTZLr8N_FhYCGArG7cpJlbWRM5lJ162jMtZsU3fZHz527LFVbVC2hTqBJF1oVzQg7biMUZLFd4C7r0V2UrxYriMWiyo5VK_BwAnD8K9oTafvExsVrMjGqMzbgebvCcctgDGK2M9dv7c7xqT8BWGbM54VbUxRA',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Ví MoMo (Đã thanh toán)',
    bookedAt: '28/09/2026 19:10',
    routeTarget: '/am-thuc',
  },
  {
    id: 'ord-3',
    code: 'IGV-736192',
    title: 'Vé Vào Cổng & Xe Điện KDL Sinh Thái Chavi Garden',
    categoryTag: 'Sinh thái',
    location: 'Long An',
    date: '10/10/2026 - 08:30',
    quantity: '2 vé Người lớn',
    totalPrice: '220.000đ',
    totalPriceNum: 220000,
    status: 'upcoming',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCh4tXF3l6c9T0u863R9V7KjY8h6B4z_5wPq8t-v4sH3J2K1L0mN9pQrS7tU5vWxYzAbCdEfGhIjKlMnOpQrStUvWxYz',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Thẻ Quốc Tế Visa (Đã thanh toán)',
    bookedAt: '29/09/2026 09:45',
    routeTarget: '/khu-sinh-thai',
  },
  {
    id: 'ord-4',
    code: 'IGV-652019',
    title: 'Tour Săn Mây Cầu Đất Đà Lạt 1 Ngày',
    categoryTag: 'Tour',
    location: 'Đà Lạt',
    date: '15/09/2026 - 05:00',
    quantity: '1 khách',
    totalPrice: '280.000đ',
    totalPriceNum: 280000,
    status: 'completed',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
    hasReviewed: true,
    rating: 5,
    reviewComment: 'Trải nghiệm tuyệt vời, đón đúng giờ và hướng dẫn viên cực kỳ nhiệt tình!',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Ví MoMo (Đã thanh toán)',
    bookedAt: '12/09/2026 16:30',
    routeTarget: '/tour',
  },
  {
    id: 'ord-5',
    code: 'IGV-510928',
    title: 'Vé Show Tinh Hoa Việt Nam Phú Quốc (Ghế VIP)',
    categoryTag: 'Vui chơi',
    location: 'Phú Quốc',
    date: '20/08/2026 - 20:00',
    quantity: '2 vé VIP',
    totalPrice: '500.000đ',
    totalPriceNum: 500000,
    status: 'completed',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
    hasReviewed: false,
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'VNPay (Đã thanh toán)',
    bookedAt: '18/08/2026 10:15',
    routeTarget: '/ve-du-lich',
  },
  {
    id: 'ord-6',
    code: 'IGV-489102',
    title: 'Phòng Deluxe Hướng Núi - Meliá Vinpearl Tây Ninh',
    categoryTag: 'Khách sạn',
    location: 'Tây Ninh',
    date: '02/08/2026 - 1 Đêm',
    quantity: '2 người lớn, 1 phòng',
    totalPrice: '1.450.000đ',
    totalPriceNum: 1450000,
    status: 'completed',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTUj9fN8k878_hHj9h09h09h8789h87h9879h8979h897h9879h897h987',
    hasReviewed: true,
    rating: 5,
    reviewComment: 'Khách sạn view núi Bà Đen tuyệt đẹp, dịch vụ 5 sao chuẩn quốc tế.',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Thẻ Visa (Đã thanh toán)',
    bookedAt: '01/08/2026 08:20',
    routeTarget: '/luu-tru',
  },
  {
    id: 'ord-7',
    code: 'IGV-401928',
    title: 'Tour Khám Phá Địa Đạo Củ Chi 1/2 Ngày',
    categoryTag: 'Tour',
    location: 'TP. Hồ Chí Minh',
    date: '10/07/2026 - 07:30',
    quantity: '1 khách',
    totalPrice: '320.000đ',
    totalPriceNum: 320000,
    status: 'cancelled',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Ví MoMo (Đã hoàn 100%)',
    bookedAt: '08/07/2026 11:00',
    routeTarget: '/tour',
  },
  {
    id: 'ord-8',
    code: 'IGV-381049',
    title: 'Vé Safari & Công Viên Chăm Sóc Động Vật Phú Quốc',
    categoryTag: 'Vui chơi',
    location: 'Phú Quốc',
    date: '22/06/2026 - Cả ngày',
    quantity: '2 vé Người lớn, 1 vé Trẻ em',
    totalPrice: '1.250.000đ',
    totalPriceNum: 1250000,
    status: 'completed',
    image:
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=600&q=80',
    hasReviewed: true,
    rating: 5,
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'VNPay (Đã thanh toán)',
    bookedAt: '20/06/2026 15:40',
    routeTarget: '/ve-du-lich',
  },
  {
    id: 'ord-9',
    code: 'IGV-349012',
    title: 'Set Đặc Sản Bánh Canh Trảng Bàng Hoàng Minh Tây Ninh',
    categoryTag: 'Ẩm thực',
    location: 'Tây Ninh',
    date: '15/06/2026 - 12:00',
    quantity: 'Set 2 người',
    totalPrice: '150.000đ',
    totalPriceNum: 150000,
    status: 'completed',
    image:
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80',
    hasReviewed: false,
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Ví MoMo (Đã thanh toán)',
    bookedAt: '15/06/2026 10:10',
    routeTarget: '/am-thuc',
  },
  {
    id: 'ord-10',
    code: 'IGV-294810',
    title: 'Vé Cáp Treo Hòn Thơm Khứ Hồi & Công Viên Aquatopia',
    categoryTag: 'Khứ hồi',
    location: 'Phú Quốc',
    date: '12/10/2026 - 09:00',
    quantity: '2 vé Trọn gói',
    totalPrice: '950.000đ',
    totalPriceNum: 950000,
    status: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Thẻ Visa (Đã thanh toán)',
    bookedAt: '01/10/2026 10:05',
    routeTarget: '/ve-du-lich',
  },
  {
    id: 'ord-11',
    code: 'IGV-271039',
    title: 'Tour Miền Tây Sông Nước Chợ Nổi Cái Răng Cần Thơ',
    categoryTag: 'Tour',
    location: 'Cần Thơ',
    date: '02/06/2026 - 05:30',
    quantity: '2 khách',
    totalPrice: '560.000đ',
    totalPriceNum: 560000,
    status: 'completed',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80',
    hasReviewed: true,
    rating: 5,
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Ví MoMo (Đã thanh toán)',
    bookedAt: '01/06/2026 18:20',
    routeTarget: '/tour',
  },
  {
    id: 'ord-12',
    code: 'IGV-240194',
    title: 'Vé Tham Quan & Check-in KDL Sinh Thái Mỹ Luông',
    categoryTag: 'Sinh thái',
    location: 'An Giang',
    date: '20/05/2026 - Cả ngày',
    quantity: '3 vé',
    totalPrice: '180.000đ',
    totalPriceNum: 180000,
    status: 'completed',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    hasReviewed: false,
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'VNPay (Đã thanh toán)',
    bookedAt: '19/05/2026 14:00',
    routeTarget: '/khu-sinh-thai',
  },
  {
    id: 'ord-13',
    code: 'IGV-198302',
    title: 'Khách Sạn Dalat Palace Heritage 5 Sao - Phòng Superior',
    categoryTag: 'Khách sạn',
    location: 'Đà Lạt',
    date: '10/05/2026 - 2 Đêm',
    quantity: '1 phòng, 2 người',
    totalPrice: '3.200.000đ',
    totalPriceNum: 3200000,
    status: 'cancelled',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Thẻ Visa (Đã hoàn tiền)',
    bookedAt: '05/05/2026 16:30',
    routeTarget: '/luu-tru',
  },
  {
    id: 'ord-14',
    code: 'IGV-150293',
    title: 'Vé Trekking Vườn Quốc Gia Cát Tiên & Khám Phá Safari Đêm',
    categoryTag: 'Sinh thái',
    location: 'Đồng Nai',
    date: '18/04/2026 - 18:00',
    quantity: '2 vé Trọn gói',
    totalPrice: '520.000đ',
    totalPriceNum: 520000,
    status: 'refund',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    customerName: 'Nguyễn Thái',
    customerPhone: '0912 345 678',
    paymentMethod: 'Ví MoMo (Đã hoàn tất)',
    bookedAt: '15/04/2026 11:20',
    routeTarget: '/khu-sinh-thai',
  },
];

type TabType = 'all' | 'upcoming' | 'completed' | 'cancelled' | 'refund';

export default function DonHangVeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [searchText, setSearchText] = useState('');
  const [ordersList, setOrdersList] = useState<OrderItem[]>(ORDERS);

  // Pagination state (10 items per page)
  const [pageLimit, setPageLimit] = useState(10);

  // Modals state
  const [selectedQR, setSelectedQR] = useState<OrderItem | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<OrderItem | null>(null);
  const [reviewOrder, setReviewOrder] = useState<OrderItem | null>(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: ordersList.length,
      upcoming: ordersList.filter((o) => o.status === 'upcoming').length,
      completed: ordersList.filter((o) => o.status === 'completed').length,
      cancelled: ordersList.filter((o) => o.status === 'cancelled').length,
      refund: ordersList.filter((o) => o.status === 'refund').length,
    };
  }, [ordersList]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) => {
      // Tab matching
      if (activeTab !== 'all' && order.status !== activeTab) {
        return false;
      }
      // Search matching
      if (searchText.trim()) {
        const matchCode = matchVietnameseSearch(order.code, searchText);
        const matchTitle = matchVietnameseSearch(order.title, searchText);
        const matchLoc = matchVietnameseSearch(order.location, searchText);
        const matchCat = matchVietnameseSearch(order.categoryTag, searchText);
        if (!matchCode && !matchTitle && !matchLoc && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }, [ordersList, activeTab, searchText]);

  // Paginated orders
  const visibleOrders = useMemo(() => {
    return filteredOrders.slice(0, pageLimit);
  }, [filteredOrders, pageLimit]);

  const hasMore = filteredOrders.length > pageLimit;

  // Actions
  const handleOpenQR = (order: OrderItem) => {
    setSelectedQR(order);
  };

  const handleOpenDetail = (order: OrderItem) => {
    setSelectedDetail(order);
  };

  const handleStartReview = (order: OrderItem) => {
    setRatingScore(5);
    setReviewText('');
    setReviewOrder(order);
  };

  const handleSubmitReview = () => {
    if (!reviewOrder) return;
    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === reviewOrder.id
          ? {
              ...o,
              hasReviewed: true,
              rating: ratingScore,
              reviewComment: reviewText.trim() || 'Dịch vụ rất tốt!',
            }
          : o
      )
    );
    setReviewOrder(null);
    Alert.alert(
      '🎉 Đánh giá thành công!',
      `Cảm ơn bạn đã gửi đánh giá ${ratingScore}⭐ cho dịch vụ.\nBạn nhận được +50 điểm thưởng iGovi tích lũy!`,
      [{ text: 'Tuyệt vời' }]
    );
  };

  const handleShareTicket = async (order: OrderItem) => {
    try {
      await Share.share({
        message: `Vé điện tử iGovi Travel:\nMã vé: ${order.code}\nDịch vụ: ${order.title}\nĐịa điểm: ${order.location}\nThời gian: ${order.date}\nSố lượng: ${order.quantity}\nTổng thanh toán: ${order.totalPrice}`,
      });
    } catch (e) {
      // ignore
    }
  };

  const handleRebook = (order: OrderItem) => {
    if (order.routeTarget) {
      router.push(order.routeTarget as any);
    } else {
      router.push('/ve-du-lich');
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
            <Text style={styles.headerMainTitle}>Đơn hàng / Vé của tôi</Text>
            <View style={styles.headerSubtitleRow}>
              <View style={styles.livePulseDot} />
              <Text style={styles.headerSubtext}>Quản lý vé QR & đánh giá dịch vụ</Text>
            </View>
          </View>

          <View style={styles.headerActionsRow}>
            {/* Notification Bell */}
            <Pressable
              style={styles.headerGlassBtn}
              onPress={() =>
                Alert.alert(
                  'Thông báo vé & đơn hàng',
                  'Vé Cáp Treo Chùa Hang Núi Bà Đen (#IGV-928371) sẽ diễn ra vào ngày mai. Đừng quên xuất trình mã QR tại cửa kiểm soát!'
                )
              }
              hitSlop={6}
            >
              <Ionicons name="notifications-outline" size={19} color="#86efac" />
              <View style={styles.notificationDot} />
            </Pressable>

            {/* QR Scan Button */}
            <Pressable
              style={styles.headerGlassBtn}
              onPress={() =>
                Alert.alert(
                  'Quét mã QR tại cổng',
                  'Tính năng quét mã QR tại quầy tự động của iGovi Travel đã sẵn sàng.'
                )
              }
              hitSlop={6}
            >
              <Ionicons name="qr-code-outline" size={19} color="#86efac" />
            </Pressable>
          </View>
        </View>

        {/* Search Bar Pill */}
        <View style={styles.searchBarPill}>
          <Ionicons name="search" size={17} color="#86efac" style={{ marginLeft: 4 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm mã vé, tên dịch vụ (IGV-928371...)"
            placeholderTextColor="rgba(167, 243, 208, 0.65)"
            value={searchText}
            onChangeText={(val) => {
              setSearchText(val);
              setPageLimit(10); // reset pagination on search
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

        {/* Filter Tabs Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {/* Tab 1: Chờ sử dụng */}
          <Pressable
            style={[
              styles.tabPill,
              activeTab === 'upcoming' && styles.tabPillActiveUpcoming,
            ]}
            onPress={() => {
              setActiveTab('upcoming');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === 'upcoming' && styles.tabPillTextActive,
              ]}
            >
              Chờ sử dụng
            </Text>
            <View
              style={[
                styles.tabBadge,
                activeTab === 'upcoming'
                  ? styles.tabBadgeActiveOrange
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'upcoming'
                    ? styles.tabBadgeTextOrange
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {tabCounts.upcoming}
              </Text>
            </View>
          </Pressable>

          {/* Tab 2: Đã hoàn thành */}
          <Pressable
            style={[
              styles.tabPill,
              activeTab === 'completed' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setActiveTab('completed');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === 'completed' && styles.tabPillTextActive,
              ]}
            >
              Đã hoàn thành
            </Text>
            <View
              style={[
                styles.tabBadge,
                activeTab === 'completed'
                  ? styles.tabBadgeActiveMint
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'completed'
                    ? styles.tabBadgeTextMint
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {tabCounts.completed}
              </Text>
            </View>
          </Pressable>

          {/* Tab 3: Tất cả */}
          <Pressable
            style={[
              styles.tabPill,
              activeTab === 'all' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setActiveTab('all');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === 'all' && styles.tabPillTextActive,
              ]}
            >
              Tất cả
            </Text>
            <View
              style={[
                styles.tabBadge,
                activeTab === 'all'
                  ? styles.tabBadgeActiveMint
                  : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'all'
                    ? styles.tabBadgeTextMint
                    : styles.tabBadgeTextInactive,
                ]}
              >
                {tabCounts.all}
              </Text>
            </View>
          </Pressable>

          {/* Tab 4: Đã hủy */}
          <Pressable
            style={[
              styles.tabPill,
              activeTab === 'cancelled' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setActiveTab('cancelled');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === 'cancelled' && styles.tabPillTextActive,
              ]}
            >
              Đã hủy
            </Text>
            {tabCounts.cancelled > 0 && (
              <View
                style={[
                  styles.tabBadge,
                  activeTab === 'cancelled'
                    ? styles.tabBadgeActiveMint
                    : styles.tabBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    activeTab === 'cancelled'
                      ? styles.tabBadgeTextMint
                      : styles.tabBadgeTextInactive,
                  ]}
                >
                  {tabCounts.cancelled}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Tab 5: Hoàn tiền */}
          <Pressable
            style={[
              styles.tabPill,
              activeTab === 'refund' && styles.tabPillActiveEmerald,
            ]}
            onPress={() => {
              setActiveTab('refund');
              setPageLimit(10);
            }}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === 'refund' && styles.tabPillTextActive,
              ]}
            >
              Hoàn tiền
            </Text>
            {tabCounts.refund > 0 && (
              <View
                style={[
                  styles.tabBadge,
                  activeTab === 'refund'
                    ? styles.tabBadgeActiveMint
                    : styles.tabBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    activeTab === 'refund'
                      ? styles.tabBadgeTextMint
                      : styles.tabBadgeTextInactive,
                  ]}
                >
                  {tabCounts.refund}
                </Text>
              </View>
            )}
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
        {/* Notice Card: Electronic QR Ticket Valid */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeIconWrap}>
            <Ionicons name="qr-code" size={20} color="#059669" />
          </View>
          <View style={styles.noticeTextWrap}>
            <Text style={styles.noticeTitle}>Vé điện tử QR hợp lệ</Text>
            <Text style={styles.noticeSub}>
              Xuất trình mã trực tiếp tại cửa kiểm soát không cần in vé giấy.
            </Text>
          </View>
        </View>

        {/* Ticket List Header / Search feedback */}
        <View style={styles.listSummaryRow}>
          <Text style={styles.listSummaryTitle}>
            Danh sách đơn hàng{' '}
            <Text style={{ color: '#0F382C', fontWeight: '800' }}>
              ({filteredOrders.length})
            </Text>
          </Text>
          {searchText.trim() !== '' && (
            <Pressable
              onPress={() => setSearchText('')}
              style={styles.clearSearchBtn}
            >
              <Text style={styles.clearSearchBtnText}>Xóa tìm kiếm</Text>
            </Pressable>
          )}
        </View>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="ticket-outline" size={44} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có vé nào trong mục này</Text>
            <Text style={styles.emptySub}>
              Khám phá các điểm đến, vé cáp treo và tour hấp dẫn cùng iGovi Travel ngay!
            </Text>
            <Pressable
              style={styles.emptyActionBtn}
              onPress={() => router.push('/ve-du-lich')}
            >
              <Ionicons name="compass-outline" size={18} color="#ffffff" />
              <Text style={styles.emptyActionBtnText}>Khám phá & Đặt vé ngay</Text>
            </Pressable>
          </View>
        ) : (
          /* Ticket Cards List */
          visibleOrders.map((order) => {
            const isUpcoming = order.status === 'upcoming';
            const isCompleted = order.status === 'completed';
            const isCancelled = order.status === 'cancelled';
            const isRefund = order.status === 'refund';

            return (
              <View key={order.id} style={styles.ticketCard}>
                {/* Header: Booking Code & Status Badge */}
                <View style={styles.ticketCardHeader}>
                  <View style={styles.bookingCodeGroup}>
                    <Text style={styles.bookingCodeLabel}>Mã đặt chỗ:</Text>
                    <Text style={styles.bookingCodeValue}>{order.code}</Text>
                  </View>

                  {/* Status Badge */}
                  {isUpcoming && (
                    <View style={styles.statusBadgeUpcoming}>
                      <View style={styles.statusPulseDot} />
                      <Text style={styles.statusBadgeTextUpcoming}>Chờ sử dụng</Text>
                    </View>
                  )}
                  {isCompleted && (
                    <View style={styles.statusBadgeCompleted}>
                      <Ionicons name="checkmark-circle" size={13} color="#059669" />
                      <Text style={styles.statusBadgeTextCompleted}>Đã hoàn thành</Text>
                    </View>
                  )}
                  {isCancelled && (
                    <View style={styles.statusBadgeCancelled}>
                      <Ionicons name="close-circle" size={13} color="#dc2626" />
                      <Text style={styles.statusBadgeTextCancelled}>Đã hủy</Text>
                    </View>
                  )}
                  {isRefund && (
                    <View style={styles.statusBadgeRefund}>
                      <Ionicons name="refresh-circle" size={13} color="#d97706" />
                      <Text style={styles.statusBadgeTextRefund}>Đã hoàn tiền</Text>
                    </View>
                  )}
                </View>

                {/* Body Content */}
                <View style={styles.ticketCardBody}>
                  {/* Thumbnail Image with Tag */}
                  <View style={styles.ticketImageContainer}>
                    <Image
                      source={{ uri: order.image }}
                      style={styles.ticketImage}
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={styles.ticketCategoryTag}>
                      <Text style={styles.ticketCategoryTagText}>
                        {order.categoryTag}
                      </Text>
                    </View>
                  </View>

                  {/* Info Details */}
                  <View style={styles.ticketInfoContainer}>
                    <Text style={styles.ticketTitle} numberOfLines={2}>
                      {order.title}
                    </Text>

                    <View style={styles.ticketMetaRow}>
                      <Ionicons name="location" size={14} color="#ea580c" />
                      <Text style={styles.ticketMetaLocation} numberOfLines={1}>
                        {order.location}
                      </Text>
                    </View>

                    <View style={styles.ticketMetaRow}>
                      <Ionicons name="calendar-outline" size={14} color="#ea580c" />
                      <Text style={styles.ticketMetaText} numberOfLines={1}>
                        {order.date}
                      </Text>
                    </View>

                    <View style={styles.ticketMetaRow}>
                      <Ionicons name="people-outline" size={14} color="#64748b" />
                      <Text style={styles.ticketMetaText} numberOfLines={1}>
                        {order.quantity}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ================= TICKET NOTCH & DASHED DIVIDER ================= */}
                <View style={styles.notchContainer}>
                  <View style={styles.dashedLine} />
                  <View style={styles.notchLeft} />
                  <View style={styles.notchRight} />
                </View>

                {/* Footer: Price & Action Buttons */}
                <View style={styles.ticketCardFooter}>
                  <View style={styles.ticketPriceGroup}>
                    <Text style={styles.ticketPriceLabel}>Tổng thanh toán</Text>
                    <Text style={styles.ticketPriceValue}>{order.totalPrice}</Text>
                  </View>

                  <View style={styles.ticketActionsGroup}>
                    {/* Secondary: Chi tiết */}
                    <Pressable
                      style={styles.detailBtn}
                      onPress={() => handleOpenDetail(order)}
                    >
                      <Text style={styles.detailBtnText}>Chi tiết</Text>
                    </Pressable>

                    {/* Primary Button for Upcoming: Mở mã QR vé */}
                    {isUpcoming && (
                      <Pressable
                        style={styles.qrActionBtn}
                        onPress={() => handleOpenQR(order)}
                      >
                        <Ionicons name="qr-code" size={15} color="#ffffff" />
                        <Text style={styles.qrActionBtnText}>Mở mã QR vé</Text>
                      </Pressable>
                    )}

                    {/* Action for Completed: Review or Reviewed */}
                    {isCompleted && (
                      <>
                        {order.hasReviewed ? (
                          <View style={styles.reviewedBadge}>
                            <Ionicons name="star" size={13} color="#f59e0b" />
                            <Text style={styles.reviewedBadgeText}>
                              {order.rating} ⭐
                            </Text>
                          </View>
                        ) : (
                          <Pressable
                            style={styles.reviewActionBtn}
                            onPress={() => handleStartReview(order)}
                          >
                            <Ionicons name="star" size={14} color="#ffffff" />
                            <Text style={styles.reviewActionBtnText}>
                              Đánh giá (+50đ)
                            </Text>
                          </Pressable>
                        )}
                        <Pressable
                          style={styles.rebookBtn}
                          onPress={() => handleRebook(order)}
                        >
                          <Text style={styles.rebookBtnText}>Đặt lại</Text>
                        </Pressable>
                      </>
                    )}

                    {/* Action for Cancelled: Đặt lại */}
                    {isCancelled && (
                      <Pressable
                        style={styles.rebookBtn}
                        onPress={() => handleRebook(order)}
                      >
                        <Text style={styles.rebookBtnText}>Đặt vé khác</Text>
                      </Pressable>
                    )}

                    {/* Action for Refund: Xem trạng thái */}
                    {isRefund && (
                      <Pressable
                        style={styles.refundBtn}
                        onPress={() =>
                          Alert.alert(
                            'Hoàn tiền thành công',
                            `Mã đơn ${order.code} đã được hoàn ${order.totalPrice} về ${order.paymentMethod}.`
                          )
                        }
                      >
                        <Text style={styles.refundBtnText}>Đã hoàn tiền</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}

        {/* ================= PAGINATION BUTTON ================= */}
        {filteredOrders.length > 10 && (
          <View style={styles.paginationRow}>
            {hasMore ? (
              <Pressable
                style={styles.expandPaginationBtn}
                onPress={() => setPageLimit((prev) => prev + 10)}
              >
                <Text style={styles.expandPaginationBtnText}>
                  Xem thêm đơn hàng / vé (còn {filteredOrders.length - pageLimit} vé)
                </Text>
                <Ionicons name="chevron-down" size={16} color="#0F382C" />
              </Pressable>
            ) : (
              <Pressable
                style={styles.collapsePaginationBtn}
                onPress={() => setPageLimit(10)}
              >
                <Text style={styles.collapsePaginationBtnText}>
                  Thu gọn danh sách vé
                </Text>
                <Ionicons name="chevron-up" size={16} color="#64748b" />
              </Pressable>
            )}
          </View>
        )}

        {/* ================= GUARANTEE / UTILITY BOX ================= */}
        <View style={styles.guaranteeBox}>
          <View style={styles.guaranteeDecorCircle} />
          <View style={styles.guaranteeContent}>
            <View style={styles.guaranteeHeaderRow}>
              <View style={styles.guaranteeBadgeIcon}>
                <Ionicons name="shield-checkmark" size={18} color="#86efac" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.guaranteeTitle}>
                  Hỗ trợ soát vé 24/7 tại quầy iGovi
                </Text>
                <Text style={styles.guaranteeSub}>
                  Hỗ trợ xác thực mã QR & đổi soát vé trực tiếp tại quầy check-in ga cáp treo / cổng vào.
                </Text>
              </View>
            </View>

            <View style={styles.guaranteeFooterRow}>
              <Pressable
                style={styles.hotlinePill}
                onPress={() =>
                  Alert.alert(
                    'Tổng đài hỗ trợ soát vé',
                    'Hotline 1900 8888 (Phím 1) hỗ trợ kiểm tra mã vé & xử lý sự cố check-in 24/7.'
                  )
                }
              >
                <Ionicons name="call" size={13} color="#86efac" />
                <Text style={styles.hotlinePillText}>Hotline: 1900 8888</Text>
              </Pressable>
              <Pressable
                style={styles.helpDocPill}
                onPress={() =>
                  Alert.alert(
                    'Hướng dẫn sử dụng mã QR',
                    '1. Mở mã QR vé trong ứng dụng.\n2. Tăng độ sáng màn hình điện thoại tối đa.\n3. Đưa mã QR vào khung quét tại cổng tự động.\n4. Cổng mở và chúc bạn có chuyến đi vui vẻ!'
                  )
                }
              >
                <Ionicons name="help-circle-outline" size={14} color="#d1fae5" />
                <Text style={styles.helpDocPillText}>Xem hướng dẫn</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ================= MODAL 1: ELECTRONIC QR TICKET ================= */}
      <Modal
        visible={!!selectedQR}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedQR(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContainer}>
            {/* Modal Header */}
            <View style={styles.qrModalHeader}>
              <View style={styles.qrModalHeaderInfo}>
                <Text style={styles.qrModalHeaderTitle}>Vé Điện Tử Check-in</Text>
                <Text style={styles.qrModalHeaderSub}>
                  Xuất trình trực tiếp tại cửa kiểm soát
                </Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setSelectedQR(null)}
                hitSlop={8}
              >
                <Ionicons name="close" size={20} color="#475569" />
              </Pressable>
            </View>

            {selectedQR && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.qrModalScroll}
              >
                {/* Visual Ticket Pass Container */}
                <View style={styles.qrTicketPass}>
                  {/* Top Bar of pass */}
                  <View style={styles.qrTicketPassTop}>
                    <Text style={styles.qrPassServiceTitle} numberOfLines={2}>
                      {selectedQR.title}
                    </Text>
                    <View style={styles.qrPassLocationRow}>
                      <Ionicons name="location" size={13} color="#ea580c" />
                      <Text style={styles.qrPassLocationText}>
                        {selectedQR.location}
                      </Text>
                    </View>
                  </View>

                  {/* QR Image & Code Section */}
                  <View style={styles.qrCodeCenterWrap}>
                    <View style={styles.simulatedQrBox}>
                      {/* Realistic simulated QR pattern layout */}
                      <View style={styles.qrPatternBox}>
                        <View style={styles.qrCornerSquareTopLeft} />
                        <View style={styles.qrCornerSquareTopRight} />
                        <View style={styles.qrCornerSquareBottomLeft} />
                        <View style={styles.qrCenterGrid}>
                          <Ionicons name="qr-code" size={130} color="#0F382C" />
                        </View>
                      </View>
                    </View>

                    <Text style={styles.qrCodeText}>{selectedQR.code}</Text>
                    <Text style={styles.qrHintText}>
                      Quét mã này tại cổng soát vé tự động
                    </Text>
                  </View>

                  {/* Dashed divider */}
                  <View style={styles.modalNotchContainer}>
                    <View style={styles.modalDashedLine} />
                    <View style={styles.modalNotchLeft} />
                    <View style={styles.modalNotchRight} />
                  </View>

                  {/* Ticket Details Grid */}
                  <View style={styles.qrPassDetailsGrid}>
                    <View style={styles.qrPassRow}>
                      <Text style={styles.qrPassLabel}>Khách hàng:</Text>
                      <Text style={styles.qrPassValue}>
                        {selectedQR.customerName || 'Nguyễn Thái'}
                      </Text>
                    </View>
                    <View style={styles.qrPassRow}>
                      <Text style={styles.qrPassLabel}>Thời gian sử dụng:</Text>
                      <Text style={styles.qrPassValue}>{selectedQR.date}</Text>
                    </View>
                    <View style={styles.qrPassRow}>
                      <Text style={styles.qrPassLabel}>Số lượng vé:</Text>
                      <Text style={styles.qrPassValue}>{selectedQR.quantity}</Text>
                    </View>
                    <View style={styles.qrPassRow}>
                      <Text style={styles.qrPassLabel}>Hình thức thanh toán:</Text>
                      <Text style={styles.qrPassValue}>
                        {selectedQR.paymentMethod || 'Đã thanh toán 100%'}
                      </Text>
                    </View>
                    <View style={styles.qrPassRow}>
                      <Text style={styles.qrPassLabel}>Tổng tiền:</Text>
                      <Text style={styles.qrPassValueHighlight}>
                        {selectedQR.totalPrice}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Instructions Box */}
                <View style={styles.qrTipBox}>
                  <Ionicons name="information-circle" size={18} color="#059669" />
                  <Text style={styles.qrTipText}>
                    Vui lòng tăng độ sáng màn hình điện thoại ở mức cao nhất khi đưa qua máy quét mã tại cổng.
                  </Text>
                </View>

                {/* Modal Action Buttons */}
                <View style={styles.qrModalActions}>
                  <Pressable
                    style={styles.shareTicketBtn}
                    onPress={() => handleShareTicket(selectedQR)}
                  >
                    <Ionicons name="share-social-outline" size={17} color="#0F382C" />
                    <Text style={styles.shareTicketBtnText}>Chia sẻ vé</Text>
                  </Pressable>

                  <Pressable
                    style={styles.saveTicketBtn}
                    onPress={() => {
                      Alert.alert(
                        'Đã lưu vé',
                        'Thông tin vé điện tử và mã QR đã được lưu vào thư viện ảnh của thiết bị!'
                      );
                    }}
                  >
                    <Ionicons name="download-outline" size={17} color="#ffffff" />
                    <Text style={styles.saveTicketBtnText}>Lưu ảnh vé</Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 2: ORDER DETAIL ================= */}
      <Modal
        visible={!!selectedDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContainer}>
            {/* Modal Header */}
            <View style={styles.qrModalHeader}>
              <View style={styles.qrModalHeaderInfo}>
                <Text style={styles.qrModalHeaderTitle}>Chi Tiết Đơn Hàng</Text>
                <Text style={styles.qrModalHeaderSub}>
                  {selectedDetail?.code}
                </Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setSelectedDetail(null)}
                hitSlop={8}
              >
                <Ionicons name="close" size={20} color="#475569" />
              </Pressable>
            </View>

            {selectedDetail && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.detailModalScroll}
              >
                {/* Service Card Highlight */}
                <View style={styles.detailServiceCard}>
                  <Image
                    source={{ uri: selectedDetail.image }}
                    style={styles.detailServiceImg}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailServiceTitle}>
                      {selectedDetail.title}
                    </Text>
                    <Text style={styles.detailServiceLocation}>
                      📍 {selectedDetail.location}
                    </Text>
                    <Text style={styles.detailServiceDate}>
                      📅 {selectedDetail.date}
                    </Text>
                  </View>
                </View>

                {/* Info Breakdown Table */}
                <View style={styles.detailTableCard}>
                  <Text style={styles.detailTableSectionTitle}>
                    Thông tin người đặt
                  </Text>
                  <View style={styles.detailTableRow}>
                    <Text style={styles.detailTableLabel}>Họ và tên</Text>
                    <Text style={styles.detailTableVal}>
                      {selectedDetail.customerName || 'Nguyễn Thái'}
                    </Text>
                  </View>
                  <View style={styles.detailTableRow}>
                    <Text style={styles.detailTableLabel}>Số điện thoại</Text>
                    <Text style={styles.detailTableVal}>
                      {selectedDetail.customerPhone || '0912 345 678'}
                    </Text>
                  </View>
                  <View style={styles.detailTableRow}>
                    <Text style={styles.detailTableLabel}>Thời gian đặt</Text>
                    <Text style={styles.detailTableVal}>
                      {selectedDetail.bookedAt || 'Gần đây'}
                    </Text>
                  </View>
                  <View style={styles.detailTableRow}>
                    <Text style={styles.detailTableLabel}>Phương thức</Text>
                    <Text style={styles.detailTableVal}>
                      {selectedDetail.paymentMethod || 'Thanh toán trực tuyến'}
                    </Text>
                  </View>
                </View>

                {/* Price Breakdown */}
                <View style={styles.detailTableCard}>
                  <Text style={styles.detailTableSectionTitle}>
                    Chi tiết thanh toán
                  </Text>
                  <View style={styles.detailTableRow}>
                    <Text style={styles.detailTableLabel}>Số lượng vé</Text>
                    <Text style={styles.detailTableVal}>
                      {selectedDetail.quantity}
                    </Text>
                  </View>
                  <View style={styles.detailTableRow}>
                    <Text style={styles.detailTableLabel}>Giá gốc</Text>
                    <Text style={styles.detailTableVal}>
                      {selectedDetail.totalPrice}
                    </Text>
                  </View>
                  <View style={styles.detailTableRow}>
                    <Text style={styles.detailTableLabel}>Mã giảm giá iGovi</Text>
                    <Text style={[styles.detailTableVal, { color: '#059669' }]}>
                      -0đ (Đã áp dụng)
                    </Text>
                  </View>
                  <View style={[styles.detailTableRow, styles.detailTableTotalRow]}>
                    <Text style={styles.detailTableTotalLabel}>
                      Tổng thanh toán
                    </Text>
                    <Text style={styles.detailTableTotalVal}>
                      {selectedDetail.totalPrice}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.detailModalActions}>
                  {selectedDetail.status === 'upcoming' && (
                    <Pressable
                      style={styles.detailModalPrimaryBtn}
                      onPress={() => {
                        const ord = selectedDetail;
                        setSelectedDetail(null);
                        handleOpenQR(ord);
                      }}
                    >
                      <Ionicons name="qr-code" size={17} color="#ffffff" />
                      <Text style={styles.detailModalPrimaryBtnText}>
                        Mở mã QR vé
                      </Text>
                    </Pressable>
                  )}

                  <Pressable
                    style={styles.detailModalSupportBtn}
                    onPress={() =>
                      Alert.alert(
                        'Hỗ trợ đơn hàng',
                        `Gọi ngay hotline hỗ trợ cho đơn ${selectedDetail.code}: 1900 8888.`
                      )
                    }
                  >
                    <Ionicons name="headset-outline" size={17} color="#0F382C" />
                    <Text style={styles.detailModalSupportBtnText}>
                      Liên hệ hỗ trợ
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 3: REVIEW SERVICE ================= */}
      <Modal
        visible={!!reviewOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setReviewOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reviewModalContainer}>
            {/* Header */}
            <View style={styles.qrModalHeader}>
              <View style={styles.qrModalHeaderInfo}>
                <Text style={styles.qrModalHeaderTitle}>Đánh Giá Chuyến Đi</Text>
                <Text style={styles.qrModalHeaderSub}>
                  Chia sẻ trải nghiệm & nhận ngay +50 điểm
                </Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setReviewOrder(null)}
                hitSlop={8}
              >
                <Ionicons name="close" size={20} color="#475569" />
              </Pressable>
            </View>

            {reviewOrder && (
              <View style={styles.reviewModalBody}>
                <Text style={styles.reviewTargetTitle} numberOfLines={2}>
                  {reviewOrder.title}
                </Text>
                <Text style={styles.reviewTargetLoc}>📍 {reviewOrder.location}</Text>

                {/* Stars Picker */}
                <View style={styles.starPickerRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      onPress={() => setRatingScore(star)}
                      style={styles.starTouchItem}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={star <= ratingScore ? 'star' : 'star-outline'}
                        size={36}
                        color={star <= ratingScore ? '#f59e0b' : '#cbd5e1'}
                      />
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.ratingHintText}>
                  {ratingScore === 5 && 'Tuyệt vời! Dịch vụ rất xuất sắc ⭐⭐⭐⭐⭐'}
                  {ratingScore === 4 && 'Rất tốt! Trải nghiệm hài lòng ⭐⭐⭐⭐'}
                  {ratingScore === 3 && 'Tạm ổn! Cần cải thiện một số điểm ⭐⭐⭐'}
                  {ratingScore === 2 && 'Chưa hài lòng! ⭐⭐'}
                  {ratingScore === 1 && 'Rất thất vọng! ⭐'}
                </Text>

                {/* Comment Input */}
                <TextInput
                  style={styles.reviewTextInput}
                  placeholder="Chia sẻ thêm cảm nhận của bạn về chuyến đi, hướng dẫn viên, chất lượng phục vụ..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  value={reviewText}
                  onChangeText={setReviewText}
                />

                {/* Submit button */}
                <Pressable
                  style={styles.submitReviewBtn}
                  onPress={handleSubmitReview}
                >
                  <Ionicons name="sparkles" size={17} color="#ffffff" />
                  <Text style={styles.submitReviewBtnText}>
                    Gửi Đánh Giá (+50 Điểm Thưởng)
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

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
  tabPillActiveUpcoming: {
    backgroundColor: '#ea580c',
    borderColor: 'rgba(251, 146, 60, 0.5)',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
  tabBadgeActiveOrange: {
    backgroundColor: '#ffffff',
  },
  tabBadgeActiveMint: {
    backgroundColor: '#ffffff',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tabBadgeTextInactive: {
    color: '#d1fae5',
  },
  tabBadgeTextOrange: {
    color: '#ea580c',
  },
  tabBadgeTextMint: {
    color: '#059669',
  },

  /* ================= BODY CONTENT STYLES ================= */
  bodyScrollContent: {
    padding: 16,
  },

  /* Notice Card */
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    marginBottom: 14,
  },
  noticeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTextWrap: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064e3b',
  },
  noticeSub: {
    fontSize: 11.5,
    color: '#047857',
    marginTop: 1,
    lineHeight: 16,
  },

  /* Summary Row */
  listSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  listSummaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  clearSearchBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  clearSearchBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
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

  /* ================= TICKET CARD STYLES ================= */
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  ticketCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  bookingCodeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingCodeLabel: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '500',
  },
  bookingCodeValue: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },

  /* Badges */
  statusBadgeUpcoming: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  statusBadgeTextUpcoming: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065f46',
  },

  statusBadgeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeTextCompleted: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },

  statusBadgeCancelled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeTextCancelled: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b91c1c',
  },

  statusBadgeRefund: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeTextRefund: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },

  /* Ticket Card Body */
  ticketCardBody: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
  },
  ticketImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  ticketCategoryTag: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ticketCategoryTagText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '700',
  },

  ticketInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ticketTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
  },
  ticketMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  ticketMetaLocation: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  ticketMetaText: {
    fontSize: 11,
    color: '#64748b',
  },

  /* Boarding Pass Notch Effect */
  notchContainer: {
    position: 'relative',
    height: 16,
    justifyContent: 'center',
  },
  dashedLine: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    marginHorizontal: 12,
  },
  notchLeft: {
    position: 'absolute',
    left: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F3F6F5',
    borderRightWidth: 1,
    borderColor: '#cbd5e1',
  },
  notchRight: {
    position: 'absolute',
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F3F6F5',
    borderLeftWidth: 1,
    borderColor: '#cbd5e1',
  },

  /* Ticket Card Footer */
  ticketCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
  },
  ticketPriceGroup: {},
  ticketPriceLabel: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '500',
  },
  ticketPriceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ea580c',
    letterSpacing: -0.2,
  },

  ticketActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  qrActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#ea580c',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  qrActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },

  reviewActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
  },
  reviewActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#ffffff',
  },
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
  },
  reviewedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#b45309',
  },
  rebookBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#e6f4ea',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  rebookBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F382C',
  },
  refundBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
  },
  refundBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#b45309',
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

  /* ================= GUARANTEE BOX ================= */
  guaranteeBox: {
    backgroundColor: '#0F382C',
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  guaranteeDecorCircle: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  guaranteeContent: {
    zIndex: 1,
  },
  guaranteeHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  guaranteeBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#ffffff',
  },
  guaranteeSub: {
    fontSize: 11.5,
    color: 'rgba(209, 250, 229, 0.85)',
    marginTop: 3,
    lineHeight: 16,
  },
  guaranteeFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  hotlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0a271f',
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  hotlinePillText: {
    color: '#86efac',
    fontSize: 11.5,
    fontWeight: '800',
  },
  helpDocPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  helpDocPillText: {
    color: '#d1fae5',
    fontSize: 11.5,
    fontWeight: '600',
  },

  /* ================= MODAL BASE STYLES ================= */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  qrModalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  detailModalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: 20,
  },
  reviewModalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 24,
  },
  qrModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  qrModalHeaderInfo: {
    flex: 1,
  },
  qrModalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  qrModalHeaderSub: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* QR Modal Content */
  qrModalScroll: {
    padding: 20,
  },
  qrTicketPass: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  qrTicketPassTop: {
    padding: 16,
    backgroundColor: '#0F382C',
  },
  qrPassServiceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 20,
  },
  qrPassLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  qrPassLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d1fae5',
  },

  qrCodeCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  simulatedQrBox: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  qrPatternBox: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrCornerSquareTopLeft: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: '#0F382C',
    borderRadius: 4,
  },
  qrCornerSquareTopRight: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: '#0F382C',
    borderRadius: 4,
  },
  qrCornerSquareBottomLeft: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: '#0F382C',
    borderRadius: 4,
  },
  qrCenterGrid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 2,
    fontFamily: 'monospace',
    marginTop: 12,
  },
  qrHintText: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 4,
  },

  modalNotchContainer: {
    position: 'relative',
    height: 16,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  modalDashedLine: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    marginHorizontal: 12,
  },
  modalNotchLeft: {
    position: 'absolute',
    left: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderColor: '#cbd5e1',
  },
  modalNotchRight: {
    position: 'absolute',
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderColor: '#cbd5e1',
  },

  qrPassDetailsGrid: {
    padding: 16,
    backgroundColor: '#f8fafc',
    gap: 8,
  },
  qrPassRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrPassLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  qrPassValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  qrPassValueHighlight: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ea580c',
  },

  qrTipBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: 12,
    borderRadius: 14,
    marginTop: 14,
  },
  qrTipText: {
    flex: 1,
    fontSize: 11.5,
    color: '#065f46',
    lineHeight: 16,
  },

  qrModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  shareTicketBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#e6f4ea',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 12,
    borderRadius: 14,
  },
  shareTicketBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F382C',
  },
  saveTicketBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F382C',
    paddingVertical: 12,
    borderRadius: 14,
  },
  saveTicketBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },

  /* Detail Modal Content */
  detailModalScroll: {
    padding: 20,
    gap: 14,
  },
  detailServiceCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailServiceImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  detailServiceTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
  },
  detailServiceLocation: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 3,
  },
  detailServiceDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  detailTableCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  detailTableSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F382C',
    marginBottom: 2,
  },
  detailTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTableLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailTableVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  detailTableTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 4,
  },
  detailTableTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  detailTableTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ea580c',
  },

  detailModalActions: {
    gap: 10,
    marginTop: 6,
  },
  detailModalPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ea580c',
    paddingVertical: 12,
    borderRadius: 14,
  },
  detailModalPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  detailModalSupportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#e6f4ea',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 12,
    borderRadius: 14,
  },
  detailModalSupportBtnText: {
    color: '#0F382C',
    fontSize: 13,
    fontWeight: '800',
  },

  /* Review Modal Content */
  reviewModalBody: {
    padding: 20,
    alignItems: 'center',
  },
  reviewTargetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  reviewTargetLoc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  starPickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  starTouchItem: {
    padding: 4,
  },
  ratingHintText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
    marginTop: 8,
    textAlign: 'center',
  },
  reviewTextInput: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    padding: 12,
    fontSize: 12.5,
    color: '#0f172a',
    textAlignVertical: 'top',
    height: 100,
    marginTop: 16,
  },
  submitReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F382C',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 16,
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  submitReviewBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
