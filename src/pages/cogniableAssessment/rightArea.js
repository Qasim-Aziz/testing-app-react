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

import React from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Drawer,
  Tabs,
  Popconfirm,
  Icon,
  notification,
  Modal,
  Layout,
  Table,
  Tooltip,
} from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import DataTable from 'react-data-table-component'
import { PlusOutlined, PlayCircleOutlined, FilterOutlined } from '@ant-design/icons'
import LearnerSelect from 'components/LearnerSelect'
import AssessmentForm from './AssessmentForm'
import CogniAbleTargets from './CogniAbleTargets'
import apolloClient from '../../apollo/config'

const { Title, Text } = Typography
const { Content } = Layout
const { TabPane } = Tabs
const { confirm } = Modal
const customStyles = {
  title: {
    style: {
      fontSize: '15px',
    },
  },
  header: {
    style: {
      minHeight: '30px',
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: '#ddd',
      backgroundColor: '#f5f5f5',
      minHeight: '30px',
    },
  },
  rows: {
    style: {
      minHeight: '30px', // override the row height
    },
  },
  headCells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
        minHeight: '30px',
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
        minHeight: '30px',
      },
      '.ebCczK:not(:last-of-type)': {
        minHeight: '30px',
      },
      fontSize: '11px',
    },
  },
  pagination: {
    style: {
      position: 'absolute',
      top: '41px',
      right: '5px',
      borderTopStyle: 'none',
      minHeight: '35px',
    },
  },
  table: {
    style: {
      paddingBottom: '40px',
      marginTop: '30px',
    },
  },
}

