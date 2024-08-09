import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import AdminProvider from "./context/AdminProvider";
import { ItemsContextProvider } from "./services/RecordService";
import { DigitizedRecordContextProvider } from "./services/DigitizedRecordService";
import { DisposedRecordContextProvider } from "./services/DisposedRecordService";
import { UsersContextProvider } from "./services/UserService";
import { StaffsContextProvider } from "./services/StaffService";
import { RequestsContextProvider } from "./services/RequestService";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ItemsContextProvider>
      <DigitizedRecordContextProvider>
        <DisposedRecordContextProvider>
          <UsersContextProvider>
            <StaffsContextProvider>
              <RequestsContextProvider>
                <BrowserRouter>
                  <AuthProvider>
                    <AdminProvider>
                      <App />
                    </AdminProvider>
                  </AuthProvider>
                </BrowserRouter>
              </RequestsContextProvider>
            </StaffsContextProvider>
          </UsersContextProvider>
        </DisposedRecordContextProvider>
      </DigitizedRecordContextProvider>
    </ItemsContextProvider>
  </React.StrictMode>
);