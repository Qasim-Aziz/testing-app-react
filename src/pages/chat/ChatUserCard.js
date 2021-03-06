/* eslint-disable no-shadow */
import React from 'react'
import { Typography, Card } from 'antd'
import { COLORS } from 'assets/styles/globalStyles'

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
        background: selected ? COLORS.palleteLightBlue : '#fff',
        borderBottom: '1px solid #F2F2F2',
        cursor: 'pointer',
      }}
      bodyStyle={{ padding: '12px', display: 'flex' }}
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
      <div>
        <Title style={{ fontSize: 16, color: '#000' }}>{name}</Title>
        <p>{role}</p>
      </div>
    </Card>
  )
}
