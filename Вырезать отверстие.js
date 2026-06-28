diam = NewFloatInput("Диаметр")
diam.Value = 25.2


p1 = GetPoint('Укажите центр отверстия');

Model.forEachPanel(function(Obj) {
if (Obj.Selected)
{
// возьмём выделенный объект
//Obj = Model.Selected;
// проверим, является ли он панелью
//if (Obj)
{Obj = Obj.AsPanel;}

if (Obj) {
// укажем, что этот объект будет редактироваться
StartEditing(Obj);

p = Obj.ToObject(p1);
// переведем точку в систему координат контура панели
Hole = NewContour();
Hole.AddCircle(p.x, p.y, diam.Value*0.5);
Obj.Contour.Subtraction(Hole);
Obj.Build();
};
}
});

