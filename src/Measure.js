import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import './capital.css';
import { Layout, Menu, Modal } from 'antd';
import { Table } from 'antd';
import reqwest from 'reqwest';
import { PlusOutlined, EditOutlined, CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import Refresh from './icons/Refresh';
import { notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import * as globalSettings from "./const";
import { useCallback } from 'react';

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

const Measure = (props)=>{
  let [currentMenu, setCurrentMenu] = React.useState("null");
  let [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  let [data,setData] = React.useState(null);
  let [loading,setLoading] = React.useState(false);
  let [pagination,setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: null,
  });
  let [sorters, setSorters] = React.useState([{
    fieldName: "id", 
    sortOrder: "ascend"
  }]);
  let [totalMax, setTotalMax] = React.useState(0); // Наибольшее количесвто выбранных записей


  const deleteRows = () => {
    if (!(selectedRowKeys.length > 0)) {
      notification.info({
        message:"Нет записей для удаления",
        description: "Отметьте одну или несколько записей для удаления"
      });
      return;
    }
    let ids = selectedRowKeys.join(',');
    console.log('Deleting records ', ids, ' ...');
    setLoading(true);
    reqwest({
      url: globalSettings.startURL + 'measure/del/' + ids,
      contentType: "application/json; charset=utf-8",
      method: 'post',
      type: 'json',
    }).then((responseJson) => {
      console.log('responseJson=', responseJson);
      const { errorCode } = responseJson;
      if (errorCode) { // Ошибка
        console.log('errorCode=', errorCode);
        const { errorMessage, fieldErrors } = responseJson;
        const description = errorMessage + fieldErrors.id;
        notification.error({
          message:"Ошибка при удалении записей",
          description: (description)
        });
        } else {
          console.log('Удалили');
          refreshData();
          const description = "Удаление " + selectedRowKeys.length + " записей выполнено успешно";
          notification.success({
            message:"Успешно",
            description: (description)
          });
      }
      setLoading(false);
      return;
    }).catch((error) => {
      setLoading(false);
      throw (error);
    });
    setLoading(false);
  }

  const handleMenuClick = e => {
    console.log('click ', e);
    const { key } = e;
    currentMenu = key;
    setCurrentMenu(setCurrentMenu);
    switch(key) {
      case 'add':
        console.log('add');
        Modal.confirm({
          title: 'Добавление меры измерения',
          icon: <ExclamationCircleOutlined />,
          content: "Добавление",
          okText: 'Добавить',
          cancelText: 'Отменить',
          onOk:()=>{
            console.log('add Ok');
          }
        });
        break;
      case 'delete':
        if (!(selectedRowKeys.length > 0)) {
          notification.info({
            message:"Нет записей для удаления",
            description: "Отметьте одну или несколько записей для удаления"
          });
          return;
        }
        const content = "Вы действительно хотите удалить " + selectedRowKeys.length + " записей?";
        Modal.confirm({
          title: 'Подтверждение удаления',
          icon: <ExclamationCircleOutlined />,
          content: (content),
          okText: 'Да, конечно!',
          cancelText: 'Нет, я ошибся',
          onOk:()=>{
            deleteRows();
          }
        });
        break;
      case 'refresh':
        refreshData();
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

  console.log('Measure return');

  const onSelectChange = selectedRowKeysNew => {
    setSelectedRowKeys( selectedRowKeysNew );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // При смене сортировки или страницы или фильтра
  const handleTableChange = (paginationNew, filters, sorter) => {
    console.log('handleTableChange - start');
    console.log('paginationNew.current=' + paginationNew.current);
    console.log('pagination.current=' + pagination.current);
    console.log('pagination.pageSize=' + pagination.pageSize);
    if (sorter.field) {
      sorters = [{
        fieldName: sorter.field, 
        sortOrder: sorter.order
      }];
      setSorters(sorters);
    }  
    pagination = paginationNew;
    setPagination(pagination);
    refreshData();
    console.log('handleTableChange - finish');
  };

  // Перевыборка
  const refreshData = useCallback(() => {
    // Перевыборка текущей страницы
    console.log('refreshData - start');
    setLoading(true);
    const gridDataOption = {
      pageNumber: pagination.current - 1,
      pageSize: pagination.pageSize,
      sort: [{fieldName: "id"}]
    };
    // Из массива
    if (sorters) {
      gridDataOption.sort[0].fieldName = sorters[0].fieldName;
      if (sorters[0].sortOrder === "descend") {
        gridDataOption.sort[0].direction = 1;
      }
    }
    let total = (gridDataOption.pageNumber + 2) * gridDataOption.pageSize;
    if (total < totalMax) {
      total = totalMax;
    } else {
      setTotalMax(total);
    }
    reqwest({
      url: globalSettings.startURL + "measure/json",
      contentType: "application/json; charset=utf-8",
      method: 'post',
      type: 'json',
      data:JSON.stringify(gridDataOption)
    }).then(dataNew => {
      setLoading(false);
      setData(dataNew);
      setPagination({...pagination, total:  total});
      setSelectedRowKeys([]);
    });
    console.log('refreshData - finish');
  }, [pagination, sorters, totalMax])

  // Эффект - первая выборка
  React.useEffect(() => {
    console.log("useEffect - start")
    if(!data) {
      setData([]); // важно, иначе начальный refresh выполняется несколько раз
      refreshData();
    }
    console.log("useEffect - finish")
  }, [data, refreshData]);

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
              <Menu onClick={handleMenuClick} selectedKeys={[currentMenu]} mode="horizontal">
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
                loading={loading}
                rowSelection={rowSelection} 
                columns={columns} 
                dataSource={data}
                pagination={pagination}
                onChange={handleTableChange}
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


export default Measure;

// https://medium.com/@alef.duarte/using-ant-design-form-inside-a-modal-in-react-stateless-functional-component-634f33357c80
