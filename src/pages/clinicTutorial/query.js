import gql from 'graphql-tag'

/* eslint-disable import/prefer-default-export */
export const PROJECTS = gql`
  query {
    VimeoProject {
      edges {
        node {
          id
          name
          url
          projectId
          description
        }
      }
    }
  }
`

export const CLINIC_QUERY = gql`
  query {
    schooldetail: schoolDetail {
      id
      schoolName
      address
    }
  }
`

export const GET_VIDEO_LIVERY = gql`
  query($clinicId: ID!) {
    getClinicLibrary(clinic: $clinicId) {
      edges {
        node {
          id
          name
          description
        }
      }
    }
  }
`
export const LIBERARY_DETAILS = gql`
  query($id: ID!) {
    getLibraryDetails(id: $id) {
      id
      name
      description
      videos {
        edges {
          node {
            id
            name
            description
            url
          }
        }
      }
    }
  }
`
