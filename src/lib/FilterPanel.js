import React from 'react';
import {Space} from 'antd';

/**
 * Панель фильтров
 * @param {*} props 
 */
const FilterPanel = (props)=>{
    return (
        <Space className="filter-panel">
            {props.children}
        </Space>
    );
}

export default FilterPanel;