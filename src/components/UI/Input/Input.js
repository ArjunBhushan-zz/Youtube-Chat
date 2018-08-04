import React from 'react';
import style from './Input.css';

const input = (props) => {
  let inputElement = null;
  const inputStyles = [style.InputElement];

  if (props.invalid && props.touched) {
    inputStyles.push(style.Invalid);
  }
  switch (props.elementType) {
    case ('input'):
      inputElement = (
        <input className = {inputStyles.join(' ')}
               {...props.elementConfig}
               value={props.value}
               onChange = {props.changed}
         />
      );
      break;
    case ('textarea') :
      inputElement = (
        <textarea
          className = {inputStyles.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange = {props.changed}
        />
      );
      break;
    case ('select') :
      inputElement = (
        <select
          onChange = {props.changed}
          className = {inputStyles.join(' ')}
          {...props.elementConfig}
          value={props.value}>
          {props.elementConfig.options.map((option) => {
            return <option key={option.value} value={option.value}>{option.displayValue}</option>;
          })}
        </select>
      );
      break;
    default :
      inputElement = <input className = {style.InputElement} {...props.elementConfig} value={props.value}/>;
  }
  return (
    <div className = {style.Input}>
      <label className = {style.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default input;
