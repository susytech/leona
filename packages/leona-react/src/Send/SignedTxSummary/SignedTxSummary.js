// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Field, Form } from 'react-final-form';
import { Form as LeonaForm, Header } from 'leona-ui';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withProps } from 'recompose';

import i18n, { packageNS } from '../../i18n';
import RequireHealthOverlay from '../../RequireHealthOverlay';
import TokenAddress from '../../Tokens/TokensList/TokenAddress';
import withAccount from '../../utils/withAccount';
import withBalance, { withSofBalance } from '../../utils/withBalance';
import withTokens from '../../utils/withTokens';

@inject('susyStore', 'sendStore')
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@withAccount
@withBalance // Balance of current token (can be SOF or ETC)
@withSofBalance // SOF or ETC balance
@observer
class SignedTxSummary extends Component {
  handleSubmit = values => {
    const {
      account: { address },
      history,
      sendStore,
      token
    } = this.props;

    return sendStore
      .sendRaw()
      .then(() => history.push(`/send/${token.address}/from/${address}/sent`))
      .catch(error => ({
        password: error.text
      }));
  };

  render () {
    const {
      account: { address },
      sendStore: { tx },
      token
    } = this.props;

    return (
      <div>
        <Header
          left={
            <Link to={`/tokens/${address}`} className='icon -back'>
              {i18n.t(`${packageNS}:navigation.close`)}
            </Link>
          }
          title={
            token && (
              <h1>
                {i18n.t(`${packageNS}:tx.header_send_prefix`, {
                  token: token.name
                })}
              </h1>
            )
          }
        />

        <RequireHealthOverlay require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              <TokenAddress
                copyAddress
                drawers={[
                  <Form
                    key='txForm'
                    initialValues={{
                      from: address,
                      to: tx.to,
                      amount: `${tx.amount} ${token.symbol}`,
                      ...tx
                    }}
                    onSubmit={this.handleSubmit}
                    render={({ handleSubmit, values }) => (
                      <form className='send-form' onSubmit={handleSubmit}>
                        <fieldset className='form_fields'>
                          <Field
                            as='textarea'
                            className='form_field_value'
                            disabled
                            label={i18n.t(`${packageNS}:tx.form.field.to`)}
                            name='to'
                            render={LeonaForm.Field}
                          />

                          <Field
                            className='form_field_value'
                            disabled
                            label={i18n.t(`${packageNS}:tx.form.field.amount`)}
                            name='amount'
                            render={LeonaForm.Field}
                          />

                          {values.to === values.from && (
                            <span>
                              <h3>
                                {i18n.t(
                                  `${packageNS}:tx.form.warning.title_same_sender_receiver`
                                )}
                              </h3>
                              <p>
                                {i18n.t(
                                  `${packageNS}:tx.form.warning.body_same_sender_receiver`
                                )}
                              </p>
                            </span>
                          )}
                        </fieldset>
                        <nav className='form-nav'>
                          <button className='button'>
                            {i18n.t(`${packageNS}:tx.form.button_send`)}
                          </button>
                        </nav>
                      </form>
                    )}
                  />
                ]}
                shortAddress={false}
              />
            </div>
          </div>
        </RequireHealthOverlay>
      </div>
    );
  }
}

export default SignedTxSummary;
