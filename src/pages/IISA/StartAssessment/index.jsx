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
	border: '1px solid #E4E9F0',
	boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
	borderRadius: 10,
	padding: '16px 12px',
	alignItems: 'center',
	display: 'block',
	width: '100%',
	marginBottom: '20px',
	lineHeight: '27px',
	cursor: 'pointer'
	// minHeight: '130px',
}

const selectedCardStyle = {
	background: '#007acc',
	border: '1px solid #E4E9F0',
	color: '#fff',
	boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
	borderRadius: 10,
	padding: '16px 12px',
	alignItems: 'center',
	display: 'block',
	width: '100%',
	marginBottom: '20px',
	lineHeight: '27px',
	cursor: 'pointer'
	// minHeight: '130px',
}

const titleStyle = {
	fontSize: '20px',
	lineHeight: '24px',
	display: 'block',
	width: '100%',
}

const selectedTitleStyle = {
	fontSize: '20px',
	lineHeight: '24px',
	display: 'block',
	width: '100%',
	color: '#fff'
}

const buttonDefaultStyle = { padding: '20px auto', width: '350px', height: '50px', marginRight: '20px', fontSize: '15px', border: '1px solid #4BAEA0', color: '#4BAEA0' }
const buttonDefaultFalseStyle = { padding: '20px auto', width: '350px', height: '50px', marginRight: '20px', fontSize: '15px', border: '1px solid #FF8080', color: '#FF8080', marginTop: '15px' }
const buttonTrueStyle = { padding: '20px auto', width: '350px', height: '50px', marginRight: '20px', fontSize: '15px', border: '1px solid #bbb', color: 'white', backgroundColor: '#4BAEA0' }
const buttonFalseStyle = { padding: '20px auto', width: '350px', height: '50px', marginRight: '20px', fontSize: '15px', border: '1px solid #bbb', color: 'white', backgroundColor: '#FF8080', marginTop: '15px' }


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
				type: actions.LOAD_ASSESSMENT_OBJECT,
				payload: {
					objectId: SelectedAssessmentId
				}
			})
		}
	}

	changeActiveDomian = domainId => {
		console.log(domainId)
		if (domainId === 'report') {
				window.location.href = '/#/peakEquivalenceReport'
		}
		else if (domainId && domainId !== 'report') {

				const {
						dispatch,
						peakequivalence: {
								SelectedQuestionIndex,
								AssessmentObject,
								PEQuestionsListObject,
								SelectedDomainId,
								SelectedTestIndex,
						}
				} = this.props

				dispatch({
						type: actions.SET_STATE,
						payload: {
								SelectedDomainId: domainId,
								SelectedQuestionIndex: 0,
								SelectedQuestionId: PEQuestionsListObject[domainId][0]?.node.id,
								SelectedTestIndex: 0,
								SelectedTestId: PEQuestionsListObject[domainId][0]?.node.test.edges[0]?.node.id,
						}
				})
		}
}

	render() {
		const {
			student: { StudentName },
			iisaassessment: {
				AssessmentLoading,
				SelectedAssessmentId,
				AssessmentObject,
				IISAQuestions,
				IISADomains,
				SelectedQuestionId,
				SelectedDomainId,

			},
		} = this.props

		if (!SelectedAssessmentId) {
			window.location.href = '/#/iisaAssessment'
		}

		if (AssessmentLoading) {
			return <LoadingComponent />
		}

		return (
			<>
				<Helmet title="IISA Assessment" />
				<Layout style={{ padding: '0px' }}>
					<Content
						style={{
							padding: '0px 20px',
							maxWidth: 1300,
							width: '100%',
							margin: '0px auto',
						}}
					>
						{AssessmentObject ?
							<Row>
								<Col sm={16}>
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
											minHeight: '595px',
											overflow: 'auto',
										}}
									>

										<Title style={{ fontSize: '20px', lineHeight: '20px' }}>{StudentName}&apos;s Assessment</Title>

										<div>
											<Text style={{ fontSize: '18px', lineHeight: '24px' }}>
												Question Name
											</Text>

											<span style={{ float: 'right' }}>
												{0 === 0 ?
													<Button disabled>
														<Icon type="left" />
													</Button>
													:
													<Button onClick={this.goToPreviousQuestion}>
														<Icon type="left" />
													</Button>
												}
												&nbsp; Question 1 / 6 &nbsp;
                        {1 + 1 === 2 ?
													<Button disabled>
														<Icon type="right" />
													</Button>
													:
													<Button onClick={this.goToNextQuestion}>
														<Icon type="right" />
													</Button>
												}
											</span>

										</div>


										<div
											style={{
												background: '#FFFFFF',
												border: '1px solid #E4E9F0',
												boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
												borderRadius: 10,
												padding: '16px 12px',
												alignItems: 'center',
												display: 'block',
												width: '100%',
												marginBottom: '20px',
												lineHeight: '27px',
												marginTop: '40px',
												minHeight: '140px'
											}}
										>


											<Button onClick={() => this.recordResponse(true)} style={1 === true ? buttonTrueStyle : buttonDefaultStyle}> Response Button </Button>


										</div>




									</div>

								</Col>
								<Col sm={8}>
									<div
										style={{
											background: '#F9F9F9',
											borderRadius: 10,
											padding: '28px 27px 20px',
											display: 'block',
											width: '100%',
											minHeight: '650px',
											marginLeft: '10px',
										}}
									>
										<div style={{ height: '600px', overflow: 'auto' }}>
											<Collapse accordion bordered={false} onChange={(e) => this.changeActiveDomian(e)} activeKey={SelectedDomainId} key={SelectedDomainId}>
												{IISADomains.map((item, index) =>

													<Panel header={`${item.node.name}`} key={item.node.id}>

														<>
															<div onClick={() => this.changeQuestion(1)} style={1 === SelectedQuestionId ? selectedCardStyle : cardStyle}>
																<Title style={1 === SelectedQuestionId ? selectedTitleStyle : titleStyle}>Question 1</Title>
															</div>
														</>
														</Panel>
												)}
												<Button onClick={() => this.showReport()} style={{ width: '100%', marginTop: '20px', padding: '8px', backgroundColor: '#007acc', color: 'white' }}>View Report</Button>
											</Collapse>

										</div>
									</div>
								</Col>
							</Row>
							:
							<>
								<p>Loading Assessment Object..</p>
							</>
						}
					</Content>

				</Layout>
			</>
		)
	}
}

export default Screeing
