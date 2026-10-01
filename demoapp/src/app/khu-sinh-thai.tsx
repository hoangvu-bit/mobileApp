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

export interface EcoPlace {
  id: string;
  name: string;
  location: string;
  province: string;
  desc: string;
  longDesc: string;
  price: string;
  priceNum: number;
  image: string;
  gallery: string[];
  operatingHours: string;
  availableDates: string;
  targetAudience: string;
  tag: string;
  ticketCount: string;
  activities: string[];
  facilities: { icon: any; label: string }[];
  policies: string[];
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    desc: string;
  }[];
  address: string;
  rating?: string;
  featureHighlight?: string;
}

const PROVINCE_TAGS = [
  'Tất cả',
  'Tây Ninh',
  'Vũng Tàu',
  'Đà Lạt',
  'Long An',
  'Ninh Bình',
  'Đồng Tháp',
  'Phú Quốc',
  'Đồng Nai',
  'An Giang',
  'Bến Tre',
];

const POPULAR_ECO_SUGGESTIONS = [
  { id: 's-chavi', title: 'Chavi Garden (Long An)', subtitle: 'Vườn chanh 40ha, tắm bùn khoáng, chèo kayak', tag: 'Long An' },
  { id: 's-mtl', title: 'Thung lũng Ma Thiên Lãnh (Tây Ninh)', subtitle: 'Trekking suối đá, cắm trại glamping bên suối', tag: 'Tây Ninh' },
  { id: 's-sup', title: 'Chèo SUP Rừng Ngập Mặn (Vũng Tàu)', subtitle: 'Lướt SUP đón bình minh & hàu nướng Long Sơn', tag: 'Vũng Tàu' },
  { id: 's-tanlap', title: 'Làng Nổi Tân Lập (Long An)', subtitle: 'Cầu chữ X xuyên rừng tràm, chèo xuồng ba lá', tag: 'Long An' },
  { id: 's-trian', title: 'Đảo Ó - Hồ Trị An (Đồng Nai)', subtitle: 'Cắm trại ven hồ, chèo SUP, câu cá giải trí', tag: 'Đồng Nai' },
  { id: 's-thungnham', title: 'Vườn Chim Thung Nham (Ninh Bình)', subtitle: 'Vườn chim hoang dã, Hang Bụt, Động Vái Giời', tag: 'Ninh Bình' },
  { id: 's-caudat', title: 'Cầu Đất Farm (Đà Lạt)', subtitle: 'Săn mây cầu gỗ, đồi chè 100 năm, hái cà phê', tag: 'Đà Lạt' },
  { id: 's-gaogiong', title: 'Rừng Tràm Gáo Giồng (Đồng Tháp)', subtitle: 'Xuồng ba lá, đài quan sát chim, cơm lá sen', tag: 'Đồng Tháp' },
];

