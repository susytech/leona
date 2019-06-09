// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Card, Form as LeonaForm } from 'leona-ui';
import { inject, observer } from 'mobx-react';

import i18n, { packageNS } from '../../../i18n';
import RequireHealthOverlay from '../../../RequireHealthOverlay';
import AccountImportOptions from '../AccountImportOptions';

@inject('createAccountStore')
@observer
class AccountRewritePhrase extends Component {
  state = {
    isLoading: false,
    value: ''
  };

  handleChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  handleSubmit = async () => {
    const {
      history,
      location: { pathname },
      createAccountStore: { isImport, setPhrase }
    } = this.props;
    const currentStep = pathname.slice(-1);
    const { value } = this.state;

    // If we're importing, derive address from recovery phrase when we submit
    if (isImport) {
      this.setState({ isLoading: true });
      await setPhrase(value);
    }

    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  render () {
    const {
      createAccountStore: { address, isImport, name },
      history,
      location: { pathname }
    } = this.props;
    const { value } = this.state;
    const currentStep = pathname.slice(-1);
    const body = [
      <form key='createAccount' onSubmit={this.handleSubmit}>
        <div className='text -centered'>
          {isImport ? (
            <AccountImportOptions />
          ) : (
            <p>
              {i18n.t(
                `${packageNS}:account.phrase_rewrite.label_msg_rewrite_phrase`
              )}
            </p>
          )}
        </div>

        <LeonaForm.Field
          autoFocus
          as='textarea'
          label={i18n.t(
            `${packageNS}:account.phrase_rewrite.label_rewrite_phrase`
          )}
          onChange={this.handleChange}
          required
          value={value}
        />

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
          {this.renderButton()}
        </nav>
      </form>
    ];

    return (
      <RequireHealthOverlay require='node'>
        {isImport ? (
          <Card>{body}</Card>
        ) : (
          <AccountCard
            address={address}
            name={
              address && !name
                ? i18n.t(`${packageNS}:account.existing.no_name`)
                : name
            }
            drawers={body}
            i18n={i18n}
            packageNS={packageNS}
          />
        )}
      </RequireHealthOverlay>
    );
  }

  renderButton = () => {
    const {
      createAccountStore: { isImport, bip39Phrase }
    } = this.props;
    const { isLoading, value } = this.state;

    // If we are creating a new account, the button just checks the phrase has
    // been correctly written by the user.
    if (!isImport) {
      return (
        <button className='button' disabled={value !== bip39Phrase}>
          {i18n.t(`${packageNS}:navigation.next`)}
        </button>
      );
    }

    // If we are importing an existing account, the button goes to the next step
    return (
      <button className='button' disabled={!value.length || isLoading}>
        {i18n.t(`${packageNS}:navigation.next`)}
      </button>
    );
  };
}

export default AccountRewritePhrase;
