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
          students(
            isActive: $isActive
            first: $first
            last: $last
            after: $after
            before: $before
          ) {
            clinicTotal
            edges {
              node {
                id
                firstname
                email
                parent {
                  id
                  lastLogin
                }
                mobileno
                lastname
                gender
                parentMobile
                category {
                  id
                  category
                }
                caseManager {
                  id
                  name
                }
                tags {
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
        }
      `,
      variables: {
        isActive: payload.isActive,
        first: payload.first > 100 ? null : payload.first,
        after: payload.after,
        before: payload.before,
        last: payload.last ? payload.last : null,
      },
      fetchPolicy: 'network-only',
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
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}

export async function updateLearner(payload) {
  const authStaffList = []
  console.log(payload, 'this is palylos in ei')
  if (payload.values.authStaff.length > 0) {
    payload.values.authStaff.map(item => authStaffList.push(`"${item}"`))
  }

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
          $parentFirstName: String
          $parentMobileNumber: String
          $ssnCard: String
          $mobileNo: String
          $address: String
          $streetAddress: String
          $state: String
          $city: String
          $country: String
          $zipCode: String
          $caseManager: ID
          $learnerLanguage: ID
          $isActive: Boolean
          $researchParticipant: Boolean
          $tags: [String]
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
                streetAddress: $streetAddress
                city: $city
                state: $state
                country: $country
                zipCode: $zipCode
                language: $learnerLanguage
                isActive: $isActive
                researchParticipant: $researchParticipant
                tags: $tags
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
              diagnoses {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              learnermedicationSet {
                edges {
                  node {
                    id
                    date
                    condition
                  }
                }
              }
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
              tags {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              isActive
              researchParticipant
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
        researchParticipant: payload.values.researchParticipant,
        tags: payload.values.tags,
        streetAddress: payload.values.street,
        state: payload.values.state,
        country: payload.values.country,
        city: payload.values.city,
        zipCode: payload.values.pincode,
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

export async function updateGeneralInfo(payload) {
  console.log(payload, 'this is palylos in ei')

  return apolloClient
    .mutate({
      mutation: gql`
        mutation UpdateStudent(
          $id: ID!
          $clientId: String!
          $email: String!
          $gender: String!
          $dob: Date!
          $firstName: String!
          $lastName: String
          $mobileNo: String
          $streetAddress: String
          $state: String
          $city: String
          $country: String
          $zipCode: String
          $tags: [String]
        ) {
          updateStudent(
            input: {
              studentData: {
                id: $id
                clientId: $clientId
                email: $email
                gender: $gender
                dob: $dob
                firstname: $firstName
                lastname: $lastName
                mobileno: $mobileNo
                streetAddress: $streetAddress
                city: $city
                state: $state
                country: $country
                zipCode: $zipCode
                tags: $tags
              }
            }
          ) {
            student {
              id
              admissionNo
              internalNo
              school {
                id
                schoolName
              }
              parent {
                id
                lastLogin
              }
              admissionDate
              firstname
              email
              dob
              image
              file
              report
              createdAt
              fatherName
              fatherPhone
              motherName
              motherPhone
              isActive
              mobileno
              lastname
              gender
              currentAddress
              streetAddress
              city
              state
              country
              zipCode
              height
              weight
              clientId
              ssnAadhar
              parentMobile
              parentName
              dateOfDiagnosis
              clinicLocation {
                id
                location
              }
              isPeakActive
              isCogActive
              researchParticipant
              diagnoses {
                edges {
                  node {
                    id
                    name
                  }
                }
              }

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
              family {
                id
                members {
                  edges {
                    node {
                      id
                      memberName
                      relationship {
                        id
                        name
                      }
                    }
                  }
                }
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
              tags {
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
      `,
      variables: {
        id: payload.id,
        clientId: payload.values.clientId,
        firstName: payload.values.firstName,
        lastName: payload.values.lastName,
        email: payload.values.email,
        mobileNo: payload.values.mobileNo,
        dob: moment(payload.values.dob).format('YYYY-MM-DD'),
        gender: payload.values.gender,
        tags: payload.values.tags,
        streetAddress: payload.values.street,
        state: payload.values.state,
        country: payload.values.country,
        city: payload.values.city,
        zipCode: payload.values.pincode,
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

export async function createLearner(payload) {
  // const authStaffList = []
  // if (payload.values.authStaff.length > 0) {
  //   payload.values.authStaff.map(item => authStaffList.push(`"${item}"`))
  // }
  console.log(payload.values, 'payload values are')
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
          $parentFirstName: String
          $parentMobileNumber: String
          $ssnCard: String
          $mobileNo: String
          $address: String
          $caseManager: ID
          $isActive: Boolean
          $defaultProgram: Boolean
          $learnerLanguage: ID
          $researchParticipant: Boolean
          $streetAddress: String
          $state: String
          $city: String
          $country: String
          $zipCode: String
          $tags: [String]
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
                researchParticipant: $researchParticipant
                streetAddress: $streetAddress
                city: $city
                state: $state
                country: $country
                zipCode: $zipCode
                tags: $tags
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
              diagnoses {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              learnermedicationSet {
                edges {
                  node {
                    id
                    date
                    condition
                  }
                }
              }
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
              tags {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              isActive
              researchParticipant
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
        researchParticipant: payload.values.researchParticipant,
        tags: payload.values.tags,
        streetAddress: payload.values.street,
        state: payload.values.state,
        country: payload.values.country,
        city: payload.values.city,
        zipCode: payload.values.pincode,
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
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}

export async function getLearner(payload) {
  return apolloClient
    .query({
      query: gql`
        query($id: ID!) {
          student(id: $id) {
            id
            admissionNo
            internalNo
            school {
              id
              schoolName
            }
            parent {
              id
              lastLogin
            }
            admissionDate
            firstname
            email
            dob
            image
            file
            report
            createdAt
            fatherName
            fatherPhone
            motherName
            motherPhone
            isActive
            mobileno
            lastname
            gender
            currentAddress
            streetAddress
            city
            state
            country
            zipCode
            height
            weight
            clientId
            ssnAadhar
            parentMobile
            parentName
            dateOfDiagnosis
            clinicLocation {
              id
              location
            }
            isPeakActive
            isCogActive
            researchParticipant
            diagnoses {
              edges {
                node {
                  id
                  name
                }
              }
            }

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
            family {
              id
              members {
                edges {
                  node {
                    id
                    memberName
                    relationship {
                      id
                      name
                    }
                  }
                }
              }
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
            tags {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      `,
      variables: {
        id: payload.id,
      },
    })
    .then(result => result)
    .catch(err => {
      err.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}
