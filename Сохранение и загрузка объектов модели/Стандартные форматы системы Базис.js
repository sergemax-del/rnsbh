// Пример добавления панели и сохранения изменённой модели в файл, а также 
// загрузки модели
objects3d.NewPanel(100, 100);
historyOperations.CommitCurrentChanges('тест 1');
modelIOOperations.SaveModelToFile('тест 1.b3d');

objects3d.NewPanel(200, 200);
historyOperations.CommitCurrentChanges('тест 2');
modelIOOperations.SaveModelToFile('тест 2.b3d');

modelIOOperations.LoadModelFromFile('тест 1.b3d');