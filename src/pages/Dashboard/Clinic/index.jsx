import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'

import LeftSidePanel from './LeftSidePanel'
import RightSidePanel from './RightSidePanel'

import '../Style.scss'

const ClinicDashboard = () => {
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [activeProfileTabKey, setActiveProfileTabKey] = useState('contact-details')

  const updateActiveProfileTab = updatedKey => {
    setActiveTabKey('2') // Open Profile Tab first
    setActiveProfileTabKey(updatedKey)
  }

  return (
    <Authorize roles={['school_admin']} redirect to="/dashboard">
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
export default ClinicDashboard
