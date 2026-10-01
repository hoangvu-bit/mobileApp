import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function GlobalFooter() {
  const router = useRouter();
  const pathname = usePathname();

  // Chỉ hiển thị footer ở trang chủ
  if (pathname !== '/' && pathname !== '/index' && pathname !== '') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          {/* Column 1 */}
          <View style={styles.columnMain}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
            <Text style={styles.description}>
              Nền tảng khám phá và đặt dịch vụ du lịch Việt Nam, kết nối lưu trú, tour, vé, khu sinh thái cùng cẩm nang địa phương trong một hành trình thống nhất.
            </Text>

            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Ionicons name="location" size={13} color="#86efac" />
                <Text style={styles.badgeText}>Nhiều tỉnh thành</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="grid" size={13} color="#86efac" />
                <Text style={styles.badgeText}>5 nhóm dịch vụ</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="book" size={13} color="#86efac" />
                <Text style={styles.badgeText}>Cẩm nang bản địa</Text>
              </View>
            </View>
          </View>

          {/* Column 2 */}
          <View style={styles.columnLinks}>
            <Text style={styles.linkTitle}>KHÁM PHÁ</Text>
            <Pressable style={styles.linkRow} onPress={() => router.push('/ve-du-lich')}>
              <Ionicons name="ticket-outline" size={14} color="#86efac" />
              <Text style={styles.linkItem}>Vé du lịch & Trải nghiệm</Text>
            </Pressable>
            <Pressable style={styles.linkRow} onPress={() => router.push('/luu-tru')}>
              <Ionicons name="bed-outline" size={14} color="#86efac" />
              <Text style={styles.linkItem}>Lưu trú & Khách sạn</Text>
            </Pressable>
            <Pressable style={styles.linkRow} onPress={() => router.push('/tour')}>
              <Ionicons name="airplane-outline" size={14} color="#86efac" />
              <Text style={styles.linkItem}>Tour du lịch</Text>
            </Pressable>
            <Pressable style={styles.linkRow} onPress={() => router.push('/khu-sinh-thai')}>
              <Ionicons name="leaf-outline" size={14} color="#86efac" />
              <Text style={styles.linkItem}>Khu sinh thái</Text>
            </Pressable>
            <Pressable style={styles.linkRow} onPress={() => router.push('/am-thuc')}>
              <Ionicons name="restaurant-outline" size={14} color="#86efac" />
              <Text style={styles.linkItem}>Ẩm thực & Món ngon</Text>
            </Pressable>
          </View>

          {/* Column 3 */}
          <View style={styles.columnLinks}>
            <Text style={styles.linkTitle}>LIÊN HỆ & HỖ TRỢ</Text>
            <View style={styles.linkRow}>
              <Ionicons name="call-outline" size={14} color="#86efac" />
              <Text style={styles.linkItem}>Hotline: 1900 8888</Text>
            </View>
            <View style={styles.linkRow}>
              <Ionicons name="mail-outline" size={14} color="#86efac" />
              <Text style={styles.linkItem}>hotro@igovi.vn</Text>
            </View>
            <View style={styles.linkRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#86efac" />
              <Text style={styles.linkItem}>Bảo mật & Điều khoản</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomSection}>
          <Text style={styles.copyright}>© 2026 IGOVI TRAVEL. ALL RIGHTS RESERVED.</Text>
          <View style={styles.socialRow}>
            <View style={styles.socialIconCircle}>
              <Ionicons name="logo-youtube" size={16} color="#ffffff" />
            </View>
            <View style={styles.socialIconCircle}>
              <Ionicons name="logo-tiktok" size={16} color="#ffffff" />
            </View>
            <View style={styles.socialIconCircle}>
              <Ionicons name="logo-facebook" size={16} color="#ffffff" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F382C',
    paddingVertical: 36,
    paddingHorizontal: 20,
    width: '100%',
  },
  content: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  topSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 30,
  },
  columnMain: {
    flex: Platform.OS === 'web' ? 2 : 1,
    paddingRight: Platform.OS === 'web' ? 40 : 0,
  },
  logoContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  logoImage: {
    width: 110,
    height: 36,
  },
  description: {
    color: '#a7bfb4',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    color: '#d1fae5',
    fontSize: 11.5,
    fontWeight: '600',
  },
  columnLinks: {
    flex: 1,
    gap: 10,
  },
  linkTitle: {
    color: '#86efac',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  linkItem: {
    color: '#d1fae5',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  bottomSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column-reverse',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 16,
  },
  copyright: {
    color: 'rgba(167, 243, 208, 0.7)',
    fontSize: 11.5,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
