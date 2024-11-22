import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/all.scss";
import AppRouter from "./components/route.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
