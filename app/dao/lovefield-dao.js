import lf from 'lovefield';

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

export default schemaBuilder.connect();
