/* eslint-disable jsx-a11y/aria-role */
import React, { useEffect, useState } from 'react'
import { notification, Tabs, Input } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { useQuery } from 'react-apollo'
import profileImg from 'images/student.jpg'
import ChatUserCard from './ChatUserCard'
import { GET_STAFF, GET_STUDENT } from './query'
import './style.scss'

const { Search } = Input

const { TabPane } = Tabs

export default ({ select, setSelect, setSelectedPeopleDetails }) => {
  const { data: student, error: studentError, loading: studentLoading } = useQuery(GET_STUDENT)
  const { data: staff, error: staffError, loading: staffLoading } = useQuery(GET_STAFF)
  const [viewStudent, setViewStudent] = useState([])
  const [viewStaff, setViewStaff] = useState([])

  useEffect(() => {
    if (studentError) {
      notification.error({
        message: 'Error to load student',
      })
    }
    if (staffError) {
      notification.error({
        message: 'Error to load staff',
      })
    }
  }, [studentError, staffError])

  useEffect(() => {
    if (student) {
      setViewStudent(student.students.edges)
    }
  }, [student])

  useEffect(() => {
    if (staff) {
      setViewStaff(staff?.staffs.edges)
    }
  }, [staff])

  const handleStudentSearch = v => {
    setViewStudent(() => {
      console.log(v)
      return student.students.edges.filter(({ node }) => {
        const studentName = node.firstname
        return studentName.toLowerCase().includes(v.toLowerCase())
      })
    })
  }

  const handleTherapistSearch = v => {
    setViewStaff(() => {
      return staff?.staffs.edges.filter(({ node }) => {
        const staffName = node.name
        return staffName.toLowerCase().includes(v.toLowerCase())
      })
    })
  }

  if (viewStudent && viewStudent.length > 0 && select === -1) {
    setSelect(viewStudent[0].node.parent?.id)
    setSelectedPeopleDetails({
      name: viewStudent[0].node.firstname,
      profileImg: viewStudent[0].node.image,
      id: viewStudent[0].node.parent?.id,
      role: 'Learner',
    })
  }

  return (
    <Tabs type="card">
      <TabPane tab="Learners" key="1">
        <div className="search-msg" style={{ display: 'flex', height: '60px' }}>
          <Search
            size="large"
            style={{
              margin: 'auto',
              width: '90%',
              borderRadius: '20px',
              borderBottom: '1px solid #e8e8e8',
            }}
            onChange={e => handleStudentSearch(e.target.value)}
            onSearch={handleStudentSearch}
            placeholder="Search with learner name"
          />
        </div>
        <Scrollbars style={{ height: 'calc(100vh - 243px)', paddingRight: '6px' }} autoHide>
          {studentLoading && <h4 style={{ textAlign: 'center', marginTop: 50 }}>Loading...</h4>}
          {viewStudent.map(({ node }, index) => {
            return (
              <div key={node.id}>
                <ChatUserCard
                  profileImg={node.image ? node.image : profileImg}
                  name={node.firstname}
                  role="Learner"
                  selected={select === node.parent?.id}
                  setSelectedPeople={setSelect}
                  setSelectedPeopleDetails={setSelectedPeopleDetails}
                  id={node.parent?.id}
                />
              </div>
            )
          })}
        </Scrollbars>
      </TabPane>
      <TabPane tab="Therapists" key="2">
        <div className="search-msg" style={{ display: 'flex', height: '60px' }}>
          <Search
            size="large"
            style={{
              margin: 'auto',
              width: '90%',
              borderRadius: '20px',
              borderBottom: '1px solid #e8e8e8',
            }}
            onChange={e => handleTherapistSearch(e.target.value)}
            onSearch={handleTherapistSearch}
            placeholder="Search with therapist name"
          />
        </div>
        {staffLoading && <h4 style={{ textAlign: 'center', marginTop: 50 }}>Loading...</h4>}
        <Scrollbars style={{ height: 'calc(100vh - 243px)', paddingRight: '6px' }} autoHide>
          {viewStaff.map(({ node }) => {
            return (
              <div key={node.id}>
                <ChatUserCard
                  profileImg={profileImg}
                  name={node.name}
                  // eslint-disable-next-line jsx-a11y/aria-role
                  role="Therapist"
                  selected={select === node.user?.id}
                  setSelectedPeople={setSelect}
                  setSelectedPeopleDetails={setSelectedPeopleDetails}
                  id={node.user?.id}
                />
              </div>
            )
          })}
        </Scrollbars>
      </TabPane>
    </Tabs>
  )
}
