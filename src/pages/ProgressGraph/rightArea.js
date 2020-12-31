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

import React from 'react'
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    Collapse
} from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

const { Title, Text } = Typography


class RightArea extends React.Component {

  state = {
    isloading : false,
    selectedsatatus:null,
    targetStatus: []
  }

    componentDidMount() {
      client
        .query({
          query: gql`{
                  targetStatus(first:4) {
                      id
                      statusName
                      }
                  }
              `,
        })
        .then(result => {
          this.props.StatusCallback(result.data.targetStatus[0].id);

          this.setState({
            targetStatus:result.data.targetStatus,
            selectedsatatus:result.data.targetStatus[0].id
          })
        })
      }

      changeStatus = (statusId) => {
        this.props.StatusCallback(statusId);
          this.setState({
              selectedsatatus: statusId,
          });
      };

render() {

  const { targetStatus, selectedsatatus } = this.state;
  const {studentName } = this.props
    const cardStyle = {
        background: '#f9f9f9',
        // border: '1px solid #E4E9F0',
        // boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '10px 10px',
        alignItems: 'center',
        display: 'block',
        width: '100%',
        marginBottom: '20px',
        lineHeight: '27px',
        curser: 'pointer',
    }

    const selectedCardStyle = {
        background: '#E58425',
        // border: '1px solid #E4E9F0',
        color: '#E58425',
        // boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '10px 10px',
        alignItems: 'center',
        display: 'block',
        width: '100%',
        marginBottom: '20px',
        lineHeight: '27px'
    }

    const textStyle = {
        fontSize: '16px',
        lineHeight: '19px',
        fontWeight: 600,

    }

    const titleStyle = {
        fontSize: '20px',
        lineHeight: '27px',
        marginTop: '5px',
    }

    const selectedTextStyle = {
        fontSize: '16px',
        lineHeight: '19px',
        fontWeight: 600,
        color: '#fff'
    }

    const selectedTitleStyle = {
        fontSize: '20px',
        lineHeight: '27px',
        marginTop: '5px',
        color: '#fff'
    }

    return (
        <>
            <div
                style={{
                    background: '#F9F9F9',
                    borderRadius: 10,
                    padding: '28px 27px 20px',
                    display: 'block',
                    width: '100%',
                    minHeight: '650px',
                }}
            >
            {/* <Title style={{fontSize: '16px', lineHeight: '20px'}}>{studentName}&apos;s Progress Overview</Title> */}
            {targetStatus && targetStatus.map((status) =>
              <div style={selectedsatatus === status.id ? selectedCardStyle : cardStyle} onClick={e => this.changeStatus(status.id)}>
                <Button type="link"><Text style={selectedsatatus === status.id ? selectedTextStyle : textStyle}>{status.statusName}</Text></Button>
              </div>
            )}
            </div>
        </>
    )
}
}

export default RightArea
