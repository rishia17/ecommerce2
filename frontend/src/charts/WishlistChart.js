import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

import users from "../data/users";
import products from "../data/products";
import "./Chart.css";

// ✅ Register ArcElement for Pie/Doughnut charts
ChartJS.register(ArcElement, Tooltip, Legend);

const WishlistChart = () => {
  const wishlistCounts = products.map((p) => ({
    name: p.name,
    count: users.filter((u) => u.wishlist.includes(p.id)).length,
  }));

  const data = {
    labels: wishlistCounts.map((w) => w.name),
    datasets: [
      {
        data: wishlistCounts.map((w) => w.count),
        backgroundColor: ["#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#af7aa1"],
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Most Wishlisted Products</h3>
      <Pie data={data} />
    </div>
  );
};

export default WishlistChart;
