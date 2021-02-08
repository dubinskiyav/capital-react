import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import './capital.css';
import { Layout } from 'antd';
import { Table } from 'antd';
import reqwest from 'reqwest';
import { Space } from 'antd';

const { Header, Content, Footer } = Layout;

// id не надо
const columns = [
  {
    title: 'Наименование',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Сокращение',
    dataIndex: 'shortName',
    sorter: true,
    width: '10%',
  },
];

class Unitmeasure extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };
  // размещаем побочные эффекты
  componentDidMount() {
    console.log("componentDidMount - start")
    const { pagination } = this.state;
    this.fetch({ pagination });
    console.log("componentDidMount - finish")
  }
  handleTableChange = (pagination, filters, sorter) => {
    console.log("handleTableChange - start");
    console.log("sorter.field=" + sorter.field);
    console.log("sorter.order=" + sorter.order);
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
    console.log("handleTableChange - finish");
  };

  fetch = (params = {}) => {
    console.log("fetch - start");
    this.setState({ loading: true });
    const gridDataOption = {
      pageNumber: params.pagination.current - 1,
      pageSize: params.pagination.pageSize,
      sort: [{fieldName: "id"}]
    };
    if (params.sortField) {
      console.log("params.sortField=" + params.sortField);
      gridDataOption.sort[0].fieldName = params.sortField;
      if (params.sortOrder === "descend") {
        gridDataOption.sort[0].direction = 1;
        console.log("params.sortOrder=descend");
      }
    }
    // ajax request after empty completing
    reqwest({
      url: 'http://localhost:8080/unitmeasure/json',
      contentType: "application/json; charset=utf-8",
      method: 'post',
      type: 'json',
      data:JSON.stringify(gridDataOption)
    }).then(data => {
      //console.log(data);
      this.setState({
        loading: false,
        data: data,
        pagination: {
          ...params.pagination,
          total: 200,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
      console.log("fetch - finish");
    });
  };
  

  render() {
    console.log("render - start");
    const { data, pagination, loading } = this.state;
    return (
      <div className="CapitalModule">
        <div className="Unitmeasure">
        <Layout>
            <Header>Справочник единиц измерения</Header>
            <Content>
              <div>
                <Table 
                  columns={columns} 
                  dataSource={data}
                  pagination={pagination}
                  loading={loading}
                  onChange={this.handleTableChange}
                  rowKey="id"
                />
              </div>
            </Content>
            <Footer>Низ Капитал</Footer>
          </Layout>
        </div>
      </div>
    );
  }
}
export default Unitmeasure;
