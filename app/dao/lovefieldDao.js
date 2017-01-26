import lf from 'lovefield';

var globalDB;

var schemaBuilder = lf.schema.create('federation', 1);

schemaBuilder.createTable('File')
.addColumn('id', lf.Type.INTEGER)
.addColumn('name', lf.Type.STRING)
.addColumn('description', lf.Type.STRING)
.addColumn('hash', lf.Type.STRING)
.addColumn('category', lf.Type.STRING)
.addPrimaryKey(['id'])
.addUnique('uniqueName', ['name'])
.addUnique('uniqueHash', ['hash'])
.addIndex('idxFileText', ['name', 'description'], false, lf.Order.DESC)
.addIndex('idxCategory', ['category'], false, lf.Order.DESC);

schemaBuilder.createTable('Comment')
.addColumn('id', lf.Type.INTEGER)
.addColumn('text', lf.Type.STRING)
.addColumn('fileId', lf.Type.INTEGER)
.addPrimaryKey(['id'])
.addForeignKey('fk_FileId', {
	local: 'fileId',
	ref: 'File.id'
});

export default function {
	return new Promise(function (resolve, reject) {
		// Let us open our database
	  var DBOpenRequest = window.indexedDB.open("federation", 4);

	  // This event handles the event whereby a new version of the database needs to be created
	  // Either one has not been created before, or a new version number has been submitted via the
	  // window.indexedDB.open line above
	  //it is only implemented in recent browsers
	  DBOpenRequest.onupgradeneeded = function(event) {
	    var db = event.target.result;

	    db.deleteObjectStore('File');
			db.deleteObjectStore('Comment');
			db.close();
			resolve(schemaBuilder.connect());
	  };
	});
};
