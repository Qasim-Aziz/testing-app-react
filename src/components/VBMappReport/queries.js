import gql from 'graphql-tag'

export const GET_VBMAPP_REPORT = gql`
  fragment studentAndScoreDetails on VbmappMasterRecord {
    id
    color
    date
    testNo
    student {
      id
      firstname
      lastname
      dob
    }
    user {
      id
      username
      firstName
      lastName
    }
  }

  fragment milestoneInfo on VbmappGet4ReportPayload {
    data {
      total
      details {
        masterRecord {
          ...studentAndScoreDetails
        }
        records {
          edges {
            node {
              id
              date
              questionNum
              score
              groups {
                id
                groupName
              }
            }
          }
        }
      }
    }
  }

  fragment barrierInfo on VbmappGet4ReportPayload {
    data {
      total
      details {
        masterRecord {
          ...studentAndScoreDetails
        }
        records {
          edges {
            node {
              id
              date
              questionNum
              score
            }
          }
        }
      }
    }
  }

  fragment transitionAssessmentInfo on VbmappGet4ReportPayload {
    data {
      total
      details {
        masterRecord {
          ...studentAndScoreDetails
        }
        records {
          edges {
            node {
              id
              date
              questionNum
              score
            }
          }
        }
      }
    }
  }

  fragment taskAnalysisInfo on VbmappGet4ReportPayload {
    data {
      total
      details {
        masterRecord {
          ...studentAndScoreDetails
        }
        records {
          edges {
            node {
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
      }
    }
  }

  mutation(
    $milestonesArea: ID!
    $barriersArea: ID!
    $transitionAssessmentArea: ID!
    $taskAnalysisArea: ID!
    $assessmentId: ID!
  ) {
    milestones: vbmappGet4Report(input: { master: $assessmentId, area: $milestonesArea }) {
      ...milestoneInfo
    }
    barriers: vbmappGet4Report(input: { master: $assessmentId, area: $barriersArea }) {
      ...barrierInfo
    }
    transitionAssessment: vbmappGet4Report(
      input: { master: $assessmentId, area: $transitionAssessmentArea }
    ) {
      ...transitionAssessmentInfo
    }
    taskAnalysis: vbmappGet4Report(input: { master: $assessmentId, area: $taskAnalysisArea }) {
      ...taskAnalysisInfo
    }
  }
`

export const GET_VBMAPP_AREAS = gql`
  {
    vbmappAreas {
      id
      areaName
    }
  }
`

export const GET_VBMAPP_ASSESMENTS = gql`
  query vbmappGetAssessments($studentId: ID!) {
    vbmappGetAssessments(student: $studentId) {
      edges {
        node {
          id
          testNo
          date
        }
      }
    }
  }
`
