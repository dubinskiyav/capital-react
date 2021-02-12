import React from 'react';
import {Modal} from 'antd';
import { Form, Input } from 'antd';
import reqwest from 'reqwest';
import { notification } from 'antd';

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
            // запрос к REST API на выборку
            reqwest({
                url: props.editorContext.uriForUpd + '/' + props.editorContext.id,
                contentType: "application/json; charset=utf-8",
                method: 'get',
                type: 'json',
            }).then(record => {
                    console.log("record = " + JSON.stringify(record));
                    setData(record); // данные новые
                    form.resetFields();
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
            //form.resetFields();
            //setData({});
            //setData(null);
        }
    }
   
    if(!data && props.visible) { // Если нет данных про запись и видима - грузим
        load();
    }

    // Побочный эффект для первоначального фокуса
    React.useEffect(()=>{
        if (props.visible) { // Обязательно, если видимость, иначе свалится
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

    return <Modal
        visible={props.visible}
        title="Новая запись"
        okText="Согласен"
        cancelText="Отмена"
        onCancel={()=>{
            props.afterCancel();
            setData(null);
        }}
        onOk={() => {
            props.afterSave();
            setData(null);
        }}
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