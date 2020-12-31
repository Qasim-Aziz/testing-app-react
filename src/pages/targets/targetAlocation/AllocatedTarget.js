/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react'
import { Typography, Empty, Input } from 'antd'
import styles from './style.module.scss'
import AllocatedTargetCard from '../../../components/AllocatedTargetCard'
import { alreadyAlloctedTarget } from './TargetAllocation.query'
import { notNull } from '../../../utilities'

const { Title, Text } = Typography

const AllocatedTarget = ({ allocatedTarget, editAllocatedTarget, editAble }) => {
  const [allocatedTargetClone, setAllocatedTargetClone] = useState(allocatedTarget)

  const searchTarget = text => {
    // console.log(text)
    const searchedTargetList = []
    if (allocatedTarget.length > 0) {
      allocatedTarget.map(target => {
        if (target.node.targetAllcatedDetails.targetName.includes(text)) {
          searchedTargetList.push(target)
        }
      })
    }
    // console.log(searchedTargetList)
    setAllocatedTargetClone(searchedTargetList)
  }



  return (
    <>
      <div>
        <Title
          style={{
            color: '#000',
            fontSize: 20,
            lineHeight: '25px',
            display: 'inline',
            marginTop: 15,
            fontWeight: '500',
          }}
        >
          Allocated Targets
        </Title>
        {/* <Title style={{ fontSize: 18, lineHeight: '22px', }}>Allocated Targets</Title> */}
        {allocatedTarget && allocatedTarget.length > 0 && (
          <>
            <Input
              placeholder="Search Targets"
              onChange={e => searchTarget(e.target.value)}
              style={{ marginBottom: 16, marginTop: 10 }}
            />
          </>
        )}

        <div style={{height: 550, overflow: 'auto'}}>
          {allocatedTargetClone && allocatedTargetClone.length > 0 ? (
            allocatedTargetClone.map(aTarget => {
              return (
                <AllocatedTargetCard
                  editAble={editAble}
                  editAllocatedTarget={editAllocatedTarget}
                  key={aTarget.node.id}
                  node={aTarget.node}
                  heading={aTarget.node.targetAllcatedDetails.targetName}
                  status={aTarget.node.targetStatus.statusName}
                />
              )
            })
          ) : (
              <div className="text-center">
                <Empty />
              </div>
            )}
        </div>
      </div>
    </>
  )
}

export default AllocatedTarget
