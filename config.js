exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/blog' ||
                      'mongodb://root:root@ds133221.mlab.com:33221/mongoblogapi';
exports.PORT = process.env.PORT || 8080;
