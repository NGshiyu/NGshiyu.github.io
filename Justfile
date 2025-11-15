#!/usr/bin/env just --justfile
export PATH := join(justfile_directory(), "node_modules", "bin") + ":" + env_var('PATH')

build:
  npx hexo generate --dev
clean:
  npx hexo clean
server:
  npx hexo server
run:
  npx hexo clean && npx hexo generate --dev && npx hexo server --dev
all:
  npx hexo clean && npx hexo generate --dev