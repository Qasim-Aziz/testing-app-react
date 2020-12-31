/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useContext, useState } from 'react'
import 'antd/dist/antd.css'
import './index.css'

import { Form, Select, notification, InputNumber } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { ProductFormContext } from './context'

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
  const form = useContext(ProductFormContext)
  const { data: productData, error: productError, loading: productLoading } = useQuery(PRODUCTS)

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

  useEffect(() => {
    if (productError) {
      notification.error({
        message: 'Failed to load products',
      })
    }
  }, [productError])

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
            }}
            name={record.dataIndex}
          >
            {form.getFieldDecorator('service', {
              initialValue: record.service,
              rules: [
                {
                  required: true,
                  message: 'Please give product quantity',
                },
              ],
            })(
              <Select
                ref={inputRef}
                loading={productLoading}
                placeholder="Please select a product"
                onPressEnter={save}
                onBlur={save}
              >
                {productData?.invoiceProductsList.map(({ id, name }) => {
                  return (
                    <Option key={id} value={id}>
                      {name}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
        )}
        {title !== 'Product/Service' && (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
          >
            {form.getFieldDecorator(title.toLowerCase(), {
              initialValue: record[title.toLowerCase()],
              rules: [
                {
                  required: true,
                  message: 'Please give product quantity',
                },
              ],
            })(
              <InputNumber
                style={{ width: '100%' }}
                min={title === 'qty' ? 1 : 0}
                ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                placeholder={`Give product ${title}`}
              />,
            )}
          </Form.Item>
        )}
      </div>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}
