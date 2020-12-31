/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent-props */
import React, { PureComponent } from 'react'
import { Layout, Row, Col, Input, Typography, Empty, Drawer, Tooltip, Button } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import { FilterOutlined, PlusOutlined } from '@ant-design/icons'
import { MdFilterList } from 'react-icons/md'
import { useQuery } from 'react-apollo'
import apolloClient from '../../apollo/config'
import LearnerCard from './LearnerCard'
import LearnerDetailsCard from './LearnerDetailsCard'
import DailyVitalsCard from './DailyVitalsCard'
import brainImg from '../../images/brain.png'
import './ProgramDailyVitals.scss'

const { Content } = Layout
const { Title, Text } = Typography
const { Search } = Input
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
const targetMappingStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '16px 12px',
  // display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
}
@connect(({ student, user }) => ({ student, user }))
class TharepistStudentsDailyVitals extends PureComponent {
  constructor(props) {
    super(props)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.handleFilterToggle = this.handleFilterToggle.bind(this)
    this.setTabCheck = this.setTabCheck.bind(this)
    this.openDrawer = this.openDrawer.bind(this)
    this.filterLearnerData = this.filterLearnerData.bind(this)
    this.onClose = this.onClose.bind(this)

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
      drawer: false,
      openRightdrawer: false,
      filter: false,
      TabStage: 1,
      TabCheck: 'Meal Data',
    }
  }

  componentDidMount() {
    apolloClient
      .query({
        query: gql`
          query {
            students(isActive: true) {
              edges {
                node {
                  id
                  firstname
                  lastname
                  internalNo
                  mobileno
                  email
                  parent {
                    id
                    username
                  }
                  school {
                    id
                  }
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
          }
        `,
      })
      .then(qresult => {
        const storage = localStorage.getItem('studentId')
        if (storage !== null && storage !== '') {
          const result = storage.substring(1, storage.length - 1)
          // pass result below
          const refinedArray = this.move(qresult.data.students.edges, result)
          this.setState({
            students: refinedArray,
            prevData: refinedArray,
            isPresent: true,
            selectedNode: refinedArray[0].node,
            loading: false,
          })
        } else {
          this.setState({
            loading: false,
            students: qresult.data.students.edges,
            prevData: qresult.data.students.edges,
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
    this.setState({
      isDrawer: false,
      selectedNode: node,
      isPresent: false,
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

  renderStudentCards = () => {
    const stateData = this.state
    const cards = []
    console.log(stateData)
    if (stateData.students !== undefined) {
      for (let i = 0; i < stateData.students.length; i += 1) {
        cards.push(
          <>
            <div
              role="presentation"
              onClick={() => {
                this.setClickHandler(stateData.students[i].node)
              }}
            >
              <LearnerCard
                key={stateData.students[i].node.id}
                node={stateData.students[i].node}
                name={stateData.students[i].node.firstname}
                style={{ marginTop: 18 }}
                leaveRequest={stateData.students[i].node.leaveRequest}
              />
            </div>
          </>,
        )
      }
    }
    return cards
  }

  setTabCheck = val => {
    this.setState({ TabCheck: val })
  }

  renderBehaviorContent = () => {
    return (
      <div style={parentCardStyle}>
        <div style={cardStyle}>
          <Title style={{ fontSize: 20, lineHeight: '27px' }}>Behaviors</Title>
          <a href="/#/decel/">
            <div style={targetMappingStyle}>
              <img
                style={{
                  marginRight: '10px',
                  height: '40px',
                }}
                src={brainImg}
                alt=""
              />
              <Text style={{ fontSize: 20, lineHeight: '27px' }}>Behavior Data</Text>
            </div>
          </a>
          <a href="/#/abc/">
            <div style={targetMappingStyle}>
              <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
                ABC Data
              </Title>

              <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>
                <i>Click here to record ABC data</i>
              </p>
            </div>
          </a>
        </div>
      </div>
    )
  }

  renderDetail = () => {
    const data = this.state
    console.log(data, 'checkData')
    if (data.students[0] !== undefined) {
      return (
        <>
          <Row>
            <Col span={24}>
              <DailyVitalsCard
                openRightdrawer={data.openRightdrawer}
                closeDrawer={this.closeDrawer}
                filterToggle={data.filter}
                handleFilterToggle={this.handleFilterToggle}
                TabCheck={data.TabCheck}
                data={data}
                setTabCheck={this.setTabCheck}
                openDrawer={this.openDrawer}
              />
            </Col>
            <Col span={12} style={{ display: 'none' }}>
              {this.renderBehaviorContent()}
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
              <Row>
                <Col span={24}>
                  <DailyVitalsCard
                    openRightdrawer={data.openRightdrawer}
                    closeDrawer={this.closeDrawer}
                    filterToggle={data.filter}
                    handleFilterToggle={this.handleFilterToggle}
                    TabCheck={data.TabCheck}
                    data={data}
                    setTabCheck={this.setTabCheck}
                    openDrawer={this.openDrawer}
                  />
                </Col>
                <Col span={12} style={{ display: 'none' }}>
                  {this.renderBehaviorContent()}
                </Col>
              </Row>
            </>
          ) : (
              ''
            )}
        </>
      )
    }
    return null
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

  onClose = () => {
    this.setState({
      drawer: false,
    })
  }

  showDrawer = () => {
    this.setState({
      drawer: true,
    })
  }

  openDrawer = () => {
    this.setState({ openRightdrawer: true })
  }

  closeDrawer = () => {
    this.setState({ openRightdrawer: false })
  }

  handleFilterToggle = () => {
    const stateData = this.state
    this.setState(previousState => ({ ...previousState, filter: !stateData.filter }))
  }

  render() {
    const stateData = this.state
    const checkStudnetOnLocalStorage = localStorage.getItem('studentId')

    const { user: { role } } = this.props

    return (
      <Authorize roles={['therapist', 'school_admin', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
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
              <div style={{ padding: '5px 0px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {role !== 'parents' && (
                    <Button onClick={this.showDrawer} size="large">
                      <FilterOutlined />
                    </Button>
                  )}

                  <Drawer
                    title="Learners"
                    placement="left"
                    width="300px"
                    closable={true}
                    onClose={this.onClose}
                    visible={stateData.drawer}
                    key="left"
                  >
                    <Search
                      placeholder="Search learner from the list"
                      onChange={e => {
                        this.filterLearnerData(e)
                      }}
                      style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <div style={{ height: '660px', overflow: 'auto' }}>
                      {stateData.loading === true ? (
                        <>
                          <p style={{ marginTop: '20px' }}>loading studnets...</p>
                        </>
                      ) : (
                          <>{this.renderStudentCards()}</>
                        )}
                    </div>
                  </Drawer>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 25,
                      marginRight: '9px',
                      marginTop: '2px',
                    }}
                  >
                    {stateData.selectedNode.firstname &&
                      `${stateData.selectedNode.firstname}'s ${stateData.TabCheck}`}
                  </div>
                </div>
                <div style={{ paddingTop: '5px' }}>
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={this.handleFilterToggle}
                  >
                    <MdFilterList />
                  </Button>
                  <Button type="primary" onClick={this.openDrawer}>
                    <PlusOutlined /> ADD {stateData.TabCheck}
                  </Button>
                </div>
              </div>
            </Content>
          </div>

          <Col style={{ paddingRight: 0 }}>
            {checkStudnetOnLocalStorage ? this.renderDetail() : <Empty />}
          </Col>
        </Layout>
      </Authorize>
    )
  }
}
export default TharepistStudentsDailyVitals
