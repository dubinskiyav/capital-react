import React from 'react';
import Edizm from './modules/edizm/Edizm';

class CapitalModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [
        { name: "Edizm", note: "Единицы измерения"},
      ],
      current: -1,
    };
  }
  handleClick(props) {
    this.setState({current: props.index});
  }
  render() {
    switch(this.state.current) {
      case 0:
        return <Edizm />;
      default:
        return (
          <div className="CapitalModule">
            <div className="CapitalModule-row">
              {this.state.modules.map((module, index) => (
                <button
                  className="CapitalModuleButton"
                  key={index}
                  onClick={() => this.handleClick({index})}
                >
                  {module.note}
                </button>
              ))}
            </div>
          </div>
      );
    }
  }
}
export default CapitalModule;
