import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, usePathname } from 'expo-router';

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
                <Text style={styles.badgeText}>Nhiều tỉnh thành</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>4 nhóm dịch vụ</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Cẩm nang bản địa</Text>
              </View>
            </View>
          </View>

          {/* Column 2 */}
          <View style={styles.columnLinks}>
            <Text style={styles.linkTitle}>KHÁM PHÁ</Text>
            <Pressable onPress={() => router.push('/diem-di-tich')}>
              <Text style={styles.linkItem}>Điểm đến</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/am-thuc')}>
              <Text style={styles.linkItem}>Ẩm thực</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/luu-tru')}>
              <Text style={styles.linkItem}>Lưu trú</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/tour')}>
              <Text style={styles.linkItem}>Tour</Text>
            </Pressable>
          </View>

          {/* Column 3 */}
          <View style={styles.columnLinks}>
            <Text style={styles.linkTitle}>LIÊN HỆ</Text>
            <Pressable>
              <Text style={styles.linkItem}>Điều khoản đối tác</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.linkItem}>Điều khoản Creator</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.linkItem}>Hướng dẫn Creator</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomSection}>
          <Text style={styles.copyright}>© 2026 IGOVI. ALL RIGHTS RESERVED.</Text>
          <View style={styles.socialRow}>
            <Pressable><Text style={styles.socialItem}>YouTube</Text></Pressable>
            <Pressable><Text style={styles.socialItem}>TikTok</Text></Pressable>
            <Pressable><Text style={styles.socialItem}>Facebook</Text></Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#113a2d',
    paddingVertical: 40,
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
    gap: 30,
    marginBottom: 40,
  },
  columnMain: {
    flex: Platform.OS === 'web' ? 2 : 1,
    paddingRight: Platform.OS === 'web' ? 40 : 0,
  },
  logoContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  description: {
    color: '#a7bfb4',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    borderWidth: 1,
    borderColor: '#265747',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: '#a7bfb4',
    fontSize: 12,
  },
  columnLinks: {
    flex: 1,
  },
  linkTitle: {
    color: '#a7bfb4',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  linkItem: {
    color: '#a7bfb4',
    fontSize: 14,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#1b4a3a',
    marginBottom: 20,
  },
  bottomSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column-reverse',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 16,
  },
  copyright: {
    color: '#a7bfb4',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 20,
  },
  socialItem: {
    color: '#a7bfb4',
    fontSize: 13,
  },
});
