/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */

import React, { useState, useEffect, useReducer } from 'react'
import { Form, Input, Button, Select, DatePicker, notification, Typography, Switch, TimePicker } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import ReminderForm from 'components/tasks/ReminderForm'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'


const { Text, Title } = Typography
const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 14,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 14,
  },
}


const remainderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REMAINDER':
      return [
        ...state,
        {
          time: moment(),
          frequency: [],
        },
      ]

    case 'REMOVE_REMAINDER':
      return remove(action.index, 1, state)

    case 'UPDATE_TIME':
      return update(action.index, { ...state[action.index], time: action.time }, state)
    case 'UPDATE_FREQUENCY':
      return update(action.index, { ...state[action.index], frequency: action.frequency }, state)
    case 'RESET':
      return [{ time: moment(), frequency: [] }]
    default:
      return state
  }
}
const CREATE_TASK_DATA = gql`
mutation  CreateTask  (
  $taskType: ID!,
  $taskName: String!,
  $description: String!,
  $priority: ID!,
  $status: ID!,
  $startDate: Date!,
  $dueDate: Date!,
  $assignWork: [ID],
  $students: [ID],
  $taskDatetime: DateTime,
  $remainders: [RemainderInput]),
  
{
  createTask(input:
  {
      task:
      {
          taskType: $taskType,
          taskName: $taskName,
          description: $description,
          priority: $priority,
          status: $status,
          startDate: $startDate,
          dueDate: $dueDate,
          assignWork: $assignWork,
          students: $students,
          taskDatetime:$taskDatetime,
          remainders: $remainders,
          dayEndTime: "18:30:00",
      }
  })
  {
      task
      {
          id taskName description startDate dueDate status
          {
              id taskStatus
          }
          priority
          {
              id name
          }
          taskType
          {
              id taskType
          }
          assignWork
          {
              edges
              {
                  node
                  {
                      id name
                  }
              }
          }
          students
          {
              edges
              {
                  node
                  {
                      id firstname
                  }
              }
          }
      }
  }
}`


const UPDATE_TASK_DATA = gql`
mutation  updateTask  (
  $pk:ID!,
  $taskType: ID!,
  $taskName: String!,
  $description: String!,
  $priority: ID!,
  $status: ID!,
  $startDate: Date!,
  $dueDate: Date!,
  $assignWork: [ID],
  $students: [ID],
  $taskDatetime: DateTime,
  $remainders: [RemainderInput]),
  
{
  updateTask(input:
  {
      task:
      {
          pk:$pk,
          taskType: $taskType,
          taskName: $taskName,
          description: $description,
          priority: $priority,
          status: $status,
          startDate: $startDate,
          dueDate: $dueDate,
          assignWork: $assignWork,
          students: $students,
          taskDatetime:$taskDatetime,
          remainders: $remainders,
          dayEndTime: "18:30:00",
      }
  })
  {
      task
      {
          id taskName description      
      }
  }
}`


