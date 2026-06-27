import React, { useState } from 'react'
import './style.css'
import { Card, Row ,Modal} from 'antd'
import Button from '../Button'

export default function Cards({showExpenseModal,showIncomeModal,income,expense,currentBalance,resetBalance}) {
  const showConfirm = () => {
    Modal.confirm({
      title: "Reset Balance",
      content:
        "Are you sure you want to delete all transactions? This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
  
      onOk() {
        resetBalance();
      },
    });
  };
  return (
    <Row className='my-row'>
        <Card className='my-card' border={true}>
          <h2>Current Balance</h2>
           <p> ₹{currentBalance}</p>
           <Button text="Reset Balance" blue={true} onClick={showConfirm} />
        </Card>

        <Card className='my-card' border={true}>
          <h2>Total Income</h2>
           <p> ₹{income}</p>
           <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
        </Card>
        
        <Card className='my-card' border={true}>
          <h2>Total Expenses</h2>
           <p> ₹{expense}</p>
           <Button text="Add Expenses" blue={true} onClick={showExpenseModal}/>
        </Card>
        
    </Row>
    
  )
}
