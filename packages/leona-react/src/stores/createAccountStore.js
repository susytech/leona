// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, computed, observable } from 'mobx';

import bip39 from 'bip39';
import hdkey from 'sophonjs-wallet/hdkey';

import localForage from 'localforage';
import LS_PREFIX from './utils/lsPrefix';

import Debug from '../utils/debug';
import susyStore from './susyStore';
import getSusyWordlist from './utils/getSusyWordlist';

const debug = Debug('createAccountStore');

const DERIVATION_PATH = "m/44'/60'/0'/0/0";
const SOPHON_ADDRESS_LENGTH = 40;
const JSON_VERSION = 3;
const MIN_SUSY_SIGNER_RECOVERY_WORDS = 11;
const MAX_SUSY_SIGNER_RECOVERY_WORDS = 24;
export const SIGNER_ACCOUNTS_LS_KEY = `${LS_PREFIX}::susySignerAccounts`;

export class CreateAccountStore {
  @observable
  address = null;

  @observable
  bip39Phrase = null; // 12 to 24-word seed phrase

  @observable
  isImport = false; // Are we creating a new account, or importing via phrase?

  @observable
  jsonString = null;

  @observable
  name = ''; // Account name

  @observable
  susyPhrase = null; // 11 or 12-word seed phrase (Susy Signer is used to generate an 11-word recovery phrase)

  @observable
  signerChainId = null;

  @action
  setIsImport = isImport => {
    this.isImport = isImport;
  };

  /**
   * Reinitialize account information
   */
  @action
  clear = () => {
    this.address = null;
    this.bip39Phrase = null;
    this.jsonString = null;
    this.name = '';
    this.susyPhrase = null;
    this.signerChainId = null;
  };

  /**
   * Generate a BIP39 seed phrase and derive the address from it
   */
  generateNewAccount = async () => {
    debug('Generating new account.');

    const mnemonic = bip39.generateMnemonic();
    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    const wallet = hdwallet.derivePath(DERIVATION_PATH).getWallet();
    const address = `0x${wallet.getAddress().toString('hex')}`;

    this.bip39Phrase = mnemonic;
    this.address = address;
  };

  saveAccountToSusy = async password => {
    debug('Saving account to Susy.');

    if (this.noPrivateKey) {
      // Store new Signer account in local storage
      // If the address of the account to add doesn't already exist, add it
      const accounts =
        (await localForage.getItem(SIGNER_ACCOUNTS_LS_KEY)) || [];

      if (
        !accounts.some(
          ({ address: existingAddress }) =>
            existingAddress.toLowerCase() === this.address.toLowerCase()
        )
      ) {
        accounts.push({
          address: this.address,
          name: this.name,
          chainId: this.signerChainId
        });
      }
      await localForage.setItem(SIGNER_ACCOUNTS_LS_KEY, accounts);
    } else {
      // Otherwise, store the new account in the node
      if (this.jsonString) {
        await susyStore.api.susy.newAccountFromWallet(
          this.jsonString,
          password
        );
      } else if (this.susyPhrase) {
        await susyStore.api.susy.newAccountFromPhrase(
          this.susyPhrase,
          password
        );
      } else if (this.bip39Phrase) {
        await susyStore.api.susy.newAccountFromSecret(
          '0x' +
            hdkey
              .fromMasterSeed(bip39.mnemonicToSeed(this.bip39Phrase))
              .derivePath(DERIVATION_PATH)
              .getWallet()
              .getPrivateKey()
              .toString('hex'),
          password
        );
      } else {
        throw new Error(
          'saveAccountToSusy: no JSON, Susy phrase, BIP39 phrase or address'
        );
      }

      await susyStore.api.susy.setAccountName(this.address, this.name);
      await susyStore.api.susy.setAccountMeta(this.address, {
        timestamp: Date.now()
      });
    }
  };

  /**
   * Set phrase (detect type) and corresponding address
   */

  setPhrase = phrase => {
    return this.setBip39Phrase(phrase).catch(() =>
      this.setSusyPhrase(phrase)
    );
  };

  setBip39Phrase = async phrase => {
    this.clear();

    if (!bip39.validateMnemonic(phrase)) throw new Error('Not a BIP39 phrase');

    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(phrase));
    const wallet = hdwallet.derivePath(DERIVATION_PATH).getWallet();

    this.address = `0x${wallet.getAddress().toString('hex')}`;
    this.bip39Phrase = phrase;
  };

  setSusyPhrase = async phrase => {
    this.clear();

    const words = phrase.split(' ');
    const SUSY_WORDLIST = getSusyWordlist();

    if (
      words.length < MIN_SUSY_SIGNER_RECOVERY_WORDS ||
      words.length > MAX_SUSY_SIGNER_RECOVERY_WORDS ||
      !words.every(word => SUSY_WORDLIST.has(word))
    ) {
      throw new Error('Not a Susy phrase');
    }

    return susyStore.api.susy.phraseToAddress(phrase).then(
      action(address => {
        this.address = address;
        this.susyPhrase = phrase;
      })
    );
  };

  /**
   * Recover from a JSON keyfile
   */

  @action
  setJsonString = async jsonString => {
    this.clear();

    const json = JSON.parse(jsonString);

    if (
      !json ||
      json.address.length !== SOPHON_ADDRESS_LENGTH ||
      json.version !== JSON_VERSION
    ) {
      throw new Error('File is not valid json');
    }

    this.jsonString = jsonString;
    this.address = `0x${json.address}`;

    if (json.name) {
      this.setName(json.name);
    }
  };

  @action
  setName = async name => {
    this.name = name;
  };

  @action
  importFromSigner = async ({ address, signerChainId }) => {
    this.clear();

    this.address = address;
    this.signerChainId = signerChainId;
  };

  // Returns true for Signer account imports
  @computed
  get noPrivateKey () {
    return !this.jsonString && !this.susyPhrase && !this.bip39Phrase;
  }
}

export default new CreateAccountStore();
