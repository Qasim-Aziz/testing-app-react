/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
/* eslint-disable */
import React from 'react'

import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Divider,
  Upload,
  Tag,
  Checkbox,
  Icon,
  message,
} from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../../staffs/antdTag'
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles' // '../../../assets/styles/globalStyles' //

const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}
const layout1 = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 5,
    span: 18,
  },
}

@connect(({ user, assets }) => ({ user, assets }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  state = {
    SpecificAssetID: null,
    SpecificAssetData: null,
  }

  componentDidMount() {
    console.log('THE PROPS ', this.props)
    const {
      form,
      assets: { SpecificAsset },
    } = this.props

    console.log('THE IS SpecificAsset --------------------->', SpecificAsset)
    var val_asset_assign_to = null
    var val_asset_assign_by = null
    if (SpecificAsset.assetdesignationmodelSet.length > 0) {
      var val_asset_assign_to = SpecificAsset.assetdesignationmodelSet[0].assignedTo
      var val_asset_assign_by = SpecificAsset.assetdesignationmodelSet[0].assignedBy
    }
    form.setFieldsValue({
      assetName: SpecificAsset.assetName,
      assetStatus: SpecificAsset.assetStatus,
      description: SpecificAsset.description,
      createdBy: SpecificAsset.createdBy,
      asset_assignTo: moment(val_asset_assign_to),
      asset_assignBy: moment(val_asset_assign_by),
    })

    this.setState({
      SpecificAssetID: SpecificAsset.id,
      SpecificAssetData: SpecificAsset,
    })
  }

  onChange = (date, dateString) => {
    console.log('THE CHOSEN DATE ===========> ', date, dateString)
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      assets: { SpecificAsset },
    } = this.props
    e.preventDefault()
    const data = new FormData()
    // data.append('file', this.state.selectedFile)
    data.append('pk', this.state.SpecificAssetID)
    console.log('THE DATA', data)
    form.validateFields((err, values) => {
      console.log('THE VALUES in edit form', err, values)
      // values = { ...values, tags: this.state.tagArray }
      message.success('Upload Successfully.')
      dispatch({
        type: 'assets/EDIT_ASSET',
        payload: {
          id: SpecificAsset.id,
          values: values,
        },
      })
    })
  }

  render() {
    console.log('THE PROPS in EDIT-BASIC-INFO====> initially in render \n', this.props)
    console.log('THE STATE in EDIT-BASIC-INFO====> initially in render \n', this.state)
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const {
      form,
      assets: { UsersList },
    } = this.props
    const itemStyle1 = { marginBottom: '5px', fontWeight: 'bold' }
    // console.log(this.props.form, 'pppp')
    console.log('THE PROPS in EDIT-BASIC-INFO====> END of render \n', this.props)
    console.log('THE STATE in EDIT-BASIC-INFO====> END of render \n', this.state)
    return (
      <div>
        <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
          {/* {} */}
          <Divider orientation="left">Mandatory Fields</Divider>
          {/* item name */}
          <Form.Item label="Asset Name" style={itemStyle}>
            {form.getFieldDecorator('assetName', {
              rules: [{ required: true, message: 'Please provide asset name!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          {/* Purchased From */}
          <Form.Item label="Description From" style={itemStyle}>
            {form.getFieldDecorator('description')(
              <Input.TextArea rows={4} style={{ borderRadius: 0 }} />,
            )}
          </Form.Item>

          {/* Status */}
          <Form.Item label="Status" style={itemStyle}>
            {form.getFieldDecorator('assetStatus', {
              rules: [{ required: true, message: 'Please provide Status' }],
            })(
              <Select placeholder="Status" allowClear>
                <Select.Option value="ASSIGNED">ASSIGNED</Select.Option>
                <Select.Option value="NOT_ASSIGNED">NOT_ASSIGNED</Select.Option>
              </Select>,
            )}
          </Form.Item>
          {/* ADD DATE FIELD BELOW */}
          {/* <Form.Item label="Date" style={itemStyle}>
            {form.getFieldDecorator('finalDate', {
              rules: [
                {
                  required: false,
                  // message: 'Please input Final Date',
                  whitespace: true,
                },
              ],
            })(<DatePicker format="DD-MM-YYYY" dateString onChange={this.onChange} />)}
          </Form.Item> */}
          {/* ---------------------------- ASSIGNING STUFF ---------------------------------- */}
          <Divider orientation="left">Assigning Assets to User</Divider>

          {/* <Form.Item label="Assign To" style={itemStyle}>
            {form.getFieldDecorator('assigedTo', {
              rules: [{ required: true, message: 'Please provide Choose a user' }],
            })(
              <Select placeholder="Assign To" allowClear>
                {UsersList.map((item, index) => (
                  <Select.Option key={index} value={item.id}>
                    {item.firstName} {item.lastName}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item> */}

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON}>
              Submit
            </Button>

            {/* <Button type="default" onClick={this.onReset} style={CANCEL_BUTTON}>
              Reset
            </Button> */}
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm
