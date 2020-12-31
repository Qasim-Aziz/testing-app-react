/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Table, Button, Form, Typography, notification, Input, Modal } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import ProductTableCell from './ProductTableCell'
import './index.css'
import { ProductFormContext } from './context'
import { CREATE_PRODUCT } from './query'

const { TextArea } = Input

const { Text } = Typography

const PRODUCTS = gql`
  query {
    invoiceProductsList {
      id
      name
    }
  }
`

const EditableRow = ({ form, index, ...props }) => (
  <ProductFormContext.Provider value={form} key={index}>
    <tr {...props} />
  </ProductFormContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

const components = {
  body: {
    row: EditableFormRow,
    cell: ProductTableCell,
  },
}

const InvoiceProductsTable = ({ products, dispatch, totalAmount }) => {
  const [createProModal, setCreateProModal] = useState(false)
  const {
    data: productData,
    error: productError,
    loading: productLoading,
    refetch: productRefetch,
  } = useQuery(PRODUCTS)

  useEffect(() => {
    if (productError) {
      notification.error({
        message: 'Failed to load products',
      })
    }
  }, [productError])

  const columnsList = [
    {
      title: '#',
      dataIndex: 'key',
      width: '10%',
    },
    {
      title: 'Product/Service',
      editable: true,
      render(obj) {
        return productData?.invoiceProductsList.find(({ id }) => obj.service === id)?.name
      },
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      editable: true,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      editable: true,
    },
    {
      title: 'Amount',
      render: (text, record) => {
        console.log(record)
        return parseFloat(record.qty) * parseFloat(record.rate)
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (text, { key }) => (
        <Button
          type="danger"
          onClick={() => {
            dispatch({
              type: 'REMOVE_PRODUCT',
              payload: { key },
            })
          }}
        >
          Delete
        </Button>
      ),
    },
  ]

  const handleAdd = () => {
    const newProductData = {
      key: products.length + 1,
      service: productData?.invoiceProductsList[0].id,
      qty: 1,
      rate: 0,
    }
    dispatch({ type: 'ADD_PRODUCT', payload: newProductData })
  }

  const handleSave = data => {
    dispatch({ type: 'EDIT_PRODUCT', payload: data })
  }

  const columns = columnsList.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <div>
      <Table
        components={components}
        columns={columns}
        dataSource={!productLoading && products}
        bordered
        rowClassName={() => 'editable-row'}
        pagination={false}
        loading={productLoading}
        footer={() => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button onClick={handleAdd} type="primary">
              Add a Line
            </Button>

            <Button
              style={{ marginLeft: 15 }}
              type="primary"
              onClick={() => setCreateProModal(true)}
            >
              Create a new product
            </Button>

            <Text
              style={{
                marginLeft: 'auto',
                marginRight: '10%',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Subtotal
            </Text>
            <Text style={{ fontSize: 18, fontWeight: 600 }}>{totalAmount}$</Text>
          </div>
        )}
      />

      <Modal
        title="Create new product"
        visible={createProModal}
        onCancel={() => setCreateProModal(false)}
        footer={false}
      >
        <CreateProductForm setOpen={setCreateProModal} refetch={productRefetch} />
      </Modal>
    </div>
  )
}

const CreateProductForm = Form.create()(({ form, setOpen, refetch }) => {
  const [createProduct, { data, error, loading }] = useMutation(CREATE_PRODUCT)

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'New product created sucessfully',
      })
      refetch()
      form.resetFields()
      setOpen(false)
    }

    if (error) {
      notification.error({
        message: 'New product creation failed',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        createProduct({
          variables: {
            name: values.name,
            description: values.description,
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Name">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Name is required' }],
        })(<Input size="large" placeholder="Give the product name" />)}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: 'Product description is required' }],
        })(<TextArea placeholder="Tell more about the product" />)}
      </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 150,
            height: 40,
            fontSize: '1.3rem',
          }}
          loading={loading}
        >
          Create
        </Button>
      </div>
    </Form>
  )
})

export default InvoiceProductsTable
