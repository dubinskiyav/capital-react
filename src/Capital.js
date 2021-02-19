import React from 'react';


import CapitalModule from './CapitalModule';
import CapitalHeader from './CapitalHeader';
import CapitalFooter from './CapitalFooter';

// Русификация antd
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
const locale = ruRU;

class Capital extends React.Component {
  render() {
    return (
      <ConfigProvider  locale={locale}>
        <div className="Capital">
          <CapitalHeader />
          <CapitalModule />
          <CapitalFooter />
        </div>
      </ConfigProvider>
    );
  }
}
export default Capital;


