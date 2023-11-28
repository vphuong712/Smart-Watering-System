import React, { useState } from "react";
import "./Sidebar.css";
import Logo from "../imgs/Logo.png";
import { NavLink } from "react-router-dom";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Sidebar = () => {

  const [ expanded ] = useState(true)

  const sidebarVariants = {
    true: {
      left : '0'
    },
    false:{
      left : '-60%'
    }
  }
  return (
    <>
    <motion.div className='sidebar'
    variants={sidebarVariants}
    animate={window.innerWidth<=768?`${expanded}`:''}
    >
      <div className="logo">
        <img src={Logo} alt="logo" />
        <span>
          UrPlant
        </span>
      </div>

      <div className="menu">
        {SidebarData.map((item, index) => {
          return (
            <NavLink
              className={({ isActive }) => isActive ? "menuItem active" : "menuItem" }
              key={index}
              to={item.link}
            >
              <item.icon />
              <span>{item.heading}</span>
            </NavLink>
          );
        })}
        {/* signoutIcon */}
        <div className="menuItem">
          <Link to='/logout' ><UilSignOutAlt /></Link>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default Sidebar;
