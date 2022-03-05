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

	blocks = Object.fromEntries(
		blocks.map(type => [type, {
			container: document.querySelector(`.${type.replace(/[A-Z]/g, "-$&").toLowerCase()}-blocks`),
			template: document.getElementById(`${type.replace(/[A-Z]/g, "-$&").toLowerCase()}-block`),
		}])
	)



	data.contents.slice().reverse().forEach((block) => {
		switch (block.class) {
			case 'Attachment':
				let attachment = block.attachment.content_type
				if (attachment.includes('audio')) {
					blocks.audioFile.container.append(blocks.audioFile.template.content.cloneNode(true))
				}
				else if (attachment.includes('pdf')) {
					blocks.pdf.container.append(blocks.pdf.template.content.cloneNode(true))
				}
				else if (attachment.includes('video')) {
					blocks.videoFile.container.append(blocks.videoFile.template.content.cloneNode(true))
				}
				break

			case 'Image':
				blocks.image.container.append(blocks.image.template.content.cloneNode(true))
				break

			case 'Link':
				blocks.link.container.append(blocks.link.template.content.cloneNode(true))
				break

			case 'Media':
				let media = block.embed.type
					if (media.includes('rich')) {
						blocks.audioEmbed.container.append(blocks.audioEmbed.template.content.cloneNode(true))
					}
					else if (media.includes('video')) {
						blocks.videoEmbed.container.append(blocks.videoEmbed.template.content.cloneNode(true))
					}
				break

			case 'Text':
				blocks.text.container.append(blocks.text.template.content.cloneNode(true))
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
