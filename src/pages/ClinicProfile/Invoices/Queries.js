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
    students(isActive: true) {
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
export const STUDENT_INVOICE_ITEMS = gql`
  query {
    getStudentInvoiceItems {
      id
      name
    }
  }
`

export const GET_STUDENT_INVOICE_FEE = gql`
  query {
    getStudentInvoiceFee {
      edges {
        node {
          id
          feeType
          startDate
          endDate
          gstApplicable
          student {
            id
            firstname
          }
          flatItems {
            edges {
              node {
                id
                flatRate
                item {
                  id
                  name
                }
              }
            }
          }
          hourlyItems {
            edges {
              node {
                id
                hour
                hourRate
                item {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_STUDENT_FEE_DETAILS = gql`
  query {
    getStudentInvoiceFeeDetails(id: "U3R1ZGVudEludm9pY2VmZWVUeXBlOjE=") {
      id
      feeType
      startDate
      endDate
      gstApplicable
      student {
        id
        firstname
      }
      flatItems {
        edges {
          node {
            id
            flatRate
            item {
              id
              name
            }
          }
        }
      }
      hourlyItems {
        edges {
          node {
            id
            hour
            hourRate
            item {
              id
              name
            }
          }
        }
      }
    }
  }
`

// student: "U3R1ZGVudFR5cGU6MTYz"
// feeType: "FLAT" # Options => FLAT/PER_HOUR
// startDate: "2021-04-01"
// endDate: "2021-04-30"
// gstApplicable: false
// flatItems: [
//   { item: "U3R1ZGVudEludm9pY2VJdGVtc1R5cGU6MQ==", flatRate: 550 }
//   { item: "U3R1ZGVudEludm9pY2VJdGVtc1R5cGU6Mg==", flatRate: 500 }
// ]

export const CREATE_STUDENT_RATES = gql`
  mutation(
    $student: ID!
    $feeType: String!
    $startDate: Date
    $endDate: Date
    $gstApplicable: Boolean
    $FlatItems: [FlatItemsInput]
    $hourlyItems: [HourlyItemsInput]
  ) {
    createStudentRates(
      input: {
        student: $student
        feeType: $feeType # Options => FLAT/PER_HOUR
        startDate: $startDate
        endDate: $endDate
        gstApplicable: false
        hourlyItems: [hourlyItems]
        flatItems: [FlatItems]
      }
    ) {
      details {
        id
        feeType
        startDate
        endDate
        gstApplicable
        student {
          id
          firstname
        }
        flatItems {
          edges {
            node {
              id
              flatRate
              item {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`

export const UPDATE_STUDENT_RATES = gql`
  mutation {
    updateStudentRates(
      input: {
        pk: "U3R1ZGVudEludm9pY2VmZWVUeXBlOjE="
        flatItems: [
          {
            pk: "U3R1ZGVudEludm9pY2VGbGF0SXRlbXNUeXBlOjE="
            item: "U3R1ZGVudEludm9pY2VJdGVtc1R5cGU6MQ=="
            flatRate: 550
          }
          {
            pk: "U3R1ZGVudEludm9pY2VGbGF0SXRlbXNUeXBlOjI="
            item: "U3R1ZGVudEludm9pY2VJdGVtc1R5cGU6Mg=="
            flatRate: 500
          }
        ]
        removeFlatItems: []
      }
    ) {
      details {
        id
        feeType
        student {
          id
          firstname
        }
        flatItems {
          edges {
            node {
              id
              flatRate
              item {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`

export { GET_INVOICES, DELETE_INVOICE, STUDENTS }
