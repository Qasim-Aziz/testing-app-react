// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function getSessionAndRelations() {
  return apolloClient
    .query({
      query: gql`
        query {
          sessionName {
            id
            name
          }
          relationships {
            id
            name
          }
        }
      `,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function getFamilyDetails() {
  const id = JSON.parse(localStorage.getItem('studentId'))
  return apolloClient
    .query({
      query: gql`{
            student(id:"${id}") {
              family
              {
                  id,
                  members
                  {
                      edges {
                          node {
                              id,
                              memberName,
                              relationship
                                  {
                                      id,
                                      name
                                  },
                              timeSpent
                                  {
                                 edges
                                      {
                                       node
                                          {
                                              id,
                                              sessionName
                                              {
                                                  id,
                                                  name
                                              }
                                          duration
                                          }
                                      }
                                  }
                                }
                            }
                  }
                }
              }
            }
          `,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}

export async function createNewMember(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            familyMember(input:{student:${payload.studentId}, memberName:"${payload.memberName}", relationship:"${payload.relationId}", timeSpent:[
                    {session:"U2Vzc2lvbk5hbWVUeXBlOjE=", duration:"${payload.morning} Hours"},
                    {session:"U2Vzc2lvbk5hbWVUeXBlOjI=", duration:"${payload.afternoon} Hours"},
                    {session:"U2Vzc2lvbk5hbWVUeXBlOjM=", duration:"${payload.evening} Hours"}
                ]})
               {
                   familyMember
                   {
                           id,
                          memberName,
                          relationship{
                              id,
                              name
                          },
                          timeSpent
                          {
                             edges {
                                  node {
                                      id,
                                      sessionName{
                                          id,
                                          name
                                      }
                                      duration
                                  }
                             }
                          }
                       }
               }
        }`,
    })
    .then(result => {
      notification.success({
        message: 'Family Member Created Successfully',
      })
      return result
    })
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}

export async function editMember(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
                   editFamily(input:{id:"${payload.memberId}=",
                    memberName:"${payload.memberName}",
                    relationship:"${payload.relationId}",
            timeSpent:[
                {session:"U2Vzc2lvbk5hbWVUeXBlOjE=", duration:"${payload.morning} hours"},
                {session:"U2Vzc2lvbk5hbWVUeXBlOjI=", duration:"${payload.afternoon} hours"},
                {session:"U2Vzc2lvbk5hbWVUeXBlOjM=", duration:"${payload.evening} hours"}
            ]})
           {
               details
               {
                   id,
                  memberName,
                  relationship{
                      id,
                      name
                  },
                  timeSpent
                  {
                     edges {
                          node {
                              id,
                              sessionName{
                                  id,
                                  name
                              }
                              duration
                          }
                     }
                  }
               }
           }
    }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}
