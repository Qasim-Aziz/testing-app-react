/* eslint-disable array-callback-return */
import React from 'react'
import { useQuery } from 'react-apollo'
import { Table, Tabs } from 'antd'
import { GOAL_STATUS } from './query'
import './form.scss'

const { TabPane } = Tabs

export default () => {
  const studentId = localStorage.getItem('studentId')
  const { data, error, loading } = useQuery(GOAL_STATUS, {
    variables: {
      studentId,
    },
  })

  if (loading) {
    return <h3>Loading...</h3>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Failed to load Goals data</p>
  }

  return (
    <div>
      {/* <pre>{JSON.stringify(freDisData, null, 2)}</pre> */}
      <Tabs defaultActiveKey="1" type="card" size="large">
        {data?.goalStatus.map(({ id, status, longtermgoalSet }) => {
          return (
            <TabPane key={id} tab={`${status}`}>
              <Table
                dataSource={longtermgoalSet.edges}
                columns={[
                  {
                    title: 'Goal Name',
                    dataIndex: 'node.goalName',
                    key: 'node.goalName',
                  },
                  {
                    title: 'Description',
                    dataIndex: 'node.description',
                    key: 'node.description',
                  },
                  {
                    title: 'Created',
                    dataIndex: 'node.dateInitialted',
                    key: 'node.dateInitialted',
                  },
                  {
                    title: 'End',
                    dataIndex: 'node.dateEnd',
                    key: 'node.dateEnd',
                  },
                ]}
              />
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}
