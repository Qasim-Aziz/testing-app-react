/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-else-return */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Checkbox, Select, Icon, Typography, Drawer, Input, Radio, Row, Col, Card } from 'antd'
import moment from 'moment'
import { EditOutlined } from '@ant-design/icons'
import styles from './style.module.scss'
import GoalCard from '../../../components/GoalCard'
import {
  alreadyAlloctedTarget,
  getLongTermGoals,
  getPatients,
  getGoalStatus,
  getGoalResponsibility,
} from './TargetAllocation.query'
import { arrayNotNull, notNull, capitalize } from '../../../utilities'
import AddLongAndShortGoal from '../AddLongAndShortGoal'

import AllocatedTarget from './AllocatedTarget'
import TargetsAvailable from './TargetsAvailable'
import TargetAvailableDrawer from './TargetAllocationDrawer'
import CogniAbleDrawer from './FromCogniable'
import TargetAllocationNewDrawer from '../../../components/TargetAllocation/TargetAllocation'
import EquivalenceDrawer from './EquivalenceTargetAllocationDrawer'
import EditTargetAllocationNewDrawer from '../../../components/TargetAllocation/EditTargetAllocation'

const { Title, Text } = Typography
const longGoalBtn = {
  color: '#fff',
  backgroundColor: '#0B35B3',
  // border: '1px solid #0B35B3',
}

const shortGoalBtn = {
  // border: 0,
  color: '#111',
  backgroundColor: '#FFF',
}

