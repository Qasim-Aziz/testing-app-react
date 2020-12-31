/* eslint-disable camelcase */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import './table.scss'
import { useHistory, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import DataTable from 'react-data-table-component'
import { Typography, Row, Layout, Col, Card, Tabs, Table, Tag, Select, Button, Progress } from 'antd'
import Triangle from './PeakTriangle'
import apolloClient from '../../apollo/config'


const { Content } = Layout
const { Option } = Select
const { Title, Text } = Typography
const { TabPane } = Tabs

const column3 = [
  {
    name: 'PeakFactor',
    selector: 'name',
    sortable: true,
    width: '37%',
  },
  {
    name: '1-2 yrs',
    selector: 'first',
    sortable: true,
    maxWidth: '10%',
  },
  {
    name: '3-4 yrs',
    selector: 'second',
    sortable: true,
    maxWidth: '10%',
  },
  {
    name: '5-6 yrs',
    selector: 'third',
    sortable: true,
    maxWidth: '10%',
  },
  {
    name: '7-8 yrs',
    selector: 'fourth',
    sortable: true,
    maxWidth: '10%',
  },
  {
    name: '9-10 yrs',
    selector: 'fifth',
    sortable: true,
    maxWidth: '100px',
  },
]

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

const customStyles = {
  title: {
    style: {
      fontSize: '15px'
    }
  },
  header: {
    style: {
      minHeight: '30px',
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: '#ddd',
      backgroundColor: '#f5f5f5',
      minHeight: '30px'
    },
  },
  rows: {
    style: {
      minHeight: '30px', // override the row height
    }
  },
  headCells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
        minHeight: '30px'
      },
      fontWeight: 'bold',
    },
  },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
        minHeight: '30px'
      },
      '.ebCczK:not(:last-of-type)': {
        minHeight: '30px'
      },
      fontSize: '11px',
    },
  },
  pagination: {
    style: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      borderTopStyle: 'none',
      minHeight: '35px',
    },
  },
  table: {
    style: {
      paddingBottom: '10px',
      top: '0px',
      width: '75%',
      left: '12%'
    },
  },
}


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
const factorAgeQuery = gql`
query peakProgram($id:ID!){
  peakProgram(id:$id){
      id
      title
      category
      notes
      student{
          id
          firstname
      }
      finalAge
      factorScores{
          edges{
              node{
                  codeType
                  age
              }
          }
      }
      
  }
}`
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
const finageSubmissionQuery = gql`
mutation updatePeakProgram($program:ID!,$finalAge:String!){
  updatePeakProgram(input:{
      program:$program
      finalAge:$finalAge
  }){
      details{
          id
          date
          title
          status
          finalAge
      }
  }
}
`
const factorageSubmissionQuery = gql`
mutation updatePeakProgram($program:ID!,$factorAge:[FactorsInput]){
  updatePeakProgram(input:{
      program:$program
      factorsAge:$factorAge
  }){
      details{
          id
          date
          title
          status
          factorScores{
              edges{
                  node{
                      codeType
                      age
                  }
              }
          }
      }
  }
}
`

