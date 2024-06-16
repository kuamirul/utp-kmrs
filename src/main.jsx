import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import { ItemsContextProvider } from "./services/RecordService";
import { UsersContextProvider } from "./services/UserService";
import { RequestsContextProvider } from "./services/RequestService";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ItemsContextProvider>
      <UsersContextProvider>
        <RequestsContextProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </RequestsContextProvider>
      </UsersContextProvider>
    </ItemsContextProvider>
  </React.StrictMode>
);