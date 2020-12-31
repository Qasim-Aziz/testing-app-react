import React from 'react'
import { Typography, Button } from 'antd'
import { PlusOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const InfoCard = ({ title, value, icon: Icon }) => {
  return (
    <div
      style={{
        display: 'flex',
        padding: '20px 12px 16px',
      }}
    >
      <Icon
        style={{
          fontSize: 20,
          marginRight: 21,
          marginTop: 5,
        }}
      />
      <div>
        <Title
          style={{
            fontSize: 18,
            lineHeight: '25px',
            margin: 0,
          }}
        >
          {title}
        </Title>
        <Text
          style={{
            fontSize: 13,
            lineHeight: '18px',
            color: '#0B35B3',
            margin: 0,
          }}
        >
          {value}
        </Text>
      </div>
    </div>
  )
}

export default ({ email, phoneNo }) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <Title
          style={{
            fontSize: 20,
            lineHeight: '27px',
            margin: 0,
          }}
        >
          Personal Details
        </Title>
        <Button
          style={{
            width: 50,
            height: 50,
          }}
        >
          <PlusOutlined style={{ fontSize: 24, margin: '5px 0 0 -2px' }} />
        </Button>
      </div>

      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 10,
          padding: 25,
        }}
      >
        <InfoCard title="Email Address" value={email} icon={MailOutlined} />
        <hr />
        <InfoCard title="Mobile Number" value={phoneNo} icon={PhoneOutlined} />
        <hr />
        <InfoCard title="Password" value="Last Updated on Nov.23, 2019" icon={LockOutlined} />
      </div>
    </div>
  )
}
