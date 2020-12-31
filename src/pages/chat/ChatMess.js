/* eslint-disable no-shadow */
import React from 'react'
import { Typography } from 'antd'
import profileImg from 'images/student.jpg'

const { Text } = Typography

export default ({ message, time, me }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: me ? 'flex-end' : 'flex-start',
        marginTop: 44,
      }}
    >
      <img
        src={profileImg}
        alt="profile"
        style={{
          height: 50,
          width: 50,
          borderRadius: 6,
          marginLeft: me ? 23 : 0,
          marginRight: me ? 0 : 23,
          order: me ? 1 : 0,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: me ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            borderRadius: me ? '10px 0px 10px 10px' : '0px 10px 10px 10px',
            background: '#E58425',
            padding: '6px 19px',
          }}
        >
          <Text style={{ fontSize: 16, color: '#fff' }}>{message}</Text>
        </div>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#9A9A9A' }}>{time}</Text>
      </div>
    </div>
  )
}
