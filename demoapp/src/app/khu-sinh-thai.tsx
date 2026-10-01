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
}

export const ECO_PLACES: EcoPlace[] = [
  {
    id: 'chavi-garden',
    name: 'Khu Du Lịch Sinh Thái Chavi Garden',
    location: 'Bến Lức, Long An (Tiếp giáp Tây Ninh)',
    province: 'Long An',
    desc: 'Khu du lịch sinh thái nông nghiệp công nghệ cao rộng hơn 40ha với vườn chanh bạt ngàn, tắm bùn khoáng, chèo thuyền kayak và ẩm thực đồng quê.',
    longDesc: 'Chavi Garden là tổ hợp sinh thái giáo dục trải nghiệm lớn nhất khu vực miền Nam, sở hữu hệ thống suối khoáng nhân tạo, vườn chanh chuẩn quốc tế, khu chế biến nông sản organic và không gian dã ngoại trong lành.',
    price: 'Từ 150.000đ',
    priceNum: 150000,
    image: 'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=80'
    ],
    operatingHours: '08:00 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Gia đình & Đoàn tham quan',
    tag: 'Sinh thái nông nghiệp',
    ticketCount: '4 gói vé',
    activities: [
      'Tham quan vườn chanh không hạt công nghệ cao rộng 40ha',
      'Tắm suối khoáng nhân tạo và ngâm bùn khoáng thư giãn',
      'Chèo thuyền kayak, đạp vịt trên hồ cảnh quan thơ mộng',
      'Thưởng thức lẩu cá linh bông điên điển và gà nướng lu'
    ],
    facilities: [
      { icon: 'car-outline', label: 'Bãi đỗ xe rộng rãi' },
      { icon: 'wifi-outline', label: 'Wifi miễn phí' },
      { icon: 'restaurant-outline', label: 'Nhà hàng ẩm thực quê' },
      { icon: 'water-outline', label: 'Hồ tắm khoáng bùn' }
    ],
    policies: [
      'Trẻ em dưới 1m được miễn phí vé vào cổng',
      'Không mang theo thức ăn tươi sống vào khu du lịch',
      'Có trang bị áo phao bắt buộc khi tham gia chèo thuyền'
    ],
    ticketTypes: [
      {
        id: 't1',
        name: 'Vé vào cổng & Tham quan sinh thái',
        price: 150000,
        desc: 'Bao gồm vé vào cổng, nước ép chanh tươi welcome và xe điện tham quan toàn khu'
      },
      {
        id: 't2',
        name: 'Combo Tham quan + Tắm bùn khoáng',
        price: 280000,
        desc: 'Vé vào cổng + 60 phút ngâm khoáng nóng thư giãn + tặng khăn tắm cao cấp'
      },
      {
        id: 't3',
        name: 'Combo Trọn gói Chèo Kayak & Ăn trưa',
        price: 450000,
        desc: 'Trọn gói vé cổng + chèo Kayak 2 giờ + Set menu ẩm thực đồng quê 5 món'
      }
    ],
    address: 'Ấp 4, Xã Thạnh Lợi, Huyện Bến Lức, Tỉnh Long An'
  },
  {
    id: 'ma-thien-lanh',
    name: 'Khu Sinh Thái Thung Lũng Ma Thiên Lãnh',
    location: 'TP. Tây Ninh, Tây Ninh',
    province: 'Tây Ninh',
    desc: 'Trekking nhẹ, suối đá trong vắt, cắm trại glamping bên suối dưới chân Núi Bà Đen hùng vĩ.',
    longDesc: 'Nằm nép mình giữa ba ngọn núi Bà Đen - Núi Phụng - Núi Heo, thung lũng Ma Thiên Lãnh sở hữu khí hậu mát mẻ tựa Đà Lạt, cảnh quan rừng nguyên sinh rậm rạp cùng những dòng suối đá tuyệt đẹp.',
    price: 'Từ 200.000đ',
    priceNum: 200000,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
    ],
    operatingHours: '07:00 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Người yêu thiên nhiên & Trekking',
    tag: 'Rừng & Suối tự nhiên',
    ticketCount: '3 gói vé',
    activities: [
      'Trekking 3km đường mòn xuyên rừng nguyên sinh Ma Thiên Lãnh',
      'Tắm suối Vàng trong vắt và check-in tảng đá thiền',
      'Bữa trưa gà đồi nướng mọi chấm muối ớt Tây Ninh và rau rừng',
      'Cắm trại dã ngoại ngắm hoàng hôn buông xuống thung lũng'
    ],
    facilities: [
      { icon: 'bonfire-outline', label: 'Khu cắm trại Glamping' },
      { icon: 'compass-outline', label: 'Hướng dẫn viên bản địa' },
      { icon: 'shield-checkmark-outline', label: 'Bảo hiểm du lịch' },
      { icon: 'cafe-outline', label: 'Quầy nước thảo mộc' }
    ],
    policies: [
      'Khuyến khích mang giày thể thao bám đường tốt',
      'Không xả rác và không tự ý đốt lửa ngoài khu quy định',
      'Giữ trật tự để bảo vệ môi trường sống của các loài chim rừng'
    ],
    ticketTypes: [
      {
        id: 'mtl1',
        name: 'Vé trải nghiệm Khám phá Suối Rừng',
        price: 200000,
        desc: 'Bao gồm hướng dẫn viên dẫn đường, gậy leo núi, nước suối và phí bảo hiểm'
      },
      {
        id: 'mtl2',
        name: 'Combo Trekking Rừng + Bữa trưa Rau Rừng',
        price: 390000,
        desc: 'Trọn gói tour có HDV + Set ăn trưa đặc sản gà nướng cơm lam rau rừng Tây Ninh'
      },
      {
        id: 'mtl3',
        name: 'Gói Glamping Cắm Trại Bên Suối (2N1Đ)',
        price: 750000,
        desc: 'Lều canvas cao cấp ven suối, tiệc BBQ tối, ăn sáng và cà phê sáng giữa rừng'
      }
    ],
    address: 'Thung lũng Ma Thiên Lãnh, Xã Thạnh Tân, TP. Tây Ninh'
  },
  {
    id: 'cheo-sup-vung-tau',
    name: 'Khu Sinh Thái Chèo SUP Rừng Ngập Mặn Vũng Tàu',
    location: 'Đảo Long Sơn, Vũng Tàu, Bà Rịa - Vũng Tàu',
    province: 'Vũng Tàu',
    desc: 'Hành trình chèo SUP đón bình minh / hoàng hôn giữa cánh rừng ngập mặn xanh biếc và thưởng thức hàu nướng Long Sơn.',
    longDesc: 'Trải nghiệm thể thao sinh thái độc đáo tại sông Rạng và đảo Long Sơn. Du khách sẽ được lướt ván chèo đứng len lỏi giữa những rặng đước, sú vẹt cổ thụ, hít thở không khí biển trong lành và chụp ảnh flycam chuyên nghiệp.',
    price: 'Từ 350.000đ',
    priceNum: 350000,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80'
    ],
    operatingHours: '05:30 - 18:00 (Theo ca chèo)',
    availableDates: 'Theo lịch đã chọn',
    targetAudience: 'Mọi du khách & Giới trẻ',
    tag: 'Chèo SUP & Biển đảo',
    ticketCount: '3 ca chèo',
    activities: [
      'Được huấn luyện kỹ thuật chèo SUP cơ bản trong 15 phút',
      'Chèo lướt trên mặt nước đón bình minh rực rỡ trên vịnh',
      'Tặng bộ ảnh chụp bằng máy cơ và quay Flycam góc rộng',
      'Ghé nhà bè Long Sơn thưởng thức hàu tươi nướng mỡ hành'
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Ván SUP & Áo phao xịn' },
      { icon: 'camera-outline', label: 'Chụp ảnh Flycam miễn phí' },
      { icon: 'shirt-outline', label: 'Phòng thay đồ & Tắm tráng' },
      { icon: 'medkit-outline', label: 'Cứu hộ chuyên nghiệp 24/7' }
    ],
    policies: [
      'Bắt buộc mặc áo phao cứu sinh trong suốt buổi chèo',
      'Trẻ em từ 6 tuổi có thể tham gia cùng người lớn',
      'Được dời lịch miễn phí nếu thời tiết có mưa bão'
    ],
    ticketTypes: [
      {
        id: 'sup1',
        name: 'Vé Chèo SUP Đón Bình Minh (05:30 - 08:30)',
        price: 350000,
        desc: 'Bao gồm SUP, mái chèo, áo phao, HDV hướng dẫn và chụp ảnh kỷ niệm'
      },
      {
        id: 'sup2',
        name: 'Vé Chèo SUP Hoàng Hôn & Thưởng Thức Hàu',
        price: 550000,
        desc: 'Ca chiều 15:30 - 18:00 + Set 6 con hàu nướng mỡ hành tại bè Long Sơn'
      },
      {
        id: 'sup3',
        name: 'Gói Chèo SUP Riêng Cho Gia Đình / Nhóm (4 người)',
        price: 1350000,
        desc: 'Có huấn luyện viên đi kèm riêng nhóm, chụp flycam chất lượng cao'
      }
    ],
    address: 'Bến thuyền Sông Rạng, Xã Long Sơn, TP. Vũng Tàu'
  },
  {
    id: 'thung-nham',
    name: 'Khu Du Lịch Sinh Thái Vườn Chim Thung Nham',
    location: 'Hoa Lư, Ninh Bình',
    province: 'Ninh Bình',
    desc: 'Vương quốc chim hoang dã với hơn 40 loài quý hiếm, khám phá Hang Bụt huyền ảo và vườn cây ăn trái quanh năm.',
    longDesc: 'Thung Nham toạ lạc trọn vẹn trong vùng lõi quần thể Di sản Tràng An, nơi núi non đá vôi sừng sững ôm trọn hồ nước thơ mộng, quy tụ hàng vạn cánh chim bay rợp trời lúc hoàng hôn.',
    price: 'Từ 150.000đ',
    priceNum: 150000,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=80'
    ],
    operatingHours: '07:00 - 18:00',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Gia đình & Mọi lứa tuổi',
    tag: 'Vườn chim hoang dã',
    ticketCount: '3 gói vé',
    activities: [
      'Đi thuyền nan ngắm hàng vạn cá thể cò, vạc bay về tổ lúc chiều tà',
      'Thám hiểm Hang Bụt thạch nhũ lung linh dài 500m bằng đèn pin',
      'Check-in Động Vái Giời trên đỉnh núi cao 88 bậc đá',
      'Thưởng thức dê núi nướng tảng và cơm cháy Ninh Bình giòn rụm'
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Bến thuyền nan có chèo' },
      { icon: 'bicycle-outline', label: 'Cho thuê xe đạp dạo hồ' },
      { icon: 'restaurant-outline', label: 'Nhà hàng đặc sản dê núi' },
      { icon: 'leaf-outline', label: 'Vườn cây ăn quả 4 mùa' }
    ],
    policies: [
      'Trẻ em dưới 0.8m miễn phí, từ 0.8m - 1.3m vé trẻ em',
      'Thời gian ngắm chim đẹp nhất là từ 16:30 - 17:30 mỗi ngày',
      'Không sử dụng còi hơi hay gây tiếng ồn lớn tại khu vực làm tổ'
    ],
    ticketTypes: [
      {
        id: 'tn1',
        name: 'Vé vào cổng & Hang Động Tham Quan',
        price: 150000,
        desc: 'Tham quan Động Vái Giời, Cây Đa Di Chuyển, Vườn hoa bốn mùa'
      },
      {
        id: 'tn2',
        name: 'Combo Vé Cổng + Thuyền Thăm Vườn Chim',
        price: 200000,
        desc: 'Toàn bộ điểm tham quan + vé thuyền nan ngắm chim chiều tà'
      },
      {
        id: 'tn3',
        name: 'Combo Trọn Gói Thung Nham + Bữa Trưa Đặc Sản',
        price: 390000,
        desc: 'Vé trọn gói + Thuyền xem chim + Suất ăn đặc sản Dê núi Ninh Bình'
      }
    ],
    address: 'Thôn Hải Nham, Xã Ninh Hải, Huyện Hoa Lư, Tỉnh Ninh Bình'
  },
  {
    id: 'gao-giong',
    name: 'Khu Du Lịch Sinh Thái Rừng Tràm Gáo Giồng',
    location: 'Cao Lãnh, Đồng Tháp',
    province: 'Đồng Tháp',
    desc: 'Lướt xuồng ba lá xuyên rừng tràm ngập nước 1.700ha, chiêm ngưỡng sân chim trời và ẩm thực sen Đồng Tháp.',
    longDesc: 'Gáo Giồng được mệnh danh là Đồng Tháp Mười thu nhỏ, nổi bật với màu xanh bạt ngàn của rừng tràm, thảm bèo hoa dâu dập dềnh và tiếng chim hót ríu rít suốt dọc đường đi.',
    price: 'Từ 80.000đ',
    priceNum: 80000,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744031597-4be71a2d488f?auto=format&fit=crop&w=1000&q=80'
    ],
    operatingHours: '07:30 - 17:00',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Gia đình & Đoàn bạn',
    tag: 'Rừng tràm miền Tây',
    ticketCount: '3 gói vé',
    activities: [
      'Ngồi xuồng ba lá do các cô thôn nữ áo bà ba chèo len lỏi qua rừng tràm',
      'Lên đài quan sát cao 18m ngắm toàn cảnh rừng tràm ngút ngàn',
      'Ăn cá lóc nướng trui cuốn lá sen non chấm mắm me chua ngọt',
      'Thưởng thức trà sen và hạt sen rang sấy giòn bùi'
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Xuồng ba lá truyền thống' },
      { icon: 'telescope-outline', label: 'Đài quan sát kính viễn vọng' },
      { icon: 'fish-outline', label: 'Khu câu cá giải trí' },
      { icon: 'restaurant-outline', label: 'Nhà chòi ẩm thực ven rạch' }
    ],
    policies: [
      'Nên đi vào buổi sáng hoặc tầm xế chiều để ngắm chim nhiều nhất',
      'Được mặc áo bà ba chụp ảnh lưu niệm miễn phí'
    ],
    ticketTypes: [
      {
        id: 'gg1',
        name: 'Vé vào cổng & Đi xuồng ba lá ngắm cảnh',
        price: 80000,
        desc: 'Bao gồm vé vào cổng, xuồng ba lá tham quan và trà sen đón khách'
      },
      {
        id: 'gg2',
        name: 'Combo Xuồng ba lá + Đài quan sát + Câu cá',
        price: 160000,
        desc: 'Toàn bộ trải nghiệm sinh thái + cần câu cá giải trí tại chòi lá'
      },
      {
        id: 'gg3',
        name: 'Combo Sinh Thái Đồng Quê Trọn Gói Có Ăn Trưa',
        price: 320000,
        desc: 'Trọn gói vé xuồng + Set ăn trưa cá lóc nướng trui cuốn lá sen'
      }
    ],
    address: 'Ấp 6, Xã Gáo Giồng, Huyện Cao Lãnh, Tỉnh Đồng Tháp'
  },
  {
    id: 'cau-dat-farm',
    name: 'Nông Trại Cà Phê Sinh Thái Cầu Đất Farm Đà Lạt',
    location: 'TP. Đà Lạt, Lâm Đồng',
    province: 'Đà Lạt',
    desc: 'Đồi chè 100 năm tuổi, săn mây trên thảm gỗ, trải nghiệm hái cà phê Arabica thủ công và nướng BBQ giữa rừng thông.',
    longDesc: 'Tọa lạc ở độ cao hơn 1.650m so với mực nước biển, Cầu Đất Farm mang đến bầu không khí se lạnh tinh khôi, khung cảnh mây luồn qua thung lũng thông xanh và những nương chè, nương cà phê xanh mướt trải dài vô tận.',
    price: 'Từ 120.000đ',
    priceNum: 120000,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
    ],
    operatingHours: '06:00 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Giới trẻ, Cặp đôi & Gia đình',
    tag: 'Săn mây & Cà phê',
    ticketCount: '3 gói vé',
    activities: [
      'Đón bình minh săn mây trên sàn gỗ cầu kính vô cực',
      'Theo chân nghệ nhân học hái quả cà phê chín mọng và rang thủ công',
      'Thưởng thức tách cà phê Arabica Cầu Đất đậm đà trứ danh',
      'Check-in tua-bin điện gió khổng lồ giữa đồi chè xanh mướt'
    ],
    facilities: [
      { icon: 'cafe-outline', label: 'Quán cà phê đồi chè view 360°' },
      { icon: 'train-outline', label: 'Xe điện đưa đón đồi chè' },
      { icon: 'camera-outline', label: 'Sàn gỗ săn mây panorama' },
      { icon: 'storefront-outline', label: 'Cửa hàng nông sản OCOP' }
    ],
    policies: [
      'Nên có mặt trước 06:30 sáng để đón biển mây đẹp nhất',
      'Nhiệt độ sáng sớm có thể xuống dưới 15°C, hãy mang áo ấm'
    ],
    ticketTypes: [
      {
        id: 'cd1',
        name: 'Vé Săn Mây & Tham Quan Đồi Chè',
        price: 120000,
        desc: 'Bao gồm xe điện lên đồi, vé vào cầu gỗ săn mây và 1 phần nước tự chọn'
      },
      {
        id: 'cd2',
        name: 'Tour Trải Nghiệm Nông Nghiệp Cà Phê Nửa Ngày',
        price: 260000,
        desc: 'Trải nghiệm hái cà phê + nếm thử 3 loại cà phê đặc sản + tặng túi cà phê 250g'
      }
    ],
    address: 'Thôn Trường Thọ, Xã Trạm Hành, TP. Đà Lạt, Tỉnh Lâm Đồng'
  },
  {
    id: 'rach-vem-phu-quoc',
    name: 'Khu Bảo Tồn Sinh Thái Biển Rạch Vẹm - Phú Quốc',
    location: 'Gành Dầu, Phú Quốc, Kiên Giang',
    province: 'Phú Quốc',
    desc: 'Làng chài hoang sơ, vương quốc sao biển đỏ, cano lướt sóng qua Mũi Hàm Rồng và lặn ngắm rạn san hô tự nhiên.',
    longDesc: 'Rạch Vẹm là điểm đến sinh thái biển nguyên sơ bậc nhất đảo ngọc Phú Quốc với bãi cát trắng mịn, nước biển trong vắt nhìn thấu đáy và hàng trăm chú sao biển đỏ tự nhiên nằm phơi mình dưới làn nước êm dịu.',
    price: 'Từ 250.000đ',
    priceNum: 250000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
    ],
    operatingHours: '08:00 - 17:30',
    availableDates: 'Có sẵn hàng ngày',
    targetAudience: 'Mọi du khách yêu biển',
    tag: 'Biển & San hô',
    ticketCount: '3 gói vé',
    activities: [
      'Cano cao tốc chở khách ra bãi Mũi Hàm Rồng hoang sơ',
      'Chụp ảnh check-in cùng đàn sao biển đỏ trong làn nước trong vắt',
      'Trang bị kính lặn và ống thở khám phá rạn san hô tự nhiên',
      'Thưởng thức gỏi cá trích và hải sản tươi sống tại nhà bè nổi'
    ],
    facilities: [
      { icon: 'boat-outline', label: 'Cano cao tốc đời mới' },
      { icon: 'glasses-outline', label: 'Kính lặn & Ống thở xịn' },
      { icon: 'restaurant-outline', label: 'Nhà bè hải sản trên biển' },
      { icon: 'umbrella-outline', label: 'Ghế nằm tắm nắng bờ biển' }
    ],
    policies: [
      'Tuyệt đối không nhấc sao biển lên khỏi mặt nước để bảo vệ sinh vật biển',
      'Trẻ em đi cano bắt buộc có người lớn kèm và mặc áo phao'
    ],
    ticketTypes: [
      {
        id: 'rv1',
        name: 'Vé Cano Khứ Hồi Ra Bãi Sao Biển Mũi Hàm Rồng',
        price: 250000,
        desc: 'Bao gồm cano khứ hồi, áo phao, nước suối và tắm tráng nước ngọt'
      },
      {
        id: 'rv2',
        name: 'Combo Cano + Lặn San Hô + Ăn Trưa Hải Sản Nhà Bè',
        price: 550000,
        desc: 'Trọn gói cano + dụng cụ lặn ngắm san hô + Set ăn 6 món hải sản tươi sống Phú Quốc'
      }
    ],
    address: 'Làng chài Rạch Vẹm, Xã Gành Dầu, TP. Phú Quốc, Tỉnh Kiên Giang'
  }
];

