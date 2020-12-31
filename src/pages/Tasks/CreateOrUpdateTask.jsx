import React, { useState, useEffect, useReducer } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  notification,
  Typography,
  Switch,
  Row,
  Col,
  Divider,
} from 'antd'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { times } from 'ramda'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

import ReminderForm from 'components/tasks/ReminderForm'
import RemainderReducer from './reducer'
import { CREATE_TASK_DATA, UPDATE_TASK_DATA } from './queries'

import './CreateOrUpdateTask.scss'

const { Text } = Typography
const { TextArea } = Input
const { Option } = Select

const CreateOrUpdateTask = ({ tasks, form, task }) => {
  const { priority, taskStatus, taskType, learnersList, staffsList, createTaskLoading } = tasks
  const [reminder, setReminder] = useState(true)
  const [remainderCount, setRemainderCount] = useState(1)
  const [taskCompletionCount, setTaskCompletionCount] = useState(0)
  const [taskSelected, setTaskSelected] = useState('General')
  const history = useHistory()

  const [remainderState, remainderDispatch] = useReducer(RemainderReducer, [
    { time: moment(), frequency: [] },
  ])

  const [
    createTask,
    { data: createTaskData, error: createTaskError, loading: isCreateTaskLoading },
  ] = useMutation(CREATE_TASK_DATA)

  const [
    updateTask,
    { data: updateTaskData, error: updateTaskError, loading: isUpdateTaskLoading },
  ] = useMutation(UPDATE_TASK_DATA)

  useEffect(() => {
    if (task) {
      const selectedStaffList = []
      task.assignWork.edges.map(item => selectedStaffList.push(item.node.id))

      const selectedStudentList = []
      task.students.edges.map(item => selectedStudentList.push(item.node.id))
      const remaindersList = []

      if (task.remainders) {
        task.remainders.edges.map(item =>
          remaindersList.push({ time: moment(item?.node?.time), frequency: [] }),
        )
        setReminder(remaindersList)
        setRemainderCount(remaindersList.length)
      }

      form.setFieldsValue({
        taskType: task.taskType.id,
        description: task.description,
        startDate: moment(task.startDate),
        dueDate: moment(task.dueDate),
        status: task.status.id,
        taskName: task.taskName,
        priority: task.priority.id,
        therapists: selectedStaffList,
        learners: selectedStudentList,
      })
    }
  }, [task])

  const SubmitForm = e => {
    e.preventDefault()

    const modefiRemainderState = []
    Array.from(remainderState).forEach(node => {
      modefiRemainderState.push({
        frequency: node.frequency,
        time: moment(node.time)
          .local()
          .utc()
          .format('HH:mm'),
      })
    })
    console.log(modefiRemainderState)

    form.validateFields((errorr, values) => {
      if (!errorr) {
        if (task) {
          updateTask({
            variables: {
              pk: task.id,
              taskType: values.taskType,
              description: values.description,
              startDate: moment(values.startDate).format('YYYY-MM-DD') || '',
              dueDate: moment(values.dueDate).format('YYYY-MM-DD') || '',
              status: values.status || '',
              taskName: values.taskName,
              priority: values.priority || '',
              therapists: values.therapists,
              learners: values.learners,
              reminders: reminder ? modefiRemainderState : null,
            },
          })
        } else {
          createTask({
            variables: {
              taskType: values.taskType,
              description: values.description,
              startDate: moment(values.startDate).format('YYYY-MM-DD') || '',
              dueDate: moment(values.dueDate).format('YYYY-MM-DD') || '',
              status: values.status || '',
              taskName: values.taskName,
              priority: values.priority || '',
              therapists: values.therapists,
              learners: values.learners,
              reminders: reminder ? modefiRemainderState : null,
            },
          })
        }
      }
    })
  }

  const handleTaskTypeSelectionChange = (val, option) => {
    const { props } = option

    setTaskSelected(props.children)
  }

  useEffect(() => {
    if (updateTaskData) {
      notification.success({
        message: 'Task Data',
        description: 'Task Data Updated Successfully',
      })
      form.resetFields()
      setRemainderCount(1)
      remainderDispatch({ type: 'RESET' })
      history.push('/viewTask/')
    }
  }, [updateTaskData])

  useEffect(() => {
    if (createTaskData) {
      notification.success({
        message: 'Task Data',
        description: 'Task Data Created Successfully',
      })
      form.resetFields()
      setRemainderCount(1)
      remainderDispatch({ type: 'RESET' })
      history.push('/viewTask/')
    }
  }, [createTaskData])

  return (
    <Form name="manageTasks" onSubmit={SubmitForm} className="CreateOrUpdate">
      <Divider orientation="left">Basic Details</Divider>

      {/* Task Type */}
      <Row>
        <Col span={24}>
          <Form.Item label="Task Type" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
            {form.getFieldDecorator('taskType', {
              rules: [{ required: true, message: 'Select Task Type' }],
            })(
              <Select
                placeholder="Select Task Type"
                allowClear
                onSelect={handleTaskTypeSelectionChange}
              >
                {taskType.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.taskType}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>

      {/* Task Name */}
      <Row>
        <Col span={24}>
          <Form.Item label="Task Name" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
            {form.getFieldDecorator('taskName', {
              rules: [{ required: true, message: 'Enter Task Name!' }],
            })(<Input placeholder="Task Name" />)}
          </Form.Item>
        </Col>
      </Row>

      {/* Therapist */}
      {taskSelected !== 'Reminder' && (
        <Row>
          <Col span={24}>
            <Form.Item label="Therapists" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              {form.getFieldDecorator('therapists')(
                <Select
                  mode="multiple"
                  optionFilterProp="label"
                  placeholder="Select Therapists"
                  allowClear
                >
                  {staffsList.edges.map(item => (
                    <Option key={item.node.id} value={item.node.id} label={item.node.name}>
                      {item.node.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* Learners */}
      {taskSelected !== 'Reminder' && (
        <Row>
          <Col span={24}>
            <Form.Item label="Learners" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              {form.getFieldDecorator('learners')(
                <Select
                  mode="multiple"
                  optionFilterProp="label"
                  placeholder="Select learners"
                  allowClear
                >
                  {learnersList.edges.map(item => (
                    <Option key={item.node.id} value={item.node.id} label={item.node.firstname}>
                      {item.node.firstname}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* Start Date - End Date */}
      {taskSelected !== 'Notes' && (
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Start Date" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('startDate', {
                rules: [{ required: true, message: 'Please provide Start Date!' }],
              })(<DatePicker />)}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="End Date" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('dueDate', {
                rules: [{ required: true, message: 'Please provide End Date!' }],
              })(<DatePicker />)}
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* Status - Priority */}
      {taskSelected !== 'Notes' && (
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Status" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('status', {
                rules: [{ required: true, message: 'Select Status' }],
              })(
                <Select placeholder="Select Status" allowClear>
                  {taskStatus.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.taskStatus}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Priority" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('priority', {
                rules: [{ required: true, message: 'Please Select Priority!' }],
              })(
                <Select placeholder="Select Priority" allowClear>
                  {priority.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* Task Summary" */}
      <Row>
        <Col span={24}>
          <Form.Item label="Summary" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
            {form.getFieldDecorator('description')(
              <TextArea placeholder="Task Summary" autoSize={{ minRows: 3 }} />,
            )}
          </Form.Item>
        </Col>
      </Row>

      {/* Reminder */}
      {taskSelected !== 'Notes' && (
        <>
          <Divider orientation="left">Reminder</Divider>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <Form.Item
                label="Set Reminders"
                labelCol={{ offset: 1, sm: 10 }}
                wrapperCol={{ sm: 12 }}
              >
                <Switch checked={reminder} onChange={setReminder} />
              </Form.Item>
            </Col>
          </Row>

          <div>
            {times(n => {
              return (
                <ReminderForm
                  key={n}
                  reminder={reminder}
                  dispatch={remainderDispatch}
                  state={remainderState}
                  index={n}
                  setRemainderCount={setRemainderCount}
                />
              )
            }, remainderCount)}
            <Row>
              <Col offset={6} span={12}>
                <Button
                  type="dashed"
                  onClick={() => {
                    setRemainderCount(state => state + 1)
                    remainderDispatch({ type: 'ADD_REMAINDER' })
                  }}
                  style={{ width: '100%', margin: '10px 0px' }}
                >
                  <PlusOutlined /> Add another reminder
                </Button>
              </Col>
            </Row>
          </div>
        </>
      )}

      {/* Task complete */}
      <Row>
        <Col>
          <Form.Item label="Task Completed" labelCol={{ sm: 6 }} wrapperCol={{ offset: 1, sm: 17 }}>
            <Button
              disabled={taskCompletionCount === 0}
              onClick={() => {
                setTaskCompletionCount(taskCompletionCount > 0 ? taskCompletionCount - 1 : 0)
              }}
            >
              <MinusOutlined />
            </Button>
            <Text className="taskCompletionCount">{taskCompletionCount}</Text>
            <Button
              onClick={() => {
                setTaskCompletionCount(taskCompletionCount + 1)
              }}
            >
              <PlusOutlined />
            </Button>
          </Form.Item>
        </Col>
      </Row>

      {/* Buttons */}
      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" loading={createTaskLoading} htmlType="submit">
          Submit
        </Button>
        <Button
          // onClick={this.onReset}
          className="ml-4"
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(CreateOrUpdateTask)
