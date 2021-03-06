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

export const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
      lastname
    }
  }
`

export const GET_GENERAL_DATA = gql`
  query($student: ID) {
    getGeneralData(student: $student) {
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
          note
          submodule {
            id
            name
          }
        }
      }
    }
  }
`

export const RECORD_GENERAL_DATA = gql`
  mutation($student: ID!, $module: ID!, $submodule: ID, $score: Int!, $note: String) {
    recordGeneralData(
      input: {
        student: $student
        module: $module
        submodule: $submodule
        score: $score
        note: $note
      }
    ) {
      details {
        id
        score
        time
        note
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

export const UPDATE_GENERAL_DATA = gql`
  mutation($pk: ID!, $module: ID, $submodule: ID, $score: Int, $note: String) {
    updateGeneralData(
      input: { pk: $pk, module: $module, submodule: $submodule, score: $score, note: $note }
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
  mutation($pk: ID!) {
    deleteGeneralData(input: { pk: $pk }) {
      status
      msg
    }
  }
`
