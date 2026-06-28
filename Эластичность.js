// Скрипт для назначения эластичности - плоскости со смещением -100
// Исправленная версия с правильным расчетом позиций

// Проверяем выделение
if (currentFileData.model.SelectionCount === 0) {
	UI.dialogs.MessageBox("Не выделен блок для назначения эластичности!");
	execution.FinishExecution();
}

var selectedObj = currentFileData.model.SelectedObj;

// Проверяем, что выделен структурный объект (блок)
if (!selectedObj.List) {
	UI.dialogs.MessageBox("Выделенный объект не является блоком!");
	execution.FinishExecution();
}

// Получаем локальный размер блока (в его системе координат)
var blockSize = elasticTransformation.GetObjectLocalSize(selectedObj);
console.log("Локальный размер блока: X=" + blockSize.x.toFixed(1) + ", Y=" + blockSize.y.toFixed(1) + ", Z=" + blockSize.z.toFixed(1));

// Получаем минимальную точку в локальной системе координат
var minPoint = elasticTransformation.GetObjectMinLocalPoint(selectedObj);
console.log("Минимальная точка в ЛСК: X=" + minPoint.x.toFixed(1) + ", Y=" + minPoint.y.toFixed(1) + ", Z=" + minPoint.z.toFixed(1));

// РАСЧЕТ ПОЗИЦИЙ ПЛОСКОСТЕЙ В ЛОКАЛЬНОЙ СИСТЕМЕ КООРДИНАТ:
// Плоскости располагаются внутри блока со смещением от краев

// Для оси X: плоскость параллельна YZ, позиция по X
var positionX = minPoint.x + blockSize.x - 100;

// Для оси Y: плоскость параллельна XZ, позиция по Y  
var positionY = minPoint.y + blockSize.y - 100;

// Для оси Z: плоскость параллельна XY, позиция по Z
var positionZ = minPoint.z + blockSize.z - 100;

// Проверяем, чтобы позиции были внутри блока
positionX = Math.max(minPoint.x + 10, Math.min(minPoint.x + blockSize.x - 10, positionX));
positionY = Math.max(minPoint.y + 10, Math.min(minPoint.y + blockSize.y - 10, positionY));
positionZ = Math.max(minPoint.z + 10, Math.min(minPoint.z + blockSize.z - 10, positionZ));

console.log("Позиции плоскостей в ЛСК:");
console.log("• Ось X: " + positionX.toFixed(1) + " (от " + minPoint.x.toFixed(1) + " до " + (minPoint.x + blockSize.x).toFixed(1) + ")");
console.log("• Ось Y: " + positionY.toFixed(1) + " (от " + minPoint.y.toFixed(1) + " до " + (minPoint.y + blockSize.y).toFixed(1) + ")");
console.log("• Ось Z: " + positionZ.toFixed(1) + " (от " + minPoint.z.toFixed(1) + " до " + (minPoint.z + blockSize.z).toFixed(1) + ")");

// УДАЛЯЕМ ПРЕДЫДУЩИЕ НАСТРОЙКИ ЭЛАСТИЧНОСТИ
try {
	var existingParams = elasticTransformation.LoadElasticParameters(selectedObj, false);
	if (existingParams) {
		existingParams.planes = [];
		elasticTransformation.SaveElasticParameters(selectedObj, existingParams);
	}
} catch (error) {
	// Игнорируем ошибки
}

// СОЗДАЕМ НОВЫЕ ПАРАМЕТРЫ ЭЛАСТИЧНОСТИ
var elasticParams = elasticTransformation.LoadElasticParameters(selectedObj, true);

if (!elasticParams) {
	UI.dialogs.MessageBox("Ошибка создания параметров эластичности!");
	execution.FinishExecution();
}

// Базовые настройки
elasticParams.sizeStep = geometry3d.VectorMake(1, 1, 1);
elasticParams.sizeMin = geometry3d.VectorMake(1, 1, 1);
elasticParams.sizeMax = geometry3d.VectorMake(0, 0, 0);

// Устанавливаем плоскости эластичности
elasticParams.planes = [
	{
		axis: elasticTransformation.ElasticAxis.x,
		position: positionX,
		weight: 1
	},
	{
		axis: elasticTransformation.ElasticAxis.y,
		position: positionY,
		weight: 1
	},
	{
		axis: elasticTransformation.ElasticAxis.z,
		position: positionZ,
		weight: 1
	}
];

// Сохраняем параметры
try {
	elasticTransformation.SaveElasticParameters(selectedObj, elasticParams);

	var message = "✅ Эластичность назначена!\n\n";
	message += "Плоскости установлены со смещением -100мм от краев:\n";
	message += "• Ось X: " + positionX.toFixed(1) + "мм\n";
	message += "• Ось Y: " + positionY.toFixed(1) + "мм\n";
	message += "• Ось Z: " + positionZ.toFixed(1) + "мм\n\n";
	message += "Размер блока: " + blockSize.x.toFixed(1) + "×" + blockSize.y.toFixed(1) + "×" + blockSize.z.toFixed(1) + "мм";

	UI.dialogs.MessageBox(message);
	console.log("Скрипт выполнен успешно");

} catch (error) {
	UI.dialogs.ErrorBox("Ошибка сохранения: " + error.message);
	console.error("Ошибка: " + error.message);
}
