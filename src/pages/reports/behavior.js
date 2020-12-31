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

class Screeing extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      behaviorList: [],
      loading: true,
      selectedBehavior: '',
      startDate: moment().subtract(21, 'days'),
      endDate: moment(),
      componentsKey: Math.random(),
      visible: false,
    }
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          query getTemplate($studentId: ID!) {
            getTemplate(student: $studentId) {
              edges {
                node {
                  id
                  behavior {
                    id
                    behaviorName
                    definition
                  }
                  status {
                    id
                    statusName
                  }
                  environment {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                  behaviorDescription
                }
              }
            }
          }
        `,
        variables: {
          studentId: localStorage.getItem('studentId'),
        },
      })
      .then(result => {
        console.log('result.data.getTemplate.edges', result.data.getTemplate.edges)
        this.setState({
          behaviorList: result.data.getTemplate.edges,
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
            query getTemplate($studentId: ID!) {
              getTemplate(student: $studentId) {
                edges {
                  node {
                    id
                    behavior {
                      id
                      behaviorName
                      definition
                    }
                    status {
                      id
                      statusName
                    }
                    environment {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                    behaviorDescription
                  }
                }
              }
            }
          `,
          variables: {
            studentId: localStorage.getItem('studentId'),
          },
        })
        .then(result => {
          console.log('result.data.getTemplate.edges', result.data.getTemplate.edges)
          this.setState({
            behaviorList: result.data.getTemplate.edges,
            loading: false,
          })
        })
    }
  }

  loadGraph = id => {
    this.setState({
      selectedBehavior: id,
      componentsKey: Math.random(),
    })
  }

  dateChange = dateRange => {
    this.setState({
      startDate: dateRange[0],
      endDate: dateRange[1],
      componentsKey: Math.random(),
    })
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

    const { form, studentName } = this.props
    const {
      behaviorList,
      loading,
      selectedBehavior,
      startDate,
      endDate,
      componentsKey,
    } = this.state
    if (loading) {
      return 'Loading...'
    }

    const exportToCSV = () => {
      this.report.exportToCSV(studentName)
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
                    {behaviorList.map(item => (
                      <div
                        style={
                          selectedBehavior === item.node.id ? selectedCardStyle : behaviorCardStyle
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
                          {item.node.behavior.behaviorName}
                        </Title>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              <Col span={19}>
                <div style={parentCardStyle}>
                  <FrequencyDurationGraph
                    ref={instance => {
                      this.report = instance
                    }}
                    key={componentsKey}
                    startDate={startDate}
                    endDate={endDate}
                    selectedBehavior={selectedBehavior}
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

export default Form.create()(Screeing)
