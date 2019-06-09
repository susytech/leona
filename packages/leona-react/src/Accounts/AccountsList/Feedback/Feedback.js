// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

import i18n, { packageNS } from '../../../i18n';

export const Feedback = ({ accountsListLength }) => (
  <a
    className='feedback'
    href='https://octonion.institute/susytech/leona/issues/new'
    rel='noopener noreferrer'
    target='_blank'
  >
    {i18n.t(`${packageNS}:feedback:title`)}
  </a>
);
