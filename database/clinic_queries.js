// Script Truy vấn Cơ sở dữ liệu Phòng khám

// 1. Liệt kê danh sách các loại bệnh được các bệnh nhân mắc phải trong một tháng, sắp xếp theo số bệnh nhân giảm dần
function getDiseaseStatsByMonth(year, month) {
  // Chuyển đổi tháng để đảm bảo định dạng phù hợp (1-12)
  const targetMonth = parseInt(month);
  const targetYear = parseInt(year);
  
  print(`\n=== THỐNG KÊ BỆNH TRONG THÁNG ${targetMonth}/${targetYear} ===\n`);
  
  // Sử dụng toán tử MongoDB để lọc theo năm và tháng - tránh vấn đề với ngày tháng
  const pipeline = [
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $year: "$ngay_vao" }, targetYear] },
            { $eq: [{ $month: "$ngay_vao" }, targetMonth] }
          ]
        }
      }
    },
    {
      // Nhóm các lần khám theo bệnh nhân và chẩn đoán để xử lý các lần khám liên tiếp
      $group: {
        _id: {
          benhnhan: "$ma_benhnhan",
          chan_doan: "$chan_doan",
          // Tạo nhóm chuỗi để xác định các lần khám liên tiếp
          // Logic này nhóm các lần khám theo bệnh nhân+chẩn đoán và chỉ đếm các lần không liên tiếp
          sequence: {
            $subtract: [
              { $dayOfYear: "$ngay_vao" },
              {
                $mod: [
                  { $subtract: [{ $dayOfYear: "$ngay_vao" }, 1] },
                  7 // Ngưỡng xem xét các lần khám là một phần của cùng một đợt điều trị (7 ngày)
                ]
              }
            ]
          }
        },
        first_visit: { $min: "$ngay_vao" },
        last_visit: { $max: "$ngay_ra" },
        visit_count: { $sum: 1 }
      }
    },
    {
      // Nhóm theo chẩn đoán để đếm số bệnh nhân cho mỗi loại bệnh
      $group: {
        _id: "$_id.chan_doan",
        patient_count: { $sum: 1 },
        total_visits: { $sum: "$visit_count" }
      }
    },
    {
      $project: {
        _id: 0,
        benh: "$_id",
        so_benh_nhan: "$patient_count",
        tong_luot_kham: "$total_visits"
      }
    },
    {
      $sort: { so_benh_nhan: -1, tong_luot_kham: -1 }
    }
  ];
  
  const result = db.visits.aggregate(pipeline).toArray();
  
  if (result.length === 0) {
    print(`Không có dữ liệu bệnh trong tháng ${targetMonth}/${targetYear}`);
    return;
  }
  
  print("| STT | Tên bệnh                  | Số bệnh nhân | Tổng lượt khám |");
  print("|-----|---------------------------|--------------|----------------|");
  
  result.forEach((item, index) => {
    const stt = index + 1;
    const benh = item.benh.padEnd(25);
    const so_benh_nhan = item.so_benh_nhan.toString().padEnd(12);
    const tong_luot = item.tong_luot_kham.toString().padEnd(14);
    
    print(`| ${stt.toString().padEnd(3)} | ${benh} | ${so_benh_nhan} | ${tong_luot} |`);
  });
}

