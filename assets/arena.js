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
				let attachment = block.attachment.content_type
				if (attachment.includes('audio')) {
					container.append(audio.content.cloneNode(true))
				}
				else if (attachment.includes('pdf')) {
					container.append(pdf.content.cloneNode(true))
				}
				else if (attachment.includes('video')) {
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
				let element = text.content.cloneNode(true)

				let title = element.querySelector('.title')
				let content = element.querySelector('.content')
				let description = element.querySelector('.description')
				let type = element.querySelector('.type')

				if (title) block.title ? title.innerHTML = block.title : title.remove()
				if (content) block.content_html ? content.innerHTML = block.content_html : content.remove()
				if (description) block.description_html ? description.innerHTML = block.description_html : description.remove()
				if (type) block.class ? type.innerHTML = block.class : type.remove()

				container.append(element)
				break
		}
	})
}



fetch(url, {cache: 'no-store'})
	.then(response => response.json())
	.then(data => {
		constructElements(data)
	})
