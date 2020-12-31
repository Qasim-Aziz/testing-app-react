/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, notification, Modal } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import './templateform.scss'

const { Option } = Select
const { TextArea } = Input

const DANCLE_STATUS = gql`
  query {
    getDecelStatus {
      id
      statusName
      statusCode
    }
  }
`

const DANCLE_ENVS = gql`
  query {
    getEnvironment {
      id
      name
      defination
    }
  }
`

const DANCLE_MEASURMENTS = gql`
  query {
    getBehaviourMeasurings {
      id
      measuringType
      unit
    }
  }
`

const CREATE_TAMPLET = gql`
  mutation createTemplate(
    $studentId: ID!
    $behaviorId: ID!
    $status: ID!
    $description: String
    $measurments: [ID]
    $envs: [ID]
  ) {
    createTemplate(
      input: {
        decelData: {
          student: $studentId
          behavior: $behaviorId
          status: $status
          behaviorDescription: $description
          measurments: $measurments
          environment: $envs
        }
      }
    ) {
      details {
        id
        behaviorDef
        behaviorDescription
        behavior {
          id
          behaviorName
          definition
        }
        status {
          id
          statusName
        }
        measurments {
          edges {
            node {
              id
            }
          }
        }
        environment {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

const BEHAVIORS = gql`
  query getBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
        }
      }
    }
  }
`

const CREATE_BEHAVIOR = gql`
  mutation createBehaviour($studentId: ID!, $name: String!) {
    createBehaviour(input: { student: $studentId, name: $name, definition: "Test Definition" }) {
      details {
        id
        behaviorName
      }
    }
  }
`

const CREATE_ENVIRONMENT = gql`
  mutation createEnvironment($studentId: String!, $name: String!) {
    createEnvironment(
      input: { student: $studentId, name: $name, definition: "Test Env Definition" }
    ) {
      details {
        id
        name
        defination
      }
    }
  }
