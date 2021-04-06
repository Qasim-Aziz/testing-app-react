/* eslint-disable camelcase */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import './table.scss'
import { useHistory, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { Typography, Row, Col, Button } from 'antd'
import Triangle from './Triangle'
import apolloClient from '../../apollo/config'

const { Title, Text } = Typography

const color1 = '#ffffff'
const color2 = '#f7ff00'

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
                instructions
              }
            }
          }
          no {
            edges {
              node {
                id
                code
                instructions
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

const lastAssesmentQuery = gql`
    mutation lastFourRecords($pk:ID!){
        lastFourRecords(input:{
            pk:$pk
        })
        {
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
        }
    }
`


export default () => {
    const programId = localStorage.getItem('peakId')
    const peakType = localStorage.getItem('peakType')
    const assesor = localStorage.getItem('userName')

    const [date, setDate] = useState('')
    const [studentDetails, setStudentDetails] = useState({})
    const [allcode, setAllcode] = useState([])
    const [ldata, setLdata] = useState([])
    const [showAssessmentIndex, setShowAssessmentIndex] = useState('all')
    // const [lastFour, setLastFour] = useState('')
    const history = useHistory()
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

    const [getLastAssesment] = useMutation(lastAssesmentQuery)

    const getxxx = (sdata, scode, lasts) => {
        const tempCodes = scode?.peakGetCodes?.edges
        const peakSummaryYesEdges = sdata?.peakDataSummary?.edges[0]?.node?.yes?.edges;
        const tempArray = []
        const tempSubArray = []

        tempCodes.forEach(codeItem => {
            codeItem.yes = color1
            for (let m = 0; m < peakSummaryYesEdges?.length; m += 1) {
                if (codeItem.node.code === peakSummaryYesEdges[m]?.node.code) {
                    codeItem.yes = color2;
                    // break
                }
            }
            tempArray.push({ code: codeItem.node.code, yes: codeItem.yes, node: codeItem.node })
        })


        const triangleRows = []
        const triangleFirstRow = []
        const firstQues = peakSummaryYesEdges?.filter(e => e?.node?.code === '1A');
        if (firstQues?.length > 0) {
            console.log('firstQues', firstQues)
            triangleFirstRow.push({ code: '1A', yes: color2, node: firstQues[0]?.node });
        } else {
            triangleFirstRow.push({ code: '1A', yes: color1, node: firstQues[0]?.node });
        }
        const secondQues = peakSummaryYesEdges?.filter(e => e?.node?.code === '1B');
        if (secondQues?.length > 0) {
            triangleFirstRow.push({ code: '1B', yes: color2, node: secondQues[0]?.node });
        } else {
            triangleFirstRow.push({ code: '1B', yes: color1, node: secondQues[0]?.node });
        }
        triangleRows.push(triangleFirstRow)

        // for creating triangle rows
        let i = 2
        let j = 2
        while (i < tempArray.length) {
            const tmp = tempArray
            let v = []
            v = tmp.slice(i, i + j)
            triangleRows.push(v)
            i += j
            j += 2
        }
        // end of creating triangle rows

        const lastAssessments = lasts?.data?.lastFourRecords?.programs;
        lastAssessments.forEach((assessmentItem, assessmentIndex) => {
            const ll = assessmentItem?.submitpeakresponsesSet?.edges[0]?.node?.yes?.edges?.forEach(ele => {
                triangleRows.forEach((row) => {
                    row.forEach(rowItem => {
                        if (ele.node.code === rowItem.code) {
                            if (assessmentIndex === 0 && rowItem.yes === color1) {
                                rowItem.yes = '#1208E7'
                            }

                            if (assessmentIndex === 1 && rowItem.yes === color1) {
                                rowItem.yes = '#0ACA07'
                            }
                            if (assessmentIndex === 2 && rowItem.yes === color1) {
                                rowItem.yes = '#E4695A'
                            }
                        }
                    })
                })
            })
        })
        setAllcode(triangleRows)
    }

    const setFirstTriangleRows = (sdata, triangleRows, color) => {
        const temTriangleRows = triangleRows
        temTriangleRows.forEach((row) => {
            row.forEach(rowItem => {
                rowItem.yes = color1
            })
        })
        const peakSummaryEdges = sdata?.peakDataSummary?.edges

        if (peakSummaryEdges.length > 0) {
            peakSummaryEdges[0].node?.yes.edges.map(ele => {
                temTriangleRows.forEach((row) => {
                    row.forEach(rowItem => {
                        if (ele.node.code === rowItem.code) {
                            rowItem.yes = color
                        }
                    })
                })
            })
            peakSummaryEdges[0].node?.no.edges.map(ele => {
                temTriangleRows.forEach((row) => {
                    row.forEach(rowItem => {
                        if (ele.node.code === rowItem.code) {
                            rowItem.yes = 'red'
                        }
                    })
                })
            })
        }

        setAllcode(temTriangleRows)
    }

    const setTriangleRows = (triangleRows, lastFour, index, color) => {
        console.log(lastFour, showAssessmentIndex)
        const temTriangleRows = triangleRows
        const lastAssessments = lastFour?.lastFourRecords?.programs[index]
        temTriangleRows.forEach((row) => {
            row.forEach(rowItem => {
                rowItem.yes = color1
            })
        })
        if (lastAssessments) {
            console.log(lastAssessments)
            lastAssessments.submitpeakresponsesSet.edges[0]?.node.yes.edges.forEach(ele => {
                temTriangleRows.forEach((row) => {
                    row.forEach(rowItem => {
                        if (ele.node.code === rowItem.code) {
                            rowItem.yes = color
                        }
                    })
                })

            })
            lastAssessments.submitpeakresponsesSet?.edges[0]?.node?.no?.edges?.forEach(ele => {
                temTriangleRows.forEach((row) => {
                    row.forEach(rowItem => {
                        if (ele.node.code === rowItem.code) {
                            rowItem.yes = 'red'
                        }
                    })
                })
            })
        }
        setAllcode(temTriangleRows)
    }

    const changeAssessmentTriangle = (index, color) => {
        if (index === 'all') {
            getxxx(sumdata, code, { data: ldata })
        }
        if (index === 'first') {
            setFirstTriangleRows(sumdata, allcode, color)
        }
        if (index === 0) {
            setTriangleRows(allcode, ldata, 0, color)
        }
        if (index === 1) {
            setTriangleRows(allcode, ldata, 1, color)
        }
        if (index === 2) {
            setTriangleRows(allcode, ldata, 2, color)
        }

        setShowAssessmentIndex(index)

    }

    useEffect(() => {
        console.log('showAssessmentIndex ==>', showAssessmentIndex)
        // if (showAssessmentIndex === 'all') {
        //     getxxx(sumdata, code, { res: ldata })
        // }
        // if (showAssessmentIndex === 0) {
        //     setTriangleRows(allcode, ldata, 0)
        // }
        // if (showAssessmentIndex === 1) {
        //     setTriangleRows(allcode, ldata, 1)
        // }
        // if (showAssessmentIndex === 2) {
        //     setTriangleRows(allcode, ldata, 2)
        // }

    }, [showAssessmentIndex])

    useEffect(() => {
        console.log(allcode)
    }, [allcode])

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

    useEffect(() => {

        if (sumdata !== undefined && code !== undefined) {
            getLastAssesment({ variables: { pk: programId } }).then((res) => {
                if (res) {
                    console.log('Response ===> ', res)
                    res?.data?.lastFourRecords?.programs.forEach((element, index) => {
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

            studentData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sumdata, code])

    const blankBlockStyle = {
        border: '1px solid',
        height: 30,
        width: 30,
        display: 'inline-block',
        fontSize: '11px',
        paddingTop: '2px'

    }
    const tdStyle = { border: '1px solid #dddddd', padding: 8, textAlign: 'center' }

    const rediretToDownload = () => {
        window.location.href = '/#/triangleReportPDF'
    }

    const generateWordDoc = () => {
        console.log('Clicked')
        window.location.href = '/#/peakReportDocGenerator'
    }

    return (
        <>
            {allcode?.length > 0 &&
                <div style={{padding: 5}}>
                    <Button style={{ float: 'right' }} onClick={() => rediretToDownload()}>Save & Download PDF</Button>
                    {showAssessmentIndex !== 'all' && <Button style={{ float: 'right', marginRight: '10px' }} onClick={() => changeAssessmentTriangle('all')}>Reset Triangle</Button>}
                    {/* <Text style={{ fontSize: 20, color: '#000' }}>
                        {studentDetails?.node?.firstname} {studentDetails?.node?.lastname}&apos;s - Triangle Report
                    </Text> */}

                    <Row>
                        <Col sm={24}>
                            <Triangle allcode={allcode} blankBlockStyle={blankBlockStyle} key={allcode} />
                        </Col>
                        <Col sm={24}>

                            <table style={{ borderCollapse: 'collapse', margin: '15px auto' }}>

                                <tr>
                                    <td style={{ ...tdStyle, width: 250 }}>Assessment Date</td>
                                    <td style={{ ...tdStyle, width: 350 }}>Assessor Name</td>
                                    <td style={tdStyle}>Color</td>
                                    <td style={tdStyle}>Action</td>
                                </tr>
                                <tr>
                                    <td style={{ ...tdStyle, width: 250 }}><Button type="link" style={{ padding: 0, height: 10 }} onClick={() => changeAssessmentTriangle('first', '#F7FF00')}>{date}</Button></td>
                                    <td style={{ ...tdStyle, width: 350 }}>{assesor ? JSON.parse(assesor) : null}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}><span style={{ backgroundColor: '#F7FF00', width: '100px', display: 'block', paddingLeft: '100px' }}>&nbsp;</span></td>
                                    <td style={tdStyle}><Button type="link" onClick={() => generateWordDoc()}>Generate Doc</Button></td>
                                </tr>
                                {ldata?.lastFourRecords?.programs?.map((item, i) => (
                                    <tr>
                                        <td style={{ ...tdStyle, width: 250 }}><Button type="link" style={{ padding: 0, height: 10 }} onClick={() => changeAssessmentTriangle(i, item?.color)}>{item?.date}</Button></td>
                                        <td style={{ ...tdStyle, width: 350 }}>{`${item?.user?.firstName}${" "}${item?.user?.lastName}`}</td>
                                        <td style={tdStyle}><span style={{ backgroundColor: item?.color, width: '100px', display: 'block', paddingLeft: '100px' }}>&nbsp;</span></td>
                                        <td style={tdStyle}><Button type="link" onClick={() => generateWordDoc()}>Generate Doc</Button></td>
                                    </tr>
                                ))}

                            </table>

                        </Col>
                    </Row>
                </div>}
        </>

    )
}
