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

export const STAFF_LIST = gql`
  query {
    staffs {
      edges {
        node {
          id
          name
          email
          gender
          empType
          user {
            id
          }
        }
      }
    }
  }
`

export const GET_ALL_LEARNERS = gql`
  query {
    students(isActive: true) {
      edges {
        node {
          id
          firstname
          internalNo
          mobileno
          email
          lastname
          caseManager {
            id
            name
            email
            contactNo
          }
          category {
            id
            category
          }
        }
      }
    }
  }
`

export const GET_STUDENT_DATA = gql`
  query($id: ID!) {
    student(id: $id) {
      id
      firstname
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

export const GET_STAFF_DATA = gql`
  query($id: ID!) {
    staff(id: $id) {
      id
      name
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
export const DELETE_LEARNER_FILE = gql`
  mutation($student: ID!, $docsId: [ID]!) {
    deleteLearnerFile(input: { student: $student, docsId: $docsId }) {
      details {
        id
        firstname
        lastname
        email
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
  }
`

export const DELETE_STAFF_FILE = gql`
  mutation($staff: ID!, $docsId: [ID]!) {
    deleteStaffFile(input: { staff: $staff, docsId: $docsId }) {
      details {
        id
        email
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
  }
`

export const UPDATE_LEARNER_FILE = gql`
  mutation($docsId: ID!, $fileName: String!, $fileDescription: String!) {
    updateLearnerFile(
      input: { docsId: $docsId, fileName: $fileName, fileDescription: $fileDescription }
    ) {
      details {
        id
        file
        fileName
        fileDescription
      }
    }
  }
`

export const UPDATE_STAFF_FILE = gql`
  mutation($docsId: ID!, $fileName: String!, $fileDescription: String!) {
    updateStaffFile(
      input: { docsId: $docsId, fileName: $fileName, fileDescription: $fileDescription }
    ) {
      details {
        id
        file
        fileName
        fileDescription
      }
    }
  }
`
