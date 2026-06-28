/**
 * Создает копии выделенных объектов вокруг указанной оси
 * Сочетание клавиш [Alt+M]
 * 
 * Выбрать одну из основных осей (X, Y, Z).
 * Ввести необходимое количество, оригинал тоже считается.
 * Указать точку через которую пройдет ось вращения.
 * Нажать кнопку <Ok> для сохранения или клавишу <ESC> для отмены.
 */

let isSave = false;
let hasChanged = false;
let p = 0;

if (Model.SelectionCount == 0) {
    alert("Ошибка: не выбраны объекты для копирования!");
    Action.Finish();
}

FileOptions = 'Массив.xml';
MakeProp();
Action.Properties.Load(FileOptions);
Action.Continue();





function MakeProp() {
    Axis = Action.Properties.NewCombo("Ось вращения", "X\nY\nZ");
    Count = Action.Properties.NewNumber(`Количество элементов`, 3);
    OkButton = Action.Properties.NewButton("Ок");

    Action.OnFinish = function() {
        if (!isSave && hasChanged) {
            Undo.Last.Undo();
        }
    }

    Action.AsyncExec(function() {
        Axis.Enabled = true;
        Count.Enabled = true;
        OkButton.Enabled = false;
        p = GetPoint("Укажите точку на оси вращения");
        if (Axis.ItemIndex == 0) CreateByCircle(Count.Value, "x");
        if (Axis.ItemIndex == 1) CreateByCircle(Count.Value, "y");
        if (Axis.ItemIndex == 2) CreateByCircle(Count.Value, "z");
        hasChanged = true;
        Action.Commit();
        Undo.UndoOp[Undo.OpCount - 1].Name = "Скрипт: Массив по кругу";
        OkButton.Enabled = true;
        Axis.Enabled = false;
        Count.Enabled = false;
    })

    OkButton.OnClick = function() {
        Action.Properties.Save(FileOptions);
        isSave = true;
        Action.Finish();
    };
}

function CreateByCircle(count, dir) {

    let angle = 360 / count;

    let axis = AxisY;
    let pos1 = "PositionZ";
    let pos2 = "PositionX";
    let p1 = "z";
    let p2 = "x";

    if (dir === "x") {
        axis = AxisX;
        pos1 = "PositionY";
        pos2 = "PositionZ";
        p1 = "y";
        p2 = "z";
    }
    if (dir === "z") {
        axis = AxisZ;
        pos1 = "PositionX";
        pos2 = "PositionY";
        p1 = "x";
        p2 = "y";
    }

    for (let i = 0; i < Model.SelectionCount; i++) {
        let obj = Model.Selections[i];
        for (let j = 1; j < count; j++) {
            let alfa = j * angle * Math.PI / 180.0;
            let copy = AddCopy(obj);
            copy.Rotate(axis, angle * j);
            let param1 = Math.cos(alfa) * (obj[pos1] - p[p1]) - Math.sin(alfa) * (obj[pos2] - p[p2]) + p[p1];
            let param2 = Math.sin(alfa) * (obj[pos1] - p[p1]) + Math.cos(alfa) * (obj[pos2] - p[p2]) + p[p2];
            if (dir === 'y') copy.TranslateGCS({ x: param2 - obj[pos2], y: 0, z: param1 - obj[pos1] })
            if (dir === 'x') copy.TranslateGCS({ x: 0, y: param1 - obj[pos1], z: param2 - obj[pos2] })
            if (dir === 'z') copy.TranslateGCS({ x: param1 - obj[pos1], y: param2 - obj[pos2], z: 0 })
        }
    }
}