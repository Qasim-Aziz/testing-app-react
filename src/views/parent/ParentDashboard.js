/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Layout, Row, Col, Typography, Icon, Button } from 'antd'
import './parentDashboard.scss'
import doctorIcon from 'icons/doctor.png'
import parentCildIcon from 'icons/parentChild.png'
import safeGardIcon from 'icons/safeGard.png'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import PerformanceSummary from './ParentDashboard/PerformenceSummary'
import PerformenceGrap from './ParentDashboard/PerformenceGrap'
import AppointmentsCard from './ParentDashboard/AppointmentsCard'
import TaskHeader from './ParentDashboard/TaskHeader'
import TaskCard from './ParentDashboard/TaskCard'
import InfoCard from '../../components/dashboard/InfoCard'
import timeBack from './ParentDashboard/utils'

const { Content } = Layout
const { Title } = Typography

const QUERY = gql`
  query parentDashboard($studentId: ID!) {
    total_targets: targetAllocates(studentId: $studentId) {
      edgeCount
    }
    student(id: $studentId) {
      firstname
    }
    mastered_targets: targetAllocates(studentId: $studentId, targetStatus: "U3RhdHVzVHlwZTox") {
      edgeCount
    }
    sessions: GetStudentSession(studentId: $studentId) {
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
                relationship {
                  name
                }
              }
            }
          }
          targets(first: 3) {
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
    appointment: appointments(student: $studentId, first: 2) {
      edges {
        node {
          id
          start
          end
          therapist {
            id
            name
            userRole {
              name
            }
          }
          location {
            id
            location
          }
        }
      }
    }
  }
`

const PERFORMENCE = gql`
  query TargetCount($studentId: ID, $date: Date) {
    total_targets: targetAllocates(studentId: $studentId, date_Gte: $date) {
      edgeCount
    }
    mastered_targets: targetAllocates(
      studentId: $studentId
      targetStatus: "U3RhdHVzVHlwZTox"
      targetStatus_Date_Gte: $date
    ) {
      edgeCount
    }
    intherapy_targets: targetAllocates(
      studentId: $studentId
      targetStatus: "U3RhdHVzVHlwZToz"
      targetStatus_Date_Gte: $date
    ) {
      edgeCount
    }
  }
`

const SEND_LIKE = gql`
  mutation($targetId: ID!) {
    targetLike(input: { target: $targetId }) {
      targetLike {
        id
      }
    }
  }
`
const ParentDashboard = () => {
  const user = useSelector(state => state.user)
  const studentId = localStorage.getItem('studentId')
  const [targetCountBy, setTargetCountBy] = useState('week')
  const performenceQuery = useQuery(PERFORMENCE, {
    variables: {
      studentId,
      date: timeBack(targetCountBy),
    },
  })
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      studentId,
    },
  })
  const [sendLike, sendLikeRes] = useMutation(SEND_LIKE)

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  const handleTargetCountBy = value => {
    setTargetCountBy(value)
  }

  return (
    <div>
      <Helmet title="Dashboard Parent" />
      <Layout style={{ backgroundColor: '#fff', padding: '0px' }}>
        <Layout>
          <Content
            style={{ padding: '0px 20px', maxWidth: 1300, width: '100%', margin: '0px auto' }}
          >
            <Typography>
              <Title ellipsis level={2} className="pageTitle">
                {data.student.firstname}’s Dashboard
              </Title>
            </Typography>

            {performenceQuery.error && 'Opps their is some thing wrong'}
            {performenceQuery.data && (
              <PerformanceSummary
                totalTarget={performenceQuery.data.total_targets.edgeCount}
                masteredTarget={performenceQuery.data.mastered_targets.edgeCount}
                inTherapyTargets={performenceQuery.data.intherapy_targets.edgeCount}
                style={{ marginBottom: 39 }}
                targetCountBy={targetCountBy}
                handleTargetCountBy={handleTargetCountBy}
              />
            )}

            <Row gutter={[39, 0]}>
              <Col style={{ backgroundColor: 'transparent' }} xs={24} lg={8}>
                <AppointmentsCard appointments={data.appointment.edges} />
              </Col>
              <Col style={{ backgroundColor: 'transparent' }} xs={24} lg={16}>
                <PerformenceGrap />
              </Col>
            </Row>

            {data.sessions.edges.map(({ node }) => {
              return (
                <div className="taskSection" style={{ position: 'relative', marginBottom: 15 }}>
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
                    {node.targets.edges.map(target => {
                      return (
                        <Col key={target.node.id} xs={24} lg={8}>
                          <TaskCard
                            id={target.node.id}
                            domainName={target.node.targetId.domain.domain}
                            targetName={target.node.targetAllcatedDetails.targetName}
                            like={target.node.targetlikeSet.edgeCount}
                            userLiked="dislike"
                          />
                        </Col>
                      )
                    })}
                  </Row>
                  <Button
                    type="link"
                    block
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '24px',
                      width: 100,
                      fontSize: 14,
                      lineHeight: '22px',
                      color: '#0B35B3',
                    }}
                  >
                    View All
                    <Icon type="arrow-right" style={{ color: '#0B35B3' }} />
                  </Button>
                </div>
              )
            })}

            <Row gutter={[45, 0]}>
              <Col xs={24} lg={8}>
                <InfoCard title="Acceptance & Commitment" icon={safeGardIcon} />
              </Col>
              <Col xs={24} lg={8}>
                <InfoCard title="Verified Doctors" icon={doctorIcon} />
              </Col>
              <Col xs={24} lg={8}>
                <InfoCard
                  title="Parent  Community"
                  icon={parentCildIcon}
                  style={{ marginRight: 0 }}
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default ParentDashboard
