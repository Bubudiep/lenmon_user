import React, { useState, useRef, useEffect } from "react";
import BottomPopup from "../popup";
import api from "../../components/api";

const Restaurant_cart = ({
  onClose,
  itemQTY,
  restData,
  token,
  user,
  setoderSuccess,
  setshowPopup,
  setPopUpview,
  removeItem,
  setShowLogin,
}) => {
  const listRef = useRef();
  const popupRef = useRef();
  const [option, setOption] = useState(1);
  const [notes, setNotes] = useState("");
  const [firstTime, setfirstTime] = useState(true);
  const [spaceDiss, setspaceDiss] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // State to manage item quantities
  console.log(itemQTY);
  const [quantities, setQuantities] = useState(
    itemQTY.reduce((acc, item) => {
      acc[item.id] = item.quantity; // Initialize each item with a quantity of 1
      return acc;
    }, {})
  );
  const allSpaces = restData.layouts.flatMap((layout) =>
    layout.groups.flatMap((group) =>
      group.spaces.filter((space) => space.is_active && !space.is_ordering)
    )
  );
  const allGroups = restData.layouts.flatMap((layout) => layout.groups);
  const [selectedGroupId, setSelectedGroupId] = useState(
    restData?.mySpace?.group ?? allGroups.length > 0 ? allGroups[0].id : null
  );
  const selectedGroup = allGroups.find((group) => group.id === selectedGroupId);
  const spaces = selectedGroup ? selectedGroup.spaces : [];
  const [selectedSpaceId, setSelectedSpaceId] = useState(
    restData?.mySpace?.space ?? spaces.length > 0 ? spaces[0].id : null
  );
  // Xử lý khi chọn group
  const handleGroupChange = (e) => {
    const newGroupId = parseInt(e.target.value, 10);
    setSelectedGroupId(newGroupId);
    const newGroup = allGroups.find((group) => group.id === newGroupId);
    if (newGroup && newGroup.spaces.length > 0) {
      setSelectedSpaceId(newGroup.spaces[0].id);
    } else {
      setSelectedSpaceId(null);
    }
  };
  // Xử lý khi chọn space
  const handleSpaceChange = (e) => {
    setSelectedSpaceId(parseInt(e.target.value, 10));
  };
  const handleQuantityChange = (id, delta) => {
    setQuantities((prevQuantities) => {
      const newQty = prevQuantities[id] + delta;
      return newQty > 0 ? { ...prevQuantities, [id]: newQty } : prevQuantities;
    });
  };
  const handleOrderSubmit = () => {
    const orderDetails = itemQTY.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: quantities[item.id],
      price: item.price,
      total: item.price * quantities[item.id],
    }));

    const orderData = {
      items: orderDetails,
      option, // 1: Mang về, 2: Chọn bàn
      ...(option == 2 && {
        groupId: selectedGroupId,
        spaceId: selectedSpaceId,
      }),
    };
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    const thisSpace = allSpaces.filter((space) => space.id == table)[0];
    console.log(user, thisSpace);
    if (thisSpace?.is_inuse == true)
      if (thisSpace.user_use == user.app.user.profile.user) {
        api
          .post(
            `/oder-fast/`,
            {
              takeaway: option == 1,
              coupon: null,
              notes: notes,
              items: orderDetails,
              restaurant: restData.id,
              option, // 1: Mang về, 2: Chọn bàn
              ...(option == 2 && {
                groupId: selectedGroupId,
                spaceId: selectedSpaceId,
              }),
            },
            token
          )
          .then((res) => {
            console.log(res);
            setoderSuccess(res);
            setIsSuccess(true);
          })
          .catch((err) => {
            setshowPopup(true);
            setPopUpview(
              <div className="bg-full center" style={{ zIndex: 120 }}>
                <div
                  className="detectOut"
                  onClick={() => {
                    setshowPopup(false);
                  }}
                ></div>
                <div className="whiteBox">
                  <div className="icon red">
                    <i className="fa-solid fa-circle-xmark"></i>
                  </div>
                  <div className="message">
                    {err?.response?.data?.Error ?? "Lỗi kết nối mạng"}
                  </div>
                </div>
              </div>
            );
            console.log(err);
          })
          .finally(() => {});
      } else {
        setshowPopup(true);
        setPopUpview(
          <div className="bg-full center" style={{ zIndex: 120 }}>
            <div
              className="detectOut"
              onClick={() => {
                setshowPopup(false);
              }}
            ></div>
            <div className="whiteBox">
              <div className="message">
                <div className="flex">Bàn đang được người khác sử dụng</div>
                <div className="flex">1. Gửi menu cho chủ bàn order</div>
                <div className="flex">2. Gọi chủ quán</div>
              </div>
              <div className="flex tools">
                <button
                  onClick={() => {
                    setshowPopup(false);
                  }}
                >
                  Gọi chủ quán
                </button>
                <button
                  onClick={() => {
                    api
                      .post(
                        `/oder-fast/`,
                        {
                          takeaway: option == 1,
                          coupon: null,
                          notes: notes,
                          items: orderDetails,
                          restaurant: restData.id,
                          join: thisSpace.user_use,
                          option, // 1: Mang về, 2: Chọn bàn
                          ...(option == 2 && {
                            groupId: selectedGroupId,
                            spaceId: selectedSpaceId,
                          }),
                        },
                        token
                      )
                      .then((res) => {
                        console.log(res);
                        setoderSuccess(res);
                        setIsSuccess(true);
                        setshowPopup(false);
                      })
                      .catch((err) => {
                        setshowPopup(true);
                        setPopUpview(
                          <div
                            className="bg-full center"
                            style={{ zIndex: 120 }}
                          >
                            <div
                              className="detectOut"
                              onClick={() => {
                                setshowPopup(false);
                              }}
                            ></div>
                            <div className="whiteBox">
                              <div className="icon red">
                                <i className="fa-solid fa-circle-xmark"></i>
                              </div>
                              <div className="message">
                                {err?.response?.data?.Error ??
                                  "Lỗi kết nối mạng"}
                              </div>
                            </div>
                          </div>
                        );
                        console.log(err);
                      })
                      .finally(() => {});
                  }}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        );
      }
    else {
      api
        .post(
          `/oder-fast/`,
          {
            takeaway: option == 1,
            coupon: null,
            notes: notes,
            items: orderDetails,
            restaurant: restData.id,
            option, // 1: Mang về, 2: Chọn bàn
            ...(option == 2 && {
              groupId: selectedGroupId,
              spaceId: selectedSpaceId,
            }),
          },
          token
        )
        .then((res) => {
          console.log(res);
          setoderSuccess(res);
          setIsSuccess(true);
        })
        .catch((err) => {
          setshowPopup(true);
          setPopUpview(
            <div className="bg-full center" style={{ zIndex: 120 }}>
              <div
                className="detectOut"
                onClick={() => {
                  setshowPopup(false);
                }}
              ></div>
              <div className="whiteBox">
                <div className="icon red">
                  <i className="fa-solid fa-circle-xmark"></i>
                </div>
                <div className="message">
                  {err?.response?.data?.Error ?? "Lỗi kết nối mạng"}
                </div>
              </div>
            </div>
          );
          console.log(err);
        })
        .finally(() => {});
    }
  };
  const closeFast = () => {
    popupRef.current.closePopup();
  };
  const handleScroll = () => {
    const scrooler = document.querySelector(".popup-body-container");
    console.log(scrooler.scrollTop);
    if (scrooler.scrollTop > 10) {
      popupRef.current.canScroll(false);
    } else {
      popupRef.current.canScroll(true);
    }
  };
  const handleRemove = (e) => {
    if (confirm("Bỏ ra khỏi giỏ hàng?")) {
      removeItem(e);
    }
  };
  useEffect(() => {
    const currentUrl = window.location.href;
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    const thisSpace = allSpaces.filter((space) => space.id == table);
    if (restData?.mySpace?.group) {
      setOption(2);
      setspaceDiss(true);
      setfirstTime(false);
    }
    console.log(table, thisSpace);
    if (thisSpace.length > 0 && firstTime) {
      setOption(2);
      setSelectedGroupId(thisSpace[0].group);
      setSelectedSpaceId(thisSpace[0].id);
      setspaceDiss(true);
      setfirstTime(false);
    }
  });
  return (
    <BottomPopup
      ref={popupRef}
      title="Giỏ hàng"
      onClose={() => {
        onClose();
        setIsSuccess(false);
      }}
    >
      {isSuccess ? (
        <>
          <div className="success">
            <div className="icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="message">
              Đặt hàng thành công! vui lòng kiểm tra Đơn hàng của bạn trong mục
              <a>Đơn của tôi</a>
            </div>
            <div
              className="button"
              onClick={() => {
                closeFast();
                setIsSuccess(false);
              }}
            >
              Xác nhận
            </div>
          </div>
        </>
      ) : itemQTY.length > 0 ? (
        <div className="list-order-items">
          <div
            className="list-items"
            ref={listRef}
            onTouchStart={handleScroll}
            onTouchMove={handleScroll}
            onScroll={handleScroll}
            onTouchEnd={handleScroll}
          >
            {itemQTY.map((item) => (
              <div className="items" key={item.id}>
                <div className="image">
                  <div className="box">
                    <img src={item.image64_mini} alt={item.name} />
                  </div>
                </div>
                <div className="info">
                  <div className="name">{item.name}</div>
                  <div className="price">
                    Giá: {item.price.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="price">
                    Thành tiền:{" "}
                    {(item.price * quantities[item.id]).toLocaleString("vi-VN")}
                    đ
                  </div>
                </div>
                <div className="option">
                  <div
                    className="button"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </div>
                  <div className="value">
                    <input type="number" value={quantities[item.id]} readOnly />
                  </div>
                  <div
                    className="button"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </div>
                </div>
                <div className="tools">
                  <div className="button" onClick={() => handleRemove(item)}>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="details_items-tools">
            <div className="order-details">
              <div className="notes">
                <div className="text">Ghi chú</div>
                <input
                  type="text"
                  placeholder="Nhập ghi chú..."
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="order-details">
              <div className="count">Số lượng: {itemQTY.length}</div>
              <div className="total-price">
                {itemQTY
                  .reduce((sum, item) => {
                    const quantity = quantities[item.id] || 0;
                    return sum + item.price * quantity;
                  }, 0)
                  .toLocaleString("vi-VN")}
                đ
              </div>
            </div>
            <div className="optional-order">
              <div className="left">
                <div className="order-option">
                  <select
                    value={option}
                    onChange={(e) => {
                      setOption(e.target.value);
                    }}
                  >
                    <option value={1}>Mang về</option>
                    <option value={2}>Chọn bàn</option>
                  </select>
                  {option == 2 && (
                    <>
                      <select
                        value={selectedGroupId}
                        onChange={handleGroupChange}
                        disabled={spaceDiss}
                      >
                        {allGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedSpaceId || ""}
                        onChange={handleSpaceChange}
                        disabled={!spaces.length || spaceDiss}
                      >
                        {spaces.length > 0 ? (
                          spaces.map((space) => (
                            <option key={space.id} value={space.id}>
                              {space.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            Không có Space
                          </option>
                        )}
                      </select>
                    </>
                  )}
                </div>
              </div>
              <div className="tools">
                <div
                  className="shop-it"
                  onClick={() => {
                    if (token) {
                      handleOrderSubmit();
                    } else {
                      setShowLogin(true);
                    }
                  }}
                >
                  <i className="fa-solid fa-cart-plus"></i>
                  Đặt hàng
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="null">
          <div className="icon p-2 pt-8">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div className="message">Chưa có gì!</div>
        </div>
      )}
    </BottomPopup>
  );
};

export default Restaurant_cart;
