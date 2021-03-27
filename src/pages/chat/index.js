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
  const [selectedPeopleDetails, setSelectedPeopleDetails] = useState(null)
  const userRole = localStorage.getItem('role')

  return (
    <div
      style={{
        maxWidth: 1300,
        border: '1px solid #e8e8e8',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        height: 'calc(100vh - 120px)',
      }}
    >
      <div style={{ height: '100%', display: 'flex' }}>
        <div
          style={{
            width: '400px',
            background: '#F9F9F9',
            paddingTop: '20px',
            borderRight: '1px solid #e8e8e8',
          }}
        >
          <div>
            {userRole === '"school_admin"' && (
              <SchoolPeoplesList
                select={selectedPeople}
                setSelect={setSelectedPeople}
                setSelectedPeopleDetails={setSelectedPeopleDetails}
              />
            )}
            {userRole === '"therapist"' && (
              <TherapistPeoplesList
                select={selectedPeople}
                setSelect={setSelectedPeople}
                setSelectedPeopleDetails={setSelectedPeopleDetails}
              />
            )}
            {userRole === '"parents"' && (
              <StudentPeoplesList
                select={selectedPeople}
                setSelect={setSelectedPeople}
                setSelectedPeopleDetails={setSelectedPeopleDetails}
              />
            )}
          </div>
        </div>
        <div style={{ position: 'relative', height: '100%', width: '900px' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            {selectedPeople ? (
              <MessageView
                secondUser={selectedPeople}
                selectedPeopleDetails={selectedPeopleDetails}
                style={{ height: '100%' }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Title style={{ fontSize: 18 }}>No chat available for selected learner</Title>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
