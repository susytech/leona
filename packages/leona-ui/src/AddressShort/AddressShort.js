// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { addressShort } from '../utils/addressShort';

export const AddressShort = ({ address, as: T = 'span', ...otherProps }) => (
  <T {...otherProps}>{addressShort(address)}</T>
);

AddressShort.propTypes = {
  address: PropTypes.string.isRequired
};
