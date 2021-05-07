/* eslint-disable array-callback-return */
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Collapse, Input } from 'antd'
import React, { useState } from 'react'

const { Panel } = Collapse

const StaffsList = ({ staffs, staffChanged }) => {
  const pstyle = { marginBottom: 0 }
  const [filterStaffs, setFilterStaffs] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)

  const searchLearner = text => {
    if (text) {
      setIsFiltered(true)
    } else {
      setIsFiltered(false)
    }

    const searchedStaffsList = []
    if (staffs.length > 0) {
      staffs.map(itemNode => {
        if (itemNode.node.name.toLowerCase().includes(text.toLowerCase())) {
          searchedStaffsList.push(itemNode)
        }
      })
    }
    setFilterStaffs(searchedStaffsList)
  }

  const displayFunc = nodeItem => (
    <Panel
      showArrow={false}
      header={
        <>
          <FontAwesomeIcon style={{ color: '#777' }} icon={faUser} />{' '}
          <Button style={{ padding: 0, height: 22 }} type="link">
            {nodeItem.node.name}
          </Button>
        </>
      }
      key={nodeItem.node.id}
    >
      <p style={pstyle}>
        <span style={{ fontWeight: 700 }}>Email :</span> {nodeItem.node.email}
      </p>
      <p style={pstyle}>
        <span style={{ fontWeight: 700 }}>Gender :</span> {nodeItem.node.gender}
      </p>
    </Panel>
  )

  return (
    <>
      <div style={{ padding: '0px 5px' }}>
        <Input
          placeholder="Search learner by name"
          onChange={e => searchLearner(e.target.value)}
          style={{ marginRight: 16, marginBottom: 5, backgroundColor: '#f9f9f9' }}
        />
        <div style={{ overflow: 'auto' }}>
          <Collapse
            style={{ backgroundColor: '#f9f9f9' }}
            onChange={id => staffChanged(id)}
            accordion
          >
            {isFiltered
              ? filterStaffs.map(nodeItem => displayFunc(nodeItem))
              : staffs.map(nodeItem => displayFunc(nodeItem))}
          </Collapse>
        </div>
      </div>
    </>
  )
}

export default StaffsList
