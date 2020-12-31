import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { Table, notification } from 'antd'
import moment from 'moment'
import { TOILET_DATA } from './query'

export default () => {
  const { data, error, loading } = useQuery(TOILET_DATA)

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Failed to load toilet data',
      })
    }
  })

  const expandedRowRender = record => {
    const columns = [
      {
        title: 'Reminder Date',
        render(obj) {
          if (obj.node.time.length > 0) {
            return <div>{moment(obj.node.time).format('DD MMMM')}</div>
          }
          return null
        },
      },
      {
        title: 'Reminder Time',
        render(obj) {
          if (obj.node.time.length > 0) {
            return <div>{moment(obj.node.time).format('HH:mm a')}</div>
          }
          return null
        },
        key: 'node.time',
      },
    ]
    return <Table columns={columns} dataSource={record.node.reminders.edges} pagination={false} />
  }

  return (
    <div>
      <Table
        columns={[
          {
            key: 'node.date',
            title: 'Date',
            dataIndex: 'node.date',
          },
          {
            key: 'node.time',
            title: 'Time',
            dataIndex: 'node.time',
          },
          {
            key: 'node.urination',
            title: 'Urination',
            render(obj) {
              if (obj.node.urination) {
                return <div>Yes</div>
              }
              return <div>No</div>
            },
          },
          {
            key: 'node.bowel',
            title: 'Bowel',
            render(obj) {
              if (obj.node.bowel) {
                return <div>Yes</div>
              }
              return <div>No</div>
            },
          },
          {
            key: 'node.prompted',
            title: 'Prompted',
            render(obj) {
              if (obj.node.prompted) {
                return <div>Yes</div>
              }
              return <div>No</div>
            },
          },
          {
            key: 'node.lastWater',
            title: 'Water Intake',
            dataIndex: 'node.lastWater',
          },
        ]}
        loading={loading}
        dataSource={data?.getToiletData.edges}
        expandedRowRender={expandedRowRender}
        scroll={{
          x: 'max-content',
        }}
      />
    </div>
  )
}
