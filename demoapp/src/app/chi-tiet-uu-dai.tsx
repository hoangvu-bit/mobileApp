import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Share, Alert, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';

const { width } = Dimensions.get('window');

interface VoucherMasterItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  desc: string;
  discountBadge: string;
  discountValue: string;
  maxDiscount: string;
  minSpend: string;
  expiry: string;
  category: string;
  categoryBadge: string;
  badgeBg: string;
  badgeText: string;
  usedPercent: number;
  applicableTickets: {
    name: string;
    location: string;
    price: string;
    image: string;
    desc: string;
  }[];
  terms: string[];
}

const VOUCHERS_MASTER: Record<string, VoucherMasterItem> = {
  CHAOBANMOI: {
    id: 'v-chao-moi',
    code: 'CHAOBANMOI',
    title: 'Ưu đãi khách mới - Chào bạn mới',
    subtitle: 'Giảm 15% tối đa 150.000đ cho đơn đặt vé & tour đầu tiên',
    desc: 'Dành riêng cho khách hàng lần đầu tiên đặt dịch vụ du lịch, vé tham quan trên nền tảng iGovi.vn.',
    discountBadge: '15%',
    discountValue: 'Giảm 15% tổng đơn',
    maxDiscount: 'Tối đa 150.000đ',
    minSpend: '0đ (Áp dụng mọi đơn)',
    expiry: '23:59 - 31/03/2026',
    category: 'Khách hàng mới',
    categoryBadge: 'ĐẶC QUYỀN MỚI',
    badgeBg: '#ffdad4',
    badgeText: '#b32113',
    usedPercent: 42,
    applicableTickets: [
      {
        name: 'Buffet trưa Vân Sơn Núi Bà Đen',
        location: 'TP. Tây Ninh, Tây Ninh',
        price: '250.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
        desc: 'Thưởng thức hơn 80 món ăn đặc sản vùng miền trên đỉnh núi Bà Đen hùng vĩ.',
      },
      {
        name: 'Vé VinWonders Phú Quốc',
        location: 'Phú Quốc, Kiên Giang',
        price: '950.000đ',
        image: 'https://labantour.com/wp-content/uploads/2020/11/103423248_3588209407868560_8677725992511001004_n.jpg',
        desc: 'Công viên chủ đề hàng đầu Châu Á với hàng trăm trò chơi kỷ lục thế giới.',
      },
      {
        name: 'Vé Sun World Ba Na Hills',
        location: 'Đà Nẵng',
        price: '900.000đ',
        image: 'https://tixgo.vn/sites/default/files/ve-sunworld-ba-na-hills-ava.jpg',
        desc: 'Chiêm ngưỡng Cầu Vàng lừng danh thế giới và thị trấn Pháp cổ kính.',
      },
    ],
    terms: [
      'Chỉ áp dụng cho tài khoản đăng ký mới và chưa từng hoàn tất đơn hàng nào trên iGovi.',
      'Giảm tối đa 150.000đ trực tiếp trên tổng giá trị thanh toán vé tham quan hoặc tour.',
      'Mỗi khách hàng (dựa trên số điện thoại, thiết bị di động) chỉ được sử dụng mã 01 lần duy nhất.',
      'Không áp dụng đồng thời với các chương trình khuyến mãi thẻ ngân hàng hoặc voucher đối tác khác.',
      'Mã ưu đãi không có giá trị quy đổi thành tiền mặt hoặc bảo lưu khi hủy vé theo yêu cầu cá nhân.',
    ],
  },

  SUNWORLD50: {
    id: 'v-sunworld-50',
    code: 'SUNWORLD50',
    title: 'Ưu đãi Cáp treo & Sun World toàn quốc',
    subtitle: 'Giảm ngay 50.000đ cho đơn vé tham quan từ 300.000đ',
    desc: 'Ưu đãi giảm giá trực tiếp khi mua vé cáp treo Sun World Núi Bà Đen, Sun World Ba Na Hills, Hạ Long.',
    discountBadge: '50K',
    discountValue: 'Giảm 50.000đ',
    maxDiscount: '50.000đ',
    minSpend: 'Từ 300.000đ',
    expiry: '23:59 - 28/02/2026',
    category: 'Vé cáp treo & Tham quan',
    categoryBadge: 'VÉ CÁP TREO',
    badgeBg: '#fee2e2',
    badgeText: '#b32113',
    usedPercent: 78,
    applicableTickets: [
      {
        name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
        location: 'TP. Tây Ninh, Tây Ninh',
        price: '400.000đ',
        image: 'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
        desc: 'Vé cáp treo khứ hồi lên khu vực Đỉnh Vân Sơn, phù hợp khách săn mây và ngắm toàn cảnh Tây Ninh.',
      },
      {
        name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
        location: 'TP. Tây Ninh, Tây Ninh',
        price: '245.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAQuEjb-Bt5eFuEplUPQGqLDhhRhxOjsE5gF4uv78cqB0WC9ZH3ZB_f7ctnG6NrQJdp13H09dTGE_26sEeXUYIouHmEFqK164P99sYk8fiYe3791lOmhL7AIDV9VDvE8lxk98uJjOi9vqYAphBTeFO6yuYjtcZB6-DZDKF8zfPfmIhgWmHg3RVOw71JKBm-wsZUUOES4ZfOFwkY4PYjEePrGp2UjHhZTn34YIenlI70ZgzeMXwy7H',
        desc: 'Hành hương chiêm bái quần thể Chùa Hang linh thiêng và ngắm cảnh sắc thiên nhiên hùng vĩ.',
      },
      {
        name: 'Vé Sun World Ba Na Hills',
        location: 'Đà Nẵng',
        price: '900.000đ',
        image: 'https://tixgo.vn/sites/default/files/ve-sunworld-ba-na-hills-ava.jpg',
        desc: 'Tuyến cáp treo đạt nhiều kỷ lục thế giới cùng hàng trăm trải nghiệm vui chơi đẳng cấp.',
      },
      {
        name: 'Vé Sun World Hạ Long Complex',
        location: 'Hạ Long, Quảng Ninh',
        price: '350.000đ',
        image: 'https://res.klook.com/image/upload/w_1265,h_791,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/sytsmedhoitvwcasveut.webp',
        desc: 'Khám phá Công viên Rồng, Công viên Nước Vịnh Lốc Xoáy và Cáp treo Nữ Hoàng.',
      },
    ],
    terms: [
      'Áp dụng cho mọi tuyến cáp treo và vé tham quan thuộc các tổ hợp Sun World trên iGovi.',
      'Giá trị đơn hàng tối thiểu từ 300.000đ trở lên (chưa bao gồm các khoản thuế phí khác).',
      'Số lượng mã phát ra có hạn mỗi ngày, hệ thống ưu tiên cho người hoàn tất thanh toán trước.',
      'Mỗi đơn hàng chỉ được sử dụng tối đa 01 mã ưu đãi.',
    ],
  },

  BUFFETVANSON: {
    id: 'v-buffet-vanson',
    code: 'BUFFETVANSON',
    title: 'Buffet nướng & lẩu Vân Sơn Núi Bà Đen',
    subtitle: 'Giảm ngay 100.000đ cho đơn vé buffet và combo ẩm thực từ 500.000đ',
    desc: 'Ưu đãi tiệc buffet trưa đặc sản vùng miền tại nhà hàng Vân Sơn trên đỉnh núi Bà Đen.',
    discountBadge: '100K',
    discountValue: 'Giảm 100.000đ',
    maxDiscount: '100.000đ',
    minSpend: 'Từ 500.000đ',
    expiry: 'Hôm nay (23:59)',
    category: 'Ẩm thực & Buffet',
    categoryBadge: 'ẨM THỰC',
    badgeBg: '#ffdcbe',
    badgeText: '#874e00',
    usedPercent: 92,
    applicableTickets: [
      {
        name: 'Combo Núi Bà Đen: Cáp treo Đỉnh Vân Sơn + buffet trưa',
        location: 'TP. Tây Ninh, Tây Ninh',
        price: '550.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
        desc: 'Combo ưu đãi trọn gói vé cáp treo khứ hồi và suất ăn buffet hơn 80 món hấp dẫn.',
      },
      {
        name: 'Buffet trưa Vân Sơn Núi Bà Đen',
        location: 'TP. Tây Ninh, Tây Ninh',
        price: '250.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
        desc: 'Suất ăn buffet trưa dùng trong ngày cho khách đã có vé cáp treo.',
      },
    ],
    terms: [
      'Áp dụng khi mua từ 2 vé buffet lẻ hoặc các gói combo vé cáp treo kèm buffet.',
      'Đơn hàng đạt giá trị tối thiểu từ 500.000đ.',
      'Khung giờ phục vụ buffet từ 10:30 đến 14:00 hàng ngày tại Nhà hàng Vân Sơn đỉnh Núi Bà Đen.',
      'Voucher có hiệu lực trong ngày, khách cần đổi vé QR trước khi vào nhà hàng.',
    ],
  },

  DEALCUOITUAN: {
    id: 'v-deal-cuoi-tuan',
    code: 'DEALCUOITUAN',
    title: 'Săn deal cuối tuần rực rỡ',
    subtitle: 'Giảm trực tiếp 80.000đ cho đơn vé vui chơi cuối tuần từ 400.000đ',
    desc: 'Ưu đãi giải trí cuối tuần áp dụng cho các điểm đến hàng đầu: Hạ Long, Đà Lạt, Vũng Tàu, Phú Quốc.',
    discountBadge: '80K',
    discountValue: 'Giảm 80.000đ',
    maxDiscount: '80.000đ',
    minSpend: 'Từ 400.000đ',
    expiry: '23:59 Chủ nhật này',
    category: 'Săn deal cuối tuần',
    categoryBadge: 'CUỐI TUẦN',
    badgeBg: '#dcfce7',
    badgeText: '#166534',
    usedPercent: 86,
    applicableTickets: [
      {
        name: 'Vé Máng trượt Datanla New Alpine Coaster',
        location: 'Đà Lạt, Lâm Đồng',
        price: '250.000đ',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        desc: 'Tuyến máng trượt băng rừng thông dài nhất Đông Nam Á dẫn xuống thác Datanla tuyệt đẹp.',
      },
      {
        name: 'Vé Khu du lịch Cáp treo Hồ Mây Park trọn gói',
        location: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
        price: '400.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAQuEjb-Bt5eFuEplUPQGqLDhhRhxOjsE5gF4uv78cqB0WC9ZH3ZB_f7ctnG6NrQJdp13H09dTGE_26sEeXUYIouHmEFqK164P99sYk8fiYe3791lOmhL7AIDV9VDvE8lxk98uJjOi9vqYAphBTeFO6yuYjtcZB6-DZDKF8zfPfmIhgWmHg3RVOw71JKBm-wsZUUOES4ZfOFwkY4PYjEePrGp2UjHhZTn34YIenlI70ZgzeMXwy7H',
        desc: 'Tổ hợp vui chơi giải trí trên đỉnh Núi Lớn bao gồm cáp treo khứ hồi và hơn 100 trò chơi.',
      },
      {
        name: 'Vé Sun World Hạ Long Complex',
        location: 'Hạ Long, Quảng Ninh',
        price: '350.000đ',
        image: 'https://res.klook.com/image/upload/w_1265,h_791,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/sytsmedhoitvwcasveut.webp',
        desc: 'Công viên giải trí ven biển vịnh di sản với vòng quay Mặt trời và cáp treo Nữ hoàng.',
      },
    ],
    terms: [
      'Áp dụng cho các đơn đặt vé có ngày sử dụng vào Thứ Bảy hoặc Chủ Nhật.',
      'Đơn hàng tối thiểu từ 400.000đ trở lên.',
      'Số lượng mã mở bán có hạn và được cập nhật vào mỗi 00:00 Thứ Sáu hàng tuần.',
    ],
  },

  HOIVIEN10: {
    id: 'v-hoi-vien-10',
    code: 'HOIVIEN10',
    title: 'Đặc quyền Hội viên thân thiết iGovi',
    subtitle: 'Giảm 10% tối đa 100.000đ cho mọi đơn vé và combo từ 200.000đ',
    desc: 'Chương trình tri ân dành riêng cho các thành viên thân thiết có tài khoản iGovi đã xác thực.',
    discountBadge: '10%',
    discountValue: 'Giảm 10%',
    maxDiscount: 'Tối đa 100.000đ',
    minSpend: 'Từ 200.000đ',
    expiry: '23:59 - 30/04/2026',
    category: 'Hội viên iGovi',
    categoryBadge: 'HỘI VIÊN',
    badgeBg: '#e0e7ff',
    badgeText: '#3730a3',
    usedPercent: 58,
    applicableTickets: [
      {
        name: 'Vé Vinpearl Safari Phú Quốc',
        location: 'Phú Quốc, Kiên Giang',
        price: '650.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAGzag4JWCmqBtN4mYGy6MERp-frzyeBC6nRoGOAPRwvo_KRQv212W5LFMkH4h-aNMgVbvRcmo8YRhRZ0xjAevClzlZ2h59cQeAt_-ciE-QVymPMePoC1eTnJmazNG68usffuP6JhObJw0K-OPnLmNotdYxlLwsizfiP-xNl_jtEmdYKUE-iVJqyk2pdB5IxCECOQwlcjkzH29D3-Kqy2z0oEo2wI1YxaRAjBBi4fQOaqWRaGrdT_Q',
        desc: 'Công viên chăm sóc và bảo tồn động vật bán hoang dã lớn nhất Việt Nam.',
      },
      {
        name: 'Vé Tắm suối khoáng nóng Yoko Onsen Quang Hanh',
        location: 'Hạ Long, Quảng Ninh',
        price: '1.200.000đ',
        image: 'https://tanthoidai.com.vn/images/products/2020/11/06/132491321181670064.jpeg',
        desc: 'Thư giãn trong làn nước khoáng nóng đậm chất Nhật Bản tại thung lũng Quang Hanh.',
      },
      {
        name: 'Vé VinWonders Nha Trang (Hòn Tre)',
        location: 'Nha Trang, Khánh Hòa',
        price: '800.000đ',
        image: 'https://labantour.com/wp-content/uploads/2020/11/103423248_3588209407868560_8677725992511001004_n.jpg',
        desc: 'Khu vui chơi giải trí kỷ lục với cáp treo vượt biển, show Tata và công viên nước.',
      },
    ],
    terms: [
      'Dành cho tài khoản thành viên iGovi đã xác thực số điện thoại và email.',
      'Giảm 10% trên tổng giá trị đơn hàng, mức giảm tối đa không quá 100.000đ.',
      'Áp dụng cho mọi ngày trong tuần, kể cả dịp lễ Tết.',
    ],
  },

  TOURTAYNINH: {
    id: 'v-tour-tayninh',
    code: 'TOURTAYNINH',
    title: 'Tour Trải Nghiệm Tây Ninh 1 Ngày',
    subtitle: 'Giảm trực tiếp 70.000đ cho nhóm từ 2 khách đặt tour',
    desc: 'Khám phá trọn vẹn vẻ đẹp văn hóa và tâm linh Tây Ninh với cáp treo Núi Bà Đen và Tòa Thánh.',
    discountBadge: '70K',
    discountValue: 'Giảm 70.000đ',
    maxDiscount: '70.000đ',
    minSpend: 'Từ 400.000đ',
    expiry: '23:59 - 15/03/2026',
    category: 'Tour du lịch',
    categoryBadge: 'TOUR TÂY NINH',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    usedPercent: 64,
    applicableTickets: [
      {
        name: 'Buffet trưa Vân Sơn Núi Bà Đen',
        location: 'TP. Tây Ninh, Tây Ninh',
        price: '250.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
        desc: 'Hành hương ngắm cảnh và thưởng thức buffet đặc sản Tây Ninh.',
      },
      {
        name: 'Tour Săn Mây Cầu Đất Đà Lạt 1 ngày',
        location: 'Đà Lạt, Lâm Đồng',
        price: '280.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtVyo6jfAZaAtobBsbx4P6Yab0-8VZlB0HRK0JbUisjyAkpcJk3a7aLeA30IA20mMmuK0Zs5yf6t9ZYWYHAZjyQT-nEwpKlvmYKOWBO1h4qS0-tFc7DGJzV1WfV_hopaBDQ85WiMXSzCx0s23TrW1Wuh14zq9Mf6gLYcEBUjvkunqdjDsl75xp-zfpbBd67MyMNRTnrj5NXGRekTle7y6548nbFeOEgLbveA_w49x_BCDIwsmhSIl',
        desc: 'Đón bình minh trên đồi chè Cầu Đất và săn biển mây bồng bềnh tuyệt đẹp.',
      },
    ],
    terms: [
      'Áp dụng cho các tour du lịch trong ngày hoặc combo vé trải nghiệm theo lịch trình.',
      'Yêu cầu đơn hàng tối thiểu 400.000đ.',
      'Khách cần đặt trước tối thiểu 24 giờ trước giờ khởi hành.',
    ],
  },

  VIMOI30: {
    id: 'v-vi-moi-30',
    code: 'VIMOI30',
    title: 'Ưu đãi liên kết Ví MoMo & ZaloPay',
    subtitle: 'Giảm thêm 30.000đ cho đơn hàng thanh toán qua ví điện tử từ 200.000đ',
    desc: 'Áp dụng cho khách hàng chọn thanh toán qua ví điện tử liên kết trên ứng dụng iGovi.',
    discountBadge: '30K',
    discountValue: 'Giảm 30.000đ',
    maxDiscount: '30.000đ',
    minSpend: 'Từ 200.000đ',
    expiry: '23:59 - 31/03/2026',
    category: 'Ví điện tử',
    categoryBadge: 'VÍ ĐIỆN TỬ',
    badgeBg: '#f3e8ff',
    badgeText: '#7e22ce',
    usedPercent: 45,
    applicableTickets: [
      {
        name: 'Vé Máng trượt Datanla New Alpine Coaster',
        location: 'Đà Lạt, Lâm Đồng',
        price: '250.000đ',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        desc: 'Trải nghiệm máng trượt tốc độ ngắm cảnh rừng thông Đà Lạt.',
      },
      {
        name: 'Vé Công viên nước Vũng Tàu Marina & Du thuyền',
        location: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
        price: '180.000đ',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4fTUQo5xCGQnA0SJyxZEENYH6Zfq1QiEPxJRAcpBM_wUQPqPLtLyh_dgOqX3SR2wom1yqZNsDl3KYPvlMAnQoZi3nyvBpejxULGRpMPLK-qUXTzE9xG8hteg116vk8VhVvjsjLHjg5vubZ677Z-ExP0_-g8McGKCiSI3uBI_H27LV8rcLWSI575ElLIjKIBKoTaSFNCIk4OTczbUprUJL6wjYDxyG7GYoRob1hQJIKcWeEBOHxR6aQ',
        desc: 'Chèo thuyền kayak và check-in cánh buồm rực rỡ tại bến Marina.',
      },
    ],
    terms: [
      'Áp dụng khi chọn phương thức thanh toán là Ví MoMo hoặc ZaloPay tại cổng thanh toán.',
      'Đơn hàng có giá trị thực thanh toán từ 200.000đ.',
      'Mỗi tài khoản ví được hưởng ưu đãi 01 lần/tháng.',
    ],
  },
};

