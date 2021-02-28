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
// import TicketsForm from './TicketsForm'
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

const TICKETS_QUERY = gql`
    query {
        tickets {
            edges {
                node {
                    id
                    subject
                    description
                    createdAt
                    createdBy{
                        id
                        username
                    }
                    status{
                        id
                        status
                    }
                    priority{
                        id
                        priority
                    }
                    service{
                        id
                        service
                    }
                    assignTo{
                        id
                        team
                    }
                }
            }
        }
    }`

const AllTicketsData = () => {
    const { data, loading, error, refetch } = useQuery(TICKETS_QUERY);

    const [TicketsList, setTicketsList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleNew, setVisibleNew] = useState(false);

    const [selectedTicket, setselectedTicket] = useState('');

    const [TicketSubject, setTicketSubject] = useState('');
    const [TicketDescription, setTicketDescription] = useState('');
    const [TicketPriority, setTicketPriority] = useState('');
    const [TicketService, setTicketService] = useState('');
    const [TicketAssignTo, setTicketAssignTo] = useState('');
    const [TicketStatus, setTicketStatus] = useState('');



    useEffect(() => {
        if (data) {
            setTicketsList(data && data.tickets.edges ? data.tickets.edges : [])
        }
    }, [data]);

    useEffect(() => {
        if (selectedTicket) {
            getTicketDetails();
        }
    })

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

    const closeTicket = (e, status) => {

        const val = status;

        return client
            .mutate({
                mutation: gql`mutation{
                    updateTicket(input:{
                        pk:"${e.node.id}",
                        status:"${val}"
                    }){
                        ticket{
                            id
                            status{
                                id
                                status
                            }
                        }
                    }
                }`
            })
            .then(result => {
                refetch()
                notification.success({
                    message: "Ticket Closed Updated",
                    description: "Ticket closed successfully",
                })
            })
            .catch(error1 => error1)
    }

    const updateTicketDetails = (e) => {
        e.preventDefault();
        return client
            .mutate({
                mutation: gql`
                mutation {
                    updateTicket(input:{
                        pk:"${selectedTicket}"
                        subject:"${TicketSubject}", 
                        description:"${TicketDescription}", 
                        priority:"${TicketPriority}", 
                        service:"${TicketService}", 
                        assignTo:"${TicketAssignTo}",
                        status:"${TicketStatus}"
                    }){
                        ticket{
                            id
                            subject
                            description
                            priority{
                                id
                                priority
                            }
                            service{
                                id
                                service
                            }
                            assignTo{
                                id
                                team
                            }
                            status{
                                id
                                status
                            }
                        }
                    }
                }`
            })
            .then(result => {
                refetch();
                notification.success({
                    message: "Ticket Updated",
                    description: "Support ticket updated successfully",
                });
                setVisible(false);
            }
            )
            .catch(error1 => error1)
    }

    const getTicketDetails = () => {
        return client
            .query({
                query: gql`
                    query {
                        ticket(id:"${selectedTicket}") {
                            id
                            subject
                            createdAt
                            description
                            priority{
                                id
                                priority
                            }
                            service{
                                id
                                service
                            }
                            assignTo{
                                id
                                team
                            }
                            status{
                                id
                                status
                            }
                            createdBy{
                                id
                                username
                            }
                        }
                    }`
            })
            .then(result => {
                if (result.data) {
                    const ticketDetails = result.data && result.data.ticket;

                    if (ticketDetails) {
                        console.clear();
                        console.log(ticketDetails);

                        setTicketSubject(ticketDetails.subject);
                        setTicketDescription(ticketDetails.description);
                        setTicketPriority(ticketDetails.priority && ticketDetails.priority.id);
                        setTicketService(ticketDetails.service && ticketDetails.service.id);
                        setTicketAssignTo(ticketDetails.assignTo && ticketDetails.assignTo.id);
                        setTicketStatus(ticketDetails.status && ticketDetails.status.id);

                        // setVisible(true);
                    }
                }
            })
            .catch(error1 => console.log("errors-", error1))

    }
    const columns = [
        {
            name: 'Created By',
            sortable: true,
            minWidth: '250px',
            maxWidth: '250px',
            cell: row => (
                <Button
                    onClick={() => {
                        setselectedTicket(row.node.id);
                        setVisible(true);
                        // getTicketDetails();
                    }}
                    type='link'
                    style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
                >
                    {row.node && row.node.createdBy.username}
                </Button>
            )
        },
        {
            name: 'Subject',
            sortable: true,
            minWidth: '100px',
            maxWidth: '150px',
            cell: row => (
                <span>{row.node && row.node.subject}</span>
            )
        },
        {
            name: 'Description',
            sortable: true,
            minWidth: '200px',
            maxWidth: '250px',
            cell: row => (
                <span>{row.node && row.node.description}</span>
            )
        },
        {
            name: 'Priority',
            sortable: true,
            maxWidth: '100px',
            minWidth: '100px',
            cell: row => (
                <span>{row.node && row.node.priority && row.node.priority.priority}</span>
            )
        },
        {
            name: 'Service',
            sortable: true,
            maxWidth: '150px',
            minWidth: '100px',
            cell: row => (
                <span>{row.node && row.node.service && row.node.service.service}</span>
            )
        },

        {
            name: 'Assign To',
            maxWidth: '150px',
            minWidth: '100px',
            cell: row => (
                <span>{row.node && row.node.assignTo && row.node.assignTo.team}</span>
            )
        },
        {
            name: 'Date',
            maxWidth: '250px',
            minWidth: '200px',
            cell: row => (
                <span>{row.node && row.node.createdAt}</span>
            )
        },
        {
            name: 'Status',
            maxWidth: '150px',
            minWidth: '120px',
            cell: e => (
                <span>
                    <span>{e.node && e.node.status && e.node.status.status}</span>
                    <Popconfirm
                        title='Sure to close the ticket?'
                        onConfirm={() => closeTicket(e, "VGlja2V0U3RhdHVzVHlwZTo0")}
                    >
                        <Button type='link'>
                            {e.node && e.node.status && e.node.status.status !== 'Closed'
                                ? <CheckCircleOutlined style={{ color: 'green' }} />
                                : <CloseCircleOutlined style={{ color: 'red' }} />}
                            {e.status && e.status.status}
                        </Button>
                    </Popconfirm>
                </span>
            )
        },
    ]

    return (
        <Authorize roles={['superUser']} redirect to='/404'>

            <Drawer
                title='Update Ticket'
                width='40%'
                placement='right'
                closable='true'
                onClose={() => setVisible(false)}
                visible={visible}
            >
                {/* <TicketsForm /> */}
                <Form {...layout} name='control-ref' onSubmit={e => updateTicketDetails(e)}>
                    <Form.Item label='Subject' style={{ marginBottom: '5px' }} size='small'>
                        <Input size='small' style={{ borderRadius: 0 }} value={TicketSubject} onChange={(e) => { setTicketSubject(e.target.value)}} />
                    </Form.Item>
                    <Form.Item label='Description' style={{ marginBottom: '5px' }} size='small'>
                        <Input size='small' style={{ borderRadius: 0 }} value={TicketDescription} onChange={(e) => setTicketDescription(e.target.value)} />
                    </Form.Item>
                    <Form.Item label='Priority' style={{ marginBottom: '5px' }} size='small'>
                        <Select placeholder='Select Priority' value={TicketPriority} size='small' style={{ borderRadius: 0 }}>
                            <Option value='VGlja2V0UHJpb3JpdHlUeXBlOjM='>Low</Option>
                            <Option value='VGlja2V0UHJpb3JpdHlUeXBlOjI='>Medium</Option>
                            <Option value='VGlja2V0UHJpb3JpdHlUeXBlOjE='>High</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='Service' style={{ marginBottom: '5px' }} size='small'>
                        <Select placeholder='Select Service' value={TicketService} size='small' style={{ borderRadius: 0 }}>
                            <Option value='VGlja2V0U2VydmljZVR5cGU6MQ=='>UI Issue</Option>
                            <Option value='VGlja2V0U2VydmljZVR5cGU6Mg=='>Technical Issue</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='Assign To' style={{ marginBottom: '5px' }} size='small'>
                        <Select placeholder='Assigned to' value={TicketAssignTo} size='small' style={{ borderRadius: 0 }}>
                            <Option value='VGlja2V0QXNzaWduVHlwZTox'>Technical Team</Option>
                            <Option value='VGlja2V0QXNzaWduVHlwZToy'>Clinical Team</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='Status' style={{ marginBottom: '5px' }} size='small'>
                        <Select placeholder='Status' value={TicketStatus} size='small' style={{ borderRadius: 0 }}>
                            <Option value='VGlja2V0U3RhdHVzVHlwZTox'>In Process</Option>
                            <Option value='VGlja2V0U3RhdHVzVHlwZToy'>Resolved</Option>
                            <Option value='VGlja2V0U3RhdHVzVHlwZToz'>Reopen</Option>
                            <Option value='VGlja2V0U3RhdHVzVHlwZTo0'>Closed</Option>
                            <Option value='VGlja2V0U3RhdHVzVHlwZTo1'>Pending Customer</Option>
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
                    justifyContent: 'center',
                    // justifyContent: 'space-between',
                    alignItems: 'center',
                    // padding: '0px 10px',
                    backgroundColor: '#FFF',
                    boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)'
                }}
            >
                <span style={{ fontSize: '25px', color: '#000' }}>All Support Tickets</span>
            </div>

            <div className='row'>
                <div className='col-sm-12'>
                    <div style={{ margin: '5px', marginBottom: '50px' }}>
                        { loading ? 'Loading...' : 
                        <DataTable
                            title='All Tickets List'
                            columns={columns}
                            theme='default'
                            dense='true'
                            pagination='true'
                            data={TicketsList}
                            customStyles={customStyles}
                            noHeader='true'
                            paginationRowsPerPageOptions={[10, 50, 100]}
                        />}
                    </div>
                </div>

            </div>
        </Authorize>
    )
}

export default AllTicketsData
