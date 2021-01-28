import React from 'react';
import Module from './Module';
import Header from './Header';
import Footer from './Footer';
class Capital extends React.Component {
  render() {
    return (
      <div className="Capital">
        <Header />
        <Module />
        <Footer />
      </div>
    );
  }
}
export default Capital;


