/* eslint-disable import/prefer-default-export */
const { default: gql } = require('graphql-tag')

export const GET_STUDENT = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          lastname
          parent {
            id
          }
        }
      }
    }
  }
`

export const GET_STAFF = gql`
  query {
    staffs {
      edges {
        node {
          id
          name
          user {
            id
          }
        }
      }
    }
  }
`

export const GET_MESSAGE = gql`
  query($secondUser: ID!) {
    userthread(secondUser: $secondUser) {
      firstUser {
        id
        name
      }
      secondUser {
        id
        name
      }
      chatmessageSet {
        edges {
          node {
            user {
              id
            }
            message
            timestamp
          }
        }
      }
    }
  }
`

export const GET_THERAPIST_CLINIC = gql`
  query($id: ID!) {
    staff(id: $id) {
      school {
        schoolName
        user {
          id
        }
      }
    }
  }
`

export const GET_STUDENT_CLINIC = gql`
  query($id: ID!) {
    student(id: $id) {
      school {
        id
        schoolName
        user {
          id
        }
      }
    }
  }
`

export const GET_THERAPIST_ID = gql`
  query($id: ID!) {
    users(id: $id) {
      id
      staffSet {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`

export const STUDENT_DETAILS = gql`
  query($id: ID!) {
    users(id: $id) {
      studentsSet {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`

export const USER_INFO = gql`
  query($id: ID!) {
    users(id: $id) {
      id
      firstName
      lastName
      username
    }
  }
`
