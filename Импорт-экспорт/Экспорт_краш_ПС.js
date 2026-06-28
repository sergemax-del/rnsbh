var
  csvRows = [];

function Recurse(List)
{
  for (var i = 0; i < List.Count; i++) {
    Obj = List[i];
    if (Obj.List)
      Recurse(Obj)
    else {
      var Line = [];
      Line.push(Obj.UserProperty['Модель_фасада']);
      Line.push(Obj.UserProperty['Тип_фасада']);
      Line.push(Obj.UserProperty['Толща']);
      Line.push(Obj.UserProperty['Профиль_торца']);
      Line.push(Obj.GSize.x);
      Line.push(Obj.GSize.y);
      Line.push(Obj.UserProperty['Кол']);
      Line.push(Obj.UserProperty['Цвет']);
      Line.push(Obj.UserProperty['Покрытие']);
      Line.push(Obj.UserProperty['Обр_сторона']);
      Line.push(Obj.UserProperty['Спецэффект']);
      Line.push(Obj.UserProperty['Патина']);
      Line.push(Obj.UserProperty['Примечание']);
      Line.push(Obj.UserProperty['Осн_цвет_Инт_Ручки']);
      Line.push(Obj.UserProperty['Доп_цвет_Инт_Ручки']);
/*      Line.push(Obj.Name);
      Line.push(Obj.ArtPos);
      Line.push(Obj.GSize.x);
      Line.push(Obj.GSize.y);
      Line.push(Obj.GSize.z);
      Line.push(Технпуть = Obj.UserProperty['Техн. путь']);
      Line.push(Obj.UserProperty['Чертеж']);*/
      csvRows.push(Line.join(';'));
}
}
}

Recurse(Model);
system.askWriteTextFile('csv', csvRows.join('\n'));