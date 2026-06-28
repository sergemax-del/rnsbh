// Пример регистрации изменения объекта - создание фронтальной панели в одной 
// операции и изменение её контура в другой
let panel = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.front);
panel.Name = 'Фронтальная';
historyOperations.CommitCurrentChanges('Создание фронтальной панели');
// Регистрация изменения объекта производится до изменения объекта
historyOperations.RegisterObjectChanging(panel);
let contour = panel.Contour;
contour.Clear();
contour.AddCircle(0, 0, 100);
panel.Build();
historyOperations.CommitCurrentChanges('Изменение контура панели');