/* eslint-disable no-lone-blocks */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Radio, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import TargetAllocationNew from '../../components/TargetAllocationAssessments/TargetAllocation'
import { GET_EQUI_CATTEGORY, GET_EQUI_TARGET } from './query'

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
  const [selectedCategory, setSelectedCategory] = useState('')
  const [equivalenceObject, setEquivalenceObject] = useState(null)

  const [
    getTargets,
    { data: targetsData, error: targetsError, loading: targetsLoading },
  ] = useMutation(GET_EQUI_TARGET, {
    variables: {
      id: suggestTarget,
      category: [selectedCategory],
    },
  })

  const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(
    GET_EQUI_CATTEGORY,
  )

  useEffect(() => {
    if (selectedCategory !== '') {
      getTargets()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  // if (loading) return <h3>Loading...</h3>
  if (targetsError) return <h4 style={{ color: 'red' }}>Opps therir are something wrong</h4>

  const selectCategory = text => {
    setSelectedCategory(text)
    console.log(text)
  }

  const Targets = targetsData?.suggestPeakTargetsForEquivalence.codes?.map(node => {
    return (
      <Row
        style={{
          border: '1px solid #e4e9f0',
          borderRadius: 10,
          background: '#fff',
          padding: '10px 20px 10px 10px',
          margin: '8px 0px',
          fontSize: '18px',
        }}
      >
        <Col span="22">{node.target.targetMain.targetName}</Col>
        <Col span="2">
          <Button
            type="primary"
            onClick={() => {
              setTargetName(node.target.targetMain.targetName)
              setSelectTarget(node.target.id)
              setTargetInstr(node.target.targetInstr)
              setTargetVideo(node.target.video)
              setEquivalenceObject(node)
            }}
          >
            <PlusOutlined style={{ fontSize: 20, color: '#fff', marginTop: 5 }} />
          </Button>
        </Col>
      </Row>
    )
  })

  // if (!Targets) {
  //   return <h3 style={{ marginTop: 30, textAlign: 'center' }}>Their is no suggest target</h3>
  // }

  return (
    <>
      {categoryData && (
        <Radio.Group onChange={e => selectCategory(e.target.value)}>
          {categoryData?.peakEquDomains?.map(item => (
            <Radio.Button value={item.id}>{item.name}</Radio.Button>
          ))}
        </Radio.Group>
      )}
      <div
        style={{
          marginTop: '10px',
          height: 'calc(100vh - 110px)',
          overflowY: 'scroll',
          padding: 15,
          backgroundColor: 'rgb(249, 249, 249)',
          borderRadius: 10,
        }}
      >
        {selectCategory === '' && <p>Select Category</p>}
        {targetsLoading && <p>Loading Targets..</p>}
        {!Targets ? 'No Targets' : Targets}

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
              peakEnable={true}
              equivalenceEnable={true}
              equivalenceObject={equivalenceObject}
            />
          </div>
        </Drawer>
      </div>
    </>
  )
}
