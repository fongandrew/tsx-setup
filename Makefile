.PHONY: default setup clean build lint test watch

# Put Node bins in path
export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash

default: build

setup:
	yarn install

clean:
	rm -rf public

build: clean
	webpack

lint:
	tslint --type-check --project tsconfig.json

test:
	ts-node --project tsconfig.test.json \
		node_modules/.bin/tape 'src/**/*.test.*' | tap-spec

watch:
	 webpack-dev-server