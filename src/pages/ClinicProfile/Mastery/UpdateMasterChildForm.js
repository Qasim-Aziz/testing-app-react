/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Select, InputNumber, notification, Typography } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'

const { Text } = Typography

const { Option } = Select

const TARGET_STATUS = gql`
  query {
    targetStatus {
      id
      statusName
    }
  }
`

const UPDATE_CHILD = gql`
  mutation(
    $id: ID!
    $responsePercentage: Int!
    $consecutiveDays: Int!
    $minTrial: Int!
    $fromStatus: ID!
    $toStatus: ID!
  ) {
    childMasteryCriteria(
      input: {
        id: $id
        responsePercentage: $responsePercentage
        consecutiveDays: $consecutiveDays
        minTrial: $minTrial
        fromStatus: $fromStatus
        toStatus: $toStatus
      }
    ) {
      childCriteria {
        id
        responsePercentage
        consecutiveDays
        minTrial
        MasteryCriteria {
          id
        }
        __typename
      }
      __typename
    }
  }
`

const GET_A_MASTER_CHILDREN = gql`
  query($id: ID!) {
    masCriChild(id: $id) {
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
`

const IncrimentCard = ({ style, title, name, form, childData }) => (
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

    <Form.Item style={{ marginLeft: 'auto', marginBottom: 0 }}>
      {form.getFieldDecorator(name, {
        initialValue: childData.masCriChild[name],
        rules: [{ required: true, message: 'Please enter From Status' }],
      })(<InputNumber min={0} style={{ width: 120 }} />)}
    </Form.Item>
  </div>
)

const MasteryForm = ({ form, setOpen, id }) => {
  const [status, setStatus] = useState([])
  const {
    data: targetStatusData,
    error: targetStatusError,
    loading: targetStatusLoading,
  } = useQuery(TARGET_STATUS)

  const { data: childData, error: childError, loading: childLoading } = useQuery(
    GET_A_MASTER_CHILDREN,
    {
      variables: {
        id,
      },
    },
  )

  const [
    updateChildMastery,
    {
      data: updateChildMasteryData,
      error: updateChildMasteryError,
      loading: updateChildMasteryLoading,
    },
  ] = useMutation(UPDATE_CHILD)

  useEffect(() => {
    if (targetStatusError) {
      notification.error({
        message: targetStatusError.response.errors[0].message,
      })
    }
    if (targetStatusData) {
      setStatus([...targetStatusData.targetStatus])
    }
  }, [targetStatusError, targetStatusData])

  useEffect(() => {
    if (updateChildMasteryData) {
      notification.success({
        message: 'Update child mastery succesfully',
      })
      setOpen(false)
      form.resetFields()
    }
  }, [updateChildMasteryData])

  useEffect(() => {
    if (updateChildMasteryError) {
      notification.error({
        message: 'Update child mastery faild',
      })
    }
  }, [updateChildMasteryError])

  const SubmitForm = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateChildMastery({
          variables: {
            id,
            responsePercentage: values.responsePercentage,
            fromStatus: values.fromStatus,
            toStatus: values.toStatus,
            consecutiveDays: values.consecutiveDays,
            minTrial: values.minTrial,
          },
        })
      }
    })
  }

  if (childLoading) {
    return 'Loading...'
  }

  if (childError) {
    return 'Opps their something wrong'
  }

  return (
    <Form name="targetForm" onSubmit={SubmitForm}>
      <Card style={{ width: 500 }} title="Status Transition">
        <Form.Item
          label="From Status"
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        >
          {form.getFieldDecorator('fromStatus', {
            initialValue: childData.masCriChild.fromStatus?.id,
            rules: [{ required: true, message: 'Please enter From Status' }],
          })(
            <Select placeholder="From Status" allowClear size="large" loading={targetStatusLoading}>
              {status &&
                status.map(question => <Option value={question.id}>{question.statusName}</Option>)}
            </Select>,
          )}
        </Form.Item>
        <Form.Item
          label="To Status"
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
            margin: '0 8px',
          }}
        >
          {form.getFieldDecorator('toStatus', {
            initialValue: childData.masCriChild.toStatus?.id,
            rules: [{ required: true, message: 'Please enter To Status' }],
          })(
            <Select placeholder="To Status" allowClear size="large" loading={targetStatusLoading}>
              {status &&
                status.map(question => <Option value={question.id}>{question.statusName}</Option>)}
            </Select>,
          )}
        </Form.Item>

        <IncrimentCard
          form={form}
          childData={childData}
          title="Response %"
          name="responsePercentage"
          style={{ marginTop: 0 }}
        />
        <IncrimentCard
          form={form}
          childData={childData}
          title="Consecutive Days"
          name="consecutiveDays"
          style={{ marginTop: 20 }}
        />
        <IncrimentCard
          form={form}
          childData={childData}
          title="Minimum Trials"
          name="minTrial"
          style={{ marginTop: 20 }}
        />
      </Card>
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 15, fontSize: 16, width: '100%', height: 40 }}
        loading={updateChildMasteryLoading}
      >
        Update Criteria
      </Button>
    </Form>
  )
}

export default Form.create()(MasteryForm)
