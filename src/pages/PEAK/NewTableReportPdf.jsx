/* eslint-disable prefer-template */
/* eslint-disable  */
import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import { Typography, Row, Layout, Col, Tabs, Card, Table, Tag, Select, Button } from 'antd'
import moment from 'moment'
import apolloClient from '../../apollo/config'

const getStudentDetails = gql`
  query student($id: ID!) {
    student(id: $id) {
      id
      firstname
      lastname
      dob
      internalNo
    }
  }
`

function calculateAge(birthday) {
  // birthday is a date
  const ageDifMs = Date.now() - birthday.getTime()
  const ageDate = new Date(ageDifMs) // miliseconds from epoch
  const a = moment()
  const b = moment(birthday)
  const years = a.diff(b, 'year')
  b.add(years, 'years')

  const months = a.diff(b, 'months')
  b.add(months, 'months')

  const days = a.diff(b, 'days')

  // console.log(years + ' years ' + months + ' months ' + days + ' days');

  // return Math.abs(ageDate.getUTCFullYear() - 1970);
  return ' ' + years + ' years ' + months + ' months'
}

function calculateAge2() {
  // birthday is a date
  const PeakFactorAge = localStorage.getItem('PeakFactorAge')

  return PeakFactorAge
}

const textStyle = { fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }
const headStyle = {
  alignSelf: 'center',
  width: '98%',
  height: 30,
  borderWidth: 1,
  borderColor: '#000',
  justifyContent: 'space-around',
  flexDirection: 'row',
}

// Create Document Component
const MyDocument = ({ peakType, defaultScores, tdata, student }) => {

  console.log('default valyes ============>',peakType, defaultScores, tdata, student )
  
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false} scale={5.0}>
        <View style={styles.section}>
          <Text style={{ textAlign: 'center' }}>Peak Table Report</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12 }}>
              Name: {student?.student?.firstname} {`${student?.student?.lastname}`}
            </Text>
            <Text style={{ fontSize: 12 }}>
              Age:{calculateAge(new Date(student?.student?.dob))}
            </Text>
          </View>

          <View>
            <View style={{ ...headStyle, height: 100, padding: 20, marginTop: 20 }}>
              <Text style={{ fontSize: 8, textAlign: 'center', width: '40%' }}>
                Selected Age Range Of the Child
              </Text>
              <Text style={{ fontSize: 8, textAlign: 'center', width: '18%' }}>
                {calculateAge2()}
              </Text>
              <Text style={{ fontSize: 8, width: '40%' }}>
                INSTRUCTIONS: Student Scores, Typical Age Scores and Difference Scores will
                automatically calculate when Age Range of Child is input AND when Factor Scoring
                Grid is completed. Use the information to determine Approximate Age Equivalent and
                select from dropdown.
              </Text>
            </View>
            <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 14, marginBottom: 10 }}>
              DIRECT TRAINING MODULE
            </Text>
            <View style={headStyle}>
              <Text style={{ ...textStyle, width: '45%', fontWeight: 700 }}>Peak Factor</Text>
              <Text style={{ ...textStyle, fontWeight: 700 }}>Score</Text>
              <Text style={{ ...textStyle, fontWeight: 700 }}>Typical Age Score</Text>
              <Text style={{ ...textStyle, fontWeight: 700 }}>Difference</Text>
              <Text style={{ ...textStyle, fontWeight: 700 }}>Approximate Age Equvalent</Text>
            </View>
            {tdata?.map((item, i) => (
              <View style={headStyle}>
                <Text style={{ ...textStyle, width: '45%' }}>{item.peak}</Text>
                <Text style={textStyle}>{item.s_score}</Text>
                <Text style={textStyle}>{item.t_age_score}</Text>
                <Text style={textStyle}>{item.difference}</Text>
                <Text style={textStyle}>{item.age}</Text>
              </View>
            ))}
            <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 14, marginBottom: 10 }}>
              TYPICAL AGE DISTRIBUTION OF PEAK FACTOR SCORES
            </Text>
            <View style={headStyle}>
              <Text style={{ ...textStyle, fontWeight: 'bold', width: '45%' }}>Peak Factor</Text>
              <Text style={{ ...textStyle, fontWeight: 'bold' }}>1-2 yrs</Text>
              <Text style={{ ...textStyle, fontWeight: 'bold' }}>3-4 yrs</Text>
              <Text style={{ ...textStyle, fontWeight: 'bold' }}>5-6 yrs</Text>
              <Text style={{ ...textStyle, fontWeight: 'bold' }}>7-8 yrs</Text>
              <Text style={{ ...textStyle, fontWeight: 'bold' }}>9-10 yrs</Text>
              {peakType === 'GENERALIZATION' && (
                <>
                  <Text style={{ ...textStyle, fontWeight: 'bold' }}>11-12 yrs</Text>
                  <Text style={{ ...textStyle, fontWeight: 'bold' }}>13-14 yrs</Text>
                  <Text style={{ ...textStyle, fontWeight: 'bold' }}>15+ yrs</Text>
                </>
              )}
            </View>
            {defaultScores.map(item => (
              <View style={headStyle}>
                <Text style={{ ...textStyle, width: '45%' }}>{item.name}</Text>
                <Text style={textStyle}>{item.first}</Text>
                <Text style={textStyle}>{item.second}</Text>
                <Text style={textStyle}>{item.third}</Text>
                <Text style={textStyle}>{item.fourth}</Text>
                <Text style={textStyle}>{item.fifth}</Text>
                {peakType === 'GENERALIZATION' && (
                  <>
                    <Text style={textStyle}>{item.sixth}</Text>
                    <Text style={textStyle}>{item.seventh}</Text>
                    <Text style={textStyle}>{item.eighth}</Text>
                  </>
                )}
              </View>
            ))}

            {/* <View>
            <Text>hellladasd</Text>
          </View> */}
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ({ tdata, defaultScores, peakType }) => {
  const sid = localStorage.getItem('studentId')
  const [student, setStudent] = useState(null)

  const { data: sdata, loading, error } = useQuery(getStudentDetails, {
    fetchPolicy: 'network-only',
    variables: {
      id: sid,
    },
  })

  useEffect(() => {
    if (sdata) {
      setStudent(sdata)
    }
  }, [sdata])

  return (
    <>
      {student && (
        <PDFViewer style={{ width: '100%', height: '700px' }}>
          <MyDocument
            tdata={tdata}
            peakType={peakType}
            defaultScores={defaultScores}
            student={student}
          />
        </PDFViewer>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    border: '1px solid #000',
    padding: 10,
    // height:'80vh',
    // width:'100%'
  },
  section: {
    margin: 10,
    padding: 10,
    // border:'1px solid #000',
    width: '100%',
    height: '95vh',
    // flexGrow: 1
  },
})
