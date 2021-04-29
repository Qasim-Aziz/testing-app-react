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
export const GET_PAYMENT_DETAILS = gql`
  query {
    recievingPaymentDetails(id: "UmVjaWV2aW5nUGF5bWVudERldGFpbHNUeXBlOjE=") {
      id
      institutionName
      streetAddress
      state
      city
      pincode
      gstin
      bankName
      accountHolderName
      ifscCode
      accountNo
      upi
      paytm
      gpay
      country {
        id
        name
      }
    }
  }
`

export const UPDATE_PAYMENT_DETAILS = gql`
  mutation(
    $pk: ID!
    $institutionName: String
    $streetAddress: String
    $state: String
    $city: String
    $country: ID
    $pincode: String
    $gstin: String
    $bankName: String
    $accountHolderName: String
    $ifscCode: String
    $accountNo: String
    $upi: String
    $paytm: String
    $gpay: String
  ) {
    updateRecievingPaymentDetails(
      input: {
        pk: $pk
        institutionName: $institutionName
        streetAddress: $streetAddress
        state: $state
        city: $city
        pincode: $pincode
        gstin: $gstin
        bankName: $bankName
        accountHolderName: $accountHolderName
        ifscCode: $ifscCode
        accountNo: $accountNo
        upi: $upi
        paytm: $paytm
        gpay: $gpay
        country: $country
      }
    ) {
      details {
        id
        institutionName
        streetAddress
        state
        city
        pincode
        gstin
        bankName
        accountHolderName
        ifscCode
        accountNo
        upi
        paytm
        gpay
      }
    }
  }
`

export const ADVANCE_INVOICE = gql`
  mutation(
    $clinic: [ID]!
    $month: String!
    $cgst: Float
    $sgst: Float
    $discount: Float
    $tax: Float
    $generateLink: Boolean
  ) {
    createAdvanceInvoiceByClinic(
      input: {
        clinic: $clinic
        month: $month
        cgst: $cgst
        sgst: $sgst
        discount: $discount
        tax: $tax
        generateLink: $generateLink
      }
    ) {
      status
      message
      invoice {
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
  }
`

export const MONTHLY_INVOICE = gql`
  mutation(
    $month: String!
    $clinics: [ID]!
    $cgst: Float
    $sgst: Float
    $discount: Float
    $tax: Float
    $generateLink: Boolean
  ) {
    createMonthlyInvoiceByClinic(
      input: {
        month: $month
        clinics: $clinics
        cgst: $cgst
        sgst: $sgst
        discount: $discount
        tax: $tax
        generateLink: $generateLink
      }
    ) {
      status
      message
      invoice {
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
        lastAmount
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
  }
`

export const UPDATE_INVOICE = gql`
  mutation(
    $pk: ID
    $email: String
    $status: ID
    $issueDate: Date
    $dueDate: Date
    $address: String
    $tax: Float
    $discount: Float
    $sgst: Float
    $cgst: Float
    $amount: Float
    $taxableSubtotal: Float
    $products: [FeeInput2]
  ) {
    updateInvoice(
      input: {
        pk: $pk
        email: $email
        status: $status
        issueDate: $issueDate
        dueDate: $dueDate
        taxableSubtotal: $taxableSubtotal
        address: $address
        tax: $tax
        discount: $discount
        sgst: $sgst
        cgst: $cgst
        amount: $amount
        products: $products
      }
    ) {
      details {
        id
        linkGenerated
      }
    }
  }
`

export const PAYMENT_REMINDER = gql`
  mutation($invoices: [ID], $clinics: [ID]) {
    sendPaymentReminders(input: { invoices: $invoices, clinics: $clinics }) {
      status
      message
    }
  }
`

export const GET_INVOICE_DETAIL = gql`
  query($id: ID!) {
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
      sgst
      cgst
      tax
      total
      linkGenerated
      paymentLink
      lastAmount
      hoursUsed
      clinic {
        id
        schoolName
        address
      }
      customer {
        id
        firstname
        lastname
        school {
          id
          schoolName
          email
          address
          logo
        }
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

export const GET_INVOICES = gql`
  query getInvoices($from: Date, $to: Date, $status: ID, $allclinics: Boolean) {
    getInvoices(date_Gte: $from, date_Lte: $to, status: $status, allclinics: $allclinics) {
      edges {
        node {
          id
          invoiceNo
          email
          issueDate
          dueDate
          amount
          taxableSubtotal
          total
          clinic {
            id
            schoolName
          }
          status {
            id
            statusName
            colorCode
          }
        }
      }
    }
  }
`

export const DELETE_INVOICE = gql`
  mutation deleteInvoice($id: ID!) {
    deleteInvoice(input: { pk: $id }) {
      status
      message
    }
  }
`
