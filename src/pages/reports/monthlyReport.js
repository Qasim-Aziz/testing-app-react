/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */
/* eslint-disable object-shorthand */
/* eslint-disable import/extensions */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-curly-brace-presence */

import React from 'react'
import {
    Layout,
    Row,
    Col,
    Button,
    Form,
    Select,

} from 'antd'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import { connect } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import './table.scss'
import {
    STUDENT_QUERY,
    GOALS_DETAILS,
    GET_MAND_REPORT,
    GET_TEMPLATE_REPORT,
    GET_TARGET_DAILY_RESPONSE,
} from './monthlyReport.query'

import BehaviorGraph from './monthlyBehaviorGraph'
import ApolloClient from '../../apollo/config'
import { calculateAge } from '../../utilities'

const { Option } = Select


const filterCardStyle = {
    background: '#F1F1F1',
    padding: 10,
    margin: 0,
    height: 50,
    overflow: 'hidden',
    backgroundColor: 'rgb(241, 241, 241)',
}

@connect(({ user, student, learnersprogram }) => ({ user, student, learnersprogram }))
class Goals extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            learnerDetails: null,
            goalsDetails: [],
            goalsAvailable: false,
            overViewGraphData: [],
            targetGraphData: {},
            mandGraphData: [],
            behaviorTemplates: [],
            start: moment().subtract(1, 'M').startOf('M').format('YYYY-MM-DD'),
            end: moment().startOf('M').format('YYYY-MM-DD'),
        }
    }

    componentDidMount() {
        const studentId = localStorage.getItem('studentId')
        this.fetchData(studentId)
        console.log('fetch data')
        // console.log(moment().startOf('M').format('YYYY-MM-DD'))
        // console.log(moment().subtract(1, 'M').startOf('M').format('YYYY-MM-DD'))
    }

    componentDidUpdate(prevProps) {
        const { selectedStudentId } = this.props
        const studentId = localStorage.getItem('studentId')
        if (selectedStudentId != prevProps.selectedStudentId) {
            this.fetchData(studentId)
            console.log('fetch data')
        }
    }

    fetchData = studentId => {
        const {start, end} = this.state
        // GET STUDENT DETAILS
        ApolloClient.query({
            query: STUDENT_QUERY,

            variables: {
                studentId
            }
        })
            .then(result => {
                if (result && result.data) {
                    this.setState({ learnerDetails: result.data.student })
                }
            })
            .catch(error => console.log(error))

        // GET GOALS DETAILS
        ApolloClient.query({
            query: GOALS_DETAILS,

            variables: {
                studentId,
                status: ["R29hbFN0YXR1c1R5cGU6NA=="],
                start,
                end
            }
        })
            .then(result => {
                if (result && result.data) {
                    let gData = []
                    let targetGraphResponse = {}
                    result.data.goalsLongProgressReport.map(item => {
                        gData.push({ "goal": item.goal.goalName, "count": item.masteryDays })
                    })

                    result.data.goalsLongProgressReport.map(item =>
                        item.goal.shorttermgoalSet.edges.map(shortItem =>
                            shortItem.node.targetAllocateSet.edges.map(targetNode =>
                                <>
                                    {targetNode.node.masterDate && this.generateGraph(targetNode.node.id)}
                                </>
                            )))


                    this.setState({
                        goalsDetails: result.data.goalsLongProgressReport,
                        goalsAvailable: true,
                        overViewGraphData: gData,

                    })
                }
            })
            .catch(error => console.log(error))

        // GET MAND REPORT DETAILS
        ApolloClient.query({
            query: GET_MAND_REPORT,

            variables: {
                studentId,
                start,
                end
            }
        })
            .then(result => {
                if (result && result.data) {
                    const mandGData = []
                    result.data.mandReport.map(mandItem => {
                        const gData = []
                        mandItem.data.map(dateItem => {
                            gData.push({ "x": moment(dateItem.formattedDate).format('DD'), "y": dateItem.count })
                        })
                        mandGData.push({ "id": mandItem.measurments, "data": gData })
                    })

                    this.setState({
                        mandGraphData: mandGData
                    })
                }
            })
            .catch(error => console.log(error))


        // GET BEHAVIOR TEMPLATES
        ApolloClient.query({
            query: GET_TEMPLATE_REPORT,

            variables: {
                studentId,
                start,
                end
            }
        })
            .then(result => {
                if (result && result.data) {
                    this.setState({
                        behaviorTemplates: result.data.getTemplateForReports
                    })
                }
            })
            .catch(error => console.log(error))


    }

    pdfToHTML = () => {
        // const { learnerDetails } = this.state
        // var source = document.getElementById('HTMLtoPDF');

        // if (learnerDetails) {
        //     const doc = new JsPDF('portrait');
        //     const width = doc.internal.pageSize.getWidth();
        //     const height = doc.internal.pageSize.getHeight();
        //     doc.setFontSize(12);
        //     doc.text(10, 20, `Name: ${learnerDetails.firstname} ${learnerDetails.lastname}`);
        //     doc.text(10, 28, `Age: ${calculateAge(learnerDetails.dob)}`);
        //     doc.text(10, 36, `DOB: ${learnerDetails.dob}`);
        //     doc.text(10, 44, `Location: ${learnerDetails.currentAddress}`);
        //     doc.text(10, 52, 'Service start date: 21/12/2019');
        //     doc.line(20, 20, 60, 20)
        //     html2canvas(source).then((canvas) => {
        //         const imgData = canvas.toDataURL('image/png');
        //         doc.addImage(imgData, 2, 62)
        //         doc.save('DOC.pdf');
        //     })

        //     // doc.save('DOC.pdf');
        // }

        var element = document.getElementById('HTMLtoPDF');
        var opt = {
            margin: 0,
            filename: 'myfile.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).save();
    }


    generateGraph = targetId => {
        // GET TARGET DAILY RESPONSE 
        const { targetGraphData } = this.state
        const targetGData = []

        ApolloClient.query({
            query: GET_TARGET_DAILY_RESPONSE,

            variables: {
                targetId,
                start: "2020-11-01",
                end: "2020-12-01"
            }
        })
            .then(result => {
                if (result && result.data) {
                    result.data.getCorrectPercentage?.map(item => {
                        targetGData.push({ "date": moment(item.date).format('DD'), "percentage": item.correctPercent })
                    })

                    targetGraphData[targetId] = targetGData

                    this.setState({
                        targetGraphData
                    })
                }

            })
            .catch(error => console.log(error))
    }





    render() {
        const {
            student: { StudentName },

        } = this.props

        const {
            goalsDetails,
            learnerDetails,
            goalsAvailable,
            overViewGraphData,
            targetGraphData,
            mandGraphData,
            behaviorTemplates,
            start,
            end
        } = this.state

        return (
            <div>
                <Row>
                    <Col sm={24}>
                        <div style={filterCardStyle}>


                            <Button style={{ float: 'right' }} onClick={this.pdfToHTML}>Download PDF</Button>
                        </div>
                    </Col>
                    <Col sm={24}>

                        <div id="HTMLtoPDF" style={{ border: '1px solid #f2f2f2', padding: 10, width: '793px', marginLeft: 'auto', marginRight: 'auto', }}>
                            <p style={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9' }}>Progress Overview</p>

                            {learnerDetails && (
                                <div>
                                    <p style={{ marginBottom: 0 }}>Name: <b>{learnerDetails?.firstname} {learnerDetails?.lastname}</b></p>
                                    
                                    <p style={{ marginBottom: 0 }}>DOB: <b>{learnerDetails?.dob}</b></p>
                                    <p style={{ marginBottom: 5 }}>Location: <b>{learnerDetails?.currentAddress}</b></p>
                                </div>
                            )}


                            <p style={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9' }}>Goals Graph</p>

                            <div style={{ height: 250 }}>
                                <ResponsiveBar
                                    data={overViewGraphData}
                                    keys={['count']}
                                    indexBy="goal"
                                    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                                    padding={0.3}
                                    valueScale={{ type: 'linear' }}
                                    indexScale={{ type: 'band', round: true }}
                                    colors={{ scheme: 'nivo' }}
                                    defs={[
                                        {
                                            id: 'dots',
                                            type: 'patternDots',
                                            background: 'inherit',
                                            color: '#38bcb2',
                                            size: 4,
                                            padding: 1,
                                            stagger: true
                                        },
                                        {
                                            id: 'lines',
                                            type: 'patternLines',
                                            background: 'inherit',
                                            color: '#eed312',
                                            rotation: -45,
                                            lineWidth: 6,
                                            spacing: 10
                                        }
                                    ]}
                                    fill={[
                                        {
                                            match: {
                                                id: 'fries'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'sandwich'
                                            },
                                            id: 'lines'
                                        }
                                    ]}
                                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Goals',
                                        legendPosition: 'middle',
                                        legendOffset: 32
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Count',
                                        legendPosition: 'middle',
                                        legendOffset: -40
                                    }}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}

                                    animate={true}
                                    motionStiffness={90}
                                    motionDamping={15}
                                />
                            </div>
                            <hr />

                            {
                                goalsDetails.map((item, itemIndex) =>
                                    <>
                                        <div style={{padding: 5, backgroundColor: '#f9f9f9'}}>
                                            <p>LTG {itemIndex + 1}: {item.goal.goalName}</p>
                                            <p>Status: {item.goal.goalStatus.status}, Initiated Date: {item.goal.dateInitialted}, Mastered Date: {item.dateMastered}</p>
                                        </div>

                                        <hr />
                                        {item.goal.shorttermgoalSet.edges.map(shortItem =>
                                            <div style={{ paddingLeft: 20 }}>
                                                <p>STG : {shortItem.node.goalName}</p>
                                                <p>Status: {shortItem.node.goalStatus.status}, Initiated Date: {shortItem.node.dateInitialted}, Mastered Date: {shortItem.node.masterDate}</p>
                                                <hr />
                                                {shortItem.node.targetAllocateSet.edges.map(targetItem =>
                                                    <div style={{ paddingLeft: 20 }}>
                                                        {targetItem.node.masterDate && (
                                                            <>
                                                                <p>Target: {targetItem.node.targetAllcatedDetails?.targetName}</p>
                                                                <p>Initiated Date:  {targetItem.node.targetAllcatedDetails?.dateBaseline}, Mastered Date: {targetItem.node.masterDate}</p>
                                                                <div style={{ height: 200 }}>

                                                                    <ResponsiveBar
                                                                        key={targetItem.node.id}
                                                                        data={targetGraphData[targetItem.node.id] ? targetGraphData[targetItem.node.id] : []}
                                                                        keys={['percentage']}
                                                                        indexBy="date"
                                                                        margin={{ top: 15, right: 60, bottom: 50, left: 60 }}
                                                                        padding={0.3}
                                                                        valueScale={{ type: 'linear' }}
                                                                        indexScale={{ type: 'band', round: true }}
                                                                        colors={{ scheme: 'nivo' }}
                                                                        defs={[
                                                                            {
                                                                                id: 'dots',
                                                                                type: 'patternDots',
                                                                                background: 'inherit',
                                                                                color: '#38bcb2',
                                                                                size: 4,
                                                                                padding: 1,
                                                                                stagger: true
                                                                            },
                                                                            {
                                                                                id: 'lines',
                                                                                type: 'patternLines',
                                                                                background: 'inherit',
                                                                                color: '#eed312',
                                                                                rotation: -45,
                                                                                lineWidth: 6,
                                                                                spacing: 10
                                                                            }
                                                                        ]}
                                                                        fill={[
                                                                            {
                                                                                match: {
                                                                                    id: 'fries'
                                                                                },
                                                                                id: 'dots'
                                                                            },
                                                                            {
                                                                                match: {
                                                                                    id: 'sandwich'
                                                                                },
                                                                                id: 'lines'
                                                                            }
                                                                        ]}
                                                                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                                                        axisTop={null}
                                                                        axisRight={null}
                                                                        axisBottom={{
                                                                            tickSize: 5,
                                                                            tickPadding: 5,
                                                                            tickRotation: 0,
                                                                            legend: 'Dates',
                                                                            legendPosition: 'middle',
                                                                            legendOffset: 32
                                                                        }}
                                                                        axisLeft={{
                                                                            tickSize: 5,
                                                                            tickPadding: 5,
                                                                            tickRotation: 0,
                                                                            legend: 'Percentage (%)',
                                                                            legendPosition: 'middle',
                                                                            legendOffset: -40
                                                                        }}
                                                                        labelSkipWidth={12}
                                                                        labelSkipHeight={12}
                                                                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}

                                                                        animate={true}
                                                                        motionStiffness={90}
                                                                        motionDamping={15}
                                                                    />

                                                                </div>
                                                            </>
                                                        )}

                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </>
                                )
                            }

                            <p style={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9' }}>Behaviors Progress</p>
                            <div>
                                {behaviorTemplates.map(templateItem =>
                                    <>
                                        <div style={{ height: 250 }}>
                                            {templateItem.template.behavior?.behaviorName}
                                            <BehaviorGraph
                                                key={templateItem.template.id}
                                                startDate={start}
                                                endDate={end}
                                                selectedBehavior={templateItem.template.id}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <p style={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9', marginTop: 20 }}>Mand Progress</p>
                            <div style={{ height: 400 }}>

                                <ResponsiveLine
                                    key="mand"
                                    data={mandGraphData}
                                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                    xScale={{ type: 'point' }}
                                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                                    yFormat=" >-.2f"
                                    curve="cardinal"
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        orient: 'bottom',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Date',
                                        legendOffset: 36,
                                        legendPosition: 'middle'
                                    }}
                                    axisLeft={{
                                        orient: 'left',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'count',
                                        legendOffset: -40,
                                        legendPosition: 'middle'
                                    }}
                                    colors={{ scheme: 'paired' }}
                                    pointSize={10}
                                    pointColor={{ theme: 'background' }}
                                    pointBorderWidth={2}
                                    pointBorderColor={{ from: 'serieColor' }}
                                    pointLabelYOffset={-12}
                                    useMesh={true}
                                    legends={[
                                        {
                                            anchor: 'bottom-right',
                                            direction: 'column',
                                            justify: false,
                                            translateX: 100,
                                            translateY: 50,
                                            itemsSpacing: 0,
                                            itemDirection: 'right-to-left',
                                            itemWidth: 80,
                                            itemHeight: 20,
                                            itemOpacity: 0.75,
                                            symbolSize: 12,
                                            symbolShape: 'circle',
                                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                />
                            </div>


                        </div>

                    </Col>
                </Row>
            </div>
        )
    }
}

export default Form.create()(Goals)
