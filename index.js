const core = require('@actions/core');
const github = require('@actions/github');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

try {
  const repoId = core.getInput('repo_id');
  const zhToken = core.getInput('zh_token');
  const zhWorkspaceId = core.getInput('zh_workspace_id');
  const zhInprogressId = core.getInput('zh_in_progress_id');
  const zhDoneId = core.getInput('zh_done_id');
  const action_name = core.getInput('action_name');
  const not_merged_master = core.getInput('not_merged_master');

  function moveValidIssue(issue_number, pipelineName) {
    var http = new XMLHttpRequest();
    var url = `https://api.zenhub.com/p1/repositories/${repoId}/issues/${issue_number}`;
    http.open('GET', url);
    http.setRequestHeader('X-Authentication-Token', `${zhToken}`);
    console.log('---------- started', issue_number, pipelineName );

    http.onreadystatechange = function() { //Call a function when the state changes.
      console.log('^^^^^^ response: ', JSON.stringify(http));
      if(http.readyState == 4 && http.status == 200) {
        const response = JSON.parse(http.responseText);
        let pipelineId;
        // status = "Fetch Data Success"
        console.log('&&&&&&&&&&&&& issue_number', issue_number);
        console.log('$$$$$$$$$$$$ pipelineName', pipelineName);

        // move card
        if (pipelineName === "in_progress" && response.pipeline.name !== "In Progress") {
          pipelineId = zhInprogressId;
        } else if (pipelineName === "done" && response.pipeline.name !== "Done") {
          pipelineId = zhDoneId;
        }
        console.log('############ pipelineId', pipelineId);
        if (pipelineId) {
          const httpPost = new XMLHttpRequest();
          const urlPost = `https://api.zenhub.com/p2/workspaces/${zhWorkspaceId}/repositories/${repoId}/issues/${issue}/moves`;
          const content = {
            'pipeline_id': pipelineId,
            'position': 'top'
          }
          const params = JSON.stringify(content);
          httpPost.open('POST', urlPost);

          // Send the proper header information along with the request
          httpPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          httpPost.setRequestHeader('X-Authentication-Token', `${zhToken}`);

          httpPost.onreadystatechange = function() { //Call a function when the state changes.
            if (httpPost.readyState == 4 && httpPost.status == 200) {
              console.log("Move Card Success");
            }
          }
          httpPost.send(params);
        }
      }
    }
    http.send(null);
  }

  if (action_name === 'create_branch') {
    const issueNumber = parseInt(github.context.payload.ref.split('/')[0], 10);
    const isValidBranch = typeof issueNumber === 'number';
    let status = '';

    if (isValidBranch) {
      moveValidIssue(issueNumber, 'in_progress');
    }
    core.setOutput("output", status);
  } else if (action_name === 'merge_to_master') {
    console.log('------------ git data master: ', JSON.stringify(github));
  } else if (action_name === 'test') {
    console.log('------------ Test result JS: ', JSON.stringify(not_merged_master));
    const allBranches = JSON.stringify(not_merged_master);
    const allBranchesArray = allBranches.split(' ');
    const validIssueNumbers = [];
    allBranchesArray.forEach(branchName => {
      const issueNumber = parseInt(branchName.split('/')[1], 10);
      if (issueNumber && typeof issueNumber === 'number') {
        validIssueNumbers.push(issueNumber);
      };
    });
    console.log('*****', validIssueNumbers);
    validIssueNumbers.forEach(issueNumber => {
      moveValidIssue(issueNumber, 'done');
    })
  }

} catch (error) {
  console.log('-- Error --', error.message);
  core.setFailed(error.message);
}
