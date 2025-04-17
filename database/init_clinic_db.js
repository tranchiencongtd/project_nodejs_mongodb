// Tạo và chuyển sang cơ sở dữ liệu phòng khám
db = db.getSiblingDB('clinic_db');

// Xóa tất cả các collection hiện có để đảm bảo bắt đầu sạch sẽ
db.doctors.drop();
db.nurses.drop();
db.patients.drop();
db.visits.drop();
db.medicines.drop();
db.prescriptions.drop();
db.nurseAssignments.drop();

// Tạo các collection với bộ kiểm tra dữ liệu
db.createCollection("doctors", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["ma_bacsi", "so_cmt", "ho_ten", "ngay_sinh", "dia_chi", "bac_nghe", "tham_nien", "trinh_do", "chuyen_mon"],
            properties: {
                ma_bacsi: { bsonType: "string", description: "Mã số BS - bắt buộc và phải là chuỗi" },
                so_cmt: { bsonType: "string", description: "Số CMT - bắt buộc và phải là chuỗi" }, 
                ho_ten: { bsonType: "string", description: "Họ tên - bắt buộc và phải là chuỗi" },
                ngay_sinh: { bsonType: "date", description: "Ngày sinh - bắt buộc và phải là kiểu ngày tháng" },
                dia_chi: { bsonType: "string", description: "Địa chỉ - bắt buộc và phải là chuỗi" },
                bac_nghe: { bsonType: "string", description: "Bậc nghề - bắt buộc và phải là chuỗi" },
                tham_nien: { bsonType: "int", description: "Thâm niên - bắt buộc và phải là số nguyên" },
                trinh_do: { bsonType: "string", description: "Trình độ đào tạo - bắt buộc và phải là chuỗi" },
                chuyen_mon: { bsonType: "string", description: "Chuyên môn - bắt buộc và phải là chuỗi" }
            }
        }
    }
});

db.createCollection("nurses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ma_yta", "so_cmt", "ho_ten", "ngay_sinh", "dia_chi", "so_dien_thoai", "trinh_do", "tham_nien"],
      properties: {
        ma_yta: { bsonType: "string", description: "Mã số y tá - bắt buộc và phải là chuỗi" },
        so_cmt: { bsonType: "string", description: "Số CMT - bắt buộc và phải là chuỗi" },
        ho_ten: { bsonType: "string", description: "Họ tên - bắt buộc và phải là chuỗi" },
        ngay_sinh: { bsonType: "date", description: "Ngày sinh - bắt buộc và phải là kiểu ngày tháng" },
        dia_chi: { bsonType: "string", description: "Địa chỉ - bắt buộc và phải là chuỗi" },
        so_dien_thoai: { bsonType: "string", description: "Số điện thoại - bắt buộc và phải là chuỗi" },
        trinh_do: { bsonType: "string", description: "Trình độ - bắt buộc và phải là chuỗi" },
        tham_nien: { bsonType: "int", description: "Thâm niên - bắt buộc và phải là số nguyên" }
      }
    }
  }
});

db.createCollection("patients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ma_benhnhan", "so_cmt", "ho_ten", "ngay_sinh", "dia_chi", "so_dien_thoai"],
      properties: {
        ma_benhnhan: { bsonType: "string", description: "Mã số bệnh nhân - bắt buộc và phải là chuỗi" },
        so_cmt: { bsonType: "string", description: "Số CMT - bắt buộc và phải là chuỗi" },
        ho_ten: { bsonType: "string", description: "Họ tên - bắt buộc và phải là chuỗi" },
        ngay_sinh: { bsonType: "date", description: "Ngày sinh - bắt buộc và phải là kiểu ngày tháng" },
        dia_chi: { bsonType: "string", description: "Địa chỉ - bắt buộc và phải là chuỗi" },
        so_dien_thoai: { bsonType: "string", description: "Số điện thoại - bắt buộc và phải là chuỗi" }
      }
    }
  }
});