// 2. Tính lương của các Bác sĩ và Y tá trong tháng
function calculateSalaries(year, month) {
  // Chuyển đổi tháng để đảm bảo định dạng phù hợp (1-12)
  const targetMonth = parseInt(month);
  const targetYear = parseInt(year);
  
  print(`\n=== BẢNG LƯƠNG THÁNG ${targetMonth}/${targetYear} ===\n`);
  
  // 1. Tính lương Bác sĩ
  // Lương cơ bản: 7,000,000 VND
  // Cộng thêm 1,000,000 VND cho mỗi bệnh chữa khỏi (đã hoàn thành chuỗi khám)
  
  // Lấy danh sách bác sĩ
  const doctors = db.doctors.find({}).toArray();
  
  // Bảng lương Bác sĩ
  print("=== LƯƠNG BÁC SĨ ===");
  print("| STT | Mã BS  | Họ tên                  | Lương cơ bản | Phụ cấp      | Tổng lương   |");
  print("|-----|--------|-------------------------|--------------|--------------|--------------|");
  
  const doctorSalaries = doctors.map(doctor => {
    // Tìm tất cả bệnh nhân đã kết thúc điều trị trong tháng - sử dụng $year và $month
    const completedTreatments = db.visits.aggregate([
      {
        $match: {
          ma_bacsi: doctor.ma_bacsi,
          ngay_ra: { $exists: true, $ne: null }, // Đảm bảo ngay_ra tồn tại và không null
          $expr: {
            $and: [
              { $eq: [{ $year: { $toDate: "$ngay_ra" } }, targetYear] },
              { $eq: [{ $month: { $toDate: "$ngay_ra" } }, targetMonth] }
            ]
          }
        }
      },
      {
        // Nhóm theo bệnh nhân và chẩn đoán để đếm số lượng điều trị đã hoàn thành
        $group: {
          _id: {
            benhnhan: "$ma_benhnhan",
            chan_doan: "$chan_doan"
          },
          completedAt: { $max: "$ngay_ra" }
        }
      },
      { $count: "total" }
    ]).toArray();
    
    // Tính phụ cấp
    const completedCount = completedTreatments.length > 0 ? completedTreatments[0].total : 0;
    const basicSalary = 7000000; // 7 triệu
    const bonus = completedCount * 1000000; // 1 triệu/bệnh nhân đã chữa khỏi
    const totalSalary = basicSalary + bonus;
    
    return {
      ma_bacsi: doctor.ma_bacsi,
      ho_ten: doctor.ho_ten,
      luong_co_ban: basicSalary,
      phu_cap: bonus,
      tong_luong: totalSalary,
      so_benh_nhan_khoi: completedCount
    };
  });
  
  // Hiển thị lương bác sĩ
  doctorSalaries.forEach((salary, index) => {
    const stt = (index + 1).toString().padEnd(3);
    const maBs = salary.ma_bacsi.padEnd(6);
    const hoTen = salary.ho_ten.padEnd(23);
    const luongCoBan = formatCurrency(salary.luong_co_ban).padEnd(12);
    const phuCap = formatCurrency(salary.phu_cap).padEnd(12);
    const tongLuong = formatCurrency(salary.tong_luong).padEnd(12);
    
    print(`| ${stt} | ${maBs} | ${hoTen} | ${luongCoBan} | ${phuCap} | ${tongLuong} |`);
  });
  
  // 2. Tính lương Y tá
  // Lương cơ bản: 5,000,000 VND
  // Cộng thêm 200,000 VND cho mỗi lần hỗ trợ bệnh nhân
  
  // Lấy danh sách y tá
  const nurses = db.nurses.find({}).toArray();
  
  // Bảng lương Y tá
  print("\n=== LƯƠNG Y TÁ ===");
  print("| STT | Mã YT  | Họ tên                  | Lương cơ bản | Phụ cấp      | Tổng lương   |");
  print("|-----|--------|-------------------------|--------------|--------------|--------------|");
  
  const nurseSalaries = nurses.map(nurse => {
    // Đếm số lần phân công trong tháng - sử dụng $year và $month
    const assignments = db.nurseAssignments.aggregate([
      {
        $match: { ma_yta: nurse.ma_yta }
      },
      {
        $lookup: {
          from: "visits",
          localField: "ma_lankham",
          foreignField: "ma_lankham",
          as: "visit"
        }
      },
      { $unwind: "$visit" }, // Unwind trước khi đối sánh
      {
        $match: {
          "visit.ngay_vao": { $exists: true, $ne: null }, // Đảm bảo ngay_vao tồn tại và không null
          $expr: {
            $and: [
              { $eq: [{ $year: { $toDate: "$visit.ngay_vao" } }, targetYear] },
              { $eq: [{ $month: { $toDate: "$visit.ngay_vao" } }, targetMonth] }
            ]
          }
        }
      },
      { $count: "total" }
    ]).toArray();
    
    // Tính lương
    const assignmentCount = assignments.length > 0 ? assignments[0].total : 0;
    const basicSalary = 5000000; // 5 triệu
    const bonus = assignmentCount * 200000; // 200 nghìn/lần hỗ trợ
    const totalSalary = basicSalary + bonus;
    
    return {
      ma_yta: nurse.ma_yta,
      ho_ten: nurse.ho_ten,
      luong_co_ban: basicSalary,
      phu_cap: bonus,
      tong_luong: totalSalary,
      so_lan_ho_tro: assignmentCount
    };
  });
  
  // Hiển thị lương y tá
  nurseSalaries.forEach((salary, index) => {
    const stt = (index + 1).toString().padEnd(3);
    const maYt = salary.ma_yta.padEnd(6);
    const hoTen = salary.ho_ten.padEnd(23);
    const luongCoBan = formatCurrency(salary.luong_co_ban).padEnd(12);
    const phuCap = formatCurrency(salary.phu_cap).padEnd(12);
    const tongLuong = formatCurrency(salary.tong_luong).padEnd(12);
    
    print(`| ${stt} | ${maYt} | ${hoTen} | ${luongCoBan} | ${phuCap} | ${tongLuong} |`);
  });
}

