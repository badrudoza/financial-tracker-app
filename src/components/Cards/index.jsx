import React, { useState } from 'react'
import './style.css'
import { Card, Row } from 'antd'
import Button from '../Button'

export default function Cards({showExpenseModal,showIncomeModal,income,expense,currentBalance}) {
  return (
    <Row className='my-row'>
        <Card className='my-card' border={true}>
          <h2>Current Balance</h2>
           <p> ₹{currentBalance}</p>
           <Button text="Reset Balance" blue={true} />
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
