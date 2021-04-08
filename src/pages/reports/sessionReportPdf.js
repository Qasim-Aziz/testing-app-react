/* eslint-disable prefer-template */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, Image, Font, PDFViewer } from '@react-pdf/renderer'
import { ToWords } from 'to-words'
import { useQuery } from 'react-apollo'
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

function PrintableInvoice() {
  const acquisitionSkills1 = [
    { srNo: 1, objective: '6D- Abstraction: Number Concepts', RAN: '_' },
    { srNo: 2, objective: '12O- Tact Time', RAN: '_' },
    { srNo: 3, objective: '14B- Subtraction ', RAN: '_' },
    { srNo: 4, objective: 'Behavior Chain- 5 steps directions', RAN: '_' },
    { srNo: 5, objective: 'Problem solving', RAN: '_' },
    { srNo: 6, objective: 'Fractions', RAN: '_' },
    { srNo: 7, objective: 'Answering Wh Questions', RAN: '_' },
    { srNo: 8, objective: 'Equivalence', RAN: '_' },
  ]
  const acquisitionSkills2 = [
    { srNo: 9, objective: 'Transformation', RAN: '_' },
    { srNo: 10, objective: '', RAN: '_' },
    { srNo: 11, objective: '', RAN: '_' },
    { srNo: 12, objective: '', RAN: '_' },
    { srNo: 13, objective: '', RAN: '_' },
    { srNo: 14, objective: '', RAN: '_' },
    { srNo: 15, objective: '', RAN: '_' },
    { srNo: 16, objective: '', RAN: '_' },
  ]
  const behave1 = [
    { srNo: 1, behaviour: 'Aggression', data: 0, progress: '_' },
    { srNo: 2, behaviour: 'Elopement', data: 0, progress: '_' },
    { srNo: 3, behaviour: 'Property Destruction', data: 0, progress: '_' },
    { srNo: 4, behaviour: 'Redirection/Task Refusal', data: 4, progress: '_' },
  ]
  const behave2 = [
    { srNo: 5, behaviour: '', data: 0, progress: '_' },
    { srNo: 6, behaviour: '', data: 0, progress: '_' },
    { srNo: 7, behaviour: '', data: 0, progress: '_' },
    { srNo: 8, behaviour: '', data: 0, progress: '_' },
  ]

  return (
    <PDFViewer style={{ width: '100%', height: '1200px' }}>
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
                  <Text style={sText}>details</Text>
                </View>
                <View style={col}>
                  <Text style={{ fontSize: 20 }}>AlBa </Text>
                </View>
                <View style={{ ...col, width: '12%' }}>
                  <Text style={headerTextBorder}>DOB </Text>
                  <Text style={mText}> 12/07/07</Text>
                </View>
                <View style={{ ...col, width: '12%' }}>
                  <Text style={headerTextBorder}>Date</Text>
                  <Text style={mText}> 04/06/2020</Text>
                </View>
                <View style={{ ...col, width: '25%' }}>
                  <Text style={headerTextBorder}>Location</Text>
                  <Text style={mText}> sector 49, Gurugram</Text>
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
                  <Text style={headerTextBorder}>Units</Text>
                  <Text style={mText}> 8</Text>
                </View>
              </View>

              <View style={{ ...section }}>
                <View style={{ ...col, width: '10%', backgroundColor: '#e8e8e8' }}>
                  <Text style={headerText}>Provider </Text>
                </View>
                <View style={{ ...col, width: '30%' }}>
                  <Text style={{ ...mText, textAlign: 'left', paddingLeft: 4 }}>
                    Allison Olmstead ha ha what do you adya dude
                  </Text>
                </View>
                <View style={{ ...col, width: '22%' }}>
                  <Text style={mText}>__BCBA __RBT </Text>
                </View>
                <View style={{ ...col, width: '10%', backgroundColor: '#e8e8e8' }}>
                  <Text style={headerText}>Purpose </Text>
                </View>
                <View style={{ ...col, borderRight: 'none', width: '30%' }}>
                  <Text style={{ ...mText, textAlign: 'left', paddingLeft: 4 }}>
                    Direct Service{' '}
                  </Text>
                </View>
              </View>
              <View style={{ ...section }}>
                <View style={{ width: '38%', flexDirection: 'column' }}>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      backgroundColor: '#e8e8e8',
                      height: 20,
                      textAlign: 'center',
                      borderBottom: '1px solid black',
                    }}
                  >
                    <Text style={{ padding: 4, fontSize: 10, fontWeight: 'bold' }}>
                      SIGNS/SYMPTOMS OBSERVED TODAY
                    </Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      borderBottom: '1px solid black',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        padding: 4,
                        width: '42%',
                        fontSize: 8,
                        borderRight: '1px solid black',
                      }}
                    >
                      Receptive lang.deficits
                    </Text>
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text style={{ padding: 4, fontSize: 8 }}> Deficits in adapt. skills</Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      flexDirection: 'row',
                      borderBottom: '1px solid black',
                    }}
                  >
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        padding: 4,
                        fontSize: 8,
                        width: '42%',
                        borderRight: '1px solid black',
                      }}
                    >
                      Functional comm. Defict
                    </Text>
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text style={{ padding: 4, fontSize: 8, letterSpacing: 0.5 }}>
                      Deficits in safety skills
                    </Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      borderBottom: '1px solid black',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        width: '42%',
                        padding: 4,
                        fontSize: 8,
                        borderRight: '1px solid black',
                      }}
                    >
                      Deficits in play skills
                    </Text>
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text style={{ padding: 4, fontSize: 8 }}>Restricted interests</Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        width: '42%',
                        padding: 4,
                        fontSize: 8,
                        borderRight: '1px solid black',
                      }}
                    >
                      Social inter. deficits
                    </Text>
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text style={{ padding: 4, fontSize: 8 }}> Problematic behavior</Text>
                  </View>
                </View>
                <View style={{ width: '38%', flexDirection: 'column' }}>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      backgroundColor: '#e8e8e8',
                      height: 20,
                      textAlign: 'center',
                      borderBottom: '1px solid black',
                    }}
                  >
                    <Text style={{ padding: 4, fontSize: 8 }}>
                      INTERVENTIONS USED THROUGHOUT SESSION{' '}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      borderBottom: '1px solid black',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        padding: 4,
                        width: '42%',
                        fontSize: 8,
                        borderRight: '1px solid black',
                      }}
                    >
                      Differential Reinforcement{' '}
                    </Text>
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text style={{ padding: 4, fontSize: 8 }}> Discrete Trial Training</Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      flexDirection: 'row',
                      borderBottom: '1px solid black',
                    }}
                  >
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        padding: 4,
                        fontSize: 8,
                        width: '42%',
                        borderRight: '1px solid black',
                      }}
                    >
                      Function Based Treatments
                    </Text>
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text style={{ padding: 4, fontSize: 8, letterSpacing: 0.5 }}>
                      Shaping/Chaining
                    </Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      borderBottom: '1px solid black',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        width: '42%',
                        padding: 4,
                        fontSize: 8,
                        borderRight: '1px solid black',
                      }}
                    >
                      Antecedent Manipulation
                    </Text>
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text style={{ padding: 4, fontSize: 8 }}>Response Blocking</Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        width: '42%',
                        padding: 4,
                        fontSize: 8,
                        borderRight: '1px solid black',
                      }}
                    >
                      Incidental Teaching{' '}
                    </Text>
                    <View
                      style={{
                        width: '8%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                  </View>
                </View>
                <View style={{ width: '24%', flexDirection: 'column' }}>
                  <View
                    style={{
                      ...col,
                      borderRight: 'none',
                      width: '100%',
                      padding: 0,
                      backgroundColor: '#e8e8e8',
                      height: 20,
                      textAlign: 'center',
                      borderBottom: '1px solid black',
                    }}
                  >
                    <Text style={{ padding: 4, fontSize: 8 }}>RESPONSE TO INTERVENTIONS</Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      borderBottom: '1px solid black',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '10%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        padding: 4,
                        width: '90%',
                        fontSize: 8,
                      }}
                    >
                      Differential Reinforcement
                    </Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      flexDirection: 'row',
                      borderBottom: '1px solid black',
                    }}
                  >
                    <View
                      style={{
                        width: '10%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        padding: 4,
                        fontSize: 8,
                        width: '90%',
                      }}
                    >
                      Function Based Treatments
                    </Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      borderBottom: '1px solid black',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '10%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                    <Text
                      style={{
                        width: '90%',
                        padding: 4,
                        fontSize: 8,
                      }}
                    >
                      Antecedent Manipulation
                    </Text>
                  </View>
                  <View
                    style={{
                      ...col,
                      width: '100%',
                      padding: 0,
                      height: 20,
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '10%',
                        backgroundColor: '#e8e8e8',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text> </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ ...section, borderBottom: 'none' }}>
                <View
                  style={{
                    ...col,
                    width: '5%',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: '#e8e8e8',
                    fontSize: 12,
                    borderBottom: '1px solid black',
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
                <View style={{ width: '40%', flexDirection: 'column' }}>
                  <View style={{ width: '100%', flexDirection: 'row', backgroundColor: '#e8e8e8' }}>
                    <View
                      style={{
                        ...col,
                        width: '8%',
                        padding: 0,
                        backgroundColor: '#e8e8e8',
                        height: 20,
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: '4px 0', height: '100%' }}>#</Text>
                    </View>
                    <View
                      style={{
                        ...col,
                        width: '48%',
                        padding: 0,
                        backgroundColor: '#e8e8e8',
                        height: 20,
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: '4px 0', height: '100%' }}>BEHAVIOR</Text>
                    </View>
                    <View
                      style={{
                        ...col,
                        width: '16%',
                        padding: 0,
                        backgroundColor: '#e8e8e8',
                        height: 20,
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: '4px 0', height: '100%' }}>DATA</Text>
                    </View>
                    <View
                      style={{
                        ...col,
                        width: '28%',
                        padding: 0,
                        backgroundColor: '#e8e8e8',
                        height: 20,
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: '4px 0', height: '100%' }}>PROGRESS</Text>
                    </View>
                  </View>
                  {behave1.map(item => {
                    return (
                      <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View
                          style={{
                            ...col,
                            width: '8%',
                            padding: 0,
                            height: 20,
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: '4px 0', height: '100%' }}>{item.srNo}</Text>
                        </View>
                        <View
                          style={{
                            ...col,
                            width: '48%',
                            padding: 0,
                            height: 20,
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: '4px 0', height: '100%' }}>{item.behaviour}</Text>
                        </View>
                        <View
                          style={{
                            ...col,
                            width: '16%',
                            padding: 0,
                            height: 20,
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: '4px 0', height: '100%' }}>{item.data}</Text>
                        </View>
                        <View
                          style={{
                            ...col,
                            width: '28%',
                            padding: 0,
                            height: 20,
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: '4px 0', height: '100%' }}>{item.progress}</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
                <View style={{ width: '40%', flexDirection: 'column' }}>
                  <View style={{ width: '100%', flexDirection: 'row', backgroundColor: '#e8e8e8' }}>
                    <View
                      style={{
                        ...col,
                        width: '8%',
                        padding: 0,
                        backgroundColor: '#e8e8e8',
                        height: 20,
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: '4px 0', height: '100%' }}>#</Text>
                    </View>
                    <View
                      style={{
                        ...col,
                        width: '48%',
                        padding: 0,
                        backgroundColor: '#e8e8e8',
                        height: 20,
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: '4px 0', height: '100%', fontSize: 12 }}>
                        BEHAVIOR
                      </Text>
                    </View>
                    <View
                      style={{
                        ...col,
                        width: '16%',
                        padding: 0,
                        backgroundColor: '#e8e8e8',
                        height: 20,
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text
                        style={{ padding: '4px 0', height: '100%', fontSize: 9, fontWeight: 700 }}
                      >
                        DATA
                      </Text>
                    </View>
                    <View
                      style={{
                        ...col,
                        width: '28%',
                        padding: 0,
                        backgroundColor: '#e8e8e8',
                        height: 20,
                        textAlign: 'center',
                        borderBottom: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: '4px 0', height: '100%' }}>PROGRESS</Text>
                    </View>
                  </View>
                  {behave2.map(item => {
                    return (
                      <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View
                          style={{
                            ...col,
                            width: '8%',
                            padding: 0,
                            height: 20,
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: '4px 0', height: '100%' }}>{item.srNo}</Text>
                        </View>
                        <View
                          style={{
                            ...col,
                            width: '48%',
                            padding: 0,
                            height: 20,
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: 4, height: '100%' }}>{item.behaviour}</Text>
                        </View>
                        <View
                          style={{
                            ...col,
                            width: '16%',
                            padding: 0,
                            height: 20,
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: '4px 0', height: '100%' }}>{item.data}</Text>
                        </View>
                        <View
                          style={{
                            ...col,
                            width: '28%',
                            padding: 0,
                            height: 20,
                            textAlign: 'center',
                            borderBottom: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: '4px 0', height: '100%' }}>{item.progress}</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
                <View
                  style={{
                    ...col,
                    width: '3%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: '#e8e8e8',
                    textAlign: 'center',
                    borderBottom: '1px solid black',
                  }}
                >
                  <Text>K</Text>
                  <Text>E</Text>
                  <Text>Y</Text>
                </View>
                <View style={{ width: '13%', flexDirection: 'column' }}>
                  <View style={{ ...section, height: 20 }}>
                    <Text style={{ ...col, width: 20 }}>P</Text>
                    <Text style={{ padding: '2px 4px', height: '100%' }}>Progress</Text>
                  </View>
                  <View style={{ ...section, height: 20 }}>
                    <Text style={{ ...col, width: 20 }}>M</Text>
                    <Text style={{ padding: '2px 4px', height: '100%' }}>Maintaining</Text>
                  </View>
                  <View style={{ ...section, height: 20 }}>
                    <Text style={{ ...col, width: 20 }}>N</Text>
                    <Text style={{ padding: '2px 4px', height: '100%' }}>No Progress</Text>
                  </View>
                  <View style={{ ...section, height: 20 }}>
                    <Text style={{ ...col, width: 20 }}>N</Text>
                    <Text style={{ padding: '2px 4px', height: '100%' }}>No Progress</Text>
                  </View>
                  <View style={{ ...section, height: 20 }}>
                    <Text style={{ ...col, width: 20 }}>{}</Text>
                    <Text style={{ padding: '2px 4px', height: '100%' }}>{}</Text>
                  </View>
                </View>
              </View>
              <View style={section}>
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: '#e8e8e8',
                    padding: '4px 0',
                  }}
                >
                  ACQUISITION SKILLS
                </Text>
              </View>

              <View style={{ ...section, borderBottom: 'none' }}>
                <View style={{ width: '50%', flexDirection: 'column' }}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#e8e8e8',
                      borderBottom: '1px solid black',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '10%',
                        textAlign: 'center',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: 4 }}>#</Text>
                    </View>
                    <View
                      style={{
                        width: '75%',
                        textAlign: 'center',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: 4 }}>Objective</Text>
                    </View>
                    <View
                      style={{
                        width: '15%',
                        textAlign: 'center',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: 4 }}>RAN</Text>
                    </View>
                  </View>
                  {acquisitionSkills1.map(item => {
                    return (
                      <View
                        style={{
                          width: '100%',
                          borderBottom: '1px solid black',
                          flexDirection: 'row',
                        }}
                      >
                        <View
                          style={{
                            width: '10%',
                            textAlign: 'center',
                            borderRight: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: 4 }}>{item.srNo}</Text>
                        </View>
                        <View
                          style={{
                            width: '75%',
                            textAlign: 'center',
                            borderRight: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: 4 }}>{item.objective}</Text>
                        </View>
                        <View
                          style={{
                            width: '15%',
                            textAlign: 'center',
                            borderRight: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: 4 }}>{item.ran}</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
                <View style={{ width: '50%', flexDirection: 'column' }}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#e8e8e8',
                      borderBottom: '1px solid black',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '10%',
                        textAlign: 'center',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: 4 }}>#</Text>
                    </View>
                    <View
                      style={{
                        width: '75%',
                        textAlign: 'center',
                        borderRight: '1px solid black',
                      }}
                    >
                      <Text style={{ padding: 4 }}>Objective</Text>
                    </View>
                    <View
                      style={{
                        width: '15%',
                        textAlign: 'center',
                      }}
                    >
                      <Text style={{ padding: 4 }}>RAN</Text>
                    </View>
                  </View>
                  {acquisitionSkills2.map(item => {
                    return (
                      <View
                        style={{
                          width: '100%',
                          borderBottom: '1px solid black',
                          flexDirection: 'row',
                        }}
                      >
                        <View
                          style={{
                            width: '10%',
                            textAlign: 'center',
                            borderRight: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: 4 }}>{item.srNo}</Text>
                        </View>
                        <View
                          style={{
                            width: '75%',
                            textAlign: 'center',
                            borderRight: '1px solid black',
                          }}
                        >
                          <Text style={{ padding: 4 }}>{item.objective}</Text>
                        </View>
                        <View
                          style={{
                            width: '15%',
                            textAlign: 'center',
                          }}
                        >
                          <Text style={{ padding: 4 }}>{item.ran}</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </View>
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
                    fontSize: 12,
                  }}
                >
                  <View style={{ flexDirection: 'column', width: '50%', margin: 'auto 0' }}>
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
                        <Text style={{ padding: 8, fontSize: 11 }}>{}</Text>
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
                  <View
                    style={{
                      width: '100%',
                      height: 140,
                      alignItems: 'center',
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
                      <Text style={{ padding: 8, fontSize: 11 }}>THERAPIST NOTES</Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Text style={{ padding: 8, fontSize: 11 }}>
                        AlBa reported events of the weekend and participated in behavior mapping.
                        AlBa required redirection & prompts to complete the behavior maps and
                        identify alternative behaviors/choices. AlBa continues to show progress with
                        programs with redirection to stay on task. Fluctuation was observed in
                        performance without prompts and reminders of the goals he had set. AlBa
                        continues to make progress with ABA services.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={section}>
                <View
                  style={{ width: '35%', flexDirection: 'column', borderRight: '1px solid black' }}
                >
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#e8e8e8',
                      textAlign: 'center',
                      borderBottom: '1px solid black',
                    }}
                  >
                    <Text style={{ padding: 4 }}>CAREGIVER SIGNATURE</Text>
                  </View>
                  <View style={{ width: '100%', height: 40 }}>
                    <Text style={{ padding: 4 }}>signature</Text>
                  </View>
                </View>
                <View
                  style={{ width: '35%', flexDirection: 'column', borderRight: '1px solid black' }}
                >
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#e8e8e8',
                      textAlign: 'center',
                      borderBottom: '1px solid black',
                    }}
                  >
                    <Text style={{ padding: 4 }}>PROVIDER SIGNATURE</Text>
                  </View>
                  <View style={{ width: '100%', height: 40 }}>
                    <Text style={{ padding: 4 }}>signature</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '30%',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#e8e8e8',
                      textAlign: 'center',
                      borderBottom: '1ps solid black',
                    }}
                  >
                    <Text style={{ padding: 4 }}>DATE</Text>
                  </View>
                  <View style={{ width: '100%', borderBottom: '1px solid black' }}>
                    <Text style={{ padding: 4 }}>20/04/2021</Text>
                  </View>
                  <View style={{ width: '100%' }}>
                    <Text style={{ padding: 4 }}>
                      {'_ '} BCBA {'_ '} RBT
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default PrintableInvoice
