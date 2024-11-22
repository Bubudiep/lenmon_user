import React, { useState } from "react";

const Restaurant_menu = ({
  restData,
  addItem,
  addSave,
  itemQTY,
  removeItem,
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
                    />
                  ) : (
                    <AlreadyInCartBox
                      item={item}
                      onClick={() => setRemoveItemId(item.id)}
                    />
                  )
                ) : selectedItemId === item.id ? (
                  <SelectBox
                    item={item}
                    onClose={() => setSelectedItemId(null)}
                    onAdd={() => handleAdd(item)}
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
  const isOutOfStock = !item.is_available || item.is_delete;

  return (
    <div className="selectBox">
      <div className="bg-Item" onClick={onClose} />
      <div className="items">
        {isOutOfStock ? (
          <>
            <div className="font-[15px] text-[#fff] text-center">Hết hàng</div>
            <button className="view">
              Chi tiết <i className="fa-solid fa-angles-right"></i>
            </button>
          </>
        ) : (
          <>
            <button className="add" onClick={onAdd}>
              <i className="fa-solid fa-cart-plus"></i> Thêm vào giỏ
            </button>
            <button className="complete" onClick={onComplete}>
              <i className="fa-regular fa-circle-check"></i> Thêm và xong
            </button>
            <button className="view">
              Chi tiết <i className="fa-solid fa-angles-right"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const AlreadyInCartBox = ({ item, onClick }) => (
  <div className="selectBox ready" onClick={onClick}>
    <div className="bg-Item" />
    <div className="already">
      <i className="fa-solid fa-circle-check"></i>
      Đã có trong giỏ
    </div>
  </div>
);

const RemoveBox = ({ item, onClose, onRemove }) => (
  <div className="selectBox ready">
    <div className="bg-Item" onClick={onClose} />
    <div className="already">
      <i className="fa-solid fa-circle-check"></i>
      <div className="items">
        <button className="add" onClick={onRemove}>
          <i className="fa-solid fa-cart-plus"></i> Bỏ khỏi giỏ
        </button>
        <button className="view">
          Chi tiết <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="null">
    <div className="icon p-2 pt-8">
      <i className="fa-solid fa-cart-shopping"></i>
    </div>
    <div className="message">Chưa có gì!</div>
  </div>
);

export default Restaurant_menu;
