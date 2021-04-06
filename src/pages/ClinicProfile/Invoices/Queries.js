import gql from 'graphql-tag'

const GET_INVOICES = gql`
  query getInvoices($from: Date, $to: Date, $status: ID) {
    getInvoices(date_Gte: $from, date_Lte: $to, status: $status) {
      edges {
        node {
          id
          invoiceNo
          email
          issueDate
          dueDate
          amount
          address
          taxableSubtotal
          discount
          total
          clinic {
            id
            schoolName
          }
          status {
            id
            statusName
          }
          customer {
            id
            parent {
              firstName
              lastName
              username
            }
          }
          invoiceFee {
            edges {
              node {
                id
                quantity
                rate
                amount
                tax
                schoolServices {
                  id
                  name
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`

const DELETE_INVOICE = gql`
  mutation deleteInvoice($id: ID!) {
    deleteInvoice(input: { pk: $id }) {
      status
      message
    }
  }
`

const STUDENTS = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          lastname
          invoiceSet {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`

export { GET_INVOICES, DELETE_INVOICE, STUDENTS }
