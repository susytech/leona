// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';

import RequireHealthOverlay from '../../RequireHealthOverlay';
import withTokens from '../../utils/withTokens';
import TokenBalance from './TokenBalance';

@withTokens
class TokensList extends Component {
  render () {
    const { tokensArray } = this.props;
    // Show empty token placeholder if tokens have not been loaded yet
    const shownArray = tokensArray.length ? tokensArray : [{}];
    return (
      <RequireHealthOverlay require='sync'>
        <div className='window_content'>
          <div className='box -scroller'>
            <ul className='list -padded'>
              {shownArray.map((
                token,
                index // With empty tokens, the token.address is not defined, so we prefix with index
              ) => (
                <li key={`${index}-${token.address}`}>
                  <TokenBalance token={token} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RequireHealthOverlay>
    );
  }
}

export default TokensList;
