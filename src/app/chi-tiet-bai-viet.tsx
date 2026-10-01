import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChiTietBaiVietScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title?: string;
    topic?: string;
    readTime?: string;
    views?: string;
    author?: string;
    summary?: string;
    image?: string;
  }>();

  const title = params.title || 'Kinh nghiệm du lịch Tây Ninh 2N1Đ tự túc chi tiết từ A-Z';
  const topic = params.topic || 'Kinh nghiệm';
  const readTime = params.readTime || '5 phút đọc';
  const views = params.views || '12.4k';
  const author = params.author || 'Minh Anh';
  const summary = params.summary || 'Tổng hợp chi phí xe Limousine, vé cáp treo Sun World núi Bà Đen, khách sạn lưu trú và các quán bò tơ ngon nhất.';
  const image = params.image || 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80';

  const handleShare = () => {
    Alert.alert('Chia sẻ bài viết', `Đã sao chép liên kết bài viết "${title}" vào bộ nhớ tạm.`);
  };

  return (
    <View style={styles.container}>
      {/* Sub navigation bar */}
      <View style={styles.subBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#db2777" />
          <Text style={styles.backText}>Quay lại cẩm nang</Text>
        </Pressable>
        <Pressable onPress={handleShare} hitSlop={10}>
          <SymbolView name="square.and.arrow.up" size={18} tintColor="#db2777" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: image }} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{topic}</Text>
            </View>
            <Text style={styles.metaText}>⏱ {readTime}</Text>
            <Text style={styles.metaText}>👁 {views} lượt đọc</Text>
          </View>

          <Text style={styles.title}>{title}</Text>

          {/* Author Box */}
          <View style={styles.authorBox}>
            <View style={styles.avatar}>
              <SymbolView name="person.fill" size={16} tintColor="#db2777" />
            </View>
            <View>
              <Text style={styles.authorName}>{author}</Text>
              <Text style={styles.authorRole}>Chuyên gia cẩm nang igovi ⬢ Cập nhật hôm nay</Text>
            </View>
          </View>

          {/* Summary Quote */}
          <View style={styles.leadBox}>
            <Text style={styles.leadText}>&quot;{summary}&quot;</Text>
          </View>

          {/* Article Body */}
          <View style={styles.bodySection}>
            <Text style={styles.h2}>1. Thời điểm lý tưởng nhất để lên đường</Text>
            <Text style={styles.p}>
              Khí hậu tại các điểm đến miền Nam và Tây Ninh chia làm hai mùa mưa - nắng rõ rệt. Khoảng thời gian từ tháng 11 đến tháng 5 năm sau là lúc thời tiết đẹp nhất: nắng ráo chan hòa, trời xanh trong vắt, cực kỳ thuận lợi cho các hoạt động trekking, đi cáp treo ngắm cảnh và săn mây sáng sớm.
            </Text>

            <Text style={styles.h2}>2. Phương tiện di chuyển thuận tiện & tiết kiệm</Text>
            <Text style={styles.p}>
              Nếu xuất phát từ TP.HCM, xe Limousine cao cấp là lựa chọn được ưa chuộng nhất với giá vé chỉ từ 100.000 đ - 140.000 đ / lượt. Xe đưa đón tận nơi, ghế ngả êm ái và có cổng sạc USB tiện dụng. Bạn cũng có thể chọn đi phượt bằng xe máy theo QL22 qua ngã tư An Sương để chủ động ngắm cảnh ven đường.
            </Text>

            {/* Highlighted Tip */}
            <View style={styles.tipCard}>
              <Text style={styles.tipCardTitle}>💡 Lời khuyên từ biên tập viên:</Text>
              <Text style={styles.tipCardText}>
                Nên đặt trước vé cáp treo hoặc combo buffet online trên app igovi để nhận mã QR quét qua cổng trực tiếp, không cần phải xếp hàng chờ đợi tại quầy vé vào giờ cao điểm.
              </Text>
            </View>

            <Text style={styles.h2}>3. Lịch trình gợi ý 2N1Đ chuẩn nhất</Text>
            <Text style={styles.p}>
              ⬢ <Text style={{ fontWeight: 'bold' }}>Ngày 1:</Text> 06:00 khởi hành từ TP.HCM → 07:30 ăn sáng bánh canh Trảng Bàng → 09:00 chinh phục đỉnh núi Bà Đen bằng cáp treo Vân Sơn → 12:00 ăn trưa buffet → 14:00 nhận phòng khách sạn → 18:00 tiệc bò tơ nướng than hoa.{"\n\n"}
              ⬢ <Text style={{ fontWeight: 'bold' }}>Ngày 2:</Text> 07:00 ăn sáng → 08:30 tham quan Tòa Thánh Tây Ninh → 11:00 check-out, mua muối tôm và bánh tráng phơi sương → 14:00 khởi hành về lại TP.HCM.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fdf2f8',
    borderBottomWidth: 1,
    borderBottomColor: '#fbcfe8',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, fontWeight: '700', color: '#db2777' },

  scrollContent: { paddingBottom: 60 },
  heroImage: { width: '100%', height: 220 },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  badge: { backgroundColor: '#fdf2f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#db2777', fontSize: 11, fontWeight: 'bold' },
  metaText: { fontSize: 12, color: '#94a3b8' },
  title: { fontSize: 20, fontWeight: 'bold', lineHeight: 28, color: '#0f172a', marginBottom: 16 },

  authorBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, marginBottom: 20 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fdf2f8', justifyContent: 'center', alignItems: 'center' },
  authorName: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  authorRole: { fontSize: 11, color: '#64748b' },

  leadBox: { borderLeftWidth: 4, borderLeftColor: '#db2777', paddingLeft: 14, marginVertical: 14 },
  leadText: { fontSize: 14, fontStyle: 'italic', color: '#475569', lineHeight: 22 },

  bodySection: { marginTop: 10 },
  h2: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginTop: 16, marginBottom: 8 },
  p: { fontSize: 14, color: '#334155', lineHeight: 22, marginBottom: 12 },

  tipCard: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fef3c7', borderRadius: 12, padding: 14, marginVertical: 14 },
  tipCardTitle: { fontSize: 13, fontWeight: 'bold', color: '#b45309', marginBottom: 4 },
  tipCardText: { fontSize: 13, color: '#92400e', lineHeight: 20 },
});
