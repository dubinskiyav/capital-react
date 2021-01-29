import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import './capital.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Table, Tag, Space } from 'antd';
import { Button } from 'antd';

const { Header, Content, Footer } = Layout;

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: 'Наименование',
    dataIndex: 'name',
  },
  {
    title: 'Сокращение',
    dataIndex: 'short_name',
  },
];

const data = [
  {id: 1, name: "Метр", short_name: "м"},
  {id: 2, name: "Килограмм", short_name: "кг"},
  {id: 3, name: "Секунда", short_name: "с"},
  {id: 4, name: "Ампер", short_name: "А"},
  {id: 5, name: "Кельвин", short_name: "К"},
  {id: 6, name: "Моль", short_name: "моль"},
  {id: 7, name: "Кандела", short_name: "кд"},
];


class Unitmeasure extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
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
    const { loading, selectedRowKeys } = this.state;
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
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
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
