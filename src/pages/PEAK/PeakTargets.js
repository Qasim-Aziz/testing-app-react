/* eslint-disable no-lone-blocks */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { Button, Drawer } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TargetAllocate from './TargetAllocation'
import TargetAllocationNew from '../../components/TargetAllocationAssessments/TargetAllocation'
import { GET_TARGET } from './query'
import CardImg from './targetCard.jpg'

export default ({ suggestTarget }) => {

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
    return node.targets.edges?.map(({ node }) => {
      return (
        <div
          key={node.id}
          style={{
            maxWidth: '100%',
            border: '1px solid #e4e9f0',
            borderRadius: 10,
            marginBottom: 12,
            position: 'relative',
            background: '#fff',
            padding: '20px 5px 60px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 18,
            }}
          >
            <img
              src={CardImg}
              style={{ width: 80, height: 64, marginRight: 12, borderRadius: 10 }}
              alt=""
            />
            {node.targetMain.targetName}
          </div>
          <Button
            type="link"
            style={{
              background: '#26e768',
              width: '45px',
              height: '43px',
              borderBottomRightRadius: 10,
              position: 'absolute',
              bottom: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
            onClick={() => {
              setTargetName(node.targetMain.targetName)
              setSelectTarget(node.id)
              setTargetInstr(node.targetInstr)
              setTargetVideo(node.video)
            }}
          >
            <PlusOutlined style={{ fontSize: 24, color: '#fff', marginTop: 8 }} />
          </Button>
        </div>
      )
    })
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
        width={750}
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
            peakEnable={true}
          />
        </div>
      </Drawer>
    </div>
  )
}
