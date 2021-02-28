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

import React from 'react'
import { Helmet } from 'react-helmet'
import ReactPlayer from 'react-player'
import {
  Row,
  Col,
  Card,
  Drawer,
  Select,
  Form,
  Collapse,
  Tree,
  Icon,
  DatePicker,
  notification,
  Empty,
  Button,
  Typography,
} from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import EditTargetAllocationNewDrawer from '../../components/TargetAllocation/EditTargetAllocation'


const { Title, Text } = Typography

@connect(({ user, feedback }) => ({ user, feedback }))
class EditTarget extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    const {selectedTarget} = this.props
    if (selectedTarget !== ''){
        apolloClient.query({
            query: gql`query ($TargetId: ID!) {targetAllocate(id: $TargetId) {
                id
                            time
                            targetInstr
                            peakBlocks
                            peakType

                            date
                            objective
                            targetStatus {
                              id
                              statusName
                            }
                            masteryCriteria {
                              id
                              name
                            }
                            
                            targetId {
                              id
                              maxSd
                              domain {
                                id
                                domain
                              }
                            }
                            targetAllcatedDetails {
                              id
                              targetName
                              dateBaseline
                              DailyTrials
                              consecutiveDays
                              targetType {
                                id
                                typeTar
                              }
                            }
                            videos {
                              edges {
                                node {
                                  id
                                  url
                                }
                              }
                            }
                            mastery {
                              edges {
                                node {
                                  id
                                  sd {
                                    id
                                    sd
                                  }
                                  step {
                                    id
                                    step
                                  }
                                  mastery {
                                    id
                                    name
                                  }
                                  status {
                                    id
                                    statusName
                                  }
                                }
                              }
                            }
                            sd {
                              edges {
                                node {
                                  id
                                  sd
                                }
                              }
                            }
                            steps {
                              edges {
                                node {
                                  id
                                  step
                                }
                              }
                            }
                            classes {
                              edges {
                                node {
                                  id
                                  name
                                  stimuluses {
                                    edges {
                                      node {
                                        id
                                        option
                                        stimulusName
                                      }
                                    }
                                  }
                                }
                              }
                            }
    
            }
        }`,
        variables : {
            TargetId: selectedTarget.id
        },
        fetchPolicy: 'network-only',
        })
        .then(result => {
            console.log(result)
            this.setState({
                activeAllocatedTarget: result.data.targetAllocate,
                loading: false
            })
        })
        .catch(error => error)
    }

  }

  onSuccessTargetAllocation = data => {
      console.log(data)
      const {onSuccessEditTarget} = this.props
      onSuccessEditTarget()
  }

  render() {
    const { loading, activeAllocatedTarget } = this.state
    const selectedStudent = localStorage.getItem('studentId')
    if (loading) {
      return 'Loading data...'
    }

    return (
      <>
        {!loading && (
            <EditTargetAllocationNewDrawer
            key={Math.random()}
            studentId={selectedStudent}
            activeAllocatedTarget={activeAllocatedTarget}
            onSuccessTargetAllocation={this.onSuccessTargetAllocation}
            editAble={true}
            />
        )}
      </>
    )
  }
}

export default EditTarget
