import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

import users from "../data/users";
import products from "../data/products";
import "./Chart.css";

// Register the components needed for a bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrdersChart = () => {
  const orderCount = products.map((product) => {
    const total = users.reduce((sum, user) => {
      return (
        sum +
        user.orders.reduce((acc, o) => {
          return o.productId === product.id ? acc + o.quantity : acc;
        }, 0)
      );
    }, 0);
    return { name: product.name, count: total };
  });

  const data = {
    labels: orderCount.map((p) => p.name),
    datasets: [
      {
        label: "Orders per Product",
        backgroundColor: "#4e79a7",
        data: orderCount.map((p) => p.count),
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Orders Distribution by Product",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Orders per Product</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default OrdersChart;
