import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import LeftSidePanel from './LeftSidePanel'
import RightSidePanel from './RightSidePanel'

import '../Style.scss'

const TherapistDashboard = () => {
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [activeProfileTabKey, setActiveProfileTabKey] = useState('contact-details')

  const updateActiveProfileTab = updatedKey => {
    setActiveTabKey('2') // Open Profile Tab first
    setActiveProfileTabKey(updatedKey)
  }

  return (
    <>
      <Helmet title="Dashboard" />
      <div
        className="parent-dashboard"
        style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#dbe2ef' }}
      >
        <LeftSidePanel onActiveProfileTabChange={updateActiveProfileTab} />
        <RightSidePanel
          activeTabKey={activeTabKey}
          onActiveTabChange={setActiveTabKey}
          activeProfileTabKey={activeProfileTabKey}
          onActiveProfileTabChange={setActiveProfileTabKey}
        />
      </div>
    </>
  )
}
export default TherapistDashboard
