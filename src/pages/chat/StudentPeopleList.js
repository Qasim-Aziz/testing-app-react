/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react'
import { notification, Tabs, Input } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-apollo'
import profileImg from 'images/student.jpg'
import ChatUserCard from './ChatUserCard'
import { GET_STAFF, GET_STUDENT_CLINIC, STUDENT_DETAILS } from './query'
import './style.scss'

const { Search } = Input

const { TabPane } = Tabs

export default ({ select, setSelect, setSelectedPeopleDetails }) => {
  const { data: studentDetails } = useQuery(STUDENT_DETAILS, {
    variables: {
      id: useSelector(state => state.user.id),
    },
  })
  const [gotcha, setGotcha] = useState(true)
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

  if (viewStaff && viewStaff.length > 0 && !select && gotcha) {
    setSelect(viewStaff[0].node.user?.id)
    setSelectedPeopleDetails({
      name: viewStaff[0].node.name,
      profileImg: viewStaff[0].node.image,
      id: viewStaff[0].node.user?.id,
      role: 'Therapist',
    })
    setGotcha(false)
  }
  return (
    <Tabs type="card">
      <TabPane tab="Therapists" key="1">
        <div className="search-msg" style={{ display: 'flex', height: '60px' }}>
          <Search
            size="large"
            allowClear
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
        <Scrollbars style={{ height: 'calc(100vh - 243px)' }} autoHide>
          {staffLoading && <h4 style={{ textAlign: 'center', marginTop: 50 }}>Loading...</h4>}
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
      <TabPane tab="Clinic" key="2">
        <Scrollbars style={{ height: 'calc(100vh - 243px)' }} autoHide>
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
                setSelectedPeopleDetails={setSelectedPeopleDetails}
                id={clinic.student.school.user.id}
              />
            </div>
          )}
        </Scrollbars>
      </TabPane>
    </Tabs>
  )
}
