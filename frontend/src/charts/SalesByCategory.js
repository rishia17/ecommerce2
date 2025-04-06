import React from "react";
import { Bar } from "react-chartjs-2";
import products from "../data/products";
import "./Chart.css";

const SalesByCategory = () => {
  const categoryMap = {};

  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + p.totalSold;
  });

  const data = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: "Total Sales by Category",
        backgroundColor: "#59a14f",
        data: Object.values(categoryMap),
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Sales by Category</h3>
      <Bar data={data} />
    </div>
  );
};

export default SalesByCategory;
