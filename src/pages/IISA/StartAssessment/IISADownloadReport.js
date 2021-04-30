import React, { useState } from 'react'
import { Page, Text, View, Document, Image, PDFViewer } from '@react-pdf/renderer'
import { useQuery } from 'react-apollo'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import moment from 'moment'
import logo from '../../../images/logo.JPG'
import {
  IISAGetAssessmentDetails,
  IISAGetDomains,
  clinicAllDetails,
  MODULE_PERCENTAGE,
} from './query'
import ClinicHeader from '../../../components/ReportHeader/clinicHeader'

// Styles
const Table = {
  border: '1px solid black',
  //  marginBottom: '70px',
  marginTop: '50px',
}

const Heading1 = {
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#112d4e',
  color: 'white',
  borderBottom: '1px solid black',
  fontSize: 12,
  fontWeight: 'bolder',
}

const Heading2 = {
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#dbe2ef',
  fontSize: 9,
}

const fieldHalf = {
  width: '50%',
  borderRight: '1px solid black',
  display: 'flex',
  alignItems: 'center',
  paddingTop: '4px',
  paddingBottom: '4px',
  borderTop: '1px solid black',
}

const field = {
  width: '16.66%',
  borderRight: '1px solid black',
  display: 'flex',
  alignItems: 'center',
  paddingTop: '4px',
  paddingBottom: '4px',
  borderTop: '1px solid black',
}

