#!/usr/bin/env bash

RELEASE=$(cd $(dirname $0)/ && pwd)
PRE_COMMIT=${RELEASE}/.git/hooks/pre-commit
REPO_PRE_COMMIT='.githooks/pre-commit.sh'

if [ ! -f ${PRE_COMMIT} ]; then
  echo "#!/bin/bash" > ${PRE_COMMIT}
  chmod +x ${PRE_COMMIT}
fi

if grep -q ${REPO_PRE_COMMIT} ${PRE_COMMIT}; then
  echo "pre-commit already installed."
else
  echo >> ${PRE_COMMIT}
  echo "${RELEASE}/${REPO_PRE_COMMIT}" >> ${PRE_COMMIT}
  echo "pre-commit installed."
fi