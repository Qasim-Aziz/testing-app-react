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
/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable radix */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable vars-on-top */
/* eslint-disable block-scoped-var */
/* eslint-disable no-empty */
/* eslint-disable no-redeclare */
/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */


import React from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Affix,
} from 'antd'
import { connect } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import { gql } from 'apollo-boost'
import groupObj from '@hunters/group-object'
import client from '../../apollo/config'

// var groupObj = require('@hunters/group-object')
var moment = require('moment');
const { Title, Text } = Typography

class BarChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      GraphData: []
    }
  }

  componentDidMount() {

    let { start_date, end_date, selectedprogram, domainSelected, statusselected } = this.props;

    start_date = moment(start_date).format('YYYY-MM-DD');
    end_date = moment(end_date).format('YYYY-MM-DD');
    const studentId = localStorage.getItem('studentId')

    client
      .query({
        query: gql`{
          domainMastered(studentId: ${studentId}, dateGte:"${start_date}", dateLte:"${end_date}", programArea:"${selectedprogram}", targetStatus:"${statusselected}"){
            totalCount
            target {
              id
              domainName
              targetId {
                domain {
                  id
                  domain
                }
              }
              targetAllcatedDetails {
                targetName
                dateBaseline
              }
              intherapyDate
              masterDate
              inmaintainenceDate
            }
          }
        }`,
        fetchPolicy:'no-cache'
      })
      .then(result => {
        var data = []
        var graphData = {}

        let targets = result.data.domainMastered.target

        console.log('Normal data ===>', result.data)
        const baseline = 'U3RhdHVzVHlwZTox'
        const intherapy = 'U3RhdHVzVHlwZToz'
        const mastered = 'U3RhdHVzVHlwZTo0'
        const inmaintainence = 'U3RhdHVzVHlwZTo1'
        const onhold = 'U3RhdHVzVHlwZTo2'
        const deleted = 'U3RhdHVzVHlwZTo3'

        let domains = []
        if (targets.length > 0){
          for (let i=0;i<targets.length; i++){
            if (targets[i].domainName){
              if (!domains.includes(targets[i].domainName)){
                domains.push(targets[i].domainName)
              }
            }
          }
        }

        let groupedData = groupObj.group(result.data.domainMastered.target, 'domainName')
        console.log('Grouped data1 ===>', groupedData)
        let gData = []

        // Graph for Baseline targets
        if (statusselected === baseline){
          for (let i=0; i< domains.length; i++ ){
            let domain = domains[i]
            let count = 0
            let length = 0
            for (let j=0; j<groupedData[domains[i]].length; j++){
              let dateBaseline = moment(groupedData[domains[i]][j].targetAllcatedDetails.dateBaseline)
              let currentDate = moment()
              let diff = parseInt((currentDate - dateBaseline) / (1000 * 3600 * 24))
              count+= diff
              length += 1                          
            }
            gData.push({'domain': domain, 'Master Time': parseInt((count/length).toFixed())})          
          }
          this.setState({
            GraphData: gData
          })
          
        }
        // Graph for Intherapy Targets
        if (statusselected === intherapy){
          console.log('Intherapy====>')
          for (let i=0; i< domains.length; i++ ){
            let domain = domains[i]
            let count = 0
            let length = 0
            for (let j=0; j<groupedData[domains[i]].length; j++){
              let desiredDate = groupedData[domains[i]][j].intherapyDate
              if (desiredDate){
                desiredDate = moment(desiredDate)
              }
              else{
                desiredDate = moment(groupedData[domains[i]][j].targetAllcatedDetails.dateBaseline)
              }
              let currentDate = moment()
              let diff = parseInt((currentDate - desiredDate) / (1000 * 3600 * 24))
              count+= diff
              length += 1                          
            }
            gData.push({'domain': domain, 'Master Time': parseInt((count/length).toFixed())})          
          }
          this.setState({
            GraphData: gData
          })
        }
        // Graph for inmaintainence Targets
        if (statusselected === inmaintainence){
          console.log('Inmaintainence====>')
          for (let i=0; i< domains.length; i++ ){
            let domain = domains[i]
            let count = 0
            let length = 0
            for (let j=0; j<groupedData[domains[i]].length; j++){
              let desiredDate = groupedData[domains[i]][j].inmaintainence
              if (desiredDate){
                desiredDate = moment(desiredDate)
              }
              else{
                desiredDate = moment(groupedData[domains[i]][j].targetAllcatedDetails.dateBaseline)
              }
              let currentDate = moment()
              let diff = parseInt((currentDate - desiredDate) / (1000 * 3600 * 24))
              count+= diff
              length += 1                          
            }
            gData.push({'domain': domain, 'Master Time': parseInt((count/length).toFixed())})          
          }
          this.setState({
            GraphData: gData
          })
        }
        // Graph for Mastered Targets
        if (statusselected === mastered){
          console.log('Mastered====>')
          for (let i=0; i< domains.length; i++ ){
            let domain = domains[i]
            let count = 0
            let length = 0
            for (let j=0; j<groupedData[domains[i]].length; j++){
              let desiredDate = groupedData[domains[i]][j].intherapyDate
              if (desiredDate){
                desiredDate = moment(desiredDate)
              }
              else{
                desiredDate = moment(groupedData[domains[i]][j].targetAllcatedDetails.dateBaseline)
              }
              let masteredDate = moment(groupedData[domains[i]][j].masterDate)
              let diff = parseInt((masteredDate - desiredDate) / (1000 * 3600 * 24))
              count+= diff
              length += 1                          
            }
            gData.push({'domain': domain, 'Master Time': parseInt((count/length).toFixed())})          
          }
          this.setState({
            GraphData: gData
          })

        }
        


        // console.log(gData)

        // console.log('Grouped data2 ===>', groupedData['[object Object]'])
        // console.log('Grouped data3 ===>', groupObj.group(groupedData['[object Object]'], {'targetId': {'domain': {'domain': 'Mand'}}}))

        // for (var i in result.data.domainMastered.target) {
        //   try {
        //     var dateBaseline = Date.parse(result.data.domainMastered.target[i].targetAllcatedDetails.dateBaseline);
        //     var masterDate = Date.parse(result.data.domainMastered.target[i].masterDate);

        //     if (!(result.data.domainMastered.target[i].targetId.domain.domain in graphData)) {
        //       graphData[result.data.domainMastered.target[i].targetId.domain.domain] = { 'timeMaster': 0, 'tarCount': 0 }
        //     }

        //     // data.push({
        //     //   "id": result.data.domainMastered.target[i].id,
        //     //   "domain": result.data.domainMastered.target[i].targetId.domain.domain,
        //     //   "targetName": result.data.domainMastered.target[i].targetAllcatedDetails.targetName,
        //     //   "dateBaseline": result.data.domainMastered.target[i].targetAllcatedDetails.dateBaseline,
        //     //   "intherapyDate": result.data.domainMastered.target[i].intherapyDate,
        //     //   "masterDate": result.data.domainMastered.target[i].masterDate,
        //     //   "timeMaster": parseInt((masterDate - dateBaseline) / (1000 * 3600 * 24))
        //     // })
        //   }
        //   catch (err) {
        //   }
        // }

        // for (var i in data) {
        //   graphData[data[i].domain]['timeMaster'] += data[i]['timeMaster']
        //   graphData[data[i].domain]['tarCount'] += 1
        // }

        // var finalGraphData = [];

        // for (var key in graphData) {
        //   finalGraphData.push({
        //     'domain': key,
        //     "Master Time": graphData[key]['timeMaster'] / graphData[key]['tarCount']
        //   })
        // }

        // this.setState({
        //   GraphData: finalGraphData
        // })

      })
  }



  render() {
    const textStyle = {
      fontSize: '16px',
      lineHeight: '19px',
    }



    const { GraphData } = this.state;
    
    return (
      <>
        <div
          role="presentation"
          style={{
            borderRadius: 10,
            border: '2px solid #F9F9F9',
            display: 'block',
            width: '100%',
            height: '450px',
          }}
        >
          {GraphData &&
            <ResponsiveBar
              data={GraphData}
              keys={['Master Time']}
              indexBy="domain"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              defs={[
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: '#eed312',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
                }
              ]}
              fill={[
                {
                  match: {
                    id: 'Master Time'
                  },
                  id: 'lines'
                }
              ]}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Domain',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'master Time',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              // legends={[
              //   {
              //     dataFrom: 'keys',
              //     anchor: 'bottom-right',
              //     direction: 'column',
              //     justify: false,
              //     translateX: 120,
              //     translateY: 0,
              //     itemsSpacing: 2,
              //     itemWidth: 100,
              //     itemHeight: 20,
              //     itemDirection: 'left-to-right',
              //     itemOpacity: 0.85,
              //     symbolSize: 20,
              //     effects: [
              //       {
              //         on: 'hover',
              //         style: {
              //           itemOpacity: 1
              //         }
              //       }
              //     ]
              //   }
              // ]}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
            />
          }
        </div>
      </>
    )
  }
}

export default BarChart
