/* eslint-disable camelcase */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable yoda */
/* eslint-disable react/jsx-boolean-value */

import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import './table.scss'
import { useHistory, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { Typography, Row, Col, Button, Select, Drawer } from 'antd'
import {DRAWER} from 'assets/styles/globalStyles'
import Triangle from './Triangle'
import NewTableReportPdf from './NewTableReportPdf'
import apolloClient from '../../apollo/config'

const { Title, Text } = Typography
const { Option } = Select

const colorGray = '#d9d9d9'
const colorGreen = '#21af16'
const colorRed = '#ffe6e6'
const colorLightGreen = '#80ffaa'

const tdStyle = {
  border: '2px solid #000000',
  padding: 6,
  textAlign: 'center',
  color: 'black',
  fontWeight: 500,
}
const moduleTheaderStyle = {
  ...tdStyle,
  backgroundColor: colorGreen,
  color: 'white',
  fontWeight: 700,
}
const moduleTbodyStyle = {
  ...tdStyle,
  backgroundColor: colorRed,
}
const moduleTfooterStyle = {
  ...tdStyle,
  backgroundColor: colorGray,
}

const generalizationDefaultScores = [
  {
    key: '1',
    name: 'Foundational Learning Skills',
    first: 2,
    second: 20,
    third: 24,
    fourth: 26,
    fifth: 28,
    sixth: 29,
    seventh: 33,
    eighth: 33,
  },
  {
    key: '2',
    name: 'Perceptual Learning Skills',
    first: 1,
    second: 15,
    third: 25,
    fourth: 36,
    fifth: 55,
    sixth: 57,
    seventh: 58,
    eighth: 59,
  },
  {
    key: '3',
    name: 'Verbal Comprehension Skills',
    first: 2,
    second: 4,
    third: 9,
    fourth: 13,
    fifth: 50,
    sixth: 52,
    seventh: 61,
    eighth: 63,
  },
  {
    key: '4',
    name: 'Verbal Reasoning, Memory, and Mathematical Skills',
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 16,
    sixth: 20,
    seventh: 26,
    eighth: 29,
  },
  {
    key: '5',
    name: 'Total',
    first: 4,
    second: 39,
    third: 58,
    fourth: 75,
    fifth: 151,
    sixth: 156,
    seventh: 178,
    eighth: 184,
  },
]

const directDefaultScores = [
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
  mutation peakReport($pk: ID!) {
    peakReport(input: { pk: $pk }) {
      fls
      pls
      vcs
      vrm
    }
  }
`
const factorAgeQuery = gql`
  query peakProgram($id: ID!) {
    peakProgram(id: $id) {
      id
      title
      category
      notes
      student {
        id
        firstname
      }
      finalAge
      factorScores {
        edges {
          node {
            codeType
            age
          }
        }
      }
    }
  }
`
const lastAssesmentQuery = gql`
  mutation lastFourRecords($pk: ID!) {
    lastFourRecords(input: { pk: $pk }) {
      programs {
        id
        date
        user {
          id
          firstName
          lastName
        }
        student {
          id
          caseManager {
            id
            name
          }
        }
        submitpeakresponsesSet {
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
            }
          }
        }
      }
    }
  }
