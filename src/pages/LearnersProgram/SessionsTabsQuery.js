/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const GET_TODAYS_SESSION = gql`
  query($studentId: ID!) {
    getChildSession(sessions_Student: $studentId) {
      edges {
        node {
          id
          status
          sessions {
            id
            itemRequired
            duration
            sessionName {
              id
              name
            }
            instruction {
              edges {
                node {
                  id
                  instruction
                }
              }
            }
            sessionHost {
              edges {
                node {
                  id
                  memberName
                  timeSpent {
                    edges {
                      node {
                        id
                        sessionName {
                          id
                          name
                        }
                        duration
                      }
                    }
                  }
                  relationship {
                    id
                    name
                  }
                }
              }
            }
            targets {
              edges {
                node {
                  id
                  time
                  targetInstr
                  date
                  targetAllcatedDetails {
                    id
                    targetName
                  }
                }
              }
            }
          }
        }
      }
    }
    GetStudentSession(studentId: $studentId) {
      edges {
        node {
          id
          name
          itemRequired
          duration
          sessionName {
            id
            name
          }
          instruction {
            edges {
              node {
                id
                instruction
              }
            }
          }
          childsessionSet {
            edges {
              node {
                id
                status
              }
            }
          }
          sessionHost {
            edges {
              node {
                id
                memberName
                timeSpent {
                  edges {
                    node {
                      id
                      sessionName {
                        id
                        name
                      }
                      duration
                    }
                  }
                }
                relationship {
                  id
                  name
                }
              }
            }
          }
          targets {
            edges {
              node {
                id
                time
                targetInstr
                date
                targetAllcatedDetails {
                  id
                  targetName
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_STATUS = gql`
  query getChildSession($sessionId: ID!) {
    getChildSession(sessions: $sessionId) {
      edges {
        node {
          id
          status
        }
      }
    }
  }
`

export const GET_SESSION_BY_DATE = gql`
  query getSessionsByDate($studentId: ID!, $date: Date!) {
    getDateSessions(student: $studentId, date: $date) {
      id
      name
      createdAt
      itemRequired
      student {
        id
        firstname
      }
      sessionName {
        id
        name
      }
      duration
      sessionHost {
        edges {
          node {
            id
            memberName
            relationship {
              id
              name
            }
          }
        }
      }
      instruction {
        edges {
          node {
            id
            instruction
          }
        }
      }
      targets {
        edgeCount
        edges {
          node {
            id
            targetlikeSet {
              edgeCount
            }
            targetId {
              id
              domain {
                id
                domain
              }
            }
            targetAllcatedDetails {
              id
              targetName
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
      childsessionSet(sessionDate: $date) {
        edges {
          node {
            id
            sessionDate
            createdAt
            status
          }
        }
      }
    }
  }
`
