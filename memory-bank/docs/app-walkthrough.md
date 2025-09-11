## Hướng dẫn đọc cấu trúc component (Top-down từ App.vue)

Tài liệu này giải thích các component theo hướng từ trên xuống, bắt đầu ở `src/App.vue`, đi qua các Provider, Layout, tới Header/Sidebar và các View/Widget con. Mục tiêu là giúp người mới nắm luồng render, state chia sẻ và vai trò của từng khối.

### App.vue (root)
- Đường dẫn: `src/App.vue`
- Vai trò: Điểm vào UI, bọc toàn bộ app bằng 2 provider và hiển thị nội dung theo router.
- Cấu trúc: `ThemeProvider` → `SidebarProvider` → `RouterView`.
- Ảnh hưởng: Mọi component bên trong đều có thể truy cập context theme và sidebar.

### ThemeProvider (context theme)
- Đường dẫn: `src/components/layout/ThemeProvider.vue`
- Vai trò: Quản lý theme `light/dark`, đồng bộ `localStorage`, gắn class `dark` vào `document.documentElement`.
- API nội bộ (provide):
  - `isDarkMode: Computed<boolean>`: có đang ở dark mode không.
  - `toggleTheme(): void`: đổi theme.
- Cách dùng: inject qua helper `useTheme()` được export ngay trong file; ví dụ `ThemeToggler.vue` sử dụng để gọi `toggleTheme`.

### SidebarProvider (context sidebar)
- Đường dẫn: `src/components/layout/SidebarProvider.vue`
- Vai trò: Khởi tạo context sidebar cho cả cây con bằng `useSidebarProvider()`.
- Logic cốt lõi: `src/composables/useSidebar.ts`
  - State: `isExpanded`, `isMobileOpen`, `isHovered`, `activeItem`, `openSubmenu`.
  - Hành vi: `toggleSidebar()`, `toggleMobileSidebar()`, `setIsHovered()`, `setActiveItem()`, `toggleSubmenu()`.
  - Nhận diện mobile theo `window.innerWidth < 768`; khi mobile, nút toggle tác động `isMobileOpen`, desktop thì tác động `isExpanded`.
  - API (inject): `useSidebar()` để tiêu thụ context trong các component con.

### Router (điều hướng trang)
- Đường dẫn: `src/router/index.ts`
- Vai trò: Khai báo routes lazy-load tới các View (Ecommerce, Forms, Tables, UiElements, Auth...).
- Highlight: `beforeEach` cập nhật `document.title` theo `to.meta.title`.

### AdminLayout (khung bố cục trang)
- Đường dẫn: `src/components/layout/AdminLayout.vue`
- Vai trò: Bố cục 3 phần chính: `AppSidebar`, `Backdrop`, khu vực nội dung (chứa `AppHeader` và `<slot>`).
- Tương tác sidebar: Dịch trái (`lg:ml-[290px]` hoặc `lg:ml-[90px]`) dựa vào `isExpanded || isHovered` để co/giãn phần content khi sidebar đóng/mở.

### AppHeader (đầu trang)
- Đường dẫn: `src/components/layout/AppHeader.vue`
- Vai trò: Thanh header gồm nút toggle sidebar, logo, search bar, bộ công cụ (ThemeToggler, NotificationMenu, UserMenu).
- Tương tác sidebar: `handleToggle()` dùng `useSidebar()` để quyết định toggle mobile hay desktop theo kích thước màn hình.
- Trạng thái menu ứng dụng nhỏ: `isApplicationMenuOpen` (ẩn/hiện block công cụ trên mobile).

#### Header Logo
- Đường dẫn: `src/components/layout/header/HeaderLogo.vue`
- Vai trò: Link về trang chủ, hiển thị logo theo theme.

#### SearchBar
- Đường dẫn: `src/components/layout/header/SearchBar.vue`
- Vai trò: Ô tìm kiếm (hiển thị ở `lg+`), chứa icon, input và gợi ý phím tắt `⌘ K`.

#### NotificationMenu
- Đường dẫn: `src/components/layout/header/NotificationMenu.vue`
- Vai trò: Menu thông báo dạng dropdown với danh sách mock; tự đóng khi click ngoài; ping badge.

#### UserMenu
- Đường dẫn: `src/components/layout/header/UserMenu.vue`
- Vai trò: Menu người dùng (profile, settings, support, sign out), dropdown đóng khi click ngoài.

