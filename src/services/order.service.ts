import type { Order, OrderFilter, OrderTabCount } from '@/types'
import { OrderTabStatus, OrderType, OrderProcessStatus } from '@/types'

const FAKE_ORDERS: Order[] = [
  // ── Chờ xác nhận (2) ──────────────────────────────────────
  {
    id: 'ord-001',
    orderCode: '260321Q9ARTFAN',
    customerName: 'qunhnhphmnguyn064',
    items: [
      {
        id: 'item-001-1',
        productName: 'BST Hoa Tiết Vintage, Giấy Bao Tập/Vở Họa Tiết Vintage A5/B5, Tập Học Sinh, Size...',
        productImage: '',
        variation: '2.1 Tờ Bóng A5',
        quantity: 1,
        tag: 'Hàng Đặt Trước',
      },
      {
        id: 'item-001-2',
        productName: 'BST Hoa Tiết Vintage, Giấy Bao Tập/Vở Họa Tiết Vintage A5/B5, Tập Học Sinh, Size...',
        productImage: '',
        variation: '3.1 Tờ Thường A5',
        quantity: 1,
        tag: 'Hàng Đặt Trước',
      },
      {
        id: 'item-001-3',
        productName: 'Sổ Tay Dot Grid A5 Premium Kraft',
        productImage: '',
        variation: 'Nâu kraft / 160 trang',
        quantity: 2,
      },
    ],
    totalAmount: 500,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.PendingConfirmation,
    statusLabel: 'Chờ xác nhận',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'SPX Express', method: 'Drop off / Pickup' },
    deadlineNote: 'Vui lòng xác nhận đơn trước 02/04/2026 để tránh đơn bị huỷ tự động',
    isProcessed: false,
    createdAt: '2026-03-21T08:00:00',
  },
  {
    id: 'ord-002',
    orderCode: '260322MNBVCXZLQ',
    customerName: 'lehoanganh_shop',
    items: [
      {
        id: 'item-002-1',
        productName: 'Bộ Washi Tape Hoa Cúc Pastel 5 cuộn',
        productImage: '',
        variation: 'Set Pastel Mix',
        quantity: 3,
      },
    ],
    totalAmount: 75000,
    paymentNote: 'Thanh toán online - MoMo',
    status: OrderTabStatus.PendingConfirmation,
    statusLabel: 'Chờ xác nhận',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'J&T Express', method: 'Drop off' },
    deadlineNote: 'Vui lòng xác nhận đơn trước 03/04/2026',
    isProcessed: false,
    createdAt: '2026-03-22T09:30:00',
  },
  // ── Chờ lấy hàng (7) ──────────────────────────────────────
  {
    id: 'ord-003',
    orderCode: '260321Q9ARTFAN',
    customerName: 'qunhnhphmnguyn064',
    items: [
      {
        id: 'item-003-1',
        productName: 'BST Hoa Tiết Vintage, Giấy Bao Tập/Vở Họa Tiết Vintage A5/B5, Tập Học Sinh, Si...',
        productImage: '',
        variation: '2.1 Tờ Bóng A5',
        quantity: 1,
        tag: 'Hàng Đặt Trước',
      },
      {
        id: 'item-003-2',
        productName: 'BST Hoa Tiết Vintage, Giấy Bao Tập/Vở Họa Tiết Vintage A5/B5, Tập Học Sinh, Si...',
        productImage: '',
        variation: '3.1 Tờ Thường A5',
        quantity: 1,
        tag: 'Hàng Đặt Trước',
      },
      {
        id: 'item-003-3',
        productName: 'BST Hoa Tiết Vintage, Giấy Bao Tập/Vở Họa Tiết Vintage A5/B5, Tập Học Sinh, Si...',
        productImage: '',
        variation: '1.1 Tờ Nhám A5',
        quantity: 1,
        tag: 'Hàng Đặt Trước',
      },
    ],
    totalAmount: 500,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.ReadyToShip,
    statusLabel: 'Chờ lấy hàng',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'SPX Express', method: 'Drop off / Pickup' },
    deadlineNote: 'Để tránh việc giao hàng trễ, vui lòng giao hàng/chuẩn bị hàng trước 27/03/2026',
    isProcessed: false,
    createdAt: '2026-03-20T07:15:00',
  },
  {
    id: 'ord-004',
    orderCode: '2603231PQRSTUVW',
    customerName: 'tranthinhphat99',
    items: [
      {
        id: 'item-004-1',
        productName: 'Sổ Bullet Journal Dotgrid A5 200 trang bìa cứng',
        productImage: '',
        variation: 'Xanh Navy / 200 trang',
        quantity: 1,
      },
      {
        id: 'item-004-2',
        productName: 'Bút Fineliner 0.4mm Set 12 màu Faber-Castell',
        productImage: '',
        variation: 'Set 12 màu cơ bản',
        quantity: 1,
      },
    ],
    totalAmount: 245000,
    paymentNote: 'Thanh toán online - VNPay',
    status: OrderTabStatus.ReadyToShip,
    statusLabel: 'Chờ lấy hàng',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'SPX Express', method: 'Drop off / Pickup' },
    deadlineNote: 'Vui lòng chuẩn bị hàng trước 28/03/2026',
    isProcessed: false,
    createdAt: '2026-03-20T10:00:00',
  },
  {
    id: 'ord-005',
    orderCode: '260323XYZABCDEF',
    customerName: 'minhtu_stationery',
    items: [
      {
        id: 'item-005-1',
        productName: 'Sticker Dán Trang Trí Sổ Vintage Hoa Anh Đào',
        productImage: '',
        variation: 'Sheet A4 / 50 nhãn',
        quantity: 5,
      },
    ],
    totalAmount: 125000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.ReadyToShip,
    statusLabel: 'Chờ lấy hàng',
    orderType: OrderType.Express,
    shippingUnit: { name: 'Hoả Tốc', provider: 'GrabExpress', method: 'Pickup tại nhà' },
    deadlineNote: 'Đơn hoả tốc - Cần giao trước 17:00 hôm nay 27/03/2026',
    isProcessed: false,
    createdAt: '2026-03-21T08:00:00',
  },
  {
    id: 'ord-006',
    orderCode: '260323QWERTY123',
    customerName: 'phamngoclan_art',
    items: [
      {
        id: 'item-006-1',
        productName: 'Bộ Màu Nước 24 ô Shinhan Professional',
        productImage: '',
        variation: 'Hộp thiếc 24 màu',
        quantity: 1,
      },
    ],
    totalAmount: 380000,
    paymentNote: 'Thanh toán online - Thẻ ngân hàng',
    status: OrderTabStatus.ReadyToShip,
    statusLabel: 'Chờ lấy hàng',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'GHTK', method: 'Drop off' },
    deadlineNote: 'Vui lòng chuẩn bị hàng trước 28/03/2026',
    isProcessed: false,
    createdAt: '2026-03-21T11:00:00',
  },
  {
    id: 'ord-007',
    orderCode: '260323ASDFGHJKL',
    customerName: 'buithibao_craft',
    items: [
      {
        id: 'item-007-1',
        productName: 'Tape Thư Pháp Chữ Thư Pháp Trắng Đen',
        productImage: '',
        variation: '15mm x 10m',
        quantity: 2,
        tag: 'Flash Sale',
      },
      {
        id: 'item-007-2',
        productName: 'Kéo Craft Zigzag 5in1 Set',
        productImage: '',
        variation: 'Set 5 lưỡi',
        quantity: 1,
      },
    ],
    totalAmount: 98000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.ReadyToShip,
    statusLabel: 'Chờ lấy hàng',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'ViettelPost', method: 'Drop off' },
    deadlineNote: 'Vui lòng chuẩn bị hàng trước 29/03/2026',
    isProcessed: false,
    createdAt: '2026-03-21T14:20:00',
  },
  {
    id: 'ord-008',
    orderCode: '260323ZXCVBNMAS',
    customerName: 'vuquangkhai2001',
    items: [
      {
        id: 'item-008-1',
        productName: 'Sổ Tay Planner 2026 Weekly Layout Bìa Da PU',
        productImage: '',
        variation: 'Hồng Pastel / A5',
        quantity: 1,
      },
    ],
    totalAmount: 185000,
    paymentNote: 'Thanh toán online - MoMo',
    status: OrderTabStatus.ReadyToShip,
    statusLabel: 'Chờ lấy hàng',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'SPX Express', method: 'Drop off / Pickup' },
    deadlineNote: 'Vui lòng chuẩn bị hàng trước 29/03/2026',
    isProcessed: true,
    createdAt: '2026-03-21T15:45:00',
  },
  {
    id: 'ord-009',
    orderCode: '260324POIUYTREWQ',
    customerName: 'nguyenthithuy_88',
    items: [
      {
        id: 'item-009-1',
        productName: 'Hộp Đựng Bút Gỗ Bamboo Khắc Tên',
        productImage: '',
        variation: 'Tự nhiên / 20 ngăn',
        quantity: 1,
      },
    ],
    totalAmount: 156000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.ReadyToShip,
    statusLabel: 'Chờ lấy hàng',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'GHTK', method: 'Pickup tại nhà' },
    deadlineNote: 'Vui lòng chuẩn bị hàng trước 30/03/2026',
    isProcessed: false,
    createdAt: '2026-03-22T08:00:00',
  },
  // ── Đang giao (4) ─────────────────────────────────────────
  {
    id: 'ord-010',
    orderCode: '260318LKJHGFDSA',
    customerName: 'doanphuonganh',
    items: [
      {
        id: 'item-010-1',
        productName: 'Máy Ép Plastik Nhiệt A4 Laminater Mini',
        productImage: '',
        variation: 'Trắng / 220V',
        quantity: 1,
      },
    ],
    totalAmount: 420000,
    paymentNote: 'Thanh toán online - ZaloPay',
    status: OrderTabStatus.Shipping,
    statusLabel: 'Đang giao',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'SPX Express', method: 'Drop off / Pickup' },
    isProcessed: true,
    createdAt: '2026-03-18T09:00:00',
  },
  {
    id: 'ord-011',
    orderCode: '260318MNOPQRSTU',
    customerName: 'hoangminhkhoi_3d',
    items: [
      {
        id: 'item-011-1',
        productName: 'Bút Gel 0.5mm Pentel EnerGel BLN75 Hộp 12 cái',
        productImage: '',
        variation: 'Xanh đen / 0.5mm',
        quantity: 2,
      },
      {
        id: 'item-011-2',
        productName: 'Sổ Oxford Campus A4 80 trang kẻ dòng',
        productImage: '',
        variation: 'Xanh / A4 kẻ ngang',
        quantity: 3,
      },
    ],
    totalAmount: 178000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.Shipping,
    statusLabel: 'Đang giao',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'J&T Express', method: 'Drop off' },
    isProcessed: true,
    createdAt: '2026-03-18T11:30:00',
  },
  {
    id: 'ord-012',
    orderCode: '260319VWXYZABCD',
    customerName: 'nguyenvanhoa_vnh',
    items: [
      {
        id: 'item-012-1',
        productName: 'Thước Kẻ Trong Suốt Set 3 cái Deli',
        productImage: '',
        variation: '15/20/30cm trong suốt',
        quantity: 1,
      },
    ],
    totalAmount: 35000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.Shipping,
    statusLabel: 'Đang giao',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'ViettelPost', method: 'Drop off' },
    isProcessed: true,
    createdAt: '2026-03-19T08:00:00',
  },
  {
    id: 'ord-013',
    orderCode: '260320EFGHIJKLM',
    customerName: 'camthu_handmade',
    items: [
      {
        id: 'item-013-1',
        productName: 'Chỉ Thêu DMC Set 50 màu',
        productImage: '',
        variation: 'Set 50 màu Mix',
        quantity: 1,
      },
    ],
    totalAmount: 215000,
    paymentNote: 'Thanh toán online - Thẻ ngân hàng',
    status: OrderTabStatus.Shipping,
    statusLabel: 'Đang giao',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'GHTK', method: 'Pickup tại nhà' },
    isProcessed: true,
    createdAt: '2026-03-19T14:00:00',
  },
  // ── Đã giao (3) ───────────────────────────────────────────
  {
    id: 'ord-014',
    orderCode: '260315NOPQRSTUV',
    customerName: 'tranquocviet_tqv',
    items: [
      {
        id: 'item-014-1',
        productName: 'Sổ Tay Leuchtturm1917 A5 Dotted Hard Cover',
        productImage: '',
        variation: 'Midnight Blue / 251 trang',
        quantity: 1,
      },
    ],
    totalAmount: 490000,
    paymentNote: 'Thanh toán online - VNPay',
    status: OrderTabStatus.Delivered,
    statusLabel: 'Đã giao',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'SPX Express', method: 'Drop off / Pickup' },
    isProcessed: true,
    createdAt: '2026-03-15T09:00:00',
  },
  {
    id: 'ord-015',
    orderCode: '260316WXYZABCDE',
    customerName: 'lythimai_garden',
    items: [
      {
        id: 'item-015-1',
        productName: 'Giấy Origami 15x15cm 100 tờ màu Gradient',
        productImage: '',
        variation: 'Gradient Pastel 100 tờ',
        quantity: 2,
      },
    ],
    totalAmount: 68000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.Delivered,
    statusLabel: 'Đã giao',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'J&T Express', method: 'Drop off' },
    isProcessed: true,
    createdAt: '2026-03-16T10:00:00',
  },
  {
    id: 'ord-016',
    orderCode: '260317FGHIJKLMN',
    customerName: 'phanthanhson_pta',
    items: [
      {
        id: 'item-016-1',
        productName: 'Kẹp Bướm Binder Clip Size Lớn 50mm Hộp 12 cái',
        productImage: '',
        variation: 'Đen / 50mm',
        quantity: 1,
      },
      {
        id: 'item-016-2',
        productName: 'Ghim Kẹp Giấy Hộp 100 cái Đồng',
        productImage: '',
        variation: 'Màu đồng / size 28mm',
        quantity: 2,
      },
    ],
    totalAmount: 52000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.Delivered,
    statusLabel: 'Đã giao',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'ViettelPost', method: 'Drop off' },
    isProcessed: true,
    createdAt: '2026-03-17T08:00:00',
  },
  // ── Trả hàng / Hoàn tiền / Huỷ (7) ───────────────────────
  {
    id: 'ord-017',
    orderCode: '260310OPQRSTUVW',
    customerName: 'nguyen_ha_linh99',
    items: [
      {
        id: 'item-017-1',
        productName: 'Bút Chì Màu Faber-Castell 48 màu Hộp thiếc',
        productImage: '',
        variation: 'Hộp thiếc 48 màu',
        quantity: 1,
      },
    ],
    totalAmount: 325000,
    paymentNote: 'Thanh toán online - MoMo',
    status: OrderTabStatus.ReturnCancel,
    statusLabel: 'Trả hàng',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'SPX Express', method: 'Drop off / Pickup' },
    isProcessed: true,
    createdAt: '2026-03-10T09:00:00',
  },
  {
    id: 'ord-018',
    orderCode: '260311XYZABCDEF',
    customerName: 'vuthoaiquynh_vq',
    items: [
      {
        id: 'item-018-1',
        productName: 'Hộp Quà Tặng Sinh Nhật Vintage Kraft Size M',
        productImage: '',
        variation: 'Kraft Brown / 25x20x10cm',
        quantity: 2,
      },
    ],
    totalAmount: 89000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.ReturnCancel,
    statusLabel: 'Đã huỷ',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'J&T Express', method: 'Drop off' },
    isProcessed: true,
    createdAt: '2026-03-11T10:30:00',
  },
  {
    id: 'ord-019',
    orderCode: '260311GHIJKLMNO',
    customerName: 'dinhthanhtung_dt',
    items: [
      {
        id: 'item-019-1',
        productName: 'Máy Dập Lỗ 2 lỗ Kim Loại Deli Heavy Duty',
        productImage: '',
        variation: 'Đen / 2 lỗ',
        quantity: 1,
      },
    ],
    totalAmount: 145000,
    paymentNote: 'Thanh toán online - ZaloPay',
    status: OrderTabStatus.ReturnCancel,
    statusLabel: 'Đã huỷ',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'GHTK', method: 'Pickup tại nhà' },
    isProcessed: true,
    createdAt: '2026-03-11T14:00:00',
  },
  {
    id: 'ord-020',
    orderCode: '260312PQRSTUVWX',
    customerName: 'trinhthuhang_tth',
    items: [
      {
        id: 'item-020-1',
        productName: 'Set Phong Bì A6 Kraft Có Cửa Sổ 50 cái',
        productImage: '',
        variation: 'Kraft có cửa sổ / A6',
        quantity: 1,
        tag: 'Flash Sale',
      },
    ],
    totalAmount: 55000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.ReturnCancel,
    statusLabel: 'Hoàn tiền',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'ViettelPost', method: 'Drop off' },
    isProcessed: true,
    createdAt: '2026-03-12T08:00:00',
  },
  {
    id: 'ord-021',
    orderCode: '260312YZABCDEFG',
    customerName: 'luongquockhanh_k',
    items: [
      {
        id: 'item-021-1',
        productName: 'Súng Keo Nến Mini 7mm 20W có đế',
        productImage: '',
        variation: 'Trắng / 7mm',
        quantity: 1,
      },
      {
        id: 'item-021-2',
        productName: 'Thanh Keo Nến Màu 7mm 100 cây',
        productImage: '',
        variation: 'Mix màu pastel 100 cây',
        quantity: 1,
      },
    ],
    totalAmount: 112000,
    paymentNote: 'Thanh toán online - Thẻ ngân hàng',
    status: OrderTabStatus.ReturnCancel,
    statusLabel: 'Đã huỷ',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'SPX Express', method: 'Drop off / Pickup' },
    isProcessed: true,
    createdAt: '2026-03-12T11:00:00',
  },
  {
    id: 'ord-022',
    orderCode: '260313HIJKLMNOP',
    customerName: 'nguyen_bich_ngoc',
    items: [
      {
        id: 'item-022-1',
        productName: 'Bảng Cork Trắng Bần 60x90cm Kèm Khung Nhôm',
        productImage: '',
        variation: 'Trắng / 60x90cm',
        quantity: 1,
      },
    ],
    totalAmount: 275000,
    paymentNote: 'Thanh toán online - VNPay',
    status: OrderTabStatus.ReturnCancel,
    statusLabel: 'Trả hàng',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Nhanh', provider: 'GHTK', method: 'Pickup tại nhà' },
    isProcessed: true,
    createdAt: '2026-03-13T09:00:00',
  },
  {
    id: 'ord-023',
    orderCode: '260313QRSTUVWXY',
    customerName: 'phamvanduc_pvd',
    items: [
      {
        id: 'item-023-1',
        productName: 'Dây Buộc Quà Twine Jute 50m Cuộn',
        productImage: '',
        variation: 'Nâu tự nhiên / 50m',
        quantity: 3,
        tag: 'Flash Sale',
      },
    ],
    totalAmount: 72000,
    paymentNote: 'Thanh toán khi nhận hàng',
    status: OrderTabStatus.ReturnCancel,
    statusLabel: 'Đã huỷ',
    orderType: OrderType.Normal,
    shippingUnit: { name: 'Tiêu Chuẩn', provider: 'J&T Express', method: 'Drop off' },
    isProcessed: true,
    createdAt: '2026-03-13T15:00:00',
  },
]