db.createCollection("visits", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ma_lankham", "ma_benhnhan", "ma_bacsi", "ngay_vao", "ngay_ra", "chan_doan", "tong_tien"],
      properties: {
        ma_lankham: { bsonType: "string", description: "Mã số lần khám - bắt buộc và phải là chuỗi" },
        ma_benhnhan: { bsonType: "string", description: "Mã số bệnh nhân - bắt buộc và phải là chuỗi" },
        ma_bacsi: { bsonType: "string", description: "Mã số bác sĩ - bắt buộc và phải là chuỗi" },
        ngay_vao: { bsonType: "date", description: "Ngày vào viện - bắt buộc và phải là kiểu ngày tháng" },
        ngay_ra: { bsonType: "date", description: "Ngày ra viện - bắt buộc và phải là kiểu ngày tháng" },
        chan_doan: { bsonType: "string", description: "Chẩn đoán bệnh - bắt buộc và phải là chuỗi" },
        tong_tien: { bsonType: "int", description: "Tổng số tiền khám/chữa bệnh - bắt buộc và phải là số nguyên" }
      }
    }
  }
});

db.createCollection("medicines", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ma_thuoc", "ten_thuoc", "don_vi", "gia_thuoc"],
      properties: {
        ma_thuoc: { bsonType: "string", description: "Mã số thuốc - bắt buộc và phải là chuỗi" },
        ten_thuoc: { bsonType: "string", description: "Tên thuốc - bắt buộc và phải là chuỗi" },
        don_vi: { bsonType: "string", description: "Đơn vị - bắt buộc và phải là chuỗi" },
        gia_thuoc: { bsonType: "int", description: "Giá tiền - bắt buộc và phải là số nguyên" }
      }
    }
  }
});

db.createCollection("prescriptions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ma_donthuoc", "ma_lankham", "ma_thuoc", "so_luong", "thanh_tien", "huong_dan"],
      properties: {
        ma_donthuoc: { bsonType: "string", description: "Mã đơn thuốc - bắt buộc và phải là chuỗi" },
        ma_lankham: { bsonType: "string", description: "Mã số lần khám - bắt buộc và phải là chuỗi" },
        ma_thuoc: { bsonType: "string", description: "Mã số thuốc - bắt buộc và phải là chuỗi" },
        so_luong: { bsonType: "int", description: "Số lượng - bắt buộc và phải là số nguyên" },
        thanh_tien: { bsonType: "int", description: "Tổng chi phí thuốc - bắt buộc và phải là số nguyên" },
        huong_dan: { bsonType: "string", description: "Hướng dẫn sử dụng - bắt buộc và phải là chuỗi" }
      }
    }
  }
});

db.createCollection("nurseAssignments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ma_phancong", "ma_yta", "ma_lankham", "nhiem_vu"],
      properties: {
        ma_phancong: { bsonType: "string", description: "Mã phân công - bắt buộc và phải là chuỗi" },
        ma_yta: { bsonType: "string", description: "Mã số y tá - bắt buộc và phải là chuỗi" },
        ma_lankham: { bsonType: "string", description: "Mã số lần khám - bắt buộc và phải là chuỗi" },
        nhiem_vu: { bsonType: "string", description: "Nhiệm vụ - bắt buộc và phải là chuỗi" }
      }
    }
  }
});

// Tạo các chỉ mục cho các collection
db.doctors.createIndex({ "ma_bacsi": 1 }, { unique: true });
db.doctors.createIndex({ "so_cmt": 1 }, { unique: true });

db.nurses.createIndex({ "ma_yta": 1 }, { unique: true });
db.nurses.createIndex({ "so_cmt": 1 }, { unique: true });

db.patients.createIndex({ "ma_benhnhan": 1 }, { unique: true });
db.patients.createIndex({ "so_cmt": 1 }, { unique: true });

db.visits.createIndex({ "ma_lankham": 1 }, { unique: true });
db.visits.createIndex({ "ma_benhnhan": 1 });
db.visits.createIndex({ "ma_bacsi": 1 });

