// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

// FIXME Use a button here, which the minimum amount of style to look like
// an <a>.
export const Clickable = ({ children, ...otherProps }) => (
  <a href='#' {...otherProps}>
    {children}
  </a>
);
