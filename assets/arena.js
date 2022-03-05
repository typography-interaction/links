// The Description is returned as Markdown, of course.
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js';
document.head.appendChild(markdownIt)



const constructElements = (data) => {
	document.title = data.title
	document.getElementById('channel-title').innerHTML = data.title
	document.getElementById('channel-description').innerHTML = window.markdownit().render(data.metadata.description)

	let blocks = [
		'audioEmbed',
		'audioFile',
		'image',
		'link',
		'pdf',
		'text',
		'videoEmbed',
		'videoFile',
	]

	blocks.forEach((type) => {
		let typeClass = type.replace(/[A-Z]/g, "-$&").toLowerCase()
		window[type] = {
			container: document.querySelector(`.${typeClass}-blocks`),
			template: document.getElementById(`${typeClass}-block`).content,
		}
	})



	data.contents.slice().reverse().forEach((block) => {
		switch (block.class) {
			case 'Attachment':
				let attachment = block.attachment.content_type
				if (attachment.includes('audio')) {
					audioFile.container.append(audioFile.template.cloneNode(true))
				}
				else if (attachment.includes('pdf')) {
					pdf.container.append(pdf.template.cloneNode(true))
				}
				else if (attachment.includes('video')) {
					videoFile.container.append(videoFile.template.cloneNode(true))
				}
				break

			case 'Image':
				image.container.append(image.template.cloneNode(true))
				break

			case 'Link':
				link.container.append(link.template.cloneNode(true))
				break

			case 'Media':
				let media = block.embed.type
					if (media.includes('rich')) {
						audioEmbed.container.append(audioEmbed.template.cloneNode(true))
					}
					else if (media.includes('video')) {
						videoEmbed.container.append(videoEmbed.template.cloneNode(true))
					}
				break

			case 'Text':
				text.container.append(text.template.cloneNode(true))
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
