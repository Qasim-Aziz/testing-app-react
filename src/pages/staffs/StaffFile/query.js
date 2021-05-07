import gql from 'graphql-tag'

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
