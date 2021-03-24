/* eslint-disable */
import gql from 'graphql-tag'

export const UPDATE_STAFF = gql`
  mutation(
    $id: ID
    $empId: String
    $designation: String
    $role: ID
    $email: String
    $firstname: String
    $surname: String
    $gender: String
    $mobile: String
    $dob: Date
    $ssnAadhar: String
    $qualification: String
    $salutation: String
    $emergencyName: String
    $emergencyContact: String
    $taxId: String
    $npi: String
    $maritalStatus: String
    $workExp: String
    $clinicLocation: ID
    $isActive: Boolean
    $streetAddress: String
    $city: String
    $state: String
    $country: String
    $zipCode: String
    $tags: [String]
  ) {
    updateStaff(
      input: {
        staffData: {
          id: $id
          empId: $empId
          designation: $designation
          role: $role
          email: $email
          firstname: $firstname
          surname: $surname
          gender: $gender
          mobile: $mobile
          dob: $dob
          ssnAadhar: $ssnAadhar
          qualification: $qualification
          salutation: $salutation
          emergencyName: $emergencyName
          emergencyContact: $emergencyContact
          taxId: $taxId
          npi: $npi
          maritalStatus: $maritalStatus
          workExp: $workExp
          clinicLocation: $clinicLocation
          isActive: $isActive
          streetAddress: $streetAddress
          city: $city
          state: $state
          country: $country
          zipCode: $zipCode
          tags: $tags
        }
      }
    ) {
      staff {
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
  }
`
