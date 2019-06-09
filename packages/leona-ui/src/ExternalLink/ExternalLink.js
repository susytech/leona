// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

export const ExternalLink = ({ name, href }) => (
  <a
    className='external-link'
    href={href}
    target='_blank'
    rel='noopener noreferrer'
  >
    {name}
  </a>
);
