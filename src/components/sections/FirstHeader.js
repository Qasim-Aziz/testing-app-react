import React, { Component } from 'react'
import { Badge } from 'antd'
import dashboardIcon from '../../icons/dashboard.png'
import partnersIcon from '../../icons/partners.jpeg'
import filesIcon from '../../icons/files.jpeg'
import recordingDataIcon from '../../icons/recording.jpeg'
import shedulingIcon from '../../icons/sheduling.jpeg'
import messagesIcon from '../../icons/messages.jpeg'

class FirstHeader extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          height: '30px',
          padding: '0 10px',
        }}
      >
        <Badge>
          <img
            alt="dashboardIcon"
            src={dashboardIcon}
            style={{ width: '18px', height: '18px', opacity: '0.5' }}
          />
          <span style={{ padding: '', marginRight: '20px' }}>Dashboard</span>
        </Badge>
        <Badge>
          <img
            alt="dashboardIcon"
            src={partnersIcon}
            style={{ width: '18px', height: '18px', marginRight: '5px', opacity: '0.5' }}
          />
          <span style={{ padding: '', marginRight: '20px' }}>Partners</span>
        </Badge>
        <Badge>
          <img
            alt="dashboardIcon"
            src={filesIcon}
            style={{ width: '18px', height: '18px', marginRight: '5px', opacity: '0.5' }}
          />
          <span style={{ padding: '', marginRight: '20px' }}>Files</span>
        </Badge>
        <Badge>
          <img
            alt="dashboardIcon"
            src={recordingDataIcon}
            style={{ width: '18px', height: '18px', marginRight: '5px', opacity: '0.5' }}
          />
          <span style={{ padding: '', marginRight: '20px' }}>Record Data</span>
        </Badge>
        <Badge>
          <img
            alt="dashboardIcon"
            src={dashboardIcon}
            style={{ width: '18px', height: '18px', marginRight: '5px', opacity: '0.5' }}
          />
          <span style={{ padding: '', marginRight: '20px' }}>Therapy</span>
        </Badge>
        <Badge>
          <img
            alt="dashboardIcon"
            src={shedulingIcon}
            style={{ width: '18px', height: '18px', marginRight: '5px', opacity: '0.5' }}
          />
          <span style={{ padding: '', marginRight: '20px' }}>Sheduling</span>
        </Badge>
        <Badge>
          <img
            alt="dashboardIcon"
            src={dashboardIcon}
            style={{ width: '18px', height: '18px', marginRight: '5px', opacity: '0.5' }}
          />
          <span style={{ padding: '', marginRight: '20px' }}>Dashboard</span>
        </Badge>
        <Badge>
          <img
            alt="dashboardIcon"
            src={dashboardIcon}
            style={{ width: '18px', height: '18px', marginRight: '5px', opacity: '0.5' }}
          />
          <span style={{ padding: '', marginRight: '20px' }}>Dashboard</span>
        </Badge>
        <Badge>
          <img
            alt="dashboardIcon"
            src={messagesIcon}
            style={{ width: '18px', height: '18px', marginRight: '5px', opacity: '0.5' }}
          />{' '}
          <span>Dashboard</span>
        </Badge>
      </div>
    )
  }
}

export default FirstHeader
