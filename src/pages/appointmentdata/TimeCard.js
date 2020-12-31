import React, { useEffect } from 'react'
import { Card, Typography, Timeline, Button, notification } from 'antd'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { DELETE_APPOINTMENT, TIME_SHEET_DATA } from './query'

const { Title, Text } = Typography

export default ({ style, id, title, location, startTime, endTime, setUpdate, selectDate, showFeedback }) => {
  const [deleteAppointment, { data, error, loading }] = useMutation(DELETE_APPOINTMENT, {
    variables: {
      id
    },
    update (cache) {
      console.log(selectDate)
      const timeSheetData = cache.readQuery({
        query: TIME_SHEET_DATA,
        variables: {
          date: selectDate
        }
      })

      cache.writeQuery({
        query: TIME_SHEET_DATA,
        variables: {
          date: selectDate
        },
        data: {
          appointments: {
            edges: timeSheetData.appointments.edges.filter(({ node }) => node.id !== id),
            __typename: 'AppointmentTypeConnection'
          }
        }
      })
    }
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Delete Appiontment Sussfull'
      })
    }
    if (error) {
      notification.error({
        message: 'Appiontment delete failed'
      })
    }
  }, [data, error])

  return (
    <Card
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        height: 199,
        overflow: 'hidden',
        ...style
      }}
      bodyStyle={{
        padding: '17px 35px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Title
          style={{
            fontSize: 24,
            lineHeight: '33px',
            margin: '0 0 6px'
          }}
        >
          {title}
        </Title>
        <Button
          type='link'
          style={{
            marginLeft: 'auto'
          }}
          onClick={() => deleteAppointment()}
          loading={loading}
        >
          <DeleteOutlined
            style={{
              color: 'red',
              fontSize: 24
            }}
          />
        </Button>

        <Button
          type='link'
          onClick={() => {
            setUpdate(id)
          }}
        >
          <FormOutlined
            style={{
              fontSize: 24
            }}
          />
        </Button>
        <Button
          type='link'
          onClick={() => {
            showFeedback(id)
          }}
        >
          Feedback
        </Button>
      </div>

      <Text
        style={{
          fontSize: 18,
          lineHeight: '26px',
          margin: 0,
          marginBottom: 17,
          display: 'block'
        }}
      >
        {location}
      </Text>
      <Timeline>
        <Timeline.Item color='#E58425'>{startTime}</Timeline.Item>
        <Timeline.Item color='#E58425'>{endTime}</Timeline.Item>
      </Timeline>
    </Card>
  )
}
