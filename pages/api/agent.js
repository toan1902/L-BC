// ============================================================
// AI Agent Tư vấn Thành viên — CLB Doanh Nhân Họ Lê Đắk Lắk
// Stack: Node.js + Anthropic API + Vercel Functions
// ============================================================

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// ─── SYSTEM PROMPT ──────────────────────────────────────────
const SYSTEM_PROMPT = `Bạn là TRÍ — Trợ lý AI chính thức của CLB Doanh Nhân Họ Lê Đắk Lắk.

VAI TRÒ:
Tư vấn, hỗ trợ và giải đáp mọi thắc mắc cho người muốn tìm hiểu hoặc gia nhập CLB Doanh Nhân Họ Lê Đắk Lắk.

PHONG CÁCH:
- Thân thiện, trân trọng, dùng xưng hô "Anh/Chị" và "em"
- Ngắn gọn, rõ ràng — không dài dòng
- Tự hào về dòng họ Lê và truyền thống CLB
- Kết thúc mỗi câu trả lời bằng một câu hỏi mở để tiếp tục cuộc trò chuyện

THÔNG TIN CLB:
- Tên: CLB Doanh Nhân Họ Lê Đắk Lắk
- Địa chỉ VP: 321 Y Wang, P. Ea Kao, T. Đắk Lắk
- Chủ tịch: Lê Văn Vương — 0945 820 779
- Chánh VP (liên hệ đăng ký): Lê Quang Toàn — 0823 047 047
- Phó CT: Lê Quốc Hùng (0886 575 868), Lê Thị Quỳnh (0906 515 888), Lê Tấn Dũng (0889 334 747)
- Website: lđbc.vn
- Tổ chức quốc gia: Hội đồng Họ Lê Việt Nam (holevietnam.vn)
- Slogan: "Đoàn kết · Phát triển · Rạng danh Lê tộc Việt Nam"

ĐIỀU KIỆN THAM GIA:
- Mang họ Lê (hoặc có gốc họ Lê)
- Là doanh nhân, chủ doanh nghiệp, hộ kinh doanh tại Đắk Lắk
- Cam kết tham gia sinh hoạt định kỳ của CLB

QUYỀN LỢI THÀNH VIÊN:
- Kết nối mạng lưới 120+ doanh nhân Họ Lê
- Tham gia hội nghị giao thương, sự kiện kết nối
- Hỗ trợ kinh doanh trong nội bộ dòng họ
- Tham gia chương trình Khuyến học – Khuyến tài
- Kết nối với CLB DN Họ Lê toàn quốc (300+ thành viên)
- Hành trình về nguồn tại Lam Kinh, Thanh Hoá

PHÍ THÀNH VIÊN:
Liên hệ trực tiếp anh Lê Quang Toàn để biết thêm chi tiết.

HOẠT ĐỘNG THƯỜNG NIÊN:
- Đại hội thường niên (tháng 12)
- Hội nghị giao thương (2–3 lần/năm)
- Chương trình Khuyến học (tháng 10)
- Hành trình về nguồn Lam Kinh
- Gala Dinner kết nối doanh nhân
- Giải bóng đá Cúp Doanh nhân Họ Lê

GIỚI HẠN:
- Không cam kết lợi nhuận kinh doanh cụ thể
- Nếu câu hỏi ngoài phạm vi, hướng đến anh Lê Quang Toàn (CVP) 0823 047 047
- Không tiết lộ thông tin cá nhân thành viên ngoài ban lãnh đạo

KHI NGƯỜI DÙNG MUỐN ĐĂNG KÝ:
Sử dụng tool "register_interest" để ghi nhận thông tin và thông báo cho ban thư ký.`;

// ─── TOOLS ─────────────────────────────────────────────────
const TOOLS = [
  {
    name: "register_interest",
    description: "Ghi nhận thông tin người muốn tham gia CLB và gửi thông báo đến ban thư ký",
    input_schema: {
      type: "object",
      properties: {
        ho_ten: { type: "string", description: "Họ và tên đầy đủ" },
        so_dien_thoai: { type: "string", description: "Số điện thoại liên hệ" },
        linh_vuc: { type: "string", description: "Lĩnh vực kinh doanh" },
        ghi_chu: { type: "string", description: "Ghi chú thêm nếu có" }
      },
      required: ["ho_ten", "so_dien_thoai"]
    }
  },
  {
    name: "get_upcoming_events",
    description: "Lấy danh sách sự kiện sắp tới của CLB",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

// ─── TOOL HANDLERS ──────────────────────────────────────────
async function executeTool(toolName, toolInput) {
  if (toolName === "register_interest") {
    // TODO: Gửi webhook đến Make.com / Google Sheets / Zalo OA
    console.log("📋 Đăng ký mới:", toolInput);

    // Ví dụ gửi webhook Make.com:
    // await fetch(process.env.MAKE_WEBHOOK_URL, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     ...toolInput,
    //     timestamp: new Date().toISOString(),
    //     source: "AI Agent"
    //   })
    // });

    return {
      success: true,
      message: `Đã ghi nhận thông tin của ${toolInput.ho_ten}. Ban thư ký CLB sẽ liên hệ trong vòng 24 giờ.`
    };
  }

  if (toolName === "get_upcoming_events") {
    // TODO: Kết nối Google Calendar / Notion database
    return {
      events: [
        { ten: "Hội nghị giao thương Q3/2025", ngay: "15/08/2025", dia_diem: "TP. Buôn Ma Thuột" },
        { ten: "Chương trình Khuyến học Họ Lê", ngay: "20/10/2025", dia_diem: "Đắk Lắk" },
        { ten: "Đại hội thường niên 2025", ngay: "12/2025", dia_diem: "TP. Buôn Ma Thuột" }
      ]
    };
  }

  return { error: "Tool không tồn tại" };
}

// ─── CORE AGENT FUNCTION ────────────────────────────────────
async function runAgent(messages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages
    })
  });

  const data = await response.json();

  // Nếu agent muốn dùng tool
  if (data.stop_reason === "tool_use") {
    const toolUseBlock = data.content.find(b => b.type === "tool_use");
    const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input);

    // Gửi kết quả tool về cho agent
    const updatedMessages = [
      ...messages,
      { role: "assistant", content: data.content },
      {
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult)
        }]
      }
    ];

    // Gọi lại để lấy câu trả lời cuối
    return runAgent(updatedMessages);
  }

  // Trả về text response
  const textBlock = data.content.find(b => b.type === "text");
  return textBlock?.text || "Xin lỗi, em không thể xử lý yêu cầu này.";
}

// ─── VERCEL SERVERLESS HANDLER ──────────────────────────────
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Thiếu message" });

    const messages = [
      ...history,
      { role: "user", content: message }
    ];

    const reply = await runAgent(messages);

    res.json({
      reply,
      history: [
        ...messages,
        { role: "assistant", content: reply }
      ]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server", detail: err.message });
  }
}
