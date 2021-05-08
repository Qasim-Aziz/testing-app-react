/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable  */
import { Drawer, Tabs } from 'antd'
import { DRAWER } from 'assets/styles/globalStyles'
import LearnerSelect from 'components/LearnerSelect'
import React, { Component } from 'react'
import { connect, useSelector } from 'react-redux'
import client from '../../apollo/config'
import gql from 'graphql-tag'
import AllFiles from './AllFiles'
import FileUploadFrom from './FileUploadFrom'
import './index.scss'
import LearnersList from './LearnersList'
import NewAuthorization from './NewAuthorization'
import { GET_ALL_LEARNERS } from './query'
import StaffsList from './StaffsList'

const { TabPane } = Tabs

const STAFF_LIST = gql`
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

@connect(({ user, student, learnersprogram, menu }) => ({ user, student, learnersprogram, menu }))
export class Index extends Component {
  constructor(props) {
    super(props)

    this.state = {
      barKey: 20,
      isAuthorization: false,
      visibleFilter: false,
      userRole: JSON.parse(localStorage.getItem('role')),

      selectedStudentId: localStorage.getItem('studentId'),
      TabCheck: 'Progress Overview',
      staffs: [],
      isLearnerById: true,
      isStaffById: false,
      staffsVisibleFilter: false,
      learnersVisibleFilter: false,
      learnerName: '',
      staffName: '',
      staffs: [],
      isDrawerTitle: false,
      learners: [],
      staffId: null,
      learnerId: localStorage.getItem('studentId'),
      selectedStaff: { id: '', name: '' },
    }

    // this.handleUserName = this.handleUserName.bind(this)
  }

  componentDidMount() {
    const { dispatch, user, learnersprogram } = this.props
    console.log(learnersprogram, 'lplp')

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

    if (user.role === 'school_admin') {
      const thp = localStorage.getItem('therapistId')
      client.query({ query: STAFF_LIST }).then(res => {
        if ((res.data.staffs.edges.length > 0 && !thp) || thp === undefined) {
          localStorage.setItem('therapistId', JSON.stringify(res.data.staffs.edges[0].node.id))
        }
        this.setState({
          staffs: res.data.staffs.edges,
          selectedStaff: res.data.staffs.edges[0].node,
        })
      })
    } else {
      this.setState({
        selectedStaff: { id: user.staffId, name: user.staffName },
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props
    if (user.staffName !== prevProps.user.staffName) {
      this.setState({
        selectedStaff: { id: user.staffId, name: user.staffName },
      })
    }
  }

  handleUserName = (text, name) => {
    console.log(text, name, 'txtname')
    if (text === 'student') {
      this.setState({
        learnerName: name,
        staffName: '',
      })
    }
    if (text === 'therapist') {
      this.setState({
        learnerName: '',
        staffName: name,
      })
    }
  }

  handleLearner = () => {
    this.setState({
      learnersVisibleFilter: true,
    })
  }

  studentChanged = id => this.setState({ learnerId: id })

  staffChanged = id => {
    if (id && id !== undefined) {
      localStorage.setItem('therapistId', JSON.stringify(id))
      localStorage.setItem('fetchFor', 'therapist')
      this.setState({ staffId: id })
    }
  }

  handleIsLearnerById = () => {
    this.setState({
      isLearnerById: false,
    })
  }

  handleStaff = () => {
    this.setState({
      learnersVisibleFilter: false,
      staffsVisibleFilter: true,
    })
  }

  callback(key) {
    // if (key === '1') {
    //   setIsDrawerTitle(false)
    // }
    // if (key === '2') {
    //   setIsDrawerTitle(true)
    // }
  }

  render() {
    const {
      isStaffById,
      userRole,
      staffsVisibleFilter,
      isLearnerById,
      staffId,
      learnersVisibleFilter,
      learnerId,
      isAuthorization,
      isDrawerTitle,
      learnerName,
      staffName,
    } = this.state

    console.log(this.state, 'this state')
    const std = localStorage.getItem('studentId')
    let fetchFor = localStorage.getItem('fetchFor')

    if (userRole === 'school_admin') {
      fetchFor = fetchFor ? fetchFor : 'student'
    } else if (userRole === 'therapist') {
      fetchFor = fetchFor ? fetchFor : 'therapist'
    } else if (userRole === 'parent') {
      fetchFor = fetchFor ? fetchFor : 'student'
    }

    console.log(fetchFor, 'fetch for for for for')
    console.log(learnerName, staffName, 'lrtst')
    return (
      <>
        <div className="file_upload_section">
          <div className="file_upload_header">
            <div className="header_container">
              <div className="header_content">
                <div className="tabs_container">
                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="Files" key="1">
                      <AllFiles
                        isStaffById={fetchFor === 'therapist'}
                        isLearnerById={fetchFor === 'student'}
                        staffId={staffId}
                        learnerId={std}
                        handleUserName={this.handleUserName}
                      />
                    </TabPane>
                    {isAuthorization ? (
                      <TabPane tab="New Authorization" key="2">
                        <NewAuthorization />
                      </TabPane>
                    ) : (
                      <TabPane tab="New File" key="2">
                        <FileUploadFrom
                          isStaffById={fetchFor === 'therapist'}
                          isLearnerById={fetchFor === 'student'}
                          learnerId={learnerId}
                          staffId={staffId}
                        />
                      </TabPane>
                    )}
                  </Tabs>
                </div>
              </div>
            </div>
            {userRole === 'school_admin' && isDrawerTitle === false ? (
              <div className="filter_as_clinic">
                <p onClick={this.handleStaff} className="staffs_title">
                  Staff
                </p>
                <p onClick={this.handleLearner} className="learners_title">
                  Learners
                </p>
              </div>
            ) : null}
            {/* {userRole === 'therapist' && isDrawerTitle === false ? (
              <div className="filter_as_clinic">
                <p onClick={handleLearner} className="learners_title">
                  Learners
                </p>
              </div>
            ) : null} */}

            <Drawer
              visible={staffsVisibleFilter}
              onClose={() => this.setState({ staffsVisibleFilter: false })}
              width={DRAWER.widthL4}
              title="Staffs"
              placement="right"
            >
              <StaffsList staffs={this.state.staffs} staffChanged={this.staffChanged} />
            </Drawer>

            <Drawer
              visible={learnersVisibleFilter}
              onClose={() => this.setState({ learnersVisibleFilter: false })}
              width={DRAWER.widthL4}
              title="Learners"
              placement="right"
            >
              <LearnerSelect />
            </Drawer>
          </div>
          <p className="student_name">
            {!learnerName && !staffName
              ? `Select Staff/Learner`
              : learnerName
              ? `Learner - ${learnerName}'s Files`
              : `Staff - ${staffName}'s Files`}
          </p>
        </div>
      </>
    )
  }
}

export default Index