db.medicines.createIndex({ "ma_thuoc": 1 }, { unique: true });

db.prescriptions.createIndex({ "ma_donthuoc": 1 }, { unique: true });
db.prescriptions.createIndex({ "ma_lankham": 1 });
db.prescriptions.createIndex({ "ma_thuoc": 1 });

db.nurseAssignments.createIndex({ "ma_phancong": 1 }, { unique: true });
db.nurseAssignments.createIndex({ "ma_yta": 1 });
db.nurseAssignments.createIndex({ "ma_lankham": 1 });

// Chèn dữ liệu mẫu
// Chèn dữ liệu mẫu bác sĩ
db.doctors.insertMany([
  {
    ma_bacsi: "BS001",
    so_cmt: "001234567",
    ho_ten: "Nguyễn Văn Anh",
    ngay_sinh: new Date("1975-05-15"),
    dia_chi: "123 Lạch Tray, Quận Ngô Quyền, Hải Phòng",
    bac_nghe: "Bác sĩ chuyên khoa II",
    tham_nien: 20,
    trinh_do: "Tiến sĩ Y khoa",
    chuyen_mon: "Tim mạch",
  },
  {
    ma_bacsi: "BS002",
    so_cmt: "002345678",
    ho_ten: "Trần Thị Bình",
    ngay_sinh: new Date("1980-10-20"),
    dia_chi: "456 Trần Phú, Quận Ba Đình, Hà Nội",
    bac_nghe: "Bác sĩ chuyên khoa I",
    tham_nien: 15,
    trinh_do: "Thạc sĩ Y khoa",
    chuyen_mon: "Nhi khoa",
  },
  {
    ma_bacsi: "BS003",
    so_cmt: "003456789",
    ho_ten: "Lê Văn Cường",
    ngay_sinh: new Date("1985-12-10"),
    dia_chi: "789 Lê Thánh Tông, Thành phố Hạ Long, Quảng Ninh",
    bac_nghe: "Bác sĩ đa khoa",
    tham_nien: 10,
    trinh_do: "Bác sĩ Y khoa",
    chuyen_mon: "Nội tổng quát",
  },
  {
    ma_bacsi: "BS004",
    so_cmt: "004567890",
    ho_ten: "Phạm Thị Diệu",
    ngay_sinh: new Date("1978-08-25"),
    dia_chi: "101 Lý Thái Tổ, Quận Hoàn Kiếm, Hà Nội",
    bac_nghe: "Bác sĩ chuyên khoa II",
    tham_nien: 18,
    trinh_do: "Tiến sĩ Y khoa",
    chuyen_mon: "Da liễu",
  },
  {
    ma_bacsi: "BS005",
    so_cmt: "005678901",
    ho_ten: "Võ Văn Đức",
    ngay_sinh: new Date("1982-04-30"),
    dia_chi: "202 Quang Trung, Thành phố Nam Định, Nam Định",
    bac_nghe: "Bác sĩ chuyên khoa I",
    tham_nien: 13,
    trinh_do: "Thạc sĩ Y khoa",
    chuyen_mon: "Tai mũi họng",
  }
]);

