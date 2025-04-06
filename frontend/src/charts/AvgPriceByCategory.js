import React from "react";
import { Bar } from "react-chartjs-2";
import products from "../data/products";
import "./Chart.css";

const AvgPriceByCategory = () => {
  const categoryPrices = {};
  const categoryCounts = {};

  products.forEach((p) => {
    categoryPrices[p.category] = (categoryPrices[p.category] || 0) + p.price;
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const avgPrices = Object.keys(categoryPrices).map(
    (cat) => categoryPrices[cat] / categoryCounts[cat]
  );

  const data = {
    labels: Object.keys(categoryPrices),
    datasets: [
      {
        label: "Average Price",
        backgroundColor: "#edc948",
        data: avgPrices,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Average Price by Category</h3>
      <Bar data={data} />
    </div>
  );
};

export default AvgPriceByCategory;
