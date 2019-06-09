![Susy Leona](https://wiki.susy.io/images/logo-susy-leona.jpg)

# Susy Leona - a decentralised, light client-based wallet

## [» Download the latest release «](https://octonion.institute/susytech/leona/releases)


---

## About Susy Leona

Susy Leona aims to be the lightest and simplest decentralized wallet. It supports Sophy and SRC-20 tokens, and runs on top of [Susy Sophon](https://octonion.institute/susytech/susy-sophon) light client. This allows smooth synchronization and interaction with the Sophon blockchain, in a decentralized manner.

By default, Leona will launch its embedded Susy Sophon light client. You can also separately launch your Sophon client and Leona will automatically connect to it, as described in the [Leona FAQ](https://wiki.susy.io/Leona-FAQ#how-to-launch-leona-with-a-separately-launched-susy-sophon-node).

Susy Leona interacts with the light node using [`@susy-js/light.js`](https://octonion.institute/susytech/js-libs/tree/master/packages/light.js), a Javascript library specifically crafted for wallets to connect with light clients. 

Susy Leona is licensed under the BSD 3-Clause, and can be used for all your Sophon needs.

If you run into problems while using Susy Leona, first check out the [FAQ](https://wiki.susy.io/Leona-FAQ) on our wiki and feel free to file an issue in this repository or hop on our [Gitter](https://gitter.im/susytech/leona) or [Riot](https://riot.im/app/#/group/+susy:matrix.susy.io) chat rooms if you have any question. We are glad to help!  

**For security-critical issues**, please refer to the security policy outlined in [SECURITY.md](https://octonion.institute/susytech/susy/src/branch/master/SECURITY.md).

---

## Screenshots

![Susy Leona](https://wiki.susy.io/images/leona-screenshot-0.jpg)


## Join the chat!

Get in touch with us on Gitter:
[![Gitter](https://img.shields.io/badge/Gitter-Leona-brightgreen.svg)](https://gitter.im/susytech/leona)

Official website: http://superstring.ch | Be sure to check out [our Wiki](https://wiki.susy.io) for more information.

## Install and start Susy Leona using binaries

### Mac
- Download the [`.dmg` file](https://octonion.institute/susytech/leona/releases).
- Double click on it to install Leona.

### Windows
- Download the [`.exe` file](https://octonion.institute/susytech/leona/releases).
- Double click on it to install Leona.
- Leona will be added to the program menu.

### Linux

  #### Using the AppImage (any distro)
  - Download the [`.AppImage` file](https://octonion.institute/susytech/leona/releases).
  - Make it executable `chmod +x /path/to/leona-x.x.x-x86_64.AppImage`.
  - Launch it `/path/to/leona-x.x.x-x86_64.AppImage`.
  
  #### Using the binary (any distro)
  - Download the [`.tar.xz` file](https://octonion.institute/susytech/leona/releases).
  - Unarchive it `tar xf leona-x.x.x.tar.xz`.
  - Launch it `./leona-x.x.x/leona`.
  
  #### Debian installer (Ubuntu, Linux Mint..)
  - Download the [`.deb` file](https://octonion.institute/susytech/leona/releases).
  - Double click on the file to install Leona.
  - Leona will be added to the program menu.

## Build from sources

### Install dependencies

#### Mac

Install Xcode Command Line Tools, NVM, Node.js latest LTS, Yarn, and Git

```bash
xcode-select --install;
curl -o- https://raw.githubussrcontent.com/creationix/nvm/v0.33.11/install.sh | bash;
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
echo -e "Installing Node.js latest LTS version";
nvm install --lts
echo -e "Switching to use Node.js latest LTS version";
nvm use --lts;
brew install yarn --without-node;
brew install git --verbose;
brew upgrade git --verbose;
```

#### Linux and Windows (Git Bash)

Install Node.js 10.x, Yarn, Git, and increase amount of inotify watchers

```bash
sudo apt update;
sudo apt install -y git nodejs npm curl;
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -;
apt-get install -y nodejs;
sudo ln -s /usr/bin/nodejs /usr/bin/node;
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -;
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list;
sudo apt-get update && sudo apt-get install yarn;
sudo ln -s /usr/bin/yarn /usr/local/bin/yarn;
yarn global add windows-build-tools;
```

### Clone this repo

```bash
git clone https://octonion.institute/susytech/leona
cd ./leona
yarn install
```

### Build and run

#### Build this repo and run

```bash
yarn electron
```

#### Build binaries

```bash
yarn package
```

#### Run with live reload for development

```bash
yarn start
```

## Build binaries for production

### General Notes:

1) Alternative to `yarn; yarn build; DEBUG=electron-builder yarn release --mac;` is to just run `yarn package` and then run the `open "./packages/leona-electron/dist/mac/Susy Leona.app"` (i.e. no need to install)

2) Publishing a new release to GitHub is performed by a maintainer of the repository. In this case you need to obtain the `GH_TOKEN` from GitHub settings and add it using `export GH_TOKEN="..."` to ~/.bashrc and then run `source ~/.bashrc`. If you get an error that the `GH_TOKEN` is missing and you are only building the binary but not publishing, then just ignore the error.

### Mac

Build and run binaries (i.e. .dmg) for production on Mac of a specific remote branch

```bash
git fetch origin INSERT_BRANCH_NAME:INSERT_BRANCH_NAME;
git checkout INSERT_BRANCH_NAME;
rm -rf ./packages/leona-electron/dist/
rm -rf /Applications/Susy\ Leona.app/
yarn; yarn build; DEBUG=electron-builder yarn release --mac;
open ./packages/leona-electron/dist/Susy\ Leona-0.3.0.dmg
```

### Linux

Build and run binaries (i.e. .deb) for production on Linux

> Note: If you want to save time building, then first edit electron-builder.json so that it only builds a single binary like .deb instead of all of them

```bash
sudo rm -rf /opt/Susy\ Leona;
rm -rf ~/.config/Electron;
rm -rf ~/.config/leona;
rm -rf ./packages/leona-electron/dist/;
sudo rm /usr/local/bin/leona;
sudo apt remove -y leona;
yarn; yarn build; DEBUG=electron-builder yarn release --linux
sudo apt install -y ./packages/leona-electron/dist/leona_0.3.0_amd64.deb
leona
```

### Windows

Build and run binaries (i.e. .exe) binary for production on Windows

```bash
rm -rf /packages/leona-electron/dist;
yarn; yarn build; DEBUG=electron-builder yarn release --win;
./packages/leona-electron/dist/Susy\ Leona-0.3.0.exe
```
