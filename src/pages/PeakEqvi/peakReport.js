/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-array-index-key */

import React from 'react'
import { Helmet } from 'react-helmet'
import {
    Layout,
    Row,
    Col,
    Card,
    Button,
    Typography,
    Tabs,
    Icon,
    Affix,
    Drawer,
    Form,
    DatePicker,
    Collapse,
    Modal,
    Radio,
    Table,
    Empty

} from 'antd'
import { Redirect } from 'react-router-dom'
import { ResponsiveLine } from '@nivo/line'
import { connect } from 'react-redux'
import moment from 'moment'

const { Title, Text } = Typography
const { Content } = Layout
const { RangePicker } = DatePicker
const { TabPane } = Tabs
const { Panel } = Collapse;

const columns = [
    {
        title: 'Domain',
        dataIndex: 'domain',
        key: 'domain',
    },
    {
        title: 'Score',
        dataIndex: 'domainScore',
        key: 'domainScore',
    },
];

@connect(({ user, student, peakequivalence }) => ({ user, student, peakequivalence }))
class PeakEqviReport extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            componentsKey: Math.random(),
            GraphData: [
                {
                    id: 'Baseline',
                    color: 'hsl(2, 70%, 50%)',
                    data: [],
                },
                {
                    id: 'In-Therapy',
                    color: 'hsl(2, 70%, 50%)',
                    data: [],
                },
            ],
        }
    }

    componentDidMount() {
        const { dispatch, peakequivalence: { ProgramId, SelectedPeakType } } = this.props
        const programId = localStorage.getItem('peakId')

        if (!programId) window.location.href = '/#/'

        if (!ProgramId) {
            dispatch({
                type: 'peakequivalence/SET_STATE',
                payload: {
                    ProgramId: programId
                }
            })
        }
        dispatch({
            type: 'student/STUDENT_DETAILS',
        })

        dispatch({
            type: 'peakequivalence/GET_REPORT',
            payload: {
                peakType: SelectedPeakType ? SelectedPeakType : 'Basic'
            }
        })

    }

    onChange = (e) => {
        // console.log(`radio checked:${e.target.value}`);

        const { dispatch, peakequivalence: { SelectedPeakType } } = this.props

        dispatch({
            type: 'peakequivalence/GET_REPORT',
            payload: {
                peakType: e.target.value
            }
        })

        this.setState({
            componentsKey: Math.random(),
        })
    }

    render() {

        const {
            form,
            student: { StudentName },
            peakequivalence: {
                PeakTypeList,
                Loading,
                ObjectLoaded,
                SelectedPeakType,
                ReportScoreList
            }
        } = this.props

        const {
            GraphData,
            componentsKey
        } = this.state

        if (Loading) {
            return 'Loading...'
        }

        const studId = localStorage.getItem('studentId')
        if (!studId) {
            return <Redirect to="/" />
        }

        const graphData = []
        const dataSet = []
        ReportScoreList.map(item => {
            if (item.domain !== "Total") dataSet.push({ x: item.domain, y: item.domainScore })
        })
        const firstObject = {
            "id": "Type",
            "color": "hsl(90, 70%, 50%)",
            "data": dataSet
        }
        graphData.push(firstObject)


        console.log(graphData)

        return (
            <>

                <Helmet title="Peak Eqvi" />
                <Layout style={{ padding: '0px' }}>

                    {Loading ?
                        <p>Loading...</p>
                        :

                        <Content
                            style={{
                                padding: '0px 20px',
                                maxWidth: 1300,
                                width: '100%',
                                margin: '0px auto',
                            }}
                        >

                            <Row>
                                <Col sm={24}>

                                    <div
                                        role="presentation"
                                        style={{
                                            borderRadius: 10,
                                            border: '2px solid #F9F9F9',
                                            padding: '20px 27px 20px',
                                            marginBottom: '2%',
                                            display: 'block',

                                            width: '100%',
                                            marginRight: '10px',
                                            height: '650px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        <Title style={{ fontSize: '20px', lineHeight: '20px' }}>
                                            {StudentName}&apos;s Assessment Report
                                            </Title>

                                        <Radio.Group onChange={(e) => this.onChange(e)} defaultValue={SelectedPeakType ? SelectedPeakType : 'Basic'}>
                                            <Radio.Button value="Basic">Basic</Radio.Button>
                                            <Radio.Button value="Intermediate">Intermediate</Radio.Button>
                                            <Radio.Button value="Advanced">Advanced</Radio.Button>
                                        </Radio.Group>

                                        <Row>
                                            <Col span={8} style={{ padding: 10 }}>
                                                <Table key={componentsKey} dataSource={ReportScoreList} columns={columns} />
                                            </Col>
                                            <Col span={16} style={{ padding: 10 }}>
                                                <div
                                                    role="presentation"
                                                    style={{
                                                        borderRadius: 10,
                                                        border: '2px solid #F9F9F9',
                                                        // padding: '28px 27px 20px',
                                                        display: 'block',
                                                        // marginLeft: '10px',
                                                        width: '100%',
                                                        height: '380px',
                                                        // overflowY: 'auto'
                                                    }}
                                                >
                                                    {GraphData.length === 0 ? (
                                                        <>
                                                            <Empty style={{ marginTop: '100px' }} />
                                                        </>
                                                    ) : (
                                                            ''
                                                        )}
                                                    {graphData && (
                                                        <ResponsiveLine
                                                            data={graphData}
                                                            margin={{ top: 30, right: 50, bottom: 30, left: 60 }}
                                                            xScale={{ type: 'point' }}
                                                            yScale={{ type: 'linear', min: 0, max: 6, stacked: true, reverse: false }}
                                                            curve="natural"
                                                            axisTop={null}
                                                            axisRight={null}
                                                            // axisBottom={{
                                                            //   orient: 'bottom',
                                                            //   tickSize: 5,
                                                            //   tickPadding: 5,
                                                            //   tickRotation: 0,
                                                            //   legend: 'transportation',
                                                            //   legendOffset: 36,
                                                            //   legendPosition: 'middle'
                                                            // }}
                                                            axisLeft={{
                                                                orient: 'left',
                                                                tickSize: 5,
                                                                tickPadding: 5,
                                                                tickRotation: 0,
                                                                legend: 'Score',
                                                                legendOffset: -40,
                                                                legendPosition: 'middle'
                                                            }}
                                                            colors={{ scheme: 'category10' }}
                                                            lineWidth={3}
                                                            pointSize={5}
                                                            pointColor={{ theme: 'background' }}
                                                            pointBorderWidth={2}
                                                            pointBorderColor={{ from: 'serieColor' }}
                                                            pointLabel="y"
                                                            pointLabelYOffset={-12}
                                                            useMesh={true}
                                                        />
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>



                                    </div>

                                </Col>

                            </Row>

                        </Content>
                    }
                </Layout>
            </>
        )
    }
}

export default Form.create()(PeakEqviReport)
