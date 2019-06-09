// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

export const addressShort = address =>
  address ? `${address.slice(0, 6)}..${address.slice(-4)}` : '';
