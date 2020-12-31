import gql from 'graphql-tag'

export const CLINIC_QUERY = gql`
  query {
    schooldetail: schoolDetail {
      id
      schoolName
      address
    }
  }
`

export const SCHOOL_INFO = gql`
  query($id: ID!) {
    users(id: $id) {
      id
      school {
        id
      }
    }
  }
`

export const CREATE_MODULE = gql`
  mutation($clinic: ID!, $name: String!, $description: String!) {
    addClinicVideoLibrary(input: { clinic: $clinic, name: $name, description: $description }) {
      details {
        id
        name
        description
        clinic {
          id
          schoolName
        }
        videos {
          edges {
            node {
              id
              url
              name
              description
            }
          }
        }
      }
    }
  }
`

export const UPDATE_MODULE = gql`
  mutation($id: ID!, $name: String!, $description: String) {
    updateClinicVideoLibrary(input: { pk: $id, name: $name, description: $description }) {
      details {
        id
        name
        description
        clinic {
          id
          schoolName
        }
        videos {
          edges {
            node {
              id
              url
            }
          }
        }
      }
    }
  }
`

export const DELETE_MODULE = gql`
  mutation($id: ID!) {
    deleteClinicVideoLibrary(input: { pk: $id }) {
      status
      msg
    }
  }
`

export const CLINIC_MODULES = gql`
  query($clinicId: ID!) {
    getClinicLibrary(clinic: $clinicId) {
      edges {
        node {
          id
          name
          description
          clinic {
            id
            schoolName
          }
          videos {
            edges {
              node {
                id
                url
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

export const ADD_VIDEO_LIBERARY = gql`
  mutation($liberaryId: ID!, $name: String!, $description: String, $url: String!) {
    addVideoToLibrary(
      input: { pk: $liberaryId, name: $name, description: $description, url: $url }
    ) {
      details {
        videos {
          edges {
            node {
              id
              url
              name
              description
            }
          }
        }
      }
    }
  }
`

export const EDIT_VIDEO = gql`
  mutation($videoId: ID!, $name: String!, $description: String, $url: String!) {
    editLibraryvideo(input: { pk: $videoId, name: $name, description: $description, url: $url }) {
      details {
        id
        name
        description
        url
      }
    }
  }
`

export const REMOVE_VIDEO = gql`
  mutation($liberaryID: ID!, $videoId: ID!) {
    removeVideoToLibrary(input: { pk: $liberaryID, videoId: $videoId }) {
      details {
        id
      }
    }
  }
`
