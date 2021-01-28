import React from 'react';
import Measure from './Measure';
class Module extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [
        { name: "Measure", note: "Единицы измерения"},
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
      default:
        return (
          <div className="Module">
            <div className="Module-row">
              {this.state.modules.map((module, index) => (
                <button
                  className="moduleButton"
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
export default Module;
