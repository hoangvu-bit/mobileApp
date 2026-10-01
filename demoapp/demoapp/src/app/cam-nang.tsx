import GlobalFooter from '../components/global-footer';
import React, { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function CamNangScreen() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');

  const filteredArticles = selectedTopic === 'Tất cả'
    ? ARTICLES
    : ARTICLES.filter(a => a.topic === selectedTopic);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=84' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <SymbolView name="book.fill" size={14} tintColor="#fbcfe8" />
              <Text style={styles.badgeText}>Bí kíp vi vu</Text>
            </View>
            <Text style={styles.heroTitle}>Kinh nghiệm thực tế từ những chuyến đi</Text>
            <Text style={styles.heroSubtitle}>
              Cập nhật lịch trình mẫu, mẹo tiết kiệm chi phí, địa điểm check-in mới và danh sách quán ăn ngon chuẩn bản địa.
            </Text>

            {/* Search Input */}
            <View style={styles.searchForm}>
              <SymbolView name="magnifyingglass" size={18} tintColor="#db2777" />
              <TextInput 
                placeholder="Tìm bài viết, địa điểm, mẹo vặt..." 
                style={styles.searchInput}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>

        {/* Topic Filters */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {['Tất cả', 'Kinh nghiệm', 'Lịch trình', 'Ẩm thực', 'Check-in'].map((topic, idx) => {
              const active = selectedTopic === topic;
              return (
                <Pressable 
                  key={idx} 
                  style={[styles.filterTab, active && styles.filterTabActive]}
                  onPress={() => setSelectedTopic(topic)}
                >
                  <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
                    {topic}
                  </Text>
                </Pressable>
              );
            })}
      </ScrollView>
        </View>

        {/* Article List */}
        <View style={styles.listSection}>
          <Text style={styles.listSubTitle}>BÀI VIẾT NỔI BẬT</Text>
          <Text style={styles.listTitle}>Đọc nhiều nhất tuần qua</Text>

          <View style={styles.articleGrid}>
            {filteredArticles.map((article, idx) => (
              <Pressable 
                key={idx} 
                style={styles.articleCard}
                onPress={() => router.push({
                  pathname: '/chi-tiet-bai-viet',
                  params: {
                    title: article.title,
                    topic: article.topic,
                    readTime: article.readTime,
                    views: article.views,
                    author: article.author,
                    summary: article.summary,
                    image: article.image,
                  }
                })}
              >
                <Image source={{ uri: article.image }} style={styles.articleImage} />
                <View style={styles.articleContent}>
                  <View style={styles.articleMeta}>
                    <View style={styles.topicBadge}>
                      <Text style={styles.topicBadgeText}>{article.topic}</Text>
                    </View>
                    <Text style={styles.readTimeText}>{article.readTime}</Text>
                  </View>

                  <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                  <Text style={styles.articleSummary} numberOfLines={2}>{article.summary}</Text>

                  <View style={styles.articleFooter}>
                    <View style={styles.authorRow}>
                      <SymbolView name="person.circle.fill" size={14} tintColor="#94a3b8" />
                      <Text style={styles.authorText}>{article.author}</Text>
                    </View>
                    <View style={styles.viewsRow}>
                      <SymbolView name="eye.fill" size={12} tintColor="#94a3b8" />
                      <Text style={styles.viewsText}>{article.views}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <GlobalFooter />
      </ScrollView>
    </View>
  );
}

const ARTICLES = [
  {
    title: 'Kinh nghiệm du lịch Tây Ninh 2N1Đ tự túc chi tiết từ A-Z',
    topic: 'Kinh nghiệm',
    readTime: '5 phút đọc',
    views: '12.4k',
    author: 'Minh Anh',
    summary: 'Tổng hợp chi phí xe Limousine, vé cáp treo Sun World núi Bà Đen, khách sạn lưu trú và các quán bò tơ ngon nhất.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Top 10 quán cà phê săn mây ngắm bình minh đẹp nhất Đà Lạt',
    topic: 'Check-in',
    readTime: '4 phút đọc',
    views: '18.9k',
    author: 'Hải Đăng',
    summary: 'Danh sách các quán cà phê view thung lũng thông mộng mơ tại đồi Cầu Đất, đèo Mimosa có góc chụp hình triệu like.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Đi Phú Quốc mùa nào đẹp nhất? Lịch trình và mẹo săn deal vé',
    topic: 'Lịch trình',
    readTime: '6 phút đọc',
    views: '9.8k',
    author: 'Thu Thảo',
    summary: 'Kinh nghiệm phân biệt mùa mưa - mùa khô, cách đặt combo cano 4 đảo giá rẻ và khách sạn sát biển Bãi Trường.',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: '15 món ăn đặc sản miền Tây sông nước nhất định phải thử',
    topic: 'Ẩm thực',
    readTime: '4 phút đọc',
    views: '15.2k',
    author: 'Hoàng Long',
    summary: 'Từ lẩu mắm đậm đà, cá lóc nướng trui cuốn lá sen non đến bánh xèo củ hủ dừa giòn rụm tại các miệt vườn.',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Chinh phục đỉnh núi Bà Đen: Cung đường nào an toàn cho người mới?',
    topic: 'Kinh nghiệm',
    readTime: '7 phút đọc',
    views: '8.3k',
    author: 'Việt Hùng',
    summary: 'So sánh chi tiết giữa đường Chùa, đường Cột Điện và đường Ống Nước để lựa chọn hành trình trekking phù hợp thể lực.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf7f9' },
  scrollContent: { paddingBottom: 80 },

  heroSection: { height: 320, position: 'relative' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(80, 7, 36, 0.82)', padding: 20, justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, gap: 6, marginBottom: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8, lineHeight: 30 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 16, lineHeight: 18 },

  searchForm: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '600', color: '#0f172a', marginLeft: 8 },

  filterSection: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#fce7f3' },
  filterTab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fdf2f8', marginRight: 8 },
  filterTabActive: { backgroundColor: '#db2777' },
  filterTabText: { fontSize: 12, fontWeight: '700', color: '#be185d' },
  filterTabTextActive: { color: '#fff' },

  listSection: { padding: 16, paddingTop: 16 },
  listSubTitle: { fontSize: 11, fontWeight: '900', color: '#db2777', letterSpacing: 0.5, marginBottom: 4 },
  listTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 16 },

  articleGrid: { gap: 16 },
  articleCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#fce7f3', shadowColor: '#db2777', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  articleImage: { width: '100%', height: 170 },
  articleContent: { padding: 14 },
  articleMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  topicBadge: { backgroundColor: '#fdf2f8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  topicBadgeText: { color: '#db2777', fontSize: 10, fontWeight: 'bold' },
  readTimeText: { fontSize: 11, color: '#94a3b8' },
  articleTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 6, lineHeight: 22 },
  articleSummary: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },

  articleFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f8fafc', paddingTop: 8 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  authorText: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  viewsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewsText: { fontSize: 11, color: '#94a3b8' },
});
