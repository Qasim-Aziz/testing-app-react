/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const TOILET_DATA = gql`
  query getToiletData($date: Date!, $student: ID!) {
    getToiletData(student: $student, date: $date, success: true) {
      edges {
        node {
          id
          date
          time
          lastWater
          lastWaterTime
          success
          urination
          bowel
          prompted
          urinationRecords {
            edges {
              node {
                id
                time
                status
              }
            }
          }
          reminders {
            edges {
              node {
                id
                time
                frequency {
                  edges {
                    node {
                      name
                    }
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

export const DELETE_TOILET = gql`
  mutation($id: ID!) {
    deleteToiletdata(input: { pk: $id }) {
      clientMutationId
    }
  }
`

export const UPDATE_TOILET = gql`
  mutation(
    $id: ID!
    $date: Date!
    $time: String!
    $waterIntake: String
    $waterIntakeTime: String!
    $urination: Boolean!
    $bowel: Boolean!
    $prompted: Boolean!
    $remainders: [RemaindersInput]
    $urinationRecord: [UrinationRecordsInput]
    $deleteUrinationRecord: [DeleteUrinationRecordsInput]
  ) {
    updateToiletdata(
      input: {
        pk: $id
        toiletData: {
          date: $date
          time: $time
          lastWater: $waterIntake
          lastWaterTime: $waterIntakeTime
          urination: $urination
          bowel: $bowel
          prompted: $prompted
        }
        remainders: $remainders
        urinationRecord: $urinationRecord
        deleteUrinationRecord: $deleteUrinationRecord
      }
    ) {
      details {
        id
      }
    }
  }
`