const selectPatientStyle = {
  width: '200px',
  // height: '60px',
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
    // alreadyAlloctedTargetQuery(selectedStudent, 'U3RhdHVzVHlwZToz', 'RG9tYWluVHlwZToxMQ==')
    getLongTermGoalsQuery(selectedStudent, selectedProgram, selectedGoalsStatus)
  }, [])

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

    const years = endDate.diff(startDate, 'year');
    startDate.add(years, 'years');

    const months = endDate.diff(startDate, 'months');
    startDate.add(months, 'months');

    const days = endDate.diff(startDate, 'days');

    const date =
      `${moment(node.dateInitialted).format('MMMM DD, YYYY')} - ${endDate.format('MMMM DD, YYYY')}` +
      `, ${years > 0 ? `${years} Year`: ''} ${months > 0 ? `${months} Months`: ''} ${days > 0 ?`${days} Days`: ''}`
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

  const allocateSessionToTarget = (session, peakEnable = false, equivalenceEnable = false, equivalenceNode = null) => {
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

  useEffect(() => { }, [selectedShortTermGoal])

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

  const onSuccessEditTargetAllocation = resp => {
    const cloneSelectedShortTermGoal = {
      ...selectedShortTermGoal,
      node: {
        ...selectedShortTermGoal.node,
        targetAllocateSet: {
          ...selectedShortTermGoal.node.targetAllocateSet,
          edges: [
            ...selectedShortTermGoal.node.targetAllocateSet.edges.map(item => {
              if (item.node.id === resp.data.updateTargetAllocate2.target.id) {
                return {
                  node: resp.data.updateTargetAllocate2.target,
                }
              } else {
                return item
              }
            }),
          ],
        },
      },
    }
    // console.log(cloneSelectedShortTermGoal)
    setSelectedShortTermGoal(cloneSelectedShortTermGoal)
    setSelectedShortTermGoalKey(Math.random())
    setEditAllocatedTargetVisible(false)
    setActiveAllocatedTarget(null)
  }

  // End of Edit allocated target

  // for close sugegsted target area
  const closeSuggestedTargetArea = () => {
    setAddTargetMode('')
    setSelectedShortTermGoal(null)
  }

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

  const onSuccessTargetAllocation = resp => {
    setShowTargetDetailsVisible(false)
    setActiveSessionDetails(null)

    // getLongTermGoalsQuery(selectedStudent, selectedProgram)

    const cloneSelectedShortTermGoal = { ...selectedShortTermGoal }

    if (cloneSelectedShortTermGoal.node.targetAllocateSet) {
      cloneSelectedShortTermGoal.node.targetAllocateSet.edges.unshift({
        node: {
          ...resp.data.createTargetAllocate2.target,
        },
      })
    } else {
      cloneSelectedShortTermGoal.node = {
        ...cloneSelectedShortTermGoal.node,
        targetAllocateSet: { edges: [{ node: { ...resp.data.createTargetAllocate2.target } }] },
      }
      // console.log(cloneSelectedShortTermGoal)
    }

    setSelectedShortTermGoal(cloneSelectedShortTermGoal)

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
      longTermGoalsClone.map(item => {
        if (item.node.goalName.includes(text)) {
          searchedGoals.push(item)
        }
        else {
          let includeInShorTerm = false
          const itemWithEmptyShortTermSet = { node: { ...item.node, shorttermgoalSet: { edges: [] } } }
          if (item.node.shorttermgoalSet.edges.length > 0) {
            item.node.shorttermgoalSet.edges.map(shortItem => {
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

  return (
    <div>
      <Helmet title="Target allocation to goals" />

      {/* Goals Drawer */}
      <Drawer
        title={addHeading}
        placement="right"
        closable={true}
        width={550}
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
        closable={true}
        width={850}
        style={{ zIndex: 1001 }}
        onClose={handleCloseTargetDetails}
        visible={isTargetDetailsVisible}
      >
        <TargetAllocationNewDrawer
          key={Math.random()}
          selectedShortTermGoal={selectedShortTermGoal}
          studentId={selectedStudent}
          activeSessionDetails={activeSessionDetails}
          addTargetMode={addTargetMode}
          onSuccessTargetAllocation={onSuccessTargetAllocation}

          selectedTargetId={activeSessionDetails ? activeSessionDetails.node.id : null}
          targetName={activeSessionDetails ? activeSessionDetails.node.targetMain.targetName : null}
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
        closable={true}
        width="80%"
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
        closable={true}
        width="80%"
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
        closable={true}
        width="80%"
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
        closable={true}
        width={850}
        onClose={handleCloseEditTargetDetails}
        visible={isEditAllocatedTargetVisible}
      >
        <EditTargetAllocationNewDrawer
          key={Math.random()}
          selectedShortTermGoal={selectedShortTermGoal}
          studentId={selectedStudent}
          activeAllocatedTarget={activeAllocatedTarget}
          onSuccessTargetAllocation={onSuccessEditTargetAllocation}
          editAble={editAble}
        />
      </Drawer>

      <section className="card">
        <div className="card-header" style={{ padding: 0 }}>
          <div>
            <Title
              style={{
                fontSize: 20,
                lineHeight: '27px',
                marginLeft: '40px',
              }}
            >
              {studentName}&apos;s Goals
            </Title>
          </div>
        </div>
        <div className={`${styles.cardBody} card-body`}>
          <div className={styles.feed}>
            <div className="row">
              <div className="col-lg-12 d-flex">
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
                    placeholder="Search LT & ST Goals"
                    onChange={e => searchTarget(e.target.value)}
                    style={{ width: 300, marginRight: 16 }}
                  />

                </div>
                {editAble ? (
                  <>
                    <Button type="default" style={longGoalBtn} onClick={addLongTermGoal}>
                      <Icon type="plus" /> LT Goal
                    </Button>

                    {/* {addTargetMode === 'list' ?
                      <>

                        <Button type="default" style={{ marginLeft: '466px' }} onClick={closeSuggestedTargetArea}>
                          X
                        </Button>

                      </>
                      :
                      ''
                    } */}
                  </>
                ) : (
                    <></>
                  )}
                {/* </div>
              <div className="col-lg-4"> */}
                {selectedShortTermGoal && editAble ? (
                  <>
                    <span style={{ position: 'absolute', right: 0, top: 0 }}>Target Allocation from &nbsp;
                      <Radio.Group onChange={(e) => handleSelectTargetMode(e.target.value)} value={addTargetMode}>
                        <Radio.Button value="list">Library</Radio.Button>
                        <Radio.Button value="manually">Manually</Radio.Button>
                        <Radio.Button value="equivalence">Equivalence</Radio.Button>
                      </Radio.Group>
                    </span>

                    {/* <Select
                      style={{ width: 200, position: 'absolute', right: 0, top: 0 }}
                      placeholder="Select Target selection"
                      value={addTargetMode}
                      onSelect={handleSelectTargetMode}
                    >
                      <Select.Option value="" hidden>
                        Select Target selection
                      </Select.Option>
                      <Select.Option value="list">Choose from Library</Select.Option>
                      <Select.Option value="CogniAble">From CogniAble Assessment</Select.Option>
                      <Select.Option value="Peak">From Peak Assessment</Select.Option>
                      <Select.Option value="VB-Mapp ">From VB-Mapp Assessment</Select.Option>
                      <Select.Option value="manually">Add Manually</Select.Option>
                    </Select> */}
                  </>
                ) : (
                    <></>
                  )}
              </div>
            </div>

            <div className={styles.partition}>
              {loading ? (
                <>
                  <p>Loading...</p>
                </>
              ) : (
                  <>
                    <Row gutter={[10, 10]}>
                      <Col md={16} sm={24}>
                        <div
                          style={{
                            border: '2px solid #f9f9f9',
                            padding: 5,
                            height: 650,
                            overflow: 'auto',
                            background: '#f9f9f9',
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
                                    // boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                                    borderRadius: 5,
                                    // padding: '10px 10px',
                                    // display: 'flex',
                                    margin: 5,
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
                                          <Text style={{ fontSize: 15, lineHeight: '27px', }}>
                                            {ltGoal.node.goalStatus.status}
                                          </Text>
                                          <Text style={{ fontSize: 15, lineHeight: '27px', float: 'right', marginRight: 10 }}>
                                            {getDate(ltGoal.node)}
                                          </Text>
                                        </div>
                                      </>
                                    }
                                    extra={editAble && (
                                      <>
                                        <div>
                                          <Button
                                            style={shortGoalBtn}
                                            onClick={() => addShortTermGoal(ltGoal)}
                                          >
                                            <Icon type="plus" />
                                          </Button>
                                          &nbsp;
                                          <Button onClick={() => editLongTermGoal(ltGoal)}>
                                            <EditOutlined />
                                          </Button>
                                        </div>
                                      </>
                                    )}
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
                      </Col>

                      {selectedShortTermGoal && (
                        <Col md={8} sm={24}>
                          <div
                            style={{
                              border: '2px solid #f9f9f9',
                              padding: 10,
                              height: 650,
                              overflow: 'auto',
                              background: '#f9f9f9',
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

                  </>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TargetAllocation
