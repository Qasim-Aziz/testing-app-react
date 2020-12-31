/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const GET_DOCTORS = gql`
  query($location: String, $practicingArea: String) {
    getDoctors(location_Icontains: $location, practicingArea: $practicingArea) {
      edges {
        node {
          id
          name
          qualification
          location
          association
          practicingArea
        }
      }
    }
  }
`

export const ADD_DOCTOR = gql`
  mutation(
    $name: String!
    $qualification: String!
    $location: String!
    $association: String!
    $practicingArea: String!
  ) {
    addDoctor(
      input: {
        name: $name
        qualification: $qualification
        location: $location
        association: $association
        practicingArea: $practicingArea
      }
    ) {
      details {
        id
        name
        qualification
        location
        association
        practicingArea
      }
    }
  }
`

export const UPDATE_DOCTOR = gql`
  mutation(
    $id: ID!
    $name: String!
    $qualification: String!
    $location: String!
    $association: String!
    $practicingArea: String!
  ) {
    editDoctor(
      input: {
        pk: $id
        name: $name
        qualification: $qualification
        location: $location
        association: $association
        practicingArea: $practicingArea
      }
    ) {
      details {
        id
        name
        qualification
        location
        association
        practicingArea
      }
    }
  }
`

export const GET_DOCTOR = gql`
  query($doctorId: ID!) {
    doctorDetail(id: $doctorId) {
      id
      name
      qualification
      location
      association
      practicingArea
    }
  }
`

export const DELETE_DOCTOR = gql`
  mutation($doctorId: ID!) {
    deleteDoctor(input: { pk: $doctorId }) {
      status
      message
    }
  }
`
