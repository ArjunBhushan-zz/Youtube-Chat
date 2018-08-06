import React, {Component} from 'react';
import styles from './Me.css';
import Input from './../../components/UI/Input/Input';
import Rooms from './../../components/Rooms/Rooms';
import NewRoom from './../../components/Rooms/NewRoom/NewRoom';
import { connect } from 'react-redux';
import * as actions from './../../store/actions/index';
import Spinner from './../../components/UI/Spinner/Spinner';
class Me extends Component {
  state = {
    controls: {
      username: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Username',
          readOnly: true
        },
        value: '',
        validation: {
          required: true,
          minLength: 1
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
    }
  }
  componentDidMount(){
    this.props.loadUser(this.props.token);
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.token && this.props.token){
      this.props.loadUser(this.props.token);
    }
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
    this.props.updateUser(this.props.token, this.state.controls.display.value);
  }

  render() {
    if (this.state.controls.username.value && !this.state.controls.username.elementConfig.readOnly) {
      this.setState({
        controls: {
          ...this.state.controls,
          username: {
            ...this.state.controls.username,
            elementConfig: {
              ...this.state.controls.username.elementConfig,
              readOnly: true
            }
          }
        }
      });
    }

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
    if (this.props.loading) {
      form = <Spinner/>
    }
    let error = null;
    if (this.props.error) {
      error = <p className = {styles.Error}>{this.props.error}</p>
    }
    return  (
      <div className = {styles.Me}>
        {error}
        <h2>User Information</h2>
        <form onSubmit= {(event) => this.submitHandler(event)}>
          {form}
          <button/>
        </form>
        <hr/>
        <Rooms rooms = {this.props.rooms}/>
        <hr/>
        <NewRoom/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      token: state.auth.token,
      username: state.auth.username,
      display: state.me.display,
      rooms: state.me.rooms,
      loading: state.me.loading,
      error: state.me.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: (token) => dispatch(actions.loadUser(token)),
    updateUser: (token, display) => dispatch(actions.updateUser(token, display))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Me);
