// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Form as LeonaForm } from 'leona-ui';
import { inject, observer } from 'mobx-react';

import i18n, { packageNS } from '../../../i18n';
import RequireHealthOverlay from '../../../RequireHealthOverlay';

@inject('createAccountStore')
@observer
class AccountPassword extends Component {
  state = {
    confirm: '',
    isLoading: false,
    password: '',
    error: ''
  };

  handleConfirmChange = ({ target: { value } }) => {
    this.setState({ confirm: value });
  };

  handlePasswordChange = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleSubmit = event => {
    const { createAccountStore, history } = this.props;
    const { confirm, password } = this.state;

    event.preventDefault();

    if (!createAccountStore.jsonString && confirm !== password) {
      this.setState({
        error: `${i18n.t(
          `${packageNS}:account.password.create.error_msg_password_confirmation_no_match`
        )}`
      });
      return;
    }

    this.setState({ isLoading: true });

    // Save to susy
    createAccountStore
      .saveAccountToSusy(password)
      .then(res => {
        createAccountStore.clear();
        history.push('/accounts');
      })
      .catch(err => {
        console.error(err);

        this.setState({
          isLoading: false,
          error: err.text
        });
      });
  };

  render () {
    const {
      createAccountStore: { address, name, jsonString, isImport },
      history,
      location: { pathname }
    } = this.props;
    const { confirm, error, isLoading, password } = this.state;
    const currentStep = pathname.slice(-1);

    return (
      <RequireHealthOverlay require='node'>
        <AccountCard
          address={address}
          name={name}
          drawers={[
            <form key='createAccount' noValidate onSubmit={this.handleSubmit}>
              <div className='text'>
                <p>
                  {' '}
                  {jsonString
                    ? i18n.t(
                      `${packageNS}:account.password.import.label_msg_unlock_json`
                    )
                    : i18n.t(
                      `${packageNS}:account.password.create.label_msg_password`
                    )}
                </p>
              </div>

              <LeonaForm.Field
                autoFocus
                label={i18n.t(
                  `${packageNS}:account.password.common.label_password`
                )}
                onChange={this.handlePasswordChange}
                required
                type='password'
                value={password}
              />

              {!jsonString && (
                <LeonaForm.Field
                  label={i18n.t(
                    `${packageNS}:account.password.common.label_password_confirm`
                  )}
                  onChange={this.handleConfirmChange}
                  required
                  type='password'
                  value={confirm}
                />
              )}

              <p>
                {error &&
                  error +
                    ' ' +
                    i18n.t(
                      `${packageNS}:account.password.common.error_msg_password_incorrect`
                    )}
              </p>

              <nav className='form-nav -space-around'>
                {currentStep > 1 && (
                  <button
                    className='button -back'
                    onClick={history.goBack}
                    type='button'
                  >
                    {i18n.t(`${packageNS}:navigation.back`)}
                  </button>
                )}
                <button
                  autoFocus
                  className='button'
                  disabled={
                    !password ||
                    (!jsonString && confirm !== password) ||
                    isLoading
                  }
                >
                  {i18n.t(
                    `${packageNS}:account.password.common.button_confirm`,
                    {
                      postfix: isImport
                        ? i18n.t(
                          `${packageNS}:account.password.common.button_confirm_opt1`
                        )
                        : i18n.t(
                          `${packageNS}:account.password.common.button_confirm_opt2`
                        )
                    }
                  )}
                </button>
              </nav>
            </form>
          ]}
          i18n={i18n}
          packageNS={packageNS}
        />
      </RequireHealthOverlay>
    );
  }
}

export default AccountPassword;