export const ECO_PLACES: EcoPlace[] = [
  // 1. Chavi Garden - Long An (Featured Spotlight Card)
  {
    id: 'chavi-garden',
    name: 'Khu Du Lịch Sinh Thái Chavi Garden',
    location: 'Bến Lức, Long An (Tiếp giáp Tây Ninh)',
    province: 'Long An',
    desc: 'Khu du lịch sinh thái nông nghiệp công nghệ cao rộng hơn 40ha với vườn chanh bạt ngàn, tắm bùn khoáng, chèo SUP, ẩm thực đồng quê.',
    longDesc: 'Chavi Garden là tổ hợp sinh thái giáo dục trải nghiệm lớn nhất khu vực miền Nam, sở hữu hệ thống suối khoáng nhân tạo, vườn chanh chuẩn quốc tế, khu chế biến nông sản organic và không gian dã ngoại trong lành.',
    price: 'Từ 150.000đ',
    priceNum: 150000,
    rating: '4.9',
    tag: 'Sinh thái nông nghiệp',
    featureHighlight: '• 4 gói vé đa dạng & Tắm bùn khoáng',
    ticketCount: '4 gói vé',
    image: 'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '08:00 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Gia đình & Đoàn tham quan',
    activities: [
      'Tham quan vườn chanh không hạt công nghệ cao rộng 40ha',
      'Tắm suối khoáng nhân tạo và ngâm bùn khoáng thư giãn',
      'Chèo thuyền kayak, đạp vịt trên hồ cảnh quan thơ mộng',
      'Thưởng thức lẩu cá linh bông điên điển và gà nướng lu',
    ],
    facilities: [
      { icon: 'car-outline', label: 'Bãi đỗ xe rộng rãi' },
      { icon: 'wifi-outline', label: 'Wifi miễn phí' },
      { icon: 'restaurant-outline', label: 'Nhà hàng ẩm thực quê' },
      { icon: 'water-outline', label: 'Hồ tắm khoáng bùn' },
    ],
    policies: [
      'Trẻ em dưới 1m được miễn phí vé vào cổng',
      'Không mang theo thức ăn tươi sống vào khu du lịch',
      'Có trang bị áo phao bắt buộc khi tham gia chèo thuyền',
    ],
    ticketTypes: [
      {
        id: 't1',
        name: 'Vé vào cổng & Tham quan sinh thái',
        price: 150000,
        desc: 'Bao gồm vé vào cổng, nước ép chanh tươi welcome và xe điện tham quan toàn khu',
      },
      {
        id: 't2',
        name: 'Combo Tham quan + Tắm bùn khoáng',
        price: 280000,
        desc: 'Vé vào cổng + 60 phút ngâm khoáng nóng thư giãn + tặng khăn tắm cao cấp',
      },
      {
        id: 't3',
        name: 'Combo Trọn gói Chèo Kayak & Ăn trưa',
        price: 450000,
        desc: 'Trọn gói vé cổng + chèo Kayak 2 giờ + Set menu ẩm thực đồng quê 5 món',
      },
    ],
    address: 'Ấp 4, Xã Thạnh Lợi, Huyện Bến Lức, Tỉnh Long An',
  },

  // 2. Rừng Tràm Tân Lập - Long An
  {
    id: 'tan-lap',
    name: 'Khu Du Lịch Sinh Thái Làng Nổi Tân Lập',
    location: 'Mộc Hóa, Long An',
    province: 'Long An',
    desc: 'Con đường xuyên rừng tràm dài 5km độc nhất vô nhị, tháp quan sát 38m ngắm toàn cảnh rừng ngập nước và chèo xuồng ba lá.',
    longDesc: 'Làng nổi Tân Lập là khu bảo tồn thiên nhiên ngập nước đặc trưng vùng Đồng Tháp Mười, nổi tiếng với con đường bê tông uốn lượn xuyên qua rừng tràm nguyên sinh cổ thụ rợp bóng mát quanh năm.',
    price: 'Từ 90.000đ',
    priceNum: 90000,
    rating: '4.8',
    tag: 'Rừng ngập nước',
    featureHighlight: '• Cầu chữ X & Chèo xuồng ba lá',
    ticketCount: '3 gói vé',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '07:30 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Giới trẻ, Cặp đôi & Gia đình',
    activities: [
      'Đi bộ trên con đường xi măng 5km xuyên giữa rừng tràm huyền ảo',
      'Ngồi xuồng chèo len lỏi qua các rạch sen, súng và bèo dạt mùa nước nổi',
      'Leo tháp quan sát 38m chiêm ngưỡng bức tranh đại ngàn xanh biếc',
      'Thưởng thức đặc sản cá kèo nướng muối ớt, lẩu chua bông lau',
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Tàu vỏ composite & xuồng chèo' },
      { icon: 'trail-sign-outline', label: 'Cầu xuyên rừng check-in' },
      { icon: 'restaurant-outline', label: 'Nhà hàng ven hồ' },
    ],
    policies: [
      'Nên mang thuốc xịt chống muỗi và mặc trang phục gọn nhẹ',
      'Không tự ý bẻ cành cây rừng tràm',
    ],
    ticketTypes: [
      {
        id: 'tl1',
        name: 'Vé vào cổng & Cầu xuyên rừng',
        price: 90000,
        desc: 'Vé vào cổng + đi bộ trên con đường 5km xuyên rừng tràm + tháp quan sát',
      },
      {
        id: 'tl2',
        name: 'Combo Vé Cổng + Đi Xuồng Chèo Ba Lá',
        price: 150000,
        desc: 'Bao gồm vé cổng + trải nghiệm ngồi xuồng ba lá có người chèo qua đầm sen',
      },
      {
        id: 'tl3',
        name: 'Gói Trọn Gói Sinh Thái Có Bữa Trưa',
        price: 320000,
        desc: 'Vé cổng + đi xuồng chèo + Set ăn trưa đặc sản cá lóc đồng nướng trui',
      },
    ],
    address: 'Quốc lộ 62, Xã Tân Lập, Huyện Mộc Hóa, Tỉnh Long An',
  },

  // 3. Đảo Ó - Đồng Trường (Trị An)
  {
    id: 'dao-o-tri-an',
    name: 'Đảo Ó - Trị An Camping & SUP',
    location: 'Hồ Trị An, Vĩnh Cửu, Đồng Nai',
    province: 'Đồng Nai',
    desc: 'Cắm trại glamping ven hồ, lướt ván chèo SUP giữa lòng hồ Trị An mênh mông và ngắm hoàng hôn đỏ rực buông xuống mặt nước.',
    longDesc: 'Nằm biệt lập giữa lòng hồ thủy điện Trị An rộng lớn, Đảo Ó như một ốc đảo xanh thanh bình tách biệt hoàn toàn khỏi phố thị ồn ào. Nơi đây là thiên đường cho các hoạt động cắm trại, chèo SUP và tiệc nướng BBQ ven hồ.',
    price: 'Từ 290.000đ',
    priceNum: 290000,
    rating: '4.7',
    tag: 'Cắm trại ven hồ',
    featureHighlight: '• Bao gồm tàu khứ hồi & lều trại',
    ticketCount: '3 gói vé',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '07:00 - 21:00 (Hỗ trợ lưu trú 24/24)',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Nhóm bạn trẻ & Gia đình',
    activities: [
      'Đi tàu cao tốc vượt sóng hồ Trị An ra đảo Ó xanh mát',
      'Chèo SUP ngắm hoàng hôn phản chiếu rực rỡ trên mặt hồ',
      'Dựng lều trại canvas cao cấp bên bờ bãi cỏ lộng gió',
      'Thưởng thức cá lăng lòng hồ Trị An nấu măng chua và BBQ thịt nướng',
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Tàu trung chuyển khứ hồi' },
      { icon: 'bonfire-outline', label: 'Bếp nướng BBQ dã ngoại' },
      { icon: 'water-outline', label: 'Khu chèo SUP an toàn' },
    ],
    policies: [
      'Giữ gìn vệ sinh chung, dọn dẹp rác sau tiệc nướng',
      'Mặc áo phao khi tham gia các trò chơi dưới nước',
    ],
    ticketTypes: [
      {
        id: 'do1',
        name: 'Vé Tàu Khứ Hồi & Tham Quan Đảo Trong Ngày',
        price: 290000,
        desc: 'Bao gồm tàu cao tốc đưa đón khứ hồi + phí bảo tồn sinh thái đảo',
      },
      {
        id: 'do2',
        name: 'Combo Tham Quan + Chèo SUP 2 Giờ',
        price: 450000,
        desc: 'Tàu khứ hồi + thuê ván SUP cao cấp kèm áo phao cứu hộ + hướng dẫn an toàn',
      },
      {
        id: 'do3',
        name: 'Gói Glamping Cắm Trại Qua Đêm (2N1Đ)',
        price: 850000,
        desc: 'Tàu khứ hồi + Lều canvas nệm hơi ven hồ + Tiệc nướng BBQ tối + Ăn sáng',
      },
    ],
    address: 'Thị trấn Vĩnh An, Huyện Vĩnh Cửu, Tỉnh Đồng Nai',
  },

  // 4. Ma Thiên Lãnh - Tây Ninh
  {
    id: 'ma-thien-lanh',
    name: 'Khu Sinh Thái Thung Lũng Ma Thiên Lãnh',
    location: 'TP. Tây Ninh, Tây Ninh',
    province: 'Tây Ninh',
    desc: 'Trekking nhẹ, suối đá trong vắt, cắm trại glamping bên suối dưới chân Núi Bà Đen hùng vĩ.',
    longDesc: 'Nằm nép mình giữa ba ngọn núi Bà Đen - Núi Phụng - Núi Heo, thung lũng Ma Thiên Lãnh sở hữu khí hậu mát mẻ tựa Đà Lạt, cảnh quan rừng nguyên sinh rậm rạp cùng những dòng suối đá tuyệt đẹp.',
    price: 'Từ 200.000đ',
    priceNum: 200000,
    rating: '4.9',
    tag: 'Rừng & Suối tự nhiên',
    featureHighlight: '• Trekking rừng & Suối Vàng tự nhiên',
    ticketCount: '3 gói vé',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '07:00 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Người yêu thiên nhiên & Trekking',
    activities: [
      'Trekking 3km đường mòn xuyên rừng nguyên sinh Ma Thiên Lãnh',
      'Tắm suối Vàng trong vắt và check-in tảng đá thiền',
      'Bữa trưa gà đồi nướng mọi chấm muối ớt Tây Ninh và rau rừng',
      'Cắm trại dã ngoại ngắm hoàng hôn buông xuống thung lũng',
    ],
    facilities: [
      { icon: 'bonfire-outline', label: 'Khu cắm trại Glamping' },
      { icon: 'compass-outline', label: 'Hướng dẫn viên bản địa' },
      { icon: 'shield-checkmark-outline', label: 'Bảo hiểm du lịch' },
    ],
    policies: [
      'Khuyến khích mang giày thể thao bám đường tốt',
      'Không xả rác và không tự ý đốt lửa ngoài khu quy định',
    ],
    ticketTypes: [
      {
        id: 'mtl1',
        name: 'Vé trải nghiệm Khám phá Suối Rừng',
        price: 200000,
        desc: 'Bao gồm hướng dẫn viên dẫn đường, gậy leo núi, nước suối và phí bảo hiểm',
      },
      {
        id: 'mtl2',
        name: 'Combo Trekking Rừng + Bữa trưa Rau Rừng',
        price: 390000,
        desc: 'Trọn gói tour có HDV + Set ăn trưa đặc sản gà nướng cơm lam rau rừng Tây Ninh',
      },
      {
        id: 'mtl3',
        name: 'Gói Glamping Cắm Trại Bên Suối (2N1Đ)',
        price: 750000,
        desc: 'Lều canvas cao cấp ven suối, tiệc BBQ tối, ăn sáng và cà phê sáng giữa rừng',
      },
    ],
    address: 'Thung lũng Ma Thiên Lãnh, Xã Thạnh Tân, TP. Tây Ninh',
  },

  // 5. Chèo SUP Rừng Ngập Mặn - Vũng Tàu
  {
    id: 'cheo-sup-vung-tau',
    name: 'Khu Sinh Thái Chèo SUP Rừng Ngập Mặn Vũng Tàu',
    location: 'Đảo Long Sơn, Vũng Tàu, Bà Rịa - Vũng Tàu',
    province: 'Vũng Tàu',
    desc: 'Hành trình chèo SUP đón bình minh / hoàng hôn giữa cánh rừng ngập mặn xanh biếc và thưởng thức hàu nướng Long Sơn.',
    longDesc: 'Trải nghiệm thể thao sinh thái độc đáo tại sông Rạng và đảo Long Sơn. Du khách sẽ được lướt ván chèo đứng len lỏi giữa những rặng đước, sú vẹt cổ thụ, hít thở không khí biển trong lành và chụp ảnh flycam chuyên nghiệp.',
    price: 'Từ 350.000đ',
    priceNum: 350000,
    rating: '4.9',
    tag: 'Chèo SUP & Biển đảo',
    featureHighlight: '• Chèo SUP ngập mặn & Thưởng thức hàu',
    ticketCount: '3 ca chèo',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '05:30 - 18:00 (Theo ca chèo)',
    availableDates: 'Theo lịch đã chọn',
    targetAudience: 'Mọi du khách & Giới trẻ',
    activities: [
      'Được huấn luyện kỹ thuật chèo SUP cơ bản trong 15 phút',
      'Chèo lướt trên mặt nước đón bình minh rực rỡ trên vịnh',
      'Tặng bộ ảnh chụp bằng máy cơ và quay Flycam góc rộng',
      'Ghé nhà bè Long Sơn thưởng thức hàu tươi nướng mỡ hành',
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Ván SUP & Áo phao xịn' },
      { icon: 'camera-outline', label: 'Chụp ảnh Flycam miễn phí' },
      { icon: 'shirt-outline', label: 'Phòng thay đồ & Tắm tráng' },
    ],
    policies: [
      'Bắt buộc mặc áo phao cứu sinh trong suốt buổi chèo',
      'Trẻ em từ 6 tuổi có thể tham gia cùng người lớn',
    ],
    ticketTypes: [
      {
        id: 'sup1',
        name: 'Vé Chèo SUP Đón Bình Minh (05:30 - 08:30)',
        price: 350000,
        desc: 'Bao gồm SUP, mái chèo, áo phao, HDV hướng dẫn và chụp ảnh kỷ niệm',
      },
      {
        id: 'sup2',
        name: 'Vé Chèo SUP Hoàng Hôn & Thưởng Thức Hàu',
        price: 550000,
        desc: 'Ca chiều 15:30 - 18:00 + Set 6 con hàu nướng mỡ hành tại bè Long Sơn',
      },
    ],
    address: 'Bến thuyền Sông Rạng, Xã Long Sơn, TP. Vũng Tàu',
  },

  // 6. Thung Nham - Ninh Bình
  {
    id: 'thung-nham',
    name: 'Khu Du Lịch Sinh Thái Vườn Chim Thung Nham',
    location: 'Hoa Lư, Ninh Bình',
    province: 'Ninh Bình',
    desc: 'Vương quốc chim hoang dã với hơn 40 loài quý hiếm, khám phá Hang Bụt huyền ảo và vườn cây ăn trái quanh năm.',
    longDesc: 'Thung Nham toạ lạc trọn vẹn trong vùng lõi quần thể Di sản Tràng An, nơi núi non đá vôi sừng sững ôm trọn hồ nước thơ mộng, quy tụ hàng vạn cánh chim bay rợp trời lúc hoàng hôn.',
    price: 'Từ 150.000đ',
    priceNum: 150000,
    rating: '4.8',
    tag: 'Vườn chim hoang dã',
    featureHighlight: '• Tàu thăm vườn chim & Hang Bụt',
    ticketCount: '3 gói vé',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '07:00 - 18:00',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Gia đình & Mọi lứa tuổi',
    activities: [
      'Đi thuyền nan ngắm hàng vạn cá thể cò, vạc bay về tổ lúc chiều tà',
      'Thám hiểm Hang Bụt thạch nhũ lung linh dài 500m bằng đèn pin',
      'Check-in Động Vái Giời trên đỉnh núi cao 88 bậc đá',
      'Thưởng thức dê núi nướng tảng và cơm cháy Ninh Bình giòn rụm',
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Bến thuyền nan có chèo' },
      { icon: 'bicycle-outline', label: 'Cho thuê xe đạp dạo hồ' },
      { icon: 'restaurant-outline', label: 'Nhà hàng đặc sản dê núi' },
    ],
    policies: [
      'Trẻ em dưới 0.8m miễn phí, từ 0.8m - 1.3m vé trẻ em',
      'Thời gian ngắm chim đẹp nhất là từ 16:30 - 17:30 mỗi ngày',
    ],
    ticketTypes: [
      {
        id: 'tn1',
        name: 'Vé vào cổng & Hang Động Tham Quan',
        price: 150000,
        desc: 'Tham quan Động Vái Giời, Cây Đa Di Chuyển, Vườn hoa bốn mùa',
      },
      {
        id: 'tn2',
        name: 'Combo Vé Cổng + Thuyền Thăm Vườn Chim',
        price: 200000,
        desc: 'Toàn bộ điểm tham quan + vé thuyền nan ngắm chim chiều tà',
      },
    ],
    address: 'Thôn Hải Nham, Xã Ninh Hải, Huyện Hoa Lư, Tỉnh Ninh Bình',
  },

  // 7. Gáo Giồng - Đồng Tháp
  {
    id: 'gao-giong',
    name: 'Khu Du Lịch Sinh Thái Rừng Tràm Gáo Giồng',
    location: 'Cao Lãnh, Đồng Tháp',
    province: 'Đồng Tháp',
    desc: 'Lướt xuồng ba lá xuyên rừng tràm ngập nước 1.700ha, chiêm ngưỡng sân chim trời và ẩm thực sen Đồng Tháp.',
    longDesc: 'Gáo Giồng được mệnh danh là Đồng Tháp Mười thu nhỏ, nổi bật với màu xanh bạt ngàn của rừng tràm, thảm bèo hoa dâu dập dềnh và tiếng chim hót ríu rít suốt dọc đường đi.',
    price: 'Từ 80.000đ',
    priceNum: 80000,
    rating: '4.8',
    tag: 'Rừng tràm miền Tây',
    featureHighlight: '• Xuồng ba lá & Cơm lá sen đặc sản',
    ticketCount: '3 gói vé',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '07:30 - 17:00',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Gia đình & Đoàn bạn',
    activities: [
      'Ngồi xuồng ba lá do các cô thôn nữ áo bà ba chèo len lỏi qua rừng tràm',
      'Lên đài quan sát cao 18m ngắm toàn cảnh rừng tràm ngút ngàn',
      'Ăn cá lóc nướng trui cuốn lá sen non chấm mắm me chua ngọt',
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Xuồng ba lá truyền thống' },
      { icon: 'restaurant-outline', label: 'Nhà chòi ẩm thực ven rạch' },
    ],
    policies: [
      'Nên đi vào buổi sáng hoặc tầm xế chiều để ngắm chim nhiều nhất',
    ],
    ticketTypes: [
      {
        id: 'gg1',
        name: 'Vé vào cổng & Đi xuồng ba lá ngắm cảnh',
        price: 80000,
        desc: 'Bao gồm vé vào cổng, xuồng ba lá tham quan và trà sen đón khách',
      },
      {
        id: 'gg2',
        name: 'Combo Sinh Thái Đồng Quê Có Ăn Trưa',
        price: 320000,
        desc: 'Trọn gói vé xuồng + Set ăn trưa cá lóc nướng trui cuốn lá sen non',
      },
    ],
    address: 'Ấp 6, Xã Gáo Giồng, Huyện Cao Lãnh, Tỉnh Đồng Tháp',
  },

  // 8. Cầu Đất Farm - Đà Lạt
  {
    id: 'cau-dat-farm',
    name: 'Nông Trại Cà Phê Sinh Thái Cầu Đất Farm Đà Lạt',
    location: 'TP. Đà Lạt, Lâm Đồng',
    province: 'Đà Lạt',
    desc: 'Đồi chè 100 năm tuổi, săn mây trên thảm gỗ, trải nghiệm hái cà phê Arabica thủ công và ngắm tua-bin gió.',
    longDesc: 'Tọa lạc ở độ cao hơn 1.650m so với mực nước biển, Cầu Đất Farm mang đến bầu không khí se lạnh tinh khôi, khung cảnh mây luồn qua thung lũng thông xanh và những nương chè, nương cà phê xanh mướt trải dài vô tận.',
    price: 'Từ 120.000đ',
    priceNum: 120000,
    rating: '4.9',
    tag: 'Săn mây & Cà phê',
    featureHighlight: '• Sàn gỗ săn mây & Hái cà phê',
    ticketCount: '2 gói vé',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '06:00 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Giới trẻ, Cặp đôi & Gia đình',
    activities: [
      'Đón bình minh săn mây trên sàn gỗ cầu kính vô cực',
      'Theo chân nghệ nhân học hái quả cà phê chín mọng và rang thủ công',
      'Thưởng thức tách cà phê Arabica Cầu Đất đậm đà trứ danh',
    ],
    facilities: [
      { icon: 'cafe-outline', label: 'Quán cà phê đồi chè view 360°' },
      { icon: 'train-outline', label: 'Xe điện đưa đón đồi chè' },
    ],
    policies: [
      'Nên có mặt trước 06:30 sáng để đón biển mây đẹp nhất',
    ],
    ticketTypes: [
      {
        id: 'cd1',
        name: 'Vé Săn Mây & Tham Quan Đồi Chè',
        price: 120000,
        desc: 'Bao gồm xe điện lên đồi, vé vào cầu gỗ săn mây và 1 phần nước tự chọn',
      },
      {
        id: 'cd2',
        name: 'Tour Trải Nghiệm Nông Nghiệp Cà Phê',
        price: 260000,
        desc: 'Trải nghiệm hái cà phê + nếm thử 3 loại cà phê + tặng túi cà phê 250g',
      },
    ],
    address: 'Thôn Trường Thọ, Xã Trạm Hành, TP. Đà Lạt, Tỉnh Lâm Đồng',
  },

  // 9. Rạch Vẹm - Phú Quốc
  {
    id: 'rach-vem-phu-quoc',
    name: 'Khu Bảo Tồn Sinh Thái Biển Rạch Vẹm - Phú Quốc',
    location: 'Gành Dầu, Phú Quốc, Kiên Giang',
    province: 'Phú Quốc',
    desc: 'Làng chài hoang sơ, vương quốc sao biển đỏ, cano lướt sóng qua Mũi Hàm Rồng và lặn ngắm rạn san hô tự nhiên.',
    longDesc: 'Rạch Vẹm là điểm đến sinh thái biển nguyên sơ bậc nhất đảo ngọc Phú Quốc với bãi cát trắng mịn, nước biển trong vắt nhìn thấu đáy và hàng trăm chú sao biển đỏ tự nhiên nằm phơi mình dưới làn nước êm dịu.',
    price: 'Từ 250.000đ',
    priceNum: 250000,
    rating: '4.8',
    tag: 'Bảo tồn biển & Sao biển',
    featureHighlight: '• Cano & Lặn ngắm sao biển đỏ',
    ticketCount: '2 gói vé',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '08:00 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Mọi du khách yêu biển',
    activities: [
      'Cano cao tốc chở khách ra bãi Mũi Hàm Rồng hoang sơ',
      'Chụp ảnh check-in cùng đàn sao biển đỏ trong làn nước trong vắt',
      'Trang bị kính lặn và ống thở khám phá rạn san hô tự nhiên',
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Cano cao tốc đời mới' },
      { icon: 'restaurant-outline', label: 'Nhà bè hải sản trên biển' },
    ],
    policies: [
      'Tuyệt đối không nhấc sao biển lên khỏi mặt nước để bảo vệ sinh vật biển',
    ],
    ticketTypes: [
      {
        id: 'rv1',
        name: 'Vé Cano Khứ Hồi Ra Bãi Sao Biển Mũi Hàm Rồng',
        price: 250000,
        desc: 'Bao gồm cano khứ hồi, áo phao, nước suối và tắm tráng nước ngọt',
      },
    ],
    address: 'Làng chài Rạch Vẹm, Xã Gành Dầu, TP. Phú Quốc, Tỉnh Kiên Giang',
  },

  // 10. Rừng Tràm Trà Sư - An Giang
  {
    id: 'tra-su',
    name: 'Khu Du Lịch Sinh Thái Rừng Tràm Trà Sư',
    location: 'Tịnh Biên, An Giang',
    province: 'An Giang',
    desc: 'Cầu tre vạn bước dài nhất Việt Nam xuyên qua thảm bèo cám xanh mướt, tắc ráng lướt sóng và ngắm chim nước.',
    longDesc: 'Trà Sư là viên ngọc sinh thái nổi bật nhất vùng Thất Sơn An Giang. Cảnh sắc nơi đây đẹp tựa thiên đường cổ tích với thảm bèo phủ kín mặt nước và những hàng tràm thẳng tắp soi bóng lung linh.',
    price: 'Từ 100.000đ',
    priceNum: 100000,
    rating: '4.9',
    tag: 'Thảm bèo xanh biếc',
    featureHighlight: '• Cầu tre vạn bước & Tắc ráng máy',
    ticketCount: '2 gói vé',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '07:00 - 17:15',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Gia đình & Giới trẻ',
    activities: [
      'Đi bộ trên cầu tre vạn bước xuyên rừng tràm',
      'Trải nghiệm tắc ráng máy lướt rẽ thảm bèo xanh',
      'Ngắm chim từ tháp quan sát kính thiên văn',
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Tắc ráng máy & Xuồng chèo tay' },
      { icon: 'restaurant-outline', label: 'Nhà hàng ẩm thực An Giang' },
    ],
    policies: [
      'Thời điểm bèo xanh đẹp nhất là từ 7:30 đến 9:30 sáng',
    ],
    ticketTypes: [
      {
        id: 'ts1',
        name: 'Vé Cầu Tre + Tắc Ráng Tham Quan Trà Sư',
        price: 100000,
        desc: 'Bao gồm vé cổng, đi bộ cầu tre và tắc ráng máy tham quan vùng lõi',
      },
    ],
    address: 'Ấp Văn Trà, Xã Văn Giáo, TX. Tịnh Biên, Tỉnh An Giang',
  },

  // 11. Cồn Phụng - Bến Tre
  {
    id: 'con-phung',
    name: 'Khu Du Lịch Sinh Thái Cồn Phụng - Bến Tre',
    location: 'Châu Thành, Bến Tre',
    province: 'Bến Tre',
    desc: 'Thiên đường cù lao dừa nước, tham quan di tích Đạo Dừa, nghe đờn ca tài tử và thưởng thức kẹo dừa nóng hổi.',
    longDesc: 'Nằm giữa dòng sông Tiền thơ mộng, Cồn Phụng là điểm đến sinh thái miệt vườn đặc trưng xứ dừa Bến Tre với những con rạch rợp bóng dừa nước mát lành và không gian văn hóa dân gian đậm đà.',
    price: 'Từ 85.000đ',
    priceNum: 850000,
    rating: '4.8',
    tag: 'Miệt vườn xứ Dừa',
    featureHighlight: '• Xuồng ba lá & Đờn ca tài tử',
    ticketCount: '2 gói vé',
    image: 'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '07:30 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Đoàn khách, Gia đình',
    activities: [
      'Đi xuồng ba lá len lỏi trong rạch dừa nước rợp bóng râm',
      'Thưởng thức trái cây theo mùa và nghe đờn ca tài tử',
      'Trải nghiệm làm kẹo dừa truyền thống tại lò thủ công',
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Tàu du lịch đưa đón sông Tiền' },
      { icon: 'musical-notes-outline', label: 'Sân khấu đờn ca tài tử' },
    ],
    policies: [
      'Vé đã bao gồm tàu đưa đón qua cù lao khứ hồi',
    ],
    ticketTypes: [
      {
        id: 'cp1',
        name: 'Vé Tham Quan Sinh Thái Cồn Phụng',
        price: 85000,
        desc: 'Bao gồm tàu đưa đón, vé cổng, trà mật ong phấn hoa và nghe đờn ca tài tử',
      },
    ],
    address: 'Ấp 10, Xã Tân Thạch, Huyện Châu Thành, Tỉnh Bến Tre',
  },

  // 12. Vườn Quốc Gia Cát Tiên - Đồng Nai
  {
    id: 'cat-tien',
    name: 'Khu Bảo Tồn Sinh Thái Vườn Quốc Gia Cát Tiên',
    location: 'Tân Phú, Đồng Nai',
    province: 'Đồng Nai',
    desc: 'Khu dự trữ sinh quyển thế giới: ngắm thú đêm hoang dã bằng xe mui trần, khám phá Bàu Sấu và cây Tung đại thụ 500 năm.',
    longDesc: 'Cát Tiên là một trong những khu dự trữ sinh quyển lớn nhất Đông Nam Á, nơi bảo tồn hàng ngàn loài động thực vật quý hiếm với trải nghiệm tour xem thú đêm độc nhất vô nhị.',
    price: 'Từ 180.000đ',
    priceNum: 180000,
    rating: '4.9',
    tag: 'Rừng nguyên sinh UNESCO',
    featureHighlight: '• Xe mui trần ngắm thú đêm & Bàu Sấu',
    ticketCount: '3 gói vé',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    ],
    operatingHours: '06:30 - 20:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Người yêu động vật & Thiên nhiên',
    activities: [
      'Đi xe mui trần ngắm hươu, nai, bò tót kiếm ăn ban đêm',
      'Trekking 5km khám phá vùng đất ngập nước Bàu Sấu',
      'Check-in Cây Tung khổng lồ với bộ rễ bành trướng vĩ đại',
    ],
    facilities: [
      { icon: 'car-sport-outline', label: 'Xe mui trần chuyên dụng ngắm thú' },
      { icon: 'flashlight-outline', label: 'Đèn pha chuyên dụng ban đêm' },
    ],
    policies: [
      'Tuyệt đối không gây ồn hay chiếu đèn laser vào mắt thú rừng',
    ],
    ticketTypes: [
      {
        id: 'ct1',
        name: 'Vé Cổng & Xe Đạp Khám Phá Cây Tung',
        price: 180000,
        desc: 'Bao gồm vé vào cổng VQG + phà qua sông Đồng Nai + thuê xe đạp dạo rừng',
      },
    ],
    address: 'Xã Nam Cát Tiên, Huyện Tân Phú, Tỉnh Đồng Nai',
  },
];

