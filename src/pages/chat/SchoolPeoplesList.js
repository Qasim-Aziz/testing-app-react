import React, { useEffect, useState } from 'react'
import { notification, Tabs, Input } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { useQuery } from 'react-apollo'
import profileImg from 'images/student.jpg'
import ChatUserCard from './ChatUserCard'
import { GET_STAFF, GET_STUDENT } from './query'

const { Search } = Input

const { TabPane } = Tabs

export default ({ select, setSelect }) => {
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

  return (
    <Tabs type="card">
      <TabPane tab="Learners" key="1">
        <Scrollbars style={{ height: 'calc(100vh - 200px)' }} autoHide>
          <Search
            size="large"
            style={{
              marginBottom: 15,
            }}
            onChange={e => handleStudentSearch(e.target.value)}
            onSearch={handleStudentSearch}
            placeholder="Search with learner name"
          />
          {studentLoading && <h4 style={{ textAlign: 'center', marginTop: 50 }}>Loading...</h4>}
          {viewStudent.map(({ node }, index) => {
            return (
              <div key={node.id} style={{ marginTop: index !== 0 ? 18 : 0 }}>
                <ChatUserCard
                  profileImg={profileImg}
                  name={node.firstname}
                  // eslint-disable-next-line jsx-a11y/aria-role
                  role="Learner"
                  selected={select === node.parent?.id}
                  setSelectedPeople={setSelect}
                  id={node.parent?.id}
                />
              </div>
            )
          })}
        </Scrollbars>
      </TabPane>
      <TabPane tab="Therapists" key="2">
        <Search
          size="large"
          style={{
            marginBottom: 15,
          }}
          onChange={e => handleTherapistSearch(e.target.value)}
          onSearch={handleTherapistSearch}
          placeholder="Search with therapist name"
        />
        {staffLoading && <h4 style={{ textAlign: 'center', marginTop: 50 }}>Loading...</h4>}
        <Scrollbars style={{ height: 'calc(100vh - 200px)' }} autoHide>
          {viewStaff.map(({ node }) => {
            return (
              <div key={node.id} style={{ marginTop: 18 }}>
                <ChatUserCard
                  profileImg={profileImg}
                  name={node.name}
                  // eslint-disable-next-line jsx-a11y/aria-role
                  role="Therapist"
                  selected={select === node.user?.id}
                  setSelectedPeople={setSelect}
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
