/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Select, notification, DatePicker } from 'antd'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import { GET_GENERAL_ASSESSMENT, RECORD_GENERAL_DATA, UPDATE_GENERAL_DATA } from './query'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'

const { TextArea } = Input
const { Option } = Select
const { layout, tailLayout } = FORM
const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

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
  const [recordDate, setRecordDate] = useState(moment())
  const [assessments, setAssessments] = useState(null)
  const [currentAssessment, setCurrentAssessment] = useState(null)
  const [submodulesList, setSubmodulesList] = useState([])
  const [currentSubmodules, setCurrentSubmodules] = useState(null)
  const { data: assessmentsData, loading: assessmentsLoading, error: assessmentsError } = useQuery(
    GET_GENERAL_ASSESSMENT,
  )

  console.log(update, currentRow)
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

      console.log(tt, 'this is tt')
      if (tt[0].hasSubmodule) {
        setCurrentSubmodules(
          update && currentRow.module.id === currentAssessment
            ? currentRow.submodules
            : tt[0].submodules.edges.map(item => ({ name: item.node.name, id: item.node.id })),
        )
      } else {
        setSubmodulesList(null)
        setCurrentSubmodules(null)
      }
    }
  }, [currentAssessment])

  const handleSubmitt = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && currentAssessment) {
        console.log(currentAssessment, currentSubmodules, values)
        const subModulesRes = []
        const moduleRes = [{ module: currentAssessment, score: parseInt(values.score) }]
        currentSubmodules.forEach(item => {
          subModulesRes.push({ submodule: item.id, score: parseInt(values[item.id]) })
        })
        console.log(subModulesRes, moduleRes, recordDate)
        recordGeneralData({
          variables: {
            student: studentId,
            date: '2021-04-14',
            modules: moduleRes,
            submodules: subModulesRes,
            note: values.note,
          },
        })
          .then(res => {
            notification.success({
              message: 'Data recorded successfully',
            })
            refetch()
            setOpen(false)
          })
          .catch(err => console.log(err))
      }
    })
  }

  const handleUpdate = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && currentRow.id && currentAssessment) {
        let moduleRes = [{ module: currentAssessment, score: parseInt(values.score) }]
        const subModulesRes = []
        if (currentAssessment === currentRow.module.id) {
          moduleRes = [
            { pk: currentRow.module.pk, module: currentAssessment, score: parseInt(values.score) },
          ]
          currentSubmodules.map(item => {
            console.log(item, 'item 1')
            subModulesRes.push({
              pk: item.pk,
              submodule: item.id,
              score: parseInt(values[item.id]),
            })
          })
        } else {
          currentSubmodules.map(item => {
            console.log(item, 'item 2')
            subModulesRes.push({ submodule: item.id, score: parseInt(values[item.id]) })
          })
        }
        console.log(moduleRes, subModulesRes, 'bye')

        updateGeneralData({
          variables: {
            clearAll: currentAssessment === currentRow.module.id ? false : true,
            pk: currentRow.id,
            date: recordDate.format('YYYY-MM-DD'),
            modules: moduleRes,
            submodules: subModulesRes,
            note: values.note,
          },
        })
          .then(res => {
            notification.success({
              message: 'Data updated successfully',
            })
            refetch()
            setOpen(false)
          })
          .catch(err => {
            notification.error({
              message: 'Something went wrong',
              description: 'Unable to update assessment data',
            })
          })
      }
    })
  }

  const subLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  }
  const modLayout = {
    wrapperCol: {
      offset: 6,
      span: 18,
    },
  }

  if (assessmentsLoading) {
    return <LoadingComponent />
  }

  return (
    <div>
      <Form {...subLayout} onSubmit={update ? handleUpdate : handleSubmitt}>
        <Form.Item name="module" label="Date">
          <DatePicker value={recordDate} onChange={setRecordDate} />
        </Form.Item>
        <Form.Item name="module" label="Assessment Module">
          <Select
            style={{ width: '100%' }}
            placeholder="Select a module"
            showSearch
            optionFilterProp="name"
            value={currentAssessment}
            onChange={e => setCurrentAssessment(e)}
            loading={assessmentsLoading}
          >
            {assessments &&
              assessments.map(item => {
                return (
                  <Option value={item.id} name={item.name} key={item.id}>
                    {item.name}
                  </Option>
                )
              })}
          </Select>
        </Form.Item>
        <Form.Item name="module" label="Module - T score">
          {form.getFieldDecorator('score', {
            initialValue:
              update && currentRow.module.id === currentAssessment ? currentRow.module.score : null,
            rules: [{ required: true, message: 'Enter score' }],
          })(<Input type="number" placeholder="Enter number" />)}
        </Form.Item>

        {currentSubmodules &&
          currentSubmodules.map((item, index) => {
            return (
              <Form.Item key={item.id} label={`${item.name} - T Score`}>
                {form.getFieldDecorator(`${item.id}`, {
                  initialValue: update ? item.score : null,
                  rules: [{ required: true, message: 'Enter score' }],
                })(<Input type="number" placeholder="Enter number" />)}
              </Form.Item>
            )
          })}

        <Form.Item label="Note">
          {form.getFieldDecorator('note', {
            initialValue: update ? currentRow.note : null,
          })(
            <TextArea
              placeholder="Take a note"
              style={{ resize: 'none', width: '100%', height: 120 }}
            />,
          )}
        </Form.Item>

        <Form.Item {...modLayout}>
          <Button
            htmlType="submit"
            loading={recordedLoading || updatedLoading}
            style={SUBMITT_BUTTON}
          >
            Submit
          </Button>
          <Button type="default" onClick={() => setOpen(false)} style={CANCEL_BUTTON}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Form.create()(RecordAssessmentForm)
