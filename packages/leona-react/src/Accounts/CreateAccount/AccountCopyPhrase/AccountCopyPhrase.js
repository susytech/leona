// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard } from 'leona-ui';
import { inject, observer } from 'mobx-react';

import i18n, { packageNS } from '../../../i18n';
import RequireHealthOverlay from '../../../RequireHealthOverlay';

@inject('createAccountStore')
@observer
class AccountCopyPhrase extends Component {
  handleSubmit = () => {
    const {
      history,
      location: { pathname }
    } = this.props;

    const currentStep = pathname.slice(-1);

    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  render () {
    const {
      createAccountStore: { address, name, bip39Phrase },
      history,
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);

    return (
      <RequireHealthOverlay require='node'>
        <AccountCard
          address={address}
          name={name}
          drawers={[
            <form key='createAccount' onSubmit={this.handleSubmit}>
              <div className='text'>
                <p>{i18n.t(`${packageNS}:account.create.copy_phrase.msg1`)}</p>
              </div>
              <div className='text -code'>{bip39Phrase}</div>
              <div className='text'>
                <div className='text -tiny'>
                  {i18n.t(`${packageNS}:account.create.copy_phrase.msg2`)}
                  <ul className='-bulleted'>
                    <li>
                      {i18n.t(`${packageNS}:account.create.copy_phrase.msg3`)}
                    </li>
                    <li>
                      {i18n.t(`${packageNS}:account.create.copy_phrase.msg4`)}
                    </li>
                  </ul>
                </div>
              </div>
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
                <button autoFocus className='button'>
                  {i18n.t(`${packageNS}:navigation.next`)}
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

export default AccountCopyPhrase;