// Chèn dữ liệu mẫu y tá
db.nurses.insertMany([
  {
    ma_yta: "YT001",
    so_cmt: "101234567",
    ho_ten: "Nguyễn Thị Phương",
    ngay_sinh: new Date("1990-01-15"),
    dia_chi: "111 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
    so_dien_thoai: "0971234567",
    trinh_do: "Điều dưỡng đại học",
    tham_nien: 7
  },
  {
    ma_yta: "YT002",
    so_cmt: "102345678",
    ho_ten: "Trần Văn Giang",
    ngay_sinh: new Date("1992-05-20"),
    dia_chi: "222 Hùng Vương, Thành phố Việt Trì, Phú Thọ",
    so_dien_thoai: "0972345678",
    trinh_do: "Điều dưỡng cao đẳng",
    tham_nien: 5
  },
  {
    ma_yta: "YT003",
    so_cmt: "103456789",
    ho_ten: "Lê Thị Hương",
    ngay_sinh: new Date("1988-11-25"),
    dia_chi: "333 Lê Lợi, Thành phố Thái Bình, Thái Bình",
    so_dien_thoai: "0973456789",
    trinh_do: "Điều dưỡng trung cấp",
    tham_nien: 9
  },
  {
    ma_yta: "YT004",
    so_cmt: "104567890",
    ho_ten: "Phạm Văn Hùng",
    ngay_sinh: new Date("1993-07-10"),
    dia_chi: "444 Trần Hưng Đạo, Thành phố Bắc Ninh, Bắc Ninh",
    so_dien_thoai: "0974567890",
    trinh_do: "Điều dưỡng đại học",
    tham_nien: 4
  },
  {
    ma_yta: "YT005",
    so_cmt: "105678901",
    ho_ten: "Võ Thị Khánh",
    ngay_sinh: new Date("1991-03-05"),
    dia_chi: "555 Hai Bà Trưng, Quận Hai Bà Trưng, Hà Nội",
    so_dien_thoai: "0975678901",
    trinh_do: "Điều dưỡng cao đẳng",
    tham_nien: 6
  }
]);

// Chèn dữ liệu mẫu bệnh nhân
db.patients.insertMany([
  {
    ma_benhnhan: "BN001",
    so_cmt: "201234567",
    ho_ten: "Nguyễn Văn Lâm",
    ngay_sinh: new Date("1970-06-10"),
    dia_chi: "11 Nguyễn Văn Cừ, Quận Long Biên, Hà Nội",
    so_dien_thoai: "0981234567"
  },
  {
    ma_benhnhan: "BN002",
    so_cmt: "202345678",
    ho_ten: "Trần Thị Mai",
    ngay_sinh: new Date("1985-09-15"),
    dia_chi: "22 Kim Mã, Quận Ba Đình, Hà Nội",
    so_dien_thoai: "0982345678"
  },
  {
    ma_benhnhan: "BN003",
    so_cmt: "203456789",
    ho_ten: "Lê Văn Nam",
    ngay_sinh: new Date("1965-12-20"),
    dia_chi: "33 Bạch Đằng, Quận Hồng Bàng, Hải Phòng",
    so_dien_thoai: "0983456789"
  },
  {
    ma_benhnhan: "BN004",
    so_cmt: "204567890",
    ho_ten: "Phạm Thị Oanh",
    ngay_sinh: new Date("1995-03-25"),
    dia_chi: "44 Trần Nhân Tông, Thành phố Bắc Giang, Bắc Giang",
    so_dien_thoai: "0984567890"
  },
  {
    ma_benhnhan: "BN005",
    so_cmt: "205678901",
    ho_ten: "Võ Văn Phong",
    ngay_sinh: new Date("1980-07-30"),
    dia_chi: "55 Nguyễn Chí Thanh, Quận Đống Đa, Hà Nội",
    so_dien_thoai: "0985678901"
  }
]);

