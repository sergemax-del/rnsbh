//Сменить текстуру у выделенных панелей
if (Model.SelectionCount < 1) { //есть ли выделенные панели
alert('Нет панелей с выбраной текстурой!');
Action.Finish();
}
var Tex = prompt('Введите направление текстуры:\n0 - Без текстуры\n1 - Горизонтальная\n2 - Вертикальная');
Model.forEachPanel(function(Obj) {
var Panel = Obj.AsPanel; //является ли выделенный объект панелью
if (Panel.Selected) {
StartEditing(Panel);
Panel.TextureOrientation = Tex;
}});
Model.Build();