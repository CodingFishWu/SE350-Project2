'use strict'

angular.module('myUtils', [])
.factory('toRDF', function(paper) {
	let rdf = ''
	rdf += '<?xml version="1.0"?>\n'
	rdf += '<rdf:RDF\n'
	rdf += 'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n'
	rdf += 'xmlns:paper="' + 
		'http://202.120.40.73:28080/Entity/Ua46d59e19268fe/PaperServ/Paper/' +
		'#">'
	rdf += '<rdf:Description'
	rdf += 'rdf:about="' +
		'http://202.120.40.73:28080/Entity/Ua46d59e19268fe/PaperServ/Paper/' +
		paper.id +
		'">'
	rdf += '<paper:title>' + paper.title + '</paper:title>'
	rdf += '<paper:author>' + paper.author + '</paper:author>'
	rdf += '<paper:correspondingAuthor>' + paper.correspondingAuthor + '</paper:correspondingAuthor>'
	rdf += '<paper:correspondingAddress>' + paper.correspondingAddress + '</paper:correspondingAddress>'
	rdf += '<paper:affiliation>' + paper.affiliation + '</paper:affiliation>'
	rdf += '<paper:abstract>' + paper.abstract + '</paper:abstract>'
	rdf += '<paper:serialNumber>' + paper.abstract + '</paper:serialNumber>'
	let keys = ''
	for (let key in paper.keys) {
		keys += key.word + '; '
	}
	rdf += '<paper:keys>' + keys + '</paper:keys>'
	let tags = ''
	for (let tag in paper.tags) {
		tags += tag + '; '
	}
	rdf += '<paper:tags>' + tags + '</paper:tags>'
	rdf += '<paper:file rdf:resource="' + paper.fileAddr +'"/>'

	rdf += '</rdf:Description>'
	rdf += '</rdf:RDF>'

	return rdf
})