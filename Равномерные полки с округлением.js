MinY = 1e10; // низ нижней полки
MaxY = -1e10; // верх верхней полки
SumThickness = 0; // суммарна толщина панелей
Count = 0; // количество панелей

for (k = 0; k < Model.SelectionCount; k++) {
obj = Model.Selections[k];
if (obj.Thickness > 1) {
if (obj.GabMin.y < MinY)
MinY = obj.GabMin.y;
if (obj.GabMax.y > MaxY)
MaxY = obj.GabMax.y;
SumThickness += obj.Thickness;
Count = Count + 1;
}
}

// нужное расстояние между полками
SpaceBetween = Math.floor((MaxY - MinY - SumThickness) / (Count - 1));

CurY = MinY;
for (k = 0; k < Model.SelectionCount; k++) {
obj = Model.Selections[k];
if (obj.Thickness > 1) {
Undo.Changing(obj);
obj.Translate(0, CurY - obj.GabMin.y, 0);
CurY = CurY + SpaceBetween + obj.Thickness;
}
}