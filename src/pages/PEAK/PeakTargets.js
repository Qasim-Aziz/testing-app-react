/* eslint-disable no-lone-blocks */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, notification, Row } from 'antd'
import { COLORS } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import TargetAllocationNew from '../../components/TargetAllocationAssessments/TargetAllocation'
import { GET_TARGET } from './query'

export default ({ suggestTarget, selectedTargetCategory }) => {
  let stdId = ''
  if (!(localStorage.getItem('studentId') === null) && localStorage.getItem('studentId')) {
    stdId = JSON.parse(localStorage.getItem('studentId'))
  }
  const [selectedStudent, setSelectedStudent] = useState(stdId)

  const [selectTarget, setSelectTarget] = useState(null)
  const [selectTargetDrawer, setSelectTargetDrawer] = useState(false)
  const [targetName, setTargetName] = useState('')
  const [targetVideo, setTargetVideo] = useState()
  const [targetInstr, setTargetInstr] = useState()

  const [getData, { data, error, loading }] = useMutation(GET_TARGET, {
    variables: {
      id: suggestTarget,
    },
  })

  useEffect(() => {
    if (suggestTarget) {
      getData()
    }
  }, [suggestTarget])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch suggested targets',
      })
    }
  }, [error])

  console.log(data, error, loading)
  if (loading) return <LoadingComponent />

  const Targets = data?.suggestPeakTargets.details?.map(node => {
    return node.targets.edges?.map(({ node }) => (
      <Row
        key={node.id}
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 10,
          background: COLORS.palleteLight,
          padding: '10px 20px 10px 10px',
          margin: '8px 0px',
          fontSize: '18px',
          color: 'black',
        }}
      >
        <Col span={22}>{node.targetMain.targetName}</Col>
        <Col span={2}>
          <Button
            style={{ backgroundColor: COLORS.palleteLightBlue }}
            onClick={() => {
              setTargetName(node.targetMain.targetName)
              setSelectTarget(node.id)
              setSelectTargetDrawer(true)
              setTargetInstr(node.targetInstr)
              setTargetVideo(node.video)
            }}
          >
            <PlusOutlined
              style={{
                fontSize: 20,
                color: '#000',
                marginTop: 5,
              }}
            />
          </Button>
        </Col>
      </Row>
    ))
  })

  if (!Targets) {
    return <h3 style={{ marginTop: 30, textAlign: 'center' }}>Their is no suggested target</h3>
  }

  return (
    <div>
      {!Targets || Targets.length === 0 ? 'No data' : Targets}
      <Drawer
        visible={selectTargetDrawer}
        onClose={() => setSelectTargetDrawer(false)}
        title="Target Allocation"
        width={950}
      >
        <div
          style={{
            padding: '0px 23px',
          }}
        >
          <TargetAllocationNew
            key={Math.random()}
            studentId={selectedStudent}
            selectedTargetId={selectTarget}
            targetName={targetName}
            targetVideo={targetVideo}
            targetInstr={targetInstr}
            selectedTargetCategory={selectedTargetCategory}
            peakEnable
          />
        </div>
      </Drawer>
    </div>
  )
}
