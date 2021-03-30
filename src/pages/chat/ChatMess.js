/* eslint-disable no-shadow */
import React from 'react'
import { Typography } from 'antd'
import profileImg from 'images/student.jpg'
import { COLORS } from 'assets/styles/globalStyles'

const { Text } = Typography

const s1 = {
  width: 'fit-content',
  fontSize: 11,
  height: '15px',
  marginTop: 'auto',
}

const s2 = {
  width: 'fit-content',
  fontSize: 11,
  height: '15px',
  position: 'absolute',
  bottom: '4px',
  right: '11px',
}
export default ({ message, time, me }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: me ? 'flex-end' : 'flex-start',
        margin: '6px 0',
      }}
    >
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
            background: COLORS.palleteLightBlue,
            position: 'relative',
            padding: '4px 12px',
          }}
        >
          <div style={{ fontSize: 14, color: 'black', display: 'flex', maxWidth: '500px' }}>
            <div style={{ width: '100%', marginRight: '15px' }}>{message}</div>
            <div style={message.length < 70 ? s1 : s2}>{time}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
// this is long message you know dude just for testing how a long msg looks