const PROVINCE_TAGS = ['Tất cả', 'Tây Ninh', 'Vũng Tàu', 'Đà Lạt', 'Ninh Bình', 'Long An', 'Đồng Tháp', 'Phú Quốc'];

export default function KhuSinhThaiScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tất cả');

  // Filter places based on search query (supporting both accented & unaccented Vietnamese) and selected tag
  const filteredPlaces = useMemo(() => {
    return ECO_PLACES.filter((place) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        matchVietnameseSearch(place.name, searchQuery) ||
        matchVietnameseSearch(place.location, searchQuery) ||
        matchVietnameseSearch(place.province, searchQuery) ||
        matchVietnameseSearch(place.tag, searchQuery) ||
        matchVietnameseSearch(place.desc, searchQuery) ||
        matchVietnameseSearch(place.longDesc, searchQuery);

      const matchTag =
        selectedTag === 'Tất cả' ||
        matchVietnameseSearch(place.province, selectedTag) ||
        matchVietnameseSearch(place.location, selectedTag);

      return matchSearch && matchTag;
    });
  }, [searchQuery, selectedTag]);

  const handleOpenDetail = (place: EcoPlace) => {
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
      }
    });
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setSelectedTag('Tất cả');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Compact, Modern Header Banner */}
        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80' }} 
            style={styles.heroBgImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadgeRow}>
              <Ionicons name="leaf" size={13} color="#86efac" />
              <Text style={styles.heroBadgeText}>CẨM NANG KHU SINH THÁI</Text>
            </View>
            <Text style={styles.heroTitle}>Khám Phá Khu Sinh Thái & Thiên Nhiên</Text>
            <Text style={styles.heroSubtitle}>Trải nghiệm rừng xanh, sông nước, chèo SUP và ẩm thực đồng quê đích thực.</Text>

            {/* Compact Search Bar with accent-insensitive search */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#00897b" style={styles.searchIcon} />
              <TextInput 
                placeholder="Tìm khu sinh thái, Tây Ninh, Đà Lạt, chèo SUP..." 
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

        {/* Compact Horizontal Category Filter Tabs */}
        <View style={styles.filterSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterTagsContainer}
          >
            {PROVINCE_TAGS.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <Pressable
                  key={tag}
                  onPress={() => setSelectedTag(tag)}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Destination List Section */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.listSubTitle}>ĐIỂM ĐẾN NỔI BẬT</Text>
              <Text style={styles.listTitle}>
                {selectedTag === 'Tất cả' ? 'Khu sinh thái đáng trải nghiệm' : `Khu sinh thái tại ${selectedTag}`}
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{filteredPlaces.length} điểm đến</Text>
            </View>
          </View>

          {filteredPlaces.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="tree-outline" size={48} color="#00897b" />
              <Text style={styles.emptyTitle}>Không tìm thấy điểm sinh thái phù hợp</Text>
              <Text style={styles.emptySub}>
                Không có kết quả nào khớp với từ khóa "{searchQuery}". Bạn có thể gõ có dấu hoặc không dấu (vd: tay ninh, da lat, rung, suoi...).
              </Text>
              <Pressable style={styles.resetBtn} onPress={handleResetSearch}>
                <Ionicons name="refresh" size={14} color="#ffffff" />
                <Text style={styles.resetBtnText}>Xem tất cả điểm đến</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cardGrid}>
              {filteredPlaces.map((place) => (
                <Pressable 
                  key={place.id} 
                  style={styles.card}
                  onPress={() => handleOpenDetail(place)}
                >
                  {/* Card Image Banner */}
                  <View style={styles.cardImageContainer}>
                    <Image source={{ uri: place.image }} style={styles.cardImage} contentFit="cover" />
                    <View style={styles.cardImageOverlay}>
                      <View style={styles.cardBadge}>
                        <Ionicons name="leaf" size={11} color="#00897b" />
                        <Text style={styles.cardBadgeText}>{place.tag}</Text>
                      </View>
                      <View style={styles.cardHeaderInfo}>
                        <Text style={styles.cardTitle} numberOfLines={2}>{place.name}</Text>
                        <View style={styles.cardLocRow}>
                          <Ionicons name="location-sharp" size={13} color="#ffd89a" />
                          <Text style={styles.cardLocation} numberOfLines={1}>{place.location}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  {/* Card Content */}
                  <View style={styles.cardContent}>
                    <Text style={styles.cardDesc} numberOfLines={2}>{place.desc}</Text>
                    
                    {/* Quick Specs */}
                    <View style={styles.specRow}>
                      <View style={styles.specItem}>
                        <Ionicons name="time-outline" size={13} color="#64748b" />
                        <Text style={styles.specText}>{place.operatingHours}</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Ionicons name="ticket-outline" size={13} color="#00897b" />
                        <Text style={styles.specTextGreen}>{place.ticketCount}</Text>
                      </View>
                    </View>

                    {/* Footer Row */}
                    <View style={styles.cardFooter}>
                      <View>
                        <Text style={styles.priceLabel}>Giá tham khảo</Text>
                        <Text style={styles.priceValue}>{place.price}</Text>
                      </View>
                      
                      <View style={styles.actionButtons}>
                        <Pressable 
                          style={styles.viewIntroBtn}
                          onPress={() => handleOpenDetail(place)}
                        >
                          <Text style={styles.viewIntroText}>Xem giới thiệu</Text>
                        </Pressable>

                        <Pressable 
                          style={styles.viewTicketBtn}
                          onPress={() => handleOpenDetail(place)}
                        >
                          <Text style={styles.viewTicketBtnText}>Xem vé & lịch</Text>
                          <Ionicons name="arrow-forward" size={13} color="#fff" />
                        </Pressable>
                      </View>
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
  container: { flex: 1, backgroundColor: '#f8faf9' },
  scrollContent: { paddingBottom: 60 },

  /* Compact Hero Banner */
  heroBanner: { 
    height: 220, 
    position: 'relative',
    backgroundColor: '#064e3b'
  },
  heroBgImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(5, 46, 36, 0.82)', 
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
    marginBottom: 8 
  },
  heroBadgeText: { color: '#86efac', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', lineHeight: 26, marginBottom: 4 },
  heroSubtitle: { color: '#cbd5e1', fontSize: 12, lineHeight: 17, marginBottom: 12 },
  
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

  /* Compact Filter Chips */
  filterSection: { 
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7'
  },
  filterTagsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#00897b',
    borderColor: '#00897b',
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

  /* List Section */
  listSection: { padding: 16 },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14
  },
  listSubTitle: { fontSize: 10, fontWeight: '800', color: '#c2410c', letterSpacing: 0.8 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },
  countBadge: {
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  countBadgeText: { fontSize: 11, fontWeight: '700', color: '#00897b' },

  /* Empty state */
  emptyContainer: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
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
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00897b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16
  },
  resetBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  /* Destination Card */
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
  cardImageOverlay: { 
    position: 'absolute', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    padding: 12, 
    justifyContent: 'space-between' 
  },
  cardBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 14 
  },
  cardBadgeText: { color: '#00897b', fontSize: 10, fontWeight: '800' },
  cardHeaderInfo: { gap: 2 },
  cardTitle: { color: '#ffffff', fontSize: 17, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 3 },
  cardLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardLocation: { color: '#f8fafc', fontSize: 11, fontWeight: '500' },
  
  cardContent: { padding: 14 },
  cardDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 10 },
  
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specText: { fontSize: 11, color: '#64748b' },
  specTextGreen: { fontSize: 11, fontWeight: '700', color: '#00897b' },

  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  priceLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  priceValue: { fontSize: 15, fontWeight: '800', color: '#00897b' },
  
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  viewIntroBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#f1f5f9'
  },
  viewIntroText: { fontSize: 11, fontWeight: '700', color: '#334155' },
  viewTicketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00674f',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8
  },
  viewTicketBtnText: { fontSize: 11, fontWeight: '700', color: '#ffffff' }
});
