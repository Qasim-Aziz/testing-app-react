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
  query($student: ID, $feeType: String) {
    getStudentInvoiceFee(student: $student, feeType: $feeType) {
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

export const CREATE_STUDENT_RATES = gql`
  mutation(
    $student: ID!
    $feeType: String!
    $startDate: Date
    $endDate: Date
    $gstApplicable: Boolean
    $flatItems: [FlatItemsInput]
    $hourlyItems: [HourlyItemsInput]
  ) {
    createStudentRates(
      input: {
        student: $student
        feeType: $feeType
        startDate: $startDate
        endDate: $endDate
        gstApplicable: $gstApplicable
        hourlyItems: $hourlyItems
        flatItems: $flatItems
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
  mutation($pk: ID!, $flatItems: [FlatItemsInput], $hourlyItems: [HourlyItemsInput]) {
    updateStudentRates(input: { pk: $pk, flatItems: $flatItems, hourlyItems: $hourlyItems }) {
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
`

export const REMOVE_FEE_ITEM = gql`
  mutation($pk: ID!, $removeFlatItems: [ID], $removeHourlyItems: [ID]) {
    updateStudentRates(
      input: { pk: $pk, removeFlatItems: $removeFlatItems, removeHourlyItems: $removeHourlyItems }
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

export { GET_INVOICES, DELETE_INVOICE, STUDENTS }
