import React from 'react'
import transaction from "../assets/NoTransaction.PNG"
export default function NoTransaction() {
  return (
    <div style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"90%",
        flexDirection:"column",
        marginBottom:"0px",
        marginTop:"0px"
    }}>
      <img src={transaction} style={{width:"300px",margin:"auto",height:"250px"}} />
      <p style={{textAlign:"center",fontSize:"1.2rem"}}>
        You Have No Transaction Currently
      </p>
    </div>
  )
}