// 3. Hiển thị thông tin một bệnh nhân và lịch sử khám chữa bệnh
function getPatientHistory(patientId) {
  // Tìm bệnh nhân theo ID hoặc tên
  const patientQuery = patientId.startsWith("BN") 
    ? { ma_benhnhan: patientId } 
    : { ho_ten: { $regex: patientId, $options: "i" } };
  
  const patient = db.patients.findOne(patientQuery);
  
  if (!patient) {
    print(`Không tìm thấy bệnh nhân với mã/tên: ${patientId}`);
    return;
  }
  
  // In thông tin bệnh nhân
  print("\n=== THÔNG TIN BỆNH NHÂN ===");
  print(`Mã bệnh nhân: ${patient.ma_benhnhan}`);
  print(`Họ tên: ${patient.ho_ten}`);
  print(`Ngày sinh: ${formatDate(patient.ngay_sinh)}`);
  print(`Địa chỉ: ${patient.dia_chi}`);
  print(`Số điện thoại: ${patient.so_dien_thoai}`);
  print(`Số CMT: ${patient.so_cmt}`);
  
  // Lấy tất cả lần khám của bệnh nhân này, sắp xếp theo ngày
  const visits = db.visits.aggregate([
    { $match: { ma_benhnhan: patient.ma_benhnhan } },
    { $sort: { ngay_vao: 1 } },
    {
      $lookup: {
        from: "doctors",
        localField: "ma_bacsi",
        foreignField: "ma_bacsi",
        as: "doctor"
      }
    },
    { $unwind: "$doctor" },
    {
      $lookup: {
        from: "prescriptions",
        localField: "ma_lankham",
        foreignField: "ma_lankham",
        as: "prescriptions"
      }
    }
  ]).toArray();
  
  if (visits.length === 0) {
    print("\nBệnh nhân chưa có lịch sử khám bệnh.");
    return;
  }
  
  // Tính toán bệnh hiện tại
  const currentDate = new Date();
  const currentDiseases = visits.filter(visit => !visit.ngay_ra || visit.ngay_ra > currentDate)
                               .map(visit => visit.chan_doan);
  
  // Nhóm các bệnh để theo dõi các lần tái phát
  const diseaseHistory = {};
  visits.forEach(visit => {
    if (!diseaseHistory[visit.chan_doan]) {
      diseaseHistory[visit.chan_doan] = {
        occurrences: 1,
        first_visit: visit.ngay_vao,
        latest_visit: visit.ngay_vao
      };
    } else {
      // Kiểm tra xem đây có phải là lần mắc mới (không liên tiếp)
      const lastVisit = new Date(diseaseHistory[visit.chan_doan].latest_visit);
      const currentVisit = new Date(visit.ngay_vao);
      const dayDiff = Math.floor((currentVisit - lastVisit) / (1000 * 60 * 60 * 24));
      
      if (dayDiff > 30) { // Giả định là lần mắc mới nếu cách nhau hơn 30 ngày
        diseaseHistory[visit.chan_doan].occurrences += 1;
      }
      
      diseaseHistory[visit.chan_doan].latest_visit = visit.ngay_vao;
    }
  });
  
  // In tình trạng sức khỏe hiện tại
  print("\n=== TÌNH TRẠNG HIỆN TẠI ===");
  if (currentDiseases.length > 0) {
    print("Bệnh đang điều trị:");
    currentDiseases.forEach(disease => {
      const occurrence = diseaseHistory[disease].occurrences;
      print(`- ${disease} (lần thứ ${occurrence})`);
    });
  } else {
    print("Hiện tại không có bệnh đang điều trị.");
  }
  
  // In lịch sử khám bệnh
  print("\n=== LỊCH SỬ KHÁM BỆNH ===");
  print("| STT | Ngày vào            | Ngày ra              | Chẩn đoán               | Bác sĩ điều trị        | Chi phí      |");
  print("|-----|---------------------|----------------------|-------------------------|------------------------|--------------|");
  
  visits.forEach((visit, index) => {
    const stt = (index + 1).toString().padEnd(3);
    const ngayVao = formatDate(visit.ngay_vao).padEnd(19);
    const ngayRa = visit.ngay_ra ? formatDate(visit.ngay_ra).padEnd(20) : "Đang điều trị      ";
    const chanDoan = visit.chan_doan.padEnd(23);
    const bacSi = visit.doctor.ho_ten.padEnd(22);
    const chiPhi = formatCurrency(visit.tong_tien).padEnd(12);
    
    print(`| ${stt} | ${ngayVao} | ${ngayRa} | ${chanDoan} | ${bacSi} | ${chiPhi} |`);
  });
  
  // In chi tiết đơn thuốc cho lần khám gần nhất
  if (visits.length > 0) {
    const latestVisit = visits[visits.length - 1];
    
    if (latestVisit.prescriptions && latestVisit.prescriptions.length > 0) {
      print("\n=== ĐƠN THUỐC GẦN NHẤT ===");
      print(`Ngày khám: ${formatDate(latestVisit.ngay_vao)}`);
      print(`Chẩn đoán: ${latestVisit.chan_doan}`);
      print("| STT | Tên thuốc              | Số lượng | Đơn vị      | Đơn giá      | Thành tiền   | Hướng dẫn                    |");
      print("|-----|------------------------|----------|-------------|--------------|--------------|------------------------------|");
      
      // Lấy chi tiết thuốc
      const prescriptionDetails = latestVisit.prescriptions.map(prescription => {
        const medicine = db.medicines.findOne({ ma_thuoc: prescription.ma_thuoc });
        return {
          ...prescription,
          ten_thuoc: medicine ? medicine.ten_thuoc : "Không xác định",
          don_vi: medicine ? medicine.don_vi : "N/A",
          gia_thuoc: medicine ? medicine.gia_thuoc : 0
        };
      });
      
      prescriptionDetails.forEach((prescription, index) => {
        const stt = (index + 1).toString().padEnd(3);
        const tenThuoc = prescription.ten_thuoc.padEnd(22);
        const soLuong = prescription.so_luong.toString().padEnd(8);
        const donVi = prescription.don_vi.padEnd(11);
        const donGia = formatCurrency(prescription.gia_thuoc).padEnd(12);
        const thanhTien = formatCurrency(prescription.thanh_tien).padEnd(12);
        const huongDan = prescription.huong_dan.padEnd(28);
        
        print(`| ${stt} | ${tenThuoc} | ${soLuong} | ${donVi} | ${donGia} | ${thanhTien} | ${huongDan} |`);
      });
      
      // Tính tổng
      const totalAmount = prescriptionDetails.reduce((sum, item) => sum + item.thanh_tien, 0);
      print(`\nTổng tiền thuốc: ${formatCurrency(totalAmount)}`);
    }
  }
}

