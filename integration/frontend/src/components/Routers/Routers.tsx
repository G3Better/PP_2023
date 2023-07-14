import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../Login/Login";
import Registr from "../Registration/Registr";
import ProtectedRouters from "./ProtectedRouters";
import Users from "../Users/Users";
import Orders from "../Orders/Orders";
import Systems from "../Systems/Systems";
import {roles} from "../../utills/roleUtills";

const Routers: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registr" element={<Registr />} />
        <Route element={<ProtectedRouters />}>
          {roles.client !== localStorage.getItem("role") && <Route path="/users" element={<Users />} />}
          <Route path="/orders" element={<Orders />} />
          <Route path="/systems" element={<Systems />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default Routers;
