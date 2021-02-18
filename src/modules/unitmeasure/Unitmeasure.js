import React from 'react';
import 'antd/dist/antd.css';
import '../../resources/css/index.css';
import '../../resources/css/capital.css';
import { Layout, Menu, Modal,Form } from 'antd';
import { Table } from 'antd';
import reqwest from 'reqwest';
import { PlusOutlined, EditOutlined, CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import Refresh from '../../icons/Refresh';
import { notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import * as globalSettings from "../../lib/const";
import UnitmeasureForm from "./UnitmeasureForm";


// URI для использования формой добавления/изменения
const URI_ROOT = globalSettings.startURL + "unitmeasure"
const URI_SELECT = URI_ROOT + "/dto"
const URI_DEL = URI_ROOT + "/del"
const URI_ADD = URI_ROOT + "/add"
const URI_UPD = URI_ROOT + "/upd" // для выборки записи по id
const URI_POST = URI_ROOT + "/post"


const { Header, Content, Footer } = Layout;

const { SubMenu } = Menu;

// id не надо - он описан в key таблицы
const columns = [
  {
    title: 'Наименование',
    dataIndex: 'unitmeasureName',
    sorter: {
      multiple: 1,
    },
  },
  {
    title: 'Сокращение',
    dataIndex: 'unitmeasureShortname',
    key: 'short_name', // Возможно это название поля в базе
    sorter: {
      multiple: 2,
    },
  },
  {
    title: 'Приоритет',
    dataIndex: 'measureunitPriority',
    sorter: {
      multiple: 3,
    },
  },
  {
    title: 'Мера измерения',
    dataIndex: 'measureName',
    sorter: {
      multiple: 4,
    },
    // todo сделать динамическое формирование
    // Эта фильтрация - говно. Фильтрует уже выбранные данные
    // Валится, если measureName пустое
    filters: [ 
      { text: 'Без меры измерения',       value: 'Без меры измерения' },
      { text: 'Расстояние',               value: 'Расстояние' },
      { text: 'Вес',                      value: 'Вес' },
      { text: 'Время',                    value: 'Время' },
      { text: 'Сила электрического тока', value: 'Сила электрического тока' },
      { text: 'Температура',              value: 'Температура' },
      { text: 'Количество вечества',      value: 'Количество вечества' },
      { text: 'Сила света',               value: 'Сила света' },
    ],
    onFilter: (value, record) => record.measureName.includes(value),
  },
];

const idName = "unitmeasureId";

/**
 * Компонент для меры измерения
 * @param {*} props 
 */
const Unitmeasure = ()=>{
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
    fieldName: idName,  // Изначально по id (без сортировки с пагинацией нельзя)
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
  let [filteredInfo, setFilteredInfo] = React.useState(0); // Фильтр


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
      url: URI_DEL + '/' + ids,
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
  const handleTableChange = (paginationNew, filters, sorter, extra) => {
    if (sorter.field) { // Установлена единичкая сортировка
      sorters = [{
        fieldName: sorter.field, 
        sortOrder: sorter.order
      }];
      setSorters(sorters);
    } else { // Возможно, установлена множественная сортировка
      sorters = [];
      Object.keys(sorter).forEach(element => {
        if (sorter[element].field)
          sorters.push({
            fieldName: sorter[element].field,
            sortOrder: sorter[element].order,
          });
      });
    }
    pagination = paginationNew;
    setPagination(pagination);
    console.log('filters = ' + JSON.stringify(filters));
    setFilteredInfo(filters); // Установим переданный в параметрах фильтр
    refreshData();
  };

  const clearFilters = () => { // Обнуление фильтра
    setFilteredInfo(null); 
  };


  /**
   * Основная перевыборка данных
   */
  const refreshData = () => {
    setLoading(true);
    let gridDataOption = {
      pageNumber: pagination.current - 1,
      pageSize: pagination.pageSize,
      sort: [{fieldName: idName, direction: 0}] // Сортировка по умолчанию !!!!!!!!!!
    };
    if (sorters) { // Сортировка установлена - переустановим
      console.log('sorters = ' + JSON.stringify(sorters));
      let sort = []; 
      sorters.forEach(element => {
        let direction = 0;
        if (element.sortOrder === "descend") {
          direction = 1;
        }
        sort.push({
          fieldName: element.fieldName,
          direction: direction,
        });      
      });
      gridDataOption.sort = sort;
    }
    console.log('gridDataOption=' + JSON.stringify(gridDataOption));
    // Вычисляем total для таблицы
    let total = (gridDataOption.pageNumber + 2) * gridDataOption.pageSize;
    if (total < totalMax) {
      total = totalMax;
    } else {
      totalMax = total;
      setTotalMax(total);
    }
    console.log('total = ' + total);
    // Фильтрация
    filteredInfo = filteredInfo || {};
    console.log('filteredInfo = ' + JSON.stringify(filteredInfo));
    // запрос к REST API на выборку
    reqwest({
      url: URI_SELECT,
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
      <div className="Unitmeasure">
      <Layout>
          <Header>
            Список единиц измерения
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
                rowKey={idName}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: event => callForm(record.id)
                  };
                }}
              />
            </div>
            <UnitmeasureForm 
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
            </UnitmeasureForm>
          </Content>
          <Footer>Низ Капитал</Footer>
        </Layout>
      </div>
    </div>
  );
}

export default Unitmeasure;

// https://medium.com/@alef.duarte/using-ant-design-form-inside-a-modal-in-react-stateless-functional-component-634f33357c80
