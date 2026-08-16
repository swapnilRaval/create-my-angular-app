'use strict';

const fs = require('fs/promises');
const path = require('path');
const { TEMPLATES_DIR, OPTIONAL_TEMPLATES_DIR, DEFAULT_DESCRIPTION } = require('./constants');
const { CliError } = require('./errors');
const { validateProjectName } = require('./validate');
const { assertCreatableDirectory, ensureDir, copyTemplates, pathExists } = require('./file-utils');
const { detectPackageManager, installDependencies, resolvePackageManagerFlag } = require('./package-manager');
const { initializeGit } = require('./git');
const { buildGeneratedPackageJson } = require('./package-json');
const log = require('./logger');

function featureFlags(features) {
  return {
    PLAYWRIGHT: Boolean(features.playwright),
    STORYBOOK: Boolean(features.storybook),
    I18N: Boolean(features.i18n),
    PWA: Boolean(features.pwa),
    ANALYTICS: Boolean(features.analytics),
    SENTRY: Boolean(features.sentry),
    DOCKER: Boolean(features.docker),
    SSR: Boolean(features.ssr),
    NGRX: Boolean(features.ngrx),
  };
}

function nextCommands(directoryName, inPlace, packageManager) {
  const start =
    packageManager === 'yarn'
      ? 'yarn start'
      : packageManager === 'pnpm'
        ? 'pnpm start'
        : packageManager === 'bun'
          ? 'bun start'
          : 'npm start';

  const lines = [];
  if (!inPlace) {
    lines.push(`  cd ${directoryName}`);
  }
  lines.push(`  ${start}`);
  return lines.join('\n');
}

async function writeGeneratedPackageJson(targetDir, identity, description, features) {
  const pkg = buildGeneratedPackageJson({
    packageName: identity.packageName,
    description,
    features,
  });
  await fs.writeFile(path.join(targetDir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

async function copyOptionalTemplates(targetDir, placeholders, features) {
  const selected = Object.entries(features)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name);

  for (const feature of selected) {
    const source = path.join(OPTIONAL_TEMPLATES_DIR, feature);
    if (!(await pathExists(source))) {
      continue;
    }
    await copyTemplates(source, targetDir, placeholders, featureFlags(features));
  }
}

async function generateProject({
  projectName,
  description = DEFAULT_DESCRIPTION,
  install = true,
  git = true,
  force = false,
  packageManager: packageManagerFlag,
  features = {},
}) {
  const identity = validateProjectName(projectName);
  const packageManager = detectPackageManager(packageManagerFlag);
  const flags = featureFlags(features);

  log.info(`Creating project: ${identity.packageName}`);
  await assertCreatableDirectory(identity.targetDir, {
    force,
    inPlace: identity.inPlace,
  });
  await ensureDir(identity.targetDir);

  const placeholders = {
    PROJECT_NAME: identity.packageName,
    PROJECT_DESCRIPTION: description,
    APP_TITLE: identity.appTitle,
    CLASS_PREFIX: identity.classPrefix,
  };

  log.ok('Creating Angular standalone application');
  await copyTemplates(TEMPLATES_DIR, identity.targetDir, placeholders, flags);
  await copyOptionalTemplates(identity.targetDir, placeholders, features);
  await writeGeneratedPackageJson(identity.targetDir, identity, description, features);

  log.ok('Configuring Angular Router');
  log.ok('Configuring Angular Material');
  log.ok('Creating application shell');
  log.ok('Creating authentication architecture');
  log.ok('Creating HTTP/API layer');
  log.ok('Creating guards and interceptors');
  log.ok('Creating forms and validators');
  log.ok('Creating dashboard and CRUD example');
  log.ok('Creating tests');

  if (install) {
    log.info(`Installing dependencies with ${packageManager}`);
    await installDependencies(identity.targetDir, packageManager);
    log.ok('Installing dependencies');
  } else {
    log.warn('Skipped dependency installation (--skip-install)');
  }

  if (git) {
    const committed = await initializeGit(identity.targetDir);
    if (committed) {
      log.ok('Initializing git');
    }
  } else {
    log.warn('Skipped git initialization (--skip-git)');
  }

  log.blank();
  log.ok('Project created successfully');
  log.blank();
  process.stdout.write('Next steps:\n\n');
  process.stdout.write(`${nextCommands(identity.directoryName, identity.inPlace, packageManager)}\n\n`);
  process.stdout.write('The generated app uses a development session only when enabled in environment.development.ts.\n');

  return {
    targetDir: identity.targetDir,
    packageName: identity.packageName,
    packageManager,
    features,
  };
}

async function generateFromCli(answers, flags) {
  if (!answers || !answers.projectName) {
    throw new CliError('Project name is required.');
  }

  return generateProject({
    projectName: answers.projectName,
    description: answers.description,
    install: answers.install,
    git: answers.git,
    force: Boolean(flags.force),
    packageManager: resolvePackageManagerFlag(flags),
    features: answers.features,
  });
}

module.exports = {
  generateProject,
  generateFromCli,
  nextCommands,
  featureFlags,
};
