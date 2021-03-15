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
