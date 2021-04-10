/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import { EditOutlined } from '@ant-design/icons'
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
  Layout,
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import GoalCard from 'components/GoalCard'
import EditTargetAllocationNewDrawer from 'components/TargetAllocation/EditTargetAllocation'
import TargetAllocationNewDrawer from 'components/TargetAllocation/TargetAllocation'
import { arrayNotNull, capitalize, notNull } from 'utilities'
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
import './style.scss'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Content } = Layout

const longGoalBtn = {
  color: '#fff',
  backgroundColor: COLORS.palleteBlue,
  // border: '1px solid #0B35B3',
}

const shortGoalBtn = {
  color: '#111',
  backgroundColor: '#FFF',
}

const selectPatientStyle = {
  width: '200px',
  textDecoration: 'none',
  marginRight: '20px',
  border: 0,
}

const TargetAllocation = () => {
  let stdId = ''
  if (!(localStorage.getItem('studentId') === null) && localStorage.getItem('studentId')) {
    stdId = JSON.parse(localStorage.getItem('studentId'))
  }
  const dispatch = useDispatch()
  dispatch({
    type: 'user/GET_STUDENT_NAME',
  })

  const allreadySelectedProgramId = useSelector(state => state.student.ProgramAreaId)

  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(stdId)
  const [programArea, setProgramArea] = useState([])
  const [selectedProgram, setSelectedProgram] = useState(allreadySelectedProgramId)
  const [longTermGoals, setLongTermGoals] = useState([])
  // for search in ltg and stg
  const [longTermGoalsClone, setLongTermGoalsClone] = useState([])

  const [activeTabKey, setActiveTabKey] = useState('customGoalTab')
  const [defaultShortTermGoals, setDefaultShortTermGoals] = useState([])
  const [selectedDefaultShortTermGoal, setSelectedDefaultShortTermGoal] = useState()
  const [selectedDefaultShortTermGoalKey, setSelectedDefaultShortTermGoalKey] = useState(
    Math.random(),
  )
  const [selectedProgramInDefaultTab, setSelectedProgramInDefaultTab] = useState()

  const [activeLongTermGoal, setActiveLongTermGoal] = useState(null)
  const [activeShortTermGoal, setActiveShortTermGoal] = useState(null)
  const [isAddGoalVisible, setAddGoalVisible] = useState(false)
  const [goalType, setGoalType] = useState('long')
  const [addTargetMode, setAddTargetMode] = useState('')
  const [suggestedTarget, setSuggestedTarget] = useState([])
  // for target allocation drawer from library
  const [targetAllocationDrawer, setTargetAllocationDrawer] = useState(false)
  // for cogniable Assessment drawer from library
  const [cogniableAssessmentDrawer, setCogniableAssessmentDrawer] = useState(false)
  const [equivalenceTargetDrawer, setEquivalenceTargetDrawer] = useState(false)
  // for goal status filter
  const [selectedGoalsStatus, setSelectedGoalsStatus] = useState('R29hbFN0YXR1c1R5cGU6Mg==')

  const [selectedShortTermGoalKey, setSelectedShortTermGoalKey] = useState(Math.random())

  useEffect(() => {
    if (allreadySelectedProgramId) setSelectedProgram(allreadySelectedProgramId)
    else if (programArea && programArea.length > 0) {
      setSelectedProgram(programArea[0].node.id)
    }

    // Also select it for default tab
    if (!selectedProgramInDefaultTab && programArea && programArea.length > 0) {
      setSelectedProgramInDefaultTab(programArea[0].node.id)
      setSelectedDefaultShortTermGoalKey(Math.random())
    }
  }, [programArea])

  const getLongTermGoalsQuery = async (studentId, program, status) => {
    setLoading(true)
    setSelectedShortTermGoal(null)
    const longTermGoalResp = await getLongTermGoals(studentId, program, status)
    if (notNull(longTermGoalResp)) {
      setLongTermGoals(longTermGoalResp.data.longTerm.edges)
      setLongTermGoalsClone(longTermGoalResp.data.longTerm.edges)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedProgramInDefaultTab && defaultShortTermGoals)
      setSelectedDefaultShortTermGoal(defaultShortTermGoals[selectedProgramInDefaultTab])
  }, [selectedProgramInDefaultTab, defaultShortTermGoals])

  useEffect(() => {
    if (selectedProgramInDefaultTab && defaultShortTermGoals)
      setSelectedDefaultShortTermGoal(defaultShortTermGoals[selectedProgramInDefaultTab])
  }, [selectedProgramInDefaultTab, defaultShortTermGoals])

  const getDefaultGoalsQuery = async studentId => {
    const defaultGoalResponse = await getDefaultGoals(studentId)
    if (notNull(defaultGoalResponse)) {
      const allDefaultGoals = []
      defaultGoalResponse.data.longTerm.edges.forEach(({ node: longTermGoal }) => {
        // eslint-disable-next-line prefer-destructuring
        allDefaultGoals[longTermGoal.program.id] = longTermGoal.shorttermgoalSet.edges[0]
      })
      setDefaultShortTermGoals(allDefaultGoals)
    }
  }

  const getProgramAreaQuery = async studentId => {
    const patientResp = await getPatients(studentId)

    if (notNull(patientResp)) setProgramArea(patientResp?.data?.student?.programArea?.edges)
  }

  const [goalResponsibilityList, setGoalResponsibilityList] = useState([])
  const [goalStatusList, setGoalStatusList] = useState([])

  const getGoalStatusQuery = async () => {
    const goalStatusResp = await getGoalStatus()
    if (notNull(goalStatusResp)) setGoalStatusList(goalStatusResp.data.goalStatus)
  }

  const getGoalResponsibilityQuery = async () => {
    const goalResponsibilityResp = await getGoalResponsibility()
    if (notNull(goalResponsibilityResp))
      setGoalResponsibilityList(goalResponsibilityResp.data.goalResponsibility)
  }

  useEffect(() => {
    getProgramAreaQuery(selectedStudent)
    getGoalStatusQuery()
    getGoalResponsibilityQuery()
    getDefaultGoalsQuery(selectedStudent)
    // alreadyAlloctedTargetQuery(selectedStudent, 'U3RhdHVzVHlwZToz', 'RG9tYWluVHlwZToxMQ==')
    // getLongTermGoalsQuery(selectedStudent, selectedProgram, selectedGoalsStatus)
  }, [])

  useEffect(() => {
    if (selectedProgram) {
      getLongTermGoalsQuery(selectedStudent, selectedProgram, selectedGoalsStatus)
    }
  }, [selectedProgram])

  const addShortTermGoal = ltg => {
    setGoalType('short')
    setAddGoalVisible(true)
    setActiveLongTermGoal(ltg)
  }

  const addLongTermGoal = () => {
    setAddGoalVisible(true)
    setGoalType('long')
    setActiveLongTermGoal(null)
  }

  const handleSelectProgram = pId => {
    setSelectedProgram(pId)
    getLongTermGoalsQuery(selectedStudent, pId, selectedGoalsStatus)
  }

  // filter Goals according to status
  const handleSelectStatus = statusId => {
    setSelectedGoalsStatus(statusId)
    getLongTermGoalsQuery(selectedStudent, selectedProgram, statusId)
  }

  const getDate = node => {
    const startDate = moment(node.dateInitialted)
    const endDate = moment(node.dateEnd)
    // const diff = moment(endDate) - moment(startDate)

    const years = endDate.diff(startDate, 'year')
    startDate.add(years, 'years')

    const months = endDate.diff(startDate, 'months')
    startDate.add(months, 'months')

    const days = endDate.diff(startDate, 'days')

    const date =
      `${moment(node.dateInitialted).format('MMMM DD, YYYY')} - ${endDate.format(
        'MMMM DD, YYYY',
      )}` +
      `, ${years > 0 ? `${years} Year` : ''} ${months > 0 ? `${months} Months` : ''} ${
        days > 0 ? `${days} Days` : ''
      }`
    return date
  }

  const handleCloseAddGoal = () => {
    setGoalType('long')
    setAddGoalVisible(false)
    setActiveLongTermGoal(null)
  }

  const editLongTermGoal = ltg => {
    setGoalType('long-edit')
    setAddGoalVisible(true)
    setActiveLongTermGoal(ltg)
  }

  const editShortTermGoal = (ltg, stg) => {
    setGoalType('short-edit')
    setAddGoalVisible(true)
    setActiveLongTermGoal(ltg)
    setActiveShortTermGoal(stg)
  }

  const onSuccessAddEditGoal = (resp, type) => {
    setAddGoalVisible(false)
    if (type === 'long') {
      setLongTermGoals(state => [...[{ node: resp.data.createLongTerm.details }], ...state])
    } else if (type === 'long-edit') {
      setLongTermGoals(state =>
        state.map(lg => {
          if (lg.node.id === activeLongTermGoal.node.id) {
            return { node: resp.data.updateLongTerm.details }
          }
          return lg
        }),
      )
    } else if (type === 'short') {
      setLongTermGoals(state =>
        state.map(lg => {
          if (lg.node.id === activeLongTermGoal.node.id) {
            if ('shorttermgoalSet' in lg.node) {
              lg.node.shorttermgoalSet.edges.push({ node: resp.data.createShortTerm.details })
            } else {
              lg = {
                ...lg,
                node: {
                  ...lg.node,
                  shorttermgoalSet: {
                    edges: [...[{ node: resp.data.createShortTerm.details }]],
                  },
                },
              }
            }
            return lg
          }
          return lg
        }),
      )
    } else if (type === 'short-edit') {
      setLongTermGoals(state =>
        state.map(lg => {
          if (lg.node.id === activeLongTermGoal.node.id) {
            const lgIdx = lg.node.shorttermgoalSet.edges.findIndex(
              d => d.node.id === activeShortTermGoal.node.id,
            )
            lg.node.shorttermgoalSet.edges[lgIdx] = { node: resp.data.updateShortTerm.details }
            return lg
          }
          return lg
        }),
      )
    }
    setLongTermGoalsClone(longTermGoals)
  }

  const [isTargetDetailsVisible, setShowTargetDetailsVisible] = useState(false)
  const [activeSessionDetails, setActiveSessionDetails] = useState(null)

  const handleCloseTargetDetails = () => {
    setShowTargetDetailsVisible(false)
    setActiveSessionDetails(null)

    // write code here for manually alloctaion reset
    if (addTargetMode === 'manually') {
      setAddTargetMode('')
    }
  }

  // close target allocation drawer
  const closeTargetAllocationDrawer = () => {
    // reseting selected short term goal
    setActiveSessionDetails(null)
    // closing target allocation drawer
    setTargetAllocationDrawer(false)
    // closing cogniable assessment drawer
    setCogniableAssessmentDrawer(false)
    // closing Equivalence drawer
    setEquivalenceTargetDrawer(false)
    setAddTargetMode('')
  }

  const [isPeak, setIsPeak] = useState(false)
  const [isEquivalence, setIsEquivalence] = useState(false)
  const [equivalenceObject, setEquivalenceObject] = useState(null)

  const allocateSessionToTarget = (
    session,
    peakEnable = false,
    equivalenceEnable = false,
    equivalenceNode = null,
  ) => {
    setShowTargetDetailsVisible(true)
    setIsPeak(peakEnable)
    setIsEquivalence(equivalenceEnable)
    setActiveSessionDetails(session)
    setEquivalenceObject(equivalenceNode)
  }

  const [selectedShortTermGoal, setSelectedShortTermGoal] = useState(null)
  const selectShortTermGoal = stg => {
    setSelectedShortTermGoal(stg)
    setSelectedShortTermGoalKey(Math.random())
  }

  // Edit target

  const [isEditAllocatedTargetVisible, setEditAllocatedTargetVisible] = useState(false)
  const [activeAllocatedTarget, setActiveAllocatedTarget] = useState(null)

  const handleCloseEditTargetDetails = () => {
    setEditAllocatedTargetVisible(false)
    setActiveAllocatedTarget(null)
  }

  const editAllocatedTarget = node => {
    setEditAllocatedTargetVisible(true)
    setActiveAllocatedTarget(node)
  }

  const onSuccessEditTargetAllocation = ({
    data,
    isDirectGoalOriginally,
    isDirectGoalAfterUpdate,
  }) => {
    const updateResult = data.updateTargetAllocate2
    const cloneSelectedShortTermGoal = { ...selectedShortTermGoal }
    const cloneDefaultShortTermGoal = { ...selectedDefaultShortTermGoal }

    // If short term goal is changed then remove exiting targetAllocation
    // If Type was changed then remove existing one and add new at end
    if (isDirectGoalOriginally !== isDirectGoalAfterUpdate) {
      if (isDirectGoalOriginally && cloneDefaultShortTermGoal.node.targetAllocateSet) {
        cloneDefaultShortTermGoal.node.targetAllocateSet.edges = [
          ...cloneDefaultShortTermGoal.node.targetAllocateSet.edges.filter(
            ({ node }) => node.id !== updateResult.target.id,
          ),
        ]
      } else if (!isDirectGoalOriginally && cloneSelectedShortTermGoal.node.targetAllocateSet) {
        cloneSelectedShortTermGoal.node.targetAllocateSet.edges = [
          ...cloneSelectedShortTermGoal.node.targetAllocateSet.edges.filter(
            ({ node }) => node.id !== updateResult.target.id,
          ),
        ]
      }

      // Add new/updated target allocation
      if (isDirectGoalAfterUpdate) {
        cloneDefaultShortTermGoal.node = {
          ...cloneDefaultShortTermGoal.node,
          targetAllocateSet: {
            edges: [
              ...cloneDefaultShortTermGoal.node.targetAllocateSet.edges,
              { node: { ...updateResult.target } },
            ],
          },
        }
      } else if (cloneSelectedShortTermGoal?.node?.id === updateResult.target.shortTerm.id) {
        cloneSelectedShortTermGoal.node = {
          ...cloneSelectedShortTermGoal.node,
          targetAllocateSet: {
            edges: [
              ...cloneSelectedShortTermGoal.node.targetAllocateSet.edges,
              { node: { ...updateResult.target } },
            ],
          },
        }
      }
    } else {
      // If Type was not then just update the value only
      // eslint-disable-next-line no-lonely-if
      if (isDirectGoalOriginally) {
        cloneDefaultShortTermGoal.node = {
          ...cloneDefaultShortTermGoal.node,
          targetAllocateSet: {
            edges: [
              ...cloneDefaultShortTermGoal.node.targetAllocateSet.edges.map(item =>
                item.node.id === updateResult.target.id ? { node: updateResult.target } : item,
              ),
            ],
          },
        }
      } else if (cloneSelectedShortTermGoal?.node?.id === updateResult.target.shortTerm.id) {
        cloneSelectedShortTermGoal.node = {
          ...cloneSelectedShortTermGoal.node,
          targetAllocateSet: {
            edges: [
              ...cloneSelectedShortTermGoal.node.targetAllocateSet.edges.map(item =>
                item.node.id === updateResult.target.id ? { node: updateResult.target } : item,
              ),
            ],
          },
        }
      }
    }

    // Save Data for both type
    if (Object.values(cloneSelectedShortTermGoal).length) {
      setSelectedShortTermGoal(cloneSelectedShortTermGoal)
      setSelectedShortTermGoalKey(Math.random())
    }
    if (Object.values(cloneDefaultShortTermGoal).length) {
      setSelectedDefaultShortTermGoal(cloneDefaultShortTermGoal)
      setSelectedDefaultShortTermGoalKey(Math.random())
    }

    setEditAllocatedTargetVisible(false)
    setActiveAllocatedTarget(null)
  }

  // End of Edit allocated target

  const handleSelectTargetMode = mode => {
    setAddTargetMode(mode)
    // open target allocation drawer
    if (mode === 'list') {
      setTargetAllocationDrawer(true)
    }
    // open cogniable assessmets drawer
    if (mode === 'CogniAble') {
      setCogniableAssessmentDrawer(true)
    }
    // open cogniable assessmets drawer
    if (mode === 'equivalence') {
      setEquivalenceTargetDrawer(true)
    }
  }

  useEffect(() => {
    if (addTargetMode === 'manually') {
      setShowTargetDetailsVisible(true)
      setActiveSessionDetails(null)
    }
  }, [addTargetMode])

  const onSuccessTargetAllocation = ({ data, isCreateForDirectGoal }) => {
    setShowTargetDetailsVisible(false)
    setActiveSessionDetails(null)

    const existingGoal = isCreateForDirectGoal
      ? selectedDefaultShortTermGoal
      : selectedShortTermGoal
    const cloneSelectedShortTermGoal = { ...existingGoal }

    if (cloneSelectedShortTermGoal.node.targetAllocateSet) {
      cloneSelectedShortTermGoal.node.targetAllocateSet.edges.unshift({
        node: {
          ...data.createTargetAllocate2.target,
        },
      })
    } else {
      cloneSelectedShortTermGoal.node = {
        ...cloneSelectedShortTermGoal.node,
        targetAllocateSet: { edges: [{ node: { ...data.createTargetAllocate2.target } }] },
      }
    }

    if (!isCreateForDirectGoal) {
      setSelectedShortTermGoal(cloneSelectedShortTermGoal)
      setSelectedShortTermGoalKey(Math.random())
    } else {
      setSelectedDefaultShortTermGoal(cloneSelectedShortTermGoal)
      setSelectedDefaultShortTermGoalKey(Math.random())
    }

    if (addTargetMode === 'list') {
      setSuggestedTarget(item =>
        item.filter(target => target.node.id !== activeSessionDetails.node.id),
      )
    }

    // write code here for manually alloctaion reset
    if (addTargetMode === 'manually') {
      setAddTargetMode('')
    }
  }

  const searchTarget = text => {
    const searchedGoals = []
    if (longTermGoalsClone.length > 0) {
      longTermGoalsClone.forEach(item => {
        if (item.node.goalName.includes(text)) {
          searchedGoals.push(item)
        } else {
          let includeInShorTerm = false
          const itemWithEmptyShortTermSet = {
            node: { ...item.node, shorttermgoalSet: { edges: [] } },
          }
          if (item.node.shorttermgoalSet.edges.length > 0) {
            item.node.shorttermgoalSet.edges.forEach(shortItem => {
              if (shortItem.node.goalName.includes(text)) {
                itemWithEmptyShortTermSet.node.shorttermgoalSet.edges.push(shortItem)
                includeInShorTerm = true
              }
            })
            if (includeInShorTerm) {
              searchedGoals.push(itemWithEmptyShortTermSet)
            }
          }
        }
      })
    }
    setLongTermGoals(searchedGoals)
  }

  const role = useSelector(state => state.user.role)
  let editAble = true
  if (role === 'parents') {
    // make it false if you don't want parents to add or edit goals and targets
    editAble = true
  }
  let addHeading = 'Update short term details'
  if (goalType === 'long') {
    addHeading = 'Add long term details'
  } else if (goalType === 'long-edit') {
    addHeading = 'Update long term details'
  } else if (goalType === 'short') {
    addHeading = 'Add short term details'
  }

  const studentName = useSelector(state => state.user.studentName)

  const customGoalTab = (
    <Row gutter={[10, 10]}>
      <Col md={16} sm={24}>
        <div>
          <div style={{ paddingBottom: '10px' }}>
            <Select
              style={selectPatientStyle}
              // size="large"
              defaultValue="Select Program"
              value={selectedProgram}
              onSelect={handleSelectProgram}
            >
              {programArea &&
                programArea.map(p => {
                  return (
                    <Select.Option value={p.node.id} key={p.node.id}>
                      {p.node.name}
                    </Select.Option>
                  )
                })}
            </Select>
            <Select
              style={selectPatientStyle}
              // size="large"
              defaultValue="Select Status"
              value={selectedGoalsStatus}
              onSelect={handleSelectStatus}
            >
              <Select.Option value="" key="R">
                All
              </Select.Option>
              {goalStatusList &&
                goalStatusList.map(p => {
                  return (
                    <Select.Option value={p.id} key={p.id}>
                      {p.status}
                    </Select.Option>
                  )
                })}
            </Select>
            <Input
              placeholder="Search LT &amp; ST Goals"
              onChange={e => searchTarget(e.target.value)}
              style={{ width: 280, marginRight: 16 }}
            />
            {editAble && (
              <Button type="default" style={longGoalBtn} onClick={addLongTermGoal}>
                <Icon type="plus" /> LT Goal
              </Button>
            )}
          </div>
        </div>
        <div>
          <div
            style={{
              height: 650,
              overflow: 'auto',
              background: COLORS.palleteLight,
            }}
          >
            {longTermGoals &&
              longTermGoals.length > 0 &&
              longTermGoals.map(ltGoal => {
                return (
                  <div
                    key={ltGoal.node.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #E4E9F0',
                      borderRadius: 5,
                      // margin: 5,
                      alignItems: 'center',
                    }}
                  >
                    <Card
                      size="small"
                      title={
                        <>
                          <Title
                            style={{
                              color: '#000',
                              fontSize: 16,
                              lineHeight: '25px',
                              display: 'inline',
                              margin: 0,
                              fontWeight: '500',
                            }}
                          >
                            {capitalize(ltGoal.node.goalName)}
                          </Title>
                          <div>
                            <Text style={{ fontSize: 15, lineHeight: '27px' }}>
                              {ltGoal.node.goalStatus.status}
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                lineHeight: '27px',
                                float: 'right',
                                marginRight: 10,
                              }}
                            >
                              {getDate(ltGoal.node)}
                            </Text>
                          </div>
                        </>
                      }
                      extra={
                        editAble && (
                          <>
                            <div>
                              <Button style={shortGoalBtn} onClick={() => addShortTermGoal(ltGoal)}>
                                <Icon type="plus" />
                              </Button>
                              &nbsp;
                              <Button onClick={() => editLongTermGoal(ltGoal)}>
                                <EditOutlined />
                              </Button>
                            </div>
                          </>
                        )
                      }
                      style={{ width: '100%' }}
                    >
                      {'shorttermgoalSet' in ltGoal.node &&
                        arrayNotNull(ltGoal.node.shorttermgoalSet.edges) &&
                        ltGoal.node.shorttermgoalSet.edges.map((sGoal, index) => {
                          return (
                            <GoalCard
                              selected={
                                selectedShortTermGoal !== null &&
                                selectedShortTermGoal.node.id === sGoal.node.id
                              }
                              editAble={editAble}
                              key={sGoal.node.id}
                              heading={sGoal.node.goalName}
                              status={sGoal.node.goalStatus.status}
                              progess={50}
                              onEdit={() => editShortTermGoal(ltGoal, sGoal)}
                              selectShortTermGoal={() => selectShortTermGoal(sGoal)}
                            />
                          )
                        })}
                    </Card>
                  </div>
                )
              })}
          </div>
        </div>
      </Col>

      {selectedShortTermGoal && (
        <Col md={8} sm={24} style={{ backgroundColor: COLORS.palleteLightBlue }}>
          {selectedShortTermGoal && editAble && (
            <div
              style={{
                fontSize: '15px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Target Allocation from &nbsp;
              <Radio.Group
                onChange={e => handleSelectTargetMode(e.target.value)}
                value={addTargetMode}
              >
                <Radio.Button value="list">Library</Radio.Button>
                <Radio.Button value="manually">Manually</Radio.Button>
                <Radio.Button value="equivalence">Equivalence</Radio.Button>
              </Radio.Group>
            </div>
          )}
          <div
            style={{
              // border: '2px solid #ccc',
              marginTop: 10,
              height: 650,
              padding: 10,
              background: COLORS.palleteLightBlue,
              overflow: 'hidden',
            }}
          >
            <AllocatedTarget
              key={selectedShortTermGoalKey}
              editAble={editAble}
              editAllocatedTarget={editAllocatedTarget}
              allocatedTarget={selectedShortTermGoal?.node?.targetAllocateSet?.edges}
            />
          </div>
        </Col>
      )}
    </Row>
  )

  const defaultGoalTab = (
    <div>
      <Form layout="inline">
        <Form.Item label="Select Program">
          <Select
            style={selectPatientStyle}
            placeholder="Select Program"
            value={selectedProgramInDefaultTab}
            onSelect={setSelectedProgramInDefaultTab}
          >
            {programArea &&
              programArea.map(p => (
                <Select.Option value={p.node.id} key={p.node.id}>
                  {p.node.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        {editAble && (
          <Form.Item label="Target Allocation from" style={{ float: 'right', marginRight: 0 }}>
            <Radio.Group
              onChange={e => handleSelectTargetMode(e.target.value)}
              value={addTargetMode}
            >
              <Radio.Button value="list">Library</Radio.Button>
              <Radio.Button value="manually">Manually</Radio.Button>
              <Radio.Button value="equivalence">Equivalence</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
      </Form>
      <div
        style={{
          // border: '2px solid #ccc',
          padding: 10,
          height: 650,
          // background: '#f9f9f9',
          overflow: 'hidden',
        }}
      >
        <AllocatedTarget
          key={selectedDefaultShortTermGoalKey}
          editAble={editAble}
          editAllocatedTarget={editAllocatedTarget}
          allocatedTarget={selectedDefaultShortTermGoal?.node?.targetAllocateSet?.edges}
        />
      </div>
    </div>
  )

  return (
    <>
      <Helmet title="Target allocation to goals" />
      <Layout>
        <Content>
          {/* Goals Drawer */}
          <Drawer
            title={addHeading}
            placement="right"
            closable
            destroyOnClose
            width={DRAWER.widthL1}
            onClose={handleCloseAddGoal}
            visible={isAddGoalVisible}
          >
            <AddLongAndShortGoal
              type={goalType}
              activeLongTermGoal={activeLongTermGoal}
              activeShortTermGoal={activeShortTermGoal}
              student={selectedStudent}
              program={selectedProgram}
              goalResponsibilityList={goalResponsibilityList}
              goalStatusList={goalStatusList}
              onSuccess={onSuccessAddEditGoal}
              editAble={editAble}
            />
          </Drawer>

          {/* Target Allocation Drawer */}
          <Drawer
            title="Target Allocation"
            placement="right"
            closable
            width={DRAWER.widthL1}
            style={{ zIndex: 1001 }}
            onClose={handleCloseTargetDetails}
            visible={isTargetDetailsVisible}
          >
            <TargetAllocationNewDrawer
              key={Math.random()}
              isDirectGoal={activeTabKey !== 'customGoalTab'}
              defaultShortTermGoalForSelectedProgram={selectedDefaultShortTermGoal}
              selectedShortTermGoal={selectedShortTermGoal}
              studentId={selectedStudent}
              activeSessionDetails={activeSessionDetails}
              addTargetMode={addTargetMode}
              onSuccessTargetAllocation={onSuccessTargetAllocation}
              selectedTargetId={activeSessionDetails ? activeSessionDetails.node.id : null}
              targetName={
                activeSessionDetails ? activeSessionDetails.node.targetMain.targetName : null
              }
              targetVideo={activeSessionDetails ? activeSessionDetails.node.video : null}
              targetInstr={activeSessionDetails ? activeSessionDetails.node.targetInstr : null}
              peakEnable={isPeak}
              equivalenceEnable={isEquivalence}
              equivalenceObject={equivalenceObject}
              // setOpen={setSelectTarget}
            />
          </Drawer>

          {/* Target Allocation from library Drawer */}
          <Drawer
            title="Target Allocation from library"
            placement="right"
            closable
            width={DRAWER.widthL1}
            onClose={closeTargetAllocationDrawer}
            visible={targetAllocationDrawer}
          >
            <TargetAvailableDrawer
              selectedStudent={selectedStudent}
              selectedProgram={selectedProgram}
              allocateSessionToTarget={allocateSessionToTarget}
              suggestedTarget={suggestedTarget}
              setSuggestedTarget={setSuggestedTarget}
            />
          </Drawer>

          {/* Target Allocation from Equivalence Drawer */}
          <Drawer
            title="Equivalence Target Allocation"
            placement="right"
            closable
            width={DRAWER.widthL1}
            onClose={closeTargetAllocationDrawer}
            visible={equivalenceTargetDrawer}
          >
            <EquivalenceDrawer
              selectedStudent={selectedStudent}
              selectedProgram={selectedProgram}
              allocateSessionToTarget={allocateSessionToTarget}
              suggestedTarget={suggestedTarget}
              setSuggestedTarget={setSuggestedTarget}
            />
          </Drawer>

          {/* Target Allocation from CogniAble Assessment Drawer */}
          <Drawer
            title="Target Allocation from CogniAble Assessment"
            placement="right"
            closable
            width={DRAWER.widthL1}
            onClose={closeTargetAllocationDrawer}
            visible={cogniableAssessmentDrawer}
          >
            <CogniAbleDrawer
              selectedStudent={selectedStudent}
              selectedProgram={selectedProgram}
              allocateSessionToTarget={allocateSessionToTarget}
              suggestedTarget={suggestedTarget}
              setSuggestedTarget={setSuggestedTarget}
            />
          </Drawer>

          {/* Edit Allocated Target Drawer */}
          <Drawer
            title="Edit Allocated Target Details"
            placement="right"
            closable
            width={DRAWER.widthL1}
            onClose={handleCloseEditTargetDetails}
            visible={isEditAllocatedTargetVisible}
          >
            <EditTargetAllocationNewDrawer
              key={Math.random()}
              isDirectGoal={activeTabKey !== 'customGoalTab'}
              defaultShortTermGoalForSelectedProgram={selectedDefaultShortTermGoal}
              selectedShortTermGoal={selectedShortTermGoal}
              studentId={selectedStudent}
              activeAllocatedTarget={activeAllocatedTarget}
              onSuccessTargetAllocation={onSuccessEditTargetAllocation}
              editAble={editAble}
            />
          </Drawer>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              alignItems: 'center',
              padding: '0px 10px',
              backgroundColor: '#FFF',
              boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
            }}
          >
            <div style={{ padding: 8 }}>
              {studentName && (
                <Title
                  style={{
                    fontSize: 20,
                    lineHeight: '27px',
                  }}
                >
                  {studentName}&apos;s Targets
                </Title>
              )}
            </div>
          </div>

          <div>
            {loading ? (
              <LoadingComponent />
            ) : (
              <Tabs
                className="targetTabs"
                style={{
                  backgroundColor: COLORS.palleteLight,
                  marginTop: 8,
                  borderTop: 'none',
                }}
                tabBarStyle={{
                  backgroundColor: '#fff',
                }}
                onChange={setActiveTabKey}
              >
                <TabPane tab="Goal(s)" key="customGoalTab">
                  {customGoalTab}
                </TabPane>
                <TabPane tab="Directly" key="defaultGoalTab">
                  {defaultGoalTab}
                </TabPane>
              </Tabs>
            )}
          </div>
        </Content>
      </Layout>
    </>
  )
}

export default TargetAllocation
