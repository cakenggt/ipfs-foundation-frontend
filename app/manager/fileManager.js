import connect from '../dao/lovefieldDao';

export function listFileNames(){
	return connect
	.then(function(db) {
		var file = db.getSchema().table('File');
		return db.select(file.name).from(file).exec();
	});
}

export function fillDBs(json) {
	return connect
	.then(function(db) {
		var file = db.getSchema().table('File');
		var comment = db.getSchema().table('Comment');
		console.log('about to insert into lf', json);
		return db.insertOrReplace().into(file).values(
			json.files.map(elem => file.createRow(elem))
		).exec()
		.then(function() {
			return db.insertOrReplace().into(comment).values(
				json.comments.map(elem => comment.createRow(elem))
			).exec();
		});
	});
}

export function searchFileNameAndDescription(string) {
	string = string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	var regex = new RegExp(".*" + string + ".*")
	return connect
	.then(function(db) {
		var file = db.getSchema().table('File');
		return db.select(file.name).from(file).where(lf.op.or(
			file.name.match(regex),
			file.description.match(regex)
		)).exec();
	});
}

export function searchNameOrHash(name, hash) {
	return connect
	.then(function(db) {
		var file = db.getSchema().table('File');
		return db.select(file.name).from(file).where(lf.op.or(
			file.name.eq(name),
			file.hash.eq(hash)
		)).exec();
	});
}
