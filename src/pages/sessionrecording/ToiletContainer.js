import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography } from 'antd'
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
            padding: '0px 20px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          {studnetInfo && (
            <Title
              style={{
                marginBottom: 30,
                fontSize: 25,
              }}
            >
              {studnetInfo.student && studnetInfo.student.firstname}&apos;s Toilet Data
            </Title>
          )}
          <Row gutter={[46, 0]}>
            <Col span={14}>
              <div
                style={{
                  marginTop: 41,
                }}
              >
                <div
                  style={{
                    marginTop: 17,
                  }}
                >
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
              </div>
            </Col>
            <Col span={10}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '30px',
                  lineHeight: '41px',
                }}
              >
                Record Toilet Data
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
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
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
