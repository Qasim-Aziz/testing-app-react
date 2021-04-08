import React, { useState } from 'react'
import { Page, Text, View, Document, Image, PDFViewer } from '@react-pdf/renderer'
import { useQuery } from 'react-apollo'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import moment from 'moment'
import logo from '../../../images/logo.JPG'
import { IISAGetAssessmentDetails, IISAGetDomains, clinicAllDetails } from './query'

const DownloadReport = ({ Assessmentscore, SelectedAssessmentId }) => {
  console.log('loading correctly')
  const { data, loading, error } = useQuery(IISAGetAssessmentDetails, {
    variables: {
      id: SelectedAssessmentId,
    },
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

  if (loading || getDomainLoading || clinicAllDetailsLoading) {
    return 'Loading'
  }
  let globalScore = null
  const { lastname, firstname, caseManger, dob, gender } = data.IISAGetAssessmentDetails.student

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
  console.log(scoreData)

  const assignScore = id => {
    const value = scoreData.find(key => key.id === id)
    if (value !== undefined) {
      globalScore = value.score
    }
  }

  const freeScore = () => {
    globalScore = null
  }
  // let domainId = null;
  return (
    <PDFViewer style={{ width: '100%', height: '1000px' }}>
      <Document>
        <Page size="A4" style={{ backgroundColor: '#fff', padding: '25px' }}>
          <View style={{ padding: '10px' }}>
            <View
              style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <View style={{ width: '50%' }}>
                <Image
                  src={logo}
                  style={{ width: '40%', paddingBottom: '12px', paddingTop: '5px' }}
                />
                <Text style={{ fontSize: 10, paddingBottom: '3px' }}>{schoolName}</Text>
                <Text style={{ fontSize: 10, paddingBottom: '3px' }}>{email}</Text>
                <Text style={{ fontSize: 10, paddingBottom: '3px' }}>{address}</Text>
              </View>
              <View>
                <View style={{ width: '50%' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '900',
                      marginBottom: '10px',
                      color: '#112d4e',
                    }}
                  >
                    ASSESSMENT REPORT
                  </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', fontSize: 10 }}>
                  <View style={{ marginRight: '8px' }}>
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
                      <Text style={{ fontWeight: 'bold' }}>Age:</Text> {moment().diff(dob, 'years')}
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
                backgroundColor: '#3f72af',
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
                  borderRight: '1px solid black',
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
                  borderRight: '1px solid black',
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
                  borderRight: '1px solid black',
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
                  borderRight: '1px solid black',
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
                  borderRight: '1px solid black',
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
                      backgroundColor: '#dbe2ef',
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
                          backgroundColor: globalScore === 1 ? '#112d4e' : 'white',
                        }}
                      >
                        <CheckOutlined />
                      </View>
                      <View
                        style={{
                          width: '14%',
                          borderRight: '1px solid black',
                          backgroundColor: globalScore === 2 ? '#112d4e' : 'white',
                        }}
                      >
                        <CloseOutlined />
                      </View>
                      <View
                        style={{
                          width: '14%',
                          borderRight: '1px solid black',
                          backgroundColor: globalScore === 3 ? '#112d4e' : 'white',
                        }}
                      >
                        <CheckOutlined />
                      </View>
                      <View
                        style={{
                          width: '11%',
                          borderRight: '1px solid black',
                          backgroundColor: globalScore === 4 ? '#112d4e' : 'white',
                        }}
                      >
                        <CloseOutlined />
                      </View>
                      <View
                        style={{
                          width: '11%',
                          backgroundColor: globalScore === 5 ? '#112d4e' : 'white',
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
                  backgroundColor: Assessmentscore < 70 ? 'green' : 'white',
                }}
              >
                <CheckOutlined />
              </View>
              <View
                style={{
                  width: '20%',
                  borderRight: '1px solid black',
                  backgroundColor:
                    Assessmentscore < 106 && Assessmentscore > 70 ? 'orange' : 'white',
                }}
              >
                <CloseOutlined />
              </View>
              <View
                style={{
                  width: '20%',
                  borderRight: '1px solid black',
                  backgroundColor: Assessmentscore < 153 && Assessmentscore > 107 ? 'red' : 'white',
                }}
              >
                <CheckOutlined />
              </View>
              <View
                style={{ width: '20%', backgroundColor: Assessmentscore > 153 ? 'red' : 'white' }}
              >
                <CloseOutlined />
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default DownloadReport