#### ThemeToggler
- Đường dẫn: `src/components/common/ThemeToggler.vue`
- Vai trò: Nút đổi theme; inject `toggleTheme` từ `ThemeProvider`.

### Backdrop (overlay di động)
- Đường dẫn: `src/components/layout/Backdrop.vue`
- Vai trò: Hiển thị lớp phủ khi `isMobileOpen` để đóng sidebar khi click ra ngoài trên mobile.

### AppSidebar (sidebar điều hướng)
- Đường dẫn: `src/components/layout/AppSidebar.vue`
- Vai trò: Điều hướng chính, co/giãn theo `isExpanded`, mở theo `isMobileOpen`, hover mở tạm thời khi đã thu hẹp.
- Cấu trúc: Nhóm menu (`menuGroups`) → mỗi item có thể là `router-link` hoặc có `subItems` (submenu với transition).
- Active route: so sánh `route.path` với `item.path`/`subItem.path` để áp class active.
- Submenu: quản lý bằng `openSubmenu` (string key `groupIndex-itemIndex`) và computed `isAnySubmenuRouteActive`.
- Icon: nhập từ `src/icons`.

### Views (trang) và Widget (khối nội dung)
- Router trỏ tới các view trong `src/views/**`. Mỗi view thường bọc nội dung bằng `AdminLayout`.

#### Ecommerce (trang tổng quan)
- Đường dẫn: `src/views/Ecommerce.vue`
- Vai trò: Sắp xếp lưới các widget: `EcommerceMetrics`, `MonthlyTarget`, `MonthlySale`, `StatisticsChart`, `CustomerDemographic`, `RecentOrders`.
- Lưu ý: Tên import của `MonthlyTarget`/`MonthlySale` đang đảo so với file, nhưng mapping component vẫn hoạt động. Nên đồng bộ lại để dễ đọc.

#### Widget tiêu biểu trong `src/components/ecommerce/`
- `MonthlyTarget.vue`
  - Props: `value?: number` (default `75.55`) → tròn phần trăm trong radial bar (ApexCharts).
  - Có menu hành động qua `common/DropdownMenu.vue`.
- `MonthlySale.vue`
  - Biểu đồ cột (ApexCharts) với series/options mẫu, có menu hành động.
- `StatisticsChart.vue`
  - Biểu đồ area 2 series (ApexCharts) với lựa chọn chu kỳ (Monthly/Quarterly/Annually).
- `CustomerDemographic.vue`, `EcommerceMetrics.vue`, `RecentOrders.vue`
  - Các widget trình bày số liệu/giao diện, dữ liệu mẫu.

### Bổ trợ: Common, UI, Forms
Những khối này là building blocks được view/widget sử dụng lại. Tài liệu API chi tiết xem thêm `memory-bank/docs/components.md`.

- Common
  - `PageBreadcrumb.vue`: props `pageTitle: string`.
  - `DropdownMenu.vue`: `menuItems`, `buttonClass`, `menuClass`, `itemClass`.
- UI
  - `Button.vue`: `size`, `variant`, `startIcon`, `endIcon`, `onClick`, `disabled`.
  - `Modal.vue`: props `fullScreenBackdrop`, emits `close`.
  - `Alert.vue`, `Avatar.vue`, `Badge.vue`, `YouTubeEmbed.vue`: các props hiển thị quen thuộc.
- Forms/FormElements
  - `MultipleSelect.vue`: `options` (bắt buộc), `modelValue`, emits `update:modelValue`.
  - `Dropzone.vue`: `uploadUrl` (mặc định `/upload`), tích hợp `dropzone` và dọn tài nguyên khi unmount.

### Luồng state & tương tác chính
- Theme: `ThemeProvider` provide `toggleTheme` → `ThemeToggler` gọi để đổi theme; dark class phản ánh trên toàn app.
- Sidebar: `SidebarProvider` provide context → `AppHeader`/`AppSidebar`/`Backdrop` tiêu thụ qua `useSidebar()`; xử lý khác nhau giữa mobile/desktop.
- Điều hướng: `AppSidebar` thay đổi route; `RouterView` render view tương ứng; `beforeEach` cập nhật title.

### Thêm mới trang/menu (quick guide)
1) Tạo view mới trong `src/views/...` và bọc nội dung bằng `<admin-layout>`.
2) Thêm route trong `src/router/index.ts` (có `meta.title`).
3) Thêm item vào `menuGroups` của `AppSidebar.vue` với `name`, `icon`, `path` để hiển thị trong sidebar.


