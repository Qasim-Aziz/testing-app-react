/* eslint-disable */
import gql from 'graphql-tag'

export const CLINIC_QUERY = gql`
  query {
    clinicAllDetails(isActive: true) {
      invoice
      details {
        id
        schoolName
        email
        address
        user {
          id
          firstName
        }
        country {
          name
          id
        }
        currency {
          id
          currency
          symbol
        }
        invoiceSet {
          edges {
            node {
              id
              invoiceNo
              email
              amount
              paymentLink
              status {
                id
                statusName
              }
            }
          }
        }
      }
    }
  }
`
