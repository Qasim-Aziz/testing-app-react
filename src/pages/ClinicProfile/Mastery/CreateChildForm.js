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

const CREATE_CHILD_MASTERY = gql`
  mutation childMasteryCriteria(
    $criteriaId: ID!
    $fromStatus: ID!
    $toStatus: ID!
    $response: Int!
    $consecutiveDays: Int!
    $minTrial: Int!
  ) {
    childMasteryCriteria(
      input: {
        masteryId: $criteriaId
        responsePercentage: $response
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
`

const IncrimentCard = ({ style, title, name, form }) => (
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
        initialValue: 0,
        rules: [{ required: true, message: 'Please enter From Status' }],
      })(<InputNumber min={0} style={{ width: 120 }} />)}
    </Form.Item>
  </div>
)

const MasteryForm = ({ form, criteriaid, setOpen, MASTER_TARGET }) => {
  const [status, setStatus] = useState([])
  const {
    data: targetStatusData,
    error: targetStatusError,
    loading: targetStatusLoading,
  } = useQuery(TARGET_STATUS)

  const [
    createChildMastery,
    {
      data: createChildMasteryData,
      error: createChildMasteryError,
      loading: createChildMasteryLoading,
    },
  ] = useMutation(CREATE_CHILD_MASTERY, {
    update(cache, { data: { childMasteryCriteria } }) {
      const data = cache.readQuery({ query: MASTER_TARGET })
      const newData = data.masteryCriteria.map(criteria => {
        if (criteria.id === criteriaid) {
          criteria.statuscriteriaSet.edges = [
            { node: childMasteryCriteria.childCriteria },
            ...criteria.statuscriteriaSet.edges,
          ]
        }
        return criteria
      })
      cache.writeQuery({ query: MASTER_TARGET, newData })
    },
  })

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
    if (createChildMasteryData) {
      notification.success({
        message: 'Create child mastery succesfully',
      })
      setOpen(false)
      form.resetFields()
    }
  }, [createChildMasteryData])

  useEffect(() => {
    if (createChildMasteryError) {
      notification.error({
        message: 'Create child mastery faild',
      })
    }
  }, [createChildMasteryError])

  const SubmitForm = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        createChildMastery({
          variables: {
            criteriaId: criteriaid,
            response: values.response,
            fromStatus: values.fromStatus,
            toStatus: values.toStatus,
            consecutiveDays: values.consecutiveDays,
            minTrial: values.minTrials,
          },
        })
      }
    })
  }

  return (
    <Form name="targetForm" onSubmit={SubmitForm}>
      <Card style={{ width: 500 }} title="Status Transition">
        <Form.Item
          label="From Status"
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        >
          {form.getFieldDecorator('fromStatus', {
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
            rules: [{ required: true, message: 'Please enter To Status' }],
          })(
            <Select placeholder="To Status" allowClear size="large" loading={targetStatusLoading}>
              {status &&
                status.map(question => <Option value={question.id}>{question.statusName}</Option>)}
            </Select>,
          )}
        </Form.Item>

        <IncrimentCard form={form} title="Response %" name="response" style={{ marginTop: 0 }} />
        <IncrimentCard
          form={form}
          title="Consecutive Days"
          name="consecutiveDays"
          style={{ marginTop: 20 }}
        />
        <IncrimentCard
          form={form}
          title="Minimum Trials"
          name="minTrials"
          style={{ marginTop: 20 }}
        />
      </Card>
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 15, fontSize: 16, width: '100%', height: 40 }}
        loading={createChildMasteryLoading}
      >
        Create New Criteria
      </Button>
    </Form>
  )
}

export default Form.create()(MasteryForm)
