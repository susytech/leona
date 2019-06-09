// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import electron from 'electron';
import settings from 'electron-settings';

import { name } from '../../../../../package.json';
import Pino from '../../utils/pino';

import { en, de } from './locales';

let { app } = electron;
const pino = Pino();
let resourceEnglishNS = {};
let resourceGermanNS = {};
resourceEnglishNS[name] = en;
resourceGermanNS[name] = de;

const packageNS = Object.keys(resourceEnglishNS)[0].toString();
const moduleNS = 'i18n';
const menuNS = `${packageNS}-${moduleNS}`;

const i18n = i18next;
i18n
  .use(Backend)
  .init({
    debug: true,
    defaultNS: packageNS,
    fallbackLng: ['en-US', 'en', 'de-DE', 'de'],
    interpolation: {
      escapeValue: false
    },
    lng: settings.get('leona-language') || 'en',
    ns: [packageNS],
    resources: {
      en: resourceEnglishNS,
      de: resourceGermanNS
    },
    saveMissing: true
  })
  .then(() => pino.info(`${menuNS}: success`))
  .catch(error => pino.info(`${menuNS}: failure`, error));

// https://www.i18next.com/overview/api#changelanguage
i18n.changeLanguage(app.getLocale(), (err, t) => {
  if (err) {
    pino.info(`${menuNS}: Error loading language ${app.getLocale()}`, err);
  }
});

i18next.on('initialized', options => {
  pino.debug(`${menuNS}: Detected initialisation of i18n`);
});

i18next.on('loaded', loaded => {
  pino.info(`${menuNS}: Detected success loading resources: `, loaded);
});

i18next.on('failedLoading', (lng, ns, msg) => {
  pino.info(`${menuNS}: Detected failure loading resources: `, lng, ns, msg);
});

// saveMissing must be configured to `true`
i18next.on('missingKey', (lngs, namespace, key, res) => {
  pino.info(`${menuNS}: Detected missing key: `, lngs, namespace, key, res);
});

i18next.store.on('added', (lng, ns) => {
  pino.debug(`${menuNS}: Detected resources added: `, lng, ns);
});

i18next.store.on('removed', (lng, ns) => {
  pino.debug(`${menuNS}: Detected resources removed: `, lng, ns);
});

// https://www.i18next.com/overview/api#changelanguage
i18next.on('languageChanged', lng => {
  pino.info(`${menuNS}: Detected language change to: `, lng);
});

export default i18n;
