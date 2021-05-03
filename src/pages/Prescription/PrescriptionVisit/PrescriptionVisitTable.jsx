import { Table } from 'antd'
import React from 'react'
import { PrescriptionFormContext } from '../context'

const EditableRow = ({ form, index, ...props }) => (
  <PrescriptionFormContext.Provider value={form} key={index}>
    <tr {...props} />
  </PrescriptionFormContext.Provider>
)

console.log(EditableRow)

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
        <Table bordered columns={columns} dataSource={products} />
      </div>
    </>
  )
}

export default PrescriptionVisitTable
