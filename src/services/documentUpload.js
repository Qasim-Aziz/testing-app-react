import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

/* eslint-disable import/prefer-default-export */
export async function getUploadedFiles(payload) {
  return apolloClient
    .query({
      query: gql`
        query($id: ID!) {
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
      `,
      variables: {
        id: payload.id,
      },
    })
    .then(result => result)
    .catch(err => {
      err.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}
