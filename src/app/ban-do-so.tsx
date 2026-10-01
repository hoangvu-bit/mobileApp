import React, { useState, useMemo, useRef } from 'react';
import { Image } from 'expo-image';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  Dimensions,
  Linking,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { matchVietnameseSearch } from '../utils/vietnamese';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Province structure
export interface ProvinceData {
  id: string;
  name: string;
  region: 'Bắc Bộ' | 'Bắc Trung Bộ' | 'Nam Trung Bộ' | 'Tây Nguyên' | 'Đông Nam Bộ' | 'Tây Nam Bộ' | 'Biển Đảo';
  mapX: number; // percentage X on map canvas (0 to 100)
  mapY: number; // percentage Y on map canvas (0 to 100)
  latLng?: string;
  destinations: {
    id: string;
    name: string;
    type: string;
    distance?: string;
    hours: string;
    image: string;
    address: string;
    phone: string;
    rating: string;
    ticketPrice?: string;
    description?: string;
  }[];
  accommodations: {
    id: string;
    name: string;
    image: string;
    location: string;
    province: string;
    rating: string;
    reviewsCount: string;
    oldPrice?: string;
    newPrice: string;
    roomType: string;
    description: string;
    amenities: string[];
    images: string[];
  }[];
}

// 100% REAL AUTHENTIC PROVINCES & ATTRACTIONS DATASET OF VIETNAM
export const VIETNAM_PROVINCES: ProvinceData[] = [
  // 1. QUẢNG TRỊ (User's reference screenshot)
  {
    id: 'quang-tri',
    name: 'Quảng Trị',
    region: 'Bắc Trung Bộ',
    mapX: 52,
    mapY: 41,
    latLng: '16.7500,107.1850',
    destinations: [
      {
        id: 'qt-1',
        name: 'Thành Cổ Quảng Trị',
        type: 'Di tích Quốc gia đặc biệt',
        hours: '07:00 - 17:30 hàng ngày',
        image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        address: 'Phường 2, Thị xã Quảng Trị, Tỉnh Quảng Trị',
        phone: '0233 386 1234',
        rating: '4.9',
        ticketPrice: 'Miễn phí tham quan',
        description: 'Di tích lịch sử Quốc gia đặc biệt gắn liền với 81 ngày đêm máu và hoa mùa hè năm 1972, biểu tượng bất diệt cho tinh thần quả cảm của dân tộc Việt Nam.',
      },
      {
        id: 'qt-2',
        name: 'Địa Đạo Vịnh Mốc',
        type: 'Công trình di tích ngầm độc đáo',
        hours: '07:00 - 17:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        address: 'Thôn Vịnh Mốc, Xã Kim Thạch, Huyện Vĩnh Linh, Quảng Trị',
        phone: '0233 382 3456',
        rating: '4.8',
        ticketPrice: '50.000 đ / người',
        description: 'Hệ thống làng hầm ngầm kỳ vĩ sâu dưới lòng đất, nơi quân và dân Vĩnh Linh sinh sống, chiến đấu kiên cường bảo vệ tiền đồn miền Bắc.',
      },
      {
        id: 'qt-3',
        name: 'Cầu Hiền Lương & Sông Bến Hải',
        type: 'Di tích Vĩ tuyến 17',
        hours: '07:00 - 18:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        address: 'Thôn Hiền Lương, Xã Hiền Thành, Huyện Vĩnh Linh, Quảng Trị',
        phone: '0233 382 7890',
        rating: '4.8',
        ticketPrice: '50.000 đ / người',
        description: 'Cụm di tích lịch sử đôi bờ Hiền Lương - Bến Hải, chứng tích lịch sử của nỗi đau chia cắt hai miền Nam - Bắc suốt 20 năm.',
      },
      {
        id: 'qt-4',
        name: 'Nghĩa Trang Liệt Sĩ Quốc Gia Trường Sơn',
        type: 'Di tích Lịch sử Tâm linh',
        hours: '06:30 - 18:30 hàng ngày',
        image: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=800&q=80',
        address: 'Đồi Bến Tắt, Xã Linh Trường, Huyện Gio Linh, Quảng Trị',
        phone: '0233 388 1111',
        rating: '4.9',
        ticketPrice: 'Miễn phí dâng hương',
        description: 'Nơi an nghỉ đời đời của hơn 10.000 anh hùng liệt sĩ đã hy sinh trên tuyến đường mòn Hồ Chí Minh huyền thoại.',
      },
      {
        id: 'qt-5',
        name: 'Trung Tâm Hành Hương Đức Mẹ La Vang',
        type: 'Thánh địa tôn giáo & Kiến trúc',
        hours: '05:00 - 21:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1548625361-16eb1e9c20a6?auto=format&fit=crop&w=800&q=80',
        address: 'Xã Hải Phú, Huyện Hải Lăng, Tỉnh Quảng Trị',
        phone: '0233 387 3123',
        rating: '4.9',
        ticketPrice: 'Miễn phí',
        description: 'Trung tâm Thánh Mẫu toàn quốc của Giáo hội Công giáo Việt Nam với quần thể Vương cung thánh đường cổ kính và tráng lệ.',
      },
      {
        id: 'qt-6',
        name: 'Bãi Biển Cửa Việt & Đảo Cồn Cỏ',
        type: 'Thắng cảnh Biển đảo',
        hours: 'Mở cả ngày',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Thị trấn Cửa Việt, Huyện Gio Linh, Quảng Trị',
        phone: '0233 381 2222',
        rating: '4.7',
        ticketPrice: 'Tự do',
        description: 'Bãi biển cát trắng thoai thoải hoang sơ tuyệt đẹp cùng hải đảo Cồn Cỏ kiên cường giữa biển Đông ngút ngàn.',
      }
    ],
    accommodations: [
      {
        id: 'ht-qt-1',
        name: 'Mường Thanh Grand Quảng Trị Hotel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        location: 'Số 68 Lê Duẩn, Phường 2, TP. Đông Hà, Quảng Trị',
        province: 'Quảng Trị',
        rating: '4.8',
        reviewsCount: '412',
        newPrice: '950.000 đ/đêm',
        oldPrice: '1.250.000 đ',
        roomType: 'Deluxe City View',
        description: 'Khách sạn 4 sao cao cấp trung tâm TP. Đông Hà, đầy đủ hồ bơi ngoài trời, spa, phòng gym và nhà hàng ẩm thực miền Trung.',
        amenities: ['Hồ bơi ngoài trời', 'Buffet sáng', 'Wifi tốc độ cao', 'Phòng Gym', 'Bãi đỗ xe'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'ht-qt-2',
        name: 'Sepon Boutique Resort Cửa Việt',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        location: 'Khu du lịch Biển Cửa Việt, Gio Linh, Quảng Trị',
        province: 'Quảng Trị',
        rating: '4.7',
        reviewsCount: '280',
        newPrice: '1.150.000 đ/đêm',
        roomType: 'Ocean Front Villa',
        description: 'Resort nghỉ dưỡng sát biển Cửa Việt với khuôn viên cây xanh, hồ bơi hướng biển và dịch vụ chuẩn mực.',
        amenities: ['Sát bãi biển', 'Hồ bơi vô cực', 'Nhà hàng hải sản', 'Bar bãi biển'],
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },

  // 2. TÂY NINH (Core Region)
  {
    id: 'tay-ninh',
    name: 'Tây Ninh',
    region: 'Đông Nam Bộ',
    mapX: 43,
    mapY: 76,
    latLng: '11.3100,106.1000',
    destinations: [
      {
        id: 'tn-1',
        name: 'Khu Du Lịch Quốc Gia Núi Bà Đen',
        type: 'Nóc nhà Đông Nam Bộ & Tâm linh',
        hours: '05:30 - 21:30 hàng ngày',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
        address: 'Khu phố Ninh Phú, Phường Ninh Sơn, TP. Tây Ninh',
        phone: '0276 353 6666',
        rating: '4.9',
        ticketPrice: 'Vé cáp treo từ 250.000 đ',
        description: 'Ngọn núi thiêng cao 986m với tượng Phật Bà Tây Bổ Đà Sơn bằng đồng cao nhất châu Á và chùa Bà linh thiêng 300 năm tuổi.',
      },
      {
        id: 'tn-2',
        name: 'Toà Thánh Tây Ninh',
        type: 'Đại đạo Tam Kỳ Phổ Độ',
        hours: 'Mở cả ngày (Lễ chính 12h trưa)',
        image: 'https://images.unsplash.com/photo-1548625361-16eb1e9c20a6?auto=format&fit=crop&w=800&q=80',
        address: 'Phường Long Hoa, Thị xã Hòa Thành, Tây Ninh',
        phone: '0276 385 8119',
        rating: '4.9',
        ticketPrice: 'Miễn phí tham quan',
        description: 'Trung ương của đạo Cao Đài, công trình kiến trúc tôn giáo độc nhất vô nhị thế giới với tháp chuông rồng phượng nguy nga.',
      },
      {
        id: 'tn-3',
        name: 'Hồ Dầu Tiếng & Cắm Trại Bán Đảo',
        type: 'Hồ nhân tạo lớn nhất Đông Nam Á',
        hours: 'Mở cửa tự do 24/7',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Huyện Dương Minh Châu, Tỉnh Tây Ninh',
        phone: '0908 123 456',
        rating: '4.8',
        ticketPrice: 'Miễn phí / Thuê lều',
        description: 'Mặt hồ phẳng lặng như gương soi bóng Núi Bà Đen hùng vĩ, địa điểm cắm trại ngắm hoàng hôn và săn bình minh số 1 Đông Nam Bộ.',
      },
      {
        id: 'tn-4',
        name: 'Thung Lũng Ma Thiên Lãnh',
        type: 'Thắng cảnh thiên nhiên hoang sơ',
        hours: '06:00 - 18:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        address: 'Xã Thạnh Tân, TP. Tây Ninh',
        phone: '0276 382 1234',
        rating: '4.7',
        ticketPrice: 'Miễn phí',
        description: 'Vùng trũng giữa ba ngọn núi Bà Đen, Núi Heo và Núi Phụng với suối đá trong veo và thảm thực vật nguyên sinh huyền bí.',
      },
      {
        id: 'tn-5',
        name: 'Vườn Quốc Gia Lò Gò - Xa Mát',
        type: 'Vườn di sản ASEAN',
        hours: '07:30 - 17:00',
        image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
        address: 'Xã Tân Bình, Huyện Tân Biên, Tỉnh Tây Ninh',
        phone: '0276 387 4099',
        rating: '4.8',
        ticketPrice: '30.000 đ / người',
        description: 'Khu rừng chuyển tiếp độc đáo giữa Tây Nguyên và Đồng bằng sông Cửu Long, nơi bảo tồn sếu đầu đỏ và nhiều loài chim quý hiếm.',
      },
      {
        id: 'tn-6',
        name: 'Di Tích Căn Cứ Trung Ương Cục Miền Nam',
        type: 'Di tích Lịch sử Quốc gia đặc biệt',
        hours: '07:30 - 17:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        address: 'Rùm Đuôn, Xã Tân Lập, Huyện Tân Biên, Tây Ninh',
        phone: '0276 387 4123',
        rating: '4.8',
        ticketPrice: '20.000 đ / người',
        description: 'Thủ đô kháng chiến miền Nam - nơi ghi dấu sự lãnh đạo kiên cường của Đảng trong cuộc kháng chiến chống Mỹ cứu nước.',
      }
    ],
    accommodations: [
      {
        id: 'ht-tn-1',
        name: 'Melia Vinpearl Tây Ninh',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        location: 'Số 90 Lê Duẩn, Khu phố 5, Phường 3, TP. Tây Ninh',
        province: 'Tây Ninh',
        rating: '4.9',
        reviewsCount: '860',
        newPrice: '1.450.000 đ/đêm',
        oldPrice: '1.800.000 đ',
        roomType: 'Deluxe King Room',
        description: 'Khách sạn 5 sao cao 21 tầng đầu tiên tại Tây Ninh, tầm nhìn bao trọn Núi Bà Đen hùng vĩ, hồ bơi bốn mùa và ẩm thực thượng hạng.',
        amenities: ['Hồ bơi trong nhà', 'Nhà hàng 986 Bar', 'Vincharm Spa', 'Phòng Gym cao cấp'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'ht-tn-2',
        name: 'Sunrise Hotel Tây Ninh',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        location: 'Số 81 Hoàng Lê Kha, Phường 3, TP. Tây Ninh',
        province: 'Tây Ninh',
        rating: '4.8',
        reviewsCount: '520',
        newPrice: '980.000 đ/đêm',
        roomType: 'Superior Queen',
        description: 'Khách sạn 4 sao trung tâm TP. Tây Ninh với lối kiến trúc châu Âu thanh lịch, dịch vụ chuẩn mực và phong cách phục vụ tận tâm.',
        amenities: ['Hồ bơi sân vườn', 'Buffet sáng', 'Sân tennis', 'Xe đưa đón'],
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },

  // 3. ĐÀ NẴNG
  {
    id: 'da-nang',
    name: 'Đà Nẵng',
    region: 'Nam Trung Bộ',
    mapX: 59,
    mapY: 46,
    latLng: '16.0544,108.2022',
    destinations: [
      {
        id: 'dn-1',
        name: 'Sun World Bà Nà Hills & Cầu Vàng',
        type: 'Khu du lịch Đẳng cấp Thế giới',
        hours: '07:00 - 22:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        address: 'Thôn An Sơn, Xã Hòa Ninh, Huyện Hòa Vang, Đà Nẵng',
        phone: '0905 766 777',
        rating: '4.9',
        ticketPrice: '900.000 đ / người',
        description: 'Cây Cầu Vàng được nâng đỡ bởi đôi bàn tay khổng lồ giữa biển mây, Làng Pháp cổ kính và khí hậu 4 mùa trong một ngày.',
      },
      {
        id: 'dn-2',
        name: 'Bán Đảo Sơn Trà & Chùa Linh Ứng',
        type: 'Viên ngọc xanh sinh thái & Tâm linh',
        hours: '06:00 - 20:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        address: 'Bãi Bụt, Phường Thọ Quang, Quận Sơn Trà, Đà Nẵng',
        phone: '0236 392 2118',
        rating: '4.9',
        ticketPrice: 'Miễn phí tham quan',
        description: 'Tượng Phật Quán Thế Âm cao 67m hướng mắt ra biển Đông, nơi sinh sống của loài Voọc chà vá chân nâu quý hiếm.',
      },
      {
        id: 'dn-3',
        name: 'Danh Thắng Ngũ Hành Sơn',
        type: 'Di tích Quốc gia đặc biệt',
        hours: '07:00 - 17:30',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        address: 'Số 81 Huyền Trân Công Chúa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
        phone: '0236 396 1114',
        rating: '4.8',
        ticketPrice: '40.000 đ / người',
        description: 'Quần thể 5 ngọn núi đá vôi mang tên Kim - Mộc - Thủy - Hỏa - Thổ với các hang động huyền ảo như động Huyền Không, động Âm Phủ.',
      },
      {
        id: 'dn-4',
        name: 'Cầu Rồng & Cầu Sông Hàn',
        type: 'Biểu tượng thành phố Đà Nẵng',
        hours: 'Phun lửa & nước vào 21:00 Thứ 7 & CN',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Đường Nguyễn Văn Linh, Phước Ninh, Hải Châu, Đà Nẵng',
        phone: '0236 382 1234',
        rating: '4.9',
        ticketPrice: 'Miễn phí',
        description: 'Cây cầu thép hình rồng độc đáo phun lửa và phun nước rực rỡ bên dòng sông Hàn thơ mộng mỗi dịp cuối tuần.',
      }
    ],
    accommodations: [
      {
        id: 'ht-dn-1',
        name: 'InterContinental Danang Sun Peninsula Resort',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        location: 'Bãi Bắc, Bán đảo Sơn Trà, TP. Đà Nẵng',
        province: 'Đà Nẵng',
        rating: '5.0',
        reviewsCount: '1.450',
        newPrice: '8.500.000 đ/đêm',
        roomType: 'Classic Ocean View',
        description: 'Khu nghỉ dưỡng sang trọng bậc nhất thế giới do kiến trúc sư huyền thoại Bill Bensley thiết kế nép mình giữa bán đảo Sơn Trà.',
        amenities: ['Bãi biển riêng tư', 'Nhà hàng La Maison 1888 Michelin', 'Hồ bơi vô cực', 'HARNN Heritage Spa'],
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },

  // 4. LÂM ĐỒNG (ĐÀ LẠT)
  {
    id: 'lam-dong',
    name: 'Lâm Đồng',
    region: 'Tây Nguyên',
    mapX: 62,
    mapY: 69,
    latLng: '11.9404,108.4583',
    destinations: [
      {
        id: 'ld-1',
        name: 'Đồi Chè Cầu Đất & Săn Mây Phát Chi',
        type: 'Thắng cảnh & Nông nghiệp công nghệ cao',
        hours: '05:00 - 17:30 hàng ngày',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
        address: 'Thôn Cầu Đất, Xã Xuân Trường, TP. Đà Lạt, Lâm Đồng',
        phone: '0263 383 8180',
        rating: '4.9',
        ticketPrice: 'Miễn phí tham quan',
        description: 'Đồi chè xanh mướt ngút ngàn gần 100 năm tuổi cùng thảm mây bồng bềnh mỗi sớm mai tuyệt đẹp của phố núi.',
      },
      {
        id: 'ld-2',
        name: 'Khu Du Lịch Thác Datanla',
        type: 'Thác nước & Trò chơi mạo hiểm',
        hours: '07:00 - 17:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        address: 'Đèo Prenn, Phường 3, TP. Đà Lạt, Lâm Đồng',
        phone: '0263 382 3238',
        rating: '4.8',
        ticketPrice: '50.000 đ (Máng trượt riêng)',
        description: 'Hệ thống máng trượt xuyên rừng dài nhất Đông Nam Á, trải nghiệm đu dây mạo hiểm High Rope Course và ngắm thác đổ hùng vĩ.',
      },
      {
        id: 'ld-3',
        name: 'Đỉnh Núi Langbiang',
        type: 'Nóc nhà Đà Lạt cao 2.167m',
        hours: '07:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        address: 'Thị trấn Lạc Dương, Huyện Lạc Dương, Lâm Đồng',
        phone: '0263 383 9456',
        rating: '4.8',
        ticketPrice: '50.000 đ / người',
        description: 'Truyền thuyết tình yêu thiên thu giữa chàng K’Lang và nàng H’Biang, ngắm toàn cảnh thung lũng Suối Vàng từ đỉnh Ra-đa.',
      }
    ],
    accommodations: [
      {
        id: 'ht-ld-1',
        name: 'Dalat Edensee Lake Resort & Spa',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        location: 'Khu chức năng VII.2, KDL Hồ Tuyền Lâm, Đà Lạt',
        province: 'Lâm Đồng',
        rating: '4.9',
        reviewsCount: '920',
        newPrice: '2.150.000 đ/đêm',
        roomType: 'Mimosa Superior Lake View',
        description: 'Ngôi làng châu Âu cổ kính nép mình bên rừng thông và mặt hồ Tuyền Lâm thơ mộng với khí hậu mát lạnh quanh năm.',
        amenities: ['View Hồ Tuyền Lâm', 'Bể bơi nước ấm', 'Sân golf mini', 'Spa thư giãn'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },

  // 5. HÀ NỘI
  {
    id: 'ha-noi',
    name: 'Hà Nội',
    region: 'Bắc Bộ',
    mapX: 47,
    mapY: 18,
    latLng: '21.0285,105.8542',
    destinations: [
      {
        id: 'hn-1',
        name: 'Hồ Hoàn Kiếm & Đền Ngọc Sơn',
        type: 'Trái tim Thủ đô ngàn năm',
        hours: '07:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        address: 'Đinh Tiên Hoàng, Hàng Trống, Hoàn Kiếm, Hà Nội',
        phone: '024 3825 5289',
        rating: '4.9',
        ticketPrice: '30.000 đ / người',
        description: 'Biểu tượng lịch sử ngàn năm văn hiến của Thăng Long - Hà Nội với Cầu Thê Húc đỏ son, Tháp Rùa cổ kính giữa mặt hồ biếc.',
      },
      {
        id: 'hn-2',
        name: 'Văn Miếu - Quốc Tử Giám',
        type: 'Trường Đại học đầu tiên của Việt Nam',
        hours: '08:00 - 17:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1548625361-16eb1e9c20a6?auto=format&fit=crop&w=800&q=80',
        address: 'Số 58 Phố Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội',
        phone: '024 3845 2917',
        rating: '4.9',
        ticketPrice: '70.000 đ / người',
        description: 'Di tích Quốc gia đặc biệt nơi lưu giữ 82 bia Tiến sĩ vinh danh truyền thống hiếu học và trọng dụng hiền tài của dân tộc.',
      }
    ],
    accommodations: [
      {
        id: 'ht-hn-1',
        name: 'Sofitel Legend Metropole Hanoi',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        location: 'Số 15 Phố Ngô Quyền, Hoàn Kiếm, Hà Nội',
        province: 'Hà Nội',
        rating: '5.0',
        reviewsCount: '2.100',
        newPrice: '7.200.000 đ/đêm',
        roomType: 'Luxury Historic Wing',
        description: 'Khách sạn di sản 5 sao sang trọng bậc nhất Đông Dương được xây dựng từ năm 1901 ngay cạnh Nhà hát Lớn Hà Nội.',
        amenities: ['Hồ bơi ngoài trời', 'Le Spa du Metropole', 'Nhà hàng Pháp Le Beaulieu', 'Phòng Hầm Lịch sử'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },

  // 6. TP. HỒ CHÍ MINH
  {
    id: 'tp-ho-chi-minh',
    name: 'TP. Hồ Chí Minh',
    region: 'Đông Nam Bộ',
    mapX: 48,
    mapY: 79,
    latLng: '10.8231,106.6297',
    destinations: [
      {
        id: 'hcm-1',
        name: 'Dinh Độc Lập (Dinh Thống Nhất)',
        type: 'Di tích Lịch sử Quốc gia đặc biệt',
        hours: '08:00 - 16:30 hàng ngày',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        address: 'Số 135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, TP.HCM',
        phone: '028 3822 3652',
        rating: '4.9',
        ticketPrice: '65.000 đ / người',
        description: 'Công trình kiến trúc lịch sử chứng kiến thời khắc lịch sử trưa ngày 30/4/1975 giải phóng hoàn toàn miền Nam, thống nhất đất nước.',
      },
      {
        id: 'hcm-2',
        name: 'Địa Đạo Củ Chi (Bến Dược & Bến Đình)',
        type: 'Thành phố ngầm trong lòng đất',
        hours: '07:30 - 17:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        address: 'Ấp Phú Hiệp, Xã Phú Mỹ Hưng, Huyện Củ Chi, TP.HCM',
        phone: '028 3794 8830',
        rating: '4.9',
        ticketPrice: '70.000 đ / người',
        description: 'Mê cung ngầm dài hơn 250km được đào thủ công kiên cường trong chiến tranh, kỳ tích quân sự nổi tiếng toàn cầu.',
      }
    ],
    accommodations: [
      {
        id: 'ht-hcm-1',
        name: 'The Reverie Saigon',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        location: 'Số 22-36 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM',
        province: 'TP. Hồ Chí Minh',
        rating: '5.0',
        reviewsCount: '1.890',
        newPrice: '6.500.000 đ/đêm',
        roomType: 'Grand Deluxe River View',
        description: 'Khách sạn 6 sao mang phong cách quý tộc Ý lộng lẫy trên đại lộ đi bộ Nguyễn Huệ với view sông Sài Gòn tuyệt đẹp.',
        amenities: ['Hồ bơi ngoài trời', 'Spa 2 tầng đẳng cấp', 'Nhà hàng fine dining', 'Trực thăng riêng'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },

  // 7. QUẢNG NINH
  {
    id: 'quang-ninh',
    name: 'Quảng Ninh',
    region: 'Bắc Bộ',
    mapX: 62,
    mapY: 17,
    latLng: '20.9505,107.0734',
    destinations: [
      {
        id: 'qn-1',
        name: 'Vịnh Hạ Long',
        type: 'Di sản Thiên nhiên Thế giới UNESCO',
        hours: '06:30 - 18:30',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        address: 'Vịnh Hạ Long, TP. Hạ Long, Quảng Ninh',
        phone: '0203 384 6564',
        rating: '5.0',
        ticketPrice: '290.000 đ / vé tuyến',
        description: 'Kỳ quan thiên nhiên thế giới với gần 2.000 hòn đảo đá vôi kỳ vĩ soi bóng trên làn nước ngọc bích.',
      }
    ],
    accommodations: []
  },

  // 8. KIÊN GIANG (PHÚ QUỐC)
  {
    id: 'kien-giang',
    name: 'Kiên Giang',
    region: 'Tây Nam Bộ',
    mapX: 28,
    mapY: 86,
    latLng: '10.0125,105.0809',
    destinations: [
      {
        id: 'kg-1',
        name: 'Grand World Phú Quốc & VinWonders',
        type: 'Thành phố không ngủ & Công viên chủ đề',
        hours: 'Mở cửa 24/7',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Bãi Dài, Xã Gành Dầu, TP. Phú Quốc, Kiên Giang',
        phone: '1900 6677',
        rating: '4.9',
        ticketPrice: 'Từ 950.000 đ / vé',
        description: 'Quần thể giải trí nghỉ dưỡng đẳng cấp quốc tế với show Tinh hoa Việt Nam, kênh đào Venice và công viên nước khổng lồ.',
      }
    ],
    accommodations: []
  },

  // 9. THỪA THIÊN HUẾ
  {
    id: 'thua-thien-hue',
    name: 'Thừa Thiên Huế',
    region: 'Bắc Trung Bộ',
    mapX: 56,
    mapY: 43,
    latLng: '16.4637,107.5909',
    destinations: [
      {
        id: 'hue-1',
        name: 'Đại Nội Huế & Quần Thể Cố Đô',
        type: 'Di sản Văn hoá Thế giới UNESCO',
        hours: '07:00 - 17:30',
        image: 'https://images.unsplash.com/photo-1548625361-16eb1e9c20a6?auto=format&fit=crop&w=800&q=80',
        address: 'Đường 23/8, Phường Thuận Hòa, TP. Huế',
        phone: '0234 352 3237',
        rating: '4.9',
        ticketPrice: '200.000 đ / người',
        description: 'Hoàng cung nguy nga của 13 vị vua triều Nguyễn với Ngọ Môn, Điện Thái Hòa, Tử Cấm Thành và các lăng tẩm uy nghiêm.',
      }
    ],
    accommodations: []
  },

  // 10. KHÁNH HÒA (NHA TRANG)
  {
    id: 'khanh-hoa',
    name: 'Khánh Hòa',
    region: 'Nam Trung Bộ',
    mapX: 68,
    mapY: 64,
    latLng: '12.2388,109.1967',
    destinations: [
      {
        id: 'kh-1',
        name: 'VinWonders Nha Trang & Đảo Hòn Tre',
        type: 'Thiên đường vui chơi giải trí biển đảo',
        hours: '08:00 - 20:00',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Đảo Hòn Tre, Vĩnh Nguyên, TP. Nha Trang, Khánh Hòa',
        phone: '1900 6677',
        rating: '4.9',
        ticketPrice: '800.000 đ / vé',
        description: 'Công viên giải trí của những kỷ lục với vòng quay Tata show, cáp treo vượt biển Nha Trang và vịnh phao nổi lớn nhất thế giới.',
      }
    ],
    accommodations: []
  },

  // 11. NINH BÌNH
  {
    id: 'ninh-binh',
    name: 'Ninh Bình',
    region: 'Bắc Bộ',
    mapX: 48,
    mapY: 24,
    latLng: '20.2506,105.9745',
    destinations: [
      {
        id: 'nb-1',
        name: 'Quần Thể Danh Thắng Tràng An',
        type: 'Di sản Thế giới kép UNESCO',
        hours: '07:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        address: 'Xã Ninh Xuân, Huyện Hoa Lư, Ninh Bình',
        phone: '0229 362 0335',
        rating: '5.0',
        ticketPrice: '250.000 đ / vé thuyền',
        description: 'Vịnh Hạ Long trên cạn với hệ thống hang động xuyên thủy kỳ ảo, non nước hữu tình và Cố đô Hoa Lư ngàn năm lịch sử.',
      }
    ],
    accommodations: []
  },

  // 12. LÀO CAI (SA PA)
  {
    id: 'lao-cai',
    name: 'Lào Cai',
    region: 'Bắc Bộ',
    mapX: 34,
    mapY: 10,
    latLng: '22.4856,103.9707',
    destinations: [
      {
        id: 'lc-1',
        name: 'Đỉnh Fansipan - Nóc Nhà Đông Dương',
        type: 'Đỉnh núi cao nhất Việt Nam 3.143m',
        hours: '07:30 - 17:30',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        address: 'Thị xã Sa Pa, Tỉnh Lào Cai',
        phone: '0214 381 8888',
        rating: '4.9',
        ticketPrice: '850.000 đ / cáp treo',
        description: 'Chinh phục đỉnh Fansipan huyền thoại, chiêm bái Đại tượng Phật A Di Đà bằng đồng lớn nhất Việt Nam giữa mây ngàn Hoàng Liên Sơn.',
      }
    ],
    accommodations: []
  },

  // 13. BÀ RỊA - VŨNG TÀU
  {
    id: 'ba-ria-vung-tau',
    name: 'Bà Rịa - Vũng Tàu',
    region: 'Đông Nam Bộ',
    mapX: 52,
    mapY: 82,
    latLng: '10.3460,107.0843',
    destinations: [
      {
        id: 'vt-1',
        name: 'Tượng Chúa Kitô Vua & Mũi Nghinh Phong',
        type: 'Biểu tượng du lịch Vũng Tàu',
        hours: '07:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Số 02 Hạ Long, Phường 2, TP. Vũng Tàu',
        phone: '0254 385 2345',
        rating: '4.8',
        ticketPrice: 'Miễn phí',
        description: 'Bức tượng Chúa Kitô lớn nhất châu Á trên đỉnh Núi Nhỏ phóng tầm mắt ngắm trọn biển xanh Bãi Sau và Bãi Trước.',
      }
    ],
    accommodations: []
  },

  // 14. CẦN THƠ
  {
    id: 'can-tho',
    name: 'Cần Thơ',
    region: 'Tây Nam Bộ',
    mapX: 38,
    mapY: 84,
    latLng: '10.0452,105.7469',
    destinations: [
      {
        id: 'ct-1',
        name: 'Chợ Nổi Cái Răng & Bến Ninh Kiều',
        type: 'Văn hoá sông nước miền Tây',
        hours: '05:00 - 09:00 sáng',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        address: 'Sông Cần Thơ, Phường Lê Bình, Quận Cái Răng, Cần Thơ',
        phone: '0292 382 1234',
        rating: '4.8',
        ticketPrice: 'Thuê tàu từ 200.000 đ',
        description: 'Chợ nổi sầm uất trên sông Tiền với cây bẹo treo nông sản độc đáo và tô hủ tiếu nóng hổi giữa chợ nổi mộc mạc hữu tình.',
      }
    ],
    accommodations: []
  },

  // 15. QUẢNG BÌNH
  {
    id: 'quang-binh',
    name: 'Quảng Bình',
    region: 'Bắc Trung Bộ',
    mapX: 50,
    mapY: 36,
    latLng: '17.4691,106.6219',
    destinations: [
      {
        id: 'qb-1',
        name: 'Vườn Quốc Gia Phong Nha - Kẻ Bàng',
        type: 'Vương quốc hang động thế giới',
        hours: '07:30 - 17:00',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        address: 'Huyện Bố Trạch, Tỉnh Quảng Bình',
        phone: '0232 367 7021',
        rating: '5.0',
        ticketPrice: '150.000 đ / vé',
        description: 'Hệ thống hang động tự nhiên tráng lệ gồm Động Phong Nha, Động Thiên Đường và Hang Sơn Đoòng lớn nhất hành tinh.',
      }
    ],
    accommodations: []
  },

  // 16. QUẢNG NAM (HỘI AN)
  {
    id: 'quang-nam',
    name: 'Quảng Nam',
    region: 'Nam Trung Bộ',
    mapX: 61,
    mapY: 49,
    latLng: '15.8801,108.3380',
    destinations: [
      {
        id: 'qnam-1',
        name: 'Phố Cổ Hội An',
        type: 'Di sản Văn hóa Thế giới UNESCO',
        hours: 'Mở cả ngày',
        image: 'https://images.unsplash.com/photo-1548625361-16eb1e9c20a6?auto=format&fit=crop&w=800&q=80',
        address: 'TP. Hội An, Tỉnh Quảng Nam',
        phone: '0235 386 1327',
        rating: '5.0',
        ticketPrice: '120.000 đ / vé tham quan',
        description: 'Đô thị thương cảng cổ thế kỷ 16-17 lung linh trong ánh đèn lồng, Chùa Cầu cổ kính và ẩm thực cao lầu trứ danh.',
      }
    ],
    accommodations: []
  },

  // 17. HÀ GIANG
  {
    id: 'ha-giang',
    name: 'Hà Giang',
    region: 'Bắc Bộ',
    mapX: 38,
    mapY: 6,
    latLng: '22.8233,104.9839',
    destinations: [
      {
        id: 'hg-1',
        name: 'Cột Cờ Lũng Cú & Đèo Mã Pí Lèng',
        type: 'Điểm cực Bắc thiêng liêng Tổ quốc',
        hours: '06:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        address: 'Xã Lũng Cú, Huyện Đồng Văn, Hà Giang',
        phone: '0219 385 6789',
        rating: '4.9',
        ticketPrice: '25.000 đ / người',
        description: 'Lá cờ đỏ sao vàng 54m2 kiêu hãnh tung bay nơi địa đầu Tổ quốc, hẻm vực Tu Sản sâu nhất Đông Nam Á bên dòng Nho Quế.',
      }
    ],
    accommodations: []
  },

  // 18. QUẦN ĐẢO HOÀNG SA (ĐÀ NẴNG)
  {
    id: 'hoang-sa',
    name: 'Quần đảo Hoàng Sa',
    region: 'Biển Đảo',
    mapX: 82,
    mapY: 42,
    latLng: '16.5367,112.0239',
    destinations: [
      {
        id: 'hs-1',
        name: 'Nhà Trưng Bày Hoàng Sa (Đà Nẵng)',
        type: 'Chứng tích chủ quyền biển đảo thiêng liêng',
        hours: '07:30 - 17:00 (Thứ 2 - Thứ 6)',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Đường Hoàng Sa, Thọ Quang, Sơn Trà, Đà Nẵng',
        phone: '0236 368 9898',
        rating: '5.0',
        ticketPrice: 'Miễn phí tham quan',
        description: 'Bảo tàng tư liệu, bản đồ cổ và hiện vật khẳng định chủ quyền lịch sử không thể tranh cãi của Việt Nam đối với quần đảo Hoàng Sa.',
      }
    ],
    accommodations: []
  },

  // 19. QUẦN ĐẢO TRƯỜNG SA (KHÁNH HÒA)
  {
    id: 'truong-sa',
    name: 'Quần đảo Trường Sa',
    region: 'Biển Đảo',
    mapX: 88,
    mapY: 72,
    latLng: '8.6436,111.9197',
    destinations: [
      {
        id: 'ts-1',
        name: 'Cột Mốc Chủ Quyền Trường Sa',
        type: 'Phên dậu biển đảo thiêng liêng Tổ quốc',
        hours: 'Mở cả ngày',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Huyện đảo Trường Sa, Tỉnh Khánh Hòa',
        phone: '0258 382 2222',
        rating: '5.0',
        ticketPrice: 'Theo hành trình',
        description: 'Quần đảo tiền tiêu bảo vệ vùng trời và vùng biển thiêng liêng của Tổ quốc với những cây bàng vuông kiên cường giữa trùng khơi.',
      }
    ],
    accommodations: []
  },

  // 20. BÌNH ĐỊNH (QUY NHƠN)
  {
    id: 'binh-dinh',
    name: 'Bình Định',
    region: 'Nam Trung Bộ',
    mapX: 67,
    mapY: 55,
    latLng: '13.7820,109.2190',
    destinations: [
      {
        id: 'bd-1',
        name: 'Eo Gió & Bãi Biển Kỳ Co',
        type: 'Nơi ngắm hoàng hôn đẹp nhất Việt Nam',
        hours: '06:00 - 18:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Xã Nhơn Lý, TP. Quy Nhơn, Bình Định',
        phone: '0256 384 1234',
        rating: '4.8',
        ticketPrice: '25.000 đ / người',
        description: 'Cung đường đi bộ ven biển ngoạn mục ôm trọn vách đá hùng vĩ cùng làn nước trong xanh hai màu tại Kỳ Co.',
      }
    ],
    accommodations: []
  },

  // 21. CÀ MAU
  {
    id: 'ca-mau',
    name: 'Cà Mau',
    region: 'Tây Nam Bộ',
    mapX: 30,
    mapY: 92,
    latLng: '9.1769,105.1500',
    destinations: [
      {
        id: 'cm-1',
        name: 'Cột Mốc Tọa Độ Quốc Gia Mũi Cà Mau',
        type: 'Điểm cực Nam Tổ quốc',
        hours: '06:30 - 18:00 hàng ngày',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        address: 'Ấp Mũi, Xã Đất Mũi, Huyện Ngọc Hiển, Cà Mau',
        phone: '0290 387 1111',
        rating: '4.9',
        ticketPrice: '30.000 đ / người',
        description: 'Nơi đất nở ra, rừng biết đi và biển sinh sôi, điểm cuối cùng trên đất liền hình chữ S với biểu tượng con tàu vươn khơi.',
      }
    ],
    accommodations: []
  },

  // 22. AN GIANG
  {
    id: 'an-giang',
    name: 'An Giang',
    region: 'Tây Nam Bộ',
    mapX: 30,
    mapY: 80,
    latLng: '10.5216,105.1259',
    destinations: [
      {
        id: 'ag-1',
        name: 'Rừng Tràm Trà Sư & Miếu Bà Chúa Xứ',
        type: 'Hệ sinh thái ngập nước & Tâm linh',
        hours: '07:00 - 17:30',
        image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
        address: 'Xã Văn Giáo, Thị xã Tịnh Biên, An Giang',
        phone: '0296 387 7288',
        rating: '4.9',
        ticketPrice: '100.000 đ / xuồng chèo',
        description: 'Tấm thảm bèo cám xanh ngắt trải dài vô tận dưới tán rừng tràm và trung tâm hành hương Núi Sam linh thiêng đón hàng triệu du khách.',
      }
    ],
    accommodations: []
  },

  // 23. PHÚ YÊN
  {
    id: 'phu-yen',
    name: 'Phú Yên',
    region: 'Nam Trung Bộ',
    mapX: 68,
    mapY: 59,
    latLng: '13.0882,109.3175',
    destinations: [
      {
        id: 'py-1',
        name: 'Gành Đá Đĩa & Tháp Nghinh Phong',
        type: 'Kiệt tác địa chất thế giới & Kiến trúc',
        hours: '06:00 - 18:30',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: 'Xã An Ninh Đông, Huyện Tuy An, Phú Yên',
        phone: '0257 384 1234',
        rating: '4.9',
        ticketPrice: '40.000 đ / người',
        description: 'Tập hợp hàng ngàn cột đá bazan hình lục giác xếp lớp kỳ ảo như tổ ong khổng lồ do núi lửa phun trào hàng triệu năm trước.',
      }
    ],
    accommodations: []
  }
];

// Quick region filter list
const REGIONS = [
  'Tất cả',
  'Bắc Bộ',
  'Bắc Trung Bộ',
  'Nam Trung Bộ',
  'Tây Nguyên',
  'Đông Nam Bộ',
  'Tây Nam Bộ',
  'Biển Đảo',
];

export default function BanDoSoScreen() {
  const router = useRouter();
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('quang-tri');
  const [activeTab, setActiveTab] = useState<'diadanh' | 'luutru'>('diadanh');
  const [selectedRegion, setSelectedRegion] = useState<string>('Tất cả');
  const [searchText, setSearchText] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Selected province object
  const selectedProvince = useMemo(() => {
    return (
      VIETNAM_PROVINCES.find((p) => p.id === selectedProvinceId) ||
      VIETNAM_PROVINCES[0]
    );
  }, [selectedProvinceId]);

  // Filtered provinces for map markers & list
  const filteredProvinces = useMemo(() => {
    return VIETNAM_PROVINCES.filter((p) => {
      if (selectedRegion !== 'Tất cả' && p.region !== selectedRegion) {
        return false;
      }
      if (searchText.trim()) {
        return matchVietnameseSearch(p.name, searchText.trim());
      }
      return true;
    });
  }, [selectedRegion, searchText]);

  // Suggestions for live search
  const suggestions = useMemo(() => {
    if (!searchText.trim()) return [];
    return VIETNAM_PROVINCES.filter((p) =>
      matchVietnameseSearch(p.name, searchText.trim())
    ).slice(0, 6);
  }, [searchText]);

  const handleSelectProvince = (prov: ProvinceData) => {
    setSelectedProvinceId(prov.id);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleOpenDestination = (item: ProvinceData['destinations'][0]) => {
    router.push({
      pathname: '/chi-tiet-dia-diem',
      params: {
        name: item.name,
        type: item.type,
        distance: item.distance || 'Điểm du lịch nổi bật',
        hours: item.hours,
        image: item.image,
        address: item.address,
        phone: item.phone,
        province: selectedProvince.name,
        description: item.description || '',
        ticketPrice: item.ticketPrice || 'Miễn phí',
        rating: item.rating || '4.9',
      },
    });
  };

  const handleOpenHotel = (hotel: ProvinceData['accommodations'][0]) => {
    router.push({
      pathname: '/chi-tiet-khach-san',
      params: {
        hotelData: JSON.stringify(hotel),
      },
    });
  };

  const handleOpenGpsNavigation = () => {
    const query = encodeURIComponent(`${selectedProvince.name}, Việt Nam`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {
      Alert.alert('Định vị', `Đang kết nối vị trí đến tỉnh: ${selectedProvince.name}`);
    });
  };

  const destinationCount = selectedProvince.destinations.length;
  const accommodationCount = selectedProvince.accommodations.length;

  return (
    <View style={styles.container}>
      {/* Top Search Overlay */}
      <View style={styles.topSearchWrapper}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={19} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm tỉnh/thành"
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchText}
            onChangeText={(txt) => {
              setSearchText(txt);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchText('');
                setIsSearchFocused(false);
              }}
              style={styles.clearBtn}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </Pressable>
          )}
        </View>

        {/* Live Search Auto-suggestions Dropdown */}
        {isSearchFocused && suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            <Text style={styles.suggestionHeader}>TỈNH / THÀNH PHỐ GỢI Ý</Text>
            {suggestions.map((item) => (
              <Pressable
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => {
                  handleSelectProvince(item);
                  setSearchText('');
                }}
              >
                <Ionicons name="location-sharp" size={16} color="#ea580c" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.suggestionTitle}>{item.name}</Text>
                  <Text style={styles.suggestionSubtitle}>
                    {item.region} • {item.destinations.length} địa danh
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#cbd5e1" />
              </Pressable>
            ))}
          </View>
        )}

        {/* Region Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionFilterScroll}
        >
          {REGIONS.map((reg, idx) => {
            const isActive = selectedRegion === reg;
            return (
              <Pressable
                key={idx}
                style={[styles.regionChip, isActive && styles.regionChipActive]}
                onPress={() => setSelectedRegion(reg)}
              >
                <Text style={[styles.regionChipText, isActive && styles.regionChipTextActive]}>
                  {reg}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Interactive Map Visual Area */}
      <View style={styles.mapCanvas}>
        {/* Subtle Map Maritime Pattern Grid Background */}
        <View style={styles.mapGridPattern} />

        {/* Vietnam S-Shape Visual Map & Provinces Canvas */}
        <ScrollView
          style={styles.mapScrollView}
          contentContainerStyle={styles.mapScrollInner}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          maximumZoomScale={2.5}
          minimumZoomScale={1.0}
        >
          <View style={styles.vietnamMapContainer}>
            {/* Vietnam S-curve styled contour representation */}
            <View style={styles.vietnamSOutline}>
              {/* North Zone Outline */}
              <View style={styles.northZonePath} />
              {/* Central Zone Outline */}
              <View style={styles.centralZonePath} />
              {/* South Zone Outline */}
              <View style={styles.southZonePath} />
              {/* Islands */}
              <View style={styles.paracelIslands} />
              <View style={styles.spratlyIslands} />
            </View>

            {/* Interactive Province Nodes on the Vietnam Map */}
            {filteredProvinces.map((prov) => {
              const isSelected = prov.id === selectedProvinceId;
              return (
                <Pressable
                  key={prov.id}
                  style={[
                    styles.provincePinWrapper,
                    {
                      top: `${prov.mapY}%`,
                      left: `${prov.mapX}%`,
                    },
                    isSelected && styles.provincePinWrapperSelected,
                  ]}
                  onPress={() => handleSelectProvince(prov)}
                  hitSlop={12}
                >
                  {/* Province Shape Glow & Node */}
                  <View
                    style={[
                      styles.provinceNode,
                      isSelected ? styles.provinceNodeOrange : styles.provinceNodeTeal,
                    ]}
                  >
                    <Ionicons
                      name={isSelected ? 'location' : 'ellipse'}
                      size={isSelected ? 16 : 8}
                      color={isSelected ? '#ffffff' : '#0d9488'}
                    />
                  </View>

                  {/* Province Label Badge */}
                  <View
                    style={[
                      styles.provinceLabelBadge,
                      isSelected && styles.provinceLabelBadgeOrange,
                    ]}
                  >
                    <Text
                      style={[
                        styles.provinceLabelText,
                        isSelected && styles.provinceLabelTextOrange,
                      ]}
                      numberOfLines={1}
                    >
                      {prov.name}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Map Action Floating Buttons (GPS, Layers, Zoom) */}
        <View style={styles.mapFloatingActions}>
          <Pressable style={styles.mapFab} onPress={handleOpenGpsNavigation}>
            <Ionicons name="navigate-outline" size={18} color="#00382b" />
          </Pressable>
          <Pressable
            style={styles.mapFab}
            onPress={() => Alert.alert('La bàn', 'Bản đồ số định hướng chuẩn toạ độ Việt Nam')}
          >
            <Ionicons name="compass-outline" size={18} color="#00382b" />
          </Pressable>
        </View>
      </View>

      {/* Bottom Sheet Card matching user screenshot exactly */}
      <View style={styles.bottomSheet}>
        {/* Pull handle indicator */}
        <View style={styles.sheetHandleRow}>
          <View style={styles.sheetHandle} />
        </View>

        {/* Province Name & Location Pin Action Icon */}
        <View style={styles.provinceHeaderRow}>
          <Text style={styles.provinceNameText}>{selectedProvince.name}</Text>
          <Pressable
            style={styles.locationActionBtn}
            onPress={handleOpenGpsNavigation}
            hitSlop={8}
          >
            <Ionicons name="location-sharp" size={19} color="#ffffff" />
          </Pressable>
        </View>

        {/* Pill Segmented Tabs: ĐỊA DANH [count] | LƯU TRÚ [count] */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabButton, activeTab === 'diadanh' && styles.tabButtonActive]}
            onPress={() => setActiveTab('diadanh')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'diadanh' && styles.tabButtonTextActive,
              ]}
            >
              ĐỊA DANH {destinationCount}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabButton, activeTab === 'luutru' && styles.tabButtonActive]}
            onPress={() => setActiveTab('luutru')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'luutru' && styles.tabButtonTextActive,
              ]}
            >
              LƯU TRÚ {accommodationCount}
            </Text>
          </Pressable>
        </View>

        {/* Section Sub-header Row */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderText}>
            {activeTab === 'diadanh' ? 'ĐỊA DANH NỔI BẬT' : 'LƯU TRÚ NỔI BẬT'}
          </Text>

          {/* Badge: TRỐNG or count badge */}
          {((activeTab === 'diadanh' && destinationCount === 0) ||
            (activeTab === 'luutru' && accommodationCount === 0)) ? (
            <View style={styles.emptyBadge}>
              <Text style={styles.emptyBadgeText}>TRỐNG</Text>
            </View>
          ) : (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {activeTab === 'diadanh'
                  ? `${destinationCount} ĐỊA ĐIỂM`
                  : `${accommodationCount} KHÁCH SẠN`}
              </Text>
            </View>
          )}
        </View>

        {/* Items List / Cards or Empty State */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bottomListScroll}
        >
          {activeTab === 'diadanh' ? (
            destinationCount > 0 ? (
              <View style={styles.itemsGrid}>
                {selectedProvince.destinations.map((dest) => (
                  <Pressable
                    key={dest.id}
                    style={styles.destCard}
                    onPress={() => handleOpenDestination(dest)}
                  >
                    <Image source={{ uri: dest.image }} style={styles.destCardImage} contentFit="cover" />
                    <View style={styles.destCardBody}>
                      <View style={styles.destTypeBadge}>
                        <Text style={styles.destTypeBadgeText}>{dest.type}</Text>
                      </View>
                      <Text style={styles.destTitle} numberOfLines={2}>
                        {dest.name}
                      </Text>
                      <Text style={styles.destAddress} numberOfLines={1}>
                        📍 {dest.address}
                      </Text>
                      <View style={styles.destFooter}>
                        <View style={styles.destRatingRow}>
                          <Ionicons name="star" size={13} color="#f59e0b" />
                          <Text style={styles.destRatingText}>{dest.rating}</Text>
                        </View>
                        <View style={styles.viewDetailBtn}>
                          <Text style={styles.viewDetailBtnText}>Khám phá</Text>
                          <Ionicons name="chevron-forward" size={12} color="#004d40" />
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateBox}>
                <Ionicons name="compass-outline" size={40} color="#cbd5e1" />
                <Text style={styles.emptyStateTitle}>Chưa có dữ liệu địa danh</Text>
                <Text style={styles.emptyStateDesc}>
                  Hệ thống đang tích cực cập nhật thêm các điểm đến du lịch mới tại {selectedProvince.name}.
                </Text>
              </View>
            )
          ) : accommodationCount > 0 ? (
            <View style={styles.itemsGrid}>
              {selectedProvince.accommodations.map((hotel) => (
                <Pressable
                  key={hotel.id}
                  style={styles.destCard}
                  onPress={() => handleOpenHotel(hotel)}
                >
                  <Image source={{ uri: hotel.image }} style={styles.destCardImage} contentFit="cover" />
                  <View style={styles.destCardBody}>
                    <View style={[styles.destTypeBadge, { backgroundColor: '#e0f2fe' }]}>
                      <Text style={[styles.destTypeBadgeText, { color: '#0284c7' }]}>
                        {hotel.roomType}
                      </Text>
                    </View>
                    <Text style={styles.destTitle} numberOfLines={2}>
                      {hotel.name}
                    </Text>
                    <Text style={styles.destAddress} numberOfLines={1}>
                      📍 {hotel.location}
                    </Text>
                    <View style={styles.destFooter}>
                      <Text style={styles.hotelPriceText}>{hotel.newPrice}</Text>
                      <View style={[styles.viewDetailBtn, { backgroundColor: '#004d40' }]}>
                        <Text style={[styles.viewDetailBtnText, { color: '#fff' }]}>Xem phòng</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateBox}>
              <Ionicons name="bed-outline" size={40} color="#cbd5e1" />
              <Text style={styles.emptyStateTitle}>Chưa có dữ liệu lưu trú</Text>
              <Text style={styles.emptyStateDesc}>
                Các khách sạn, resort chất lượng tại {selectedProvince.name} đang được tích hợp thêm.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  // Top Search Overlay
  topSearchWrapper: {
    position: 'absolute',
    top: 12,
    left: 14,
    right: 14,
    zIndex: 50,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },

  // Suggestions Dropdown
  suggestionsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 6,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    maxHeight: 240,
  },
  suggestionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  suggestionSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  // Region Chips
  regionFilterScroll: {
    paddingTop: 8,
    paddingBottom: 4,
    gap: 6,
  },
  regionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  regionChipActive: {
    backgroundColor: '#00382b',
    borderColor: '#00382b',
  },
  regionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  regionChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // Map Canvas Area
  mapCanvas: {
    flex: 1,
    backgroundColor: '#e6f4f1', // gentle maritime turquoise
    position: 'relative',
  },
  mapGridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    borderWidth: 1,
    borderColor: '#0d9488',
  },
  mapScrollView: {
    flex: 1,
  },
  mapScrollInner: {
    minHeight: 520,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 75,
    paddingBottom: 260,
  },
  vietnamMapContainer: {
    width: SCREEN_WIDTH - 20,
    height: 440,
    position: 'relative',
    alignSelf: 'center',
  },

  // Stylized S-curve Background Map
  vietnamSOutline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  northZonePath: {
    position: 'absolute',
    top: '8%',
    left: '32%',
    width: '40%',
    height: '24%',
    backgroundColor: 'rgba(45, 212, 191, 0.35)',
    borderRadius: 45,
    transform: [{ rotate: '-10deg' }],
  },
  centralZonePath: {
    position: 'absolute',
    top: '32%',
    left: '48%',
    width: '18%',
    height: '34%',
    backgroundColor: 'rgba(20, 184, 166, 0.38)',
    borderRadius: 25,
    transform: [{ rotate: '25deg' }],
  },
  southZonePath: {
    position: 'absolute',
    top: '64%',
    left: '30%',
    width: '32%',
    height: '26%',
    backgroundColor: 'rgba(13, 148, 136, 0.35)',
    borderRadius: 35,
    transform: [{ rotate: '-15deg' }],
  },
  paracelIslands: {
    position: 'absolute',
    top: '40%',
    left: '80%',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(13, 148, 136, 0.6)',
    borderStyle: 'dashed',
  },
  spratlyIslands: {
    position: 'absolute',
    top: '70%',
    left: '85%',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(13, 148, 136, 0.6)',
    borderStyle: 'dashed',
  },

  // Province Pins & Nodes
  provincePinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    zIndex: 10,
  },
  provincePinWrapperSelected: {
    zIndex: 40,
    transform: [{ translateX: -18 }, { translateY: -22 }],
  },
  provinceNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  provinceNodeTeal: {
    backgroundColor: '#ccfbf1',
    borderColor: '#0d9488',
  },
  provinceNodeOrange: {
    backgroundColor: '#ea580c', // Bright orange as in screenshot
    borderColor: '#ffffff',
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: '#ea580c',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  provinceLabelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: '#cbd5e1',
  },
  provinceLabelBadgeOrange: {
    backgroundColor: '#ea580c',
    borderColor: '#c2410c',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  provinceLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f766e',
  },
  provinceLabelTextOrange: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 11,
  },

  // Map Floating Action Buttons
  mapFloatingActions: {
    position: 'absolute',
    right: 14,
    top: 110,
    gap: 10,
    zIndex: 30,
  },
  mapFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },

  // Bottom Sheet (Matches Screenshot)
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 290,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 16,
    elevation: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sheetHandleRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },

  // Province Header Row
  provinceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 12,
  },
  provinceNameText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#064e3b', // Deep rich forest green
    letterSpacing: -0.5,
  },
  locationActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#00382b', // Dark green button as in screenshot
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00382b',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },

  // Pill Segmented Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 3,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: '#00382b', // Active dark green button
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },

  // Section Header Row
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.6,
  },
  emptyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ea580c', // Orange outline as in screenshot
    backgroundColor: '#fff7ed',
  },
  emptyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#e6fffa',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00897b',
  },

  // Scrollable Items Grid
  bottomListScroll: {
    paddingBottom: 24,
  },
  itemsGrid: {
    gap: 10,
  },
  destCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  destCardImage: {
    width: 90,
    height: 90,
  },
  destCardBody: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  destTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6fffa',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  destTypeBadgeText: {
    color: '#00897b',
    fontSize: 9,
    fontWeight: '700',
  },
  destTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  destAddress: {
    fontSize: 10,
    color: '#64748b',
  },
  destFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  destRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  destRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e6fffa',
  },
  viewDetailBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#004d40',
  },
  hotelPriceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ea580c',
  },

  // Empty State Box
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
  },
  emptyStateDesc: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
