const app = require('./app')
const { mongoConn } = require('./DataBase/configuracion')
const dotenv = require('dotenv').config()

const conn = mongoConn()
app.set('port', process.env.PORT|| 4001)

app.listen(app.get('port'), () => {
    console.log(`inicio por puerto: ${app.get('port')}`)
})