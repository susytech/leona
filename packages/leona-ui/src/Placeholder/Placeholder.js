// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';

export const Placeholder = ({ height, width, ...otherProps }) => (
  <ContentLoader
    className='placeholder'
    height={height}
    style={{ height, width }}
    width={width}
    {...otherProps}
  >
    <rect x='0' y='0' rx='0' ry='0' height={height} width={width} />
  </ContentLoader>
);

Placeholder.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};
