import React, { Component } from 'react'
import sty from './Signin.scss'
import Card from 'material-ui/Card/Card'
import CardActions from 'material-ui/Card/CardActions'
import CardText from 'material-ui/Card/CardText'
import Textfield from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {grey50, grey400} from 'material-ui/styles/colors'
import Checkbox from 'material-ui/checkbox'
import {Link} from 'react-router'

export class Signin extends Component {
  render() {
    return (
      <form className={sty.container}>
        <Card className={sty.card}>
          <div className={sty.thirdPartySignin}>
            <RaisedButton
              label='Sign in with GitHub'
              labelPosition='before'
              className={sty.otherSigninButton}
              backgroundColor={grey50}
            >
              <input type="submit" className={sty.input} />
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
            />
            <Textfield
              floatingLabelText='Password'
              floatingLabelStyle={{fontWeight: '400'}}
              type='password'
              fullWidth
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
            <RaisedButton
              label='Sign In'
              primary
              labelPosition='before'
              className={sty.signinButton}
            >
              <input type="submit" className={sty.input} />
            </RaisedButton>
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
        </Card>
      </form>
    )
  }
}

export default Signin