export const orderService = {
  getOrders(filter: OrderFilter): { orders: Order[]; total: number } {
    let result = [...FAKE_ORDERS]

    if (filter.tab !== OrderTabStatus.All) {
      result = result.filter((o) => o.status === filter.tab)
    }
    if (filter.orderType !== OrderType.All) {
      result = result.filter((o) => o.orderType === filter.orderType)
    }
    if (filter.processStatus === OrderProcessStatus.Unprocessed) {
      result = result.filter((o) => !o.isProcessed)
    } else if (filter.processStatus === OrderProcessStatus.Processed) {
      result = result.filter((o) => o.isProcessed)
    }
    if (filter.searchValue.trim()) {
      const q = filter.searchValue.trim().toLowerCase()
      if (filter.searchField === 'orderCode') {
        result = result.filter((o) => o.orderCode.toLowerCase().includes(q))
      } else if (filter.searchField === 'customerName') {
        result = result.filter((o) => o.customerName.toLowerCase().includes(q))
      } else {
        result = result.filter(
          (o) =>
            o.orderCode.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q),
        )
      }
    }
    if (filter.shippingUnit && filter.shippingUnit !== 'all') {
      result = result.filter((o) =>
        o.shippingUnit.provider.toLowerCase().includes(filter.shippingUnit.toLowerCase()),
      )
    }

    const total = result.length
    const start = (filter.page - 1) * filter.pageSize
    return { orders: result.slice(start, start + filter.pageSize), total }
  },

  getTabCounts(): OrderTabCount[] {
    return [
      OrderTabStatus.All,
      OrderTabStatus.PendingConfirmation,
      OrderTabStatus.ReadyToShip,
      OrderTabStatus.Shipping,
      OrderTabStatus.Delivered,
      OrderTabStatus.ReturnCancel,
    ].map((tab) => ({
      tab,
      count:
        tab === OrderTabStatus.All
          ? FAKE_ORDERS.length
          : FAKE_ORDERS.filter((o) => o.status === tab).length,
    }))
  },

  confirmOrder(orderId: string): Promise<void> {
    const order = FAKE_ORDERS.find((o) => o.id === orderId)
    if (order) {
      order.status = OrderTabStatus.ReadyToShip
      order.statusLabel = 'Chờ lấy hàng'
      order.isProcessed = true
    }
    return Promise.resolve()
  },

  cancelOrder(orderId: string): Promise<void> {
    const order = FAKE_ORDERS.find((o) => o.id === orderId)
    if (order) {
      order.status = OrderTabStatus.ReturnCancel
      order.statusLabel = 'Đã huỷ'
      order.isProcessed = true
    }
    return Promise.resolve()
  },
}
