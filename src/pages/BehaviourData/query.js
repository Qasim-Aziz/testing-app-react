import gql from 'graphql-tag'

export const DANCLE_STATUS = gql`
  query {
    getDecelStatus {
      id
      statusName
      statusCode
    }
  }
`

export const DANCLE_ENVS = gql`
  query {
    getEnvironment {
      id
      name
      defination
    }
  }
`

export const DANCLE_MEASURMENTS = gql`
  query {
    getBehaviourMeasurings {
      id
      measuringType
      unit
    }
  }
`

export const CREATE_TAMPLET = gql`
  mutation createTemplate(
    $studentId: ID!
    $behaviorId: ID!
    $status: ID!
    $description: String
    $measurments: [ID]
    $envs: [ID]
    $manipulations: String
    $procedures: String
    $remainders: [RemainderInput]
  ) {
    createTemplate(
      input: {
        decelData: {
          student: $studentId
          behavior: $behaviorId
          status: $status
          behaviorDescription: $description
          measurments: $measurments
          environment: $envs
          antecedentManipulations: $manipulations
          reactiveProcedures: $procedures
          remainders: $remainders
        }
      }
    ) {
      details {
        id
        behaviorDef
        behaviorDescription
        reactiveProcedures
        antecedentManipulations
        behavior {
          id
          behaviorName
          definition
        }
        status {
          id
          statusName
        }
        measurments {
          edges {
            node {
              id
            }
          }
        }
        environment {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

export const BEHAVIORS = gql`
  query getBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
        }
      }
    }
  }
`

export const CREATE_BEHAVIOR = gql`
  mutation createBehaviour($studentId: ID!, $name: String!) {
    createBehaviour(input: { student: $studentId, name: $name, definition: "Test Definition" }) {
      details {
        id
        behaviorName
      }
    }
  }
`

export const CREATE_ENVIRONMENT = gql`
  mutation createEnvironment($name: String!, $studentId: ID!) {
    decelEnvironment(
      input: { name: $name, studentId: $studentId, description: "Env description" }
    ) {
      environment {
        id
        name
      }
    }
  }
`

export const RECORD_DATA = gql`
  mutation createDecel($templateId: ID!) {
    createDecel(input: { template: $templateId }) {
      details {
        id
        date
        irt
        note
        duration
        frequency {
          edges {
            node {
              id
              count
              time
            }
          }
        }
        template {
          id
          behaviorDescription
          behavior {
            behaviorName
          }
          status {
            statusName
          }
          environment {
            edges {
              node {
                id
                name
              }
            }
          }
          measurments {
            edges {
              node {
                id
                measuringType
              }
            }
          }
        }
      }
    }
  }
`

export const UPDATE_RECORD = gql`
  mutation updateDecel(
    $id: ID!
    $env: ID!
    $irt: Int
    $intensity: String
    $duration: String!
    $date: Date!
  ) {
    updateDecel(
      input: {
        pk: $id
        environment: $env
        irt: $irt
        intensity: $intensity
        duration: $duration
        date: $date
      }
    ) {
      details {
        id
        irt
        note
        duration
        date
        intensity
        environment {
          id
        }
        frequency {
          edges {
            node {
              id
              count
              time
            }
          }
        }
        template {
          id
          behavior {
            id
            behaviorName
          }
          environment {
            edges {
              node {
                id
                name
              }
            }
          }
          measurments {
            edges {
              node {
                id
                measuringType
              }
            }
          }
        }
        status {
          id
          statusName
        }
      }
    }
  }
`

export const UPDATE_FREQUENCY = gql`
  mutation updateDecelFrequency($id: ID!, $count: Int!, $time: Int!) {
    updateDecelFrequency(input: { pk: $id, count: $count, time: $time }) {
      details {
        frequency {
          edges {
            node {
              id
              count
              time
            }
          }
        }
      }
    }
  }
`

export const GET_BEHAVIOR_CHART_DATA = gql`
  query getDecelData($studentId: ID!, $templateId: ID!) {
    getDecelData(template_Student: $studentId, template: $templateId) {
      edges {
        node {
          id
          date
          duration
          frequency {
            edges {
              node {
                id
                count
                time
              }
            }
          }
          template {
            id
            behavior {
              id
              behaviorName
            }
          }
        }
      }
    }
  }
`
