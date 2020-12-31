/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const RESPONSE_RATE = gql`
  query($startDate: Date!, $endDate: Date!, $studentId: ID!, $status: [ID], $type: ID) {
    responseRate(
      studentId: $studentId
      status: $status
      tarType: $type
      dateGte: $startDate
      dateLte: $endDate
    ) {
      targetName
      perTar
      sessionDate
      sessionRecord {
        perSd
        sd
      }
    }
  }
`

export const MAND_DATA = gql`
  query($studentId: ID!, $startDate: Date!, $endDate: Date!) {
    mandReport(studentId: $studentId, startDate: $startDate, endDate: $endDate) {
      id
      measurments
      data {
        date
        count
      }
    }
  }
`

export const GET_STUDENT = gql`
  query($id: ID!) {
    student(id: $id) {
      firstname
      lastname
    }
  }
`

export const MEDICAL_DATA = gql`
  query($start: Date!, $end: Date!) {
    getMedication(date_Gte: $start, date_Lte: $end) {
      edges {
        node {
          id
          severity {
            name
          }
          date
          lastObservedDate
          condition
          startDate
          endDate
          duration
          drug {
            edges {
              node {
                drugName
                dosage
                times
              }
            }
          }
        }
      }
    }
  }
`

export const TOILET_DATA = gql`
  query {
    getToiletData {
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
          reminders {
            edges {
              node {
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
        }
      }
    }
  }
`

export const MEAL_DATA = gql`
  query($type: String, $start: Date!, $end: Date!) {
    getFood(mealType: $type, date_Gte: $start, date_Lte: $end) {
      edges {
        node {
          id
          date
          mealName
          mealTime
          mealType
          servingSize
          calories
          waterIntake
          foodType {
            name
          }
          note
          duration
        }
      }
    }
  }
`

export const FOOD_TYPE = gql`
  query {
    getFoodType {
      id
      name
    }
  }
`

export const RESPONSE_RATE_FILTER_OPT = gql`
  query {
    types {
      id
      typeTar
    }
    targetStatus {
      id
      statusName
    }
  }
`
