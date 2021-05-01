import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Row } from 'antd'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
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
      getSuggestTarget()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading])

  useEffect(() => {
    if (data) {
      const suggestTargets = data.vbmappTargetSuggest.targets.filter((value, index, array) => {
        return array.findIndex(node => node.id === value.id) === index
      })
      setTargetSuggation(suggestTargets)
    }
  }, [data])

  if (loading) return <LoadingComponent />
  if (error) return <h4 style={{ color: 'red' }}>Opps therir are something wrong</h4>

  return (
    <div style={{ borderRadius: 10 }}>
      {data?.vbmappTargetSuggest.targets.length === 0 && (
        <h4 style={{ textAlign: 'center', marginTop: 60 }}>Their is no targets</h4>
      )}
      {targetSuggation?.map(node => (
        <Row
          key={node.id}
          style={{
            border: `1px solid ${COLORS.palleteLightBlue}`,
            borderRadius: 10,
            background: COLORS.palleteLight,
            padding: '10px 20px 10px 10px',
            margin: '8px 0px',
            fontSize: '18px',
            color: 'black',
          }}
        >
          <Col span="22" style={{ marginTop: '3px' }}>
            {node.targetMain.targetName}
          </Col>
          <Col span="2">
            <Button
              type="default"
              style={{ backgroundColor: COLORS.palleteLightBlue }}
              onClick={() => {
                setTargetName(node.targetMain.targetName)
                setSelectTarget(node.id)
                setTargetInstr(node.targetInstr)
                setTargetVideo(node.video)
              }}
            >
              <PlusOutlined
                style={{ fontSize: 22, color: '#000', fontWeight: '700', marginTop: 3 }}
              />
            </Button>
          </Col>
        </Row>
      ))}

      <Drawer
        visible={selectTarget}
        onClose={() => setSelectTarget(null)}
        title="Target Allocation"
        width={DRAWER.widthL2}
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
