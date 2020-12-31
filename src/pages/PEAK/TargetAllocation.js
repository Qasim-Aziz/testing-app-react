/* eslint-disable no-lonely-if */
/* eslint-disable import/named */
import React, { useState, useEffect } from 'react'
import { Avatar, Form, Input, Select, Checkbox, Button, Typography, notification, Spin } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import CKEditor from 'react-ckeditor-component'
import moment from 'moment'
import motherAndSon from './motherSon.jpg'
import {
  TARGET_ALLOCATIONS_OPTIONS,
  SETTING,
  SHORT_TERM_GOALS,
  CREATE_TARGET,
  GET_TARGET_STEP,
  GET_TARGET_SD,
} from './query'
import NumberCard from './NumberCard'

const { Text } = Typography

const SdInput = ({ form }) => {
  const [sdText, setSdText] = useState('')
  const { data: sdData, error: sdError, loading: sdLoading } = useQuery(GET_TARGET_SD, {
    variables: {
      text: sdText,
    },
  })

  useEffect(() => {
    if (sdError) {
      notification.error({
        message: 'Failed to load sd list',
      })
    }
  }, [sdError])

  return (
    <>
      {(form.getFieldValue('steps') || !form.getFieldValue('steps')) && (
        <Form.Item label="Sd" name="Sd" style={{ marginTop: 15 }}>
          {form.getFieldDecorator('sd')(
            <Select
              mode="tags"
              allowClear
              size="large"
              notFoundContent={sdLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={v => {
                setSdText(v)
              }}
              loading={sdLoading}
              placeholder="Search for find more sd"
              disabled={form.getFieldValue('steps')?.length > 0}
            >
              {sdData?.targetSd.edges.map(({ node }) => {
                return (
                  <Select.Option key={node.id} value={node.sd}>
                    {node.sd}
                  </Select.Option>
                )
              })}
            </Select>,
          )}
        </Form.Item>
      )}
    </>
  )
}

export default Form.create()(
  ({ form, targetName, targetVideo, targetInstr, suggestTarget, setOpen }) => {
    const [targetInstructions, setTargetInstructions] = useState(targetInstr)
    const [dailyTrials, setDailyTrials] = useState(0)
    const [sessionConsecutiveDays, setSessionConsecutiveDays] = useState(0)
    const [peakBlockCount, setPeakBlockCount] = useState(1)
    const [makeDefault, setMakeDefault] = useState(false)
    const [stepText, setStepText] = useState('')
    const studentId = localStorage.getItem('studentId')

    const onChangeNumber = (type, num) => {
      if (type === 'sdt') setDailyTrials(num)
      else if (type === 'scd') setSessionConsecutiveDays(num)
      else if (type === 'spbc' && num > 0) setPeakBlockCount(num)
    }

    const { data: settingData, error: settingError } = useQuery(SETTING, {
      variables: {
        studentId,
      },
    })

    const { data: stepData, error: stepError, loading: stepLoading } = useQuery(GET_TARGET_STEP, {
      variables: {
        text: stepText,
      },
    })

    const { data: shortGoals, error: shortGoalsError, loading: shortGoalLoading } = useQuery(
      SHORT_TERM_GOALS,
      {
        variables: {
          studentId,
        },
      },
    )

    const {
      data: targetOptions,
      error: targetOptionsError,
      loading: targetOptionsLoading,
    } = useQuery(TARGET_ALLOCATIONS_OPTIONS)

    const [
      allocateTarget,
      { data: allocateTargetData, error: allocateTargetError, loading: allocateTargetLoading },
    ] = useMutation(CREATE_TARGET)

    useEffect(() => {
      if (stepError) {
        notification.error({
          message: 'Failed to load step list',
        })
      }
    }, [stepError])

    useEffect(() => {
      if (allocateTargetData) {
        notification.success({
          message: 'Target allocated sucessfully',
        })
        setOpen(null)
        form.resetFields()
      }
      if (allocateTargetError) {
        console.log(allocateTargetError)
        notification.error({
          message: 'Target allcation failed',
          description: allocateTargetError.message,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allocateTargetData, allocateTargetError])

    useEffect(() => {
      if (settingData && !sessionConsecutiveDays && !dailyTrials) {
        setSessionConsecutiveDays(
          settingData.getAllocateTargetSettings.edges[0]?.node.dailyTrials || 0,
        )
        setDailyTrials(settingData.getAllocateTargetSettings.edges[0]?.node.consecutiveDays || 0)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingData])

    function onEditorChange(evt) {
      console.log(evt.editor.getData())
      setTargetInstructions(evt.editor.getData())
    }

    const handleSubmit = e => {
      e.preventDefault()
      form.validateFields((error, values) => {
        if (!error) {
          if ((values.steps || values.sd) && targetInstructions) {
            allocateTarget({
              variables: {
                studentId,
                shortTerm: values.stg,
                targetId: suggestTarget,
                targetStatus: values.status,
                targetInstr: targetInstructions,
                date: moment().format('YYYY-MM-DD'),
                masteryCriteria: values.masteryCriteria,
                targetName: values.name,
                dailyTrials,
                consecutiveDays: sessionConsecutiveDays,
                targetType: values.type,
                sd: values.sd || [],
                steps: values.steps || [],
                video: values.video,
                default: makeDefault,
                peakBlocks: peakBlockCount,
              },
            })
          } else {
            if (!values.steps || !values.sd) {
              notification.info({
                message: 'Steps or sd one must need to provide',
              })
            }
            if (!targetInstructions) {
              notification.info({
                message: 'Target Instruction required',
              })
            }
          }
        }
      })
    }

    if (targetOptionsError || shortGoalsError || settingError) {
      return <h4 style={{ color: 'red', marginTop: 40 }}>Opps therir are something wrong</h4>
    }

    return (
      <div>
        <Avatar
          src={motherAndSon}
          style={{ width: 540, height: 120, marginBottom: 15 }}
          shape="square"
          size="large"
        />
        <Form name="basic" onSubmit={handleSubmit}>
          <Form.Item label="Target Name" name="Target Name">
            {form.getFieldDecorator('name', {
              initialValue: targetName,
              rules: [{ required: true, message: 'Please give a target name' }],
            })(<Input name="targetName" size="large" />)}
          </Form.Item>
          <Form.Item label="Target Type" name="Target Type" style={{ marginTop: 15 }}>
            {form.getFieldDecorator('type', {
              initialValue: 'VGFyZ2V0RGV0YWlsVHlwZTo4',
              rules: [{ required: true, message: 'Please select a target type' }],
            })(
              <Select size="large" name="targetType" disabled>
                <Select.Option value="VGFyZ2V0RGV0YWlsVHlwZTo4" key="VGFyZ2V0RGV0YWlsVHlwZTo4">
                  Peak
                </Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Mastery Criteria" name="masteryCriteria" style={{ marginTop: 15 }}>
            {form.getFieldDecorator('masteryCriteria', {
              initialValue:
                targetOptions &&
                settingData?.getAllocateTargetSettings.edges[0]?.node.masteryCriteria.id,
              rules: [{ required: true, message: 'Please select a target type' }],
            })(
              <Select size="large" name="masteryCriteria" loading={targetOptionsLoading}>
                {targetOptions?.masteryCriteria.map(({ id, name }) => {
                  return (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>

          <div style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 18, color: '#000' }}>Session</Text>
            <NumberCard
              title="Daily Trials"
              number={dailyTrials}
              form={form}
              maxValue={26}
              setNumber={num => onChangeNumber('sdt', num)}
              style={{
                marginLeft: 5,
                marginTop: 10,
              }}
            />
            <NumberCard
              title="Consecutive Days"
              number={sessionConsecutiveDays}
              form={form}
              setNumber={num => onChangeNumber('scd', num)}
              style={{
                marginLeft: 5,
                marginTop: 10,
              }}
            />
          </div>

          <div style={{ marginTop: 10, marginLeft: 5 }}>
            <NumberCard
              title="Peak Blocks"
              number={peakBlockCount}
              form={form}
              maxValue={10}
              minValue={1}
              setNumber={num => onChangeNumber('spbc', num)}
            />
          </div>

          <Form.Item label="Short Term Goal" style={{ marginTop: 15 }}>
            {form.getFieldDecorator('stg', {
              rules: [{ required: true, message: 'Please select a short term goal' }],
            })(
              <Select size="large" loading={shortGoalLoading}>
                {shortGoals?.shortTerm.edges.map(({ node }) => {
                  return (
                    <Select.Option key={node.id} value={node.id}>
                      {node.goalName}
                    </Select.Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Status" style={{ marginTop: 15 }}>
            {form.getFieldDecorator('status', {
              initialValue: settingData?.getAllocateTargetSettings.edges[0]?.node.status.id,
              rules: [{ required: true, message: 'Please select a target status' }],
            })(
              <Select size="large" loading={targetOptionsLoading}>
                {targetOptions?.targetStatus.map(({ id, statusName }) => {
                  return (
                    <Select.Option key={id} value={id}>
                      {statusName}
                    </Select.Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>

          {(form.getFieldValue('sd') || !form.getFieldValue('sd')) && (
            <Form.Item label="Steps" style={{ marginTop: 15 }}>
              {form.getFieldDecorator('steps')(
                <Select
                  mode="tags"
                  allowClear
                  size="large"
                  loading={stepLoading}
                  notFoundContent={stepLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={v => {
                    setStepText(v)
                  }}
                  placeholder="Search for find more steps"
                  disabled={form.getFieldValue('sd')?.length > 0}
                >
                  {stepData?.targetStep.edges.map(({ node }) => {
                    return (
                      <Select.Option key={node.id} value={node.step}>
                        {node.step}
                      </Select.Option>
                    )
                  })}
                </Select>,
              )}
            </Form.Item>
          )}

          <SdInput form={form} />

          <Form.Item
            label="Target Instructions"
            name="Target Instructions"
            style={{ marginTop: 15 }}
          >
            <CKEditor
              name="targetInstructions"
              activeClass="p10"
              content={targetInstructions}
              events={{
                change: onEditorChange,
              }}
            />
          </Form.Item>

          <Form.Item label="Target Video Link" name="Target Video" style={{ marginTop: 15 }}>
            {form.getFieldDecorator('video', {
              initialValue: targetVideo,
            })(<Input placeholder="Give the video url" size="large" />)}
          </Form.Item>

          <Form.Item style={{ marginTop: 15 }}>
            <Checkbox value={makeDefault} onChange={() => setMakeDefault(state => !state)}>
              Make values default
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                width: 150,
              }}
              loading={allocateTargetLoading}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  },
)
