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
    $assignWork: [ID]
    $students: [ID]
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
          assignWork: $assignWork
          students: $students
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
    $assignWork: [ID]
    $students: [ID]
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
          assignWork: $assignWork
          students: $students
          remainders: $remainders
        }
      }
    ) {
      task {
        id
        taskName
        description
      }
    }
  }
`
