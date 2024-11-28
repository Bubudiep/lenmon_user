import React, { useEffect, useRef, useState } from "react";
import BottomPopup from "../bottomPopup";
import api from "../../components/api";
import { QRCode } from "react-qrcode-logo";

const Restaurant_paid = ({ order, restData, token, onClose, setRestData }) => {
  const popupRef = useRef();
  const [isPaid, setisPaid] = useState(order.is_paid);
  const [loading, setLoading] = useState(false);
  const [bankInfo, setBankinfo] = useState(false);
  const totalPrice = order.items
    .filter((item) => !item.is_paid)
    .filter((item) => item.status !== "CANCEL")
    .reduce((sum, item) => sum + item.quantity * item.price, 0);
  const toString = (bankcode, banknumber, money) => {
    const test = new api.VietQR();
    test.setTransactionAmount(money);
    test.setBeneficiaryOrganization(bankcode, banknumber);
    test.setAdditionalDataFieldTemplate(
      `TT ${api.removeSpecial(restData.name)?.replaceAll(" ", "")} ${api
        .removeSpecial(order.space_name ?? "MangVe")
        ?.replaceAll(" ", "")} ${order.OrderKey.slice(0, 8)}`
    );
    const string = test.build();
    return string;
  };
  useEffect(() => {
    api
      .get("https://api.vietqr.io/v2/banks")
      .then((res) => {
        const match = res.data.filter((bank) => bank.bin == restData.bankCode);
        if (match.length == 1) {
          setBankinfo(match[0]);
        }
      })
      .catch((err) => {
        alert("Không lấy được dữ liệu ngân hàng!");
      });
  }, []);
  const handleThanhtoan = () => {
    console.log(order);
    setLoading(true);
    api
      .post("/paid-order/", { id: order.id }, token)
      .then((response) => {
        console.log(response, response.data.id);
        setRestData((prevData) => ({
          ...prevData, // Giữ nguyên các thuộc tính khác trong `restData`
          myOrder: prevData.myOrder.map(
            (order) =>
              order.id === response.data.id
                ? { ...order, ...response.data } // Cập nhật đối tượng có id trùng với response.id
                : order // Giữ nguyên các đối tượng khác
          ),
        }));
        popupRef.current.closePopup();
      })
      .catch((err) => {
        console.log(err);
        alert("Mất kết nối máy chủ. Vui lòng thử lại sau!");
      })
      .finally(() => {
        setisPaid(true);
        setLoading(false);
      });
  };
  return (
    <BottomPopup
      ref={popupRef}
      title="Thanh toán"
      onClose={() => {
        onClose();
      }}
    >
      {restData?.bankCode &&
      restData?.bankValue &&
      bankInfo?.logo &&
      totalPrice ? (
        <>
          <div className="qrcode">
            <div className="bank-logo">
              <div className="box">
                <img src={bankInfo.logo} />
              </div>
            </div>
            <div className="bank-name">{bankInfo.name}</div>
            <div className="bank-hint">
              Quét mã QR để thanh toán, sau khi thanh toán thành công vui lòng
              chọn "YÊU CẦU XÁC NHẬN" để thông báo chủ quán kiểm tra!
            </div>
            <div className="bank-info">
              <table>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <div className="qr-code">
                        {totalPrice && (
                          <QRCode
                            value={toString(
                              restData.bankCode,
                              restData.bankValue,
                              totalPrice
                            )} // Chuỗi muốn mã hóa
                            size={220} // Kích thước mã QR
                            ecLevel="M"
                            qrStyle="dots" // Kiểu QR ("squares" hoặc "dots")
                            fgColor="#517fc4" // Màu QR
                            eyeColor="#2678f3e0" // Màu của các ô vuông lớn (QR eyes)
                            bgColor="#ffffff" // Màu nền QR
                            eyeRadius={[
                              [10, 10, 10, 10], // Top-left
                              [10, 10, 10, 10], // Top-right
                              [10, 10, 10, 10], // Bottom-left
                            ]}
                            quietZone={0} // Vùng trắng xung quanh QR
                            removeQrCodeBehindLogo // Xóa mã QR phía sau logo
                            logoImage={restData.avatar} // Đường dẫn đến ảnh logo
                            logoWidth={35} // Kích thước logo
                            logoHeight={35} // Kích thước logo
                            logoOpacity={0.8} // Độ mờ của logo
                            logoPadding={5} // Khoảng cách giữa logo và mã QR
                            logoPaddingStyle="square" // Kiểu padding logo ("circle" hoặc "square")
                            logoStyle={{
                              borderRadius: "50%", // Bo tròn logo
                              overflow: "hidden", // Đảm bảo ảnh không vượt ra ngoài
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Số tiền</td>
                    <td className="price">
                      {totalPrice.toLocaleString("vi-VN")} VNĐ
                    </td>
                  </tr>
                  <tr>
                    <td>Số tài khoản</td>
                    <td>{restData.bankValue}</td>
                  </tr>
                  <tr>
                    <td>Chủ tài khoản</td>
                    <td>{restData.bankName.toUpperCase()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="list-items">
              <div className="header">Chi tiết đơn hàng</div>
              <table>
                <tbody>
                  {order.items
                    .slice() // Tạo bản sao mảng để tránh thay đổi mảng gốc
                    .sort((a, b) =>
                      a.status === "CANCEL" ? 1 : b.status === "CANCEL" ? -1 : 0
                    ) // Đưa "CANCEL" xuống cuối
                    .map((item, idx) => (
                      <tr
                        key={idx}
                        className={
                          item.is_paid
                            ? "done"
                            : item.status === "CANCEL"
                            ? "cancel"
                            : ""
                        }
                      >
                        <td>{item.name}</td>
                        <td>SL: {item.quantity}</td>
                        <td>{item.price.toLocaleString("vi-VN")}đ/1</td>
                        <td>
                          {(item.quantity * item.price).toLocaleString("vi-VN")}
                          đ
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bottom" onClick={handleThanhtoan}>
            {!isPaid ? "ĐÃ THANH TOÁN" : "ĐANG CHỜ PHẢN HỒI"}
          </div>
        </>
      ) : (
        <div className="null">
          <div className="icon p-2 pt-8">
            <i className="fa-solid fa-qrcode"></i>
          </div>
          <div className="message">
            Quán chưa cài ngân hàng, vui lòng quay lại sau!
          </div>
        </div>
      )}
    </BottomPopup>
  );
};

export default Restaurant_paid;
