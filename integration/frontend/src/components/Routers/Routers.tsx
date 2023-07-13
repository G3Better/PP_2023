import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../Login/Login";
import Registr from "../Registration/Registr";
import ProtectedRouters from "./ProtectedRouters";
import Employees from "../Employees/Employees";
import Booking from "../Booking/Booking";
import GamePlaces from "../GamePlaces/GamePlaces";
import {roles} from "../../utills/roleUtills";

const Routers: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registr" element={<Registr />} />
        <Route element={<ProtectedRouters />}>
          {roles.client !== localStorage.getItem("role") && <Route path="/users" element={<Employees />} />}
          <Route path="/booking" element={<Booking />} />
          <Route path="/game_places" element={<GamePlaces />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default Routers;
