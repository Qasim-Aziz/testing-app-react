import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import ToiletCard from './ToiletData/ToiletCard'
import ToiletForm from './ToiletData/Toiletform'

const { Content } = Layout
const { Title } = Typography

const TOILET_DATA = gql`
  query getToiletData($date: Date!, $student: ID!, $session: ID!) {
    getToiletData(student: $student, date: $date, success: true, session: $session) {
      edges {
        node {
          id
          date
          time
          lastWater
          lastWaterTime
          success
          urination
          bowel
          prompted
        }
      }
    }
  }
`

const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [newToiletDate, setNewToiletDate] = useState(date)
  const [newToiletDataCreated, setNewToiletDataCreated] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const sessionId = useSelector(state => state.sessionrecording.ChildSession.id)

  const { data, loading, error, refetch } = useQuery(TOILET_DATA, {
    variables: {
      student: studentId,
      date,
      session: sessionId,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (newToiletDate === date && newToiletDataCreated) {
      refetch()
      setNewToiletDataCreated(false)
    }
  }, [newToiletDate, refetch, date, newToiletDataCreated])

  return (
    <Authorize roles={['school_admin', 'parents', 'therapist']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div
              style={{
                width: '44%',
              }}
            >
              <Title
                style={{
                  marginTop: '15px',
                  marginLeft: '15px',
                  fontSize: '25px',
                }}
              >
                Record Toilet Data
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '18px 24px',
                  width: '100%',
                }}
              >
                <ToiletForm
                  handleNewToiletDate={newDate => {
                    setNewToiletDate(newDate)
                  }}
                  selectDate={date}
                  setNewToiletCreated={setNewToiletDataCreated}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                width: '54%',
              }}
            >
              <Scrollbars autoHide>
                <div>
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                      {data &&
                        data.getToiletData.edges.map(({ node }, index) => {
                          return (
                            <ToiletCard
                              key={node.id}
                              urination={node.urination}
                              bowel={node.bowel}
                              prompted={node.prompted}
                              time={node.time}
                              waterValue={node.waterIntake}
                              style={{ marginTop: index === 0 ? 0 : 20 }}
                            />
                          )
                        })}
                    </>
                  )}
                </div>
              </Scrollbars>
            </div>
          </div>
        </Content>
      </Layout>
    </Authorize>
  )
}
