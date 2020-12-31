/* eslint-disable camelcase */
/* eslint-disable prefer-template */
import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
// import './table.scss'
import { useHistory, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Typography, Row, Layout, Col, Card, Tabs, Table, Tag, Select, Button, Progress } from 'antd'
import moment from 'moment'
import apolloClient from '../../apollo/config'



const { Option } = Select
const { Title } = Typography



const SUMMERY = gql`
  query($program: ID!) {
    peakDataSummary(program: $program) {
      total
      totalAttended
      totalCorrect
      totalIncorrect
      totalNoResponse
      totalSkipped
      totalSuggested
      edges {
        node {
          id
          yes {
            edges {
              node {
                id
                code
              }
            }
          }
          no {
            edges {
              node {
                id
                code
              }
            }
          }
        }
      }
    }
  }
`
const getAllQuestionsCode = gql`
  query($type: String!) {
    peakGetCodes(peakType: $type) {
      edges {
        node {
          id
          peakType
          code
          description
          instructions
          expRes
        }
      }
    }
  }
`
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
 }
 `
const lastAssesmentQuery = gql`
mutation lastFourRecords($pk:ID!){
  lastFourRecords(input:{
      pk:$pk
  }){
      programs{
          id
          date
          user{
            id
            firstName
            lastName
          }
          student{
            id
              caseManager{
                  id
                  name
              }
          }
          submitpeakresponsesSet{
              edges{
                  node{
                      id
                      yes{
                          edges{
                              node{
                                  id
                                  code
                              }
                          }
                      }
                  }
              }
          }
      }
  }
}
`
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
const MyDocument = (data) => (
  <Document>
    <Page size="A4" style={styles.page} wrap={false} scale={5.0}>
      <View style={styles.section}>
        <Text style={{ textAlign: 'center' }}>Peak Triangle Report</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 100, marginTop: 20 }}>
          <Text style={{ fontSize: 12 }}>Name: {data?.data?.student?.firstname}{' '}{`${data?.data?.student?.lastname}`}</Text>

          <Text style={{ fontSize: 12 }}>Age:{calculateAge(new Date(data?.data?.student?.dob))}</Text>
        </View>
        {data?.data?.data?.map((item, i) => (
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>

            {item.map((e, index) =>
              <>
                {i !== 0 && index === 0 &&
                  <>
                    <View style={{ border: '1px solid #bcbcbc', height: 20, width: 20, justifyContent: 'center', backgroundColor: 'white' }}>
                      <Text>&nbsp;</Text>
                    </View>
                  </>
                }
                <View style={{ border: '1px solid #bcbcbc', height: 20, width: 20, justifyContent: 'center', backgroundColor: e.yes }}>
                  <Text style={{ alignSelf: 'center', fontSize: 7 }}>{e.code}</Text>
                </View>
                {i !== 0 && (index + 1) === item.length &&
                  <>
                    <View style={{ border: '1px solid #bcbcbc', height: 20, width: 20, justifyContent: 'center', backgroundColor: 'white' }}>
                      <Text>&nbsp;</Text>
                    </View>
                  </>
                }
              </>
            )}
          </View>
        ))}
        <View style={{ alignSelf: 'center', marginTop: 10, borderRadius: 10, }}>
          <View style={{ height: 15, borderColor: '#bcbcbc', borderWidth: 1, borderTopLeftRadius: 5, borderTopRightRadius: 5, width: "85%", flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center' }}>
            <Text style={{ alignSelf: 'center', textAlign: 'center', width: '33.3%', color: '#000', fontSize: 10 }}>Assessor Name</Text>
            <Text style={{ alignSelf: 'center', width: '33.3%', color: '#000', fontSize: 10 }}>Assessment Date</Text>
            <View style={{ backgroundColor: '#ffffff', width: '33.3%' }}>
              <Text style={{ alignSelf: 'center', color: '#000', fontSize: 10 }}>color</Text>
            </View>
          </View>

          <View style={{ height: 15, borderColor: '#bcbcbc', borderWidth: 1, width: "85%", flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center' }}>
            <Text style={{ width: '33.3%', textAlign: 'center', fontSize: 10 }}>{data?.data?.assesor ? JSON.parse(data?.data?.assesor) : null}</Text>
            <Text style={{ width: '33.3%', fontSize: 10 }}>{data?.data?.date}</Text>
            <View style={{ backgroundColor: '#f7ff00', width: '33.3%' }} />
          </View>
          {data?.data?.ldata.map((item, i) => (
            <View style={{ height: 15, borderColor: '#bcbcbc', borderWidth: 1, width: "85%", flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center' }}>
              <Text style={{ width: '33.3%', textAlign: 'center', fontSize: 10 }}>{item?.user?.firstName}</Text>
              <Text style={{ width: '33.3%', fontSize: 10 }}>{item?.date}</Text>
              <View style={{ backgroundColor: item?.color, width: '33.3%' }} />
            </View>
          ))}
        </View>
        {/* <Text>{JSON.stringify(data?.data?.ldata)}</Text> */}
      </View>
    </Page>
  </Document>
)

export default () => {
  const programId = localStorage.getItem('peakId')
  const peakType = localStorage.getItem('peakType')
  const sid = localStorage.getItem('studentId')
  const assesor = localStorage.getItem('userName')



  const [allcode, setAllcode] = useState(null)
  const [ldata, setLdata] = useState([])

  const history = useHistory()

  const { data: stdata, loading: sloading, error: serror } = useQuery(getStudentDetails, {
    fetchPolicy: 'network-only',
    variables: {
      id: sid,
    },
  })
  const { data: sumdata, loading, error } = useQuery(SUMMERY, {
    fetchPolicy: 'network-only',
    variables: {
      program: programId,
    },
  })


  const { data: code, loading: codeLoading, error: codeError } = useQuery(getAllQuestionsCode, {
    fetchPolicy: 'network-only',
    variables: {
      type: peakType,
    },
  })
  const [getLastAssesment, { data: lastAssesData, loading: lastAssesLoading, error: lastAssesError }] = useMutation(lastAssesmentQuery)

  const getxxx = (sdata, scode, lasts) => {
    const tempCodes = scode?.peakGetCodes?.edges
    const peakSummary = sdata?.peakDataSummary?.edges[0]?.node?.yes?.edges;
    const tempArray = []
    const tempSubArray = []

    tempCodes.forEach(e => {
      e.yes = '#ffffff'
      for (let m = 0; m < peakSummary?.length; m += 1) {
        if (e?.node?.code === peakSummary[m]?.node?.code) {
          e.yes = "#f7ff00";
          // break
        }
      }
      tempArray.push({ code: e?.node?.code, yes: e.yes })
    })


    const tar = []
    const tar2 = []
    const fq = peakSummary?.filter(e => e?.node?.code === '1A');
    if (fq?.length > 0) {
      tar2.push({ code: '1A', yes: "#f7ff00" });
    } else {
      tar2.push({ code: '1A', yes: "#ffffff" });
    }
    const sq = peakSummary?.filter(e => e?.node?.code === '1B');
    if (sq?.length > 0) {
      tar2.push({ code: '1B', yes: "#f7ff00" });
    } else {
      tar2.push({ code: '1B', yes: "#ffffff" });
    }
    tar.push(tar2)
    let i = 2
    let j = 2
    while (i < tempArray.length) {
      const tmp = tempArray
      let v = []
      v = tmp.slice(i, i + j)
      tar.push(v)
      i += j
      j += 2
    }

    const t = lasts?.data?.lastFourRecords?.programs;
    t.forEach((ee, u) => {

      const ll = ee?.submitpeakresponsesSet?.edges[0]?.node?.yes?.edges?.forEach(ele => {

        tar.forEach((e) => {

          // const ss = ee?.submitpeakresponsesSet?.edges[0]?.node?.yes?.edges.filter(el => el.node.code === e?.node?.code);
          e.forEach(eee => {
            if (ele.node.code === eee.code) {
              if (u === 0 && eee.yes === "#ffffff") {
                eee.yes = '#1208E7'
              }

              if (u === 1 && eee.yes === "#ffffff") {
                eee.yes = '#0ACA07'
              }
              if (u === 2 && eee.yes === "#ffffff") {
                eee.yes = '#E4695A'
              }
            }
          })
        })
      })
    })
    const rdate = localStorage.getItem('reportDate')
    const data = {}
    data.data = tar
    data.student = stdata.student
    data.ldata = lasts?.data?.lastFourRecords?.programs
    data.assesor = assesor
    data.date = rdate
    setAllcode(data)
    console.log(tar)
  }


  function callback(key) {
    console.log(key)
  }

  useEffect(() => {

    if (sumdata !== undefined && code !== undefined) {
      getLastAssesment({ variables: { pk: programId } }).then((res) => {
        const s = res?.data?.lastFourRecords?.programs.forEach((element, index) => {
          if (index === 0) {
            element.color = '#1208E7'
          }
          if (index === 1) {
            element.color = '#0ACA07'
          }
          if (index === 2) {
            element.color = '#E4695A'
          }
        });
        setLdata(res?.data)
        getxxx(sumdata, code, res)
      })

      // studentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumdata, code, stdata])

  return (
    <PDFViewer style={{ width: '100%', height: '700px' }}>
      {allcode && <MyDocument data={allcode} />}
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
    // border: '1px solid #000',
    width: '100%',
    height: '95vh'
    // flexGrow: 1
  }
});
