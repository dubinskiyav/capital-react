import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import './capital.css';
import { Layout, Menu, Modal,Form } from 'antd';
import { Table } from 'antd';
import reqwest from 'reqwest';
import { PlusOutlined, EditOutlined, CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import Refresh from './icons/Refresh';
import { notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import * as globalSettings from "./const";
import MeasureForm from "./MeasureForm";


// URI для использования формой добавления/изменения
const URI_ROOT = globalSettings.startURL + "measure"
const URI_SELECT = URI_ROOT + "/json"
const URI_ADD = URI_ROOT + "/add"
const URI_UPD = URI_ROOT + "/upd" // для выборки записи по id
const URI_POST = URI_ROOT + "/post"


const { Header, Content, Footer } = Layout;

const { SubMenu } = Menu;

// Описание столбцов
// id не надо! - Его описать в key таблицы
const columns = [
  {
    title: 'Наименование',
    dataIndex: 'name',
    sorter: true,
    width1: '20%',
  },
];

/**
 * Компонент для меры измерения
 * @param {*} props 
 */
const Measure = ()=>{
  let [currentMenu, setCurrentMenu] = React.useState("null"); // Текущее выбранное меню - непонятно зачем
  let [selectedRowKeys, setSelectedRowKeys] = React.useState([]); // Отмеченные записи, изначально пустой
  let [data,setData] = React.useState(null); // Основной массив данных - пустой сначала
  let [loading,setLoading] = React.useState(false); // Момент загрузки данных для блокировки таблицы для действий
  let [pagination,setPagination] = React.useState({ // Пагинация таблицы, нумерация с 1
    current: 1,
    pageSize: 10,
    total: null, // общее количество считанных записей
  });
  let [sorters, setSorters] = React.useState([{ // Массив сортировки, 
    fieldName: "id",  // Изначально по id (без сортировки с пагинацией нельзя)
    sortOrder: "ascend"
  }]);
  let [totalMax, setTotalMax] = React.useState(0); // Наибольшее количесвто выбранных записей

  let [formVisible,setFormVisible] = React.useState(false); // Видимость формы ввода
  let [editorContext] = React.useState({ // Данные для формы добавления-изменения
    uriForAdd: URI_ADD,
    uriForUpd: URI_UPD,
    uriForPost: URI_POST,
  });
  const [form] = Form.useForm(); // для эффекта

  /**
   * Удаление записей
   */
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
    setLoading(true); // Блокируем отклики таблицы
    // запрос к REST API на удаление записей
    // globalSettings.startURL устанавливается в const.js
    reqwest({
      url: globalSettings.startURL + 'measure/del/' + ids,
      contentType: "application/json; charset=utf-8",
      method: 'post',
      type: 'json',
    }).then((responseJson) => {
      console.log('responseJson=', responseJson);
      const { errorCode } = responseJson;
      if (errorCode) { // Ошибка есть
        console.log('errorCode=', errorCode);
        const { errorMessage, fieldErrors } = responseJson;
        const description = errorMessage + fieldErrors.id;
        notification.error({
          message:"Ошибка при удалении записей",
          description: (description)
        });
        } else { // ошибки нет
          console.log('Удалили ' + ids);
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

  /**
   * Вызов формы добавления-изменения
   * @param {*} id 
   */
  const callForm = (id) => {
    console.log('calForm - id = ' + id);
    editorContext.id = id;
    setFormVisible(true); // Видимость формы
  }

  /**
   * Обработчик нажатия меню
   * @param {*} e 
   */
  const handleMenuClick = e => {
    console.log('click ', e);
    const { key } = e;
    currentMenu = key;
    setCurrentMenu(setCurrentMenu);
    switch(key) {
      case 'add':
        console.log('add');
        callForm(); // Вызовем форму без установленного параметра id
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

  /**
   * Сохранение отметки записей
   * @param {*} selectedRowKeysNew 
   */
  const onSelectChange = selectedRowKeysNew => {
    setSelectedRowKeys( selectedRowKeysNew );
  };

  /**
   * Отмеченные записи 
   */
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  /**
   * Обработчик смены параметров запроса из таблицы
   * @param {*} paginationNew // При смене пагинации
   * @param {*} filters // фильтра
   * @param {*} sorter  // сортировки
   */
  const handleTableChange = (paginationNew, filters, sorter) => {
    console.log('handleTableChange - start');
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

  /**
   * Основная перевыборка данных
   */
  const refreshData = () => {
    console.log('refreshData - start');
    setLoading(true);
    const gridDataOption = {
      pageNumber: pagination.current - 1,
      pageSize: pagination.pageSize,
      sort: [{fieldName: "id"}] // Сортировка по умолчанию
    };
    if (sorters) { // Сортировка установлена - переустановим
      gridDataOption.sort[0].fieldName = sorters[0].fieldName;
      if (sorters[0].sortOrder === "descend") {
        gridDataOption.sort[0].direction = 1;
      }
    }
    console.log('gridDataOption=' + JSON.stringify(gridDataOption));
    // Вычисляем total для таблицы
    let total = (gridDataOption.pageNumber + 2) * gridDataOption.pageSize;
    if (total < totalMax) {
      total = totalMax;
    } else {
      setTotalMax(total);
    }
    // запрос к REST API на выборку
    reqwest({
      url: globalSettings.startURL + "measure/json",
      contentType: "application/json; charset=utf-8",
      method: 'post',
      type: 'json',
      data:JSON.stringify(gridDataOption)
    })
      .then(dataNew => {
        setData(dataNew); // данные новые
        setPagination({...pagination, total:  total}); // переустановим total у таблицы
        setSelectedRowKeys([]); // обнулим отмеченные
      },
      // todo Сделать обработку ошибок
      (error) => {
        notification.error({
          message:"Ошибка при выборке за пределами программы",
          description: "error"
        });
        console.log('refreshData - error=' + error);
      }
    );
    setLoading(false);
    console.log('refreshData - finish');
  }

  /**
   * Используем побочный эффект для первоначальной выборки 
   */
  React.useEffect(() => {
    if(!data) {      // Делаем только если данных нет, иначе начальный refresh выполняется бесконечно
      console.log("useEffect - initial refresh")
      setData([]); // Непонятно зачем
      refreshData();
      console.log("useEffect - initial refreshed")
    }
  }); 

  /**
   * Возвращаем React компонент
   */
  return (
    <div className="CapitalModule">
      <div className="Measure">
      <Layout>
          <Header>
            Справочник мер измерения
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
                className="mod-main-table" 
                rowClassName="table-editable-row"  
                bordered 
                size={"middle"}
                loading={loading}
                rowSelection={rowSelection} 
                columns={columns} 
                dataSource={data}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="id"
                onRow={(record, rowIndex) => {
                  return {
                    onClick: event => callForm(record.id)
                  };
                }}
              />
            </div>
            <MeasureForm 
              form={form}
              visible={formVisible}
              editorContext={editorContext}
              afterCancel = {() => {
                setFormVisible(false);
              }}
              afterSave={()=>{
                setFormVisible(false);
                refreshData();
              }}
            >
            </MeasureForm>
          </Content>
          <Footer>Низ Капитал</Footer>
        </Layout>
      </div>
    </div>
  );
}

export default Measure;

// https://medium.com/@alef.duarte/using-ant-design-form-inside-a-modal-in-react-stateless-functional-component-634f33357c80
