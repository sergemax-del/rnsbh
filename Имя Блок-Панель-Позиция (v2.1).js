/**
 * Имя файла настроек
 */
const filename = 'Block_Settings.xml'

// 0 - только имя
// 1 - только позицию
// 2 - позицию, а если ее нет, то имя
var addID = 0;
// 0 - менять имя
// 1 - менять позицию
var changeType = 0;
// 0 - только непосредственное вложение
// 1 - только корень
// 2 - вся иерархия
var recursionType = 0;
// Разделитель
var delimiter = '-'
var selected = 0
// 0 - выделить все
// 1 - выделять по отдельности

/**
 * Выделенные на начало скрипта объекты
 * @type {Object3[]}
 */

// Создание массива для выделенных объектов
var selection = [];
 

var props = Action.Properties;
// Создать вложенную группу свойств
var settings = props.NewGroup('Настройки');
// Добавить новое свойство


var selectedType = settings.NewCombo ('Какие блоки обрабатываем:');
selectedType.AddItem('Выделить всё');
selectedType.AddItem('Выделять по отдельности');
selectedType.ItemIndex = selected;
selectedType.OnValueChange = function(){
    selectedType = panelChange.ItemIndex;
}


var panelChange = settings.NewCombo('У панели менять');
// Добавить значение свойства
panelChange.AddItem('Имя');
panelChange.AddItem('Позицию');
//  Обработчик изменения свойства
panelChange.OnValueChange = function () {
// Присваивает переменной индекс исполизуемого значения
    changeType = panelChange.ItemIndex;
}



// Выбора разделителя между добавленным именем и именем детали
var delim = settings.NewString('Разделитель');
delim.Value = delimiter;
// Обработчик изменения свойства (не рекомендуется делать сложные вычисления в теле этой функции, т.к. будет тормозить работу)
delim.OnValueChange = function () {
// Присваивает переменной символ разделителя
    delimiter = delim.Value;
}

// Создать вложенную группу свойств 
var blockID = settings.NewCombo('Для формирования информации использовать');
// Добавить значение свойства
blockID.AddItem('Только имя объекта');
blockID.AddItem('Только позицию объекта');
blockID.AddItem('Позицию при наличии, иначе имя');
// Выбирает индекс свойства 
blockID.ItemIndex = addID;
//Прописывает выбранное значение в поле свойства
blockID.Value = blockID.ComboItems[addID];
// Обработчик изменения свойства
blockID.OnValueChange = function () {
// Присваивает переменной индекс исполизуемого значения
    addID = blockID.ItemIndex;
}

// Создать вложенную группу свойств
var recur = settings.NewCombo('Добавлять имя/позицию');
// Добавить значение свойства
recur.AddItem('Блока, в который вложен объект');
recur.AddItem('Корневого блока');
recur.AddItem('Всех блоков в иерархии');
// Выбирает индекс свойства 
recur.ItemIndex = recursionType;
// Прописывает выбранное значение в поле свойства
recur.Value = recur.ComboItems[recursionType];
// Обработчик изменения свойства
recur.OnValueChange = function () {
// Присваивает переменной индекс исполизуемого значения
    recursionType = recur.ItemIndex;
}

// Загрузить значения свойств, сохраненные методом Save из файла формата xml.
settings.Load(filename);
// присваивает знак разделителю
delimiter = delim.Value;
// добавляет в переменные сохранённы значения индексов
addID = blockID.ItemIndex;
recursionType = recur.ItemIndex;
changeType = panelChange.ItemIndex;
// создаёт кнопку в панели свойств
var finishBtn = props.NewButton('Применить');
// ОБработчик нажатия кнопки
finishBtn.OnClick = function () {
// если выбрано "выделить всё" то выделяет все объекты
    if(selectedType.ItemIndex === 0){
        SelectAll();
    }
// запускает обработку блоков
Make();
// Отменяет выделение всех объектов
UnSelectAll();
// Завершает работу скрипта  
    Action.Finish();
}

var delBtn = props.NewButton('Удалить префикс');
delBtn.OnClick = function (){
    delPrefix();
} 

