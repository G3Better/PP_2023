import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../Login/Login";
import Registr from "../Registration/Registr";
import ProtectedRouters from "./ProtectedRouters";
import Users from "../Users/Users";
import Orders from "../Orders/Orders";
import SrcSystems from "../SrcSystems/SrcSystems";
import DstSystems from "../DstSystems/DstSystems";
import Ips from "../Ips/Ips";
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
          <Route path="/src_systems" element={<SrcSystems/>} />
          <Route path="/dst_systems" element={<DstSystems/>} />
          <Route path="/ips" element={<Ips/>} />
        </Route>
      </Routes>
    </Router>
  );
};
export default Routers;
