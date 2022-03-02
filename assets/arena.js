let channel = 'typography-and-interaction-too'
let url = `https://api.are.na/v2/channels/${channel}`

fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
