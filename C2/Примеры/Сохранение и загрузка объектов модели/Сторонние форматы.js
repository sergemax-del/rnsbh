// Пример экспорта панели в файл полигонального формата и импорта 
// экспортированной панели обратно в модель.
const fileName = 'Панель.obj';

let panel = objects3d.NewPanel(1000, 1000);
panel.Name = 'Исходная панель';
panel.Build();
modelIOOperations.ExportModelMeshFormat(panel, fileName);

let importedObjects = modelIOOperations.ImportModelMeshFormat(fileName);
importedObjects.PositionX += 1500;
importedObjects.Objects[0].Name = 'Импортированная панель'
