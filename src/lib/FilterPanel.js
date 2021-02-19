import React from 'react';
import {Space} from 'antd';

/**
 * Панель фильтров
 * @param {*} props 
 */
const FilterPanel = (props)=>{
    return (
        <div className={'FilterPanel FilterPanel-' + props.color}>
          {props.children}
        </div>
      );
}

export default FilterPanel;