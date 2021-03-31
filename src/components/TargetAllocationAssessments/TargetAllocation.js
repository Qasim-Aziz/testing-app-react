/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */

import { Button, Col, Divider, Form, Icon, Input, notification, Row, Select, Switch } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import CKEditor from 'react-ckeditor-component'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import NumberCard from './NumberCard'
import {
  CREATE_TARGET,
  DEFAULT_SHORT_TERM_GOALS,
  SETTING,
  SHORT_TERM_GOALS,
  TARGET_ALLOCATIONS_OPTIONS,
} from './query'
import './style.scss'

let id = 0
let stepId = 0
let classId = 0
const { Option } = Select
const { layout, tailLayout } = FORM

const searchableDropDownOption = {
  showSearch: true,
  optionFilterProp: 'children',
  filterOption: (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
}

export default Form.create()(
  ({
    form,
    targetName,
    targetVideo,
    targetInstr,
    selectedTargetId,
    peakEnable = false,
    equivalenceEnable = false,
    equivalenceObject,
    selectedTargetCategory,
  }) => {
    const [targetInstructions, setTargetInstructions] = useState(targetInstr)
    const [dailyTrials, setDailyTrials] = useState(0)
    const [sessionConsecutiveDays, setSessionConsecutiveDays] = useState(0)
    const [makeDefault, setMakeDefault] = useState(true)
    const studentId = localStorage.getItem('studentId')
    const [peakBlockCount, setPeakBlockCount] = useState(1)
    const [useDefaultGoal, setUseDefaultGoal] = useState(true)
    const [defaultShortTermGoalIdForABA, setDefaultShortTermGoalIdForABA] = useState()

    const onChangeNumber = (type, num) => {
      if (type === 'sdt') setDailyTrials(num)
      else if (type === 'scd') setSessionConsecutiveDays(num)
      else if (type === 'spbc' && num > 0) {
        setPeakBlockCount(num)
      }
    }

    const { data: settingData, error: settingError } = useQuery(SETTING, {
      variables: {
        studentId,
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

    const { data: defaultShortGoals } = useQuery(DEFAULT_SHORT_TERM_GOALS, {
      variables: {
        studentId,
      },
    })

    const {
      data: targetOptions,
      error: targetOptionsError,
      loading: targetOptionsLoading,
    } = useQuery(TARGET_ALLOCATIONS_OPTIONS)

    const [
      allocateTarget,
      { data: allocateTargetData, error: allocateTargetError, loading: allocateTargetLoading },
    ] = useMutation(CREATE_TARGET)

    const add = () => {
      // const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      })
    }

    const remove = k => {
      // const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      // We need at least one passenger
      if (keys.length === 0) {
        return
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      })
    }

    const addStep = () => {
      // const { form } = this.props;
      // can use data-binding to get
      const stepKeys = form.getFieldValue('stepKeys')
      const nextKeys = stepKeys.concat(stepId++)
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        stepKeys: nextKeys,
      })
    }

    const stepRemove = k => {
      // const { form } = this.props;
      // can use data-binding to get
      const stepKeys = form.getFieldValue('stepKeys')
      // We need at least one passenger
      if (stepKeys.length === 0) {
        return
      }

      // can use data-binding to set
      form.setFieldsValue({
        stepKeys: stepKeys.filter(key => key !== k),
      })
    }

    const classAdd = () => {
      // const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('Classkeys')
      const nextKeys = keys.concat(classId++)
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        Classkeys: nextKeys,
      })
    }

    const classRemove = k => {
      // const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('Classkeys')
      // We need at least one passenger
      if (keys.length === 0) {
        return
      }

      // can use data-binding to set
      form.setFieldsValue({
        Classkeys: keys.filter(key => key !== k),
      })
    }

    useEffect(() => {
      if (defaultShortGoals) {
        defaultShortGoals.shortTerm.edges.forEach(({ node }) => {
          if (node.longTerm.program.name === 'ABA') setDefaultShortTermGoalIdForABA(node.id)
        })
      }
    }, [defaultShortGoals])

    useEffect(() => {
      if (allocateTargetData?.createTargetAllocate2) {
        notification.success({
          message: 'Target allocated sucessfully',
        })
        // setOpen(null)
        form.resetFields()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allocateTargetData])

    if (allocateTargetError) {
      notification.error({
        message: 'Target allocation failed',
        // description: allocateTargetError?.message,
      })
    }

    useEffect(() => {
      if (settingData && !sessionConsecutiveDays && !dailyTrials) {
        setDailyTrials(settingData.getAllocateTargetSettings.edges[0]?.node.dailyTrials || 5)
        setSessionConsecutiveDays(
          settingData.getAllocateTargetSettings.edges[0]?.node.consecutiveDays || 25,
        )
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingData])

    function onEditorChange(evt) {
      console.log(evt.editor.getData())
      setTargetInstructions(evt.editor.getData())
    }

    const handleSubmit = e => {
      const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
      let selectedAlpha = ['A', 'B']

      if (equivalenceObject?.target?.maxSd) {
        selectedAlpha = []
      }
      for (let i = 0; i < equivalenceObject?.target?.maxSd; i++) {
        selectedAlpha.push(alphaList[i])
      }

      e.preventDefault()
      form.validateFields((error, values) => {
        const {
          keys,
          stimulus,
          stimulusMC,
          stimulusStatus,
          stepKeys,
          steps,
          stepStatus,
          stepMC,
          Classkeys,
        } = values
        // console.log(keys, stimulus, stimulusMC, stimulusStatus, stepKeys, steps, stepStatus, stepMC)

        const classes = []
        Classkeys.forEach((key, index) => {
          const sampleStimulus = []
          selectedAlpha.forEach((alpha, alphaIndex) => {
            sampleStimulus.push({ option: alpha, stimulusName: values[`stimulus${key}${alpha}`] })
          })
          classes.push({ name: `Class ${index + 1}`, stimuluses: sampleStimulus })
        })

        const stimulusResponse = []
        keys.forEach(key => {
          stimulusResponse.push({
            sd: stimulus[key],
            mastery: stimulusMC[key],
            status: stimulusStatus[key],
          })
        })

        const stepResponse = []
        stepKeys.forEach(key => {
          stepResponse.push({ step: steps[key], mastery: stepMC[key], status: stepStatus[key] })
        })

        if (!error) {
          // Other custom validations
          let validationMessage = null
          if (
            values.type === 'VGFyZ2V0RGV0YWlsVHlwZTo4' &&
            values.category === 'Equivalence' &&
            classes.length === 0
          ) {
            validationMessage = 'At least one classe required for type PEAK with Equivalence.'
          }

          if (
            values.type === 'VGFyZ2V0RGV0YWlsVHlwZTo4' &&
            stimulusResponse.length === 0 &&
            (values.category === 'Generalization' || values.category === 'Direct')
          ) {
            validationMessage =
              'At least one Stimulus required for type PEAK with Generalization/Direct.'
          }

          if (!targetInstructions) {
            validationMessage = 'Target Instruction is mandatory'
          }

          if (!useDefaultGoal && !values.stg) validationMessage = 'Select short term Goal.'

          if (validationMessage) {
            notification.info({ message: validationMessage })
          } else {
            try {
              allocateTarget({
                variables: {
                  studentId,
                  shortTerm: useDefaultGoal ? defaultShortTermGoalIdForABA : values.stg,
                  targetId: selectedTargetId,
                  targetStatus: values.status,
                  targetInstr: targetInstructions,
                  date: moment().format('YYYY-MM-DD'),
                  masteryCriteria: values.masteryCriteria,
                  targetName: values.name,
                  dailyTrials,
                  consecutiveDays: sessionConsecutiveDays,
                  targetType: values.type,
                  sd: stimulusResponse,
                  steps: stepResponse,
                  video: values.video,
                  default: makeDefault,
                  peakBlocks: peakBlockCount,
                  peakType: values.category ? values.category : null,
                  classes,
                  equiCode: values.equiCode ? values.equiCode : null,
                },
                errorPolicy: 'all',
                onError(err) {
                  console.log(err)
                },
              })
            } catch (ex) {
              console.log(ex)
            }
          }
        }
      })
    }

    if (targetOptionsError || settingError) {
      return <h4 style={{ color: 'red', marginTop: 40 }}>Opps therir are something wrong</h4>
    }

    const { getFieldDecorator, getFieldValue } = form
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')

    const formItemsForStimulus = keys.map((k, index) => (
      <Row key={k}>
        <Col span="11">
          <Form.Item required={false} key={`stimulus-${k}`} wrapperCol={{ md: 22 }}>
            {getFieldDecorator(`stimulus[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input Stimulus's name or delete this field.",
                },
              ],
            })(<Input placeholder="Stimulus name" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col span="6">
          <Form.Item required={false} key={`sdStatus-${k}`} wrapperCol={{ md: 22 }}>
            {getFieldDecorator(`stimulusStatus[${k}]`, {
              initialValue: form.getFieldValue('status'),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please Select Status or delete this field.',
                },
              ],
            })(
              <Select
                loading={targetOptionsLoading}
                style={{ width: '100%' }}
                {...searchableDropDownOption}
              >
                {targetOptions?.targetStatus.map(({ id, statusName }) => (
                  <Select.Option key={id} value={id}>
                    {statusName}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span="6">
          <Form.Item required={false} key={`sdMC-${k}`} wrapperCol={{ md: 22 }}>
            {getFieldDecorator(`stimulusMC[${k}]`, {
              initialValue: form.getFieldValue('masteryCriteria'),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please Select Criteria or delete this field.',
                },
              ],
            })(
              <Select
                placeholder="select criteria"
                loading={targetOptionsLoading}
                style={{ width: '100%' }}
                {...searchableDropDownOption}
              >
                {targetOptions?.masteryCriteria.map(({ id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        {keys.length > 0 && (
          <Col span="1">
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => remove(k)}
              style={{ marginTop: '15px' }}
            />
          </Col>
        )}
      </Row>
    ))

    getFieldDecorator('stepKeys', { initialValue: [] })
    const stepKeys = getFieldValue('stepKeys')
    const formItemsForSteps = stepKeys.map((k, index) => (
      <Row key={index}>
        <Col span="11">
          <Form.Item required={false} key={`step-${k}`} wrapperCol={{ md: 22 }}>
            {getFieldDecorator(`steps[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input Step's name or delete this field.",
                },
              ],
            })(<Input placeholder="Step name" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col span="6">
          <Form.Item required={false} key={`stepStatus-${k}`} wrapperCol={{ md: 22 }}>
            {getFieldDecorator(`stepStatus[${k}]`, {
              initialValue: form.getFieldValue('status'),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please Select Status or delete this field.',
                },
              ],
            })(
              <Select
                loading={targetOptionsLoading}
                style={{ width: '100%' }}
                {...searchableDropDownOption}
              >
                {targetOptions?.targetStatus.map(({ id, statusName }) => (
                  <Select.Option key={id} value={id}>
                    {statusName}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span="6">
          <Form.Item required={false} key={`stepMC-${k}`} wrapperCol={{ md: 22 }}>
            {getFieldDecorator(`stepMC[${k}]`, {
              initialValue: form.getFieldValue('masteryCriteria'),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please Select Criteria or delete this field.',
                },
              ],
            })(
              <Select
                placeholder="select criteria"
                loading={targetOptionsLoading}
                style={{ width: '100%' }}
                {...searchableDropDownOption}
              >
                {targetOptions?.masteryCriteria.map(({ id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        {stepKeys.length > 0 && (
          <Col span="1">
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => stepRemove(k)}
              style={{ marginTop: '15px' }}
            />
          </Col>
        )}
      </Row>
    ))

    // start of equivalence class code

    // const [equivalenceCode, setEquivalenceCode] = useState('')

    const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    let selectedAlpha = ['A', 'B']
    const initialKeyValue = []

    console.log('Session Details --------->', equivalenceObject)
    // if(equivalenceObject) setEquivalenceCode(equivalenceObject?.code)

    if (equivalenceObject?.target?.maxSd) {
      selectedAlpha = []
    }
    for (let i = 0; i < equivalenceObject?.target?.maxSd; i++) {
      selectedAlpha.push(alphaList[i])
    }

    if (equivalenceObject?.classes?.edges.length > 0) {
      classId = equivalenceObject?.classes?.edges.length
      equivalenceObject?.classes?.edges.forEach((item, index) => {
        initialKeyValue.push(index)
      })
    }

    getFieldDecorator('Classkeys', { initialValue: initialKeyValue })
    const classKeys = getFieldValue('Classkeys')
    const classFormItems = classKeys.map((k, index) => (
      <>
        <Form.Item
          label={
            <>
              <span>Class {index + 1}</span>
              <span style={{ float: 'right', right: 0 }}>
                {classKeys.length > 0 ? (
                  <Icon
                    style={{ marginRight: 10 }}
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => classRemove(k)}
                  />
                ) : null}
              </span>
            </>
          }
          key={k}
          style={{ marginTop: 0, marginBottom: 0 }}
        >
          {selectedAlpha.map((alpha, alphaIndex) => (
            <Form.Item
              required={false}
              key={'stimulus' + k + alpha}
              style={{ display: 'inline-block', width: 'calc(100% - 12px)' }}
            >
              {getFieldDecorator(`stimulus${k}${alpha}`, {
                initialValue:
                  equivalenceObject?.classes?.edges[k]?.node.stimuluses.edges[alphaIndex]?.node
                    .stimulusName,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input Stimulus's name or delete this field.",
                  },
                ],
              })(<Input placeholder={`Stimulus ${alpha}`} />)}
            </Form.Item>
          ))}
        </Form.Item>
      </>
    ))

    // end of equivalence class code

    return (
      <div className="targetAllocationForm">
        <Form {...layout} onSubmit={handleSubmit}>
          <Divider orientation="left">Basic Details</Divider>
          <Form.Item label="Allocate target directly">
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={useDefaultGoal}
              onChange={setUseDefaultGoal}
            />
          </Form.Item>
          <Form.Item label="Short Term Goal">
            {form.getFieldDecorator('stg')(
              <Select
                loading={shortGoalLoading}
                disabled={useDefaultGoal}
                {...searchableDropDownOption}
              >
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
          <Form.Item label="Target Name" name="Target Name">
            {form.getFieldDecorator('name', {
              initialValue: targetName,
              rules: [{ required: true, message: 'Please give a target name' }],
            })(<Input name="targetName" />)}
          </Form.Item>
          {peakEnable ? (
            <Form.Item label="Target Type" name="Target Type">
              {form.getFieldDecorator('type', {
                initialValue: 'VGFyZ2V0RGV0YWlsVHlwZTo4',
                rules: [{ required: true, message: 'Please select a target type' }],
              })(
                <Select name="targetType" disabled {...searchableDropDownOption}>
                  <Select.Option value="VGFyZ2V0RGV0YWlsVHlwZTo4" key="VGFyZ2V0RGV0YWlsVHlwZTo4">
                    Peak
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>
          ) : (
            <Form.Item label="Target Type" name="Target Type">
              {form.getFieldDecorator('type', {
                initialValue:
                  targetOptions &&
                  settingData?.getAllocateTargetSettings.edges[0]?.node.targetType.id,
                rules: [{ required: true, message: 'Please select a target type' }],
              })(
                <Select name="targetType" {...searchableDropDownOption}>
                  {targetOptions?.types.map(({ id, typeTar }) => {
                    return (
                      <Select.Option key={id} value={id}>
                        {typeTar}
                      </Select.Option>
                    )
                  })}
                </Select>,
              )}
            </Form.Item>
          )}
          <Form.Item label="Mastery Criteria" name="masteryCriteria">
            {form.getFieldDecorator('masteryCriteria', {
              initialValue:
                targetOptions &&
                settingData?.getAllocateTargetSettings.edges[0]?.node.masteryCriteria.id,
              rules: [{ required: true, message: 'Please select a Mastery Criteria' }],
            })(
              <Select
                name="masteryCriteria"
                loading={targetOptionsLoading}
                {...searchableDropDownOption}
              >
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
          <Form.Item
            label={
              <>
                <span style={{ color: 'red', fontSize: 10 }}>*</span>
                <span>Daily Trials</span>
              </>
            }
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            <NumberCard
              // title="Daily Trials"
              number={dailyTrials}
              form={form}
              maxValue={26}
              setNumber={num => onChangeNumber('sdt', num)}
              style={{ float: 'left' }}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <span style={{ color: 'red', fontSize: 10 }}>*</span>
                <span>Consecutive Days</span>
              </>
            }
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            <NumberCard
              // title="Consecutive Days"
              number={sessionConsecutiveDays}
              form={form}
              setNumber={num => onChangeNumber('scd', num)}
              style={{ float: 'left' }}
            />
          </Form.Item>
          <div
            style={
              form.getFieldValue('type') === 'VGFyZ2V0RGV0YWlsVHlwZTo4'
                ? {
                    display: 'block',
                    // marginTop: 10,
                    marginLeft: 5,
                  }
                : { display: 'none' }
            }
          >
            <Form.Item
              label={
                <>
                  <span style={{ color: 'red', fontSize: 10 }}>*</span>
                  <span>Peak Blocks</span>
                </>
              }
            >
              <NumberCard
                // title="Peak Blocks"
                number={peakBlockCount}
                maxValue={10}
                setNumber={num => onChangeNumber('spbc', num)}
                minValue={1}
                style={{ float: 'left' }}
              />
            </Form.Item>

            {equivalenceEnable ? (
              <Form.Item label="Category">
                {form.getFieldDecorator('category', {
                  initialValue: 'Equivalence',
                  rules: [{ required: true, message: 'Please select a category' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    disabled
                    placeholder="Select a category"
                    {...searchableDropDownOption}
                  >
                    <Option key="4" value="Equivalence">
                      Equivalence
                    </Option>
                  </Select>,
                )}
              </Form.Item>
            ) : (
              <Form.Item label="Category">
                {form.getFieldDecorator('category', {
                  initialValue: selectedTargetCategory
                    ? selectedTargetCategory.charAt(0).toUpperCase() +
                      selectedTargetCategory.slice(1).toLowerCase()
                    : 'Direct',
                  rules: [{ required: true, message: 'Please select a category' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select a category"
                    {...searchableDropDownOption}
                  >
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
            )}
          </div>
          <Form.Item label="Status">
            {form.getFieldDecorator('status', {
              initialValue: settingData?.getAllocateTargetSettings.edges[0]?.node.status.id,
              rules: [{ required: true, message: 'Please select a target status' }],
            })(
              <Select loading={targetOptionsLoading} {...searchableDropDownOption}>
                {targetOptions?.targetStatus.map(({ id, statusName }) => (
                  <Select.Option key={id} value={id}>
                    {statusName}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          {equivalenceEnable || form.getFieldValue('category') === 'Equivalence' ? (
            <>
              {classFormItems}
              <Form.Item label="Add Classes">
                <Button type="dashed" onClick={() => classAdd()} style={{ width: '100%' }}>
                  <Icon type="plus" /> Add Class
                </Button>
              </Form.Item>

              <Form.Item label="Equivalence Code">
                {form.getFieldDecorator('equiCode', {
                  initialValue: equivalenceObject?.code,
                })(<Input disabled={equivalenceObject?.code} />)}
              </Form.Item>
            </>
          ) : (
            <>
              <Divider orientation="left">Stimulus</Divider>
              {formItemsForStimulus}
              {form.getFieldValue('stepKeys')?.length > 0 ? (
                <Form.Item style={{ textAlign: 'center' }} wrapperCol={{ sm: 24, md: 24 }}>
                  <Button type="dashed" disabled style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
              ) : (
                <Form.Item style={{ textAlign: 'center' }} wrapperCol={{ sm: 24, md: 24 }}>
                  <Button type="dashed" onClick={add} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
              )}

              <Divider orientation="left">Steps</Divider>
              {formItemsForSteps}
              {form.getFieldValue('keys')?.length > 0 ? (
                <Form.Item style={{ textAlign: 'center' }} wrapperCol={{ sm: 24, md: 24 }}>
                  <Button type="dashed" disabled style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
              ) : (
                <Form.Item style={{ textAlign: 'center' }} wrapperCol={{ sm: 24, md: 24 }}>
                  <Button type="dashed" onClick={addStep} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
              )}
            </>
          )}
          <Divider orientation="left">Misc</Divider>
          <Form.Item label="Target Instructions" name="Target Instructions">
            <CKEditor
              name="targetInstructions"
              activeClass="p10"
              content={targetInstructions}
              events={{
                change: onEditorChange,
              }}
            />
          </Form.Item>
          <Form.Item label="Target Video Link">
            {form.getFieldDecorator('video', {
              initialValue: targetVideo,
            })(<Input placeholder="Give the video url" />)}
          </Form.Item>
          <Form.Item label="Make values default">
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={makeDefault}
              onChange={setMakeDefault}
            />
          </Form.Item>
          <Form.Item {...tailLayout} style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              style={SUBMITT_BUTTON}
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
