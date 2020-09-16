const core = require('@actions/core');
const github = require('@actions/github');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

try {
  const repoId = core.getInput('repo_id');
  const zhToken = core.getInput('zh_token');
  const zhWorkspaceId = core.getInput('zh_workspace_id');
  const zhInprogressId = core.getInput('zh_in_progress_id');
  const issueNumber = parseInt(github.context.payload.ref.split('/')[0], 10);
  const isValidBranch = typeof issueNumber === 'number';
  let status = '';

  if (isValidBranch) {

    var http = new XMLHttpRequest();
    var url = `https://api.zenhub.com/p1/repositories/${repoId}/issues/${issueNumber}`;
    http.open('GET', url);
    http.setRequestHeader('X-Authentication-Token', `${zhToken}`);
    
    http.onreadystatechange = function() { //Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
        var response = JSON.parse(http.responseText);
        status = "Fetch Data Success"

        // move card
        if (response.pipeline.name !== "In Progress") {
          var httpPost = new XMLHttpRequest();
          var urlPost = `https://api.zenhub.com/p2/workspaces/${zhWorkspaceId}/repositories/${repoId}/issues/${issueNumber}/moves`;
          var content = {
            'pipeline_id': zhInprogressId,
            'position': 'top'
          }
          var params = JSON.stringify(content);
          httpPost.open('POST', urlPost);
          
          // Send the proper header information along with the request
          httpPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          httpPost.setRequestHeader('X-Authentication-Token', `${zhToken}`);
          
          httpPost.onreadystatechange = function() { //Call a function when the state changes.
              if(httpPost.readyState == 4 && httpPost.status == 200) {
                status = "Move Card Success"
              }
          }
          httpPost.send(params);
        }
      }
    }
    http.send(null);
  }

  core.setOutput("output", status);
} catch (error) {
  console.log('-- Error --', error.message);
  core.setFailed(error.message);
}
