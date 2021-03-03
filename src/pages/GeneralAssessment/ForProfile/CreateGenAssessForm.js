/* eslint-disable no-shadow */
/* eslint-disable  */
import React, { useEffect, useState, useReducer } from 'react'
import { Form, Input, DatePicker, Select, Button, notification, Radio, Checkbox } from 'antd'
import { useMutation } from 'react-apollo'
import { remove, times, update } from 'ramda'
import moment from 'moment'
import SubmodulesForm from './SubmodulesForm'
import {
  CREATE_GENERAL_ASSESSMENT,
  GET_GENERAL_ASSESSMENT,
  UPDATE_GENERAL_ASSESSMENT,
} from '../query'

const { TextArea } = Input
const { Option } = Select

const submodulesReducer = (state, action) => {
  switch (action.type) {
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
  const [pk, setPk] = useState(currentRow.id)
  const [submodulesState, submodulesDispatch] = useReducer(
    submodulesReducer,
    update && currentRow.submodules
      ? currentRow.submodules.length > 0
        ? currentRow.submodules.map(item => {
            return { name: item.name }
          })
        : [{ name: '' }]
      : [{ name: '' }],
  )

  const [createGenAssess, { data, error, loading }] = useMutation(
    CREATE_GENERAL_ASSESSMENT,
    //   , {
    //   update(cache, { data }) {
    //     const generalAssess = cache.readQuery({
    //       query: GET_GENERAL_ASSESSMENT,
    //     })

    //     // data = response of mutation query => need to be added in cache(generalAssess)
    //     // generalAssess = data response from GENERAL_ASSESSMENT query
    //     cache.writeQuery({
    //       query: GET_GENERAL_ASSESSMENT,
    //       data: {
    //         getGeneralAssessment: {
    //           edges: [
    //             ...generalAssess.getGeneralAssessment.edges,
    //             {
    //               node: data.createGeneralAssessment.details,
    //               __typename: 'GeneralAssessmentTypeEdge',
    //             },
    //           ],
    //           __typename: 'GeneralAssessmentTypeConnection',
    //         },
    //       },
    //     })
    //   },
    // }
  )

  const [
    updateGenAssess,
    { data: updatedData, loading: updatedLoading, error: updatedError },
  ] = useMutation(UPDATE_GENERAL_ASSESSMENT)

  useEffect(() => {
    console.log(update, currentRow.hasSubmodule)
    if (update && currentRow.hasSubmodule) {
      console.log(currentRow.hasSubmodule, 'useEffect')
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

  // useEffect(() => {
  //   form.setFieldsValue({
  //     date: moment(),
  //     category: 'Direct',
  //   })
  // }, [])

  const handleUpdate = e => {
    e.preventDefault()
    form.validateFields((errors, values) => {
      if (!errors && pk) {
        let tempSubmodules = submodulesState
        if (!hasSubmodules) {
          tempSubmodules = []
        }
        console.log(values, hasSubmodules, tempSubmodules, pk, 'update')
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

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((formError, values) => {
      if (!formError) {
        console.log(formError, values)
        console.log(hasSubmodules, submodulesState)
        createGenAssess({
          variables: {
            name: values.name,
            date: moment(values.date).format('YYYY-MM-DD'),
            hasSubmodule: hasSubmodules,
            submodules: submodulesState,
          },
        })
      }
    })
  }

  console.log(updatedError, updatedData, updatedLoading, 'updated response')
  // console.log(hasSubmodules)
  // console.log(update, currentRow, ' state ', submodulesState)
  // console.log(data, loading, error, update, currentRow, 'create')
  return (
    <Form onSubmit={update ? handleUpdate : handleSubmit}>
      <Form.Item label="Assessment Title">
        {form.getFieldDecorator('name', {
          initialValue: currentRow?.name,
          rules: [{ required: true, message: 'Please give the assessment title' }],
        })(<Input placeholder="Name" size="large" style={{ resize: 'none', width: '100%' }} />)}
      </Form.Item>
      <Form.Item label="Date">
        {form.getFieldDecorator('date', {
          initialValue: moment(currentRow?.date),
          rules: [{ required: true, message: 'Please select a date' }],
        })(
          <DatePicker
            size="large"
            style={{
              width: '100%',
            }}
          />,
        )}
      </Form.Item>
      <Form.Item style={{ display: 'flex' }} label="Submodules">
        <Checkbox
          size="large"
          value={hasSubmodules}
          style={{
            width: '100%',
          }}
          checked={hasSubmodules}
          onChange={e => setHasSubmodules(e.target.checked)}
        />
      </Form.Item>
      <Form.Item>
        {hasSubmodules &&
          submodulesState &&
          times(n => {
            return (
              <SubmodulesForm
                key={n}
                state={submodulesState}
                index={n}
                dispatch={submodulesDispatch}
                setSubmodulesCount={setSubmodulesCount}
              />
            )
          }, submodulesCount)}
      </Form.Item>

      <Button
        htmlType="submit"
        type="primary"
        size="large"
        style={{
          marginLeft: 'auto',
          marginRight: 10,
          marginTop: 15,
          width: '100%',
          backgroundColor: '#0B35B3',
          color: '#fff',
        }}
        loading={loading || updatedLoading}
      >
        {update ? 'Update ' : 'Create '}
        Assessment
      </Button>
    </Form>
  )
}

export default Form.create()(CreateGenAssessForm)
