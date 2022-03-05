// The Description is returned as Markdown, of course.
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js';
document.head.appendChild(markdownIt)



const constructElements = (data) => {
	document.title = data.title
	document.getElementById('channel-title').innerHTML = data.title
	document.getElementById('channel-description').innerHTML = window.markdownit().render(data.metadata.description)

	const audioEmbedContainer = document.querySelector('.audio-embed-blocks')
	const audioFileContainer  = document.querySelector('.audio-file-blocks')
	const imageContainer      = document.querySelector('.image-blocks')
	const embedContainer      = document.querySelector('.embed-blocks')
	const linkContainer       = document.querySelector('.link-blocks')
	const pdfContainer        = document.querySelector('.pdf-blocks')
	const textContainer       = document.querySelector('.text-blocks')
	const videoEmbedContainer = document.querySelector('.video-embed-blocks')
	const videoFileContainer  = document.querySelector('.video-file-blocks')

	const audioEmbedTemplate = document.getElementById('audio-embed-block')
	const audioFileTemplate  = document.getElementById('audio-file-block')
	const imageTemplate      = document.getElementById('image-block')
	const embedTemplate      = document.getElementById('embed-block')
	const linkTemplate       = document.getElementById('link-block')
	const pdfTemplate        = document.getElementById('pdf-block')
	const textTemplate       = document.getElementById('text-block')
	const videoEmbedTemplate = document.getElementById('video-embed-block')
	const videoFileTemplate  = document.getElementById('video-file-block')

	data.contents.slice().reverse().forEach((block) => {
		switch (block.class) {

			case 'Attachment':
				let attachment = block.attachment.content_type
				if (attachment.includes('audio')) {
					audioFileContainer.append(audioFileTemplate.content.cloneNode(true))
				}
				else if (attachment.includes('pdf')) {
					pdfContainer.append(pdfTemplate.content.cloneNode(true))
				}
				else if (attachment.includes('video')) {
					videoFileContainer.append(videoFileTemplate.content.cloneNode(true))
				}
				break

			case 'Image':
				imageContainer.append(imageTemplate.content.cloneNode(true))
				break

			case 'Link':
				linkContainer.append(linkTemplate.content.cloneNode(true))
				break

			case 'Media':
				let media = block.embed.type
					if (media.includes('rich')) {
						audioEmbedContainer.append(audioEmbedTemplate.content.cloneNode(true))
					}
					else if (media.includes('video')) {
						videoEmbedContainer.append(videoEmbedTemplate.content.cloneNode(true))
					}
				break

			case 'Text':
				textContainer.append(textTemplate.content.cloneNode(true))
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
