import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import TimeCard from 'pages/StaffManagement/TimeCard'
import WorkLogForm from './WorkLogForm'

const { Content } = Layout
const { Title } = Typography

const TIME_SHEET_DATA = gql`
  query Stafftimesheet($date: Date) {
    timesheets(start_Date: $date) {
      edges {
        node {
          id
          title
          start
          end
          location {
            id
            location
          }
        }
      }
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [newLogCreated, setNewLogCreated] = useState(false)
  const { data, loading, error, refetch } = useQuery(TIME_SHEET_DATA, {
    variables: {
      date,
    },
  })

  useEffect(() => {
    if (newLogCreated) {
      refetch()
      setNewLogCreated(false)
    }
  }, [refetch, date, newLogCreated])

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  return (
    <Authorize roles={['therapist']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content style={{ padding: '0px 20px', maxWidth: 1300, width: '100%', margin: '0px auto' }}>
          <Title
            style={{
              marginBottom: 30,
              fontSize: 25,
            }}
          >
            Work Done
          </Title>
          <Row gutter={[46, 0]}>
            <Col span={16}>
              <Calendar value={date} handleOnChange={handleSelectDate} />
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
                        data.timesheets.edges.map(({ node }, index) => {
                          return (
                            <TimeCard
                              title={node.title}
                              location={node.location.location}
                              startTime={moment(node.start).format('HH:mm a')}
                              endTime={moment(node.end).format('HH:mm a')}
                              style={{
                                marginTop: index !== 0 ? 24 : 0,
                              }}
                            />
                          )
                        })}
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '30px',
                  lineHeight: '41px',
                }}
              >
                Log Work Done
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                <WorkLogForm setNewLogCreated={setNewLogCreated} />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
