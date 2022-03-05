// The Description is returned as Markdown, of course.
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js';
document.head.appendChild(markdownIt)



const constructElements = (data) => {
	document.title = data.title
	document.getElementById('channel-title').innerHTML = data.title
	document.getElementById('channel-description').innerHTML = window.markdownit().render(data.metadata.description)

	const container = document.getElementById('blocks')

	const audio = document.getElementById('audio-block')
	const image = document.getElementById('image-block')
	const link  = document.getElementById('link-block')
	const pdf   = document.getElementById('pdf-block')
	const text  = document.getElementById('text-block')
	const video = document.getElementById('video-block')

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



window.addEventListener('DOMContentLoaded', () => {
	const channel = document.getElementById('channel-url').href.split('/').filter(Boolean).pop()

	fetch(`https://api.are.na/v2/channels/${channel}?per=100`, {cache: 'no-store'})
		.then(response => response.json())
		.then(data => {
			constructElements(data)
		})
});
