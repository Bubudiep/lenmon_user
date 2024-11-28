import React, { useState } from "react";
import api from "../../components/api";

const Restaurant_user_order = ({
  restData,
  setRestData,
  token,
  setTabActive,
  setThanhtoan,
}) => {
  const enableCancel = false;
  const [currentTab, setCurrentTab] = useState(
    "CREATED_RECEIVED_SHIPPING_DELIVERED"
  ); // Trạng thái tab hiện tại
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderStatus, setCancelOrderStatus] = useState("");
  const statusGroups = {
    CREATED_RECEIVED_SHIPPING_DELIVERED: [
      "DELIVERED",
      "CREATED",
      "RECEIVED",
      "SHIPPING",
    ], // Chờ xác nhận
    COMPLETE: ["COMPLETE"], // Hoàn tất
    CANCEL: ["CANCEL"], // Đã hủy
  };
  const handleCancelOrder = () => {
    if (
      (cancelOrderStatus === "RECEIVED" || cancelOrderStatus === "SHIPPING") &&
      !cancelReason
    ) {
      alert("Vui lòng chọn lý do hủy!");
      return;
    }
    api.cancelOrder(cancelOrderId, cancelReason).then(() => {
      alert("Đơn hàng đã được hủy!");
      setRestData((old) => ({
        ...old,
        myOrder: old.myOrder.map((order) =>
          order.id === cancelOrderId ? { ...order, status: "CANCEL" } : order
        ),
      }));
      setShowCancelModal(false);
      setCancelOrderId(null);
      setCancelReason("");
    });
  };

  const handleOpenCancelModal = (orderId, status) => {
    if (status === "CREATED") {
      if (window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) {
        api
          .post(
            "/cancel-order/",
            {
              id: orderId,
            },
            token
          )
          .then((response) => {
            setRestData((old) => ({
              ...old,
              myOrder: old.myOrder.map((order) =>
                order.id === orderId ? { ...order, status: "CANCEL" } : order
              ),
            }));
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {});
      }
    } else {
      setCancelOrderId(orderId);
      setCancelOrderStatus(status);
      setShowCancelModal(true);
    }
  };

  const filteredOrders =
    restData?.myOrder?.filter((order) =>
      statusGroups[currentTab]?.includes(order.status)
    ) || [];
  const countByStatus = (group) =>
    restData?.myOrder?.filter((order) =>
      statusGroups[group]?.includes(order.status)
    ).length || 0;
  return (
    <>
      {/* Tabs */}
      <div className="tabs">
        {[
          {
            label: "Đơn hiện tại",
            value: "CREATED_RECEIVED_SHIPPING_DELIVERED",
          },
          { label: "Hoàn tất", value: "COMPLETE" },
          { label: "Đã hủy", value: "CANCEL" },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`tab-button ${currentTab === tab.value ? "active" : ""}`}
            onClick={() => setCurrentTab(tab.value)}
          >
            {tab.label} ({countByStatus(tab.value)})
          </button>
        ))}
      </div>
      {filteredOrders.length > 0 ? (
        <div className="list-checkout slide-top">
          <div className="checkout-list">
            {filteredOrders.map((order) => (
              <div className={`items ${order.status}`} key={order.id}>
                <div className="res">
                  <div className={`name title ${order.status}`}>
                    {order.status === "CREATED" ? (
                      "Chờ xác nhận"
                    ) : order.status === "RECEIVED" ? (
                      <>
                        <i className="fa-solid fa-hourglass-half"></i> Đang làm
                      </>
                    ) : order.status === "SHIPPING" ? (
                      <>
                        <i className="fa-solid fa-truck-fast"></i> Đang ship
                      </>
                    ) : order.status === "DELIVERED" ? (
                      <>
                        <i className="fa-solid fa-money-check-dollar"></i> Chưa
                        thanh toán
                      </>
                    ) : order.status === "CANCEL" ? (
                      <>
                        <i className="fa-solid fa-xmark"></i> Đã hủy
                      </>
                    ) : order.status === "COMPLETE" ? (
                      <>
                        <i className="fa-solid fa-check"></i> Hoàn tất
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="key">
                    #HD-{order.OrderKey.slice(0, 7)}...
                    {order.OrderKey.slice(-4)}
                  </div>
                  {["CREATED"].includes(order.status) && (
                    <button
                      className="btn btn-cancel"
                      onClick={() =>
                        handleOpenCancelModal(order.id, order.status)
                      }
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  )}
                  {!["COMPLETE", "CANCEL"].includes(order.status) && (
                    <>
                      {order.is_paided ? (
                        <button className="btn btn-paideds">
                          Đã thanh toán
                        </button>
                      ) : order.is_paid ? (
                        <button className="btn btn-paided">Chờ kiểm tra</button>
                      ) : (
                        <button
                          className="btn btn-paid"
                          onClick={() => setThanhtoan(order)}
                        >
                          Thanh toán
                        </button>
                      )}
                    </>
                  )}
                </div>
                {order.status != "CANCEL" && (
                  <div className="list-items">
                    <table>
                      <tbody>
                        {order.items.map((item, idx) => (
                          <tr
                            key={idx}
                            className={`${
                              item.status == "DONE"
                                ? "ok"
                                : item.status == "WAIT"
                                ? "wait"
                                : "cancel"
                            }`}
                          >
                            <td>
                              {item.status == "DONE" ? (
                                <i className="fa-regular fa-circle-check"></i>
                              ) : item.status == "WAIT" ? (
                                <i className="fa-solid fa-hourglass-half"></i>
                              ) : (
                                <i className="fa-solid fa-xmark"></i>
                              )}
                            </td>
                            <td>{item.name}</td>
                            <td>SL: {item.quantity}</td>
                            <td>{item.price.toLocaleString("vi-VN")}đ/1</td>
                            <td>
                              {(item.quantity * item.price).toLocaleString(
                                "vi-VN"
                              )}
                              đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {order?.custom_notes && (
                  <div className="res notes">
                    <i className="fa-regular fa-note-sticky"></i>
                    {order?.custom_notes}
                  </div>
                )}
                <div className="res">
                  <div className="left">
                    Tổng:{" "}
                    <div className="price">
                      {order.items
                        .filter((it) => it.status !== "CANCEL")
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toLocaleString("vi-VN")}
                      đ
                    </div>
                  </div>
                  <div className="right">
                    {api.timeSinceOrder(order.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="null slide-top">
          <div className="icon p-2 pt-8">
            <i className="fa-solid fa-sheet-plastic"></i>
          </div>
          <div className="message">Không có đơn hàng!</div>
          <div
            className="button"
            onClick={() => {
              setTabActive("menus");
            }}
          >
            Xem menu
          </div>
        </div>
      )}

      {/* Modal hủy đơn */}
      {showCancelModal && enableCancel && (
        <div className="modal">
          <div className="modal-content">
            <h3>Hủy đơn hàng</h3>
            <p>Vui lòng chọn lý do hủy:</p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option value="">-- Chọn lý do --</option>
              <option value="Tôi đổi ý">Tôi đổi ý</option>
              <option value="Thời gian giao hàng quá lâu">
                Thời gian giao hàng quá lâu
              </option>
              <option value="Lý do khác">Lý do khác</option>
            </select>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleCancelOrder}>
                Xác nhận hủy
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Restaurant_user_order;
