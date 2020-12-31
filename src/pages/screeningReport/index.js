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
/* eslint-disable prefer-template */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-destructuring */

import React from 'react'
import { Helmet } from 'react-helmet'
import {
    Layout,
    Row,
    Col,
    Typography,
    Tabs,
    Button,
    Select,
} from 'antd'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import Authorize from '../../components/LayoutComponents/Authorize'


const { Title, Text } = Typography
const { Content } = Layout
const { TabPane } = Tabs;
const { Option } = Select;

const customDivStyle = {
    borderRadius: 10,
    border: '2px solid #F9F9F9',
    padding: '28px 27px 20px',
    marginBottom: '2%',
    display: 'block',
    // marginLeft: '10px',
    width: '100%',
    height: '650px',
    overflow: 'auto'
}

@connect(({ screening }) => ({ screening }))
class Screeing extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'screening/LOAD_REPORT_DATA'
        })
    }

    saveAreaResponse = (value, obj, areaId) => {
        const { dispatch } = this.props
        console.log(value, obj)
        if (value !== 'SELECT') {

            let val = ''
            if (value === 'ADVANCED') {
                val = 'advanced'
            }
            if (value === 'DELAYED') {
                val = 'delayed'
            }
            if (value === 'ONTRACK') {
                val = 'onTrack'
            }

            dispatch({
                type: 'screening/RECORD_REPORT_AREA_RESPONSE',
                payload: {
                    areaId,
                    response: val,
                    objectId: obj.node.id
                }
            })
        }
    }

    saveAssessmentAction = (value, obj) => {
        const { dispatch } = this.props
        console.log(value, obj)
        if (value !== 'SELECT') {

            let val = ''
            if (value === 'SELECTED') {
                val = 'Selected'
            }
            if (value === 'PRELIMINARY') {
                val = 'Preliminary'
            }

            dispatch({
                type: 'screening/RECORD_ASSESSMENT_RESPONSE',
                payload: {
                    action: val,
                    objectId: obj.node.id
                }
            })
        }
    }

    loadLearnerAssessments = item => {
        const { dispatch } = this.props

        dispatch({
            type: 'screening/SET_STATE',
            payload: {
                SelectedLearner: item
            }
        })

        dispatch({
            type: 'screening/GET_LERNER_SCREENINGS',
            payload: {
                id: item.id
            }
        })
    }

    render() {
        const { screening: { LearnersList, SelectedLearnerAssessments, AssessmentAreas, LoadingLearnerAssessments, LoadingLearners, SelectedLearner } } = this.props
        const tdStyle = { border: '1px solid #dddddd', padding: 4, textAlign: 'center' }
        const tdSelectedStyle = { border: '1px solid #dddddd', padding: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }
        const filteredList = SelectedLearnerAssessments
        const customStyles = {
            header: {
                style: {
                    maxHeight: '50px',
                    marginTop: '100px'
                },
            },
            headRow: {
                style: {
                    borderTopStyle: 'solid',
                    borderTopWidth: '1px',
                    borderTopColor: '#ddd',
                    backgroundColor: '#f5f5f5',
                },
            },
            headCells: {
                style: {
                    '&:not(:last-of-type)': {
                        borderRightStyle: 'solid',
                        borderRightWidth: '1px',
                        borderRightColor: '#ddd',
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
                    },
                    fontSize: '11px',
                },
            },
            pagination: {
                style: {
                    position: 'absolute',
                    top: '30px',
                    right: '10px',
                    borderTopStyle: 'none',
                    minHeight: '35px',
                    width: '90%'
                },
            },
            table: {
                style: {
                    paddingBottom: '40px',
                    marginTop: '40px',
                },
            },
        }

        const columns = [
            {
                name: 'Name',
                selector: 'node.name',
                sortable: true,
                minWidth: '120px',
                maxWidth: '120px',
            },
            {
                name: 'Date',
                selector: 'node.date',
                sortable: true,
                minWidth: '120px',
                maxWidth: '120px',
            },
            {
                name: 'Gender',
                selector: 'node.sex',
                sortable: true,
                minWidth: '120px',
                maxWidth: '120px',
            },
            {
                name: 'Age',
                selector: 'node.age',
                sortable: true,
                minWidth: '120px',
                maxWidth: '120px',
            },

            {
                name: 'Status',
                selector: 'node.status',
                sortable: true,
                minWidth: '120px',
                maxWidth: '120px',
            },
        ]

        for (let i = 0; i < 16; i++) {
            const qName = 'Question ' + (i + 1)
            columns.push(
                {
                    name: qName,
                    sortable: true,
                    minWidth: '220px',
                    maxWidth: '250px',
                    cell: row => (
                        <div>
                            <span style={{ fontWeight: 700 }}>Question :</span> {row.node.assessmentQuestions.edges[i]?.node.question.question}
                            <br />
                            <span style={{ fontWeight: 700 }}>Answer :</span> <span style={{ color: 'green', fontWeight: 700 }}>{row.node.assessmentQuestions.edges[i]?.node.answer.name}</span>
                        </div>
                    ),
                },
            )
        }

        if (AssessmentAreas.length > 0) {

            for (let i = 0; i < AssessmentAreas.length; i++) {
                const qName = 'Area - ' + AssessmentAreas[i]?.name
                columns.push(
                    {
                        name: qName,
                        sortable: true,
                        minWidth: '220px',
                        maxWidth: '250px',
                        cell: row => {
                            let response = 'SELECT'
                            row.node.assessmentAreas.edges.map(nodeItem => {
                                if (nodeItem.node.area.id === AssessmentAreas[i]?.id) {
                                    response = nodeItem.node.response
                                }
                            })
                            return (
                                <div>
                                    <Select defaultValue={response} style={{ width: 200 }} onChange={(e) => this.saveAreaResponse(e, row, AssessmentAreas[i]?.id)}>
                                        <Option value="SELECT">Select</Option>
                                        <Option value="DELAYED">Delayed</Option>
                                        <Option value="ONTRACK">On Track</Option>
                                        <Option value="ADVANCED">Advanced</Option>

                                    </Select>
                                </div>
                            )
                        },
                    },
                )
            }
        }

        columns.push(
            {
                name: "Action",
                sortable: true,
                minWidth: '220px',
                maxWidth: '250px',
                cell: row => {
                    let response = 'SELECT'
                    if (row.node.marked) {
                        response = row.node.marked
                    }
                    return (
                        <div>
                            <Select defaultValue={response} style={{ width: 200 }} onChange={(e) => this.saveAssessmentAction(e, row)}>
                                <Option value="SELECT">Select</Option>
                                <Option value="PRELIMINARY">Preliminary</Option>
                                <Option value="SELECTED">Selected</Option>
                            </Select>
                        </div>
                    )
                },
            },
        )

        return (
            <>
                <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
                    <Helmet title="Screening" />
                    <Layout style={{ padding: '0px' }}>
                        <Content
                            style={{
                                padding: '0px 20px',
                                maxWidth: 1300,
                                width: '100%',
                                margin: '0px auto',
                            }}
                        >
                            <Row>
                                <Col sm={5}>
                                    <div
                                        role="presentation"
                                        style={customDivStyle}
                                    >
                                        <Title style={{ fontSize: 20, lineHeight: '27px' }}>Recorded Screenings</Title>
                                        {LoadingLearners ?
                                            <p>Loading...</p>
                                            :


                                            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                                {LearnersList.map(item => (
                                                    <tr>
                                                        <td style={SelectedLearner?.id === item.id ? tdSelectedStyle : tdStyle}><Button type="link" onClick={() => this.loadLearnerAssessments(item)}>{item.firstname}</Button></td>
                                                    </tr>
                                                ))}

                                            </table>
                                        }
                                    </div>
                                </Col>
                                <Col sm={19}>
                                    <div
                                        role="presentation"
                                        style={customDivStyle}
                                    >
                                        {LoadingLearnerAssessments ?
                                            <p>Loading...</p>
                                            :

                                            <DataTable
                                                // style={{ marginTop: 100 }}
                                                title="Learners List"
                                                columns={columns}
                                                theme="default"
                                                dense={true}
                                                pagination={true}
                                                data={filteredList}
                                                customStyles={customStyles}
                                                noHeader={true}
                                                paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
                                            />

                                        }

                                        {/* <Tabs type="card">
                                            <TabPane tab="Basic Data" key="1">
                                                
                                            </TabPane>
                                            <TabPane tab="Assessments" key="2">
                                                Content of Tab Pane 2
                                            </TabPane>
                                            <TabPane tab="Result" key="3">
                                                Content of Tab Pane 3
                                            </TabPane>
                                        </Tabs> */}
                                    </div>
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Authorize>
            </>
        )
    }
}

export default Screeing
