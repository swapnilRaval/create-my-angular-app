'use strict';

/**
 * Generation strategy:
 * Templates are versioned with Angular 22 and copied by Node fs APIs.
 * The generator does not invoke `ng new` at runtime so it stays
 * deterministic, testable, and free of Unix-only shell assumptions.
 *
 * Upgrade path: bump versions in src/package-json.js and update
 * templates/angular-app to match the current Angular CLI output.
 */

const ANGULAR_MAJOR = 22;

function describeStrategy() {
  return {
    strategy: 'versioned-templates',
    angularMajor: ANGULAR_MAJOR,
    invokesAngularCli: false,
  };
}

module.exports = {
  ANGULAR_MAJOR,
  describeStrategy,
};
