import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../page/home";
import Restaurant_all from "../page/orders/res-all";
import Restaurant_order from "../page/orders/res-order";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/order" element={<Restaurant_all />} />
        <Route path="/order/:id" element={<Restaurant_order />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
