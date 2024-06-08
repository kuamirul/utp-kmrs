import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import { ItemsContextProvider } from "./services/RecordService";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ItemsContextProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ItemsContextProvider>
  </React.StrictMode>
);