import React from 'react';
import {Modal} from 'antd';
import { Form, Input } from 'antd';

/**
 * Добавление-изменение меры измерения
 * @param {*} props 
 */
const MeasureForm = (props)=>{
    const firstInputRef = React.useRef(null); // Создаем реф для первоначального фокуса
    let [data,setData] = React.useState(null); // Запись для редактирования
    const [form] = Form.useForm();

    /**
     * Загрузка данных из id
     */
    const load = ()=>{
        if(props.editorContext.id && props.editorContext.id != 0) {
            console.log("Load fo edit id=",props.editorContext.id);
            // Получим запись по id
            const record = {
                id: props.editorContext.id,
                name: "fsdvfdsvdfsv",
            };
            setData(record);
        } else {
            console.log("Load fo add");
            form.resetFields();
            setData({})
        }
    }
   
    if(!data && props.visible) { // Если нет данных про запись и видима - грузим
        load();
    }

    // Побочный эффект для первоначального фокуса
    React.useEffect(()=>{
        if (props.visible) { // Обязательно, если видимость, иначе свалится
            setTimeout(() => { // На всякий случай таймаут
                firstInputRef.current.focus({cursor: 'end',});
            }, 100);
        }
    })

    function handleClick() {
        console.log("form.resetFields();");
        form.resetFields();
    }

    return <Modal
        visible={props.visible}
        title="Новая запись"
        okText="Согласен"
        cancelText="Отмена"
        onCancel={()=>{
            props.afterCancel();
        }}
        onOk={() => {
            props.afterSave();
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