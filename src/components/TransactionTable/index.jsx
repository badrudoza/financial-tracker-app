import React, { useState } from "react";
import "./style.css";
import { Radio, Select, Table } from "antd";
import { Option } from "antd/es/mentions";
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";

export default function TransactionTable({ transactions ,addTransaction,fetchTransactions}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  // let filteredTransactions = [...transactions].filter(
  //   (item) =>
  //     item.name.toLowerCase().includes(search.toLocaleLowerCase()) &&
  //     item.type.includes(typeFilter)
  // );
  // let sortedTransaction = filteredTransactions.sort((a, b) => {
  //   if (sortKey === "date") {
  //     return new Date(a.date) - new Date(b.date);
  //   } else if (sortKey === "amount") {
  //     return a.amount - b.amount;
  //   } else {
  //     return 0;
  //   }
  // });
  let filteredTransactions = [...transactions].filter((item) => {
  const name = item?.name?.toLowerCase() || "";
  const type = item?.type || "";
  const searchText = search?.toLowerCase() || "";
  const filterType = typeFilter || "";

  return (
    name.includes(searchText) &&
    (filterType === "" || type === filterType)
  );
});

let sortedTransaction = [...filteredTransactions].sort((a, b) => {
  if (sortKey === "date") {
    return new Date(a.date) - new Date(b.date);
  }
  if (sortKey === "amount") {
    return a.amount - b.amount;
  }
  return 0;
});


  function exportCsv(){
    var csv=unparse({
      fields:['name','type','tag','date','amount'],
      data:transactions
    });
    var data=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    var csvURL=URL.createObjectURL(data);
    const tempLink=document.createElement("a");
    tempLink.href=csvURL;
    tempLink.download="transactions.csv";
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }
  function importFromCsv(e){
    e.preventDefault();
    try{
      parse(e.target.files[0],{
        header:true,
        complete:async function (results) {
          console.log("results array",results)
          for(const transaction of results.data){
            const newTransaction={
              ...transaction,
              amount:parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction,true);

          }
        }
      });
      toast.success("All Transaction Added");
      fetchTransactions();
      e.target.files=null;
    } catch(e){
      toast.error(e.message)
    }
  }
  return (
    <div
      style={{
        width: "95%",
        padding: "0rem 2rem",
        margin: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} width="22px" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter by Type"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transaction</h2>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">NoSort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportCsv}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import to CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              onChange={importFromCsv}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table dataSource={sortedTransaction} columns={columns} />
      </div>
    </div>
  );
}
