import { Line, Pie } from "@ant-design/charts";
import React from "react";

export default function ChartComponent({ sortedTransaction }) {
  const data = sortedTransaction.map((item) => {
    return {
      date: item.date,
      amount: item.amount,
    };
  });
  const SpendingData = sortedTransaction.filter((transaction) => {
    if (transaction.type === "expense") {
      return {
        tag: transaction.tag,
        amount: transaction.amount,
      };
    }
  });

  let finalSpending = SpendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});
  let newSpending = [
    { tag: "food", amount: 0 },
    { tag: "education", amount: 0 },
    { tag: "office", amount: 0 },
  ];
  SpendingData.forEach((item) => {
    if(item.tag=="food"){
      newSpending[0].amount+=item.amount;
    }else if(item.tag=='education'){
      newSpending[1].amount+=item.amount;
    }else{
      newSpending[2].amount+=item.amount;
    }
  });

  const config = {
    data: data,
    width: 700,
    height: 300,
    autoFit: false,
    xField: "date",
    yField: "amount",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };
  const SpendingConfig = {
    data: newSpending,
    height: 300,
    width: 350,
    angleField: "amount",
    colorField: "tag",
  };

  let chart;
  let piChart;
  return (
    <div className="charts-wrapper">
      <div>
        <h2 style={{ marginTop: "0px" }}>Your Analytics</h2>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>
      <div>
        <h2>Your Spend</h2>
        <Pie
          {...SpendingConfig}
          onReady={(chartInstance) => (piChart = chartInstance)}
        />
      </div>
    </div>
  );
}
