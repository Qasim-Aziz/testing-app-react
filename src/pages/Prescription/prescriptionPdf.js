/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
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
import { notification } from 'antd'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import logo from 'images/CogniableLogo.jpeg'
import s1 from 'assets/fonts/SourceSerifPro/SourceSerifPro-Regular.ttf'
import s2 from 'assets/fonts/SourceSerifPro/SourceSerifPro-SemiBold.ttf'
import { COLORS } from 'assets/styles/globalStyles'
import { composeP } from 'ramda'

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

const general = {
  fontSize: '12px',
  fontFamily: 'Source Serif Pro',
  fontWeight: 'normal',
  padding: '5px 8px',
  color: 'black',
}

const sectionMain = {
  width: '100%',
  border: '1px solid black',
  color: 'black',
  height: '100%',
}
const section = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'row',
  color: 'black',
  width: '100%',
  borderBottom: '1px solid black',
}
const flexSection = {
  width: '100%',
  display: 'flex',
  color: 'black',
  flexDirection: 'row',
  padding: '5px 8px',
  textAlign: 'left',
}
const dateSection = {
  width: '40%',
  color: 'black',
  fontSize: 12,
  alignSelf: 'flex-start',
  textAlign: 'left',
  fontWeight: '500',
}

const dts = {
  ...dateSection,
  width: '20%',
  color: 'black',
  fontSize: 12,
  alignSelf: 'flex-start',
  textAlign: 'left',
  fontWeight: '500',
}
const rowStyle = {
  borderBottom: '1px solid black',
  display: 'flex',
  float: 'left',
  color: 'black',
  width: '100%',
  flexDirection: 'row',
}
const qtyCol = {
  ...general,
  display: 'flex',
  width: '12%',
  borderLeft: '1px solid black',
  backgroundColor: COLORS.palleteLightBlue,
}

const dtCol = {
  ...general,
  display: 'flex',
  width: '12%',
  borderLeft: '1px solid black',
  backgroundColor: 'white',
}

const serviceCol = {
  ...general,
  width: '35%',
  borderLeft: '1px solid black',
}
const rightText = { width: '100%', margin: 'auto 0', textAlign: 'right' }
const leftText = { width: '100%', margin: 'auto 0', textAlign: 'left' }
const taxSection = {
  ...general,
  padding: '0',
  width: '40%',
  maxWidth: '50%',
}

