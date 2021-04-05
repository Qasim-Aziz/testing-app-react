/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Input, Button, Table } from 'antd'

export default props => {
  console.log('PROPS', props)
  useEffect(() => {
    console.log('THE USE_EFFCE ')
  }, [])
  return (
    <>
      <h1>Details</h1>
      <Table />
    </>
  )
}
