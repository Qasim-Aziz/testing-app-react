/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const GET_THERAPIST = gql`
  {
    staffs(userRole: "Therapist") {
      edges {
        node {
          id
          name
          surname
        }
      }
    }
  }
`

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment(
    $title: String!
    $studentId: ID!
    $therapistId: ID!
    $note: String
    $purposeAssignment: String!
    $startDateAndTime: DateTime!
    $endDateAndTime: DateTime!
    $enableRecurring: Boolean!
    $startDate: String!
    $endDate: String!
    $startTime: String!
    $endTime: String!
    $isApproved: Boolean!
    $selectedDays: [String]
    $appointmentStatus: ID
  ) {
    CreateAppointment(
      input: {
        appointment: {
          title: $title
          student: $studentId
          therapist: $therapistId
          attendee: $additionalStaff
          location: $locationId
          note: $note
          purposeAssignment: $purposeAssignment
          start: $startDateAndTime
          end: $endDateAndTime
          isApproved: $isApproved
          staffToStaff: $staffToStaff
          appointmentStatus: $appointmentStatus
        }
        recurring: {
          enableRecurring: $enableRecurring
          startDate: $startDate
          endDate: $endDate
          startTime: $startTime
          endTime: $endTime
          days: $selectedDays
        }
      }
    ) {
      appointment {
        id
      }
    }
  }
`
