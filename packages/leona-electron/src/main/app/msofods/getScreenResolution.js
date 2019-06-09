// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { screen } from 'electron';

// https://ourcodeworld.com/articles/read/285/how-to-get-the-screen-width-and-height-in-electron-framework
function getScreenResolution () {
  const mainScreen = screen.getPrimaryDisplay();
  const mainScreenDims = mainScreen.size;

  return { x: mainScreenDims.width, y: mainScreenDims.height };
}

export default getScreenResolution;
