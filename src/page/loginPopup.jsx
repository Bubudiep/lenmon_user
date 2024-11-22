import React, { useRef, useState } from "react";
import BottomPopup from "./bottomPopup";
import api from "../components/api";
import Cookies from "js-cookie";

const Login_popup = ({ onClose, setUser, settoken }) => {
  const popupRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormdata] = useState({
    name: Cookies.get("lenmon_user") || "",
    phone: Cookies.get("lenmon_phone") || "",
  });
  const handleSendClose = () => {
    console.log("Popup is closing, do something here.");
  };
  const handleStart = () => {
    console.log(formData);
    setLoading(true);
    api
      .post("/lenmon-register/", {
        email: formData.phone + "@guest.com",
        username: formData.phone,
        password: formData.phone,
        zalo_name: formData.name,
        zalo_phone: formData.phone,
      })
      .then((res) => {
        const { access_token, refresh_token, expires_in, token_type } = res;
        settoken(access_token);
        Cookies.set("lenmon_user", formData.name);
        Cookies.set("lenmon_phone", formData.phone);
        Cookies.set("accessToken", access_token, {
          expires: expires_in / 86400,
        });
        setUser((old) => ({ ...old, app: res }));
        console.log("Đăng nhập thành công!");
      })
      .catch((err) => {
        if (Object.keys(err?.response?.data).includes("username")) {
          alert("Tên bạn nhập không chính xác!");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <BottomPopup ref={popupRef} title="ĐĂNG NHẬP" onClose={onClose}>
      <div className="login-box">
        <div className="login-message">
          Để nâng cao trải nghiệm và bảo mật người dùng, chúng tôi cần một vài
          thông tin.
        </div>
        <div className="login-items">
          <div className="items">
            <div className="index">1</div>
            <div className="value">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormdata((old) => ({ ...old, name: e.target.value }));
                }}
                placeholder="Tên tài khoản..."
              />
            </div>
          </div>
          <div className="items">
            <div className="index">2</div>
            <div className="value">
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => {
                  setFormdata((old) => ({ ...old, phone: e.target.value }));
                }}
                placeholder="Số điện thoại..."
              />
            </div>
          </div>
        </div>
        <div className="bottom-box">
          <button onClick={handleStart}>
            {loading && <div className="loading-spinner" />}ĐĂNG NHẬP
          </button>
        </div>
      </div>
    </BottomPopup>
  );
};

export default Login_popup;
