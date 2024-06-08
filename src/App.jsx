import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";
import UpdatePassword from "./pages/UpdatePassword";
import Records from "./pages/Records";
import DigitizedRecords from "./pages/DigitizedRecords";
import DisposedRecords from "./pages/DisposedRecords";

const App = () => {
  return (
    <>
      <NavBar />
     
        <div className="w-100">
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/utp-records" element={<Records />} />
              <Route path="/digitized-records" element={<DigitizedRecords />} />
              <Route path="/disposed-records" element={<DisposedRecords />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </div>
      
    </>
  );
};

export default App;