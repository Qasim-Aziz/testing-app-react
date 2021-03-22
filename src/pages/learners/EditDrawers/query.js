/* eslint-disable */
import gql from 'graphql-tag'

// height: $height
// weight: $weight
// fatherName: $fatherName
// motherName: $motherName
// fatherPhone: $fatherPhone
// motherPhone: $motherPhone
// $height: String
// $weight: String
// $fatherName: String
// $motherName: String
// $fatherPhone: String
// $motherPhone: String
export const GEN_INFO = gql`
  mutation(
    $id: ID!
    $email: String!
    $gender: String!
    $dob: Date!
    $firstname: String!
    $lastname: String
    $mobileno: String
    $streetAddress: String
    $state: String
    $city: String
    $country: String
    $zipCode: String
    $tags: [String]
    $parentName: String
    $parentMobile: String
    $ssnAadhar: String
    $language: ID
    $category: ID!
    $clinicLocation: ID
    $authStaff: [ID]
    $caseManager: ID
    $isPeakActive: Boolean
    $isCogActive: Boolean
    $researchParticipant: Boolean
  ) {
    updateStudent(
      input: {
        studentData: {
          id: $id
          email: $email
          gender: $gender
          dob: $dob
          firstname: $firstname
          lastname: $lastname
          mobileno: $mobileno
          streetAddress: $streetAddress
          city: $city
          state: $state
          country: $country
          zipCode: $zipCode
          tags: $tags
          parentName: $parentName
          parentMobile: $parentMobile
          ssnAadhar: $ssnAadhar
          language: $language
          category: $category
          clinicLocation: $clinicLocation
          caseManager: $caseManager
          authStaff: $authStaff
          isPeakActive: $isPeakActive
          isCogActive: $isCogActive
          researchParticipant: $researchParticipant
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
`
