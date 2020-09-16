# Zenhub api integration JavaScript action

This action integrates Zenhub api. To learn how this action was built, see "[Creating a JavaScript action](https://help.github.com/en/articles/creating-a-javascript-action)" in the GitHub Help documentation.

## Inputs

### `repo_id`, `zh_token`, `zh_workspace_id`, `zh_in_progress_id`

## Outputs

### `Status Result`

## Example usage

```yaml
uses: taylorg198739/workflow-actions@@main
with:
  repo_id: 'Github Repo Id'
  zh_token: 'Zenhub Token'
  zh_workspace_id: 'Zenhub Workspace Id'
  zh_in_progress_id: 'Zenhub In Progress column Id'
```
