/* eslint-disable no-shadow */
import React from 'react'
import { Typography, Card } from 'antd'

const { Title, Text } = Typography

export default ({
  profileImg,
  name,
  role,
  selected,
  id,
  setSelectedPeople,
  setSelectedPeopleDetails,
}) => {
  return (
    <Card
      style={{
        background: selected ? '#E58425' : '#fff',
        borderBottom: '1px solid #F2F2F2',
        cursor: 'pointer',
      }}
      bodyStyle={{ padding: '12px 4px', display: 'flex' }}
      onClick={() => {
        setSelectedPeople(id)
        setSelectedPeopleDetails({
          name,
          role,
          id,
          profileImg,
        })
      }}
    >
      <img
        src={profileImg}
        alt="profile"
        style={{ width: 50, height: 50, borderRadius: 30, marginRight: 12 }}
      />
      <div>
        <Title style={{ fontSize: 16, color: selected ? '#fff' : '#000' }}>
          {name} - {role}
        </Title>
      </div>
    </Card>
  )
}
