// Пример загрузки параметров расстановки из файла в формате JSON и
// выполнения расстановки позиций с загруженными параметрами.
// Необходимая версия API >=2
let arranger = arrangePositions.NewArranger();
arranger.parameters.options.LoadFromJSON('arrangeOptions.json');
arranger.parameters.arrangeMode = arrangePositions.ArrangeMode.allObjects;
arranger.parameters.designationPrefix = currentFileData.article.ShortSign;
arranger.parameters.list = currentFileData.model;
arranger.parameters.selectedOnly = false;
arranger.ArrangeObjects();
historyOperations.CommitCurrentChanges(
    'Выполнение расстановки позиций в скрипте по загруженным параметрам'
);