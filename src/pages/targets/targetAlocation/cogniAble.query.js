/* eslint-disable object-shorthand */
/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost'
import { notification } from 'antd'
import client from '../../../apollo/config'

export const getCogniAbleObjects = studentId => {
  return client
    .query({
      query: gql`query{
            getCogniableAssessments(student:"${studentId}", last: 8){ 
                edges{
                    node{
                        id,
                        date,
                        score,
                        status
                        student{
                            id,
                            firstname
                        }
                    }
                }
            }
        }`,
      fetchPolicy: 'network-only',
    })
    .then(result => result)
    .catch(error => error)
}

export const getCogniAbleObjectTargets = id => {
  return client
    .mutate({
      mutation: gql`mutation {
            suggestCogniableTargets(input:{
                pk:"${id}"
            }){
                targets{
                    id
                    domain{
                        id,
                        domain
                    },
                    targetArea{
                        id,
                        Area
                    }
                    targetMain{
                        id,
                        targetName
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => error)
}
