/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import {
  Table,
  Button,
  notification,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  Drawer,
  Menu,
  Dropdown,
} from 'antd'
import { useSelector } from 'react-redux'
import { usePrevious } from 'react-delta'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { LineChartOutlined, FilterOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import filterIcon from 'icons/filter.png'
import { SESSIONS_SUMMERY, FREQUENCY_DIS_TARGET } from './query'
import './form.scss'

const { RangePicker } = DatePicker

const parentCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  margin: '7px 10px 0 10px',
  height: 900,
  overflow: 'auto',
}

const tableCardStyle = {
  background: '#F9F9F9',
  height: 800,
  overflow: 'auto',
}

const antcol1 = {
  display: 'block',
  width: '6%',
}



const filterCardStyle = {
  background: '#F1F1F1',
  padding: 10,
  margin: 0,
  height: 50,
  overflow: 'hidden',
  backgroundColor: 'rgb(241, 241, 241)',
}

export default Form.create()(({ studentName, showDrawerFilter }) => {
  const [selectSession, setSelectSession] = useState()
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [range, setRange] = useState([moment(Date.now()).subtract(21, 'days'), moment(Date.now())])
  const [session, setSession] = useState('Morning')
  const studentId = localStorage.getItem('studentId')
  const prevSelectSession = usePrevious(selectSession)
  const [lineDrawer, setLineDrawer] = useState(false)
  const [tableData, setTableData] = useState([])
  const { Option } = Select
  const [graphData, setGraphData] = useState([
    {
      id: 'japan',
      color: 'hsl(159, 70%, 50%)',
      data: [],
    },
  ])
  const [barGraphData, setBarGraphData] = useState([])
  const customStyles = {
    header: {
      style: {
        maxHeight: '50px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: '#ddd',
        backgroundColor: '#f5f5f5',
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#ddd',
        },
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#ddd',
        },
        fontSize: '11px',
      },
    },
    pagination: {
      style: {
        position: 'absolute',
        top: '7px',
        right: '0px',
        borderTopStyle: 'none',
        minHeight: '35px',
      },
    },
    table: {
      style: {
        paddingBottom: '40px',
        top: '40px',
      },
    },
  }

  function formatDuration(ms) {
    const duration = moment.duration(ms)
    let returnVal = ''
    if (duration.asHours() > 1) {
      returnVal =
        Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(':mm:ss')
    } else {
      returnVal = '00:'.concat(moment.utc(duration.asMilliseconds()).format('mm:ss'))
    }
    return returnVal
  }

  const columns = [
    {
      name: 'Date',
      selector: 'sessionDate',
      cell: row => <span>{row.sessionDate ? row.sessionDate : ''}</span>,
      maxWidth: '100px',
    },
    {
      name: 'Session',
      selector: 'sessions',
      cell: row => <span>{row.sessions.sessionName.name}</span>,
      maxWidth: '100px',
    },
    {
      name: 'Duration (HH:MM:SS)',
      selector: 'duration',
      cell: row => <span>{formatDuration(row.duration)}</span>,
      maxWidth: '100px',
    },
    {
      name: 'Percentage Correct',
      selector: 'correctCount',
      cell: row => (
        <span>
          {Number.isNaN(
            (row.correctCount * 100) / (row.correctCount + row.errorCount + row.promptCount),
          )
            ? 0
            : Math.round(
              (row.correctCount * 100) / (row.correctCount + row.errorCount + row.promptCount),
            )}
        </span>
      ),
      maxWidth: '150px',
    },
    {
      name: 'Percentage Incorrect',
      selector: 'errorCount',
      cell: row => (
        <span>
          {Number.isNaN(
            (row.errorCount * 100) / (row.correctCount + row.errorCount + row.promptCount),
          )
            ? 0
            : Math.round(
              (row.errorCount * 100) / (row.correctCount + row.errorCount + row.promptCount),
            )}
        </span>
      ),
      maxWidth: '150px',
    },
    {
      name: 'Percentage Prompt',
      selector: 'promptCount',
      cell: row => (
        <span>
          {Number.isNaN(
            (row.promptCount * 100) / (row.correctCount + row.errorCount + row.promptCount),
          )
            ? 0
            : Math.round(
              (row.promptCount * 100) / (row.correctCount + row.errorCount + row.promptCount),
            )}
        </span>
      ),
      maxWidth: '150px',
    },
    {
      name: 'Behavior count',
      selector: 'behaviour',
      cell: row => <span>{row.behaviour}</span>,
      maxWidth: '150px',
    },
    {
      name: 'Mand Count',
      selector: 'mand',
      cell: row => <span>{row.mand}</span>,
      maxWidth: '150px',
    },
    {
      name: 'Toilet Count',
      selector: 'toilet',
      cell: row => <span>{row.toilet}</span>,
      maxWidth: '100px',
    },
    {
      name: 'Actions',
      cell: row => (
        <span>
          <Button
            type="link"
            onClick={() => setSelectSession(row.id)}
            loading={freDisLoading && selectSession === row.id}
          >
            <LineChartOutlined style={{ fontSize: 30, color: 'rgb(229, 132, 37)' }} />
          </Button>
        </span>
      ),
      maxWidth: '50px',
    },
  ]

  const { data, error, loading } = useQuery(SESSIONS_SUMMERY, {
    variables: {
      studentId,
      startDate: moment(range[0]).format('YYYY-MM-DD'),
      endDate: moment(range[1]).format('YYYY-MM-DD'),
    },
  })

  useEffect(() => {
    if (data && data.sessionSummary) {
      const filterData = data.sessionSummary.filter(
        item => item.sessions.sessionName.name === session,
      )
      setTableData(filterData)
    }
  }, [data])

  const [
    getFreDisTarget,
    { data: freDisData, error: freDisError, loading: freDisLoading },
  ] = useLazyQuery(FREQUENCY_DIS_TARGET, {
    variables: {
      session: selectSession,
      student: studentId,
    },
  })

  useEffect(() => {
    if (session) {
      if (data && data.sessionSummary) {
        const filterData = data.sessionSummary.filter(
          item => item.sessions.sessionName.name === session,
        )
        setTableData(filterData)
      }
    }
  }, [session])

  useEffect(() => {
    if (freDisData) {
      const newGraphData = []
      freDisData.freqDistriTarget.map(({ duration, tarCount }) => {
        newGraphData.push({
          x: duration,
          y: tarCount,
        })
      })

      const gData = []
      const filterData = tableData.filter(item => item.id === selectSession)
      filterData.map(item => {
        gData.push({
          domain: item.sessionDate,
          'Percentage Correct': Number.isNaN(
            (item.correctCount * 100) / (item.correctCount + item.errorCount + item.promptCount),
          )
            ? 0
            : Math.round(
              (item.correctCount * 100) /
              (item.correctCount + item.errorCount + item.promptCount),
            ),
          'Percentage Incorrect': Number.isNaN(
            (item.errorCount * 100) / (item.correctCount + item.errorCount + item.promptCount),
          )
            ? 0
            : Math.round(
              (item.errorCount * 100) / (item.correctCount + item.errorCount + item.promptCount),
            ),
          'Percentage Prompt': Number.isNaN(
            (item.promptCount * 100) / (item.correctCount + item.errorCount + item.promptCount),
          )
            ? 0
            : Math.round(
              (item.promptCount * 100) / (item.correctCount + item.errorCount + item.promptCount),
            ),
        })
      })
      setBarGraphData(gData)
    }
  }, [freDisData])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error to load sessions summery data',
      })
    }
  }, [error])

  useEffect(() => {
    if (freDisError) {
      notification.error({
        message: 'Error to load graph data',
      })
    }
  }, [freDisError])

  useEffect(() => {
    if (selectSession && selectSession !== prevSelectSession) {
      console.log(selectSession)
      getFreDisTarget()
      setLineDrawer(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSession])

  const reduxUser = useSelector(state => state.user)
  console.log('selectSession', selectSession)

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = '_sessions_excel'
    const formattedData = tableData.map(function (e) {
      return {
        Date: e.sessionDate ? e.sessionDate : '',
        Session: e.sessions.sessionName.name,
        Duration_in_HH_MM_SS: formatDuration(e.duration),
        Percentage_Correct: Number.isNaN(
          (e.correctCount * 100) / (e.correctCount + e.errorCount + e.promptCount),
        )
          ? 0
          : Math.round((e.correctCount * 100) / (e.correctCount + e.errorCount + e.promptCount)),
        Percentage_Incorrect: Number.isNaN(
          (e.errorCount * 100) / (e.correctCount + e.errorCount + e.promptCount),
        )
          ? 0
          : Math.round((e.errorCount * 100) / (e.correctCount + e.errorCount + e.promptCount)),
        Percentage_Prompt: Number.isNaN(
          (e.promptCount * 100) / (e.correctCount + e.errorCount + e.promptCount),
        )
          ? 0
          : Math.round((e.promptCount * 100) / (e.correctCount + e.errorCount + e.promptCount)),
        Behavior_count: e.behaviour,
        Mand_Count: e.mand,
        Toilet_Count: e.toilet,
      }
    })

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, studentName + filename + fileExtension)
  }

  const menu = (
    <Menu>
      {/* <Menu.Item key="0">
        <Button onClick={() => exportPDF()} type="link" size="small">
          PDF
        </Button>
      </Menu.Item> */}
      <Menu.Item key="1">
        <Button onClick={() => exportToCSV()} type="link" size="small">
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <Drawer
        visible={lineDrawer}
        onClose={() => setLineDrawer(false)}
        width={900}
        title="Session Graph"
      >
        {selectSession && freDisData && (
          <div style={{ height: 300, marginBottom: 30 }}>

            <ResponsiveBar
              data={barGraphData}
              keys={['Percentage Correct', 'Percentage Incorrect', 'Percentage Prompt']}
              indexBy="domain"
              groupMode="grouped"
              margin={{ top: 50, right: 20, bottom: 20, left: 60 }}
              padding={0.15}
              colors={{ scheme: 'paired' }}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: '#38bcb2',
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: '#eed312',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10,
                },
              ]}
              fill={[
                {
                  match: {
                    id: 'fries',
                  },
                  id: 'dots',
                },
                {
                  match: {
                    id: 'sandwich',
                  },
                  id: 'lines',
                },
              ]}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Percentage',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              // legends={[
              //   {
              //     dataFrom: 'keys',
              //     anchor: 'bottom-right',
              //     direction: 'column',
              //     justify: false,
              //     translateX: 120,
              //     translateY: 0,
              //     itemsSpacing: 2,
              //     itemWidth: 100,
              //     itemHeight: 20,
              //     itemDirection: 'left-to-right',
              //     itemOpacity: 0.85,
              //     symbolSize: 20,
              //     effects: [
              //       {
              //         on: 'hover',
              //         style: {
              //           itemOpacity: 1,
              //         },
              //       },
              //     ],
              //   },
              // ]}
              animate="true"
              motionStiffness={90}
              motionDamping={15}
            />
          </div>
        )}
      </Drawer>

      <Row gutter={[46, 0]}>
        <Col span={24}>
          <Row>
            <Col span={26}>
              <div style={filterCardStyle}>

                <Row>
                  <Col span={1} style={antcol1}>
                    <span style={{ fontSize: '15px', color: '#000' }}>Date :</span>
                  </Col>
                  <Col span={4} style={{ width: 265 }}>
                    <RangePicker
                      style={{
                        marginLeft: 'auto',
                        width: 250,
                      }}
                      size="default"
                      value={range}
                      onChange={v => setRange(v)}
                    />
                  </Col>
                  <Col span={1} style={antcol1}>
                    <span style={{ fontSize: '15px', color: '#000' }}>Session:</span>
                  </Col>
                  <Col span={4} style={{ marginRight: 10 }}>
                    <Select
                      size="default"
                      style={{
                        width: 180,
                        borderRadius: 4,
                      }}
                      placeholder="Filter by session"
                      value={session}
                      onChange={v => setSession(v)}
                    >
                      <Option key="1" value="Morning">
                        Morning
                        </Option>
                      <Option key="2" value="Afternoon">
                        Afternoon
                        </Option>
                      <Option key="3" value="Evining">
                        Evening
                        </Option>
                    </Select>
                  </Col>
                  <Col span={1}>
                    <Dropdown overlay={menu} trigger={['click']}>
                      <Button style={{ marginRight: '10px' }} type="link" size="large">
                        <CloudDownloadOutlined />{' '}
                      </Button>
                    </Dropdown>
                  </Col>
                </Row>

              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div style={parentCardStyle}>
                <div style={tableCardStyle}>
                  <DataTable
                    columns={columns}
                    loading={loading}
                    theme="default"
                    dense="true"
                    pagination="true"
                    data={tableData}
                    customStyles={customStyles}
                    noHeader="true"
                    width="100px"
                    paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
})
