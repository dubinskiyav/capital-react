import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import './capital.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Table, Button } from 'antd';
import reqwest from 'reqwest';

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
      pageSize: 7,
    },
    selectedRowKeys: [], // Check here to configure the default column
    gridDataOption: {
      pageNumber: 0,
      pageSize: 7,
      sort: [{fieldName: "id"}]
    },
    loading: false,
  };
  // размещаем побочные эффекты
  componentDidMount() {
    console.log("componentDidMount - start")
    const { pagination } = this.state;
    this.state.gridDataOption.pageNumber = pagination.current - 1;
    this.state.gridDataOption.pageSize = pagination.pageSize;
    this.fetch({ pagination });
    console.log("componentDidMount - finish")
  }
  handleTableChange = (pagination, filters, sorter) => {
    console.log("handleTableChange - start");
    this.state.gridDataOption.pageNumber = pagination.current - 1;
    this.state.gridDataOption.pageSize =  pagination.pageSize;
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
    // ajax request after empty completing
    reqwest({
      url: 'http://localhost:8080/unitmeasure/json',
      contentType: "application/json; charset=utf-8",
      method: 'post',
      type: 'json',
      data:JSON.stringify(this.state.gridDataOption)
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
