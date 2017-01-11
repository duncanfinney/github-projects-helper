
const GITHUB_HEADERS = {
  'Authorization': 'Basic ' + btoa(GITHUB_USER + ':' + GITHUB_PASS),
  'Content-Type': 'application/json',
  'Accept': 'application/vnd.github.inertia-preview+json'
};

const commands = [

  {
    name: 'Assign To Me',
    action: cardContext => fetch(cardContext.issueApiUrl + '/assignees', {
      method: 'POST',
      headers: GITHUB_HEADERS,
      body: JSON.stringify({
        assignees: [GITHUB_USER]
      })
    })
  },

  {
    name: 'Clear Assignees',
    action: cardContext => fetch(cardContext.issueApiUrl + '/assignees', {
      method: 'DELETE',
      headers: GITHUB_HEADERS,
      body: JSON.stringify({
        assignees: [GITHUB_USER]
      })
    })
  },

  {
    name: 'Finish Card',
    action: actionFinishCard
  },

  'LINE_BREAK',

  {
    name: 'Make Bug',
    action: cardContext => fetch(cardContext.issueApiUrl, {
      method: 'PATCH',
      headers: GITHUB_HEADERS,
      body: JSON.stringify({
        labels: ['bug']
      })
    })
  },

  {
    name: 'Make Enhancement',
    action: cardContext => fetch(cardContext.issueApiUrl, {
      method: 'PATCH',
      headers: GITHUB_HEADERS,
      body: JSON.stringify({
        labels: ['enhancement']
      })
    })
  }

];

function getCardContext(e) {
  const cardParent = e.target.closest('[data-card-id]');
  const { url: cardUrl, cardId } = cardParent.dataset;
  const allLinks = [].slice.call(cardParent.querySelectorAll('a'))
  const issueApiUrl = allLinks.filter(a => !a.className)[0].href.replace('github.com', 'api.github.com/repos');
  const cardApiUrl = `https://api.github.com/projects/columns/cards/${cardId}`;
  return {
    cardUrl,
    cardApiUrl,
    cardId,
    issueApiUrl
  }
}

function doCardAction(e) {
  const { clickAction } = e.target.dataset;
  const cardContext = getCardContext(e);
  const command = commands.find(c => c.name === clickAction);
  if (!command) {
    return;
  }

  removeButtons()
  const res = command.action(cardContext);
  Promise.resolve(res)
    .then(
      () => setTimeout(() => addButtons(), 1000),
      () => setTimeout(() => addButtons(), 1000)
    );
}

function addButtons() {
  //for each dropdown menu
  document.querySelectorAll('.dropdown-menu').forEach(m => {

    //add each command
    commands.forEach(cmd => {

      if (cmd === 'LINE_BREAK') {
        const node = document.createElement('hr');
        node.className = 'p-0 mt-2 mb-2';
        node.dataset.removeMe = 'true';
        m.appendChild(node);
        return;
      }

      const node = document.createElement("button");
      node.className = 'dropdown-item btn-link';
      node.dataset.removeMe = 'true';
      node.dataset.clickAction = cmd.name;
      node.onclick = doCardAction;
      const textnode = document.createTextNode(cmd.name);
      node.appendChild(textnode);
      m.appendChild(node);
    });

  });
}

function removeButtons() {
  document.querySelectorAll('[data-remove-me]').forEach(el => el.parentElement.removeChild(el))
}

setInterval(() => {
  removeButtons()
  addButtons()
}, 2000);