export default function UuDaiDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    code?: string;
    title?: string;
    desc?: string;
    image?: string;
    discount?: string;
    minSpend?: string;
  }>();

  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Determine current voucher data
  const voucher: VoucherMasterItem = useMemo(() => {
    const codeKey = (params.code || '').toUpperCase();
    if (codeKey && VOUCHERS_MASTER[codeKey]) {
      return VOUCHERS_MASTER[codeKey];
    }
    // Search by title or id
    const foundByCode = Object.values(VOUCHERS_MASTER).find(
      v => v.code === codeKey || v.id === params.id || (params.title && v.title.toLowerCase().includes(params.title.toLowerCase()))
    );
    if (foundByCode) return foundByCode;

    // Fallback dynamic item
    const code = params.code || 'IGOVI2026';
    return {
      id: params.id || 'v-dynamic',
      code,
      title: params.title || 'Ưu đãi vé du lịch iGovi',
      subtitle: params.desc || 'Ưu đãi giảm giá đặc biệt khi đặt vé du lịch & tour',
      desc: params.desc || 'Áp dụng cho mọi khách hàng đặt vé tham quan và trải nghiệm trên hệ thống iGovi.',
      discountBadge: params.discount || 'GIẢM GIÁ',
      discountValue: params.discount ? `Giảm ${params.discount}` : 'Ưu đãi trực tiếp',
      maxDiscount: 'Theo quy định chương trình',
      minSpend: params.minSpend || 'Đơn từ 200.000đ',
      expiry: '23:59 - 31/12/2026',
      category: 'Ưu đãi iGovi',
      categoryBadge: 'ĐẶC QUYỀN IGOVI',
      badgeBg: '#fee2e2',
      badgeText: '#b32113',
      usedPercent: 65,
      applicableTickets: [
        {
          name: 'Buffet trưa Vân Sơn Núi Bà Đen',
          location: 'TP. Tây Ninh, Tây Ninh',
          price: '250.000đ',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ',
          desc: 'Vé buffet trưa dùng trong ngày cho khách đã có vé tham quan hoặc muốn đặt thêm dịch vụ ăn uống.',
        },
        {
          name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
          location: 'TP. Tây Ninh, Tây Ninh',
          price: '400.000đ',
          image: 'https://eholiday.vn/wp-content/uploads/2024/09/dinh-van-son-nui-ba-den-tay-ninh.jpg',
          desc: 'Vé cáp treo khứ hồi lên khu vực Đỉnh Vân Sơn, phù hợp khách săn mây và ngắm toàn cảnh Tây Ninh.',
        },
      ],
      terms: [
        'Áp dụng cho khách hàng đặt dịch vụ trên ứng dụng hoặc website igovi.vn.',
        'Vui lòng chọn hoặc nhập mã tại bước kiểm tra vé để được hưởng giảm giá.',
        'Mỗi đơn hàng được áp dụng 01 mã ưu đãi.',
        'Số lượng có hạn, chương trình có thể kết thúc khi hết ngân sách khuyến mại.',
      ],
    };
  }, [params.code, params.id, params.title, params.desc, params.discount, params.minSpend]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🔥 Nhận ngay mã ưu đãi [${voucher.code}] - ${voucher.title} trên iGovi: ${voucher.subtitle}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyCode = () => {
    setIsCopied(true);
    Alert.alert(
      'Sao chép thành công',
      `Mã [${voucher.code}] đã được sao chép!\nBạn có thể dán mã này tại bước thanh toán vé.`,
      [{ text: 'Đồng ý' }]
    );
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleToggleSave = () => {
    const next = !isSaved;
    setIsSaved(next);
    if (next) {
      Alert.alert('Đã lưu mã', `Mã [${voucher.code}] đã được lưu vào ví voucher tài khoản của bạn.`);
    }
  };

  const handleUseVoucher = (ticket?: any) => {
    if (ticket) {
      router.push({
        pathname: '/chi-tiet-ve',
        params: {
          name: ticket.name,
          price: ticket.price,
          location: ticket.location,
          image: ticket.image,
          desc: ticket.desc,
          voucherCode: voucher.code,
        },
      });
    } else {
      // Pick first applicable ticket or navigate to travel ticket list
      if (voucher.applicableTickets && voucher.applicableTickets.length > 0) {
        const first = voucher.applicableTickets[0];
        router.push({
          pathname: '/chi-tiet-ve',
          params: {
            name: first.name,
            price: first.price,
            location: first.location,
            image: first.image,
            desc: first.desc,
            voucherCode: voucher.code,
          },
        });
      } else {
        router.push('/ve-du-lich');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable style={styles.navBackBtn} onPress={() => router.back()} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#0f172a" />
          <Text style={styles.navBackText}>Quay lại</Text>
        </Pressable>
        <Text style={styles.navTitle} numberOfLines={1}>Chi tiết ưu đãi</Text>
        <View style={styles.navActions}>
          <Pressable style={styles.navActionBtn} onPress={handleShare} hitSlop={10}>
            <SymbolView name="square.and.arrow.up" size={18} tintColor="#0f172a" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Ticket Card Voucher (Real-world Ticket Perforated Shape) */}
        <View style={styles.ticketOuter}>
          <View style={styles.ticketCard}>
            {/* Cutouts on left & right */}
            <View style={styles.leftCutout} />
            <View style={styles.rightCutout} />

            {/* Top Tag & Category */}
            <View style={styles.ticketTopRow}>
              <View style={[styles.categoryBadge, { backgroundColor: voucher.badgeBg }]}>
                <SymbolView name="tag.fill" size={12} tintColor={voucher.badgeText} />
                <Text style={[styles.categoryBadgeText, { color: voucher.badgeText }]}>
                  {voucher.categoryBadge}
                </Text>
              </View>
              <View style={styles.validStatusBadge}>
                <View style={styles.greenPulse} />
                <Text style={styles.validStatusText}>Khả dụng</Text>
              </View>
            </View>

            {/* Title & Big Discount Display */}
            <Text style={styles.ticketTitle}>{voucher.title}</Text>
            <Text style={styles.ticketSubtitle}>{voucher.subtitle}</Text>

            {/* Dotted divider across ticket */}
            <View style={styles.dottedDivider} />

            {/* Code Box & Copy Button */}
            <View style={styles.codeContainer}>
              <View style={styles.codeTextWrap}>
                <Text style={styles.codeLabel}>MÃ ƯU ĐÃI CỦA BẠN</Text>
                <Text style={styles.codeMain}>{voucher.code}</Text>
              </View>
              <Pressable
                style={[styles.copyBtn, isCopied && styles.copyBtnCopied]}
                onPress={handleCopyCode}
              >
                <SymbolView
                  name={isCopied ? 'checkmark' : 'doc.on.doc'}
                  size={14}
                  tintColor={isCopied ? '#168b58' : '#ea580c'}
                />
                <Text style={[styles.copyBtnText, isCopied && styles.copyBtnTextCopied]}>
                  {isCopied ? 'Đã chép' : 'Sao chép'}
                </Text>
              </Pressable>
            </View>

            {/* Barcode Simulator Display */}
            <View style={styles.barcodeWrap}>
              <View style={styles.barcodeLines}>
                {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 3, 5, 2, 4, 1, 3].map((w, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.barcodeBar,
                      { width: w, backgroundColor: idx % 4 === 0 ? '#64748b' : '#0f172a' }
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.barcodeText}>IGV-{voucher.code}-2026</Text>
            </View>

            {/* Usage Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Đã sử dụng {voucher.usedPercent}%</Text>
                <Text style={styles.expiryLabel}>HSD: {voucher.expiry}</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${voucher.usedPercent}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Voucher Stats Table */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionHeaderTitle}>THÔNG TIN MỨC GIẢM</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Mức giảm giá</Text>
              <Text style={styles.statValueGreen}>{voucher.discountValue}</Text>
            </View>
            <View style={styles.statDividerVertical} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Đơn tối thiểu</Text>
              <Text style={styles.statValue}>{voucher.minSpend}</Text>
            </View>
          </View>

          <View style={styles.statDividerHorizontal} />

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Giảm tối đa</Text>
              <Text style={styles.statValue}>{voucher.maxDiscount}</Text>
            </View>
            <View style={styles.statDividerVertical} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Đối tượng</Text>
              <Text style={styles.statValue}>{voucher.category}</Text>
            </View>
          </View>
        </View>

        {/* 3 Steps To Use */}
        <View style={styles.stepsCard}>
          <Text style={styles.sectionHeaderTitle}>HƯỚNG DẪN 3 BƯỚC SỬ DỤNG</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>1</Text></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Chọn dịch vụ hoặc vé cần mua</Text>
              <Text style={styles.stepDesc}>Nhấn nút &apos;Dùng ngay&apos; bên dưới hoặc chọn vé tham quan phù hợp trong danh mục.</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>2</Text></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Áp dụng mã tại bước thanh toán</Text>
              <Text style={styles.stepDesc}>Tại màn hình chi tiết đặt vé, chọn mã [{voucher.code}] trong hộp mã ưu đãi.</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>3</Text></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Kiểm tra giảm giá & thanh toán</Text>
              <Text style={styles.stepDesc}>Hệ thống tự động trừ tiền chiết khấu vào tổng thanh toán để bạn xác nhận an toàn.</Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsCard}>
          <Text style={styles.sectionHeaderTitle}>ĐIỀU KIỆN & ĐIỀU KHOẢN ÁP DỤNG</Text>
          {voucher.terms.map((term, index) => (
            <View key={index} style={styles.termRow}>
              <View style={styles.termDot} />
              <Text style={styles.termText}>{term}</Text>
            </View>
          ))}
        </View>

        {/* Applicable Tickets Recommendations */}
        {voucher.applicableTickets && voucher.applicableTickets.length > 0 && (
          <View style={styles.applicableSection}>
            <View style={styles.applicableHeader}>
              <View>
                <Text style={styles.applicableSub}>DÙNG ĐƯỢC NGAY</Text>
                <Text style={styles.applicableTitle}>Vé du lịch áp dụng mã này</Text>
              </View>
              <Pressable onPress={() => router.push('/ve-du-lich')}>
                <Text style={styles.viewMoreLink}>Tất cả vé ›</Text>
              </Pressable>
            </View>

            <View style={styles.ticketsList}>
              {voucher.applicableTickets.map((t, idx) => (
                <Pressable
                  key={idx}
                  style={styles.ticketItemCard}
                  onPress={() => handleUseVoucher(t)}
                >
                  <Image source={{ uri: t.image }} style={styles.ticketItemImage} />
                  <View style={styles.ticketItemInfo}>
                    <View style={styles.ticketItemLocationRow}>
                      <SymbolView name="mappin.and.ellipse" size={12} tintColor="#ea580c" />
                      <Text style={styles.ticketItemLocation}>{t.location}</Text>
                    </View>
                    <Text style={styles.ticketItemName} numberOfLines={2}>{t.name}</Text>
                    <View style={styles.ticketItemBottom}>
                      <View>
                        <Text style={styles.ticketItemPriceLabel}>Giá vé</Text>
                        <Text style={styles.ticketItemPrice}>{t.price}</Text>
                      </View>
                      <View style={styles.applyNowBadge}>
                        <Text style={styles.applyNowBadgeText}>Áp dụng mã</Text>
                        <SymbolView name="arrow.right" size={12} tintColor="#168b58" />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
          onPress={handleToggleSave}
        >
          <SymbolView
            name={isSaved ? 'bookmark.fill' : 'bookmark'}
            size={18}
            tintColor={isSaved ? '#168b58' : '#475569'}
          />
          <Text style={[styles.saveBtnText, isSaved && styles.saveBtnTextActive]}>
            {isSaved ? 'Đã lưu' : 'Lưu ví'}
          </Text>
        </Pressable>

        <Pressable style={styles.primaryUseBtn} onPress={() => handleUseVoucher()}>
          <SymbolView name="ticket.fill" size={18} tintColor="#fff" />
          <Text style={styles.primaryUseBtnText}>DÙNG MÃ NGAY</Text>
          <SymbolView name="arrow.right" size={16} tintColor="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    zIndex: 10,
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navBackText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    maxWidth: width - 160,
    textAlign: 'center',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },

  // Ticket Perforated Shape
  ticketOuter: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  leftCutout: {
    position: 'absolute',
    left: -12,
    top: '46%',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderRightWidth: 1,
    borderRightColor: '#fed7aa',
  },
  rightCutout: {
    position: 'absolute',
    right: -12,
    top: '46%',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderLeftWidth: 1,
    borderLeftColor: '#fed7aa',
  },
  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  validStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#168b58',
  },
  validStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#168b58',
    textTransform: 'uppercase',
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 28,
    marginBottom: 6,
  },
  ticketSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  dottedDivider: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff7ed',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 16,
  },
  codeTextWrap: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 1,
    marginBottom: 2,
  },
  codeMain: {
    fontSize: 20,
    fontWeight: '900',
    color: '#c2410c',
    letterSpacing: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffedd5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  copyBtnCopied: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ea580c',
  },
  copyBtnTextCopied: {
    color: '#168b58',
  },

  // Barcode
  barcodeWrap: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  barcodeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    gap: 3,
  },
  barcodeBar: {
    height: 36,
    borderRadius: 1,
  },
  barcodeText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 6,
  },

  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ea580c',
  },
  expiryLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ea580c',
    borderRadius: 3,
  },

  // Stats Table Card
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94a3b8',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  statValueGreen: {
    fontSize: 16,
    fontWeight: '900',
    color: '#168b58',
  },
  statDividerVertical: {
    width: 1,
    height: 36,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 12,
  },
  statDividerHorizontal: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },

  // Steps
  stepsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ea580c',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },

  // Terms
  termsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  termDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ea580c',
    marginTop: 7,
  },
  termText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },

  // Applicable Tickets
  applicableSection: {
    marginBottom: 20,
  },
  applicableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  applicableSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#168b58',
    letterSpacing: 1,
    marginBottom: 2,
  },
  applicableTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  viewMoreLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#168b58',
  },
  ticketsList: {
    gap: 12,
  },
  ticketItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  ticketItemImage: {
    width: 100,
    height: 100,
  },
  ticketItemInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  ticketItemLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketItemLocation: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  ticketItemName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
  },
  ticketItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ticketItemPriceLabel: {
    fontSize: 9,
    color: '#94a3b8',
  },
  ticketItemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ea580c',
  },
  applyNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  applyNowBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#168b58',
  },

  // Bottom Fixed Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  saveBtnActive: {
    borderColor: '#168b58',
    backgroundColor: '#f0fdf4',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  saveBtnTextActive: {
    color: '#168b58',
  },
  primaryUseBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ea580c',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryUseBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
