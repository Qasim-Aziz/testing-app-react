/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Select,
  Icon,
  Row,
  Col,
  Typography,
  Input,
  Empty,
  notification,
} from 'antd'
import { useSelector } from 'react-redux'
import { getCogniAbleObjects, getCogniAbleObjectTargets } from './cogniAble.query'
import motherSon from '../motherSon.jpg'
import SessionCard from '../../../components/SessionCard'
import { notNull } from '../../../utilities'

const { Title, Text } = Typography
const selectTargetStyle = {
  width: '200px',
  textDecoration: 'none',
  marginRight: '20px',
}

const selectTargetAreaStyle = {
  width: '300px',
  textDecoration: 'none',
  marginRight: '20px',
}

const searchBtnStyle = {
  color: '#FFF',
  backgroundColor: '#0B35B3',
  width: '120px',
}

const cardsDivStyle = {
  height: '570px',
  overflowY: 'scroll',
  padding: '15px',
  // marginTop: '30px',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
}

const targetMappingStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '16px 12px',
  // display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
  cursor: 'pointer',
}

const selectedTargetMappingStyle = {
  background: '#E58425',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '16px 12px',
  // display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
  cursor: 'pointer',
}

const TargetsAvailableDrawer = ({
  selectedStudent,
  selectedProgram,
  allocateSessionToTarget,
  suggestedTarget,
  setSuggestedTarget,
}) => {
  const preSelectedAssessmentId = useSelector(state => state.student.CogniableAssessmentId)

  const [assessmentsObjects, setAssessmentsObjects] = useState()
  const [assessmentObjectTargets, setAssessmentObjectTargets] = useState([])
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(preSelectedAssessmentId)
  const [loading, setLoading] = useState(true)
  const [loadingTargets, setLoadingTaregts] = useState(false)
  const studentId = JSON.parse(localStorage.getItem('studentId'))

  const getCogniableAssessents = async () => {
    const objects = await getCogniAbleObjects(studentId)
    if (notNull(objects)) {
      if (objects.data) {
        setAssessmentsObjects(objects.data.getCogniableAssessments.edges)
        setLoading(false)
      }
      if (objects.error) {
        notification.error({
          message: 'Something went wrong',
        })
        setLoading(false)
      }
    }
  }

  const getAssessmentTargets = async id => {
    const objects = await getCogniAbleObjectTargets(id)
    if (notNull(objects)) {
      if (objects.data) {
        setAssessmentObjectTargets(objects.data.suggestCogniableTargets.targets)
        setLoadingTaregts(false)
      }
      if (objects.error) {
        notification.error({
          message: 'Something went wrong',
        })
        setLoadingTaregts(false)
      }
    }
  }

  const renderTargets = id => {
    console.log('trigger')
    setAssessmentObjectTargets([])
    setLoadingTaregts(true)
    setSelectedAssessmentId(id)
    getAssessmentTargets(id)
  }

  useEffect(() => {
    getCogniableAssessents()
    if (preSelectedAssessmentId !== '') {
      getAssessmentTargets(preSelectedAssessmentId)
    }
  }, [])

  if (loading) {
    return 'Loading Data...'
  }

  return (
    <>
      <Row>
        <Col md={12} style={{ padding: '10px' }}>
          <div style={cardsDivStyle}>
            <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
              Assessments Records
            </Title>
            {assessmentsObjects && assessmentsObjects.length > 0 ? (
              <>
                {assessmentsObjects.map(object => {
                  return (
                    <div
                      style={
                        object.node.id === selectedAssessmentId
                          ? selectedTargetMappingStyle
                          : targetMappingStyle
                      }
                      onClick={() => renderTargets(object.node.id)}
                    >
                      <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
                        {object.node.date}
                      </Title>
                      <p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>
                        <i>{object.node.status}</i>
                      </p>
                    </div>
                  )
                })}
              </>
            ) : (
              <Empty description="No target by domain and target area" />
            )}
          </div>
        </Col>

        <Col md={12} style={{ padding: '10px' }}>
          <div style={cardsDivStyle}>
            <Title style={{ fontSize: '20px', lineHeight: '27px', display: 'block' }}>
              Suggested Targets
            </Title>
            {assessmentObjectTargets && assessmentObjectTargets.length > 0 ? (
              <>
                {assessmentObjectTargets.map(sTarget => {
                  return (
                    <SessionCard
                      key={sTarget.id}
                      allocated={sTarget.allocatedTar}
                      image={motherSon}
                      heading={sTarget.targetMain.targetName}
                      receptiveLanguage="in therapy"
                      allocateSessionToTarget={() => allocateSessionToTarget({ node: sTarget })}
                    />
                  )
                })}
              </>
            ) : (
              <>
                {loadingTargets ? (
                  <p>Loading Targets...</p>
                ) : (
                  <Empty description="No manual seached target" />
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default TargetsAvailableDrawer
