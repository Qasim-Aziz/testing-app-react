import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { Button, Drawer } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { GET_TARGET,GET_VBMAPP_TARGET } from './query'
import CardImg from '../PEAK/targetCard.jpg'
import TargetAllocation from './TargetAllocation'
import TargetAllocationNew from '../../components/TargetAllocationAssessments/TargetAllocation'

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
      console.log(target,'ttttttttttttttttttttttttt');
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
      {targetSuggation?.map(node => {
        return (
          <div
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
      })}

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
          />
        </div>
      </Drawer>
    </div>
  )
}
