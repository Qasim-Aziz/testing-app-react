/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const RESPONSE_RATE = gql`
  query($startDate: Date!, $endDate: Date!, $studentId: ID!) {
    responseRate(studentId: $studentId, dateGte: $startDate, dateLte: $endDate) {
      targetId
      targetName
      targetStatusName
      targetType
      perTar
      perPeakCorrect
      perPeakPrompt
      perPeakError
      sessionDate
      sessionRecord {
        perSd
        sd
        step
        perStep
      }
    }
  }
`
export const RESPONSE_RATE_EQUI = gql`
  query($startDate: Date!, $endDate: Date!, $studentId: ID!, $equivalence: Boolean) {
    responseRate(
      studentId: $studentId
      dateGte: $startDate
      dateLte: $endDate
      equivalence: $equivalence
    ) {
      sessionDate
      targetName
      targetStatusName
      targetType
      targetId
    }
  }
`
export const RESPONSE_RATE_FILTER_OPT = gql`
  query {
    types {
      id
      typeTar
    }
    targetStatus(first: 4) {
      id
      statusName
    }
  }
`

export const MAND_DATA = gql`
  query($studentId: ID!, $startDate: Date!, $endDate: Date!) {
    mandReport(studentId: $studentId, startDate: $startDate, endDate: $endDate) {
      id
      measurments
      data {
        date
        count
      }
    }
  }
`

export const GET_STUDENT = gql`
  query($id: ID!) {
    student(id: $id) {
      id
      firstname
      lastname
    }
  }
`

export const MEDICAL_DATA = gql`
  query($start: Date!, $end: Date!) {
    getMedication(date_Gte: $start, date_Lte: $end) {
      edges {
        node {
          id
          severity {
            id
            name
          }
          date
          lastObservedDate
          condition
          startDate
          endDate
          duration
          drug {
            edges {
              node {
                id
                drugName
                dosage
                times
              }
            }
          }
        }
      }
    }
  }
`

export const TOILET_DATA = gql`
  query {
    getToiletData {
      edges {
        node {
          id
          date
          time
          lastWater
          lastWaterTime
          success
          urination
          bowel
          prompted
          reminders {
            edges {
              node {
                id
                time
                frequency {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const MEAL_DATA = gql`
  query($type: String, $start: Date!, $end: Date!) {
    getFood(mealType: $type, date_Gte: $start, date_Lte: $end) {
      edges {
        node {
          id
          date
          mealName
          mealTime
          mealType
          servingSize
          calories
          waterIntake
          foodType {
            id
            name
          }
          note
          duration
        }
      }
    }
  }
`

export const FOOD_TYPE = gql`
  query {
    getFoodType {
      id
      name
    }
  }
`

export const SESSIONS_SUMMERY = gql`
  query($studentId: ID!, $startDate: Date!, $endDate: Date!) {
    sessionSummary(studentId: $studentId, dateGte: $startDate, dateLte: $endDate) {
      sessionDate
      peakEquCorrect
      peakEquError
      peakEquPrompt
      duration
      correctCount
      errorCount
      promptCount
      peakCorrect
      peakError
      peakPrompt
      behCount
      behaviour
      toiletCount
      toilet
      mand
      id
      sessions {
        id
        sessionName {
          id
          name
        }
      }
    }
  }
`

export const FREQUENCY_DIS_TARGET = gql`
  query($student: ID!, $session: ID!) {
    freqDistriTarget(student: $student, session: $session, duration: 1000) {
      duration
      tarCount
      behRed
    }
  }
`
export const GOAL_STATUS = gql`
  query($studentId: ID!) {
    goalStatus(student: $studentId) {
      id
      status
    }
  }
`

export const ATTANDANCE = gql`
  query($dateGte: Date!, $dateLte: Date!, $therapist: ID!) {
    attendanceReport(dateGte: $dateGte, dateLte: $dateLte, therapist: $therapist) {
      date
      hours
    }
  }
`

export const SESSION_NAME = gql`
  query {
    sessionName {
      id
      name
    }
  }
