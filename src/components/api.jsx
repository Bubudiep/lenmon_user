import axios from "axios";
const api = axios.create({
  // baseURL: "http://" + location.hostname + ":5005/api", // URL cơ sở cho các yêu cầu
  baseURL: "https://ipays.vn/api", // URL cơ sở cho các yêu cầu
});

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
// Xuất các phương thức
export default {
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
  delete: deleteRequest,
  random: random,
};
