// Пример создания панелей с записью создания каждой панели в отдельную 
// операцию истории
let panel = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.front);
panel.Name = 'Фронтальная';
historyOperations.CommitCurrentChanges('Создание фронтальной панели');

panel = objects3d.NewPanel(200, 200, objects3d.PanelOrientation.vertical);
panel.Name = 'Вертикальная';
historyOperations.CommitCurrentChanges('Создание вертикальной панели');