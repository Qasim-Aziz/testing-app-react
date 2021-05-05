/* eslint-disable object-shorthand */
/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost'
import { notification } from 'antd'
import apolloClient from '../../../apollo/config'

export const getEquivalenceCategory = () => {
  return apolloClient
    .query({
      query: gql`
        query {
          peakEquDomains {
            id
            name
          }
        }
      `,
      fetchPolicy: 'network-only',
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

export const getTargetsByCategory = category => {
  return apolloClient
    .query({
      query: gql`query{
            getPeakEquCodes(codetype:"${category}"){
                edges{
                    node{
                        id
                        code
                        target{
                            id
                            maxSd
                            targetInstr
                            targetMain{
                                id
                                targetName
                            }
                        }
                        classes{
                            edges{
                                node{
                                    id
                                    name
                                    stimuluses{
                                        edges{
                                            node{
                                                id
                                                option
                                                stimulusName
                                            }
                                        }
                                    }
                                }
                            }
                        }
        
                    }
                }
            }
        }`,
      fetchPolicy: 'network-only',
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

export const getTargetsByCode = text => {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation SuggestPeakTargetByCode($text: String) {
          suggestPeakEquivalanceTargets(input: { code: $text }) {
            targets {
              code {
                id
                code
              }
              target {
                id
                status
                targetMain {
                  targetName
                }
                targetArea {
                  id
                  Area
                }
                video
                targetInstr
              }
            }
          }
        }
      `,
      variables: {
        text,
      },
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
