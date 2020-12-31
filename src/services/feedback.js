// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getQuestions(payload) {
    return apolloClient
        .query({
            query: gql`query getAllQuestions (
                $appointmentId: ID!
            ) {
                feedbackQuestions(appointmentId: $appointmentId) {
		            edges {
                        node {
                            id
                            question
                            type
                            group {
                                name
                            }
                            answers {
                                answerText
                                answerRating
                                id
                            }
                        }
                    }
                }
            }`,
            variables: {
                appointmentId: payload.appointmentId
            }
        })
        .then(result => result)
        .catch(error => {
            error.graphQLErrors.map(item => {
                return notification.error({
                    message: 'Somthing went wrong getting feedback questions',
                    description: item.message,
                })
            })
        })
}

export async function feedbackSubmit(payload) {
    return apolloClient.mutate({
        mutation: gql`mutation (
            $id: ID!
            $ans: [AppointmentAnswerInputType]!
        ) {
            CreateAppointmentFeedback(input: {
                appointmentId: $id
                answers: $ans
            })
            {
                message
            }
        }`,
        variables: {
            id: payload.appointmentId,
            ans: payload.ansList
        }
    })
    .then(result => result)
    .catch(error => {
        error.graphQLErrors.map(item => {
            return notification.error({
                message: 'Feedback',
                description: item.message,
            })
        })
    })
}

export async function updateFeedbackSubmit(payload) {
    return apolloClient.mutate({
        mutation: gql`mutation (
            $id: ID!
            $ans: [AppointmentAnswerInputType]!
        ) {
            UpdateAppointmentFeedback(input: {
                appointmentId: $id
                answers: $ans
            })
            {
                message
            }
        }`,
        variables: {
            id: payload.appointmentId,
            ans: payload.ansList
        }
    })
    .then(result => result)
    .catch(error => {
        error.graphQLErrors.map(item => {
            return notification.error({
                message: 'Feedback',
                description: item.message,
            })
        })
    })
}