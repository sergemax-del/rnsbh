// Пример сохранения параметров расстановки позиций в файл в формате JSON
// Необходимая версия API >=2
let options = arrangePositions.NewArranger().parameters.options;
options.SaveToJSON('arrangeOptions.json');