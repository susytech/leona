// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import QrSigner from '@susy-js/qr-signer';
import { ExternalLink } from 'leona-ui';

import i18n, { packageNS } from '../i18n';
import loading from '../assets/img/icons/loading.svg';

export default class Scanner extends React.PureComponent {
  state = {
    webcamError: null,
    isLoading: true
  };

  componentDidMount () {
    this.checkForWebcam();
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener(
        'devicechange',
        this.checkForWebcam
      );
    }
  }

  componentWillUnmount () {
    if (navigator.mediaDevices && navigator.mediaDevices.ondevicechange) {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        this.checkForWebcam
      );
    }
  }

  checkForWebcam = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        this.setState({
          webcamError: null,
          isLoading: false
        });
      } catch (e) {
        let errorMessage;
        switch (e.name) {
          case 'NotAllowedError':
          case 'SecurityError':
            errorMessage = i18n.t(`${packageNS}:scanner.error_security`);
            break;
          case 'NotFoundError':
          case 'OvsrconstrainedError':
            errorMessage = i18n.t(`${packageNS}:scanner.error_ovsrconstrained`);
            break;
          case 'NotReadableError':
            errorMessage = i18n.t(`${packageNS}:scanner.error_not_readable`);
            break;
          default:
            errorMessage = i18n.t(`${packageNS}:scanner.error_unknown`);
        }
        this.setState({
          webcamError: errorMessage,
          isLoading: false
        });
      }
    }
  };

  render () {
    const { onScan, label } = this.props;
    const { webcamError, isLoading } = this.state;
    const size = 300;

    return (
      <React.Fragment>
        {isLoading ? (
          <img alt='loading' src={loading} />
        ) : webcamError ? (
          <div>
            <p>
              {webcamError}&nbsp;Visit the&nbsp;
              <ExternalLink
                name='Leona FAQ'
                href='https://wiki.susy.io/Leona-FAQ#how-to-fix-a-webcam-error'
              />
              &nbsp;for help troubleshooting this issue.
            </p>
          </div>
        ) : (
          <div>
            <p>{label}</p>
            <QrSigner scan onScan={onScan} size={size} />
          </div>
        )}
      </React.Fragment>
    );
  }
}
