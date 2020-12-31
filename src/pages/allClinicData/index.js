/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-unneeded-ternary */
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Button, Popconfirm, Drawer, Form, Input, Select, notification } from 'antd'
import DataTable from 'react-data-table-component'
import Authorize from 'components/LayoutComponents/Authorize'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import client from '../../apollo/config'

const { Option } = Select

const layout = {
    labelCol: {
        span: 10
    },
    wrapperCol: {
        span: 10
    }
}
const tailLayout = {
    wrapperCol: {
        offset: 7,
        span: 14
    }
}

const CLINIC_QUERY = gql`
  query{
    clinicAllDetails{
            invoice
            totalLearners     
            activeLearners     
            lastMonthActiveLearners     
            researchParticipent     
            activeDays     
            peak     
            vbmapp     
            cogniable     
            lastLogin     
            status     
            details{
                id
                 schoolName
            }  
    } 
}
`



const AllClinicsData = () => {
    const { data, loading, error, refetch } = useQuery(CLINIC_QUERY);

    const [clinicsList, setClinicsList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleNew, setVisibleNew] = useState(false);

    const [selectedClinic, setSelectedClinic] = useState();
    const [peak, setPeak] = useState('');
    const [lastInvoice, setLastInvoice] = useState('');
    const [learnerPrice, setLearnerPrice] = useState('');
    const [researchPrice, setResearchPrice] = useState('');
    const [vbmpapp, setVbmapp] = useState('');



    useEffect(() => {
        if (data) {
            setClinicsList(data && data.clinicAllDetails ? data.clinicAllDetails : [])
        }
    }, [data])
    // console.log('clinicsList', ratesData);

    const customStyles = {
        header: {
            style: {
                maxHeight: '50px'
            }
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#ddd',
                backgroundColor: '#f5f5f5'
            }
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: '#ddd'
                },
                fontWeight: 'bold'
            }
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: '#ddd'
                },
                fontSize: '11px'
            }
        },
        pagination: {
            style: {
                position: 'absolute',
                top: '5px',
                right: '5px',
                borderTopStyle: 'none',
                minHeight: '35px'
            }
        },
        table: {
            style: {
                paddingBottom: '40px',
                top: '40px'
            }
        }
    }

    const closeTask = (e, status) => {
        console.log('close task ===> ', e, status)
        const val = status === "Active" ? false : true;

        return client
            .mutate({
                mutation: gql`mutation{
          updateSchool(input:{
            pk:"${e.details.id}",
            isActive:${val}})
                    {        
                      details{
                      id
                      schoolName
                      email
                      noLearner
                      country{
                      id
                      name
                      }
                      }
                      }
                    }`
            })
            .then(result => {
                refetch()
                notification.success({
                    message: "Clinic status Updated",
                    description: "Clinic status updated successfully",
                })
            })
            .catch(error1 => error1)
    }

    const updateCLinicRates = (e) => {
        e.preventDefault();
        return client
            .mutate({
                mutation: gql`mutation{    maintainClinicRates(input:{        pk:"${selectedClinic}"        clinic:"${selectedClinic}"        
        learnerPrice:${learnerPrice}        researchParticipantPrice:${researchPrice}   
           lastInvoicePrice:${lastInvoice}     
            peakPrice:${peak}     
            vbmappPrice:${vbmpapp}
                })
                 {       
                   details{          
                     id  
                       }  
                 }
                }`
            })
            .then(result => {
                refetch()
                notification.success({
                    message: "Clinic Rates Updated",
                    description: "Clinic rates updated successfully",
                })
            }
            )
            .catch(error1 => error1)
    }



    const getRates = () => {

        return client
            .query({
                query: gql`
query{
      getClinicRates(clinic:"${selectedClinic}")
      {
            edges
          {
            node
            {             
              id
              learnerPrice
              researchParticipantPrice
              lastInvoicePrice               
              peakPrice                
              vbmappPrice                
              clinic
              {
              id
              schoolName
              }
            }        
          }    
      }
}
`
            })
            .then(result => {

                if (result.data) {
                    const clinicRates = result.data.getClinicRates && result.data.getClinicRates.edges;

                    if (clinicRates.length > 0) {
                        setPeak(clinicRates[0].node.peakPrice);
                        setVbmapp(clinicRates[0].node.vbmappPrice);
                        setLastInvoice(clinicRates[0].node.lastInvoicePrice);
                        setResearchPrice(clinicRates[0].node.researchParticipantPrice);
                        setLearnerPrice(clinicRates[0].node.learnerPrice);

                        setVisible(true);
                    }
                    else {
                        setPeak('');
                        setVbmapp('');
                        setLastInvoice('');
                        setResearchPrice('');
                        setLearnerPrice('');

                        setVisible(true);
                    }
                }

            })
            .catch(error1 => console.log("errors-", error1))

    }

    const columns = [
        {
            name: 'Name',
            sortable: true,
            minWidth: '250px',
            cell: row => (
                <Button
                    // onClick={() => this.info(row)}
                    type='link'
                    style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
                >
                    {row.details && row.details.schoolName}
                </Button>
            )
        },
        {
            name: 'Total Learners',
            selector: 'totalLearners',
            sortable: true,
            maxWidth: '70px',
            minWidth: '70px'
        },
        {
            name: 'Active Learners',
            selector: 'activeLearners',
            sortable: true,
            maxWidth: '70px',
            minWidth: '70px'
        },
        {
            name: 'Last Month Active Learners',
            selector: 'lastMonthActiveLearners',
            sortable: true,
            maxWidth: '100px',
            minWidth: '100px'
        },
        {
            name: 'Research Participants',
            selector: 'researchParticipent',
            sortable: true,
            maxWidth: '100px',
            minWidth: '100px'
        },
        {
            name: 'Peak',
            selector: 'peak',
            sortable: true,
            maxWidth: '70px',
            minWidth: '70px'
        },

        {
            name: 'VBM App',
            selector: 'vbmapp',
            maxWidth: '80px',
            minWidth: '80px'
        },
        {
            name: 'Cogniable',
            selector: 'cogniable',
            maxWidth: '80px',
            minWidth: '80px'
        },
        {
            name: 'Invoices',
            selector: 'invoice',
            maxWidth: '80px',
            minWidth: '80px',
            cell: row => (

                <Button
                    onClick={() => setVisibleNew(true)}
                    type='link'
                    style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
                >
                    {row.invoice}
                </Button>

            )
        },
        {
            name: 'Last Login',
            selector: 'lastLogin',
            maxWidth: '100px',
            minWidth: '100px'
        },
        {
            name: 'Status',
            selector: 'status',
            maxWidth: '120px',
            minWidth: '120px',
            cell: e => (
                <span>
                    <span>{e.status}</span>
                    <Popconfirm
                        title='Sure to deactivate the clinic?'
                        onConfirm={() => closeTask(e, e.status)}
                    >
                        <Button type='link'>
                            {e.status !== 'Active'
                                ? <CheckCircleOutlined style={{ color: 'green' }} />
                                : <CloseCircleOutlined style={{ color: 'red' }} />}
                        </Button>
                    </Popconfirm>
                </span>
            )
        },
        {
            name: 'Action',
            sortable: true,
            minWidth: '100px',
            cell: row => (

                <Button
                    onClick={() => {
                        setSelectedClinic(row.details.id);
                        getRates();

                    }}
                    type='link'
                    style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
                >
                    Maintain Rates
        </Button>

            )
        }
    ]

    return (
        <Authorize roles={['superUser']} redirect to='/404'>

            <Drawer
                title='Maintain Rates'
                width='40%'
                placement='right'
                closable='true'
                onClose={() => setVisible(false)}
                visible={visible}
            >
                <Form {...layout} name='control-ref' onSubmit={e => updateCLinicRates(e)}>
                    <Form.Item label='Price / Learner' style={{ marginBottom: '5px' }} size='small'>
                        <Input size='small' style={{ borderRadius: 0 }} value={learnerPrice} onChange={(e) => setLearnerPrice(e.target.value)} />
                    </Form.Item>
                    <Form.Item label='Research Participants' style={{ marginBottom: '5px' }} size='small'>
                        <Input size='small' style={{ borderRadius: 0 }} value={researchPrice} onChange={(e) => setResearchPrice(e.target.value)} />
                    </Form.Item>
                    <Form.Item label='Last Invoice Amount' style={{ marginBottom: '5px' }} size='small'>
                        <Input size='small' style={{ borderRadius: 0 }} value={lastInvoice} onChange={(e) => setLastInvoice(e.target.value)} />
                    </Form.Item>
                    <Form.Item label='PEAK' style={{ marginBottom: '5px' }} size='small'>
                        <Input size='small' style={{ borderRadius: 0 }} value={peak} onChange={(e) => setPeak(e.target.value)} />
                    </Form.Item>

                    <Form.Item label='VBMAPP' style={{ marginBottom: '5px' }} size='small'>
                        <Input size='small' style={{ borderRadius: 0 }} value={vbmpapp} onChange={(e) => setVbmapp(e.target.value)} />
                    </Form.Item>
                    <Form.Item label='Status' style={{ marginBottom: '5px' }} size='small'>
                        <Select mode='multiple' placeholder='Select Status' allowClear size='small' style={{ borderRadius: 0 }}>
                            <Option value='created'>Created</Option>
                            <Option value='paid'>Paid</Option>
                            <Option value='due'>Due</Option>
                            <Option value='overdue'>Over Due</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type='primary' htmlType='submit' size='small'>
                            Submit
            </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title='Invoices'
                width='40%'
                placement='right'
                closable='true'
                onClose={() => setVisibleNew(false)}
                visible={visibleNew}
            >
                <div>
                    <table>
                        <tr>
                            <td>Invoice 1</td>
                            <td><Input /></td>
                            <td>
                                <Select mode='default' placeholder='Select Status' allowClear style={{ width: 150 }}>
                                    <Option value=''>Select Status</Option>
                                    <Option value='created'>Created</Option>
                                    <Option value='paid'>Paid</Option>
                                    <Option value='due'>Due</Option>
                                    <Option value='overdue'>Over Due</Option>
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <td>Invoice 1</td>
                            <td><Input /></td>
                            <td>
                                <Select mode='default' placeholder='Select Status' allowClear style={{ width: 150 }}>
                                    <Option value=''>Select Status</Option>
                                    <Option value='created'>Created</Option>
                                    <Option value='paid'>Paid</Option>
                                    <Option value='due'>Due</Option>
                                    <Option value='overdue'>Over Due</Option>
                                </Select>
                            </td>
                        </tr>
                    </table>
                </div>
            </Drawer>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0px 10px',
                    backgroundColor: '#FFF',
                    boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)'
                }}
            >
                <div style={{ padding: '5px 0px' }}>
                    {/* <Button onClick={() => this.showDrawerFilter()} size="large">
            <FilterOutlined />
          </Button>

          {this.state.filterName ||
            this.state.filterCaseManager ||
            this.state.filterGender ||
            this.state.filterCategory ||
            this.state.filterLocation ? (
              <Button
                type="link"
                style={{ marginLeft: '10px', color: '#FEBB27' }}
                onClick={() =>
                  this.setState({
                    filterName: '',
                    filterCaseManager: '',
                    filterGender: '',
                    filterCategory: '',
                    filterLocation: '',
                  })
                }
                size="small"
              >
                Clear Filters
                <CloseCircleOutlined />
              </Button>
            ) : null} */}
                </div>
                <div>
                    <span style={{ fontSize: '25px', color: '#000' }}>All Clinics Data</span>
                </div>
                <div style={{ padding: '5px 0px' }}>
                    {/* <Dropdown overlay={menu} trigger={['click']}>
            <Button style={{ marginRight: '10px' }} type="link" size="large">
              <CloudDownloadOutlined />{' '}
            </Button>
          </Dropdown>

          <Button onClick={this.showDrawer} type="primary">
            <PlusOutlined /> ADD LEARNER
            </Button> */}
                </div>
            </div>

            <div className='row'>
                <div className='col-sm-12'>
                    <div style={{ margin: '5px', marginBottom: '50px' }}>
                        <DataTable
                            title='All Clinics List'
                            columns={columns}
                            theme='default'
                            dense='true'
                            pagination='true'
                            data={clinicsList}
                            customStyles={customStyles}
                            noHeader='true'
                            paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
                        />
                    </div>
                </div>

            </div>
        </Authorize>
    )
}

export default AllClinicsData
