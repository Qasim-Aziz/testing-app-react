/* eslint-disable no-shadow */
/* eslint-disable  */
import React, { useEffect, useState, useReducer } from 'react'
import { Form, Input, DatePicker, Select, Button, notification, Radio, Checkbox } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useMutation } from 'react-apollo'
import { remove, times, update } from 'ramda'
import moment from 'moment'
import SubmodulesForm from './SubmodulesForm'
import {
  CREATE_GENERAL_ASSESSMENT,
  UPDATE_SUBMODULE,
  UPDATE_GENERAL_ASSESSMENT,
  REMOVE_SUBMODULE,
} from '../query'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { TextArea } = Input
const { Option } = Select
const { layout, tailLayout } = FORM

const submodulesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATE': {
      if (action.payload.length > 0) {
        let temp = []
        temp = action.payload.map(item => {
          return { name: item.name, id: item.id }
        })
        return temp
      } else {
        return [{ name: '' }]
      }
    }

    case 'ADD_SUBMODULE':
      return [
        ...state,
        {
          name: '',
        },
      ]
    case 'REMOVE_SUBMODULE':
      return remove(action.index, 1, state)
    case 'UPDATE_SUBMODULE':
      return update(action.index, { ...state[action.index], name: action.name }, state)
    case 'RESET':
      return [{ name: '' }]
    default:
      return state
  }
}

const CreateGenAssessForm = ({
  form,
  setCreateAssessDrawer,
  update,
  currentRow,
  refetchAssess,
}) => {
  const [submodulesCount, setSubmodulesCount] = useState(
    update && currentRow.hasSubmodule ? currentRow?.submodules.length : 1,
  )
  const [hasSubmodules, setHasSubmodules] = useState(false)
  const [pk, setPk] = useState(currentRow?.id)
  const [submodulesState, submodulesDispatch] = useReducer(submodulesReducer, [{ name: '' }])

  const [createGenAssess, { data, error, loading }] = useMutation(CREATE_GENERAL_ASSESSMENT)
  const [removeSubmodules] = useMutation(REMOVE_SUBMODULE)
  const [updateSubmodule] = useMutation(UPDATE_SUBMODULE)
  const [
    updateGenAssess,
    { data: updatedData, loading: updatedLoading, error: updatedError },
  ] = useMutation(UPDATE_GENERAL_ASSESSMENT)

  useEffect(() => {
    if (update && currentRow.hasSubmodule) {
      submodulesDispatch({
        type: 'SET_STATE',
        payload: currentRow.submodules,
      })
      setHasSubmodules(true)
    }
  }, [])

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Create new assessment succesfully',
      })
      refetchAssess()
      setCreateAssessDrawer(false)
      form.resetFields()
    }
    if (error) {
      notification.error({
        message: 'Create new Assessment failed',
      })
    }
    if (updatedData) {
      notification.success({
        message: 'Assessment updated successfully',
      })
      refetchAssess()
      setCreateAssessDrawer(false)
      form.resetFields()
    }
    if (updatedError) {
      notification.error({
        message: 'Unable to updated assessment',
      })
    }
  }, [data, error, updatedData, updatedError])

  const handleUpdate = e => {
    e.preventDefault()
    form.validateFields((errors, values) => {
      if (!errors && pk) {
        console.log(submodulesState)
        console.log(currentRow.submodules)
        let tempSubmodules = submodulesState.filter(item => {
          if (item.id) {
            console.log('in 1st')
            currentRow.submodules.map(async item2 => {
              if (item2.id === item.id && item2.name !== item.name) {
                try {
                  console.log(item.id, item.name, 'this is item')
                  updateSubmodule({
                    variables: {
                      pk: item.id,
                      name: item.name,
                    },
                  })
                } catch (e) {
                  notification.error({
                    message: 'Unable to update assess type',
                  })
                }
              }
            })
          } else {
            console.log('in 2nd')
            return true
          }

          console.log('im out')
          return false
        })
        if (!hasSubmodules && submodulesState.length > 0) {
          const removeIds = []
          submodulesState.map(item => (item.id ? removeIds.push(item.id) : null))
          removeSubmodules({
            variables: {
              pk,
              id: removeIds,
            },
          }).catch(err => console.error(err))
        }
        console.log(tempSubmodules, 'tempsubModules')
        updateGenAssess({
          variables: {
            pk,
            name: values.name,
            date: moment(values.date).format('YYYY-MM-DD'),
            hasSubmodule: hasSubmodules,
            submodules: tempSubmodules,
          },
        })
      }
    })
  }

  // console.log(currentRow, 'current row')

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((formError, values) => {
      if (!formError) {
        let tempSubmodules = submodulesState
        if (!hasSubmodules) {
          tempSubmodules = []
        }
        // console.log(values, hasSubmodules, tempSubmodules, 'in submitt')
        createGenAssess({
          variables: {
            name: values.name,
            date: moment(values.date).format('YYYY-MM-DD'),
            hasSubmodule: hasSubmodules,
            submodules: tempSubmodules,
          },
        })
      }
    })
  }

  return (
    <Form {...layout} onSubmit={update ? handleUpdate : handleSubmit}>
      <Form.Item label="Assessment Title">
        {form.getFieldDecorator('name', {
          initialValue: currentRow?.name,
          rules: [{ required: true, message: 'Please give the assessment title' }],
        })(<Input placeholder="Name" />)}
      </Form.Item>
      <Form.Item label="Date">
        {form.getFieldDecorator('date', {
          initialValue: moment(currentRow?.date),
          rules: [{ required: true, message: 'Please select a date' }],
        })(<DatePicker />)}
      </Form.Item>
      <Form.Item style={{ display: 'flex' }} label="Submodules">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Checkbox
            style={{ marginTop: 10 }}
            checked={hasSubmodules}
            onChange={e => setHasSubmodules(e.target.checked)}
          />
          {hasSubmodules && (
            <PlusOutlined
              style={{ fontSize: 22 }}
              onClick={() => {
                setSubmodulesCount(state => state + 1)
                submodulesDispatch({ type: 'ADD_SUBMODULE' })
              }}
            />
          )}
        </div>
      </Form.Item>
      <Form.Item {...tailLayout}>
        {hasSubmodules &&
          submodulesState &&
          times(n => {
            return (
              <SubmodulesForm
                key={n}
                state={submodulesState}
                index={n}
                currentRow={currentRow}
                setHasSubmodules={setHasSubmodules}
                dispatch={submodulesDispatch}
                setSubmodulesCount={setSubmodulesCount}
              />
            )
          }, submodulesCount)}
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          htmlType="submit"
          type="primary"
          style={SUBMITT_BUTTON}
          loading={loading || updatedLoading}
        >
          {update ? 'Update ' : 'Create '}
          Assessment
        </Button>
        <Button type="default" onClick={() => setCreateAssessDrawer(false)} style={CANCEL_BUTTON}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(CreateGenAssessForm)
