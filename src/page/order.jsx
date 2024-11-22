import React from "react";
import { useParams } from "react-router-dom";
import Restaurant_order from "./orders/res-order";
import Restaurant_all from "./orders/res-all";
const Order = () => {
  const { id } = useParams();
  return id ? <Restaurant_order /> : <Restaurant_all />;
};

export default Order;
