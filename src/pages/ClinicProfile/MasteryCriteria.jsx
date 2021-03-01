/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Form, Table, Drawer, Tag, notification } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import styles from './clinicalProfile.module.scss'
import gql from 'graphql-tag'
import Moment from 'react-moment'
import MasteryCriteriaForm from './MasteryCriteriaForm'

const MasteryCriteria = () => {
  const [visible, setVisible] = useState(false)
  const [criteriaid, setCriteria] = useState('')
  const [tableData, settableData] = useState('')

  const showDrawer = (e, cr_id) => {
    setVisible(true)
    setCriteria(cr_id)
  }

  const onClose = () => {
    setVisible(false)
  }

  const MASTER_TARGET = gql`
    query {
      masteryCriteria {
        id
        name
        createdAt
        isDefault
        statuscriteriaSet {
          edges {
            node {
              id
              responsePercentage
              consecutiveDays
              minTrial
              fromStatus {
                id
                statusName
              }
              toStatus {
                id
                statusName
              }
            }
          }
        }
      }
    }
  `

  const { loading, error, data } = useQuery(MASTER_TARGET, { suspend: true })

  if (loading) {
    return 'Loading...'
  }
  if (error) {
    return <pre>{JSON.stringify(mastertarget.error, null, 2)}</pre>
  }

  const columns = [
    {
      title: 'Mastery Criteria Name',
      dataIndex: 'name',
      key: 'masterycriterianame',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: obj => <Moment format="DD MMMM, YYYY">{obj}</Moment>,
    },
    {
      title: 'Action',
      key: 'operation',
      render: obj => (
        <span>
          <Tag>
            {' '}
            <a> Edit</a>
          </Tag>
          <Tag>
            <a onClick={e => showDrawer(e, obj.id)}> Add Criteria</a>
          </Tag>
        </span>
      ),
    },
  ]

  const expandedRowRender = record => {
    console.log(record.statuscriteriaSet)
    const columns = [
      { title: 'From Status', dataIndex: 'node.fromStatus.statusName', key: 'fromStatus' },
      { title: 'To Status', dataIndex: 'node.toStatus.statusName', key: 'toStatus' },
      {
        title: 'Response Percentage',
        dataIndex: 'node.responsePercentage',
        key: 'responsePercentage',
      },
      { title: 'Consecutive Days', dataIndex: 'node.consecutiveDays', key: 'consecutiveDays' },
      { title: 'Mininum Trials', dataIndex: 'node.minTrial', key: 'minTrial' },
    ]
    return (
      <Table columns={columns} dataSource={record.statuscriteriaSet.edges} pagination={false} />
    )
  }

  const callbackFunction = (result, values) => {
    console.log(result)
    notification.success({
      message: 'successfully Created',
      description: 'Your Criteria successfully Created',
    })
    // settableData(result);

    setVisible(false)
  }

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className="d-flex justify-content-between">
          <div className={styles.pageTitle}>
            <strong>Mastery Criteria</strong>
          </div>
          <div></div>
        </div>

        <div>
          {tableData ? (
            <Table
              dataSource={tableData.masteryCriteria}
              columns={columns}
              expandedRowRender={expandedRowRender}
            />
          ) : (
            <Table
              dataSource={data.masteryCriteria}
              columns={columns}
              expandedRowRender={expandedRowRender}
            />
          )}
        </div>
      </div>
      <Drawer
        title="Basic Drawer"
        placement="right"
        width={550}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <MasteryCriteriaForm criteriaid={criteriaid} parentCallback={callbackFunction} />
      </Drawer>
    </>
  )
}

export default MasteryCriteria
