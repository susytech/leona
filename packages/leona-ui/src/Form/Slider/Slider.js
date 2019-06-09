// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

import { Field } from '../Field';

export const Slider = ({ centerText, leftText, rightText, ...otherProps }) => (
  <Field {...otherProps}>
    <nav className='range-nav'>
      <span className='range-nav_label'>{leftText}</span>
      <span className='range-nav_value'>{centerText}</span>
      <span className='range-nav_label'>{rightText}</span>
    </nav>
  </Field>
);
