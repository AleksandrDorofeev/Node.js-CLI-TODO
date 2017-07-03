let R = require("ramda")
let dbFile = "./todo.json"
let FS = require("fs-extra")

//parse init

let operation = process.argv[2]  //operation with task
let task = process.argv[3]  //task description
let index = process.argv[3] //index description

//commands

let commands = {}

/*let writeFileX = R.curry((dbFile, todo) => {
  let str = typeof todo == "string" ? todo : JSON.stringify(todo, null, 2)
  FS.outputFileSync(dbFile, str, "utf-8")
  return todo
})*/

commands.init = function () {
  let todos = []
  let todosStr = JSON.stringify(tasks, null, 2)
  FS.writeFileSync(dbFile, todosStr)
  console.log(todosStr)
}

let forEachI = R.addIndex(R.forEach)

commands.list = function () {
  let todos = require(dbFile)
  let recentTodos = R.filter(x => x.status, todos)
  forEachI(
    (todo, index) => console.log(todo.status == "done" ? '[x]' : '[ ]', index + 1 + ".", todo.text),
    recentTodos
  )
}

commands.add = function (text) {
  let todos = require(dbFile)
  let todos2 = R.append({text, status: "active"}, todos)
  let todos2Str = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, todos2Str)
  console.log(text)
  let recentTodos = R.filter(x => x.status, todos)
  forEachI(
    (todo, index) => console.log(todo.status == "done" ? '[x]' : '[ ]', index + 1 + ".", todo.text),
    recentTodos
  )
}

commands.delete = function (index) {
  index = Number(index) - 1
  let todos = require(dbFile)
  let todos2 = R.remove(index, 1, todos)
  let todos2Str = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, todos2Str)
  let recentTodos = R.filter(x => x.status, todos2)
  forEachI(
    (todo, index) => console.log(todo.status == "done" ? '[x]' : '[ ]', index + 1 + ".", todo.text),
    recentTodos
  )
}

commands.done = function (index) {
  index = Number(index) - 1
  let todos = require(dbFile)
  let todos2 = R.update(index, R.assoc("status", "done", todos[index]), todos)
  let todos2Str = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, todos2Str)
  let recentTodos = R.filter(x => x.status, todos2)
  forEachI(
    (todo, index) => console.log(todo.status == "done" ? '[x]' : '[ ]', index + 1 + ".", todo.text),
    recentTodos
  )
}

commands.archive = function () {
  let todos = require(dbFile)
  let doneTodos = R.filter(x => x.status == "done", todos)
  let activeTodos = R.filter(x => x.status == "active", todos)
  let todos2 = R.map(R.assoc("status", "archived"), doneTodos)
  let alltodos = R.unnest(R.append(todos2, activeTodos))
  let todos2Str = JSON.stringify(alltodos, null, 2)
  FS.writeFileSync(dbFile, todos2Str)
  forEachI(
    (todo, index) => console.log(todo.status == "active" ? activeTodos : "Доделывай!", index + 1 + ".", todo.text),
    todos2
  )
}

//command manager

switch (operation) {
  case "init":
    return commands.init()
    case "list":
    return commands.list()
  case "add":
    return commands.add(task)
  case "delete":
    return commands.delete(index)
  case "done":
    return commands.done(index)
  case "archive":
    return commands.archive()
  default:
    throw Exception(`unsupported operation ${operation}`)
}
