'format cjs';

const wrap = require('word-wrap');
const map = require('lodash.map');
const longest = require('longest');
const rightPad = require('right-pad');
const chalk = require('chalk');
const { execSync } = require('child_process');
const boxen = require('boxen');

const defaults = require('./defaults');
const LimitedInputPrompt = require('./LimitedInputPrompt');
const filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

const filterSubject = function(subject) {
  subject = subject.trim();
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function(options) {
  const getFromOptionsOrDefaults = function(key) {
    return options[key] || defaults[key];
  };
  const getJiraIssueLocation = function(
    location,
    type = '',
    scope = '',
    jiraWithDecorators,
    subject
  ) {
    let headerPrefix = type + scope;
    if (headerPrefix !== '') {
      headerPrefix += ': ';
    }
    switch (location) {
      case 'pre-type':
        return jiraWithDecorators + headerPrefix + subject;
        break;
      case 'pre-description':
        return headerPrefix + jiraWithDecorators + subject;
        break;
      case 'post-description':
        return headerPrefix + subject + ' ' + jiraWithDecorators;
        break;
      case 'post-body':
        return headerPrefix + subject;
        break;
      default:
        return headerPrefix + jiraWithDecorators + subject;
    }
  };

  // Generate Jira issue prepend and append decorators
  const decorateJiraIssue = function(jiraIssue, options) {
    const prepend = options.jiraPrepend || '';
    const append = options.jiraAppend || '';
    return jiraIssue ? `${prepend}${jiraIssue}${append} ` : '';
  };

  const types = getFromOptionsOrDefaults('types');

  const length = longest(Object.keys(types)).length + 1;
  const choices = map(types, function(type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key
    };
  });

  const minHeaderWidth = getFromOptionsOrDefaults('minHeaderWidth');
  const maxHeaderWidth = getFromOptionsOrDefaults('maxHeaderWidth');

  const branchName = execSync('git branch --show-current')
    .toString()
    .trim();
  const jiraIssueRegex = /(?<jiraIssue>(?<!([a-zA-Z0-9]{1,10})-?)[a-zA-Z0-9]+-\d+)/;
  const matchResult = branchName.match(jiraIssueRegex);
  const jiraIssue =
    matchResult && matchResult.groups && matchResult.groups.jiraIssue;
  const hasScopes =
    options.scopes &&
    Array.isArray(options.scopes) &&
    options.scopes.length > 0;
  const customScope = !options.skipScope && hasScopes && options.customScope;
  const scopes = customScope ? [...options.scopes, 'custom'] : options.scopes;

  const getProvidedScope = function(answers) {
    return answers.scope === 'custom' ? answers.customScope : answers.scope;
  };

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit, testMode) {
      cz.registerPrompt('limitedInput', LimitedInputPrompt);

      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          when: !options.skipType,
          message: `${options.txtType}:`,
          choices: choices,
          default: options.skipType ? '' : options.defaultType
        },
        {
          type: 'input',
          name: 'jira',
          message:
            `${options.txtJiraIssue} (` +
            getFromOptionsOrDefaults('jiraPrefix') +
            '-12345)' +
            (options.jiraOptional ? ' (optional)' : '') +
            ':',
          when: options.jiraMode,
          default: jiraIssue || '',
          validate: function(jira) {
            return (
              (options.jiraOptional && !jira) ||
              /^(?<!([a-zA-Z0-9]{1,10})-?)[a-zA-Z0-9]+-\d+$/.test(jira)
            );
          },
          filter: function(jira) {
            return jira.toUpperCase();
          }
        },
        {
          type: hasScopes ? 'list' : 'input',
          name: 'scope',
          when: !options.skipScope,
          choices: hasScopes ? scopes : undefined,
          message:
            `${options.txtScope}: ` +
            (hasScopes
              ? `(${options.txtScopeListConfirmation})`
              : `(${options.txtScopeInputConfirmation})`),
          default: options.defaultScope,
          filter: function(value) {
            return value.trim().toLowerCase();
          }
        },
        {
          type: 'input',
          name: 'customScope',
          when: ({ scope }) => scope === 'custom',
          message: options.txtCustomScope
        },
        {
          type: 'limitedInput',
          name: 'subject',
          message: `${options.txtSubject}:`,
          default: options.defaultSubject,
          maxLength: maxHeaderWidth - (options.exclamationMark ? 1 : 0),
          leadingLabel: answers => {
            let scope = '';
            const providedScope = getProvidedScope(answers);
            if (providedScope && providedScope !== 'none') {
              scope = `(${providedScope})`;
            }

            const jiraWithDecorators = decorateJiraIssue(answers.jira, options);
            return getJiraIssueLocation(
              options.jiraLocation,
              answers.type,
              scope,
              jiraWithDecorators,
              ''
            ).trim();
          },
          validate: input =>
            input.length >= minHeaderWidth ||
            options.txtSubjectMinCharacters.replace(
              '{MIN_VALUE}',
              minHeaderWidth
            ),
          filter: function(subject) {
            return filterSubject(subject);
          }
        },
        {
          type: 'input',
          name: 'body',
          when: !options.skipDescription,
          message: `${options.txtBody}\n`,
          default: options.defaultBody
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          when: !options.skipBreaking,
          message: options.txtConfirmBreaking,
          default: false
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message: options.txtConfirmBreakingMajorVersion,
          default: false,
          when: function(answers) {
            return answers.isBreaking;
          }
        },
        {
          type: 'input',
          name: 'breaking',
          message: `${options.txtDescribeBreaking}:\n`,
          when: function(answers) {
            return answers.isBreaking;
          }
        },
        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: options.txtConfirmIssueAffected,
          default: !!options.defaultIssues,
          when: !options.jiraMode
        },
        {
          type: 'input',
          name: 'issuesBody',
          default: '-',
          message: `${options.txtIssuesBody}:\n`,
          when: function(answers) {
            return (
              answers.isIssueAffected && !answers.body && !answers.breakingBody
            );
          }
        },
        {
          type: 'input',
          name: 'issues',
          message: `${options.txtIssuesRef}:\n`,
          when: function(answers) {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined
        }
      ]).then(async function(answers) {
        const wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth
        };

        // parentheses are only needed when a scope is present
        const providedScope = getProvidedScope(answers);
        let scope = providedScope ? '(' + providedScope + ')' : '';

        const addExclamationMark = options.exclamationMark && answers.breaking;
        scope = addExclamationMark ? scope + '!' : scope;

        // Get Jira issue prepend and append decorators
        const jiraWithDecorators = decorateJiraIssue(answers.jira, options);

        // Hard limit this line in the validate
        const head = getJiraIssueLocation(
          options.jiraLocation,
          answers.type,
          scope,
          jiraWithDecorators,
          answers.subject
        );

        // Wrap these lines at options.maxLineWidth characters
        let body = answers.body ? wrap(answers.body, wrapOptions) : false;
        if (options.jiraMode && options.jiraLocation === 'post-body') {
          if (body === false) {
            body = '';
          } else {
            body += '\n\n';
          }
          body += jiraWithDecorators.trim();
        }

        // Apply breaking change prefix, removing it if already present
        let breaking = answers.breaking ? answers.breaking.trim() : '';
        breaking = breaking
          ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '')
          : '';
        breaking = breaking ? wrap(breaking, wrapOptions) : false;

        const issues = answers.issues
          ? wrap(answers.issues, wrapOptions)
          : false;

        const fullCommit = filter([head, body, breaking, issues]).join('\n\n');

        if (testMode) {
          return commit(fullCommit);
        }

        console.log();
        console.log(chalk.underline('Commit preview:'));
        console.log(boxen(chalk.green(fullCommit), { padding: 1, margin: 1 }));

        const { doCommit } = await cz.prompt([
          {
            type: 'confirm',
            name: 'doCommit',
            message: options.txtDoCommit
          }
        ]);

        if (doCommit) {
          commit(fullCommit);
        }
      });
    }
  };
};
