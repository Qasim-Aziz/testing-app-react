/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-boolean-value */
import React from 'react'
import gql from 'graphql-tag'
import { ResponsiveLine } from '@nivo/line'
import Moment from 'moment'
import client from '../../../../apollo/config'

import './PerformenceGraph.scss'

class PerformenceGraph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mastertarget: [],
      loading: true,
      data: [],
    }
    this.MasterGraph = this.MasterGraph.bind(this)
  }

  MasterGraph(dateGte) {
    var gtedate = Moment(Date.now())
      .subtract(dateGte, 'days')
      .format('YYYY-MM-DD')
      .toString()
    const studentId = localStorage.getItem('studentId')

    client
      .query({
        query: gql`query {
          masterTargetGraph(studentId:${studentId}, targetStatus:"U3RhdHVzVHlwZTo0", dateGte:"${gtedate}") {
              date
              tarCount
          },
          
      }`,
      })
      .then(result => {
        let res_list = []

        let tar_count = 0

        for (let i in result.data.masterTargetGraph) {
          tar_count += result.data.masterTargetGraph[i].tarCount
          res_list.push({
            x: Moment(result.data.masterTargetGraph[i].date).format('DD`MMM'),
            y: tar_count,
          })
        }
        this.setState({
          mastertarget: res_list,
          loading: false,
          data:
            res_list.length > 0
              ? [
                  {
                    id: 'Master Traget',
                    color: 'hsl(49, 70%, 50%)',
                    data: res_list,
                  },
                ]
              : [],
        })
      })
  }

  componentDidMount() {
    this.MasterGraph('365')
  }

  render() {
    const { mastertarget, data } = this.state
    console.log(mastertarget)
    return (
      <div className="root">
        <div style={{ height: 160 }}>
          <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 60, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Date',
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'count',
              legendOffset: -40,
              legendPosition: 'middle',
            }}
            colors={{ scheme: 'nivo' }}
            lineWidth={2}
            enablePoints={true}
            pointSize={6}
            pointColor="black"
            pointBorderWidth={2}
            pointBorderColor={{ theme: 'background' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.1}
            useMesh={true}
          />
        </div>
      </div>
    )
  }
}

export default PerformenceGraph
