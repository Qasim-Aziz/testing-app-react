/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Typography } from 'antd'
import { createUseStyles } from 'react-jss'
import defaultProfileImg from './img/profile.jpg'

const { Title } = Typography

const useStyles = createUseStyles(() => ({
  active: {
    background: '#E58425',
    color: '#FFF',
  },
  normal: {
    background: '#FFF',
    color: '#000',
  },
}))

const LearnerCard = ({
  style,
  name,
  designation,
  key,
  profileImg,
  leaveRequest,
  active,
  onClick,
  cfStatus,
}) => {
  const classes = useStyles()
  return (
    <div
      onClick={onClick}
      key={key}
      className={active ? classes.active : classes.normal}
      style={{
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '16px 12px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        ...style,
      }}
    >
      <img
        src={profileImg || defaultProfileImg}
        alt=""
        style={{
          width: 80,
          height: 64,
          borderRadius: 10,
        }}
      />
      <div
        style={{
          marginLeft: 22,
        }}
      >
        <Title style={{ fontSize: 18, lineHeight: '25px', color: 'inherit' }}>{name}</Title>
        <div>
          <span
            style={{
              color: active ? '#fff' : '#0B35B3',
              marginRight: 38,
            }}
          >
            {designation}
          </span>
          <span>{cfStatus}</span>
          {leaveRequest && (
            <span
              style={{
                color: active ? '#fff' : '#FF5454',
              }}
            >
              Pending leave request
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default LearnerCard
