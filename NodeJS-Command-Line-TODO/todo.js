let R = require("ramda")
let dbFile = "./todo.json"
let FS = require("fs-extra")

//parse init

let operation = process.argv[2]  //operation with task
let task = process.argv[3]  //task description

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
  let recentTodos = R.filter(x => !x.archived, todos)
  forEachI(
    (todo, index) => console.log(index + 1, todo.done ? '[x]' : '[ ]', todo.text),
    recentTodos
  )
}

commands.add = function (text) {
  let todos = require(dbFile)
  let todos2 = R.append({text, done: false, archived: false}, todos)
  let todos2Str = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, todos2Str)
  console.log(text)
  let recentTodos = R.filter(x => !x.archived, todos)
  forEachI(
    (todo, index) => console.log(index + 1, todo.done ? '[x]' : '[ ]', todo.text),
    recentTodos
  )
}

commands.delete = function (index) {
  index = Number(index)
  let todos = require(dbFile)
  let todos2 = R.remove(index, 1, todos)
  let todos2Str = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, todos2Str)
  let recentTodos = R.filter(x => !x.archived, todos2)
  forEachI(
    (todo, index) => console.log(index + 1, todo.done ? '[x]' : '[ ]', todo.text),
    recentTodos
  )
}

commands.done = function (index) {
  index = Number(index)
  let todos = require(dbFile)
  let todos2 = R.update(index, R.assoc("done", true, todos[index]), todos)
  let todos2Str = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, todos2Str)
  let recentTodos = R.filter(x => !x.archived, todos2)
  forEachI(
    (todo, index) => console.log(index + 1, todo.done ? '[x]' : '[ ]', todo.text),
    recentTodos
  )
}

commands.archive = function () {
  let todos = require(dbFile)
  let todos2 = R.map(R.assoc("archived", true), todos)
  /*let todos2 = R.map(function() {
    return R.assoc("archived", true, todos[0])
  }, todos)*/
  let todos2Str = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, todos2Str)
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
    return commands.delete(task)
  case "done":
    return commands.done(task)
  case "archive":
    return commands.archive()
  default:
    throw Exception(`unsupported operation ${operation}`)
}
