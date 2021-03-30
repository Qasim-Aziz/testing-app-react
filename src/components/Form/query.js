import gql from 'graphql-tag'

export const GET_APPOINTMENT_DETAILS = gql`
  query($id: ID!) {
    appointment(id: $id) {
      id
      title
      student {
        id
      }
      therapist {
        id
      }
      purposeAssignment
      location {
        id
        location
      }
      start
      end
      note
      appointmentStatus {
        id
      }
      attendee {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`

export const EDIT_APPOINTMENT = gql`
  mutation(
    $id: ID!
    $therapistId: ID!
    $studentId: ID!
    $locationId: ID
    $title: String
    $purposeAssignment: String!
    $note: String
    $start: DateTime!
    $end: DateTime!
    $additionalStaff: [ID]
    $staffToStaff: Boolean!
    $appointmentStatus: ID
  ) {
    UpdateAppointment(
      input: {
        appointment: {
          id: $id
          therapist: $therapistId
          student: $studentId
          location: $locationId
          title: $title
          purposeAssignment: $purposeAssignment
          note: $note
          start: $start
          end: $end
          attendee: $additionalStaff
          staffToStaff: $staffToStaff
          appointmentStatus: $appointmentStatus
        }
      }
    ) {
      appointment {
        id
        therapist {
          id
          name
          surname
        }
        student {
          id
          firstname
          lastname
        }
        attendee {
          edges {
            node {
              id
              name
              surname
            }
          }
        }
        createdBy {
          id
          firstName
          lastName
        }
        appointmentStatus {
          id
          appointmentStatus
        }
        location {
          id
          location
        }
        purposeAssignment
        note
        title
        start
        end
        isApproved
      }
    }
  }
`

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment(
    $title: String!
    $studentId: ID!
    $therapistId: ID!
    $additionalStaff: [ID]
    $staffToStaff: Boolean!
    $locationId: ID
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
        therapist {
          id
          name
          surname
        }
        student {
          id
          firstname
          lastname
        }
        attendee {
          edges {
            node {
              id
              name
              surname
            }
          }
        }
        createdBy {
          id
          firstName
          lastName
        }
        appointmentStatus {
          id
          appointmentStatus
        }
        location {
          id
          location
        }
        purposeAssignment
        note
        title
        start
        end
        isApproved
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
          internalNo
        }
      }
    }
  }
`

export const ALL_THERAPIST = gql`
  query {
    staffs(userRole: "Therapist", isActive: true) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

export const ALL_LOCATION = gql`
  query {
    schoolLocation {
      edges {
        node {
          id
          location
        }
      }
    }
  }
`

export const ALL_APPOINTMENT_STATUS = gql`
  query {
    appointmentStatuses {
      id
      appointmentStatus
    }
  }
`
