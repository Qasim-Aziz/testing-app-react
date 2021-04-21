/* eslint-disable prefer-template */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, Image, Font, PDFViewer } from '@react-pdf/renderer'
import { ToWords } from 'to-words'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import s1 from 'assets/fonts/SourceSerifPro/SourceSerifPro-Regular.ttf'
import s2 from 'assets/fonts/SourceSerifPro/SourceSerifPro-SemiBold.ttf'
import logo from '../../images/CogniableLogo.jpeg'

Font.register({
  family: 'Source Serif Pro',
  fonts: [
    { src: s1, fontStyle: 'normal', fontWeight: 'light' },
    { src: s2, fontStyle: 'normal', fontWeight: 'bold' },
  ],
})

// font-family: , serif;
// <link rel="preconnect" href="https://fonts.gstatic.com">
// <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@300;400;600;700&display=swap" rel="stylesheet"></link>

const peakId = 'VGFyZ2V0RGV0YWlsVHlwZTo4'

const sectionMain = {
  width: '100%',
  border: '1px solid black',
  color: 'black',
}
const section = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  borderBottom: '1px solid black',
}

const col = {
  width: '10%',
  textAlign: 'center',
  display: 'flex',
  borderRight: '1px solid black',
}

const bg = {
  backgroundColor: '#e8e8e8',
}

const sText = {
  fontSize: 9,
  padding: '4px 0',
  backgroundColor: '#fff',
}

const mText = {
  ...sText,
  fontSize: 10,
  margin: 'auto 0',
}

const borderBottom = { borderBottom: '1px solid black' }

const headerText = {
  fontSize: 10,
  fontWeight: 700,
  padding: '4px 0',
  margin: 'auto',
  alignSelf: 'center',
  width: '100%',
  backgroundColor: '#e8e8e8',
}

const headerTextBorder = {
  ...headerText,
  ...borderBottom,
}

const STUDENT_DETAILS = gql`
  query student(
    $studentId: ID!
    $childSessionId: ID!
  ) {
    student(id: $studentId) {
      id
      firstname
      dob
      category {
        id
        category
      }
      clinicLocation {
        id
        location
      }
    }

    getSessionDataRecording(ChildSession: $childSessionId){
      totalTarget
      mandCount
      behCount
      toiletData {
        id
        date
        time
        bowel
        urination
        prompted
      }
      edges{
        node{
          id
          targets{
            id
            targetAllcatedDetails {
              id
              targetName
              DailyTrials
              targetType {
                id
                typeTar
              }
            }
          }
          sessionRecord{
            totalTrial,
            totalCorrect
            totalError
            totalPrompt
            totalIncorrect
            totalNr

            physical
            verbal
            gestural
            textual
          }
          peak{
            totalCorrect
            totalError
            totalPrompt
          }
        }
      }
    }

    childSessionDetails(id: $childSessionId){
      id
      feedback
      rating
    }
  }
`

