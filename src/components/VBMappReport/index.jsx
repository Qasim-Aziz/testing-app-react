/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { Tabs, Button, notification } from 'antd'
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import MilestonesTab from './Milestones/MilestonesTab'
import BarriersTab from './Barriers/BarriersTab'
import TransitionAssessmentTab from './TransitionAssessment/TransitionAssessmentTab'
import TaskAnalysisTab from './TaskAnalysis/TaskAnalysisTab'

import LoadingComponent from './LoadingComponent'
import AssessmentDropDown from './AssessmentDropDown'
import { GET_VBMAPP_ASSESMENTS, GET_VBMAPP_AREAS, GET_VBMAPP_REPORT } from './queries'
import { structurizeData } from './helperFunction'

import './Style.scss'

const { TabPane } = Tabs

const VBMappReport = ({ selectedStudentId, studentName, showDrawerFilter }) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState()
  const [structuredReportData, setStructuredReportData] = useState()
  const [activeTab, setActiveTab] = useState('milestones')

  const [milestonesAreaId, setMilestonesAreaId] = useState()
  const [barriersAreaId, setBarriersAreaId] = useState()
  const [transitionAssessmentAreaId, setTransitionAssessmentAreaId] = useState()
  const [taskAnalysisAreaId, setTaskAnalysisAreaId] = useState()

  const { data: vbmappAreas, error: vbmappAreaErrors, loading: isVbmappAreaLoading } = useQuery(
    GET_VBMAPP_AREAS,
  )

  const { data: assessmentData, error: assessmentErrors, loading: isAssessmentLoading } = useQuery(
    GET_VBMAPP_ASSESMENTS,
    {
      variables: {
        studentId: selectedStudentId,
      },
    },
  )

  const [
    loadReportData,
    { data: vbmappReport, error: vbmappReportErrors, loading: isVbmappReportLoading },
  ] = useMutation(GET_VBMAPP_REPORT)

  useEffect(() => {
    if (vbmappAreaErrors && assessmentErrors && vbmappReportErrors) {
      notification.error({
        message: 'Something went wrong while feching data',
      })
    }
  }, [vbmappAreaErrors, assessmentErrors, vbmappReportErrors])

  useEffect(() => {
    if (vbmappAreas) {
      vbmappAreas.vbmappAreas.forEach(area => {
        if (area.areaName) {
          switch (area.areaName) {
            case 'Milestones':
              setMilestonesAreaId(area.id)
              break
            case 'Barriers':
              setBarriersAreaId(area.id)
              break
            case 'Transition Assessment':
              setTransitionAssessmentAreaId(area.id)
              break
            case 'Task Analysis':
              setTaskAnalysisAreaId(area.id)
              break
            default:
              console.error(`Found unknown VBMAPP Area: ${area.name}`)
          }
        }
      })
    }
  }, [vbmappAreas])

  useEffect(() => {
    if (assessmentData && milestonesAreaId) {
      const selectedAssessment = assessmentData?.vbmappGetAssessments?.edges[0]?.node?.id
      if (selectedAssessment) {
        setSelectedAssessmentId(selectedAssessment)
        loadReportData({
          variables: {
            assessmentId: selectedAssessment,
            milestonesArea: milestonesAreaId,
            barriersArea: barriersAreaId,
            transitionAssessmentArea: transitionAssessmentAreaId,
            taskAnalysisArea: taskAnalysisAreaId,
          },
        })
      }
    }
  }, [assessmentData, milestonesAreaId])

  const handleAssesmentChange = selectedAssessment => {
    console.log(selectedAssessment, 'sdsdsdsd')
    setSelectedAssessmentId(selectedAssessment)

    loadReportData({
      variables: {
        assessmentId: selectedAssessment,
        milestonesArea: milestonesAreaId,
        barriersArea: barriersAreaId,
        transitionAssessmentArea: transitionAssessmentAreaId,
        taskAnalysisArea: taskAnalysisAreaId,
      },
    })
  }

  useEffect(() => {
    setStructuredReportData(structurizeData(vbmappReport))
  }, [vbmappReport])

  const exportPDF = () => {
    const input = document.getElementById(activeTab)
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new JsPDF({
        format: 'tabloid',
      })
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight)
      pdf.save(`vbmapp-${activeTab}.pdf`)
    })
  }

  const exportButton = (
    <Button
      onClick={exportPDF}
      style={{
        marginRight: '8px',
        fontWeight: 'bold',
      }}
    >
      Export as PDF
    </Button>
  )

  const filterCardStyle = {
    background: '#F1F1F1',
    display: 'flex',
    flexWrap: 'wrap',
    padding: 5,
    margin: 0,
    height: 'fit-content',
    overflow: 'hidden',
    backgroundColor: 'rgb(241, 241, 241)',
  }

  if (isVbmappAreaLoading) return <LoadingComponent />
  if (vbmappAreaErrors) return <p>{vbmappAreaErrors}</p>

  return (
    <div className="vbmappReport">
      <div style={filterCardStyle}>
        <AssessmentDropDown
          onSelectionChange={handleAssesmentChange}
          assessmentData={assessmentData}
          isAssessmentLoading={isAssessmentLoading}
        />
      </div>

      {isVbmappReportLoading && <LoadingComponent />}
      {!isVbmappReportLoading && structuredReportData && (
        <Tabs
          defaultActiveKey={activeTab}
          type="card"
          className="vbmappReportTabs"
          tabBarExtraContent={exportButton}
          onChange={setActiveTab}
        >
          {milestonesAreaId && (
            <TabPane tab="Milestones" key="milestones">
              <MilestonesTab data={structuredReportData.milestonesData} />
            </TabPane>
          )}
          {barriersAreaId && (
            <TabPane tab="Barriers" key="barriers">
              <BarriersTab data={structuredReportData.barriersData} />
            </TabPane>
          )}
          {transitionAssessmentAreaId && (
            <TabPane tab="Transition Assessment" key="transitionAssessment">
              <TransitionAssessmentTab data={structuredReportData.transitionsData} />
            </TabPane>
          )}
          {taskAnalysisAreaId && (
            <TabPane tab="Task Analysis" key="taskAnalysis">
              <TaskAnalysisTab data={structuredReportData.tasksData} />
            </TabPane>
          )}
        </Tabs>
      )}
    </div>
  )
}

export default VBMappReport
