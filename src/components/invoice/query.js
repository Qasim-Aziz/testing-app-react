import gql from 'graphql-tag'

export const CREATE_INVOICE = gql`
  mutation createInvoice(
    $customer: ID!
    $email: String!
    $status: ID!
    $issueDate: Date!
    $dueDate: Date!
    $address: String!
    $taxableSubtotal: Float!
    $discount: Float!
    $products: [FeeInput!]!
    $total: Float!
    $due: Float!
  ) {
    createInvoice(
      input: {
        invoiceNo: "# 0001" # need to generate from server (for now its hard coded)
        customer: $customer
        email: $email
        status: $status
        issueDate: $issueDate
        dueDate: $dueDate
        amount: $due # ballance due (maybe calculated by server)
        address: $address
        taxableSubtotal: $taxableSubtotal # should be calculated by server
        discount: $discount
        total: $total # should be calculated by server
        products: $products
      }
    ) {
      details {
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
              }
            }
          }
        }
      }
    }
  }
`

export const UPDATE_INVOICE = gql`
  mutation updateInvoice(
    $invoiceId: ID!
    # $customer: ID!
    $email: String!
    $status: ID!
    $issueDate: Date!
    $dueDate: Date!
    $address: String!
    $taxableSubtotal: Float!
    $discount: Float!
    $products: [FeeInput2]
    $total: Float!
    $due: Float!
  ) {
    updateInvoice(
      input: {
        pk: $invoiceId
        invoiceNo: "#0002"
        # customer: $customer
        email: $email
        status: $status
        issueDate: $issueDate
        dueDate: $dueDate
        amount: $due
        address: $address
        taxableSubtotal: $taxableSubtotal
        discount: $discount
        total: $total
        products: $products
      }
    ) {
      details {
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
              }
            }
          }
        }
      }
    }
  }
`

export const ALL_STUDENT = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          studentId
        }
      }
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation($name: String!, $description: String) {
    createInvoiceProduct(input: { name: $name, description: $description }) {
      details {
        id
        name
        description
      }
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation($name: String!, $description: String) {
    updateInvoiceProduct(input: { name: $name, description: $description }) {
      details {
        id
        name
        description
      }
    }
  }
`

export const GET_STUDENT_EMAIL = gql`
  query($id: ID!) {
    student(id: $id) {
      id
      email
      currentAddress
    }
  }
`

export const INVOICE_STATUS = gql`
  query {
    invoiceStatusList {
      id
      statusName
      colorCode
    }
  }
`

export const GET_INVOICES = gql`
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

export const GET_INVOICE = gql`
  query invoiceDetail($id: ID!) {
    invoiceDetail(id: $id) {
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
      customer {
        id
        firstname
      }
      status {
        id
        statusName
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
`
