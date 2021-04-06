/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */

import React from 'react'
import { Row, Col, Card, Button, notification, Typography, Affix, Empty } from 'antd'
import { connect } from 'react-redux'
import { ResponsivePie } from '@nivo/pie'
import groupObj from '@hunters/group-object'
import { gql } from 'apollo-boost'
import moment from 'moment'
import client from '../../apollo/config'

const { Title, Text } = Typography

class PieChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      GraphData: [],
      statusselected: null,
    }
  }

  componentWillMount() {
    let { start_date, end_date, selectedprogram, domainSelected, statusselected } = this.props

    start_date = moment(start_date).format('YYYY-MM-DD')
    end_date = moment(end_date).format('YYYY-MM-DD')
    const studentId = localStorage.getItem('studentId')
    client
      .query({
        query: gql`{
              domainMastered(studentId: ${studentId},
                  dateGte:"${start_date}",
                  dateLte:"${end_date}",
                  programArea:"${selectedprogram}",
                  targetStatus:"${statusselected}"){
                target {
                  id
                  targetId
                   {
                  id
                       domain
                       {
                           id
                           domain
                       }
                   }
                  targetAllcatedDetails
                   {
                  id
                       targetName
                       dateBaseline
                   }
               }
                
              }
            }`,
        fetchPolicy: 'network-only',
      })
      .then(result => {
        let data = []
        const domainData = []
        if (result.data.domainMastered.target) {
          result.data.domainMastered.target.map(item => {
            return domainData.push({
              domain: item.targetId ? item.targetId.domain.domain : 'Others',
              target: item.targetAllcatedDetails.targetName,
            })
          })
          let groupedData = groupObj.group(domainData, 'domain')
          let keys = Object.keys(groupedData)
          if (domainSelected) {
            keys = { domainSelected }
          }
          for (let k = 0; k < keys.length; k++) {
            if (groupedData[keys[k]]?.length > 0) {
              data.push({
                id: keys[k],
                label: keys[k],
                value: groupedData[keys[k]].length,
              })
            }
          }
        }
        this.setState({
          GraphData: data,
        })
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      })
  }

  componentDidUpdate(prevProps) {
    let {
      start_date,
      end_date,
      selectedprogram,
      domainSelected,
      statusselected,
      studentIdSelected,
    } = this.props

    if (
      start_date != prevProps.start_date ||
      end_date != prevProps.end_date ||
      selectedprogram != prevProps.selectedprogram ||
      domainSelected != prevProps.domainSelected ||
      statusselected != prevProps.statusselected ||
      studentIdSelected != prevProps.studentIdSelected
    ) {
      start_date = moment(start_date).format('YYYY-MM-DD')
      end_date = moment(end_date).format('YYYY-MM-DD')
      const studentId = localStorage.getItem('studentId')

      client
        .query({
          query: gql`{
            domainMastered(studentId: ${studentId},
                dateGte:"${start_date}",
                dateLte:"${end_date}",
                programArea:"${selectedprogram}",
                targetStatus:"${statusselected}"){
              target {
                id
                targetId
                 {
                    id
                    domain
                    {
                        id
                        domain
                    }
                 }
                targetAllcatedDetails
                 {
                    id
                    targetName
                    dateBaseline
                 }
             }
            }
          }`,
          fetchPolicy: 'network-only',
        })
        .then(result => {
          let data = []
          const domainData = []
          if (result.data.domainMastered.target) {
            result.data.domainMastered.target.map(item => {
              return domainData.push({
                domain: item.targetId ? item.targetId.domain.domain : 'Others',
                target: item.targetAllcatedDetails.targetName,
              })
            })
            let groupedData = groupObj.group(domainData, 'domain')
            let keys = Object.keys(groupedData)
            if (domainSelected) {
              keys = []
              keys.push(domainSelected)
            }
            for (let k = 0; k < keys.length; k++) {
              if (groupedData[keys[k]]?.length > 0) {
                data.push({
                  id: keys[k],
                  label: keys[k],
                  value: groupedData[keys[k]].length,
                })
              }
            }
          }

          this.setState({
            GraphData: data,
          })
        })
        .catch(error => {
          error.graphQLErrors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        })
    }
  }

  render() {
    const { GraphData } = this.state
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {GraphData && GraphData.length === 0 ? (
          <Empty style={{ marginTop: '100px' }} />
        ) : (
          <ResponsivePie
            data={GraphData}
            margin={{ top: 20, right: 100, bottom: 20, left: 80 }}
            innerRadius={0.5}
            padAngle={2}
            cornerRadius={3}
            colors={{ scheme: 'paired' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabel={function(e) {
              return e.label + ' (' + e.value + ')'
            }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: 'color' }}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
          />
        )}
      </div>
    )
  }
}

export default PieChart
