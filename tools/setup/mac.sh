#!/bin/sh

# You should be able to run this script as many times as you want.

# Check if Homebrew (https://brew.sh/) is installed
## https://github.com/mxcl/homebrew/wiki/installation
which -s brew
if [[ $? != 0 ]] ; then
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  brew update
fi

# install dependencies
brew install git node bash-completion watchman postgres

# upgrade dependencies
brew upgrade git node bash-completion watchman postgres