// Chèn dữ liệu mẫu thuốc
db.medicines.insertMany([
  {
    ma_thuoc: "TH001",
    ten_thuoc: "Paracetamol",
    don_vi: "Viên",
    gia_thuoc: 2000
  },
  {
    ma_thuoc: "TH002",
    ten_thuoc: "Amoxicillin",
    don_vi: "Viên",
    gia_thuoc: 5000
  },
  {
    ma_thuoc: "TH003",
    ten_thuoc: "Omeprazole",
    don_vi: "Viên",
    gia_thuoc: 7000
  },
  {
    ma_thuoc: "TH004",
    ten_thuoc: "Cetirizine",
    don_vi: "Viên",
    gia_thuoc: 3000
  },
  {
    ma_thuoc: "TH005",
    ten_thuoc: "Salbutamol",
    don_vi: "Ống xịt",
    gia_thuoc: 150000
  },
  {
    ma_thuoc: "TH006",
    ten_thuoc: "Vitamin C",
    don_vi: "Viên",
    gia_thuoc: 1000
  },
  {
    ma_thuoc: "TH007",
    ten_thuoc: "Losartan",
    don_vi: "Viên",
    gia_thuoc: 10000
  },
  {
    ma_thuoc: "TH008",
    ten_thuoc: "Metformin",
    don_vi: "Viên",
    gia_thuoc: 6000
  },
  {
    ma_thuoc: "TH009",
    ten_thuoc: "Atorvastatin",
    don_vi: "Viên",
    gia_thuoc: 15000
  },
  {
    ma_thuoc: "TH010",
    ten_thuoc: "Insulin",
    don_vi: "Ống tiêm",
    gia_thuoc: 200000
  }
]);

// Chèn dữ liệu mẫu lần khám
db.visits.insertMany([
  {
    ma_lankham: "LK001",
    ma_benhnhan: "BN001",
    ma_bacsi: "BS001",
    ngay_vao: new Date("2025-01-10"),
    ngay_ra: new Date("2025-01-15"),
    chan_doan: "Rối loạn nhịp tim",
    tong_tien: 2500000
  },
  {
    ma_lankham: "LK002",
    ma_benhnhan: "BN002",
    ma_bacsi: "BS002",
    ngay_vao: new Date("2025-02-05"),
    ngay_ra: new Date("2025-02-07"),
    chan_doan: "Viêm phổi",
    tong_tien: 1800000
  },
  {
    ma_lankham: "LK003",
    ma_benhnhan: "BN003",
    ma_bacsi: "BS003",
    ngay_vao: new Date("2025-02-15"),
    ngay_ra: new Date("2025-02-18"),
    chan_doan: "Viêm dạ dày",
    tong_tien: 1200000
  },
  {
    ma_lankham: "LK004",
    ma_benhnhan: "BN004",
    ma_bacsi: "BS004",
    ngay_vao: new Date("2025-03-01"),
    ngay_ra: new Date("2025-03-02"),
    chan_doan: "Dị ứng da",
    tong_tien: 800000
  },
  {
    ma_lankham: "LK005",
    ma_benhnhan: "BN005",
    ma_bacsi: "BS005",
    ngay_vao: new Date("2025-03-10"),
    ngay_ra: new Date("2025-03-12"),
    chan_doan: "Viêm xoang",
    tong_tien: 1000000
  },
  {
    ma_lankham: "LK006",
    ma_benhnhan: "BN001",
    ma_bacsi: "BS001",
    ngay_vao: new Date("2025-03-20"),
    ngay_ra: new Date("2025-03-25"),
    chan_doan: "Cao huyết áp",
    tong_tien: 2000000
  },
  {
    ma_lankham: "LK007",
    ma_benhnhan: "BN003",
    ma_bacsi: "BS003",
    ngay_vao: new Date("2025-04-05"),
    ngay_ra: new Date("2025-04-10"),
    chan_doan: "Tiểu đường",
    tong_tien: 3000000
  }
]);

