/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-plusplus */
import { Icon, Input, Table } from 'antd'
import React, { useState } from 'react'

const AllFilesData = ({ studentData }) => {
  const StudentName = studentData?.studentData?.firstname
  const files = studentData.studentData?.files.edges
  const filesLength = studentData.studentData?.files.edges.length
  const [filteredData, setFilteredData] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
    },
    {
      title: 'Description',
      dataIndex: 'fileDescription',
    },
    {
      title: 'Preview',
      render: text => (
        <a
          style={{ fontSize: '22px', textAlign: 'center', display: 'inline-block' }}
          target="_blank"
          rel="noopener noreferrer"
          href={text}
        >
          <Icon type="eye" />
        </a>
      ),
      dataIndex: 'file',
    },
    {
      title: 'Upload',
      dataIndex: 'upload',
    },
  ]

  const data = []
  for (let i = 0; i < filesLength || 0; i++) {
    const item = files[i]
    data.push({
      key: i,
      id: i + 1,
      fileName: item.node.fileName ? item.node.fileName : 'No File Name !',
      fileDescription: item.node.fileDescription
        ? item.node.fileDescription
        : 'No File Description!',
      file: item.node.file ? item.node.file : '',
      upload: StudentName && StudentName,
    })
  }

  const filterHandler = ({ name, description }) => {
    let filteredList = []
    if (name) {
      setIsFiltered(true)
      filteredList = data.filter(item => item.fileName?.toLowerCase().includes(name.toLowerCase()))
    }
    if (description) {
      setIsFiltered(true)
      filteredList = data.filter(item =>
        item.fileDescription?.toLowerCase().includes(description.toLowerCase()),
      )
    }
    if (!name && !description) {
      setIsFiltered(false)
    }
    setFilteredData(filteredList)
  }

  return (
    <>
      <div className="filter_container">
        <div className="name_filter_section">
          <div className="name_filter">
            <label className="name_filter_label" htmlFor="name">
              Name:
            </label>
          </div>
          <div className="name_filter_input">
            <Input
              onChange={e => filterHandler({ name: e.target.value })}
              id="name"
              placeholder="Search Name"
            />
          </div>
        </div>
        <div className="description_filter_section">
          <div className="description_filter">
            <label className="description_filter_label" htmlFor="description">
              Description:
            </label>
          </div>
          <div className="description_filter_input">
            <Input
              onChange={e => filterHandler({ description: e.target.value })}
              id="description"
              placeholder="Search Description"
            />
          </div>
        </div>
      </div>
      <div className="all_files_data_container">
        <Table columns={columns} dataSource={isFiltered ? filteredData : data} />
      </div>
    </>
  )
}

export default AllFilesData
