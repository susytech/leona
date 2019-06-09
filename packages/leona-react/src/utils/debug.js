// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import debug from 'debug';

import { name } from '../../package.json';

const Debug = namespace => debug(`${name}:${namespace}`);

export default Debug;
