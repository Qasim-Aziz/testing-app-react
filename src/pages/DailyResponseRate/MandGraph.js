/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react'
import { DatePicker, Table, notification, Button } from 'antd'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import { ResponsiveLine } from '@nivo/line'
import { LineChartOutlined } from '@ant-design/icons'
import { MAND_DATA } from './query'

const { RangePicker } = DatePicker

const workDateFormate = 'YYYY-MM-DD'

export default () => {
  const [selectMand, setSelectMand] = useState()
  const [graphData, setGraphData] = useState([
    {
      color: 'hsl(335, 70%, 50%)',
      data: [],
    },
  ])
  const [dateRange, setDateRange] = useState([moment().startOf('week'), moment().endOf('week')])
  const [columns, setColumns] = useState()

  const { data, error, loading } = useQuery(MAND_DATA, {
    variables: {
      studentId: localStorage.getItem('studentId'),
      startDate: moment(dateRange[0]).format(workDateFormate),
      endDate: moment(dateRange[1]).format(workDateFormate),
    },
  })

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Failed to load student mand info',
      })
    }
  }, [error])

  useEffect(() => {
    if (dateRange && data) {
      const myColumns = [
        {
          key: 'measurments',
          title: 'Measurments',
          fixed: 'left',
          width: '250px',
          render(obj) {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {obj.measurments}
                <Button type="link" onClick={() => setSelectMand(obj.id)}>
                  <LineChartOutlined style={{ fontSize: 30, color: 'rgb(229, 132, 37)' }} />
                </Button>
              </div>
            )
          },
        },
      ]
      // eslint-disable-next-line array-callback-return
      data.mandReport[0]?.data.map(mandData => {
        myColumns.push({
          key: 'id',
          title: mandData.date,
          width: '100px',
          render(obj) {
            const viewData = obj.data.find(data => data.date === mandData.date)
            return <div>{viewData?.count}</div>
          },
        })
      })
      setColumns(myColumns)
    }
  }, [dateRange, data])

  useEffect(() => {
    if (selectMand) {
      const findMand = data.mandReport.find(data => data.id === selectMand)
      findMand.data.map(data => {
        setGraphData(state => {
          state[0].data.push({
            x: data.date,
            y: data.count,
          })
          return state
        })
      })
    }
  }, [selectMand, data])

  return (
    <div style={{ height: 350 }}>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {selectMand && (
        <ResponsiveLine
          data={graphData}
          itemWidth={80}
          itemHeight={20}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: `Graph For mand: ${
              data.mandReport.find(data => data.id === selectMand).measurments
            }`,
            legendOffset: 36,
            legendPosition: 'left',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Count',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          colors={{ scheme: 'nivo' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '20px 0',
        }}
      >
        <RangePicker size="large" value={dateRange} onChange={v => setDateRange(v)} />
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Table
          columns={columns}
          dataSource={data?.mandReport}
          bordered
          loading={loading}
          scroll={{
            x: 'max-content',
          }}
        />
      </div>
    </div>
  )
}
