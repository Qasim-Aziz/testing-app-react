/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */

import { Button, Col, Form, Icon, Input, notification, Row, Select, Divider, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import CKEditor from 'react-ckeditor-component'
import { capitalize } from '../../utilities'
import NumberCard from './NumberCard'
import { TARGET_ALLOCATIONS_OPTIONS, UPDATE_TARGET, SHORT_TERM_GOALS, GET_DOMAINS } from './query'

let id = 0
let stepId = 0
let classId = 0
const { Option } = Select

const searchableDropDownOption = {
  showSearch: true,
  optionFilterProp: 'children',
  filterOption: (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
}

export default Form.create()(
  ({
    form,
    onSuccessTargetAllocation,
    activeAllocatedTarget,
    isDirectGoal,
    defaultShortTermGoalForSelectedProgram,
    selectedShortTermGoal,
    equivalenceEnable = false,
  }) => {
    const [targetInstructions, setTargetInstructions] = useState('')
    const [dailyTrials, setDailyTrials] = useState(0)
    const [sessionConsecutiveDays, setSessionConsecutiveDays] = useState(0)
    const [makeDefault, setMakeDefault] = useState(false)
    const studentId = localStorage.getItem('studentId')
    const [peakBlockCount, setPeakBlockCount] = useState(1)
    const [selectedSd, setSelectedSd] = useState([])
    const [selectedStep, setSelectedSteps] = useState([])
    const [selectedSdList, setSelectedSdList] = useState([])
    const [selectedSdMC, setSelectedSdMC] = useState([])
    const [selectedSdStatus, setSelectedSdStatus] = useState([])
    const [selectedStepList, setSelectedStepList] = useState([])
    const [selectedStepMC, setSelectedStepMC] = useState([])
    const [selectedStepStatus, setSelectedStepStatus] = useState([])
    const [useDefaultGoal, setUseDefaultGoal] = useState(isDirectGoal)

    useEffect(() => {
      if (activeAllocatedTarget) {
        const { targetInstr, peakBlocks } = activeAllocatedTarget
        const { consecutiveDays, DailyTrials } = activeAllocatedTarget.targetAllcatedDetails
        setDailyTrials(DailyTrials)
        setSessionConsecutiveDays(consecutiveDays)
        setTargetInstructions(targetInstr)
        if (peakBlocks) setPeakBlockCount(peakBlocks)
        else setPeakBlockCount(1)

        const selectedSdList = []
        const selectedSdMC = []
        const selectedSdStatus = []
        const selectedSdIndex = []
        const selectedStepList = []
        const selectedStepMC = []
        const selectedStepStatus = []
        const selectedStepIndex = []

        if (activeAllocatedTarget.mastery.edges.length > 0) {
          activeAllocatedTarget.mastery.edges.forEach(item => {
            if (item.node.sd) {
              selectedSdList.push(item.node.sd.sd)
              selectedSdMC.push(item.node.mastery.id)
              selectedSdStatus.push(item.node.status.id)
            }
            if (item.node.step) {
              selectedStepList.push(item.node.step.step)
              selectedStepMC.push(item.node.mastery.id)
              selectedStepStatus.push(item.node.status.id)
            }
          })
        }

        if (selectedSdList.length > 0) {
          selectedSdList.forEach((item, index) => {
            selectedSdIndex.push(index)
          })
        }
        if (selectedStepList.length > 0) {
          selectedStepList.forEach((item, index) => {
            selectedStepIndex.push(index)
          })
        }

        setSelectedSd(selectedSdIndex)
        setSelectedSteps(selectedStepIndex)

        setSelectedSdList(selectedSdList)
        setSelectedSdMC(selectedSdMC)
        setSelectedSdStatus(selectedSdStatus)
        setSelectedStepList(selectedStepList)
        setSelectedStepMC(selectedStepMC)
        setSelectedStepStatus(selectedStepStatus)

        id = selectedSdList.length
        stepId = selectedStepList.length
        classId = activeAllocatedTarget.classes.edges.length
      }
    }, [activeAllocatedTarget])

    const onChangeNumber = (type, num) => {
      if (type === 'sdt') setDailyTrials(num)
      else if (type === 'scd') setSessionConsecutiveDays(num)
      else if (type === 'spbc' && num > 0) {
        setPeakBlockCount(num)
      }
    }

    const {
      data: targetOptions,
      error: targetOptionsError,
      loading: targetOptionsLoading,
    } = useQuery(TARGET_ALLOCATIONS_OPTIONS)

    const { data: domainData, error: domainError, loading: isDomainLoading } = useQuery(GET_DOMAINS)

    const [
      updateTarget,
      { data: updateTargetData, error: updateTargetError, loading: updateTargetLoading },
    ] = useMutation(UPDATE_TARGET)

    const { data: shortGoals, error: shortGoalsError, loading: shortGoalLoading } = useQuery(
      SHORT_TERM_GOALS,
      {
        variables: {
          studentId,
        },
      },
    )

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
      if (shortGoalsError) {
        notification.error({
          message: 'Failed to Short term Goal list',
        })
      }
    }, [shortGoalsError])

    useEffect(() => {
      if (updateTargetData?.updateTargetAllocate2) {
        notification.success({
          message: 'Target Update sucessfully',
        })
        // setOpen(null)
        form.resetFields()
        onSuccessTargetAllocation({
          data: updateTargetData,
          isDirectGoalOriginally: isDirectGoal,
          isDirectGoalAfterUpdate: useDefaultGoal,
          isCreatedNew: false,
        })
      }
      if (updateTargetError) {
        notification.error({
          message: 'Target allocation failed',
          description: updateTargetError.message,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateTargetData, updateTargetError])

    function onEditorChange(evt) {
      setTargetInstructions(evt.editor.getData())
    }

    const handleSubmit = e => {
      e.preventDefault()

      const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      let selectedAlpha = ['A', 'B']

      if (activeAllocatedTarget?.targetId?.maxSd) {
        selectedAlpha = []
      }
      for (let i = 0; i < activeAllocatedTarget?.targetId?.maxSd; i++) {
        selectedAlpha.push(alphaList[i])
      }

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
        const stepResponse = []
        keys.forEach(id => {
          stimulusResponse.push({
            sd: stimulus[id],
            mastery: stimulusMC[id],
            status: stimulusStatus[id],
          })
        })
        stepKeys.forEach(id => {
          stepResponse.push({ step: steps[id], mastery: stepMC[id], status: stepStatus[id] })
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
            updateTarget({
              variables: {
                studentId,
                shortTerm: useDefaultGoal
                  ? defaultShortTermGoalForSelectedProgram.node.id
                  : values.stg,
                targetAllocatedId: activeAllocatedTarget.id,
                targetStatus: values.status,
                targetInstr: targetInstructions,
                masteryCriteria: values.masteryCriteria,
                targetName: values.name,
                dailyTrials,
                consecutiveDays: sessionConsecutiveDays,
                targetType: values.type,
                sd: stimulusResponse,
                steps: stepResponse,
                video: values.video,
                peakBlocks: peakBlockCount,
                peakType: values.category ? values.category : null,
                classes,
                domain: values.domain,
              },
              errorPolicy: 'all',
              fetchPolicy: 'no-cache',
            })
          }
        }
      })
    }

    if (targetOptionsError || domainError) {
      return <h4 style={{ color: 'red', marginTop: 40 }}>Opps therir are something wrong</h4>
    }

    const { getFieldDecorator, getFieldValue } = form
    getFieldDecorator('keys', { initialValue: selectedSd })
    const keys = getFieldValue('keys')
    const formItemsForStimulus = keys.map((k, index) => (
      <Row key={k}>
        <Col span="11">
          <Form.Item required={false} key={`stimulus-${k}`} wrapperCol={{ md: 22 }}>
            {getFieldDecorator(`stimulus[${k}]`, {
              initialValue: selectedSdList[k],
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
              initialValue: selectedSdStatus[k],
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
              initialValue: selectedSdMC[k],
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

    getFieldDecorator('stepKeys', { initialValue: selectedStep })
    const stepKeys = getFieldValue('stepKeys')
    const formItemsForSteps = stepKeys.map((k, index) => (
      <Row key={index}>
        <Col span="11">
          <Form.Item required={false} key={`step-${k}`} wrapperCol={{ md: 22 }}>
            {getFieldDecorator(`steps[${k}]`, {
              initialValue: selectedStepList[k],
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
              initialValue: selectedStepStatus[k],
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
              initialValue: selectedStepMC[k],
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

    const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    let selectedAlpha = ['A', 'B']
    const initialKeyValue = []

    // console.log('Session Details --------->', equivalenceObject)

    if (activeAllocatedTarget?.targetId?.maxSd) {
      selectedAlpha = []
    }
    for (let i = 0; i < activeAllocatedTarget?.targetId?.maxSd; i++) {
      selectedAlpha.push(alphaList[i])
    }

    if (activeAllocatedTarget?.classes?.edges.length > 0) {
      classId = activeAllocatedTarget?.classes?.edges.length
      activeAllocatedTarget?.classes?.edges.forEach((item, index) => {
        initialKeyValue.push(index)
      })
    }

    getFieldDecorator('Classkeys', { initialValue: initialKeyValue })
    const classKeys = getFieldValue('Classkeys')
    const formItemsForClasses = classKeys.map((k, index) => (
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
                  activeAllocatedTarget?.classes?.edges[k]?.node.stimuluses.edges[alphaIndex]?.node
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
      <div className="targetAllocationFormForAddOrEdit">
        <Form onSubmit={handleSubmit} labelCol={{ sm: 24, md: 6 }} wrapperCol={{ sm: 24, md: 18 }}>
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
            {form.getFieldDecorator('stg', {
              initialValue: !isDirectGoal && selectedShortTermGoal?.node.id,
            })(
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
              initialValue:
                activeAllocatedTarget && activeAllocatedTarget.targetAllcatedDetails.targetName,
              rules: [{ required: true, message: 'Please give a target name' }],
            })(<Input name="targetName" />)}
          </Form.Item>
          <Form.Item label="Domain Name" name="Domain Name">
            {form.getFieldDecorator('domain', {
              initialValue: activeAllocatedTarget && activeAllocatedTarget?.targetId ? activeAllocatedTarget.targetId?.domain?.id : activeAllocatedTarget?.manualAllocateDomain?.id,
              rules: [{ required: true, message: 'Please select a domain' }],
            })(
              <Select name="domain" {...searchableDropDownOption} loading={isDomainLoading}>
                {domainData?.domain.edges.map(({ node }) => (
                  <Select.Option key={node.id} value={node.id}>
                    {node.domain}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Target Type">
            {form.getFieldDecorator('type', {
              initialValue:
                activeAllocatedTarget && activeAllocatedTarget.targetAllcatedDetails.targetType.id,
              rules: [{ required: true, message: 'Please select a target type' }],
            })(
              <Select {...searchableDropDownOption}>
                {targetOptions?.types.map(({ id, typeTar }) => (
                  <Select.Option key={id} value={id}>
                    {typeTar}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Mastery Criteria" name="masteryCriteria">
            {form.getFieldDecorator('masteryCriteria', {
              initialValue: activeAllocatedTarget && activeAllocatedTarget.masteryCriteria.id,
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
              style={{ marginTop: 0, marginBottom: 0 }}
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

            <Form.Item label="Category">
              {form.getFieldDecorator('category', {
                initialValue: activeAllocatedTarget && capitalize(activeAllocatedTarget.peakType),
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
          </div>

          <Form.Item label="Status">
            {form.getFieldDecorator('status', {
              initialValue: activeAllocatedTarget && activeAllocatedTarget.targetStatus.id,
              rules: [{ required: true, message: 'Please select a target status' }],
            })(
              <Select loading={targetOptionsLoading} {...searchableDropDownOption}>
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

          {equivalenceEnable || form.getFieldValue('category') === 'Equivalence' ? (
            <>
              {formItemsForClasses}
              <Form.Item label="Add Classes">
                <Button type="dashed" onClick={() => classAdd()} style={{ width: '100%' }}>
                  <Icon type="plus" /> Add Class
                </Button>
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

              <div
                style={
                  form.getFieldValue('type') !== 'VGFyZ2V0RGV0YWlsVHlwZTo4'
                    ? {
                        display: 'block',
                        // marginTop: 10,
                        marginLeft: 5,
                      }
                    : { display: 'none' }
                }
              >
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
              </div>
            </>
          )}

          <Divider orientation="left">Misc</Divider>
          <Form.Item
            label="Target Instructions"
            name="Target Instructions"
            labelCol={{ sm: 24, md: 5 }}
            wrapperCol={{ sm: 24, md: 19 }}
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

          <Form.Item
            label="Target Video Link"
            name="Target Video"
            labelCol={{ sm: 24, md: 5 }}
            wrapperCol={{ sm: 24, md: 19 }}
          >
            {form.getFieldDecorator('video', {
              initialValue:
                activeAllocatedTarget && activeAllocatedTarget.videos.edges[0]?.node.url,
            })(<Input placeholder="Give the video url" />)}
          </Form.Item>

          <Form.Item
            label="Make values default"
            labelCol={{ sm: 24, md: 5 }}
            wrapperCol={{ sm: 24, md: 19 }}
          >
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={makeDefault}
              onChange={setMakeDefault}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" loading={updateTargetLoading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  },
)
