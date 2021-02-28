import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import TargetAllocationNew from '../../components/TargetAllocationAssessments/TargetAllocation'
import { GET_VBMAPP_TARGET } from './query'

export default ({ target, milestoneId }) => {
  // this only show us all suggest target for only milestone assignment (because of api support)

  let stdId = ''
  if (!(localStorage.getItem('studentId') === null) && localStorage.getItem('studentId')) {
    stdId = JSON.parse(localStorage.getItem('studentId'))
  }
  const [selectedStudent, setSelectedStudent] = useState(stdId)

  const [targetSuggation, setTargetSuggation] = useState()
  const [selectTarget, setSelectTarget] = useState(null)
  const [targetName, setTargetName] = useState('')
  const [targetVideo, setTargetVideo] = useState()
  const [targetInstr, setTargetInstr] = useState()

  const [getSuggestTarget, { data, error, loading }] = useMutation(GET_VBMAPP_TARGET, {
    variables: {
      pk: target,
      area: milestoneId,
    },
  })

  useEffect(() => {
    if (!data && !error && !loading) {
      console.log(target, 'ttttttttttttttttttttttttt')
      getSuggestTarget()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading])

  useEffect(() => {
    if (data) {
      const suggestTargets = data.vbmappTargetSuggest.targets.filter((value, index, array) => {
        console.log(value)
        return array.findIndex(node => node.id === value.id) === index
      })
      setTargetSuggation(suggestTargets)
    }
  }, [data])

  if (loading) return <h3>Loading...</h3>
  if (error) return <h4 style={{ color: 'red' }}>Opps therir are something wrong</h4>

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
      {data?.vbmappTargetSuggest.targets.length === 0 && (
        <h4 style={{ textAlign: 'center', marginTop: 60 }}>Their is no targets</h4>
      )}
      {targetSuggation?.map(node => (
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
      ))}

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
          />
        </div>
      </Drawer>
    </div>
  )
}
