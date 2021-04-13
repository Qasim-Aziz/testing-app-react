/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable consistent-return */
/* eslint-disable no-unneeded-ternary */
import React, { PureComponent } from 'react'
import { Layout, Row, Col, Input, Empty, Drawer, Button } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import { FilterOutlined, PlusOutlined } from '@ant-design/icons'
import { MdFilterList } from 'react-icons/md'
import apolloClient from '../../apollo/config'
import LearnerCard from './LearnerCard'
import DailyVitalsCard from './DailyVitalsCard'

import './ProgramDailyVitals.scss'

const { Content } = Layout
const { Search } = Input

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

    const { activeTab } = this.props

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
      TabCheck: activeTab ? activeTab : 'Meal Data',
      selectedStudent: '',
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
            selectedStudent: result,
          })
        } else {
          this.setState({
            loading: false,
            students: qresult.data.students.edges,
            prevData: qresult.data.students.edges,
            selectedStudent: qresult.data.students.edges[0]?.node?.id,
          })
          localStorage.setItem(
            'studentId',
            JSON.stringify(qresult.data.students.edges[0]?.node?.id),
          )
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  setClickHandler = node => {
    localStorage.setItem('studentId', JSON.stringify(node.id))
    this.setState({
      isDrawer: false,
      selectedNode: node,
      isPresent: false,
    })
  }

  move = (data, storageData) => {
    data.forEach(function(item, i) {
      if (item.node.id.toUpperCase() === storageData.toUpperCase()) {
        data.splice(i, 1)
        data.unshift(item)
      }
    })
    return data
  }

  filter = (data, name) => {
    return data.filter(function(el) {
      return (
        el.node.firstname !== null && el.node.firstname.toUpperCase().includes(name.toUpperCase())
      )
    })
  }

  renderStudentCards = () => {
    const stateData = this.state
    const cards = []
    if (stateData.students !== undefined) {
      for (let i = 0; i < stateData.students.length; i += 1) {
        cards.push(
          <div
            key={stateData.students[i].node.id}
            role="presentation"
            onClick={() => {
              this.setClickHandler(stateData.students[i].node)
            }}
          >
            <LearnerCard
              node={stateData.students[i].node}
              name={stateData.students[i].node.firstname}
              style={{ marginTop: 18 }}
              leaveRequest={stateData.students[i].node.leaveRequest}
            />
          </div>,
        )
      }
    }
    return cards
  }

  setTabCheck = val => {
    this.setState({ TabCheck: val })
  }

  renderDetail = () => {
    const data = this.state
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
                selectedStudent={data.selectedStudent}
              />
            </Col>
          </Row>
        </>
      )
    }
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

    const {
      user: { role },
    } = this.props

    console.log(stateData, checkStudnetOnLocalStorage, 'local storage')
    return (
      <Authorize roles={['therapist', 'school_admin', 'parents']} redirect to="/">
        <Helmet title="Daily Vitals" />
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
                    <div>
                      {stateData.loading === true ? (
                        <>
                          <p style={{ marginTop: '20px' }}>loading students...</p>
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
                  <Button type="primary" onClick={this.openDrawer}>
                    <PlusOutlined /> ADD {stateData.TabCheck}
                  </Button>
                </div>
              </div>
            </Content>
          </div>

          <Col style={{ paddingRight: 0 }}>
            {stateData.selectedStudent || checkStudnetOnLocalStorage ? (
              this.renderDetail()
            ) : (
              <>
                <Empty />
              </>
            )}
          </Col>
        </Layout>
      </Authorize>
    )
  }
}
export default TharepistStudentsDailyVitals
