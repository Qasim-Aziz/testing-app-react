import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Layout, Row, Col, Typography, Button, Icon, Collapse, Drawer, Progress } from 'antd'
import { connect } from 'react-redux'
import LoadingComponent from 'components/LoadingComponent'
import actions from 'redux/iisaassessment/actions'
import moment from 'moment'
import { useQuery } from '@apollo/react-hooks'
import { PERCENTAGE } from './query'
import AssessmentReport from './report'

const { Content } = Layout
const { Title, Text } = Typography
const { Panel } = Collapse

// @connect(({ iisaassessment, student }) => ({
//   iisaassessment,
//   student,
// }))

function mapStateToProps(state) {
  return { iisaassessment: state.iisaassessment, stundent: state.student }
}

const Screeing = props => {
  useEffect(() => {
    onRenderWithoutID()
  }, [])

  const onRenderWithoutID = () => {
    const {
      dispatch,
      iisaassessment: { SelectedAssessmentId },
    } = props
    if (!SelectedAssessmentId) {
      window.location.href = '/#/iisaAssessment'
    } else {
      dispatch({
        type: actions.LOAD_ASSESSMENT_OBJECT,
        payload: {
          objectId: SelectedAssessmentId,
        },
      })
    }
  }

  const {
    iisaassessment: {
      AssessmentLoading,
      SelectedAssessmentId,
      AssessmentObject,
      IISADomains,
      ReportDrawer,
    },
  } = props

  const closeReportDrawer = () => {
    const { dispatch } = props
    dispatch({
      type: actions.SET_STATE,
      payload: {
        ReportDrawer: false,
      },
    })
  }

  const showReport = () => {
    const { dispatch } = props
    dispatch({
      type: actions.SET_STATE,
      payload: {
        ReportDrawer: true,
      },
    })
  }

  const { data, loading, error } = useQuery(PERCENTAGE, {
    variables: {
      id: SelectedAssessmentId,
    },
  })

  console.log('start iisa console')
  console.log(props)
  console.log(SelectedAssessmentId)
  const startAssessment = domainId => {
    // const {
    //   dispatch,
    //   iisaassessment: { IISAQuestionsListObject },
    // } = props

    // dispatch({
    //   type: actions.SET_STATE,
    //   payload: {
    //     SelectedDomainId: domainId,
    //     SelectedQuestionIndex: 0,
    //     SelectedQuestionId: IISAQuestionsListObject[domainId][0]?.question.node.id,
    //   },
    // })
    window.location.href = `/#/startIisaAssessment?domainID=${domainId}`
  }

  const percentageObject = [
    data?.IISAGetAssessmentDetails.socialPercentage,
    data?.IISAGetAssessmentDetails.emotionalPercentage,
    data?.IISAGetAssessmentDetails.speechPercentage,
    data?.IISAGetAssessmentDetails.behaviourPercentage,
    data?.IISAGetAssessmentDetails.sensoryPercentage,
    data?.IISAGetAssessmentDetails.cognitivePercentage,
  ]

  return (
    <>
      <Helmet title="IISA Assessment" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            width: '100%',
            margin: '0px auto',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '0px 10px',
              backgroundColor: 'white',
              boxShadow: 'rgb(0 0 0 / 12%) 0px 1px 6px, rgb(0 0 0 / 12%) 0px 1px 4px',
            }}
          >
            <p style={{ fontSize: '25px', color: 'black' }}>{AssessmentObject?.title}</p>
          </div>
          <div style={{ display: 'flex', padding: '25px' }}>
            <div style={{ width: '25%', backgroundColor: 'rgb(237, 241, 247)' }}>
              <div
                style={{
                  backgroundColor: 'rgb(219, 226, 239)',
                  color: 'black',
                  boxShadow:
                    'rgb(0 0 0 / 8%) 0px 0px 1px, rgb(0 0 0 / 12%) 0px 0px 2px, rgb(0 0 0 / 8%) 0px 4px 8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  flex: '1 1 0%',
                  margin: '10px 10px 0px',
                  fontSize: '1.3rem',
                }}
              >
                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>
                  {AssessmentObject?.title}
                </p>
                <p style={{ fontSize: '1.2rem' }}>
                  {moment(AssessmentObject?.time).format('DD/MM/YYYY')}
                </p>
                <p>Total Perentage: {data?.IISAGetAssessmentDetails.percentage}%</p>
                <div />
                <div
                  style={{ backgroundColor: '#3f72af', display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    onClick={() => showReport()}
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      width: '100%',
                      backgroundColor: '#3f72af',
                    }}
                    disabled={data?.IISAGetAssessmentDetails.percentage < 100}
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>
            <div style={{ width: '75%' }}>
              {IISADomains?.map(({ node: { id, name } }, i = 0) => (
                <div
                  style={{
                    marginBottom: '15px',
                    marginTop: '5px',
                    padding: '12px',
                    boxShadow:
                      '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div>
                    <a
                      aria-hidden="true"
                      style={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                      onClick={() => startAssessment(id)}
                      key={id}
                    >
                      {name}
                    </a>
                  </div>
                  <div>
                    <Progress percent={percentageObject[i]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Content>
        <Drawer
          visible={ReportDrawer}
          onClose={() => {
            closeReportDrawer()
          }}
          width="80%"
          title="Assessment Report"
        >
          <div
            style={{
              padding: '0px 30px',
            }}
          >
            <AssessmentReport
              onClose={() => {
                closeReportDrawer()
              }}
            />
          </div>
        </Drawer>
      </Layout>
    </>
  )
}

export default connect(mapStateToProps)(Screeing)
