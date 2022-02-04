const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_CLUSTER_HOST,
  DB_PORT,
  DB_NAME,
  DB_NAME_TEST,
  NODE_ENV
} = process.env

const clusterUri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER_HOST}/${(NODE_ENV === 'test') ? DB_NAME_TEST : DB_NAME}?retryWrites=true&w=majority`
// Controlo el acceso a la BD de Test y Otros
const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${(NODE_ENV === 'test') ? DB_NAME_TEST : DB_NAME}?authSource=admin`
console.info('*** DB ENV=', NODE_ENV, ' URL=', url)

module.exports = {
  url,
  clusterUri
}
