/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_STAFF_RATES = gql`
  query {
    staff(id: "U3RhZmZUeXBlOjQxNQ==") {
      id
      clientHourly
      clientMileage
      providerHourly
      providerMileage
    }
  }
`
export const CREATE_STAFF_RATE = gql`
  mutation(
    $id: ID!
    $clientHourly: Float!
    $clientMileage: Float!
    $providerHourly: Float!
    $providerMileage: Float!
  ) {
    staffDriveRates(
      input: {
        pk: $id
        clientHourly: $clientHourly
        clientMileage: $clientMileage
        providerHourly: $providerHourly
        providerMileage: $providerMileage
      }
    ) {
      details {
        id
        clientHourly
        clientMileage
        providerHourly
        providerMileage
      }
    }
  }
`
