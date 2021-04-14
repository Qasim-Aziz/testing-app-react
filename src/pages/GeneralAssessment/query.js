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
          time
          student {
            id
            firstname
          }
          modules {
            edges {
              node {
                id
                score
                module {
                  name
                  id
                }
              }
            }
          }
          note
          submodules {
            edges {
              node {
                id
                score
                submodule {
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
`

export const RECORD_GENERAL_DATA = gql`
  mutation(
    $student: ID!
    $date: Date
    $modules: [ModuleInput2]
    $submodules: [SubModuleInput2]
    $note: String
  ) {
    recordGeneralData(
      input: {
        student: $student
        date: $date
        modules: $modules
        submodules: $submodules
        note: $note
      }
    ) {
      details {
        id
        time
        student {
          id
          firstname
        }
        modules {
          edges {
            node {
              id
              score
              module {
                name
                id
              }
            }
          }
        }
        note
        submodules {
          edges {
            node {
              id
              score
              submodule {
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

export const UPDATE_GENERAL_DATA = gql`
  mutation(
    $clearAll: Boolean
    $pk: ID!
    $date: Date
    $modules: [ModuleInput2]
    $submodules: [SubModuleInput2]
    $note: String
  ) {
    updateGeneralData(
      input: {
        clearAll: $clearAll
        pk: $pk
        modules: $modules
        submodules: $submodules
        note: $note
        date: $date
      }
    ) {
      details {
        id
        time
        student {
          id
          firstname
        }
        modules {
          edges {
            node {
              id
              score
              module {
                name
                id
              }
            }
          }
        }
        note
        submodules {
          edges {
            node {
              id
              score
              submodule {
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

export const DELETE_GENERAL_DATA = gql`
  mutation($pk: ID!) {
    deleteGeneralData(input: { pk: $pk }) {
      status
      msg
    }
  }
`

export const REMOVE_SUBMODULE = gql`
  mutation($pk: ID!, $id: [ID]) {
    updateGeneralAssessment(input: { pk: $pk, removeSubmodules: $id }) {
      details {
        id
      }
    }
  }
`
