import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { useDispatch } from 'react-redux'
import LeftSidePanel from './LeftSidePanel'
import RightSidePanel from './RightSidePanel'

import '../Style.scss'

const TherapistDashboard = () => {
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [activeProfileTabKey, setActiveProfileTabKey] = useState('account-details')
  const dispatch = useDispatch()
  const updateActiveProfileTab = updatedKey => {
    setActiveTabKey('2') // Open Profile Tab first
    setActiveProfileTabKey(updatedKey)
  }

  useEffect(() => {
    dispatch({
      type: 'learnersprogram/LOAD_DATA',
    })

    dispatch({
      type: 'student/STUDENT_DETAILS',
    })
  }, [])

  return (
    <Authorize roles={['therapist']} redirect to="/dashboard">
      <Helmet title="Dashboard" />
      <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#f4f4f4' }}>
        <LeftSidePanel onActiveProfileTabChange={updateActiveProfileTab} />
        <RightSidePanel
          activeTabKey={activeTabKey}
          onActiveTabChange={setActiveTabKey}
          activeProfileTabKey={activeProfileTabKey}
          onActiveProfileTabChange={setActiveProfileTabKey}
        />
      </div>
    </Authorize>
  )
}
export default TherapistDashboard
