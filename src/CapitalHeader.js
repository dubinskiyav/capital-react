import React from 'react';
import { Breadcrumb } from 'antd';

const CapitalHeader = ()=>{
  const breadcrumbNameMap = {
    '/apps': 'Application List',
    '/apps/1': 'Application1',
    '/apps/2': 'Application2',
    '/apps/1/detail': 'Detail',
    '/apps/2/detail': 'Detail',
  };
  return (
  <div className="CapitalHeader">
    <div>Система Капитал (CapitalHeader)</div>
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Капитал</Breadcrumb.Item>
      <Breadcrumb.Item>Справочники</Breadcrumb.Item>
      <Breadcrumb.Item>Справочник мер измерения</Breadcrumb.Item>
    </Breadcrumb>
  </div>
  )
}
export default CapitalHeader;
