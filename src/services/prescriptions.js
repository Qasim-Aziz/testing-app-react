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
  console.log('🌟🌟THE PAYLOAD🌟🌟', payload)
  const {
    student,
    height,
    weight,
    temperature,
    headCircumference,
    advice,
    nextVisit,
    nextVisitDate,
    testDate,
    complaints,
    diagnosis,
    tests,
    medicineItems,
  } = payload
  console.log(
    'ALL THE VALUES',
    student,
    height,
    weight,
    temperature,
    headCircumference,
    advice,
    nextVisit,
    nextVisitDate,
    testDate,
    complaints,
    diagnosis,
    tests,
    medicineItems,
  )
  return apolloClient
    .mutate({
      mutation: gql`mutation {
          createPrescription(
            student:"${student}",
            height:"${height}",
            weight:"${weight}",
            temperature:"${temperature}",
            headCircumference:"${headCircumference}",
            advice:"${advice}",
            nextVisit:"${nextVisit}",
            nextVisitDate:"${nextVisitDate}",
            testDate:"${testDate}",
            complaints:"${complaints}",
            diagnosis:"${diagnosis}",
            tests:"${tests}",
            medicineItems:"${medicineItems}"
        )
        {

          details{
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
            createdby{
                id
                username
            }
            student{
                id
                firstname
            }
            complaints{
                edges{
                    node{
                        id
                        name
                    }
                }
            }
            
            diagnosis{
                edges{
                    node{
                        id
                        name
                    }
                }
            }
            
            tests{
                edges{
                    node{
                        id
                        name
                    }
                }
            }
            medicineItems{
                edges{
                    node{
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
}`,
    })
    .then(result => {
      console.log('🌟🌟THE RESULT🌟🌟 ', result)
    })
    .catch(error => {
      console.log('THE ERR', error)
      error.graphQLErrors.map(item => {
        console.log('THE ERROR', item.message)
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}
