/* eslint-disable react/jsx-indent */
import React from 'react'
import { connect } from 'react-redux'
import Index from './index'

@connect(({ user, student, learnersprogram }) => ({ user, student, learnersprogram }))
class Assessments extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'learnersprogram/SET_STATE',
            payload: {
                TabCheck: "Sessions"
            }
        })
    }

    render() {
        return (
            <>
                <Index />
            </>
        )
    }
}

export default Assessments
