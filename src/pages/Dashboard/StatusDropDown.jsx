import React, { useState } from 'react'
import { Button, Dropdown, Menu } from 'antd'

const StatusDropDown = ({ statuses, onStatusChange, titleText, defaultValue }) => {
  const [status, setStatus] = useState(defaultValue ?? 'All')

  const updateStatus = newStatus => {
    setStatus(newStatus)
    onStatusChange(newStatus)
  }

  const statusMenuItems = (
    <Menu>
      {statuses?.map(statusText => (
        <Menu.Item key={statusText}>
          <Button type="link" onClick={() => updateStatus(statusText)}>
            {statusText}
          </Button>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    statuses && (
      <Dropdown overlay={statusMenuItems}>
        <a href="#" style={{ color: '#0190fe' }}>
          {titleText ?? 'Status'} : {status}
        </a>
      </Dropdown>
    )
  )
}

export default StatusDropDown
