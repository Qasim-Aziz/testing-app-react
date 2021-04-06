// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getPrescriptionFunc(payload) {
  console.log('THE PAYLOAD IS --------------------->', payload)
  const idVal = payload.value
  return apolloClient
    .query({
      query: gql`
        query getPrescriptionsDef($student: ID) {
          getPrescriptions(student: $student) {
            edges {
              node {
                id
                height
                weight
                temperature
                headCircumference
                advice
                nextVisit
                nextVisitDate
                testDate
                createddate
                createdby {
                  id
                  username
                }
                student {
                  id
                  firstname
                  lastname
                }
                complaints {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }

                diagnosis {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }

                tests {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                medicineItems {
                  edges {
                    node {
                      id
                      name
                      medicineType
                      dosage
                      unit
                      when
                      frequency
                      duration
                      qty
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        student: idVal,
      },
    })
    .then(result => result)
    .catch(error => {
      console.log('THE ERROR💣💣💣🔥🔥', JSON.stringify(error))
      error.graphQLErrors.map(item => {
        console.log('THE ERROR💣💣💣🔥🔥', item)
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}

export async function createPrescriptionFunc(payload) {
  return apolloClient
    .query({
      query: gql`
        mutation createInvoiceMethod(
          $student: ID! #"U3R1ZGVudFR5cGU6NjQ4"
          $height: String # "175 cm"
          $weight: String # "64 kg"
          $temperature: String # "98.6 F"
          $headCircumference: String # "50 cm"
          $advice: String # "Test Advice"
          $nextVisit: String # "2 Days"
          $nextVisitDate: Date # "2021-04-01"
          $testDate: Date # "2021-04-01"
          $complaints: [ID]
          $diagnosis: [ID]
          $tests: [ID]
          $medicineItems: [MedicineItemsInput]
        ) {
          createPrescription(
            input: {
              student: $student # simple id field
              height: $height
              weight: $weight
              temperature: $temperature
              headCircumference: $headCircumference
              advice: $advice
              nextVisit: $nextVisit
              nextVisitDate: $nextVisitDate
              testDate: $testDate
              complaints: $complaints # array of ids
              diagnosis: $diagnosis # array of ids
              tests: $tests # array of ids
              medicineItems: $medicineItems # array of objects
            }
          ) {
            details {
              id
              height
              weight
              temperature
              headCircumference
              advice
              nextVisit
              nextVisitDate
              testDate
              createddate
              createdby {
                id
                username
              }
              student {
                id
                firstname
              }
              complaints {
                edges {
                  node {
                    id
                    name
                  }
                }
              }

              diagnosis {
                edges {
                  node {
                    id
                    name
                  }
                }
              }

              tests {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              medicineItems {
                edges {
                  node {
                    id
                    name
                    medicineType
                    dosage
                    unit
                    when
                    frequency
                    duration
                    qty
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        student: payload.values.student,
        height: payload.values.height,
        weight: payload.values.weight,
        temperature: payload.values.temperature,
        headCircumference: payload.values.headCircumference,
        advice: payload.values.advice,
        nextVisit: payload.values.nextVisit,
        nextVisitDate: payload.values.nextVisitDate,
        testDate: payload.values.testDate,
        complaints: payload.values.complaints,
        diagnosis: payload.values.diagnosis,
        tests: payload.values.tests,
        medicineItems: payload.values.medicineItems,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}
