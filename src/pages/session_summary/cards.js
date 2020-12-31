/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import { ClockCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Title, Text } = Typography

const Cards = ({ label = '', percentage = '', targetCount = '', trails = 0, style, name = '' }) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '10px 30px',
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        margin: '5px',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 13,
        }}
      >
        <Title
          style={{
            fontSize: 24,
            lineHeight: '33px',
          }}
        >
          {trails}
        </Title>

        <Text
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#2E2E2E',
            marginLeft: 9,
            marginRight: 19,
          }}
        >
          {label}
        </Text>
      </div>

      <Text
        style={{
          fontSize: 16,
          lineHeight: '20px',
          // display: 'block',
        }}
      >
        {percentage !== '' ? (
          <>
            <p>
              {percentage}% for {targetCount} Targets
            </p>
          </>
        ) : (
          <>
            <p>Recorded</p>
          </>
        )}
      </Text>
    </div>
  )
}

export default Cards
