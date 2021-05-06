/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Drawer, Tabs } from 'antd'
import { DRAWER } from 'assets/styles/globalStyles'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import client from '../../apollo/config'
import AllFiles from './AllFiles'
import FileUploadFrom from './FileUploadFrom'
import './index.scss'
import LearnersList from './LearnersList'
import NewAuthorization from './NewAuthorization'
import { GET_ALL_LEARNERS, STAFF_LIST } from './query'
import StaffsList from './StaffsList'

const { TabPane } = Tabs

const index = () => {
  const isAuthorization = false
  const [staffs, setStaffs] = useState([])
  const [learners, setLearners] = useState([])
  const user = useSelector(state => state.user)
  const userRole = JSON.parse(localStorage.getItem('role'))
  const [staffsVisibleFilter, setStaffsVisibleFilter] = useState(false)
  const [learnersVisibleFilter, setLearnersVisibleFilter] = useState(false)
  const [learnerId, setLearnerId] = useState('')
  const [staffId, setStaffId] = useState('')

  const [isLearnerById, setIsLearnerById] = useState(false)
  const [isStaffById, setIsStaffById] = useState(false)

  const [learnerName, setLearnerName] = useState('')
  const [staffName, setStaffName] = useState('')

  const [isDrawerTitle, setIsDrawerTitle] = useState(false)

  useEffect(() => {
    client.query({ query: GET_ALL_LEARNERS }).then(res => setLearners(res.data.students.edges))
  }, [])

  useEffect(() => {
    if (user.role === 'school_admin') {
      client.query({ query: STAFF_LIST }).then(res => {
        setStaffs(res.data.staffs.edges)
      })
    }
  }, [])

  const studentChanged = id => setLearnerId(id)
  const staffChanged = id => setStaffId(id)

  const handleLearner = () => {
    setLearnersVisibleFilter(true)
    setIsStaffById(false)
    setStaffId('')
    setIsLearnerById(true)
  }
  const handleIsLearnerById = () => {
    setIsLearnerById(false)
  }

  const handleStaff = () => {
    setStaffsVisibleFilter(true)
    setIsLearnerById(false)
    setLearnerId('')
    setIsStaffById(true)
  }

  const handleUserName = (text, name) => {
    if (text === 'learner') {
      setLearnerName(name)
      setStaffName('')
    }
    if (text === 'staff') {
      setStaffName(name)
      setLearnerName('')
    }
  }
  function callback(key) {
    if (key === '1') {
      setIsDrawerTitle(false)
    }
    if (key === '2') {
      setIsDrawerTitle(true)
    }
  }

  return (
    <>
      <div className="file_upload_section">
        <div className="file_upload_header">
          <div className="header_container">
            <div className="header_content">
              <div className="tabs_container">
                <Tabs defaultActiveKey="1" onChange={callback}>
                  <TabPane tab="Files" key="1">
                    <AllFiles
                      isStaffById={isStaffById}
                      isLearnerById={isLearnerById}
                      staffId={staffId}
                      learnerId={learnerId}
                      handleUserName={handleUserName}
                    />
                  </TabPane>
                  {isAuthorization ? (
                    <TabPane tab="New Authorization" key="2">
                      <NewAuthorization />
                    </TabPane>
                  ) : (
                    <TabPane tab="New File" key="2">
                      <FileUploadFrom
                        isStaffById={isStaffById}
                        isLearnerById={isLearnerById}
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
              <p onClick={handleStaff} className="staffs_title">
                Staff
              </p>
              <p onClick={handleLearner} className="learners_title">
                Learners
              </p>
            </div>
          ) : null}
          {userRole === 'therapist' && isDrawerTitle === false ? (
            <div className="filter_as_clinic">
              <p onClick={handleLearner} className="learners_title">
                Learners
              </p>
            </div>
          ) : null}

          <Drawer
            visible={staffsVisibleFilter}
            onClose={() => setStaffsVisibleFilter(false)}
            width={DRAWER.widthL4}
            title="Staffs"
            placement="right"
          >
            <StaffsList staffs={staffs} staffChanged={staffChanged} />
          </Drawer>

          <Drawer
            visible={learnersVisibleFilter}
            onClose={() => setLearnersVisibleFilter(false)}
            width={DRAWER.widthL4}
            title="Learners"
            placement="right"
          >
            <LearnersList
              studentChanged={studentChanged}
              learners={learners}
              handleIsLearnerById={handleIsLearnerById}
            />
          </Drawer>
        </div>
        <p className="student_name">
          {!learnerName && !staffName
            ? `Select Staff/Learner`
            : learnerName
            ? `${learnerName} - Learner`
            : `${staffName} - Therapist`}
        </p>
      </div>
    </>
  )
}

export default index
