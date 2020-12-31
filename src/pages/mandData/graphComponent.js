/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable eqeqeq */
/* eslint-disable eqeqeq */
import React, { Component, useEffect, useState } from 'react'
import './index.scss'
import { ResponsiveLine, ResponsiveBar } from '@nivo/line'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const MAND_INFO = gql`query mandReport($studentId: ID!, $mandId: ID!, $sdate: Date!, $edate: Date!){
    mandReport(studentId:$studentId, id: $mandId, startDate:$sdate, endDate:$edate)
    {
        measurments 
        data {            
            x
            y
        }
    }        
}
`

const GraphComponent = ({ mandId, studentId, date }) => {
    const [sdate, setSdate] = useState(moment(date).subtract(7, 'd').format('YYYY-MM-DD'))
    const [edate, setEdate] = useState(moment(date).format('YYYY-MM-DD'))

    const { data, refetch } = useQuery(MAND_INFO, {
        variables: {
            studentId,
            mandId,
            sdate,
            edate
        },
    })

    const gdata2 = [{ "id": data ? data.mandReport[0]?.measurments : "", data: data ? data.mandReport[0]?.data : [] }]


    const changeDatesData = value => {
        if (value[0] && value[1]) {
            const start = moment(value[0]).format('YYYY-MM-DD')
            const end = moment(value[1]).format('YYYY-MM-DD')
            setSdate(start)
            setEdate(end)
            refetch()
        }
    }


    return (
        <div className="widget" style={{ minHeight: 500, height: 500 }}>
            Filter by date: <RangePicker defaultValue={[moment(sdate, 'YYYY-MM-DD'), moment(edate, 'YYYY-MM-DD')]} onCalendarChange={value => { changeDatesData(value) }} style={{ paddingLeft: 40 }} />

            {gdata2[0].data.length > 0 && (
                <ResponsiveLine
                    key={gdata2[0].data.length}
                    data={gdata2}
                    margin={{ top: 50, right: 80, bottom: 50, left: 50 }}
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
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Count',
                        legendOffset: -40,
                        legendPosition: 'middle'
                    }}
                    colors={{ scheme: 'nivo' }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            )}


        </div>
    )
}


export default GraphComponent;