export default () => {
  const programId = localStorage.getItem('peakId')
  const peakType = localStorage.getItem('peakType')
  const assesor = localStorage.getItem('userName')

  const ProgressCard = ({ color, value, title }) => {
    return (
      <Col span={8}>
        <Card style={{ padding: 10, height: 90 }}>
          <div>
            <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>{value}</Text>
            <Text
              style={{
                color: '#000',
                fontWeight: 600,
                fontSize: 13,
                marginLeft: 10,
              }}
            >
              {title}
            </Text>
          </div>
          <Progress
            percent={(value / sumdata.peakDataSummary.total) * 100}
            strokeColor={color}
            showInfo={false}
          />
        </Card>
      </Col>
    )
  }


  const columns = [
    {
      name: 'PEAK FACTOR',
      selector: 'peak',
      sortable: true,
      width: '37%',
    },
    {
      name: 'SCORE',
      selector: 's_score',
      sortable: true,
      width: '10%',
    },
    {
      name: 'TYPICAL AGE SCORE',
      selector: 't_age_score',
      sortable: true,
      width: '15%',
    },
    {
      name: 'DIFFERENCE',
      selector: 'difference',
      sortable: true,
      width: '15%',
    },
    {
      name: 'APPROXIMATE AGE EQUIVALENT',
      selector: 'action',
      sortable: true,
      width: '25%',
      cell: obj => (
        obj.age === "NA" ? null :
          <Select defaultValue={obj.age} style={{ width: 120 }} onChange={(value) => handleChangeTable(JSON.stringify(obj), value)}>
            <Option value="1-2 yrs">1 - 2 Yrs</Option>
            <Option value="3-4 yrs">3 - 4 Yrs</Option>
            <Option value="5-6 yrs">5 - 6 Yrs</Option>
            <Option value="7-8 yrs">7 - 8 Yrs</Option>
            <Option value="9-10 yrs">9 - 10 Yrs</Option>

          </Select>
      ),
    },
  ]
  const [summeryData, setSummeryData] = useState([])
  const [date, setDate] = useState('')
  const [studentDetails, setStudentDetails] = useState({})
  const [allcode, setAllcode] = useState([])
  const [selectProgramArea, setSelectProgramArea] = useState('1')
  const [ldata, setLdata] = useState([])
  const [tdata, setTData] = useState([])
  const [finalAge, setFinalAge] = useState('1-2 yrs')
  const [factorsAge, setFactorAge] = useState([])
  const [isloading, setLoading] = useState(false)
  const [tempTableData, setTempTableData] = useState(null)
  const history = useHistory()
  const { data: sumdata, loading, error } = useQuery(SUMMERY, {
    fetchPolicy: 'network-only',
    variables: {
      program: programId,
    },
  })

  const [factorsAgeResponse, setFactorsAgeResponse] = useState([
    { codeType: "FLS", age: "1-2 yrs" },
    { codeType: "PLS", age: "1-2 yrs" },
    { codeType: "VCS", age: "1-2 yrs" },
    { codeType: "VRM", age: "1-2 yrs" }
  ])
  const ar = factorsAgeResponse

  function handleChangeTable(value, v) {
    // console.log(value, v,'llllllllllllllllllllllllllllll')
    // setFinalAge(value);
    const passData = JSON.parse(value)
    console.log(passData);
    switch (passData.key) {
      case "1":
        ar.forEach((e, i) => {
          if (e.codeType === "FLS") {
            ar.splice(i, 1);

          }
        })
        ar.push({ codeType: "FLS", age: v })
        setTemppTableData(tempTableData, v, "FLS")
        break;
      case "2":
        ar.forEach((e, i) => {
          if (e.codeType === "PLS") {
            ar.splice(i, 1);

          }
        })
        ar.push({ codeType: "PLS", age: v })
        setTemppTableData(tempTableData, v, "PLS")
        break;
      case "3":
        ar.forEach((e, i) => {
          if (e.codeType === "VCS") {
            ar.splice(i, 1);

          }
        })
        ar.push({ codeType: "VCS", age: v })
        setTemppTableData(tempTableData, v, "VCS")
        break;
      case "4":
        ar.forEach((e, i) => {
          if (e.codeType === "VRM") {
            ar.splice(i, 1);

          }
        })
        ar.push({ codeType: "VRM", age: v })
        setTemppTableData(tempTableData, v, "VRM")
        break;

      default:
        break;

    }
    setFactorAge(ar)
    setFactorsAgeResponse(ar)
    console.log(ar, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
  }
  function handleChange(value) {
    console.log(`selected ${value}`)
    setFinalAge(value);

  }

  const { data: code, loading: codeLoading, error: codeError } = useQuery(getAllQuestionsCode, {
    fetchPolicy: 'network-only',
    variables: {
      type: peakType,
    },
  })

  const { data: factorScores, loading: factorLoading, error: factorError } = useQuery(factorAgeQuery, {
    fetchPolicy: 'network-only',
    variables: {
      id: programId,
    },
  })


  // updating local factor response object
  useEffect(() => {
    if (factorScores) {
      // console.log(factorScores);
      const copyFactorsAgeResponse = factorsAgeResponse

      if (factorScores?.peakProgram?.factorScores?.edges?.length > 0) {
        factorScores.peakProgram.factorScores.edges.map(nodeItem => {

          factorsAgeResponse.map((item, index) => {
            if (item.codeType === nodeItem.node.codeType) {
              copyFactorsAgeResponse[index].age = nodeItem?.node?.age;
            }
          })
        })
      }
      setFactorsAgeResponse(copyFactorsAgeResponse)
    }
  }, [factorScores])


  const [gettableReport, { data: tableData, error: tableError, loading: tableLoading }] = useMutation(getTableDataQuery, { errorPolicy: 'all' })
  const [getLastAssesment, { data: lastAssesData, loading: lastAssesLoading, error: lastAssesError }] = useMutation(lastAssesmentQuery)
  const [finalAgeSubmit, { data: finalAgeData, error: finalAgeError, loading: finalAgeLoading }] = useMutation(finageSubmissionQuery)
  const [factorAgeSubmit, { data: factorAgeData, error: factorAgeError, loading: factorAgeLoading }] = useMutation(factorageSubmissionQuery)

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
    setAllcode(tar)
    console.log(tar)
  }

  const studentData = () => {
    apolloClient
      .query({
        query: gql`
          query {
            students(isActive: true) {
              edges {
                node {
                  id
                  firstname
                  internalNo
                  mobileno
                  email
                  caseManager {
                    id
                    name
                    email
                    contactNo
                  }
                  category {
                    id
                    category
                  }
                }
              }
            }
            programArea {
              edges {
                node {
                  id
                  name
                  percentageLong
                }
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .then(qresult => {
        console.log(qresult)
        const sid = localStorage.getItem('studentId')
        const rdate = localStorage.getItem('reportDate')
        if (rdate) {
          setDate(rdate)
        }
        const st = qresult?.data?.students?.edges.filter(e => e.node.id === JSON.parse(sid));
        setStudentDetails(st[0])
      })
  }
  function callback(key) {
    console.log(key)
  }

  // working correctly
  const getAge = (key, value) => {
    let y = '';
    // console.log(factorScores?.peakProgram?.finalAge,'000000000000000000000000000000000000');
    if (factorScores?.peakProgram?.finalAge) {
      setFinalAge(factorScores?.peakProgram?.finalAge)
    } else {
      setFinalAge('1-2 yrs')
    }

    if (factorScores?.peakProgram?.factorScores?.edges?.length > 0) {
      console.log(factorScores);
      const arr = factorScores?.peakProgram?.factorScores?.edges?.forEach(element => {
        if (key === "1" && element?.node?.codeType === "FLS") {
          y = element?.node?.age;
        }
        if (key === "2" && element?.node?.codeType === "PLS") {
          y = element?.node?.age;
        }
        if (key === "3" && element?.node?.codeType === "VCS") {
          y = element?.node?.age;
        }
        if (key === "4" && element?.node?.codeType === "VRM") {
          y = element?.node?.age;
        }
      });
    } else {
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
    }

    return y;
  }

  useEffect(() => {

    if (sumdata !== undefined && code !== undefined) {
      getLastAssesment({ variables: { pk: programId } }).then((res) => {
        if (res) {
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
        }

      }).catch(err => {
        console.log(err);
      })



      gettableReport({ variables: { pk: programId } }).then((d) => {

        const tablereportdata = d?.data
        console.log('peak fectors=====> ', d)
        console.log(JSON.parse(tablereportdata?.peakReport?.fls), 'dddd');
        setTempTableData(tablereportdata)
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
            age: 'NA'
          },
        ]
        // console.log(data, '...................................................');
        setTData(data)
      }).catch(err => {
        console.log(err);
      })

      studentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumdata, code])

  const setTemppTableData = (tablereportdata, year, key) => {
    // console.log(tdata[0].age,'ppppppppppppppppppppppppp');
    if (key === "FLS") {
      tdata[0].age = year;
    }
    if (key === "PLS") {
      tdata[1].age = year;
    }
    if (key === "VCS") {
      tdata[2].age = year;
    }
    if (key === "VRM") {
      tdata[3].age = year;
    }

    // console.log(tdata, '...................................................');
    setTData(tdata)
  }

  const saveTableData = () => {
    setLoading(true)
    finalAgeSubmit({ variables: { "program": programId, "finalAge": finalAge } }).then((res) => {
      console.log(res, 'response of final age');
      factorAgeSubmit({ variables: { program: programId, factorAge: factorsAge } }).then((ress) => {
        console.log(ress, 'response of factor age');

        setLoading(false)
      }).catch(errr => {
        console.log(errr);
      })
    }).catch(err => {
      console.log(err);
    })


  }
  return (
    <Layout style={{ padding: '0px' }}>
      <Content
        style={{
          padding: '0px 20px',
          maxWidth: '75%',
          width: '75%',
          margin: '0px auto',
        }}
      >
        <div style={{ justifyContent: 'center', flex: 1 }}>
          <Tabs defaultActiveKey="1" type="card" onChange={callback}>
            <TabPane tab="Trinagle Report" key="1">
              {allcode?.length > 0 &&
                <div>
                  <Button style={{ left: '80%', backgroundColor: '#18a8fe' }} onClick={() => history.push('/triangleReportPDF')}>Save & Download PDF</Button>

                  <div
                    style={{ alignSelf: 'center', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}
                  >
                    Learner : {studentDetails?.node?.firstname}
                  </div>
                  <div style={{ width: '100%', alignSelf: 'center' }}>
                    {allcode?.map((item, i) => (
                      <div key={item} style={{ width: '100%', alignSelf: 'center', textAlign: 'center' }}>
                        {item.map((e, index) => (
                          <div
                            style={{
                              border: '1px solid',
                              height: 30,
                              width: 40,
                              display: 'inline-block',
                              backgroundColor: e.yes,
                            }}
                          >
                            {e.code}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      paddingLeft: '30%',
                    }}
                  >
                    <Row
                      justify="center"
                      align="middle"
                      xs={12}
                      gutter={[4, 4]}
                      style={{ alignSelf: 'center', marginTop: 50 }}
                    >
                      <Col xs={4}>
                        <div
                          style={{
                            height: 25,
                            backgroundColor: '#00A6FF',
                            alignSelf: 'center',
                            color: '#ffffff',
                            fontSize: 16,
                            textAlign: 'center',
                          }}
                        >
                          Assessor Name
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div
                          style={{
                            height: 25,
                            backgroundColor: '#00A6FF',
                            alignSelf: 'center',
                            color: '#ffffff',
                            fontSize: 16,
                            textAlign: 'center',
                          }}
                        >
                          Assessment Date
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div
                          style={{
                            height: 25,
                            backgroundColor: '#00A6FF',
                            alignSelf: 'center',
                            color: '#ffffff',
                            fontSize: 16,
                            textAlign: 'center',
                          }}
                        >
                          Color
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      paddingLeft: '30%',
                    }}
                  >
                    <Row
                      justify="center"
                      align="middle"
                      xs={12}
                      gutter={[4, 4]}
                      style={{ alignSelf: 'center', marginTop: 5 }}
                    >
                      <Col xs={4}>
                        <div
                          style={{
                            height: 25,
                            backgroundColor: '#00A6FF',
                            alignSelf: 'center',
                            color: '#ffffff',
                            fontSize: 16,
                            textAlign: 'center',
                          }}
                        >
                          {assesor ? JSON.parse(assesor) : null}
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div
                          style={{
                            height: 25,
                            backgroundColor: '#00A6FF',
                            alignSelf: 'center',
                            color: '#ffffff',
                            fontSize: 16,
                            textAlign: 'center',
                          }}
                        >
                          {date}
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div
                          style={{
                            height: 25,
                            backgroundColor: '#F7FF00',
                            alignSelf: 'center',
                            color: '#ffffff',
                            fontSize: 16,
                            textAlign: 'center',
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  {ldata?.lastFourRecords?.programs?.map((item, i) => (
                    <div
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        paddingLeft: '30%',
                      }}
                    >
                      <Row
                        justify="center"
                        align="middle"
                        xs={12}
                        gutter={[4, 4]}
                        style={{ alignSelf: 'center', marginTop: 5 }}
                      >
                        <Col xs={4}>
                          <div
                            style={{
                              height: 25,
                              backgroundColor: '#00A6FF',
                              alignSelf: 'center',
                              color: '#ffffff',
                              fontSize: 16,
                              textAlign: 'center',
                            }}
                          >
                            {`${item?.user?.firstName}${" "}${item?.user?.lastName}`}
                          </div>
                        </Col>
                        <Col xs={4}>
                          <div
                            style={{
                              height: 25,
                              backgroundColor: '#00A6FF',
                              alignSelf: 'center',
                              color: '#ffffff',
                              fontSize: 16,
                              textAlign: 'center',
                            }}
                          >
                            {item?.date}
                          </div>
                        </Col>
                        <Col xs={4}>
                          <div
                            style={{
                              height: 25,
                              backgroundColor: item?.color,
                              alignSelf: 'center',
                              color: '#ffffff',
                              fontSize: 16,
                              textAlign: 'center',
                            }}
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>}
            </TabPane>
            <TabPane tab="Table Report" key="2">
              <Button style={{ marginLeft: '75%', backgroundColor: '#21af16', color: '#fff', marginTop: 5, marginBottom: 5, fontSize: 12 }} onClick={() => { history.push('/tableReportPdf') }}>View & Download PDF</Button>
              <div>

                <div style={{ height: 90, width: '75%', marginLeft: '12%', border: '1px solid #bcbcbc' }}>
                  <Row style={{ display: 'inline' }}>
                    <Col span={8}>
                      <Card
                        style={{ width: '100%', backgroundColor: '#fff' }}
                        bordered={false}
                      >
                        <p>SELECT AGE RANGE OF CHILD</p>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        style={{ width: '100%', backgroundColor: '#fff' }}
                        bordered={false}
                      >
                        <Select
                          defaultValue={finalAge}
                          style={{ width: 120, zIndex: 1000 }}
                          onChange={handleChange}
                        >
                          <Option value="1-2 yrs">1 - 2 Yrs</Option>
                          <Option value="3-4 yrs">3 - 4 Yrs</Option>
                          <Option value="5-6 yrs">5 - 6 Yrs</Option>
                          <Option value="7-8 yrs">7 - 8 Yrs</Option>
                          <Option value="9-10 yrs">9 - 10 Yrs</Option>
                        </Select>
                      </Card>
                    </Col>
                    <Col span={10} style={{ justifyContent: 'center' }}>

                      <p style={{ fontSize: 9, marginTop: 20 }}>
                        INSTRUCTIONS: Student Scores, Typical Age Scores and Difference Scores will
                        automatically calculate when Age Range of Child is input AND when Factor
                        Scoring Grid is completed. Use the information to determine Approximate Age
                        Equivalent and select from dropdown.
                      </p>

                    </Col>
                  </Row>
                </div>
              </div>
              <div>
                <p style={{ textAlign: 'center', marginTop: 10 }}>DIRECT TRAINING MODULE</p>
                <DataTable
                  // title="DIRECT TRAINING MODULE"
                  columns={columns}
                  theme="default"
                  // dense={true}
                  // pagination={true}
                  data={tdata}
                  customStyles={customStyles}
                  // noHeader={true}
                  paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
                />
                <Button style={{ backgroundColor: '#21af16', color: '#FFFFFF', marginTop: 10, marginLeft: '80%' }} onClick={saveTableData}>
                  {isloading === true ? "Loading" : "SAVE"}
                </Button>
              </div>

              <p style={{ textAlign: 'center', marginTop: 10 }}>TYPICAL AGE DISTRIBUTION OF PEAK FACTOR SCORES</p>
              <DataTable
                // title="TYPICAL AGE DISTRIBUTION OF PEAK FACTOR SCORES"
                columns={column3}
                theme="default"
                // dense={true}
                // pagination={true}
                data={data2}
                customStyles={customStyles}
                // noHeader={true}
                paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
              />

            </TabPane>
            <TabPane tab="Result" key="3">
              <div
                style={{
                  maxWidth: 1300,
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >

                <Row style={{ marginTop: 45 }} gutter={[20, 30]}>
                  <ProgressCard
                    color="#4CDE49"
                    title="Total Line Item"
                    value={sumdata?.peakDataSummary.total}
                  />
                  <ProgressCard
                    color="#E58425"
                    title="Total Attended"
                    value={sumdata?.peakDataSummary.totalAttended}
                  />
                  <ProgressCard
                    color="#4CDE49"
                    title="Correct Answers"
                    value={sumdata?.peakDataSummary.totalCorrect}
                  />
                  <ProgressCard
                    color="#FF7474"
                    title="Incorrect Answers"
                    value={sumdata?.peakDataSummary.totalIncorrect}
                  />
                  <ProgressCard
                    color="#B7B7B7"
                    title="No Response"
                    value={sumdata?.peakDataSummary.totalNoResponse}
                  />
                  <ProgressCard
                    color="#E58425"
                    title="Suggest Target"
                    value={sumdata?.peakDataSummary.totalSuggested}
                  />
                  <ProgressCard
                    color="#D54015"
                    title="Skip Question"
                    value={sumdata?.peakDataSummary.totalSkipped}
                  />
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  )
}
