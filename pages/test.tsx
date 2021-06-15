import React, { useEffect, useState } from 'react'
import Test from '../components/Test'

const TestPage = () => {
  
  const [bla, setBla] = useState('')

  useEffect(() => {
    console.log("bla ->", bla)
  },[bla])

  const changeBla = (value) => {
    console.log("value->", value)
  }

  return(
    <Test changeBla={changeBla}></Test>
  )
} 

export default TestPage