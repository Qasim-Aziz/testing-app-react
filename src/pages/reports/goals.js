/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */
/* eslint-disable object-shorthand */

import React from 'react'
import { Helmet } from 'react-helmet'
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Tabs,
  Form,
  DatePicker,
  Collapse,
  Steps,
  Table,
  Tooltip,
  Select,
  Dropdown,
  Menu,
} from 'antd'
import html2canvas from 'html2canvas'
import { FilterOutlined, PlusOutlined, CloudDownloadOutlined } from '@ant-design/icons'
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

const { Option } = Select

const parentCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  margin: '7px 10px 0 10px',
  height: 300,
  overflow: 'hidden',
}

const tableparentCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  margin: '7px 0 0 10px',
  height: 500,
  overflow: 'auto',
}

const filterCardStyle = {
  background: '#F1F1F1',
  padding: 10,
  margin: 0,
  height: 50,
  overflow: 'hidden',
  backgroundColor: 'rgb(241, 241, 241)',
}

const tableCardStyle = {
  background: '#F9F9F9',
  height: 450,
  overflow: 'auto',
}

const antcol1 = {
  display: 'block',
  width: '6%',
}

const antcol2 = {
  display: 'block',
  width: '11%',
}

const antcol3 = {
  display: 'block',
  width: '15%',
}

const columns = [
  {
    title: 'Goal Name',
    dataIndex: 'goalName',
    key: 'goalName',
    maxWidth: '300px',
    color: 'red',
    render(text, record) {
      return {
        props: {
          style: { color: record.isLongTermGoal ? '#f080b8' : 'balck' },
        },
        children: <div>{text}</div>,
      }
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    maxWidth: '300px',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    maxWidth: '50px',
  },
  {
    title: 'Responsibility',
    dataIndex: 'responsibility',
    key: 'responsibility',
    maxWidth: '130px',
  },
  {
    title: 'Program Area',
    dataIndex: 'program',
    key: 'program',
    maxWidth: '130px',
  },
  {
    title: 'Created',
    dataIndex: 'dateInitialted',
    key: 'dateInitialted',
    maxWidth: '50px',
  },
  {
    title: 'End',
    dataIndex: 'dateEnd',
    key: 'dateEnd',
    maxWidth: '50px',
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
      tableData: [],
      allGraphData: null,
      allTableData: [],
      data: null,
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
            console.log(item)
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
    // console.log('onChange:', current);
    this.setState({ current })
  }

  typeCallback = type => {
    this.prepareData(this.state.data, type)
    this.setState({
      typeSelected: type,
    })
  }

  StatusCallback = status => {
    console.log('status', status)
    if (status) {
      let filteredGraphData = []
      if (this.state.allGraphData) {
        filteredGraphData = this.state.allGraphData.filter(item => item.label === status)
      }
      console.log('filteredGraphData', filteredGraphData)
      let filteredTableData = []
      if (this.state.allTableData) {
        filteredTableData = this.state.allTableData.filter(item => item.status === status)
      }
      console.log('filteredTableData', filteredTableData)
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
                  name
                }
                program{
                  name
                }
                goalStatus {
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
                        name
                      }
                      goalStatus {
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
    console.log('tableDataObj', tableDataObj)
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
    this.setState({
      graphData: gData,
      allGraphData: gData,
      tableData: tableDataObj,
      allTableData: tableDataObj,
      statusselected: null,
      data: data,
    })
  }

  render() {
    const {
      student: { StudentName },
      
    } = this.props

    const {
      loading,
      goalStatus,
      
      statusselected,
      graphData,
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
      console.log('tableData', tableData)
      const filename = '_goals_excel'
      const formattedData = tableData.map(function (e) {
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
      <>
        <Row>
          <Col sm={24}>
           
            <Row>
              <Col span={26}>
                <div style={filterCardStyle}>
                  
                    <Row>
                      <Col span={1} style={antcol2}>
                        <span style={{ fontSize: '15px', color: '#000' }}>Goal Status :</span>
                      </Col>
                      <Col span={3} style={{ marginRight: 10 }}>
                        <Tooltip placement="topRight" title="Click here to select goal status">
                          <Select
                            placeholder="ALL"
                            onChange={this.StatusCallback}
                            defaultValue={statusselected}
                            style={{
                              width: 120,
                              borderRadius: 4,
                              marginRight: 20,
                            }}
                            allowClear
                            size="small"
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
                      </Col>
                      <Col span={1} style={antcol2}>
                        <span style={{ fontSize: '15px', color: '#000' }}>Goal Type :</span>
                      </Col>
                      <Col span={6} style={{ marginRight: 10 }}>
                        <Tooltip placement="topRight" title="Click here to select goal type">
                          <Select
                            placeholder="ALL"
                            onChange={this.typeCallback}
                            defaultValue={typeSelected}
                            style={{
                              width: 120,
                              borderRadius: 4,
                              marginRight: 20,
                            }}
                            size="small"
                            showSearch
                            optionFilterProp="name"
                          >
                            <Option value="1" name="Long Term">
                              Long Term
                            </Option>
                            <Option value="2" name="Shor Term">
                              Short Term
                            </Option>
                          </Select>
                        </Tooltip>
                      </Col>

                      

                      <Col span={2}>
                        <Dropdown overlay={menu} trigger={['click']}>
                          <Button style={{ marginRight: '10px' }} type="link" size="large">
                            <CloudDownloadOutlined />{' '}
                          </Button>
                        </Dropdown>
                      </Col>
                      <Col span={2} style={antcol1}>
                        <div
                          style={{
                            background: '#f080b8',
                            borderRadius: 10,
                            width: 50,
                            height: 18,
                            marginTop: 5
                          }}
                        />
                      </Col>
                      <Col span={1} style={antcol3}>
                        <span style={{ fontSize: '15px', color: '#000' }}>Long Term Goal</span>
                      </Col>

                    </Row>

                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div style={parentCardStyle}>
                  <div
                    role="presentation"
                    style={{
                      borderRadius: 10,
                      border: '2px solid #F9F9F9',
                      // padding: '28px 27px 20px',
                      display: 'block',
                      // marginLeft: '10px',
                      width: '100%',
                      height: '250px',
                      overflowY: 'hidden',
                    }}
                  >
                    {graphData && graphData.length > 0 && (
                      <ResponsivePie
                        data={graphData}
                        margin={{ top: 30, right: 0, bottom: 0, left: 0 }}
                        innerRadius={0.5}
                        padAngle={2}
                        cornerRadius={3}
                        colors={{ scheme: 'paired' }}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        radialLabel={function (e) {
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
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={parentCardStyle}>
                  <div
                    role="presentation"
                    style={{
                      borderRadius: 10,
                      border: '2px solid #F9F9F9',
                      display: 'block',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {graphData && graphData.length > 0 && (
                      <ResponsiveBar
                        data={graphData}
                        keys={['value']}
                        indexBy="label"
                        margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
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
                          legend: 'Number of goals',
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
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div style={tableparentCardStyle}>
                  <div style={tableCardStyle}>
                    {/* <DataTable
                      columns={columns}
                      theme="default"
                      dense={true}
                      pagination={true}
                      data={tableData}
                      customStyles={customStyles}
                      noHeader={true}
                      width="100px"
                      paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
                    /> */}
                    <Table
                      columns={columns}
                      dataSource={tableData}
                      bordered
                      loading={loading}
                      scroll={{ x: 'max-content', y: 340 }}
                      pagination={{ pageSize: 50 }}
                      size="small"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    )
  }
}

export default Form.create()(Goals)
