import React from 'react'
import { Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import defaultProfileImg from './defaultProfileImg.jpg'

const { Title, Text } = Typography

const MamberCard = ({ style, name, relation }) => {

  return (
    <div
      style={{
        display: 'flex',
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '20px 12px 16px',
        ...style,
      }}
    >
      <img
        src={defaultProfileImg}
        alt=""
        style={{
          width: 80,
          height: 64,
          marginRight: 22,
          borderRadius: 10,
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
          {name}
        </Title>
        <Text
          style={{
            fontSize: 16,
            lineHeight: '22px',
            color: '#000',
            margin: 0,
          }}
        >
          {relation}
        </Text>
      </div>
    </div>
  )
}

export default ({ familyMembers }) => {

  const redirectToFamilyMembers = () => {
    window.location.href = '/#/family/'
  }

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
          Family Details
        </Title>
        <Button
          style={{
            width: 50,
            height: 50,
          }}
          onClick={redirectToFamilyMembers}
        >
          <PlusOutlined style={{ fontSize: 24, margin: '5px 0 0 -2px' }} />
        </Button>
      </div>

      {familyMembers.map(({ node }, index) => {
        return (
          <MamberCard
            name={node.memberName}
            relation={node.relationship.name}
            style={{
              marginTop: index !== 0 ? 20 : 0,
            }}
          />
        )
      })}
    </div>
  )
}
