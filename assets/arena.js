// The Description is returned as Markdown, of course.
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js';
document.head.appendChild(markdownIt)



const setBasics = (data) => {
	document.title = data.title
	document.getElementById('channel-title').innerHTML = data.title
	document.getElementById('channel-description').innerHTML = window.markdownit().render(data.metadata.description)

	// Add author/collaborators with image/links.
	// Error proof these.
}



const parseBlocks = (data) => {
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
		let typeName = type.split(/[A-Z]/g)[0];
		(typeName == 'pdf') ? typeName = typeName.toUpperCase() : typeName = typeName[0].toUpperCase() + typeName.slice(1)

		let typeContainer = document.querySelector(`.${typeClass}-blocks`)
		let typeTemplate = document.getElementById(`${typeClass}-block`)

		blocks[type] = {
			name: typeName,
			container: typeContainer,
			template: typeTemplate ? typeTemplate.content : null,
		}
	})

	data.contents.slice().reverse().forEach((block) => {
		switch (block.class) {
			case 'Attachment':
				let attachment = block.attachment.content_type
				if (attachment.includes('audio')) {
					renderBlock(block, blocks.audioFile)
				}
				else if (attachment.includes('pdf')) {
					renderBlock(block, blocks.pdf)
				}
				else if (attachment.includes('video')) {
					renderBlock(block, blocks.videoFile)
				}
				break

			case 'Image':
				renderBlock(block, blocks.image)
				break

			case 'Link':
				renderBlock(block, blocks.link)
				break

			case 'Media':
				let media = block.embed.type
				if (media.includes('rich')) {
					renderBlock(block, blocks.audioEmbed)
				}
				else if (media.includes('video')) {
					renderBlock(block, blocks.videoEmbed)
				}
				break

			case 'Text':
				renderBlock(block, blocks.text)
				break
		}
	})
}



const renderBlock = (block, type) => {
	if (!type.template || !type.container) return

	let template = type.template.cloneNode(true)

	let titleElement = template.querySelector('.title')
	let imageElement = template.querySelector('.image')
	let embedElement = template.querySelector('.embed')
	let audioElement = template.querySelector('.audio')
	let videoElement = template.querySelector('.video')
	let linkElement = template.querySelector('.link')
	let linkTitleElement = template.querySelector('.link-title')
	let contentElement = template.querySelector('.content')
	let descriptionElement = template.querySelector('.description')
	let typeElement = template.querySelector('.type')

	if (titleElement) block.title ? titleElement.innerHTML = block.title : titleElement.remove()
	if (imageElement) block.image ? imageElement.src = block.image.large.url : imageElement.remove()
	if (embedElement) block.embed ? embedElement.innerHTML = block.embed.html : embedElement.remove()
	if (audioElement) block.attachment ? audioElement.src = block.attachment.url : audioElement.remove()
	if (videoElement) block.attachment ? videoElement.src = block.attachment.url : videoElement.remove()
	if (linkElement) {
		if (block.source) {
			linkElement.href = block.source.url
			if (linkTitleElement) linkTitleElement.innerHTML = block.source.title
		}
		else if (block.attachment) {
			linkElement.href = block.attachment.url
			if (linkTitleElement) linkTitleElement.innerHTML = block.title
		}
		else {
			linkElement.remove()
			linkTitleElement.remove()
		}
	}
	if (contentElement) block.content_html ? contentElement.innerHTML = block.content_html : contentElement.remove()
	if (descriptionElement) block.description_html ? descriptionElement.innerHTML = block.description_html : descriptionElement.remove()
	if (typeElement) typeElement.innerHTML = type.name

	type.container.append(template)
}



window.addEventListener('DOMContentLoaded', () => {
	const channel = document.getElementById('channel-url').href.split('/').filter(Boolean).pop()

	fetch(`https://api.are.na/v2/channels/${channel}?per=100`, {cache: 'no-store'})
		.then(response => response.json())
		.then(data => {
			setBasics(data)
			parseBlocks(data)
		})
});
