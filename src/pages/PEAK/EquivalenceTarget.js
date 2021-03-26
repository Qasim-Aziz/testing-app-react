/* eslint-disable no-nested-ternary */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, notification, Radio, Row } from 'antd'
import LoadingComponent from 'components/LoadingComponent'
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

  console.log(targetsData, targetsError, targetsLoading, 'kjkkhhkhk')
  useEffect(() => {
    console.log(suggestTarget, selectedCategory, 'in')
    if (selectedCategory !== '') {
      getTargets().catch(err => {
        console.log(err, 'ereroier')
        notification.error({
          message: 'Something went wrong',
          description: 'Unable to fetch suggested targets',
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  useEffect(() => {
    if (categoryData) {
      setSelectedCategory(categoryData?.peakEquDomains[0].id)
    }
  }, [categoryData])

  useEffect(() => {
    if (categoryError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch equivalence categories',
      })
    }
  }, [categoryError])

  console.log(categoryData, 'ctcct')

  const Targets = targetsData?.suggestPeakTargetsForEquivalence.codes?.map(node => {
    return (
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
        <Col span={22}>{node.target.targetMain.targetName}</Col>
        <Col span={2}>
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

  console.log(Targets, 'targets')
  return (
    <>
      {categoryData && (
        <Radio.Group value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          {categoryData?.peakEquDomains?.map(item => (
            <Radio.Button key={item.id} value={item.id}>
              {item.name}
            </Radio.Button>
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
        {targetsLoading || categoryLoading ? (
          <LoadingComponent />
        ) : !Targets || Targets.length === 0 ? (
          'No Targets'
        ) : (
          Targets
        )}

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
