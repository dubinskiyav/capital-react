import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import './capital.css';
import { Layout } from 'antd';
import { Table, Button } from 'antd';
import reqwest from 'reqwest';

const { Header, Content, Footer } = Layout;

// id не надо
const columns = [
  {
    title: 'Наименование',
    dataIndex: 'name',
    sorter: true,
    width1: '20%',
  },
];

class Measure extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    selectedRowKeys: [], 
    loading: false,
    totalMax: 0, // Наибольшее количесвто выбранных записей
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
    var total = (gridDataOption.pageNumber + 2) * gridDataOption.pageSize;
    if (total < this.state.totalMax) {
      total = this.state.totalMax;
    } else {
      this.state.totalMax = total;
    }
    // ajax request after empty completing
    reqwest({
      url: 'http://localhost:8080/measure/json',
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
          total: total,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
        selectedRowKeys: [], // снимем все отметки
      });
      console.log("fetch - finish");
    });
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    console.log("render - start");
    const { data, pagination, loading, selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className="CapitalModule">
        <div className="Measure">
        <Layout>
            <Header>Справочник мер измерения</Header>
            <Content>
              <div>
                <Table 
                  rowSelection={rowSelection} 
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
export default Measure;
