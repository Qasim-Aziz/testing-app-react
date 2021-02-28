import React from 'react'
import { Button, Collapse } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const { Panel } = Collapse

const StaffSelect = ({ Staffs, selectStaff }) => {
  return (
    <>
      <div style={{ padding: '0px 5px' }}>
        {/* <Input
          placeholder="Search staff by name"
          onChange={e => searchStaff(e.target.value)}
          style={{ marginRight: 16, marginBottom: 5, backgroundColor: '#f9f9f9' }}
        /> */}
        <div style={{ overflow: 'auto' }}>
          {Staffs.map(nodeItem => (
            <div
              key={nodeItem.node.id}
              style={{
                display: 'flex',
                height: 22,
                background: 'rgb(243 243 243)',
                padding: '21px 16px',
                /* border: 1px solid; */
                margin: '8px 0',
                borderRadius: '4px',
                alignItems: 'center',
              }}
            >
              <FontAwesomeIcon style={{ color: '#777' }} icon={faUser} />{' '}
              <Button onClick={() => selectStaff(nodeItem.node)} type="link">
                {nodeItem.node.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default StaffSelect
