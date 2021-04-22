const { default: gql } = require('graphql-tag')

export const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
      lastname
    }
  }
`

export const GET_TARGET = gql`
  mutation($id: ID!) {
    suggestPeakTargets(input: { program: $id }) {
      details {
        id
        code
        description
        peakType
        targets {
          edges {
            node {
              id
              video
              targetInstr
              status
              targetMain {
                id
                targetName
              }
              targetArea {
                id
                Area
              }
            }
          }
        }
      }
    }
  }
`

export const GET_EQUI_TARGET = gql`
  mutation suggestPeakEquiTargets($id: ID!) {
    suggestPeakTargetsForEquivalence(input: { program: $id }) {
      codes {
        id
        code
        target {
          id
          maxSd
          targetInstr
          targetMain {
            id
            targetName
          }
          domain {
            id
            domain
          }
        }
        classes {
          edges {
            node {
              id
              name
              stimuluses {
                edges {
                  node {
                    id
                    option
                    stimulusName
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

export const GET_EQUI_CATTEGORY = gql`
  query {
    peakEquDomains {
      id
      name
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
          id
          domain
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

export const SUMMERY = gql`
  query($program: ID!) {
    peakDataSummary(program: $program) {
      total
      totalAttended
      totalCorrect
      totalIncorrect
      totalNoResponse
      totalSkipped
      totalSuggested
      lastRecord {
        id
        code
        description
        instructions
        expRes
      }
      edges {
        node {
          id
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
export const GET_CODE_DETAILS = gql`
  query($id: ID!) {
    peakCodeDetails(id: $id) {
      id
      peakType
      code
      description
      instructions
      expRes
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

export const QUIT = gql`
  mutation($programId: ID!) {
    peakFinishAssessment(input: { program: $programId }) {
      details {
        id
        date
        title
        status
      }
    }
  }
`
