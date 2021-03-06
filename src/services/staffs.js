// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getClinicStaffs() {
  return apolloClient
    .query({
      query: gql`
        query {
          staffs {
            edges {
              node {
                id
                name
                email
                gender
                localAddress
                designation
                empType
                salutation
                qualification
                dateOfJoining
                dob
                surname
                contactNo
                emergencyContact
                emergencyName
                employeeId
                user {
                  id
                  lastLogin
                }
                clinicLocation {
                  id
                  location
                }
                userRole {
                  id
                  name
                }
                isActive
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
        }
      `,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong fetching Staffs',
          description: item.message,
        })
      })
    })
}

export async function getStaffDropdown() {
  return apolloClient
    .query({
      query: gql`
        query {
          userRole {
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
        }
      `,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong fetching staff dropdowns',
          description: item.message,
        })
      })
    })
}

export async function createStaff(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation CreateStaff(
          $empId: String!
          $doj: Date
          $designation: String
          $role: ID!
          $location: ID
          $name: String!
          $lastname: String
          $email: String!
          $gender: String
          $mobile: String
          $address: String
          $dob: Date
          $qualification: String
          $emergencyName: String
          $emergencyContact: String
          $tags: [String]
        ) {
          createStaff(
            input: {
              staffData: {
                empId: $empId
                dateOfJoining: $doj
                designation: $designation
                role: $role
                clinicLocation: $location
                firstname: $name
                surname: $lastname
                email: $email
                gender: $gender
                mobile: $mobile
                address: $address
                dob: $dob
                qualification: $qualification
                emergencyName: $emergencyName
                emergencyContact: $emergencyContact
                authLearner: []
                tags: $tags
              }
            }
          ) {
            staff {
              id
              name
              email
              gender
              localAddress
              designation
              empType
              salutation
              qualification
              dateOfJoining
              dob
              surname
              contactNo
              emergencyContact
              emergencyName
              employeeId
              clinicLocation {
                id
                location
              }
              userRole {
                id
                name
              }
              isActive
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
        empId: payload.values.staffId,
        doj: payload.values.dateOfJoining
          ? moment(payload.values.dateOfJoining).format('YYYY-MM-DD')
          : null,
        designation: payload.values.designation,
        role: payload.values.role,
        location: payload.values.clinicLocation,
        name: payload.values.firstname,
        lastname: payload.values.lastname,
        email: payload.values.email,
        gender: payload.values.gender,
        mobile: payload.values.contactNumber,
        address: payload.values.address,
        dob: moment(payload.values.dob).format('YYYY-MM-DD'),
        qualification: payload.values.qualification,
        emergencyName: payload.values.emergencyName,
        emergencyContact: payload.values.emergencyContactNumber,
        tags: payload.values.tags,
      },
    })
    .then(result => {
      console.log('MY RESU', result)
      return result
    })
    .catch(err => {
      err.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}

export async function updateStaff(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation UpdateStaff (
        $location: ID,
        $doj: Date,
        $tags: [String]
      ) {
        updateStaff(input:{
          staffData:{
            id:"${payload.id}", 
            empId:"${payload.values.staffId}",
            designation:"${payload.values.designation}",
            role:"${payload.values.role}",
            email:"${payload.values.email}",
            firstname:"${payload.values.firstname}",
            surname:"${payload.values.lastname}",
            gender:"${payload.values.gender}",
            mobile:"${payload.values.contactNumber}",
            address:"${payload.values.address}",
            dob:"${payload.values.dob._d.toISOString().slice(0, 10)}",
            emergencyName:"${payload.values.emergencyName}",
            ssnAadhar:"", 
            qualification:"${payload.values.qualification}",
            salutation:"", 
            emergencyContact:"${payload.values.emergencyContactNumber}",
            shiftStart:"", 
            shiftEnd:"", 
            taxId:"", 
            npi:"", 
            duration:"", 
            dateOfJoining: $doj,
            clinicLocation: $location,
            tags: $tags
          }
        })
        { 
          staff {
            id
            name
            email
            gender
            localAddress
            designation
            empType
            salutation
            qualification
            dateOfJoining
            dob
            surname
            contactNo
            emergencyContact
            emergencyName
            employeeId
            clinicLocation {
              id
              location
            }
            userRole {
              id
              name
            }
            isActive
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
      }`,
      variables: {
        location: payload.values.clinicLocation,
        doj: payload.values.dateOfJoining
          ? moment(payload.values.dateOfJoining).format('YYYY-MM-DD')
          : null,
        tags: payload.values.tags,
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

export async function staffActiveInactive(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
        updateStaff(input:{
          staffData:{
            id:"${payload.id}", 
            isActive: ${payload.checked}
          }
        })
        { 
          staff {
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
