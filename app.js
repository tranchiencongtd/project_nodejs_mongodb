const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');
const moment = require('moment');
require('dotenv').config(); 

// Cấu hình ứng dụng
const app = express();
const port = process.env.PORT || 3000;

// Kết nối MongoDB 
const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Khởi tạo kết nối MongoDB
let db;

async function connectToMongo() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log('Đã kết nối đến MongoDB');
    db = client.db(dbName);
    
    // Đặt biến db toàn cục để sử dụng trong các module khác
    global.db = db;
    
    return db;
  } catch (err) {
    console.error('Lỗi kết nối MongoDB:', err);
    process.exit(1);
  }
}

// Import các chức năng từ clinic_queries.js
const clinicQueries = require('./controllers/clinicQueriesAdapter');

// Định nghĩa các route

// Trang chủ
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Hệ thống Quản lý Phòng khám',
    moment: moment
  });
});

// Thống kê bệnh theo tháng
app.get('/diseases', (req, res) => {
  res.render('diseases', { 
    title: 'Thống kê Bệnh', 
    moment: moment,
    data: null,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
});

app.post('/diseases', async (req, res) => {
  try {
    const { year, month } = req.body;
    const result = await clinicQueries.getDiseaseStatsByMonth(db, parseInt(year), parseInt(month));
    
    res.render('diseases', { 
      title: 'Thống kê Bệnh', 
      moment: moment,
      data: result,
      year,
      month
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê bệnh:', error);
    res.status(500).render('error', { message: 'Lỗi khi lấy thống kê bệnh' });
  }
});

// Tính lương nhân viên
app.get('/salaries', (req, res) => {
  res.render('salaries', { 
    title: 'Bảng Lương', 
    moment: moment,
    data: null,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
});

app.post('/salaries', async (req, res) => {
  try {
    const { year, month } = req.body;
    const result = await clinicQueries.calculateSalaries(db, parseInt(year), parseInt(month));
    
    res.render('salaries', { 
      title: 'Bảng Lương', 
      moment: moment,
      data: result,
      year,
      month
    });
  } catch (error) {
    console.error('Lỗi khi tính lương:', error);
    res.status(500).render('error', { message: 'Lỗi khi tính lương' });
  }
});

// Thông tin bệnh nhân
app.get('/patients', (req, res) => {
  res.render('patients', { 
    title: 'Thông tin Bệnh nhân', 
    moment: moment,
    data: null
  });
});

app.post('/patients', async (req, res) => {
  try {
    const { patientId } = req.body;
    const result = await clinicQueries.getPatientHistory(db, patientId);
    
    res.render('patients', { 
      title: 'Thông tin Bệnh nhân', 
      moment: moment,
      data: result,
      patientId
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin bệnh nhân:', error);
    res.status(500).render('error', { message: 'Lỗi khi lấy thông tin bệnh nhân' });
  }
});

// Báo cáo doanh thu
app.get('/revenue', (req, res) => {
  res.render('revenue', { 
    title: 'Báo cáo Doanh thu', 
    moment: moment,
    data: null,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
});

app.post('/revenue', async (req, res) => {
  try {
    const { year, month } = req.body;
    const result = await clinicQueries.calculateRevenue(db, parseInt(year), parseInt(month));
    
    res.render('revenue', { 
      title: 'Báo cáo Doanh thu', 
      moment: moment,
      data: result,
      year,
      month
    });
  } catch (error) {
    console.error('Lỗi khi tính doanh thu:', error);
    res.status(500).render('error', { message: 'Lỗi khi tính doanh thu' });
  }
});

// Khởi động server
async function startServer() {
  await connectToMongo();
  
  app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
  });
}

startServer().catch(console.error);