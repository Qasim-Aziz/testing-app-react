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
    $generateLink: Boolean
  ) {
    createAdvanceInvoiceByClinic(
      input: {
        clinic: $clinic
        month: $month
        cgst: $cgst
        sgst: $sgst
        discount: $discount
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
    $generateLink: Boolean
  ) {
    createMonthlyInvoiceByClinic(
      input: {
        month: $month
        clinics: $clinics
        cgst: $cgst
        sgst: $sgst
        discount: $discount
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

export const PAYMENT_REMINDER = gql`
  mutation($invoices: [ID], $clinics: [ID]) {
    sendPaymentReminders(input: { invoices: $invoices, clinics: $clinics }) {
      status
      message
    }
  }
`