export default function KhuSinhThaiScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tất cả');
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

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setSearchText('');
    setAppliedSearch('');
    setIsSearchFocused(false);
  };

  const handleSelectSuggestion = (suggestion: { title: string; tag: string }) => {
    setSelectedTag(suggestion.tag);
    setSearchText(suggestion.title);
    setAppliedSearch(suggestion.title);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleOpenPlace = (place: EcoPlace) => {
    router.push({
      pathname: '/chi-tiet-khu-sinh-thai',
      params: {
        id: place.id,
        name: place.name,
        location: place.location,
        desc: place.desc,
        image: place.image,
        tag: place.tag,
        price: place.price,
      },
    });
  };

  // Search suggestions auto-filter
  const searchSuggestions = useMemo(() => {
    const q = searchText.trim();
    if (!q) {
      return POPULAR_ECO_SUGGESTIONS;
    }
    return POPULAR_ECO_SUGGESTIONS.filter(
      (s) => matchVietnameseSearch(s.title, q) || matchVietnameseSearch(s.subtitle, q)
    );
  }, [searchText]);

  // Main filtered places
  const filteredPlaces = useMemo(() => {
    const activeQ = appliedSearch || searchText;

    return ECO_PLACES.filter((place) => {
      if (activeQ.trim()) {
        const matchName = matchVietnameseSearch(place.name, activeQ);
        const matchLoc = matchVietnameseSearch(place.location, activeQ);
        const matchDesc = matchVietnameseSearch(place.desc, activeQ);
        const matchProv = matchVietnameseSearch(place.province, activeQ);
        if (!matchName && !matchLoc && !matchDesc && !matchProv) {
          return false;
        }
      }

      if (selectedTag !== 'Tất cả' && !activeQ.trim()) {
        const matchTag =
          matchVietnameseSearch(place.province, selectedTag) ||
          matchVietnameseSearch(place.location, selectedTag) ||
          matchVietnameseSearch(place.name, selectedTag);
        if (!matchTag) return false;
      }

      return true;
    });
  }, [appliedSearch, searchText, selectedTag]);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [appliedSearch, selectedTag]);

  // Paginated list
  const displayedPlaces = useMemo(() => {
    return filteredPlaces.slice(0, visibleCount);
  }, [filteredPlaces, visibleCount]);

  const hasMore = visibleCount < filteredPlaces.length;
  const remainingCount = Math.max(0, filteredPlaces.length - visibleCount);

  // Big Featured Spotlight Place (Chavi Garden)
  const spotlightPlace = ECO_PLACES[0];

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

          {/* Center Title & Status Indicator */}
          <View style={styles.headerCenterTitle}>
            <Text style={styles.headerMainTitle}>Khu sinh thái & Thiên nhiên</Text>
            <View style={styles.headerSubtitleRow}>
              <View style={styles.liveIndicatorDot} />
              <Text style={styles.headerSubtext}>Khám phá & trải nghiệm xanh</Text>
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
            placeholder="Tìm khu sinh thái, Tây Ninh, Đà Lạt, chèo SUP..."
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
                {searchText.trim() ? 'GỢI Ý PHÙ HỢP' : 'ĐỊA ĐIỂM SINH THÁI PHỔ BIẾN'}
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
                    <Ionicons name="leaf" size={14} color="#0F382C" />
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
        {/* BEGIN: Quick Filter Tabs (Horizontal Scroll) */}
        <View style={styles.quickFilterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFilterScroll}
          >
            {PROVINCE_TAGS.map((item, idx) => {
              const isActive =
                (selectedTag === item && !appliedSearch) ||
                (appliedSearch && matchVietnameseSearch(item, appliedSearch)) ||
                (item === 'Tất cả' && !appliedSearch && selectedTag === 'Tất cả');

              return (
                <Pressable
                  key={idx}
                  style={[styles.quickFilterChip, isActive && styles.quickFilterChipActive]}
                  onPress={() => handleSelectTag(item)}
                >
                  <Text style={[styles.quickFilterChipText, isActive && styles.quickFilterChipTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        {/* END: Quick Filter Tabs */}

        {/* BEGIN: Hero Guide Spotlight Card */}
        <View style={styles.heroGuideSection}>
          <View style={styles.heroGuideCard}>
            {/* Dark Emerald Gradient Overlay */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1200&q=80' }}
              style={styles.heroGuideBgImage}
              contentFit="cover"
            />
            <View style={styles.heroGuideGradientOverlay} />

            <View style={styles.heroGuideContent}>
              {/* Badge & Action Header */}
              <View style={styles.heroGuideBadgeRow}>
                <View style={styles.guideTagPill}>
                  <Text style={styles.guideTagPillText}>🌿 CẨM NANG KHU SINH THÁI</Text>
                </View>
                <View style={styles.guideRecommendPill}>
                  <Text style={styles.guideRecommendPillText}>Đề xuất mới</Text>
                </View>
              </View>

              {/* Hero Main Content */}
              <Text style={styles.heroGuideMainTitle}>
                Khám Phá Khu Sinh Thái & Thiên Nhiên
              </Text>
              <Text style={styles.heroGuideSubtitle}>
                Trải nghiệm rừng xanh, sông nước, chèo SUP và ẩm thực đồng quê đích thực cuối tuần.
              </Text>

              {/* Hero Bottom Bar */}
              <View style={styles.heroGuideBottomBar}>
                <View style={styles.heroGuideGuaranteeRow}>
                  <Ionicons name="checkmark-circle" size={15} color="#34d399" />
                  <Text style={styles.heroGuideGuaranteeText}>100% Giá & Ưu đãi chuẩn</Text>
                </View>
                <Pressable
                  style={styles.heroGuideCtaBtn}
                  onPress={() => handleOpenPlace(spotlightPlace)}
                >
                  <Text style={styles.heroGuideCtaBtnText}>Xem gợi ý</Text>
                  <Ionicons name="arrow-forward" size={13} color="#ffffff" style={{ marginLeft: 3 }} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        {/* END: Hero Guide Spotlight Card */}

        {/* BEGIN: Featured Destinations List (Cards Stack) */}
        <View style={styles.listingsSection}>
          {/* Header with Counter Badge */}
          <View style={styles.listingsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listingsEyebrow}>ĐIỂM ĐẾN NỔI BẬT</Text>
              <Text style={styles.listingsTitle}>
                {appliedSearch
                  ? `Kết quả cho "${appliedSearch}"`
                  : selectedTag !== 'Tất cả'
                  ? `Khu sinh thái tại ${selectedTag}`
                  : 'Khu sinh thái đáng trải nghiệm'}
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredPlaces.length} điểm đến
              </Text>
            </View>
          </View>

          {/* Empty State */}
          {filteredPlaces.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Không tìm thấy khu sinh thái phù hợp</Text>
              <Text style={styles.emptyStateSub}>
                Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh sách.
              </Text>
              <Pressable
                style={styles.resetFilterBtn}
                onPress={() => {
                  setSelectedTag('Tất cả');
                  setSearchText('');
                  setAppliedSearch('');
                }}
              >
                <Text style={styles.resetFilterBtnText}>Xem tất cả điểm đến</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {/* Card 1: Chavi Garden - Big Hero Spotlight Card (matching Stitch Card 1) */}
              {selectedTag === 'Tất cả' && !appliedSearch && (
                <Pressable
                  style={styles.spotlightBigCard}
                  onPress={() => handleOpenPlace(spotlightPlace)}
                >
                  <View style={styles.spotlightImageContainer}>
                    <Image
                      source={{ uri: spotlightPlace.image }}
                      style={styles.spotlightImage}
                      contentFit="cover"
                    />
                    <View style={styles.spotlightGradientOverlay} />

                    {/* Category & Rating Badges */}
                    <View style={styles.spotlightBadgesTop}>
                      <View style={styles.spotlightCategoryBadge}>
                        <Ionicons name="leaf" size={12} color="#059669" />
                        <Text style={styles.spotlightCategoryText}>{spotlightPlace.tag}</Text>
                      </View>
                      <View style={styles.spotlightRatingBadge}>
                        <Text style={styles.spotlightRatingStar}>★</Text>
                        <Text style={styles.spotlightRatingValue}>{spotlightPlace.rating || '4.9'}</Text>
                      </View>
                    </View>

                    {/* Inside-Image Bottom Title & Location */}
                    <View style={styles.spotlightMetaBottom}>
                      <Text style={styles.spotlightTitle} numberOfLines={1}>
                        {spotlightPlace.name}
                      </Text>
                      <View style={styles.spotlightLocationRow}>
                        <Ionicons name="location-sharp" size={13} color="#fcd34d" />
                        <Text style={styles.spotlightLocationText} numberOfLines={1}>
                          {spotlightPlace.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Body Content */}
                  <View style={styles.spotlightBody}>
                    <Text style={styles.spotlightDesc} numberOfLines={2}>
                      {spotlightPlace.desc}
                    </Text>

                    {/* Attributes & Info Chips */}
                    <View style={styles.spotlightChipsRow}>
                      <View style={styles.spotlightTimeChip}>
                        <Ionicons name="time-outline" size={13} color="#64748b" />
                        <Text style={styles.spotlightTimeText}>{spotlightPlace.operatingHours}</Text>
                      </View>
                      <View style={styles.spotlightTicketPill}>
                        <Ionicons name="ticket-outline" size={13} color="#059669" />
                        <Text style={styles.spotlightTicketText}>{spotlightPlace.ticketCount}</Text>
                      </View>
                    </View>

                    {/* Price & CTA Button */}
                    <View style={styles.spotlightFooterRow}>
                      <View>
                        <Text style={styles.spotlightPriceLabel}>Giá vé trọn gói từ</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                          <Text style={styles.spotlightPriceValue}>{spotlightPlace.price}</Text>
                          <Text style={styles.spotlightPriceUnit}>/vé</Text>
                        </View>
                      </View>

                      <Pressable
                        style={styles.spotlightBookBtn}
                        onPress={() => handleOpenPlace(spotlightPlace)}
                      >
                        <Text style={styles.spotlightBookBtnText}>Đặt vé ngay</Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              )}

              {/* Listings Stack (Horizontal Dark Emerald Eco Cards) */}
              <View style={styles.cardsStack}>
                {displayedPlaces
                  .filter((p) => selectedTag !== 'Tất cả' || appliedSearch ? true : p.id !== spotlightPlace.id)
                  .map((place) => (
                    <Pressable
                      key={place.id}
                      style={styles.ecoCard}
                      onPress={() => handleOpenPlace(place)}
                    >
                      {/* Thumbnail Container */}
                      <View style={styles.thumbnailContainer}>
                        <Image
                          source={{ uri: place.image }}
                          style={styles.thumbnailImage}
                          contentFit="cover"
                        />
                        {/* Rating badge */}
                        <View style={styles.cardRatingBadge}>
                          <Text style={styles.cardRatingStar}>★</Text>
                          <Text style={styles.cardRatingValue}>{place.rating || '4.8'}</Text>
                        </View>
                        {/* Tag Badge */}
                        <View style={styles.cardTypeBadge}>
                          <Text style={styles.cardTypeBadgeText} numberOfLines={1}>
                            {place.tag}
                          </Text>
                        </View>
                      </View>

                      {/* Content Container */}
                      <View style={styles.cardContent}>
                        <View>
                          <Text style={styles.cardTitle} numberOfLines={2}>
                            {place.name}
                          </Text>
                          <View style={styles.cardLocationRow}>
                            <Ionicons name="location-sharp" size={13} color="#059669" />
                            <Text style={styles.cardLocationText} numberOfLines={1}>
                              {place.location}
                            </Text>
                          </View>
                          {/* Feature Highlight Pill */}
                          <View style={styles.cardFeaturePill}>
                            <View style={styles.cardFeatureDot} />
                            <Text style={styles.cardFeatureText} numberOfLines={1}>
                              {place.featureHighlight || place.activities[0] || 'Trải nghiệm sinh thái'}
                            </Text>
                          </View>
                        </View>

                        {/* Price & Booking Button Row */}
                        <View style={styles.cardFooterRow}>
                          <View>
                            <Text style={styles.cardPriceLabel}>Giá từ</Text>
                            <Text style={styles.cardPriceValue}>{place.price}</Text>
                          </View>

                          <Pressable
                            style={styles.cardBookBtn}
                            onPress={() => handleOpenPlace(place)}
                          >
                            <Text style={styles.cardBookBtnText}>Đặt vé</Text>
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
                        Xem thêm {Math.min(ITEMS_PER_PAGE, remainingCount)} điểm đến
                      </Text>
                      <Text style={styles.loadMoreBtnSubtitle}>
                        Đang hiển thị {displayedPlaces.length} / {filteredPlaces.length} khu sinh thái
                      </Text>
                    </View>
                    <View style={styles.loadMoreIconCircle}>
                      <Ionicons name="chevron-down" size={18} color="#ffffff" />
                    </View>
                  </Pressable>
                </View>
              )}

              {/* All loaded footer */}
              {!hasMore && filteredPlaces.length > ITEMS_PER_PAGE && (
                <View style={styles.allLoadedSection}>
                  <View style={styles.allLoadedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    <Text style={styles.allLoadedText}>
                      Đã hiển thị tất cả {filteredPlaces.length} khu sinh thái
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
        {/* END: Featured Destinations List */}

        {/* BEGIN: Inspiration Section (2-Column Grid matching Stitch design) */}
        <View style={styles.inspirationSection}>
          <View style={styles.inspirationHeader}>
            <View>
              <Text style={styles.inspirationEyebrow}>CẢM HỨNG CHO CHUYẾN ĐI</Text>
              <Text style={styles.inspirationTitle}>Điểm đến thiên nhiên tươi mát</Text>
            </View>
            <Pressable
              onPress={() => {
                setSelectedTag('Tất cả');
                setSearchText('');
                setAppliedSearch('');
              }}
            >
              <Text style={styles.inspirationViewAll}>Xem tất cả</Text>
            </Pressable>
          </View>

          {/* 2 Column Cards Grid */}
          <View style={styles.inspirationGrid}>
            {INSPIRATION_ITEMS.map((item, idx) => (
              <Pressable
                key={idx}
                style={styles.inspirationCard}
                onPress={() => {
                  setSelectedTag(item.filterTag);
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
        {/* END: Inspiration Section */}

      </ScrollView>
    </View>
  );
}

const INSPIRATION_ITEMS = [
  {
    id: 'insp-1',
    title: 'Đồng Sen Tháp Mười',
    category: 'Miền Tây',
    countSubtitle: '5+ tour ngắm hoa & chèo xuồng',
    filterTag: 'Đồng Tháp',
    image: 'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-2',
    title: 'Vườn Bưởi & Miệt Vườn',
    category: 'Nông nghiệp',
    countSubtitle: 'Trải nghiệm hái quả tại vườn',
    filterTag: 'Bến Tre',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-3',
    title: 'Rừng Tràm Trà Sư',
    category: 'Rừng ngập nước',
    countSubtitle: 'Cầu tre vạn bước xuyên rừng',
    filterTag: 'An Giang',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-4',
    title: 'Bảo Tồn Biển Rạch Vẹm',
    category: 'Biển đảo',
    countSubtitle: 'Vương quốc sao biển đỏ Phú Quốc',
    filterTag: 'Phú Quốc',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
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
    backgroundColor: '#34d399',
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
    backgroundColor: '#082f25',
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

  // QUICK FILTERS
  quickFilterSection: {
    marginTop: 14,
  },
  quickFilterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  quickFilterChipActive: {
    backgroundColor: '#0F382C',
    borderColor: '#0F382C',
  },
  quickFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  quickFilterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // HERO GUIDE SPOTLIGHT SECTION
  heroGuideSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  heroGuideCard: {
    backgroundColor: '#0F382C',
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  heroGuideBgImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.35,
  },
  heroGuideGradientOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(6, 32, 25, 0.75)',
  },
  heroGuideContent: {
    padding: 18,
    position: 'relative',
    zIndex: 10,
  },
  heroGuideBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  guideTagPill: {
    backgroundColor: 'rgba(6, 47, 37, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  guideTagPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#a7f3d0',
    letterSpacing: 0.3,
  },
  guideRecommendPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  guideRecommendPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6ee7b7',
  },
  heroGuideMainTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 4,
    lineHeight: 24,
  },
  heroGuideSubtitle: {
    fontSize: 12,
    color: 'rgba(209, 250, 229, 0.9)',
    lineHeight: 18,
    marginBottom: 14,
  },
  heroGuideBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.25)',
  },
  heroGuideGuaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroGuideGuaranteeText: {
    fontSize: 11,
    color: '#6ee7b7',
    fontWeight: '600',
  },
  heroGuideCtaBtn: {
    backgroundColor: '#E85A19',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#E85A19',
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
    marginTop: 22,
    paddingHorizontal: 16,
  },
  listingsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  listingsEyebrow: {
    fontSize: 11,
    fontWeight: '900',
    color: '#E85A19',
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

  // SPOTLIGHT BIG CARD (Chavi Garden)
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
    height: 170,
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotlightCategoryText: {
    color: '#0F382C',
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
    gap: 10,
    marginTop: 8,
  },
  spotlightTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotlightTimeText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  spotlightTicketPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
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
    color: '#E85A19',
    marginTop: 1,
  },
  spotlightPriceUnit: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  spotlightBookBtn: {
    backgroundColor: '#E85A19',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E85A19',
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

  // CARDS STACK (Horizontal Dark Emerald Cards)
  cardsStack: {
    gap: 12,
  },
  ecoCard: {
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
    height: 124,
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
    color: '#E85A19',
    marginTop: 1,
  },
  cardBookBtn: {
    backgroundColor: '#E85A19',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E85A19',
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
    marginTop: 26,
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
    color: '#E85A19',
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
