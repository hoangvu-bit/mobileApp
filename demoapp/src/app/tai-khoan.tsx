import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function TaiKhoanScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản iGovi?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: () => Alert.alert('Thông báo', 'Đã đăng xuất thành công!') },
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
          <Text style={styles.subHeaderTitle}>Tài Khoản</Text>
          <Text style={styles.subHeaderSubtitle}>Thông tin cá nhân & ưu đãi thành viên</Text>
        </View>
        <Pressable
          style={styles.settingsBtn}
          onPress={() => Alert.alert('Cài đặt', 'Cài đặt tài khoản iGovi')}
        >
          <SymbolView name="gearshape" size={18} tintColor="#111c2d" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarWrap}>
              <SymbolView name="person.fill" size={32} tintColor="#ffffff" />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Hoàng Vũ</Text>
                <View style={styles.vipBadge}>
                  <Text style={styles.vipBadgeText}>VIP VÀNG</Text>
                </View>
              </View>
              <Text style={styles.userPhone}>098***8888 • hoangvu@igovi.vn</Text>
              <Text style={styles.memberId}>Mã thành viên: #IGV88992</Text>
            </View>
          </View>

          {/* Points & Voucher stats */}
          <View style={styles.statsRow}>
            <Pressable 
              style={styles.statCol}
              onPress={() => Alert.alert('Điểm thưởng', 'Bạn đang có 1.250 điểm thưởng iGovi. Tích lũy thêm điểm khi hoàn thành và đánh giá các đơn đặt vé!')}
            >
              <Text style={styles.statValue}>1.250</Text>
              <Text style={styles.statLabel}>Điểm tích lũy</Text>
            </Pressable>
            <View style={styles.statDivider} />
            <Pressable 
              style={styles.statCol}
              onPress={() => router.push('/uu-dai')}
            >
              <Text style={[styles.statValue, { color: '#b32113' }]}>4</Text>
              <Text style={styles.statLabel}>Voucher có sẵn</Text>
            </Pressable>
            <View style={styles.statDivider} />
            <Pressable 
              style={styles.statCol}
              onPress={() => router.push('/don-hang-ve')}
            >
              <Text style={[styles.statValue, { color: '#006b5f' }]}>2</Text>
              <Text style={styles.statLabel}>Vé sắp dùng</Text>
            </Pressable>
          </View>
        </View>

        {/* Member Benefits Banner */}
        <Pressable 
          style={styles.vipBanner}
          onPress={() => router.push('/uu-dai')}
        >
          <View style={styles.vipBannerLeft}>
            <SymbolView name="crown.fill" size={24} tintColor="#aa6400" />
            <View style={{ flex: 1 }}>
              <Text style={styles.vipBannerTitle}>Đặc quyền Hội viên Vàng</Text>
              <Text style={styles.vipBannerSub}>Giảm thêm 5% cho mọi chuyến du lịch & ưu tiên check-in</Text>
            </View>
          </View>
          <SymbolView name="chevron.right" size={16} tintColor="#aa6400" />
        </Pressable>

        {/* Section 1: Quản lý chuyến đi */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>DỊCH VỤ & CHUYẾN ĐI</Text>

          <Pressable style={styles.menuItem} onPress={() => router.push('/don-hang-ve')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#dee8ff' }]}>
                <SymbolView name="ticket.fill" size={18} tintColor="#1e40af" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Đơn hàng & Vé của tôi</Text>
                <Text style={styles.menuItemDesc}>Quản lý vé QR check-in & đánh giá dịch vụ</Text>
              </View>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#94a3b8" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/uu-dai')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#ffdad4' }]}>
                <SymbolView name="tag.fill" size={18} tintColor="#b32113" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Kho voucher & Mã ưu đãi</Text>
                <Text style={styles.menuItemDesc}>Săn mã giảm 150K, flash deal giờ vàng</Text>
              </View>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#94a3b8" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/yeu-thich')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#fee2e2' }]}>
                <SymbolView name="heart.fill" size={18} tintColor="#e11d48" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Danh sách yêu thích</Text>
                <Text style={styles.menuItemDesc}>Địa điểm, tour và dịch vụ bạn đã lưu</Text>
              </View>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#94a3b8" />
          </Pressable>
        </View>

        {/* Section 2: Cài đặt & Tiện ích */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>CÀI ĐẶT & BẢO MẬT</Text>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert('Thông tin cá nhân', 'Chỉnh sửa họ tên, email, số điện thoại')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#f1f5f9' }]}>
                <SymbolView name="person.crop.circle" size={18} tintColor="#475569" />
              </View>
              <Text style={styles.menuItemTitle}>Thông tin cá nhân</Text>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#94a3b8" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert('Ví thanh toán', 'Quản lý thẻ ngân hàng, MoMo, ZaloPay liên kết')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#f1f5f9' }]}>
                <SymbolView name="creditcard" size={18} tintColor="#475569" />
              </View>
              <Text style={styles.menuItemTitle}>Phương thức thanh toán</Text>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#94a3b8" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert('Thông báo', 'Cài đặt nhận thông báo ưu đãi và nhắc giờ vé')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#f1f5f9' }]}>
                <SymbolView name="bell" size={18} tintColor="#475569" />
              </View>
              <Text style={styles.menuItemTitle}>Cài đặt thông báo</Text>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#94a3b8" />
          </Pressable>
        </View>

        {/* Section 3: Hỗ trợ */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>HỖ TRỢ & PHÁP LÝ</Text>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert('Tổng đài hỗ trợ', 'Hotline 24/7: 1900 1234\nEmail: hotro@igovi.vn')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#e7f8ef' }]}>
                <SymbolView name="phone.fill" size={18} tintColor="#006b5f" />
              </View>
              <Text style={styles.menuItemTitle}>Trung tâm trợ giúp 24/7</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#006b5f', fontWeight: '700' }}>1900 1234</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert('Điều khoản', 'Điều khoản sử dụng và chính sách bảo mật của nền tảng iGovi')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#f1f5f9' }]}>
                <SymbolView name="doc.text" size={18} tintColor="#475569" />
              </View>
              <Text style={styles.menuItemTitle}>Điều khoản & Chính sách</Text>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor="#94a3b8" />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <SymbolView name="rectangle.portrait.and.arrow.right" size={18} tintColor="#b32113" />
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </Pressable>

        <Text style={styles.versionText}>Phiên bản iGovi v2.4.0</Text>
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
  settingsBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f0f3ff', justifyContent: 'center', alignItems: 'center' },

  scrollContent: { padding: 16, paddingBottom: 32 },

  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f0f3ff',
  },
  profileTopRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatarWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#b32113', justifyContent: 'center', alignItems: 'center' },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName: { fontSize: 18, fontWeight: '800', color: '#111c2d' },
  vipBadge: { backgroundColor: '#ffdcbe', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  vipBadgeText: { color: '#874e00', fontSize: 10, fontWeight: '800' },
  userPhone: { fontSize: 12, color: '#64748b', marginTop: 2 },
  memberId: { fontSize: 11, color: '#94a3b8', marginTop: 1 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCol: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#111c2d' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: '#e2e8f0' },

  vipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  vipBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  vipBannerTitle: { fontSize: 13, fontWeight: '700', color: '#92400e' },
  vipBannerSub: { fontSize: 11, color: '#b45309', marginTop: 2 },

  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f3ff',
  },
  menuSectionTitle: { fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5, marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  menuIconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuItemTitle: { fontSize: 13, fontWeight: '700', color: '#111c2d' },
  menuItemDesc: { fontSize: 11, color: '#64748b', marginTop: 2 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  logoutBtnText: { color: '#b32113', fontSize: 14, fontWeight: '700' },
  versionText: { textAlign: 'center', fontSize: 11, color: '#94a3b8', marginBottom: 20 },
});
