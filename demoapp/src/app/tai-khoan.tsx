import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Switch,
  Dimensions,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TaiKhoanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // User Profile State
  const [userName, setUserName] = useState('Hoàng Vũ');
  const [userPhone, setUserPhone] = useState('098***8888');
  const [userEmail, setUserEmail] = useState('hoangvu@igovi.vn');
  const [memberCode] = useState('#IGV88992');
  const [userPoints, setUserPoints] = useState(1250);

  // Settings & Toggles State
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [isPromoNotifyEnabled, setIsPromoNotifyEnabled] = useState(true);
  const [isTripReminderEnabled, setIsTripReminderEnabled] = useState(true);

  // Modals
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [editNameInput, setEditNameInput] = useState('Hoàng Vũ');
  const [editPhoneInput, setEditPhoneInput] = useState('0988 888 888');
  const [editEmailInput, setEditEmailInput] = useState('hoangvu@igovi.vn');

  const [isPointsModalVisible, setIsPointsModalVisible] = useState(false);
  const [isVipPerksModalVisible, setIsVipPerksModalVisible] = useState(false);
  const [isPassengersModalVisible, setIsPassengersModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [isSecurityModalVisible, setIsSecurityModalVisible] = useState(false);

  // Passengers Data
  const [passengers, setPassengers] = useState([
    {
      id: 'p-1',
      name: 'Hoàng Vũ',
      type: 'Người lớn (Chính)',
      cccd: '079201******',
      dob: '15/08/1995',
      gender: 'Nam',
    },
    {
      id: 'p-2',
      name: 'Trần Thị Mai',
      type: 'Người lớn',
      cccd: '079203******',
      dob: '22/11/1998',
      gender: 'Nữ',
    },
  ]);
  const [newPassName, setNewPassName] = useState('');
  const [newPassCccd, setNewPassCccd] = useState('');

  // Points history
  const pointsHistory = [
    {
      id: 'pt-1',
      title: 'Hoàn thành Tour Cáp treo Núi Bà Đen',
      date: '30/09/2026',
      points: '+250',
      type: 'plus',
    },
    {
      id: 'pt-2',
      title: 'Đánh giá 5 sao Resort Chavi Garden',
      date: '28/09/2026',
      points: '+100',
      type: 'plus',
    },
    {
      id: 'pt-3',
      title: 'Đổi voucher giảm 100K Ẩm thực',
      date: '20/09/2026',
      points: '-500',
      type: 'minus',
    },
    {
      id: 'pt-4',
      title: 'Thưởng thăng hạng Hội viên Vàng VIP',
      date: '15/09/2026',
      points: '+1.400',
      type: 'plus',
    },
  ];

  const handleSaveProfile = () => {
    if (!editNameInput.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }
    setUserName(editNameInput.trim());
    setUserPhone(editPhoneInput.trim());
    setUserEmail(editEmailInput.trim());
    setIsEditProfileVisible(false);
    Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật!');
  };

  const handleAddPassenger = () => {
    if (!newPassName.trim() || !newPassCccd.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên hành khách và số CCCD/Hộ chiếu');
      return;
    }
    const newP = {
      id: `p-${Date.now()}`,
      name: newPassName.trim(),
      type: 'Người lớn',
      cccd: newPassCccd.trim(),
      dob: '01/01/1996',
      gender: 'Nam',
    };
    setPassengers([newP, ...passengers]);
    setNewPassName('');
    setNewPassCccd('');
    Alert.alert('Thành công', 'Đã thêm hành khách vào danh sách lưu sẵn!');
  };

  const handleDeletePassenger = (id: string) => {
    Alert.alert('Xác nhận xóa', 'Bạn có muốn xóa thông tin hành khách này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => setPassengers(passengers.filter((p) => p.id !== id)),
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản iGovi?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Thông báo', 'Đã đăng xuất thành công!');
          },
        },
      ]
    );
  };

  const openCallHotline = () => {
    Linking.openURL('tel:19008899').catch(() => {
      Alert.alert('Tổng đài hỗ trợ', 'Hotline iGovi 24/7: 1900 8899');
    });
  };

  // Avatar Initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061D17" />

      {/* SCROLL CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* TOP CURVED DARK EMERALD HEADER (Inside ScrollView so overlap works perfectly on Android & iOS) */}
        <View style={[styles.emeraldHeader, { paddingTop: Math.max(insets.top, 16) }]}>
          {/* Ambient Lights */}
          <View style={styles.ambientLightRight} />
          <View style={styles.ambientLightLeft} />

          {/* Navigation Bar inside Emerald Header */}
          <View style={styles.headerNavBar}>
            <View style={{ width: 38 }} />
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Tài Khoản</Text>
              <Text style={styles.headerSubtitle}>Thông tin cá nhân & ưu đãi thành viên</Text>
            </View>
            <Pressable
              style={styles.headerGlassBtn}
              onPress={() => setIsSecurityModalVisible(true)}
              hitSlop={8}
            >
              <Ionicons name="settings-sharp" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* MAIN BODY (OVERLAPPING ON TOP OF GREEN HEADER) */}
        <View style={styles.mainBodyWrap}>
          {/* 1. FLOATING PROFILE CARD */}
          <View style={styles.profileCard}>
            {/* Floating Edit Shortcut Button */}
            <Pressable
              style={styles.floatingSettingsBtn}
              onPress={() => {
                setEditNameInput(userName);
                setEditPhoneInput(userPhone);
                setEditEmailInput(userEmail);
                setIsEditProfileVisible(true);
              }}
              hitSlop={6}
            >
              <Ionicons name="pencil-sharp" size={16} color="#FFFFFF" />
            </Pressable>

            {/* Avatar & User Details */}
            <View style={styles.profileTopRow}>
              {/* Avatar with emerald ring & online dot */}
              <View style={styles.avatarRingWrap}>
                <View style={styles.avatarGradient}>
                  <Text style={styles.avatarInitials}>{getInitials(userName)}</Text>
                </View>
                <View style={styles.onlineBadge} />
              </View>

              {/* Info details */}
              <View style={styles.profileInfoDetails}>
                <View style={styles.nameAndVipRow}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {userName}
                  </Text>
                  {/* VIP Vàng Badge */}
                  <Pressable
                    style={styles.vipGoldBadge}
                    onPress={() => setIsVipPerksModalVisible(true)}
                  >
                    <Ionicons name="sparkles" size={11} color="#92400E" />
                    <Text style={styles.vipGoldBadgeText}>VIP VÀNG</Text>
                  </Pressable>
                </View>

                <Text style={styles.profileContactText}>
                  {userPhone} • {userEmail}
                </Text>

                <View style={styles.memberCodeRow}>
                  <Text style={styles.memberCodeLabel}>Mã thành viên:</Text>
                  <View style={styles.memberCodeBadge}>
                    <Text style={styles.memberCodeText}>{memberCode}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.profileDivider} />

            {/* 3-Column Stats Row */}
            <View style={styles.statsRow}>
              {/* Column 1: Điểm tích lũy */}
              <Pressable
                style={styles.statCol}
                onPress={() => setIsPointsModalVisible(true)}
              >
                <View style={styles.statNumberWrap}>
                  <Text style={styles.statNumberEmerald}>
                    {userPoints.toLocaleString('vi-VN')}
                  </Text>
                  <View style={styles.infoCoinBadge}>
                    <Text style={styles.infoCoinText}>i</Text>
                  </View>
                </View>
                <Text style={styles.statLabel}>Điểm tích lũy</Text>
              </Pressable>

              <View style={styles.statDivider} />

              {/* Column 2: Voucher có sẵn */}
              <Pressable
                style={styles.statCol}
                onPress={() => router.push('/uu-dai')}
              >
                <View style={styles.statNumberWrap}>
                  <Text style={styles.statNumberCoral}>4</Text>
                </View>
                <Text style={styles.statLabel}>Voucher có sẵn</Text>
              </Pressable>

              <View style={styles.statDivider} />

              {/* Column 3: Vé sắp dùng */}
              <Pressable
                style={styles.statCol}
                onPress={() => router.push('/don-hang-ve')}
              >
                <View style={styles.statNumberWrap}>
                  <Text style={styles.statNumberDark}>2</Text>
                </View>
                <Text style={styles.statLabel}>Vé sắp dùng</Text>
              </Pressable>
            </View>
          </View>

          {/* 2. VIP PERKS BANNER */}
          <Pressable
            style={styles.vipPerksBanner}
            onPress={() => setIsVipPerksModalVisible(true)}
          >
            <View style={styles.vipPerksLeft}>
              <View style={styles.vipPerksIconBox}>
                <Ionicons name="trophy-sharp" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.vipPerksContent}>
                <View style={styles.vipPerksHeaderRow}>
                  <Text style={styles.vipPerksTitle}>ĐẶC QUYỀN HỘI VIÊN VÀNG</Text>
                  <View style={styles.detailLinkRow}>
                    <Text style={styles.detailLinkText}>Chi tiết</Text>
                    <Ionicons name="chevron-forward" size={13} color="#92400E" />
                  </View>
                </View>
                <Text style={styles.vipPerksSub}>
                  Giảm thêm 5% cho mọi chuyến du lịch & ưu tiên check-in tại cổng riêng
                </Text>
              </View>
            </View>
          </Pressable>

          {/* 3. SECTION: DỊCH VỤ & CHUYẾN ĐI */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>DỊCH VỤ & CHUYẾN ĐI</Text>
              <Text style={styles.sectionCountText}>3 danh mục</Text>
            </View>

            <View style={styles.actionCardGroup}>
              {/* Item 1: Đơn hàng & Vé của tôi */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && styles.actionItemPressed,
                ]}
                onPress={() => router.push('/don-hang-ve')}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="ticket" size={20} color="#2563EB" />
                </View>
                <View style={styles.actionItemBody}>
                  <View style={styles.actionItemTitleRow}>
                    <Text style={styles.actionItemTitle}>Đơn hàng & Vé của tôi</Text>
                    <View style={styles.badgeBlue}>
                      <Text style={styles.badgeBlueText}>2 vé chờ</Text>
                    </View>
                  </View>
                  <Text style={styles.actionItemSub} numberOfLines={1}>
                    Quản lý vé QR check-in & đánh giá dịch vụ
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </Pressable>

              {/* Item 2: Kho voucher & Mã ưu đãi */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && styles.actionItemPressed,
                ]}
                onPress={() => router.push('/uu-dai')}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: '#FFF2EE' }]}>
                  <Ionicons name="pricetag" size={20} color="#FF6B4A" />
                </View>
                <View style={styles.actionItemBody}>
                  <View style={styles.actionItemTitleRow}>
                    <Text style={styles.actionItemTitle}>Kho voucher & Mã ưu đãi</Text>
                    <View style={styles.badgeCoral}>
                      <Text style={styles.badgeCoralText}>HOT</Text>
                    </View>
                  </View>
                  <Text style={styles.actionItemSub} numberOfLines={1}>
                    Săn mã giảm 150K, flash deal giờ vàng
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </Pressable>

              {/* Item 3: Danh sách yêu thích */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  styles.actionItemLast,
                  pressed && styles.actionItemPressed,
                ]}
                onPress={() => router.push('/yeu-thich')}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: '#FCE8EF' }]}>
                  <Ionicons name="heart" size={20} color="#E11D48" />
                </View>
                <View style={styles.actionItemBody}>
                  <View style={styles.actionItemTitleRow}>
                    <Text style={styles.actionItemTitle}>Danh sách yêu thích</Text>
                    <Text style={styles.itemCountGrey}>4 mục</Text>
                  </View>
                  <Text style={styles.actionItemSub} numberOfLines={1}>
                    Địa điểm, tour và dịch vụ bạn đã lưu
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </Pressable>
            </View>
          </View>

          {/* 4. SECTION: TIỆN ÍCH & CÀI ĐẶT */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>TIỆN ÍCH & CÀI ĐẶT</Text>
            </View>

            <View style={styles.actionCardGroup}>
              {/* Item 1: Trung tâm trợ giúp */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && styles.actionItemPressed,
                ]}
                onPress={() => setIsSupportModalVisible(true)}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="headset" size={20} color="#047857" />
                </View>
                <View style={styles.actionItemBody}>
                  <Text style={styles.actionItemTitle}>Trung tâm trợ giúp iGovi</Text>
                  <Text style={styles.actionItemSub}>Hotline 1900 8899 (Hỗ trợ 24/7)</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </Pressable>

              {/* Item 2: Hành khách đã lưu */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && styles.actionItemPressed,
                ]}
                onPress={() => setIsPassengersModalVisible(true)}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="people" size={20} color="#7E22CE" />
                </View>
                <View style={styles.actionItemBody}>
                  <Text style={styles.actionItemTitle}>Hành khách đã lưu</Text>
                  <Text style={styles.actionItemSub}>
                    CCCD/Hộ chiếu, ngày sinh thuận tiện đặt vé
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </Pressable>

              {/* Item 3: Phương thức thanh toán */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && styles.actionItemPressed,
                ]}
                onPress={() => setIsPaymentModalVisible(true)}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="card" size={20} color="#D97706" />
                </View>
                <View style={styles.actionItemBody}>
                  <Text style={styles.actionItemTitle}>Phương thức thanh toán</Text>
                  <Text style={styles.actionItemSub}>
                    Thẻ Visa, VNPay, Ví MoMo liên kết
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </Pressable>

              {/* Item 4: Bảo mật & Sinh trắc học */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  styles.actionItemLast,
                  pressed && styles.actionItemPressed,
                ]}
                onPress={() => setIsSecurityModalVisible(true)}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="finger-print" size={20} color="#0F766E" />
                </View>
                <View style={styles.actionItemBody}>
                  <Text style={styles.actionItemTitle}>
                    Bảo mật & Đăng nhập sinh trắc
                  </Text>
                  <Text style={styles.actionItemSub}>
                    FaceID / PIN & Đổi mật khẩu
                  </Text>
                </View>
                <View style={styles.biometricStatusBadge}>
                  <Text style={styles.biometricStatusText}>
                    {isBiometricEnabled ? 'Bật' : 'Tắt'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* 5. LOGOUT BUTTON */}
          <View style={styles.logoutContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text style={styles.logoutButtonText}>Đăng xuất tài khoản</Text>
            </Pressable>

            <Text style={styles.appVersionText}>
              Phiên bản ứng dụng iGovi v3.4.1 (Build 2026)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ============================================================ */}
      {/* MODAL 1: EDIT PROFILE */}
      {/* ============================================================ */}
      <Modal
        visible={isEditProfileVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditProfileVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Chỉnh sửa thông tin cá nhân</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setIsEditProfileVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Họ và tên *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editNameInput}
                  onChangeText={setEditNameInput}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Số điện thoại *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editPhoneInput}
                  onChangeText={setEditPhoneInput}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editEmailInput}
                  onChangeText={setEditEmailInput}
                  placeholder="Nhập địa chỉ email"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.infoNoteBox}>
                <Ionicons name="information-circle" size={16} color="#0F382C" />
                <Text style={styles.infoNoteText}>
                  Số điện thoại và Email sẽ được sử dụng để nhận vé điện tử, mã QR và
                  thông báo hành trình quan trọng.
                </Text>
              </View>

              <Pressable
                style={styles.modalPrimaryBtn}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalPrimaryBtnText}>Lưu thay đổi</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 2: POINTS & REWARD HISTORY */}
      {/* ============================================================ */}
      <Modal
        visible={isPointsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPointsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Điểm thưởng & Lịch sử</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setIsPointsModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            {/* Current Balance Box */}
            <View style={styles.pointsBalanceCard}>
              <Text style={styles.pointsBalanceLabel}>Số dư điểm tích lũy</Text>
              <View style={styles.pointsBalanceRow}>
                <Text style={styles.pointsBalanceValue}>
                  {userPoints.toLocaleString('vi-VN')}
                </Text>
                <Text style={styles.pointsBalanceUnit}>điểm</Text>
              </View>
              <Text style={styles.pointsBalanceSub}>
                Tương đương 125.000đ khi quy đổi voucher thanh toán
              </Text>
            </View>

            <Text style={styles.pointsHistoryHeader}>Lịch sử biến động điểm</Text>

            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
              {pointsHistory.map((item) => (
                <View key={item.id} style={styles.pointsHistoryItem}>
                  <View style={styles.pointsHistoryLeft}>
                    <View
                      style={[
                        styles.pointsTypeIcon,
                        {
                          backgroundColor:
                            item.type === 'plus' ? '#ECFDF5' : '#FEF2F2',
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          item.type === 'plus'
                            ? 'arrow-down-circle'
                            : 'arrow-up-circle'
                        }
                        size={18}
                        color={item.type === 'plus' ? '#047857' : '#DC2626'}
                      />
                    </View>
                    <View>
                      <Text style={styles.pointsHistoryTitle}>{item.title}</Text>
                      <Text style={styles.pointsHistoryDate}>{item.date}</Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.pointsHistoryVal,
                      { color: item.type === 'plus' ? '#047857' : '#DC2626' },
                    ]}
                  >
                    {item.points}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <Pressable
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setIsPointsModalVisible(false);
                router.push('/uu-dai');
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Đổi điểm lấy Voucher</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 3: VIP PERKS DETAILS */}
      {/* ============================================================ */}
      <Modal
        visible={isVipPerksModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVipPerksModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="sparkles" size={18} color="#D97706" />
                <Text style={styles.modalHeaderTitle}>Đặc quyền Hội viên Vàng</Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setIsVipPerksModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.vipPerkItemBox}>
                <View style={styles.vipPerkIcon}>
                  <Ionicons name="pricetag" size={18} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vipPerkItemTitle}>Giảm thêm 5% mọi đơn hàng</Text>
                  <Text style={styles.vipPerkItemDesc}>
                    Tự động áp dụng giảm 5% không giới hạn giá trị khi thanh toán vé du
                    lịch, tour, resort & ẩm thực.
                  </Text>
                </View>
              </View>

              <View style={styles.vipPerkItemBox}>
                <View style={styles.vipPerkIcon}>
                  <Ionicons name="flash" size={18} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vipPerkItemTitle}>Lối đi riêng & Ưu tiên check-in</Text>
                  <Text style={styles.vipPerkItemDesc}>
                    Quét mã QR tại cổng VIP tại các khu du lịch Sun World, KDL Núi Bà
                    Đen, Chavi Garden không cần xếp hàng.
                  </Text>
                </View>
              </View>

              <View style={styles.vipPerkItemBox}>
                <View style={styles.vipPerkIcon}>
                  <Ionicons name="gift" size={18} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vipPerkItemTitle}>Quà tặng ngày sinh nhật</Text>
                  <Text style={styles.vipPerkItemDesc}>
                    Tặng voucher 200.000đ và 500 điểm tích lũy vào tháng sinh nhật của bạn.
                  </Text>
                </View>
              </View>

              <View style={styles.vipPerkItemBox}>
                <View style={styles.vipPerkIcon}>
                  <Ionicons name="headset" size={18} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vipPerkItemTitle}>Chăm sóc khách hàng ưu tiên 24/7</Text>
                  <Text style={styles.vipPerkItemDesc}>
                    Được chuyên viên hỗ trợ riêng qua hotline ưu tiên xử lý đổi trả vé
                    trong 5 phút.
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.modalPrimaryBtn}
                onPress={() => setIsVipPerksModalVisible(false)}
              >
                <Text style={styles.modalPrimaryBtnText}>Đã hiểu đặc quyền</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 4: SAVED PASSENGERS */}
      {/* ============================================================ */}
      <Modal
        visible={isPassengersModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPassengersModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Hành khách đã lưu</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setIsPassengersModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {passengers.map((p) => (
                <View key={p.id} style={styles.passengerCard}>
                  <View style={styles.passengerCardTop}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={styles.passengerAvatar}>
                        <Text style={styles.passengerAvatarText}>
                          {p.name.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.passengerName}>{p.name}</Text>
                        <Text style={styles.passengerType}>{p.type}</Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => handleDeletePassenger(p.id)}
                      hitSlop={8}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                  <View style={styles.passengerDetailRow}>
                    <Text style={styles.passengerDetailLabel}>CCCD/Hộ chiếu:</Text>
                    <Text style={styles.passengerDetailValue}>{p.cccd}</Text>
                  </View>
                  <View style={styles.passengerDetailRow}>
                    <Text style={styles.passengerDetailLabel}>Ngày sinh & Giới tính:</Text>
                    <Text style={styles.passengerDetailValue}>
                      {p.dob} • {p.gender}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Add Passenger Form */}
              <View style={styles.addPassengerBox}>
                <Text style={styles.addPassengerTitle}>+ Thêm hành khách mới</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Họ và tên hành khách"
                  value={newPassName}
                  onChangeText={setNewPassName}
                  placeholderTextColor="#94A3B8"
                />
                <TextInput
                  style={[styles.formInput, { marginTop: 8 }]}
                  placeholder="Số CCCD / Định danh / Hộ chiếu"
                  value={newPassCccd}
                  onChangeText={setNewPassCccd}
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
                <Pressable
                  style={[styles.modalPrimaryBtn, { marginTop: 12 }]}
                  onPress={handleAddPassenger}
                >
                  <Text style={styles.modalPrimaryBtnText}>Thêm hành khách</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 5: PAYMENT METHODS */}
      {/* ============================================================ */}
      <Modal
        visible={isPaymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPaymentModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Phương thức thanh toán</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setIsPaymentModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* VNPay */}
              <View style={styles.paymentMethodItem}>
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="qr-code" size={20} color="#0284C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentMethodName}>VNPay QR Auto</Text>
                  <Text style={styles.paymentMethodSub}>Đã liên kết (Mặc định)</Text>
                </View>
                <View style={styles.defaultCheckBadge}>
                  <Ionicons name="checkmark" size={14} color="#0F382C" />
                </View>
              </View>

              {/* MoMo */}
              <View style={styles.paymentMethodItem}>
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#FCE7F3' }]}>
                  <Ionicons name="wallet" size={20} color="#DB2777" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentMethodName}>Ví điện tử MoMo</Text>
                  <Text style={styles.paymentMethodSub}>098***8888</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </View>

              {/* Visa Card */}
              <View style={styles.paymentMethodItem}>
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="card" size={20} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentMethodName}>Thẻ Quốc Tế Visa</Text>
                  <Text style={styles.paymentMethodSub}>•••• •••• •••• 4829</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </View>

              <Pressable
                style={[styles.modalPrimaryBtn, { marginTop: 16 }]}
                onPress={() => {
                  Alert.alert('Thêm thẻ mới', 'Chọn loại thẻ: Visa / MasterCard / ATM Nội địa');
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>+ Thêm thẻ / phương thức mới</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 6: SUPPORT & HOTLINE */}
      {/* ============================================================ */}
      <Modal
        visible={isSupportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSupportModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Trung tâm trợ giúp iGovi</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setIsSupportModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Call Hotline */}
              <Pressable style={styles.supportOptionBox} onPress={openCallHotline}>
                <View style={[styles.supportIconWrap, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="call" size={22} color="#047857" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportOptionTitle}>Tổng đài hỗ trợ 24/7</Text>
                  <Text style={styles.supportOptionValue}>1900 8899 (1.000đ/phút)</Text>
                  <Text style={styles.supportOptionSub}>
                    Hỗ trợ đặt vé, hoàn hủy tour, hướng dẫn check-in
                  </Text>
                </View>
              </Pressable>

              {/* Email Support */}
              <Pressable
                style={styles.supportOptionBox}
                onPress={() => Linking.openURL('mailto:hotro@igovi.vn')}
              >
                <View style={[styles.supportIconWrap, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="mail" size={22} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportOptionTitle}>Email tiếp nhận yêu cầu</Text>
                  <Text style={styles.supportOptionValue}>hotro@igovi.vn</Text>
                  <Text style={styles.supportOptionSub}>
                    Phản hồi trong vòng 30 phút làm việc
                  </Text>
                </View>
              </Pressable>

              {/* FAQ Section */}
              <Pressable
                style={styles.supportOptionBox}
                onPress={() =>
                  Alert.alert(
                    'Câu hỏi thường gặp',
                    '1. Hướng dẫn quét mã QR check-in tại cổng\n2. Chính sách hoàn tiền vé hủy\n3. Cách sử dụng điểm tích lũy và voucher'
                  )
                }
              >
                <View style={[styles.supportIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="help-circle" size={22} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportOptionTitle}>Câu hỏi thường gặp (FAQ)</Text>
                  <Text style={styles.supportOptionSub}>
                    Giải đáp nhanh các thắc mắc phổ biến về vé và dịch vụ
                  </Text>
                </View>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 7: SECURITY & BIOMETRICS */}
      {/* ============================================================ */}
      <Modal
        visible={isSecurityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSecurityModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Cài đặt & Bảo mật</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setIsSecurityModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Biometrics Switch */}
              <View style={styles.settingToggleItem}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.settingToggleTitle}>
                    Đăng nhập bằng FaceID / Vân tay
                  </Text>
                  <Text style={styles.settingToggleSub}>
                    Mở khóa nhanh và xác thực thanh toán tức thì
                  </Text>
                </View>
                <Switch
                  value={isBiometricEnabled}
                  onValueChange={setIsBiometricEnabled}
                  trackColor={{ false: '#CBD5E1', true: '#0F382C' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Promo Notifications Switch */}
              <View style={styles.settingToggleItem}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.settingToggleTitle}>
                    Thông báo ưu đãi & Voucher HOT
                  </Text>
                  <Text style={styles.settingToggleSub}>
                    Nhận thông báo khi có Flash Deal và mã giảm giá mới
                  </Text>
                </View>
                <Switch
                  value={isPromoNotifyEnabled}
                  onValueChange={setIsPromoNotifyEnabled}
                  trackColor={{ false: '#CBD5E1', true: '#0F382C' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Trip Reminders Switch */}
              <View style={styles.settingToggleItem}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.settingToggleTitle}>
                    Nhắc lịch khởi hành & Check-in
                  </Text>
                  <Text style={styles.settingToggleSub}>
                    Nhắc trước 2 giờ và cung cấp dự báo thời tiết điểm đến
                  </Text>
                </View>
                <Switch
                  value={isTripReminderEnabled}
                  onValueChange={setIsTripReminderEnabled}
                  trackColor={{ false: '#CBD5E1', true: '#0F382C' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Change Password */}
              <Pressable
                style={styles.changePasswordBtn}
                onPress={() => {
                  Alert.alert(
                    'Đổi mật khẩu',
                    'Mã OTP xác thực sẽ được gửi về số điện thoại ' + userPhone
                  );
                }}
              >
                <Ionicons name="key-outline" size={18} color="#0F382C" />
                <Text style={styles.changePasswordText}>Đổi mật khẩu tài khoản</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F8',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  /* TOP CURVED DARK EMERALD HEADER */
  emeraldHeader: {
    backgroundColor: '#061D17',
    paddingBottom: 72,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  ambientLightRight: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(20, 83, 68, 0.35)',
  },
  ambientLightLeft: {
    position: 'absolute',
    left: -40,
    bottom: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(11, 48, 38, 0.45)',
  },
  headerNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.9,
  },
  headerGlassBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* MAIN BODY (OVERLAPPING ON TOP OF GREEN HEADER) */
  mainBodyWrap: {
    paddingHorizontal: 16,
    marginTop: -46,
    zIndex: 10,
    elevation: 8,
  },

  /* 1. FLOATING PROFILE CARD */
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#09261E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(9, 38, 30, 0.06)',
    position: 'relative',
    marginBottom: 14,
    zIndex: 10,
  },
  floatingSettingsBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingRight: 40,
  },
  avatarRingWrap: {
    position: 'relative',
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#B3261E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0F382C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfoDetails: {
    flex: 1,
  },
  nameAndVipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  vipGoldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  vipGoldBadgeText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  profileContactText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 3,
  },
  memberCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  memberCodeLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  memberCodeBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  memberCodeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: '#0F382C',
  },

  profileDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },

  /* 3-Column Stats Row */
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statNumberEmerald: {
    fontSize: 18,
    fontWeight: '800',
    color: '#061D17',
  },
  statNumberCoral: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B4A',
  },
  statNumberDark: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F382C',
  },
  infoCoinBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCoinText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#E2E8F0',
  },

  /* 2. VIP PERKS BANNER */
  vipPerksBanner: {
    backgroundColor: '#FEF9E7',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  vipPerksLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vipPerksIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  vipPerksContent: {
    flex: 1,
  },
  vipPerksHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vipPerksTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8D5B00',
    letterSpacing: 0.5,
  },
  detailLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  detailLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  vipPerksSub: {
    fontSize: 11,
    color: '#78350F',
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 16,
  },

  /* SECTIONS */
  sectionWrap: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  sectionCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F382C',
  },

  /* Action Cards Group */
  actionCardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#09261E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionItemLast: {
    borderBottomWidth: 0,
  },
  actionItemPressed: {
    backgroundColor: '#F8FAFC',
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionItemBody: {
    flex: 1,
  },
  actionItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 6,
  },
  actionItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  badgeBlue: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeBlueText: {
    color: '#1E40AF',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeCoral: {
    backgroundColor: '#FF6B4A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeCoralText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  itemCountGrey: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  biometricStatusBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  biometricStatusText: {
    color: '#0F382C',
    fontSize: 11,
    fontWeight: '700',
  },

  /* LOGOUT CONTAINER */
  logoutContainer: {
    marginTop: 4,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 12,
  },
  logoutButtonPressed: {
    backgroundColor: '#FEF2F2',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  appVersionText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 12,
    fontWeight: '500',
  },

  /* MODALS STYLES */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: Dimensions.get('window').height * 0.82,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 14,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Form */
  formGroup: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  infoNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginVertical: 12,
  },
  infoNoteText: {
    fontSize: 11,
    color: '#0F382C',
    flex: 1,
    lineHeight: 16,
  },
  modalPrimaryBtn: {
    backgroundColor: '#0F382C',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Points Modal */
  pointsBalanceCard: {
    backgroundColor: '#061D17',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  pointsBalanceLabel: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
  },
  pointsBalanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
  },
  pointsBalanceValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  pointsBalanceUnit: {
    color: '#FCD34D',
    fontSize: 14,
    fontWeight: '700',
  },
  pointsBalanceSub: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  pointsHistoryHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  pointsHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pointsHistoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pointsTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsHistoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  pointsHistoryDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  pointsHistoryVal: {
    fontSize: 13,
    fontWeight: '800',
  },

  /* VIP Perks Modal */
  vipPerkItemBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#FEF9E7',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 10,
  },
  vipPerkIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vipPerkItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78350F',
  },
  vipPerkItemDesc: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
    lineHeight: 16,
  },

  /* Passengers */
  passengerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  passengerCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  passengerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F382C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerAvatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  passengerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  passengerType: {
    fontSize: 10,
    color: '#64748B',
  },
  passengerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  passengerDetailLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  passengerDetailValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  addPassengerBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addPassengerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F382C',
    marginBottom: 8,
  },

  /* Payment */
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  paymentMethodSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  defaultCheckBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Support */
  supportOptionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  supportIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  supportOptionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F382C',
    marginTop: 1,
  },
  supportOptionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* Security */
  settingToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingToggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  settingToggleSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  changePasswordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 14,
  },
  changePasswordText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F382C',
  },
});
