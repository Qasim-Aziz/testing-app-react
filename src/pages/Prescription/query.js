/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import axios from 'axios'
import apolloClient from '../../apollo/config'

// const axiosQuery = () => axios({
//   url: 'https://1jzxrj179.lp.gql.zone/graphql',
//   method: 'post',
//   data: {
//     query: `
//       query PostsForAuthor {
//         author(id: 1) {
//           firstName
//             posts {
//               title
//               votes
//             }
//           }
//         }
//       `,
//   },
// }).then(result => {
//   console.log(result.data)
// })

export const request = react_apolloClient =>
  react_apolloClient.query({
    query: gql`
      query getComplaintsDef($val: String) {
        getPrescriptionComplaints(name_Icontains: $val, first: 5) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    variables: {
      val: payload ? payload : '',
    },
  })

export function getComplaints(payload) {
  console.log('COMPLAINTS PAYLOAD 👉👉', payload)
  return apolloClient.query({
    query: gql`
      query getComplaintsDef($val: String) {
        getPrescriptionComplaints(name_Icontains: $val, first: 5) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    variables: {
      val: payload ? payload : '',
    },
  })
  // .then(result => {
  //   console.log('THE RESULT', result)
  //   return result
  // })
  // .catch(error => {
  //   console.log('THE ERROR💣💣💣🔥🔥', JSON.stringify(error))
  //   error.graphQLErrors.map(item => {
  //     console.log('THE ERROR💣💣💣🔥🔥', item)
  //     return notification.error({
  //       message: 'Something went wrong',
  //       description: item.message,
  //     })
  //   })
  // })
}

export function getDiagnosis(payload) {
  console.log('THE PAYLOAD', payload)
  return apolloClient
    .query({
      query: gql`
        query getDiagnosisDef($val: String) {
          getPrescriptionDiagnosis(name_Icontains: $val, first: 5) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        val: payload.value ? payload.value : '',
      },
    })
    .then(result => {
      console.log('THE RESULT', result)
      return result
    })
    .catch(error => {
      console.log('THE ERROR💣💣💣🔥🔥', JSON.stringify(error))
      error.graphQLErrors.map(item => {
        console.log('THE ERROR💣💣💣🔥🔥', item)
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}

export function getTests(payload) {
  console.log('THE PAYLOAD', payload)
  return apolloClient
    .query({
      query: gql`
        query getTestsDef($val: String) {
          getPrescriptionTests(name_Icontains: $val, first: 5) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        val: payload.value ? payload.value : '',
      },
    })
    .then(result => {
      console.log('THE RESULT', result)
      return result
    })
    .catch(error => {
      console.log('THE ERROR💣💣💣🔥🔥', JSON.stringify(error))
      error.graphQLErrors.map(item => {
        console.log('THE ERROR💣💣💣🔥🔥', item)
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}
