import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1a1a24",
          color: "#e0e0f0",
          border: "1px solid #2e2e40",
        },
      }}
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
