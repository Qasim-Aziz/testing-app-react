/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  Radio,
  Row,
  Select,
  Tabs,
  Typography,
  Table,
  Layout,
} from 'antd'
import moment from 'moment'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import TargetAllocationNew from 'components/TargetAllocationAssessments/TargetAllocation'
import GoalCard from 'components/GoalCard'
import EditTargetAllocationNewDrawer from 'components/TargetAllocation/EditTargetAllocation'
import TargetAllocationNewDrawer from 'components/TargetAllocation/TargetAllocation'
import { arrayNotNull, capitalize, notNull } from 'utilities'
import { LineChartOutlined } from '@ant-design/icons'
import { COLORS, DRAWER, FONT } from 'assets/styles/globalStyles'
import LoadingComponent from '../../staffProfile/LoadingComponent'
import AddLongAndShortGoal from '../AddLongAndShortGoal'
import AllocatedTarget from './AllocatedTarget'
import EquivalenceDrawer from './EquivalenceTargetAllocationDrawer'
import CogniAbleDrawer from './FromCogniable'
import {
  getDefaultGoals,
  getGoalResponsibility,
  getGoalStatus,
  getLongTermGoals,
  getPatients,
} from './TargetAllocation.query'
import TargetAvailableDrawer from './TargetAllocationDrawer'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Content } = Layout

const GET_DATA = gql`
  mutation getData ($studentId: ID!){
    mlJob(input:{
      pk: $studentId
    }) {
      status
      data
   }
  }
`

const TARGET_DETAILS = gql`
  query targetDetails(
    $targetId: ID!
  ) {
    targetGet(id: $targetId){
      id
      targetInstr
      domain{
        id
        domain
      }
      targetArea{
        id
        Area
      }
      targetMain{
        id
        targetName
      }
   } 

  }
`

const AssessmentContent = () => {
  let stdId = ''
  if (!(localStorage.getItem('studentId') === null) && localStorage.getItem('studentId')) {
    stdId = JSON.parse(localStorage.getItem('studentId'))
  }

  const [selectedStudent, setSelectedStudent] = useState(stdId)

  const dispatch = useDispatch()
  dispatch({
    type: 'user/GET_STUDENT_NAME',
  })

  const [assessmentData, setAssessmentData] = useState([])
  const [targetAllocationDrawer, setTargetAllocationDrawer] = useState(false)
  const [selectedTargetId, setSelectedTargetId] = useState('')
  const [selectTarget, setSelectTarget] = useState(null)
  const [selectTargetDrawer, setSelectTargetDrawer] = useState(false)
  const [targetName, setTargetName] = useState('')
  const [targetVideo, setTargetVideo] = useState()
  const [targetInstr, setTargetInstr] = useState()

  const [getMlData, { data: mlData, loading: mlLoading, error: mlError }] = useMutation(GET_DATA, {
    variables: {
      studentId: localStorage.getItem('studentId'),
    }
  })

  useEffect(() => {
    getMlData()
  }, [])

  useEffect(() => {
    if (mlData && mlData.mlJob.data) {
      console.log("mlData ===========> ", mlData)
      console.log(JSON.parse(mlData.mlJob.data))
      if (mlData.mlJob.status) {
        setAssessmentData(JSON.parse(mlData.mlJob.data))
      }
    }
  }, [mlData])

  const { data: targetData, loading: targetLoading, error: targetError, refetch: targetRefetch } = useQuery(TARGET_DETAILS, { manual: true, variables: { targetId: selectedTargetId } })


  useEffect(() => {
    if (targetData && targetData.targetGet) {
      console.log("targetData ===========> ", targetData)

      if (targetData.targetGet) {
        const node = targetData.targetGet
        setTargetName(node.targetMain.targetName)
        setSelectTarget(node.id)
        setTargetAllocationDrawer(true)
        setTargetInstr(node.targetInstr)
        setTargetVideo(node.video)
      }
    }
  }, [targetData])


  const allocateTarget = (row) => {
    setSelectedTargetId(row.id)
    targetRefetch()
  }



  const getExpandedRowRender = row => (
    <Table
      rowKey="id"
      dataSource={row.targets}
      columns={getGridColumns(true)}
      bordered
      showHeader
      pagination={false}
      size="small"
    />
  )


  const getGridColumns = (isForNestedGrid) => {

    if (isForNestedGrid)
      return [
        {
          title: 'Key',
          dataIndex: 'id'
        },
        {
          title: 'Target Name',
          dataIndex: 'name',
        },
        {
          title: 'Domain Name',
          dataIndex: 'domain',
        },
        {
          title: 'Already Allocated',
          render: (row) => (
            <span>
              {row.alreadyAllocated === true ? 'YES' : 'NO'}
            </span>
          ),
        },
        {
          title: 'Actions',
          render: (row) => (
            <span>
              <Button
                type="link"
                onClick={() => allocateTarget(row)}
              // loading={freDisLoading && selectSession.id === row.id}
              >
                <LineChartOutlined style={{ fontSize: 26, color: COLORS.graph }} />
              </Button>
            </span>
          ),
        },
      ]

    return [
      {
        title: 'Learner Name',
        dataIndex: 'learner',
      },
      {
        title: 'Similarity Score',
        dataIndex: 'score',
        render: (row) => (
          <span>
            {row.toFixed(2)}
          </span>
        ),
        align: 'right',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        align: 'right',
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        align: 'right',
      },
    ]
  }

  if (mlLoading) return <LoadingComponent />



  return (
    <>
      {mlData && (
        <div
          style={{
            // border: '2px solid #ccc',
            padding: 10,
            height: 650,
            background: '#fff',
            overflow: 'auto',
          }}
        >

          {assessmentData.map(item =>
            <div>
              <Title level={3} style={{ margin: '10px  0px', display: 'inline-block' }}>{item.assessment}</Title>
              <Button style={{ float: 'right', margin: '10px  0px', }}>Suggest Target</Button>
              <Table
                className="frequencyTable"
                rowKey="learner"
                columns={getGridColumns()}
                dataSource={item.learners}
                expandedRowRender={getExpandedRowRender}
                expandRowByClick
                // pagination={{
                // 	defaultPageSize: 25,
                // 	position: 'top',
                // 	showSizeChanger: false,
                // 	pageSizeOptions: ['25', '50', '100', '250'],
                // }}
                size="small"
                bordered
              />

            </div>
          )}

          <Drawer
            title="Basic Drawer"
            width={DRAWER.widthL1}
            placement="right"
            closable={true}
            onClose={() => setTargetAllocationDrawer(false)}
            visible={targetAllocationDrawer}
          >
            <TargetAllocationNew
              key={Math.random()}
              studentId={selectedStudent}
              selectedTargetId={selectTarget}
              targetName={targetName}
              targetVideo={targetVideo}
              targetInstr={targetInstr}
            // selectedTargetCategory={selectedTargetCategory}
            // peakEnable={false}
            />
          </Drawer>



        </div>
      )}




    </>
  )
}

export default AssessmentContent
