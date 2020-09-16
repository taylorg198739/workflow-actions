const core = require('@actions/core');
const github = require('@actions/github');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

try {
  // const nameToGreet = core.getInput('who-to-greet');
  // const gitref = core.getInput('git_ref');
  const repoId = core.getInput('repo_id');
  const zhToken = core.getInput('zh_token');
  const zhWorkspaceId = core.getInput('zh_workspace_id');
  const zhInprogressId = core.getInput('zh_in_progress_id');
  const issueNumber = parseInt(github.context.payload.ref.split('/')[0], 10);
  console.log('payload: ',  github.context.payload.ref);
  console.log('Issue Number: ', issueNumber);
  const isValidBranch = typeof issueNumber === 'number';

  if (isValidBranch) {

    var http = new XMLHttpRequest();
    var url = `https://api.zenhub.com/p1/repositories/${repoId}/issues/${issueNumber}`;
    http.open('GET', url);
    console.log('$$$$$$$$$$$$ url: ', url);
    http.setRequestHeader('X-Authentication-Token', `${zhToken}`);
    
    http.onreadystatechange = function() {//Call a function when the state changes.
      console.log('^^^^^^ function started', http.status, http.readyState);
      if(httpPost.readyState == 4 && http.status == 200) {
        
        console.log('&&&&&&&&&&&& Response Text: ', JSON.stringify(http.responseText) );
        var response = http.responseText;

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
          
          //Send the proper header information along with the request
          httpPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          httpPost.setRequestHeader('X-Authentication-Token', `${zhToken}`);
          
          httpPost.onreadystatechange = function() {//Call a function when the state changes.
            console.log('^^^^^^ function POST started', httpPost.status);
              if(httpPost.readyState == 4 && httpPost.status == 200) {
                
                // alert(http.responseText);
                console.log('&&&&&&&&&&&& Response Text: ', httpPost.responseText);
              }
          }
          httpPost.send(params);
        }
      }
    }
    http.send(null);
  }

  core.setOutput("output", isValidBranch);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload.ref, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  console.log('-------', error.message);
  core.setFailed(error.message);
}
