import React from 'react';
import Measure from './Measure';
import Unitmeasure from './Unitmeasure';
import Material from './Material';
class CapitalModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [
        { name: "Masure", note: "Меры измерения"},
        { name: "Unitmeasure", note: "Единицы измерения"},
        { name: "Material", note: "Справочник материалов"},
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
        return <Measure />;
      case 1:
        return <Unitmeasure />;
      case 2:
        return <Material />;
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
