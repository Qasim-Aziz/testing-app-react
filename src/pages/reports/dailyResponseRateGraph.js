/* eslint-disable react/jsx-boolean-value */

import React from 'react'
import { ResponsiveLine } from '@nivo/line'

function ResponseRateGraph({ graphData }) {
  return (
    <div>
      {graphData &&
        graphData.map(item => {
          return (
            <div key={item[0].key} style={{ height: 300, marginBottom: 30 }}>
              <ResponsiveLine
                key={Math.random()}
                data={item}
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: true,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                animate={true}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  orient: 'bottom',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: `Date (${item[0].month} ${item[0].year})`,
                  legendOffset: 36,
                  legendPosition: 'middle',
                }}
                axisLeft={{
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Percentage (%)',
                  legendOffset: -40,
                  legendPosition: 'middle',
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
              />
            </div>
          )
        })}
    </div>
  )
}

export default ResponseRateGraph
