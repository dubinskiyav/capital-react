import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import './capital.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Table, Button } from 'antd';
import reqwest from 'reqwest';

const { Header, Content, Footer } = Layout;

//var express = require('express')
//var cors = require('cors')
//var app = express()
//app.use(cors())

// id не надо
const columns = [
  {
    title: 'Наименование',
    dataIndex: 'name',
  },
  {
    title: 'Сокращение',
    dataIndex: 'short_name',
  },
];

// В key записываем id
const data = [
  {key: 1, name: "1 Метр", short_name: "м"},
  {key: 2, name: "1 Килограмм", short_name: "кг"},
  {key: 3, name: "1 Секунда", short_name: "с"},
  {key: 4, name: "1 Ампер", short_name: "А"},
  {key: 5, name: "1 Кельвин", short_name: "К"},
  {key: 6, name: "1 Моль", short_name: "моль"},
  {key: 7, name: "1 Кандела", short_name: "кд"},
];


class Unitmeasure extends React.Component {
  state = {
    data: data,
    data1: [],
    selectedRowKeys: [], // Check here to configure the default column
    gridDataOption: {
      pageNumber: 0,
      pageSize: 7,
      sort: [{fieldName: "id"}]
    },
    loading: false,
  };
  start = () => {

    this.setState({ loading: true });
    // ajax request after empty completing
    console.log("Unitmeasure - start");
    reqwest({
      url: 'http://localhost:8080/unitmeasure/json',
      contentType: "application/json; charset=utf-8",
      method: 'post',
      type: 'json',
      data:JSON.stringify(this.state.gridDataOption)
    }).then(data => {
      console.log(data);
      this.setState({
        loading: false,
        data: data
      });
      console.log("Unitmeasure - setState Ok");
    });

    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  render() {
    const { data, loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className="CapitalModule">
        <div className="Unitmeasure">
        <Layout>
            <Header>Справочник единиц измерения</Header>
            <Content>
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
                    Reload
                  </Button>
                  <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                  </span>
                </div>
                <Table 
                  rowSelection={rowSelection} 
                  columns={columns} 
                  dataSource={data}

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
