import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Ẩn thanh bottom nav ở các màn hình chi tiết (đã có thanh đặt vé/hành động riêng cố định bên dưới)
  if (pathname.startsWith('/chi-tiet')) {
    return null;
  }

  // 5 chức năng (Vé du lịch, Lưu trú, Tour, Khu sinh thái, Ẩm thực) cùng các mục khám phá là CON của Trang chủ
  const isTrangChuActive =
    pathname === '/' ||
    pathname === '/index' ||
    pathname === '' ||
    pathname.startsWith('/ve-du-lich') ||
    pathname.startsWith('/luu-tru') ||
    pathname.startsWith('/tour') ||
    pathname.startsWith('/khu-sinh-thai') ||
    pathname.startsWith('/am-thuc') ||
    pathname.startsWith('/diem-di-tich') ||
    pathname.startsWith('/ban-do-so') ||
    pathname.startsWith('/cam-nang') ||
    (!pathname.startsWith('/uu-dai') &&
      !pathname.startsWith('/don-hang-ve') &&
      !pathname.startsWith('/yeu-thich') &&
      !pathname.startsWith('/tai-khoan'));

  const isUuDaiActive = pathname.startsWith('/uu-dai');
  const isDonHangActive = pathname.startsWith('/don-hang-ve');
  const isYeuThichActive = pathname.startsWith('/yeu-thich');
  const isTaiKhoanActive = pathname.startsWith('/tai-khoan');

  const TABS = [
    {
      id: 'trang-chu',
      name: 'Trang chủ',
      route: '/',
      iconActive: 'home',
      iconInactive: 'home-outline',
      isActive: isTrangChuActive,
    },
    {
      id: 'uu-dai',
      name: 'Ưu đãi',
      route: '/uu-dai',
      iconActive: 'pricetag',
      iconInactive: 'pricetag-outline',
      isActive: isUuDaiActive,
      badge: true,
    },
    {
      id: 'don-hang-ve',
      name: 'Đơn hàng/Vé',
      route: '/don-hang-ve',
      iconActive: 'ticket',
      iconInactive: 'ticket-outline',
      isActive: isDonHangActive,
    },
    {
      id: 'yeu-thich',
      name: 'Yêu thích',
      route: '/yeu-thich',
      iconActive: 'heart',
      iconInactive: 'heart-outline',
      isActive: isYeuThichActive,
    },
    {
      id: 'tai-khoan',
      name: 'Tài khoản',
      route: '/tai-khoan',
      iconActive: 'person',
      iconInactive: 'person-outline',
      isActive: isTaiKhoanActive,
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 10),
        },
      ]}
    >
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const activeColor = '#0F382C';
          const inactiveColor = '#64748b';
          const iconColor = tab.isActive ? activeColor : inactiveColor;
          const iconName = tab.isActive ? tab.iconActive : tab.iconInactive;

          return (
            <Pressable
              key={tab.id}
              style={({ pressed }) => [
                styles.tabItem,
                pressed && styles.tabItemPressed,
              ]}
              onPress={() => {
                // Luôn cho phép chuyển trang hoặc quay về trang chủ
                if (tab.id === 'trang-chu') {
                  if (pathname !== '/' && pathname !== '/index') {
                    router.push('/');
                  }
                } else if (!tab.isActive) {
                  router.push(tab.route as any);
                }
              }}
              hitSlop={6}
            >
              {/* Icon Wrap không còn khung xanh lá, chỉ giữ icon tô đậm bên trong */}
              <View style={styles.iconWrap}>
                <Ionicons
                  name={iconName as any}
                  size={tab.isActive ? 22 : 21}
                  color={iconColor}
                />
                {/* Badge thông báo đỏ trên Ưu đãi */}
                {tab.badge && !tab.isActive && (
                  <View style={styles.dotBadge} />
                )}
              </View>

              {/* Tên Tab (In đậm khi active) */}
              <Text
                style={[
                  styles.tabLabel,
                  { color: iconColor },
                  tab.isActive && styles.tabLabelActive,
                ]}
                numberOfLines={1}
              >
                {tab.name}
              </Text>

              {/* Chấm tròn chỉ báo active phía dưới */}
              {tab.isActive && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  tabBar: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    paddingTop: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 56,
    position: 'relative',
  },
  tabItemPressed: {
    transform: [{ scale: 0.9 }],
    opacity: 0.75,
  },
  iconWrap: {
    width: 32,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dotBadge: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#ea580c',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    fontWeight: '800',
    color: '#0F382C',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0F382C',
    marginTop: 2,
  },
});
