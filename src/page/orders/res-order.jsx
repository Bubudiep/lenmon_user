import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Login_popup from "../loginPopup";
import api from "../../components/api";
import Cookies from "js-cookie";
import logo from "../../assets/logo.png";
import Restaurant_cart from "../restaurant/res-cart";
import Restaurant_pupup from "../restaurant/res-popup";
import Restaurant_menu from "../restaurant/res-menu";
import Restaurant_user_order from "../restaurant/res-order";
import Restaurant_paid from "../restaurant/res-paid";

const Restaurant_order = () => {
  const { id } = useParams();
  const [restData, setRestData] = useState(false);
  const [user, setUser] = useState(false);
  const [token, settoken] = useState(Cookies.get("accessToken") ?? false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [tabActive, setTabActive] = useState("menus");
  const [showCart, setShowCart] = useState(false);
  const [itemQTY, setItemQTY] = useState([]);
  const [showPopup, setshowPopup] = useState(false);
  const [thanhtoan, setThanhtoan] = useState(false);
  const [popUpview, setPopUpview] = useState(
    <div className="bg-full center">
      <div className="detectOut"></div>
      <div className="whiteBox">
        <div className="icon">
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <div className="message">Đặt hàng thành công!</div>
        <div
          className="button"
          onClick={() => {
            setTabActive("my_order");
            setshowPopup(false);
          }}
        >
          Danh sách đơn hàng
        </div>
      </div>
    </div>
  );
  const fetchRestaurantData = async (restaurantId, accessToken) => {
    setLoading(true);
    await api
      .get(`/restaurant-view/${restaurantId}/?from=false`, accessToken)
      .then((res) => {
        setRestData(res);
        setShowLogin(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLogin(true);
      })
      .finally(() => {
        console.log("Load nhà hàng");
        setIsShow(true);
        setTimeout(() => {
          setLoading(false);
        }, 400); // Thêm hiệu ứng hiển thị
      });
  };
  const setoderSuccess = (e) => {
    if (e.data) {
      setRestData((old) => {
        const myOrder = old?.myOrder || [];
        const existingIndex = myOrder.findIndex(
          (item) => item.id === e.data.id
        );
        if (existingIndex !== -1) {
          myOrder[existingIndex] = e.data;
          return {
            ...old,
            myOrder: [...myOrder], // Tạo mảng mới để React nhận biết thay đổi
          };
        } else {
          return {
            ...old,
            myOrder: [e.data, ...myOrder],
          };
        }
      });
      setTabActive("my_order");
      setItemQTY([]);
    }
  };
  const handleAddItem = (e) => {
    if (e?.id) {
      setItemQTY((old) => {
        const exists = old.some((item) => item.id === e.id);
        if (!exists) {
          return [...old, e]; // Thêm vào nếu chưa tồn tại
        }
        return old; // Giữ nguyên nếu đã tồn tại
      });
    }
  };
  const handleRemoveItem = (e) => {
    if (e?.id) {
      setItemQTY((old) => old.filter((item) => item.id !== e.id));
    }
  };
  useEffect(() => {
    if (user.app) {
      if (user.app.access_token) {
        fetchRestaurantData(id, user.app.access_token);
        // const newSocket = io("http://" + location.hostname + ":3009", {
        //   transports: ["websocket"],
        //   auth: {
        //     token: token,
        //   },
        // });
        const newSocket = io("https://ipays.vn", {
          path: "/socket.io",
          transports: ["websocket"],
          auth: {
            token: token,
          },
        });
        newSocket.on("connect", () => {
          console.log("connected!");
          newSocket.on("message", (data) => {
            console.log("Received message:", data);
            if (data.data.type == "order") {
              setRestData((old) => ({
                ...old,
                myOrder: old.myOrder
                  ? old.myOrder?.map((item) =>
                      item.id === data.data.data.id
                        ? { ...item, ...data.data.data }
                        : item
                    )
                  : [data.data.data],
              }));
              if (data.data.action == "COMPLETE") {
                setshowPopup(true);
                setPopUpview(
                  <div className="bg-full center">
                    <div
                      className="detectOut"
                      onClick={() => {
                        setshowPopup(false);
                      }}
                    ></div>
                    <div className="whiteBox">
                      <div className="icon">
                        <i className="fa-solid fa-mug-hot"></i>
                      </div>
                      <div className="message">Đã thanh toán!</div>
                      <div
                        className="button"
                        onClick={() => {
                          setTabActive("my_order");
                          setshowPopup(false);
                        }}
                      >
                        Cảm ơn bạn rấc nhìu!
                      </div>
                    </div>
                  </div>
                );
              }
              if (data.data.action == "DELIVERED") {
                setshowPopup(true);
                setPopUpview(
                  <div className="bg-full center">
                    <div
                      className="detectOut"
                      onClick={() => {
                        setshowPopup(false);
                      }}
                    ></div>
                    <div className="whiteBox">
                      <div className="icon">
                        <i className="fa-solid fa-truck-fast"></i>
                      </div>
                      <div className="message">Đơn hàng đã được giao!</div>
                      <div
                        className="button"
                        onClick={() => {
                          setTabActive("my_order");
                          setshowPopup(false);
                        }}
                      >
                        Danh sách đơn hàng
                      </div>
                    </div>
                  </div>
                );
              }
              if (data.data.action == "RECEIVED") {
                setshowPopup(true);
                setPopUpview(
                  <div className="bg-full center">
                    <div
                      className="detectOut"
                      onClick={() => {
                        setshowPopup(false);
                      }}
                    ></div>
                    <div className="whiteBox">
                      <div className="icon">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                      <div className="message">Đặt hàng thành công!</div>
                      <div
                        className="button"
                        onClick={() => {
                          setTabActive("my_order");
                          setshowPopup(false);
                        }}
                      >
                        Danh sách đơn hàng
                      </div>
                    </div>
                  </div>
                );
              }
              if (data.data.action == "join") {
                setshowPopup(true);
                setPopUpview(
                  <div className="bg-full center">
                    <div
                      className="detectOut"
                      onClick={() => {
                        setshowPopup(false);
                      }}
                    ></div>
                    <div className="whiteBox">
                      <div className="icon">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                      <div className="message">Có người thêm hàng vào giỏ!</div>
                      <div
                        className="button"
                        onClick={() => {
                          setTabActive("my_order");
                          setshowPopup(false);
                        }}
                      >
                        Danh sách đơn hàng
                      </div>
                    </div>
                  </div>
                );
              }
            }
          });
          newSocket.on("private_event", (data) => {
            console.log("Received message:", data);
          });
        });
        newSocket.on("disconnect", () => {
          console.log("Disconnected to socket server on port 3009");
        });
        return () => {
          newSocket.disconnect();
        };
      } else {
        setShowLogin(true);
        setLoading(false);
      }
    } else {
      if (token) {
        api
          .post("/token-check/", {}, token)
          .then((res) => {
            const { access_token, refresh_token, expires_in, token_type } = res;
            Cookies.set("accessToken", access_token, {
              expires: expires_in / 86400,
            });
            setUser((old) => ({ ...old, app: res }));
          })
          .catch((err) => {
            setShowLogin(true);
          })
          .finally(() => {});
      } else {
        fetchRestaurantData(id, false);
        setShowLogin(true);
      }
    }
  }, [user, token]);
  return (
    <>
      {loading && (
        <div className={`full-load ${isShow ? "fadeOut" : ""}`}>
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="loading-spinner" />
        </div>
      )}
      {showLogin && (
        <Login_popup
          onClose={() => setShowLogin(false)}
          setUser={setUser}
          settoken={settoken}
        />
      )}
      {isShow && (
        <>
          <div className="restaurant-landing">
            {showPopup && popUpview}
            <Restaurant_pupup
              itemQTY={itemQTY}
              showCart={() => {
                setShowCart(true);
              }}
            />
            {thanhtoan && (
              <Restaurant_paid
                token={token}
                restData={restData}
                setRestData={setRestData}
                order={thanhtoan}
                onClose={() => {
                  setThanhtoan(false);
                }}
              />
            )}
            {showCart && (
              <Restaurant_cart
                itemQTY={itemQTY}
                restData={restData}
                token={token}
                setShowLogin={setShowLogin}
                setoderSuccess={setoderSuccess}
                setshowPopup={setshowPopup}
                setPopUpview={setPopUpview}
                removeItem={handleRemoveItem}
                user={user}
                setUser={setUser}
                settoken={settoken}
                onClose={() => {
                  setShowCart(false);
                }}
              />
            )}
            <div className="can-scroll">
              <div
                className="top-container"
                style={{
                  backgroundImage: 'url("' + restData?.wallpaper + '")',
                }}
              >
                <div className="top">
                  <div className="avatar">
                    <div className="img">
                      <img
                        src={restData.avatar || logo}
                        alt="Restaurant Avatar"
                      />
                    </div>
                  </div>
                  <div className="info">
                    <div className="name">{restData.name}</div>
                    <div className="mohinh">
                      <div className="items">{restData.phone_number}</div>
                      <div className="items">{restData.mohinh}</div>
                    </div>
                    <div className="address">{restData.address}</div>
                  </div>
                </div>
                <div className="rest-sort">
                  <div className="items">
                    <div className="icon">0</div>
                    <div className="value">Đánh giá</div>
                  </div>
                  <div className="items">
                    <div className="icon">
                      {restData?.menu?.length > 0
                        ? restData.menu[0].items.length
                        : 0}
                    </div>
                    <div className="value">Sản phẩm</div>
                  </div>
                  <div className="items">
                    <div className="icon">{restData?.totalFollow ?? 0}</div>
                    <div className="value">Theo dõi</div>
                  </div>
                  <div className="items">
                    <div className="icon">{restData?.totalLike ?? 0}</div>
                    <div className="value">Yêu thích</div>
                  </div>
                </div>
              </div>
              <div className="body-container">
                <div className="tabs">
                  <div className="items">
                    <div
                      className={`button ${
                        tabActive === "my_order" ? "active" : ""
                      }`}
                      onClick={() => {
                        if (token) {
                          setTabActive("my_order");
                        } else {
                          setShowLogin(true);
                        }
                      }}
                    >
                      Đơn của tôi{" "}
                      {restData?.myOrder?.filter((order) =>
                        [
                          "DELIVERED",
                          "CREATED",
                          "RECEIVED",
                          "SHIPPING",
                        ].includes(order.status)
                      ).length > 0 && (
                        <div className="count">
                          {
                            restData?.myOrder?.filter((order) =>
                              [
                                "DELIVERED",
                                "CREATED",
                                "RECEIVED",
                                "SHIPPING",
                              ].includes(order.status)
                            ).length
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="items">
                    <div
                      className={`button ${
                        tabActive === "menus" ? "active" : ""
                      }`}
                      onClick={() => setTabActive("menus")}
                    >
                      Thực đơn{" "}
                      {itemQTY.length > 0 && (
                        <div className="count">{itemQTY.length}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="rest-details">
                  {tabActive === "menus" && restData.menu && (
                    <Restaurant_menu
                      token={token}
                      setShowLogin={setShowLogin}
                      itemQTY={itemQTY}
                      setItemQTY={setItemQTY}
                      restData={restData}
                      addItem={handleAddItem}
                      removeItem={handleRemoveItem}
                      addSave={(e) => {
                        handleAddItem(e);
                        setShowCart(true);
                      }}
                    />
                  )}
                  {tabActive === "my_order" && restData.myOrder && (
                    <Restaurant_user_order
                      setThanhtoan={setThanhtoan}
                      restData={restData}
                      token={token}
                      setTabActive={setTabActive}
                      setRestData={setRestData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Restaurant_order;
