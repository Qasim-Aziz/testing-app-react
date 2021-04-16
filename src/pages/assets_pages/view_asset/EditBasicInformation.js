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
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import actions from '../../../redux/assets_redux/actions'
import { GetUsers } from '../createAsset'
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
    console.log('THE PROPS ⭐', this.props)
    const {
      form,
      assets: { SpecificAsset },
    } = this.props

    console.log('THE IS SpecificAsset 👉👉👉', SpecificAsset)
    var val_asset_assign_to = null
    var val_asset_assign_by = null
    if (SpecificAsset.assetdesignationmodelSet.edges.length > 0) {
      /* Whoever it is assigned to latest */
      let model_val = SpecificAsset.assetdesignationmodelSet.edges.length - 1
      var val_asset_assign_to =
        SpecificAsset.assetdesignationmodelSet.edges[model_val].node.assignedTo.id
      var val_asset_assign_by =
        SpecificAsset.assetdesignationmodelSet.edges[model_val].node.assignedBy.id
    }
    console.log('THE ASSET ASSIGNED TO', val_asset_assign_to)
    form.setFieldsValue({
      assetName: SpecificAsset.assetName,
      assetStatus: SpecificAsset.assetStatus,
      description: SpecificAsset.description,
      createdBy: SpecificAsset.createdBy.id,
      asset_assignTo: val_asset_assign_to,
      asset_assignBy: val_asset_assign_by,
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
    data.append('pk', this.state.SpecificAssetID)
    console.log('THE DATA', data)
    form.validateFields((err, values) => {
      console.log('THE VALUES in edit form', err, values)
      message.info('FORM SUBMITED WAIT FOR RESPONSE')
      dispatch({
        type: 'assets/EDIT_ASSET',
        payload: {
          id: SpecificAsset.id,
          values: values,
        },
      })
    })
  }

  handleSubmitFormForAssetDesignation = () => {
    const {
      form,
      dispatch,
      assets: { SpecificAsset },
    } = this.props
    // e.preventDefault()
    console.log('THE BUTTON CLICKED', this.props)
    console.log('ASSIGNED TO', form.getFieldValue('asset_assignTo'))
    if (SpecificAsset.assetdesignationmodelSet.edges.length > 0) {
      console.log('THE DISPATCH FOR ASSIGNING UPDATION OF ASSET DESIGNATION MODEL')
      let model_val = SpecificAsset.assetdesignationmodelSet.edges.length - 1
      var asset_designation_id = SpecificAsset.assetdesignationmodelSet.edges[model_val].node.id
      console.log('THE ID', asset_designation_id)
      dispatch({
        type: actions.UPDATE_DESIGNATE_ASSET,
        payload: {
          values: {
            id: asset_designation_id,
            idForAsset: SpecificAsset.id,
            idForAssignedBy: this.props.user.id,
            idForAssignedTo: form.getFieldValue('asset_assignTo'),
          },
        },
      })
    } else {
      dispatch({
        type: actions.DESIGNATE_ASSET, //'assets/DESIGNATE_ASSET',
        payload: {
          values: {
            idForAsset: SpecificAsset.id,
            idForAssignedBy: this.props.user.id,
            idForAssignedTo: form.getFieldValue('asset_assignTo'),
          },
        },
      })
    }
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
    return (
      <div>
        <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
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
          <Form.Item label="FINAL DATE OF USE" style={itemStyle}>
            {form.getFieldDecorator('date')(<DatePicker />)}
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON}>
              Submit
            </Button>

            {/* <Button type="default" onClick={this.onReset} style={CANCEL_BUTTON}>
              Reset
            </Button> */}
          </Form.Item>
        </Form>
        {/* ---------------------------- ASSIGNING STUFF ---------------------------------- */}
        <div style={{ marginTop: '4em' }}>
          <Divider orientation="left">Assigning Assets to User</Divider>
          {/* ASSIGNING ASSET TO WHICH USER */}
          <Form
            // onSubmit={e => this.handleSubmitFormForAssetDesignation(e)}
            style={{ display: 'flex' }}
          >
            <GetUsers form={form} />
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: 'white',
                border: '1px solid #0b35b3',
                color: COLORS.palleteDarkBlue,
              }}
              onClick={this.handleSubmitFormForAssetDesignation}
              // loading={updateCommentLoading}
            >
              ASSIGN
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm
