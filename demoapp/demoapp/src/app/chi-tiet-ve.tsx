import GlobalFooter from '../components/global-footer';
import React, { useState, useMemo } from 'react';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert, Dimensions, Modal, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

interface TicketVoucher {
  code: string;
  title: string;
  desc: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  maxDiscount?: number;
  minSpend: number;
  expiry: string;
  tag: string;
}

const AVAILABLE_VOUCHERS: TicketVoucher[] = [
  {
    code: 'CHAOBANMOI',
    title: 'Ưu đãi chào bạn mới',
    desc: 'Giảm 15% tối đa 150.000đ cho đơn đầu tiên',
    discountType: 'percent',
    discountValue: 15,
    maxDiscount: 150000,
    minSpend: 0,
    expiry: '31/03/2026',
    tag: 'Khách mới',
  },
  {
    code: 'SUNWORLD50',
    title: 'Ưu đãi vé Sun World & Cáp treo',
    desc: 'Giảm trực tiếp 50.000đ cho đơn từ 300.000đ',
    discountType: 'fixed',
    discountValue: 50000,
    minSpend: 300000,
    expiry: '28/02/2026',
    tag: 'Cáp treo',
  },
  {
    code: 'BUFFETVANSON',
    title: 'Buffet nướng & lẩu ẩm thực',
    desc: 'Giảm ngay 100.000đ cho đơn vé từ 500.000đ',
    discountType: 'fixed',
    discountValue: 100000,
    minSpend: 500000,
    expiry: 'Hôm nay',
    tag: 'Ẩm thực',
  },
  {
    code: 'DEALCUOITUAN',
    title: 'Săn deal cuối tuần rực rỡ',
    desc: 'Giảm trực tiếp 80.000đ cho đơn từ 400.000đ',
    discountType: 'fixed',
    discountValue: 80000,
    minSpend: 400000,
    expiry: 'Chủ nhật này',
    tag: 'Cuối tuần',
  },
  {
    code: 'HOIVIEN10',
    title: 'Tri ân hội viên iGovi',
    desc: 'Giảm 10% tối đa 100.000đ cho đơn từ 200.000đ',
    discountType: 'percent',
    discountValue: 10,
    maxDiscount: 100000,
    minSpend: 200000,
    expiry: '30/04/2026',
    tag: 'Hội viên',
  },
  {
    code: 'VIMOI30',
    title: 'Ưu đãi liên kết ví điện tử',
    desc: 'Giảm 30.000đ cho đơn vé từ 200.000đ',
    discountType: 'fixed',
    discountValue: 30000,
    minSpend: 200000,
    expiry: '31/03/2026',
    tag: 'Ví điện tử',
  },
];

const calculateVoucherDiscount = (voucher: TicketVoucher, subtotal: number) => {
  if (subtotal < voucher.minSpend) return 0;
  if (voucher.discountType === 'fixed') {
    return Math.min(voucher.discountValue, subtotal);
  } else {
    const raw = Math.round((subtotal * voucher.discountValue) / 100);
    return voucher.maxDiscount ? Math.min(raw, voucher.maxDiscount) : raw;
  }
};

