#!/bin/sh

yarn build && docker build -t lit-did-resolver . -f Dockerfile
