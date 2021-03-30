/* eslint-disable */

import React from 'react'
import {
  Row,
  Col,
  Button,
  Form,
  notification,
  Table,
  Tooltip,
  Select,
  Dropdown,
  Menu,
  Spin,
  Radio,
} from 'antd'
import html2canvas from 'html2canvas'
import { FaDownload } from 'react-icons/fa'
import JsPDF from 'jspdf'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import Moment from 'moment'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import groupObj from '@hunters/group-object'
import './table.scss'
import client from '../../apollo/config'
import { COLORS } from 'assets/styles/globalStyles'

const { Option } = Select

const parentCardStyle = {
  background: COLORS.palleteLight,
  borderRadius: 10,
  padding: '10px',
  margin: '10px 5px 0 10px',
  height: 300,
  overflow: 'hidden',
}

const columns = [
  {
    title: 'Goal Name',
    dataIndex: 'goalName',
    key: 'goalName',
    render(text, record) {
      return {
        props: {
          style: { color: record.isLongTermGoal ? COLORS.stimulus : 'black', display: 'flex' },
        },
        children: <div>{text}</div>,
      }
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Program Area',
    dataIndex: 'program',
    key: 'program',
    width: '160px',
  },
  {
    title: 'Responsibility',
    dataIndex: 'responsibility',
    key: 'responsibility',
    width: '140px',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '140px',
  },
  {
    title: 'Created',
    dataIndex: 'dateInitialted',
    key: 'dateInitialted',
    width: '120px',
  },
  {
    title: 'End',
    dataIndex: 'dateEnd',
    key: 'dateEnd',
    width: '120px',
  },
]

@connect(({ user, student, learnersprogram }) => ({ user, student, learnersprogram }))
class Goals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      current: 0,
      graphstartdate: Moment(Date.now())
        .subtract(21, 'days')
        .format('YYYY-MM-DD')
        .toString(),
      graphenddate: Moment(Date.now())
        .format('YYYY-MM-DD')
        .toString(),
      goalStatus: [],
      selectTargetArea: 0,
      programArea: [],
      defaultprogram: '',
      domainObj: [],
      key: 0,
      statusselected: 'ALL',
      typeSelected: '1',
      barKey: 20,
      visibleFilter: false,
      graphData: null,
      barGraphData: null,
      tableData: [],
      allGraphData: null,
      allTableData: [],
      data: null,
      isDataLoading: true,
    }
  }

  componentDidMount() {
    const studentId = localStorage.getItem('studentId')
    client
      .query({
        query: gql`
          {
            goalStatus {
              id
              status
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .then(result => {
        const goalsStatus = []
        if (result.data.goalStatus && result.data.goalStatus.length > 0) {
          result.data.goalStatus.map(item => {
            if (goalsStatus.indexOf(item.status) === -1) {
              goalsStatus.push(item.status)
            }
            return goalsStatus
          })
          this.setState({
            goalStatus: goalsStatus,
          })
        }
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      })

    this.fetchData(studentId)
  }

  componentDidUpdate(prevProps) {
    const { selectedStudentId } = this.props
    const studentId = localStorage.getItem('studentId')
    if (selectedStudentId != prevProps.selectedStudentId) {
      this.fetchData(studentId)
    }
  }

  onChange = current => {
    this.setState({ current })
  }

  typeCallback = type => {
    this.prepareData(this.state.data, type.target.value)
    this.setState({
      typeSelected: type.target.value,
    })
  }

  StatusCallback = status => {
    if (status) {
      let filteredGraphData = []
      if (this.state.allGraphData) {
        filteredGraphData = this.state.allGraphData.filter(item => item.label === status)
      }
      let filteredTableData = []
      if (this.state.allTableData) {
        filteredTableData = this.state.allTableData.filter(item => item.status === status)
      }
      this.setState({
        statusselected: status,
        graphData: filteredGraphData,
        tableData: filteredTableData,
      })
    } else {
      this.setState({
        statusselected: status,
        graphData: this.state.allGraphData,
        tableData: this.state.allTableData,
      })
    }
  }

  fetchData(selectedStudentId) {
    console.log('studentId', selectedStudentId)
    client
      .query({
        query: gql`{
          longTerm(student: ${selectedStudentId}) {
            edges {
              node {
                id
                goalName
                description
                dateInitialted
                dateEnd
                responsibility {
                  id
                  name
                }
                program{
                  id
                  name
                }
                goalStatus {
                  id
                  status
                }
                shorttermgoalSet{
                  edges {
                    node {
                      id
                      goalName
                      dateInitialted
                      dateEnd
                      description
                      responsibility {
                        id
                        name
                      }
                      goalStatus {
                        id
                        status
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
        fetchPolicy: 'network-only',
      })
      .then(result => {
        this.prepareData(result.data, this.state.typeSelected)
      })
      .catch(error => {
        this.setState({
          isDataLoading: false,
        })
        notification.error({
          message: 'Failed to fetch data',
        })
      })
  }

  prepareData(data, selectedType) {
    const tableDataObj = []

    if (data.longTerm.edges && data.longTerm.edges.length > 0) {
      data.longTerm.edges.map(item => {
        if (selectedType === '1') {
          const shorttermGoals = []
          if (item.node.shorttermgoalSet.edges && item.node.shorttermgoalSet.edges.length > 0) {
            item.node.shorttermgoalSet.edges.map(shortTermGoal => {
              shorttermGoals.push({
                key: shortTermGoal.node.id,
                goalName: shortTermGoal.node.goalName,
                description: shortTermGoal.node.description,
                dateInitialted: shortTermGoal.node.dateInitialted,
                dateEnd: shortTermGoal.node.dateEnd,
                responsibility: shortTermGoal.node.responsibility?.name,
                status: shortTermGoal.node.goalStatus?.status,
                program: item.node.program?.name,
                isLongTermGoal: false,
              })
              return shorttermGoals
            })
          }
          if (shorttermGoals && shorttermGoals.length > 0) {
            tableDataObj.push({
              key: item.node.id,
              goalName: item.node.goalName,
              description: item.node.description,
              dateInitialted: item.node.dateInitialted,
              dateEnd: item.node.dateEnd,
              responsibility: item.node.responsibility?.name,
              status: item.node.goalStatus?.status,
              program: item.node.program?.name,
              isLongTermGoal: true,
              children: shorttermGoals,
            })
          } else {
            tableDataObj.push({
              key: item.node.id,
              goalName: item.node.goalName,
              description: item.node.description,
              dateInitialted: item.node.dateInitialted,
              dateEnd: item.node.dateEnd,
              responsibility: item.node.responsibility?.name,
              status: item.node.goalStatus?.status,
              program: item.node.program?.name,
              isLongTermGoal: true,
            })
          }
        } else {
          item.node.shorttermgoalSet.edges.map(shortTermGoal => {
            tableDataObj.push({
              key: shortTermGoal.node.id,
              goalName: shortTermGoal.node.goalName,
              description: shortTermGoal.node.description,
              dateInitialted: shortTermGoal.node.dateInitialted,
              dateEnd: shortTermGoal.node.dateEnd,
              responsibility: shortTermGoal.node.responsibility?.name,
              status: shortTermGoal.node.goalStatus?.status,
              program: item.node.program?.name,
              isLongTermGoal: false,
            })
            return tableDataObj
          })
        }
        return tableDataObj
      })
    }

    const groupedData = groupObj.group(tableDataObj, 'status')
    let keys = []
    const gData = []
    keys = Object.keys(groupedData)
    keys.map((status, index) => {
      if (groupedData[status]?.length > 0) {
        gData.push({
          id: status,
          label: status,
          value: groupedData[status].length,
        })
      } else {
        gData.push({ id: status, label: status, value: 0 })
      }
      return gData
    })
    let barGraphData
    if (gData)
      barGraphData = gData.map((item, index) => {
        return { [item.label]: item.value, id: item.label }
      })
    this.setState({
      graphData: gData,
      allGraphData: gData,
      barGraphData,
      tableData: tableDataObj,
      allTableData: tableDataObj,
      statusselected: null,
      data: data,
      isDataLoading: false,
    })
  }

  render() {
    const {
      student: { StudentName },
    } = this.props

    const {
      isDataLoading,
      goalStatus,
      statusselected,
      graphData,
      barGraphData,
      tableData,
      typeSelected,
    } = this.state

    const pxToMm = px => {
      return Math.floor(px / document.getElementById('capture').offsetHeight)
    }

    const exportPDF = () => {
      const input = document.getElementById('capture')
      const inputHeightMm = pxToMm(input.offsetHeight)
      const a4WidthMm = 210
      const a4HeightMm = 297
      const numPages = inputHeightMm <= a4HeightMm ? 1 : Math.floor(inputHeightMm / a4HeightMm) + 1
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        if (inputHeightMm > a4HeightMm) {
          // elongated a4 (system print dialog will handle page breaks)
          const pdf = new JsPDF('p', 'mm', [inputHeightMm + 16, a4WidthMm])
          pdf.addImage(imgData, 'PNG', 0, 0)
          pdf.save(`test.pdf`)
        } else {
          // standard a4
          const pdf = new JsPDF()
          pdf.addImage(imgData, 'PNG', 0, 0)
          pdf.save(`test.pdf`)
        }
      })
    }

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const exportToCSV = () => {
      const filename = '_goals_excel'
      const formattedData = tableData.map(function(e) {
        return {
          Goal_Name: e.goalName,
          Description: e.description,
          Status: e.status,
          Responsibility: e.responsibility,
          Program_Area: e.program,
          Created: e.dateInitialted,
          End: e.dateEnd,
        }
      })

      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const excelData = new Blob([excelBuffer], { type: fileType })
      FileSaver.saveAs(excelData, StudentName + filename + fileExtension)
    }

    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Button onClick={() => exportToCSV()} type="link" size="small">
            CSV/Excel
          </Button>
        </Menu.Item>
        {/* <Menu.Item key="2">
          <Button onClick={() => exportPDF()} type="link" size="small">
            Pdf
          </Button>
        </Menu.Item> */}
      </Menu>
    )

    const filterCardStyle = {
      background: COLORS.palleteLight,
      display: 'flex',
      flexWrap: 'wrap',
      padding: '5px 10px',
      margin: 0,
      height: 'fit-content',
      overflow: 'hidden',
    }

    const parentDiv = { display: 'flex', margin: '5px 30px 5px 0' }
    const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

    return (
      <>
        <div style={filterCardStyle}>
          <div style={parentDiv}>
            <span style={parentLabel}>Goal Status :</span>
            <Tooltip placement="topRight" title="Click here to select goal status">
              <Select
                placeholder="ALL"
                onChange={this.StatusCallback}
                defaultValue={statusselected}
                style={{
                  width: 150,
                  borderRadius: 4,
                  marginRight: 20,
                }}
                allowClear
                showSearch
                optionFilterProp="name"
              >
                {goalStatus &&
                  goalStatus.map(node => {
                    return (
                      <Option key={node} value={node} name={node}>
                        {node}
                      </Option>
                    )
                  })}
              </Select>
            </Tooltip>
          </div>
          <div style={parentDiv}>
            <span style={parentLabel}>Goal Type :</span>
            <Radio.Group
              size="small"
              style={{ margin: 'auto 0' }}
              value={typeSelected}
              onChange={this.typeCallback}
              buttonStyle="solid"
            >
              <Radio.Button value="1">Long Term</Radio.Button>
              <Radio.Button value="2">Short Term</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ ...parentDiv }}>
            <span style={parentLabel}>Long Term Goal</span>
            <div
              style={{
                background: COLORS.stimulus,
                margin: 'auto 0',
                borderRadius: 10,
                width: 20,
                height: 18,
              }}
            />
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Dropdown overlay={menu} trigger={['hover']}>
              <Button type="link" style={{ padding: '0 8px' }} size="large">
                <FaDownload fontSize={22} />{' '}
              </Button>
            </Dropdown>
          </div>
        </div>
        <Row id="capture">
          <Col span={12}>
            <div style={parentCardStyle}>
              <div
                role="presentation"
                style={{
                  borderRadius: 10,
                  border: '2px solid #F9F9F9',
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  overflowY: 'hidden',
                }}
              >
                {graphData ? (
                  <ResponsivePie
                    data={graphData}
                    margin={{ top: 15, right: 0, bottom: 30, left: 0 }}
                    innerRadius={0.5}
                    padAngle={2}
                    cornerRadius={3}
                    colors={{ scheme: 'paired' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    radialLabel={function(e) {
                      return e.label + ' (' + e.value + ')'
                    }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkOffset={0}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsLinkColor={{ from: 'color' }}
                    slicesLabelsSkipAngle={10}
                    slicesLabelsTextColor="#333333"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    defs={[
                      {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true,
                      },
                      {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10,
                      },
                    ]}
                    legends={[
                      {
                        anchor: 'right',
                        direction: 'column',
                        translateY: 10,
                        translateX: -1,
                        itemWidth: 100,
                        itemHeight: 25,
                        itemTextColor: '#999',
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                          {
                            on: 'hover',
                            style: {
                              itemTextColor: '#000',
                            },
                          },
                        ],
                      },
                    ]}
                  />
                ) : (
                  <Spin style={{ margin: 'auto' }} />
                )}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ ...parentCardStyle, marginRight: 0, marginLeft: '5px' }}>
              <div
                role="presentation"
                style={{
                  borderRadius: 10,
                  border: '2px solid #F9F9F9',
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                }}
              >
                {graphData && graphData.length > 0 ? (
                  <ResponsiveBar
                    data={barGraphData}
                    indexBy="id"
                    keys={['In Progress', 'On Hold', 'Discontinued']}
                    margin={{ top: 15, right: 20, bottom: 30, left: 60 }}
                    padding={0.15}
                    colors={{ scheme: 'paired' }}
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
                      legend: 'Number of goals',
                      legendPosition: 'middle',
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                  />
                ) : (
                  <Spin style={{ margin: 'auto' }} />
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="goal-table" span={24}>
            <Table
              columns={columns}
              dataSource={tableData}
              bordered
              style={{ margin: '10px 0 15px 10px' }}
              loading={isDataLoading}
              size="middle"
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                position: 'top',
              }}
            />
          </Col>
        </Row>
      </>
    )
  }
}

export default Form.create()(Goals)
