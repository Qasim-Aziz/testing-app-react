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

  console.log(products, 'tableData')

  return (
    <div>
      <Table
        components={components}
        columns={columns}
        dataSource={products}
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

const CreateProductForm = ({ setOpen, refetch }) => {
  const [createProduct, { data, error, loading }] = useMutation(CREATE_PRODUCT)
  const [title, seTtitle] = useState('')
  const [description, setDescription] = useState('')
  const [borderClassActive, setBorderClassActive] = useState(false)
  useEffect(() => {
    if (data) {
      notification.success({
        message: 'New product created sucessfully',
      })
      refetch()
      seTtitle('')
      setDescription('')
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
    if (title.length !== 0 && description.length !== 0) {
      createProduct({
        variables: {
          name: title,
          description,
        },
      })
    } else {
      setBorderClassActive(true)
    }
  }

  return (
    <div style={{ fontSize: '18px' }}>
      <div>
        <span>Title</span>
        <Input
          size="default"
          name="name"
          style={{
            borderColor: `${borderClassActive && title.length === 0 ? 'red' : 'rgb(217,217,217)'}`,
          }}
          required
          placeholder="Give product title"
          value={title}
          onChange={e => seTtitle(e.target.value)}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <span>Description </span>
        <TextArea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          required
          style={{
            borderColor: `${
              borderClassActive && description.length === 0 ? 'red' : 'rgb(217,217,217)'
            }`,
          }}
          placeholder="Tell more about the product"
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 150,
            height: 40,
            marginTop: '10px',
            fontSize: '1.3rem',
          }}
          onClick={handleSubmit}
          loading={loading}
        >
          Create
        </Button>
      </div>
    </div>
  )
}

export { InvoiceProductsTable, CreateProductForm }
