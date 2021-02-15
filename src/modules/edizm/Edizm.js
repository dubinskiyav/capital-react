import React from 'react';
import 'antd/dist/antd.css';
import '../../resources/css/index.css';
import '../../resources/css/capital.css';
import Measure from '../../modules/measure/Measure';
import Unitmeasure from '../../modules/unitmeasure/Unitmeasure';
import { Tabs } from 'antd';

const Edizm = ()=>{
  const { TabPane } = Tabs;

  function callback(key) {
    console.log(key);
  }
      return (
      <div className="CapitalModule">
        <div className="Material">
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Единицы измерения" key="1">
              <Unitmeasure />
            </TabPane>
            <TabPane tab="Пересчет единиц" key="2">
                Пересчет единиц
            </TabPane>
            <TabPane tab="Меры измерения" key="3">
              <Measure />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
}
export default Edizm;