// 4. Tính doanh thu của phòng khám
function calculateRevenue(year, month) {
  // Chuyển đổi tháng để đảm bảo định dạng phù hợp (1-12)
  const targetMonth = parseInt(month);
  const targetYear = parseInt(year);
  
  print(`\n=== BÁO CÁO DOANH THU THÁNG ${targetMonth}/${targetYear} ===\n`);
  
  // 1. Tính doanh thu từ khám chữa bệnh - sử dụng $year và $month
  const medicalRevenue = db.visits.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $year: "$ngay_vao" }, targetYear] },
            { $eq: [{ $month: "$ngay_vao" }, targetMonth] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$tong_tien" },
        count: { $sum: 1 }
      }
    }
  ]).toArray();
  
  const totalMedicalRevenue = medicalRevenue.length > 0 ? medicalRevenue[0].total : 0;
  const totalVisits = medicalRevenue.length > 0 ? medicalRevenue[0].count : 0;
  
  // 2. Tính doanh thu từ bán thuốc - sử dụng $year và $month
  const medicineRevenue = db.prescriptions.aggregate([
    {
      $lookup: {
        from: "visits",
        localField: "ma_lankham",
        foreignField: "ma_lankham",
        as: "visit"
      }
    },
    {
      $unwind: "$visit"
    },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $year: "$visit.ngay_vao" }, targetYear] },
            { $eq: [{ $month: "$visit.ngay_vao" }, targetMonth] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$thanh_tien" },
        count: { $sum: 1 }
      }
    }
  ]).toArray();
  
  const totalMedicineRevenue = medicineRevenue.length > 0 ? medicineRevenue[0].total : 0;
  const totalPrescriptions = medicineRevenue.length > 0 ? medicineRevenue[0].count : 0;
  
  // Tính tổng doanh thu
  const totalRevenue = totalMedicalRevenue + totalMedicineRevenue;
  
  // Hiển thị tổng hợp doanh thu
  print("=== TỔNG HỢP DOANH THU ===");
  print(`1. Doanh thu khám chữa bệnh: ${formatCurrency(totalMedicalRevenue)} (${totalVisits} lượt khám)`);
  print(`2. Doanh thu bán thuốc:      ${formatCurrency(totalMedicineRevenue)} (${totalPrescriptions} đơn thuốc)`);
  print(`---------------------------------------`);
  print(`   TỔNG DOANH THU:          ${formatCurrency(totalRevenue)}`);
  
  // Chi tiết theo từng bệnh - sử dụng $year và $month
  print("\n=== CHI TIẾT THEO BỆNH ===");
  const revenueByDisease = db.visits.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $year: "$ngay_vao" }, targetYear] },
            { $eq: [{ $month: "$ngay_vao" }, targetMonth] }
          ]
        }
      }
    },
    {
      $group: {
        _id: "$chan_doan",
        medical_revenue: { $sum: "$tong_tien" },
        visit_count: { $sum: 1 },
        lankham_ids: { $push: "$ma_lankham" }
      }
    }
  ]).toArray();
  
  // Lấy doanh thu thuốc cho từng bệnh
  const revenueWithMeds = revenueByDisease.map(disease => {
    // Tìm tất cả đơn thuốc liên quan đến các lần khám của bệnh này
    const medRevenue = db.prescriptions.aggregate([
      {
        $match: {
          ma_lankham: { $in: disease.lankham_ids }
        }
      },
      {
        $group: {
          _id: null,
          medicine_revenue: { $sum: "$thanh_tien" }
        }
      }
    ]).toArray();
    
    const medicineRevenue = medRevenue.length > 0 ? medRevenue[0].medicine_revenue : 0;
    
    return {
      benh: disease._id,
      doanh_thu_kham: disease.medical_revenue,
      doanh_thu_thuoc: medicineRevenue,
      tong_doanh_thu: disease.medical_revenue + medicineRevenue,
      so_luot_kham: disease.visit_count
    };
  });
  
  // Sắp xếp theo tổng doanh thu giảm dần
  revenueWithMeds.sort((a, b) => b.tong_doanh_thu - a.tong_doanh_thu);
  
  print("| STT | Tên bệnh                  | Số lượt | DT Khám        | DT Thuốc       | Tổng DT        |");
  print("|-----|---------------------------|---------|----------------|----------------|----------------|");
  
  revenueWithMeds.forEach((item, index) => {
    const stt = (index + 1).toString().padEnd(3);
    const benh = item.benh.padEnd(25);
    const soLuot = item.so_luot_kham.toString().padEnd(7);
    const dtKham = formatCurrency(item.doanh_thu_kham).padEnd(14);
    const dtThuoc = formatCurrency(item.doanh_thu_thuoc || 0).padEnd(14);
    const tongDT = formatCurrency(item.tong_doanh_thu).padEnd(14);
    
    print(`| ${stt} | ${benh} | ${soLuot} | ${dtKham} | ${dtThuoc} | ${tongDT} |`);
  });
}

// Hàm hỗ trợ định dạng ngày tháng
function formatDate(date) {
  if (!date) return "N/A";
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Hàm hỗ trợ định dạng tiền tệ
function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN') + " đ";
}

// Phần thực thi chính

// Yêu cầu 1: Liệt kê danh sách các loại bệnh trong tháng
getDiseaseStatsByMonth(2025, 3); // Tháng 3, năm 2025

// Yêu cầu 2: Tính lương bác sĩ và y tá
calculateSalaries(2025, 3); // Tháng 3, năm 2025

// Yêu cầu 3: Hiển thị thông tin bệnh nhân và lịch sử khám chữa bệnh
getPatientHistory("BN001"); // Tìm theo mã bệnh nhân
// getPatientHistory("Nguyễn Văn L"); // Tìm theo tên bệnh nhân

// Yêu cầu 4: Tính doanh thu phòng khám
calculateRevenue(2025, 3); // Tháng 3, năm 2025
