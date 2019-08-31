const knex = require('knex')
const app = require('./app')
const {PORT, DB_URL1, DB_URL2} = require('./config')

const db1 = knex({
  client: 'pg',
  connection: DB_URL1})

const db2 = knex({
  client: 'pg',
  connection: DB_URL2
})

app.set('db1', db1)
app.set('db2', db2)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})