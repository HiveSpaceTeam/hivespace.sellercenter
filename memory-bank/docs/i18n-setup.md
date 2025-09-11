# Hướng dẫn sử dụng i18n (Đa ngôn ngữ)

## Tổng quan
Dự án đã được thiết lập hệ thống đa ngôn ngữ với Vue i18n, hỗ trợ tiếng Việt và tiếng Anh.

## Cấu trúc file

### 1. Cấu hình i18n
- **File**: `src/i18n/index.ts`
- **Chức năng**: Cấu hình chính cho i18n, định nghĩa các bản dịch

### 2. Component LanguageSwitcher
- **File**: `src/components/common/LanguageSwitcher.vue`
- **Chức năng**: Component chuyển đổi ngôn ngữ với icon quốc gia

## Cách sử dụng

### Trong template Vue
```vue
<template>
  <!-- Sử dụng trực tiếp -->
  <h1>{{ $t('header.title') }}</h1>
  
  <!-- Sử dụng với computed (khuyến nghị) -->
  <span>{{ statusText.active }}</span>
</template>
```

### Trong script setup
```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Lấy text đã dịch
const title = t('header.title')

// Thay đổi ngôn ngữ
const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>
```

### Với computed properties (khuyến nghị)
```vue
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Tạo computed để reactive với thay đổi ngôn ngữ
const statusText = computed(() => ({
  active: t('table.active'),
  inactive: t('table.inactive')
}))
</script>
```

## Cấu trúc bản dịch

### Header
```typescript
header: {
  search: 'Tìm kiếm...',
  notifications: 'Thông báo',
  profile: 'Hồ sơ',
  settings: 'Cài đặt',
  logout: 'Đăng xuất',
  language: 'Ngôn ngữ'
}
```

### Sidebar
```typescript
sidebar: {
  menu: 'Menu',
  accounts: 'Tài khoản',
  accountList: 'Danh sách tài khoản',
  addAccount: 'Thêm tài khoản'
}
```

### Table
```typescript
table: {
  username: 'Tên đăng nhập',
  fullName: 'Họ và tên',
  email: 'Email',
  seller: 'Người bán',
  status: 'Trạng thái',
  createdDate: 'Ngày tạo',
  lastLoginDate: 'Lần đăng nhập cuối',
  actions: 'Thao tác',
  delete: 'Xóa',
  activate: 'Kích hoạt',
  deactivate: 'Vô hiệu hóa',
  yes: 'Có',
  no: 'Không',
  active: 'Hoạt động',
  inactive: 'Không hoạt động'
}
```

## Thêm ngôn ngữ mới

1. **Thêm bản dịch vào `src/i18n/index.ts`**
```typescript
const fr = {
  header: {
    search: 'Rechercher...',
    // ... các bản dịch khác
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  fallbackLocale: 'en',
  messages: {
    vi,
    en,
    fr // Thêm ngôn ngữ mới
  }
})
```

2. **Thêm option vào LanguageSwitcher**
```vue
<button @click="changeLanguage('fr')" class="...">
  <img src="/flags/fr.svg" class="w-5 h-5 mr-3" />
  Français
</button>
```

## Lưu ý quan trọng

1. **Sử dụng computed properties** cho text động để đảm bảo reactive
2. **Lưu ngôn ngữ vào localStorage** để duy trì lựa chọn của user
3. **Fallback locale** sẽ được sử dụng nếu không tìm thấy bản dịch
4. **Icon quốc gia** được tạo bằng SVG inline để dễ tùy chỉnh

## Troubleshooting

### Lỗi "Cannot find module 'vue-i18n'"
```bash
npm install vue-i18n@9
```

### Text không thay đổi khi chuyển ngôn ngữ
- Kiểm tra xem có sử dụng computed properties không
- Đảm bảo đã import và sử dụng `useI18n()` đúng cách

### Icon quốc gia không hiển thị
- Kiểm tra SVG path trong LanguageSwitcher
- Đảm bảo viewBox và dimensions đúng

