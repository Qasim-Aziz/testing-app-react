import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { COLORS } from 'assets/styles/globalStyles'
import { Row, Col, Layout, Typography, DatePicker, Timeline } from 'antd'
import {
  EditOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import TimeCard from './TimeCard'
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
          note
          isApproved
          isBillable
        }
      }
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment())
  const [newLogCreated, setNewLogCreated] = useState(false)
  const { data, loading, error, refetch } = useQuery(TIME_SHEET_DATA, {
    variables: {
      date: date.format('YYYY-MM-DD'),
    },
  })
  const [cardData, setCardData] = useState(null)

  useEffect(() => {
    if (data && data?.timesheets) {
      const temp = []
      data.timesheets.edges.map(item => temp.push(item.node))
      console.log(temp)
      temp.sort((a, b) => new Date(a.start) - new Date(b.start))
      setCardData(temp)
    }
  }, [data])

  useEffect(() => {
    if (newLogCreated) {
      refetch()
      setNewLogCreated(false)
    }
  }, [refetch, date, newLogCreated])

  const handleSelectDate = newDate => {
    setDate(newDate)
  }

  const parentDiv = { display: 'flex', margin: '5px 20px 5px 0' }
  const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }
  const filterCardStyle = {
    backgroundColor: COLORS.palleteLight,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '5px 10px',
    margin: 0,
    height: 'fit-content',
    overflow: 'hidden',
  }

  console.log(data, 'data')
  return (
    <Authorize roles={['therapist']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content style={{ padding: '0px 20px', maxWidth: 1360, width: '100%', margin: '0px auto' }}>
          <Row gutter={[46, 0]}>
            <Col span={7} style={{ padding: 0 }}>
              <div style={{ background: COLORS.palleteLight, padding: '16px' }}>
                <Title style={{ fontSize: '24px' }}>Log Work Done</Title>
                <WorkLogForm setNewLogCreated={setNewLogCreated} />
              </div>
            </Col>
            <Col span={17} style={{ padding: 0 }}>
              <div style={filterCardStyle}>
                <div style={parentDiv}>
                  <span style={parentLabel}>Date:</span>
                  <DatePicker
                    style={{
                      marginLeft: 'auto',
                      width: 230,
                      marginRight: 10,
                    }}
                    value={date}
                    onChange={handleSelectDate}
                  />
                </div>
              </div>
              <div>
                <div style={{ margin: '10px 0 10px 10px' }}>
                  {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                  {cardData &&
                    cardData.map(item => {
                      return (
                        <TimeCard
                          key={item.id}
                          title={item.title}
                          location={item.location?.location}
                          startTime={moment(item.start).format('hh:mm a')}
                          endTime={moment(item.end).format('hh:mm a')}
                          note={item.note}
                          isApproved={item.isApproved}
                          isBillable={item.isBillable}
                        />
                      )
                    })}
                </div>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