// Chèn dữ liệu mẫu đơn thuốc
db.prescriptions.insertMany([
  {
    ma_donthuoc: "DT001",
    ma_lankham: "LK001",
    ma_thuoc: "TH007",
    so_luong: 30,
    thanh_tien: 300000,
    huong_dan: "Uống 1 viên/ngày sau bữa sáng"
  },
  {
    ma_donthuoc: "DT002",
    ma_lankham: "LK001",
    ma_thuoc: "TH009",
    so_luong: 30,
    thanh_tien: 450000,
    huong_dan: "Uống 1 viên/ngày sau bữa tối"
  },
  {
    ma_donthuoc: "DT003",
    ma_lankham: "LK002",
    ma_thuoc: "TH002",
    so_luong: 21,
    thanh_tien: 105000,
    huong_dan: "Uống 1 viên x 3 lần/ngày sau bữa ăn"
  },
  {
    ma_donthuoc: "DT004",
    ma_lankham: "LK002",
    ma_thuoc: "TH001",
    so_luong: 10,
    thanh_tien: 20000,
    huong_dan: "Uống 1 viên khi sốt trên 38.5°C"
  },
  {
    ma_donthuoc: "DT005",
    ma_lankham: "LK003",
    ma_thuoc: "TH003",
    so_luong: 30,
    thanh_tien: 210000,
    huong_dan: "Uống 1 viên/ngày trước bữa sáng"
  },
  {
    ma_donthuoc: "DT006",
    ma_lankham: "LK004",
    ma_thuoc: "TH004",
    so_luong: 10,
    thanh_tien: 30000,
    huong_dan: "Uống 1 viên/ngày khi có triệu chứng"
  },
  {
    ma_donthuoc: "DT007",
    ma_lankham: "LK005",
    ma_thuoc: "TH002",
    so_luong: 14,
    thanh_tien: 70000,
    huong_dan: "Uống 1 viên x 2 lần/ngày sau bữa ăn"
  },
  {
    ma_donthuoc: "DT008",
    ma_lankham: "LK006",
    ma_thuoc: "TH007",
    so_luong: 30,
    thanh_tien: 300000,
    huong_dan: "Uống 1 viên/ngày sau bữa sáng"
  },
  {
    ma_donthuoc: "DT009",
    ma_lankham: "LK007",
    ma_thuoc: "TH008",
    so_luong: 60,
    thanh_tien: 360000,
    huong_dan: "Uống 1 viên x 2 lần/ngày sau bữa ăn"
  },
  {
    ma_donthuoc: "DT010",
    ma_lankham: "LK007",
    ma_thuoc: "TH010",
    so_luong: 10,
    thanh_tien: 2000000,
    huong_dan: "Tiêm 1 lần/ngày theo chỉ định"
  }
]);

// Chèn dữ liệu mẫu phân công y tá
db.nurseAssignments.insertMany([
  {
    ma_phancong: "PC001",
    ma_yta: "YT001",
    ma_lankham: "LK001",
    nhiem_vu: "Tiếp đón, theo dõi huyết áp"
  },
  {
    ma_phancong: "PC002",
    ma_yta: "YT002",
    ma_lankham: "LK001",
    nhiem_vu: "Cấp thuốc, hướng dẫn sử dụng"
  },
  {
    ma_phancong: "PC003",
    ma_yta: "YT003",
    ma_lankham: "LK002",
    nhiem_vu: "Tiếp đón, tiêm thuốc"
  },
  {
    ma_phancong: "PC004",
    ma_yta: "YT004",
    ma_lankham: "LK003",
    nhiem_vu: "Theo dõi tình trạng bệnh nhân"
  },
  {
    ma_phancong: "PC005",
    ma_yta: "YT005",
    ma_lankham: "LK004",
    nhiem_vu: "Cấp thuốc, hướng dẫn bôi thuốc"
  },
  {
    ma_phancong: "PC006",
    ma_yta: "YT001",
    ma_lankham: "LK005",
    nhiem_vu: "Tiếp đón, theo dõi sau xịt thuốc"
  },
  {
    ma_phancong: "PC007",
    ma_yta: "YT002",
    ma_lankham: "LK006",
    nhiem_vu: "Theo dõi huyết áp định kỳ"
  },
  {
    ma_phancong: "PC008",
    ma_yta: "YT003",
    ma_lankham: "LK007",
    nhiem_vu: "Hướng dẫn sử dụng insulin"
  },
  {
    ma_phancong: "PC009",
    ma_yta: "YT004",
    ma_lankham: "LK007",
    nhiem_vu: "Theo dõi đường huyết"
  }
]);

print("Khởi tạo cơ sở dữ liệu thành công!");