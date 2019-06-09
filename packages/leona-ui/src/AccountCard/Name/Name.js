// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Placeholder } from '../../Placeholder';

export const Name = ({ name, screen, ...otherProps }) => (
  <div
    className={`account_name ${screen === 'account' ? '-header' : ''}`}
    {...otherProps}
  >
    {name || <Placeholder height={14} width={100} />}
  </div>
);

Name.propTypes = {
  name: PropTypes.string,
  screen: PropTypes.string
};
