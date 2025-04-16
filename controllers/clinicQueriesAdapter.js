// Lấy thống kê bệnh theo tháng
async function getDiseaseStatsByMonth(db, year, month) {
  // Chuyển đổi tháng để đảm bảo định dạng phù hợp (1-12)
  const targetMonth = parseInt(month);
  const targetYear = parseInt(year);
  
  // Sử dụng toán tử MongoDB để lọc theo năm và tháng
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
  
  const result = await db.collection('visits').aggregate(pipeline).toArray();
  
  return result;
}

// Tính lương của các Bác sĩ và Y tá trong tháng
async function calculateSalaries(db, year, month) {
  // Chuyển đổi tháng để đảm bảo định dạng phù hợp (1-12)
  const targetMonth = parseInt(month);
  const targetYear = parseInt(year);
  
  // 1. Tính lương Bác sĩ
  // Lương cơ bản: 7,000,000 VND
  // Cộng thêm 1,000,000 VND cho mỗi bệnh chữa khỏi (đã hoàn thành chuỗi khám)
  
  // Lấy danh sách bác sĩ
  const doctors = await db.collection('doctors').find({}).toArray();
  
  const doctorSalaries = await Promise.all(doctors.map(async doctor => {
    // Tìm tất cả bệnh nhân đã kết thúc điều trị trong tháng - sử dụng $year và $month
    const completedTreatments = await db.collection('visits').aggregate([
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
  }));
  
  // 2. Tính lương Y tá
  // Lương cơ bản: 5,000,000 VND
  // Cộng thêm 200,000 VND cho mỗi lần hỗ trợ bệnh nhân
  
  // Lấy danh sách y tá
  const nurses = await db.collection('nurses').find({}).toArray();
  
  const nurseSalaries = await Promise.all(nurses.map(async nurse => {
    // Đếm số lần phân công trong tháng - sử dụng $year và $month
    const assignments = await db.collection('nurseAssignments').aggregate([
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
  }));
  
  return {
    doctorSalaries,
    nurseSalaries
  };
}

// Hiển thị thông tin một bệnh nhân và lịch sử khám chữa bệnh
async function getPatientHistory(db, patientId) {
  patientId = patientId.trim(); // Loại bỏ khoảng trắng đầu và cuối
  // Tìm bệnh nhân theo ID hoặc tên
  const patientQuery = patientId.startsWith("BN") 
    ? { ma_benhnhan: patientId } 
    : { ho_ten: { $regex: patientId, $options: "i" } };
  
  const patient = await db.collection('patients').findOne(patientQuery);
  
  if (!patient) {
    return { error: `Không tìm thấy bệnh nhân với mã/tên: ${patientId}` };
  }
  
  // Lấy tất cả lần khám của bệnh nhân này, sắp xếp theo ngày
  const visits = await db.collection('visits').aggregate([
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
  
  // Tính toán bệnh hiện tại
  const currentDate = new Date();
  const currentDiseases = visits.filter(visit => !visit.ngay_ra || new Date(visit.ngay_ra) > currentDate)
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
  
  // Lấy chi tiết đơn thuốc cho lần khám gần nhất
  let latestPrescriptions = [];
  
  if (visits.length > 0) {
    const latestVisit = visits[visits.length - 1];
    
    if (latestVisit.prescriptions && latestVisit.prescriptions.length > 0) {
      // Lấy chi tiết thuốc
      latestPrescriptions = await Promise.all(latestVisit.prescriptions.map(async prescription => {
        const medicine = await db.collection('medicines').findOne({ ma_thuoc: prescription.ma_thuoc });
        return {
          ...prescription,
          ten_thuoc: medicine ? medicine.ten_thuoc : "Không xác định",
          don_vi: medicine ? medicine.don_vi : "N/A",
          gia_thuoc: medicine ? medicine.gia_thuoc : 0
        };
      }));
    }
  }
  
  return {
    patient,
    visits,
    currentDiseases,
    diseaseHistory,
    latestPrescriptions
  };
}

// Tính doanh thu của phòng khám
async function calculateRevenue(db, year, month) {
  // Chuyển đổi tháng để đảm bảo định dạng phù hợp (1-12)
  const targetMonth = parseInt(month);
  const targetYear = parseInt(year);
  
  // 1. Tính doanh thu từ khám chữa bệnh - sử dụng $year và $month
  const medicalRevenue = await db.collection('visits').aggregate([
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
  const medicineRevenue = await db.collection('prescriptions').aggregate([
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
  
  // Chi tiết theo từng bệnh - sử dụng $year và $month
  const revenueByDisease = await db.collection('visits').aggregate([
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
  const detailedRevenueByDisease = await Promise.all(revenueByDisease.map(async (item) => {
    const prescriptions = await db.collection('prescriptions').aggregate([
      {
        $match: {
          ma_lankham: { $in: item.lankham_ids }
        }
      },
      {
        $group: {
          _id: null,
          medicine_revenue: { $sum: "$thanh_tien" }
        }
      }
    ]).toArray();
    
    const medicine_revenue = prescriptions.length > 0 ? prescriptions[0].medicine_revenue : 0;
    
    return {
      benh: item._id,
      doanh_thu_kham: item.medical_revenue,
      doanh_thu_thuoc: medicine_revenue,
      tong_doanh_thu: item.medical_revenue + medicine_revenue,
      so_luot_kham: item.visit_count
    };
  }));
  
  // Sắp xếp theo tổng doanh thu giảm dần
  detailedRevenueByDisease.sort((a, b) => b.tong_doanh_thu - a.tong_doanh_thu);
  
  return {
    totalMedicalRevenue,
    totalVisits,
    totalMedicineRevenue,
    totalPrescriptions,
    totalRevenue,
    revenueByDisease: detailedRevenueByDisease
  };
}

// Hàm hỗ trợ định dạng tiền tệ - sử dụng ở phía client
function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN') + " đ";
}

module.exports = {
  getDiseaseStatsByMonth,
  calculateSalaries,
  getPatientHistory,
  calculateRevenue,
  formatCurrency
};