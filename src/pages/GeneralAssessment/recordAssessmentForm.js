/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Select, notification, DatePicker } from 'antd'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import { GET_GENERAL_ASSESSMENT, RECORD_GENERAL_DATA, UPDATE_GENERAL_DATA } from './query'

const { TextArea } = Input
const { Option } = Select

function RecordAssessmentForm({
  form,
  setOpen,
  refetch,
  setUpdate,
  setCurrentRow,
  update,
  currentRow,
}) {
  const studentId = localStorage.getItem('studentId')
  const [assessments, setAssessments] = useState(null)
  const [currentAssessment, setCurrentAssessment] = useState(null)
  const [submodulesList, setSubmodulesList] = useState([])
  const [currentSubmodules, setCurrentSubmodules] = useState(null)
  const { data: assessmentsData, loading: assessmentsLoading, error: assessmentsError } = useQuery(
    GET_GENERAL_ASSESSMENT,
  )
  const [
    recordGeneralData,
    { data: recordedData, loading: recordedLoading, error: recordedError },
  ] = useMutation(RECORD_GENERAL_DATA)

  const [
    updateGeneralData,
    { data: updatedData, loading: updatedLoading, error: updatedError },
  ] = useMutation(UPDATE_GENERAL_DATA)

  useEffect(() => {
    if (assessmentsError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch general assessment data',
      })
    }
    if (assessmentsData) {
      const tempList = []
      assessmentsData.getGeneralAssessment.edges.map(item => {
        tempList.push(item.node)
      })

      if (tempList.length > 0) {
        setAssessments(tempList)
        setCurrentAssessment(update ? currentRow.module.id : tempList[0].id)
      }
    }
  }, [assessmentsData, assessmentsError])

  useEffect(() => {
    if (currentAssessment) {
      console.log(assessments, 'assesments')
      console.log(currentRow, 'current row')

      const tt = assessments.filter(item => item.id === currentAssessment)

      if (tt[0].hasSubmodule) {
        console.log(tt[0].submodules.edges, 'sbm')
        setSubmodulesList(tt[0].submodules.edges)
        setCurrentSubmodules(
          update && currentRow.module.id === currentAssessment
            ? currentRow.submodule.id
            : tt[0].submodules.edges[0].node.id,
        )
      } else {
        setSubmodulesList(null)
        setCurrentSubmodules(null)
      }
    }
  }, [currentAssessment])

  useEffect(() => {
    if (recordedData) {
      notification.success({
        message: 'Data recorded successfully',
      })
      refetch()
      setOpen(false)
    }
    if (recordedError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to record assessment data',
      })
    }
    if (updatedData) {
      notification.success({
        message: 'Data updated successfully',
      })
      refetch()
      setOpen(false)
    }
    if (updatedError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to update assessment data',
      })
    }
  }, [recordedData, recordedError, updatedData, updatedError])

  const handleSubmitt = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && currentAssessment) {
        console.log(studentId, currentAssessment, currentSubmodules, error, values)
        recordGeneralData({
          variables: {
            student: studentId,
            module: currentAssessment,
            submodule: currentSubmodules,
            score: parseInt(values.score),
            note: values.note,
          },
        })
      }
    })
  }

  const handleUpdate = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && currentRow.id && currentAssessment) {
        console.log(currentRow.id, currentAssessment, currentSubmodules, values)
        updateGeneralData({
          variables: {
            pk: currentRow.id,
            module: currentAssessment,
            submodule: currentSubmodules,
            score: parseInt(values.score),
            note: values.note,
          },
        })
      }
    })
  }

  console.log(submodulesList, 'subModeulsr')

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <Form onSubmit={update ? handleUpdate : handleSubmitt}>
        <Form.Item name="module" label="Assessment Module">
          <Select
            style={{ width: '100%' }}
            placeholder="Select a module"
            size="large"
            value={currentAssessment}
            onChange={e => setCurrentAssessment(e)}
            loading={assessmentsLoading}
          >
            {assessments &&
              assessments.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                )
              })}
          </Select>
        </Form.Item>
        <Form.Item name="submodule" label="Submodule">
          <Select
            style={{ width: '100%' }}
            placeholder="Select a submodule"
            size="large"
            disabled={!submodulesList}
            value={currentSubmodules}
            onChange={e => setCurrentSubmodules(e)}
            loading={assessmentsLoading}
          >
            {submodulesList &&
              submodulesList.map(item => {
                return (
                  <Option value={item.node.id} key={item.node.id}>
                    {item.node.name}
                  </Option>
                )
              })}
          </Select>
        </Form.Item>
        {update && currentRow ? (
          <>
            <Form.Item label="Score">
              {form.getFieldDecorator('score', {
                initialValue: currentRow.score,
                rules: [
                  {
                    required: true,
                    message: 'Enter score',
                  },
                ],
              })(<Input size="large" type="number" placeholder="Enter number" />)}
            </Form.Item>
            <Form.Item label="Note">
              {form.getFieldDecorator('note', {
                initialValue: currentRow.note,
              })(
                <TextArea
                  placeholder="Take a note"
                  style={{ resize: 'none', width: '100%', height: 120 }}
                />,
              )}
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label="Score">
              {form.getFieldDecorator('score', {
                rules: [
                  {
                    required: true,
                    message: 'Enter score',
                  },
                ],
              })(<Input size="large" type="number" placeholder="Enter number" />)}
            </Form.Item>
            <Form.Item label="Note">
              {form.getFieldDecorator('note')(
                <TextArea
                  placeholder="Take a note"
                  style={{ resize: 'none', width: '100%', height: 120 }}
                />,
              )}
            </Form.Item>
          </>
        )}
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          loading={recordedLoading || updatedLoading}
          style={{
            marginLeft: 'auto',
            marginRight: 10,
            marginTop: 15,
            width: '100%',
            backgroundColor: '#0B35B3',
            color: '#fff',
          }}
        >
          Submitt
        </Button>
      </Form>
    </div>
  )
}

export default Form.create()(RecordAssessmentForm)