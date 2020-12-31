// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getClinicLearners(payload) {
  return apolloClient
    .query({
      query: gql`
        query getLearners(
          $isActive: Boolean
          $first: Int
          $last: Int
          $after: String
          $before: String
        ) {
          students(isActive: $isActive, first: $first, last: $last, after: $after, before: $before) {
            pageInfo{
              startCursor
              endCursor
            }
            clinicTotal
            edges {
              node {
                id
                firstname
                email
                dob
                mobileno
                lastname
                gender
                currentAddress
                clientId
                ssnAadhar
                parentMobile
                parentName
                dateOfDiagnosis
                category {
                  id
                  category
                }
                clinicLocation {
                  id
                  location
                }
                caseManager {
                  id
                  name
                }
                language {
                  id
                  name
                }
                authStaff {
                  edges {
                    node {
                      id
                      name
                      surname
                    }
                  }
                }
                isActive
              }
            }
          }
        }
      `,
      variables: {
        isActive: payload.isActive,
        first: payload.first,
        after: payload.after,
        before: payload.before,
        last: payload.last ? payload.last : null 
      },
      fetchPolicy: 'network-only'
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function getLearnersDropdown() {
  return apolloClient
    .query({
      query: gql`
        query {
          category {
            id
            category
          }
          languages {
            id
            name
          }
          schoolLocation {
            edges {
              node {
                id
                location
              }
            }
          }
          staffs(isActive: true) {
            edges {
              node {
                id
                name
                surname
              }
            }
          }
        }
      `,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function updateLearner(payload) {
  const authStaffList = []
  if (payload.values.authStaff.length > 0) {
    payload.values.authStaff.map(item => authStaffList.push(`"${item}"`))
  }

  // let date = ''
  // if (payload.values.dateOfDiagnosis){
  //   date = moment(payload.values.dateOfDiagnosis).format('YYYY-MM-DD')
  // }

  return apolloClient
    .mutate({
      mutation: gql`
        mutation UpdateStudent(
          $id: ID!
          $clientId: String!
          $category: ID!
          $email: String!
          $gender: String!
          $dob: Date!
          $dateOfDiagnosis: Date
          $clinicLocation: ID
          $firstName: String!
          $lastName: String
          $authStaffList: [ID]
          $parentFirstName: String!
          $parentMobileNumber: String
          $ssnCard: String
          $mobileNo: String
          $address: String
          $caseManager: ID
          $learnerLanguage: ID
          $isActive: Boolean
        ) {
          updateStudent(
            input: {
              studentData: {
                id: $id
                clientId: $clientId
                category: $category
                email: $email
                gender: $gender
                dob: $dob
                dateOfDiagnosis: $dateOfDiagnosis
                clinicLocation: $clinicLocation
                caseManager: $caseManager
                firstname: $firstName
                lastname: $lastName
                authStaff: $authStaffList
                parentName: $parentFirstName
                parentMobile: $parentMobileNumber
                ssnAadhar: $ssnCard
                mobileno: $mobileNo
                address: $address
                language: $learnerLanguage
                isActive: $isActive
              }
            }
          ) {
            student {
              id
              firstname
              email
              dob
              mobileno
              lastname
              gender
              currentAddress
              clientId
              ssnAadhar
              parentMobile
              parentName
              dateOfDiagnosis
              category {
                id
                category
              }
              clinicLocation {
                id
                location
              }
              caseManager {
                id
                name
              }
              language {
                id
                name
              }
              authStaff {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              isActive
            }
          }
        }
      `,
      variables: {
        id: payload.id,
        clientId: payload.values.clientId,
        category: payload.values.category,
        email: payload.values.email,
        gender: payload.values.gender,
        dob: moment(payload.values.dob).format('YYYY-MM-DD'),
        dateOfDiagnosis: payload.values.dateOfDiagnosis
          ? moment(payload.values.dob).format('YYYY-MM-DD')
          : null,
        clinicLocation: payload.values.clinicLocation,
        firstName: payload.values.firstName,
        lastName: payload.values.lastName,
        authStaffList: payload.values.authStaff ? payload.values.authStaff : [],
        parentFirstName: payload.values.parentFirstName,
        parentMobileNumber: payload.values.parentMobileNumber,
        ssnCard: payload.values.ssnCard,
        mobileNo: payload.values.mobileNo,
        address: payload.values.address,
        caseManager: payload.values.caseManager,
        learnerLanguage: payload.values.learnerLanguage,
        isActive: payload.values.isActive,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function createLearner(payload) {
  // const authStaffList = []
  // if (payload.values.authStaff.length > 0) {
  //   payload.values.authStaff.map(item => authStaffList.push(`"${item}"`))
  // }
  console.log(payload.values)
  console.log(payload.data)
  console.log(payload.data.get('file'))
  return apolloClient
    .mutate({
      mutation: gql`
        mutation CreateLearner(
          $clientId: String!
          $category: ID!
          $email: String!
          $gender: String!
          $dob: Date!
          $dateOfDiagnosis: Date
          $clinicLocation: ID
          $firstName: String!
          $lastName: String
          $authStaffList: [ID]
          $parentFirstName: String!
          $parentMobileNumber: String
          $ssnCard: String
          $mobileNo: String
          $address: String
          $caseManager: ID
          $isActive: Boolean
          $defaultProgram: Boolean
          $learnerLanguage: ID
        ) {
          createStudent(
            input: {
              studentData: {
                clientId: $clientId
                category: $category
                email: $email
                gender: $gender
                dob: $dob
                dateOfDiagnosis: $dateOfDiagnosis
                clinicLocation: $clinicLocation
                firstname: $firstName
                lastname: $lastName
                authStaff: $authStaffList
                parentName: $parentFirstName
                parentMobile: $parentMobileNumber
                ssnAadhar: $ssnCard
                mobileno: $mobileNo
                address: $address
                caseManager: $caseManager
                isActive: $isActive
                defaultProgram: $defaultProgram
                language: $learnerLanguage
              }
            }
          ) {
            student {
              id
              firstname
              email
              dob
              mobileno
              lastname
              gender
              currentAddress
              clientId
              ssnAadhar
              parentMobile
              parentName
              dateOfDiagnosis
              category {
                id
                category
              }
              clinicLocation {
                id
                location
              }
              caseManager {
                id
                name
              }
              language {
                id
                name
              }
              authStaff {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              isActive
            }
          }
        }
      `,
      variables: {
        clientId: payload.values.clientId,
        category: payload.values.category,
        email: payload.values.email,
        gender: payload.values.gender,
        dob: moment(payload.values.dob).format('YYYY-MM-DD'),
        dateOfDiagnosis: payload.values.dateOfDiagnosis
          ? moment(payload.values.dob).format('YYYY-MM-DD')
          : null,
        clinicLocation: payload.values.clinicLocation,
        firstName: payload.values.firstName,
        lastName: payload.values.lastName,
        authStaffList: payload.values.authStaff ? payload.values.authStaff : [],
        parentFirstName: payload.values.parentFirstName,
        parentMobileNumber: payload.values.parentMobileNumber,
        ssnCard: payload.values.ssnCard,
        mobileNo: payload.values.mobileNo,
        address: payload.values.address,
        caseManager: payload.values.caseManager,
        learnerLanguage: payload.values.learnerLanguage,
        isActive: payload.values.isActive,
        defaultProgram: payload.values.defaultProgram,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}

export async function createLearnersProgram(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation CreateLearnersProgram($id: ID!, $program: String!) {
          createProgramsByLevel(input: { pk: $id, level: $program }) {
            status
            msg
          }
        }
      `,
      variables: {
        id: payload.id,
        program: payload.program,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong creating program',
          description: item.message,
        })
      })
    })
}

export async function learnerActiveInactive(payload) {
  console.log(payload)
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateStudent(input:{
                studentData:{
                    id:"${payload.id}",
                    isActive: ${payload.checked}
                }
            })
            {
                student {
                    id,
                    isActive

                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}
