const channel = 'typography-and-interaction-too'
const url = `https://api.are.na/v2/channels/${channel}`



const constructElements = (data) => {
	document.title = data.title
	document.getElementById('title').innerHTML = data.title
	document.getElementById('description').innerHTML = data.metadata.description

	data.contents.slice().reverse().forEach((item) => {
		switch (item.class) {
			case 'Attachment':
				let type = item.attachment.content_type
				if (type.includes('audio')) {
				}
				else if (type.includes('pdf')) {
				}
				else if (type.includes('video')) {
				}
				break
			case 'Image':
				break
			case 'Link':
				break
			case 'Text':
				break
		}
	})
}



fetch(url)
	.then(response => response.json())
	.then(data => {
		constructElements(data)
	})
