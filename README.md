# Hướng dẫn cài đặt

## Giới thiệu

Ứng dụng Quản lý Phòng khám:

- **Thống kê Bệnh**: Phân tích các loại bệnh được điều trị theo tháng
- **Bảng Lương**: Tính lương cho bác sĩ và y tá
- **Thông tin Bệnh nhân**: Xem thông tin chi tiết và lịch sử khám chữa bệnh
- **Báo cáo Doanh thu**: Phân tích doanh thu từ hoạt động khám chữa bệnh

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MongoDB (v4.4 trở lên)
- NPM hoặc Yarn

## Cài đặt

1. **Clone dự án** (hoặc giải nén nếu bạn đã có source code)
   ```
   git clone <đường dẫn repository>
   ```

2. **Cài đặt các phụ thuộc**
   ```
   cd project_node_mongo_end
   npm install
   ```

3. **Khởi tạo cơ sở dữ liệu**
   - Đảm bảo MongoDB đã được cài đặt và đang chạy
   - Sử dụng tập lệnh trong thư mục `database` để tạo cơ sở dữ liệu
   ```
   node database/init_clinic_db.js
   ```

4. **Tạo file .env dựa trên sample.env**
   - Cấu hình tương ứng để chạy chương trình

## Chạy ứng dụng

1. **Khởi động server**
   ```
   npm start
   ```
   Hoặc chạy với nodemon để tự động khởi động lại khi có thay đổi:
   ```
   npm run dev
   ```

2. **Truy cập ứng dụng**
   Mở trình duyệt và truy cập địa chỉ:
   ```
   http://localhost:3000
   ```
