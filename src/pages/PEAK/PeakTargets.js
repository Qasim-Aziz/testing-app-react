/* eslint-disable no-lone-blocks */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Row } from 'antd'
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
  const [targetName, setTargetName] = useState('')
  const [targetVideo, setTargetVideo] = useState()
  const [targetInstr, setTargetInstr] = useState()

  const [getTargets, { data, error, loading }] = useMutation(GET_TARGET, {
    variables: {
      id: suggestTarget,
    },
  })

  useEffect(() => {
    if (!data && !error && !loading) {
      getTargets()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading])

  if (loading) return <h3>Loading...</h3>
  if (error) return <h4 style={{ color: 'red' }}>Opps therir are something wrong</h4>

  const Targets = data?.suggestPeakTargets.details?.map(node => {
    return node.targets.edges?.map(({ node }) => (
      <Row
        key={node.id}
        style={{
          border: '1px solid #e4e9f0',
          borderRadius: 10,
          background: '#fff',
          padding: '10px 20px 10px 10px',
          margin: '8px 0px',
          fontSize: '18px',
        }}
      >
        <Col span="22">{node.targetMain.targetName}</Col>
        <Col span="2">
          <Button
            type="primary"
            onClick={() => {
              setTargetName(node.targetMain.targetName)
              setSelectTarget(node.id)
              setTargetInstr(node.targetInstr)
              setTargetVideo(node.video)
            }}
          >
            <PlusOutlined style={{ fontSize: 20, color: '#fff', marginTop: 5 }} />
          </Button>
        </Col>
      </Row>
    ))
  })

  if (!Targets) {
    return <h3 style={{ marginTop: 30, textAlign: 'center' }}>Their is no suggest target</h3>
  }

  return (
    <div
      style={{
        height: 'calc(100vh - 110px)',
        overflowY: 'scroll',
        padding: 15,
        backgroundColor: 'rgb(249, 249, 249)',
        borderRadius: 10,
      }}
    >
      {Targets}
      <Drawer
        visible={selectTarget}
        onClose={() => setSelectTarget(null)}
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
