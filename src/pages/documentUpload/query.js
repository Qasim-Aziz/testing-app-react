/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost'

export const LOAD_FILES = gql`
  query Student($id: ID!) {
    student(id: $id) {
      id
      firstname
      email
      dob
      mobileno
      lastname
      gender
      currentAddress
      isActive
      image
      report
      files {
        edges {
          node {
            id
            file
            fileName
            fileDescription
          }
        }
      }
    }
  }
`
