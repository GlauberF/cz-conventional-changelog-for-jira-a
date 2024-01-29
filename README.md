# cz-conventional-changelog-for-jira

## Features

- Works seamlessly with semantic-release 🚀
- Works seamlessly with Jira smart commits
- Automatically detects the Jira issue from the branch name

## Quickstart

### Installation

```bash
npm install commitizen path_github
```

and then add the following to package.json:

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": ""
    }
  }
}
```

### Usage

gif aqui

## Configuration

Like commitizen, you can specify the configuration of cz-conventional-changelog-for-jira through the package.json's `config.commitizen` key, or with environment variables.

| Environment variable            | package.json    | Default | Description                                                                                                                                                             |
|---------------------------------|-----------------|----| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CZ_JIRA_MODE                    | jiraMode        | true | If this is set to true, CZ will ask for a Jira issue and put it in the commit head. If set to false CZ will ask for the issue in the end, and can be used for GitHub.   |
| CZ_MAX_HEADER_WIDTH             | maxHeaderWidth  | 72 | This limits how long a commit message head can be.                                                                                                                      |
| CZ_MIN_HEADER_WIDTH             | minHeaderWidth  | 2  | This limits how short a commit message can be.                                                                                                                          |
| CZ_MAX_LINE_WIDTH               | maxLineWidth    | 100 | Commit message bodies are automatically wrapped. This decides how long the lines will be.                                                                               |
| CZ_SKIP_SCOPE                   | skipScope       | true | If scope should be used in commit messages.                                                                                                                             |
| CZ_SKIP_TYPE                    | skipType        | false | If type should be used in commit messages.                                                                                                                              |
| CZ_SKIP_DESCRIPTION             | skipDescription | false | If description should be used in commit messages.                                                                                                                       |
| CZ_SKIP_BREAKING                | skipBreaking    | false | If breaking changes should be used in commit messages.                                                                                                                  |
|                                 | scopes          | undefined | A list (JS Array) of scopes that will be available for selection. Note that adding this will change the scope field from Inquirer 'input' to 'list'.                    |
| CZ_TYPE                         | defaultType     | undefined | The default type.                                                                                                                                                       |
| CZ_SCOPE                        | defaultScope    | undefined | The default scope.                                                                                                                                                      |
| CZ_CUSTOM_SCOPE                 | customScope     | false | Whether user can provide custom scope in addition to predefined ones                                                                                                    |
| CZ_SUBJECT                      | defaultSubject  | undefined | A default subject.                                                                                                                                                      |
| CZ_BODY                         | defaultBody     | undefined | A default body.                                                                                                                                                         |
| CZ_ISSUES                       | defaultIssues   | undefined | A default issue.                                                                                                                                                        |
| CZ_JIRA_OPTIONAL                | jiraOptional    | false | If this is set to true, you can leave the JIRA field blank.                                                                                                             |
| CZ_JIRA_PREFIX                  | jiraPrefix      | "STOR" | If this is set it will be displayed as the default JIRA ticket prefix                                                                                           |
| CZ_JIRA_LOCATION                | jiraLocation    | "pre-description" | Changes position of JIRA ID. Options: `pre-type`, `pre-description`, `post-description`, `post-body`                                                                    |
| CZ_JIRA_PREPEND                 | jiraPrepend     | "" | Prepends JIRA ID with an optional decorator. e.g.: `[DAZ-1234`                                                                                                          |
| CZ_JIRA_APPEND                  | jiraAppend      | "" | Appends JIRA ID with an optional decorator. e.g.: `DAZ-1234]`                                                                                                           |
| CZ_EXCLAMATION_MARK             | exclamationMark | false | On breaking changes, adds an exclamation mark (!) after the scope, e.g.: `type(scope)!: break stuff`. When activated, reduces the effective allowed header length by 1. |
| CZ_TXT_TYPE                     | txtType         | "Enter the JIRA task prefix" | The text to guide the user |
| CZ_TXT_JIRA_ISSUE               | txtJiraIssue    | "Select the type of change that you're committing" | The text to guide the user |
| CZ_TXT_SCOPE                    | txtScope    | "What is the scope of this change (e.g. component or file name)" | The text to guide the user |
| CZ_TXT_SCOPE_LIST_CONFIRMATION  | txtScopeListConfirmation    | "select from the list" | The text to guide the user |
| CZ_TXT_SCOPE_INPUT_CONFIRMATION | txtScopeInputConfirmation    | "press enter to skip" | The text to guide the user |
| CZ_TXT_CUSTOM_SCOPE             | txtCustomScope    | "Type custom scope (press enter to skip)" | The text to guide the user |
| CZ_TXT_SUBJECT                  | txtSubject    | "Write a short, imperative tense description of the change" | The text to guide the user |
| CZ_TXT_SUBJECT_MIN_CHARACTERS   | txtSubjectMinCharacters    | "The subject must have at least {MIN_VALUE} characters" | The text to guide the user |
| CZ_TXT_BODY                     | txtBody    | "Provide a longer description of the change: (press enter to skip)" | The text to guide the user |
| CZ_TXT_CONFIRM_BREAKING         | txtConfirmBreaking    | "Are there any breaking changes?" | The text to guide the user |
| CZ_TXT_DESCRIBE_BREAKING        | txtDescribeBreaking    | "Describe the breaking changes" | The text to guide the user |
| CZ_TXT_CONFIRM_ISSUE_AFFECTED   | txtConfirmIssueAffected    | "Does this change affect any open issues?" | The text to guide the user |
| CZ_TXT_ISSUES_BODY              | txtIssuesBody    | "If issues are closed, the commit requires a body. Please enter a longer description of the commit itself" | The text to guide the user |
| CZ_TXT_ISSUES_REF               | txtIssuesRef    | "Add issue references (e.g. "fix #123", "re #123".)" | The text to guide the user |
| CZ_TXT_DO_COMMIT                | txtDoCommit    | "Are you sure that you want to commit?" | The text to guide the user |


### Jira Location Options

pre-type:

```text
JIRA-1234 type(scope): commit subject
```

pre-description:

```text
type(scope): JIRA-1234 commit subject
```

post-description:

```text
type(scope): commit subject JIRA-1234
```

post-body:

```text
type(scope): commit subject

JIRA-1234
```

```text
type(scope): commit subject

this is a commit body

JIRA-1234
```

## Dynamic Configuration

Alternatively, if you want to create your own profile, you can use the _configurable_ approach.
Here is an example:
**./index.js**

```javascript
const custom = require('@digitalroute/cz-conventional-changelog-for-jira/configurable');
// You can do this optionally if you want to extend the commit types
const defaultTypes = require('@digitalroute/cz-conventional-changelog-for-jira/types');

module.exports = custom({
  types: {
    ...defaultTypes,
    perf: {
      description: 'Improvements that will make your code perform better',
      title: 'Performance'
    }
  },
  skipScope: false,
  scopes: ['myScope1', 'myScope2'],
  customScope: true
});
```

**./package.json**

```json
{
  "config": {
    "commitizen": {
      "path": "./index.js"
    }
  }
}
```

### Commitlint

If using the [commitlint](https://github.com/conventional-changelog/commitlint) js library, the "maxHeaderWidth" configuration property will default to the configuration of the "header-max-length" rule instead of the hard coded value of 72. This can be ovewritten by setting the 'maxHeaderWidth' configuration in package.json or the CZ_MAX_HEADER_WIDTH environment variable.
