/* eslint-disable import/prefer-default-export */

import moment from 'moment'
import barriersQueTitles from './Barriers/barriersQueTitles'
import transitionQueTitles from './TransitionAssessment/transitionQueTitles'
import milestoneLevels from './Milestones/milestoneLevels'
import taskLevels from './TaskAnalysis/taskLevels'

export const structurizeData = graphqlData => {
  if (graphqlData) {
    const reportData = {
      milestonesData: generateMilestoneData(graphqlData),
      barriersData: generateBarrierseData(graphqlData),
      tasksData: generateTasksData(graphqlData),
      transitionsData: generateTransitionsData(graphqlData),
    }

    return reportData
  }

  return null
}

const generateMilestoneData = ({ milestones }) => {
  const milestonesData = generateMilestoneLevels()

  milestonesData.studentDetails = generateStudentData(milestones)
  milestonesData.scoreDetails = generateScoreData(milestones)

  if (milestones.data[0]) groupMilestoneData(milestones.data[0].details, milestonesData)
  if (milestones.data[1]) groupMilestoneData(milestones.data[1].details, milestonesData)
  if (milestones.data[2]) groupMilestoneData(milestones.data[2].details, milestonesData)
  if (milestones.data[3]) groupMilestoneData(milestones.data[3].details, milestonesData)

  return milestonesData
}

const generateBarrierseData = ({ barriers }) => {
  const barriersData = {}

  barriersData.studentDetails = generateStudentData(barriers)
  barriersData.scoreDetails = generateScoreData(barriers)

  barriersData.questions = generateBarrierQuestions()
  if (barriers.data[0]) groupBarrierData(barriers.data[0].details, barriersData.questions, 1)
  if (barriers.data[1]) groupBarrierData(barriers.data[1].details, barriersData.questions, 2)
  if (barriers.data[2]) groupBarrierData(barriers.data[2].details, barriersData.questions, 3)
  if (barriers.data[3]) groupBarrierData(barriers.data[3].details, barriersData.questions, 4)

  return barriersData
}

const generateTasksData = ({ taskAnalysis }) => {
  const tasksData = generateTaskLevels()

  tasksData.studentDetails = generateStudentData(taskAnalysis)
  tasksData.scoreDetails = generateScoreData(taskAnalysis)

  if (taskAnalysis.data[0]) groupTaskAnalysisData(taskAnalysis.data[0].details, tasksData)
  if (taskAnalysis.data[1]) groupTaskAnalysisData(taskAnalysis.data[1].details, tasksData)
  if (taskAnalysis.data[2]) groupTaskAnalysisData(taskAnalysis.data[2].details, tasksData)
  if (taskAnalysis.data[3]) groupTaskAnalysisData(taskAnalysis.data[3].details, tasksData)

  return tasksData
}

const generateTransitionsData = ({ transitionAssessment }) => {
  const transitionsData = {}

  transitionsData.studentDetails = generateStudentData(transitionAssessment)
  transitionsData.scoreDetails = generateScoreData(transitionAssessment)

  transitionsData.questions = generateTransitionQuestions()
  if (transitionAssessment.data[0])
    groupTransitionsData(transitionAssessment.data[0].details, transitionsData.questions, 1)
  if (transitionAssessment.data[1])
    groupTransitionsData(transitionAssessment.data[1].details, transitionsData.questions, 2)
  if (transitionAssessment.data[2])
    groupTransitionsData(transitionAssessment.data[2].details, transitionsData.questions, 3)
  if (transitionAssessment.data[3])
    groupTransitionsData(transitionAssessment.data[3].details, transitionsData.questions, 4)

  return transitionsData
}

const generateStudentData = areaData => {
  const { student } = areaData.data[0].details.masterRecord
  const studentData = {
    name: `${student.firstname} ${student.lastname ?? ''}`,
    dob: student.dob,
    ageAtTest: [1, 2, 3, 4].map(index => ({
      id: index,
      text: '',
    })),
  }

  areaData.data.forEach(({ details }, index) => {
    studentData.ageAtTest[index].text = getDateDiff(details.masterRecord.date, student.dob)
  })

  return studentData
}

