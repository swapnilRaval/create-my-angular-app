# create-my-angular-app

Scaffold a production-oriented Angular 22 standalone application with one command.

```bash
npx create-my-angular-app my-project
cd my-project
npm start
```

After global installation:

```bash
npm install -g create-my-angular-app
create-my-angular-app my-project
```

The generated app includes routing, Angular Material, cookie-session auth architecture, Users CRUD, functional guards/interceptors, Vitest, ESLint, and Prettier. Optional extras stay off unless you ask for them.

## Why templates instead of `ng new`

The generator copies versioned templates and then writes a compatible `package.json`. It does not invoke `ng new` at runtime.

That keeps generation deterministic on Windows, macOS, and Linux, makes the CLI testable with temporary directories, and lets you upgrade Angular by updating templates and publishing a new generator version.

## Requirements

- Node.js 20.9 or newer to run the generator
- Node.js 22.22.3 or newer to install and build a generated app

## CLI options

```text
npx create-my-angular-app [project-name] [options]

  -y, --yes                 Skip prompts
  --skip-install            Do not install dependencies
  --skip-git                Do not run git init
  --force                   Allow a non-empty directory
  --pm, --package-manager   npm | pnpm | yarn | bun
  --use-npm | --use-pnpm | --use-yarn | --use-bun
  --description <text>
  --ssr --pwa --i18n --ngrx
  --storybook --playwright --no-playwright
  --sentry --analytics --docker
```

Defaults (with `--yes` or after accepting prompts):

- Auth, Material, Router, Users CRUD, Vitest, ESLint, Prettier
- Playwright on
- SSR, PWA, i18n, NgRx, Storybook, Sentry, analytics, and Docker off

`--skip-install` skips `npm install` / `pnpm install` / etc. Lint, test, and build cannot run until dependencies are installed.

## Prompts

Without `--yes`, the CLI asks for the project name, description, install, git, and optional extras.

## Local development

```bash
cd create-my-angular-app
npm install
npm test
```

### npm link

```bash
npm link
create-my-angular-app test-project --yes --skip-install
```

Unlink later with `npm unlink -g create-my-angular-app`.

### npm pack

```bash
npm pack
npm install -g ./create-my-angular-app-1.0.0.tgz
create-my-angular-app packed-app --yes --skip-install
```

## Publishing

```bash
npm login
npm whoami
npm publish
```

Version bumps:

```bash
npm version patch
npm version minor
npm version major
```

Use a scoped name such as `@you/create-my-angular-app` if the unscoped name is taken. Then run `npx @you/create-my-angular-app my-project`.

## Updating the generator

1. Change files under `templates/angular-app` or `templates/optional`.
2. Update versions in `src/package-json.js` together.
3. Add or adjust tests in `tests/generator.test.js`.
4. Run `npm test`.
5. Publish a new version.

New projects pick up the new boilerplate. Existing apps are not migrated automatically.

## Package structure

```text
create-my-angular-app/
  bin/cli.js
  src/
  templates/angular-app/
  templates/optional/
  tests/generator.test.js
```

Placeholders: `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`, `{{APP_TITLE}}`, `{{CLASS_PREFIX}}`.  
Conditionals: `{{#if FEATURE}}` / `{{#unless FEATURE}}`.  
Dotfile templates: `gitignore` → `.gitignore`.

## Cross-platform notes

The CLI uses Node `fs` / `path` and `cross-spawn`. It does not call `rm -rf`, `cp`, or `mkdir -p`.

On Windows PowerShell, `npx create-my-angular-app my-project` works the same as on macOS/Linux.

## License

MIT
