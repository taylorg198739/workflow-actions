const core = require('@actions/core');
const github = require('@actions/github');

try {
  // const nameToGreet = core.getInput('who-to-greet');
  // const gitref = core.getInput('git_ref');
  const repoId = core.getInput('repo_id');
  const zhToken = core.getInput('zh_token');
  const zhWorkspaceId = core.getInput('zh_workspace_id');
  const zhInprogressId = core.getInput('zh_in_progress_id');
  const issueNumber = parseInt(github.context.payload.ref.split('/')[2], 10);
  console.log('payload: ',  github.context.payload);
  console.log('Issue Number: ', issueNumber);
  const isValidBranch = typeof issueNumber === 'number';

  if (isValidBranch) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var http = new XMLHttpRequest();
    var url = `https://api.zenhub.com/p2/workspaces/${zhWorkspaceId}/repositories/${repoId}/issues/${ISSUE_NUMBER}/moves`;
    var params = `pipeline_id=${zhInprogressId}&position=top`;
    http.open('POST', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader(`X-Authentication-Token', ${zhToken}`);
    http.setRequestHeader('Content-type', 'application/json');
    
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
          // alert(http.responseText);
        }
    }
    http.send(params);
  }

  core.setOutput("output", isValidBranch);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload.ref, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  console.log('-------', error.message);
  core.setFailed(error.message);
}
