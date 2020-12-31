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
import { Helmet } from 'react-helmet'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Tabs,
  Icon,
  Affix,
  Drawer,
  Form,
  DatePicker,
} from 'antd'
import { Redirect } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import moment from 'moment'
import DurationGraph from './duration'
import FrequencyGraph from './frequency'
import client from '../../apollo/config'

const { Title, Text } = Typography
const { Content } = Layout
const { RangePicker } = DatePicker
const { TabPane } = Tabs

@connect(({ user, student }) => ({ user, student }))
class Screeing extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      behaviorList: [],
      loading: true,
      selectedBehavior: '',
      startDate: moment().subtract(30, 'days'),
      endDate: moment(),
      componentsKey: Math.random(),
      visible: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'student/STUDENT_DETAILS',
    })

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
        this.setState({
          behaviorList: result.data.getTemplate.edges,
          loading: false,
        })
      })
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
    const cardStyle = {
      background: '#FFFFFF',
      border: '1px solid #E4E9F0',
      boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
      borderRadius: 10,
      padding: '16px 12px',
      alignItems: 'center',
      display: 'block',
      width: '100%',
      marginBottom: '20px',
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
      padding: '16px 12px',
      alignItems: 'center',
      display: 'block',
      width: '100%',
      marginBottom: '20px',
      lineHeight: '27px',
      // minHeight: '130px',
    }

    const textStyle = {
      fontSize: '14px',
      lineHeight: '19px',
      fontWeight: 600,
      display: 'block',
    }

    const titleStyle = {
      fontSize: '20px',
      lineHeight: '27px',
      marginTop: '5px',
    }

    const selectedTextStyle = {
      fontSize: '14px',
      lineHeight: '19px',
      fontWeight: 600,
      color: '#fff',
    }

    const selectedTitleStyle = {
      fontSize: '20px',
      lineHeight: '27px',
      marginTop: '5px',
      color: '#fff',
    }

    const {
      form,
      student: { StudentName },
    } = this.props
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
    console.log(behaviorList)

    const studId = localStorage.getItem('studentId')
    if (!studId) {
      return <Redirect to="/" />
    }

    return (
      <>
        <Helmet title="Behavior Graph" />
        <Layout style={{ padding: '0px' }}>
          <span style={{ float: 'right' }}>
            <Affix offsetTop={100} offsetRight={100} style={{ position: 'absolute', right: 0 }}>
              <Button type="primary" onClick={this.showDrawer} style={{ borderRadius: 0 }}>
                <Icon type="double-left" />
              </Button>
            </Affix>
          </span>
          <Content
            style={{
              padding: '0px 20px',
              maxWidth: 1300,
              width: '100%',
              margin: '0px auto',
            }}
          >
            <Row>
              <Col sm={8}>
                <div
                  style={{
                    background: '#F9F9F9',
                    borderRadius: 10,
                    padding: '28px 27px 20px',
                    display: 'block',
                    width: '100%',
                    minHeight: '650px',
                    marginRight: '10px',
                  }}
                >
                  <Title style={{ fontSize: '20px', lineHeight: '20px' }}>
                    {StudentName}&apos;s Behaviors
                  </Title>
                  <div style={{ height: '600px', overflow: 'auto' }}>
                    {behaviorList.map(item => (
                      <div
                        style={selectedBehavior === item.node.id ? selectedCardStyle : cardStyle}
                        onClick={() => this.loadGraph(item.node.id)}
                      >
                        {/* <Text style={textStyle}>{item.node.behavior.behaviorName}</Text> */}
                        <Title
                          style={{
                            fontSize: '20px',
                            lineHeight: '12px',
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
              <Col sm={16}>
                <div
                  role="presentation"
                  style={{
                    borderRadius: 10,
                    border: '2px solid #F9F9F9',
                    padding: '20px 27px 20px',
                    marginBottom: '2%',
                    display: 'block',
                    marginLeft: '10px',
                    width: '100%',
                    height: '650px',
                    overflow: 'auto',
                  }}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <Icon type="pie-chart" />
                          Duration
                        </span>
                      }
                      key="1"
                    >
                      <div>
                        <DurationGraph
                          key={componentsKey}
                          startDate={startDate}
                          endDate={endDate}
                          selectedBehavior={selectedBehavior}
                        />
                      </div>
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <Icon type="bar-chart" />
                          Frequency
                        </span>
                      }
                      key="2"
                    >
                      <div>
                        <FrequencyGraph
                          key={componentsKey}
                          startDate={startDate}
                          endDate={endDate}
                          selectedBehavior={selectedBehavior}
                        />
                      </div>
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <Icon type="diff" />
                          IRT
                        </span>
                      }
                      key="3"
                    >
                      <div>3</div>
                    </TabPane>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
        <Drawer
          title="Graph & Report Filters"
          placement="right"
          width={450}
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form name="targetForm">
            <Form.Item label="Date">
              {form.getFieldDecorator('Date', {
                initialValue: [startDate, endDate],
                rules: [{ required: true, message: 'Please select Date' }],
              })(<RangePicker onChange={this.dateChange} allowClear size="large" />)}
            </Form.Item>
            <Button
              type="primary"
              // htmlType="submit"
              onClick={this.onClose}
              style={{ marginTop: 15, fontSize: 16, width: '100%', height: 40 }}
            >
              Submit
            </Button>
          </Form>
        </Drawer>
      </>
    )
  }
}

export default Form.create()(Screeing)
