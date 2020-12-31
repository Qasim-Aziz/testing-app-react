import gql from 'graphql-tag'

/* eslint-disable import/prefer-default-export */
export const MEDICAL_DATA = gql`
  query getMedication($date: Date!, $student: ID!) {
    getMedication(student: $student, date: $date) {
      edges {
        node {
          id
          condition
          startDate
          endDate
          note
          duration
          severity {
            name
          }
        }
      }
    }
  }
`

export const DELETE_MEDICAL = gql`
  mutation($id: ID!) {
    deleteMedical(input: { pk: $id }) {
      status
    }
  }
`

export const UPDATE_MEDICAL = gql`
  mutation(
    $id: ID!
    $date: Date!
    $condition: String!
    $startDate: Date!
    $endDate: Date!
    $note: String
    $severity: ID!
    $drug: [DrugInput!]!
    $remainder: [RemainderInput!]!
  ) {
    updateMedical(
      input: {
        pk: $id
        date: $date
        condition: $condition
        startDate: $startDate
        endDate: $endDate
        note: $note
        severity: $severity
        drug: $drug
        remainders: $remainder
      }
    ) {
      details {
        id
        date
        condition
        startDate
        endDate
        note
        duration
        lastObservedDate
      }
    }
  }
`

export const MEDICAL_DETAILS = gql`
  query($id: ID!) {
    getMedicationDetails(id: $id) {
      id
      condition
      startDate
      note
      endDate
      severity {
        id
        name
      }
      remainders {
        edges {
          node {
            id
            time
            frequency {
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
      drug {
        edges {
          node {
            id
            drugName
            dosage
            times
          }
        }
      }
    }
  }
`
