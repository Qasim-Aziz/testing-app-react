/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-boolean-value */
import React, { PureComponent } from 'react'
import {
  Menu,
  Dropdown,
  Button,
  message,
  Tooltip,
  Progress,
  Drawer,
  Switch,
  Modal,
  Card,
  Icon,
  Layout,
  Row,
  Col,
  Input,
  Typography,
  notification,
  Empty,
} from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import apolloClient from '../../apollo/config'
import styles from './style.module.scss'
import StudentDrawer from './StudentDrawer'
import LearnerCard from './LearnerCard'
import LearnerDetailsCard from './LearnerDetailsCard'

const { Content } = Layout
const { Title, Text } = Typography
const { Search } = Input

const targetMappingStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '16px 12px',
  // display: 'flex',
  alignItems: 'center',
  marginBottom: '10px'
}

const programAreaStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  width: '100%',
  // marginRight: '20px',
  marginBottom: '10px',
  padding: '12px 12px',
  alignItems: 'center',
  display: 'inline-block',
}

@connect(({ student }) => ({ student }))
class TharepistStudents extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      // isClicked: false,
      isDrawer: false,
      students: [],
      selectedNode: {},
      visible: true,
      programArea: [],
      programAreaStatus: [],
      selectedArea: '',
      isPresent: false,
      loading: true,
      showBuildGoalsCard: false
    }
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentDidMount() {
    apolloClient.query({
      query: gql`{
        students (isActive: true) {
          edges {
            node {
              id
              firstname
              internalNo
              mobileno
              email
              lastname
              caseManager {
                id
                name
                email
                contactNo
              }
              category {
                id
                category
              }
            }
          }
        }
        programArea (isActive: true) {
          edges {
            node {
              id
              name
              percentageLong
            }
          }
        }
      }`,
      fetchPolicy: 'no-cache'
    })
      .then(qresult => {
        const storage = localStorage.getItem('studentId')
        if (storage !== null && storage !== '') {
          // fetching selected students active program area
          apolloClient.query({
            query: gql`{
              student(id: ${storage}) {
                programArea {
                  edges {
                    node {
                      id,
                      name,
                      percentageLong
                    }
                  }
                }
              }
            }`,
            fetchPolicy: 'no-cache'
          })
            .then(iniResult => {
              const result = storage.substring(1, storage.length - 1)
              // pass result below
              const refinedArray = this.move(qresult.data.students.edges, result)
              this.setState({
                programAreaStatus: iniResult.data.student.programArea.edges,
                students: refinedArray,
                prevData: refinedArray,
                programArea: qresult.data.programArea.edges,
                isPresent: true,
                selectedNode: refinedArray[0].node,
                loading: false
              })
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.setState({
            loading: false,
            students: qresult.data.students.edges,
            prevData: qresult.data.students.edges,
            programArea: qresult.data.programArea.edges,
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  setClickHandler = node => {
    // console.log('===> cliked', node.id)
    // setting student id to local storage for further operations
    localStorage.setItem('studentId', JSON.stringify(node.id))
    // getting student program area
    apolloClient.query({
      query: gql`{
        student(id:"${node.id}"){
          programArea{
            edges{
              node{
                id,
                name,
                percentageLong
              }
            }
          }
        }
      }`,
    })
      .then(presult => {
        this.setState({
          programAreaStatus: presult.data.student.programArea.edges,
          isDrawer: false,
          selectedNode: node,
          isPresent: false,
          showBuildGoalsCard: false
        })

      })
      .catch(error => {
        console.log(error)
      })
  }

  move = (data, storageData) => {
    data.forEach(function (item, i) {
      if (item.node.id.toUpperCase() === storageData.toUpperCase()) {
        data.splice(i, 1)
        data.unshift(item)
      }
    })
    return data
  }

  filter = (data, name) => {
    return data.filter(function (el) {
      return (
        el.node.firstname !== null && el.node.firstname.toUpperCase().includes(name.toUpperCase())
      )
    })
  }

  handleToggle = (checked, e, selectedArea) => {
    e.stopPropagation()
    const stateData = this.state
    const finalArrayone = []
    if (stateData.programAreaStatus.length > 0) {
      for (let i = 0; i < stateData.programAreaStatus.length; i += 1) {
        finalArrayone.push(`"${stateData.programAreaStatus[i].node.id}"`)
      }
    }
    if (checked) {
      finalArrayone.push(`"${selectedArea.id}"`)
    } else {
      const index = finalArrayone.indexOf(`"${selectedArea.id}"`)
      if (index > -1) {
        finalArrayone.splice(index, 1)
      }
    }
    apolloClient
      .mutate({
        mutation: gql`
          mutation {
            updateStudent(
              input: {
                studentData: {
                  id: "${stateData.selectedNode.id}"
                  programArea: [${finalArrayone}]
                }
              }
            ) {
              student {
                firstname
                id
              }
            }
          }
        `,
      })
      .then(presult => {
        if (checked) {
          notification.success({
            message: 'Success',
            description: 'Program Area Activated Successfully',
          })
          const obj = {
            node: {
              id: `${selectedArea.id}`,
              name: `${selectedArea.name}`,
              percentageLong: 0,
            },
          }
          const newNode = stateData.programAreaStatus
          const newProgramList = newNode.push(obj)
          this.setState({
            programAreaStatus: newNode,
            // isClicked: true,
            isDrawer: false,
            isPresent: false,
          })
          this.forceUpdate()
        } else {
          notification.success({
            message: 'Success',
            description: 'Program Area Deactivated Successfully',
          })
          const arr = stateData.programAreaStatus
          const removeIndex = arr.map(item => {
            return item.node.id
          })
          const index = removeIndex.indexOf(`${selectedArea.id}`)

          // remove object
          arr.splice(index, 1)

          this.setState({
            programAreaStatus: arr,
            // isClicked: true,
            isDrawer: false,
            isPresent: false,
          })
          this.forceUpdate()
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderSwitch = programName => {
    const stateData = this.state
    if (stateData.programAreaStatus.length > 0 && stateData.programAreaStatus !== undefined) {
      for (let i = 0; i < stateData.programAreaStatus.length; i += 1) {
        if (stateData.programAreaStatus[i].node.name.toUpperCase() === programName.toUpperCase()) {
          return true
        }
      }
      return false
    }
    return false
  }

  showModal = () => {
    notification.warning({
      message: 'Warning',
      description: 'This program area is not activated ',
    })
  }

  renderProgramArea = () => {
    const stateData = this.state
    const program = []
    if (stateData.programArea !== undefined) {
      for (let i = 0; i < stateData.programArea.length; i += 1) {
        const checked = this.renderSwitch(stateData.programArea[i].node.name)
        // console.log('====> checked', checked)
        program.push(
          <div
            role="presentation"
            className={styles.detailCardItem}
            onClick={
              checked
                ? () => {
                  this.showDrawr(stateData.programArea[i].node)
                }
                : () => {
                  this.showModal()
                }
            }
            style={programAreaStyle}
          >
            <div>
              <Title style={{ fontSize: '20px', lineHeight: '27px' }}>{stateData.programArea[i].node.name}</Title>
              <div>
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                  checked={checked}
                  onClick={(checkedUser, event) => {
                    this.handleToggle(checkedUser, event, stateData.programArea[i].node)
                  }}
                />
              </div>
              <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}><i>Click here to build your LTG & STG </i></p>
            </div>
          </div>,
        )
      }
    }
    return program
  }

  renderDetail = () => {
    const data = this.state
    const { showBuildGoalsCard, selectedArea } = this.state

    const cardStyle = {
      background: '#F9F9F9',
      height: 500,
      overflow: 'auto',
    }

    const parentCardStyle = {
      background: '#F9F9F9',
      borderRadius: 10,
      padding: '20px',
      margin: '20px 10px 20px 10px',
    }

    if (data.isPresent && data.students[0] !== undefined) {
      return (
        <>
          {/* <LearnerDetailsCard node={data.students[0].node} style={{ marginTop: 1 }} /> */}

          <Row>
            <Col span={12}>
              <div style={parentCardStyle}>
                <div style={cardStyle}>
                  <Title style={{ fontSize: 20, lineHeight: '27px' }}>Program</Title>
                  {data.loading === true ?
                    <>
                      <p style={{ marginTop: '20px' }}>loading...</p>
                    </>
                    :
                    <>
                      {this.renderProgramArea()}
                    </>
                  }
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={parentCardStyle}>

                <div style={cardStyle}>
                  {showBuildGoalsCard && (
                    <>
                      <Title style={{ fontSize: 20, lineHeight: '27px' }}>Build Goals</Title>
                      <a href="/#/target/allocation">
                        <div style={targetMappingStyle}>
                          <Title style={{ fontSize: '20px', lineHeight: '27px' }}>{selectedArea}</Title>
                          <p style={{ marginTop: '5px', marginBottom: '-5px' }}><i>Click card to build learner goals </i></p>
                        </div>
                      </a>
                    </>
                  )}


                  <Title style={{ fontSize: 20, lineHeight: '27px' }}>Target Mapping</Title>
                  <a href="/#/targetsAllocationToSession/">
                    <div style={targetMappingStyle}>
                      <Title style={{ fontSize: '20px', lineHeight: '27px' }}>Target Allocation to Session</Title>
                      <p style={{ marginTop: '5px', marginBottom: '-5px' }}><i>Click card to allocation targets in Sessions </i></p>
                    </div>
                  </a>
                </div>

              </div>
            </Col>
          </Row>
        </>
      )
    }

    if (!data.isDrawer) {
      return (
        <>
          {localStorage.getItem('studentId') !== '' ? (
            <>
              <LearnerDetailsCard node={data.selectedNode} style={{ marginTop: 1 }} />
              <Row>
                <Col span={12}>
                  <div style={parentCardStyle}>

                    <div style={cardStyle}>
                      <Title style={{ fontSize: 20, lineHeight: '27px' }}>Program</Title>
                      {data.loading === true ?
                        <>
                          <p style={{ marginTop: '20px' }}>loading...</p>
                        </>
                        :
                        <>
                          {this.renderProgramArea()}
                        </>
                      }

                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={parentCardStyle}>


                    <div style={cardStyle}>
                      {showBuildGoalsCard && (
                        <>
                          <Title style={{ fontSize: 20, lineHeight: '27px' }}>Build Goals</Title>
                          <a href="/#/target/allocation">
                            <div style={targetMappingStyle}>
                              <Title style={{ fontSize: '20px', lineHeight: '27px' }}>{selectedArea}</Title>
                              <p style={{ marginTop: '5px', marginBottom: '-5px' }}><i>Click card to build learner goals </i></p>
                            </div>
                          </a>
                        </>
                      )}


                      <Title style={{ fontSize: 20, lineHeight: '27px' }}>Target Mapping</Title>
                      <a href="/#/targetsAllocationToSession/">
                        <div style={targetMappingStyle}>
                          <Title style={{ fontSize: '20px', lineHeight: '27px' }}>Target Allocation to Session</Title>
                          <p style={{ marginTop: '5px', marginBottom: '-5px' }}><i>Click card to allocation targets in Sessions </i></p>
                        </div>
                      </a>
                    </div>

                  </div>
                </Col>
              </Row>
            </>
          ) : (
              ''
            )}
        </>
      )
    }
    // if (data.isDrawer) {
    //   return (
    //     <Drawer
    //       placement="right"
    //       closable={true}
    //       onClose={this.closeDrawer}
    //       visible={data.visible}
    //       width="100%"
    //       key={Math.random()}
    //     >
    //       <StudentDrawer
    //         key={Math.random()}
    //         programs={data.programArea}
    //         closeDrawer={() => {
    //           this.closeDrawer()
    //         }}
    //         student={data.selectedNode}
    //         selectedArea={data.selectedArea}
    //         areas={data.programAreaStatus}
    //       />
    //     </Drawer>
    //   )
    // }
    return null
  }

  closeDrawer = val => {
    this.setState({
      isDrawer: false,
      visible: false,
    })
  }

  // when user select program area card
  showDrawr = node => {
    // console.log('===> selected program area : ', node )
    // setting student selected program area to store
    const { dispatch } = this.props
    dispatch({
      type: 'student/SET_STATE',
      payload: {
        ProgramAreaId: node.id,
      },
    })

    this.setState({
      showBuildGoalsCard: true,
      selectedArea: node.name,
    })
  }

  filterLearnerData = e => {
    const stateData = this.state
    if (e.target.value === '') {
      this.setState({
        students: stateData.prevData,
      })
    } else {
      const filteredArray = this.filter(stateData.students, e.target.value)
      this.setState({
        students: filteredArray,
      })
    }
  }

  render() {
    const stateData = this.state
    const { students, loading } = this.state
    const checkStudnetOnLocalStorage = localStorage.getItem('studentId')
    return (
      <Authorize roles={['therapist', 'school_admin']} redirect to="/">
        <Helmet title="Program" />
        <Layout style={{ padding: '0px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0px 10px',
              backgroundColor: '#FFF',
              boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
            }}
          >
            <Content
              style={{
                padding: '0px',
                width: '100%',
                margin: '0px auto',
              }}
            >
              <Row style={{ width: '100%', margin: 0 }} gutter={[41, 0]}>
                <Col span={6} style={{ paddingLeft: 0 }}>
                  <Search
                    placeholder="Search learner by name"
                    onChange={e => {
                      this.filterLearnerData(e)
                    }}
                    style={{ width: '100%' }}
                  />
                  <div style={{ height: '660px', overflow: 'auto' }}>
                    {loading === true ?
                      <>
                        <p style={{ marginTop: '20px' }}>Loading studnets...</p>
                      </>
                      :
                      <>
                        {students.map(nodeItem => (
                          <div
                            role="presentation"
                            onClick={() => {
                              this.setClickHandler(nodeItem.node)
                            }}
                          >
                            <LearnerCard
                              key={nodeItem.node.id}
                              node={nodeItem.node}
                              name={nodeItem.node.firstname}
                              style={{ marginTop: 18 }}
                              leaveRequest={nodeItem.node.leaveRequest}
                            />
                          </div>
                        ))}
                      </>
                    }

                  </div>
                </Col>
                <Col span={18} style={{ paddingRight: 0 }}>
                  {checkStudnetOnLocalStorage ?
                    this.renderDetail()
                    :
                    <Empty />
                  }
                </Col>
              </Row>
            </Content>
          </div>
        </Layout>
      </Authorize>
    )
  }
}
export default TharepistStudents
