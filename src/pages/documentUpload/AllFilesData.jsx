/* eslint-disable no-plusplus */
import { Icon, Table } from 'antd'
import React from 'react'

const AllFilesData = ({ studentData }) => {
  const studentId = JSON.parse(localStorage.getItem('studentId'))
  const StudentName = studentData?.studentData?.firstname
  console.log(studentData.studentData?.files.edges)
  const files = studentData.studentData?.files.edges
  const filesLength = studentData.studentData?.files.edges.length
  console.log(StudentName)
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
      render: (text, record) => (
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
    console.log(item.node)
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
  // useEffect(() => {

  // }, [data])
  // const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // // state = {
  // //     selectedRowKeys: [], // Check here to configure the default column
  // //   };
  //  const onSelectChange = rowKeys => {
  //     console.log('selectedRowKeys changed: ', rowKeys);
  //     setSelectedRowKeys(rowKeys);
  //   };
  // const rowSelection = {
  //     selectedRowKeys,
  //     onChange: onSelectChange,
  //     selections: [
  //       Table.SELECTION_ALL,
  //       Table.SELECTION_INVERT,
  //       Table.SELECTION_NONE,
  //       {
  //         key: 'odd',
  //         text: 'Select Odd Row',
  //         onSelect: changableRowKeys => {
  //           let newSelectedRowKeys = [];
  //           newSelectedRowKeys = changableRowKeys.filter((key, index) => {
  //             if (index % 2 !== 0) {
  //               return false;
  //             }
  //             return true;
  //           });
  //           setSelectedRowKeys(newSelectedRowKeys);
  //         },
  //       },
  //       {
  //         key: 'even',
  //         text: 'Select Even Row',
  //         onSelect: changableRowKeys => {
  //           let newSelectedRowKeys = [];
  //           newSelectedRowKeys = changableRowKeys.filter((key, index) => {
  //             if (index % 2 !== 0) {
  //               return true;
  //             }
  //             return false;
  //           });
  //           setSelectedRowKeys(newSelectedRowKeys);
  //         },
  //       },
  //     ],
  // }

  return (
    <>
      <div className="all_files_data_container">
        <Table bordered columns={columns} dataSource={data} />
      </div>
    </>
  )
}

export default AllFilesData
