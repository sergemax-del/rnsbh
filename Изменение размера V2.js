/*
http://promebelclub.ru/forum/showpost.php?p=500697&postcount=1322

Изменяет размер выделенных панелей. Полезно для кромлёных панелей.
Можно установить нужный размер, или добавить или отнять от текущего размера каждой панели.
Также это удобно и для некромлёных панелей, при изменении нескольких панелей с разными размерами.
Баг - Иногда изменяет положение панели. Закономерность бага не понятна.
*/

if (Model.SelectionCount < 1) {
    alert('Нужно выделить панели')
    Action.Finish();
}
var stringLenght = [];
var stringWidth = [];

for (var i = 0; i < Model.SelectionCount; i++) {
    CheckObject(Model.Selections[i], AddSize)
}
if (stringWidth.length < 1) {
    alert('Нужно выделить панели')
    Action.Finish();
}

Prop = Action.Properties;
Dir = Prop.NewCombo(' ', 'Установить\nПрибавить\nОтнять')
Prop.NewButton('Все равномерно').OnClick = function() {
    DirWidth.Value = 'Равномерно'
    DirLenght.Value = 'Равномерно'
}
Prop.NewString(stringLenght.join(';'), 'Длинна');
DirLenght = Prop.NewCombo('Направление изменения', 'Вверх\nВниз\nРавномерно')
newLenght = Prop.NewNumber(' ', 0);
Prop.NewString(stringWidth.join(';'), 'Ширина');
DirWidth = Prop.NewCombo('Направление изменения', 'Вправо\nВлево\nРавномерно')
newWidth = Prop.NewNumber(' ', 0);
Prop.NewButton('Применить').OnClick = function() {
    for (var i = 0; i < Model.SelectionCount; i++) {
        CheckObject(Model.Selections[i], MakePanel)
    }
};
Prop.NewButton('Закончить').OnClick = function() {
    Action.Finish();
};

Action.Continue();

function CheckObject(obj, fun) {
    if (obj.AsPanel) {
        fun.call(this, obj)
    } else if (obj.List) {
        for (var i = 0; i < obj.Count; i++) {
            CheckObject(obj[i], fun)
        }
    }
}

function AddSize(p) {
    stringWidth.push(p.Contour.Width.toFixed(1))
    stringLenght.push(p.Contour.Height.toFixed(1))
}

function MakePanel(p) {
    if (Dir.Value == 'Установить') {
        Width = (newWidth.Value) ? newWidth.Value : p.Contour.Width;
        Lenght = (newLenght.Value) ? newLenght.Value : p.Contour.Height;
    } else if (Dir.Value == 'Прибавить') {
        Width = p.Contour.Width + newWidth.Value;
        Lenght = p.Contour.Height + newLenght.Value;
    } else if (Dir.Value == 'Отнять') {
        Width = p.Contour.Width - newWidth.Value;
        Lenght = p.Contour.Height - newLenght.Value;
    }
    xMove = (DirWidth.Value == 'Вправо') ? 0 : (DirWidth.Value == 'Влево') ? ((Width - p.Contour.Width) * -1) : (((Width - p.Contour.Width) / 2) * -1)
    yMove = (DirLenght.Value == 'Вверх') ? 0 : (DirLenght.Value == 'Вниз') ? ((Lenght - p.Contour.Height) * -1) : (((Lenght - p.Contour.Height) / 2) * -1)

    StartEditing(p);
    p.Contour.Fit(0, 0, Width, Lenght);
    p.Contour.Move(xMove, yMove);
    p.Build();
    Action.Commit();
};