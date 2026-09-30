import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GlobalHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(true);

  const TABS = [
    { name: 'Vé du lịch', route: '/ve-du-lich' },
    { name: 'Lưu trú', route: '/luu-tru' },
    { name: 'Tour', route: '/tour' },
    { name: 'Khu sinh thái', route: '/khu-sinh-thai' },
    { name: 'Ẩm thực', route: '/am-thuc' },
    { name: 'Bản đồ', route: '/ban-do-so' },
    { name: 'Kinh nghiệm', route: '/cam-nang' },
    { name: 'Điểm di tích', route: '/diem-di-tich' },
    { name: '✨ Ưu đãi', route: '/', isHighlight: true },
  ];

  const handleTabPress = (route: string) => {
    if (pathname === route) return;
    router.push(route as any);
  };

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      {/* Top Banner */}
      {showBanner && (
        <View style={styles.topBanner}>
          <View style={styles.topBannerLeft}>
            <View style={styles.logoIconContainer}>
              <Text style={styles.logoIconText}>i<Text style={{ color: '#f05a22' }}>.</Text></Text>
            </View>
            <View>
              <Text style={styles.topBannerTitle}>igovi trên điện thoại</Text>
              <Text style={styles.topBannerSubtitle}>Đặt vé nhanh, quản lý QR tiện lợi</Text>
            </View>
          </View>
          <View style={styles.topBannerRight}>
            <Pressable style={styles.exploreButton} onPress={() => router.push('/ve-du-lich')}>
              <Text style={styles.exploreButtonText}>Khám phá</Text>
            </Pressable>
            <Pressable onPress={() => setShowBanner(false)} hitSlop={10}>
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Main Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.logoContainer} 
          onPress={() => router.push('/')}
          hitSlop={8}
        >
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </Pressable>

        <View style={styles.headerIcons}>
          <Pressable hitSlop={6} onPress={() => router.push('/ve-du-lich')}>
            <SymbolView name="magnifyingglass" size={20} tintColor="#334155" />
          </Pressable>
          <Pressable hitSlop={6} onPress={() => router.push('/ve-du-lich')}>
            <View>
              <SymbolView name="bag" size={20} tintColor="#334155" />
              <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
            </View>
          </Pressable>
          <Pressable hitSlop={6} onPress={() => router.push('/cam-nang')}>
            <SymbolView name="person.circle" size={20} tintColor="#334155" />
          </Pressable>
          <Pressable hitSlop={6} onPress={() => router.push('/')}>
            <SymbolView name="line.3.horizontal" size={20} tintColor="#334155" />
          </Pressable>
        </View>
      </View>

      {/* Horizontal Nav Bar (Kéo qua để chuyển các trang khác) */}
      <View style={styles.navBarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.navBarScroll}
        >
          {TABS.map((tab, idx) => {
            const isActive = pathname === tab.route;
            return (
              <Pressable
                key={idx}
                onPress={() => handleTabPress(tab.route)}
                style={[
                  styles.navTab,
                  isActive && styles.navTabActive,
                  tab.isHighlight && styles.navTabHighlight,
                ]}
              >
                <Text
                  style={[
                    styles.navTabText,
                    isActive && styles.navTabTextActive,
                    tab.isHighlight && styles.navTabTextHighlight,
                  ]}
                >
                  {tab.name}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  topBanner: {
    flexDirection: 'row',
    backgroundColor: '#282f6b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIconContainer: {
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    color: '#00897b',
    fontWeight: '900',
    fontSize: 16,
  },
  topBannerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  topBannerSubtitle: {
    color: '#cbd5e1',
    fontSize: 10,
  },
  topBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exploreButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  closeIcon: {
    color: '#94a3b8',
    fontSize: 20,
    lineHeight: 20,
    paddingHorizontal: 4,
  },

  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 110,
    height: 32,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#f97316',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },

  navBarContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navBarScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 42,
  },
  navTab: {
    paddingHorizontal: 12,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navTabActive: {
  },
  navTabHighlight: {
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
    marginLeft: 4,
  },
  navTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  navTabTextActive: {
    fontWeight: '700',
    color: '#00897b',
  },
  navTabTextHighlight: {
    color: '#ea580c',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: '#00897b',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});
