'use strict';

const path = require('path');

const PACKAGE_ROOT = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(PACKAGE_ROOT, 'templates', 'angular-app');
const OPTIONAL_TEMPLATES_DIR = path.join(PACKAGE_ROOT, 'templates', 'optional');

const DOTFILE_RENAMES = {
  gitignore: '.gitignore',
  editorconfig: '.editorconfig',
  prettierrc: '.prettierrc',
  prettierignore: '.prettierignore',
  dockerignore: '.dockerignore',
  npmrc: '.npmrc',
};

const BINARY_EXTENSIONS = new Set([
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.pdf',
]);

const SUPPORTED_PACKAGE_MANAGERS = ['npm', 'yarn', 'pnpm', 'bun'];

const DEFAULT_DESCRIPTION = 'Angular application generated with create-my-angular-app';

module.exports = {
  PACKAGE_ROOT,
  TEMPLATES_DIR,
  OPTIONAL_TEMPLATES_DIR,
  DOTFILE_RENAMES,
  BINARY_EXTENSIONS,
  SUPPORTED_PACKAGE_MANAGERS,
  DEFAULT_DESCRIPTION,
};
