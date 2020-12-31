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
    $targetId: ID
    $targetStatus: ID!
    $targetInstr: String!
    $date: Date!
    $masteryCriteria: ID!
    $targetName: String!
    $dailyTrials: Int!
    $consecutiveDays: Int!
    $targetType: ID!
    $sd: [SdMasteryInput]
    $steps: [StepMasteryInput]
    $video: [String]
    $default: Boolean
    $peakBlocks: Int!
    $peakType: String
    $classes: [ClassesInput]
    $equiCode: String
  ) {
    createTargetAllocate2(
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
          peakType: $peakType
          eqCode: $equiCode
        }
        classes: $classes
      }
    ) {
      targetName,
      target {
        id, 
        date, 
        targetInstr, 
        peakBlocks,
        peakType,
        targetStatus{
          id, statusName
        }
        eqCode
        sessionSet{
          edges{
            node{
              id
            }
          }
        }
        masteryCriteria{
          id,
          name
        }
        targetId{
          id,
          maxSd
          domain{
            id,
            domain
          }
        }
        targetAllcatedDetails{
          id,
          targetName,
          dateBaseline,
          DailyTrials,
          consecutiveDays,
          targetType{
            id,
            typeTar
          }
        },
        videos{
          edges{
            node{
              id,
              url
            }
          }
        },
        sd{
          edges{
            node{
              id,
              sd
            }
          }
        },
        steps{
          edges{
            node{
              id,
              step
            }
          }
        },
        mastery{
          edges{
            node{
              sd{
                id
                sd
              }
              step{
                id
                step
              }
              mastery{
                id
                name
              }
              status{
                id
                statusName
              }
            }
          }
        }
        classes{
          edges{
            node{
              id
              name
              stimuluses{
                edges{
                  node{
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


export const UPDATE_TARGET = gql`
  mutation UpdateShortTerm(
          $targetAllocatedId: ID!
          $targetStatus: ID!
          $targetInstr: String!
          $masteryCriteria: ID!
          $targetName: String!
          $dailyTrials: Int!
          $consecutiveDays: Int!
          $targetType: ID!
          $sd: [SdMasteryInput]
          $steps: [StepMasteryInput]
          $video: [String]
          $peakBlocks: Int
          $peakType: String
          $classes: [ClassesInput]
        ) {
          updateTargetAllocate2(
            input: {
              pk: $targetAllocatedId
              targetData: {
                targetStatus: $targetStatus
                targetInstr: $targetInstr
                goodPractices: "<p></p>"
                precaution: "<p></p>"
                gernalizationCriteria: "<p></p>"
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
                peakType: $peakType
              }
              classes: $classes
            }
          ) {
            targetName
            target {
              id
              date
              targetInstr
              peakBlocks
              peakType
              targetStatus {
                id
                statusName
              }
              targetId {
                id
                maxSd
                domain {
                  id
                  domain
                }
              }
              masteryCriteria {
                id
                name
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
              mastery{
                edges{
                  node{
                    sd{
                      id
                      sd
                    }
                    step{
                      id
                      step
                    }
                    mastery{
                      id
                      name
                    }
                    status{
                      id
                      statusName
                    }
                  }
                }
              }
              classes{
                edges{
                  node{
                    id
                    name
                    stimuluses{
                      edges{
                        node{
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