// удалить префикс вместе с разделителем
function delPrefix(){
Model.forEachPanel(function(Obj){
    var Panel = Obj.AsPanel;
    indx = Panel.Name.lastIndexOf(delimiter);
    Panel.Name = Panel.Name.slice(++indx);
    // Нижняя строка НЕ РАБОТАЕТ почему-то
    Panel.ArtPos = Panel.ArtPos.slice(++indx);

    }
)
}

var exitBtn = props.NewButton('Завершить');
exitBtn.OnClick = function(){
    Action.Finish();
}

/**
 * @param {Object3} obj
 */

// функция возвращает от объекта согласно введённому id:
function GetID(obj) {
    switch (addID) {
        case 0:
// возвращает имя объекта          
            return obj.Name;
        case 1:
// возвращает позицию объекта            
            return obj.ArtPos;
        case 2:
// возвращает позицию объекта или его имя(если нет позиции)
            return obj.ArtPos || obj.Name;
    }
}

/**
 * возвращает true если объект является корнем иерархии (модель, слой).
 * @param {Object3} obj
 */

function IsRoot(obj){
    var result = false;
// если объет существует
    if (typeof TLayer3D != 'undefined'){
// проверяется его соответствие на принадлежность к слою
        result = obj instanceof TLayer3D;
    }
// если объект не является слоем
    if (!result){
// проверяется его соответствие на принадлежность к (модели?)
        result = !obj || obj instanceof TModel3D;
    }
    return result
}

function MakeName(owner, prevName) {
// если родительский объект модель или слой 
    if (IsRoot(owner))
// возвращает имя родительского объекта
        return prevName;
// возможно(?) присвает переменной имя ПРАродителя объекта
    var ownerOwner = owner.Owner;
// возвращает от объекта согласно введённому id и запрошенному имени или позиции:
    switch (recursionType) {
        case 0:
// имя/позиция + разделитель + предыдущее имя объекта
            return GetID(owner) + delimiter + prevName;
        case 1:
// если ПРАродитель слой или модель - возвращает имя/позицию + делитель + предыдущее имя объекта
            if (IsRoot(ownerOwner)){
                return GetID(owner) + delimiter + prevName;
            }
            break;
        case 2:
// присваивает имени имя/позиция родителского объекта + делитель + предыдущее имя объекта
            prevName = GetID(owner) + delimiter + prevName;
    }
// возвращает имя ПРАродителя и новое имя объекта
    return MakeName(ownerOwner, prevName);
}

function CheckObject(obj) {
// если объект является панелью 
    if (obj.AsPanel) {
// Сохраняем изменения в истрории
        Undo.Changing(obj);
// в зависимости от выбранного id:
        switch (changeType) {
            case 0:
//Переименовывает имя объекта                 
                obj.Name = MakeName(obj.Owner, obj.Name);
                break;
            case 1:
// Переименовывает позицию объекта
                obj.ArtPos = MakeName(obj.Owner, GetID(obj));
                break;
        }
// иначе, если объект является структурным
    } else if (obj.List) {








// присвоить переменной объект, привердённый к структурному(ЗАЧЕМ, ОН И ТАК СТРУКТУРНЫЙ?)
        var list = obj.AsList();
// для каждого элемента этого объекта
        for (var i = 0; i < list.Count; i++) {
// проверять является ли он панелью и или структурой, если структура - присваивает позицию для неё             
            CheckObject(list[i]);
        }
    }
}

function Make() {
for (var i = 0; i < Model.SelectionCount; i++) {
// кладёт в массив все выделенные элементы модели
    selection.push(Model.Selections[i]);
}


// для каждой выбранной модели
    for (var i = 0; i < selection.length; i++) {
// выполняется функция переименовывания
        CheckObject(selection[i]);
/*Расстановка позиций - НАЧАЛО*/
Action.ArrangePositions(1, Model.Selections[i]);
/*Расстановка позиций - КОНЕЦ*/
    }
}


// При завершении работы сохраняет данные настроек в файл xml 
Action.OnFinish = function () {
    settings.Save(filename)
}

Action.Continue();