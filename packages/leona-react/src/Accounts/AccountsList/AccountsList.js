// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Clickable, Header } from 'leona-ui';
import { chainId$ } from '@susy-js/light.js';
import { inject, observer } from 'mobx-react';
import light from '@susy-js/light.js-react';

import i18n, { packageNS } from '../../i18n';
import RequireHealthOverlay from '../../RequireHealthOverlay';
import Health from '../../Health';
import withAccountsInfo from '../../utils/withAccountsInfo';
import Feedback from './Feedback';

@withAccountsInfo
@inject('createAccountStore', 'susyStore')
@light({
  chainId: () => chainId$()
})
@observer
class AccountsList extends Component {
  handleClick = ({
    currentTarget: {
      dataset: { address }
    }
  }) => {
    const { history } = this.props;

    history.push(`/tokens/${address}`);
  };

  handleCreateAccount = () => {
    this.props.createAccountStore.setIsImport(false);
    this.props.history.push('/accounts/new');
  };

  render () {
    const { accountsInfo, chainId } = this.props;

    const accountsList = Object.keys(accountsInfo).filter(
      key =>
        !accountsInfo[key].chainId ||
        accountsInfo[key].chainId === parseInt(chainId, 10)
    );
    const accountsListLength = accountsList && accountsList.length;

    return (
      <RequireHealthOverlay require='node'>
        <div className='accounts-list'>
          <Header
            right={
              <Clickable
                className='icon -new'
                onClick={this.handleCreateAccount}
              />
            }
            title={<h1>{i18n.t(`${packageNS}:accounts_list.header`)}</h1>}
          />

          <div className='window_content'>
            <div className='box -scroller'>
              {accountsListLength ? (
                <ul className='list'>
                  {accountsList.map(address => (
                    <li
                      key={address}
                      data-address={address} // Using data- to avoid creating a new item Component
                      onClick={this.handleClick}
                    >
                      <AccountCard
                        address={address}
                        className='-clickable'
                        i18n={i18n}
                        name={
                          accountsInfo[address].name ||
                          i18n.t(`${packageNS}:account.existing.no_name`)
                        }
                        packageNS={packageNS}
                        screen='accounts'
                        shortAddress
                        type={accountsInfo[address].type}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='create-hint'>
                  {i18n.t(`${packageNS}:accounts_list.hint.none`)}
                  <br />
                  <br />
                  {i18n.t(`${packageNS}:accounts_list.hint.exist`)}
                </p>
              )}
            </div>
          </div>
          <nav className='footer-nav'>
            <div className='footer-nav_status'>
              <Health />
            </div>
            <div className='footer-feedback'>
              <Feedback accountsListLength={accountsListLength} />
            </div>
          </nav>
        </div>
      </RequireHealthOverlay>
    );
  }
}

export default AccountsList;
