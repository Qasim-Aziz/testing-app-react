/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Form, Input, DatePicker, Select, Button, notification } from 'antd'
import './form.scss'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { TextArea } = Input
const { Option } = Select
const { layout, tailLayout } = FORM

const CREATE_PEAK = gql`
  mutation($studentId: ID!, $title: String!, $category: String!, $note: String, $date: Date!) {
    peakCreateProgram(
      input: { student: $studentId, title: $title, category: $category, notes: $note, date: $date }
    ) {
      details {
        id
        title
        category
        notes
        date
        status
        submitpeakresponsesSet {
          total
          totalAttended
        }
      }
    }
  }
`

const CreateAssignmentForm = ({ form, setOpen, PEAK_PROGRAMS }) => {
  const studentId = localStorage.getItem('studentId')
  const [createPeak, { data, error, loading }] = useMutation(CREATE_PEAK, {
    update(cache, { data }) {
      console.log(cache, 'cache')
      console.log(data, 'data')
      const peakPrograms = cache.readQuery({
        query: PEAK_PROGRAMS,
        variables: {
          studentId,
        },
      })
      console.log('cache', peakPrograms)
      cache.writeQuery({
        query: PEAK_PROGRAMS,
        variables: {
          studentId,
        },
        data: {
          peakPrograms: {
            edges: [
              {
                node: data.peakCreateProgram.details, // above data
                __typename: 'PeakProgramTypeEdge',
              },
              ...peakPrograms.peakPrograms.edges,
            ],
            __typename: 'PeakProgramTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Create new Assessment succesfully',
      })
      setOpen(false)
      form.resetFields()
    }
    if (error) {
      notification.error({
        message: 'Create new Assessment failed',
      })
    }
  }, [data, error])

  useEffect(() => {
    form.setFieldsValue({
      date: moment(),
      category: 'Direct',
    })
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((formError, values) => {
      if (!formError) {
        createPeak({
          variables: {
            studentId,
            title: values.title,
            category: values.category,
            note: values.note,
            date: moment(values.date).format('YYYY-MM-DD'),
          },
        })
      }
    })
  }

  return (
    <Form {...layout} onSubmit={handleSubmit}>
      <Form.Item label="Program Title">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: 'Please give the program title' }],
        })(<Input placeholder="Type the program title" />)}
      </Form.Item>
      <Form.Item label="Date">
        {form.getFieldDecorator('date', {
          rules: [{ required: true, message: 'Please select a date' }],
        })(<DatePicker />)}
      </Form.Item>
      <Form.Item label="Category">
        {form.getFieldDecorator('category', {
          rules: [{ required: true, message: 'Please select a category' }],
        })(
          <Select placeholder="Select a category">
            <Option key="1" value="Direct">
              Direct
            </Option>
            <Option key="2" value="Generalization">
              Generalization
            </Option>
            <Option key="3" value="Transformation">
              Transformation
            </Option>
            <Option key="4" value="Equivalence">
              Equivalence
            </Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Note">
        {form.getFieldDecorator('note')(
          <TextArea
            placeholder="Take a note"
            style={{ resize: 'none', width: '100%', height: 120 }}
          />,
        )}
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button htmlType="submit" type="primary" style={SUBMITT_BUTTON} loading={loading}>
          Create program
        </Button>
        <Button style={CANCEL_BUTTON} onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(CreateAssignmentForm)
