/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const APPOINTMENTS_FOR_RANGE = gql`
  query appointments($dateFrom: Date, $dateTo: Date) {
    appointments(dateFrom: $dateFrom, dateTo: $dateTo) {
      edges {
        node {
          id
          start
          end
          student {
            id
            firstname
            lastname
            image
            mobileno
          }
          isApproved
          purposeAssignment
          title
          note
          therapist {
            id
            name
            surname
          }
          appointmentStatus {
            id
          }
          location {
            id
            location
          }
        }
      }
    }
  }
`
