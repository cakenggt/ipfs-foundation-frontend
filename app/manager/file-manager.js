import lf from 'lovefield';
import connect from '../dao/lovefield-dao';

export function listFileNames() {
	return connect
	.then(function (db) {
		var file = db.getSchema().table('File');
		return db.select(file.name).from(file).exec();
	});
}

export function fillDBs(json) {
	return connect
	.then(function (db) {
		var file = db.getSchema().table('File');
		var comment = db.getSchema().table('Comment');
		console.log('about to insert into lf', json);
		return db.insertOrReplace().into(file).values(
			json.files.map(elem => {
				elem.createdAt = new Date(elem.createdAt);
				elem.updatedAt = new Date(elem.updatedAt);
				return file.createRow(elem);
			})
		).exec()
		.then(function () {
			return db.insertOrReplace().into(comment).values(
				json.comments.map(elem => {
					elem.createdAt = new Date(elem.createdAt);
					elem.updatedAt = new Date(elem.updatedAt);
					return comment.createRow(elem);
				})
			).exec();
		});
	});
}

export function searchFileNameAndDescription(string) {
	string = string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	var regex = new RegExp('.*' + string + '.*', 'i');
	return connect
	.then(function (db) {
		var file = db.getSchema().table('File');
		return db.select().from(file).where(lf.op.or(
			file.name.match(regex),
			file.description.match(regex)
		))
		.orderBy(file.createdAt, lf.Order.DESC)
		.exec();
	});
}

export function searchFileNameAndDescriptionAndCategory(string, category) {
	string = string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	var regex = new RegExp('.*' + string + '.*', 'i');
	return connect
	.then(function (db) {
		var file = db.getSchema().table('File');
		return db.select().from(file).where(lf.op.and(
			lf.op.or(
				file.name.match(regex),
				file.description.match(regex)
			),
			file.category.eq(category)
		))
		.orderBy(file.createdAt, lf.Order.DESC)
		.exec();
	});
}

export function searchNameOrHash(name, hash) {
	return connect
	.then(function (db) {
		var file = db.getSchema().table('File');
		return db.select(file.name).from(file).where(lf.op.or(
			file.name.eq(name),
			file.hash.eq(hash)
		))
		.exec();
	});
}

export function loadFile(id) {
	return connect
	.then(function (db) {
		var file = db.getSchema().table('File');
		var comment = db.getSchema().table('Comment');
		return db.select().from(file)
			.leftOuterJoin(comment, comment.fileId.eq(file.id))
			.where(file.id.eq(id)).exec();
	})
	.then(function (results) {
		var file = results[0].File;
		file.comments = [];
		for (var i = 0; i < results.length; i++) {
			var comment = results[i].Comment;
			if (comment.id) {
				file.comments.push(comment);
			}
		}
		return file;
	});
}
