/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
/* eslint-disable  react/no-did-update-set-state */
import React from 'react'
import { Form, Input, Button, Select, DatePicker, Typography, Switch, TimePicker } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import ReminderForm from 'components/tasks/ReminderForm'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { times } from 'ramda'

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

@connect(({ user, tasks, updateReminderState }) => ({ user, tasks, updateReminderState }))
class EditTaskInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      taskSelected: '',
      reminder: true,
      reminderCount: 1,
      remaindersList: []
    }
  }

  componentDidMount() {
    const {
      form,
      tasks: { SelectedTask, taskCountData },
      dispatch,
      updateReminderState
    } = this.props
    console.log(SelectedTask, updateReminderState, 'sssssssssssssssssssssssssssssssss');
    dispatch({
      type: 'tasks/GET_COUNT',
      payload: {
        id: SelectedTask.id,
      },
    })
    console.log('selectedTask**********', SelectedTask)

    const selectedStaffList = []
    SelectedTask.assignWork.edges.map(item => selectedStaffList.push(item.node.id))

    const selectedStudentList = []
    SelectedTask.students.edges.map(item => selectedStudentList.push(item.node.id))
    const remaindersList = []
    //  console.log(SelectedTask.remainders,'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    if (SelectedTask.remainders) {
      SelectedTask.remainders.edges.map(item =>
        remaindersList.push({ time: moment(item?.node?.time), frequency: [] }),
      )
      console.log(remaindersList, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
      this.setState({ remaindersList: remaindersList, reminderCount: remaindersList.length })
    }
    if (
      moment()
        .utc()
        .local()
        .format('HH:mm:ss') === '00:00:00'
    ) {
      dispatch({
        type: 'tasks/CREATE_COUNT',
        payload: {
          id: SelectedTask.id,
          count: 0,
        },
      })
    }
    form.setFieldsValue({
      taskType: SelectedTask.taskType.id,
      description: SelectedTask.description,
      startDate: moment(SelectedTask.startDate),
      dueDate: moment(SelectedTask.dueDate),
      status: SelectedTask.status.id,
      taskName: SelectedTask.taskName,
      priority: SelectedTask.priority.id,
      therapists: selectedStaffList,
      learners: selectedStudentList,
      dayEndTime: moment(SelectedTask.dayEndTime, 'HH:mm:ss'),
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      tasks: { SelectedTask },
    } = this.props
    e.preventDefault()
    const { updateReminderState, taskCountData } = this.props
    const { reminder } = this.state
    const modefiRemainderState = []
    Array.from(updateReminderState).forEach(node => {
      modefiRemainderState.push({
        frequency: node.frequency,
        time: node.time
          .local()
          .utc()
          .format('HH:mm:ss'),
      })
    })
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'tasks/EDIT_TASK',
          payload: {
            id: SelectedTask.id,
            values: values,
            reminderState: reminder && modefiRemainderState ? modefiRemainderState : null,
          },
        })
        if (taskCountData > 0) {
          dispatch({
            type: 'tasks/CREATE_COUNT',
            payload: {
              id: SelectedTask.id,
              count: taskCountData,
            },
          })
        }
      }
    })
  }

  onReset = () => {
    const { dispatch } = this.props
    this.formRef.current.resetFields()
  }

  handleValuechange = (val, option) => {
    const { props } = option
    this.setState({ taskSelected: props.children })
  }

  render() {
    const itemStyle = { marginBottom: '0' }
    const {
      form,
      tasks: {
        priority,
        taskStatus,
        taskType,
        learnersList,
        staffsList,
        createTaskLoading,
        taskCountData,
        SelectedTask,
      },
      dispatch,
      updateReminderState,
    } = this.props
    const { taskSelected, reminderCount, reminder, remaindersList } = this.state

    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Task Type" style={itemStyle}>
          {form.getFieldDecorator('taskType', {
            rules: [{ required: true, message: 'Select Type' }],
          })(
            <Select
              placeholder="Select Task Type"
              allowClear
              onSelect={(val, option) => this.handleValuechange(val, option)}
            >
              {taskType.map(item => (
                <Option value={item.id}>{item.taskType}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Description" style={itemStyle}>
          {form.getFieldDecorator('description', {
            rules: [{ message: 'Please provide Address!' }],
          })(<TextArea placeholder="description" autoSize={{ minRows: 3 }} />)}
        </Form.Item>
        {taskSelected !== 'Notes' && (
          <Form.Item label="Start Date" style={itemStyle}>
            {form.getFieldDecorator('startDate', {
              rules: [{ required: true, message: 'Please provide Start Date!' }],
            })(<DatePicker />)}
          </Form.Item>
        )}
        {taskSelected !== 'Notes' && (
          <Form.Item label="End Date" style={itemStyle}>
            {form.getFieldDecorator('dueDate', {
              rules: [{ required: true, message: 'Please provide End Date!' }],
            })(<DatePicker />)}
          </Form.Item>
        )}
        <Form.Item label="Time" style={itemStyle}>
          {form.getFieldDecorator('dayEndTime', {
            rules: [{ required: true, message: 'Please provide time!' }],
          })(<TimePicker />)}
        </Form.Item>
        {taskSelected !== 'Notes' && (
          <Form.Item label="Status" style={itemStyle}>
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
        <Form.Item label="Task Name" style={itemStyle}>
          {form.getFieldDecorator('taskName', {
            rules: [{ required: true, message: 'Enter Task Name!' }],
          })(<Input />)}
        </Form.Item>
        {taskSelected !== 'Notes' && (
          <Form.Item label="Priority" style={itemStyle}>
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
          <Form.Item label="Therapists" style={itemStyle}>
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
          <Form.Item label="Learners" style={itemStyle}>
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
          <div style={{ margin: '30px 10px 25px 10px' }}>
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
                  this.setState({ reminder: !reminder })
                }}
                size="large"
              />
            </div>
            {remaindersList.length > 0 &&
              times(n => {
                return (
                  <ReminderForm
                    key={n}
                    reminder={reminder}
                    dispatch={dispatch}
                    state={remaindersList}
                    index={n}
                    setRemainderCount={() => this.setState({ reminderCount: reminderCount - 1 })}
                    removeReducerType="updateTask/REMOVE_REMAINDER"
                    timeReducerType="updateTask/UPDATE_TIME"
                    frequencyReducerType="UPDATE_FREQUENCY"
                  />
                )
              }, reminderCount)}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Text style={{ color: '#000', fontSize: 16 }}>Add Another Remainder</Text>
              <Button
                style={{
                  height: 40,
                  marginLeft: 'auto',
                }}
                onClick={() => {
                  this.setState({ reminderCount: reminderCount + 1 })
                  dispatch({ type: 'updateTask/ADD_REMAINDER' })
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
            paddingLeft: 10,
            paddingRight: 10,
            position: 'relative',
            paddingBottom: 20,
          }}
        >
          <Text style={{ color: '#000', fontSize: 16 }}>Task Completion</Text>
          <div style={{ position: 'absolute', right: 0, paddingRight: 10 }}>
            <Button
              style={{
                height: 40,
                marginLeft: 'auto',
              }}
              onClick={() => {
                if (taskCountData !== 0) {
                  dispatch({
                    type: 'tasks/SET_COUNT',
                    payload: taskCountData - 1,
                  })
                }
              }}
            >
              <MinusOutlined style={{ fontSize: 24, marginTop: 2 }} />
            </Button>
            <Text style={{ color: '#000', fontSize: 24, padding: 10 }}>{taskCountData}</Text>

            <Button
              style={{
                height: 40,
                marginLeft: 'auto',
              }}
              onClick={() =>
                dispatch({
                  type: 'tasks/SET_COUNT',
                  payload: taskCountData + 1,
                })
              }
            >
              <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
            </Button>
          </div>
        </div>
        <Form.Item {...tailLayout}>
          <Button type="submit" loading={createTaskLoading} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const EditTaskInformationForm = Form.create()(EditTaskInformation)

export default EditTaskInformationForm
