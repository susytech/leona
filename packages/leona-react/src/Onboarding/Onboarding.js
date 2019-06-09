// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Form as LeonaForm, Header } from 'leona-ui';
import { inject, observer } from 'mobx-react';
import ReactMarkdown from 'react-markdown';

import i18n, { packageNS } from '../i18n';
import Health from '../Health';
import termsAndConditions from './termsAndConditions.md';

/**
 * Options to pass into the renderer of ReactMarkdown
 */
const reactMarkdownOptions = {
  link: props => (
    <a href={props.href} target='_blank' rel='noopener noreferrer'>
      {props.children}
    </a>
  )
};

@inject('onboardingStore')
@observer
class Onboarding extends Component {
  state = {
    markdown: ''
  };

  componentWillMount () {
    window
      .fetch(termsAndConditions)
      .then(response => {
        return response.text();
      })
      .then(markdown => {
        this.setState({
          markdown
        });
      });
  }

  handleFirstRun = () => {
    // Not first run anymore after clicking Accept
    this.props.onboardingStore.setIsFirstRun(false);
  };

  render () {
    return (
      <React.Fragment>
        <Header title={<h1>{i18n.t(`${packageNS}:onboarding.header`)}</h1>} />

        <div className='window_content'>
          <div className='box -padded -scroller'>
            <div className='terms-and-conditions-wrapper'>
              <LeonaForm.Field
                as={ReactMarkdown}
                className='terms-and-conditions'
                renderers={reactMarkdownOptions}
                source={this.state.markdown}
                label={i18n.t(`${packageNS}:onboarding.instructions`)}
              />
            </div>
          </div>
        </div>

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
          <div className='footer-nav_icons'>
            <button className='button' onClick={this.handleFirstRun}>
              {i18n.t(`${packageNS}:onboarding.button_accept`)}
            </button>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default Onboarding;
