/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable array-callback-return */
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Collapse, Input } from 'antd'
import React, { useState } from 'react'

const { Panel } = Collapse

const LearnersList = ({ learners, studentChanged, handleIsLearnerById }) => {
  const pstyle = { marginBottom: 0 }
  const [filteredLearners, setFilteredLearners] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)
  const userRole = JSON.parse(localStorage.getItem('role'))

  const searchLearner = text => {
    if (text) {
      setIsFiltered(true)
    } else {
      setIsFiltered(false)
    }

    const searchedLearnersList = []
    if (learners.length > 0) {
      learners.map(itemNode => {
        if (itemNode.node.firstname.toLowerCase().includes(text.toLowerCase())) {
          searchedLearnersList.push(itemNode)
        }
      })
    }
    setFilteredLearners(searchedLearnersList)
  }

  const displayFunc = nodeItem => (
    <Panel
      extra={nodeItem.node.category?.category}
      showArrow={false}
      header={
        <>
          <FontAwesomeIcon style={{ color: '#777' }} icon={faUser} />{' '}
          <Button style={{ padding: 0, height: 22 }} type="link">
            {nodeItem.node.firstname} {nodeItem.node.lastname}
          </Button>
        </>
      }
      key={nodeItem.node.id}
    >
      <p style={pstyle}>
        <span style={{ fontWeight: 700 }}>Email :</span> {nodeItem.node.email}
      </p>
      <p style={pstyle}>
        <span style={{ fontWeight: 700 }}>Phone :</span> {nodeItem.node.mobileno}
      </p>
      <hr />
      <p style={pstyle}>
        <span style={{ fontWeight: 700 }}>Case Manager : </span>
        {nodeItem.node.caseManager?.name}
      </p>
      <p style={pstyle}>
        <span style={{ fontWeight: 700 }}>CM Email : </span>
        {nodeItem.node.caseManager?.email}
      </p>
      <p style={pstyle}>
        <span style={{ fontWeight: 700 }}>CM Phone : </span>
        {nodeItem.node.caseManager?.contactNo}
      </p>
    </Panel>
  )

  return (
    <>
      {userRole === 'therapist' && (
        <p
          style={{
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            border: '1px solid #D9D9D9',
            width: '40%',
            padding: '1%',
            textAlign: 'center',
            borderRadius: '5px',
          }}
          onClick={handleIsLearnerById}
        >
          Get Your Own data
        </p>
      )}
      <div style={{ padding: '0px 5px' }}>
        <Input
          placeholder="Search learner by name"
          onChange={e => searchLearner(e.target.value)}
          style={{ marginRight: 16, marginBottom: 5, backgroundColor: '#f9f9f9' }}
        />
        <div style={{ overflow: 'auto' }}>
          <Collapse
            style={{ backgroundColor: '#f9f9f9' }}
            onChange={id => studentChanged(id)}
            accordion
          >
            {isFiltered
              ? filteredLearners.map(nodeItem => displayFunc(nodeItem))
              : learners.map(nodeItem => displayFunc(nodeItem))}
          </Collapse>
        </div>
      </div>
    </>
  )
}

export default LearnersList
