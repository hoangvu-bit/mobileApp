import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Ẩn thanh bottom nav ở các màn hình chi tiết (đã có thanh đặt vé/hành động riêng)
  if (pathname.startsWith('/chi-tiet')) {
    return null;
  }

  const TABS = [
    {
      id: 'trang-chu',
      name: 'Trang chủ',
      route: '/',
      icon: 'house.fill',
      isActive: pathname === '/' || pathname === '/index',
    },
    {
      id: 'uu-dai',
      name: 'Ưu đãi',
      route: '/uu-dai',
      icon: 'tag.fill',
      isActive: pathname.startsWith('/uu-dai'),
    },
    {
      id: 'don-hang-ve',
      name: 'Đơn hàng/Vé',
      route: '/don-hang-ve',
      icon: 'ticket.fill',
      isActive: pathname.startsWith('/don-hang-ve'),
    },
    {
      id: 'yeu-thich',
      name: 'Yêu thích',
      route: '/yeu-thich',
      icon: 'heart.fill',
      isActive: pathname.startsWith('/yeu-thich'),
    },
    {
      id: 'tai-khoan',
      name: 'Tài khoản',
      route: '/tai-khoan',
      icon: 'person.crop.circle.fill',
      isActive: pathname.startsWith('/tai-khoan'),
    },
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const color = tab.isActive ? '#b32113' : '#64748b';
          return (
            <Pressable
              key={tab.id}
              style={styles.tabItem}
              onPress={() => {
                if (!tab.isActive) {
                  router.push(tab.route as any);
                }
              }}
              hitSlop={6}
            >
              <View style={styles.iconWrap}>
                <SymbolView
                  name={tab.icon as any}
                  size={22}
                  tintColor={color}
                />
                {tab.id === 'uu-dai' && !tab.isActive && (
                  <View style={styles.dotBadge} />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color },
                  tab.isActive && styles.tabLabelActive,
                ]}
                numberOfLines={1}
              >
                {tab.name}
              </Text>
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
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tabBar: {
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 54,
  },
  iconWrap: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#b32113',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
