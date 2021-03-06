/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  Typography,
  DatePicker,
  TimePicker,
  Modal,
} from 'antd'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { CANCEL_BUTTON, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import './MealForm.scss'
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  UPDATE_ABC,
  GET_ENVIRONMENTS,
  GET_ATTENDANCE,
  GET_CONSEQUENCES,
  GET_BEHAVIOR,
  CREATE_CONSIQUENCE,
  CREATE_BEHAVIOR,
  CREATE_ATTENDENCE,
} from './query'

const { Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { layout, tailLayout } = FORM

const dateFormat = 'YYYY-MM-DD'

const UpdateABCForm = ({ style, form, updateAbc, setUpdateAbc, closeDrawer }) => {
  const studentId = localStorage.getItem('studentId')
  // new
  const [frequency, setFrequency] = useState(updateAbc.frequency)
  const [antecedentModel, setAntecedentModel] = useState(false)
  const [behaviourModel, setBehaviourModel] = useState(false)
  const [consequenceModel, setConsequenceModel] = useState(false)
  const [newBehName, setNewBehName] = useState()
  const [newAntName, setNewAntName] = useState()
  const [newConsName, setNewConsName] = useState()
  const [behaviorDataState, setBehaviourDataState] = useState()
  const [consequencesDataState, setConsequencesDataState] = useState()
  const [antecedentDataState, setAntecedentDataState] = useState()

  const { data: behaviorData, loading: behaviorLoading } = useQuery(GET_BEHAVIOR, {
    variables: { studentId },
  })
  const { data: consequencesData, loading: consequencesLoading } = useQuery(GET_CONSEQUENCES, {
    variables: { studentId },
  })
  const { data: antecedentData, loading: antecedentLoading } = useQuery(GET_ATTENDANCE, {
    variables: { studentId },
  })
  const { data: environmentData, loading: locationLoding } = useQuery(GET_ENVIRONMENTS, {
    variables: {
      studentId,
    },
  })

  const [mutate, { data, error, loading }] = useMutation(UPDATE_ABC, {
    variables: {
      id: updateAbc.id,
      date: moment().format(dateFormat),
    },
  })

  const [
    createNewBehName,
    { data: createBehData, loading: createBehLoading, error: createBehError },
  ] = useMutation(CREATE_BEHAVIOR)

  useEffect(() => {
    if (behaviorData) {
      setBehaviourDataState([...behaviorData.getBehaviour.edges])
    }
  }, [behaviorData])

  useEffect(() => {
    if (consequencesData) {
      setConsequencesDataState([...consequencesData.getConsequences.edges])
    }
  }, [consequencesData])

  useEffect(() => {
    if (antecedentData) {
      setAntecedentDataState([...antecedentData.getAntecedent.edges])
    }
  }, [antecedentData])

  useEffect(() => {
    if (createBehData) {
      notification.success({
        message: 'New Behavior Created Sucessfully',
      })
      setBehaviourDataState(state => {
        if (state) {
          return [{ node: createBehData.createBehaviour.details }, ...state]
        }
        return [{ node: createBehData.createBehaviour.details }]
      })
      setNewBehName('')
      setBehaviourModel(false)
    }
    if (createBehError) {
      notification.error({
        message: 'New Behavior Creation Error',
      })
    }
  }, [createBehData, createBehError])

  const [
    createNewAttendence,
    { data: createAntData, loading: createAntLoading, error: createAntError },
  ] = useMutation(CREATE_ATTENDENCE)

  useEffect(() => {
    if (createAntData) {
      notification.success({
        message: 'New Antendence Created Sucessfully',
      })
      setNewAntName('')
      setAntecedentModel(false)
      setAntecedentDataState(state => {
        if (state) {
          return [{ node: createAntData.createAntecedent.details }, ...state]
        }
        return [{ node: createAntData.createAntecedent.details }]
      })
    }
    if (createAntError) {
      notification.error({
        message: 'New Antendence Creation Error',
      })
    }
  }, [createAntData, createAntError])

  const [
    createNewConsiquence,
    { data: createConsData, loading: createConsLoading, error: createConsError },
  ] = useMutation(CREATE_CONSIQUENCE)

  useEffect(() => {
    if (createConsData) {
      notification.success({
        message: 'New Consiquence Created Sucessfully',
      })
      setNewConsName('')
      setConsequenceModel(false)
      setConsequencesDataState(state => {
        if (state) {
          return [{ node: createConsData.createConsequence.details }, ...state]
        }
        return [{ node: createConsData.createConsequence.details }]
      })
    }
    if (createConsError) {
      notification.error({
        message: 'New Consiquence Creation Error',
      })
    }
  }, [createConsData, createConsError])

  const SubmitForm = e => {
    e.preventDefault()
    form.validateFields((formError, values) => {
      if (!formError) {
        mutate({
          variables: {
            studentId,
            date: moment(values.date).format(dateFormat),
            frequency,
            time: moment(values.time).format('HH:mm a'),
            intensity: values.intensity,
            response: values.response,
            note: values.note,
            function: values.function,
            behaviors: values.behaviors,
            consequences: values.consequences,
            antecedents: values.antecedents,
            environment: values.environment,
          },
        })
      }
    })
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Update ABC data Successfully',
      })
      form.resetFields()
      setUpdateAbc(null)
      if (closeDrawer) {
        closeDrawer()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing want wrong',
      })
    }
  }, [error])

  const handelCreateNewBehName = () => {
    if (newBehName) {
      createNewBehName({
        variables: {
          name: newBehName,
          studentId,
        },
      })
    } else {
      notification.info({ message: 'Type the name' })
    }
  }

  const handelCreateNewAnt = () => {
    if (newAntName) {
      createNewAttendence({
        variables: {
          name: newAntName,
          studentId,
        },
      })
    } else {
      notification.info({ message: 'Type the name' })
    }
  }

  const handelCreateNewCons = () => {
    if (newConsName) {
      createNewConsiquence({
        variables: {
          name: newConsName,
          studentId,
        },
      })
    } else {
      notification.info({ message: 'Type the name' })
    }
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <Form
      {...layout}
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
      layout="horizontal"
    >
      <Form.Item label="Date">
        {form.getFieldDecorator('date', {
          initialValue: moment(updateAbc.date),
          rules: [{ required: true, message: 'Please Select a Date!' }],
        })(<DatePicker placeholder="Select Date" tyle={{ width: '100%' }} />)}
      </Form.Item>

      <Form.Item label="Time">
        {form.getFieldDecorator('time', {
          initialValue: moment(updateAbc.time, 'HH:mm a'),
          rules: [{ required: true, message: 'Please Select a Time!' }],
        })(
          <TimePicker
            placeholder="Select a Time"
            use12Hours
            format="h:mm a"
            style={{ width: '100%' }}
          />,
        )}
      </Form.Item>

      <div style={{ position: 'relative' }}>
        <PlusCircleOutlined
          onClick={() => setAntecedentModel(true)}
          style={{
            position: 'absolute',
            right: '0px',
            top: '10px',
            zIndex: '100',
            fontSize: '20px',
          }}
        />

        <Form.Item label="Antecedent">
          {form.getFieldDecorator('antecedents', {
            initialValue: updateAbc.antecedent.edges.map(({ node }) => node.id),
            rules: [{ required: true, message: 'Please Select an Antecedent!' }],
          })(
            <Select
              placeholder="Select an Antecedent"
              allowclear
              showSearch
              optionFilterProp="name"
              mode="multiple"
              loading={antecedentLoading}
            >
              {antecedentDataState &&
                antecedentDataState.map(({ node }) => {
                  return (
                    <Option value={node.id} key={node.id} name={node.antecedentName}>
                      {node.antecedentName}
                    </Option>
                  )
                })}
            </Select>,
          )}
        </Form.Item>
      </div>

      <div style={{ position: 'relative' }}>
        <PlusCircleOutlined
          onClick={() => setBehaviourModel(true)}
          style={{
            position: 'absolute',
            right: '0px',
            top: '10px',
            zIndex: '100',
            fontSize: '20px',
          }}
        />

        <Form.Item label="Behavior">
          {form.getFieldDecorator('behaviors', {
            initialValue: updateAbc.behavior.edges.map(({ node }) => node.id),
            rules: [{ required: true, message: 'Please Select a Behavior!' }],
          })(
            <Select
              placeholder="Select a Behavior"
              allowclear
              showSearch
              optionFilterProp="name"
              mode="multiple"
              loading={behaviorLoading}
            >
              {behaviorDataState &&
                behaviorDataState.map(({ node }) => {
                  return (
                    <Option value={node.id} key={node.id} name={node.behaviorName}>
                      {node.behaviorName}
                    </Option>
                  )
                })}
            </Select>,
          )}
        </Form.Item>
      </div>

      <div style={{ position: 'relative' }}>
        <PlusCircleOutlined
          onClick={() => setConsequenceModel(true)}
          style={{
            position: 'absolute',
            right: '0px',
            top: '10px',
            zIndex: '100',
            fontSize: '20px',
          }}
        />

        <Form.Item label="Consequence">
          {form.getFieldDecorator('consequences', {
            initialValue: updateAbc.consequences.edges.map(({ node }) => node.id),
            rules: [{ required: true, message: 'Please Select a Consequence!' }],
          })(
            <Select
              placeholder="Select a Consequence"
              allowclear
              showSearch
              optionFilterProp="name"
              mode="multiple"
              loading={consequencesLoading}
            >
              {consequencesDataState &&
                consequencesDataState.map(({ node }) => {
                  return (
                    <Option value={node.id} key={node.id} name={node.consequenceName}>
                      {node.consequenceName}
                    </Option>
                  )
                })}
            </Select>,
          )}
        </Form.Item>
      </div>

      <div style={{ position: 'relative' }}>
        <Form.Item label="Environment">
          {form.getFieldDecorator('environment', {
            initialValue: updateAbc.environments.id,
          })(
            <Select
              placeholder="Select a Environment"
              allowclear
              showSearch
              optionFilterProp="name"
              loading={locationLoding}
            >
              {environmentData?.getEnvironment.map(item => {
                return (
                  <Option value={item.id} key={item.id} name={item.name}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>,
          )}
        </Form.Item>
      </div>

      <Form.Item label="Intensity">
        {form.getFieldDecorator('intensity', {
          initialValue: updateAbc.Intensiy,
          rules: [{ required: true, message: 'Please Select an intensity!' }],
        })(
          <Select style={{ width: '100%' }} placeholder="Select an Intensity">
            <Option key={1} value="Severe">
              Severe
            </Option>
            <Option key={2} value="Moderate">
              Moderate
            </Option>
            <Option key={3} value="Mild Function">
              Mild Function
            </Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Response">
        {form.getFieldDecorator('response', {
          initialValue: updateAbc.response,
          rules: [{ required: true, message: 'Please Select a response!' }],
        })(
          <Select placeholder="Select a Response" allowclear>
            <Option value="Improve" key="1">
              Improve
            </Option>
            <Option value="No Change" key="2">
              No Change
            </Option>
            <Option value="Escalated" key="3">
              Escalated
            </Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Frequency">
        <div style={{ display: 'flex' }}>
          <div style={{ paddingTop: '2px' }}>
            <MinusSquareOutlined
              style={{ fontSize: 24, marginRight: '10px' }}
              onClick={() =>
                setFrequency(state => {
                  if (state > 0) {
                    return state - 1
                  }
                  return 0
                })
              }
            />
          </div>
          <Input
            type="number"
            value={frequency}
            style={{ width: 70, marginRight: 10 }}
            onChange={e => setFrequency(parseInt(e.target.value, 10))}
          />
          <div style={{ paddingTop: '2px' }}>
            <PlusSquareOutlined
              onClick={() => setFrequency(state => state + 1)}
              style={{ fontSize: 24 }}
            />
          </div>
        </div>
      </Form.Item>

      <Form.Item label="Function">
        {form.getFieldDecorator('function', {
          initialValue: updateAbc.function,
          rules: [{ required: true, message: 'Please Select a Function!' }],
        })(
          <Select placeholder="Select a function" allowclear>
            <Option value="Escape" key="1">
              Escape
            </Option>
            <Option value="Attention" key="2">
              Attention
            </Option>
            <Option value="Tangible" key="3">
              Tangible
            </Option>
            <Option value="Sensory" key="4">
              Sensory
            </Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Note">
        {form.getFieldDecorator('note', {
          initialValue: updateAbc.Notes,
        })(
          <TextArea
            style={{
              resize: 'none',
              width: '100%',
              height: 180,
            }}
          />,
        )}
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON} loading={loading}>
          Update Data
        </Button>
        <Button
          type="danger"
          style={CANCEL_BUTTON}
          onClick={() => {
            setUpdateAbc(null)
            form.resetFields()
            closeDrawer()
          }}
        >
          Cancel
        </Button>
      </Form.Item>

      <Modal
        visible={antecedentModel}
        title="Create A New Antecedent"
        onCancel={() => setAntecedentModel(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewAnt}
            loading={createAntLoading}
          >
            Create
          </Button>,
        ]}
      >
        <Form>
          <Input
            placeholder="Type Antecedent Name"
            value={newAntName}
            onChange={e => setNewAntName(e.target.value)}
          />
        </Form>
      </Modal>

      <Modal
        visible={behaviourModel}
        title="Create A New Behavior"
        onCancel={() => setBehaviourModel(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewBehName}
            loading={createBehLoading}
          >
            Create
          </Button>,
        ]}
      >
        <Form>
          <Input
            placeholder="Type Behavior Name"
            value={newBehName}
            onChange={e => setNewBehName(e.target.value)}
          />
        </Form>
      </Modal>

      <Modal
        visible={consequenceModel}
        title="Create A New Consequence"
        onCancel={() => setConsequenceModel(false)}
        footer={[
          <Button key="submit" type="primary" onClick={handelCreateNewCons}>
            Create
          </Button>,
        ]}
      >
        <Form>
          <Input
            placeholder="Type Consequence Name"
            value={newConsName}
            onChange={e => setNewConsName(e.target.value)}
          />
        </Form>
      </Modal>
    </Form>
  )
}

export default Form.create()(UpdateABCForm)
