let R = require("ramda")
let P = require("path")
let FS = require("fs-extra")
let D = require("date-fns")

let forEachI = R.addIndex(R.forEach)

// Data --------------------------------------------------------------------------------------------
let recentDBFile = P.resolve("./todo.json")
let archiveDBFile = P.resolve("./archive.json")

// Helpers -----------------------------------------------------------------------------------------
let readFileX = function (file) {
  if (P.extname(file) == ".json") {
    return JSON.parse(FS.readFileSync(file, "utf-8"))
  } else {
    return FS.readFileSync(file, "utf-8")
  }
}

let writeFileX = function (file, todo) {
  let str = typeof todo == "string" ? todo : JSON.stringify(todo, null, 2)
  FS.outputFileSync(file, str, "utf-8")
}

let logLine = function (todo, i) {
  console.log(
    todo.done == false ? `[ ] ${i + 1}. ${todo.text}` :
    todo.done == true  ? `[x] ${i + 1}. ${todo.text}` :
                              `` // ignore archived todos
  )
}

let logLineArchive = function (todo, i) {
  console.log(
    todo.done == true ? `[#] ${i + 1}. ${todo.text}` : ``
  )
}

let logRecent = function (todos) {
  if (todos.length) {
    forEachI(logLine, todos)
  } else {
    console.log("No recent todos")
  }
}

let logArchive = function (todos) {
  if (todos.length) {
    forEachI(logLineArchive, todos)
  } else {
    console.log("No archive todos")
  }
}

// Commands ----------------------------------------------------------------------------------------
let commands = {}

commands.init = function () {
  writeFileX(recentDBFile, [])
  writeFileX(archiveDBFile, [])
  console.log("Ready to work!")
}

commands.list = function () {
  let todos = readFileX(recentDBFile)
  logRecent(todos)
}

commands.listArchive = function () {
  let todos = readFileX(archiveDBFile)
  logArchive(todos)
}

commands.add = function (text) {
  let recentTodos = readFileX(recentDBFile)
  let todo = {text, done: false, createdAt: new Date().toISOString()}
  let recentTodos2 = R.append(todo, recentTodos)
  writeFileX(recentDBFile, recentTodos2)
  logRecent(recentTodos2)
}

commands.delete = function (index) {
  let recentTodos = readFileX(recentDBFile)
  let recentTodos2 = R.remove(index, 1, recentTodos)
  writeFileX(recentDBFile, recentTodos2)
  logRecent(recentTodos2)
}

commands.done = function (index) {
  let recentTodos = readFileX(recentDBFile)
  let recentTodos2 = R.update(index, R.assoc("done", true, recentTodos[index]), recentTodos)
  writeFileX(recentDBFile, recentTodos2)
  logRecent(recentTodos2)
}

commands.undone = function (index) {
  let recentTodos = readFileX(recentDBFile)
  let recentTodos2 = R.update(index, R.assoc("done", false, recentTodos[index]), recentTodos)
  writeFileX(recentDBFile, recentTodos2)
  logRecent(recentTodos2)
}

commands.archive = function () {
  let recentTodos = readFileX(recentDBFile)
  let archiveTodos = readFileX(archiveDBFile)
  let recentTodos2 = R.reject(R.prop("done"), recentTodos)
  let archiveTodos2 = R.concat(R.filter(R.prop("done"), recentTodos), archiveTodos)
  writeFileX(recentDBFile, recentTodos2)
  logRecent(recentTodos2)
  writeFileX(archiveDBFile, todos)
}

// Command Manager ---------------------------------------------------------------------------------
let operation = process.argv[2]

switch (operation) {
  case "init":
    return commands.init()
  case "add":
    let text = process.argv[3]
    return commands.add(text)
  case "list":
    return commands.list()
  case "listArchive":
    return commands.listArchive()
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
