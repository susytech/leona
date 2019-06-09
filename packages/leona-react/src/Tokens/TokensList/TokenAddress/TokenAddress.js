// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { AccountCard } from 'leona-ui';
import { withRouter } from 'react-router-dom';

import i18n, { packageNS } from '../../../i18n';
import withAccount from '../../../utils/withAccount';

@withRouter
@withAccount
@inject('sendStore')
class TokenAddress extends Component {
  static propTypes = {
    copyAddress: PropTypes.bool,
    drawers: PropTypes.arrayOf(PropTypes.node),
    shortAddress: PropTypes.bool
  };

  render () {
    const {
      account: { address, name, type },
      copyAddress,
      drawers,
      shortAddress
    } = this.props;

    return (
      <AccountCard
        address={address}
        copyAddress={copyAddress}
        drawers={drawers}
        i18n={i18n}
        name={name}
        packageNS={packageNS}
        shortAddress={shortAddress}
        type={type}
      />
    );
  }
}

export default TokenAddress;
