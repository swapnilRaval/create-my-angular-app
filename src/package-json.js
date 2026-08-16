'use strict';

function buildGeneratedPackageJson({ packageName, description, features }) {
  const dependencies = {
    '@angular/animations': '^22.1.2',
    '@angular/cdk': '^22.1.0',
    '@angular/common': '^22.1.2',
    '@angular/compiler': '^22.1.2',
    '@angular/core': '^22.1.2',
    '@angular/forms': '^22.1.2',
    '@angular/material': '^22.1.0',
    '@angular/platform-browser': '^22.1.2',
    '@angular/router': '^22.1.2',
    rxjs: '~7.8.2',
    tslib: '^2.8.1',
    'zone.js': '~0.16.0',
  };

  const devDependencies = {
    '@angular/build': '^22.1.4',
    '@angular/cli': '^22.1.4',
    '@angular/compiler-cli': '^22.1.2',
    '@eslint/js': '^9.34.0',
    'angular-eslint': '^22.1.0',
    eslint: '^9.34.0',
    'eslint-config-prettier': '^10.1.8',
    jsdom: '^26.1.0',
    prettier: '^3.6.2',
    typescript: '~6.0.2',
    'typescript-eslint': '^8.40.0',
    vitest: '^4.0.8',
  };

  if (features.ssr) {
    dependencies['@angular/platform-server'] = '^22.1.2';
    dependencies['@angular/ssr'] = '^22.1.4';
    dependencies.express = '^5.1.0';
    devDependencies['@types/express'] = '^5.0.3';
    devDependencies['@types/node'] = '^22.17.0';
  }

  if (features.pwa) {
    dependencies['@angular/service-worker'] = '^22.1.2';
  }

  if (features.ngrx) {
    dependencies['@ngrx/signals'] = '^22.0.0';
  }

  if (features.storybook) {
    devDependencies.storybook = '^9.1.3';
    devDependencies['@storybook/angular'] = '^9.1.3';
  }

  if (features.sentry) {
    dependencies['@sentry/angular'] = '^10.5.0';
  }

  const scripts = {
    start: 'ng serve',
    build: 'ng build',
    watch: 'ng build --watch --configuration development',
    test: 'ng test --watch=false',
    'test:watch': 'ng test',
    'test:coverage': 'ng test --watch=false --coverage',
    lint: 'ng lint',
    format: 'prettier --write .',
    'format:check': 'prettier --check .',
    typecheck: 'ng build --configuration development --progress=false',
  };

  if (features.playwright !== false) {
    devDependencies['@playwright/test'] = '^1.55.0';
    scripts['test:e2e'] = 'playwright test';
  }

  if (features.ssr) {
    scripts.serve = `node dist/${packageName}/server/server.mjs`;
  }

  if (features.storybook) {
    scripts.storybook = 'storybook dev -p 6006';
    scripts['build-storybook'] = 'storybook build';
  }

  return {
    name: packageName,
    version: '0.0.0',
    private: true,
    description,
    scripts,
    dependencies,
    devDependencies,
    engines: {
      node: '^22.22.3 || ^24.15.0 || >=26.0.0',
    },
  };
}

module.exports = { buildGeneratedPackageJson };
