// Скрипт для назначения лицевой стороны выделенным панелям
// Лицевой становится сторона, видимая во вьюпорте

// Получаем камеру и выделенные объекты
var camera = currentFileData.model.DS.Camera;
var selectedObjects = [];

// Собираем все выделенные панели
for (var i = 0; i < currentFileData.model.SelectionCount; i++) {
	var obj = currentFileData.model.Selections[i];
	if (objectTypeChecker.ObjectIsPanel(obj)) {
		selectedObjects.push(obj);
	}
}

if (selectedObjects.length === 0) {
	UI.dialogs.MessageBox("Нет выделенных панелей!");
	execution.FinishExecution();
}

// Для каждой панели определяем видимую сторону
for (var i = 0; i < selectedObjects.length; i++) {
	var panel = selectedObjects[i];

	// Получаем нормаль к лицевой стороне панели в ГСК
	var faceNormal = panel.NObjectToGlobal(geometry3d.VectorMake(0, 0, 1));

	// Направление взгляда камеры
	var cameraDirection = camera.ViewDirection;

	// Скалярное произведение для определения видимости
	var dotProduct = geometry3d.VectorDot(faceNormal, cameraDirection);

	// ИСПРАВЛЕНИЕ: меняем логику - если нормаль направлена ОТ камеры, это ЗАДНЯЯ сторона
	// Значит нужно сделать лицевой ПРОТИВОПОЛОЖНУЮ сторону
	if (dotProduct < 0) {
		// Текущая лицевая сторона не видна - оставляем как есть (front)
		panel.FrontFace = panelOperations.faceType.front;
	} else {
		// Текущая лицевая сторона видна - меняем на противоположную (back)
		panel.FrontFace = panelOperations.faceType.back;
	}

	// Перестраиваем панель
	panel.Build();
}

UI.dialogs.MessageBox("Лицевые стороны назначены для " + selectedObjects.length + " панелей");