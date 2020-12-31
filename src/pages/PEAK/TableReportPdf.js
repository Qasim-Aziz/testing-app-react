/* eslint-disable prefer-template */
/* eslint-disable  react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Typography, Row, Layout, Col, Tabs, Card, Table, Tag, Select, Button } from 'antd'
import moment from 'moment'
import apolloClient from '../../apollo/config'


const data2 = [
  {
    key: '1',
    name: 'Foundational Learning Skills',
    first: 2,
    second: 30,
    third: 34,
    fourth: 34,
    fifth: 34,
  },
  {
    key: '2',
    name: 'Perceptual Learning Skills',
    first: 0,
    second: 18,
    third: 21,
    fourth: 22,
    fifth: 22,
  },
  {
    key: '3',
    name: 'Verbal Comprehension Skills',
    first: 0,
    second: 19,
    third: 80,
    fourth: 94,
    fifth: 100,
  },
  {
    key: '4',
    name: 'Verbal Reasoning, Memory, and Mathematical Skills',
    first: 0,
    second: 0,
    third: 10,
    fourth: 22,
    fifth: 28,
  },
  {
    key: '5',
    name: 'Total',
    first: 2,
    second: 67,
    third: 141,
    fourth: 172,
    fifth: 184,
  },
]
const getTableDataQuery = gql`
  mutation peakReport($pk: ID!){
    peakReport(
      input:{
          pk:$pk
      }
    )
    {
      fls
      pls
      vcs
      vrm
    }
 }`
const getStudentDetails = gql`
 query student($id:ID!){
  student(id:$id) {
      firstname
      lastname
      dob
      internalNo
      caseManager{
          id
          name
      }
      authStaff{
          edges {
              node {
                  id
                  name
              }
          }
      }
  }
}`

function calculateAge(birthday) { // birthday is a date
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  const a = moment();
  const b = moment(birthday)
  const years = a.diff(b, 'year');
  b.add(years, 'years');

  const months = a.diff(b, 'months');
  b.add(months, 'months');

  const days = a.diff(b, 'days');

  // console.log(years + ' years ' + months + ' months ' + days + ' days');

  // return Math.abs(ageDate.getUTCFullYear() - 1970);
  return ' ' + years + ' years ' + months + ' months'
}

function calculateAge2() { // birthday is a date
  const PeakFactorAge = localStorage.getItem('PeakFactorAge')

  return PeakFactorAge
}



// Create Document Component
const MyDocument = (data, student) => (
  <Document>
    <Page size="A4" style={styles.page} wrap={false} scale={5.0}>
      <View style={styles.section}>
        <Text style={{ textAlign: 'center' }}>Peak Table Report</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12 }}>Name: {data?.data?.student?.student?.firstname}{' '}{`${data?.data?.student?.student?.lastname}`}</Text>
          <Text style={{ fontSize: 12 }}>Age:{calculateAge(new Date(data?.data?.student?.student?.dob))}</Text>
        </View>

        <View>
          <View style={{ height: 100, flexDirection: 'row', justifyContent: 'space-around', width: '98%', alignSelf: 'center', borderWidth: 1, borderColor: '#000', padding: 20, marginTop: 20 }}>
            <Text style={{ fontSize: 8, textAlign: 'center', width: '40%' }}>Selected Age Range Of the Child</Text>
            <Text style={{ fontSize: 8, textAlign: 'center', width: '18%' }}>{calculateAge2()}</Text>
            <Text style={{ fontSize: 8, width: '40%' }}>
              INSTRUCTIONS: Student Scores, Typical Age Scores and Difference Scores will
              automatically calculate when Age Range of Child is input AND when Factor
              Scoring Grid is completed. Use the information to determine Approximate Age
              Equivalent and select from dropdown.
            </Text>
          </View>
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 14, marginBottom: 10 }}>
            DIRECT TRAINING MODULE
          </Text>
          <View style={{ alignSelf: 'center', width: '98%', height: 30, borderWidth: 1, borderColor: '#000', justifyContent: 'space-around', flexDirection: 'row' }}>
            <Text style={{ fontSize: 10, width: '45%', alignSelf: 'center', textAlign: 'center', fontWeight: '700' }}>Peak Factor</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center', fontWeight: '700' }}>Score</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center', fontWeight: '700' }}>Typical Age Score</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center', fontWeight: '700' }}>Difference</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center', fontWeight: '700' }}>Approximate Age Equvalent</Text>
          </View>
          {data?.data?.data?.map((item, i) => (
            <View style={{ alignSelf: 'center', width: '98%', height: 30, borderWidth: 1, borderColor: '#000', justifyContent: 'space-around', flexDirection: 'row' }}>
              <Text style={{ fontSize: 10, width: '45%', alignSelf: 'center' }}>{item.peak}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.s_score}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.t_age_score}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.difference}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.age}</Text>
            </View>))}
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 14, marginBottom: 10 }}>
            TYPICAL AGE DISTRIBUTION OF PEAK FACTOR SCORES
          </Text>
          <View style={{ alignSelf: 'center', width: '98%', height: 30, borderWidth: 1, borderColor: '#000', justifyContent: 'space-around', flexDirection: 'row' }}>
            <Text style={{ fontSize: 10, width: '45%', alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Peak Factor</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>1-2 yrs</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>3-4yrs</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>5-6 yrs</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>7-8 yrs</Text>
            <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>9-10 yrs</Text>
          </View>
          {data2.map((item, i) => (
            <View style={{ alignSelf: 'center', width: '98%', height: 30, borderWidth: 1, borderColor: '#000', justifyContent: 'space-around', flexDirection: 'row' }}>
              <Text style={{ fontSize: 10, width: '45%', alignSelf: 'center' }}>{item.name}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.first}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.second}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.third}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.fourth}</Text>
              <Text style={{ fontSize: 10, width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.fifth}</Text>
            </View>))}

          {/* <View>
            <Text>hellladasd</Text>
          </View> */}
        </View>
      </View>
    </Page>
  </Document>
);

