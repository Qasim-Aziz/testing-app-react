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
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-self-compare */
/* eslint-disable yoda */

import React from 'react'
import { Helmet } from 'react-helmet'
import { Layout, Row, Col, Typography, Button, Icon, Collapse, } from 'antd'
import { connect } from 'react-redux'
import LoadingComponent from 'components/LoadingComponent'
import actions from 'redux/iisaassessment/actions'

const { Content } = Layout
const { Title, Text } = Typography
const { Panel } = Collapse;

const cardStyle = {
	background: '#FFFFFF',
	boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
	borderRadius: 7,
	padding: '5px 12px',
	alignItems: 'center',
	display: 'block',
	width: '100%',
	marginBottom: '10px',
	lineHeight: '27px',
	cursor: 'pointer'
	// minHeight: '130px',
}

const selectedCardStyle = {
	background: '#3f72af',
	color: '#fff',
	boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
	borderRadius: 7,
	padding: '5px 12px',
	alignItems: 'center',
	display: 'block',
	width: '100%',
	marginBottom: '10px',
	lineHeight: '27px',
	cursor: 'pointer'
	// minHeight: '130px',
}

const titleStyle = {
	fontSize: '14px',
	lineHeight: '24px',
	display: 'block',
	width: '100%',
}

const selectedTitleStyle = {
	fontSize: '14px',
	lineHeight: '24px',
	display: 'block',
	width: '100%',
	color: '#fff'
}

const buttonDefaultStyle = { padding: '20px auto', width: '220px', height: '50px', marginRight: '20px', fontSize: '15px', color: '#3f72af', margin: 5 }
const buttonTrueStyle = { padding: '20px auto', width: '220px', height: '50px', marginRight: '20px', fontSize: '15px', color: 'white', backgroundColor: '#3f72af', margin: 5 }



@connect(({ iisaassessment, student }) => ({
	iisaassessment,
	student,
}))
class Screeing extends React.Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	componentDidMount() {
		this.onRenderWithoutID()
	}

	onRenderWithoutID = () => {
		const { dispatch, iisaassessment: { SelectedAssessmentId } } = this.props
		if (!SelectedAssessmentId) {
			window.location.href = '/#/iisaAssessment'
		}
		else {
			dispatch({
				type: actions.LOAD_ASSESSMENT_REPORT,
				payload: {
					objectId: SelectedAssessmentId
				}
			})
		}
	}

	showReport = () => {
		window.location.href = '/#/iisaReport'
	}

	render() {
		const {
			student: { StudentName },
			iisaassessment: {
				AssessmentReportLoading,
				SelectedAssessmentId,
				AssessmentReport,
			},
		} = this.props

		if (!SelectedAssessmentId) {
			window.location.href = '/#/iisaAssessment'
		}

		if (AssessmentReportLoading) {
			return <LoadingComponent />
		}

		return (
			<>
				<Helmet title="IISA Report" />
				<Layout style={{ padding: '0px' }}>
					<Content
						style={{
							padding: '0px 20px',
							maxWidth: 1300,
							width: '100%',
							margin: '0px auto',
						}}
					>
						{!AssessmentReportLoading ?
							<Row>
								<Col sm={24}>
									
										{AssessmentReport && (
											<>
												<Title style={{ fontSize: '20px', lineHeight: '20px' }}>{StudentName}&apos;s Assessment</Title>
												<br />
												<Title style={{ fontSize: '20px', lineHeight: '20px' }}>Score : {AssessmentReport.score}</Title>
												<br />
												<Title style={{ fontSize: '20px', lineHeight: '20px' }}>classification : {AssessmentReport.classification}</Title>
											</>
										)}

									
								</Col>
							</Row>
							:
							<>
								<p>Loading Assessment Report..</p>
							</>
						}
					</Content>

				</Layout>
			</>
		)
	}
}

export default Screeing
