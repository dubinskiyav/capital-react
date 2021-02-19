import React from 'react';
import { Menu} from 'antd';
import * as globalSettings from "./const";

const { SubMenu } = Menu;

const swaggerURI = globalSettings.startURL + globalSettings.swaggerURI;

const HelpMenu = ()=>{
    return (
        <SubMenu key="HelpMenu" title="Справка">
            <Menu.Item key="help">Помощь</Menu.Item>
            <Menu.Item key="about">
                <a href="http://www.gelicon.biz/" target="_blank" rel="noopener noreferrer">
                О программе
                </a>
            </Menu.Item>
            <Menu.Item key="swagge">
            <a href={globalSettings.startURL + globalSettings.swaggerURI} target="_blank" rel="noopener noreferrer">
                Документация API
            </a>
            </Menu.Item>
        </SubMenu>
);
}

export default HelpMenu;