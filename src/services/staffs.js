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
                designation
                dob
                surname
                contactNo
                user {
                  id
                  lastLogin
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
        $id: ID
        $empId:String
        $designation: String
        $role: ID
        $email: ID
        $firstname: String
        $surname: String
        $gender: String
        $mobile: String
        $address: String
        $dob: Date
        $authLearner: [ID]
        $ssnAadhar: String
        $qualification: String
        $salutation: String
        $emergencyName: String
        $emergencyContact: String
        $shiftStart: String
        $shiftEnd: String
        $taxId: String
        $npi: String
        $maritalStatus: String
        $workExp: String
        $dateOfJoining: Date
        $clinicLocation: ID
        $isActive: Boolean
        $streetAddress: String
        $city: String
        $state: String
        $country: String
        $zipCode: String
        $tags: [String]
      ) {
        updateStaff(input:{
          staffData:{
            id: $id
            empId: $empId
            designation: $designation
            $role: $role
            email: $email
            firstname: $firstname
            surname: $surname
            gender: $gender
            mobile: $mobile
            address: $address
            dob: $dob
            authLearner: $authLearner
            ssnAddhar: $ssnAadhar
            qualification: $qualification
            salutation: $salutation
            emergencyName: $emergencyName
            shiftStart: $shiftStart
            shiftEnd: $shiftEnd
            taxId: $raxId
            noi: $npi
            maritalStatus: $maritalStatus
            workExp: $workExp
            dateOfJoining: $dateOfJoining
            clinicLocation: $clinicLocation
            isActive: $isActive
            streetAddress: $streetAddress
            city: $city
            state: $state
            country: $country
            zipCode: $zipCode
            tags: $tags
          }
        })
        { 
          staff {
            id
            employeeId
            staffId
            name
            surname
            fatherName
            motherName
            contactNo
            email
            gender
            dob
            dateOfJoining
            localAddress
            qualification
            designation
            emergencyName
            emergencyContact
            emergencyRelation
            maritalStatus
            workExp
            image
            resume
            joiningLetter
            fileName
            fileDescription
            isActive
            school {
              id
              schoolName
            }
            empType
            shiftStart
            shiftEnd
            ssnAadhar
            taxId
            npi
            streetAddress
            city
            state
            country
            zipCode
            salutation
            clinicLocation {
              id
              location
            }
            attendanceSet{
              edges {
                node {
                  id
                  checkIn
                  checkOut
                }
              }
            }
            userRole {
              id
              name
            }
            shift {
              id
              startTime
              endTime
              days {
               edges {
                 node {
                   id
                   name
                 }
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
      }`,
      variables: {
        ...payload.values,
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

export async function getStaffProfile(payload) {
  console.log(payload, 'oajdfvvkj')
  return apolloClient
    .query({
      query: gql`
        query($id: ID!) {
          staff(id: $id) {
            id
            employeeId
            name
            surname
            fatherName
            motherName
            contactNo
            email
            gender
            dob
            dateOfJoining
            localAddress
            qualification
            designation
            emergencyName
            emergencyContact
            emergencyRelation
            maritalStatus
            workExp
            image
            resume
            joiningLetter
            fileName
            fileDescription
            isActive
            school {
              id
              schoolName
            }
            empType
            shiftStart
            shiftEnd
            ssnAadhar
            taxId
            npi
            streetAddress
            city
            state
            country
            zipCode
            salutation
            clinicLocation {
              id
              location
            }
            attendanceSet {
              edges {
                node {
                  id
                  checkIn
                  checkOut
                }
              }
            }
            userRole {
              id
              name
            }
            user {
              id
              lastLogin
            }
            shift {
              id
              startTime
              endTime
              days {
                edges {
                  node {
                    id
                    name
                  }
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
    .then(response => response)
    .catch(error => {
      console.log(error)
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch staff profile data',
      })
    })
}
