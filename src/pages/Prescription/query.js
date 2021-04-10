/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import axios from 'axios'
import apolloClient from '../../apollo/config'

export const GET_COMPLAINT_QUERY = gql`
  query getComplaintsDef($val: String) {
    getPrescriptionComplaints(name_Icontains: $val, first: 5) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
export const GET_DIAGNOSIS_QUERY = gql`
  query getDiagnosisDef($val: String) {
    getPrescriptionDiagnosis(name_Icontains: $val, first: 5) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
export const GET_TESTS_QUERY = gql`
  query getTestsDef($val: String) {
    getPrescriptionTests(name_Icontains: $val, first: 5) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
