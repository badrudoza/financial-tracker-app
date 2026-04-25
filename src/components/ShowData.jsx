import React, { useState } from 'react'

export default function ShowData({data}) {
  const [btn,setBtn]=useState(true);
  return (
    <div>
        {data.length>0?<ul>
            {
data.map((el)=>{
    <li>
        <h3>Name: {el.name}</h3>
        {btn && <p>Discription: {el.description}</p>}
        
    </li>
      })}
        </ul>:<h1>No data is awailable</h1>}
        
    </div>
  )
}
