import { Table } from 'antd'
import React from 'react'

const PrescriptionVisitTable = ({ products, ...props }) => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'medicineType',
    },
    {
      title: 'Medicine',
      dataIndex: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
    },

    {
      title: 'Dosage',
      dataIndex: 'dosage',
    },

    {
      title: 'Unit',
      dataIndex: 'unit',
    },

    {
      title: 'Timing',
      dataIndex: 'when',
    },

    {
      title: 'Frequency',
      dataIndex: 'frequency',
    },

    {
      title: 'Duration',
      dataIndex: 'duration',
    },
    {
      title: 'Note',
      dataIndex: ' ',
    },
  ]
  return (
    <>
      <div id="prescription_visit_table_container">
        <Table bordered columns={columns} dataSource={products} pagination={false} />
      </div>
    </>
  )
}

export default PrescriptionVisitTable
