import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import './capital.css';
import { Layout, Menu } from 'antd';
import { Table } from 'antd';
import reqwest from 'reqwest';
import { PlusOutlined, EditOutlined, CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import Refresh from './icons/Refresh';
import { notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const { SubMenu } = Menu;

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
    sorters: [{fieldName: "id", sortOrder: "ascend"}],
    selectedRowKeys: [], 
    loading: false,
    totalMax: 0, // Наибольшее количесвто выбранных записей
    currentMenu: null, // Текущее меню
  };
  // размещаем побочные эффекты
  componentDidMount() {
    console.log("componentDidMount - start")
    const { pagination } = this.state;
    this.fetch({ pagination });
    console.log("componentDidMount - finish")
  }
  handleTableChange = (pagination, filters, sorter) => {
    let { sorters } = this.state;
    if (sorter.field) {
      sorters = [
        {
          fieldName: sorter.field,
          sortOrder: sorter.order
        }
      ];
    }
    this.fetch({
      sorters,
      pagination,
      ...filters,
    });
  };
  fetch = (params = {}) => {
    console.log("fetch - start");
    this.setState({ loading: true });
    const gridDataOption = {
      pageNumber: params.pagination.current - 1,
      pageSize: params.pagination.pageSize,
      sort: [{fieldName: "id"}]
    };
    // Из массива
    if (params.sorters) {
      gridDataOption.sort[0].fieldName = params.sorters[0].fieldName;
      if (params.sorters[0].sortOrder === "descend") {
        gridDataOption.sort[0].direction = 1;
      }
      this.setState({sorters:params.sorters} );
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

  deleteRows() {
    const { selectedRowKeys } = this.state;
    let ids = selectedRowKeys.join(',');
    console.log('Deleting records ', ids, ' ...');
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:8080/measure/del/' + ids,
      contentType: "application/json; charset=utf-8",
      method: 'post',
      type: 'json',
    }).then((responseJson) => {
      this.setState({
        loading: false
      });
      console.log('responseJson=', responseJson);
      const { errorCode } = responseJson;
      if (errorCode) { // Ошибка
        console.log('errorCode=', errorCode);
        const { errorMessage, fieldErrors } = responseJson;
        const description = errorMessage + fieldErrors.id;
        notification.error({
          message:"Ошибка при удалении записей",
          description: ({description})
        });
        } else {
          console.log('Удалили');
          this.refreshData();
          notification.success({
            message:"Успешно",
            description:"Удаление записей выполнено успешно"
          });
      }
      return;
    }).catch((error) => {
      throw (error);
    });
  }

  refreshData() {
    // Перевыборка текущей страницы
    console.log('refreshData');
    const { pagination, sorters } = this.state;
    this.fetch({pagination, sorters});
  }

  handleMenuClick = e => {
    console.log('click ', e);
    const { key } = e;
    this.setState({ currentMenu: key });
    switch(key) {
      case 'delete':
        this.deleteRows();
        break;
      case 'refresh':
        notification.open({
          message: 'Notification Title',
          description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
        break;
        case 'print':
          notification.success({
            message:"Успешно",
            description:"Удаление записей выполнено успешно"
          });
            break;
        default:
        console.log('Не реализовано ');
    }
  };

  render() {
    console.log("render - start");
    console.log("state=", this.state);
    const { data, pagination, loading, selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const { currentMenu } = this.state; // Текущее меню
    return (
      <div className="CapitalModule">
        <div className="Measure">
        <Layout>
            <Header>
            <div>
                Справочник мер измерения
            </div>
            </Header>
            <div>
                <Menu onClick={this.handleMenuClick} selectedKeys={[currentMenu]} mode="horizontal">
                  <SubMenu key="Command" title="Команды">
                      <Menu.Item key="add" icon={<PlusOutlined />}>Добавить</Menu.Item>
                      <Menu.Item key="edit" icon={<EditOutlined />}>Изменить</Menu.Item>
                      <Menu.Item key="delete" icon={<CloseOutlined />}>Удалить</Menu.Item>
                      <Menu.Item key="refresh" icon={<Refresh />}>Обновить</Menu.Item>
                      <Menu.Item key="print" icon={<PrinterOutlined />}>Печать</Menu.Item>
                  </SubMenu>
                  <SubMenu key="Spravka" title="Справка">
                    <Menu.Item key="help">Помощь</Menu.Item>
                      <Menu.Item key="about">
                        <a href="http://www.gelicon.biz/" target="_blank" rel="noopener noreferrer">
                          О программе
                        </a>
                      </Menu.Item>
                  </SubMenu>
                </Menu>
              </div>
            <Content>
              <div>
                <Table 
                  rowSelection={rowSelection} 
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
export default Measure;
