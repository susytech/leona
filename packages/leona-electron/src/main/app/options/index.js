// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { DEFAULT_OPTIONS, SECURITY_OPTIONS, TASKBAR_OPTIONS } from './config';

export default (withTaskbar, customOptions) =>
  withTaskbar
    ? Object.assign(
      {},
      DEFAULT_OPTIONS,
      TASKBAR_OPTIONS,
      customOptions || {},
      SECURITY_OPTIONS
    )
    : Object.assign({}, DEFAULT_OPTIONS, customOptions || {}, SECURITY_OPTIONS);
