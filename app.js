const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

admin.initializeApp({
 credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
 })})

db = admin.firestore()

const todosDB = db.collection('todos')

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.use(cors({credentials: true, origin: true}))


app.get('/', async (req, res) => {
  console.log('got GET request')
  let allTodos = await getAllTodos()
  res.send(allTodos)
})

app.post('/', async (req, res) => {
  console.log('got POST request', req.body)
  const id = await addTodo(req.body)
  await updateTodo(id, { id })
  res.send({ id })
})

app.delete('/:todoId', async (req, res) => {
  console.log('got DELETE request', req.params.todoId)
  await deleteTodo(req.params.todoId)
  res.send('OK')
})

app.put('/:todoId', async (req, res) => {
  console.log('got PUT request', req.params.todoId, req.body)
  await updateTodo(req.params.todoId, req.body)
  res.send('OK')
})

let port = parseInt(process.env.PORT) || 3000;
app.listen(port)
console.log('Server is listening on port ' + port)

async function getAllTodos() {
  const todosSnapshot = await todosDB.get()
  return todosSnapshot.docs.map(todo => todo.data())
}

async function addTodo(todo) {
  const res = await todosDB.add(todo)
  return res.id
}

async function deleteTodo(todoId) {
  await todosDB.doc(todoId).delete()
}

async function updateTodo(todoId, todo) {
  await todosDB.doc(todoId).update(todo)
}
