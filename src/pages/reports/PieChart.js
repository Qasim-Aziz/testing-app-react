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
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */

import React from 'react'
import { Row, Col, Card, Button, Typography, Affix, Empty } from 'antd'
import { connect } from 'react-redux'
import { ResponsivePie } from '@nivo/pie'
import groupObj from '@hunters/group-object'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

var moment = require('moment')

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
    console.log('studentId', studentId)
    console.log('start_date', start_date)
    console.log('end_date', end_date)
    console.log('selectedprogram', selectedprogram)
    console.log('domainSelected', domainSelected)

    console.log('domainSelected ==if', domainSelected)
    client
      .query({
        query: gql`{
              domainMastered(studentId: ${studentId}, dateGte:"${start_date}", dateLte:"${end_date}", programArea:"${selectedprogram}", targetStatus:"${statusselected}"){
                target {
                  id
                  targetId
                   {
                       domain
                       {
                           id
                           domain
                       }
                   }
                  targetAllcatedDetails
                   {
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
        console.log('group pie ===> ', result.data)
        const domainData = []
        if (result.data.domainMastered.target) {
          result.data.domainMastered.target.map(item => {
            return domainData.push({
              domain: item.targetId ? item.targetId.domain.domain : 'Others',
              target: item.targetAllcatedDetails.targetName,
            })
          })
          console.log('domainData', domainData)
          let groupedData = groupObj.group(domainData, 'domain')
          let keys = Object.keys(groupedData)
          if (domainSelected) {
            keys = { domainSelected }
          }
          for (let k = 0; k < keys.length; k++) {
            // console.log(k)
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
    console.log(
      start_date,
      end_date,
      selectedprogram,
      domainSelected,
      statusselected,
      studentIdSelected,
    )

    console.log(
      prevProps.start_date,
      prevProps.end_date,
      prevProps.selectedprogram,
      prevProps.domainSelected,
      prevProps.statusselected,
      prevProps.studentIdSelected,
    )

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
      console.log('studentId', studentId)
      console.log('start_date', start_date)
      console.log('end_date', end_date)
      console.log('selectedprogram', selectedprogram)
      console.log('statusselected', statusselected)
      console.log('domainSelected', domainSelected)
      client
        .query({
          query: gql`{
            domainMastered(studentId: ${studentId}, dateGte:"${start_date}", dateLte:"${end_date}", programArea:"${selectedprogram}", targetStatus:"${statusselected}"){
              target {
                id
                targetId
                 {
                     domain
                     {
                         id
                         domain
                     }
                 }
                targetAllcatedDetails
                 {
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
          console.log('group pie ===> ', result.data)
          const domainData = []
          if (result.data.domainMastered.target) {
            result.data.domainMastered.target.map(item => {
              return domainData.push({
                domain: item.targetId ? item.targetId.domain.domain : 'Others',
                target: item.targetAllcatedDetails.targetName,
              })
            })
            console.log('domainData', domainData)
            let groupedData = groupObj.group(domainData, 'domain')
            let keys = Object.keys(groupedData)
            console.log('keys ==', keys)
            console.log('domainSelected ==', domainSelected)
            if (domainSelected) {
              keys = []
              keys.push(domainSelected)
            }
            console.log('keys 2 ==', keys)
            for (let k = 0; k < keys.length; k++) {
              // console.log(k)
              if (groupedData[keys[k]]?.length > 0) {
                data.push({
                  id: keys[k],
                  label: keys[k],
                  value: groupedData[keys[k]].length,
                })
              }
            }
          }

          // for (let i in result.data.domainPercentage) {
          //     if (result.data.domainPercentage[i].tarCount > 0){
          //         data.push({
          //             "id": result.data.domainPercentage[i].id,
          //             "label": result.data.domainPercentage[i].domain,
          //             "value": result.data.domainPercentage[i].tarCount
          //         })
          //     }
          // }
          // console.log(result)
          this.setState({
            GraphData: data,
          })
        })
    }
  }

  render() {
    const textStyle = {
      fontSize: '16px',
      lineHeight: '19px',
    }

    const { GraphData } = this.state
    console.log('GraphData', GraphData)
    return (
      <>
        <div
          role="presentation"
          style={{
            borderRadius: 10,
            border: '2px solid #F9F9F9',
            // padding: '28px 27px 20px',
            display: 'block',
            // marginLeft: '10px',
            width: '100%',
            height: '250px',
            overflowY: 'hidden',
          }}
        >
          {GraphData.length === 0 ? (
            <>
              <Empty style={{ marginTop: '100px' }} />
            </>
          ) : (
            ''
          )}
          {GraphData && (
            <ResponsivePie
              data={GraphData}
              // sliceLabel="value2"
              margin={{ top: 30, right: 0, bottom: 0, left: 0 }}
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
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  translateY: 10,
                  translateX: -1,
                  itemWidth: 100,
                  itemHeight: 25,
                  itemTextColor: '#999',
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]}
            />
          )}
        </div>
      </>
    )
  }
}

export default PieChart
