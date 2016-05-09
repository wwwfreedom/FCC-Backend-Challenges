import React, { Component, PropTypes } from 'react'
import sty from './Signin.scss'
import Card from 'material-ui/Card/Card'
import CardActions from 'material-ui/Card/CardActions'
import CardText from 'material-ui/Card/CardText'
import Textfield from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {grey50, grey400, red400} from 'material-ui/styles/colors'
import Checkbox from 'material-ui/checkbox'
import {Link} from 'react-router'
import { emailSignIn } from 'redux/auth/authenticate'
import { reduxForm } from 'redux-form'
import isEmail from 'validator/lib/isEmail'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import { TINY } from 'containers/DetectWidth'
import Dialog from 'material-ui/Dialog'

export class Signin extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired, // from redux-form
    fields: PropTypes.object.isRequired, // from redux-form
    emailSignIn: PropTypes.func.isRequired, // from authenticate action
    authError: PropTypes.object, // from auth reducer
    loading: PropTypes.bool.isRequired, // from auth reducer
    width: PropTypes.number.isRequired // from HOC DetectWidth
  };

  state = {
    open: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.authError.status !== this.props.authError.status) {
      this.setState({open: nextProps.authError.status})
    }
  }

  handleOpen = () => this.setState({open: true})

  handleClose = () => this.setState({open: false})

  handleFormSubmit({email, password}) {
    this.props.emailSignIn({email, password})
  }

  render() {
    const { handleSubmit, fields: { email, password }, authError, loading, width } = this.props
    const actions = [
      <RaisedButton
        label="Ok"
        primary
        onTouchTap={this.handleClose}
      />
    ]
    return (
      <form
        className={sty.container}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
      >
        <Card className={sty.card}>
          <div className={sty.thirdPartySignin}>
            <RaisedButton
              label='Sign in with GitHub'
              labelPosition='before'
              className={sty.otherSigninButton}
              backgroundColor={grey50}
            >
              <input type="button" className={sty.input} />
            </RaisedButton>
            <div className={sty.separator}>
              <div className={sty.lineSeparator}><span>or</span></div>
            </div>
          </div>
          <CardText expandable={false} className={sty.formBody}>
            <Textfield
              floatingLabelText='Email'
              floatingLabelStyle={{fontWeight: '400'}}
              fullWidth
              errorText={email.touched && email.error && email.error}
              {...email}
            />
            <Textfield
              floatingLabelText='Password'
              floatingLabelStyle={{fontWeight: '400'}}
              type='password'
              fullWidth
              errorText={password.touched ? password.error : ''}
              {...password}
            />
            <div className={sty.rememberOrForget}>
              <div className={sty.checkbox}>
                <Checkbox
                  label="Remember me"
                  labelStyle={{marginLeft: '-14px', width: '100%', color: grey400, fontWeight: '400'}}
                  iconStyle={{fill: grey400}}
                />
              </div>
              <div className={sty.forget}>
                <Link to='/forgotPassword'>Forget password?</Link>
              </div>
            </div>
          </CardText>
          <CardActions className={sty.cardActions}>
            {loading ? <div className={sty.loading}>
              <RefreshIndicator
                size={50}
                left={width === TINY ? 135 : 221}
                top={0}
                loadingColor={"#FF9800"}
                status="loading"
              />
            </div>
            : <RaisedButton
              label='Sign In'
              primary
              labelPosition='before'
              className={sty.signinButton}
            >
              <input type="submit" className={sty.input} />
            </RaisedButton>
          }
            <hr />
            <div className={sty.signup}>
              <div className={sty.signupText}>Don't have an account?</div>
              <RaisedButton
                label='Sign Up'
                labelPosition='before'
                backgroundColor={grey50}
                className={sty.signupButton}
              >
                <input type="submit" className={sty.input} />
              </RaisedButton>
            </div>
          </CardActions>
          <Dialog
            title='Error'
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            bodyStyle={{color: red400}}
          >
            {authError.message}
          </Dialog>
        </Card>
      </form>
    )
  }
}

function validate(formProps) {
  const errors = {}
  if (!formProps.email) {
    errors.email = 'Please enter an email'
  }

  if (!formProps.password) {
    errors.password = 'Please enter a password'
  }

  if (formProps.email && isEmail(formProps.email) === false) {
    errors.email = 'Please enter a valid email'
  }

  return errors
}

const mapStateToProps = (state) => ({
  authError: state.auth.error,
  loading: state.auth.loading
})

export default reduxForm({
  form: 'emailSignIn',
  fields: ['email', 'password'],
  validate
}, mapStateToProps, {emailSignIn})(Signin)