const PrintableInvoice = ({ selectSessionId }) => {

  const [TotalTrials, setTotalTrials] = useState(0)
  const [CorrectTrials, setCorrectTrials] = useState(0)
  const [IncorrectTrials, setIncorrectTrials] = useState(0)
  const [NoTrials, setNoTrials] = useState(0)
  const [PromptedTrials, setPromptedTrials] = useState(0)

  const ad = [
    {
      s1: '',
      t1: 'Receptive lang.deficits',
      s2: '',
      t2: 'Deficits in adapt. skills',
      s3: TotalTrials,
      t3: 'Total Trials',
      s4: CorrectTrials,
      t4: 'Correct Trials',
    },
    {
      s1: '',
      t1: 'Functional comm. Defict',
      s2: '',
      t2: 'Deficits in safety skills',
      s3: IncorrectTrials,
      t3: 'Incorrect Trials',
      s4: PromptedTrials,
      t4: 'Prompted Trials',
    },
    {
      s1: '',
      t1: 'Deficits in play skills ',
      s2: '',
      t2: 'Restricted interests',
      s3: NoTrials,
      t3: 'No Trials',
      s4: '',
      t4: '',
    },
    {
      s1: '',
      t1: 'Social inter. deficits',
      s2: '',
      t2: 'Problematic behavior',
      s3: '',
      t3: '',
      s4: '',
      t4: '',
    },
  ]
  const acquisitionSkills1 = [
    {
      srNo1: 1,
      objective1: '6D- Abstraction: Number Concepts',
      RAN1: '_',
      srNo2: 9,
      objective2: 'Transformation',
      RAN2: '_',
    },
    { srNo1: 2, objective1: '12O- Tact Time', RAN1: '_', srNo2: 10, objective2: '', RAN2: '_' },
    { srNo1: 3, objective1: '14B- Subtraction ', RAN1: '_', srNo2: 11, objective2: '', RAN2: '_' },
    {
      srNo1: 4,
      objective1: 'Behavior Chain- 5 steps directions',
      RAN1: '_',
      srNo2: 12,
      objective2: '',
      RAN2: '_',
    },
    { srNo1: 5, objective1: 'Problem solving', RAN1: '_', srNo2: 13, objective2: '', RAN2: '_' },
    { srNo1: 6, objective1: 'Fractions', RAN1: '_', srNo2: 14, objective2: '', RAN2: '_' },
    {
      srNo1: 7,
      objective1: 'Answering Wh Questions',
      RAN1: '_',
      srNo2: 15,
      objective2: '',
      RAN2: '_',
    },
    { srNo1: 8, objective1: 'Equivalence', RAN1: '_', srNo2: 16, objective2: '', RAN2: '_' },
  ]

  const behave1 = [
    {
      srNo2: 5,
      behaviour2: '',
      data2: 0,
      progress2: '_',
      srNo1: 1,
      behaviour1: 'Aggression',
      data1: 0,
      progress1: '_',
    },
    {
      srNo2: 6,
      behaviour2: '',
      data2: 0,
      progress2: '_',
      srNo1: 2,
      behaviour1: 'Elopement',
      data1: 0,
      progress1: '_',
    },
    {
      srNo2: 7,
      behaviour2: '',
      data2: 0,
      progress2: '_',
      srNo1: 3,
      behaviour1: 'Property Destruction',
      data1: 0,
      progress1: '_',
    },
    {
      srNo2: 8,
      behaviour2: '',
      data2: 0,
      progress2: '_',
      srNo1: 4,
      behaviour1: 'Redirection/Task Refusal',
      data1: 4,
      progress1: '_',
    },
  ]

  if (!selectSessionId) {
    return <p>Session Id Not Selected</p>
  }
  const { data: studentData, loading: studentLoading, error: studentError } = useQuery(STUDENT_DETAILS, {
    variables: {
      studentId: localStorage.getItem('studentId'),
      childSessionId: selectSessionId
    }
  })

  useEffect(() => {
    if (studentData && studentData.getSessionDataRecording) {
      console.log(studentData)

      const item = studentData.getSessionDataRecording.edges
      const Mand = studentData.getSessionDataRecording.mandCount
      const Behaviours = studentData.getSessionDataRecording.behCount

      const sessionArray = []
      let No = 0
      let Prompted = 0
      let Correct = 0
      let Incorrect = 0
      let totalTrial = 0
      const cardStyle = { padding: 5 }

      if (item !== undefined) {
        for (let i = 0; i < item.length; i += 1) {
          if (item[i].node.targets.targetAllcatedDetails.targetType.id === peakId) {
            const obj = item[i].node.peak
            sessionArray.push({
              ...obj,
              totalTrial: obj.totalPrompt + obj.totalError + obj.totalCorrect,
              totalIncorrect: obj.totalError,
              totalNr: 0,

            })
          } else sessionArray.push(item[i].node.sessionRecord)
        }
        sessionArray.forEach(entry => {
          totalTrial += entry.totalTrial
          Prompted += entry.totalPrompt
          Correct += entry.totalCorrect
          No += entry.totalNr
          Incorrect += entry.totalIncorrect

        })
        setTotalTrials(totalTrial)
        setCorrectTrials(Correct)
        setIncorrectTrials(Incorrect)
        setPromptedTrials(Prompted)
        setNoTrials(No)

      }
    }
  }, [studentData])

  return (
    <PDFViewer style={{ width: '100%', height: '1200px' }}>
      {studentData && (
        <Document>
          <Page
            size={[700, 1200]}
            // size={[600, 1200]}
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              padding: 10,
            }}
            wrap={false}
            scale={5}
          >
            <View style={{ width: '100%', height: '100%', margin: 'auto' }}>
              <View style={sectionMain}>
                <View style={{ ...section }}>
                  <View style={col}>
                    <Text style={sText}>Client details</Text>
                    <Text style={sText}>{' '}</Text>
                  </View>
                  <View style={col}>
                    <Text style={{ fontSize: 18 }}>{studentData?.student.firstname} </Text>
                  </View>
                  <View style={{ ...col, width: '12%' }}>
                    <Text style={headerTextBorder}>DOB </Text>
                    <Text style={mText}> {studentData?.student.dob && (moment(studentData?.student.dob).format('DD/MM/YYYY'))}</Text>
                  </View>
                  <View style={{ ...col, width: '12%' }}>
                    <Text style={headerTextBorder}>Date</Text>
                    <Text style={mText}> 04/06/2020</Text>
                  </View>
                  <View style={{ ...col, width: '25%' }}>
                    <Text style={headerTextBorder}>Location</Text>
                    <Text style={mText}>{studentData?.student.clinicLocation?.location}{' '}</Text>
                  </View>
                  <View style={{ ...col, width: '12%' }}>
                    <Text style={headerTextBorder}>Start Time</Text>
                    <Text style={mText}> 8:45</Text>
                  </View>
                  <View style={{ ...col }}>
                    <Text style={headerTextBorder}>End Time</Text>
                    <Text style={mText}> 10:45</Text>
                  </View>
                  <View style={{ ...col, borderRight: 'none' }}>
                    <Text style={headerTextBorder}>Targets</Text>
                    <Text style={mText}>{studentData?.getSessionDataRecording?.totalTarget} </Text>
                  </View>
                </View>

                <View style={{ ...section }}>
                  <View style={{ ...col, width: '10%', backgroundColor: '#e8e8e8' }}>
                    <Text style={headerText}>Provider </Text>
                  </View>
                  <View style={{ ...col, width: '29%' }}>
                    <Text style={{ ...mText, textAlign: 'left', paddingLeft: 4 }}>
                      Allison Olmstead ha ha what do you adya dude
                    </Text>
                  </View>
                  <View style={{ ...col, width: '22%' }}>
                    <Text style={mText}>__BCBA __RBT </Text>
                  </View>
                  <View style={{ ...col, width: '10%', backgroundColor: '#e8e8e8' }}>
                    <Text style={headerText}>Category </Text>
                  </View>
                  <View style={{ ...col, borderRight: 'none', width: '29%' }}>
                    <Text style={{ ...mText, textAlign: 'left', paddingLeft: 4 }}>
                      {studentData?.student.category?.category}{' '}
                    </Text>
                  </View>
                </View>

                <View style={{ ...section }}>
                  <View style={{ ...col, width: '50%', ...bg }}>
                    <Text style={headerText}>INTERVENTIONS USED THROUGHOUT SESSION </Text>
                  </View>
                  <View style={{ ...col, width: '50%', ...bg, borderRight: 'none' }}>
                    <Text style={headerText}>RESPONSE TO INTERVENTIONS</Text>
                  </View>
                </View>

                {/* {ad.map(item => {
                  return (
                    <View style={section}>
                      <View style={{ ...col, width: '4%', ...bg }}>
                        <Text>{item.srNo1}</Text>
                      </View>
                      <View style={{ ...col, width: '21%' }}>
                        <Text style={sText}>{item.t1}</Text>
                      </View>
                      <View style={{ ...col, width: '4%', ...bg }}>
                        <Text>{item.s2}</Text>
                      </View>
                      <View style={{ ...col, width: '21%' }}>
                        <Text style={sText}>{item.t2}</Text>
                      </View>
                      <View style={{ ...col, width: '4%', ...bg }}>
                        <Text>{item.s3}</Text>
                      </View>
                      <View style={{ ...col, width: '21%' }}>
                        <Text style={sText}>{item.t3}</Text>
                      </View>
                      <View style={{ ...col, width: '4%', ...bg }}>
                        <Text>{item.s4}</Text>
                      </View>
                      <View style={{ ...col, width: '21%' }}>
                        <Text style={sText}>{item.t4}</Text>
                      </View>
                    </View>
                  )
                })} */}

                <View style={{ ...section, borderBottom: 'none' }}>
                  <View style={{ width: '50%', flexDirection: 'column' }}>
                    {ad.map(item => {
                      return (
                        <View style={section}>
                          <View style={{ ...col, width: '8%', ...bg }}>
                            <Text>{item.s1}</Text>
                          </View>
                          <View style={{ ...col, width: '42%' }}>
                            <Text style={sText}>{item.t1}</Text>
                          </View>
                          <View style={{ ...col, width: '8%', ...bg }}>
                            <Text>{item.s2}</Text>
                          </View>
                          <View style={{ ...col, width: '42%' }}>
                            <Text style={sText}>{item.t2}</Text>
                          </View>
                        </View>
                      )
                    })}
                  </View>
                  <View style={{ width: '50%', flexDirection: 'column' }}>
                    {ad.map(item => {
                      return (
                        <View style={section}>
                          <View style={{ ...col, width: '8%', ...bg }}>
                            <Text>{item.s3}</Text>
                          </View>
                          <View style={{ ...col, width: '42%' }}>
                            <Text style={sText}>{item.t3}</Text>
                          </View>
                          <View style={{ ...col, width: '8%', ...bg }}>
                            <Text>{item.s4}</Text>
                          </View>
                          <View style={{ ...col, width: '42%' }}>
                            <Text style={sText}>{item.t4}</Text>
                          </View>
                        </View>
                      )
                    })}
                  </View>

                </View>

                <View style={{ ...section, borderBottom: 'none' }}>
                  <View
                    style={{
                      ...col,
                      ...bg,
                      ...borderBottom,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      width: '4%',
                      alignItems: 'center',
                      fontSize: 9,
                    }}
                  >
                    <View style={{ flexDirection: 'column', width: '50%', margin: 'auto 0' }}>
                      <Text>D</Text>
                      <Text>E</Text>
                      <Text>C</Text>
                      <Text>E</Text>
                      <Text>L</Text>
                    </View>
                    <View style={{ flexDirection: 'column', width: '50%' }}>
                      <Text>T</Text>
                      <Text>A</Text>
                      <Text>R</Text>
                      <Text>G</Text>
                      <Text>E</Text>
                      <Text>T</Text>
                    </View>
                  </View>

                  <View style={{ width: '80%', flexDirection: 'column' }}>
                    <View style={{ ...section, backgroundColor: '#e8e8e8' }}>
                      <View style={{ ...col, width: '3%' }}>
                        <Text style={headerText}>#</Text>
                      </View>
                      <View style={{ ...col, width: '28%' }}>
                        <Text style={headerText}>BEHAVIOR</Text>
                      </View>
                      <View style={{ ...col, width: '7%' }}>
                        <Text style={headerText}>DATA</Text>
                      </View>
                      <View style={{ ...col, width: '12%' }}>
                        <Text style={headerText}>PROGRESS</Text>
                      </View>
                      <View style={{ ...col, width: '3%' }}>
                        <Text style={headerText}>#</Text>
                      </View>
                      <View style={{ ...col, width: '28%' }}>
                        <Text style={headerText}>BEHAVIOR</Text>
                      </View>
                      <View style={{ ...col, width: '7%' }}>
                        <Text style={headerText}>DATA</Text>
                      </View>
                      <View style={{ ...col, width: '12%' }}>
                        <Text style={headerText}>PROGRESS</Text>
                      </View>
                    </View>
                    {behave1.map(item => {
                      return (
                        <View style={{ ...section }}>
                          <View style={{ ...col, width: '3%' }}>
                            <Text style={mText}>{item.srNo1}</Text>
                          </View>
                          <View style={{ ...col, width: '28%' }}>
                            <Text style={sText}>{item.behaviour1}</Text>
                          </View>
                          <View style={{ ...col, width: '7%' }}>
                            <Text style={sText}>{item.data1}</Text>
                          </View>
                          <View style={{ ...col, width: '12%' }}>
                            <Text style={sText}>{item.progress1}</Text>
                          </View>
                          <View style={{ ...col, width: '3%' }}>
                            <Text style={mText}>{item.srNo2}</Text>
                          </View>
                          <View style={{ ...col, width: '28%' }}>
                            <Text style={sText}>{item.behaviour2}</Text>
                          </View>
                          <View style={{ ...col, width: '7%' }}>
                            <Text style={sText}>{item.data2}</Text>
                          </View>
                          <View style={{ ...col, width: '12%' }}>
                            <Text style={sText}>{item.progress2}</Text>
                          </View>
                        </View>
                      )
                    })}
                  </View>

                  <View
                    style={{
                      ...col,
                      ...bg,
                      width: '3%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      backgroundColor: '#e8e8e8',
                      fontSize: 10,
                      borderBottom: '1px solid black',
                    }}
                  >
                    <Text>K</Text>
                    <Text>E</Text>
                    <Text>Y</Text>
                  </View>

                  <View style={{ width: '13%', flexDirection: 'column' }}>
                    <View style={{ ...section, height: 20 }}>
                      <View style={{ ...col, width: 20 }}>
                        <Text style={mText}>P</Text>
                      </View>
                      <Text style={mText}>Progress</Text>
                    </View>
                    <View style={{ ...section, height: 20 }}>
                      <View style={{ ...col, width: 20 }}>
                        <Text style={mText}>M</Text>
                      </View>
                      <Text style={mText}>Maintaining</Text>
                    </View>
                    <View style={{ ...section, height: 20 }}>
                      <View style={{ ...col, width: 20 }}>
                        <Text style={mText}>N</Text>
                      </View>
                      <Text style={mText}>No Progress</Text>
                    </View>
                    <View style={{ ...section, height: 20 }}>
                      <View style={{ ...col, width: 20 }}>
                        <Text style={mText}>{}</Text>
                      </View>
                      <Text style={mText}>{}</Text>
                    </View>
                    <View style={{ ...section, height: 20 }}>
                      <View style={{ ...col, width: 20 }}>
                        <Text style={mText}>{}</Text>
                      </View>
                      <Text style={mText}>{}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ ...section, textAlign: 'center' }}>
                  <Text style={headerText}>ACQUISITION SKILLS</Text>
                </View>

                <View style={{ ...section, backgroundColor: '#e8e8e8' }}>
                  <View style={{ ...col }}>
                    <Text style={headerText}>#</Text>
                  </View>
                  <View style={{ ...col, width: '72%' }}>
                    <Text style={headerText}>Objective</Text>
                  </View>
                  <View style={{ ...col, width: '20%' }}>
                    <Text style={headerText}>Correct Trials</Text>
                  </View>
                </View>
                {studentData.getSessionDataRecording.edges.map((item, index)=> {
                  return (
                    <View style={{ ...section }}>
                      {item.node.targets.targetAllcatedDetails.targetType.id === peakId ?
                        <>
                          <View style={{ ...col }}>
                            <Text style={sText}>{index+1}</Text>
                          </View>
                          <View style={{ ...col, width: '72%' }}>
                            <Text style={sText}>{item.node.targets.targetAllcatedDetails.targetName}</Text>
                          </View>
                          <View style={{ ...col, width: '20%' }}>
                            <Text style={sText}>{item.node.peak.totalCorrect}</Text>
                          </View>
                        </>
                        :
                        <>
                          <View style={{ ...col }}>
                            <Text style={sText}>{index+1}</Text>
                          </View>
                          <View style={{ ...col, width: '72%' }}>
                            <Text style={sText}>{item.node.targets.targetAllcatedDetails.targetName}</Text>
                          </View>
                          <View style={{ ...col, width: '20%' }}>
                            <Text style={sText}>{item.node.sessionRecord.totalCorrect}</Text>
                          </View>
                        </>
                      }

                    </View>
                  )
                })}

                <View style={section}>
                  <View
                    style={{
                      ...col,
                      width: '5%',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      backgroundColor: '#e8e8e8',
                      fontSize: 11,
                    }}
                  >
                    <View style={{ flexDirection: 'column', width: '100%', margin: 'auto 0' }}>
                      <Text>N</Text>
                      <Text>O</Text>
                      <Text>T</Text>
                      <Text>E</Text>
                      <Text>S</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      padding: 0,
                      width: '95%',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        height: 140,
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <View
                        style={{
                          width: '60%',
                          height: '100%',
                          flexDirection: 'column',
                          borderRight: '1px solid black',
                        }}
                      >
                        <View
                          style={{
                            width: '100%',
                            backgroundColor: '#e8e8e8',
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: 8, fontSize: 11 }}>CAREGIVER REPORT</Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <Text style={{ padding: 8, fontSize: 11 }}>{studentData?.childSessionDetails?.feedback}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '40%',
                          height: '100%',
                          flexDirection: 'column',
                        }}
                      >
                        <View
                          style={{
                            width: '100%',
                            backgroundColor: '#e8e8e8',
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: 8, fontSize: 11 }}>NEEDS FOR NEXT SESSION</Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <Text style={{ padding: 8, fontSize: 11 }}>{}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={section}>
                  <View style={{ ...col, width: '35%', flexDirection: 'column' }}>
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: '#e8e8e8',
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={headerText}>CAREGIVER SIGNATURE</Text>
                    </View>
                    <View style={{ width: '100%', height: 40 }}>
                      <Text style={{ padding: 4 }}>signature</Text>
                    </View>
                  </View>
                  <View style={{ ...col, width: '35%', flexDirection: 'column' }}>
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: '#e8e8e8',
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={headerText}>PROVIDER SIGNATURE</Text>
                    </View>
                    <View style={{ width: '100%', height: 40 }}>
                      <Text style={{ padding: 4 }}>signature</Text>
                    </View>
                  </View>
                  <View style={{ ...col, width: '30%', flexDirection: 'column', borderLeft: 'none' }}>
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: '#e8e8e8',
                        textAlign: 'center',
                        borderBottom: '1ps solid black',
                      }}
                    >
                      <Text style={headerTextBorder}>DATE</Text>
                    </View>
                    <View style={{ width: '100%', borderBottom: '1px solid black' }}>
                      <Text style={mText}>20/04/2021</Text>
                    </View>
                    <View style={{ width: '100%' }}>
                      <Text style={mText}>
                        {'_ '} BCBA {'_ '} RBT
                    </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      )}
    </PDFViewer>
  )
}

export default PrintableInvoice