`
const finageSubmissionQuery = gql`
  mutation updatePeakProgram($program: ID!, $finalAge: String!) {
    updatePeakProgram(input: { program: $program, finalAge: $finalAge }) {
      details {
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
  mutation updatePeakProgram($program: ID!, $factorAge: [FactorsInput]) {
    updatePeakProgram(input: { program: $program, factorsAge: $factorAge }) {
      details {
        id
        date
        title
        status
        factorScores {
          edges {
            node {
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

  let defaultScores = []

  if (peakType === 'DIRECT') defaultScores = directDefaultScores
  if (peakType === 'GENERALIZATION') defaultScores = generalizationDefaultScores

  const [tdata, setTData] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [finalAge, setFinalAge] = useState('- yrs')
  const [factorsAge, setFactorAge] = useState([])
  const [isloading, setLoading] = useState(false)
  const [tempTableData, setTempTableData] = useState(null)

  const [factorsAgeResponse, setFactorsAgeResponse] = useState([
    { codeType: 'FLS', age: '1-2 yrs' },
    { codeType: 'PLS', age: '1-2 yrs' },
    { codeType: 'VCS', age: '1-2 yrs' },
    { codeType: 'VRM', age: '1-2 yrs' },
  ])

  const { data: factorScores, loading: factorLoading, error: factorError } = useQuery(
    factorAgeQuery,
    {
      fetchPolicy: 'network-only',
      variables: {
        id: programId,
      },
    },
  )

  // updating local factor response object
  useEffect(() => {
    if (factorScores) {
      console.log("Initial Factor score data ====> ", factorScores);
      setFinalAge(factorScores?.peakProgram?.finalAge)
      const copyFactorsAgeResponse = factorsAgeResponse
      localStorage.setItem('PeakFactorAge', factorScores?.peakProgram?.finalAge)

      if (factorScores?.peakProgram?.factorScores?.edges.length > 0) {
        factorScores.peakProgram.factorScores.edges.map(nodeItem => {
          factorsAgeResponse.map((item, index) => {
            if (item.codeType === nodeItem.node.codeType) {
              copyFactorsAgeResponse[index].age = nodeItem?.node?.age
            }
          })
        })
      }
      setFactorsAgeResponse(copyFactorsAgeResponse)
      setInitialLoading(false)
    }
  }, [factorScores])



  function handleChangeTable(value, v) {
    const ar = factorsAgeResponse
    const passData = JSON.parse(value)
    console.log(passData)
    switch (passData.key) {
      case '1':
        ar.forEach((e, i) => {
          if (e.codeType === 'FLS') {
            ar.splice(i, 1)
          }
        })
        ar.push({ codeType: 'FLS', age: v })
        setTemppTableData(tempTableData, v, 'FLS')
        break
      case '2':
        ar.forEach((e, i) => {
          if (e.codeType === 'PLS') {
            ar.splice(i, 1)
          }
        })
        ar.push({ codeType: 'PLS', age: v })
        setTemppTableData(tempTableData, v, 'PLS')
        break
      case '3':
        ar.forEach((e, i) => {
          if (e.codeType === 'VCS') {
            ar.splice(i, 1)
          }
        })
        ar.push({ codeType: 'VCS', age: v })
        setTemppTableData(tempTableData, v, 'VCS')
        break
      case '4':
        ar.forEach((e, i) => {
          if (e.codeType === 'VRM') {
            ar.splice(i, 1)
          }
        })
        ar.push({ codeType: 'VRM', age: v })
        setTemppTableData(tempTableData, v, 'VRM')
        break

      default:
        break
    }
    setFactorAge(ar)
    setFactorsAgeResponse(ar)
  }

  function handleChange(value) {
    setFinalAge(value)
  }

  const [
    gettableReport,
    { data: tableData, error: tableError, loading: tableLoading },
  ] = useMutation(getTableDataQuery, { errorPolicy: 'all' })
  const [
    finalAgeSubmit,
    { data: finalAgeData, error: finalAgeError, loading: finalAgeLoading },
  ] = useMutation(finageSubmissionQuery)
  const [
    factorAgeSubmit,
    { data: factorAgeData, error: factorAgeError, loading: factorAgeLoading },
  ] = useMutation(factorageSubmissionQuery)

  // working correctly
  const getAge = (key, value, peakTYPE) => {
    console.log("get age ==============>", key, value)
    let y = ''
    if (factorScores?.peakProgram?.finalAge) {
      setFinalAge(factorScores?.peakProgram?.finalAge)
    } else {
      setFinalAge('1-2 yrs')
    }

    if (factorScores?.peakProgram?.factorScores.edges.length > 0) {
      console.log("factor age response true statement ===>", factorScores)
      const arr = factorScores?.peakProgram?.factorScores?.edges?.forEach(element => {
        if (key === '1' && element?.node?.codeType === 'FLS') {
          y = element?.node?.age
        }
        if (key === '2' && element?.node?.codeType === 'PLS') {
          y = element?.node?.age
        }
        if (key === '3' && element?.node?.codeType === 'VCS') {
          y = element?.node?.age
        }
        if (key === '4' && element?.node?.codeType === 'VRM') {
          y = element?.node?.age
        }
      })
    } else if (key === '1') {
      if (peakTYPE === 'DIRECT') {
        if (value <= 2) y = '1-2 yrs'
        if (2 < value && value <= 30) y = '3-4 yrs'
        if (30 < value) y = '5-6 yrs'
      }
      else {
        if (value <= 2) y = '1-2 yrs'
        if (2 < value && value <= 20) y = '3-4 yrs'
        if (20 < value && value <= 24) y = '5-6 yrs'
        if (24 < value && value <= 26) y = '7-8 yrs'
        if (26 < value && value <= 28) y = '9-10 yrs'
        if (28 < value && value <= 29) y = '11-12 yrs'
        if (29 < value) y = '15+ yrs'
      }


    }
    else if (key === '2') {
      if (peakTYPE === 'DIRECT') {
        if (value <= 17) y = '1-2 yrs'
        if (17 < value && value < 21) y = '3-4 yrs'
        if (20 < value && value < 22) y = '5-6 yrs'
        if (21 < value) y = '7-8 yrs'
      }
      else {
        if (value <= 1) y = '1-2 yrs'
        if (1 < value && value <= 15) y = '3-4 yrs'
        if (15 < value && value <= 25) y = '5-6 yrs'
        if (25 < value && value <= 36) y = '7-8 yrs'
        if (36 < value && value <= 55) y = '9-10 yrs'
        if (55 < value && value <= 57) y = '11-12 yrs'
        if (57 < value && value <= 58) y = '13-15 yrs'
        if (58 < value) y = '15+ yrs'
      }

    }
    else if (key === '3') {
      if (peakTYPE === 'DIRECT') {
        if (value <= 18) y = '1-2 yrs'
        if (18 < value && value < 80) y = '3-4 yrs'
        if (79 < value && value < 94) y = '5-6 yrs'
        if (93 < value && value < 99) y = '7-8 yrs'
        if (99 < value) y = '9-10 yrs'
      }
      else {
        if (value <= 2) y = '1-2 yrs'
        if (2 < value && value <= 4) y = '3-4 yrs'
        if (4 < value && value <= 9) y = '5-6 yrs'
        if (9 < value && value <= 13) y = '7-8 yrs'
        if (13 < value && value <= 50) y = '9-10 yrs'
        if (50 < value && value <= 52) y = '11-12 yrs'
        if (52 < value && value <= 61) y = '13-15 yrs'
        if (61 < value) y = '15+ yrs'
      }

    }
    else if (key === '4') {
      if (peakTYPE === 'DIRECT') {
        if (value <= 9) y = '1-2 yrs'
        if (9 < value && value < 22) y = '5-6 yrs'
        if (21 < value && value < 28) y = '7-8 yrs'
        if (27 < value) y = '9-10 yrs'
      }
      else {
        if (value <= 16) y = '9-10 yrs'
        if (16 < value && value <= 20) y = '11-12 yrs'
        if (20 < value && value <= 26) y = '13-15 yrs'
        if (26 < value) y = '15+ yrs'
      }

    }


    return y
  }

  useEffect(() => {
    if (!initialLoading) {
      gettableReport({ variables: { pk: programId } })
        .then(d => {
          console.log('api data =================================>', d)
          const tablereportdata = d?.data
          setTempTableData(tablereportdata)

          console.log('table data', finalAge)

          const fls = {
            '1-2 Years': 2,
            '3-4 Years': 20,
            '5-6 Years': 24,
            '7-8 Years': 26,
            '9-10 Years': 30,
            '11-12 Years': 30,
            '13-14 Years': 30,
            '15+ Years': 30,
            0: null,
          }

          const data = [
            {
              key: '1',
              peak: 'Foundational Learning Skills',
              s_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.score : 0,
              // t_age_score: fls['1-2 Years'],
              t_age_score: tablereportdata
                ? JSON.parse(tablereportdata?.peakReport?.fls)?.age_score
                : 0,
              difference: tablereportdata
                ? JSON.parse(tablereportdata?.peakReport?.fls)?.difference
                : 0,
              age: getAge(
                '1',
                tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.score : 0,
                peakType,
              ),
            },
            {
              key: '2',
              peak: 'Perceptual Learning Skills',
              s_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.score : 0,
              t_age_score: tablereportdata
                ? JSON.parse(tablereportdata?.peakReport?.pls)?.age_score
                : 0,
              difference: tablereportdata
                ? JSON.parse(tablereportdata?.peakReport?.pls)?.difference
                : 0,
              age: getAge(
                '2',
                tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.score : 0,
                peakType,
              ),
            },
            {
              key: '3',
              peak: 'Verbal Comprehension Skills',
              s_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.score : 0,
              t_age_score: tablereportdata
                ? JSON.parse(tablereportdata?.peakReport?.vcs)?.age_score
                : 0,
              difference: tablereportdata
                ? JSON.parse(tablereportdata?.peakReport?.vcs)?.difference
                : 0,
              age: getAge(
                '3',
                tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.score : 0,
                peakType,
              ),
            },
            {
              key: '4',
              peak: 'Verbal Reasoning, Memory, and Mathematical Skills',
              s_score: tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.score : 0,
              t_age_score: tablereportdata
                ? JSON.parse(tablereportdata?.peakReport?.vrm)?.age_score
                : 0,
              difference: tablereportdata
                ? JSON.parse(tablereportdata?.peakReport?.vrm)?.difference
                : 0,
              age: getAge(
                '4',
                tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.score : 0,
                peakType,
              ),
            },
            {
              key: '5',
              peak: 'Total',
              s_score:
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.score : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.score : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.score : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.score : 0),
              t_age_score:
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.age_score : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.age_score : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.age_score : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.age_score : 0),
              difference:
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.fls)?.difference : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.pls)?.difference : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vcs)?.difference : 0) +
                (tablereportdata ? JSON.parse(tablereportdata?.peakReport?.vrm)?.difference : 0),
              age: 'NA',
            },
          ]

          console.log('manupulated data ===================> ', data)
          setTData(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoading])

  const setTemppTableData = (tablereportdata, year, key) => {
    if (key === 'FLS') {
      tdata[0].age = year
    }
    if (key === 'PLS') {
      tdata[1].age = year
    }
    if (key === 'VCS') {
      tdata[2].age = year
    }
    if (key === 'VRM') {
      tdata[3].age = year
    }
    setTData(tdata)
  }

  const saveTableData = () => {
    setLoading(true)
    finalAgeSubmit({ variables: { program: programId, finalAge } })
      .then(res => {
        console.log(res, 'response of final age')
        factorAgeSubmit({ variables: { program: programId, factorAge: factorsAgeResponse } })
          .then(ress => {
            console.log(ress, 'response of factor age')
            setLoading(false)
          })
          .catch(errr => {
            console.log(errr)
          })
      })
      .catch(err => {
        console.log(err)
      })
  }

  const history = useHistory()
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <>
      <Row>
        <Drawer
          title="Report PDF"
          width={DRAWER.widthL2}
          placement="right"
          closable={true}
          onClose={onClose}
          visible={visible}
        >
          <NewTableReportPdf 
            tdata={tdata}
            defaultScores={defaultScores}
            peakType={peakType}
          />
        </Drawer>
        <Col sm={24}>
          <div>
            <Button
              type="link"
              style={{ float: 'right', marginBottom: 5 }}
              onClick={showDrawer}
            >
              View & Download PDF
            </Button>
          </div>
          <table style={{ borderCollapse: 'collapse', width: '100%', border: '2px solid black' }}>
            <tr>
              <td style={{ ...moduleTheaderStyle, width: 250 }} colSpan={3}>
                PEAK Relation Training System
              </td>
            </tr>
            <tr>
              <td style={{ ...tdStyle, width: 370, backgroundColor: colorGray }}>
                SELECT AGE RANGE OF CHILD FROM DROPDOWN
              </td>
              <td style={{ ...tdStyle, width: 140, backgroundColor: colorLightGreen }}>
                <Select
                  value={finalAge}
                  style={{ width: 120, zIndex: 1000, backgroundColor: 'inherit' }}
                  onChange={handleChange}
                >
                  <Option value="1-2 yrs">1 - 2:11 Yrs</Option>
                  <Option value="3-4 yrs">3 - 4:11 Yrs</Option>
                  <Option value="5-6 yrs">5 - 6:11 Yrs</Option>
                  <Option value="7-8 yrs">7 - 8:11 Yrs</Option>
                  <Option value="9-10 yrs">9 - 10:11 Yrs</Option>
                  {peakType === 'GENERALIZATION' && (
                    <Option value="11-12 yrs">11 - 12:11 Yrs</Option>
                  )}
                  {peakType === 'GENERALIZATION' && (
                    <Option value="13-14 yrs">13 - 14:11 Yrs</Option>
                  )}
                  {peakType === 'GENERALIZATION' && (
                    <Option value="15+ yrs">15+ :11 Yrs</Option>
                  )}
                </Select>
              </td>
              <td style={{ ...tdStyle, backgroundColor: colorRed }}>
                <p style={{ fontSize: 11 }}>
                  INSTRUCTIONS: Learner Scores, Typical Age Scores and Difference Scores
                  will automatically calculate when Age Range of Child is input AND when
                  Factor Scoring Grid is completed. Use the information to determine
                  Approximate Age Equivalent and select from dropdown.
                        </p>
              </td>
            </tr>
          </table>
        </Col>
        <Col sm={24}>
          <p style={{ textAlign: 'center', marginTop: 10, fontWeight: 700 }}>
            DIRECT TRAINING MODULE
          </p>
          <table
            style={{ borderCollapse: 'collapse', width: '100%', border: '2px solid black' }}
          >
            <tr>
              <td style={{ ...moduleTheaderStyle, width: 370 }}>PEAK FACTOR</td>
              <td style={moduleTheaderStyle}>SCORE</td>
              <td style={moduleTheaderStyle}>TYPICAL AGE SCORE</td>
              <td style={moduleTheaderStyle}>DIFFERENCE</td>
              <td style={moduleTheaderStyle}>APPROXIMATE AGE EQUIVALENT</td>
            </tr>
            {tdata.map((item, index) => (
              <tr>
                {index + 1 === tdata.length ? (
                  <>
                    <td style={{ ...moduleTfooterStyle, width: 370 }}>{item.peak}</td>
                    <td style={moduleTfooterStyle}>{item.s_score}</td>
                    <td style={moduleTfooterStyle}>{item.t_age_score}</td>
                    <td style={moduleTfooterStyle}>{item.difference}</td>
                    <td style={moduleTfooterStyle}>&nbsp;</td>
                  </>
                ) : (
                    <>
                      <td style={{ ...moduleTbodyStyle, width: 370 }}>{item.peak}</td>
                      <td style={moduleTbodyStyle}>{item.s_score}</td>
                      <td style={moduleTbodyStyle}>{item.t_age_score}</td>
                      <td style={moduleTbodyStyle}>{item.difference}</td>
                      <td style={moduleTbodyStyle}>
                        <Select
                          defaultValue={item.age}
                          style={{ width: 120 }}
                          onChange={value => handleChangeTable(JSON.stringify(item), value)}
                        >
                          <Option value="1-2 yrs">1 - 2:11 Yrs</Option>
                          <Option value="3-4 yrs">3 - 4:11 Yrs</Option>
                          <Option value="5-6 yrs">5 - 6:11 Yrs</Option>
                          <Option value="7-8 yrs">7 - 8:11 Yrs</Option>
                          <Option value="9-10 yrs">9 - 10:11 Yrs</Option>
                          {peakType === 'GENERALIZATION' && (
                            <Option value="11-12 yrs">11 - 12:11 Yrs</Option>
                          )}
                          {peakType === 'GENERALIZATION' && (
                            <Option value="13-14 yrs">13 - 14:11 Yrs</Option>
                          )}
                          {peakType === 'GENERALIZATION' && (
                            <Option value="15+ yrs">15+ :11 Yrs</Option>
                          )}
                        </Select>
                      </td>
                    </>
                  )}
              </tr>
            ))}
          </table>
        </Col>
        <Col sm={24}>
          <Button
            loading={isloading}
            style={{
              backgroundColor: colorGreen,
              color: '#FFFFFF',
              marginTop: 10,
              float: 'right',
            }}
            onClick={saveTableData}
          >
            Save
                  </Button>
          <p style={{ textAlign: 'center', marginTop: 10, fontWeight: 700 }}>
            TYPICAL AGE DISTRIBUTION OF PEAK FACTOR SCORES
                  </p>

          <table
            style={{ borderCollapse: 'collapse', width: '100%', border: '2px solid black' }}
          >
            <thead>
              <tr>
                <td style={{ ...moduleTheaderStyle, width: 370 }}>PEAK Factor</td>
                <td style={moduleTheaderStyle}>1-2:11 yrs</td>
                <td style={moduleTheaderStyle}>3-4:11 yrs</td>
                <td style={moduleTheaderStyle}>5-6:11 yrs</td>
                <td style={moduleTheaderStyle}>7-8:11 yrs</td>
                <td style={moduleTheaderStyle}>9-10:11 yrs</td>
                {peakType === 'GENERALIZATION' && (
                  <>
                    <td style={moduleTheaderStyle}>11-12:11 yrs</td>
                    <td style={moduleTheaderStyle}>13-14:11 yrs</td>
                    <td style={moduleTheaderStyle}>15+ yrs</td>
                  </>
                )}
              </tr>
            </thead>
            {defaultScores.map((item, index) => (
              <tr>
                {index + 1 === defaultScores.length ? (
                  <>
                    <td style={{ ...moduleTfooterStyle, width: 370 }}>{item.name}</td>
                    <td style={moduleTfooterStyle}>{item.first}</td>
                    <td style={moduleTfooterStyle}>{item.second}</td>
                    <td style={moduleTfooterStyle}>{item.third}</td>
                    <td style={moduleTfooterStyle}>{item.fourth}</td>
                    <td style={moduleTfooterStyle}>{item.fifth}</td>
                    {peakType === 'GENERALIZATION' && (
                      <>
                        <td style={moduleTfooterStyle}>{item.sixth}</td>
                        <td style={moduleTfooterStyle}>{item.seventh}</td>
                        <td style={moduleTfooterStyle}>{item.eighth}</td>
                      </>
                    )}
                  </>
                ) : (
                    <>
                      <td style={{ ...moduleTbodyStyle, width: 370 }}>{item.name}</td>
                      <td style={moduleTbodyStyle}>{item.first}</td>
                      <td style={moduleTbodyStyle}>{item.second}</td>
                      <td style={moduleTbodyStyle}>{item.third}</td>
                      <td style={moduleTbodyStyle}>{item.fourth}</td>
                      <td style={moduleTbodyStyle}>{item.fifth}</td>
                      {peakType === 'GENERALIZATION' && (
                        <>
                          <td style={moduleTbodyStyle}>{item.sixth}</td>
                          <td style={moduleTbodyStyle}>{item.seventh}</td>
                          <td style={moduleTbodyStyle}>{item.eighth}</td>
                        </>
                      )}
                    </>
                  )}
              </tr>
            ))}
          </table>
        </Col>
      </Row>

    </>

  )
}
