/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable */

import React, { useEffect, useRef, useContext, useState } from 'react'
import 'antd/dist/antd.css'
import './index.scss'

import { Form, Select, notification, InputNumber, Input } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { PrescriptionFormContext } from './context'

const { Option } = Select

const PRODUCTS = gql`
  query {
    invoiceProductsList {
      id
      name
    }
  }
`

export default ({ record, children, title, editable, dataIndex, handleSave, ...restProps }) => {
  console.log('RECORD', record)
  console.log('CHILDREN', children)
  console.log('TITLE', title)
  console.log('EDITABLE', editable)
  console.log('THE DATA INDEX', dataIndex)
  console.log('THE HANDLESAVE', handleSave)
  console.log('THE REST OF PROPS', restProps)
  const [editing, setEditing] = useState(false)
  const inputRef = useRef()
  const form = useContext(PrescriptionFormContext)
  console.log('THE LOCAL STATE of prescriptionItemCell', editing)
  console.log('THE inputRef', inputRef)
  useEffect(() => {
    if (editing) {
      console.log('THE inputRef inside useEffect', inputRef)

      if (inputRef.current) {
        console.log('THE inputRef inside useEffect >>>>>>', inputRef.current.focus())
        inputRef.current.focus()
      }
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children
  console.log('CHILD_NODE', childNode)
  if (editable) {
    childNode = editing ? (
      <div>
        {/* We have 7 fields the table column
            Here we are defining what kind of input field each column will take
         */}
        {/* the medicine-Name field will be called "service" in the array object */}
        {title === 'Product/Service' && (
          <Form.Item
            style={{
              margin: 0,
              border: 'none',
            }}
            name={record.dataIndex}
          >
            {form.getFieldDecorator('service', {
              initialValue: record.service,
              rules: [
                {
                  required: true,
                  message: 'Please enter prescription name',
                },
              ],
            })(
              <Input
                ref={inputRef}
                // loading={false}
                placeholder="Please enter prescription name"
                onPressEnter={save}
                onBlur={save}
                style={{ border: 'none', width: '200px' }}
              />,
            )}
          </Form.Item>
        )}
        {/* title !== 'Product/Service' && */}
        {title === 'Type' ? (
          <Form.Item
            style={{
              margin: 0,
              padding: 0,
            }}
            name={record.dataIndex}
          >
            {form.getFieldDecorator('type')(
              <Select placeholder="Medicine Type" allowClear onSelect={save}>
                <Select.Option value="SYP">SYP</Select.Option>
                <Select.Option value="TAB">TAB</Select.Option>
                <Select.Option value="DRP">DRP</Select.Option>
                <Select.Option value="LIQ">LIQ</Select.Option>
              </Select>,
            )}
            {/* {form.getFieldDecorator(title.toLowerCase())(
              // <Input.Group compact onBlur={save} onPressEnter={save}>
                {/* onMouseEnter={save} * /}
                <Select placeholder="Medicine Type" allowClear>
                  <Select.Option value="SYP">SYP</Select.Option>
                  <Select.Option value="TAB">TAB</Select.Option>
                  <Select.Option value="DRP">DRP</Select.Option>
                  <Select.Option value="LIQ">LIQ</Select.Option>
                </Select>,
              {/* </Input.Group>, * /}
              // <Input
              //   ref={inputRef}
              //   // loading={false}
              //   placeholder="Please enter prescription name"
              //   onPressEnter={save}
              //   onBlur={save}
              //   style={{ border: 'none', width: '200px' }}
              // />
            )} */}
          </Form.Item>
        ) : (
          title !== 'Product/Service' && (
            <Form.Item
              style={{
                margin: 0,
                padding: 0,
              }}
              name={record.dataIndex}
            >
              {form.getFieldDecorator(title.toLowerCase())(
                <Input
                  ref={inputRef}
                  // loading={false}
                  placeholder="Please enter the values"
                  onPressEnter={save}
                  onBlur={save}
                  style={{ border: 'none', width: '200px' }}
                />,
              )}
            </Form.Item>
          )
        )}
      </div>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 0,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}
