// The Description is returned as Markdown, of course.
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js';
document.head.appendChild(markdownIt)



const channel = 'typography-and-interaction-too'
const url = `https://api.are.na/v2/channels/${channel}?per=100`



const constructElements = (data) => {
	document.title = data.title
	document.getElementById('title').innerHTML = data.title
	document.getElementById('description').innerHTML = window.markdownit().render(data.metadata.description)

	const container = document.getElementById('blocks')

	const audio = document.getElementById('audio')
	const image = document.getElementById('image')
	const link  = document.getElementById('link')
	const pdf   = document.getElementById('pdf')
	const text  = document.getElementById('text')
	const video = document.getElementById('video')

	data.contents.slice().reverse().forEach((block) => {
		switch (block.class) {
			case 'Attachment':
				let type = block.attachment.content_type
				if (type.includes('audio')) {
					container.append(audio.content.cloneNode(true))
				}
				else if (type.includes('pdf')) {
					container.append(pdf.content.cloneNode(true))
				}
				else if (type.includes('video')) {
					container.append(video.content.cloneNode(true))
				}
				break
			case 'Image':
				container.append(image.content.cloneNode(true))
				break
			case 'Link':
				container.append(link.content.cloneNode(true))
				break
			case 'Text':
				container.append(text.content.cloneNode(true))
				break
		}
	})
}



fetch(url)
	.then(response => response.json())
	.then(data => {
		constructElements(data)
	})
