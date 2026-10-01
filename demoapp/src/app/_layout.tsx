import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View } from 'react-native';

import { AnimatedSplashOverlay } from '../components/animated-icon';

import GlobalHeader from '../components/global-header';
import BottomNavBar from '../components/bottom-nav-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ header: () => <GlobalHeader />, headerShown: true }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="tour" />
          <Stack.Screen name="chi-tiet-tour" />
          <Stack.Screen name="tour-da-lat" />
          <Stack.Screen name="tour-vung-tau" />
          <Stack.Screen name="tour-phu-quoc" />
          <Stack.Screen name="tour-mien-tay" />
          <Stack.Screen name="tour-ha-long" />
          <Stack.Screen name="tour-tay-ninh" />
          <Stack.Screen name="tour-ninh-binh" />
          <Stack.Screen name="ve-du-lich" options={{ headerShown: false }} />
          <Stack.Screen name="luu-tru" />
          <Stack.Screen name="khu-sinh-thai" />
          <Stack.Screen name="chi-tiet-khu-sinh-thai" />
          <Stack.Screen name="am-thuc" />
          <Stack.Screen name="chi-tiet-am-thuc" />
          <Stack.Screen name="diem-di-tich" />
          <Stack.Screen name="chi-tiet-diem-di-tich" />
          <Stack.Screen name="ban-do-so" />
          <Stack.Screen name="chi-tiet-dia-diem" />
          <Stack.Screen name="cam-nang" />
          <Stack.Screen name="chi-tiet-bai-viet" />
          <Stack.Screen name="uu-dai" />
          <Stack.Screen name="don-hang-ve" />
          <Stack.Screen name="yeu-thich" />
          <Stack.Screen name="tai-khoan" />
        </Stack>
        <BottomNavBar />
      </View>
    </ThemeProvider>
  );
}
