import gql from 'graphql-tag'

export const DISABLE_TARTET_AREA = gql`
  mutation($id: ID!) {
    disableTargetArea(input: { pk: $id, isActive: false }) {
      status
      msg
    }
  }
`

export const DISABLE_DOMAIN = gql`
  mutation($id: ID!) {
    disableDomain(input: { pk: $id, isActive: false }) {
      status
      msg
    }
  }
`
export const UPDATE_TARGET_AREA = gql`
  mutation($id: ID!, $name: String!) {
    updateProgramArea(input: { id: $id, name: $name }) {
      ProgramArea {
        id
        name
      }
    }
  }
`
export const DOMAIN = gql`
  query domain($programArea: ID!) {
    programDetails(id: $programArea) {
      domain {
        edges {
          node {
            id
            domain
          }
        }
      }
    }
  }
`

export const GET_TARGET_AREAS = gql`
  query($domainId: [ID!]) {
    targetArea(domain: $domainId, isActive: true) {
      edges {
        node {
          id
          Area
          isActive
        }
      }
    }
  }
`

export const TARGET_AREA_NAME = gql`
  query domain($programArea: ID!) {
    programDetails(id: $programArea, isActive: true) {
      name
    }
  }
`

export const TARGET_QUERY = gql`
  query($id: ID!) {
    target(targetArea: $id) {
      edges {
        node {
          id
          isActive
          targetInstr
          targetMain {
            targetName
          }
          video
        }
      }
    }
  }
`

export const DISABLE_TARGET = gql`
  mutation($id: ID!) {
    disableTarget(input: { pk: $id, isActive: false }) {
      status
      msg
    }
  }
`

export const DISABLE_PROGRAM_AREA = gql`
  mutation($id: ID!) {
    disableProgramArea(input: { programArea: $id, isActive: false }) {
      status
      msg
    }
  }
`
