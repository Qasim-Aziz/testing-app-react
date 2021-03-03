/* eslint-disable */
import gql from 'graphql-tag'

export const GET_GENERAL_ASSESSMENT = gql`
  query {
    getGeneralAssessment {
      edges {
        node {
          id
          name
          date
          hasSubmodule
          clinic {
            id
            schoolName
          }
          submodules {
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
`
export const CREATE_GENERAL_ASSESSMENT = gql`
  mutation($name: String!, $date: Date!, $hasSubmodule: Boolean!, $submodules: [SubmodulesInput]) {
    createGeneralAssessment(
      input: { name: $name, date: $date, hasSubmodule: $hasSubmodule, submodules: $submodules }
    ) {
      details {
        id
        name
        date
        hasSubmodule
        clinic {
          id
          schoolName
        }
        submodules {
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
`

export const UPDATE_GENERAL_ASSESSMENT = gql`
  mutation(
    $pk: ID!
    $name: String
    $date: Date
    $hasSubmodule: Boolean
    $submodules: [SubmodulesInput]
  ) {
    updateGeneralAssessment(
      input: {
        pk: $pk
        name: $name
        date: $date
        hasSubmodule: $hasSubmodule
        submodules: $submodules
      }
    ) {
      details {
        id
        name
        date
        hasSubmodule
        clinic {
          id
          schoolName
        }
        submodules {
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
`

export const DELETE_GENERAL_ASSESSMENT = gql`
  mutation($pk: ID!) {
    deleteGeneralAssessment(input: { pk: $pk }) {
      status
      msg
    }
  }
`
export const RECORD_GENERAL_DATA = gql`
  mutation {
    recordGeneralData(
      input: {
        student: "U3R1ZGVudFR5cGU6MTYz"
        module: "R2VuZXJhbEFzc2Vzc21lbnRUeXBlOjE="
        submodule: "R2VuZXJhbFN1Yk1vZHVsZXNUeXBlOjE="
        score: 2
      }
    ) {
      details {
        id
        score
        time
        student {
          id
          firstname
        }
        module {
          id
          name
          date
          hasSubmodule
        }
        submodule {
          id
          name
        }
      }
    }
  }
`

export const GET_GENERAL_DATA = gql`
  query {
    getGeneralData(student: "U3R1ZGVudFR5cGU6MTYz", date: "2021-03-01") {
      edges {
        node {
          id
          score
          time
          student {
            id
            firstname
          }
          module {
            id
            name
            date
            hasSubmodule
          }
          submodule {
            id
            name
          }
        }
      }
    }
  }
`

export const UPDATE_GENERAL_DATA = gql`
  mutation {
    updateGeneralData(
      input: {
        pk: "R2VuZXJhbFJlY29yZGluZ1R5cGU6MQ=="
        student: "U3R1ZGVudFR5cGU6MTYz"
        module: "R2VuZXJhbEFzc2Vzc21lbnRUeXBlOjE="
        submodule: "R2VuZXJhbFN1Yk1vZHVsZXNUeXBlOjE="
        score: 2
      }
    ) {
      details {
        id
        score
        time
        student {
          id
          firstname
        }
        module {
          id
          name
          date
          hasSubmodule
        }
        submodule {
          id
          name
        }
      }
    }
  }
`

export const DELETE_GENERAL_DATA = gql`
  mutation {
    deleteGeneralData(input: { pk: "" }) {
      status
      msg
    }
  }
`
