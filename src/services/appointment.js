/* eslint-disable */
import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getAppointments() {
  return apolloClient
    .query({
      query: gql`
        query {
          appointments {
            edges {
              node {
                id
                therapist {
                  id
                  name
                  surname
                }
                student {
                  id
                  firstname
                  lastname
                }
                attendee {
                  edges {
                    node {
                      id
                      name
                      surname
                    }
                  }
                }
                createdBy {
                  id
                  firstName
                  lastName
                }
                appointmentStatus {
                  id
                  appointmentStatus
                }
                location {
                  id
                  location
                }
                purposeAssignment
                note
                title
                start
                end
                isApproved
              }
            }
          }
        }
      `,
    })
    .then(res => res)
    .catch(err => err)
}
