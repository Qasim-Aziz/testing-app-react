/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react'
import { notification, Tabs, Input } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-apollo'
import profileImg from 'images/student.jpg'
import ChatUserCard from './ChatUserCard'
import { GET_STAFF, GET_STUDENT_CLINIC, STUDENT_DETAILS } from './query'

const { Search } = Input

const { TabPane } = Tabs

export default ({ select, setSelect }) => {
  const { data: studentDetails } = useQuery(STUDENT_DETAILS, {
    variables: {
      id: useSelector(state => state.user.id),
    },
  })
  const { data: staff, error: staffError, loading: staffLoading } = useQuery(GET_STAFF)
  const { data: clinic, error: clinicError, loading: clinicLoading } = useQuery(
    GET_STUDENT_CLINIC,
    {
      skip: !studentDetails,
      variables: {
        id: studentDetails?.users.studentsSet.edges[0].node.id,
      },
    },
  )
  const [viewStaff, setViewStaff] = useState([])

  useEffect(() => {
    if (clinicError) {
      notification.error({
        message: 'Error to load clinic',
      })
    }
    if (staffError) {
      notification.error({
        message: 'Error to load staff',
      })
    }
  }, [clinicError, staffError])

  useEffect(() => {
    if (staff) {
      setViewStaff(staff?.staffs.edges)
    }
  }, [staff])

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
      <TabPane tab="Therapists" key="1">
        <Scrollbars style={{ height: 'calc(100vh - 200px)' }} autoHide>
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
      <TabPane tab="Clinic" key="2">
        <Scrollbars style={{ height: 'calc(100vh - 200px)' }} autoHide>
          {clinicLoading && <h4 style={{ textAlign: 'center', marginTop: 50 }}>Loading...</h4>}
          {clinic && (
            <div key={clinic.student.school?.user.id}>
              <ChatUserCard
                profileImg={profileImg}
                name={clinic.student.school.schoolName}
                // eslint-disable-next-line jsx-a11y/aria-role
                role="Clinic"
                selected={select === clinic.student.school.user.id}
                setSelectedPeople={setSelect}
                id={clinic.student.school.user.id}
              />
            </div>
          )}
        </Scrollbars>
      </TabPane>
    </Tabs>
  )
}
