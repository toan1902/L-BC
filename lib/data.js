// lib/data.js
// Default data — chỉ dùng khi KV chưa có dữ liệu

export const DEFAULT_MEMBERS = [
  { id: 1, name: 'Lê Văn Vương',  role: 'Chủ tịch',        phone: '0945820779', paid: 5000000, pm: 'tien-mat',      paidDate: '2025-03-10' },
  { id: 2, name: 'Lê Quốc Hùng',  role: 'Phó chủ tịch',    phone: '0886575868', paid: 0,       pm: '',              paidDate: '' },
  { id: 3, name: 'Lê Thị Quỳnh',  role: 'Phó chủ tịch',    phone: '0906515888', paid: 0,       pm: '',              paidDate: '' },
  { id: 4, name: 'Lê Tấn Dũng',   role: 'Phó chủ tịch',    phone: '0889334747', paid: 0,       pm: '',              paidDate: '' },
  { id: 5, name: 'Lê Quang Toàn', role: 'Chánh văn phòng',  phone: '0823047047', paid: 3000000, pm: 'chuyen-khoan', paidDate: '2025-04-01' },
  { id: 6, name: 'Lê Long',        role: 'Uỷ viên',          phone: '0984553246', paid: 0,       pm: '',              paidDate: '' },
  { id: 7, name: 'Lê Văn Khâm',   role: 'Uỷ viên',          phone: '0379786574', paid: 1000000, pm: 'tien-mat',      paidDate: '2025-04-15' },
]

export const DEFAULT_EXPENSES = [
  { id: 1, date: '2025-03-15', desc: 'In ấn giấy tờ thành lập CLB', cat: 'hanh-chinh', amount: 850000,  person: 'Lê Quang Toàn' },
  { id: 2, date: '2025-04-20', desc: 'Tiệc gặp mặt thành lập CLB',  cat: 'su-kien',    amount: 3500000, person: 'Lê Văn Vương' },
  { id: 3, date: '2025-05-10', desc: 'Mua văn phòng phẩm',           cat: 'hanh-chinh', amount: 320000,  person: 'Lê Quang Toàn' },
]

export const CAT_LABELS = {
  'su-kien': 'Sự kiện',
  'hanh-chinh': 'Hành chính',
  'dao-tao': 'Đào tạo',
  'tiep-khach': 'Tiếp khách',
  'khac': 'Khác',
}

export const PM_LABELS = {
  'tien-mat': 'Tiền mặt',
  'chuyen-khoan': 'Chuyển khoản',
}
