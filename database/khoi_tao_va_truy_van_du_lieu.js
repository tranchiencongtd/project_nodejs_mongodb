/*
  Script khởi tạo cơ sở dữ liệu cho phòng khám
*/

/*
  Script truy vấn cơ sở dữ liệu cho phòng khám bắt đầu từ line 600
*/

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

// ************************************************************************************************************
// ************************************************************************************************************
// ************************************************************************************************************
/*
  Script Truy vấn Cơ sở dữ liệu Phòng khám
*/

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