const generateScoreData = areaData => {
  const scoreData = [1, 2, 3, 4].map(index => ({
    key: index,
    testTitle: '',
    score: '',
    date: '',
    color: 'trasparant',
    tester: '',
  }))

  // Update Details as per Response
  areaData.data.forEach(({ details: { masterRecord }, total }, index) => {
    scoreData[index].testTitle = `Test #${masterRecord.testNo}`
    scoreData[index].score = total
    scoreData[index].date = moment(masterRecord.date).format('YYYY-MM-DD')
    scoreData[index].color = masterRecord.color
    scoreData[index].tester = `${masterRecord.user.firstName} ${masterRecord.user.lastName ?? ''}`
  })

  return scoreData
}

const generateMilestoneLevels = () => {
  const returnData = { level1: {}, level2: {}, level3: {} }

  milestoneLevels.forEach(item => {
    if (item.isInLevel1)
      returnData.level1[item.groupName] = { groupName: item.groupName, questions: {} }
    if (item.isInLevel2)
      returnData.level2[item.groupName] = { groupName: item.groupName, questions: {} }
    if (item.isInLevel3)
      returnData.level3[item.groupName] = { groupName: item.groupName, questions: {} }
  })

  return returnData
}

const groupMilestoneData = (data, milestonesData) => {
  data.records.edges.forEach(({ node }) => {
    const level = `level${getLevelFromQue(node.questionNum)}`
    const group = milestonesData[level][node.groups.groupName]
    group.questions[node.questionNum] = {
      id: node.id,
      questionNum: node.questionNum,
      score: node.score,
      color: data.masterRecord.color,
      testName: `Test #${data.masterRecord.testNo}`,
    }
  })
}

const generateTaskLevels = () => {
  const returnData = { level1: {}, level2: {}, level3: {} }

  taskLevels.forEach(item => {
    if (item.isInLevel1)
      returnData.level1[item.groupName] = { groupName: item.groupName, questions: {} }
    if (item.isInLevel2)
      returnData.level2[item.groupName] = { groupName: item.groupName, questions: {} }
    if (item.isInLevel3)
      returnData.level3[item.groupName] = { groupName: item.groupName, questions: {} }
  })

  return returnData
}

const groupTaskAnalysisData = (data, taskData) => {
  data.records.edges.forEach(({ node }) => {
    const level = `level${getLevelFromQue(node.questionNum)}`
    const existingGroup = taskData[level][node.groups.groupName]

    if (!existingGroup.questions[node.questionNum]) {
      // Create question in group
      existingGroup.questions[node.questionNum] = {
        id: node.id,
        questionNum: node.questionNum,
        codes: {},
      }
    }

    // Push code in question
    existingGroup.questions[node.questionNum].codes[node.code] = {
      code: node.code,
      color: data.masterRecord.color,
      testName: `Test #${data.masterRecord.testNo}`,
    }
  })
}

const generateBarrierQuestions = () => {
  return Object.getOwnPropertyNames(barriersQueTitles).map(queNo => ({
    queNo: Number(queNo),
    title: barriersQueTitles[queNo],
    test1: 0,
    test2: 0,
    test3: 0,
    test4: 0,
  }))
}

const groupBarrierData = (data, questions, testNo) => {
  data.records.edges.forEach(({ node }) => {
    // Update score for that question & test
    const existingQuestion = questions.find(question => node.questionNum === question.queNo)
    existingQuestion[`test${testNo}`] = node.score
  })
}

const generateTransitionQuestions = () => {
  return Object.getOwnPropertyNames(transitionQueTitles).map(queNo => ({
    queNo: Number(queNo),
    title: transitionQueTitles[queNo],
    test1: 0,
    test2: 0,
    test3: 0,
    test4: 0,
  }))
}

const groupTransitionsData = (data, questions, testNo) => {
  data.records.edges.forEach(({ node }) => {
    // Update score for that question & test
    const existingQuestion = questions.find(question => node.questionNum === question.queNo)
    existingQuestion[`test${testNo}`] = node.score
  })
}

const getLevelFromQue = que => {
  let level = 0
  if (que >= 1 && que <= 5) level = 1
  else if (que >= 6 && que <= 10) level = 2
  else if (que >= 11 && que <= 15) level = 3
  return level
}

const getDateDiff = (date1, date2) => {
  const d1 = moment(date1)
  const d2 = moment(date2)
  const years = d1.diff(d2, 'years')
  d2.add(years, 'years')
  const months = d1.diff(d2, 'months')
  return `${years}y ${months}m`
}
