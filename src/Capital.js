import React from 'react';
import CapitalModule from './CapitalModule';
import CapitalHeader from './CapitalHeader';
import CapitalFooter from './CapitalFooter';
class Capital extends React.Component {
  render() {
    return (
      <div className="Capital">
        <CapitalHeader />
        <CapitalModule />
        <CapitalFooter />
      </div>
    );
  }
}
export default Capital;