function PrintableInvoice({ data, closeDrawer }) {
  const [isValidImage, setIsValidImage] = useState(false)

  console.log(data, 'props')
  const obj = data.data.node
  const { school } = data.learners
  const { learners } = data

  console.log(obj)
  return (
    <div style={{ display: 'flex' }}>
      <PDFViewer style={{ margin: 'auto', width: '98%', height: '1200px' }}>
        <Document>
          <Page
            size={['700', '600']}
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
                <View style={{ ...section, height: '100px' }}>
                  <View style={{ width: '30%', alignSelf: 'center' }}>
                    <Image src={logo} style={{ width: '100%', alignSelf: 'center' }} />
                  </View>
                  <View
                    style={{
                      textAlign: 'center',
                      width: '250px',
                      alignSelf: 'center',
                      marginLeft: '20px',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        marginBottom: '4px',
                        width: '100%',
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      {school.schoolName}
                    </Text>
                    <Text
                      style={{
                        marginBottom: '4px',
                        fontSize: 12,
                        width: '100%',
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      {school.address}
                    </Text>
                    <Text
                      style={{
                        marginBottom: '4px',
                        fontSize: 12,
                        width: '100%',
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      GSTIN 34453ZXBSNBSD
                    </Text>
                  </View>
                </View>
                <View style={{ ...section, height: '120px', padding: '0' }}>
                  <View style={{ width: '50%', height: '100%', borderRight: '1px solid black' }}>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> Name</Text>
                      <Text style={{ ...dateSection, width: '60%' }}> : {learners.firstname}</Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> Weight</Text>
                      <Text style={{ ...dateSection, width: '60%' }}>
                        {' '}
                        : {obj.weight ? `${obj.weight} kg` : null}
                      </Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> Height</Text>
                      <Text style={{ ...dateSection, width: '60%' }}>
                        {' '}
                        : {obj.height ? `${obj.height} cm` : null}
                      </Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> Head Circum</Text>
                      <Text style={{ ...dateSection, width: '60%' }}>
                        : {obj.headCircumference ? `${obj.headCircumference} cm` : null}
                      </Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> Temperature</Text>
                      <Text style={{ ...dateSection, width: '60%' }}>
                        : {obj.temperature ? `${obj.temperature} C` : null}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '50%' }}>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}>Test Date</Text>
                      <Text style={{ ...dateSection, width: '60%' }}> : {obj.testDate}</Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}>Next Test Date</Text>
                      <Text style={{ ...dateSection, width: '60%' }}> : {obj.nextTestDate}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ ...section, height: '120px', padding: '4' }}>
                  <View style={{ width: '100%', height: '100%' }}>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dts, fontWeight: 'bold' }}> Diagnosis</Text>
                      <Text style={{ ...dateSection, width: '60%' }}>
                        :{' '}
                        {obj.diagnosis.edges.map((item, index) => {
                          if (index === 0) {
                            return <span>{item.node.name}</span>
                          }
                          return <span>, {item.node.name}</span>
                        })}
                      </Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '4' }}>
                      <Text style={{ ...dts, fontWeight: 'bold' }}> Tests</Text>
                      <Text style={{ ...dateSection, width: '60%' }}>
                        :{' '}
                        {obj.tests.edges.map((item, index) => {
                          if (index === 0) {
                            return <span>{item.node.name}</span>
                          }
                          return <span>, {item.node.name}</span>
                        })}
                      </Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '4' }}>
                      <Text style={{ ...dts, fontWeight: 'bold' }}> Complaints</Text>
                      <Text style={{ ...dateSection, width: '60%' }}>
                        :{' '}
                        {obj.complaints.edges.map((item, index) => {
                          if (index === 0) {
                            return <Text>{item.node.name}</Text>
                          }
                          return <span>, {item.node.name}</span>
                        })}
                      </Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '4' }}>
                      <Text style={{ ...dts, fontWeight: 'bold' }}> Advice</Text>
                      <Text style={{ ...dateSection, width: '60%' }}> : {obj.advice}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ ...rowStyle, backgroundColor: '#fafafa' }}>
                  <Text
                    style={{
                      ...qtyCol,
                      width: '6%',
                      alignSelf: 'flex-start',
                      borderLeft: 'none',
                    }}
                  >
                    #
                  </Text>
                  <View style={{ ...qtyCol, fontWeight: 'bold', width: '16%' }}>
                    <Text style={leftText}>Name</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold', width: '15%' }}>
                    <Text style={leftText}>Type</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold', width: '9%' }}>
                    <Text style={rightText}>Qty</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold', width: '9%' }}>
                    <Text style={rightText}>Unit</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold', width: '9%' }}>
                    <Text style={rightText}>Dosage</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold' }}>
                    <Text style={rightText}>When</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold' }}>
                    <Text style={rightText}>Frequency</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold' }}>
                    <Text style={rightText}>Duration</Text>
                  </View>
                </View>
                {obj.medicineItems.edges.map((item, index) => {
                  console.log(item, 'teet')
                  return (
                    <View key={Math.random()} style={rowStyle}>
                      <View
                        style={{
                          ...dtCol,
                          width: '6%',
                          borderLeft: 'none',
                        }}
                      >
                        <Text style={{ margin: 'auto' }}>{index + 1}. </Text>
                      </View>
                      <View style={{ ...dtCol, width: '16%' }}>
                        <Text style={leftText}>{item.node.name}</Text>
                      </View>
                      <View style={{ ...dtCol, width: '15%' }}>
                        <Text style={leftText}>{item.node.type}</Text>
                      </View>
                      <View style={{ ...dtCol, width: '9%' }}>
                        <Text style={rightText}>{item.node.qty}</Text>
                      </View>
                      <View style={{ ...dtCol, width: '9%' }}>
                        <Text style={rightText}>{item.node.unit}</Text>
                      </View>
                      <View style={{ ...dtCol, width: '9%' }}>
                        <Text style={rightText}>{item.node.dosage}</Text>
                      </View>
                      <View style={dtCol}>
                        <Text style={rightText}>{item.node.when}</Text>
                      </View>
                      <View style={dtCol}>
                        <Text style={rightText}>{item.node.frequency}</Text>
                      </View>
                      <View style={{ ...dtCol }}>
                        <Text style={rightText}>{item.node.duration}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
}

export default PrintableInvoice
