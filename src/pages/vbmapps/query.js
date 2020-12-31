import gql from 'graphql-tag'

/* eslint-disable import/prefer-default-export */

export const IER_REPORTS = gql`
  mutation($id: ID!) {
    vbmappIepReport(input: { pk: $id }) {
      status
      data
      file
    }
  }
`

export const GET_TARGET = gql`
  mutation($id: ID!, $areaId: ID!) {
    vbmappTargetSuggest(input: { pk: $id, area: $areaId }) {
      targets {
        id
        domain {
          id
          domain
        }
        targetArea {
          id
          Area
        }
        targetInstr
        video
        targetMain {
          id
          targetName
        }
      }
    }
  }
`

export const GET_VBMAPP_TARGET=gql`
mutation vbmappTargetSuggest($pk:ID!,$area:ID!){
  vbmappTargetSuggest(input:{
      pk:$pk
      area:$area
  }){
      targets{
          id
          domain{
              id,
              domain
          },
          targetArea{
              id,
              Area
          }
          targetInstr
          video
          targetMain{
              id,
              targetName
          }
      }
  }
}
`

export const TARGET_ALLOCATIONS_OPTIONS = gql`
  query {
    targetStatus {
      id
      statusName
    }
    types {
      id
      typeTar
    }
    promptCodes {
      id
      promptName
    }
    masteryCriteria {
      id
      name
    }
    domain {
      edges {
        node {
          domain
          id
        }
      }
    }
    goalsProgramArea {
      id
      name
    }
  }
`

export const GET_TARGET_STEP = gql`
  query($text: String) {
    targetStep(first: 8, step_Icontains: $text) {
      edges {
        node {
          id
          step
        }
      }
    }
  }
`

export const GET_TARGET_SD = gql`
  query($text: String) {
    targetSd(first: 8, sd_Icontains: $text) {
      edges {
        node {
          id
          sd
        }
      }
    }
  }
`

export const SETTING = gql`
  query($studentId: ID!) {
    getAllocateTargetSettings(student: $studentId) {
      edges {
        node {
          id
          dailyTrials
          consecutiveDays
          student {
            id
            firstname
          }
          targetType {
            id
            typeTar
          }
          masteryCriteria {
            id
            name
          }
          status {
            id
            statusName
          }
        }
      }
    }
  }
`

export const SHORT_TERM_GOALS = gql`
  query($studentId: ID!) {
    shortTerm(longTerm_Student: $studentId) {
      edges {
        node {
          id
          goalName
        }
      }
    }
  }
`

export const CREATE_TARGET = gql`
  mutation CreateTargetAllocate(
    $studentId: ID!
    $shortTerm: ID!
    $targetId: ID!
    $targetStatus: ID!
    $targetInstr: String!
    $date: Date!
    $masteryCriteria: ID!
    $targetName: String!
    $dailyTrials: Int!
    $consecutiveDays: Int!
    $targetType: ID!
    $sd: [String]
    $steps: [String]
    $video: [String]
    $default: Boolean
    $peakBlocks: Int!
  ) {
    createTargetAllocate(
      input: {
        makeDefault: $default
        targetData: {
          shortTerm: $shortTerm
          targetId: $targetId
          studentId: $studentId
          targetStatus: $targetStatus
          objective: ""
          date: $date
          targetInstr: $targetInstr
          goodPractices: ""
          precaution: ""
          gernalizationCriteria: ""
          masteryCriteria: $masteryCriteria
          targetName: $targetName
          DailyTrials: $dailyTrials
          consecutiveDays: $consecutiveDays
          targetType: $targetType
          promptCodes: []
          sd: $sd
          steps: $steps
          videos: $video
          peakBlocks: $peakBlocks
        }
      }
    ) {
      targetName
    }
  }
`

export const GET_VBMAPP_QUESTIONS = gql`
  mutation($student: ID!, $areaID: ID!, $masterID: ID!, $group: ID!) {
    vbmappGetQuestions(
      input: { student: $student, area: $areaID, group: $group, master: $masterID }
    ) {
      area
      group
      questions
    }
  }
`

export const SEND_RESPONSE = gql`
  mutation($programId: ID!, $yes: [ID]!, $no: [ID]!) {
    peakSubmitResponse(input: { program: $programId, yes: $yes, no: $no }) {
      details {
        id
        program {
          id
          title
          date
        }
        yes {
          edges {
            node {
              id
              code
            }
          }
        }
        no {
          edges {
            node {
              id
              code
            }
          }
        }
      }
    }
  }
`

export const GET_TASK_ANALYSIS_GROUP = gql`
  query($areaId: ID!) {
    vbmappGroups(area: $areaId) {
      edges {
        node {
          id
          apiGroup
          groupName
          noQuestion
        }
      }
    }
  }
`

export const CREATE_NOTE = gql`
  mutation($area: ID!, $masterRecord: ID!, $note: String!) {
    vbmappCreateNote(input: { area: $area, masterRecord: $masterRecord, note: $note }) {
      details {
        id
        note
        area {
          id
          apiArea
          areaName
        }
        masterRecord {
          id
          date
          testNo
        }
      }
    }
  }
`

export const GET_TASK_QUESTIONS = gql`
  mutation($studentId: ID!, $group: ID!, $masterId: ID!) {
    vbmappGetQuestions(
      input: { student: $studentId, area: "VmJtYXBwQXJlYTo1", group: $group, master: $masterId }
    ) {
      area
      group
      questions
    }
  }
`

export const GET_REPORT = gql`
  mutation($masterId: ID!, $areaId: ID!, $groupId: ID!) {
    vbmappGetReport(input: { master: $masterId, area: $areaId, group: $groupId }) {
      details {
        id
        area {
          id
          apiArea
          areaName
          description
        }
        masterRecord {
          id
          testNo
          date
          color
          student {
            id
            firstname
            dob
          }
        }
      }

      records {
        id
        date
        questionNum
        code
        groups {
          id
          groupName
        }
      }
    }
  }
`

export const GET_TASK_REPORT = gql`
  mutation($masterId: ID!, $groupId: ID!) {
    vbmappGetReport(input: { master: $masterId, area: "VmJtYXBwQXJlYTo1", group: $groupId }) {
      details {
        id
        area {
          id
          apiArea
          areaName
          description
        }
        masterRecord {
          id
          testNo
          date
          color
          student {
            id
            firstname
            dob
          }
        }
      }

      records {
        id
        date
        questionNum
        code
        groups {
          id
          groupName
        }
      }
    }
  }
`
