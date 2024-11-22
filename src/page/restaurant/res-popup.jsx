import React, { useRef, useState } from "react";

const Restaurant_pupup = ({ itemQTY, showCart }) => {
  const [dragging, setDragging] = useState(false);
  const [hide, sethide] = useState(false);
  const popupRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trastion, setTrastion] = useState(0);
  const [isLeft, setIsLeft] = useState("tright");
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragging(true);
    setStartPosition({
      x: touch.clientX - position.x, // Lấy tọa độ X ban đầu
      y: touch.clientY - position.y, // Lấy tọa độ Y ban đầu
    });
  };
  const handleTouchMove = (e) => {
    if (!dragging) return;
    setTrastion(0);
    setIsLeft(false);
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - startPosition.x, // Cập nhật vị trí X
      y: touch.clientY - startPosition.y, // Cập nhật vị trí Y
    });
  };
  const handleTouchEnd = () => {
    setDragging(false);
    setTrastion(0.3);
    setPosition((prevPosition) => ({
      x: 0,
      y: prevPosition.y, // Giữ nguyên vị trí Y
    }));
    setTimeout(() => {
      setIsLeft("tright");
    }, 200);
  };
  return (
    <div
      ref={popupRef}
      className={`cart-popup ${isLeft ? isLeft : ""} ${hide ? "hide" : ""}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: "absolute",
        transition: `all ${trastion}s`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        showCart(true);
      }}
    >
      <div className="logo">
        <i className="fa-solid fa-cart-shopping"></i>
        <div className="orderItem-qty">{itemQTY.length}</div>
      </div>
    </div>
  );
};

export default Restaurant_pupup;
