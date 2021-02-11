import React from 'react';
import { Breadcrumb } from 'antd';

class CapitalHeader extends React.Component {
  render() {
    return (
      <div className="CapitalHeader">
        <div>Система Капитал (CapitalHeader)</div>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Главная</Breadcrumb.Item>
          <Breadcrumb.Item>Группы приложений</Breadcrumb.Item>
          <Breadcrumb.Item>Справочники</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }
}
export default CapitalHeader;
