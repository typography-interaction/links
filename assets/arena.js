// The Description is returned as Markdown, of course.
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js';
document.head.appendChild(markdownIt)



const setupBlocks = () => {
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
		// This is probably not the right way to do this.
		window[type] = {
			container: document.querySelector(`.${typeClass}-blocks`),
			template: document.getElementById(`${typeClass}-block`).content,
		}
	})
}



const setBasics = (data) => {
	document.title = data.title
	document.getElementById('channel-title').innerHTML = data.title
	document.getElementById('channel-description').innerHTML = window.markdownit().render(data.metadata.description)
}



const parseBlocks = (data) => {
	data.contents.slice().reverse().forEach((block) => {
		switch (block.class) {
			case 'Attachment':
				let attachment = block.attachment.content_type
				if (attachment.includes('audio')) {
					renderBlock(audioFile)
				}
				else if (attachment.includes('pdf')) {
					renderBlock(pdf)
				}
				else if (attachment.includes('video')) {
					renderBlock(videoFile)
				}
				break

			case 'Image':
				renderBlock(image)
				break

			case 'Link':
				renderBlock(link)
				break

			case 'Media':
				let media = block.embed.type
					if (media.includes('rich')) {
						renderBlock(audioEmbed)
					}
					else if (media.includes('video')) {
						renderBlock(videoEmbed)
					}
				break

			case 'Text':
				renderBlock(text)
				break
		}
	})
}



const renderBlock = (type) => {
	type.container.append(type.template.cloneNode(true))
}



window.addEventListener('DOMContentLoaded', () => {
	const channel = document.getElementById('channel-url').href.split('/').filter(Boolean).pop()

	setupBlocks()

	fetch(`https://api.are.na/v2/channels/${channel}?per=100`, {cache: 'no-store'})
		.then(response => response.json())
		.then(data => {
			setBasics(data)
			parseBlocks(data)
		})
});
