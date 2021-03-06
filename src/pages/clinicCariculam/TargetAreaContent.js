import React, { useState, useEffect } from 'react'
import { Drawer, notification } from 'antd'
import { useQuery, useLazyQuery } from 'react-apollo'
import { DRAWER } from 'assets/styles/globalStyles'
import UpdateTargetForm from './UpdateTargetForm'
import TargetAreaCard from './TargetAreaCard'
import TargetCard from './TargetCard'
import TargetFrom from './TargetFrom'
import { TARGET_QUERY } from './query'

const TargetAreaContent = ({ targetArea, domainId, programArea }) => {
  const [newTargetDrawer, setNewTargetDrawer] = useState(false)
  const [updateTargetDrawer, setUpdateTargetDrawer] = useState(false)
  const [updateTargetId, setUpdateTargetId] = useState()
  const [selectName, setName] = useState()
  const [selectInstr, setInstr] = useState()

  const [fetchData, { data, loading, error }] = useLazyQuery(TARGET_QUERY)

  useEffect(() => {
    if (targetArea?.node) {
      fetchData({
        variables: {
          id: targetArea.node.id,
        },
      })
    }
  }, [targetArea])

  useEffect(() => {
    if (selectName) {
      setNewTargetDrawer(true)
    }
  }, [selectName])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch targets',
      })
    }
  }, [error])

  const handelNewTargetDrawer = () => {
    if (setNewTargetDrawer) {
      setName('')
      setInstr('')
    }
    setNewTargetDrawer(state => !state)
  }

  const handleUpdateTargetDrawer = () => {
    setUpdateTargetDrawer(state => !state)
  }

  if (loading) {
    return 'Loading...'
  }

  if (!targetArea) {
    return 'No data'
  }

  return (
    <>
      {targetArea && (
        <TargetAreaCard
          name={targetArea.node.Area}
          style={{ marginBottom: 33 }}
          targetAreaId={targetArea.node.id}
          handelNewTargetDrawer={handelNewTargetDrawer}
          programArea={programArea}
          domainId={domainId}
          isActive={targetArea.node.isActive}
        />
      )}
      {data &&
        data.target.edges.map(({ node }) => {
          return (
            <TargetCard
              key={node.id}
              title={node.targetMain.targetName}
              style={{ marginTop: 4 }}
              setUpdateTargetId={setUpdateTargetId}
              id={node.id}
              setUpdateTargetDrawer={setUpdateTargetDrawer}
              setName={setName}
              setInstr={setInstr}
              instr={node.targetInstr}
              isActive={node.isActive}
              targetArea={targetArea.node.id}
              programArea={programArea}
              domainId={domainId}
            />
          )
        })}
      <Drawer
        width={DRAWER.widthL2}
        visible={newTargetDrawer}
        placement="right"
        onClose={handelNewTargetDrawer}
        title="Add New Target"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            padding: 30,
            paddingTop: 0,
          }}
        >
          <TargetFrom
            domainId={domainId}
            targetAreaId={targetArea.node.id}
            handelNewTargetDrawer={handelNewTargetDrawer}
            name={selectName}
            instr={selectInstr}
          />
        </div>
      </Drawer>
      <Drawer
        width={DRAWER.widthL2}
        visible={updateTargetDrawer}
        placement="right"
        onClose={handleUpdateTargetDrawer}
        title="Update Target"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            padding: 30,
            paddingTop: 0,
          }}
        >
          <UpdateTargetForm
            targetId={updateTargetId}
            targetAreaId={targetArea.node.id}
            domainId={domainId}
            setUpdateTargetId={setUpdateTargetId}
            handleUpdateTargetDrawer={handleUpdateTargetDrawer}
          />
        </div>
      </Drawer>
    </>
  )
}

export default TargetAreaContent
