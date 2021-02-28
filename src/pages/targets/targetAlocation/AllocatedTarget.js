import { Empty, Input, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import AllocatedTargetCard from '../../../components/AllocatedTargetCard'

const { Title } = Typography

const AllocatedTarget = ({ allocatedTarget, editAllocatedTarget, editAble }) => {
  const [allocatedTargetClone, setAllocatedTargetClone] = useState(allocatedTarget)

  useEffect(() => {
    // On changind all target, we also need to update here
    setAllocatedTargetClone(allocatedTarget)
  }, [allocatedTarget])

  const searchTarget = text => {
    const searchedTargetList = []
    if (allocatedTarget.length > 0) {
      allocatedTarget.forEach(target => {
        if (target.node.targetAllcatedDetails.targetName.includes(text)) {
          searchedTargetList.push(target)
        }
      })
    }
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
        {allocatedTarget && allocatedTarget.length > 0 && (
          <>
            <Input
              placeholder="Search Targets"
              onChange={e => searchTarget(e.target.value)}
              style={{ marginBottom: 16, marginTop: 10 }}
            />
          </>
        )}

        <div style={{ height: 550, overflow: 'auto' }}>
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
            <div className="text-center" style={{ marginTop: '80px' }}>
              <Empty />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AllocatedTarget
