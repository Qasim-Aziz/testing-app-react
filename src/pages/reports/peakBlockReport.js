/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import { Dropdown, Menu, Row, DatePicker, Button, notification, Radio, Tabs } from 'antd'
import { useLazyQuery } from 'react-apollo'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment'
import { PeakBlockWiseTable } from './peakBlockWiseTable'
import { PeakStimulusReport } from './peakStimulusWiseTable'
import { PeakBlockEqui } from './peakBlockEqui'
import { PEAK_BLOCKWISE, PEAK_EQUIVALENCE } from './query'
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

const parentDiv = { display: 'flex', margin: '5px 30px 5px 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

const dateFormat = 'YYYY-MM-DD'

function PeakBlockReport({ selectedStudentId, studentName }) {
  const [dateRR, setDateRR] = useState([moment().subtract(11, 'd'), moment()])
  const [peakType, setpeakType] = useState('dir/gen')
  const studentId = localStorage.getItem('studentId')
  const [activeTab, setActiveTab] = useState('Block')
  const [activeEquiTab, setActiveEquiTab] = useState('Class')
  const [dateList, setDateList] = useState([])
  const [equiTrainTest, setEquiTrainTest] = useState('all')

  const [
    getPeakBlockData,
    { data: peakBlockData, error: peakBlockError, loading: peakBlockLoading },
  ] = useLazyQuery(PEAK_BLOCKWISE)

  const [
    getPeakEquiData,
    { data: peakEqui, error: peakEquiError, loading: peakEquiLoading },
  ] = useLazyQuery(PEAK_EQUIVALENCE)

  const downloadCsvRef = useRef()
  const [peakBlockGen, setPeakBlockGen] = useState([])
  const [peakEquiData, setPeakEquiData] = useState([])
  const [sessionName, setSessionName] = useState('U2Vzc2lvbk5hbWVUeXBlOjE=')

  useEffect(() => {
    if (dateRR[0] && dateRR[1]) {
      let start = dateRR[1]
      let end = dateRR[0]
      if (dateRR[0].format(dateFormat) < dateRR[1].format(dateFormat)) {
        start = dateRR[0]
        end = dateRR[1]
      }

      getPeakBlockData({
        variables: {
          start: start.format(dateFormat),
          end: end.format(dateFormat),
          student: studentId,
          sessionName: sessionName,
        },
      })

      getPeakEquiData({
        variables: {
          start: start.format(dateFormat),
          end: end.format(dateFormat),
          student: studentId,
          sessionName: sessionName,
          equivalence: true,
        },
      })

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
          day: moment(dateStr).format('ddd'),
          year: moment(dateStr).format('YYYY'),
        })
      })

      setDateList(daysList)
    }
  }, [dateRR, studentId, sessionName])

  useEffect(() => {
    if (peakBlockError) {
      notification.error({
        message: 'Somthing went wrong!',
      })
    }
  }, [peakBlockError])

  useEffect(() => {
    if (peakBlockData) {
      const tempBlockId = []
      let tempData = []
      let tempPeakBlockGen = []
      console.log(peakBlockData, 'peakBlockData')

      peakBlockData.peakBlockWiseReport.map(item => {
        tempData.push({
          date: item.date,
          blocks: item.blocks,
          target: item.target?.targetAllcatedDetails.targetName,
          peakType: item.target?.peakType,
        })
      })

      tempPeakBlockGen = tempData.filter(item => item.peakType !== 'EQUIVALENCE')
      tempPeakBlockGen = tempPeakBlockGen.filter(item => {
        if (
          item.target === null ||
          item.target === undefined ||
          item.blocks === null ||
          item.blocks.length === 0
        ) {
          return false
        }

        const tempBlock = item.blocks[0].id
        for (let i = 0; i < tempBlockId.length; i += 1) {
          if (tempBlockId[i] === tempBlock) {
            return false
          }
        }

        tempBlockId.push(tempBlock)
        return true
      })

      setPeakBlockGen(tempPeakBlockGen)
    }
  }, [peakBlockData])

  useEffect(() => {
    if (peakEqui) {
      let tempData = []
      let tempClassId = []
      console.log(peakEqui, 'equivalence')

      peakEqui.peakBlockWiseReport.map(item => {
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
          return true
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

      setPeakEquiData(tempData)
    }
    if (peakEquiError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch peak equivalence data',
      })
    }
  }, [peakEqui, peakEquiError, equiTrainTest])

  const disabledDate = current => {
    if (current.format(dateFormat) > moment().format(dateFormat)) {
      return true
    }
    if (!dateRR || dateRR.length === 0) {
      return false
    }
  }
  const onOpenChange = open => {
    if (open) {
      setDateRR([])
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          onClick={() => {
            if (peakType === 'dir/gen') {
              downloadCsvRef.current?.exportToCSV(activeTab)
            } else {
              downloadCsvRef.current?.exportToCSV(activeEquiTab)
            }
          }}
          type="link"
          size="small"
        >
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

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
      <Row>
        <div style={filterCardStyle}>
          <div style={parentDiv}>
            <span style={parentLabel}>Date:</span>
            <RangePicker
              defaultValue={dateRR}
              format={dateFormat}
              disabledDate={disabledDate}
              onCalendarChange={val => setDateRR(val)}
              onOpenChange={onOpenChange}
              style={{
                maxWidth: '240px',
              }}
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

          <div style={{ ...parentDiv, marginRight: 0 }}>
            <span style={parentLabel}>Block</span>
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
            <span style={parentLabel}>Class</span>
            <div
              style={{
                background: '#ff8080',
                borderRadius: 10,
                width: '20px',
                margin: 'auto 0',
                height: 20,
              }}
            />
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ padding: '0 8px' }} type="link" size="large">
                <FaDownload fontSize={22} />{' '}
              </Button>
            </Dropdown>
          </div>
        </div>
      </Row>
      {peakType === 'dir/gen' ? (
        <Tabs
          style={{ marginTop: 10, marginLeft: 10 }}
          defaultActiveKey={activeTab}
          type="card"
          onChange={setActiveTab}
        >
          <TabPane tab="Block" key="Block">
            <PeakBlockWiseTable
              dates={dateList}
              peakBlockData={peakBlockGen}
              peakBlockLoading={peakBlockLoading}
              ref={downloadCsvRef}
              studentName={studentName}
            />
          </TabPane>

          <TabPane tab="Stimulus" key="Stimulus/dir">
            <PeakStimulusReport
              dates={dateList}
              peakBlockData={peakBlockGen}
              peakBlockLoading={peakBlockLoading}
              ref={downloadCsvRef}
              studentName={studentName}
            />
          </TabPane>
        </Tabs>
      ) : (
        <Tabs
          style={{ marginTop: 10, marginLeft: 10 }}
          defaultActiveKey={activeEquiTab}
          type="card"
          className="vbmappReportTabs"
          tabBarExtraContent={peakEquitabbarExt}
          onChange={setActiveEquiTab}
        >
          <TabPane tab="Class" key="Class">
            <PeakBlockEqui
              dates={dateList}
              peakEquiData={peakEquiData}
              peakEquiLoading={peakEquiLoading}
              dates={dateList}
              expandType="Class"
              ref={downloadCsvRef}
              studentName={studentName}
            />
          </TabPane>

          <TabPane tab="Stimulus" key="Stimulus">
            <PeakBlockEqui
              dates={dateList}
              peakEquiData={peakEquiData}
              peakEquiLoading={peakEquiLoading}
              dates={dateList}
              expandType="Stimulus"
              studentName={studentName}
              ref={downloadCsvRef}
            />
          </TabPane>
        </Tabs>
      )}
    </div>
  )
}

export default PeakBlockReport
