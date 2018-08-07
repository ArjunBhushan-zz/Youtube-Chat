import React, {Component} from 'react';
import styles from './EnterRoom.css';
import Input from './../../../components/UI/Input/Input';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class EnterRoom extends Component {
  state = {
    controls: {
      room: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Room Name'
        },
        value: '',
        validation: {
          required: true,
          minLength: 1
        },
        valid: false,
        touched: false
      }
    },
    error: null
  }
  checkValidity = (value, rules) => {
    if (!rules){
      return true;
    }
    let isValid = true;
    if (rules.required) {
      isValid = isValid && value.trim() !== '';
    }
    if (rules.minLength) {
      isValid = isValid && (value.trim().length >= rules.minLength);
    }
    return isValid;
  };

  inputChangedHandler = (id, event) => {
    const updatedControls = {
      ...this.state.controls,
      [id]: {
        ...this.state.controls[id],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[id].validation),
        touched: true
      }
    };
    this.setState({controls: updatedControls});
  }
  submitHandler = (e) => {
    e.preventDefault();
    this.props.history.push(`/rooms?room=${this.state.controls.room.value.trim().toLowerCase()}`);
  }
  render() {
    const formElementsArray = [];
    for (let key in this.state.controls){
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }
    let form = formElementsArray.map((formElement) => {
      return (
        <Input elementType = {formElement.config.elementType}
          elementConfig = {formElement.config.elementConfig}
          value= {this.props[formElement.id] && !formElement.config.touched ? this.props[formElement.id] : formElement.config.value }
          key = {formElement.id}
          changed = {this.inputChangedHandler.bind(this, formElement.id)}
          invalid = {!formElement.config.valid}
          shouldValidate = {formElement.config.validation}
          touched = {formElement.config.touched}
        />
      );
    });
    let error = null;
    if (this.state.error) {
      error = (<p className = {styles.Error}> {this.state.error}</p>);
    }
    return (
      <div className = {styles.EnterRoom}>
        {error}
        <form onSubmit= {this.state.controls.room.value.trim().length ? (event) => this.submitHandler(event) : (event) => event.preventDefault()}>
          {form}
          <button/>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token
  };
};


export default withRouter(connect(mapStateToProps)(EnterRoom));
