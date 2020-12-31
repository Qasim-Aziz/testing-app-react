import gql from 'graphql-tag'

export const UPDATE_ABC = gql`
  mutation(
    $id: ID!
    $studentId: ID!
    $date: Date!
    $frequency: Int!
    $time: String!
    $intensity: String!
    $response: String!
    $function: String!
    $behaviors: [ID!]!
    $consequences: [ID!]!
    $antecedents: [ID!]!
    $environment: ID
    $note: String
  ) {
    updateAbcdata(
      input: {
        pk: $id
        abcData: {
          studentId: $studentId
          date: $date
          target: 100
          frequency: $frequency
          time: $time
          Intensiy: $intensity
          response: $response
          Duration: "10:05"
          Notes: $note
          function: $function
          behaviors: $behaviors
          consequences: $consequences
          antecedents: $antecedents
          environments: $environment
        }
      }
    ) {
      details {
        id
        date
        target
        frequency
        time
        Intensiy
        response
        Duration
        Notes
        function
        behavior {
          edges {
            node {
              id
              behaviorName
            }
          }
        }
        consequences {
          edges {
            node {
              id
              consequenceName
            }
          }
        }
        antecedent {
          edges {
            node {
              id
              antecedentName
            }
          }
        }
        environments {
          id
          name
        }
      }
    }
  }
`

export const ABC = gql`
  query getABC($studentId: ID!, $date: Date!) {
    getABC(studentId: $studentId, date: $date) {
      edges {
        node {
          id
          date
          target
          frequency
          time
          Intensiy
          response
          Duration
          Notes
          function
          behavior {
            edges {
              node {
                id
                behaviorName
              }
            }
          }
          consequences {
            edges {
              node {
                id
                consequenceName
              }
            }
          }
          antecedent {
            edges {
              node {
                id
                antecedentName
              }
            }
          }
          environments {
            id
            name
          }
        }
      }
    }
  }
`

export const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
    }
  }
`
export const CREATE_ABC = gql`
  mutation recordAbcdata(
    $studentId: ID!
    $date: Date!
    $frequency: Int!
    $time: String!
    $intensity: String!
    $response: String!
    $function: String!
    $behaviors: [ID!]!
    $consequences: [ID!]!
    $antecedents: [ID!]!
    $environment: ID
    $note: String
  ) {
    recordAbcdata(
      input: {
        abcData: {
          studentId: $studentId
          date: $date
          target: 100
          frequency: $frequency
          time: $time
          Intensiy: $intensity
          response: $response
          Duration: "10:05"
          Notes: $note
          function: $function
          behaviors: $behaviors
          consequences: $consequences
          antecedents: $antecedents
          environments: $environment
        }
      }
    ) {
      details {
        id
        date
        target
        frequency
        time
        Intensiy
        response
        Duration
        Notes
        function
        behavior {
          edges {
            node {
              id
              behaviorName
            }
          }
        }
        consequences {
          edges {
            node {
              id
              consequenceName
            }
          }
        }
        antecedent {
          edges {
            node {
              id
              antecedentName
            }
          }
        }
        environments {
          id
          name
        }
      }
    }
  }
`

export const GET_ATTENDANCE = gql`
  query getAntecedent($studentId: ID!) {
    getAntecedent(studentId: $studentId) {
      edges {
        node {
          id
          antecedentName
        }
      }
    }
  }
`

export const GET_CONSEQUENCES = gql`
  query getConsequences($studentId: ID!) {
    getConsequences(studentId: $studentId) {
      edges {
        node {
          id
          consequenceName
        }
      }
    }
  }
`

export const GET_BEHAVIOR = gql`
  query getBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
          definition
        }
      }
    }
  }
`

export const GET_ENVIRONMENTS = gql`
  query {
    getEnvironment {
      id
      name
      defination
    }
  }
`

export const CREATE_BEHAVIOR = gql`
  mutation createBehaviour($studentId: ID!, $name: String!) {
    createBehaviour(input: { student: $studentId, name: $name, definition: "Test Definition" }) {
      details {
        id
        behaviorName
        definition
      }
    }
  }
`

export const CREATE_ATTENDENCE = gql`
  mutation createAntecedent($studentId: ID!, $name: String!) {
    createAntecedent(input: { student: $studentId, name: $name }) {
      details {
        id
        antecedentName
      }
    }
  }
`

export const CREATE_CONSIQUENCE = gql`
  mutation createConsequence($studentId: ID!, $name: String!) {
    createConsequence(input: { student: $studentId, name: $name }) {
      details {
        id
        consequenceName
      }
    }
  }
`
