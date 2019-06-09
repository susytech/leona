// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import path from 'path';

const { app } = electron;
const IS_TEST = !app;
const IS_PACKAGED = !IS_TEST && app.isPackaged;

/**
 * Get the path to the `static` folder.
 *
 * @see https://github.com/electron-userland/electron-webpack/issues/52
 */
const staticPath = IS_PACKAGED
  ? __dirname.replace(/app\.asar$/, 'static')
  : path.join(process.cwd(), 'static');

/**
 * Get the path to the bundled Susy Sophon binary.
 */
const bundledSusyPath =
  process.platform === 'win32'
    ? path.join(staticPath, 'susy.exe')
    : path.join(staticPath, 'susy');

export { IS_PACKAGED, bundledSusyPath, staticPath };
