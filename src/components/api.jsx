import axios from "axios";
const api = axios.create({
  // baseURL: "http://" + location.hostname + ":5005/api", // URL cơ sở cho các yêu cầu
  baseURL: "https://ipays.vn/api", // URL cơ sở cho các yêu cầu
});
class VietQR {
  constructor() {
    this.payloadFormatIndicator = "000201";
    this.pointOfInitiationMethod = "010212";
    this.consumerAccountInformation = "";
    this.guid = "0010A000000727";
    this.serviceCode = "0208QRIBFTTA";
    this.transactionCurrency = "5303704";
    this.transactionAmount = "";
    this.countryCode = "5802VN";
    this.additionalDataFieldTemplate = "";
    this.crc = "";
  }

  convertLength(str) {
    const num = parseInt(str);
    return num < 10 ? `0${num}` : num;
  }

  setTransactionAmount(money) {
    const length = this.convertLength(`${money}`.length);
    this.transactionAmount = `54${length}${money}`;
    return this;
  }

  setBeneficiaryOrganization(acquierID, consumerID) {
    const acquierLength = this.convertLength(acquierID.length);
    const acquier = `00${acquierLength}${acquierID}`;
    const consumerLength = this.convertLength(consumerID.length);
    const consumer = `01${consumerLength}${consumerID}`;
    const beneficiaryOrganizationLength = this.convertLength(
      `${acquier}${consumer}`.length
    );

    const consumerAccountInformationLength = this.convertLength(
      beneficiaryOrganizationLength + 30
    );
    this.consumerAccountInformation = `38${consumerAccountInformationLength}${this.guid}01${beneficiaryOrganizationLength}${acquier}${consumer}0208QRIBFTTA`;
    return this;
  }

  setAdditionalDataFieldTemplate(content) {
    const contentLength = this.convertLength(content.length);
    const additionalDataFieldTemplateLength = this.convertLength(
      content.length + 4
    );
    this.additionalDataFieldTemplate = `62${additionalDataFieldTemplateLength}08${contentLength}${content}`;
    return this;
  }

  calcCRC(str) {
    const crcTable = [
      0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108,
      0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210,
      0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b,
      0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401,
      0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee,
      0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6,
      0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d,
      0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
      0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5,
      0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc,
      0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4,
      0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd,
      0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13,
      0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a,
      0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e,
      0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
      0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1,
      0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb,
      0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0,
      0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8,
      0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657,
      0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9,
      0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882,
      0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
      0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e,
      0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07,
      0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d,
      0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74,
      0x2e93, 0x3eb2, 0x0ed1, 0x1ef0,
    ];

    var crc = 0xffff;
    var j, i;

    for (i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c > 255) {
        throw new RangeError();
      }
      j = (c ^ (crc >> 8)) & 0xff;
      crc = crcTable[j] ^ (crc << 8);
    }

    return (crc ^ 0) & 0xffff;
  }

  build() {
    const contentQR = `${this.payloadFormatIndicator}${this.pointOfInitiationMethod}${this.consumerAccountInformation}${this.transactionCurrency}${this.transactionAmount}${this.countryCode}${this.additionalDataFieldTemplate}6304`;
    const crc = this.calcCRC(contentQR).toString(16).toUpperCase();
    return `${contentQR}${crc}`;
  }
}
// Thêm request interceptor để ghi lại thời gian bắt đầu
api.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() }; // Ghi lại thời gian bắt đầu
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm response interceptor để ghi lại thời gian kết thúc và tính toán thời gian xử lý
api.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime; // Tính thời gian xử lý
    console.log(`Request to ${response.config.url} took ${duration} ms`);
    return response;
  },
  (error) => {
    const endTime = new Date();
    const duration = endTime - error.config.metadata.startTime; // Tính thời gian xử lý
    console.error(`Request to ${error.config.url} fails took ${duration} ms`);
    return Promise.reject(error);
  }
);

// Hàm GET kèm theo token
const get = async (url, token) => {
  try {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};
// Hàm GET kèm theo token
const gets = async (url, headers) => {
  try {
    const response = await api.get(url, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

// Hàm POST kèm theo token
const post = async (url, data, token) => {
  try {
    const response = await api.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};

// Hàm PATCH kèm theo token
const patch = async (url, data, token) => {
  try {
    const response = await api.patch(url, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error patching data", error);
    throw error;
  }
};

// Hàm DELETE kèm theo token
const deleteRequest = async (url, token) => {
  try {
    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting data", error);
    throw error;
  }
};

const random = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
const banks = [
  "Vietcombank",
  "Vietinbank",
  "BIDV",
  "Agribank",
  "Techcombank",
  "MB Bank",
  "ACB",
  "Sacombank",
  "VPBank",
  "TPBank",
  "Eximbank",
  "SHB",
  "VIB",
  "LienVietPostBank",
  "SeABank",
  "OCB",
  "HSBC",
  "Standard Chartered",
  "Citibank",
  "ANZ",
  // Thêm các ngân hàng khác nếu cần
]; // Hàm lấy địa chỉ từ tọa độ
const getAddress = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const data = await gets(url, headers);
    console.log(data);
    const { city, town, village, county, state, country } = data.address;
    return {
      lat: latitude,
      long: longitude,
      city: city || town || village || "",
      county: county || "",
      state: state || "",
      country: country || "",
      display_name:
        (data.display_name.split(",").length >= 1 &&
          data.display_name.split(",")[0]) +
        ", " +
        (data.display_name.split(",").length >= 2 &&
          data.display_name.split(",")[1]) +
        ", " +
        (data.display_name.split(",").length >= 3 &&
          data.display_name.split(",")[2]),
    };
  } catch (error) {
    console.error("Error fetching address:", error);
    alert("Không thể lấy thông tin địa chỉ từ tọa độ.");
    return {};
  }
};
function resizeImage(img, maxSize) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let width = img.width;
  let height = img.height;

  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
  }
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}
function timeSinceOrder(createdAt) {
  const orderDate = new Date(createdAt); // Convert order.created_at to a Date object
  const now = new Date(); // Get the current time
  const diffMs = now - orderDate; // Difference in milliseconds

  const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Difference in minutes

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  const diffHours = Math.floor(diffMinutes / 60); // Difference in hours
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffHours / 24); // Difference in days
  return `${diffDays} ngày trước`;
}
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
const sendNotice = (title, options) => {
  if ("Notification" in window) {
    console.log(Notification.permission);
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
    if (Notification.permission === "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  }
};
function removeSpecial(str) {
  // Xóa dấu tiếng Việt
  console.log(str);
  if (str) {
    const nonAccentStr = str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Xóa ký tự đặc biệt và thay thế bằng dấu cách
    const cleanedStr = nonAccentStr?.replace(/[^a-zA-Z0-9\s]/g, "");

    // Thay thế nhiều khoảng trắng thành 1 khoảng trắng và trim
    return cleanedStr.replace(/\s+/g, " ").trim();
  } else {
    return null;
  }
}
// Xuất các phương thức
export default {
  VietQR,
  get,
  gets,
  post,
  patch,
  banks,
  sendNotice,
  debounce,
  resizeImage,
  getAddress,
  timeSinceOrder,
  removeSpecial,
  delete: deleteRequest,
  random: random,
};
