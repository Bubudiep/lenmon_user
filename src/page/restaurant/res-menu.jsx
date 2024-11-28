import React, { useState } from "react";

const Restaurant_menu = ({
  restData,
  addItem,
  addSave,
  itemQTY,
  removeItem,
  token,
  setShowLogin,
  setItemQTY,
}) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [removeItemId, setRemoveItemId] = useState(null);
  const menu = restData.menu.length > 0 ? restData.menu[0] : {};
  const listId = itemQTY.map((item) => item.id);
  const handleAdd = (item) => {
    addItem(item);
    setSelectedItemId(null);
  };
  const handleRemove = (item) => {
    removeItem(item);
    setRemoveItemId(null);
  };
  const isInCart = (id) => listId.includes(id);

  return (
    <>
      {menu && menu.items.length > 0 ? (
        <div className="list">
          {menu.items
            .filter((item) => item.is_active)
            .map((item, index) => (
              <div className="card" key={index}>
                {/* Hiển thị Select Box */}
                {isInCart(item.id) ? (
                  removeItemId === item.id ? (
                    <RemoveBox
                      item={item}
                      onClose={() => setRemoveItemId(null)}
                      onRemove={() => handleRemove(item)}
                      itemQTY={itemQTY}
                      setItemQTY={setItemQTY}
                    />
                  ) : (
                    <AlreadyInCartBox
                      item={item}
                      onClick={() => setRemoveItemId(item.id)}
                      itemQTY={itemQTY}
                    />
                  )
                ) : selectedItemId === item.id ? (
                  <SelectBox
                    item={item}
                    onClose={() => setSelectedItemId(null)}
                    onAdd={handleAdd}
                    onComplete={() => addSave(item)}
                  />
                ) : null}

                {/* Hiển thị thông tin sản phẩm */}
                <div
                  className="image"
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setRemoveItemId(null);
                  }}
                >
                  <img src={item?.image64_mini ?? "#"} alt={item?.name} />
                </div>
                <div
                  className="info"
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setRemoveItemId(null);
                  }}
                >
                  <div className="item-top">
                    <div className="price">
                      {(item?.price ?? 0).toLocaleString("vi-VN")}đ
                    </div>
                    <div className="rate">
                      <i className="fa-regular fa-star"></i> 5.0
                    </div>
                  </div>
                  <div className="name">{item?.name}</div>
                  <div className="res">
                    <div className="name">{item?.restaurant?.name}</div>
                    <div className="address">
                      {item.is_available && item.is_active && !item.is_delete
                        ? "Còn hàng"
                        : "Hết hàng"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
};

// Các component phụ
const SelectBox = ({ item, onClose, onAdd, onComplete }) => {
  const [quantity, setQuantity] = useState(1); // Initial quantity is 1
  const isOutOfStock = !item.is_available || item.is_delete;
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };
  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev)); // Ensure quantity doesn't go below 1
  };
  const handleAddToCart = (item, quantity) => {
    onAdd({ ...item, quantity });
    setQuantity(quantity);
  };
  return (
    <div className="selectBox">
      <div
        className="bg-Item"
        onClick={() => {
          if (!isOutOfStock && quantity) {
            handleAddToCart(item, quantity);
          }
          return onClose();
        }}
      />
      <div className="items">
        {isOutOfStock ? (
          <div className="font-[15px] text-[#fff] text-center">Hết hàng</div>
        ) : (
          <>
            <div className="add-items">
              <button className="button" onClick={handleDecrement}>
                -
              </button>
              <div className="value">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setQuantity(value > 0 ? value : 1); // Ensure valid quantity
                  }}
                  min="1"
                />
              </div>
              <button className="button" onClick={handleIncrement}>
                +
              </button>
            </div>
            <button
              className="add"
              onClick={() => {
                handleAddToCart(item, quantity);
              }}
            >
              <i className="fa-solid fa-cart-plus"></i> Thêm vào giỏ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const AlreadyInCartBox = ({ item, onClick, itemQTY }) => {
  const thisItem = itemQTY.filter((old) => old.id === item.id);
  return (
    <div className="selectBox ready" onClick={onClick}>
      <div className="bg-Item" />
      <div className="already">
        <i className="fa-solid fa-check"></i>
        <div className="item-qty">Số lượng: {thisItem[0].quantity}</div>
      </div>
    </div>
  );
};

const RemoveBox = ({ item, onClose, onRemove, itemQTY, setItemQTY }) => {
  const thisItem = itemQTY.filter((old) => old.id === item.id);
  const [quantity, setQuantity] = useState(thisItem[0].quantity ?? 0);
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1); // Update local quantity state
    setItemQTY((old) =>
      old.map(
        (i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) // Update the item's quantity
      )
    );
  };
  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev)); // Ensure quantity doesn't go below 1
    setItemQTY((old) =>
      old.map(
        (i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity > 1 ? i.quantity - 1 : i.quantity }
            : i // Update the item's quantity
      )
    );
  };
  return (
    <div className="selectBox ready">
      <div
        className="bg-Item"
        onClick={() => {
          if (quantity <= 0) {
            return onRemove();
          }
          return onClose();
        }}
      />
      <div className="already">
        <div className="items">
          <div className="add-items">
            <button className="button" onClick={handleDecrement}>
              -
            </button>
            <div className="value">
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setQuantity(value > 0 ? value : 1); // Ensure valid quantity
                }}
                min="1"
              />
            </div>
            <button className="button" onClick={handleIncrement}>
              +
            </button>
          </div>
          <button className="add" onClick={onRemove}>
            <i className="fa-solid fa-cart-arrow-down"></i> Bỏ khỏi giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="null">
    <div className="icon p-2 pt-8">
      <i className="fa-solid fa-cart-shopping"></i>
    </div>
    <div className="message">Chưa có gì!</div>
  </div>
);

export default Restaurant_menu;
