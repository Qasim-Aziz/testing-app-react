/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
  const [editing, setEditing] = useState(false)
  const inputRef = useRef()
  const form = useContext(PrescriptionFormContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
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

  if (editable) {
    childNode = editing ? (
      <div>
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
                loading={false}
                placeholder="Please enter prescription name"
                onPressEnter={save}
                onBlur={save}
                style={{ border: 'none', width: '200px' }}
              />,
            )}
          </Form.Item>
        )}
        {title !== 'Product/Service' && (
          <Form.Item
            style={{
              margin: 0,
              padding: 0,
            }}
            name={dataIndex}
          >
            {form.getFieldDecorator(title.toLowerCase())(
              <InputNumber
                style={{ width: '100%', padding: 0, margin: 0 }}
                min={title === 'qty' ? 1 : 0}
                ref={inputRef}
                onPressEnter={save}
                onBlur={save}
              />,
            )}
          </Form.Item>
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
