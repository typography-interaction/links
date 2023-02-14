// The Description is returned as Markdown, of course.
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js'
document.head.appendChild(markdownIt)



const setBasics = (data) => {
	document.title = data.title

	const channelTitle = document.getElementById('channel-title')
	const channelDescription = document.getElementById('channel-description')
	const channelCount = document.getElementById('channel-count')

	if (channelTitle) channelTitle.innerHTML = data.title
	if (channelDescription) channelDescription.innerHTML = window.markdownit().render(data.metadata.description)
	if (channelCount) channelCount.innerHTML = data.length


	const renderUser = (user, id) => {
		let container = document.querySelector(`.${id}`)
		let template = document.getElementById(id)

		if (!container || !template) return

		template = template.content.cloneNode(true)

		let element = [
			'avatar',
			'fullName',
			'link',
		]

		// This could be a function, with the one below.
		element = Object.assign({},
			...element.map(string => ({
				[string]: template.querySelector(`.${string.replace(/[A-Z]/g, "-$&").toLowerCase()}`)
			}))
		)

		if (element.avatar) user.avatar_image.display ? element.avatar.src = user.avatar_image.display.replace('/medium_', '/large_').replace('&s=150', '&s=400') : element.avatar.remove()
		if (element.fullName) user.full_name ? element.fullName.innerHTML = user.full_name : element.fullName.remove()
		if (element.link) user.slug ? element.link.href = `https://www.are.na/${user.slug}` : element.link.remove()

    container.append(template)
	}

	renderUser(data.owner, 'channel-owner')

	data.collaborators.forEach((user) => renderUser(user, 'channel-collaborator'))
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



const showRelativeDate = (date) => {
	const elapsed = Math.round((new Date() - new Date(date)) / 1000)

	const minute = 60
	const hour =   minute * 60
	const day =    hour * 24
	const week =   day * 7
	const month =  day * 30
	const year =   month * 12

	if      (elapsed < 30)                     return `just now`
	else if (elapsed < minute)                 return `${elapsed} seconds ago`
	else if (elapsed < minute * 2)             return `a minute ago`
	else if (elapsed < hour)                   return `${Math.floor(elapsed / minute)} minutes ago`
	else if (Math.floor(elapsed / hour) == 1)  return `an hour ago`
	else if (elapsed < day)                    return `${Math.floor(elapsed / hour)} hours ago`
	else if (elapsed < day * 2)                return `a day ago`
	else if (elapsed < week)                   return `${Math.floor(elapsed / day)} days ago`
	else if (Math.floor(elapsed / week) == 1)  return `a week ago`
	else if (elapsed < month)                  return `${Math.floor(elapsed / week)} weeks ago`
	else if (Math.floor(elapsed / month) == 1) return `a month ago`
	else if (elapsed < year)                   return `${Math.floor(elapsed / month)} months ago`
	else if (Math.floor(elapsed / year) == 1)  return `a year ago`
	else                                       return `${Math.floor(elapsed / year)} years ago`
}



const renderBlock = (block, type) => {
	if (!type.template || !type.container) return

	let template = type.template.cloneNode(true)
	let element = [
		'title',
		'imageThumb',
		'imageSquare',
		'imageDisplay',
		'image',
		'embed',
		'audio',
		'video',
		'link',
		'linkTitle',
		'content',
		'description',
		'type',
		'timeUpdated',
		'timeCreated',
	]

	element = Object.assign({},
		...element.map(string => ({
			[string]: template.querySelector(`.${string.replace(/[A-Z]/g, "-$&").toLowerCase()}`)
		}))
	)

	const srcOrSrcset = (element, size) => element.tagName == 'IMG' ? element.src = block.image[size].url : element.srcset = block.image[size].url

	if (element.title) block.title ? element.title.innerHTML = block.title : element.title.remove()
	if (element.imageThumb) block.image ? srcOrSrcset(element.imageThumb, 'thumb') : element.imageThumb.remove()
	if (element.imageSquare) block.image ? srcOrSrcset(element.imageSquare, 'square') : element.imageSquare.remove()
	if (element.imageDisplay) block.image ? srcOrSrcset(element.imageDisplay, 'display') : element.imageDisplay.remove()
	if (element.image) block.image ? srcOrSrcset(element.image, 'large') : element.image.remove()
	if (element.embed) block.embed ? element.embed.innerHTML = block.embed.html : element.embed.remove()
	if (element.audio) block.attachment ? element.audio.src = block.attachment.url : element.audio.remove()
	if (element.video) block.attachment ? element.video.src = block.attachment.url : element.video.remove()
	if (element.link) {
		if (block.source) {
			element.link.href = block.source.url
			if (element.linkTitle) element.linkTitle.innerHTML = block.source.title
		}
		else if (block.attachment) {
			element.link.href = block.attachment.url
			if (element.linkTitle) element.linkTitle.innerHTML = block.title
		}
		else {
			element.link.remove()
			element.linkTitle.remove()
		}
	}
	if (element.content) block.content_html ? element.content.innerHTML = block.content_html : element.content.remove()
	if (element.description) block.description_html ? element.description.innerHTML = block.description_html : element.description.remove()
	if (element.type) element.type.innerHTML = type.name
	if (element.timeUpdated) element.timeUpdated.innerHTML = `Updated ${showRelativeDate(block.updated_at)}`
	if (element.timeCreated) element.timeCreated.innerHTML = `Created ${showRelativeDate(block.created_at)}`

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
