/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent-props */
import React, { PureComponent } from 'react'
import { Layout, Row, Col, Input, Typography, Empty } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import apolloClient from '../../apollo/config'
import LearnerCard from './LearnerCard'
import LearnerDetailsCard from './LearnerDetailsCard'
import DailyVitalsCard from './DailyVitalsCard'

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
class TharepistStudentsGraph extends PureComponent {
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

  learnerGraphs = () => {
    return (
      <div style={parentCardStyle}>
        <Title style={{ fontSize: 20, lineHeight: '27px' }}>Learner Graphs & Reports</Title>
        <div style={cardStyle}>
          <a href="/#/progressGraph">
            <div style={targetMappingStyle}>
              <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
                Progress Overview
              </Title>

              <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>
                <i>Click here to see Graphs</i>
              </p>
            </div>
          </a>
          <a href="/#/dailyResponseRate">
            <div style={targetMappingStyle}>
              <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
                Daily Response Rate
              </Title>

              <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>
                <i>Click here to see Graphs</i>
              </p>
            </div>
          </a>
          <a href="/#/behaviorGraph">
            <div style={targetMappingStyle}>
              <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
                Behavior
              </Title>

              <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>
                <i>Click here to see Graphs</i>
              </p>
            </div>
          </a>
          <a href="/#/sessions">
            <div style={targetMappingStyle}>
              <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
                Session
              </Title>

              <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>
                <i>Click here to see Graphs</i>
              </p>
            </div>
          </a>
          <a href="/#/goals">
            <div style={targetMappingStyle}>
              <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
                Goals
              </Title>

              <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>
                <i>Click here to see Graphs</i>
              </p>
            </div>
          </a>
        </div>
      </div>
    )
  }

  learnerGraph2 = () => {
    return (
      <div style={parentCardStyle}>
        <Title style={{ fontSize: 20, lineHeight: '27px' }}>Staff Reports</Title>
        <div style={cardStyle}>
          <a href="/#/staffReport">
            <div style={targetMappingStyle}>
              <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
                Staff Activity
              </Title>
              <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>
                <i>Click here to see Graphs</i>
              </p>
            </div>
          </a>
        </div>
      </div>
    )
  }

  renderDetail = () => {
    const data = this.state
    const { user: { role } } = this.props

    if (data.isPresent && data.students[0] !== undefined) {
      return (
        <>
          <LearnerDetailsCard node={data.students[0].node} style={{ marginTop: 1 }} />
          <Row>
            <Col span={12}>{this.learnerGraphs()}</Col>
            {role === 'school_admin' ?

              <Col span={12}>{this.learnerGraph2()}</Col>

              :
              <>
              </>
            }
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
                <Col span={12}>{this.learnerGraphs()}</Col>
                {role === 'school_admin' ?

                  <Col span={12}>{this.learnerGraph2()}</Col>

                  :
                  <>
                  </>
                }
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

  render() {
    const stateData = this.state
    const checkStudnetOnLocalStorage = localStorage.getItem('studentId')
    return (
      <Authorize roles={['therapist', 'school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Layout style={{ padding: '0px' }}>
          <Content
            style={{
              padding: '0px',
              maxWidth: 1300,
              width: '100%',
              margin: '0px auto',
            }}
          >
            <Row style={{ width: '100%', margin: 0 }} gutter={[41, 0]}>
              <Col span={8} style={{ paddingLeft: 0 }}>
                <Title
                  style={{
                    fontSize: 20,
                    lineHeight: '27px',
                  }}
                >
                  Learners
                </Title>
                <Search
                  placeholder="Search learner from the list"
                  onChange={e => {
                    this.filterLearnerData(e)
                  }}
                  style={{ width: '100%' }}
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
              </Col>
              <Col span={16} style={{ paddingRight: 0 }}>
                {checkStudnetOnLocalStorage ? this.renderDetail() : <Empty />}
              </Col>
            </Row>
          </Content>
        </Layout>
      </Authorize>
    )
  }
}
export default TharepistStudentsGraph
