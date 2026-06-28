///Позиция_Имя_Размер

const separator = '/'; // Разделитель между наименованием и позицией

function CheckObject(obj) {
    switch (processingType.ItemIndex) {
        case 0:
            return true;
    }
}

// Функция обхода всех объектов в блоке и вызова переданной функции для их обработки
function forEachInList(list, func) {
    if (!func)
        return;
    for (var i = 0; i < list.Count; i++) {
        var obj = list.Objects[i];
        if (CheckObject(obj)) {
            func(obj);
            if (obj.List) {
                forEachInList(obj.AsList(), func);
            }
        }
    }
}

//функция вывода размеров деталей, с учетом заданной точности
function GetSize(size){
    switch (sizeAccuracy.ItemIndex)  {
        case 0:
            return Math.round(size);
        case 1:
            return Math.trunc(Math.round(size * 10)) / 10;
        case 2:
            return Math.trunc(Math.round(size * 100)) / 100;
        case 3:
            return Math.trunc(Math.round(size * 1000)) / 1000;
    }
}

function AdditionalInfo(obj){
    var result = '';
    if (addSize.Value){
        result += separator + GetSize(obj.GSize.x) + 'x' + GetSize(obj.GSize.y) + 'x' + GetSize(obj.GSize.z);
    }
    return result;
}

// имя в поз
function NameToPos(obj) {
if (obj.AsPanel) {
    obj.ArtPos = obj.ArtPos + separator + obj.Name + AdditionalInfo(obj);
	}
}

// вызов продолжения скрипта после того, как весь код отработает.
Action.Continue();
// Комбобокс для выбора типа выполнения скрипта
var combo = Action.Properties.NewCombo('Тип', 'Наименование в поз.');
var addSize = Action.Properties.NewBool('Добавлять размеры');
var sizeAccuracy = Action.Properties.NewCombo('Точность размеров', '0\n1\n2\n3');
var processingType = Action.Properties.NewCombo('Тип обработки', 'Все объекты')
// Кнопка запуска основного кода скрипта
Action.Properties.NewButton('Применить').OnClick = function () {
    // переменная для хранения функции, которая будет обрабатывать объекты
    var func;
    // Запись в историю, что скрипт собирается менять модель и все объекты, находящиеся в ней
    Undo.RecursiveChanging(Model);
    // В зависимости от выбранного типа назначаем нужную функцию для обработки объектов
    switch (combo.ItemIndex) {
        case 0:
            func = NameToPos;
            break;
        }
    // запускаем обход всех объектов в модели с нужной функцией обработки
    forEachInList(Model, func);
    // Вызов завершения скрипта
    Action.Finish();
}