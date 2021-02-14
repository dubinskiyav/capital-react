import React from 'react';
import 'antd/dist/antd.css';
import '../../resources/css/index.css';
import '../../resources/css/capital.css';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;


class Material extends React.Component {
  render() {
    return (
      <div className="CapitalModule">
        <div className="Material">
          <Layout>
            <Header>Справочник материало, товаров, услуг</Header>
            <Content>Контент</Content>
            <Footer>Низ Капитал</Footer>
          </Layout>
        </div>
      </div>
    );
  }
}
export default Material;
