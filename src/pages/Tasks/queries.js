import gql from 'graphql-tag'

export const CREATE_TASK_DATA = gql`
  mutation CreateTask(
    $taskType: ID!
    $taskName: String!
    $description: String
    $priority: ID!
    $status: ID!
    $startDate: Date!
    $dueDate: Date!
    $therapists: [ID]
    $learners: [ID]
    $remainders: [RemainderInput]
  ) {
    createTask(
      input: {
        task: {
          taskType: $taskType
          taskName: $taskName
          description: $description
          priority: $priority
          status: $status
          startDate: $startDate
          dueDate: $dueDate
          assignWork: $therapists
          students: $learners
          remainders: $remainders
        }
      }
    ) {
      task {
        id
        taskName
        description
        startDate
        dueDate
        status {
          id
          taskStatus
        }
        priority {
          id
          name
        }
        taskType {
          id
          taskType
        }
        assignWork {
          edges {
            node {
              id
              name
            }
          }
        }
        students {
          edges {
            node {
              id
              firstname
            }
          }
        }
        taskcounterSet {
          edges {
            node {
              id
              count
              date
            }
          }
        }
      }
    }
  }
`

export const UPDATE_TASK_DATA = gql`
  mutation updateTask(
    $pk: ID!
    $taskType: ID!
    $taskName: String!
    $description: String
    $priority: ID!
    $status: ID!
    $startDate: Date!
    $dueDate: Date!
    $therapists: [ID]
    $learners: [ID]
    $remainders: [RemainderInput]
  ) {
    updateTask(
      input: {
        task: {
          pk: $pk
          taskType: $taskType
          taskName: $taskName
          description: $description
          priority: $priority
          status: $status
          startDate: $startDate
          dueDate: $dueDate
          assignWork: $therapists
          students: $learners
          remainders: $remainders
        }
      }
    ) {
      task {
        id
        taskName
        description
        startDate
        dueDate
        status {
          id
          taskStatus
        }
        priority {
          id
          name
        }
        taskType {
          id
          taskType
        }
        assignWork {
          edges {
            node {
              id
              name
            }
          }
        }
        students {
          edges {
            node {
              id
              firstname
            }
          }
        }
        taskcounterSet {
          edges {
            node {
              id
              count
              date
            }
          }
        }
      }
    }
  }
`
