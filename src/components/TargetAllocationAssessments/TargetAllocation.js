/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-template */
/* eslint-disable no-useless-concat */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react'
import { Avatar, Form, Input, Select, Checkbox, Button, Typography, notification, Spin, Icon, Row, Col, AutoComplete } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import CKEditor from 'react-ckeditor-component'
import moment from 'moment'
import {
  TARGET_ALLOCATIONS_OPTIONS,
  SETTING,
  SHORT_TERM_GOALS,
  CREATE_TARGET,
  GET_TARGET_STEP,
  GET_TARGET_SD,
} from './query'
import NumberCard from './NumberCard'

let id = 0;
let stepId = 0;
let classId = 0;
const AutoCompleteOption = AutoComplete.Option;
const { Text } = Typography
const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default Form.create()(
  ({ form, targetName, targetVideo, targetInstr, selectedTargetId, peakEnable = false, equivalenceEnable = false, equivalenceObject }) => {
    const [targetInstructions, setTargetInstructions] = useState(targetInstr)
    const [dailyTrials, setDailyTrials] = useState(0)
    const [sessionConsecutiveDays, setSessionConsecutiveDays] = useState(0)
    const [makeDefault, setMakeDefault] = useState(false)
    const [stepText, setStepText] = useState()
    const studentId = localStorage.getItem('studentId')
    const [peakBlockCount, setPeakBlockCount] = useState(1)
    const [sdText, setSdText] = useState('')

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

    const { data: stepData, error: stepError, loading: stepLoading } = useQuery(GET_TARGET_STEP, {
      variables: {
        text: stepText,
      },
    })


    const { data: sdData, error: sdError, loading: sdLoading } = useQuery(GET_TARGET_SD, {
      variables: {
        text: sdText,
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

    const stepsOptions = stepData?.targetStep.edges.map(node => (
      <AutoCompleteOption key={node.node.id} value={node.node.step}>{node.node.step}</AutoCompleteOption>
    ));

    const sdsOptions = sdData?.targetSd.edges.map(node => (
      <AutoCompleteOption key={node.node.id} value={node.node.sd}>{node.node.sd}</AutoCompleteOption>
    ));

    const add = () => {
      // const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(id++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      });
    };

    const remove = k => {
      // const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      // We need at least one passenger
      if (keys.length === 0) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    };

    const addStep = () => {
      // const { form } = this.props;
      // can use data-binding to get
      const stepKeys = form.getFieldValue('stepKeys');
      const nextKeys = stepKeys.concat(stepId++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        stepKeys: nextKeys,
      });
    };

    const stepRemove = k => {
      // const { form } = this.props;
      // can use data-binding to get
      const stepKeys = form.getFieldValue('stepKeys');
      // We need at least one passenger
      if (stepKeys.length === 0) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        stepKeys: stepKeys.filter(key => key !== k),
      });
    };

    const classAdd = () => {
      // const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('Classkeys');
      const nextKeys = keys.concat(classId++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        Classkeys: nextKeys,
      });
    };

    const classRemove = k => {
      // const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('Classkeys');
      // We need at least one passenger
      if (keys.length === 0) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        Classkeys: keys.filter(key => key !== k),
      });
    };

    useEffect(() => {
      if (stepError) {
        notification.error({
          message: 'Failed to load step list',
        })
      }
    }, [stepError])

    useEffect(() => {
      if (sdError) {
        notification.error({
          message: 'Failed to load sd list',
        })
      }
    }, [sdError])


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
        setDailyTrials(
          settingData.getAllocateTargetSettings.edges[0]?.node.dailyTrials || 0
        )
        setSessionConsecutiveDays(settingData.getAllocateTargetSettings.edges[0]?.node.consecutiveDays || 0)
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
        const { keys, stimulus, stimulusMC, stimulusStatus, stepKeys, steps, stepStatus, stepMC, Classkeys } = values
        // console.log(keys, stimulus, stimulusMC, stimulusStatus, stepKeys, steps, stepStatus, stepMC)

        const classes = []
        Classkeys.map((key, index) => {
          const sampleStimulus = []
          selectedAlpha.map((alpha, alphaIndex) => {
            sampleStimulus.push({ option: alpha, stimulusName: values[`stimulus${key}${alpha}`] })
          })
          classes.push({ name: `Class ${index + 1}`, stimuluses: sampleStimulus })
        })

        const sdResponse = []
        const stepResponse = []
        keys.map(id => {
          sdResponse.push({ sd: stimulus[id], mastery: stimulusMC[id], status: stimulusStatus[id] })
        })
        stepKeys.map(id => {
          stepResponse.push({ step: steps[id], mastery: stepMC[id], status: stepStatus[id] })
        })
        if (values.type === 'VGFyZ2V0RGV0YWlsVHlwZTo4' && values.category !== 'Equivalance' && sdResponse.length < 1) {
          notification.info({
            message: 'Sd required for type PEAK',
          })
        }
        if (!targetInstructions) {
          notification.info({
            message: 'Target Instruction is mandatory',
          })
        }
        else if (!error) {
          try {
            allocateTarget({
              variables: {
                studentId,
                shortTerm: values.stg,
                targetId: selectedTargetId,
                targetStatus: values.status,
                targetInstr: targetInstructions,
                date: moment().format('YYYY-MM-DD'),
                masteryCriteria: values.masteryCriteria,
                targetName: values.name,
                dailyTrials,
                consecutiveDays: sessionConsecutiveDays,
                targetType: values.type,
                sd: sdResponse,
                steps: stepResponse,
                video: values.video,
                default: makeDefault,
                peakBlocks: peakBlockCount,
                peakType: values.category ? values.category : null,
                classes,
                equiCode: values.equiCode ? values.equiCode : null

              },
              errorPolicy: 'all',
              onError(err) {
                console.log(err);
              },
            })
          } catch (e) {
            console.log(e)
          }

        }
      })
    }

    if (targetOptionsError || settingError) {
      return <h4 style={{ color: 'red', marginTop: 40 }}>Opps therir are something wrong</h4>
    }

    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
      },
    };


    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <>
        <Form.Item {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} label={index === 0 ? 'Stimulus' : ''} key={k} style={{ marginTop: 0, marginBottom: 0 }}>
          <Form.Item
            required={false}
            key={'stimulus' + k}
            style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
          >
            {getFieldDecorator(`stimulus[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input Stimulus's name or delete this field.",
                },
              ],
            })(
              <AutoComplete
                dataSource={sdsOptions}
                onChange={(v) => setSdText(v)}
              >
                <Input
                  placeholder="Stimulus name"
                />
              </AutoComplete>
            )}
          </Form.Item>
          <Form.Item
            required={false}
            key={'sdStatus' + k}
            style={{ display: 'inline-block', width: 'calc(28% - 12px)' }}
          >
            {getFieldDecorator(`stimulusStatus[${k}]`, {
              initialValue: form.getFieldValue('status'),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please Select Status or delete this field.",
                },
              ],
            })(
              <Select loading={targetOptionsLoading}>
                {targetOptions?.targetStatus.map(({ id, statusName }) => {
                  return (
                    <Select.Option key={id} value={id}>
                      {statusName}
                    </Select.Option>
                  )
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            style={{ display: 'inline-block', width: 'calc(32% - 12px)' }}
            required={false}
            key={'sdMC' + k}
          >
            {getFieldDecorator(`stimulusMC[${k}]`, {
              initialValue: form.getFieldValue('masteryCriteria'),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please Select Criteria or delete this field.",
                },
              ],
            })(
              <Select placeholder="select criteria" loading={targetOptionsLoading} style={{ width: '80%', marginRight: 8 }}>
                {targetOptions?.masteryCriteria.map(({ id, name }) => {
                  return (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  )
                })}
              </Select>
            )}
            {keys.length > 0 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => remove(k)}
              />
            ) : null}

          </Form.Item>
        </Form.Item>


      </>
    ));

    getFieldDecorator('stepKeys', { initialValue: [] });
    const stepKeys = getFieldValue('stepKeys');
    const formItemsSteps = stepKeys.map((k, index) => (
      <>
        <Form.Item {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} label={index === 0 ? 'Steps' : ''} key={index} style={{ marginTop: 0, marginBottom: 0 }}>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
            required={false}
            key={'step' + k}
          >
            {getFieldDecorator(`steps[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input Step's name or delete this field.",
                },
              ],
            })(
              <AutoComplete
                dataSource={stepsOptions}
                onChange={(v) => setStepText(v)}
              >
                <Input
                  placeholder="Step name"
                />
              </AutoComplete>
            )}
          </Form.Item>
          <Form.Item
            required={false}
            key={'stepStatus' + k}
            style={{ display: 'inline-block', width: 'calc(28% - 12px)' }}
          >
            {getFieldDecorator(`stepStatus[${k}]`, {
              initialValue: form.getFieldValue('status'),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please Select Status or delete this field.",
                },
              ],
            })(
              <Select loading={targetOptionsLoading}>
                {targetOptions?.targetStatus.map(({ id, statusName }) => {
                  return (
                    <Select.Option key={id} value={id}>
                      {statusName}
                    </Select.Option>
                  )
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            style={{ display: 'inline-block', width: 'calc(32% - 12px)' }}
            required={false}
            key={'stepMC' + k}
          >
            {getFieldDecorator(`stepMC[${k}]`, {
              initialValue: form.getFieldValue('masteryCriteria'),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please Select Criteria or delete this field.",
                },
              ],
            })(
              <Select placeholder="select criteria" loading={targetOptionsLoading} style={{ width: '80%', marginRight: 8 }}>
                {targetOptions?.masteryCriteria.map(({ id, name }) => {
                  return (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  )
                })}
              </Select>
            )}
            {stepKeys.length > 0 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => stepRemove(k)}
              />
            ) : null}

          </Form.Item>
        </Form.Item>


      </>
    ));

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
      equivalenceObject?.classes?.edges.map((item, index) => {
        initialKeyValue.push(index)
      })
    }

    getFieldDecorator('Classkeys', { initialValue: initialKeyValue });
    const classKeys = getFieldValue('Classkeys');
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
                initialValue: equivalenceObject?.classes?.edges[k]?.node.stimuluses.edges[alphaIndex]?.node.stimulusName,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input Stimulus's name or delete this field.",
                  },
                ],
              })(
                <Input placeholder={`Stimulus ` + `${alpha}`} />
              )}

            </Form.Item>

          ))}


          {/* {keys.length > 0 ? (
                    <Icon
                        style={{ marginRight: 10 }}
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null} */}

        </Form.Item>


      </>
    ));

    // end of equivalence class code

    return (
      <div>
        <Form {...layout} name="basic" onSubmit={handleSubmit}>
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

          <Form.Item label="Target Name" name="Target Name">
            {form.getFieldDecorator('name', {
              initialValue: targetName,
              rules: [{ required: true, message: 'Please give a target name' }],
            })(<Input name="targetName" size="large" />)}
          </Form.Item>

          {peakEnable ?

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

            :

            <Form.Item label="Target Type" name="Target Type" style={{ marginTop: 15 }}>
              {form.getFieldDecorator('type', {
                initialValue:
                  targetOptions &&
                  settingData?.getAllocateTargetSettings.edges[0]?.node.targetType.id,
                rules: [{ required: true, message: 'Please select a target type' }],
              })(
                <Select size="large" name="targetType">
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
          }

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

          <Form.Item label={<><span style={{ color: 'red', fontSize: 10 }}>*</span><span>Daily Trials</span></>} style={{ marginTop: 0, marginBottom: 0 }}>

            <NumberCard
              // title="Daily Trials"
              number={dailyTrials}
              form={form}
              maxValue={26}
              setNumber={num => onChangeNumber('sdt', num)}
              style={{
                marginLeft: 5,
                marginTop: 10,
              }}
            />
          </Form.Item>
          <Form.Item label={<><span style={{ color: 'red', fontSize: 10 }}>*</span><span>Consecutive Days</span></>} style={{ marginTop: 0, marginBottom: 0 }}>
            <NumberCard
              // title="Consecutive Days"
              number={sessionConsecutiveDays}
              form={form}
              setNumber={num => onChangeNumber('scd', num)}
              style={{
                marginLeft: 5,
                marginTop: 10,
              }}
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
            <Form.Item label={<><span style={{ color: 'red', fontSize: 10 }}>*</span><span>Peak Blocks</span></>} style={{ marginTop: 0, marginBottom: 0 }}>
              <NumberCard
                // title="Peak Blocks"
                number={peakBlockCount}
                maxValue={10}
                setNumber={num => onChangeNumber('spbc', num)}
                minValue={1}
              />
            </Form.Item>

            {equivalenceEnable ?

              <Form.Item label="Category">
                {form.getFieldDecorator('category', {
                  initialValue: 'Equivalance',
                  rules: [{ required: true, message: 'Please select a category' }],
                })(
                  <Select style={{ width: '100%' }} disabled placeholder="Select a category" size="large">
                    <Option key="4" value="Equivalance">
                      Equivalance
                    </Option>
                  </Select>,
                )}
              </Form.Item>

              :
              <Form.Item label="Category">
                {form.getFieldDecorator('category')(
                  <Select style={{ width: '100%' }} placeholder="Select a category" size="large">
                    <Option key="1" value="Direct">
                      Direct
                    </Option>
                    <Option key="2" value="Generalization">
                      Generalization
                    </Option>
                    <Option key="3" value="Transformation">
                      Transformation
                    </Option>
                    <Option key="4" value="Equivalance">
                      Equivalance
                    </Option>
                  </Select>,
                )}
              </Form.Item>
            }

          </div>

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

          {equivalenceEnable || form.getFieldValue('category') === 'Equivalance' ?
            <>
              {classFormItems}
              <Form.Item label="Add Classes">
                <Button type="dashed" onClick={() => classAdd()} style={{ width: '100%' }}>
                  <Icon type="plus" /> Add Class
                </Button>
              </Form.Item>

              <Form.Item label="Equivalence Code" style={{ marginTop: 15 }}>
                {form.getFieldDecorator('equiCode', {
                  initialValue: equivalenceObject?.code,
                })(<Input disabled={equivalenceObject?.code ? true : false} size="large" />)}
              </Form.Item>
            </>
            :
            <>
              {formItems}
              {form.getFieldValue('stepKeys')?.length > 0 ?
                <Form.Item label="Add Stimulus">
                  <Button type="dashed" disabled style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
                :
                <Form.Item label="Add Stimulus">
                  <Button type="dashed" onClick={add} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
              }

              {formItemsSteps}
              {form.getFieldValue('keys')?.length > 0 ?
                <Form.Item label="Add Steps">
                  <Button type="dashed" disabled style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
                :
                <Form.Item label="Add Steps">
                  <Button type="dashed" onClick={addStep} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
              }
            </>
          }

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

          <Form.Item {...tailLayout} style={{ marginTop: 15 }}>
            <Checkbox value={makeDefault} onChange={() => setMakeDefault(state => !state)}>
              Make values default
            </Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout} style={{ marginTop: 20 }}>
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
