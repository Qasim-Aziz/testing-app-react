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
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */

import { Card, notification, Row, Typography, Icon, Tooltip } from 'antd'
import React from 'react'
import { connect } from 'react-redux'

import TrialsList from '../../components/sessionRecording/trialsList'
import LoadingComponent from '../staffProfile/LoadingComponent'

const peakId = 'VGFyZ2V0RGV0YWlsVHlwZTo4'
const equivalence = 'EQUIVALENCE'

@connect(({ sessionrecording, user }) => ({ sessionrecording, user }))
class NormalTargetScoreBoard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const {
            sessionrecording: {
                loading,
                Disabled,
                MasterSession,
                TargetActiveIndex,
                ChildSession,
                VideoAvailable,
                VideoLoading,
                VideoUrl,
                TargetActiveId,
                StimulusActiveIndex,
                StepActiveIndex,
            },
        } = this.props






        if (loading) {
            return <LoadingComponent />
        }


        return (
            <>

                {MasterSession?.targets.edges[TargetActiveIndex].node.sd.edges.length > 0 ? (
                    <TrialsList
                        key={MasterSession.targets.edges[TargetActiveIndex].node.id}
                        id={MasterSession.targets.edges[TargetActiveIndex].node.id}
                        sdKey={MasterSession?.targets.edges[TargetActiveIndex].node.sd.edges[StimulusActiveIndex]?.node.id}
                        stepKey=""
                        dailyTrails={
                            MasterSession.targets.edges[TargetActiveIndex].node
                                .targetAllcatedDetails.DailyTrials
                        }
                        boxWidth="35px"
                    />

                ) : MasterSession?.targets.edges[TargetActiveIndex].node.steps.edges.length >
                    0 ? (
                            <TrialsList
                                key={MasterSession.targets.edges[TargetActiveIndex].node.id}
                                id={MasterSession.targets.edges[TargetActiveIndex].node.id}
                                sdKey=""
                                stepKey={MasterSession.targets.edges[TargetActiveIndex].node.steps.edges[StepActiveIndex]?.node.id}
                                dailyTrails={
                                    MasterSession.targets.edges[TargetActiveIndex].node
                                        .targetAllcatedDetails.DailyTrials
                                }
                                boxWidth="35px"
                            />
                        ) : (
                            <TrialsList
                                key={MasterSession?.targets.edges[TargetActiveIndex].node.id}
                                id={MasterSession?.targets.edges[TargetActiveIndex].node.id}
                                sdKey=""
                                stepKey=""
                                dailyTrails={
                                    MasterSession?.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                                        .DailyTrials
                                }
                                boxWidth="35px"
                            />
                        )}
            </>
        )
    }
}

export default NormalTargetScoreBoard
