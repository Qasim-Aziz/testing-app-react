/* eslint-disable no-shadow */
import React from 'react'
import { Typography, Card } from 'antd'

const { Title, Text } = Typography

export default ({ profileImg, name, role, selected, id, setSelectedPeople }) => {
  return (
    <Card
      style={{
        background: selected ? '#E58425' : '#fff',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        cursor: 'pointer',
      }}
      bodyStyle={{ padding: '12px', display: 'flex' }}
      onClick={() => setSelectedPeople(id)}
    >
      <img
        src={profileImg}
        alt="profile"
        style={{ width: 80, height: 64, borderRadius: 10, marginRight: 22 }}
      />
      <div>
        <Title style={{ fontSize: 18, color: selected ? '#fff' : '#000' }}>{name}</Title>
        <Text style={{ fontSize: 16, color: selected ? '#fff' : '#000' }}>{role}</Text>
      </div>
    </Card>
  )
}
