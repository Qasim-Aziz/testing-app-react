import { Dropdown, Icon, Input, Menu, notification, Table, Drawer, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import Highlighter from 'react-highlight-words'
import { DRAWER } from 'assets/styles/globalStyles'
import EditRecordDrawer from 'pages/BehaviourData/EditRecordDrawer'
import BehaviorChartDrildown from 'pages/BehaviourData/BehaviorChartDrildown'
import { BEHAVIOR_RECORD_DATA, DELETE_BEHAVIOR_RECORD } from './queries'

const { Search } = Input

const RecordTab = ({ studentId, activeTab, date, searchText, searchStatus }) => {
  const [allBehaviorRecords, setAllBehaviorRecords] = useState([])
  const [filteredBehaviorRecords, setFilteredBehaviorRecords] = useState([])
  const [editRecordingFor, setEditRecordingFor] = useState()
  const [openDrilldownChartFor, setDrilldownChartFor] = useState()

  const {
    data: behaviorRecordData,
    error: behaviorRecordError,
    loading: behaviorRecordLoading,
    refetch: refetchBehaviorRecord,
  } = useQuery(BEHAVIOR_RECORD_DATA, {
    variables: {
      studentId,
      dateGte: date.gte,
      dateLte: date.lte,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    refetchBehaviorRecord({
      variables: {
        studentId,
        dateGte: date.gte,
        dateLte: date.lte,
      },
    })
  }, [date])

  useEffect(() => {
    if (activeTab === 'records') {
      refetchBehaviorRecord()
    }
  }, [activeTab])

  const [
    deleteBehaviorRecord,
    { data: deleteBehaviorRecordData, error: deleteBehaviorRecordError },
  ] = useMutation(DELETE_BEHAVIOR_RECORD)

  useEffect(() => {
    if (behaviorRecordData) {
      const behaviorRecordList = behaviorRecordData.getDecelData.edges.map(({ node }) => ({
        id: node.id,
        duration: node.duration,
        behaviorName: node.template.behavior.behaviorName,
        note: node.note,
        status: node.status.statusName,
        totalFrequency: node.frequency.edges.length,
        decelObject: node,
      }))

      if (searchText) {
        // If filter already exist then
        const filteredbehaviorRecordList = behaviorRecordList.filter(x =>
          x.behaviorName.toLowerCase().includes(searchText.toLowerCase()),
        )
        setFilteredBehaviorRecords(filteredbehaviorRecordList)
      } else {
        setFilteredBehaviorRecords(behaviorRecordList)
      }

      setAllBehaviorRecords(behaviorRecordList)
    }
  }, [behaviorRecordData])

  useEffect(() => {
    if (deleteBehaviorRecordData) {
      notification.success({
        message: 'Behaviour Record deleted sucessfully.',
      })
      refetchBehaviorRecord()
    }
    if (deleteBehaviorRecordError)
      notification.error({
        message: 'Opps their something wrong',
      })
  }, [deleteBehaviorRecordData, deleteBehaviorRecordError])

  const behaviourRecordColumns = [
    {
      title: 'Behaviour Name',
      dataIndex: 'behaviorName',
      render: (text, row) =>
        searchText ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'right',
      render: (text, record) => `${Math.floor(text / 1000)} sec`,
    },
    {
      title: 'Total frequency',
      dataIndex: 'totalFrequency',
      align: 'right',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
    },
    {
      title: 'Action(s)',
      dataIndex: '',
      align: 'center',
      width: 120,
      render: (text, record) => {
        console.log(record, 'record')
        const menu = (
          <Menu onClick={e => handleMenuActions(e, record)}>
            <Menu.Item key="editBehaviorRecord">
              <Icon type="edit" /> Edit
            </Menu.Item>
            <Menu.Item key="deleteBehaviorRecord">
              <Icon type="delete" /> Delete
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="openGraph">
              <Icon type="snippets" /> Open Graph
            </Menu.Item>
          </Menu>
        )

        return (
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" style={{ color: '#1890ff' }}>
              More <Icon type="down" />
            </a>
          </Dropdown>
        )
      },
    },
  ]

  const handleMenuActions = (e, obj) => {
    console.log(e, obj)
    switch (e) {
      case 'editBehaviorRecord':
        setEditRecordingFor(obj.decelObject)
        break
      case 'deleteBehaviorRecord':
        deleteBehaviorRecord({
          variables: {
            id: obj.id,
          },
        })
        break
      case 'openGraph':
        setDrilldownChartFor(obj.decelObject)
        break

      default: {
        console.log(`Unknown menuitem - ${e.key}`)
      }
    }
  }

  useEffect(() => {
    let tempList = allBehaviorRecords

    if (searchText) {
      // Filter Template
      tempList = tempList.filter(x =>
        x.behaviorName.toLowerCase().includes(searchText.toLowerCase()),
      )
    }
    if (searchStatus) {
      console.log(allBehaviorRecords, 'status all beha')
      tempList = tempList.filter(x => x.status.toLowerCase().includes(searchStatus.toLowerCase()))
    }

    setFilteredBehaviorRecords(tempList)
  }, [searchText, searchStatus])

  if (behaviorRecordError) {
    return <h3>An error occurred to load data.</h3>
  }

  return (
    <>
      <Table
        loading={behaviorRecordLoading}
        className="behaviorTable"
        rowKey="id"
        columns={behaviourRecordColumns}
        dataSource={filteredBehaviorRecords}
        pagination={{
          position: 'bottom',
          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50', '100'],
        }}
        size="small"
        bordered
      />

      <Drawer
        width={DRAWER.widthL2}
        title="Edit Recording"
        placement="right"
        visible={editRecordingFor}
        onClose={() => {
          setEditRecordingFor(null)
        }}
      >
        {editRecordingFor && (
          <EditRecordDrawer
            decelDetails={editRecordingFor}
            refetchRecordData={() => {}}
            onRecordingData={() => {
              setEditRecordingFor(null)
            }}
          />
        )}
      </Drawer>

      <Modal
        title={
          openDrilldownChartFor ? openDrilldownChartFor.template.behavior.behaviorName : 'Drilldown'
        }
        visible={!!openDrilldownChartFor}
        footer={null}
        width={800}
        height={400}
        onCancel={() => setDrilldownChartFor(null)}
      >
        {openDrilldownChartFor && <BehaviorChartDrildown decelData={openDrilldownChartFor} />}
      </Modal>
    </>
  )
}
export default RecordTab
