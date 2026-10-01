import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Keyboard,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { matchVietnameseSearch } from '../utils/vietnamese';

export interface CulinaryItem {
  id: string;
  name: string;
  restaurantName: string;
  location: string;
  province: string;
  address: string;
  openHours: string;
  phone: string;
  price: string;
  priceNum: number;
  rating: number;
  reviewCount: number;
  desc: string;
  longDesc: string;
  flavorHighlights: string[];
  recommendedMenu: { name: string; price: string }[];
  tag: string;
  categories: string[];
  image: string;
  gallery: string[];
  diningTips: string[];
  featureHighlight?: string;
}

const DINING_NEEDS = [
  'Tất cả nhu cầu',
  'Ăn sáng',
  'Ăn gia đình',
  'Cuối tuần',
  'Đặc sản',
  'Hải sản',
  'Ăn vặt & Tối',
];

const PROVINCE_TAGS = [
  'Tất cả tỉnh',
  'Tây Ninh',
  'Đà Lạt',
  'Huế',
  'Nha Trang',
  'Đà Nẵng',
  'Cần Thơ',
  'Vũng Tàu',
  'Phú Quốc',
  'Ninh Bình',
  'Hà Nội',
  'Sa Pa',
];

const POPULAR_CUISINE_SUGGESTIONS = [
  { id: 's-bctb', title: 'Bánh canh Trảng Bàng', subtitle: 'Hoàng Minh - Trảng Bàng, Tây Ninh', tag: 'Tây Ninh' },
  { id: 's-boto', title: 'Bò Tơ Năm Sánh', subtitle: 'Bò tơ nướng y & lẩu đuôi bò Tây Ninh', tag: 'Tây Ninh' },
  { id: 's-bunbo', title: 'Bún bò Huế O Cương', subtitle: 'Nước dùng mắm ruốc, chả cua chuẩn vị cố đô', tag: 'Huế' },
  { id: 's-lauga', title: 'Lẩu gà lá é Tao Ngộ', subtitle: 'Lá é the mát, thịt gà thả đồi Đà Lạt', tag: 'Đà Lạt' },
  { id: 's-nemnuong', title: 'Nem nướng Ninh Hòa', subtitle: 'Đặng Văn Quyên - Nha Trang, Khánh Hòa', tag: 'Nha Trang' },
  { id: 's-miquang', title: 'Mì Quảng Bếp Trang', subtitle: 'Mì Quảng ếch thố đá & Bánh tráng thịt heo', tag: 'Đà Nẵng' },
  { id: 's-banhkhot', title: 'Bánh khọt Cô Ba Vũng Tàu', subtitle: 'Bánh khọt tôm tươi giòn rụm bên bờ biển', tag: 'Vũng Tàu' },
  { id: 's-bunquay', title: 'Bún quậy Kiến Xây', subtitle: 'Chả cá chả mực quậy tươi rói Phú Quốc', tag: 'Phú Quốc' },
];

