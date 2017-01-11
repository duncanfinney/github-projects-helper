function actionFinishCard(cardContext) {
  return Promise.all([
    moveToDoneColumn(cardContext),
    closeIssue(cardContext)
  ]);
}

const moveToDoneColumn = cardContext =>
  fetch(cardContext.cardApiUrl + '/moves', {
    method: 'POST',
    headers: GITHUB_HEADERS,
    body: JSON.stringify({
      position: 'top',
      column_id: GITHUB_DONE_COLUMN
    })
  });

const closeIssue = cardContext =>
  fetch(cardContext.issueApiUrl, {
    method: 'PATCH',
    headers: GITHUB_HEADERS,
    body: JSON.stringify({
      state: 'closed'
    })
  });
