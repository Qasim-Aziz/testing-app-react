/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, notification, Modal } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
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

const TEMPLATE_DETAILS = gql`
  query getTemplateDetails($id: ID!) {
    getTemplateDetails(id: $id) {
      id
      behavior {
        id
        behaviorName
        definition
      }
      status {
        id
        statusName
      }
      behaviorDescription
      environment {
        edges {
          node {
            id
            name
          }
        }
      }
      measurments {
        edges {
          node {
            id
            measuringType
            unit
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

const UPDATE_TEMP = gql`
  mutation updateTemplate(
    $studentId: ID!
    $behaviorId: ID!
    $tempId: ID!
    $status: ID!
    $description: String!
    $measurments: [ID!]!
    $env: [ID!]!
  ) {
    updateTemplate(
      input: {
        decelData: {
          pk: $tempId
          student: $studentId
          behavior: $behaviorId
          status: $status
          behaviorDescription: $description
          measurments: $measurments
          environment: $env
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
        environment {
          edges {
            node {
              id
              name
            }
          }
        }
        measurments {
          edges {
            node {
              measuringType
            }
          }
        }
      }
    }
  }
`

const BehaviourForm = ({ style, tempId, form, setUpdateTempId }) => {
  const durationMesId = 'RGVjZWxCZWhhdmlvck1lYXN1cmluZ3NUeXBlOjQ='
  const studentId = localStorage.getItem('studentId')
  const [initialEnv, setInitialEnv] = useState()
  const [initialMeasu, setInitialMeasu] = useState()
  const [addBehNameModal, setAddBehNameModal] = useState(false)
  const [addEnvNameModal, setAddEnvNameModal] = useState(false)
  const [newBehName, setNewBahName] = useState('')
  const [behNameList, setBehNameList] = useState()
  const [newEnvName, setNewEnvName] = useState('')
  const [disableNewBehButton, setDisableNewBehButton] = useState(true)
  const [disableNewEnvButton, setDisableNewEnvButton] = useState(true)
  const [envList, setEnvList] = useState()

  const {
    data: getTemDetailsData,
    loading: getTemDetailsLoading,
    error: getTemDetailsError,
  } = useQuery(TEMPLATE_DETAILS, {
    variables: { id: tempId },
    fetchPolicy: 'no-cache',
  })

  const { data: behaviorData, loading: behaviorLoading } = useQuery(BEHAVIORS, {
    variables: {
      studentId,
    },
    fetchPolicy: 'network-only',
  })

  const { data: dancleStatusData, loading: dancleStatusLoading } = useQuery(DANCLE_STATUS)

  const { data: dancleEnvData, loading: dancleEnvLoading } = useQuery(DANCLE_ENVS, {
    fetchPolicy: 'network-only',
  })

  const { data: dancleMeasurementData, loading: dancleMeasurementLoading } = useQuery(
    DANCLE_MEASURMENTS,
  )

  const [
    updateTemp,
    { data: updateTempData, loading: updateTempLoading, error: updateTempError },
  ] = useMutation(UPDATE_TEMP)

  const [
    createNewBehName,
    { data: createBehData, loading: createBehLoading, error: createBehError },
  ] = useMutation(CREATE_BEHAVIOR)

  const [
    createNewEnv,
    { data: createNewEnvData, loading: createNewEnvLoading, error: createNewEnvError },
  ] = useMutation(CREATE_ENVIRONMENT)

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
    if (getTemDetailsData) {
      const env = []
      getTemDetailsData.getTemplateDetails.environment.edges.map(({ node }) => {
        env.push(node.id)
      })
      setInitialEnv(env)

      const measurement = []
      getTemDetailsData.getTemplateDetails.measurments.edges.map(({ node }) => {
        measurement.push(node.id)
      })
      setInitialMeasu(measurement)
    }
  }, [getTemDetailsData])

  useEffect(() => {
    if (updateTempData) {
      notification.success({
        message: 'Update Template Sucessfully',
      })
      setUpdateTempId('')
    }
  }, [updateTempData])

  useEffect(() => {
    if (updateTempError) {
      notification.error({
        message: 'Opps their something wrong',
      })
    }
  }, [updateTempError])

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
      form.resetFields()
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
        updateTemp({
          variables: {
            tempId,
            studentId,
            behaviorId: value.name,
            status: value.status,
            description: value.description,
            measurments: value.measurements,
            env: value.envs,
          },
        })
      }
    })
  }

  return (
    <Form
      onSubmit={SubmitForm}
      name="control-update"
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
      <Button
        type="link"
        onClick={() => {
          setUpdateTempId('')
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
      {getTemDetailsLoading && <div style={{ minHeight: '90vh' }}>Loading...</div>}
      {getTemDetailsError && <div style={{ minHeight: '90vh' }}>Opps their something wrong</div>}
      {getTemDetailsData && (
        <div>
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
                initialValue:
                  getTemDetailsData &&
                  !behaviorLoading &&
                  getTemDetailsData.getTemplateDetails.behavior.id,
                rules: [
                  {
                    required: true,
                    message: 'Please select the behavior name!',
                  },
                ],
              })(
                <Select
                  placeholder="Select Behavior Name"
                  size="large"
                  loading={behaviorLoading}
                  showSearch
                  optionFilterProp="name"
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
              initialValue:
                !dancleStatusLoading &&
                getTemDetailsData &&
                getTemDetailsData.getTemplateDetails.status.id,
              rules: [{ required: true, message: 'Please select a status' }],
            })(
              <Select
                placeholder="Select Behavior Status"
                size="large"
                loading={dancleStatusLoading}
              >
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
            {form.getFieldDecorator('description', {
              initialValue: getTemDetailsData.getTemplateDetails.behaviorDescription,
            })(
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
                initialValue: !dancleEnvLoading && initialEnv && initialEnv,
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
                    <Option key={envData.id} value={envData.id}>
                      {envData.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </div>

          <Form.Item label="Measurements">
            {form.getFieldDecorator('measurements', {
              initialValue: !dancleMeasurementLoading && initialMeasu && initialMeasu,
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
            <div
              style={{
                marginTop: 15,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '47%',
                  height: 40,
                  background: '#0B35B3',
                }}
                loading={updateTempLoading}
              >
                Update Template
              </Button>
              <Button
                type="danger"
                style={{
                  width: '47%',
                  height: 40,
                }}
                disabled={updateTempLoading}
                onClick={() => {
                  form.resetFields()
                  setUpdateTempId('')
                }}
              >
                Cancle
              </Button>
            </div>
          </Form.Item>
        </div>
      )}

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