const BasicInformationForm = ({ user, tasks: { priority, taskStatus, taskType, learnersList, staffsList, createTaskLoading }, form, task }) => {

  console.log("Task", task);

  const [reminder, setReminder] = useState(true)
  const [preseptionDrugCount, setPreseptionDrugCount] = useState(1)
  const [remainderCount, setRemainderCount] = useState(1)
  const [taskCompletionCount, setTaskCompletionCount] = useState(0);
  const [taskSelected, setTaskSelected] = useState('General')
  const history = useHistory()

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [
    { time: moment(), frequency: [] },
  ])

  const studentId = localStorage.getItem('studentId')

  const [mutate, { data, error, loading }] = useMutation(CREATE_TASK_DATA);
  const [mutateU, { data: dataUpdate, error: errorUpdate, loading: loadingUpdate }] = useMutation(UPDATE_TASK_DATA);

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
        setReminder(remaindersList);
        setRemainderCount(remaindersList.length);
      }

      console.log(selectedStaffList, selectedStudentList, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

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
        dayEndTime: moment(task.dayEndTime, 'HH:mm:ss'),
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
    console.log(modefiRemainderState);

    form.validateFields((errorr, values) => {

      if (!errorr) {
        if (task) {
          mutateU({
            variables: {
              pk: task.id,
              taskType: values.taskType,
              description: values.description,
              startDate: moment(values.startDate).format("YYYY-MM-DD") || '',
              dueDate: moment(values.dueDate).format("YYYY-MM-DD") || '',
              status: values.status || '',
              taskName: values.taskName,
              priority: values.priority || '',
              therapists: values.therapists,
              learners: values.learners,
              taskDatetime: moment(values.dayEndTime, 'HH:mm:ss'),
              reminders: reminder ? modefiRemainderState : null,
            },
          })
        }
        else {
          mutate({
            variables: {
              taskType: values.taskType,
              description: values.description,
              startDate: moment(values.startDate).format("YYYY-MM-DD") || '',
              dueDate: moment(values.dueDate).format("YYYY-MM-DD") || '',
              status: values.status || '',
              taskName: values.taskName,
              priority: values.priority || '',
              therapists: values.therapists,
              learners: values.learners,
              taskDatetime: moment(values.dayEndTime, 'HH:mm:ss'),
              reminders: reminder ? modefiRemainderState : null,
            },
          })
        }
      }
    })
  }

  const handleValuechange = (val, option) => {
    const { props } = option;

    setTaskSelected(props.children)

  }

  useEffect(() => {
    if (dataUpdate) {
      notification.success({
        message: 'Task Data',
        description: 'Task Data Updated Successfully',
      })
      form.resetFields()
      setRemainderCount(1)
      remainderDispatch({ type: 'RESET' })
      history.push('/viewTask/')
    }

  }, [dataUpdate])

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Task Data',
        description: 'Task Data Created Successfully',
      })
      form.resetFields()
      setRemainderCount(1)
      remainderDispatch({ type: 'RESET' })
      history.push('/viewTask/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])


  return (
    <Form {...layout} name="control-ref" onSubmit={e => SubmitForm(e)}>
      <Form.Item label="Task Type" style={{ margibBottom: 5 }}>
        {form.getFieldDecorator('taskType', {
          rules: [{ required: true, message: 'Select Type' }],
        })(
          <Select
            placeholder="Select Task Type"
            allowClear
            onSelect={(val, option) => handleValuechange(val, option)}
          >
            {taskType.map(item => (
              <Option value={item.id}>{item.taskType}</Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Task Name" style={{ margibBottom: 5 }}>
        {form.getFieldDecorator('taskName', {
          rules: [{ required: true, message: 'Enter Task Name!' }],
        })(<Input placeholder='Task Summary' />)}
      </Form.Item>

      <Form.Item label="Task Summary" style={{ margibBottom: 5 }}>
        {form.getFieldDecorator('description')(
          <TextArea placeholder="Task Summary" autoSize={{ minRows: 3 }} />,
        )}
      </Form.Item>

      {taskSelected !== 'Notes' && (
        <Form.Item label="Start Date" style={{ margibBottom: 5 }}>
          {form.getFieldDecorator('startDate', {
            rules: [{ required: true, message: 'Please provide Start Date!' }],
          })(<DatePicker />)}
        </Form.Item>
      )}
      {taskSelected !== 'Notes' && (
        <Form.Item label="End Date" style={{ margibBottom: 5 }}>
          {form.getFieldDecorator('dueDate', {
            rules: [{ required: true, message: 'Please provide End Date!' }],
          })(<DatePicker />)}
        </Form.Item>
      )}

      <Form.Item label="Time" style={{ margibBottom: 5 }}>
        {form.getFieldDecorator('dayEndTime', {
          rules: [{ required: true, message: 'Please provide time!' }],
        })(<TimePicker />)}
      </Form.Item>

      {taskSelected !== 'Notes' && (
        <Form.Item label="Status" style={{ margibBottom: 5 }}>
          {form.getFieldDecorator('status', {
            rules: [{ required: true, message: 'Select Status' }],
          })(
            <Select placeholder="Select Status" allowClear>
              {taskStatus.map(item => (
                <Option value={item.id}>{item.taskStatus}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      )}

      {taskSelected !== 'Notes' && (
        <Form.Item label="Priority" style={{ margibBottom: 5 }}>
          {form.getFieldDecorator('priority', {
            rules: [{ required: true, message: 'Please Select Priority!' }],
          })(
            <Select placeholder="Select Priority" allowClear>
              {priority.map(item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      )}
      {taskSelected !== 'Reminder' && (
        <Form.Item label="Therapists" style={{ margibBottom: 5 }}>
          {form.getFieldDecorator('therapists')(
            <Select
              mode="multiple"
              optionFilterProp="label"
              placeholder="Select Therapists"
              allowClear
            >
              {staffsList.edges.map(item => (
                <Option value={item.node.id} label={item.node.name}>
                  {item.node.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      )}
      {taskSelected !== 'Reminder' && (
        <Form.Item label="Learners" style={{ margibBottom: 5 }}>
          {form.getFieldDecorator('learners')(
            <Select
              mode="multiple"
              optionFilterProp="label"
              placeholder="Select learners"
              allowClear
            >
              {learnersList.edges.map(item => (
                <Option value={item.node.id} label={item.node.firstname}>
                  {item.node.firstname}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      )}

      {taskSelected !== 'Notes' && (
        <div style={{ margin: '30px 110px 25px 110px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 20,
              alignSelf: 'center',
            }}
          >
            <Title
              style={{
                margin: 0,
                fontSize: 18,
              }}
            >
              Reminders
            </Title>
            <Switch
              defaultChecked
              onChange={() => {
                // this.setState({ reminder: !reminder })
                setReminder(state => !state)
              }}
              size="large"
            />
          </div>
          {times(n => {
            return (
              <ReminderForm
                reminder={reminder}
                dispatch={remainderDispatch}
                state={remainderState}
                index={n}
                setRemainderCount={setRemainderCount}
              />
            )
          }, remainderCount)}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text style={{ color: '#000', fontSize: 16 }}>Add another reminder</Text>
            <Button
              style={{
                height: 40,
                marginLeft: 'auto',
              }}
              onClick={() => {
                setRemainderCount(state => state + 1)
                remainderDispatch({ type: 'ADD_REMAINDER' })
              }}
            >
              <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
            </Button>
          </div>
        </div>

      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 20,
          paddingLeft: 80,
          paddingRight: 120,
          position: 'relative',
          paddingBottom: 20,
        }}
      >
        <Text style={{ color: '#000', fontSize: 16 }}>Task Completion</Text>
        <div style={{ position: 'absolute', right: 0, paddingRight: 80 }}>
          <Button
            onClick={() => { setTaskCompletionCount(taskCompletionCount > 0 ? taskCompletionCount - 1 : 0) }}
            style={{
              height: 40,
              marginLeft: 'auto',
            }}
          >
            <MinusOutlined style={{ fontSize: 24, marginTop: 2 }} />
          </Button>
          <Text style={{ color: '#000', fontSize: 24, padding: 10 }}>{taskCompletionCount}</Text>
          <Button
            onClick={() => { setTaskCompletionCount(taskCompletionCount + 1) }}
            style={{
              height: 40,
              marginLeft: 'auto',
            }}
          >
            <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
          </Button>
        </div>
      </div>
      <Form.Item {...tailLayout}>
        <Button type="primary" loading={createTaskLoading} htmlType="submit">
          Submit
        </Button>

        <Button
          // onClick={this.onReset} 
          className="ml-4"
        >
          cancel
        </Button>
      </Form.Item>
    </Form>
  )

}

export default Form.create()(BasicInformationForm)
