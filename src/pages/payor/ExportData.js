import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { CloudDownloadOutlined } from '@ant-design/icons'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import 'jspdf-autotable'

const exportToCSV = data => {
  const fileName = 'payors_excel'
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const formattedData = data.map(function(e) {
    return {
      FirstName: e.firstname,
      LastName: e.lastname,
      ContactName: e.contactType.name,
      Email: e.email,
      City: e.city,
      State: e.state,
      PrimaryLocation: e.primaryLocation,
      HomePhone: e.homePhone,
      WorkPhone: e.workPhone,
    }
  })

  const ws = XLSX.utils.json_to_sheet(formattedData)
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const exportData = new Blob([excelBuffer], { type: fileType })
  FileSaver.saveAs(exportData, fileName + fileExtension)
}

const exportPDF = data => {
  const unit = 'pt'
  const size = 'A4' // Use A1, A2, A3 or A4
  const orientation = 'landscape' // portrait or landscape
  const doc = new JsPDF(orientation, unit, size)
  const title = 'Payor List'
  const headers = [
    [
      'First Name',
      'Last Name',
      'Contact Name',
      'Email',
      'City',
      'State',
      'Primary Location',
      'Home Phone',
      'Work Phone',
    ],
  ]

  const exportData = data.map(e => [
    e.firstname,
    e.lastname,
    e.contactType ? e.contactType.name : '',
    e.email,
    e.city,
    e.state,
    e.primaryLocation,
    e.homePhone,
    e.workPhone,
  ])

  const content = {
    startY: 50,
    head: headers,
    body: exportData,
  }

  doc.text(title, 10, 10)
  doc.autoTable(content)
  doc.setFontSize(10)
  doc.save('payor.pdf')
}

const ExportData = ({ data }) => {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Button onClick={() => exportPDF(data)} type="link" size="small">
          PDF
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button onClick={() => exportToCSV(data)} type="link" size="small">
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button style={{ marginRight: '10px' }} type="link" size="small">
          <CloudDownloadOutlined />
        </Button>
      </Dropdown>
    </>
  )
}

export default ExportData
