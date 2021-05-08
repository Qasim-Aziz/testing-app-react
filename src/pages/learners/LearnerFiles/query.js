import gql from 'graphql-tag'

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
