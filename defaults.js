const conventionalCommitTypes = require('./types');

module.exports = {
  types: conventionalCommitTypes,
  jiraMode: true,
  skipScope: true,
  skipType: true,
  skipDescription: false,
  skipBreaking: false,
  customScope: false,
  maxHeaderWidth: 72,
  minHeaderWidth: 2,
  maxLineWidth: 100,
  jiraPrefix: 'STOR',
  jiraOptional: false,
  jiraLocation: 'pre-description',
  jiraPrepend: '',
  jiraAppend: '',
  exclamationMark: false,
  txtJiraIssue: 'Enter the JIRA task',
  txtType: "Select the type of change that you're committing",
  txtScope: 'What is the scope of this change (e.g. component or file name)',
  txtScopeListConfirmation: 'select from the list',
  txtScopeInputConfirmation: 'press enter to skip',
  txtCustomScope: 'Type custom scope (press enter to skip)',
  txtSubject: 'Describe where the change',
  txtSubjectMinCharacters:
    'The subject must have at least {MIN_VALUE} characters',
  txtBody: 'Detail the reason for the change: (press enter to skip)',
  txtConfirmBreaking: 'Are there any breaking changes?',
  txtDescribeBreaking: 'Describe the breaking changes',
  txtConfirmIssueAffected: 'Does this change affect any open issues?',
  txtIssuesBody:
    'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
  txtIssuesRef: 'Add issue references (e.g. "fix #123", "re #123".)',
  txtDoCommit: 'Are you sure that you want to commit?'
};