`

export const TARGET_ALLOCATE = gql`
  query($id: ID!) {
    targetAllocate(id: $id) {
      id
      time
      targetInstr
      date
      targetStatus {
        id
        statusName
      }
      targetId {
        id
        domain {
          id
          domain
        }
      }
      targetAllcatedDetails {
        id
        targetName
        dateBaseline
        DailyTrials
        consecutiveDays
        targetType {
          id
          typeTar
        }
      }
      videos {
        edges {
          node {
            id
            url
          }
        }
      }
      sd {
        edges {
          node {
            id
            sd
          }
        }
      }
      steps {
        edges {
          node {
            id
            step
          }
        }
      }

      mastery {
        edges {
          node {
            id
            sd {
              id
              sd
            }
            step {
              id
              step
            }
            status {
              id
              statusName
            }
            mastery {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const PEAK_BLOCKWISE = gql`
  query($student: ID!, $start: Date, $end: Date, $sessionName: ID) {
    peakBlockWiseReport(student: $student, start: $start, end: $end, sessionName: $sessionName) {
      date
      target {
        id
        targetAllcatedDetails {
          id
          targetName
        }
        peakType
      }
      blocks {
        id
        totalScore
        trial {
          edges {
            node {
              id
              marks
              sd {
                id
                sd
              }
            }
          }
        }
      }
    }
  }
`

export const PEAK_EQUIVALENCE = gql`
  query($student: ID!, $start: Date, $end: Date, $sessionName: ID, $equivalence: Boolean) {
    peakBlockWiseReport(
      student: $student
      start: $start
      end: $end
      sessionName: $sessionName
      equivalence: $equivalence
    ) {
      date
      target {
        id
        targetAllcatedDetails {
          id
          targetName
        }
      }
      equBlocks {
        score
        recType
        relationTrain {
          id
          stimulus1
          sign12
          stimulus2
          sign23
          stimulus3
        }
        relationTest {
          id
          stimulus1
          sign12
          stimulus2
          sign23
          stimulus3
        }
        codeClass {
          id
          name
        }
        id
      }
    }
  }
`

export const BLOCKWISE_DETAIL = gql`
  query {
    getPeakBlockDetails(id: "UGVha0Jsb2Nrc1R5cGU6MTIyMw==") {
      id
      durationStart
      durationEnd
      entryTime
      trial {
        edges {
          node {
            id
            marks
            sd {
              id
              sd
            }
          }
        }
      }
    }
  }
`

export const TARGET_RESPONSE_RATE = gql`
  query($student: ID!, $start: Date, $end: Date, $sessionName: ID) {
    targetWiseReportDatewise(
      student: $student
      start: $start
      end: $end
      sessionName: $sessionName
    ) {
      date
      target {
        id
        targetAllcatedDetails {
          id
          targetName
          targetType {
            id
            typeTar
          }
        }
        peakBlocks
        peakType
      }
      session {
        sessions {
          sessionName {
            id
            name
          }
        }
      }
      blocks {
        id
        entryTime
        durationStart
        durationEnd
        totalScore
        trial {
          edges {
            node {
              id
              start
              end
              marks
              sd {
                id
                sd
              }
            }
          }
        }
      }
      trials {
        id
        durationStart
        durationEnd
        trial
        sd {
          id
          sd
        }
        step {
          id
          step
        }
        promptCode {
          id
          promptName
        }
      }
    }
  }
`

export const TARGET_EQUI_RESPONSE_RATE = gql`
  query($student: ID!, $start: Date, $end: Date, $sessionName: ID, $equivalence: Boolean) {
    targetWiseReportDatewise(
      student: $student
      start: $start
      end: $end
      sessionName: $sessionName
      equivalence: $equivalence
    ) {
      date
      target {
        id
        targetAllcatedDetails {
          id
          targetName
        }
        peakType
      }
      equBlocks {
        durationStart
        durationEnd
        recType
        score
        relationTrain {
          id
          stimulus1
          sign12
          stimulus2
          sign23
          stimulus3
        }
        relationTest {
          id
          stimulus1
          sign12
          stimulus2
          sign23
          stimulus3
        }
        codeClass {
          id
          name
        }
        id
      }
    }
  }
`

export const GET_TEMPLATES = gql`
  query getTemplate($studentId: ID!) {
    getTemplate(student: $studentId) {
      edges {
        node {
          id
          behavior {
            id
            behaviorName
            definition
          }
          status {
            id
            statusName
          }
          environment {
            edges {
              node {
                id
              }
            }
          }
          behaviorDescription
        }
      }
    }
  }
`
