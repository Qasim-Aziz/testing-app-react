/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { Table, DatePicker, notification } from 'antd'
import moment from 'moment'
import { MEDICAL_DATA } from './query'

const { RangePicker } = DatePicker

export default () => {
  const [dateRange, setDateRange] = useState([moment().startOf('week'), moment().endOf('week')])

  const expandedRowRender = record => {
    const columns = [
      {
        title: 'Drug Name',
        dataIndex: 'node.drugName',
        key: 'node.drugName',
      },
      {
        title: 'Dosage',
        dataIndex: 'node.dosage',
        key: 'node.dosage',
      },
      {
        title: 'Frequency',
        dataIndex: 'node.frequency',
        key: 'node.frequency',
      },
      {
        title: 'Date ',
        dataIndex: 'node.date',
        key: 'node.date',
      },
      {
        title: 'Time',
        dataIndex: 'node.times',
        key: 'node.times',
      },
    ]
    return <Table columns={columns} dataSource={record.node.drug.edges} pagination={false} />
  }

  const { data, error, loading } = useQuery(MEDICAL_DATA, {
    variables: {
      start: moment(dateRange[0]).format('YYYY-MM-DD'),
      end: moment(dateRange[1]).format('YYYY-MM-DD'),
    },
  })

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Failed to load user medical data',
      })
    }
  }, [error])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '20px 0',
        }}
      >
        <RangePicker size="large" value={dateRange} onChange={v => setDateRange(v)} />
      </div>

      <Table
        loading={loading}
        dataSource={data?.getMedication.edges}
        columns={[
          {
            key: 'node.condition',
            title: 'Condition',
            dataIndex: 'node.condition',
          },
          {
            key: 'node.startDate',
            title: 'Start',
            dataIndex: 'node.startDate',
          },
          {
            key: 'node.endDate',
            title: 'End',
            dataIndex: 'node.endDate',
          },
          {
            key: 'node.severity.name',
            title: 'Severity',
            dataIndex: 'node.severity.name',
          },
        ]}
        expandedRowRender={expandedRowRender}
        scroll={{
          x: 'max-content',
        }}
      />
    </div>
  )
}
