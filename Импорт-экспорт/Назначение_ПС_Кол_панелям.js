Undo.RecursiveChanging(Model)

const mass = {};

Model.forEachPanel(function (obj) {
  let pos = obj.ArtPos
  if (mass[pos]) mass[pos] += 1 else mass[pos] = 1
})

Model.forEachPanel(function (obj) {
  let pos = obj.ArtPos

  if (mass[pos])
    obj.UserProperty['Кол']= mass[pos]
})