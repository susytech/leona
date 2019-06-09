// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AccountsList from './AccountsList';
import CreateAccount from './CreateAccount';

class Accounts extends PureComponent {
  render () {
    return (
      <Switch>
        <Route exact path='/accounts' component={AccountsList} />
        <Route path='/accounts/new/:step' component={CreateAccount} />
        <Redirect from='/accounts/new' to='/accounts/new/1' />
      </Switch>
    );
  }
}

export default Accounts;
