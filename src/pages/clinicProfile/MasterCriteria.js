/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { Table, Button, Switch, Select, Drawer, Form, Input, Typography, notification } from 'antd'
import { FormOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'

const { Option } = Select
const { Text } = Typography

const CREATE_MASTER = gql`
  mutation masteryCriteria($response: Int!, $consecutiveDays: Int!, $minTrial: Int!) {
    masteryCriteria(
      input: {
        id: "fdg"
        chilMastery: {
          responsePercentage: $response
          consecutiveDays: $consecutiveDays
          minTrial: $minTrial
          fromStatus: "U3RhdHVzVHlwZTo1"
          toStatus: "U3RhdHVzVHlwZTo0"
        }
      }
    ) {
      masteryCriteria {
        id
        name
        createdAt
        isDefault
        statuscriteriaSet {
          edges {
            node {
              id
              responsePercentage
              consecutiveDays
              minTrial
              fromStatus {
                id
                statusName
              }
              toStatus {
                id
                statusName
              }
            }
          }
        }
      }
    }
  }
`

const GET_MASTER = gql`
  query {
    masteryCriteria {
      responsePercentage
      consecutiveDays
      minTrial
      isDefault
    }
  }
`

export default () => {
  const [addMasterDrawer, setAddMasterDrawer] = useState(false)
  const [dataSource, setDataSource] = useState()

  const { data: masterData, loading: masterLoading, error: masterError } = useQuery(GET_MASTER)

  useEffect(() => {
    if (masterError) {
      notification.error({
        message: 'Failed to load Master Criteria, Try again',
      })
    }
  })

  useEffect(() => {
    if (masterData) {
      const newData = []
      masterData.masteryCriteria.map(
        ({ responsePercentage, consecutiveDays, minTrial, isDefault }) => {
          newData.push({
            name: 'Criteria 1',
            response: responsePercentage,
            days: consecutiveDays,
            minTrials: minTrial,
            defaultMastery: isDefault,
          })
        },
      )
      setDataSource(newData)
    }
  }, [masterData])

  const columns = [
    {
      title: 'Criteria Name',
      dataIndex: 'name',
    },
    {
      title: 'Response',
      dataIndex: 'response',
    },
    {
      title: 'Consecutive Days',
      dataIndex: 'days',
    },
    {
      title: 'Minimum Trials',
      dataIndex: 'minTrials',
    },
    {
      title: 'Default Mastery Criteria',
      dataIndex: 'defaultMastery',
      render: data => (
        <div>
          <Switch checked={data} disabled />
        </div>
      ),
    },
    {
      title: 'Edit',
      render: () => {
        return (
          <div>
            <Button type="link">
              <FormOutlined style={{ fontSize: 24 }} />
            </Button>
          </div>
        )
      },
    },
  ]
  return (
    <div style={{ marginTop: 30 }}>
      <div
        style={{
          display: 'flex',
          marginBottom: 20,
          justifyContent: 'flex-end',
        }}
      >
        <Select style={{ marginRight: 25, width: 220 }} size="large" defaultValue="helloWorld">
          <Option key="hello">Hello</Option>
        </Select>
        <Button size="large" onClick={() => setAddMasterDrawer(true)}>
          <PlusOutlined style={{ fontSize: 24, marginTop: 4 }} />
        </Button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        loading={masterLoading}
      />

      <Drawer
        visible={addMasterDrawer}
        onClose={() => setAddMasterDrawer(false)}
        title="Add Mastery Criteria"
        width="400px"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            padding: 30,
            paddingTop: 0,
          }}
        >
          <CreateMasterCriteriaForm setOpen={setAddMasterDrawer} />
        </div>
      </Drawer>
    </div>
  )
}

const IncrimentCard = ({ style, title, count, setCount }) => (
  <div
    style={{
      background: '#FFFFFF',
      border: '1px solid #E4E9F0',
      boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
      borderRadius: 4,
      padding: '18px 19px',
      display: 'flex',
      alignItems: 'center',
      ...style,
    }}
  >
    <Text
      style={{
        fontSize: 16,
        fontWeight: 600,
        color: '#63686E',
        margin: 0,
        lineHeight: '22px',
      }}
    >
      {title}
    </Text>
    <Button
      style={{ marginLeft: 'auto' }}
      type="link"
      onClick={() => setCount(state => (state > 0 ? state - 1 : state))}
    >
      <MinusOutlined style={{ fontSize: 20, color: '#FF7474' }} />
    </Button>
    <Text style={{ margin: '0px', fontSize: 18, fontWeight: 600 }}>{count}</Text>
    <Button type="link" onClick={() => setCount(state => state + 1)}>
      <PlusOutlined style={{ fontSize: 20, color: 'green' }} />
    </Button>
  </div>
)

const CreateMasterCriteriaForm = Form.create()(({ form, setOpen }) => {
  const [response, setResponse] = useState(1)
  const [consecutive, setConsecutive] = useState(1)
  const [minTrials, setMinTrials] = useState(1)

  const [createMaster, { data: createMasterData, error: createMasterError }] = useMutation(
    CREATE_MASTER,
  )

  useEffect(() => {
    if (createMasterData) {
      notification.success({
        message: 'New Master Criteria Created Sucessfully',
      })
      setResponse(1)
      setConsecutive(1)
      setMinTrials(1)
      form.resetFields()
      setOpen(false)
    }
  }, [createMasterData])

  useEffect(() => {
    if (createMasterError) {
      notification.error({
        message: 'New Master Criteria Create Faild',
      })
    }
  }, [createMasterError])

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, values) => {
      if (!error) {
        createMaster({
          variables: {
            response,
            consecutiveDays: consecutive,
            minTrial: minTrials,
          },
        })
      }
    })
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Criteria Name">
        {form.getFieldDecorator('criteriaName', {
          rules: [{ required: true, message: 'Please give the criteria name!' }],
        })(<Input placeholder="Type the criteria name" size="large" />)}
      </Form.Item>

      <IncrimentCard
        title="Response %"
        count={response}
        setCount={setResponse}
        style={{ marginTop: 20 }}
      />
      <IncrimentCard
        title="Consecutive Days"
        count={consecutive}
        setCount={setConsecutive}
        style={{ marginTop: 20 }}
      />
      <IncrimentCard
        title="Minimum Trials"
        count={minTrials}
        setCount={setMinTrials}
        style={{ marginTop: 20 }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginTop: 15, fontSize: 16, width: '46%', height: 40 }}
        >
          Create Criteria
        </Button>

        <Button
          type="danger"
          style={{ marginTop: 15, fontSize: 16, width: '46%', height: 40 }}
          onClick={() => {
            setConsecutive(1)
            setMinTrials(1)
            setResponse(1)
            setOpen(false)
          }}
        >
          Cancle
        </Button>
      </div>
    </Form>
  )
})
