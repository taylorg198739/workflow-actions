const core = require('@actions/core');
const github = require('@actions/github');

try {
  const nameToGreet = core.getInput('who-to-greet');
  const issueNumber = core.getInput('issue_number');
  const gitref = core.getInput('git_ref');
  const repoId = core.getInput('repo_id');
  const zhToken = core.getInput('zh_token');
  const zhWorkspaceId = core.getInput('zh_workspace_id');
  const zhInprogressId = core.getInput('zh_in_progress_id');

  console.log(`all info data:  ${nameToGreet}!, ${gitref}, ${issueNumber}, ${repoId}, ${zhToken}, ${zhWorkspaceId}, ${zhInprogressId}`);
  const test = `${nameToGreet}, ${issueNumber}, ${repoId}, ${zhToken}, ${zhWorkspaceId}, ${zhInprogressId}`

  core.setOutput("output", test);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
