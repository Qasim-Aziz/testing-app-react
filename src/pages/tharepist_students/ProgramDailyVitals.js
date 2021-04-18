/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/destructuring-assignment */
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
import LoadingComponent from 'components/LoadingComponent'
import LearnerSelect from 'components/LearnerSelect'
import { DRAWER } from 'assets/styles/globalStyles'
import apolloClient from '../../apollo/config'
import LearnerCard from './LearnerCard'
import DailyVitalsCard from './DailyVitalsCard'
import './ProgramDailyVitals.scss'

const { Content } = Layout
const { Search } = Input

@connect(({ student, user, learnersprogram }) => ({ student, user, learnersprogram }))
class TharepistStudentsDailyVitals extends PureComponent {
  constructor(props) {
    super(props)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.handleFilterToggle = this.handleFilterToggle.bind(this)
    this.setTabCheck = this.setTabCheck.bind(this)
    this.openDrawer = this.openDrawer.bind(this)
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
      selectedStudent: localStorage.getItem('studentId'),
    }
  }

  componentDidMount() {
    const { dispatch, learnersprogram } = this.props

    if (learnersprogram && learnersprogram.Learners?.length === 0) {
      dispatch({
        type: 'learnersprogram/LOAD_DATA',
      })
    }

    dispatch({
      type: 'student/STUDENT_DETAILS',
    })

    let std = localStorage.getItem('studentId')
    if (std) {
      std = JSON.parse(std)
      dispatch({
        type: 'learnersprogram/SET_STATE',
        payload: {
          SelectedLearnerId: std,
        },
      })
    } else {
      dispatch({
        type: 'student/SET_STATE',
        payload: {
          StudentName: '',
        },
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.learnersprogram !== this.props.learnersprogram) {
      this.setState({
        selectedStudent: this.props.learnersprogram.SelectedLearnerId,
      })
    }
  }

  filter = (data, name) => {
    return data.filter(function(el) {
      return (
        el.node.firstname !== null && el.node.firstname.toUpperCase().includes(name.toUpperCase())
      )
    })
  }

  setTabCheck = val => {
    this.setState({ TabCheck: val })
  }

  renderDetail = () => {
    const data = this.state
    if (data.selectedStudent) {
      return (
        <>
          <Row>
            <Col span={24}>
              <DailyVitalsCard
                openRightdrawer={data.openRightdrawer}
                closeDrawer={this.closeDrawer}
                openDrawer={this.openDrawer}
                filterToggle={data.filter}
                handleFilterToggle={this.handleFilterToggle}
                TabCheck={data.TabCheck}
                data={data}
                setTabCheck={this.setTabCheck}
                selectedStudent={data.selectedStudent}
              />
            </Col>
          </Row>
        </>
      )
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
    const {
      user: { role },
      student: { StudentName },
      learnersprogram: { Loading, SelectedLearnerId },
    } = this.props

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
                    width={DRAWER.widthL4}
                    closable={true}
                    onClose={this.onClose}
                    visible={stateData.drawer}
                    key="left"
                  >
                    <LearnerSelect />
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
                    {StudentName && `${StudentName}'s ${stateData.TabCheck}`}
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
            {Loading ? (
              <LoadingComponent />
            ) : stateData.selectedStudent || SelectedLearnerId ? (
              this.renderDetail()
            ) : (
              <Empty />
            )}
          </Col>
        </Layout>
      </Authorize>
    )
  }
}
export default TharepistStudentsDailyVitals