`

const BehaviourForm = ({ style, setNewTamplate, setNewTampletFromOpen, form }) => {
  const studentId = localStorage.getItem('studentId')
  const durationMesId = 'RGVjZWxCZWhhdmlvck1lYXN1cmluZ3NUeXBlOjQ='
  const [addBehNameModal, setAddBehNameModal] = useState(false)
  const [addEnvNameModal, setAddEnvNameModal] = useState(false)
  const [newBehName, setNewBahName] = useState('')
  const [behNameList, setBehNameList] = useState()
  const [newEnvName, setNewEnvName] = useState('')
  const [disableNewBehButton, setDisableNewBehButton] = useState(true)
  const [disableNewEnvButton, setDisableNewEnvButton] = useState(true)
  const [envList, setEnvList] = useState()

  const [
    createNewBehName,
    { data: createBehData, loading: createBehLoading, error: createBehError },
  ] = useMutation(CREATE_BEHAVIOR)

  const [
    createNewEnv,
    { data: createNewEnvData, loading: createNewEnvLoading, error: createNewEnvError },
  ] = useMutation(CREATE_ENVIRONMENT)

  const { data: dancleStatusData, loading: dancleStatusLoading } = useQuery(DANCLE_STATUS)

  const { data: dancleEnvData, loading: dancleEnvLoading } = useQuery(DANCLE_ENVS)

  const { data: dancleMeasurementData, loading: dancleMeasurementLoading } = useQuery(
    DANCLE_MEASURMENTS,
  )

  const [
    createTemplate,
    { data: newTempleteData, error: newTempletError, loading: newTempleteLoading },
  ] = useMutation(CREATE_TAMPLET)

  const { data: behaviorData, loading: behaviorLoading } = useQuery(BEHAVIORS, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (newTempleteData) {
      notification.success({
        message: 'Behavior Data',
        description: 'New Behavior Templete Added Successfully',
      })
      setNewTamplate({ node: newTempleteData.createTemplate.details })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newTempleteData])

  useEffect(() => {
    if (newTempletError) {
      notification.error({
        message: 'Somthing went wrong',
        description: newTempletError.message,
      })
    }
  }, [newTempletError])

  useEffect(() => {
    if (behaviorData) {
      setBehNameList(behaviorData.getBehaviour.edges)
    }
  }, [behaviorData])

  useEffect(() => {
    if (dancleEnvData) {
      setEnvList(dancleEnvData.getEnvironment)
    }
  }, [dancleEnvData])

  useEffect(() => {
    if (createBehData) {
      notification.success({
        message: 'Create New Behavior Name Successfully',
      })
      setBehNameList(state => {
        return [{ node: createBehData.createBehaviour.details }, ...state]
      })
      setNewBahName('')
      setAddBehNameModal(false)
    }
  }, [createBehData])

  useEffect(() => {
    if (createBehError) {
      notification.error({
        message: 'Opps their some thing wrong on create New Behavior Name',
      })
    }
  }, [createBehError])

  useEffect(() => {
    if (createNewEnvData) {
      notification.success({
        message: 'Create New Environment Successfully',
      })
      setEnvList(state => {
        return [createNewEnvData.createEnvironment.details, ...state]
      })
      setNewEnvName('')
      setAddEnvNameModal(false)
    }
  }, [createNewEnvData])

  useEffect(() => {
    if (createNewEnvError) {
      notification.error({
        message: 'Opps their some thing wrong on create New Environment',
      })
    }
  }, [createNewEnvError])

  useEffect(() => {
    if (newBehName.length < 1) {
      setDisableNewBehButton(true)
    } else {
      setDisableNewBehButton(false)
    }
  }, [newBehName])

  useEffect(() => {
    if (newEnvName.length < 1) {
      setDisableNewEnvButton(true)
    } else {
      setDisableNewEnvButton(false)
    }
  }, [newEnvName])

  const handelCreateNewBehName = () => {
    if (newBehName.length > 0) {
      createNewBehName({
        variables: {
          name: newBehName,
          studentId,
        },
      })
    }
  }

  const handelCreateNewEnv = () => {
    if (newEnvName.length > 0) {
      createNewEnv({
        variables: {
          name: newEnvName,
          studentId,
        },
      })
    }
  }

  const SubmitForm = e => {
    e.preventDefault()
    form.validateFields((error, value) => {
      if (!error) {
        createTemplate({
          variables: {
            studentId,
            behaviorId: value.name,
            status: value.status,
            description: value.description,
            measurments: value.measurements,
            envs: value.envs,
          },
        })
      }
    })
  }

  return (
    <Form
      onSubmit={SubmitForm}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
      <Button
        type="link"
        onClick={() => {
          setNewTampletFromOpen(false)
        }}
        style={{
          position: 'absolute',
          right: -12,
          top: 0,
          zIndex: 10,
        }}
      >
        <CloseOutlined style={{ fontSize: 20, color: '#D81E06' }} />
      </Button>
      <div
        style={{
          position: 'relative',
          paddingTop: 50,
        }}
      >
        <Button
          style={{
            position: 'absolute',
            top: 50,
            right: 0,
            zIndex: 10,
          }}
          onClick={() => setAddBehNameModal(true)}
        >
          <PlusOutlined style={{ fontSize: 20, marginTop: 3 }} />
        </Button>
        <Form.Item label="Behavior Name">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please select the behavior name!' }],
          })(
            <Select
              placeholder="Select Behavior Name"
              size="large"
              loading={behaviorLoading}
              showSearch
              optionFilterProp="name"
              style={{
                color: '#000',
              }}
            >
              {behNameList?.map(({ node }) => {
                return (
                  <Option key={node.id} vlaue={node.id} name={node.behaviorName}>
                    {node.behaviorName}
                  </Option>
                )
              })}
            </Select>,
          )}
        </Form.Item>
      </div>

      <Form.Item label="Status">
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: 'Please select a status' }],
        })(
          <Select placeholder="Select Behavior Status" size="large" loading={dancleStatusLoading}>
            {dancleStatusData &&
              dancleStatusData.getDecelStatus.map(dancleStatus => (
                <Option value={dancleStatus.id} key={dancleStatus.id}>
                  {dancleStatus.statusName}
                </Option>
              ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Behavior Description">
        {form.getFieldDecorator('description', { initialValue: '' })(
          <TextArea
            placeholder="Describe the behavior"
            style={{
              height: 174,
              resize: 'none',
              color: '#000',
            }}
          />,
        )}
      </Form.Item>
      <div style={{ position: 'relative' }}>
        <Button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10,
          }}
          onClick={() => setAddEnvNameModal(true)}
        >
          <PlusOutlined style={{ fontSize: 20, marginTop: 3 }} />
        </Button>
        <Form.Item label="Environments">
          {form.getFieldDecorator('envs', {
            rules: [{ required: true, message: 'Please select a Environments' }],
          })(
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              size="large"
              loading={dancleEnvLoading}
            >
              {envList?.map(envData => (
                <Option value={envData.id} key={envData.id}>
                  {envData.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </div>

      <Form.Item label="Measurements">
        {form.getFieldDecorator('measurements', {
          initialValue: [durationMesId],
          rules: [{ required: true, message: 'Please select a Environments' }],
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            size="large"
            loading={dancleMeasurementLoading}
          >
            {dancleMeasurementData &&
              dancleMeasurementData.getBehaviourMeasurings.map(measurement => (
                <Option
                  key={measurement.id}
                  value={measurement.id}
                  disabled={measurement.id === durationMesId}
                >
                  {measurement.measuringType}
                </Option>
              ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '100%',
            height: 40,
            background: '#0B35B3',
            boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04)',
            borderRadius: 8,
            fontSize: 17,
            fontWeight: 'bold',
            marginTop: 10,
          }}
          loading={newTempleteLoading}
        >
          New Template
        </Button>
      </Form.Item>

      <Modal
        visible={addBehNameModal}
        title="Add New Behavior Name"
        onCancel={() => setAddBehNameModal(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewBehName}
            loading={createBehLoading}
            disabled={disableNewBehButton}
          >
            Create
          </Button>,
        ]}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Input
            value={newBehName}
            onChange={e => setNewBahName(e.target.value)}
            size="large"
            placeholder="Type the new modal name"
            autoFocus
          />
        </div>
      </Modal>

      <Modal
        visible={addEnvNameModal}
        title="Add New Environment"
        onCancel={() => setAddEnvNameModal(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewEnv}
            loading={createNewEnvLoading}
            disabled={disableNewEnvButton}
          >
            Create
          </Button>,
        ]}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Input
            value={newEnvName}
            onChange={e => setNewEnvName(e.target.value)}
            size="large"
            placeholder="Type the new environment name"
            autoFocus
          />
        </div>
      </Modal>
    </Form>
  )
}

export default Form.create()(BehaviourForm)
