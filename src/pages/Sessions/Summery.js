/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Table, Button, notification, Drawer, Form, Select, DatePicker } from 'antd'
import { usePrevious } from 'react-delta'
import { ResponsiveLine } from '@nivo/line'
import moment from 'moment'
import filterIcon from 'icons/filter.png'
import { SESSIONS_SUMMERY, FREQUENCY_DIS_TARGET } from './query'
import './form.scss'

const { RangePicker } = DatePicker

export default () => {
  const [selectSession, setSelectSession] = useState()
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [range, setRange] = useState([moment().startOf('week'), moment().endOf('week')])
  const [session, setSession] = useState()
  const studentId = localStorage.getItem('studentId')
  const prevSelectSession = usePrevious(selectSession)
  const { Option } = Select
  const [graphData, setGraphData] = useState([
    {
      id: 'japan',
      color: 'hsl(159, 70%, 50%)',
      data: [],
    },
  ])

  const { data, error, loading } = useQuery(SESSIONS_SUMMERY, {
    variables: {
      studentId,
    },
  })
  const [
    getFreDisTarget,
    { data: freDisData, error: freDisError, loading: freDisLoading },
  ] = useLazyQuery(FREQUENCY_DIS_TARGET, {
    variables: {
      session: selectSession,
      student: studentId,
    },
  })

  useEffect(() => {
    if (freDisData) {
      const newGraphData = []
      freDisData.freqDistriTarget.map(({ duration, tarCount }) => {
        newGraphData.push({
          x: duration,
          y: tarCount,
        })
      })
      setGraphData(state => {
        state[0].data = newGraphData
        return state
      })
    }
  }, [freDisData])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error to load sessions summery data',
      })
    }
  }, [error])

  useEffect(() => {
    if (freDisError) {
      notification.error({
        message: 'Error to load graph data',
      })
    }
  }, [freDisError])

  useEffect(() => {
    if (selectSession && selectSession !== prevSelectSession) {
      getFreDisTarget()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSession])

  return (
    <div>
      {/* <pre>{JSON.stringify(freDisData, null, 2)}</pre> */}
      {selectSession && freDisData && (
        <div style={{ height: 300, marginBottom: 30 }}>
          <ResponsiveLine
            data={graphData}
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
              legend: 'Duration',
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Target count',
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
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '10px 0',
        }}
      >
        <Button type="link" onClick={() => setFilterDrawer(true)}>
          <img style={{ width: 30, height: 30 }} src={filterIcon} alt="filter icon" />
        </Button>
      </div>

      <Table
        loading={loading}
        dataSource={data?.sessionSummary}
        columns={[
          {
            title: 'Date',
            key: 'sessionDate',
            dataIndex: 'sessionDate',
          },
          {
            title: 'Session',
            key: 'sessions.sessionName.name',
            dataIndex: 'sessions.sessionName.name',
          },
          {
            title: 'Duration',
            key: 'duration',
            dataIndex: 'duration',
          },
          {
            title: 'Correct Count',
            key: 'correctCount',
            dataIndex: 'correctCount',
          },
          {
            title: 'Incorrect Count',
            key: 'errorCount',
            dataIndex: 'errorCount',
          },
          {
            title: 'Prompt Count ',
            key: 'promptCount',
            dataIndex: 'promptCount',
          },
          {
            title: 'Behavior count',
            key: 'behCount',
            dataIndex: 'behCount',
          },
          {
            title: 'Mand Count',
            key: 'promptCount',
            dataIndex: 'promptCount',
          },
          {
            title: 'Toilet Count',
            key: 'toiletCount',
            dataIndex: 'toiletCount',
          },
          {
            title: 'Action',
            render(obj) {
              return (
                <Button
                  type="primary"
                  onClick={() => setSelectSession(obj.id)}
                  loading={freDisLoading && selectSession === obj.id}
                >
                  View Graph
                </Button>
              )
            },
          },
        ]}
      />

      <Drawer
        visible={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        width={440}
        title="Filter Result"
      >
        <div style={{ padding: '0px 30px' }}>
          <Form>
            <Form.Item label="Date">
              <RangePicker size="large" value={range} onChange={v => setRange(v)} />
            </Form.Item>
            <Form.Item label="Session">
              <Select
                size="large"
                placeholder="Filter by session"
                value={session}
                onChange={v => setSession(v)}
              >
                <Option key="1" value="Morning">
                  Morning
                </Option>
                <Option key="2" value="Afternoon">
                  Afternoon
                </Option>
                <Option key="3" value="Evining">
                  Evening
                </Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  )
}
