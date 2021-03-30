import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, Button, DatePicker, Select, notification } from 'antd'
import moment from 'moment'
import { FORM } from 'assets/styles/globalStyles'
import {
  createLongTermGoal,
  createShortTermGoal,
  updateLongTermGoal,
  updateShortTermGoal,
} from '../targetAlocation/TargetAllocation.query'

const selectStyle = {
  width: '100%',
  height: '48px',
  zIndex: '1000',
}

const AddLongAndShortGoalForm = props => {
  const {
    type,
    student,
    program,
    activeLongTermGoal,
    goalResponsibilityList,
    goalStatusList,
    onSuccess,
    activeShortTermGoal,
    form,
  } = props

  useEffect(() => {
    const dataObj = type === 'long-edit' ? activeLongTermGoal : activeShortTermGoal
    if (type === 'long-edit' || type === 'short-edit') {
      form.setFieldsValue({
        endDate: moment(dataObj.node.dateEnd, 'YYYY-MM-DD'),
        dateIntiated: moment(dataObj.node.dateInitialted, 'YYYY-MM-DD'),
        description: dataObj.node.description,
        goalName: dataObj.node.goalName,
        goalStatus: dataObj.node.goalStatus.id,
        responsible: dataObj.node.responsibility.id,
      })
    } else {
      resetForm()
    }
  }, [type])

  const resetForm = () => {
    form.setFieldsValue({
      endDate: moment().add(3, 'M'),
      dateIntiated: moment(),
      description: null,
      goalName: null,
      goalStatus: goalStatusList[0].id,
      responsible: goalResponsibilityList[1].id,
    })
  }
  const [goalLoading, setGoalLoadig] = useState(false)

  const addGoal = async () => {
    setGoalLoadig(true)
    let isError = true
    let formValues = null

    form.validateFields((error, values) => {
      console.log('error, values==>', error, values)
      isError = error
      formValues = values
    })

    if (!isError) {
      if (type === 'long') {
        const createLongTermGoalResp = await createLongTermGoal(
          student,
          formValues.goalName,
          formValues.description,
          moment(formValues.dateIntiated).format('YYYY-MM-DD'),
          moment(formValues.endDate).format('YYYY-MM-DD'),
          formValues.responsible,
          formValues.goalStatus,
          program,
        )
        setGoalLoadig(false)
        if (createLongTermGoalResp) {
          notification.success({
            message: 'Long Term Created Successfully',
          })
          onSuccess(createLongTermGoalResp, type)
          form.resetFields()
        }
      } else if (type === 'long-edit') {
        const updateLongTermGoalResp = await updateLongTermGoal(
          student,
          formValues.goalName,
          formValues.description,
          moment(formValues.dateIntiated).format('YYYY-MM-DD'),
          moment(formValues.endDate).format('YYYY-MM-DD'),
          formValues.responsible,
          formValues.goalStatus,
          program,
          activeLongTermGoal.node.id,
        )
        setGoalLoadig(false)
        if (updateLongTermGoalResp) {
          notification.success({
            message: 'Long Term Updated Successfully',
          })
          onSuccess(updateLongTermGoalResp, type)
          form.resetFields()
        }
      } else if (type === 'short') {
        const createShortTermGoalResp = await createShortTermGoal(
          activeLongTermGoal.node.id,
          student,
          formValues.goalName,
          formValues.description,
          moment(formValues.dateIntiated).format('YYYY-MM-DD'),
          moment(formValues.endDate).format('YYYY-MM-DD'),
          formValues.responsible,
          formValues.goalStatus,
        )
        setGoalLoadig(false)
        if (createShortTermGoalResp) {
          notification.success({
            message: 'Short Term Created Successfully',
          })
          onSuccess(createShortTermGoalResp, type)
          form.resetFields()
        }
      } else if (type === 'short-edit') {
        const updateShortTermGoalResp = await updateShortTermGoal(
          activeLongTermGoal.node.id,
          student,
          formValues.goalName,
          formValues.description,
          moment(formValues.dateIntiated).format('YYYY-MM-DD'),
          moment(formValues.endDate).format('YYYY-MM-DD'),
          formValues.responsible,
          formValues.goalStatus,
          activeShortTermGoal.node.id,
        )
        setGoalLoadig(false)
        if (updateShortTermGoalResp) {
          notification.success({
            message: 'Short Term Updated Successfully',
          })
          onSuccess(updateShortTermGoalResp, type)
          form.resetFields()
        }
      }
    }
  }

  const formRef = useRef(null)

  return (

    <Form ref={formRef} {...FORM.layout} layout="horizontal">
      <Form.Item
        label="Goal Name"
      >
        {form.getFieldDecorator('goalName', {
          rules: [{ required: true, message: 'Please provide goal name!' }],
        })(<Input placeholder="Goal Name" />)}
      </Form.Item>

      <Form.Item
        label="Description"
      >
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: 'Please provide description!' }],
        })(<Input.TextArea placeholder="Description" />)}
      </Form.Item>

      <Form.Item
        label="Date Intiated"        
      >
        {form.getFieldDecorator('dateIntiated', {
          rules: [{ required: true, message: 'Please Select date intiated!' }],
        })(
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="Start Date"
          />,
        )}
      </Form.Item>

      <Form.Item
        label="End Date"
      >
        {form.getFieldDecorator('endDate', {
          rules: [{ required: true, message: 'Please Select end date!' }],
        })(
          <DatePicker format="YYYY-MM-DD" placeholder="End Date" />,
        )}
      </Form.Item>

      <Form.Item
        label="Responsible"
      >
        {form.getFieldDecorator('responsible', {
          rules: [{ required: true, message: 'Please Select responsible!' }],
        })(
          <Select placeholder="Responsible">
            {goalResponsibilityList.map(gsl => {
              return (
                <Select.Option value={gsl.id} key={gsl.id}>
                  {gsl.name}
                </Select.Option>
              )
            })}
          </Select>,
        )}
      </Form.Item>

      <Form.Item
        label="Goal Status"
      >
        {form.getFieldDecorator('goalStatus', {
          rules: [{ required: true, message: 'Please Select goal status!' }],
        })(
          <Select placeholder="Goal Status">
            {goalStatusList.map(gsl => {
              return (
                <Select.Option value={gsl.id} key={gsl.id}>
                  {gsl.status}
                </Select.Option>
              )
            })}
          </Select>,
        )}
      </Form.Item>

      <Form.Item {...FORM.tailLayout}>
        <Button
          onClick={addGoal}
          loading={goalLoading}
          type="primary"
          htmlType="submit"
        >
          {type.includes('edit') ? 'Update' : 'Submit'}
        </Button>
      </Form.Item>
    </Form>
  )
}

const AddLongAndShortGoal = Form.create()(AddLongAndShortGoalForm)
export default AddLongAndShortGoal
