/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Drawer, Tabs } from 'antd'
import { DRAWER } from 'assets/styles/globalStyles'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import client from '../../apollo/config'
import AllFiles from './AllFiles'
import FileUploadFrom from './FileUploadFrom'
import './index.scss'
import LearnersList from './LearnersList'
import NewAuthorization from './NewAuthorization'
import StaffsList from './StaffsList'

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

const STAFF_LIST = gql`
  query {
    staffs {
      edges {
        node {
          id
          name
          email
          gender
          empType
          user {
            id
          }
        }
      }
    }
  }
`

const GET_ALL_LEARNERS = gql`
  query {
    students(isActive: true) {
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
  }
`

const index = () => {
  const isAuthorization = false
  const [staffs, setStaffs] = useState([])
  const [learners, setLearners] = useState([])
  const [selectedStaffs, setSelectedStaffs] = useState({ id: '', name: '' })
  const user = useSelector(state => state.user)
  const userRole = JSON.parse(localStorage.getItem('role'))
  const [staffsVisibleFilter, setStaffsVisibleFilter] = useState(false)
  const [learnersVisibleFilter, setLearnersVisibleFilter] = useState(false)
  const [learnerId, setLearnerId] = useState('')
  const [staffId, setStaffId] = useState('')

  const [isLearnerById, setIsLearnerById] = useState(false)
  const [isStaffById, setIsStaffById] = useState(false)

  console.log('staffId ====>', staffId, '<==== staffId')

  useEffect(() => {
    client.query({ query: GET_ALL_LEARNERS }).then(res => setLearners(res.data.students.edges))
  }, [])

  useEffect(() => {
    if (user.role === 'school_admin') {
      client.query({ query: STAFF_LIST }).then(res => {
        setStaffs(res.data.staffs.edges)
        setSelectedStaffs(res.data.staffs.edges[0].node)
      })
    }
  }, [])

  const studentChanged = id => setLearnerId(id)
  const staffChanged = id => setStaffId(id)

  const handleLearner = () => {
    setLearnersVisibleFilter(true)
    // if(isStaffById) {
    setIsStaffById(false)
    setStaffId('')
    setIsLearnerById(true)

    // }
  }
  const handleIsLearnerById = () => {
    setIsLearnerById(false)
  }

  const handleStaff = () => {
    setStaffsVisibleFilter(true)
    // if(isLearnerById){
    setIsLearnerById(false)
    setLearnerId('')
    setIsStaffById(true)

    // }
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
                    />
                  </TabPane>
                  {isAuthorization ? (
                    <TabPane tab="New Authorization" key="2">
                      <NewAuthorization />
                    </TabPane>
                  ) : (
                    <TabPane tab="New File" key="2">
                      <FileUploadFrom />
                    </TabPane>
                  )}
                </Tabs>
              </div>
            </div>
          </div>
          {userRole === 'school_admin' ? (
            <div className="filter_as_clinic">
              <p onClick={handleStaff} className="staffs_title">
                Staffs
              </p>
              <p onClick={handleLearner} className="learners_title">
                Learners
              </p>
            </div>
          ) : null}
          {userRole === 'therapist' ? (
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
      </div>
    </>
  )
}

export default index
