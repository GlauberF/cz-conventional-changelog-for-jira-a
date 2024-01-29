'format cjs';

const engine = require('./engine');
const conventionalCommitTypes = require('./types');
const defaults = require('./defaults');
const configLoader = require('commitizen').configLoader;

const config = configLoader.load();

function getEnvOrConfig(env, configVar, defaultValue) {
  const isEnvSet = Boolean(env);
  const isConfigSet = typeof configVar === 'boolean';

  if (isEnvSet) return env === 'true';
  if (isConfigSet) return configVar;
  return defaultValue;
}

const options = {
  types: conventionalCommitTypes,
  scopes: config.scopes,
  jiraMode: getEnvOrConfig(
    process.env.CZ_JIRA_MODE,
    config.jiraMode,
    defaults.jiraMode
  ),
  skipScope: getEnvOrConfig(
    process.env.CZ_SKIP_SCOPE,
    config.skipScope,
    defaults.skipScope
  ),
  skipType: getEnvOrConfig(
    process.env.CZ_SKIP_TYPE,
    config.skipType,
    defaults.skipType
  ),
  skipDescription: getEnvOrConfig(
    process.env.CZ_SKIP_DESCRIPTION,
    config.skipDescription,
    defaults.skipDescription
  ),
  skipBreaking: getEnvOrConfig(
    process.env.CZ_SKIP_BREAKING,
    config.skipBreaking,
    defaults.skipBreaking
  ),
  customScope: getEnvOrConfig(
    process.env.CZ_CUSTOM_SCOPE,
    config.customScope,
    defaults.customScope
  ),
  defaultType: process.env.CZ_TYPE || config.defaultType,
  defaultScope: process.env.CZ_SCOPE || config.defaultScope,
  defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject,
  defaultBody: process.env.CZ_BODY || config.defaultBody,
  defaultIssues: process.env.CZ_ISSUES || config.defaultIssues,
  maxHeaderWidth:
    (process.env.CZ_MAX_HEADER_WIDTH &&
      parseInt(process.env.CZ_MAX_HEADER_WIDTH)) ||
    config.maxHeaderWidth ||
    defaults.maxHeaderWidth,
  minHeaderWidth:
    (process.env.CZ_MIN_HEADER_WIDTH &&
      parseInt(process.env.CZ_MIN_HEADER_WIDTH)) ||
    config.minHeaderWidth ||
    defaults.minHeaderWidth,
  maxLineWidth:
    (process.env.CZ_MAX_LINE_WIDTH &&
      parseInt(process.env.CZ_MAX_LINE_WIDTH)) ||
    config.maxLineWidth ||
    defaults.maxLineWidth,
  jiraOptional: getEnvOrConfig(
    process.env.CZ_JIRA_OPTIONAL,
    config.jiraOptional,
    defaults.jiraOptional
  ),
  jiraPrefix:
    process.env.CZ_JIRA_PREFIX || config.jiraPrefix || defaults.jiraPrefix,
  jiraLocation:
    process.env.CZ_JIRA_LOCATION ||
    config.jiraLocation ||
    defaults.jiraLocation,
  jiraPrepend:
    process.env.CZ_JIRA_PREPEND || config.jiraPrepend || defaults.jiraPrepend,
  jiraAppend:
    process.env.CZ_JIRA_APPEND || config.jiraAppend || defaults.jiraAppend,
  exclamationMark: getEnvOrConfig(
    process.env.CZ_EXCLAMATION_MARK,
    config.exclamationMark,
    defaults.exclamationMark
  ),
  txtJiraIssue: getEnvOrConfig(
    process.env.CZ_TXT_TYPE,
    config.txtJiraIssue,
    defaults.txtJiraIssue
  ),
  txtType: getEnvOrConfig(
    process.env.CZ_TXT_JIRA_ISSUE,
    config.txtType,
    defaults.txtType
  ),
  txtScope: getEnvOrConfig(
    process.env.CZ_TXT_SCOPE,
    config.txtScope,
    defaults.txtScope
  ),
  txtScopeListConfirmation: getEnvOrConfig(
    process.env.CZ_TXT_SCOPE_LIST_CONFIRMATION,
    config.txtScopeListConfirmation,
    defaults.txtScopeListConfirmation
  ),
  txtScopeInputConfirmation: getEnvOrConfig(
    process.env.CZ_TXT_SCOPE_INPUT_CONFIRMATION,
    config.txtScopeInputConfirmation,
    defaults.txtScopeInputConfirmation
  ),
  txtCustomScope: getEnvOrConfig(
    process.env.CZ_TXT_CUSTOM_SCOPE,
    config.txtCustomScope,
    defaults.txtCustomScope
  ),
  txtSubject: getEnvOrConfig(
    process.env.CZ_TXT_SUBJECT,
    config.txtSubject,
    defaults.txtSubject
  ),
  txtSubjectMinCharacters: getEnvOrConfig(
    process.env.CZ_TXT_SUBJECT_MIN_CHARACTERS,
    config.txtSubjectMinCharacters,
    defaults.txtSubjectMinCharacters
  ),
  txtBody: getEnvOrConfig(
    process.env.CZ_TXT_BODY,
    config.txtBody,
    defaults.txtBody
  ),
  txtConfirmBreaking: getEnvOrConfig(
    process.env.CZ_TXT_CONFIRM_BREAKING,
    config.txtConfirmBreaking,
    defaults.txtConfirmBreaking
  ),
  txtDescribeBreaking: getEnvOrConfig(
    process.env.CZ_TXT_DESCRIBE_BREAKING,
    config.txtDescribeBreaking,
    defaults.txtDescribeBreaking
  ),
  txtConfirmIssueAffected: getEnvOrConfig(
    process.env.CZ_TXT_CONFIRM_ISSUE_AFFECTED,
    config.txtConfirmIssueAffected,
    defaults.txtConfirmIssueAffected
  ),
  txtIssuesBody: getEnvOrConfig(
    process.env.CZ_TXT_ISSUES_BODY,
    config.txtIssuesBody,
    defaults.txtIssuesBody
  ),
  txtIssuesRef: getEnvOrConfig(
    process.env.CZ_TXT_ISSUES_REF,
    config.txtIssuesRef,
    defaults.txtIssuesRef
  ),
  txtDoCommit: getEnvOrConfig(
    process.env.CZ_TXT_DO_COMMIT,
    config.txtDoCommit,
    defaults.txtDoCommit
  )
};

(function(options) {
  try {
    const commitlintLoad = require('@commitlint/load');
    commitlintLoad().then(function(clConfig) {
      if (clConfig.rules) {
        const maxHeaderLengthRule = clConfig.rules['header-max-length'];
        if (
          typeof maxHeaderLengthRule === 'object' &&
          maxHeaderLengthRule.length >= 3 &&
          !process.env.CZ_MAX_HEADER_WIDTH &&
          !config.maxHeaderWidth
        ) {
          options.maxHeaderWidth = maxHeaderLengthRule[2];
        }
      }
    });
  } catch (err) {}
})(options);

module.exports = engine(options);
