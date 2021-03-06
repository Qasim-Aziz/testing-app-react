/* eslint-disable react/jsx-indent-props */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react'
import { notification, Tabs, Input } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { useQuery } from 'react-apollo'
import profileImg from 'images/student.jpg'
import { useSelector } from 'react-redux'
import ChatUserCard from './ChatUserCard'
import { GET_STUDENT, GET_THERAPIST_CLINIC, GET_THERAPIST_ID } from './query'
import './style.scss'

const { Search } = Input
const { TabPane } = Tabs

export default ({ select, setSelect, setSelectedPeopleDetails }) => {
  const userId = useSelector(state => state.user.id)
  const [gotcha, setGotcha] = useState(true)
  const { data: therapistDetails } = useQuery(GET_THERAPIST_ID, {
    variables: {
      id: userId,
    },
  })
  const { data: student, error: studentError, loading: studentLoading } = useQuery(GET_STUDENT)
  const { data: clinic, error: clinicError, loading: clinicLoading } = useQuery(
    GET_THERAPIST_CLINIC,
    {
      skip: !therapistDetails,
      variables: {
        id: therapistDetails?.users.staffSet.edges[0].node.id,
      },
    },
  )
  const [viewStudent, setViewStudent] = useState([])

  useEffect(() => {
    if (studentError) {
      notification.error({
        message: 'Error to load learners',
      })
    }
    if (clinicError) {
      notification.error({
        message: 'Error to load staff',
      })
    }
  }, [studentError, clinicError])

  useEffect(() => {
    if (student) {
      setViewStudent(student.students.edges)
    }
  }, [student])

  const handleStudentSearch = v => {
    setViewStudent(() => {
      console.log(v)
      return student.students.edges.filter(({ node }) => {
        const studentName = node.firstname
        return studentName.toLowerCase().includes(v.toLowerCase())
      })
    })
  }

  console.log(select, 'this is select')
  if (viewStudent && viewStudent.length > 0 && !select && gotcha) {
    console.log('gotcha ')
    setSelect(viewStudent[0].node.parent?.id)
    setSelectedPeopleDetails({
      name: viewStudent[0].node.firstname,
      profileImg: viewStudent[0].node.image,
      id: viewStudent[0].node.parent?.id,
      role: 'Learner',
    })
    setGotcha(false)
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
                  profileImg={profileImg}
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
      <TabPane tab="Clinic" key="2">
        {clinicLoading && <h4 style={{ textAlign: 'center', marginTop: 50 }}>Loading...</h4>}
        <Scrollbars style={{ height: 'calc(100vh - 243px)', paddingRight: '6px' }} autoHide>
          {clinic && (
            <div key={clinic.staff.school.user.id} style={{ marginTop: 18 }}>
              <ChatUserCard
                profileImg={profileImg}
                name={clinic.staff.school.schoolName}
                // eslint-disable-next-line jsx-a11y/aria-role
                role="Clinic"
                selected={select === clinic.staff.school.user.id}
                setSelectedPeople={setSelect}
                setSelectedPeopleDetails={setSelectedPeopleDetails}
                id={clinic.staff.school.user.id}
              />
            </div>
          )}
        </Scrollbars>
      </TabPane>
    </Tabs>
  )
}
