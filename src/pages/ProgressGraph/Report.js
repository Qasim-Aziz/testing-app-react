/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-unneeded-ternary */

import React from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Affix,
  Table
} from 'antd'
import { connect } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import { gql } from 'apollo-boost'
import reqwest from 'reqwest';
import client from '../../apollo/config'

var moment = require('moment');

const { Title, Text } = Typography

const columns = [
  {
    title: 'Domain',
    dataIndex: 'targetId.domain.domain',
    render: domain => (
      <>
        {domain ? domain : 'Other'}
      </>
    ),
    width: 150,
  },
  {
    title: 'Target Name',
    dataIndex: 'targetAllcatedDetails.targetName',
    width: 200,
  },
  {
    title: 'Stimulus',
    dataIndex: 'sd.edges',
    render: record => (
      <>
        {record && record.map(tag => {
          return (
            tag.node.sd
          )
        })}
      </>
    ),
  },
  {
    title: 'Steps',
    dataIndex: 'steps.edges',
    render: record => (
      <>
        {record && record.map(tag => {
          return (
            tag.node.step
          )
        })}
      </>
    ),
  },
  {
    title: 'Baseline Date',
    dataIndex: 'targetAllcatedDetails.dateBaseline',
    render: date => moment(date).format('YYYY-MM-DD')
  },
  {
    title: 'In-Therapy Date',
    dataIndex: 'intherapyDate',
  },
  {
    title: 'Mastery date',
    dataIndex: 'masterDate',
  }
];

class Report extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
    };
  }


  componentWillMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }


  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  fetch = (params = {}) => {

    let { start_date, end_date, selectedprogram, domainSelected, statusselected } = this.props;

    start_date = moment(start_date).format('YYYY-MM-DD');
    end_date = moment(end_date).format('YYYY-MM-DD');
    const studentId = localStorage.getItem('studentId')

    client
      .query({
        query: gql`{
            domainMastered(studentId: ${studentId}, dateGte:"${start_date}", dateLte:"${end_date}", programArea:"${selectedprogram}", targetStatus:"${statusselected}")
            {
            totalCount
            target {
               id
               targetId
                {
                    domain
                    {
                        id
                        domain
                    }
                }
                sd {
                    edges {
                    node {
                        id
                        sd
                    }
                    }
                }
                steps {
                    edges {
                    node {
                        id
                        step
                    }
                    }
                }
               targetAllcatedDetails
                {
                    targetName
                    dateBaseline
                }
               intherapyDate
               masterDate
            }
            }
        }`,
        fetchPolicy:'no-cache'
      })
      .then(result => {
        this.setState({
          loading: false,
          data: result.data.domainMastered.target,
          pagination: {
            ...params.pagination,
            total: result.data.domainMastered.totalCount
          },
        });
      })
  };


  render() {
    const textStyle = {
      fontSize: '16px',
      lineHeight: '19px',
    }

    const { data, pagination, loading } = this.state;


    return (
      <>
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />
      </>
    )
  }
}

export default Report
