const channel = 'typography-and-interaction-too'
const url = `https://api.are.na/v2/channels/${channel}`



const constructElements = (data) => {
	document.title = data.title;
}



fetch(url)
	.then(response => response.json())
	.then(data => {
		constructElements(data)
	})
