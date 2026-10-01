import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';

interface OrderItem {
  id: string;
  code: string;
  title: string;
  location: string;
  date: string;
  quantity: string;
  totalPrice: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  image: string;
  hasReviewed?: boolean;
  rating?: number;
}

const ORDERS: OrderItem[] = [
  {
    id: 'ord-1',
    code: 'IGV-928371',
    title: 'Vé Cáp Treo Chùa Hang Núi Bà Đen (Khứ hồi)',
    location: 'Tây Ninh',
    date: 'Ngày mai, 01/10/2026 - Tuyến cáp treo',
    quantity: '2 vé Người lớn',
    totalPrice: '490.000đ',
    status: 'upcoming',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAGzag4JWCmqBtN4mYGy6MERp-frzyeBC6nRoGOAPRwvo_KRQv212W5LFMkH4h-aNMgVbvRcmo8YRhRZ0xjAevClzlZ2h59cQeAt_-ciE-QVymPMePoC1eTnJmazNG68usffuP6JhObJw0K-OPnLmNotdYxlLwsizfiP-xNl_jtEmdYKUE-iVJqyk2pdB5IxCECOQwlcjkzH29D3-Kqy2z0oEo2wI1YxaRAjBBi4fQOaqWRaGrdT_Q',
  },
  {
    id: 'ord-2',
    code: 'IGV-817290',
    title: 'Buffet Trưa Vân Sơn Núi Bà Đen - Hơn 80 món',
    location: 'Tây Ninh',
    date: '05/10/2026 - 11:30',
    quantity: '2 vé Người lớn, 1 vé Trẻ em',
    totalPrice: '675.000đ',
    status: 'upcoming',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpdnq32CxUpTr_pSlBgV5-jfSeK_Q2H14FGBJ9aSfxvNintVaIatDLrTyN5abKcqlW9OYN9rNk7zVMFTBjHwiHwEOXSRnfLlbt_eJ5PxYK4EIJ7AL7pkvzYVrK7PAW8kZf_xT9ifr9MeCVD6I6GCmhTuEuQOZlWmv7GoSR9lmx7aekv8lVxqX2uUksmK4tbS2Zaj9_y3gENTL3Vr05K_BO8EHjX4xokTVc4UpCf9IMc1ABZ0QjJOc',
  },
  {
    id: 'ord-3',
    code: 'IGV-652019',
    title: 'Tour Săn Mây Cầu Đất Đà Lạt 1 Ngày',
    location: 'Đà Lạt',
    date: '15/09/2026 - 05:00',
    quantity: '1 khách',
    totalPrice: '280.000đ',
    status: 'completed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
    hasReviewed: true,
    rating: 5,
  },
  {
    id: 'ord-4',
    code: 'IGV-510928',
    title: 'Vé Show Tinh Hoa Việt Nam Phú Quốc',
    location: 'Phú Quốc',
    date: '20/08/2026 - 20:00',
    quantity: '2 vé',
    totalPrice: '500.000đ',
    status: 'completed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfokXgcQbyvHgUYKyd0ZVjjXi7c_D6S3kMPJLwjFNxNMGzKJ8f5H0AwqTYf7y7LDPooOexz5gcPlZWjIvVYk4bIRAG6ccle8qAfKtrzDm7hhKkjs7E_tnDKFFOcAig9ElRckgyN54UtPd5Flhcvjiv6vv3asE5AvZyHZufEm_Xv9q8VVn31OWx9RVMWHrx-xvwm2BA3W46L6wvkWIHOIPpNMy7VUCLHOXB71XGVlTJDBiNSH94WbyP',
    hasReviewed: false,
  },
  {
    id: 'ord-5',
    code: 'IGV-401928',
    title: 'Tour Khám Phá Địa Đạo Củ Chi 1/2 Ngày',
    location: 'TP. Hồ Chí Minh',
    date: '10/07/2026',
    quantity: '1 khách',
    totalPrice: '320.000đ',
    status: 'cancelled',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
  },
];

