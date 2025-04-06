import React, { useEffect } from "react";
import OrdersChart from "../../charts/OrdersChart";
import WishlistChart from "../../charts/WishlistChart";
import SalesByCategory from "../../charts/SalesByCategory";
import AvgPriceByCategory from "../../charts/AvgPriceByCategory";
import "./Dashboard.css";



function Dashboard() {
    useEffect(()=>{
        console.log("no problem in dash")
    },[])
  return (
    <div className="dashboard">
      <OrdersChart />
      <WishlistChart />
      {/* <SalesByCategory />
      <AvgPriceByCategory /> */}
    </div>
  );
}

export default Dashboard;