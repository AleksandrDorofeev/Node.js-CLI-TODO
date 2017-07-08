let R = require("ramda")
let reсentDBFile = "./todo.json"
let archiveDBFile = "./archive.json"
let FS = require("fs-extra")
let D = require("date-fns")

//commands

let forEachI = R.addIndex(R.forEach)

let commands = {}

let writeFileX = R.curry((dbFile, todo) => {
  let str = typeof todo == "string" ? todo : JSON.stringify(todo, null, 2)
  FS.outputFileSync(dbFile, str, "utf-8")
})

let logLine = (todo, i) => {
  console.log(
    todo.done == false ? `[ ] ${i + 1}. ${todo.text}` :
    todo.done == true  ? `[x] ${i + 1}. ${todo.text}` :
                              `` // ignore archived todos
  )
}
let logRecent = forEachI(logLine)

let logLineArchive = (todo, i) => {
  console.log(
    todo.done == true ? `[#] ${i + 1}. ${todo.text}` : ``
  )
}
let logArchive = forEachI(logLineArchive)

let loadReсent = () => require(reсentDBFile)
let saveReсent = (todos) => {writeFileX(reсentDBFile, todos); logRecent(todos) }
let loadArchive = () => require(archiveDBFile)
let saveArchive = (todos) => {writeFileX(archiveDBFile, todos); logArchive(todos) }

commands.init = function () {
  writeFileX(reсentDBFile, [])
  writeFileX(archiveDBFile, [])
  console.log("Ready to work!")
}

commands.list = function () {
  let recentTodos = loadReсent()
  logRecent(recentTodos)
}

commands.add = function (text) {
  let recentTodos = loadReсent()
  let recentDate = D.format(new Date(), "DD.MM HH:mm")
  let recentTodos2 = R.append({text, "done": false, "createdAt": recentDate}, recentTodos)
  saveReсent(recentTodos2)
}

commands.delete = function (index) {
  let recentTodos = loadReсent()
  let recentTodos2 = R.remove(index, 1, recentTodos)
  saveReсent(recentTodos2)
}

commands.done = function (index) {
  let recentTodos = loadReсent()
  let recentTodos2 = R.update(index, R.assoc("done", true, recentTodos[index]), recentTodos)
  saveReсent(recentTodos2)
}

commands.undone = function (index) {
  let recentTodos = loadReсent()
  let recentTodos2 = R.update(index, R.assoc("done", false, recentTodos[index]), recentTodos)
  saveReсent(recentTodos2)
}

commands.archive = function () {
  let recentTodos = loadReсent()
  let archiveTodos = loadArchive()
  let recentTodos2 = R.reject(R.prop("done"), recentTodos)
  let archiveTodos2 = R.concat(R.filter(R.prop("done"), recentTodos), archiveTodos)
  saveReсent(recentTodos2)
  saveArchive(archiveTodos2)
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
  case "undone":
    let undoneIndex = Number(process.argv[3]) - 1
    return commands.undone(undoneIndex)
  case "archive":
    return commands.archive()
  default:
    throw Error(`unsupported operation ${operation}`)
}
