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
  txtJiraIssue: 'Digite a tarefa no JIRA',
  txtType: "Selecione o tipo de alteração que você está fazendo commit",
  txtScope: 'Qual é o escopo desta mudança (por exemplo, componente ou nome do arquivo)',
  txtScopeListConfirmation: 'Selecione da lista',
  txtScopeInputConfirmation: 'pressione Enter para pular',
  txtCustomScope: 'Digite o escopo personalizado (pressione Enter para pular)',
  txtSubject: 'Descreva O QUE foi alterado',
  txtSubjectMinCharacters:
    'O QUE foi alterado deve ter pelo menos {MIN_VALUE} caracteres',
  txtBody: 'Descreva o PORQUÊ foi alterado: (pressione Enter para pular)',
  txtConfirmBreaking: 'Há alguma alteração significativa(breaking changes)?',
  txtDescribeBreaking: 'Descreva as mudanças significativas.',
  txtConfirmIssueAffected: 'Essa mudança afeta alguma tarefa em aberto?',
  txtIssuesBody:
    'Se as tarefas estiverem fechadas, o commit requer um corpo. Por favor, forneça uma descrição mais detalhada do próprio commit.',
  txtIssuesRef: 'Adicionar referências a tarefa (ex. "fix #123", "re #123".)',
  txtDoCommit: 'Você tem certeza de que deseja fazer o commit?'
};
