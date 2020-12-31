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
