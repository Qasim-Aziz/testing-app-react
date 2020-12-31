/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
import React, { useState } from 'react'
import moment from 'moment'
import { Layout, Row, Col, Typography, Icon, Button, Drawer } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useDispatch } from 'react-redux'
import Calander from 'components/Calander'
import { Helmet } from 'react-helmet'
import TaskCard from './TaskCard'
import TaskHeader from './TaskHeader'
import SessionInstructionDrawer from '../parent/ParentDashboard/SessionInstructionDrawer'

const { Content } = Layout

const QUERY = gql`
  query parentDashboard($studentId: ID!, $date: Date!) {
    sessions: GetStudentSession(studentId: $studentId, date: $date) {
      edges {
        node {
          id
          sessionName {
            id
            name
          }
          duration
          sessionHost {
            edges {
              node {
                memberName
                relationship {
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
                  domain {
                    domain
                  }
                }
                targetAllcatedDetails {
                  id
                  targetName
                }
              }
            }
          }
          childsessionSet(last: 1) {
            edges {
              node {
                id
                status
              }
            }
          }
        }
      }
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const studentId = localStorage.getItem('studentId')
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const { data, loading, error } = useQuery(QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      studentId,
      date,
    },
  })

  const onClose = () => {
    setVisible(false)
  }

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  const [selectedSession, setSelectedSession] = useState(null)

  const startDataRecording = (node) => {
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        SessionId: node.id,
      },
    })
    setSelectedSession(node)
    setVisible(true)
  }

  console.log("error : ",error)

  return (
    <div>
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            padding: '0px 20px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          <Calander value={date} handleOnChange={handleSelectDate} />
          <div
            style={{
              marginTop: 30,
              fontSize: 18,
            }}
          >
            {loading && 'Loading...'}
            {error && 'Opps their something wrong'}
          </div>

          {!loading && data &&
            data.sessions.edges.map(({ node }) => (
              <>
                {node.targets.edgeCount > 0 ? (
                  <>
                    <div
                      className="taskSection"
                      style={{
                        position: 'relative',
                        marginBottom: 15,
                        marginTop: 31,
                      }}
                    >
                      <TaskHeader
                        duration={node.duration}
                        sessionName={node.sessionName.name}
                        targetsCount={node.targets.edgeCount}
                        hostList={node.sessionHost.edges}
                        status={
                          node.childsessionSet.edges[0]
                            ? node.childsessionSet.edges[0].node.status
                            : null
                        }
                      />
                      <Row gutter={[45, 0]}>
                        <Col xs={24} lg={24}>
                          <div style={{overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
                            {node.targets.edges.map(target => {
                              return (
                                <div style={{display:'inline-block', width: '370px', marginRight: '20px'}}>
                                  <TaskCard
                                    id={target.node.id}
                                    domainName={target.node.targetId?.domain?.domain}
                                    targetName={target.node.targetAllcatedDetails.targetName}
                                    like={target.node.targetlikeSet.edgeCount}
                                    userLiked="dislike"
                                  />
                                </div>

                              )
                            })}

                          </div>
                        </Col>
                      </Row>
                      {date === moment().format('YYYY-MM-DD') ? 
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: 10,
                          }}
                        >
                          <Button
                            type="primary"
                            style={{
                              color: '#fff',
                              width: 300,
                              background: '#0B35B3',
                              height: 40,
                              fontSize: 14,
                              lineHeight: '22px',
                            }}
                            onClick={() => startDataRecording(node)}
                          >
                            Start Session
                          </Button>
                        </div>
                      :
                        ''
                      }
                    </div>
                    
                  </>
                )
                  :
                  ''
                }
              </>
            ))}
          <Drawer width={500} placement="right" title="Session Preview" closable={true} onClose={onClose} visible={visible}>
            <SessionInstructionDrawer session={selectedSession} />
          </Drawer>
        </Content>
      </Layout>
    </div>
  )
}
