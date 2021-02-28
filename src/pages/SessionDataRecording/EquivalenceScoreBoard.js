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
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-useless-concat */
/* eslint-disable prefer-template */
/* eslint-disable prefer-template */
/* eslint-disable prefer-template */
/* eslint-disable prefer-template */
/* eslint-disable prefer-template */

import React, { Component } from 'react'
import { Card, Progress, Typography, Button } from 'antd'
import { connect } from 'react-redux'

@connect(({ sessionrecording }) => ({ sessionrecording }))
class TrialsList extends Component {

    getTrials = (combId, classId, operation) => {
        const {
            sessionrecording: {
                ActiveCombination, SdCombinations, TargetActiveId, TargetResponse, EquiTrialCount, SelectedClassId, SelectedOperation, MasterSession, TargetActiveIndex
            },
        } = this.props

        // console.log(combId, classId, operation)
        const recordings = TargetResponse[TargetActiveId].equivalence[operation][combId]?.[classId]
        // const recordings = []
        const colorList = []

        if (recordings) {
            for (let k = 0; k < 10; k++) {
                if (recordings[k]?.score === 0) {
                    colorList.push('#FF8080')
                } else if (
                    recordings[k]?.score === 2 ||
                    recordings[k]?.score === 4 ||
                    recordings[k]?.score === 8
                ) {
                    colorList.push('#FF9C52')
                } else if (recordings[k]?.score === 10) {
                    colorList.push('#4BAEA0')
                } else {
                    colorList.push('')
                }
            }
        }

        const Trials = []
        for (let i = 0; i < 10; i++) {
            Trials.push(

                <div
                    style={{
                        display: 'inline-block',
                        marginRight: '8px',
                        marginLeft: '8px',
                        textAlign: 'center',
                    }}
                >
                    <span
                        style={{
                            height: 20,
                            display: 'inline-block',
                            lineHeight: '12px',
                            width: 25,
                            border: '1px solid black',
                            backgroundColor: colorList[i] ? colorList[i] : '',
                            paddingLeft: '20px',
                            borderRadius: '2px',
                            marginRight: '2px',
                        }}
                    >
                        &nbsp;
                    </span>
                </div>

            )
        }

        return Trials

    }

    getClass = (index, trialsList) => {
        const {
            sessionrecording: {
                ActiveCombination, SdCombinations, TargetActiveId, TargetResponse, EquiTrialCount, SelectedClassId, SelectedOperation, MasterSession, TargetActiveIndex
            },
        } = this.props


        const combinations = []

        if (SelectedOperation === 'Train') {
            for (let i = 0; i < SdCombinations?.train.edges.length; i++) {
                const combinationNode = SdCombinations?.train.edges[i]
                const comb = `${combinationNode.node.stimulus1} ` + `${combinationNode.node.sign12} ` + `${combinationNode.node.stimulus2} ` + `${combinationNode.node.sign23 ? combinationNode.node.sign23 : ''} ` + `${combinationNode.node.stimulus3 ? combinationNode.node.stimulus3 : ''} `
                combinations.push(
                    <p>Class {index + 1} - {comb} - {this.getTrials(combinationNode.node.id, MasterSession.targets.edges[TargetActiveIndex].node.classes.edges[index]?.node.id, 'train')} </p>
                )
            }
        }
        if (SelectedOperation === 'Test') {
            for (let i = 0; i < SdCombinations?.test.edges.length; i++) {
                const combinationNode = SdCombinations?.test.edges[i]
                const comb = `${combinationNode.node.stimulus1} ` + `${combinationNode.node.sign12} ` + `${combinationNode.node.stimulus2} ` + `${combinationNode.node.sign23 ? combinationNode.node.sign23 : ''} ` + `${combinationNode.node.stimulus3 ? combinationNode.node.stimulus3 : ''} `
                combinations.push(
                    <p>Class {index + 1} - {comb} - {this.getTrials(combinationNode.node.id, MasterSession.targets.edges[TargetActiveIndex].node.classes.edges[index]?.node.id, 'test')} </p>
                )
            }
        }



        return (
            <div style={{ padding: '2px' }}>
                {combinations}
            </div>
        )
    }

    render() {
        const {
            sessionrecording: {
                ActiveCombination, TargetActiveId, TargetResponse, EquiTrialCount, SelectedClassId, SelectedOperation, MasterSession, TargetActiveIndex
            },
        } = this.props

        const classesCount = MasterSession.targets.edges[TargetActiveIndex].node.classes.edges.length
        const Classes = []

        for (let j = 0; j < classesCount; j++) {
            Classes.push(this.getClass(j))
        }

        return (
            <>
                <p>Operation: {SelectedOperation}</p>
                {Classes}
            </>
        )
    }
}
export default TrialsList