export default () => {
  const programId = localStorage.getItem('peakId')
  const sid = localStorage.getItem('studentId')
  const [ldata, setLdata] = useState([])
  const [student, setStudent] = useState(null)
  const [gettableReport, { data: tableData, error: tableError, loading: tableLoading }] = useMutation(getTableDataQuery, { errorPolicy: 'all' })

  const { data: sdata, loading, error } = useQuery(getStudentDetails, {
    fetchPolicy: 'network-only',
    variables: {
      id: sid,
    },
  })


  const getAge = (key, value) => {
    // console.log(key, value, 'ooooooooooooooooooo');
    let y = '';
    if (key === "1") {
      switch (value) {
        case 2:
          y = '1-2 yrs'
          break;
        case 30:
          y = '3-4 yrs'
          break;
        case 34:
          y = '5-6 yrs'
          break;
        default:
          y = '5-6 yrs'
          break;
      }

    }
    if (key === "2") {
      switch (value) {
        case 0:
          y = '1-2 yrs'
          break;
        case 18:
          y = '3-4 yrs'
          break;
        case 21:
          y = '5-6 yrs'
          break;
        case 22:
          y = '7-8 yrs'
          break;
        default:
          break;
      }

    }
    if (key === "3") {
      switch (value) {
        case 0:
          y = '1-2 yrs'
          break;
        case 19:
          y = '3-4 yrs'
          break;
        case 80:
          y = '5-6 yrs'
          break;
        case 94:
          y = '7-8 yrs'
          break;
        case 100:
          y = '9-10 yrs'
          break;
        default:
          break;
      }


    }
    if (key === "4") {
      switch (value) {
        case 0:
          y = '1-2 yrs'
          break;
        case 10:
          y = '5-6 yrs'
          break;
        case 22:
          y = '7-8 yrs'
          break;
        case 28:
          y = '9-10 yrs'
          break;
        default:
          break;
      }

    }
    return y;
  }

  useEffect(() => {
    if (sdata) {
      gettableReport({ variables: { pk: programId } }).then((d) => {

        // console.log(d,'ddddddddddddddddddddd');
        // studentData()

        const tablereportdata = d?.data;
        const data = [
          {
            key: '1',
            peak: 'Foundational Learning Skills',
            s_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.score : 0,
            t_age_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.age_score : 0,
            difference: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.difference : 0,
            age: getAge("1", tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.age_score : 0)
          },
          {
            key: '2',
            peak: 'Perceptual Learning Skills',
            s_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.score : 0,
            t_age_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.age_score : 0,
            difference: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.difference : 0,
            age: getAge("2", tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.age_score : 0)
          },
          {
            key: '3',
            peak: 'Verbal Comprehension Skills',
            s_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.score : 0,
            t_age_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.age_score : 0,
            difference: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.difference : 0,
            age: getAge("3", tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.age_score : 0)
          },
          {
            key: '4',
            peak: 'Verbal Reasoning, Memory, and Mathematical Skills',
            s_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.score : 0,
            t_age_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.age_score : 0,
            difference: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.difference : 0,
            age: getAge("4", tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.age_score : 0)
          },
          {
            key: '5',
            peak: 'Total',
            s_score: (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.score : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.score : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.score : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.score : 0),
            t_age_score: (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.age_score : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.age_score : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.age_score : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.age_score : 0),
            difference: (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.difference : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.difference : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.difference : 0) + (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.difference : 0),
            age: ''
          },
        ]
        const s = {};
        s.data = data;
        s.student = sdata
        setLdata(data);
        setStudent(s)
        console.log(sdata);
      }).catch(err => {
        console.log(err);
      })
    }

  }, [sdata])
  return (
    <PDFViewer style={{ width: '100%', height: '700px' }}>
      {student && <MyDocument data={student} student={student} />}
    </PDFViewer>
  )
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    border: '1px solid #000',
    padding: 10
    // height:'80vh',
    // width:'100%'
  },
  section: {
    margin: 10,
    padding: 10,
    // border:'1px solid #000',
    width: '100%',
    height: '95vh'
    // flexGrow: 1
  }
});