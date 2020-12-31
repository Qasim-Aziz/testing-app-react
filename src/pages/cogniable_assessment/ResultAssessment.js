/* eslint-disable no-nested-ternary */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Progress, Button } from 'antd'
import { ArrowRightOutlined, UploadOutlined } from '@ant-design/icons'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import styles from './style.module.scss'

class ResultAssessment extends Component {
  constructor(props) {
    super(props)
    const propData = this.props
    this.state = {
      store: propData.store,
      cogAssessResult: {},
    }
  }

  componentDidMount() {
    apolloClient
      .mutate({
        mutation: gql`
          mutation {
            recordCogniableAssessResult(
              input: {
                pk: "Q29nbmlhYmxlQXNzZXNzbWVudFR5cGU6MQ=="
                score: 10
                areas: [
                  { area: "UHJlbGltaW5hcnlBc3Nlc3NBcmVhc1R5cGU6MQ==", response: "delayed" }
                  { area: "UHJlbGltaW5hcnlBc3Nlc3NBcmVhc1R5cGU6Mg==", response: "advanced" }
                  { area: "UHJlbGltaW5hcnlBc3Nlc3NBcmVhc1R5cGU6Mw==", response: "onTrack" }
                ]
              }
            ) {
              details {
                id
                date
                score
                assessmentQuestions {
                  edges {
                    node {
                      id
                      question {
                        id
                        question
                      }
                      answer {
                        id
                        name
                        description
                      }
                    }
                  }
                }
                assessmentAreas {
                  edges {
                    node {
                      id
                      response
                      area {
                        id
                        name
                        description
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .then(qresult => {
        this.setState({
          cogAssessResult: qresult.data.recordCogniableAssessResult.details,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderStatus = () => {
    const stateData = this.state
    if (stateData.cogAssessResult !== undefined) {
      return (
        <div className={styles.resultStatusHeader}>
          <div className={styles.progress}>
            <Progress
              strokeLinecap="square"
              type="dashboard"
              percent={stateData.cogAssessResult.score}
              strokeColor="#0B35B3"
            />
          </div>
          <div className={styles.resAssessmentStatus}>
            <p>Anna is doing great</p>
            <p className={styles.subText}>
              Don&apos;t let what you can&apos;t do stop you from doing what you can do.
            </p>
            <p className={styles.contact}>
              Contact Your Pediatrician <ArrowRightOutlined className={styles.arrow} />
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  renderCosAssCards = () => {
    const stateData = this.state
    const cardsArray = []
    if (stateData.cogAssessResult.assessmentAreas !== undefined) {
      for (let i = 0; i < stateData.cogAssessResult.assessmentAreas.edges.length; i += 1) {
        cardsArray.push(
          <div className={styles.resultAssessmentCardsItem}>
            <div className={styles.cardHeading}>
              <p>{stateData.cogAssessResult.assessmentAreas.edges[i].node.area.name}</p>
            </div>
            <div
              className={
                stateData.cogAssessResult.assessmentAreas.edges[i].node.response.toUpperCase() ===
                'ADVANCED'
                  ? styles.advance
                  : stateData.cogAssessResult.assessmentAreas.edges[
                      i
                    ].node.response.toUpperCase() === 'DELAYED'
                  ? styles.delayed
                  : styles.ontrack
              }
            >
              <p>{stateData.cogAssessResult.assessmentAreas.edges[i].node.response}</p>
            </div>
            <div className={styles.cardDesc}>
              <p>{stateData.cogAssessResult.assessmentAreas.edges[i].node.area.description}</p>
            </div>
            <div className={styles.resultProgress}>
              <Progress percent={40} showInfo={false} strokeColor="orange" strokeWidth={10} />
            </div>
          </div>,
        )
      }
    }
    return cardsArray
  }

  renderLeftCard = () => {
    const cards = []
    for (let i = 0; i < 4; i += 1) {
      cards.push(
        <div className={styles.leftCardItem}>
          <h2 style={{ fontWeight: 'bold', marginTop: '4%', marginLeft: '4%' }}>
            Fine Motor Improved 16%
          </h2>
          <p style={{ color: '#E5E5E5', fontSize: '18px', marginTop: '2%', marginLeft: '4%' }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </p>
        </div>,
      )
    }
    return cards
  }

  render() {
    const stateData = this.state
    console.log(stateData.store)
    return (
      <>
        <div className={styles.upload}>
          <UploadOutlined
            size="large"
            style={{ float: 'right', color: '#0B35B3', marginTop: '-2%', cursor: 'pointer' }}
          />
        </div>
        <div className={styles.resultAssessmentWrapper}>
          <div className={styles.resultRight}>
            {this.renderStatus()}
            <div className={styles.statusAssessmentResDesc}>
              <p>
                &quot;Two hours of parent-guided intervention can Anna&apos;s cognitive
                performance.&quot;
              </p>
            </div>
            <div className={styles.resultAssessmentCards}>{this.renderCosAssCards()}</div>
          </div>
          <div className={styles.resultLeft}>
            <p className={styles.leftHeader}>Compared to last assessment</p>
            <div className={styles.leftShell}>{this.renderLeftCard()}</div>
            <Button
              style={{
                marginTop: '3%',
                backgroundColor: '#0B35B3',
                color: 'white',
                fontSize: '20px',
                borderRadius: '10px',
                marginLeft: '18%',
                width: '60%',
              }}
            >
              See Anna&apos; Program
            </Button>
          </div>
        </div>
      </>
    )
  }
}
const mapStateToProps = state => ({
  store: state,
})

export default connect(mapStateToProps)(ResultAssessment)