export default function DonHangVeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [orders, setOrders] = useState<OrderItem[]>(ORDERS);

  const filteredOrders = orders.filter(o => o.status === activeTab);

  const handleShowQR = (order: OrderItem) => {
    Alert.alert(
      'Mã QR Check-in',
      `Mã vé: ${order.code}\n${order.title}\nSố lượng: ${order.quantity}\n\nVui lòng đưa mã này tại cổng quét vé tự động của khu du lịch!`,
      [{ text: 'Đóng' }]
    );
  };

  const handleReview = (id: string, title: string) => {
    Alert.alert(
      'Đánh giá chuyến đi',
      `Bạn đánh giá 5 sao cho dịch vụ "${title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Gửi đánh giá ⭐⭐⭐⭐⭐',
          onPress: () => {
            setOrders(prev =>
              prev.map(o => o.id === id ? { ...o, hasReviewed: true, rating: 5 } : o)
            );
            Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá! Bạn được cộng +50 điểm thưởng iGovi.');
          },
        },
      ]
    );
  };

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
          <Text style={styles.subHeaderTitle}>Đơn Hàng / Vé của tôi</Text>
          <Text style={styles.subHeaderSubtitle}>Quản lý vé QR & đánh giá dịch vụ</Text>
        </View>
        <Pressable 
          style={styles.searchIconBtn}
          onPress={() => Alert.alert('Tra cứu đơn hàng', 'Nhập mã đơn hàng iGovi để tìm kiếm nhanh')}
        >
          <SymbolView name="magnifyingglass" size={18} tintColor="#111c2d" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'upcoming' && styles.tabBtnTextActive]}>
            Chờ sử dụng
          </Text>
          <View style={[styles.badgePill, activeTab === 'upcoming' && styles.badgePillActive]}>
            <Text style={[styles.badgePillText, activeTab === 'upcoming' && styles.badgePillTextActive]}>
              {orders.filter(o => o.status === 'upcoming').length}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.tabBtn, activeTab === 'completed' && styles.tabBtnActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'completed' && styles.tabBtnTextActive]}>
            Đã hoàn thành
          </Text>
          <View style={[styles.badgePill, activeTab === 'completed' && styles.badgePillActive]}>
            <Text style={[styles.badgePillText, activeTab === 'completed' && styles.badgePillTextActive]}>
              {orders.filter(o => o.status === 'completed').length}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.tabBtn, activeTab === 'cancelled' && styles.tabBtnActive]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'cancelled' && styles.tabBtnTextActive]}>
            Đã hủy
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <SymbolView name="ticket" size={48} tintColor="#cbd5e1" />
            <Text style={styles.emptyTitle}>Chưa có vé nào trong mục này</Text>
            <Text style={styles.emptySub}>Khám phá các điểm đến hấp dẫn và đặt vé ngay cùng iGovi!</Text>
            <Pressable style={styles.bookNowBtn} onPress={() => router.push('/ve-du-lich')}>
              <Text style={styles.bookNowBtnText}>Đặt vé ngay</Text>
            </Pressable>
          </View>
        ) : (
          filteredOrders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View style={styles.codeRow}>
                  <SymbolView name="qrcode" size={16} tintColor="#b32113" />
                  <Text style={styles.orderCode}>{order.code}</Text>
                </View>
                <View style={[
                  styles.statusTag,
                  order.status === 'upcoming' && { backgroundColor: '#e7f8ef' },
                  order.status === 'completed' && { backgroundColor: '#f1f5f9' },
                  order.status === 'cancelled' && { backgroundColor: '#fee2e2' },
                ]}>
                  <Text style={[
                    styles.statusTagText,
                    order.status === 'upcoming' && { color: '#006b5f' },
                    order.status === 'completed' && { color: '#64748b' },
                    order.status === 'cancelled' && { color: '#b32113' },
                  ]}>
                    {order.status === 'upcoming' ? 'Chờ sử dụng' : order.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                  </Text>
                </View>
              </View>

              <View style={styles.orderCardBody}>
                <Image source={{ uri: order.image }} style={styles.orderImage} contentFit="cover" />
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle} numberOfLines={2}>{order.title}</Text>
                  <Text style={styles.orderLocation}>📍 {order.location}</Text>
                  <Text style={styles.orderDate}>📅 {order.date}</Text>
                  <Text style={styles.orderQuantity}>👥 {order.quantity}</Text>
                  <Text style={styles.orderPrice}>Tổng tiền: <Text style={{ color: '#b32113', fontWeight: '800' }}>{order.totalPrice}</Text></Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.orderCardActions}>
                {order.status === 'upcoming' && (
                  <>
                    <Pressable style={styles.qrBtn} onPress={() => handleShowQR(order)}>
                      <SymbolView name="qrcode" size={16} tintColor="#fff" />
                      <Text style={styles.qrBtnText}>Mở mã QR vé</Text>
                    </Pressable>
                    <Pressable
                      style={styles.detailBtn}
                      onPress={() => Alert.alert('Chi tiết vé', `Mã đơn hàng: ${order.code}\nTrạng thái: Đã thanh toán thành công.\nVé có giá trị sử dụng trực tiếp tại cổng.`)}
                    >
                      <Text style={styles.detailBtnText}>Chi tiết</Text>
                    </Pressable>
                  </>
                )}

                {order.status === 'completed' && (
                  <>
                    {order.hasReviewed ? (
                      <View style={styles.reviewedBadge}>
                        <Text style={styles.reviewedBadgeText}>Đã đánh giá {order.rating} ⭐</Text>
                      </View>
                    ) : (
                      <Pressable style={styles.reviewBtn} onPress={() => handleReview(order.id, order.title)}>
                        <SymbolView name="star.fill" size={14} tintColor="#fff" />
                        <Text style={styles.reviewBtnText}>Đánh giá (+50 điểm)</Text>
                      </Pressable>
                    )}
                    <Pressable style={styles.rebookBtn} onPress={() => router.push('/ve-du-lich')}>
                      <Text style={styles.rebookBtnText}>Đặt lại</Text>
                    </Pressable>
                  </>
                )}

                {order.status === 'cancelled' && (
                  <Pressable style={styles.rebookBtn} onPress={() => router.push('/ve-du-lich')}>
                    <Text style={styles.rebookBtnText}>Đặt vé khác</Text>
                  </Pressable>
                )}
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
  searchIconBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f0f3ff', justifyContent: 'center', alignItems: 'center' },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    gap: 6,
  },
  tabBtnActive: { backgroundColor: '#b32113' },
  tabBtnText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  tabBtnTextActive: { color: '#ffffff', fontWeight: '700' },
  badgePill: { backgroundColor: '#e2e8f0', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10 },
  badgePillActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  badgePillText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  badgePillTextActive: { color: '#ffffff' },

  scrollContent: { padding: 16, paddingBottom: 32 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111c2d', marginTop: 12 },
  emptySub: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 4, lineHeight: 18 },
  bookNowBtn: { marginTop: 16, backgroundColor: '#b32113', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  bookNowBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },

  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f3ff',
  },
  orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  orderCode: { fontSize: 12, fontWeight: '700', color: '#111c2d' },
  statusTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusTagText: { fontSize: 11, fontWeight: '700' },

  orderCardBody: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  orderImage: { width: 84, height: 84, borderRadius: 10, backgroundColor: '#dee8ff' },
  orderInfo: { flex: 1, justifyContent: 'space-between' },
  orderTitle: { fontSize: 13, fontWeight: '700', color: '#111c2d', lineHeight: 18 },
  orderLocation: { fontSize: 11, color: '#64748b' },
  orderDate: { fontSize: 11, color: '#475569' },
  orderQuantity: { fontSize: 11, color: '#475569' },
  orderPrice: { fontSize: 12, color: '#111c2d', marginTop: 2 },

  orderCardActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  qrBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#b32113', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16 },
  qrBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  detailBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16 },
  detailBtnText: { color: '#111c2d', fontSize: 12, fontWeight: '600' },
  reviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#aa6400', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16 },
  reviewBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  reviewedBadge: { backgroundColor: '#ffdcbe', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  reviewedBadgeText: { color: '#874e00', fontSize: 11, fontWeight: '700' },
  rebookBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16 },
  rebookBtnText: { color: '#006b5f', fontSize: 12, fontWeight: '700' },
});
