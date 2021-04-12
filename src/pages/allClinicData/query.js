/* eslint-disable import/prefer-default-export */
const { default: gql } = require('graphql-tag')

export const CLINIC_QUERY = gql`
  query($isActive: Boolean) {
    clinicAllDetails(isActive: $isActive) {
      invoice
      totalLearners
      activeLearners
      lastMonthActiveLearners
      researchParticipent
      activeDays
      peak
      vbmapp
      cogniable
      lastLogin
      status
      details {
        id
        schoolName
        isActive
        email
        contactNo
        contactNo2
        address
        user {
          id
          firstName
        }
        country {
          id
          name
          isActive
          dbName
        }
        currency {
          id
          currency
          symbol
        }
        staffSet {
          edges {
            node {
              id
              name
              surname
              contactNo
              email
              dateOfJoining
              gender
              user {
                id
                lastLogin
              }
              dob
              localAddress
              isActive
              designation
            }
          }
        }
      }
    }
  }
`

export const UPDATE_SCHOOL = gql`
  mutation UpdateSchool($pk: ID!, $isActive: Boolean) {
    updateSchool(input: { pk: $pk, isActive: $isActive }) {
      details {
        id
        schoolName
      }
    }
  }
`

export const ALL_LEARNERS = gql`
  query Students($schoolId: ID!, $isActive: Boolean) {
    students(school: $schoolId, isActive: $isActive) {
      edges {
        node {
          id
          firstname
          lastname
          dob
          email
          mobileno
          parentMobile
          gender
          isActive
          admissionDate
          createdAt
          isPeakActive
          isCogActive
          researchParticipant
          parent {
            id
            dateJoined
            lastLogin
          }
          assessmentCharges {
            edges {
              node {
                id
                date
                assessType
                amount
              }
            }
          }
        }
      }
    }
  }
`

export const ALL_LEARNERS_ASSESS_CHARGES = gql`
  query Students($schoolId: ID!) {
    students(school: $schoolId) {
      edges {
        node {
          id
          isActive
          isPeakActive
          isCogActive
          researchParticipant
          assessmentCharges {
            edges {
              node {
                id
                date
                assessType
                amount
              }
            }
          }
        }
      }
    }
  }
`

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $isActive: Boolean) {
    updateStudent(input: { studentData: { id: $id, isActive: $isActive } }) {
      student {
        id
        firstname
        email
        dob
        isActive
      }
    }
  }
`

export const CLINIC_RATES = gql`
  query GetClinicRates($clinic: ID!) {
    getClinicRates(clinic: $clinic) {
      edges {
        node {
          learnerPrice
          id
          researchParticipantPrice
          lastInvoicePrice
          peakPrice
          vbmappPrice
          clinic {
            id
            schoolName
            country {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const UPDATE_RATES = gql`
  mutation MaintainClinicRates(
    $clinic: ID!
    $learnerPrice: Int
    $researchParticipantPrice: Int
    $lastInvoicePrice: Int
    $peakPrice: Int
    $vbmappPrice: Int
  ) {
    maintainClinicRates(
      input: {
        clinic: $clinic
        learnerPrice: $learnerPrice
        researchParticipantPrice: $researchParticipantPrice
        lastInvoicePrice: $lastInvoicePrice
        peakPrice: $peakPrice
        vbmappPrice: $vbmappPrice
      }
    ) {
      details {
        id
        clinic {
          id
          schoolName
        }
        learnerPrice
        researchParticipantPrice
        peakPrice
        lastInvoicePrice
        vbmappPrice
      }
    }
  }
`
export const CREATE_INVOICE = gql`
  mutation createInvoice(
    $clinic: ID
    $email: String!
    $status: ID!
    $issueDate: Date!
    $dueDate: Date!
    $address: String!
    $taxableSubtotal: Float!
    $discount: Float!
    $cgst: Float!
    $sgst: Float!
    $total: Float!
    $products: [FeeInput!]!
    $due: Float!
  ) {
    createInvoice(
      input: {
        clinic: $clinic
        email: $email
        status: $status
        issueDate: $issueDate
        dueDate: $dueDate
        amount: $due
        address: $address
        taxableSubtotal: $taxableSubtotal
        discount: $discount
        sgst: $sgst
        cgst: $cgst
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
        sgst
        cgst
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
export const GET_INVOICES = gql`
  query getInvoices($from: Date, $to: Date, $status: ID, $clinic: ID) {
    getInvoices(date_Gte: $from, date_Lte: $to, status: $status, clinic: $clinic) {
      edges {
        node {
          invoiceNo
          email
          amount
          issueDate
          linkGenerated
          paymentLink
          paymentLinkId
          address
          taxableSubtotal
          sgst
          cgst
          discount
          total
          id
          dueDate
          clinic {
            id
            schoolName
            currency {
              id
              currency
            }
          }
          status {
            id
            statusName
            colorCode
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

export const DELETE_INVOICE = gql`
  mutation deleteInvoice($id: ID!) {
    deleteInvoice(input: { pk: $id }) {
      status
      message
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
export const GENERATE_LINK = gql`
  mutation RazorpayGenerateLink($pk: ID!) {
    razorpayGenerateLink(input: { pk: $pk }) {
      status
      message
    }
  }
`

export const NOTIFICATION = gql`
  mutation RazorpayInvoiceNotification($pk: ID!) {
    razorpayInvoiceNotification(input: { pk: $pk }) {
      status
      message
    }
  }
`
export const LEARNER_ACTIVE_DETAILS = gql`
  mutation LearnerActiveDetails($pk: ID!, $month: String!) {
    learnerActiveDetails(input: { pk: $pk, month: $month }) {
      data {
        activeDays
        inactiveDays
        vbmappDays
        peakDays
        cogDays
      }
    }
  }
`

export const MAKE_ASSESS = gql`
  mutation makeAssessmentCharge($pk: ID!, $assessType: String!, $amount: Float, $invoiceId: ID) {
    makeAssessmentCharge(
      input: {
        pk: $pk
        charges: [{ assessType: $assessType, amount: $amount, invoiceId: $invoiceId }]
      }
    ) {
      clientMutationId
      details {
        id
        firstname
        assessmentCharges {
          edges {
            node {
              id
              assessType
              date
              amount
              invoice {
                id
                invoiceNo
              }
            }
          }
        }
      }
    }
  }
`

export const PRODUCT_LIST = gql`
  query {
    invoiceProductsList {
      id
      name
      description
    }
  }
`
export const tt = gql`
  mutation($invoices: [String]) {
    deleteAssessmentChargeByInvoice(input: { invoices: $invoices }) {
      status
      msg
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
