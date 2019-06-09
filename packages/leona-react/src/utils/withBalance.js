// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@susy-js/contracts/lib/abi/sip20';
import { balanceOf$, makeContract } from '@susy-js/light.js';
import branch from 'recompose/branch';
import compose from 'recompose/compose';
import { fromWei } from '@susy-js/api/lib/util/wei';
import light from '@susy-js/light.js-react';
import { map, startWith } from 'rxjs/operators';
import withProps from 'recompose/withProps';

import { isSrc20TokenAddress } from './chain';

export const withSrc20Balance = light({
  src20Balance: ({ token, account: { address } }) =>
    makeContract(token.address, abi)
      .balanceOf$(address)
      .pipe(
        map(value => value && value.div(10 ** token.decimals)),
        startWith(undefined)
      )
});

// `withSofBalance` is either the SOF or the ETC balance, as it depends
// on what chain they are currently connected to.
export const withSofBalance = light({
  sofBalance: ({ account: { address } }) =>
    balanceOf$(address).pipe(
      map(value => value && fromWei(value)),
      startWith(undefined)
    )
});

/**
 * A HOC on light.js to get the current balance of the account.
 *
 * The component needs to receive a `token` prop as well as an
 * `account: {address}` prop (i.e. needs to be decorated with withAccount).
 *
 * @example
 * @withAccount
 * @withBalance
 * class MyComponent extends React.Component{
 *
 * }
 */
export default compose(
  branch(
    ({ token }) => token && token.address && isSrc20TokenAddress(token.address),
    withSrc20Balance,
    withSofBalance
  ),
  withProps(props => ({
    balance: props.src20Balance || props.sofBalance
  }))
);
