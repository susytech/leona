// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '../Card';
import { Placeholder } from '../Placeholder';

export const TokenCard = ({
  balance,
  children,
  decimals,
  defaultTokenImage,
  showBalance,
  token,
  ...otherProps
}) => (
  <Card {...otherProps}>
    <div className='token'>
      <div className='token_icon'>
        {!!token && !!token.logo ? (
          <img
            alt={token.symbol}
            src={token.logo}
            onError={ev => {
              ev.target.onerror = null;
              ev.target.src = defaultTokenImage;
            }}
          />
        ) : (
          <img alt={token.symbol} src={defaultTokenImage} />
        )}
      </div>
      <div className='token_name'>
        {token && token.name ? (
          token.name
        ) : (
          <Placeholder height={20} width={100} />
        )}
      </div>
      <div className='token_balance'>
        {balance ? (
          <span>{balance.toFixed(decimals, 1)} </span>
        ) : showBalance ? (
          <Placeholder height={20} width={50} />
        ) : null}
        <span className='token_symbol'>{token && token.symbol}</span>
      </div>
      {children}
    </div>
  </Card>
);

TokenCard.defaultProps = {
  decimals: 2,
  showBalance: true
};

TokenCard.propTypes = {
  decimals: PropTypes.number.isRequired,
  defaultTokenImage: PropTypes.string,
  token: PropTypes.shape({
    logo: PropTypes.string,
    name: PropTypes.string,
    symbol: PropTypes.string
  })
};

export default TokenCard;