@connect(({ user, cogniableassessment, student }) => ({ user, cogniableassessment, student }))
class RightArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newAssessment: false,
      suggestTarget: false,
      selectedAssessment: '',
      open: false,
      key: Math.random(),
      studentID: '',
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    if (localStorage.getItem('studentId')) {
      const studentID = JSON.parse(localStorage.getItem('studentId'))
      if (studentID) {
        dispatch({
          type: 'student/STUDENT_DETAILS',
        })
        dispatch({
          type: 'learnersprogram/LOAD_DATA',
        })
      }
      this.setState({ studentID })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const studentID = JSON.parse(localStorage.getItem('studentId'))
    if (this.props.student.StudentName !== prevProps.student.StudentName) {
      this.getAssessmentData(studentID)
    }
  }

  getAssessmentData = id => {
    this.setState({ studentID: id })
    const { dispatch } = this.props
    dispatch({
      type: 'cogniableassessment/LOAD_DATA',
      payload: {
        studentId: id,
      },
    })
  }

  toggleForm = val => {
    const { dispatch } = this.props
    dispatch({
      type: 'cogniableassessment/SET_STATE',
      payload: {
        NewAssessmentForm: val,
      },
    })
  }

  loadAssessment = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'cogniableassessment/LOAD_ASSESSMENT_OBJECT',
      payload: {
        objectId: id,
      },
    })
  }

  suggestTarget = id => {
    const { dispatch } = this.props
    // dispatch({
    //   type: 'student/SET_STATE',
    //   payload: {
    //     CogniableAssessmentId: id,
    //   },
    // })

    // window.location.href = '/#/target/allocation'
    this.setState({
      selectedAssessment: id,
      suggestTarget: true,
      key: Math.random(),
    })
  }

  makeInactive = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'cogniableassessment/MAKE_INACTIVE',
      payload: {
        assessmentId: id,
      },
    })
  }

  generateReport = id => {
    apolloClient
      .mutate({
        mutation: gql`
          mutation GetCogniableReport($objectId: String!) {
            cogniableAssessmentReport(input: { pk: $objectId }) {
              status
              data
              file
            }
          }
        `,
        variables: {
          objectId: id,
        },
      })
      .then(result => {
        if (result.data.cogniableAssessmentReport.status) {
          confirm({
            title: 'Your CogniAble Assessment Report is ready to download.',
            // content: 'Please click download button to start downloading.',
            okText: 'Download',
            onOk() {
              document.getElementById('my_iframe').src = result.data.cogniableAssessmentReport.file
              return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
              }).catch(() => console.log('Oops errors!'))
            },
            onCancel() {},
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
  }

  DataTable = status => {
    const {
      student: { StudentName },
      cogniableassessment: { AssessmentList, AssessmentObject, NewAssessmentForm },
    } = this.props
    return (
      <div>
        <DataTable
          // title="DIRECT TRAINING MODULE"
          columns={[
            {
              name: 'Date',
              selector: 'node.date',
            },
            {
              name: 'Title',
              selector: 'node.name',
            },
            {
              name: 'Note',
              selector: 'node.notes',
            },

            {
              name: 'Status',
              width: '240px',
              cell: obj => {
                return (
                  <div style={{ color: obj.node.status === 'PROGRESS' ? '#f5222d' : 'green' }}>
                    {obj.node.status === 'PROGRESS' ? 'IN-PROGRESS' : obj.node.status} &nbsp;
                  </div>
                )
              },
            },
            {
              name: 'Action',
              width: '340px',
              cell: obj => {
                return (
                  <>
                    {obj.node.status === 'COMPLETED' ? (
                      <>
                        <Tooltip placement="topRight" title="See Result">
                          <Button
                            onClick={() => {
                              localStorage.setItem('cogniAbleId', obj.node.id)
                              window.location.href = '/#/cogniableAssessment/start'
                              // history.push('/peakResult')
                            }}
                            type="link"
                          >
                            <PlayCircleOutlined />
                          </Button>
                        </Tooltip>
                        <Tooltip placement="topRight" title="See Report">
                          <Button
                            onClick={() => {
                              localStorage.setItem('cogniAbleId', obj.node.id)
                              // history.push('/peakReport')
                              this.generateReport(obj.node.id)
                            }}
                            type="link"
                          >
                            <Icon type="snippets" />
                          </Button>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip placement="topRight" title="Start Assessment">
                        <Button
                          onClick={() => {
                            localStorage.setItem('cogniAbleId', obj.node.id)
                            window.location.href = '/#/cogniableAssessment/start'
                          }}
                          type="link"
                          // style={{
                          //   background: '#faad14',
                          //   color: '#fff',
                          //   marginLeft: 10,
                          // }}
                        >
                          <PlayCircleOutlined />
                          {/* {obj.node.submitpeakresponsesSet.totalAttended > 0 ? "Resume" : "Start"} */}
                        </Button>
                      </Tooltip>
                    )}
                    <Button type="link" onClick={() => this.suggestTarget(obj.node.id)}>
                      Suggest Target
                    </Button>

                    <div style={{ right: 15, position: 'absolute' }}>
                      <Tooltip placement="topRight" title="Delete Assessment">
                        <Popconfirm
                          // style={{marginBottom: '10px'}}
                          title="Are you sure you don't want this assessment?"
                          onConfirm={() => this.makeInactive(obj.node.id)}
                          // onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="link">
                            <Icon type="eye-invisible" />
                          </Button>
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </>
                )
              },
            },
          ]}
          theme="default"
          dense={true}
          pagination={true}
          data={
            status === 'COMPLETED'
              ? AssessmentList?.filter(({ node }) => {
                  return node.status === status
                })
              : AssessmentList?.filter(({ node }) => {
                  return node.status !== 'COMPLETED'
                })
          }
          customStyles={customStyles}
          noHeader={true}
          paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
        />

        {/* <Table
          bordered
          columns={[
            {
              title: 'Date',
              dataIndex: 'node.date',
            },
            {
              title: 'Title',
              dataIndex: 'node.name',
            },
            {
              title: 'Note',
              dataIndex: 'node.notes',
            },

            {
              title: 'Status',
              width: '240px',
              render: obj => {
                return (
                  <div style={{ color: obj.node.status === 'PROGRESS' ? '#f5222d' : 'green' }}>
                    {obj.node.status === 'PROGRESS' ? 'IN-PROGRESS' : obj.node.status} &nbsp;
                </div>
                )
              },
            },
            {
              title: 'Action',
              width: '340px',
              render: obj => {
                return (
                  <div>
                    <Button onClick={() => this.suggestTarget(obj.node.id)}>
                      Suggest Target
                    </Button>
                    {obj.node.status === 'COMPLETED' ? (
                      <>
                        <Button
                          onClick={() => {
                            localStorage.setItem('cogniAbleId', obj.node.id)
                            window.location.href = '/#/cogniableAssessment/start'
                            // history.push('/peakResult')
                          }}
                          style={{
                            background: '#faad14',
                            color: '#fff',
                            marginLeft: 10,
                          }}
                        >
                          Result
                        </Button>
                        <Button
                          onClick={() => {
                            localStorage.setItem('cogniAbleId', obj.node.id)
                            // history.push('/peakReport')
                            this.generateReport(obj.node.id)
                          }}
                          style={{
                            background: '#faad14',
                            color: '#fff',
                            marginLeft: 10,
                          }}
                        >
                          Report
                        </Button>
                      </>
                    ) : (
                        <Button
                          onClick={() => {
                            localStorage.setItem('cogniAbleId', obj.node.id)
                            window.location.href = '/#/cogniableAssessment/start'
                          }}
                          style={{
                            background: '#faad14',
                            color: '#fff',
                            marginLeft: 10,
                          }}
                        >
                          Start
                        </Button>
                      )}


                  </div>
                )
              },
            },
          ]}
          dataSource={status === 'COMPLETED' ? AssessmentList?.filter(({ node }) => { return node.status === status }) : AssessmentList?.filter(({ node }) => { return node.status !== 'COMPLETED' })}
        // loading={loading}
        /> */}
      </div>
    )
  }

  onCloseFilter = () => {
    this.setState({
      visibleFilter: false,
    })
  }

  showDrawerFilter = () => {
    this.setState({
      visibleFilter: true,
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
      minHeight: '130px',
    }

    const selectedCardStyle = {
      background: '#007acc',
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
      minHeight: '130px',
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

    const { newAssessment, suggestTarget, open } = this.state
    const {
      student: { StudentName },
      cogniableassessment: { AssessmentList, AssessmentObject, NewAssessmentForm },
      user,
    } = this.props

    return (
      <>
        <Layout style={{ padding: '0px' }}>
          <Content
            style={{
              padding: '0px 20px',
              maxWidth: 1100,
              width: '100%',
              margin: '0px auto',
            }}
          >
            <iframe id="my_iframe" title="s" style={{ display: 'none' }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  marginBottom: 20,
                  fontSize: 24,
                  marginTop: 15,
                  marginLeft: 5,
                  color: '#000',
                }}
              >
                {StudentName}&apos;s - CogniAble Assessment
              </Text>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {user?.role !== 'parents' && (
                  <Button onClick={this.showDrawerFilter} size="large">
                    <FilterOutlined />
                  </Button>
                )}

                <Drawer
                  visible={this.state.visibleFilter}
                  onClose={this.onCloseFilter}
                  width={350}
                  title="Select Learner"
                  placement="right"
                >
                  <LearnerSelect />
                </Drawer>
                <Button type="primary" size="large" onClick={() => this.setState({ open: true })}>
                  <PlusOutlined />
                  Create New Assessment
                </Button>
              </div>
            </div>

            <Tabs type="card">
              <TabPane tab="In Progress" key="1">
                {this.DataTable('!COMPLETED')}
              </TabPane>
              <TabPane tab="Completed" key="2">
                {this.DataTable('COMPLETED')}
              </TabPane>
            </Tabs>

            <Drawer
              visible={open}
              onClose={() => {
                this.setState({ open: false })
              }}
              width={400}
              title="Create New Assessment"
            >
              <div
                style={{
                  padding: '0px 30px',
                }}
              >
                <AssessmentForm
                  onClose={() => {
                    this.setState({ open: false })
                  }}
                  closeAssessmentForm={this.toggleForm}
                />
              </div>
            </Drawer>
            <Drawer
              visible={suggestTarget}
              onClose={() => this.setState({ suggestTarget: false })}
              width={600}
              title="Target Allocation from CogniAble Assessment"
            >
              {this.state.selectedAssessment && (
                <CogniAbleTargets
                  key={this.state.key}
                  assessmentId={this.state.selectedAssessment}
                />
              )}
            </Drawer>
          </Content>
        </Layout>

        {/* <div
          style={{
            background: '#F9F9F9',
            borderRadius: 10,
            padding: '28px 27px 20px',
            display: 'block',
            width: '100%',
            minHeight: '650px',
          }}
        >
          
          {NewAssessmentForm ? (
            <AssessmentForm closeAssessmentForm={this.toggleForm} />
          ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <Button
                    type="primary"
                    onClick={() => this.toggleForm(true)}
                    style={{
                      width: '100%',
                      height: 40,
                      background: '#0B35B3',
                      boxShadow:
                        '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
                      borderRadius: 8,
                      fontSize: 17,
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}
                  >
                    Start New Assessment
                </Button>
                </div>
                <div style={{ height: '600px', overflow: 'auto' }}>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="In-Progress" key="1">
                      {AssessmentList.map(item =>
                        item.node.status !== 'COMPLETED' ?
                          <div
                            style={AssessmentObject?.id === item.node.id ? selectedCardStyle : cardStyle}
                          >
                            <Text style={textStyle}>{item.node.name ? item.node.name : item.node.id}</Text>
                            <Title
                              style={{
                                fontSize: '20px',
                                lineHeight: '12px',
                                display: 'inline-block',
                                width: '50%',
                              }}
                            >
                              {item.node.date}
                            </Title>
                            <p
                              style={{
                                display: 'inline-block',
                                // marginTop: '5px',
                                marginBottom: '-5px',
                                width: '50%',
                              }}
                            >
                              <i>{item.node.status}</i>
                            </p>
                            <p>
                              <Button
                                style={{ float: 'right', marginBottom: '10px', marginLeft: '10px' }}
                                onClick={() => this.loadAssessment(item.node.id)}
                              >
                                Load
                              </Button>
                              <Button
                                style={{ float: 'right', marginBottom: '10px', marginLeft: '10px' }}
                                onClick={() => this.suggestTarget(item.node.id)}
                              >
                                Suggest Target
                              </Button>
                              <Popconfirm
                                style={{ float: 'right', marginBottom: '10px' }}
                                title="Are you sure you don't want this assessment?"
                                onConfirm={() => this.makeInactive(item.node.id)}
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button
                                  style={{ float: 'right', marginBottom: '10px' }}
                                // onClick={() => this.makeInactive(item.node.id)}
                                >
                                  <Icon type="delete" />
                                </Button>
                              </Popconfirm>

              
                            </p>
                            
                          </div>
                          :
                          <>
                          </>
                      )}
                    </TabPane>
                    <TabPane tab="Completed" key="2">
                      {AssessmentList.map(item =>
                        item.node.status === 'COMPLETED' ?
                          <div
                            style={AssessmentObject?.id === item.node.id ? selectedCardStyle : cardStyle}
                          >
                            <Text style={textStyle}>{item.node.name ? item.node.name : item.node.id}</Text>
                            <Title
                              style={{
                                fontSize: '20px',
                                lineHeight: '12px',
                                display: 'inline-block',
                                width: '50%',
                              }}
                            >
                              {item.node.date}
                            </Title>
                            <p
                              style={{
                                display: 'inline-block',
                                // marginTop: '5px',
                                marginBottom: '-5px',
                                width: '50%',
                              }}
                            >
                              <i>{item.node.status}</i>
                            </p>
                            <p>
                              <Button
                                style={{ float: 'right', marginBottom: '10px', marginLeft: '10px' }}
                                onClick={() => this.loadAssessment(item.node.id)}
                              >
                                Load
                              </Button>
                              <Button
                                style={{ float: 'right', marginBottom: '10px', marginLeft: '10px' }}
                                onClick={() => this.suggestTarget(item.node.id)}
                              >
                                Suggest Target
                              </Button>
                              <Popconfirm
                                style={{ float: 'right', marginBottom: '10px' }}
                                title="Are you sure you don't want this assessment?"
                                onConfirm={() => this.makeInactive(item.node.id)}
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button
                                  style={{ float: 'right', marginBottom: '10px' }}
                                // onClick={() => this.makeInactive(item.node.id)}
                                >
                                  <Icon type="delete" />
                                </Button>
                              </Popconfirm>
                              <Button
                                style={{ float: 'right', marginBottom: '10px', marginLeft: '10px' }}
                                onClick={() => this.generateReport(item.node.id)}
                              >
                                <Icon type="file-word" />
                              </Button>
                            </p>
                          </div>
                          :
                          <>
                          </>
                      )}
                    </TabPane>
                  </Tabs>
                </div>
                <Drawer
                  visible={suggestTarget}
                  onClose={() => this.setState({ suggestTarget: false })}
                  width={600}
                  title="Target Allocation from CogniAble Assessment"
                >
                  {this.state.selectedAssessment && (
                    <CogniAbleTargets key={this.state.key} assessmentId={this.state.selectedAssessment} />
                  )}
                </Drawer>

              </>
            )}
        </div> */}
      </>
    )
  }
}

export default RightArea
