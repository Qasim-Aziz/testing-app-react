/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect } from 'react'
import { Table, Button, Drawer, Form, Select, DatePicker, notification } from 'antd'
import { useQuery } from 'react-apollo'
import filterIcon from 'icons/filter.png'
import { ResponsiveLine } from '@nivo/line'
import groupObj from '@hunters/group-object'
import { LineChartOutlined } from '@ant-design/icons'
import moment from 'moment'
import { RESPONSE_RATE, RESPONSE_RATE_FILTER_OPT } from './query'
import './form.scss'

const { Option } = Select
const { RangePicker } = DatePicker

export default Form.create()(() => {
  const [selectTarget, setSelectTarget] = useState()
  const studentId = localStorage.getItem('studentId')
  const [mydata, setMydata] = useState()
  const [dateRange, setDateRange] = useState([moment().startOf('week'), moment().endOf('week')])
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [columns, setColumns] = useState([])
  const [status, setStatus] = useState()
  const [type, setType] = useState('VGFyZ2V0RGV0YWlsVHlwZTox')
  const [graphData, setGraphData] = useState([
    {
      color: 'hsl(335, 70%, 50%)',
      data: [],
    },
  ])

  const { data, error, loading } = useQuery(RESPONSE_RATE, {
    variables: {
      studentId,
      startDate: moment(dateRange[0]).format('YYYY-MM-DD'),
      endDate: moment(dateRange[1]).format('YYYY-MM-DD'),
      status,
      type,
    },
  })

  const start = dateRange[0]
  const end = dateRange[1]

  const days = []
  const [keyObjects, setKeyObjects] = useState([])
  let day = start

  while (day <= end) {
    days.push(day.toDate())
    day = day.clone().add(1, 'd')
  }

  useEffect(() => {
    if (data) {
      console.log('original data ==> ', data)
      if (data.responseRate.length > 0) {
        const groupedData = groupObj.group(data.responseRate, 'targetName')
        console.log('grouped data ==> ', groupedData)

        let keys = []
        keys = Object.keys(groupedData)
        console.log('grouped data keys ==> ', keys)

        const objects = []
        keys.map((target, index) => {
          const item = { key: index, targetName: target }

          days.map(dateStr => {
            let targetPer = 0
            if (groupedData[target]?.length > 0) {
              let present = false
              groupedData[target].map(data => {
                if (data.sessionDate === moment(dateStr).format('YYYY-MM-DD')) {
                  present = true
                  targetPer = data.perTar ? data.perTar : 0
                  item[moment(dateStr).format('YYYY-MM-DD')] = targetPer
                }
              })
              if (!present) {
                item[moment(dateStr).format('YYYY-MM-DD')] = 0
              }
            }
          })
          objects.push(item)
        })

        setKeyObjects(objects)
        console.log('final data', objects)
        setMydata(groupedData)
      } else {
        setMydata({})
        setSelectTarget(null)
      }
    }
    if (error) {
      notification.error({
        message: 'Opps their are something wrong to load the data',
      })
    }
  }, [data, error])

  const { data: filterOptions, error: filterOptErr, loading: filterOptLoading } = useQuery(
    RESPONSE_RATE_FILTER_OPT,
  )

  useEffect(() => {
    if (dateRange && mydata) {
      console.log('entired')
      const myColumns = [
        {
          key: 'targetName',
          title: 'Target name',
          fixed: 'left',
          width: '400px',
          render(obj) {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {obj.targetName}
                <Button type="link" onClick={() => handleSelectTarget(obj)}>
                  <LineChartOutlined style={{ fontSize: 30, color: 'rgb(229, 132, 37)' }} />
                </Button>
              </div>
            )
          },
        },
      ]
      days.map(dateStr => {
        myColumns.push({
          // key: dateStr,
          title: moment(dateStr).format('DD-MM-YYYY'),
          width: '120px',
          dataIndex: moment(dateStr).format('YYYY-MM-DD'),
        })
      })
      setColumns(myColumns)
      if (selectTarget && mydata.length > 0) {
        getGraphData(selectTarget)
      }
    }
  }, [dateRange, mydata])

  const getGraphData = targetName => {
    const graphAxixData = []
    days.map(date => {
      let targetPer = 0
      mydata[targetName]?.map(data => {
        if (data.sessionDate === moment(date).format('YYYY-MM-DD')) {
          targetPer = data.perTar ? data.perTar : 0
        }
      })
      graphAxixData.push({
        x: moment(date).format('DD MMMM'),
        y: targetPer,
      })
    })
    setGraphData(state => {
      state[0].data = graphAxixData
      return state
    })
  }

  const handleSelectTarget = ({ targetName }) => {
    setSelectTarget(targetName)
    getGraphData(targetName)
  }

  return (
    <div style={{ height: 400 }}>
      {selectTarget && (
        <>
          <ResponsiveLine
            data={graphData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: `Graph For Target: ${selectTarget}`,
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Target Completion (%)',
              legendOffset: -40,
              legendPosition: 'middle',
            }}
            colors={{ scheme: 'paired' }}
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
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '20px 0',
        }}
      >
        <div>
          <RangePicker size="large" value={dateRange} onChange={v => setDateRange(v)} />
        </div>
        <Button type="link" onClick={() => setFilterDrawer(true)}>
          <img style={{ width: 30, height: 30 }} src={filterIcon} alt="filter icon" />
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={keyObjects}
        bordered
        loading={loading}
        scroll={{
          x: 'max-content',
        }}
      />

      <Drawer
        visible={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        width={440}
        title="Filter Result"
      >
        <div style={{ padding: '0px 30px' }}>
          {filterOptLoading && <h5>Loading...</h5>}
          {filterOptErr && <p>Failed to load filter options</p>}
          {filterOptions && (
            <Form>
              <Form.Item label="Type">
                <Select
                  size="large"
                  value={type}
                  onChange={v => {
                    setType(v)
                  }}
                  placeholder="Filter by target type"
                >
                  {filterOptions.types.map(({ id, typeTar }) => (
                    <Option key={id} value={id}>
                      {typeTar}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Target Status" style={{ marginTop: 10 }}>
                <Select
                  size="large"
                  value={status}
                  onChange={v => setStatus(v)}
                  mode="multiple"
                  placeholder="Filter by target status"
                >
                  {filterOptions.targetStatus.map(({ id, statusName }) => (
                    <Option key={id} value={id}>
                      {statusName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button type="primary" size="large" onClick={() => setFilterDrawer(false)}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </Drawer>
    </div>
  )
})
