import mongoose from 'mongoose';

const uri = "mongodb+srv://devvd25_db_user:Dangcongvu2005@portfolio.mpbqqaf.mongodb.net/PORTFOLIO?retryWrites=true&w=majority&appName=PORTFOLIO";

console.log("--- Bắt đầu kiểm tra kết nối tới MongoDB Atlas ---");
console.log("Đang thử kết nối...");

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // Thử trong 5 giây
  });
  console.log("✅ THÀNH CÔNG: Máy tính của bạn ĐÃ KẾT NỐI được tới MongoDB!");
  await mongoose.disconnect();
} catch (error) {
  console.error("❌ THẤT BẠI: Không thể kết nối.");
  console.error("Mã lỗi:", error.code);
  console.error("Thông báo:", error.message);
  
  if (error.message.includes("SSL") || error.message.includes("TLSSocket")) {
    console.log("\n👉 CHẨN ĐOÁN: Do lỗi SSL/TLS. Khả năng cao phần mềm diệt Virus (Avast, Kaspersky...) hoặc tường lửa đang chặn kết nối bảo mật.");
  } else if (error.message.includes("ETIMEDOUT") || error.message.includes("selection timed out")) {
    console.log("\n👉 CHẨN ĐOÁN: Do lỗi Timeout. Mạng của bạn đang chặn cổng kết nối tới MongoDB.");
  }
}
process.exit();
