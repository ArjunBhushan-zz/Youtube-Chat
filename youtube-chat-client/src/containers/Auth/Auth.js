import React, {Component} from 'react';
import styles from './Auth.css';
import Input from './../../components/UI/Input/Input';
import Button from './../../components/UI/Button/Button';
import { connect } from 'react-redux';
import * as actions from './../../store/actions/index';
import Spinner from './../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';

class Auth extends Component {
  state = {
    controls: {
      username: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Username'
        },
        value: '',
        validation: {
          required: true,
          minLength: 1
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      },
      display: {
        elementType: 'input',
        elementConfig: {
          type: 'input',
          placeholder: 'Display Name (Not Required)'
        },
        value: '',
        validation: {
          minLength: 1
        },
        valid: false,
        touched: false
      }
    },
    isSignup: false
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
  }

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
    const username = this.state.controls.username.value;
    const password = this.state.controls.password.value;
    const isSignup = this.state.isSignup;
    let display = null;
    if(this.state.controls.display.value) {
      display = this.state.controls.display.value;
    }
    this.props.login(username, password, isSignup, display);
  }
  toggleAuthHandler = () => {
    this.setState((prevState) => {
      return {
        isSignup: !prevState.isSignup
      };
    });
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
      if (!this.state.isSignup && formElement.id === 'display'){
        return null;
      }
      return (
        <Input elementType = {formElement.config.elementType}
          elementConfig = {formElement.config.elementConfig}
          value= {formElement.config.value}
          key = {formElement.id}
          changed = {this.inputChangedHandler.bind(this, formElement.id)}
          invalid = {!formElement.config.valid}
          shouldValidate = {formElement.config.validation}
          touched = {formElement.config.touched}
        />
      );
    });
    if (this.props.loading) {
      form = <Spinner/>
    }
    return (
      <div className = {styles.Auth}>
        {this.props.isAuth ? <Redirect to="/me"/> : null}
        <form onSubmit= {(event) => this.submitHandler(event)}>
          {this.props.error ? <p className = {styles.Error}>{this.props.error}</p> : null}
          {form}
          <Button buttonType="Success">SUBMIT</Button>
        </form>
        <Button buttonType="Danger" clicked = {this.toggleAuthHandler}>SWITCH TO {this.state.isSignup ? 'LOGIN' : 'SIGNUP'}</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password, isSignUp, display) => dispatch(actions.auth(username, password, isSignUp, display)),
    logout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