export default function ChiTietVeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    price?: string;
    location?: string;
    image?: string;
    desc?: string;
  }>();

  const name = params.name || 'Buffet trưa Vân Sơn Núi Bà Đen';
  const price = params.price || '250.000đ';
  const location = params.location || 'TP. Tây Ninh, Tây Ninh';
  const image = params.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-LjZJvFCUPxN9IChQ9NXMRFm4ehNfUnjf98yFUOuyYvaQ7JgIm_LPVjGg2_TIphEK_-vVxhfcgmlLY55Xbjhjp3wA-KcP8kvyxZImh2biWUOLqFICIxqlbtWymcFAUImRDr3ZXQ_BZ_qEzaf8COD8gN0gNxndia-8TSRj7ic-WqUeUvJCR5zpQZCSvSeTl86ELcAmHKX2qEhA2buXBMt7pyxzvq8gR9XGC9mmyhKrbeb9UW0t5dZ';
  const desc = params.desc || 'Vé buffet trưa dùng trong ngày cho khách đã có vé tham quan hoặc muốn đặt thêm dịch vụ ăn uống.';

  const basePrice = parseInt(price.replace(/[^\d]/g, '')) || 250000;
  const childPrice = Math.round(basePrice * 0.7);
  const seniorPrice = Math.round(basePrice * 0.85);

  const RELATED_TICKETS = [
    {
      name: 'Vé cáp treo Chùa Hang Núi Bà Đen',
      location: 'TP. Tây Ninh, Tây Ninh',
      price: '250.000đ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAQuEjb-Bt5eFuEplUPQGqLDhhRhxOjsE5gF4uv78cqB0WC9ZH3ZB_f7ctnG6NrQJdp13H09dTGE_26sEeXUYIouHmEFqK164P99sYk8fiYe3791lOmhL7AIDV9VDvE8lxk98uJjOi9vqYAphBTeFO6yuYjtcZB6-DZDKF8zfPfmIhgWmHg3RVOw71JKBm-wsZUUOES4ZfOFwkY4PYjEePrGp2UjHhZTn34YIenlI70ZgzeMXwy7H',
    },
    {
      name: 'Vé cáp treo Đỉnh Vân Sơn khứ hồi',
      location: 'TP. Tây Ninh, Tây Ninh',
      price: '400.000đ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTQM5ESMJevGiwAHx1fFX_wLxgo4itlZDhgJ0eONMbSIMMreLqKuDxt6UsiNe3g8LFfA6CLUOVA0o9BgptYKQx61G4wgUb4oS8u-xxLVFuFRFEJMSjpeYMlCHQejlxE2kE8GG_xxKf4IIxncz8mNRlPp2ZeKrTfc-rDsS4bgdda0ANDJgvow6DnsBt2bHFl_DQIDR0B36w9PxRynWGkhj9VCsArrnJg3XcoFUP220Cu0-aksICe5UM',
    }
  ];

  const [adultQty, setAdultQty] = useState(1);
  const [childQty, setChildQty] = useState(0);
  const [seniorQty, setSeniorQty] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState<TicketVoucher | null>(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [inputError, setInputError] = useState('');

  React.useEffect(() => {
    const vCode = ((params as any).voucherCode || (params as any).code || '').toUpperCase();
    if (vCode) {
      const match = AVAILABLE_VOUCHERS.find(v => v.code === vCode);
      if (match) {
        setSelectedVoucher(match);
      }
    }
  }, [params]);

  const datesList = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      
      let mainLabel = `${dd}/${mm}`;
      if (i === 0) mainLabel = 'Hôm nay';
      else if (i === 1) mainLabel = 'Ngày mai';
      
      dates.push({
        id: `${dd}/${mm}/${d.getFullYear()}`,
        mainLabel,
        subLabel: dayNames[d.getDay()],
        tickets: '180 vé'
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(datesList[0].id);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const totalQty = adultQty + childQty + seniorQty;
  const subtotalPrice = (adultQty * basePrice) + (childQty * childPrice) + (seniorQty * seniorPrice);
  const totalOriginalPrice = (adultQty * (basePrice + 7500)) + (childQty * (childPrice + 7500)) + (seniorQty * (seniorPrice + 7500));
  const baseSaved = totalOriginalPrice - subtotalPrice;

  const voucherDiscount = useMemo(() => {
    if (!selectedVoucher) return 0;
    return calculateVoucherDiscount(selectedVoucher, subtotalPrice);
  }, [selectedVoucher, subtotalPrice]);

  const finalPrice = Math.max(0, subtotalPrice - voucherDiscount);
  const totalSaved = baseSaved + voucherDiscount;

  const handleApplyInputCode = () => {
    setInputError('');
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      setInputError('Vui lòng nhập mã ưu đãi');
      return;
    }
    const found = AVAILABLE_VOUCHERS.find(v => v.code === code);
    if (found) {
      if (subtotalPrice < found.minSpend) {
        setInputError(`Đơn hàng tối thiểu ${found.minSpend.toLocaleString('vi-VN')}đ để dùng mã này`);
        return;
      }
      setSelectedVoucher(found);
      setIsVoucherModalOpen(false);
      setInputCode('');
      Alert.alert('Thành công', `Đã áp dụng mã [${found.code}] giảm ${calculateVoucherDiscount(found, subtotalPrice).toLocaleString('vi-VN')}đ!`);
    } else if (code === 'CHAOBANMOI' || code === 'IGOVI50' || code === 'IGOVI150') {
      const customVoucher: TicketVoucher = {
        code,
        title: `Ưu đãi ${code}`,
        desc: 'Giảm giá trực tiếp khi thanh toán',
        discountType: 'fixed',
        discountValue: 50000,
        minSpend: 150000,
        expiry: '31/12/2026',
        tag: 'Đặc quyền',
      };
      setSelectedVoucher(customVoucher);
      setIsVoucherModalOpen(false);
      setInputCode('');
      Alert.alert('Thành công', `Đã áp dụng mã [${code}] giảm 50.000đ!`);
    } else {
      setInputError('Mã ưu đãi không hợp lệ hoặc đã hết hạn');
    }
  };

  const handleSelectVoucher = (voucher: TicketVoucher) => {
    if (subtotalPrice < voucher.minSpend) {
      Alert.alert(
        'Chưa đủ điều kiện',
        `Mã này áp dụng cho đơn từ ${voucher.minSpend.toLocaleString('vi-VN')}đ. Bạn cần thêm ${(voucher.minSpend - subtotalPrice).toLocaleString('vi-VN')}đ nữa để áp dụng.`,
        [{ text: 'Đồng ý' }]
      );
      return;
    }
    if (selectedVoucher?.code === voucher.code) {
      setSelectedVoucher(null);
    } else {
      setSelectedVoucher(voucher);
      setIsVoucherModalOpen(false);
    }
  };

  const handleBookTicket = () => {
    const voucherText = selectedVoucher && voucherDiscount > 0
      ? `\n- Mã ưu đãi áp dụng: ${selectedVoucher.code} (-${voucherDiscount.toLocaleString('vi-VN')}đ)`
      : '';
    Alert.alert(
      'Đặt vé thành công',
      `Bạn đã đặt ${totalQty} vé "${name}".${voucherText}\n- Tổng thanh toán: ${finalPrice.toLocaleString('vi-VN')}đ.`,
      [{ text: 'Đồng ý', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Sub navigation bar */}
      <View style={styles.subBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <SymbolView name="chevron.left" size={20} tintColor="#168b58" />
          <Text style={styles.backText}>Quay lại</Text>
        </Pressable>
        <Text style={styles.subBarTitle} numberOfLines={1}>{name}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Breadcrumb & Title */}
        <View style={styles.headerInfo}>
          <Text style={styles.breadcrumb}>Vé du lịch / {location}</Text>
          <Text style={styles.title}>{name}</Text>
          
          <View style={styles.badgeRow}>
            <View style={styles.badgeYellow}><Text style={styles.badgeTextYellow}>Vé mới cập nhật</Text></View>
            <View style={styles.badgeGreen}><Text style={styles.badgeTextGreen}>Vé điện tử</Text></View>
            <View style={styles.badgePurple}><Text style={styles.badgeTextPurple}>Xác nhận tức thì</Text></View>
          </View>

          <View style={styles.priceBox}>
            <View style={styles.priceLeft}>
              <View style={styles.priceTag}><Text style={styles.priceTagText}>Giá minh bạch</Text></View>
            </View>
            <View style={styles.priceRight}>
              <Text style={styles.priceLabel}>Giá vé từ</Text>
              <Text style={styles.priceValue}>{price}</Text>
            </View>
          </View>
        </View>

        {/* Hero Images */}
        <View style={styles.imageGallery}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            <Image source={{ uri: image }} style={styles.mainImage} />
          </ScrollView>
        </View>

        {/* Quick Info Grid */}
        <View style={styles.quickInfoSection}>
          <View style={styles.quickInfoTitleRow}>
            <View style={styles.quickInfoIconWrap}><SymbolView name="clock" size={14} tintColor="#fff" /></View>
            <Text style={styles.quickInfoTitleText}>THÔNG TIN NHANH</Text>
          </View>
          <View style={styles.quickInfoGrid}>
            <View style={styles.quickInfoItem}>
              <View style={styles.quickInfoIcon}><SymbolView name="clock" size={20} tintColor="#168b58" /></View>
              <View style={styles.quickInfoContent}>
                <Text style={styles.quickInfoLabel}>GIỜ HOẠT ĐỘNG</Text>
                <Text style={styles.quickInfoVal} numberOfLines={2}>Dự kiến 11:00 - 14:00</Text>
              </View>
            </View>
            <View style={styles.quickInfoItem}>
              <View style={styles.quickInfoIcon}><SymbolView name="mappin" size={20} tintColor="#168b58" /></View>
              <View style={styles.quickInfoContent}>
                <Text style={styles.quickInfoLabel}>KHU VỰC</Text>
                <Text style={styles.quickInfoVal} numberOfLines={2}>{location}</Text>
              </View>
            </View>
            <View style={styles.quickInfoItem}>
              <View style={styles.quickInfoIcon}><SymbolView name="calendar" size={20} tintColor="#168b58" /></View>
              <View style={styles.quickInfoContent}>
                <Text style={styles.quickInfoLabel}>LỊCH ĐANG MỞ</Text>
                <Text style={styles.quickInfoVal} numberOfLines={2}>39 khung giờ</Text>
              </View>
            </View>
            <View style={styles.quickInfoItem}>
              <View style={styles.quickInfoIcon}><SymbolView name="person.2" size={20} tintColor="#168b58" /></View>
              <View style={styles.quickInfoContent}>
                <Text style={styles.quickInfoLabel}>PHÙ HỢP</Text>
                <Text style={styles.quickInfoVal} numberOfLines={2}>Mọi du khách</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Booking Panel */}
        <View style={styles.bookingPanel}>
          <View style={styles.bpHeaderRow}>
            <Text style={styles.bpTitle}>Chọn ngày sử dụng</Text>
            <View style={styles.bpBadgeFast}><Text style={styles.bpBadgeFastText}>Xác nhận nhanh</Text></View>
          </View>
          <View style={styles.bpFlameRow}>
            <SymbolView name="flame" size={14} tintColor="#ea580c" />
            <Text style={styles.bpFlameText}>Còn 180 vé cho ngày Hôm nay</Text>
          </View>

          <View style={styles.bpDateRow}>
            {datesList.slice(0, 3).map((d) => {
              const isActive = selectedDate === d.id && !isCalendarOpen;
              return (
                <Pressable 
                  key={d.id}
                  style={[styles.bpDateBtn, isActive && styles.bpDateBtnActive]}
                  onPress={() => {
                    setSelectedDate(d.id);
                    setIsCalendarOpen(false);
                  }}
                >
                  <Text style={[styles.bpDateText, isActive && styles.bpDateTextActive]}>{d.mainLabel}</Text>
                  <Text style={[styles.bpDateSub, isActive && styles.bpDateSubActive]}>{d.subLabel}</Text>
                </Pressable>
              );
            })}
            <Pressable 
              style={[styles.bpDateBtn, isCalendarOpen && styles.bpDateBtnExpandActive]}
              onPress={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <SymbolView name="calendar" size={18} tintColor={isCalendarOpen ? '#168b58' : '#64748b'} style={{marginBottom: 4}} />
              <Text style={[styles.bpDateSub, isCalendarOpen && styles.bpDateSubExpandActive]}>{isCalendarOpen ? 'Thu gọn' : 'Xem lịch'}</Text>
            </Pressable>
          </View>

          {isCalendarOpen && (
            <View style={styles.calendarContainer}>
              {datesList.map((d) => {
                const isActive = selectedDate === d.id;
                return (
                  <Pressable 
                    key={d.id}
                    style={[styles.calItem, isActive && styles.calItemActive]}
                    onPress={() => setSelectedDate(d.id)}
                  >
                    <Text style={[styles.calItemMain, isActive && styles.calItemTextActive]}>{d.mainLabel}</Text>
                    <Text style={[styles.calItemSub, isActive && styles.calItemTextActive]}>{d.tickets}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.bpSectionLabel}>Loại vé / combo</Text>
          <View style={[styles.bpTicketCard, { zIndex: 10, elevation: 10 }]}>
            {isInfoOpen && (
              <Pressable 
                style={{ position: 'absolute', top: -2000, bottom: -2000, left: -2000, right: -2000, zIndex: 99, elevation: 99 }} 
                onPress={() => setIsInfoOpen(false)} 
              />
            )}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                <Text style={styles.bpTicketName}>{name}</Text>
                <View style={styles.bpBadgeGreen}><Text style={styles.bpBadgeGreenText}>Vé điện tử</Text></View>
              </View>
              <Text style={styles.bpTicketPrice}>Từ {price}</Text>
            </View>
            <View style={styles.bpTicketRight}>
              <View style={styles.bpCheckCircle}>
                <SymbolView name="checkmark" size={12} tintColor="#fff" />
              </View>
              <Pressable style={styles.bpInfoCircle} onPress={() => setIsInfoOpen(!isInfoOpen)}>
                <SymbolView name="info" size={14} tintColor="#168b58" />
              </Pressable>
            </View>

            {isInfoOpen && (
              <View style={styles.infoPopoverWrapper}>
                <View style={styles.infoPopoverPointer} />
                <View style={styles.infoPopover}>
                  <Text style={styles.infoPopoverTag}>THÔNG TIN VÉ LẺ</Text>
                  <Text style={styles.infoPopoverTitle}>{name}</Text>
                  <Text style={styles.infoPopoverDesc}>{desc}</Text>
                  <View style={styles.infoPopoverDivider} />
                  <Text style={styles.infoPopoverSubtitle}>Vé bao gồm</Text>
                  <View style={styles.infoPopoverList}>
                    <View style={styles.infoPopoverItem}>
                      <SymbolView name="checkmark.circle" size={14} tintColor="#168b58" />
                      <Text style={styles.infoPopoverItemText}>Vé vào khu sinh thái</Text>
                    </View>
                    <View style={styles.infoPopoverItem}>
                      <SymbolView name="checkmark.circle" size={14} tintColor="#168b58" />
                      <Text style={styles.infoPopoverItemText}>Thông tin hướng dẫn sử dụng</Text>
                    </View>
                    <View style={styles.infoPopoverItem}>
                      <SymbolView name="checkmark.circle" size={14} tintColor="#168b58" />
                      <Text style={styles.infoPopoverItemText}>QR điện tử sau thanh toán</Text>
                    </View>
                  </View>
                  <Pressable onPress={() => setIsInfoOpen(false)}>
                    <Text style={styles.infoPopoverFooter}>Chạm lại biểu tượng thông tin để đóng</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          <Text style={styles.bpSectionLabel}>Khung giờ</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.bpTimeBtn}>
              <SymbolView name="clock" size={14} tintColor="#168b58" />
              <Text style={styles.bpTimeText}>07:00-17:00</Text>
            </View>
          </View>

          <Text style={styles.bpSectionLabel}>Khu vực</Text>
          <View style={styles.bpAreaBox}>
            <SymbolView name="mappin" size={14} tintColor="#168b58" />
            <Text style={styles.bpAreaText}>{location}</Text>
          </View>

          <View style={styles.bpQtyHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.bpSectionLabel}>Chọn số lượng vé</Text>
              <SymbolView name="exclamationmark.circle" size={14} tintColor="#ea580c" style={{ marginTop: 16 }} />
            </View>
            <Text style={styles.bpQtyMax}>Tối đa 20 vé</Text>
          </View>

          <View style={[styles.bpQtyCard, { marginBottom: 12 }]}>
            <View style={styles.bpQtyInfo}>
              <SymbolView name="person.2" size={18} tintColor="#168b58" />
              <View>
                <Text style={styles.bpQtyName}>Người lớn</Text>
                <Text style={styles.bpQtySub}>Khách tiêu chuẩn - {basePrice.toLocaleString('vi-VN')}đ</Text>
              </View>
            </View>
            <View style={styles.bpQtyControls}>
              <Pressable onPress={() => { if (adultQty > 0 && totalQty > 1) setAdultQty(adultQty - 1) }} style={styles.bpQtyBtn}>
                <SymbolView name="minus" size={16} tintColor={(adultQty === 0 || totalQty <= 1) ? '#cbd5e1' : '#64748b'} />
              </Pressable>
              <Text style={styles.bpQtyVal}>{adultQty}</Text>
              <Pressable onPress={() => { if (totalQty < 20) setAdultQty(adultQty + 1) }} style={styles.bpQtyBtn}>
                <SymbolView name="plus" size={16} tintColor={totalQty >= 20 ? '#cbd5e1' : '#64748b'} />
              </Pressable>
            </View>
          </View>

          <View style={[styles.bpQtyCard, { marginBottom: 12 }]}>
            <View style={styles.bpQtyInfo}>
              <SymbolView name="person" size={18} tintColor="#168b58" />
              <View>
                <Text style={styles.bpQtyName}>Trẻ em</Text>
                <Text style={styles.bpQtySub}>Khách từ 1m-1.4m - {childPrice.toLocaleString('vi-VN')}đ</Text>
              </View>
            </View>
            <View style={styles.bpQtyControls}>
              <Pressable onPress={() => { if (childQty > 0 && totalQty > 1) setChildQty(childQty - 1) }} style={styles.bpQtyBtn}>
                <SymbolView name="minus" size={16} tintColor={(childQty === 0 || totalQty <= 1) ? '#cbd5e1' : '#64748b'} />
              </Pressable>
              <Text style={styles.bpQtyVal}>{childQty}</Text>
              <Pressable onPress={() => { if (totalQty < 20) setChildQty(childQty + 1) }} style={styles.bpQtyBtn}>
                <SymbolView name="plus" size={16} tintColor={totalQty >= 20 ? '#cbd5e1' : '#64748b'} />
              </Pressable>
            </View>
          </View>

          <View style={styles.bpQtyCard}>
            <View style={styles.bpQtyInfo}>
              <SymbolView name="person.fill" size={18} tintColor="#168b58" />
              <View>
                <Text style={styles.bpQtyName}>Người cao tuổi</Text>
                <Text style={styles.bpQtySub}>Trên 60 tuổi - {seniorPrice.toLocaleString('vi-VN')}đ</Text>
              </View>
            </View>
            <View style={styles.bpQtyControls}>
              <Pressable onPress={() => { if (seniorQty > 0 && totalQty > 1) setSeniorQty(seniorQty - 1) }} style={styles.bpQtyBtn}>
                <SymbolView name="minus" size={16} tintColor={(seniorQty === 0 || totalQty <= 1) ? '#cbd5e1' : '#64748b'} />
              </Pressable>
              <Text style={styles.bpQtyVal}>{seniorQty}</Text>
              <Pressable onPress={() => { if (totalQty < 20) setSeniorQty(seniorQty + 1) }} style={styles.bpQtyBtn}>
                <SymbolView name="plus" size={16} tintColor={totalQty >= 20 ? '#cbd5e1' : '#64748b'} />
              </Pressable>
            </View>
          </View>

          {/* Section Chọn mã ưu đãi */}
          <View style={styles.voucherSection}>
            <View style={styles.voucherHeaderRow}>
              <View style={styles.voucherTitleLeft}>
                <SymbolView name="ticket.fill" size={16} tintColor="#ea580c" />
                <Text style={styles.voucherSectionTitle}>Mã ưu đãi / Khuyến mãi</Text>
              </View>
              <Pressable onPress={() => setIsVoucherModalOpen(true)} style={styles.selectVoucherBtn}>
                <Text style={styles.selectVoucherBtnText}>{selectedVoucher ? 'Đổi mã' : 'Chọn mã'}</Text>
                <SymbolView name="chevron.right" size={12} tintColor="#168b58" />
              </Pressable>
            </View>

            {selectedVoucher ? (
              <View style={styles.appliedVoucherBox}>
                <View style={styles.appliedVoucherLeft}>
                  <View style={styles.voucherCodeBadge}>
                    <Text style={styles.voucherCodeText}>{selectedVoucher.code}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.appliedVoucherTitle} numberOfLines={1}>{selectedVoucher.title}</Text>
                    <Text style={styles.appliedVoucherDiscount}>
                      Đã giảm -{voucherDiscount.toLocaleString('vi-VN')}đ
                    </Text>
                  </View>
                </View>
                <Pressable onPress={() => setSelectedVoucher(null)} hitSlop={10} style={styles.removeVoucherBtn}>
                  <SymbolView name="xmark.circle.fill" size={20} tintColor="#94a3b8" />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.voucherEmptyBox} onPress={() => setIsVoucherModalOpen(true)}>
                <View style={styles.voucherEmptyLeft}>
                  <View style={styles.voucherIconCircle}>
                    <SymbolView name="percent" size={12} tintColor="#ea580c" />
                  </View>
                  <Text style={styles.voucherEmptyText}>Chọn hoặc nhập mã giảm giá</Text>
                </View>
                <View style={styles.voucherCountTag}>
                  <Text style={styles.voucherCountTagText}>{AVAILABLE_VOUCHERS.length} mã</Text>
                </View>
              </Pressable>
            )}
          </View>

          <View style={styles.bpDivider} />

          <View style={styles.bpTotalRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bpTotalLabel}>Tổng thanh toán</Text>
              <Text style={styles.bpTotalSub}>{totalQty} vé - đã gồm thuế phí</Text>
              {selectedVoucher && voucherDiscount > 0 && (
                <Text style={styles.discountRowText}>
                  Mã {selectedVoucher.code}: -{voucherDiscount.toLocaleString('vi-VN')}đ
                </Text>
              )}
              {totalSaved > 0 && (
                <Text style={styles.bpTotalSave}>
                  Tiết kiệm {totalSaved.toLocaleString('vi-VN')}đ (gồm ưu đãi)
                </Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              {selectedVoucher && voucherDiscount > 0 && (
                <Text style={styles.originalTotalStrike}>{subtotalPrice.toLocaleString('vi-VN')}đ</Text>
              )}
              <Text style={styles.bpTotalValue}>{finalPrice.toLocaleString('vi-VN')}đ</Text>
            </View>
          </View>

          <Pressable style={styles.bpSubmitBtn} onPress={handleBookTicket}>
            <Text style={styles.bpSubmitText}>ĐẶT VÉ NGAY</Text>
            <SymbolView name="arrow.right" size={18} tintColor="#fff" />
          </Pressable>

          <View style={styles.bpFooter}>
            <View style={styles.bpFooterItem}>
              <SymbolView name="bolt" size={14} tintColor="#ea580c" />
              <Text style={styles.bpFooterText}>Xác nhận nhanh</Text>
            </View>
            <View style={styles.bpFooterDivider} />
            <View style={styles.bpFooterItem}>
              <SymbolView name="shield" size={14} tintColor="#ea580c" />
              <Text style={styles.bpFooterText}>Thanh toán an toàn</Text>
            </View>
          </View>
        </View>

        {/* Navigation Tabs (Static) */}
        <View style={styles.tabsContainer}>
          <Text style={styles.tabActive}>Tổng quan</Text>
          <Text style={styles.tabInactive}>Thông tin vé</Text>
          <Text style={styles.tabInactive}>Vé liên quan</Text>
        </View>

        {/* Detailed Info */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionSubtitle}>CHI TIẾT VÉ</Text>
          <Text style={styles.sectionTitle}>Thông tin vé</Text>
          <Text style={styles.descText}>{desc}</Text>
          <Text style={styles.descText}>Khách chọn ngày sử dụng, số lượng vé và kiểm tra tổng tiền trước khi thanh toán. Tồn vé được giữ có thời hạn để tránh bán vượt sức chứa.</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionSubtitle}>THÔNG TIN SỬ DỤNG</Text>
          <Text style={styles.sectionTitle}>Quyền lợi và điều kiện vé</Text>
          
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitCard}>
              <Text style={styles.benefitCardTitle}>Điểm nổi bật</Text>
              <View style={styles.benefitListItem}>
                <SymbolView name="checkmark.circle" size={16} tintColor="#168b58" />
                <Text style={styles.benefitListText}>Phù hợp khách muốn bổ sung bữa trưa cho lịch trình tham quan</Text>
              </View>
              <View style={styles.benefitListItem}>
                <SymbolView name="checkmark.circle" size={16} tintColor="#168b58" />
                <Text style={styles.benefitListText}>Dễ bán kèm vé cáp treo hoặc các tour du lịch trong khu vực</Text>
              </View>
              <View style={styles.benefitListItem}>
                <SymbolView name="checkmark.circle" size={16} tintColor="#168b58" />
                <Text style={styles.benefitListText}>Đảm bảo số lượng giới hạn để tránh nhận quá sức chứa</Text>
              </View>
            </View>

            <View style={styles.benefitCard}>
              <Text style={styles.benefitCardTitle}>Vé bao gồm</Text>
              <View style={styles.benefitListItem}>
                <SymbolView name="checkmark.circle" size={16} tintColor="#168b58" />
                <Text style={styles.benefitListText}>Suất ăn buffet trưa theo khung giờ áp dụng</Text>
              </View>
              <View style={styles.benefitListItem}>
                <SymbolView name="checkmark.circle" size={16} tintColor="#168b58" />
                <Text style={styles.benefitListText}>Mã vé QR điện tử vào cổng tiện lợi</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Related Tickets Section */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedSubTitle}>GỢI Ý THÊM</Text>
          <View style={styles.relatedTitleRow}>
            <Text style={styles.relatedTitle}>Vé du lịch liên quan</Text>
            <Pressable style={styles.viewAllBtn} onPress={() => router.push('/ve-du-lich')}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
              <SymbolView name="arrow.right" size={14} tintColor="#168b58" />
            </Pressable>
          </View>

          <View style={styles.relatedList}>
            {RELATED_TICKETS.map((item, index) => (
              <Pressable 
                key={index} 
                style={styles.relatedCard}
                onPress={() => {
                  router.push({
                    pathname: '/chi-tiet-ve',
                    params: {
                      name: item.name,
                      price: item.price,
                      location: item.location,
                      image: item.image,
                      desc: `Khám phá ${item.name} tại ${item.location} để có những trải nghiệm tuyệt vời.`
                    }
                  });
                }}
              >
                <View style={styles.relatedImgContainer}>
                  <Image source={{ uri: item.image }} style={styles.relatedImg} />
                  <View style={styles.relatedBadge}>
                    <Text style={styles.relatedBadgeText}>Vé điện tử</Text>
                  </View>
                  <View style={styles.relatedIconTopRight}>
                    <SymbolView name="drop.fill" size={14} tintColor="#0ea5e9" />
                    <SymbolView name="sparkles" size={10} tintColor="#7dd3fc" style={{ position: 'absolute', top: 2, right: 2 }} />
                  </View>
                </View>
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.relatedLocation}>
                    <SymbolView name="mappin.and.ellipse" size={12} tintColor="#168b58" />
                    <Text style={styles.relatedLocationText}>{item.location}</Text>
                  </View>
                  
                  <View style={styles.relatedDivider} />
                  
                  <View style={styles.relatedFooter}>
                    <View>
                      <Text style={styles.relatedPriceLabel}>Giá từ</Text>
                      <Text style={styles.relatedPriceVal}>{item.price}</Text>
                    </View>
                    <View style={styles.relatedAction}>
                      <Text style={styles.relatedActionText}>Xem</Text>
                      <SymbolView name="arrow.right" size={12} tintColor="#168b58" />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Voucher Selection Modal */}
      <Modal
        visible={isVoucherModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVoucherModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsVoucherModalOpen(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Mã ưu đãi iGovi</Text>
                <Text style={styles.modalSub}>Áp dụng giảm trực tiếp khi thanh toán vé</Text>
              </View>
              <Pressable onPress={() => setIsVoucherModalOpen(false)} style={styles.modalCloseBtn} hitSlop={10}>
                <SymbolView name="xmark" size={16} tintColor="#64748b" />
              </Pressable>
            </View>

            {/* Input Manual Code */}
            <View style={styles.voucherInputRow}>
              <TextInput
                placeholder="Nhập mã ưu đãi (VD: SUNWORLD50)"
                placeholderTextColor="#94a3b8"
                value={inputCode}
                onChangeText={(text) => {
                  setInputCode(text);
                  setInputError('');
                }}
                autoCapitalize="characters"
                style={styles.voucherTextInput}
              />
              <Pressable style={styles.applyCodeBtn} onPress={handleApplyInputCode}>
                <Text style={styles.applyCodeBtnText}>Áp dụng</Text>
              </Pressable>
            </View>
            {inputError ? <Text style={styles.inputErrorText}>{inputError}</Text> : null}

            {/* Voucher List */}
            <Text style={styles.modalListTitle}>MÃ KHẢ DỤNG CHO ĐƠN CỦA BẠN</Text>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {AVAILABLE_VOUCHERS.map((v) => {
                const isSelected = selectedVoucher?.code === v.code;
                const isEligible = subtotalPrice >= v.minSpend;
                const discountVal = isEligible ? calculateVoucherDiscount(v, subtotalPrice) : 0;

                return (
                  <Pressable
                    key={v.code}
                    style={[
                      styles.voucherModalCard,
                      isSelected && styles.voucherModalCardSelected,
                      !isEligible && styles.voucherModalCardDisabled,
                    ]}
                    onPress={() => handleSelectVoucher(v)}
                  >
                    <View style={styles.voucherModalCardLeft}>
                      <View style={styles.voucherModalCardTop}>
                        <View style={[styles.vmBadge, { backgroundColor: isEligible ? '#fee2e2' : '#f1f5f9' }]}>
                          <Text style={[styles.vmBadgeText, { color: isEligible ? '#b32113' : '#94a3b8' }]}>
                            {v.tag}
                          </Text>
                        </View>
                        <Text style={styles.vmCode}>{v.code}</Text>
                      </View>
                      <Text style={styles.vmTitle}>{v.title}</Text>
                      <Text style={styles.vmDesc}>{v.desc}</Text>
                      <View style={styles.vmFooterRow}>
                        <Text style={styles.vmExpiry}>HSD: {v.expiry}</Text>
                        {!isEligible && (
                          <Text style={styles.vmNeedMore}>
                            Cần thêm {(v.minSpend - subtotalPrice).toLocaleString('vi-VN')}đ
                          </Text>
                        )}
                      </View>
                      <Pressable
                        style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 2 }}
                        onPress={(e) => {
                          e.stopPropagation?.();
                          setIsVoucherModalOpen(false);
                          router.push({
                            pathname: '/chi-tiet-uu-dai',
                            params: { code: v.code },
                          });
                        }}
                      >
                        <Text style={{ fontSize: 10, color: '#168b58', fontWeight: '700' }}>Xem điều kiện & chi tiết ›</Text>
                      </Pressable>
                    </View>

                    <View style={styles.voucherModalCardRight}>
                      {isSelected ? (
                        <View style={styles.vmSelectedBadge}>
                          <SymbolView name="checkmark" size={12} tintColor="#fff" />
                          <Text style={styles.vmSelectedText}>Đang dùng</Text>
                        </View>
                      ) : (
                        <View style={[styles.vmApplyBtn, !isEligible && styles.vmApplyBtnDisabled]}>
                          <Text style={[styles.vmApplyBtnText, !isEligible && styles.vmApplyBtnTextDisabled]}>
                            {isEligible ? 'Dùng mã' : 'Chưa đủ'}
                          </Text>
                        </View>
                      )}
                      {isEligible && (
                        <Text style={styles.vmDiscountPreview}>
                          -{discountVal.toLocaleString('vi-VN')}đ
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}

              {/* Link to /uu-dai */}
              <Pressable
                style={styles.goToOffersBtn}
                onPress={() => {
                  setIsVoucherModalOpen(false);
                  router.push('/uu-dai');
                }}
              >
                <SymbolView name="gift.fill" size={16} tintColor="#ea580c" />
                <Text style={styles.goToOffersText}>Khám phá thêm ưu đãi tại Trang Ưu Đãi</Text>
                <SymbolView name="arrow.right" size={14} tintColor="#ea580c" />
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f6f1' },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 10,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, fontWeight: '700', color: '#168b58' },
  subBarTitle: { fontSize: 13, color: '#64748b', fontWeight: '500', maxWidth: '60%' },
  
  scrollContent: { paddingBottom: 100 },
  
  headerInfo: { padding: 16, backgroundColor: '#fff' },
  breadcrumb: { fontSize: 12, fontWeight: '600', color: 'rgba(15,23,42,0.52)', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a', lineHeight: 34, marginBottom: 16 },
  
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  badgeYellow: { backgroundColor: '#fffbea', borderColor: '#f0c952', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeTextYellow: { color: '#9a6200', fontSize: 10, fontWeight: '700' },
  badgeGreen: { backgroundColor: '#effbf5', borderColor: '#bfead6', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeTextGreen: { color: '#087a51', fontSize: 10, fontWeight: '700' },
  badgePurple: { backgroundColor: '#f6f3ff', borderColor: '#ded6ff', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeTextPurple: { color: '#6442d8', fontSize: 10, fontWeight: '700' },
  
  priceBox: { backgroundColor: '#fffaf4', borderColor: '#f2d6bd', borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  priceLeft: { flex: 1, alignItems: 'flex-start' },
  priceRight: { alignItems: 'flex-end' },
  priceLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(15,23,42,0.42)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  priceValue: { fontSize: 24, fontWeight: '900', color: '#f4510b' },
  priceTag: { backgroundColor: '#fff0e5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  priceTagText: { color: '#c85e3a', fontSize: 10, fontWeight: '700' },

  imageGallery: { position: 'relative', height: 280, backgroundColor: '#edf3ef', marginTop: 16 },
  mainImage: { width: width, height: 280, resizeMode: 'cover' },
  imageCountBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  imageCountText: { fontSize: 11, fontWeight: '700', color: '#0f172a' },

  quickInfoSection: { backgroundColor: '#fff8f0', borderColor: '#f1dbc8', borderWidth: 1, borderRadius: 12, margin: 16, padding: 16 },
  quickInfoTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  quickInfoIconWrap: { backgroundColor: '#f4510b', borderRadius: 14, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  quickInfoTitleText: { color: '#cf4306', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  quickInfoGrid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#f1e2d5', borderRadius: 12, overflow: 'hidden', gap: 1 },
  quickInfoItem: { flexBasis: '49.5%', flexGrow: 1, flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#fff', padding: 16, gap: 12 },
  quickInfoIcon: { backgroundColor: '#e9f4ef', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  quickInfoContent: { flex: 1 },
  quickInfoLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(15,23,42,0.38)', letterSpacing: 1, marginBottom: 4 },
  quickInfoVal: { fontSize: 13, fontWeight: '700', color: '#0f172a' },

  tabsContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#fff', height: 56, gap: 24 },
  tabActive: { color: '#168b58', fontSize: 13, fontWeight: '700' },
  tabInactive: { color: 'rgba(15,23,42,0.64)', fontSize: 13, fontWeight: '700' },

  detailsSection: { padding: 16, backgroundColor: '#f8f6f1' },
  sectionSubtitle: { fontSize: 11, fontWeight: '800', color: '#c85e3a', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  sectionTitle: { fontSize: 26, fontWeight: '700', color: '#0f172a', marginBottom: 20 },
  descText: { fontSize: 15, color: 'rgba(15,23,42,0.66)', lineHeight: 26, marginBottom: 16 },
  
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 32 },

  benefitsGrid: { gap: 16 },
  benefitCard: { backgroundColor: '#f8faf7', borderColor: 'rgba(0,0,0,0.08)', borderWidth: 1, borderRadius: 16, padding: 20 },
  benefitCardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  benefitListItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 12 },
  benefitListText: { fontSize: 13, color: 'rgba(15,23,42,0.58)', lineHeight: 22, flex: 1 },

  bookingPanel: { backgroundColor: '#fffaf6', borderWidth: 1, borderColor: '#fed7aa', borderRadius: 16, margin: 16, padding: 16, shadowColor: '#ea580c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  bpHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bpTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  bpBadgeFast: { backgroundColor: '#eaf8f1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  bpBadgeFastText: { color: '#168b58', fontSize: 10, fontWeight: '700' },
  bpFlameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  bpFlameText: { color: '#ea580c', fontSize: 12, fontWeight: '700' },
  bpDateRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  bpDateBtn: { flex: 1, height: 56, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  bpDateBtnActive: { backgroundColor: '#fff3ea', borderColor: '#ea580c' },
  bpDateText: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
  bpDateTextActive: { color: '#ea580c' },
  bpDateSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  bpDateSubActive: { color: '#fb923c' },
  bpDateBtnExpandActive: { borderColor: '#168b58', backgroundColor: '#eaf8f1' },
  bpDateSubExpandActive: { color: '#168b58', fontWeight: '700' },
  calendarContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, padding: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#fed7aa', borderRadius: 12 },
  calItem: { width: '31%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#bfead6', borderRadius: 8, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  calItemActive: { backgroundColor: '#ea580c', borderColor: '#ea580c' },
  calItemMain: { fontSize: 12, fontWeight: '800', color: '#087a51', marginBottom: 2 },
  calItemSub: { fontSize: 10, color: '#168b58', fontWeight: '600' },
  calItemTextActive: { color: '#fff' },
  bpSectionLabel: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginTop: 24, marginBottom: 8 },
  bpTicketCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#ea580c', borderRadius: 12, backgroundColor: '#fff' },
  bpTicketName: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  bpBadgeGreen: { backgroundColor: '#eaf8f1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  bpBadgeGreenText: { color: '#168b58', fontSize: 9, fontWeight: '700' },
  bpTicketPrice: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  bpTicketRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  bpCheckCircle: { backgroundColor: '#ea580c', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  bpInfoCircle: { borderColor: '#168b58', borderWidth: 1, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  bpTimeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#eaf8f1', borderWidth: 1, borderColor: '#168b58', borderRadius: 8 },
  bpTimeText: { color: '#168b58', fontSize: 12, fontWeight: '700' },
  bpAreaBox: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8 },
  bpAreaText: { fontSize: 13, color: '#64748b' },
  bpQtyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bpQtyMax: { fontSize: 11, color: '#94a3b8', marginTop: 16 },
  bpQtyCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12 },
  bpQtyInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bpQtyName: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  bpQtySub: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  bpQtyControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bpQtyBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8 },
  bpQtyVal: { fontSize: 14, fontWeight: '800', color: '#0f172a', width: 20, textAlign: 'center' },
  bpDivider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 20 },
  bpTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  bpTotalLabel: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  bpTotalSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  bpTotalSave: { fontSize: 10, color: '#168b58', fontWeight: '600', marginTop: 2 },
  bpTotalValue: { fontSize: 24, fontWeight: '900', color: '#ea580c' },
  bpSubmitBtn: { backgroundColor: '#ea580c', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 10 },
  bpSubmitText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  bpFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 16 },
  bpFooterItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bpFooterText: { fontSize: 11, color: '#94a3b8' },
  bpFooterDivider: { width: 1, height: 12, backgroundColor: '#cbd5e1' },
  infoPopoverWrapper: { position: 'absolute', top: '100%', right: -4, marginTop: 16, width: 280, zIndex: 100, elevation: 100 },
  infoPopoverPointer: { position: 'absolute', top: -6, right: 28, width: 16, height: 16, backgroundColor: '#fff', transform: [{ rotate: '45deg' }], zIndex: 101, borderTopWidth: 1, borderLeftWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  infoPopover: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 10, zIndex: 102, borderWidth: 1, borderColor: '#f1f5f9' },
  infoPopoverTag: { fontSize: 10, fontWeight: '800', color: '#168b58', marginBottom: 6 },
  infoPopoverTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  infoPopoverDesc: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 12 },
  infoPopoverDivider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 12 },
  infoPopoverSubtitle: { fontSize: 13, fontWeight: '800', color: '#168b58', marginBottom: 10 },
  infoPopoverList: { gap: 8, marginBottom: 16 },
  infoPopoverItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoPopoverItemText: { fontSize: 12, color: '#64748b' },
  infoPopoverFooter: { fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
  
  relatedSection: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  relatedSubTitle: { fontSize: 11, fontWeight: '800', color: '#ea580c', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  relatedTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  relatedTitle: { fontSize: 24, fontWeight: '700', color: '#0f3d2e', fontFamily: 'serif' }, // Fake serif look with standard weight
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { fontSize: 12, fontWeight: '700', color: '#168b58' },
  relatedList: { gap: 16 },
  relatedCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, overflow: 'hidden' },
  relatedImgContainer: { height: 180, position: 'relative' },
  relatedImg: { width: '100%', height: '100%' },
  relatedBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  relatedBadgeText: { color: '#168b58', fontSize: 10, fontWeight: '800' },
  relatedIconTopRight: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  relatedInfo: { padding: 16 },
  relatedName: { fontSize: 16, fontWeight: '800', color: '#042f2e', marginBottom: 8, lineHeight: 22 },
  relatedLocation: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  relatedLocationText: { fontSize: 12, color: '#94a3b8' },
  relatedDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  relatedFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  relatedPriceLabel: { fontSize: 10, color: '#94a3b8', marginBottom: 2 },
  relatedPriceVal: { fontSize: 18, fontWeight: '900', color: '#ea580c' },
  relatedAction: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 2 },
  relatedActionText: { fontSize: 12, fontWeight: '800', color: '#168b58' },

  // Voucher section in Booking Panel
  voucherSection: {
    backgroundColor: '#fff9f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
    padding: 12,
    marginTop: 14,
  },
  voucherHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  voucherTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voucherSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  selectVoucherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  selectVoucherBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#168b58',
  },
  appliedVoucherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fdba74',
    borderRadius: 8,
    padding: 10,
  },
  appliedVoucherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voucherCodeBadge: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  voucherCodeText: {
    color: '#c2410c',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appliedVoucherTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  appliedVoucherDiscount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#168b58',
    marginTop: 2,
  },
  removeVoucherBtn: {
    padding: 4,
    marginLeft: 8,
  },
  voucherEmptyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
  },
  voucherEmptyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voucherIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherEmptyText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  voucherCountTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  voucherCountTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },

  discountRowText: {
    fontSize: 11,
    color: '#168b58',
    fontWeight: '700',
    marginTop: 3,
  },
  originalTotalStrike: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },

  // Voucher Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  voucherTextInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  applyCodeBtn: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 8,
  },
  applyCodeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  inputErrorText: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 6,
    marginLeft: 4,
  },
  modalListTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 10,
  },
  modalScroll: {
    maxHeight: 380,
  },
  voucherModalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  voucherModalCardSelected: {
    borderColor: '#168b58',
    backgroundColor: '#f0fdf4',
  },
  voucherModalCardDisabled: {
    opacity: 0.55,
    backgroundColor: '#fafafa',
  },
  voucherModalCardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  voucherModalCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  vmBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vmBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  vmCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  vmTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  vmDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 6,
  },
  vmFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vmExpiry: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  vmNeedMore: {
    fontSize: 10,
    color: '#ea580c',
    fontWeight: '700',
  },
  voucherModalCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  vmSelectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#168b58',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  vmSelectedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  vmApplyBtn: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  vmApplyBtnDisabled: {
    backgroundColor: '#f1f5f9',
  },
  vmApplyBtnText: {
    color: '#168b58',
    fontSize: 11,
    fontWeight: '800',
  },
  vmApplyBtnTextDisabled: {
    color: '#94a3b8',
  },
  vmDiscountPreview: {
    fontSize: 11,
    fontWeight: '800',
    color: '#168b58',
    marginTop: 4,
  },
  goToOffersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: '#fff7ed',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  goToOffersText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
  },
});