const IISADownloadReport = ({ SelectedAssessmentId }) => {
  console.log('download Report Props')
  console.log(Assessmentscore)
  console.log(SelectedAssessmentId)
  const { data, loading, error } = useQuery(IISAGetAssessmentDetails, {
    variables: {
      id: SelectedAssessmentId,
    },
    fetchPolicy: 'no-cache',
  })
  const { data: getDomainData, loading: getDomainLoading } = useQuery(IISAGetDomains)
  const clinicId = data?.IISAGetAssessmentDetails.student.school.id
  const { data: clinicAllDetailsData, loading: clinicAllDetailsLoading } = useQuery(
    clinicAllDetails,
    {
      variables: {
        id: clinicId,
      },
    },
  )

  const { data: modulePercentageData, loading: modulePercentageLoading } = useQuery(
    MODULE_PERCENTAGE,
    {
      variables: {
        id: SelectedAssessmentId,
      },
      fetchPolicy: 'no-cache',
    },
  )

  const Assessmentscore = modulePercentageData?.IISAGetAssessmentDetails.percentage

  if (loading || getDomainLoading || clinicAllDetailsLoading || modulePercentageLoading) {
    return 'Loading'
  }
  if (error) {
    return `${error}`
  }
  let globalScore = null
  let totalScore = 0
  const { lastname, firstname, caseManger, dob, gender } = data.IISAGetAssessmentDetails.student
  console.log('data here')
  console.log(SelectedAssessmentId)
  console.log(dob)
  console.log(data.IISAGetAssessmentDetails.student)
  const { schoolName, email, address } = clinicAllDetailsData?.clinicAllDetails[0].details

  const scoreData = []
  data.IISAGetAssessmentDetails.responses.edges.map(
    ({
      node: {
        question: { id },
        answer: { score },
      },
    }) =>
      scoreData.push({
        id,
        score,
      }),
  )
  // console.log(scoreData)

  const assignScore = id => {
    const value = scoreData.find(key => key.id === id)
    if (value !== undefined) {
      globalScore = value.score
      totalScore += globalScore
    }
  }

  const freeScore = () => {
    globalScore = null
  }
  // let domainId = null;
  return (
    <div style={{ width: '100%' }}>
      {Assessmentscore < 100 ? (
        <p style={{ textAlign: 'center', marginTop: '22px', fontWeight: 'bold', color: 'red' }}>
          Please complete the assessment first
        </p>
      ) : (
        <PDFViewer style={{ width: '100%', height: '1000px' }}>
          <Document>
            <Page size="A4" style={{ backgroundColor: '#fff', padding: '25px' }} wrap>
              <View style={{ padding: '10px' }}>
                <View
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  <ClinicHeader schoolName={schoolName} email={email} address={address} />
                  <View>
                    <View style={{ width: '70%' }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginBottom: '10px',
                          color: 'red',
                        }}
                      >
                        INDIAN SCALE FOR ASSESSMENT OF AUTISM
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          marginBottom: '10px',
                          color: 'black',
                          textAlign: 'center',
                        }}
                      >
                        ASSESSMENT REPORT
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        fontSize: 10,
                        marginTop: '12px',
                      }}
                    >
                      <View style={{ marginRight: '20px' }}>
                        <Text style={{ marginBottom: '3px' }}>
                          <Text style={{ fontWeight: 'bold' }}>Child Name:</Text> {firstname}
                        </Text>
                        <Text style={{ marginBottom: '3px' }}>
                          <Text style={{ fontWeight: 'bold' }}>Date of Birth:</Text> {dob}
                        </Text>
                        <Text style={{ marginBottom: '3px' }}>
                          <Text style={{ fontWeight: 'bold' }}>Examiner:</Text> {caseManger}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ marginBottom: '3px' }}>
                          <Text style={{ fontWeight: 'bold' }}>Age:</Text>{' '}
                          {moment().diff(moment(`${dob}`, 'YYYY-MM-DD'), 'years')}
                        </Text>
                        <Text style={{ marginBottom: '3px' }}>
                          <Text style={{ fontWeight: 'bold' }}>Gender:</Text> {gender}
                        </Text>
                        <Text style={{ marginBottom: '3px' }}>
                          <Text style={{ fontWeight: 'bold' }}>Date:</Text>{' '}
                          {moment(new Date()).format('DD/MM/YYYY')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ padding: '5px', backgroundColor: 'white', marginTop: '29px' }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    fontSize: 13,
                    backgroundColor: '#112d4e',
                    color: 'white',
                    fontWeight: 'bold',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    border: '1px solid black',
                  }}
                >
                  <View
                    style={{
                      width: '40%',
                      textAlign: 'center',
                      borderRight: '1px solid white',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Text>Items</Text>
                  </View>
                  <View
                    style={{
                      width: '10%',
                      textAlign: 'center',
                      borderRight: '1px solid white',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>Rarely</Text>
                    <Text style={{ fontSize: 9 }}>Upto 20%</Text>
                    <Text style={{ fontSize: 9 }}>Score 1</Text>
                  </View>
                  <View
                    style={{
                      width: '14%',
                      textAlign: 'center',
                      borderRight: '1px solid white',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>SomeTimes</Text>
                    <Text style={{ fontSize: 9 }}>21 to 40%</Text>
                    <Text style={{ fontSize: 9 }}>Score 2</Text>
                  </View>
                  <View
                    style={{
                      width: '14%',
                      textAlign: 'center',
                      borderRight: '1px solid white',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>Frequently</Text>
                    <Text style={{ fontSize: 9 }}>41 to 60%</Text>
                    <Text style={{ fontSize: 9 }}>Score 3</Text>
                  </View>
                  <View
                    style={{
                      width: '11%',
                      textAlign: 'center',
                      borderRight: '1px solid white',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>Mostly</Text>
                    <Text style={{ fontSize: 9 }}>61 to 80%</Text>
                    <Text style={{ fontSize: 9 }}>Score 4</Text>
                  </View>
                  <View
                    style={{
                      width: '11%',
                      textAlign: 'center',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>Always</Text>
                    <Text style={{ fontSize: 9 }}>81 to 100%</Text>
                    <Text style={{ fontSize: 9 }}>Score 5</Text>
                  </View>
                </View>
                {getDomainData?.IISAGetDomains.edges.map(
                  ({
                    node: {
                      name,
                      iisaquestionsSet: { edges },
                    },
                  }) => (
                    <View>
                      <View
                        style={{
                          padding: '5px',
                          backgroundColor: '#3f72af',
                          color: 'white',
                          border: '1px solid black',
                          borderTop: 0,
                        }}
                      >
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{name}</Text>
                      </View>
                      {edges.map(({ node: { id, question } }) => (
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: 10,
                            border: '1px solid black',
                            borderTop: '0px',
                          }}
                        >
                          <Text
                            style={{ width: '40%', borderRight: '1px solid black', padding: '5px' }}
                          >
                            {question}
                          </Text>
                          {assignScore(id)}
                          <View
                            style={{
                              width: '10%',
                              borderRight: '1px solid black',
                              backgroundColor: globalScore === 1 ? '#dbe2ef' : 'white',
                            }}
                          >
                            <CheckOutlined />
                          </View>
                          <View
                            style={{
                              width: '14%',
                              borderRight: '1px solid black',
                              backgroundColor: globalScore === 2 ? '#dbe2ef' : 'white',
                            }}
                          >
                            <CloseOutlined />
                          </View>
                          <View
                            style={{
                              width: '14%',
                              borderRight: '1px solid black',
                              backgroundColor: globalScore === 3 ? '#dbe2ef' : 'white',
                            }}
                          >
                            <CheckOutlined />
                          </View>
                          <View
                            style={{
                              width: '11%',
                              borderRight: '1px solid black',
                              backgroundColor: globalScore === 4 ? '#dbe2ef' : 'white',
                            }}
                          >
                            <CloseOutlined />
                          </View>
                          <View
                            style={{
                              width: '11%',
                              backgroundColor: globalScore === 5 ? '#dbe2ef' : 'white',
                            }}
                          >
                            <CloseOutlined />
                          </View>
                          {freeScore()}
                        </View>
                      ))}
                    </View>
                  ),
                )}
              </View>
              <View
                style={{ border: '1px solid black', backgroundColor: '#dbe2ef', marginTop: '28px' }}
              >
                <View style={{ display: 'flex', flexDirection: 'row', fontSize: 12 }}>
                  <View
                    style={{
                      width: '20%',
                      textAlign: 'center',
                      borderRight: '1px solid black',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Text>Classification</Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      textAlign: 'center',
                      borderRight: '1px solid black',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>No Autism</Text>
                    <Text style={{ fontSize: 9 }}>less than 70</Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      textAlign: 'center',
                      borderRight: '1px solid black',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>Mild Autism</Text>
                    <Text style={{ fontSize: 9 }}>70 to 106</Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      textAlign: 'center',
                      borderRight: '1px solid black',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>Moderate Autism</Text>
                    <Text style={{ fontSize: 9 }}>107 to 153</Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      textAlign: 'center',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>Severe Autism</Text>
                    <Text style={{ fontSize: 9 }}>More than 153</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    fontSize: 12,
                    borderTop: '1px solid black',
                  }}
                >
                  <View
                    style={{
                      width: '20%',
                      textAlign: 'center',
                      borderRight: '1px solid black',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <Text>Total Score</Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      borderRight: '1px solid black',
                      backgroundColor: totalScore < 70 ? 'green' : 'white',
                    }}
                  >
                    {null}
                  </View>
                  <View
                    style={{
                      width: '20%',
                      borderRight: '1px solid black',
                      backgroundColor: totalScore < 106 && totalScore > 70 ? 'orange' : 'white',
                    }}
                  >
                    {null}
                  </View>
                  <View
                    style={{
                      width: '20%',
                      borderRight: '1px solid black',
                      backgroundColor: totalScore < 153 && totalScore > 107 ? 'red' : 'white',
                    }}
                  >
                    {null}
                  </View>
                  <View
                    style={{
                      width: '20%',
                      backgroundColor: totalScore > 153 ? 'red' : 'white',
                    }}
                  >
                    {null}
                  </View>
                </View>
              </View>
            </Page>
            <Page size="A4" style={{ backgroundColor: '#fff', padding: '25px' }}>
              <View style={Table} wrap={false}>
                <View style={Heading1}>
                  <View style={field}>{null}</View>
                  <View style={field}>
                    <Text>N</Text>
                  </View>
                  <View style={field}>
                    <Text>Minimum</Text>
                  </View>
                  <View style={field}>
                    <Text>Maximum</Text>
                  </View>
                  <View style={field}>
                    <Text>Mean</Text>
                  </View>
                  <View style={field}>
                    <Text>S.D</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={field}>
                    <Text>IISA Total</Text>
                  </View>
                  <View style={field}>
                    <Text>376</Text>
                  </View>
                  <View style={field}>
                    <Text>70.0</Text>
                  </View>
                  <View style={field}>
                    <Text>181.0</Text>
                  </View>
                  <View style={field}>
                    <Text>106.09</Text>
                  </View>
                  <View style={field}>
                    <Text>23.5</Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: '24px', border: '1px solid black' }}>
                <View style={Heading1}>
                  <View style={fieldHalf}>
                    <Text>IISA Scores</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>IISA Degree of Autism</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>Less than 70</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>Normal</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>70 to 106</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>Mild Autism</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>107 to 153</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>Moderate Autism</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>Greater than 153</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>Severe Autism</Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: '24px', border: '1px solid black' }}>
                <View style={Heading1}>
                  <View style={fieldHalf}>
                    <Text>Scores</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>Percentage %</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>70</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>40</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>71-88</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>50</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>89-105</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>60</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>106-123</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>70</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>124-140</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>80</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>141-158</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>90</Text>
                  </View>
                </View>
                <View style={Heading2}>
                  <View style={fieldHalf}>
                    <Text>Above 158</Text>
                  </View>
                  <View style={fieldHalf}>
                    <Text>100</Text>
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </div>
  )
}

export default IISADownloadReport
