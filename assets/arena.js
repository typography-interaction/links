// The Description is returned as Markdown, of course.
let markdownIt = document.createElement('script');
markdownIt.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js';
document.head.appendChild(markdownIt);



const channel = 'typography-and-interaction-too'
const url = `https://api.are.na/v2/channels/${channel}?per=100`



const constructElements = (data) => {
	document.title = data.title
	document.getElementById('channel-title').innerHTML = data.title
	document.getElementById('channel-description').innerHTML = window.markdownit().render(data.metadata.description)

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