export const CULINARY_ITEMS: CulinaryItem[] = [
  // 1. Bánh canh Trảng Bàng - Tây Ninh (Featured Spotlight Card)
  {
    id: 'banh-canh-trang-bang',
    name: 'Bánh Canh Trảng Bàng Hoàng Minh',
    restaurantName: 'Bánh Canh Trảng Bàng Hoàng Minh',
    location: 'Trảng Bàng, Tây Ninh',
    province: 'Tây Ninh',
    address: '38 Quốc Lộ 22, Thị xã Trảng Bàng, Tây Ninh',
    openHours: '06:00 - 21:30 hàng ngày',
    phone: '0276 3880 120',
    price: '50.000đ - 80.000đ / tô',
    priceNum: 50000,
    rating: 4.9,
    reviewCount: 1240,
    desc: 'Sợi bánh canh bột gạo dai mềm thơm lừng mùi gạo nàng thơm, nước dùng ninh xương ngọt thanh trong vắt ăn kèm đĩa thịt luộc và rau rừng.',
    longDesc: 'Bánh canh Trảng Bàng là niềm tự hào ẩm thực Tây Ninh. Bột bánh được làm từ gạo nàng thơm phơi sương tạo độ dẻo dai đặc trưng. Ăn kèm đĩa thịt bắp giò heo luộc cuốn bánh tráng phơi sương và rổ rau rừng hơn 10 vị thuốc Nam tươi non.',
    flavorHighlights: [
      'Nước dùng ninh từ xương ống heo hơn 6 tiếng, trong veo và ngọt hậu thanh khiết',
      'Sợi bánh canh trắng ngần, dẻo dai mềm mại làm từ gạo nàng thơm',
      'Đĩa thịt bắp giò heo cắt lát mỏng cuốn bánh tráng phơi sương chấm nước mắm tiêu',
      'Kèm đĩa rau rừng Tây Ninh tươi rói: lá cóc, quế vị, sao nhái, đọt choại',
    ],
    recommendedMenu: [
      { name: 'Tô bánh canh giò nạc đặc biệt', price: '65.000đ' },
      { name: 'Bánh canh thịt bắp giò khoanh', price: '55.000đ' },
      { name: 'Đĩa thịt luộc cuốn bánh tráng rau rừng', price: '120.000đ' },
      { name: 'Nước mía sầu riêng nguyên chất', price: '20.000đ' },
    ],
    tag: 'Đặc sản trứ danh',
    featureHighlight: '• Nước dùng ninh xương & 10 loại rau rừng',
    categories: ['Ăn sáng', 'Đặc sản địa phương', 'Ăn gia đình', 'Đặc sản'],
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80',
    ],
    diningTips: [
      'Quán bán cả ngày từ 6h sáng, rất đông vào khung giờ sáng 7h-8h30 và trưa 11h30-13h.',
      'Nên gọi thêm phần bánh tráng phơi sương và đĩa rau rừng để trải nghiệm trọn vẹn vị Tây Ninh.',
    ],
  },

  // 2. Bò Tơ Tây Ninh Năm Sánh
  {
    id: 'bo-to-tay-ninh',
    name: 'Bò Tơ Năm Sánh 17 - Tây Ninh',
    restaurantName: 'Bò Tơ Năm Sánh 17 (Cơ sở chính)',
    location: 'Hiệp Tân, Hòa Thành, Tây Ninh',
    province: 'Tây Ninh',
    address: 'QL22B, Xã Hiệp Tân, Thị xã Hòa Thành, Tây Ninh',
    openHours: '08:30 - 22:30 hàng ngày',
    phone: '0913 888 777',
    price: '120.000đ - 350.000đ / món',
    priceNum: 120000,
    rating: 4.8,
    reviewCount: 2350,
    desc: 'Bò tơ non nướng than hoa thơm lừng, thịt mềm ngọt mọng nước, da nướng giòn sần sật cuốn rau rừng chấm mắm nêm đậm vị.',
    longDesc: 'Bò tơ Năm Sánh là thương hiệu nổi danh khắp miền Nam. Thịt bò được tuyển chọn từ những con bê non thả đồi Tây Ninh khoảng 5-6 tháng tuổi nên thịt mềm ngọt, da mỏng giòn và không có mùi gây.',
    flavorHighlights: [
      'Thịt bò tơ non mềm ngọt tự nhiên, nướng xèo xèo trên than hồng rực lửa',
      'Bò lụi sả cay the chấm chao sa tế hoặc mắm nêm thơm nồng',
      'Lẩu đuôi bò hầm sâm bố chính ngọt mát, bổ dưỡng',
      'Ăn kèm hơn 10 loại rau rừng Tây Ninh tươi rói và bánh phở cuốn',
    ],
    recommendedMenu: [
      { name: 'Bò tơ nướng y chấm muối ớt đỏ', price: '180.000đ' },
      { name: 'Bò lụi sả nướng than hoa', price: '160.000đ' },
      { name: 'Bò tơ nhúng giấm cuốn bánh tráng', price: '190.000đ' },
      { name: 'Lẩu xí quách & đuôi bò tơ', price: '280.000đ' },
    ],
    tag: 'Đặc sản nướng',
    featureHighlight: '• Bò tơ mềm ngọt & Bánh tráng phơi sương',
    categories: ['Ăn gia đình', 'Cuối tuần', 'Đặc sản'],
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: [
      'Không gian sân vườn rộng rãi, bãi đỗ xe ô tô thoải mái.',
      'Đi nhóm từ 4-6 người là lý tưởng nhất để gọi được nhiều món nướng và lẩu.',
    ],
  },

  // 3. Lẩu gà lá é & Bánh ướt lòng gà - Đà Lạt
  {
    id: 'lau-ga-la-e-da-lat',
    name: 'Lẩu Gà Lá É Tao Ngộ & Nem Nướng',
    restaurantName: 'Lẩu Gà Lá É Tao Ngộ Quán',
    location: 'Khu Hòa Bình, P.1, TP. Đà Lạt',
    province: 'Đà Lạt',
    address: 'Số 5 Đường 3 Tháng 4, Phường 3, TP. Đà Lạt',
    openHours: '09:00 - 22:00 hàng ngày',
    phone: '0977 111 222',
    price: '65.000đ - 250.000đ / nồi',
    priceNum: 65000,
    rating: 4.7,
    reviewCount: 1890,
    desc: 'Lẩu gà ta lá é the cay sảng khoái giữa tiết trời se lạnh Đà Lạt, thịt gà đồi săn chắc và nấm sò giòn ngọt.',
    longDesc: 'Thưởng thức nồi lẩu gà lá é bốc khói nghi ngút trong không khí se lạnh của phố núi Đà Lạt là trải nghiệm ẩm thực không thể bỏ qua. Nước lẩu có vị chua thanh dịu ngọt, cay the thơm nồng từ lá é tươi và ớt hiểm xanh.',
    flavorHighlights: [
      'Lá é tươi non hái tại vườn đồi Đà Lạt có vị the cay thơm mát đặc trưng',
      'Thịt gà đồi thả vườn da vàng giòn, thịt chắc ngọt không bị bở',
      'Nước lẩu thanh ngọt tự nhiên ninh từ xương gà và măng giòn',
    ],
    recommendedMenu: [
      { name: 'Nồi lẩu gà lá é vừa (2-3 người)', price: '250.000đ' },
      { name: 'Nồi lẩu gà lá é lớn (4-5 người)', price: '350.000đ' },
      { name: 'Bánh ướt lòng gà xé phay', price: '45.000đ' },
      { name: 'Sữa đậu nành nóng nguyên chất', price: '15.000đ' },
    ],
    tag: 'Ăn vặt & Tối',
    featureHighlight: '• Rau củ tươi sạch & Lẩu gà lá é',
    categories: ['Cuối tuần', 'Ăn gia đình', 'Ăn vặt & Tối'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: [
      'Buổi tối quán rất đông khách, nên đến trước 18h30 hoặc đặt bàn trước.',
      'Nhúng lá é vừa chín tới để giữ trọn vị thơm giòn the cay.',
    ],
  },

  // 4. Bún Bò Huế O Cương
  {
    id: 'bun-bo-hue-o-cuong',
    name: 'Bún Bò Huế O Cương Gia Truyền',
    restaurantName: 'Bún Bò Huế O Cương',
    location: 'TP. Huế, Thừa Thiên Huế',
    province: 'Huế',
    address: '6 Trần Thúc Nhẫn, Vĩnh Ninh, TP. Huế',
    openHours: '06:00 - 11:30 sáng hàng ngày',
    phone: '0905 123 456',
    price: '45.000đ - 70.000đ / tô',
    priceNum: 45000,
    rating: 4.9,
    reviewCount: 1560,
    desc: 'Bún bò chuẩn vị cố đô với nước dùng thơm lừng mắm ruốc Huế, sả cây, ớt sa tế cay nồng, chả cua quết tươi và bắp bò giòn rụm.',
    longDesc: 'Quán bún bò O Cương là điểm đến yêu thích của người dân xứ Huế. Nước dùng được hầm kỳ công từ xương ống bò và mắm ruốc ngấu mùi, tạo nên sắc nước đỏ cam sóng sánh và vị ngọt đậm đà khó quên.',
    flavorHighlights: [
      'Mùi thơm nồng nàn quyến rũ từ mắm ruốc Huế và sả cây đập dập',
      'Chả cua Huế tự làm tươi giòn, ngọt bùi đậm đà',
      'Sợi bún to mềm mượt, thịt nạm bắp bò giòn sần sật',
    ],
    recommendedMenu: [
      { name: 'Tô bún bò thập cẩm đặc biệt', price: '65.000đ' },
      { name: 'Bún bắp bò gân giòn', price: '50.000đ' },
      { name: 'Chả cua & huyết tươi thêm', price: '20.000đ' },
    ],
    tag: 'Đậm đà Cố Đô',
    featureHighlight: '• Nước dùng mắm ruốc & Chả cua quết tươi',
    categories: ['Ăn sáng', 'Đặc sản', 'Đặc sản địa phương'],
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: ['Quán chỉ bán buổi sáng và thường hết sớm trước 10h30.'],
  },

  // 5. Nem nướng Ninh Hòa & Bún cá dầm Nha Trang
  {
    id: 'nem-nuong-nha-trang',
    name: 'Nem Nướng Đặng Văn Quyên - Nha Trang',
    restaurantName: 'Nem Nướng Đặng Văn Quyên',
    location: 'TP. Nha Trang, Khánh Hòa',
    province: 'Nha Trang',
    address: '16A Lãn Ông, Xương Huân, TP. Nha Trang',
    openHours: '07:30 - 22:00 hàng ngày',
    phone: '0258 3828 070',
    price: '50.000đ - 120.000đ / phần',
    priceNum: 50000,
    rating: 4.8,
    reviewCount: 2100,
    desc: 'Nem nướng xiên que thơm lừng than hồng, bánh tráng chiên giòn rụm, cuốn cùng rau sống và nước chấm tương nếp béo ngậy gia truyền.',
    longDesc: 'Nem nướng Ninh Hòa là món ngon trứ danh vùng biển Nha Trang. Điểm nhấn làm nên linh hồn món ăn là chén nước chấm vàng cam sánh mịn nấu từ nếp dẻo, gan heo, tôm tươi và đậu phộng rang thơm lừng.',
    flavorHighlights: [
      'Nem thịt heo xay ướp nướng than hoa vàng óng thơm ngậy',
      'Bánh tráng cuốn chiên giòn tan rôm rốp',
      'Nước chấm tương nếp nóng hổi béo ngậy ngọt mặn hài hòa',
    ],
    recommendedMenu: [
      { name: 'Phần nem nướng đầy đủ (1 người)', price: '60.000đ' },
      { name: 'Nem chua Ninh Hòa nướng lá chùm ruột', price: '45.000đ' },
      { name: 'Bún cá dầm chả cá thu', price: '45.000đ' },
    ],
    tag: 'Đặc sản biển',
    featureHighlight: '• Nem nướng than hoa & Nước tương nếp gia truyền',
    categories: ['Ăn gia đình', 'Cuối tuần', 'Đặc sản'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: ['Nên cuốn đầy đủ dưa leo, xoài xanh, chuối chát và ram giòn để cảm nhận trọn vẹn vị ngon.'],
  },

  // 6. Mì Quảng ếch & Bánh tráng cuốn thịt heo - Đà Nẵng
  {
    id: 'mi-quang-da-nang',
    name: 'Mì Quảng Bếp Trang - Đà Nẵng',
    restaurantName: 'Mì Quảng Ếch Bếp Trang',
    location: 'Hải Châu, TP. Đà Nẵng',
    province: 'Đà Nẵng',
    address: '441 Ông Ích Khiêm, Nam Dương, Hải Châu, Đà Nẵng',
    openHours: '07:00 - 22:00 hàng ngày',
    phone: '0905 555 888',
    price: '45.000đ - 95.000đ / món',
    priceNum: 45000,
    rating: 4.8,
    reviewCount: 1780,
    desc: 'Mì Quảng ếch om sả nghệ thơm lừng dọn trên mẹt tre lá chuối độc đáo, sợi mì vàng óng ăn kèm bánh tráng mè nướng giòn.',
    longDesc: 'Bếp Trang nâng tầm món Mì Quảng truyền thống xứ Quảng thành nghệ thuật ẩm thực tinh tế. Mì Quảng ếch được phục vụ trên mẹt lá chuối với thố ếch đồng om nghệ vàng ruộm bốc khói nghi ngút.',
    flavorHighlights: [
      'Thịt ếch đồng săn chắc om nghệ tươi và sả đập dập thơm lừng',
      'Sợi mì gạo nguyên chất mềm dai hòa cùng đậu phộng rang giòn',
      'Bánh tráng cuốn thịt heo 2 đầu da chấm mắm nêm đậm vị',
    ],
    recommendedMenu: [
      { name: 'Mì Quảng ếch thố đá đặc biệt', price: '69.000đ' },
      { name: 'Mì Quảng tôm thịt truyền thống', price: '49.000đ' },
      { name: 'Bánh tráng cuốn thịt heo 2 đầu da', price: '95.000đ' },
    ],
    tag: 'Đặc sản miền Trung',
    featureHighlight: '• Thịt heo 2 đầu da & Mì Quảng thố đá',
    categories: ['Ăn sáng', 'Ăn gia đình', 'Đặc sản'],
    image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: ['Bẻ vụn bánh tráng mè nướng vào tô mì và trộn đều với rau sống bắp chuối.'],
  },

  // 7. Bánh khọt Cô Ba Vũng Tàu
  {
    id: 'banh-khot-vung-tau',
    name: 'Bánh Khọt Cô Ba Vũng Tàu',
    restaurantName: 'Bánh Khọt Cô Ba Vũng Tàu',
    location: 'Bãi Trước, TP. Vũng Tàu',
    province: 'Vũng Tàu',
    address: '01 Hoàng Hoa Thám, Phường 3, TP. Vũng Tàu',
    openHours: '07:00 - 22:00 hàng ngày',
    phone: '0254 3526 165',
    price: '60.000đ - 120.000đ / dĩa',
    priceNum: 60000,
    rating: 4.8,
    reviewCount: 2600,
    desc: 'Bánh khọt tôm tươi vàng ruộm giòn tan rắc mỡ hành và bột tôm chấy, cuốn rau cải xanh chấm nước mắm đu đủ chua ngọt.',
    longDesc: 'Quán Cô Ba là địa chỉ thưởng thức bánh khọt nổi tiếng nhất Vũng Tàu với không gian hoài cổ rộng rãi bên bờ biển. Chiếc bánh được đổ trên khuôn đất nung xèo xèo giòn rụm bên ngoài nhưng bên trong mềm béo.',
    flavorHighlights: [
      'Vỏ bánh giòn rụm màu vàng nghệ, thơm béo nước cốt dừa',
      'Tôm biển tươi roi rói ngọt thịt đặt giữa nhân bánh',
      'Rổ rau sống tươi xanh ngút ngàn ăn kèm đu đủ ngâm chua giòn',
    ],
    recommendedMenu: [
      { name: 'Dĩa bánh khọt tôm tươi đặc biệt (8 cái)', price: '75.000đ' },
      { name: 'Bánh khọt mực sữa tươi', price: '80.000đ' },
      { name: 'Lẩu cá đuối măng chua', price: '220.000đ' },
    ],
    tag: 'Hải sản & Ăn vặt',
    featureHighlight: '• Tôm tươi biển & Nước mắm chua ngọt',
    categories: ['Ăn sáng', 'Cuối tuần', 'Ăn gia đình'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: ['Cuộn tròn bánh khọt với lá cải xanh, xà lách, rau thơm rồi chấm ngập trong chén nước mắm.'],
  },

  // 8. Bún quậy Kiến Xây Phú Quốc
  {
    id: 'bun-quay-phu-quoc',
    name: 'Bún Quậy Kiến Xây - Phú Quốc',
    restaurantName: 'Bún Quậy Kiến Xây (Chi nhánh Bạch Đằng)',
    location: 'Dương Đông, TP. Phú Quốc',
    province: 'Phú Quốc',
    address: '28 Đường Bạch Đằng, Phường Dương Đông, Phú Quốc',
    openHours: '06:30 - 23:00 hàng ngày',
    phone: '0297 3999 888',
    price: '55.000đ - 85.000đ / tô',
    priceNum: 55000,
    rating: 4.9,
    reviewCount: 3400,
    desc: 'Tự tay pha chén nước chấm muối tắc theo khẩu vị, thưởng thức sợi bún tươi ép tại chỗ và chả tôm mực quậy chín tái bằng nước lèo sôi sục.',
    longDesc: 'Bún quậy Kiến Xây là trải nghiệm ẩm thực độc nhất vô nhị chỉ có tại đảo ngọc Phú Quốc. Chả cá trích, chả tôm tươi được quậy nhuyễn vào đáy tô rồi chan nước luộc bún sôi 100°C làm chín ngọt tự nhiên.',
    flavorHighlights: [
      'Chả tôm, chả mực tươi rói quết dai ngọt tự nhiên không chất bảo quản',
      'Sợi bún tươi ép từ cối bột gạo và luộc trực tiếp tại quầy',
      'Nước chấm tự pha với muối ớt, tắc và đường theo công thức riêng',
    ],
    recommendedMenu: [
      { name: 'Tô bún quậy đặc biệt tôm mực chả cá', price: '75.000đ' },
      { name: 'Tô bún quậy bò tôm mực', price: '85.000đ' },
      { name: 'Nước mía tắc Phú Quốc', price: '15.000đ' },
    ],
    tag: 'Đặc sản đảo ngọc',
    featureHighlight: '• Chả tôm mực tươi quậy tại chỗ & Nước chấm tự pha',
    categories: ['Ăn sáng', 'Ăn vặt & Tối', 'Đặc sản'],
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: ['Nhớ quậy đều chén nước chấm cho đến khi sủi bọt trắng sánh mịn trước khi chan vào tô.'],
  },

  // 9. Dê núi 7 món & Cơm cháy Ninh Bình
  {
    id: 'de-nui-ninh-binh',
    name: 'Nhà Hàng Dê Núi Đức Dê - Ninh Bình',
    restaurantName: 'Nhà Hàng Đức Dê Ninh Bình',
    location: 'Hoa Lư, Ninh Bình',
    province: 'Ninh Bình',
    address: 'Số 29 Đoàn Kết, Phường Ninh Phong, TP. Ninh Bình',
    openHours: '08:00 - 22:00 hàng ngày',
    phone: '0229 3874 858',
    price: '120.000đ - 300.000đ / món',
    priceNum: 120000,
    rating: 4.8,
    reviewCount: 1950,
    desc: 'Thịt dê núi đá vôi săn chắc ít mỡ, dê tái chanh thơm nồng sả ớt, cơm cháy vàng giòn rưới nước sốt tim cật dê béo ngậy.',
    longDesc: 'Dê núi Ninh Bình được chăn thả tự nhiên trên các vách núi đá vôi ăn lá thuốc quý nên thịt rất săn chắc và thơm ngọt. Cơm cháy giòn rụm chấm nước sốt dê đậm đà là cặp đôi ẩm thực hoàn hảo.',
    flavorHighlights: [
      'Thịt dê núi tái chanh tươi mềm bóp vừng thơm lừng ăn kèm chuối xanh',
      'Dê nướng mọi than hoa giữ nguyên vị ngọt đậm tự nhiên',
      'Cơm cháy gạo tám thơm chiên giòn tan chấm sốt dê béo bùi',
    ],
    recommendedMenu: [
      { name: 'Dê tái chanh chấm tương gừng', price: '180.000đ' },
      { name: 'Dê xào lăn sả ớt nước cốt dừa', price: '170.000đ' },
      { name: 'Cơm cháy sốt tim cật dê', price: '120.000đ' },
      { name: 'Lẩu dê núi hầm thuốc bắc', price: '350.000đ' },
    ],
    tag: 'Đặc sản núi non',
    featureHighlight: '• Dê tái chanh & Cơm cháy giòn rụm',
    categories: ['Ăn gia đình', 'Cuối tuần', 'Đặc sản'],
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: ['Chấm thịt dê với tương bần Hưng Yên giã thêm gừng cay và ớt tươi để đúng điệu Bắc Bộ.'],
  },

  // 10. Cá lóc nướng trui & Lẩu mắm Cần Thơ
  {
    id: 'lau-mam-can-tho',
    name: 'Ẩm Thực Đồng Quê Dạ Lý - Cần Thơ',
    restaurantName: 'Lẩu Mắm Dạ Lý Cần Thơ',
    location: 'Ninh Kiều, TP. Cần Thơ',
    province: 'Cần Thơ',
    address: '89 Đường 3 Tháng 2, Phường Hưng Lợi, Ninh Kiều, Cần Thơ',
    openHours: '10:00 - 22:00 hàng ngày',
    phone: '0292 3838 898',
    price: '80.000đ - 350.000đ / món',
    priceNum: 80000,
    rating: 4.8,
    reviewCount: 2200,
    desc: 'Lẩu mắm cá linh cá sặc thơm nức mũi ăn cùng hơn 20 loại rau đồng cỏ dại miền Tây, cá lóc đồng nướng rơm cuốn bánh tráng.',
    longDesc: 'Dạ Lý được coi là cái nôi ẩm thực lẩu mắm trứ danh đất Tây Đô. Nồi lẩu đậm đà thơm ngát kết hợp hoàn hảo cùng tôm càng xanh, cá basa, cà tím và đĩa rau xanh ngút ngàn với bông điên điển, bông so đũa, kèo nèo.',
    flavorHighlights: [
      'Nước lẩu nấu từ mắm cá linh cá sặc Châu Đốc lọc kỹ ngọt thanh đậm đà',
      'Hơn 20 loại rau đồng miền Tây tươi non theo mùa nước nổi',
      'Cá lóc đồng nướng trui trui rơm thơm lừng cuốn lá sen non',
    ],
    recommendedMenu: [
      { name: 'Nồi lẩu mắm miền Tây đặc biệt', price: '320.000đ' },
      { name: 'Cá lóc nướng trui cuốn bánh tráng', price: '180.000đ' },
      { name: 'Bánh xèo miền Tây củ hủ dừa', price: '65.000đ' },
    ],
    tag: 'Đặc sản sông nước',
    featureHighlight: '• Cá lóc đồng nướng rơm & 20 loại rau đồng',
    categories: ['Ăn gia đình', 'Cuối tuần', 'Đặc sản'],
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    ],
    diningTips: ['Thả rau theo từng đợt để rau giữ được độ giòn ngọt thanh mát.'],
  },
];

export default function AmThucScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedNeed, setSelectedNeed] = useState('Tất cả nhu cầu');
  const [selectedProvince, setSelectedProvince] = useState('Tất cả tỉnh');
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Pagination State (10 items per page)
  const ITEMS_PER_PAGE = 10;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleSearch = () => {
    Keyboard.dismiss();
    setIsSearchFocused(false);
    setAppliedSearch(searchText.trim());
  };

  const handleClear = () => {
    setSearchText('');
    setAppliedSearch('');
    setIsSearchFocused(false);
  };

  const handleSelectNeed = (need: string) => {
    setSelectedNeed(need);
    setSearchText('');
    setAppliedSearch('');
    setIsSearchFocused(false);
  };

  const handleSelectProvince = (prov: string) => {
    setSelectedProvince(prov);
    setSearchText('');
    setAppliedSearch('');
    setIsSearchFocused(false);
  };

  const handleSelectSuggestion = (suggestion: { title: string; tag: string }) => {
    setSelectedProvince(suggestion.tag);
    setSearchText(suggestion.title);
    setAppliedSearch(suggestion.title);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleOpenDish = (dish: CulinaryItem) => {
    router.push({
      pathname: '/chi-tiet-am-thuc',
      params: {
        id: dish.id,
        name: dish.name,
        restaurantName: dish.restaurantName,
        location: dish.location,
        address: dish.address,
        openHours: dish.openHours,
        phone: dish.phone,
        price: dish.price,
        desc: dish.desc,
        tag: dish.tag,
        image: dish.image,
      },
    });
  };

  // Filter search suggestions
  const searchSuggestions = useMemo(() => {
    const q = searchText.trim();
    if (!q) {
      return POPULAR_CUISINE_SUGGESTIONS;
    }
    return POPULAR_CUISINE_SUGGESTIONS.filter(
      (s) => matchVietnameseSearch(s.title, q) || matchVietnameseSearch(s.subtitle, q)
    );
  }, [searchText]);

  // Main filtered dishes
  const filteredDishes = useMemo(() => {
    const activeQ = appliedSearch || searchText;

    return CULINARY_ITEMS.filter((dish) => {
      // Text Search query filter
      if (activeQ.trim()) {
        const matchName = matchVietnameseSearch(dish.name, activeQ);
        const matchRest = matchVietnameseSearch(dish.restaurantName, activeQ);
        const matchLoc = matchVietnameseSearch(dish.location, activeQ);
        const matchDesc = matchVietnameseSearch(dish.desc, activeQ);
        const matchProv = matchVietnameseSearch(dish.province, activeQ);
        if (!matchName && !matchRest && !matchLoc && !matchDesc && !matchProv) {
          return false;
        }
      }

      // Dining Need Filter
      if (selectedNeed !== 'Tất cả nhu cầu' && !activeQ.trim()) {
        const matchCategory = dish.categories.some((cat) => matchVietnameseSearch(cat, selectedNeed));
        const matchTag = matchVietnameseSearch(dish.tag, selectedNeed);
        if (!matchCategory && !matchTag) return false;
      }

      // Province Filter
      if (selectedProvince !== 'Tất cả tỉnh' && !activeQ.trim()) {
        const matchProv =
          matchVietnameseSearch(dish.province, selectedProvince) ||
          matchVietnameseSearch(dish.location, selectedProvince);
        if (!matchProv) return false;
      }

      return true;
    });
  }, [appliedSearch, searchText, selectedNeed, selectedProvince]);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [appliedSearch, selectedNeed, selectedProvince]);

  // Paginated list to render
  const displayedDishes = useMemo(() => {
    return filteredDishes.slice(0, visibleCount);
  }, [filteredDishes, visibleCount]);

  const hasMore = visibleCount < filteredDishes.length;
  const remainingCount = Math.max(0, filteredDishes.length - visibleCount);

  // Big Featured Spotlight Dish (Bánh Canh Trảng Bàng)
  const spotlightDish = CULINARY_ITEMS[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F382C" />

      {/* BEGIN: Top Dark Emerald Header (matching Stitch design) */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 16) }]}>
        
        {/* Top Action Row */}
        <View style={styles.topActionBar}>
          {/* Back Button */}
          <Pressable
            style={styles.headerBlurBtn}
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </Pressable>

          {/* Center Title & Subtitle */}
          <View style={styles.headerCenterTitle}>
            <Text style={styles.headerMainTitle}>Ẩm thực & Đặc sản</Text>
            <View style={styles.headerSubtitleRow}>
              <View style={styles.liveIndicatorDot} />
              <Text style={styles.headerSubtext}>Hương vị nguyên bản vùng miền</Text>
            </View>
          </View>

          {/* Right Header Actions */}
          <View style={styles.headerRightActions}>
            <Pressable
              style={styles.headerBlurBtn}
              onPress={() => setIsSearchFocused(true)}
              hitSlop={6}
              accessibilityLabel="Tìm kiếm nhanh"
            >
              <Ionicons name="search" size={18} color="#ffffff" />
            </Pressable>
            <Pressable
              style={styles.headerBlurBtn}
              onPress={() => {}}
              hitSlop={6}
              accessibilityLabel="Thông báo"
            >
              <Ionicons name="notifications-outline" size={18} color="#ffffff" />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>

        {/* Integrated Search Bar Pill */}
        <View style={styles.headerSearchPill}>
          <Ionicons name="search" size={18} color="#0F382C" style={{ opacity: 0.7, marginLeft: 4 }} />
          <TextInput
            style={styles.headerSearchInput}
            placeholder="Tìm món ngon, bò tơ, bánh canh, bún bò..."
            placeholderTextColor="#94a3b8"
            value={searchText}
            onFocus={() => setIsSearchFocused(true)}
            onChangeText={(val) => {
              setSearchText(val);
              setIsSearchFocused(true);
              if (val === '') {
                setAppliedSearch('');
              }
            }}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          {searchText.length > 0 && (
            <Pressable onPress={handleClear} hitSlop={8} style={{ paddingHorizontal: 6 }}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </Pressable>
          )}

          <Pressable style={styles.headerSearchActionBtn} onPress={handleSearch}>
            <Text style={styles.headerSearchActionBtnText}>Tìm kiếm</Text>
          </Pressable>
        </View>

        {/* Search Suggestions Dropdown Overlay */}
        {isSearchFocused && searchSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsHeaderText}>
                {searchText.trim() ? 'GỢI Ý MÓN NGON' : 'MÓN NGON ĐẶC SẢN NỔI TIẾNG'}
              </Text>
              <Pressable onPress={() => setIsSearchFocused(false)} hitSlop={8}>
                <Ionicons name="close" size={16} color="#64748b" />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="always">
              {searchSuggestions.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <View style={styles.suggestionIconBox}>
                    <Ionicons name="restaurant" size={14} color="#0F382C" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.suggestionSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#cbd5e1" />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

      </View>
      {/* END: Top Dark Emerald Header */}

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* BEGIN: FilterChipsSection (2-Row Filters matching Stitch design) */}
        <View style={styles.filterSection}>
          {/* Row 1: Nhu cầu ăn uống */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {DINING_NEEDS.map((need, idx) => {
              const isActive = selectedNeed === need && !appliedSearch;
              return (
                <Pressable
                  key={idx}
                  style={[styles.needChip, isActive && styles.needChipActive]}
                  onPress={() => handleSelectNeed(need)}
                >
                  <Text style={[styles.needChipText, isActive && styles.needChipTextActive]}>
                    {need}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Row 2: Tỉnh thành & Khu vực */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterRow, { marginTop: 8 }]}
          >
            {PROVINCE_TAGS.map((prov, idx) => {
              const isActive = selectedProvince === prov && !appliedSearch;
              return (
                <Pressable
                  key={idx}
                  style={[styles.provinceChip, isActive && styles.provinceChipActive]}
                  onPress={() => handleSelectProvince(prov)}
                >
                  <Ionicons
                    name="location-sharp"
                    size={11}
                    color={isActive ? '#ffffff' : '#ea580c'}
                  />
                  <Text style={[styles.provinceChipText, isActive && styles.provinceChipTextActive]}>
                    {prov}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        {/* END: FilterChipsSection */}

        {/* BEGIN: HeroGuideCard (Cẩm nang ẩm thực) */}
        <View style={styles.heroGuideSection}>
          <View style={styles.heroGuideCard}>
            {/* Ambient Top Glow */}
            <View style={styles.heroGuideAmbientGlow} />

            {/* Tag & Pill Header */}
            <View style={styles.heroGuideHeaderRow}>
              <View style={styles.heroGuideTagPill}>
                <Text style={styles.heroGuideTagPillText}>🥢 CẨM NANG ẨM THỰC ĐỊA PHƯƠNG</Text>
              </View>
              <View style={styles.heroGuideRecommendPill}>
                <Text style={styles.heroGuideRecommendPillText}>Đề xuất mới</Text>
              </View>
            </View>

            {/* Title & Description */}
            <Text style={styles.heroGuideTitle}>
              Ăn gì, ở đâu, theo đúng vị chuyến đi
            </Text>
            <Text style={styles.heroGuideDesc}>
              Khám phá đặc sản nức tiếng, quán ăn gia truyền và hương vị nguyên bản từng vùng miền.
            </Text>

            {/* Bullet & CTA Row */}
            <View style={styles.heroGuideBottomBar}>
              <View style={styles.heroGuideGuaranteeRow}>
                <Ionicons name="checkmark-circle" size={15} color="#34d399" />
                <Text style={styles.heroGuideGuaranteeText}>100% Quán ngon chuẩn vị</Text>
              </View>
              <Pressable
                style={styles.heroGuideCtaBtn}
                onPress={() => handleOpenDish(spotlightDish)}
              >
                <Text style={styles.heroGuideCtaBtnText}>Khám phá ngay</Text>
                <Ionicons name="arrow-forward" size={12} color="#ffffff" style={{ marginLeft: 3 }} />
              </Pressable>
            </View>
          </View>
        </View>
        {/* END: HeroGuideCard */}

        {/* BEGIN: FeaturedSpotlightSection (Big Card: Bánh canh Trảng Bàng) */}
        <View style={styles.listingsSection}>
          <View style={styles.listingsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listingsEyebrow}>QUÁN NGON ĐÁNG THỬ</Text>
              <Text style={styles.listingsTitle}>
                {appliedSearch
                  ? `Kết quả cho "${appliedSearch}"`
                  : selectedProvince !== 'Tất cả tỉnh'
                  ? `Món ngon tại ${selectedProvince}`
                  : 'Món ngon & Quán ăn nổi bật'}
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredDishes.length} quán ngon
              </Text>
            </View>
          </View>

          {/* Empty State */}
          {filteredDishes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Không tìm thấy món ngon phù hợp</Text>
              <Text style={styles.emptyStateSub}>
                Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh sách.
              </Text>
              <Pressable
                style={styles.resetFilterBtn}
                onPress={() => {
                  setSelectedNeed('Tất cả nhu cầu');
                  setSelectedProvince('Tất cả tỉnh');
                  setSearchText('');
                  setAppliedSearch('');
                }}
              >
                <Text style={styles.resetFilterBtnText}>Xem tất cả món ngon</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {/* Big Spotlight Card (Bánh canh Trảng Bàng) */}
              {selectedProvince === 'Tất cả tỉnh' && selectedNeed === 'Tất cả nhu cầu' && !appliedSearch && (
                <Pressable
                  style={styles.spotlightBigCard}
                  onPress={() => handleOpenDish(spotlightDish)}
                >
                  <View style={styles.spotlightImageContainer}>
                    <Image
                      source={{ uri: spotlightDish.image }}
                      style={styles.spotlightImage}
                      contentFit="cover"
                    />
                    <View style={styles.spotlightGradientOverlay} />

                    {/* Category & Rating Badges */}
                    <View style={styles.spotlightBadgesTop}>
                      <View style={styles.spotlightCategoryBadge}>
                        <Text style={{ fontSize: 11 }}>🔥</Text>
                        <Text style={styles.spotlightCategoryText}>{spotlightDish.tag}</Text>
                      </View>
                      <View style={styles.spotlightRatingBadge}>
                        <Text style={styles.spotlightRatingStar}>★</Text>
                        <Text style={styles.spotlightRatingValue}>{spotlightDish.rating}</Text>
                      </View>
                    </View>

                    {/* Inside-Image Bottom Title & Location */}
                    <View style={styles.spotlightMetaBottom}>
                      <Text style={styles.spotlightTitle} numberOfLines={1}>
                        {spotlightDish.name}
                      </Text>
                      <View style={styles.spotlightLocationRow}>
                        <Ionicons name="location-sharp" size={13} color="#ea580c" />
                        <Text style={styles.spotlightLocationText} numberOfLines={1}>
                          {spotlightDish.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Body Content */}
                  <View style={styles.spotlightBody}>
                    <Text style={styles.spotlightDesc} numberOfLines={2}>
                      {spotlightDish.desc}
                    </Text>

                    {/* Attributes & Info Chips */}
                    <View style={styles.spotlightChipsRow}>
                      <View style={styles.spotlightTimeChip}>
                        <Text style={{ fontSize: 11 }}>⏰</Text>
                        <Text style={styles.spotlightTimeText}>{spotlightDish.openHours}</Text>
                      </View>
                      <View style={styles.spotlightTicketPill}>
                        <Text style={{ fontSize: 11 }}>🥢</Text>
                        <Text style={styles.spotlightTicketText}>Menu hơn 15 món</Text>
                      </View>
                    </View>

                    {/* Price & CTA Button */}
                    <View style={styles.spotlightFooterRow}>
                      <View>
                        <Text style={styles.spotlightPriceLabel}>Giá chỉ từ</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                          <Text style={styles.spotlightPriceValue}>{spotlightDish.price}</Text>
                        </View>
                      </View>

                      <Pressable
                        style={styles.spotlightBookBtn}
                        onPress={() => handleOpenDish(spotlightDish)}
                      >
                        <Text style={styles.spotlightBookBtnText}>Đặt bàn / Xem quán</Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              )}

              {/* Listings Stack (Horizontal Dark Emerald Cuisine Cards) */}
              <View style={styles.cardsStack}>
                {displayedDishes
                  .filter((d) => selectedProvince !== 'Tất cả tỉnh' || selectedNeed !== 'Tất cả nhu cầu' || appliedSearch ? true : d.id !== spotlightDish.id)
                  .map((dish) => (
                    <Pressable
                      key={dish.id}
                      style={styles.cuisineCard}
                      onPress={() => handleOpenDish(dish)}
                    >
                      {/* Thumbnail Container */}
                      <View style={styles.thumbnailContainer}>
                        <Image
                          source={{ uri: dish.image }}
                          style={styles.thumbnailImage}
                          contentFit="cover"
                        />
                        {/* Rating badge */}
                        <View style={styles.cardRatingBadge}>
                          <Text style={styles.cardRatingStar}>★</Text>
                          <Text style={styles.cardRatingValue}>{dish.rating}</Text>
                        </View>
                        {/* Tag Badge */}
                        <View style={styles.cardTypeBadge}>
                          <Text style={styles.cardTypeBadgeText} numberOfLines={1}>
                            {dish.tag}
                          </Text>
                        </View>
                      </View>

                      {/* Content Container */}
                      <View style={styles.cardContent}>
                        <View>
                          <Text style={styles.cardTitle} numberOfLines={2}>
                            {dish.name}
                          </Text>
                          <View style={styles.cardLocationRow}>
                            <Ionicons name="location-sharp" size={12} color="#ea580c" />
                            <Text style={styles.cardLocationText} numberOfLines={1}>
                              {dish.location}
                            </Text>
                          </View>
                          {/* Feature Highlight Pill */}
                          <View style={styles.cardFeaturePill}>
                            <View style={styles.cardFeatureDot} />
                            <Text style={styles.cardFeatureText} numberOfLines={1}>
                              {dish.featureHighlight || dish.flavorHighlights[0] || 'Đặc sản chuẩn vị'}
                            </Text>
                          </View>
                        </View>

                        {/* Price & Booking Button Row */}
                        <View style={styles.cardFooterRow}>
                          <View>
                            <Text style={styles.cardPriceLabel}>Giá từ</Text>
                            <Text style={styles.cardPriceValue}>{dish.price.split(' ')[0]}</Text>
                          </View>

                          <Pressable
                            style={styles.cardBookBtn}
                            onPress={() => handleOpenDish(dish)}
                          >
                            <Text style={styles.cardBookBtnText}>Xem quán</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Pressable>
                  ))}
              </View>

              {/* Pagination / Load More with Down Arrow */}
              {hasMore && (
                <View style={styles.paginationSection}>
                  <Pressable
                    style={styles.loadMoreBtn}
                    onPress={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.loadMoreBtnTitle}>
                        Xem thêm {Math.min(ITEMS_PER_PAGE, remainingCount)} quán ngon
                      </Text>
                      <Text style={styles.loadMoreBtnSubtitle}>
                        Đang hiển thị {displayedDishes.length} / {filteredDishes.length} địa điểm
                      </Text>
                    </View>
                    <View style={styles.loadMoreIconCircle}>
                      <Ionicons name="chevron-down" size={18} color="#ffffff" />
                    </View>
                  </Pressable>
                </View>
              )}

              {/* All loaded footer */}
              {!hasMore && filteredDishes.length > ITEMS_PER_PAGE && (
                <View style={styles.allLoadedSection}>
                  <View style={styles.allLoadedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    <Text style={styles.allLoadedText}>
                      Đã hiển thị tất cả {filteredDishes.length} quán ngon
                    </Text>
                  </View>
                  <Pressable
                    style={styles.collapseBtn}
                    onPress={() => {
                      setVisibleCount(ITEMS_PER_PAGE);
                      scrollViewRef.current?.scrollTo({ y: 350, animated: true });
                    }}
                  >
                    <Text style={styles.collapseBtnText}>Thu gọn</Text>
                    <Ionicons name="chevron-up" size={13} color="#0F382C" />
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
        {/* END: FeaturedSpotlightSection */}

        {/* BEGIN: FoodInspirationGrid (2-Column Grid matching Stitch design) */}
        <View style={styles.inspirationSection}>
          <View style={styles.inspirationHeader}>
            <View>
              <Text style={styles.inspirationEyebrow}>CẢM HỨNG ẨM THỰC</Text>
              <Text style={styles.inspirationTitle}>Hương vị không thể bỏ lỡ</Text>
            </View>
            <Pressable
              onPress={() => {
                setSelectedNeed('Tất cả nhu cầu');
                setSelectedProvince('Tất cả tỉnh');
                setSearchText('');
                setAppliedSearch('');
              }}
            >
              <Text style={styles.inspirationViewAll}>Xem tất cả</Text>
            </Pressable>
          </View>

          {/* 2 Column Cards Grid */}
          <View style={styles.inspirationGrid}>
            {INSPIRATION_FOOD_ITEMS.map((item, idx) => (
              <Pressable
                key={idx}
                style={styles.inspirationCard}
                onPress={() => {
                  setSelectedProvince(item.filterTag);
                  setSearchText('');
                  setAppliedSearch('');
                }}
              >
                <View style={styles.inspirationImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.inspirationImage} contentFit="cover" />
                  <View style={styles.inspirationBadge}>
                    <Text style={styles.inspirationBadgeText}>{item.category}</Text>
                  </View>
                </View>
                <View style={styles.inspirationContent}>
                  <Text style={styles.inspirationName} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.inspirationCount}>{item.countSubtitle}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        {/* END: FoodInspirationGrid */}

      </ScrollView>
    </View>
  );
}

const INSPIRATION_FOOD_ITEMS = [
  {
    id: 'insp-1',
    title: 'Chợ Đêm Phố Hoa',
    category: 'Đà Lạt',
    countSubtitle: 'Thiên đường ẩm thực phố sương mù',
    filterTag: 'Đà Lạt',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-2',
    title: 'Ẩm Thực Nam Bộ',
    category: 'Miền Tây',
    countSubtitle: 'Cá lóc nướng trui & lẩu mắm',
    filterTag: 'Cần Thơ',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-3',
    title: 'Đặc Sản Tây Ninh',
    category: 'Tây Ninh',
    countSubtitle: 'Bò tơ nướng & Bánh canh giò',
    filterTag: 'Tây Ninh',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-4',
    title: 'Hải Sản Vịnh Biển',
    category: 'Nha Trang',
    countSubtitle: 'Nem nướng & Hải sản tươi sống',
    filterTag: 'Nha Trang',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf9',
  },
  scrollContent: {
    paddingBottom: 90,
  },

  // HEADER STYLES (Dark Emerald Theme)
  headerContainer: {
    backgroundColor: '#0F382C',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 50,
  },
  topActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 4,
  },
  headerBlurBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenterTitle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  headerMainTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE7B7',
  },
  headerSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(209, 250, 229, 0.85)',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
    borderWidth: 1.5,
    borderColor: '#0F382C',
  },

  // SEARCH PILL
  headerSearchPill: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerSearchActionBtn: {
    backgroundColor: '#06261C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSearchActionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  // SEARCH SUGGESTIONS OVERLAY
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 999,
    marginTop: 6,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 6,
  },
  suggestionsHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  suggestionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  suggestionSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },

  // FILTER SECTION (2 Rows)
  filterSection: {
    marginTop: 14,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  needChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  needChipActive: {
    backgroundColor: '#0B3326',
    borderColor: '#0B3326',
  },
  needChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  needChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  provinceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  provinceChipActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  provinceChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9a3412',
  },
  provinceChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // HERO GUIDE CARD
  heroGuideSection: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  heroGuideCard: {
    backgroundColor: '#0F382C',
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  heroGuideAmbientGlow: {
    position: 'absolute',
    right: -25,
    top: -25,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  heroGuideHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroGuideTagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  heroGuideTagPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#a7f3d0',
    letterSpacing: 0.3,
  },
  heroGuideRecommendPill: {
    backgroundColor: 'rgba(6, 38, 28, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  heroGuideRecommendPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#a7f3d0',
  },
  heroGuideTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.2,
    marginBottom: 4,
    lineHeight: 22,
  },
  heroGuideDesc: {
    fontSize: 12,
    color: 'rgba(209, 250, 229, 0.9)',
    lineHeight: 17,
    marginBottom: 12,
  },
  heroGuideBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.25)',
  },
  heroGuideGuaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroGuideGuaranteeText: {
    fontSize: 11.5,
    color: '#6ee7b7',
    fontWeight: '600',
  },
  heroGuideCtaBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  heroGuideCtaBtnText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // LISTINGS SECTION
  listingsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  listingsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listingsEyebrow: {
    fontSize: 11,
    fontWeight: '900',
    color: '#EA580C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listingsTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F382C',
  },

  // SPOTLIGHT BIG CARD
  spotlightBigCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 14,
  },
  spotlightImageContainer: {
    height: 175,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  spotlightGradientOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  spotlightBadgesTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotlightCategoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotlightCategoryText: {
    color: '#c2410c',
    fontSize: 10.5,
    fontWeight: '700',
  },
  spotlightRatingBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  spotlightRatingStar: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  spotlightRatingValue: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '900',
  },
  spotlightMetaBottom: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  spotlightTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  spotlightLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  spotlightLocationText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11.5,
    fontWeight: '500',
  },
  spotlightBody: {
    padding: 14,
  },
  spotlightDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  spotlightChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  spotlightTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  spotlightTimeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  spotlightTicketPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  spotlightTicketText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  spotlightFooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  spotlightPriceLabel: {
    fontSize: 9.5,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  spotlightPriceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#EA580C',
    marginTop: 1,
  },
  spotlightBookBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  spotlightBookBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  // CARDS STACK
  cardsStack: {
    gap: 12,
  },
  cuisineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 10,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnailContainer: {
    width: 118,
    height: 122,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  cardRatingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cardRatingStar: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardRatingValue: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  cardTypeBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(15, 56, 44, 0.88)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  cardTypeBadgeText: {
    color: '#ffffff',
    fontSize: 8.5,
    fontWeight: '700',
  },

  // CARD CONTENT
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  cardLocationText: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },
  cardFeaturePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: 'rgba(209, 250, 229, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 5,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  cardFeatureDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#10b981',
  },
  cardFeatureText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#065f46',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cardPriceLabel: {
    fontSize: 9,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  cardPriceValue: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#EA580C',
    marginTop: 1,
  },
  cardBookBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardBookBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },

  // PAGINATION
  paginationSection: {
    marginTop: 16,
  },
  loadMoreBtn: {
    backgroundColor: '#0F382C',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  loadMoreBtnTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  loadMoreBtnSubtitle: {
    color: 'rgba(209, 250, 229, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  loadMoreIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allLoadedSection: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  allLoadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allLoadedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  collapseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  collapseBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F382C',
  },

  // INSPIRATION SECTION
  inspirationSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  inspirationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inspirationEyebrow: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#EA580C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  inspirationViewAll: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F382C',
  },
  inspirationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inspirationCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  inspirationImageContainer: {
    height: 105,
    width: '100%',
    position: 'relative',
    backgroundColor: '#e2e8f0',
  },
  inspirationImage: {
    width: '100%',
    height: '100%',
  },
  inspirationBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15, 56, 44, 0.88)',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  inspirationBadgeText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '700',
  },
  inspirationContent: {
    padding: 10,
  },
  inspirationName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  inspirationCount: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyStateSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: '#0F382C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  resetFilterBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
