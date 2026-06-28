// Пример отмены изменений в модели - отмена создания первой панели
// По завершении скрипта в модель будет добавлена только вертикальная панель
let panel = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.front);
panel.Name = 'Фронтальная';
historyOperations.RevertCurrentChanges();

panel = objects3d.NewPanel(1200, 200, objects3d.PanelOrientation.vertical);
panel.Name = 'Вертикальная';