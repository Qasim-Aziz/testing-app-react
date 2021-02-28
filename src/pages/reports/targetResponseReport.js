/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-lonely-if */

import React, { useState, useEffect, useRef } from 'react'
import {
  Menu,
  Collapse,
  Button,
  Select,
  Radio,
  Tabs,
  DatePicker,
  notification,
  Dropdown,
} from 'antd'
import { useLazyQuery } from 'react-apollo'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment'
import { TargetResponsePeakBlock } from './targetResponsePeakBlock'
import { TargetResponseEqui } from './targetResponseEqui'
import { TARGET_RESPONSE_RATE, TARGET_EQUI_RESPONSE_RATE } from './query'
import './form.scss'
import './table.scss'

const { RangePicker } = DatePicker
const { TabPane } = Tabs

const filterCardStyle = {
  background: '#F1F1F1',
  display: 'flex',
  flexWrap: 'wrap',
  padding: '5px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
  backgroundColor: 'rgb(241, 241, 241)',
}

const dateFormat = 'YYYY-MM-DD'
const parentDiv = { display: 'flex', margin: '5px 15px 5px 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

function TargetResponseReport({ studentName }) {
  const studentId = localStorage.getItem('studentId')
  const [dateRange, setDateRange] = useState([
    moment(Date.now()).subtract(10, 'days'),
    moment(Date.now()),
  ])

  const [targetResponseData, setTargetResponseData] = useState(null)
  const [targetResponsePeakEquiData, setTargetResponsePeakEquiData] = useState(null)
  const [peakType, setpeakType] = useState('dir/gen')
  const [sessionName, setSessionName] = useState('U2Vzc2lvbk5hbWVUeXBlOjE=')
  const [equiTrainTest, setEquiTrainTest] = useState('all')
  const [activeEquiTab, setActiveEquiTab] = useState('Class')
  const downloadCsvRef = useRef()
  const [getResponseRate, { data: dt, loading: ld, error: er }] = useLazyQuery(TARGET_RESPONSE_RATE)
  const [
    getEquiResponseRate,
    { data: equiData, loading: equiLoading, error: equiError },
  ] = useLazyQuery(TARGET_EQUI_RESPONSE_RATE)

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          onClick={() => {
            if (peakType === 'dir/gen') {
              downloadCsvRef.current?.exportToCSV('Block')
            } else {
              downloadCsvRef.current?.exportToCSV(activeEquiTab)
            }
          }}
        >
          {' '}
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  const start = dateRange[0]
  const end = dateRange[1]

  const days = []
  let day = start

  while (day <= end) {
    days.push(day.toDate())
    day = day.clone().add(1, 'd')
  }

  const daysList = []
  days.map(dateStr => {
    daysList.push({
      monthYear: moment(dateStr)
        .format('MMM')
        .concat(moment(dateStr).format('YYYY')),
      date: moment(dateStr).format('YYYY-MM-DD'),
      month: moment(dateStr).format('MMM'),
      dayDate: moment(dateStr).format('DD'),
      day: moment(dateStr).format('dddd'),
      year: moment(dateStr).format('YYYY'),
    })
  })

  useEffect(() => {
    if (dateRange[0] && dateRange[1] && studentId) {
      let start
      let end
      if (dateRange[0].format(dateFormat) < dateRange[1].format(dateFormat)) {
        start = dateRange[0].format(dateFormat)
        end = dateRange[1].format(dateFormat)
      } else {
        start = dateRange[1].format(dateFormat)
        end = dateRange[0].format(dateFormat)
      }

      getResponseRate({
        variables: {
          student: studentId,
          start,
          end,
          sessionName,
        },
      })

      getEquiResponseRate({
        variables: {
          student: studentId,
          start,
          end,
          sessionName,
          equivalence: true,
        },
      })
    }
  }, [dateRange, studentId, sessionName])

  useEffect(() => {
    if (dt) {
      console.log(dt)
      let tempData = []
      const tempBlockId = []

      tempData = dt.targetWiseReportDatewise.filter(item => {
        if (item.target === null) {
          return false
        }

        const targetType = item.target.targetAllcatedDetails.targetType.typeTar
        if (targetType === 'Peak') {
          for (let i = 0; i < tempBlockId.length; i++) {
            if (item.blocks[0]?.id === tempBlockId[i]) {
              return false
            }
          }
          tempBlockId.push(item.blocks[0]?.id)
        } else {
          if (item.trials?.length > 0) {
            for (let i = 0; i < tempBlockId.length; i += 1) {
              if (item.trials[0]?.id === tempBlockId[i]) {
                return false
              }
            }
          }
          tempBlockId.push(item.trials[0]?.id)
        }
        return true
      })
      console.log(tempData)
      setTargetResponseData(tempData)
    }
    if (er) {
      notification.error({
        message: 'Opps their are something wrong to load the data',
      })
    }
  }, [dt, er])

  useEffect(() => {
    if (equiData) {
      let tempData = []
      const tempClassId = []
      console.log(equiData, 'equivalence')

      equiData.targetWiseReportDatewise.map(item => {
        tempData.push({
          date: item.date,
          equBlocks: item.equBlocks,
          targetName: item.target?.targetAllcatedDetails.targetName,
          targetId: item.target?.targetAllcatedDetails.id,
          peakType: item.target?.peakType,
        })
      })

      tempData = tempData.filter(item => {
        if (item.targetName === undefined || item.targetName === null || item.equBlocks === null) {
          return false
        }

        if (item.equBlocks.length === 0) {
          return false
        }
        for (let i = 0; i < tempClassId.length; i++) {
          if (item.equBlocks[0].id === tempClassId[i]) {
            return false
          }
        }

        tempClassId.push(item.equBlocks[0].id)
        return true
      })

      if (equiTrainTest === 'TRAIN' || equiTrainTest === 'TEST') {
        for (let i = 0; i < tempData.length; i++) {
          tempData[i].equBlocks = tempData[i].equBlocks.filter(item => {
            return item.recType === equiTrainTest
          })
        }
      }

      console.log(tempData, 'eq')
      setTargetResponsePeakEquiData(tempData)
    } else if (equiError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch target response equivalence data',
      })
    }
  }, [equiData, equiError, equiTrainTest])

  const peakEquitabbarExt = (
    <Radio.Group
      size="small"
      value={equiTrainTest}
      style={{ margin: 'auto 0' }}
      onChange={e => {
        setEquiTrainTest(e.target.value)
      }}
      buttonStyle="solid"
    >
      <Radio.Button value="all">All</Radio.Button>
      <Radio.Button value="TRAIN">TRAIN</Radio.Button>
      <Radio.Button value="TEST">TEST</Radio.Button>
    </Radio.Group>
  )

  return (
    <div>
      <div style={filterCardStyle}>
        <div style={parentDiv}>
          <span style={parentLabel}>Date:</span>
          <RangePicker
            style={{
              marginLeft: 'auto',
              width: 230,
              marginRight: 10,
            }}
            value={dateRange}
            onChange={v => setDateRange(v)}
          />
        </div>

        <div style={parentDiv}>
          <span style={parentLabel}>Report Type: </span>
          <Radio.Group
            size="small"
            value={peakType}
            style={{ margin: 'auto 0' }}
            onChange={e => {
              setpeakType(e.target.value)
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="dir/gen">DIR/GEN</Radio.Button>
            <Radio.Button value="equi">EQUI</Radio.Button>
          </Radio.Group>
        </div>
        <div style={parentDiv}>
          <span style={parentLabel}>Session: </span>
          <Radio.Group
            size="small"
            style={{ margin: 'auto 0' }}
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="">All</Radio.Button>
            <Radio.Button value="U2Vzc2lvbk5hbWVUeXBlOjE=">Mor</Radio.Button>
            <Radio.Button value="U2Vzc2lvbk5hbWVUeXBlOjI=">After</Radio.Button>
            <Radio.Button value="U2Vzc2lvbk5hbWVUeXBlOjM=">Eve</Radio.Button>
            <Radio.Button value="U2Vzc2lvbk5hbWVUeXBlOjQ=">Def</Radio.Button>
          </Radio.Group>
        </div>
        <div style={parentDiv}>
          <span style={parentLabel}>Target</span>
          <div
            style={{
              background: '#2874A6',
              borderRadius: 10,
              width: '20px',
              margin: 'auto 0',
              marginRight: '10px',
              height: 20,
            }}
          />
          <span style={parentLabel}>Stimulus</span>
          <div
            style={{
              background: '#f080b8',
              borderRadius: 10,
              width: '20px',
              margin: 'auto 0',
              marginRight: '10px',
              height: 20,
            }}
          />
          <span style={parentLabel}>Steps</span>
          <div
            style={{
              background: '#f0b880',
              borderRadius: 10,
              width: '20px',
              margin: 'auto 0',
              marginRight: '10px',
              height: 20,
            }}
          />
          {/* <span style={parentLabel}>Class</span>
          <div
            style={{
              background: '#ff8080',
              borderRadius: 10,
              width: '20px',
              margin: 'auto 0',
              marginRight: '10px',
              height: 20,
            }}
          /> */}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button style={{ padding: '0 8px' }} type="link" size="large">
              <FaDownload />{' '}
            </Button>
          </Dropdown>
        </div>
      </div>

      {peakType === 'dir/gen' ? (
        <TargetResponsePeakBlock
          dates={daysList}
          data={targetResponseData}
          dataLoading={ld}
          ref={downloadCsvRef}
          studentName={studentName}
        />
      ) : (
        <Tabs
          style={{ marginTop: 10, marginLeft: 10 }}
          defaultActiveKey={activeEquiTab}
          type="card"
          tabBarExtraContent={peakEquitabbarExt}
          onChange={setActiveEquiTab}
        >
          <TabPane tab="Class" key="Class">
            <TargetResponseEqui
              dates={daysList}
              peakEquiData={targetResponsePeakEquiData}
              peakEquiLoading={equiLoading}
              studentName={studentName}
              expandType="Class"
              ref={downloadCsvRef}
            />
          </TabPane>

          <TabPane tab="Stimulus" key="Stimulus">
            <TargetResponseEqui
              dates={daysList}
              peakEquiData={targetResponsePeakEquiData}
              peakEquiLoading={equiLoading}
              studentName={studentName}
              expandType="Stimulus"
              ref={downloadCsvRef}
            />
          </TabPane>
        </Tabs>
      )}
    </div>
  )
}

export default TargetResponseReport
// 04775da2277b8e715542da005625a4b8
