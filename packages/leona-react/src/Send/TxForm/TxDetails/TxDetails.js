// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { fromWei, toWei } from '@susy-js/api/lib/util/wei';

import i18n, { packageNS } from '../../../i18n';
import { chainIdToString, isNotSrc20TokenAddress } from '../../../utils/chain';

class TxDetails extends Component {
  renderDetails = () => {
    const { estimatedTxFee, token, values } = this.props;

    if (
      !estimatedTxFee ||
      !values.gasPrice ||
      !values.amount ||
      !values.chainId ||
      !values.sofBalance ||
      !values.gas ||
      !values.gasPrice ||
      !values.transactionCount ||
      !token.address
    ) {
      // Keep line break so message is centered
      return `
${i18n.t(`${packageNS}:tx.form.details.missing_fields`)}`;
    }

    return `${this.renderCalculation()}
${this.renderFee()}
${this.renderTotalAmount()}`;
  };

  renderCalculation = () => {
    const { estimatedTxFee, values } = this.props;

    if (!estimatedTxFee || !values.gasPrice) {
      return;
    }

    const gasPriceBn = new BigNumber(values.gasPrice.toString());
    const gasLimitBn = estimatedTxFee
      .div(gasPriceBn)
      .div(10 ** 9)
      .toFixed(0)
      .toString();

    return i18n.t(`${packageNS}:tx.form.details.gas_limit`, {
      gas_limit: gasLimitBn
    });
  };

  renderFee = () => {
    const { estimatedTxFee, values } = this.props;
    const currentChainIdBN = values.chainId;

    if (!estimatedTxFee) {
      return;
    }

    const fee = `${fromWei(estimatedTxFee, 'sophy')
      .toFixed(9)
      .toString()}`;

    return i18n.t(`${packageNS}:tx.form.details.fee`, {
      chain_id: chainIdToString(currentChainIdBN),
      fee
    });
  };

  renderTotalAmount = () => {
    const { estimatedTxFee, token, values } = this.props;
    const currentChainIdBN = values.chainId;

    if (!estimatedTxFee || !values.amount || !token.address) {
      return;
    }

    const totalAmount = `${fromWei(
      estimatedTxFee.plus(
        isNotSrc20TokenAddress(token.address)
          ? toWei(values.amount.toString())
          : 0
      ),
      'sophy'
    ).toString()}`;

    return i18n.t(`${packageNS}:tx.form.details.total_amount`, {
      chain_id: chainIdToString(currentChainIdBN),
      total_amount: totalAmount
    });
  };

  render () {
    const { showDetails } = this.props;

    return (
      <div>
        <div className='form_field'>
          <div hidden={!showDetails}>
            <label htmlFor='txDetails'>
              {i18n.t(`${packageNS}:tx.form.details.title`)}
            </label>
            <textarea
              className='-sm-details'
              id='txDetails'
              readOnly
              value={this.renderDetails()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TxDetails;
