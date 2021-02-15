import React from 'react';
import { Breadcrumb } from 'antd';

const CapitalHeader = ()=>{
  const breadcrumbNameMap = [
    {path: "/", name: "Капитал", comp: "<Capital />"},
    {path: "/reference_book", name: "Справочники", comp: ""},
    {path: "/edizm", name: "Справочник единиц измерения", comp: ""},
  ]

  return (
  <div className="CapitalHeader">
    <Breadcrumb style={{ margin: '16px 0' }}>
      {breadcrumbNameMap.map(({ path, name }) => (
        <Breadcrumb.Item key={path} href={path}> {name}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  </div>
  )
}
export default CapitalHeader;
