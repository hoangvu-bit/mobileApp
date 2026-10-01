import React, { useState, useMemo } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  Pressable 
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
}

export const CULINARY_ITEMS: CulinaryItem[] = [
  {
    id: 'banh-canh-trang-bang',
    name: 'Bánh canh Trảng Bàng giò heo & rau rừng',
    restaurantName: 'Bánh Canh Trảng Bàng Hoàng Minh',
    location: 'Trảng Bàng, Tây Ninh',
    province: 'Tây Ninh',
    address: '38 Quốc Lộ 22, Thị xã Trảng Bàng, Tây Ninh',
    openHours: '06:00 - 21:30 hàng ngày',
    phone: '0276 3880 120',
    price: '50.000đ - 80.000đ / tô',
    priceNum: 50000,
    rating: 4.8,
    reviewCount: 1240,
    desc: 'Sợi bánh canh bột gạo dai mềm thơm lừng mùi gạo nàng thơm, nước dùng hầm xương heo trong vắt ngọt thanh.',
    longDesc: 'Bánh canh Trảng Bàng là niềm tự hào ẩm thực Tây Ninh. Bột bánh được làm từ gạo nàng thơm phơi sương tạo độ dẻo dai đặc trưng. Ăn kèm đĩa thịt bắp giò heo luộc cuốn bánh tráng phơi sương và rổ rau rừng hơn 10 vị thuốc Nam tươi non.',
    flavorHighlights: [
      'Nước dùng ninh từ xương ống heo hơn 6 tiếng, trong veo và ngọt hậu thanh khiết',
      'Sợi bánh canh trắng ngần, dẻo dai mềm mại làm từ gạo nàng thơm',
      'Đĩa thịt bắp giò heo cắt lát mỏng cuốn bánh tráng phơi sương chấm nước mắm tiêu',
      'Kèm đĩa rau rừng Tây Ninh tươi rói: lá cóc, quế vị, sao nhái, đọt choại'
    ],
    recommendedMenu: [
      { name: 'Tô bánh canh giò nạc đặc biệt', price: '65.000đ' },
      { name: 'Bánh canh thịt bắp giò khoanh', price: '55.000đ' },
      { name: 'Đĩa thịt luộc cuốn bánh tráng rau rừng', price: '120.000đ' },
      { name: 'Nước mía sầu riêng nguyên chất', price: '20.000đ' }
    ],
    tag: 'Đặc sản trứ danh',
    categories: ['Ăn sáng', 'Đặc sản địa phương', 'Ăn gia đình'],
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80'
    ],
    diningTips: [
      'Quán bán cả ngày từ 6h sáng, rất đông vào khung giờ sáng 7h-8h30 và trưa 11h30-13h.',
      'Nên gọi thêm phần bánh tráng phơi sương và đĩa rau rừng để trải nghiệm trọn vẹn vị Tây Ninh.'
    ]
  },
  {
    id: 'bo-to-tay-ninh',
    name: 'Bò tơ Tây Ninh nướng y & lẩu đuôi bò',
    restaurantName: 'Bò Tơ Năm Sánh 17 (Cơ sở chính)',
    location: 'Hòa Thành, Tây Ninh',
    province: 'Tây Ninh',
    address: 'QL22B, Xã Hiệp Tân, Thị xã Hòa Thành, Tây Ninh',
    openHours: '08:30 - 22:30 hàng ngày',
    phone: '0913 888 777',
    price: '150.000đ - 350.000đ / món',
    priceNum: 150000,
    rating: 4.9,
    reviewCount: 2350,
    desc: 'Bò tơ non nướng than hoa thơm lừng, thịt ngọt mềm mọng nước, da nướng giòn sần sật cuốn rau rừng.',
    longDesc: 'Bò tơ Năm Sánh là thương hiệu nổi danh khắp miền Nam. Thịt bò được tuyển chọn từ những con bê non thả đồi Tây Ninh khoảng 5-6 tháng tuổi nên thịt mềm ngọt, da mỏng giòn và không có mùi gây.',
    flavorHighlights: [
      'Thịt bò tơ ướp gia vị bí truyền nướng xèo xèo trên than hồng rực lửa',
      'Bò lụi sả cay the chấm chao sa tế hoặc mắm nêm thơm nồng',
      'Lẩu đuôi bò hầm sâm bố chính ngọt mát, bổ dưỡng',
      'Ăn kèm rau rừng Tây Ninh và bánh phở tươi cuốn bánh tráng'
    ],
    recommendedMenu: [
      { name: 'Bò tơ nướng y chấm muối ớt đỏ', price: '180.000đ' },
      { name: 'Bò lụi sả nướng than hoa', price: '160.000đ' },
      { name: 'Bò tơ nhúng giấm cuốn bánh tráng', price: '190.000đ' },
      { name: 'Lẩu xí quách & đuôi bò tơ', price: '280.000đ' }
    ],
    tag: 'Bò tơ đặc sản',
    categories: ['Ăn gia đình', 'Cuối tuần', 'Đặc sản địa phương'],
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80'
    ],
    diningTips: [
      'Không gian sân vườn rộng rãi, bãi đỗ xe ô tô thoải mái.',
      'Đi nhóm từ 4-6 người là lý tưởng nhất để gọi được nhiều món nướng và lẩu.'
    ]
  },
  {
    id: 'bun-bo-hue',
    name: 'Bún bò Huế Mụ Rơi – Chuẩn vị cố đô',
    restaurantName: 'Bún Bò Huế Mụ Rơi',
    location: 'Thuận Thành, TP. Huế',
    province: 'Huế',
    address: '40 Nguyễn Chí Diểu, Phường Thuận Thành, TP. Huế, Thừa Thiên Huế',
    openHours: '06:30 - 11:30 (Chuyên bán sáng)',
    phone: '0905 123 456',
    price: '45.000đ - 65.000đ / tô',
    priceNum: 45000,
    rating: 4.8,
    reviewCount: 980,
    desc: 'Nước dùng đỏ au màu hạt điều, dậy mùi thơm mắm ruốc Huế và sả, giò heo giòn béo, chả cua quết tay dai ngọt.',
    longDesc: 'Quán bún bò gia truyền nằm trong khu nội thành cổ kính của Huế. Mụ Rơi hầm xương bò và giò heo theo công thức cố đô, tạo nên hương vị đậm đà khó cưỡng mà không nơi nào có được.',
    flavorHighlights: [
      'Nước dùng dậy mùi mắm ruốc đặc trưng hầm cùng xương bò và sả thơm ngát',
      'Chả cua tự quết tay tươi rói, giòn sần sật và ngọt tự nhiên',
      'Giò heo hầm vừa chín tới, da giòn sần sật không hề ngấy',
      'Rau sống bắp chuối thái mịn ăn kèm ớt sa tế cay xé lưỡi'
    ],
    recommendedMenu: [
      { name: 'Tô bún bò thập cẩm đặc biệt', price: '60.000đ' },
      { name: 'Bún bắp bò nạm chả cua', price: '50.000đ' },
      { name: 'Bún giò gân huyết tươi', price: '45.000đ' }
    ],
    tag: 'Món ngon cố đô',
    categories: ['Ăn sáng', 'Đặc sản địa phương'],
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80'
    ],
    diningTips: [
      'Quán chỉ bán buổi sáng và thường hết hàng trước 10h30, bạn nên ghé sớm trước 9h.',
      'Có chỗ để xe máy thuận tiện ngay trước cửa quán.'
    ]
  },
  {
    id: 'banh-mi-xiu-mai-da-lat',
    name: 'Bánh mì xíu mại chén Hoàng Diệu nóng hổi',
    restaurantName: 'Bánh Mì Xíu Mại 26 Hoàng Diệu (Quán Bé Linh)',
    location: 'Phường 5, TP. Đà Lạt',
    province: 'Đà Lạt',
    address: '26 Hoàng Diệu, Phường 5, TP. Đà Lạt, Lâm Đồng',
    openHours: '06:00 - 12:00 (Sáng & trưa)',
    phone: '0975 668 899',
    price: '20.000đ - 40.000đ / phần',
    priceNum: 20000,
    rating: 4.7,
    reviewCount: 3100,
    desc: 'Bát xíu mại nóng hổi bốc khói giữa tiết trời se lạnh, viên xíu mại thịt nạc thơm ngon, da heo giòn béo kèm bánh mì giòn.',
    longDesc: 'Món ăn sáng quốc dân của xứ sở sương mù Đà Lạt. Bát nước súp trong veo thơm mùi hành lá và ớt cay, viên xíu mại mềm tan trong miệng, chấm cùng ổ bánh mì giòn tan nóng hổi vừa ra lò.',
    flavorHighlights: [
      'Nước xúp xíu mại hầm từ xương ngọt thanh, rắc nhiều hành lá tươi',
      'Viên xíu mại thịt heo xay ướp tiêu thơm nồng, mềm mịn vừa miệng',
      'Kèm miếng chả lụa lá và da heo dai giòn ngậy béo',
      'Thưởng thức cùng ly sữa đậu nành nóng hổi xua tan cái lạnh Đà Lạt'
    ],
    recommendedMenu: [
      { name: 'Chén xíu mại đầy đủ (2 viên + chả + da heo)', price: '25.000đ' },
      { name: 'Bánh mì giòn thêm', price: '5.000đ' },
      { name: 'Sữa đậu nành nguyên chất nóng', price: '12.000đ' },
      { name: 'Chả giò ram giòn rụm', price: '10.000đ' }
    ],
    tag: 'Ăn sáng Đà Lạt',
    categories: ['Ăn sáng', 'Đặc sản địa phương'],
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=80'
    ],
    diningTips: [
      'Quán cực kỳ đông khách từ 7h đến 9h sáng, có thể phải chờ xếp bàn 5-10 phút.',
      'Hãy gọi thêm ly sữa đậu phộng hoặc đậu nành nóng để thưởng thức trọn vẹn phong vị Đà Lạt.'
    ]
  },
  {
    id: 'com-nieu-nhu-ngoc',
    name: 'Cơm niêu Như Ngọc – Ẩm thực gia đình phố núi',
    restaurantName: 'Cơm Niêu Như Ngọc Đà Lạt',
    location: 'Phường 3, TP. Đà Lạt',
    province: 'Đà Lạt',
    address: '19/8 Hồ Tùng Mậu, Phường 3, TP. Đà Lạt, Lâm Đồng',
    openHours: '10:30 - 21:30 hàng ngày',
    phone: '0263 3833 777',
    price: '120.000đ - 300.000đ / người',
    priceNum: 120000,
    rating: 4.8,
    reviewCount: 1850,
    desc: 'Cơm niêu đất cháy giòn rụm đáy niêu, cá bống kho tộ kẹo đường, canh atiso sườn non ngọt mát và rau xào tỏi.',
    longDesc: 'Địa chỉ ẩm thực gia đình chuẩn mực tại Đà Lạt hơn 20 năm qua. Cơm được nấu từ gạo tấm thơm trong niêu đất nung, tạo nên lớp cơm cháy vàng giòn tan chấm với kho quẹt tôm thịt nức tiếng.',
    flavorHighlights: [
      'Cơm niêu đập tạo lớp cơm cháy vàng ươm thơm nức mũi',
      'Cá bống kho tộ đậm đà kẹo nước mắm mặn ngọt thơm cay',
      'Canh bông Atiso Đà Lạt hầm sườn heo thanh nhiệt giải độc',
      'Rau cải mầm và đọt su su xào tỏi giòn ngọt tươi rói'
    ],
    recommendedMenu: [
      { name: 'Cơm niêu cháy giòn + Kho quẹt tôm thịt', price: '65.000đ' },
      { name: 'Cá bống kho tộ niêu đất', price: '140.000đ' },
      { name: 'Canh Atiso hầm sườn non', price: '160.000đ' },
      { name: 'Thịt ba chỉ luộc cà pháo mắm tôm', price: '120.000đ' }
    ],
    tag: 'Cơm niêu gia đình',
    categories: ['Ăn gia đình', 'Cuối tuần', 'Đặc sản địa phương'],
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80'
    ],
    diningTips: [
      'Thích hợp cho gia đình đông người và khách đoàn.',
      'Nên đặt bàn trước nếu đi vào dịp cuối tuần hoặc lễ tết để có vị trí ngồi đẹp.'
    ]
  },
  {
    id: 'cao-lau-thanh-hoi-an',
    name: 'Cao lầu Thanh – Tinh hoa ẩm thực phố cổ',
    restaurantName: 'Cao Lầu Thanh Hội An',
    location: 'Minh An, TP. Hội An',
    province: 'Hội An',
    address: '26 Thái Phiên, Phường Minh An, TP. Hội An, Quảng Nam',
    openHours: '07:00 - 19:00 hàng ngày',
    phone: '0905 999 888',
    price: '35.000đ - 55.000đ / tô',
    priceNum: 35000,
    rating: 4.7,
    reviewCount: 1620,
    desc: 'Sợi mì cao lầu màu vàng đục dẻo dai sần sật, thịt xá xíu rim đậm đà, tóp mỡ da heo chiên giòn và rau Trà Quế.',
    longDesc: 'Quán cao lầu lâu đời được người dân bản địa Hội An và du khách quốc tế yêu thích. Sợi mì được nhào từ bột gạo ngâm nước tro củi tràm Cù Lao Chàm và nước giếng Bá Lễ ngàn năm.',
    flavorHighlights: [
      'Sợi mì cao lầu thủ công thơm mùi tro củi dẻo dai đặc biệt',
      'Thịt xá xíu thịt heo nạc dăm rim gia vị đậm đà mọng nước',
      'Tóp mỡ da heo chiên giòn rụm nhai vui tai',
      'Rau sống làng rau Trà Quế nức tiếng với hơn 8 loại rau thơm'
    ],
    recommendedMenu: [
      { name: 'Tô cao lầu thịt xá xíu đặc biệt', price: '45.000đ' },
      { name: 'Cao lầu truyền thống', price: '35.000đ' },
      { name: 'Nước mót thảo mộc hạt sen', price: '15.000đ' }
    ],
    tag: 'Đặc sản phố cổ',
    categories: ['Ăn sáng', 'Đặc sản địa phương', 'Ăn gia đình'],
    image: 'https://images.unsplash.com/photo-1552611052-33e04de1b100?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552611052-33e04de1b100?auto=format&fit=crop&w=1000&q=80'
    ],
    diningTips: [
      'Nằm ngay trung tâm phố cổ rất tiện đi bộ dạo ngắm đèn lồng.',
      'Trộn đều nước sốt xá xíu từ đáy tô lên trước khi thưởng thức để thấm vị.'
    ]
  },
  {
    id: 'de-nui-ninh-binh',
    name: 'Dê núi nướng tảng & Cơm cháy Tràng An',
    restaurantName: 'Nhà Hàng Dê Núi Thăng Long Tràng An',
    location: 'Hoa Lư, Ninh Bình',
    province: 'Ninh Bình',
    address: 'Chi Phong, Xã Trường Yên, Huyện Hoa Lư, Tỉnh Ninh Bình',
    openHours: '08:00 - 22:30 hàng ngày',
    phone: '0975 128 899',
    price: '180.000đ - 400.000đ / người',
    priceNum: 180000,
    rating: 4.9,
    reviewCount: 2100,
    desc: 'Thịt dê núi chăn thả tự nhiên thịt săn chắc thơm ngọt, dê tái chanh cuốn lá sung chấm tương gừng Bần.',
    longDesc: 'Nằm gần bến thuyền Tràng An và cố đô Hoa Lư, nhà hàng Thăng Long chuyên phục vụ các món dê núi tươi sống nổi tiếng nhất vùng đất cố đô Ninh Bình.',
    flavorHighlights: [
      'Thịt dê núi ăn lá thuốc trên vách đá vôi nên ngọt thịt, không có mùi hôi',
      'Dê nướng tảng than hoa thơm lừng chấm tương bần pha gừng ớt cay nồng',
      'Dê tái chanh thơm phức cuốn lá sung, khế chua, chuối xanh',
      'Cơm cháy Ninh Bình vàng ruộm giòn tan chấm nước sốt tim cật dê đậm đà'
    ],
    recommendedMenu: [
      { name: 'Dê nướng tảng than hoa (đĩa lớn)', price: '220.000đ' },
      { name: 'Dê tái chanh cuốn lá sung', price: '190.000đ' },
      { name: 'Cơm cháy sốt tim cật dê đặc sản', price: '130.000đ' },
      { name: 'Lẩu dê nhúng thuốc bắc', price: '380.000đ' }
    ],
    tag: 'Dê núi đặc sản',
    categories: ['Ăn gia đình', 'Cuối tuần', 'Đặc sản địa phương'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80'
    ],
    diningTips: [
      'Rất thích hợp cho bữa trưa sau khi đi thuyền tham quan Tràng An hoặc Bái Đính.',
      'Quán có khuôn viên rộng, bãi xe lớn cho cả xe 45 chỗ.'
    ]
  },
  {
    id: 'banh-khot-vung-tau',
    name: 'Bánh khọt tôm tươi Cô Ba Vũng Tàu giòn rụm',
    restaurantName: 'Bánh Khọt Cô Ba Vũng Tàu',
    location: 'Phường 3, TP. Vũng Tàu',
    province: 'Vũng Tàu',
    address: '01 Hoàng Hoa Thám, Phường 3, TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
    openHours: '07:00 - 22:00 hàng ngày',
    phone: '0254 3526 165',
    price: '65.000đ - 120.000đ / dĩa',
    priceNum: 65000,
    rating: 4.8,
    reviewCount: 3890,
    desc: 'Bánh khọt chiên giòn tan ngập tôm biển tươi nguyên con, rắc bột tôm cháy vàng ruộm cuốn rau cải chấm nước mắm chua ngọt.',
    longDesc: 'Quán bánh khọt nức tiếng nhất phố biển Vũng Tàu. Bột gạo chiên trong khuôn đồng ngập dầu giòn rụm bên ngoài nhưng vẫn giữ độ béo mềm bên trong, tôm biển tươi giòn sần sật.',
    flavorHighlights: [
      'Vỏ bánh mỏng vàng ươm giòn rụm không ngấy mỡ',
      'Tôm biển tươi roi rói ngọt lịm nằm trọn trong lòng bánh',
      'Rắc thêm mỡ hành thơm phức và bột tôm đỏ quạch',
      'Rau sống phong phú kèm đu đủ bào ngâm chua và nước mắm pha tỏi ớt tuyệt hảo'
    ],
    recommendedMenu: [
      { name: 'Dĩa bánh khọt tôm đặc biệt (8 cái)', price: '75.000đ' },
      { name: 'Bánh khọt hải sản thập cẩm (tôm, mực, sò điệp)', price: '95.000đ' },
      { name: 'Bánh khọt thịt bằm mộc nhĩ', price: '65.000đ' },
      { name: 'Nước mía sầu riêng thơm béo', price: '25.000đ' }
    ],
    tag: 'Đặc sản biển',
    categories: ['Ăn sáng', 'Ăn gia đình', 'Cuối tuần', 'Đặc sản địa phương'],
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80'
    ],
    diningTips: [
      'Vào cuối tuần quán rất đông khách, bạn nên đến trước 11h30 trưa hoặc sau 13h30.',
      'Có máy lạnh ở tầng 2 mát mẻ và phục vụ nhanh chóng.'
    ]
  }
];

