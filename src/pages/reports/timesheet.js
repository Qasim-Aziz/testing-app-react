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
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */

import React from 'react'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Tabs,
  Form,
  DatePicker,
  Menu,
  Dropdown,
} from 'antd'
import { FilterOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import { gql } from 'apollo-boost'
import moment from 'moment'
import FrequencyDurationGraph from './frequencyDuration'
import client from '../../apollo/config'
// import AttendanceBar from './AttendanceBar'
import DataTable from 'react-data-table-component'

const { Title, Text } = Typography
const { Content } = Layout
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const parentCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  margin: '7px 10px 0 10px',
  height: 500,
  overflow: 'hidden',
}

const filterCardStyle = {
  background: '#F1F1F1',
  padding: 10,
  margin: 0,
  height: 50,
  overflow: 'hidden',
  backgroundColor: 'rgb(241, 241, 241)',
}
const antcol1 = {
  display: 'block',
  width: '6%',
}

const antcol3 = {
  display: 'block',
  width: '88%',
}

class Att extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      therapistList: [],
      loading: true,
      selectedTherapist: '',
      startDate: moment().subtract(21, 'days'),
      endDate: moment(),
      componentsKey: Math.random(),
      visible: false,
      tableData:[]
    }
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          query {
              staffs {
                  edges {
                      node {
                          id
                          name
                      }
                  }
              }
          }
        `
      })
      .then(result => {
        console.log('result.data.getTemplate.edges', result.data.staffs.edges)
        this.setState({
          therapistList: result.data.staffs.edges,
          loading: false,
        })
      })
  }

  componentDidUpdate(prevProps) {
    const { selectedStudentId } = this.props
    if (selectedStudentId != prevProps.selectedStudentId) {
      client
        .query({
          query: gql`
            query {
              staffs {
                  edges {
                      node {
                          id
                          name
                      }
                  }
              }
          }
          `
        })
        .then(result => {
          // console.log('result.data.getTemplate.edges', result.data.staffs.edges)
          this.setState({
            therapistList: result.data.staffs.edges,
            loading: false,
          })
        })
    }
  }

  loadGraph = id => {
    this.setState({
      selectedTherapist: id,
      componentsKey: Math.random(),
    })
    if (id) {
      // alert(moment(this.state.startDate).format('YYYY-MM-DD'))
      client
        .query({
          query: gql`
            query($dateGte:Date!, $dateLte:Date!, $therapist:ID!){
              timesheetReport(dateGte:$dateGte, dateLte:$dateLte, therapist:$therapist){
                  date
                  hours
                  appList{
                      id
                      title
                      start
                      end
                  }
                  workList{
                      id
                      checkIn
                      checkOut
                  }
              }
          }
          `,
          variables:{
            dateGte:moment(this.state.startDate).format('YYYY-MM-DD'),
            dateLte:moment(this.state.endDate).format('YYYY-MM-DD'),
            therapist:id
          }
        })
        .then(result => {
          this.setState({
            tableData: result.data.timesheetReport,
            loading: false,
          })
        })
    }
  }

  dateChange = dateRange => {
    // alert()
    this.setState({
      startDate: dateRange[0],
      endDate: dateRange[1],
      componentsKey: Math.random(),
    })
    if(dateRange){
      client
        .query({
          query: gql`
            query($dateGte:Date!, $dateLte:Date!, $therapist:ID!){
              timesheetReport(dateGte:$dateGte, dateLte:$dateLte, therapist:$therapist){
                  date
                  hours
                  appList{
                      id
                      title
                      start
                      end
                  }
                  workList{
                      id
                      checkIn
                      checkOut
                  }
              }
          }
          `,
          variables:{
            dateGte:moment(dateRange[0]).format('YYYY-MM-DD'),
            dateLte:moment(dateRange[1]).format('YYYY-MM-DD'),
            therapist:this.state.selectedTherapist
          }
        })
        .then(result => {
          this.setState({
            tableData: result.data.timesheetReport,
            loading: false,
          })
        })
    }
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const behaviorCardStyle = {
      background: '#FFFFFF',
      border: '1px solid #E4E9F0',
      boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
      borderRadius: 10,
      padding: '11px 0px 5px 9px',
      alignItems: 'center',
      display: 'block',
      width: '100%',
      marginBottom: '4px',
      lineHeight: '27px',
      curser: 'pointer',
      // minHeight: '130px',
    }

    const selectedCardStyle = {
      background: '#E58425',
      border: '1px solid #E4E9F0',
      color: '#fff',
      boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
      borderRadius: 10,
      padding: '11px 0px 5px 9px',
      alignItems: 'center',
      display: 'block',
      width: '100%',
      marginBottom: '4px',
      lineHeight: '27px',
      // minHeight: '130px',
    }
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
    const { form, studentName } = this.props
    const {
      therapistList,
      loading,
      selectedTherapist,
      startDate,
      endDate,
      componentsKey,
      tableData
    } = this.state
    // alert(startDate);
    if (loading) {
      return 'Loading...'
    }

    const exportToCSV = () => {
      this.report.exportToCSV(studentName)
    }

  const columns = [
    {
      name: 'Date',
      selector: 'date',
      cell: row => <span>{row && row.date ? row.date : ''}</span>,
      // maxWidth: '100px',
    },
    {
      name: 'Hours',
      selector: 'hours',
      cell: row => <span>{row && row.hours ? row.hours : '0'}</span>,
      // maxWidth: '100px',
    }
  ]
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
                    <Col span={1} style={antcol1}>
                      <span style={{ fontSize: '15px', color: '#000' }}>Date :</span>
                    </Col>
                    <Col span={4} style={antcol3}>
                      <RangePicker
                        style={{
                          marginLeft: 'auto',
                          width: 250,
                          marginRight: 31,
                        }}
                        size="default"
                        defaultValue={[
                          moment(startDate, 'YYYY-MM-DD'),
                          moment(endDate, 'YYYY-MM-DD'),
                        ]}
                        onChange={this.dateChange}
                      />
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
              <Col span={5}>
                <div style={parentCardStyle}>
                  <div id="capture" style={behaviorCardStyle}>
                    {therapistList.map(item => (
                      <div key="1234"
                        style={
                          selectedTherapist === item.node.id ? selectedCardStyle : behaviorCardStyle
                        }
                        onClick={() => this.loadGraph(item.node.id)}
                      >
                        {/* <Text style={textStyle}>{item.node.behavior.behaviorName}</Text> */}
                        <Title
                          style={{
                            fontSize: '14px',
                            lineHeight: '5px',
                            display: 'block',
                            width: '100%',
                          }}
                        >
                          {item.node.name}
                        </Title>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

              <Col span={19}>
                  <div style={parentCardStyle}>
                    <DataTable
                      columns={columns}
                      // loading={loading}
                      noHeader="true"
                      theme="default"
                      data={tableData}
                      customStyles={customStyles}
                      width="100px"
                    />
                  </div>
                </Col>

            </Row>
          </Col>
        </Row>
      </>
    )
  }
}

export default Form.create()(Att)
