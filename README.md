# LĐBC — Quản lý Hội phí CLB Doanh Nhân Họ Lê Đắk Lắk

## Hướng dẫn deploy lên Vercel (step by step)

### Bước 1 — Tạo GitHub repo
1. Vào github.com → New repository
2. Đặt tên: `ldbc-hoiphi` → Create
3. Upload toàn bộ thư mục này lên (kéo thả hoặc dùng GitHub Desktop)

### Bước 2 — Deploy lên Vercel
1. Vào vercel.com → Add New Project
2. Import repo `ldbc-hoiphi` từ GitHub
3. Vercel tự nhận là Next.js → nhấn **Deploy**
4. Sau khi deploy xong, đổi tên domain:
   - Project Settings → Domains → Add: `ldbc-hoiphi.vercel.app`

### Bước 3 — Tạo Vercel KV (database)
1. Trong Vercel dashboard → project ldbc-hoiphi
2. Tab **Storage** → Create Database → **KV**
3. Đặt tên: `ldbc-data` → Create
4. Vercel tự **tự động** kết nối vào project (không cần copy key)

### Bước 4 — Thêm Environment Variables
Vào Project Settings → Environment Variables, thêm:

| Key | Value |
|-----|-------|
| `ADMIN_PASSWORD` | Mật khẩu anh tự chọn (vd: LDBC@2025) |
| `ADMIN_TOKEN` | Chuỗi bí mật dài (vd: ldbc-secret-2025-lequangtoan) |

→ Redeploy sau khi thêm env vars

### Bước 5 — Dùng app
- **Link công khai**: `https://ldbc-hoiphi.vercel.app`
  → Ai cũng xem được, không sửa được
- **Link admin**: `https://ldbc-hoiphi.vercel.app/admin`
  → Nhập mật khẩu để sửa dữ liệu, xuất báo cáo

## Cách dùng hàng ngày
1. Khi có thành viên đóng tiền → vào `/admin` → nhập số tiền + hình thức
2. Nhấn **💾 Lưu thay đổi**
3. Chia sẻ link công khai cho ban chủ tịch xem
4. Cuối tháng/quý → nhấn **Xuất báo cáo tổng hợp** → file CSV mở bằng Excel

## Cấu trúc project
```
ldbc-hoiphi/
├── pages/
│   ├── index.js          # Trang công khai (xem)
│   ├── admin.js          # Trang admin (sửa, xuất)
│   └── api/
│       ├── data.js       # GET dữ liệu (public)
│       ├── login.js      # Đăng nhập admin
│       ├── members.js    # CRUD thành viên
│       └── expenses.js   # CRUD khoản chi
├── lib/
│   ├── data.js           # Dữ liệu mặc định
│   ├── kv.js             # Kết nối Vercel KV
│   └── auth.js           # Xác thực admin
├── public/
│   └── qr-tpbank.jpg     # Mã QR chuyển khoản
└── styles/
    └── globals.css       # Style toàn bộ app
```
