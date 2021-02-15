import React from 'react';
import {Modal} from 'antd';
import { Form, Input } from 'antd';
import reqwest from 'reqwest';
import { notification } from 'antd';

const titleAdd = "Добавление меры измерения";
const titleUpd = "Изменение меры измерения";

/**
 * Добавление-изменение меры измерения
 * @param {*} props 
 */
const MeasureForm = (props)=>{
    const firstInputRef = React.useRef(null); // Создаем реф для первоначального фокуса
    let [data,setData] = React.useState(null); // Запись для редактирования
    let form = props.form; // Форма из параметра для эффекта

    /**
     * Загрузка данных из id
     */
    const load = ()=>{
        console.log("Load with props.editorContext.id=" + props.editorContext.id);
        if(props.editorContext.id && props.editorContext.id !== 0) {
            console.log("Load for edit id = ",props.editorContext.id);
            console.log("uriForUpd = ",props.editorContext.uriForUpd);
            // запрос к REST API на выборку по id
            reqwest({
                url: props.editorContext.uriForUpd + '/' + props.editorContext.id,
                contentType: "application/json; charset=utf-8",
                method: 'get',
                type: 'json',
            }).then(record => {
                    console.log("record = " + JSON.stringify(record));
                    setData(record); // данные новые
                    //form.resetFields(); // Перенесено в useEffect
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
        } else {
            console.log("Load for add");
            // запрос к REST API на выборку для начального значения
            reqwest({
                url: props.editorContext.uriForAdd,
                contentType: "application/json; charset=utf-8",
                method: 'get',
                type: 'json',
            }).then(record => {
                    console.log("record = " + JSON.stringify(record));
                    setData(record); // данные новые
                },
                (error) => {
                notification.error({
                    message:"Ошибка при выборке за пределами программы",
                    description: "error"
                });
                console.log('refreshData - error=' + error);
                }
            );
        }
    }
   
    if(!data && props.visible) { // Если нет данных про запись и видима - грузим
        load();
    }

    // Побочный эффект для первоначального фокуса
    React.useEffect(()=>{
        if (props.visible) { // Обязательно, если видимость, иначе свалится
            form.resetFields(); // Для того, чтобы поля перерисовались со значениями
            // form = props.form;
            setTimeout(() => { // На всякий случай таймаут
                firstInputRef.current.focus({cursor: 'end',});
            }, 100);
        }
    })

    function handleClick() {
        console.log("handleClick - form.resetFields();");
        form.resetFields();
    }

    //Сохранение
    const save=(values,after)=>{
        const record = { // сцепим id и vslues в один объект
            "id": props.editorContext.id,
            ...values
        }
        console.log("Saving record = ",JSON.stringify(record));
        // запрос к REST API на выборку
        reqwest({
            url: props.editorContext.uriForPost,
            contentType: "application/json; charset=utf-8",
            method: 'post',
            type: 'json',
            data:JSON.stringify(record)
        }).then((responseJson) => {
            console.log('responseJson=', responseJson);
            const { errorCode } = responseJson;
            if (errorCode) { // Ошибка есть
              console.log('errorCode=', errorCode);
              const { errorMessage, fieldErrors } = responseJson;
              const description = errorMessage + fieldErrors.id;
              notification.error({
                message:"Ошибка при сохранении записей",
                description: (description)
              });
              } else { // ошибки нет
                after(); // Сюда передали refreshData
                let description = "Запись добавлена";
                if (props.editorContext.id) {
                    description = "Запись изменена";
                }
                notification.success({
                  message:"Успешно",
                  description: (description)
                });
            }
        })
    }
    

    return <Modal
        visible={props.visible}
        title={ props.editorContext.id ? titleUpd : titleAdd }
        okText="Согласен"
        cancelText="Отмена"
        onCancel={()=>{
            props.afterCancel();
            setData(null);
        }}
        onOk={() => {
            props.form.validateFields().then((values) => {
                    save(values,()=>{
                        props.afterSave(values);
                        setData(null);
                    });
                })
                .catch((info) => {
                    console.log('Validate Failed:', info);
                    notification.error({
                        message: 'Ошибка ввода',
                        description: 'Проверьте правильность ввода всех полей'
                    });
                });
            }
        }
        >
        <Form
            form={form}
            layout="horizontal"
            name="measureForm"
            initialValues={data}
        >
            <Form.Item
                name="name"
                label="Наименование"
                rules={[
                    {
                        required: true,
                        message: 'Необходимо ввести наименование',
                    },
                ]}>
                <Input ref={firstInputRef} style={{width1:300}}/>
            </Form.Item>
            <input
                type="button"
                value="Не нажимай!"
                onClick={handleClick}
            />
        </Form>
  </Modal>
}    

export default MeasureForm;