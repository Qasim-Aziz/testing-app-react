/* eslint-disable no-shadow */
import React, { useState } from 'react'
import { Row, Col, Typography } from 'antd'
import MessageView from './MessageView'
import SchoolPeoplesList from './SchoolPeoplesList'
import StudentPeoplesList from './StudentPeopleList'
import TherapistPeoplesList from './TherapistPeoplesList'

const { Title } = Typography

export default () => {
  const [selectedPeople, setSelectedPeople] = useState()
  const userRole = localStorage.getItem('role')

  return (
    <div
      style={{
        maxWidth: 1300,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        height: 'calc(100vh - 100px)',
      }}
    >
      <Row gutter={[77, 0]} style={{ height: '100%' }}>
        <Col span={8}>
          <div
            style={{
              borderRadius: 10,
              background: '#F9F9F9',
              padding: 25,
            }}
          >
            {userRole === '"school_admin"' && (
              <SchoolPeoplesList select={selectedPeople} setSelect={setSelectedPeople} />
            )}
            {userRole === '"therapist"' && (
              <TherapistPeoplesList select={selectedPeople} setSelect={setSelectedPeople} />
            )}
            {userRole === '"parents"' && (
              <StudentPeoplesList select={selectedPeople} setSelect={setSelectedPeople} />
            )}
          </div>
        </Col>
        <Col span={16} style={{ position: 'relative', height: '100%' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            {selectedPeople ? (
              <MessageView secondUser={selectedPeople} style={{ height: '100%' }} />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Title style={{fontSize: 18}}>Select with whom you want to chat</Title>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}
