let R = require("ramda")
let dbFile = "./todo.json"
let FS = require("fs-extra")

//commands

let commands = {}

let writeFileX = R.curry((dbFile, todo2) => {
  let str = typeof todo2 == "string" ? todo2 : JSON.stringify(todo2, null, 2)
  FS.outputFileSync(dbFile, str, "utf-8")
})

let ranking = (todo) => {
return Number(todo.status == "archived") // archive == 1, * == 0
}

let load = () => require(dbFile)
let save = (todos) => {writeFileX(dbFile, todos); logAll(todos) }

let forEachI = R.addIndex(R.forEach)

let logLine = (todo, i) => {
  console.log(
    todo.status == "active" ? `[ ] ${i + 1}. ${todo.text}` :
    todo.status == "done"   ? `[x] ${i + 1}. ${todo.text}` :
                              `` // ignore archived todos
  )
}
let logAll = forEachI(logLine)

commands.init = function () {
  let todos = []
  writeFileX(dbFile, todos2)
  console.log(todosStr)
}

commands.list = function () {
  let todos = load()
  logAll(todos)
  }

commands.add = function (text) {
  let todos = load()
  let addTodos = R.append({text, status: "active"}, todos)
  save(addTodos)
}

commands.list = function () {
  let todos = load()
  logAll(todos)
  }


commands.delete = function (index) {
  let todos = load()
  let deleteTodos = R.remove(index, 1, todos)
  save(deleteTodos)
}

commands.done = function (index) {
  let todos = load()
  let doneTodos = R.update(index, R.assoc("status", "done", todos[index]), todos)
  save(doneTodos)
}

commands.archive = function () {
  let todos = load()
  let doneTodos = R.map(todo => todo.status == "done" ? R.assoc("status", "archived", todo) : todo, todos)
  let sortTodos = R.sortBy(ranking, doneTodos)
  save(sortTodos)
}

//command manager

let operation = process.argv[2]

switch (operation) {
  case "init":
    return commands.init()
  case "add":
    let text = process.argv[3]
    return commands.add(text)
  case "list":
    return commands.list()
  case "delete":
    let deleteIndex = Number(process.argv[3]) - 1
    return commands.delete(deleteIndex)
  case "done":
    let doneIndex = Number(process.argv[3]) - 1
    return commands.done(doneIndex)
  case "archive":
    return commands.archive()
  default:
    throw Error(`unsupported operation ${operation}`)
}
