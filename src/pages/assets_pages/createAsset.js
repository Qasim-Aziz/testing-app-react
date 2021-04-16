/* eslint-disable */

/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Spin,
  Button,
  Select,
  DatePicker,
  Checkbox,
  Divider,
  message,
  Tag,
} from 'antd'
import { connect } from 'react-redux'
import AntdTag from '../staffs/antdTag'
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles' // '../../../assets/styles/globalStyles' //
import { useQuery } from 'react-apollo'
import { gql } from 'apollo-boost'
import { FETCH_USERS_QUERY } from './view_asset/query'

export const GetUsers = ({ form }) => {
  const [sdText, setSdText] = useState('')
  const { data: sdData, error: sdError, loading: sdLoading } = useQuery(FETCH_USERS_QUERY, {
    variables: {
      val: sdText,
    },
  })

  useEffect(() => {
    if (sdError) {
      notification.error({
        message: 'Failed to load list of users',
      })
    }
  }, [sdError])

  return (
    <>
      {/* ASSIGNING ASSET TO */}
      {(form.getFieldValue('asset_assignTo') || !form.getFieldValue('asset_assignTo')) && (
        <Form.Item style={{ display: 'flex', width: '90%' }} className="TimeLine-Form">
          {form.getFieldDecorator('asset_assignTo')(
            <Select
              // mode="default"
              // style={{ width: '90%' }}
              allowClear
              size="large"
              notFoundContent={sdLoading ? <Spin size="small" /> : null}
              filterOption={false}
              // onSearch
              onSearch={v => {
                setSdText(v)
              }}
              showSearch
              loading={sdLoading}
              placeholder="Search a User"
            >
              {sdData?.getuser.edges.map(({ node }) => {
                // console.log('THE NODE NAME', node.username)
                return (
                  <Select.Option key={node.id} value={node.id}>
                    {node.username}
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
    offset: 7,
    span: 14,
  },
}

@connect(({ user, assets }) => ({ user, assets }))
class BasicInformationForm extends React.Component {
  formRef = React.createRef()

  constructor(props) {
    super(props)

    this.state = {}
    this.tagArrayHandler = this.tagArrayHandler.bind(this)
  }

  state = {
    selectedFile: null,
    tagArray: [],
  }

  componentDidMount() {
    const { dispatch } = this.props
    console.log('THE PROPS in CDM', this.props)
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  handleSubmit = e => {
    e.preventDefault()

    const { form, dispatch } = this.props
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    form.validateFields((error, values) => {
      if (!error) {
        console.log('VALUES SEND TO THE SAGAS middleware are', error, values)
        console.log('THE ASSET IS ASSIGNED BY', this.props.user.id)
        dispatch({
          type: 'assets/CREATE_ASSET',
          payload: {
            values: values,
            // Id of the user who will create the asset is the one who is authenticated
            createdBy: this.props.user.id,
          },
        })
        form.resetFields()
      }
    })
  }

  onChangeHandler = event => {
    console.log(event.target.files[0])
    this.setState({
      selectedFile: event.target.files[0],
    })
  }

  tagArrayHandler = tags => {
    this.setState({
      tagArray: tags,
    })
  }

  render() {
    console.log('THE RENDER PROPS ====> ', this.props)
    console.log('THE RENDER STATE ====> ', this.state)
    const { form } = this.props
    const {
      assets: { UsersList },
    } = this.props
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

    console.log('THE RENDER END ====> ', this.props)
    console.log('THE RENDER END ====> ', this.state)
    // console.log('THE ASSET', assets)
    console.log('THE user-list', UsersList)

    return (
      <>
        <Form {...layout} name="control-ref" onSubmit={e => this.handleSubmit(e)}>
          <Divider orientation="left">Mandatory Fields</Divider>
          {/* item name */}
          <Form.Item label="ASSET NAME" style={itemStyle}>
            {form.getFieldDecorator('assetName', {
              rules: [{ required: true, message: 'Please provide asset name!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          {/* Description */}
          <Form.Item label="DESCRIPTION" style={itemStyle}>
            {form.getFieldDecorator('description')(
              <Input.TextArea rows={2} style={{ borderRadius: 0 }} />,
            )}
          </Form.Item>

          {/* Status of asset */}
          <Form.Item label="STATUS" style={itemStyle}>
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

            <Button type="default" onClick={this.onReset} style={CANCEL_BUTTON}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }
}
const BasicInformation = Form.create()(BasicInformationForm)
export default BasicInformation
