/* eslint-disable import/prefer-default-export */
const { default: gql } = require('graphql-tag')

export const IISAGetAssessmentDetails = gql`
  query($id: ID!) {
    IISAGetAssessmentDetails(id: $id) {
      student {
        id
        lastname
        firstname
        caseManager {
          name
        }
        dob
        gender
        school {
          schoolName
          address
          email
          id
        }
      }
      responses {
        edges {
          node {
            id
            question {
              id
              question
              domain {
                id
                name
              }
            }
            answer {
              id
              name
              score
            }
          }
        }
      }
    }
  }
`

export const IISAGetDomains = gql`
  query {
    IISAGetDomains {
      edges {
        node {
          id
          name
          iisaquestionsSet {
            edges {
              node {
                id
                question
              }
            }
          }
        }
      }
    }
  }
`
export const clinicAllDetails = gql`
  query($id: ID) {
    clinicAllDetails(pk: $id) {
      details {
        schoolName
        email
        address
        logo
      }
    }
  }
`

export const PERCENTAGE = gql`
  query($id: ID!) {
    IISAGetAssessmentDetails(id: $id) {
      percentage
      socialPercentage
      emotionalPercentage
      speechPercentage
      behaviourPercentage
      sensoryPercentage
      cognitivePercentage
    }
  }
`

export const MODULE_PERCENTAGE = gql`
  query($id: ID!) {
    IISAGetAssessmentDetails(id: $id) {
      percentage
    }
  }
`
