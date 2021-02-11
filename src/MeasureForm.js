import React from 'react';
import {Modal} from 'antd';
import { Form, Input } from 'antd';

const MeasureForm = (props)=>{
    let firstInputRef = React.useRef(null);

    React.useEffect(()=>{
        //console.log("firstInputRef=" + JSON.stringify(firstInputRef));
        //firstInputRef.current.focus();
        // handleClick();
        setTimeout(() => {
            //handleClick();
        }, 100);
    })

    function handleClick() {
        firstInputRef.current.focus();
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
            layout="horizontal"
            name="measureForm"
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
                value="Фокус на поле для ввода текста"
                onClick={handleClick}
            />
        </Form>
  </Modal>
}    

export default MeasureForm;