import React from 'react';
import Measure from './modules/measure/Measure';
import Unitmeasure from './modules/unitmeasure/Unitmeasure';
import Material from './modules/material/Material';
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