const CATEGORY_TABS = [
  'Tất cả nhu cầu',
  'Ăn sáng',
  'Ăn gia đình',
  'Cuối tuần',
  'Đặc sản địa phương'
];

const PROVINCE_TAGS = [
  'Tất cả tỉnh',
  'Tây Ninh',
  'Đà Lạt',
  'Huế',
  'Hội An',
  'Ninh Bình',
  'Vũng Tàu'
];

export default function AmThucScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả nhu cầu');
  const [selectedProvince, setSelectedProvince] = useState('Tất cả tỉnh');

  // Filter logic combining search query (accent-insensitive), category, and province
  const filteredDishes = useMemo(() => {
    return CULINARY_ITEMS.filter((item) => {
      // Search matching dish name, restaurant, location, address, tag, or desc
      const matchSearch =
        searchQuery.trim() === '' ||
        matchVietnameseSearch(item.name, searchQuery) ||
        matchVietnameseSearch(item.restaurantName, searchQuery) ||
        matchVietnameseSearch(item.location, searchQuery) ||
        matchVietnameseSearch(item.province, searchQuery) ||
        matchVietnameseSearch(item.address, searchQuery) ||
        matchVietnameseSearch(item.tag, searchQuery) ||
        matchVietnameseSearch(item.desc, searchQuery) ||
        matchVietnameseSearch(item.longDesc, searchQuery);

      // Category matching
      const matchCategory =
        selectedCategory === 'Tất cả nhu cầu' ||
        item.categories.includes(selectedCategory);

      // Province matching
      const matchProvince =
        selectedProvince === 'Tất cả tỉnh' ||
        matchVietnameseSearch(item.province, selectedProvince) ||
        matchVietnameseSearch(item.location, selectedProvince);

      return matchSearch && matchCategory && matchProvince;
    });
  }, [searchQuery, selectedCategory, selectedProvince]);

  const handleOpenDetail = (dish: CulinaryItem) => {
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
      }
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Tất cả nhu cầu');
    setSelectedProvince('Tất cả tỉnh');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Compact Hero Banner */}
        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80' }} 
            style={styles.heroBgImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadgeRow}>
              <Ionicons name="restaurant" size={13} color="#fed7aa" />
              <Text style={styles.heroBadgeText}>CẨM NANG ẨM THỰC ĐỊA PHƯƠNG</Text>
            </View>
            <Text style={styles.heroTitle}>Ăn gì, ở đâu, theo đúng vị chuyến đi</Text>
            <Text style={styles.heroSubtitle}>Khám phá đặc sản nức tiếng, quán ăn gia truyền và hương vị nguyên bản từng vùng miền.</Text>

            {/* Compact Search Bar with accent-insensitive search */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#ea580c" style={styles.searchIcon} />
              <TextInput 
                placeholder="Tìm món ngon, bò tơ, bánh canh, bún bò, địa điểm..." 
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor="#94a3b8"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* Compact Demand / Category Filter Tabs */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Nhu cầu ăn uống:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterTagsContainer}
          >
            {CATEGORY_TABS.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Location / Province Filter Chips */}
          <Text style={[styles.filterSectionTitle, { marginTop: 10 }]}>Khu vực & Tỉnh thành:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterTagsContainer}
          >
            {PROVINCE_TAGS.map((prov) => {
              const isActive = selectedProvince === prov;
              return (
                <Pressable
                  key={prov}
                  onPress={() => setSelectedProvince(prov)}
                  style={[styles.provChip, isActive && styles.provChipActive]}
                >
                  <Ionicons 
                    name="location-sharp" 
                    size={11} 
                    color={isActive ? '#ffffff' : '#ea580c'} 
                    style={{ marginRight: 3 }}
                  />
                  <Text style={[styles.provChipText, isActive && styles.provChipTextActive]}>
                    {prov}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Dish List Section */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listSubTitle}>QUÁN NGON ĐÁNG THỬ</Text>
              <Text style={styles.listTitle}>
                {selectedCategory === 'Tất cả nhu cầu' ? 'Món ngon nổi bật' : selectedCategory}
                {selectedProvince !== 'Tất cả tỉnh' ? ` tại ${selectedProvince}` : ''}
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{filteredDishes.length} món ngon</Text>
            </View>
          </View>

          {/* Empty State when no results found */}
          {filteredDishes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={48} color="#fdba74" />
              <Text style={styles.emptyTitle}>Không tìm thấy món ăn hoặc quán phù hợp</Text>
              <Text style={styles.emptySub}>
                Không có kết quả nào khớp với từ khóa "{searchQuery}". Bạn có thể gõ có dấu hoặc không dấu (vd: bo to, banh canh, hue, da lat...).
              </Text>
              <Pressable style={styles.resetFilterBtn} onPress={handleClearFilters}>
                <Ionicons name="refresh" size={14} color="#ffffff" />
                <Text style={styles.resetFilterText}>Xem tất cả món ngon</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cardGrid}>
              {filteredDishes.map((dish) => (
                <Pressable 
                  key={dish.id} 
                  style={styles.card}
                  onPress={() => handleOpenDetail(dish)}
                >
                  {/* Image Container */}
                  <View style={styles.cardImageContainer}>
                    <Image source={{ uri: dish.image }} style={styles.cardImage} contentFit="cover" />
                    <View style={styles.cardOverlay}>
                      <View style={styles.cardBadge}>
                        <Ionicons name="flame" size={11} color="#ea580c" />
                        <Text style={styles.cardBadgeText}>{dish.tag}</Text>
                      </View>
                      
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={11} color="#f59e0b" />
                        <Text style={styles.ratingBadgeText}>{dish.rating}</Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Card Content */}
                  <View style={styles.cardContent}>
                    
                    {/* Restaurant Name */}
                    <View style={styles.restaurantRow}>
                      <Ionicons name="storefront-outline" size={13} color="#ea580c" />
                      <Text style={styles.restaurantName} numberOfLines={1}>
                        {dish.restaurantName}
                      </Text>
                    </View>

                    {/* Dish Title */}
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {dish.name}
                    </Text>

                    {/* Address & Hours */}
                    <View style={styles.metaInfoBox}>
                      <View style={styles.metaRow}>
                        <Ionicons name="location-outline" size={12} color="#64748b" style={styles.metaIcon} />
                        <Text style={styles.metaText} numberOfLines={1}>{dish.address}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={12} color="#00897b" style={styles.metaIcon} />
                        <Text style={styles.metaTextGreen} numberOfLines={1}>Giờ mở cửa: {dish.openHours}</Text>
                      </View>
                    </View>

                    <Text style={styles.cardDesc} numberOfLines={2}>{dish.desc}</Text>

                    {/* Card Footer */}
                    <View style={styles.cardFooter}>
                      <View>
                        <Text style={styles.priceLabel}>Mức giá</Text>
                        <Text style={styles.priceValue}>{dish.price}</Text>
                      </View>
                      
                      <Pressable 
                        style={styles.viewDetailBtn}
                        onPress={() => handleOpenDetail(dish)}
                      >
                        <Text style={styles.viewDetailBtnText}>Xem chi tiết & Quán</Text>
                        <Ionicons name="arrow-forward" size={13} color="#ffffff" />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 60 },

  /* Hero Banner */
  heroBanner: { 
    height: 220, 
    position: 'relative',
    backgroundColor: '#7c2d12'
  },
  heroBgImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(38, 12, 4, 0.82)', 
    paddingHorizontal: 16, 
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'center' 
  },
  heroBadgeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 16, 
    gap: 5, 
    marginBottom: 6 
  },
  heroBadgeText: { color: '#fed7aa', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', lineHeight: 26, marginBottom: 4 },
  heroSubtitle: { color: '#fed7aa', fontSize: 11, lineHeight: 16, marginBottom: 12 },
  
  /* Search Form */
  searchBar: { 
    flexDirection: 'row', 
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    paddingHorizontal: 12,
    paddingVertical: 8, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  searchIcon: { marginRight: 6 },
  searchInput: { 
    flex: 1, 
    fontSize: 13, 
    color: '#0f172a', 
    paddingVertical: 2 
  },

  /* Compact Filter Section */
  filterSection: { 
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7'
  },
  filterSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
  },
  filterTagsContainer: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  provChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  provChipActive: {
    backgroundColor: '#c2410c',
    borderColor: '#c2410c',
  },
  provChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9a3412',
  },
  provChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  /* List Section */
  listSection: { padding: 16 },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14
  },
  listSubTitle: { fontSize: 10, fontWeight: '800', color: '#ea580c', letterSpacing: 0.8 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },
  countBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa'
  },
  countBadgeText: { fontSize: 11, fontWeight: '700', color: '#ea580c' },

  /* Empty state */
  emptyContainer: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fed7aa'
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
    textAlign: 'center'
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 300
  },
  resetFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ea580c',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16
  },
  resetFilterText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  /* Dish Card */
  cardGrid: { gap: 16 },
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 18, 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 8, 
    elevation: 3, 
    borderWidth: 1, 
    borderColor: '#f1f5f9' 
  },
  cardImageContainer: { height: 180, width: '100%', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { 
    position: 'absolute', 
    top: 10, 
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  cardBadgeText: { color: '#ea580c', fontSize: 10, fontWeight: '800' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  ratingBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  
  cardContent: { padding: 14 },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
    flex: 1
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0f172a', 
    lineHeight: 22, 
    marginBottom: 8 
  },
  
  metaInfoBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 8,
    gap: 4,
    marginBottom: 8
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { marginTop: 1 },
  metaText: { fontSize: 11, color: '#64748b', flex: 1 },
  metaTextGreen: { fontSize: 11, color: '#00897b', fontWeight: '600', flex: 1 },

  cardDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },
  
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10
  },
  priceLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  priceValue: { fontSize: 14, fontWeight: '800', color: '#ea580c' },
  
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ea580c',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  viewDetailBtnText: { fontSize: 11, fontWeight: '700', color: '#ffffff' }
});
