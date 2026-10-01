import GlobalFooter from '../components/global-footer';
import React, { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function BanDoSoScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [selectedPin, setSelectedPin] = useState<number | null>(0);

  const filteredPoints = selectedFilter === 'Tất cả' 
    ? MAP_POINTS 
    : MAP_POINTS.filter(p => p.type === selectedFilter);

  return (
    <View style={styles.container}>
      {/* Map Search Bar */}
      <View style={styles.searchOverlay}>
        <View style={styles.searchBox}>
          <SymbolView name="magnifyingglass" size={18} tintColor="#4f46e5" />
          <TextInput 
            placeholder="Tìm địa điểm, khách sạn, ẩm thực..." 
            style={styles.searchInput}
            placeholderTextColor="#94a3b8"
          />
          <Pressable 
            style={styles.gpsBtn}
            onPress={() => Alert.alert('Định vị', 'Đang cập nhật vị trí GPS hiện tại của bạn...')}
          >
            <SymbolView name="location.fill" size={16} tintColor="#4f46e5" />
          </Pressable>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPills}>
          {['Tất cả', 'Tham quan', 'Ẩm thực', 'Khách sạn', 'Tiện ích'].map((f, i) => {
            const active = selectedFilter === f;
            return (
              <Pressable 
                key={i} 
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{f}</Text>
              </Pressable>
            );
          })}
      </ScrollView>
      </View>

      {/* Interactive Map Canvas Simulation */}
      <View style={styles.mapCanvas}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80' }} 
          style={styles.mapBgImage} 
        />
        <View style={styles.mapOverlay} />

        {/* Interactive Pins on Map */}
        {filteredPoints.map((point, index) => {
          const isSelected = selectedPin === index;
          return (
            <Pressable
              key={index}
              style={[
                styles.mapPin,
                { top: point.top as any, left: point.left as any },
                isSelected && styles.mapPinSelected,
              ]}
              onPress={() => {
                if (isSelected) {
                  router.push({
                    pathname: '/chi-tiet-dia-diem',
                    params: {
                      name: point.name,
                      type: point.type,
                      distance: point.distance,
                      hours: point.hours,
                      image: point.image,
                    }
                  });
                } else {
                  setSelectedPin(index);
                }
              }}
            >
              <View style={[styles.pinIconBox, isSelected && styles.pinIconBoxSelected]}>
                <SymbolView 
                  name={point.icon as any} 
                  size={14} 
                  tintColor={isSelected ? '#fff' : '#4f46e5'} 
                />
              </View>
              {isSelected && (
                <Pressable 
                  style={styles.pinBubble}
                  onPress={() => router.push({
                    pathname: '/chi-tiet-dia-diem',
                    params: {
                      name: point.name,
                      type: point.type,
                      distance: point.distance,
                      hours: point.hours,
                      image: point.image,
                    }
                  })}
                >
                  <Text style={styles.pinBubbleText} numberOfLines={1}>{point.name} ›</Text>
                </Pressable>
              )}
            </Pressable>
          );
        })}

        {/* Floating Layers Button */}
        <View style={styles.mapFabGroup}>
          <Pressable 
            style={styles.fabBtn}
            onPress={() => Alert.alert('Lớp bản đồ', 'Đã chuyển sang chế độ bản đồ vệ tinh')}
          >
            <SymbolView name="square.3.layers.3d" size={18} tintColor="#1e293b" />
          </Pressable>
          <Pressable 
            style={styles.fabBtn}
            onPress={() => Alert.alert('Định vị', 'Vị trí hiện tại: Trung tâm TP. Tây Ninh')}
          >
            <SymbolView name="location.north.line.fill" size={18} tintColor="#4f46e5" />
          </Pressable>
        </View>
      </View>

      {/* Bottom Sheet Location Cards */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Địa điểm xung quanh bạn</Text>
          <Text style={styles.sheetCount}>{filteredPoints.length} điểm gần đây</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardScroll}>
          {filteredPoints.map((point, index) => {
            const isSelected = selectedPin === index;
            return (
              <Pressable 
                key={index} 
                style={[styles.pointCard, isSelected && styles.pointCardSelected]}
                onPress={() => {
                  setSelectedPin(index);
                  router.push({
                    pathname: '/chi-tiet-dia-diem',
                    params: {
                      name: point.name,
                      type: point.type,
                      distance: point.distance,
                      hours: point.hours,
                      image: point.image,
                    }
                  });
                }}
              >
                <Image source={{ uri: point.image }} style={styles.pointImage} />
                <View style={styles.pointInfo}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{point.type}</Text>
                  </View>
                  <Text style={styles.pointName} numberOfLines={1}>{point.name}</Text>
                  <Text style={styles.pointDistance}>Cách bạn {point.distance}</Text>
                  <Text style={styles.pointHours} numberOfLines={1}>⏰ {point.hours}</Text>
                  
                  <View style={styles.navBtn}>
                    <SymbolView name="arrow.triangle.turn.up.right.diamond.fill" size={14} tintColor="#fff" />
                    <Text style={styles.navBtnText}>Xem chi tiết</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
          <GlobalFooter />
      </ScrollView>
      </View>
    </View>
  );
}

const MAP_POINTS = [
  {
    name: 'KDL Quốc Gia Núi Bà Đen',
    type: 'Tham quan',
    icon: 'mountain.2.fill',
    distance: '3.2 km',
    hours: '06:00 - 21:00',
    top: '32%',
    left: '42%',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Tòa Thánh Tây Ninh',
    type: 'Tham quan',
    icon: 'building.columns.fill',
    distance: '1.5 km',
    hours: '06:00 - 20:00',
    top: '55%',
    left: '60%',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Bò Tơ Năm Sánh Tây Ninh',
    type: 'Ẩm thực',
    icon: 'fork.knife',
    distance: '850 m',
    hours: '09:00 - 22:00',
    top: '65%',
    left: '25%',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Mekong Tani Hotel 4 Sao',
    type: 'Khách sạn',
    icon: 'bed.double.fill',
    distance: '1.2 km',
    hours: 'Mở cửa 24/7',
    top: '40%',
    left: '70%',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Cây xăng Petrolimex Số 1',
    type: 'Tiện ích',
    icon: 'fuelpump.fill',
    distance: '400 m',
    hours: 'Mở cửa 24/7',
    top: '75%',
    left: '48%',
    image: 'https://images.unsplash.com/photo-1527018607616-05266a14c452?auto=format&fit=crop&w=400&q=80',
  }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },

  searchOverlay: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    zIndex: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, marginHorizontal: 8, fontSize: 13, color: '#0f172a' },
  gpsBtn: { padding: 4 },
  filterPills: { gap: 8, marginTop: 10 },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, backgroundColor: '#f1f5f9' },
  pillActive: { backgroundColor: '#4f46e5' },
  pillText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  pillTextActive: { color: '#fff' },

  mapCanvas: { flex: 1, position: 'relative', overflow: 'hidden' },
  mapBgImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  mapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.1)' },

  mapPin: { position: 'absolute', alignItems: 'center' },
  mapPinSelected: { zIndex: 30 },
  pinIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  pinIconBoxSelected: { backgroundColor: '#4f46e5', borderColor: '#fff' },
  pinBubble: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  pinBubbleText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  mapFabGroup: { position: 'absolute', right: 16, top: 16, gap: 10 },
  fabBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#cbd5e1', borderRadius: 2, alignSelf: 'center', marginBottom: 10 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sheetCount: { fontSize: 12, color: '#64748b' },
  cardScroll: { paddingHorizontal: 16, gap: 12 },
  pointCard: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pointCardSelected: { borderColor: '#4f46e5', borderWidth: 2 },
  pointImage: { height: 110, width: '100%' },
  pointInfo: { padding: 10 },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: '#eef2ff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  typeBadgeText: { color: '#4f46e5', fontSize: 10, fontWeight: 'bold' },
  pointName: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  pointDistance: { fontSize: 11, color: '#00897b', fontWeight: '600', marginBottom: 2 },
  pointHours: { fontSize: 10, color: '#64748b', marginBottom: 8 },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  navBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
