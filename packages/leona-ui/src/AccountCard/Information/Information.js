// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

import PropTypes from 'prop-types';

export const Information = ({ children, ...otherProps }) => (
  <div className='account_information' {...otherProps}>
    {children}
  </div>
);

Information.propTypes = {
  children: PropTypes.node
};
