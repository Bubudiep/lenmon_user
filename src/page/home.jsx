import React from "react";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="home-page">
      <div className="top-container">
        <div className="app-container">
          <div className="logo">
            <div className="img">
              <img src={logo} />
            </div>
          </div>
          <div className="info">
            <div className="name">Lên món</div>
            <div className="sologan">Nhanh hơn - gọn hơn - tiện lợi hơn</div>
            <div className="description">Đặt hàng và quản lý đơn hàng</div>
            <div className="author">HiTech co.</div>
          </div>
        </div>
      </div>
      <div className="body-container">
        <div className="sologan">"Nhanh tay gọi món, tiết kiệm thời gian!"</div>
        <div className="description">
          <div className="items">
            <div className="count">1</div>
            <div className="info">
              <div className="title">Nhanh chóng và tiện lợi</div>
              <div className="content">
                Với "Lên món", chỉ cần vài thao tác đơn giản, khách hàng có thể
                dễ dàng chọn món, đặt hàng và tận hưởng bữa ăn ngon miệng mà
                không cần phải chờ đợi.
              </div>
            </div>
          </div>
          <div className="items">
            <div className="count">2</div>
            <div className="info">
              <div className="title">Trải nghiệm mượt mà</div>
              <div className="content">
                Giao diện thân thiện, tốc độ xử lý nhanh, và tích hợp trực tiếp
                với các nhà hàng yêu thích của bạn.
              </div>
            </div>
          </div>
          <div className="items">
            <div className="count">3</div>
            <div className="info">
              <div className="title">Dành cho mọi đối tượng</div>
              <div className="content">
                Phù hợp cho khách hàng cá nhân, nhóm bạn hoặc doanh nghiệp cần
                giải pháp order hiệu quả và chính xác.
              </div>
            </div>
          </div>
          <div className="items">
            <div className="count">4</div>
            <div className="info">
              <div className="title">Tiết kiệm thời gian</div>
              <div className="content">
                "Lên món" mang đến giải pháp tối ưu để bạn dành nhiều thời gian
                hơn cho những điều quan trọng.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
