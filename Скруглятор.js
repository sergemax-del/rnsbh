skr = NewFloatInput ('Радиус');
skr.Value = 50 // Здесь указываем требуемый радиус
Action.Continue();

Obj = Model.Selected; // возьмём выделенный объект
if (Obj)
Obj = Obj.AsPanel; //Приведём объект к типу панели
if (!Obj) //проверим, является ли он панелью
Obj = GetPanel("Укажите панель");
if (Obj) {
C = Obj.Contour; //Кунтур панели
StartEditing(Obj); //Укажем, что этот объект будет редактироваться
p = GetPoint("Укажите точку среза");
p = Obj.ToObject(p); //Переведем точку в систему координат контура панели
C.Rounding(p.x, p.y, skr.Value); //Скругление элементов
Obj.Build(); //Перестроим объект после всех изменений
Action.Finish(); //Применить изменения в модели внесённые в скрипте
};