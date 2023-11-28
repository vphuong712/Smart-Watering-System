import React from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import "./MainDash.css";
import { useRouteLoaderData } from "react-router-dom";

const MainDash = () => {
  const user = useRouteLoaderData('root') || 'Dashboard';
  
  return (
    <div className="MainDash">
      <h2>{`Welcome Back, ${user.firstName} ${user.lastName}!`}</h2>
      <Cards />
      <Table />
    </div>
  );
};

export default MainDash;
