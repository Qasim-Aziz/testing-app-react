/* eslint-disable no-nested-ternary */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, notification, Radio, Row } from 'antd'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
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
  const [selectedCategory, setSelectedCategory] = useState('reflexivity')
  const [equivalenceObject, setEquivalenceObject] = useState(null)
  const [mainTargetsData, setMainTargetsData] = useState([])

  const [
    getTargets,
    { data: targetsData, error: targetsError, loading: targetsLoading },
  ] = useMutation(GET_EQUI_TARGET, {
    variables: {
      id: suggestTarget,
    },
  })

  useEffect(() => {
    getTargets()
  }, [])

  useEffect(() => {
    console.log(targetsData, selectedCategory)
    if (targetsData && selectedCategory) {
      let alpha1 = 'A'
      let numa1 = 3
      let alpha2 = 'A'
      let numa2 = 4
      switch (selectedCategory) {
        case 'symmetry':
          numa1 = 4
          alpha1 = 'B'
          numa2 = 9
          alpha2 = 'M'
          break
        case 'transitivity':
          numa1 = 9
          alpha1 = 'N'
          numa2 = 10
          alpha2 = 'L'
          break
        case 'equivalence':
          numa1 = 10
          alpha1 = 'L'
          numa2 = 1000
          alpha2 = 'Z'
          break
        default:
          numa1 = 3
          alpha1 = 'A'
          numa2 = 4
          alpha2 = 'A'
          break
      }

      const tempList = targetsData.suggestPeakTargetsForEquivalence?.codes.filter(item => {
        const alpha = item.code[item.code.length - 1]
        const numa = Number(item.code.slice(0, item.code.length - 1))
        if (numa1 < numa && numa < numa2) {
          return true
        } else if (numa1 === numa) {
          if (alpha >= alpha1) {
            return true
          }
        } else if (numa2 === numa) {
          if (alpha <= alpha2) {
            return true
          }
        }
        return false
      })
      setMainTargetsData(tempList)
    }
  }, [targetsData, selectedCategory])

  const Targets = mainTargetsData?.map(node => {
    return (
      <Row
        key={node.id}
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 10,
          background: COLORS.palleteLight,
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

  return (
    <>
      <Radio.Group
        style={{ marginBottom: 16 }}
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <Radio.Button value="reflexivity">Reflexivity</Radio.Button>
        <Radio.Button value="symmetry">Symmetry</Radio.Button>
        <Radio.Button value="transitivity">Transitivity</Radio.Button>
        <Radio.Button value="equivalence">Equivalence</Radio.Button>
      </Radio.Group>
      <div>
        {targetsLoading ? (
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
          width={DRAWER.widthL2}
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
        </Drawer>
      </div>
    </>
  )
}
