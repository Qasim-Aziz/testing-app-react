/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable */

import { Form, Input, Select } from 'antd'
import 'antd/dist/antd.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { PrescriptionFormContext } from './context'
import './index.scss'

export default ({ record, children, title, editable, dataIndex, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef()
  const form = useContext(PrescriptionFormContext)

  console.log('record', record)
  useEffect(() => {
    if (editing) {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
    console.log(form.setFieldsValue)
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      // console.log('Save failed:', errInfo)
    }
  }

  let childNode = children
  if (editable) {
    childNode = editing ? (
      <div className="table-input-field">
        {title === 'Product/Service' && (
          <Form.Item
            style={{
              margin: 0,
              border: 'none',
            }}
            name={record.dataIndex}
          >
            {form.getFieldDecorator('name', {
              initialValue: record.name, //::before record.service,
              rules: [
                {
                  required: true,
                  message: 'Please enter prescription name',
                },
              ],
            })(
              <Input
                ref={inputRef}
                placeholder="Please enter prescription name"
                onPressEnter={save}
                onBlur={save}
                style={{ border: 'none', width: '200px' }}
              />,
            )}
          </Form.Item>
        )}
        {title === 'Type' ? (
          <Form.Item
            style={{
              margin: 0,
              padding: 0,
            }}
            name={record.dataIndex}
          >
            {form.getFieldDecorator('medicineType', {
              initialValue: record.medicineType,
            })(
              <Select placeholder="Medicine Type" allowClear onSelect={save}>
                <Select.Option value="SYP">SYP</Select.Option>
                <Select.Option value="TAB">TAB</Select.Option>
                <Select.Option value="DRP">DRP</Select.Option>
                <Select.Option value="LIQ">LIQ</Select.Option>
              </Select>,
            )}
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
              {form.getFieldDecorator(title.toLowerCase(), {
                initialValue: record[title.toLowerCase()],
              })(
                <Input
                  ref={inputRef}
                  placeholder="Please enter the values"
                  onPressEnter={save}
                  onBlur={save}
                  style={{ width: '100%', textAlign: 'right', alignSelf: 'flex-end' }}
                />,
              )}
            </Form.Item>
          )
        )}
      </div>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ padding: '6px 4px 6px 0' }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}
