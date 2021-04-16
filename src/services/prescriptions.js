// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable */

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

export async function getLatestPrescription(payload) {
  console.log('THE PAYLOAD IS --------------------->', payload)
  const idVal = payload.value
  return apolloClient
    .query({
      query: gql`
        query getLatestPrescriptionDef($student: ID) {
          getPrescriptions(student: $student, last: 1) {
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
  console.log('THE VALUE IN THE PAYLOAD 👉👉', payload)
  let array_of_meds = []
  let i
  for (i = 0; i < payload.data.length; i++) {
    let x = payload.data[i]
    console.log('THE ARRAY', payload.data[i])
    console.log('THE XXX', x)
    delete x.key
    delete x.rate
    delete x.note
    console.log('THE XXX', x)
    if (x.qty === null) {
      delete x.qty
    }
    array_of_meds.push(x)
  }
  console.log('THE array-of-meds ========================>', array_of_meds)
  return apolloClient
    .mutate({
      mutation: gql`
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
        student: payload.id,
        height: payload.values.height,
        weight: payload.values.weight,
        temperature: payload.values.temperature,
        headCircumference: payload.values.headCircumference,
        advice: payload.values.advice ? payload.values.advice : '',
        nextVisit:
          payload.values.nextVisitNumber && payload.values.nextVisitVal
            ? `${payload.values.nextVisitNumber} ${payload.values.nextVisitVal}`
            : '',
        //this has to be date with correct format
        nextVisitDate: payload.values.nextVisitDate
          ? moment(payload.values.nextVisitDate).format('YYYY-MM-DD')
          : null,
        //this has to be data with correct format
        testDate: payload.values.testDate
          ? moment(payload.values.testDate).format('YYYY-MM-DD')
          : null,
        complaints: payload.values.complaints ? payload.values.complaints : [],
        diagnosis: payload.values.diagnosis ? payload.values.diagnosis : [],
        tests: payload.values.tests ? payload.values.tests : [],
        medicineItems: array_of_meds,
      },
    })
    .then(result => result)
    .catch(error => {
      console.log('THE ERROR', JSON.stringify(error))
      if (error.graphQLError) {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Something went wrong',
            description: item.message,
          })
        })
      } else {
        return notification.error({
          message: `Something went wrong`,
          description: `${error}`,
        })
      }
    })
}

export async function getDetailPrescription(payload) {
  console.log('THE VALUE IN THE PAYLOAD ---------------------> ', payload)
  // ID OF A PARTICULAR PRESCRIPTION
  const idVal = payload.value
  return apolloClient
    .query({
      query: gql`
        query getDetailPrescriptionDef($id: ID!) {
          getPrescriptionDetail(id: $id) {
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
      `,
      variables: {
        id: idVal, // "UHJlc2NyaXB0aW9uVHlwZTox"
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

export async function editAndSavePrescription(payload) {
  console.log('THE VALUE 🌟EDIT🌟 IN THE PAYLOAD', payload)
  let array_of_meds = []
  let i
  for (i = 0; i < payload.data.length; i++) {
    let x = payload.data[i]
    delete x.key
    delete x.rate
    delete x.note
    delete x.id
    if (x.qty === null) {
      delete x.qty
    }
    array_of_meds.push(x)
  }
  console.log('THE array-of-meds ========================>', array_of_meds)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation updatePrescriptionMethod(
          $pk: ID! #"U3R1ZGVudFR5cGU6NjQ4"
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
          $removeMedicineItems: [ID]
          $removeTests: [ID]
          $removeDiagnosis: [ID]
          $removeComplaints: [ID]
        ) {
          updatePrescription(
            input: {
              pk: $pk # simple id field
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
              removeMedicineItems: $removeMedicineItems
              removeTests: $removeTests
              removeDiagnosis: $removeDiagnosis
              removeComplaints: $removeComplaints
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
        pk: payload.id,
        height: payload.values.height,
        weight: payload.values.weight,
        temperature: payload.values.temperature,
        headCircumference: payload.values.headCircumference,
        advice: payload.values.advice ? payload.values.advice : '',
        nextVisit:
          payload.values.nextVisitNumber && payload.values.nextVisitVal
            ? `${payload.values.nextVisitNumber} ${payload.values.nextVisitVal}`
            : '',
        //this has to be date with correct format
        nextVisitDate: payload.values.nextVisitDate
          ? moment(payload.values.nextVisitDate).format('YYYY-MM-DD')
          : null,
        //this has to be data with correct format
        testDate: payload.values.testDate
          ? moment(payload.values.testDate).format('YYYY-MM-DD')
          : null,
        complaints: payload.values.complaints ? payload.values.complaints : [],
        diagnosis: payload.values.diagnosis ? payload.values.diagnosis : [],
        tests: payload.values.tests ? payload.values.tests : [],
        medicineItems: array_of_meds,
        removeMedicineItems: payload.deletionVals.deleteMedItems,
        removeTests: payload.deletionVals.deleteTestsList,
        removeDiagnosis: payload.deletionVals.deleteDiagnosisList,
        removeComplaints: payload.deletionVals.deleteComplaintList,
      },
    })
    .then(result => result)
    .catch(error => {
      console.log('THE ERROR 🔴🔴🔴🔴🔴', JSON.stringify(error))
      if (error.graphQLError) {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Something went wrong',
            description: item.message,
          })
        })
      }
      // else {
      //   return notification.error({
      //     message: `Something went wrong`,
      //     description: `${error}`,
      //   })
      // }
    })
}

export async function deletePrescription(payload) {
  console.log('THE PAYLOAD FOR DELETE', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation deletePrescriptionMethod($pk: ID!) {
          deletePrescription(input: { pk: $pk }) {
            status
            msg
          }
        }
      `,
      variables: {
        pk: payload.value,
      },
    })
    .then(result => result)
    .catch(error => {
      console.log('THE ERROR 🔴🔴🔴🔴🔴', JSON.stringify(error))
      if (error.graphQLError) {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Something went wrong',
            description: item.message,
          })
        })
      } else {
        return notification.error({
          message: `Something went wrong`,
          description: `${error}`,
        })
      }
    })
}
