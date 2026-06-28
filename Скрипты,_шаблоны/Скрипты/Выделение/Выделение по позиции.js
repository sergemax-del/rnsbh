Razd = '+';   //Разделитель позиций

Position = prompt('Введите номер позиции');

let posInStr = -1;  //Позиция в строке очередной позиции. Присваиваем невозможное значение
let TekBegin = 0;   //Текущее начало позиции
while ((posInStr = Position.indexOf(Razd, posInStr + 1)) != -1) {  //Цикл пока есть разделители
  SubPosition = Position.slice(TekBegin, posInStr);  //Присваиваем строке SubPosition часть строки с TekBegin по posInStr.
  TekBegin = posInStr + 1;  //Следующая позиция будет на 1 больше

  Model.forEach(function(obj) { //Функция перебирает все ОБЪЕКТЫ модели
    if (obj.ArtPos == SubPosition) {  //Если позиция объекта равна введенному значению
      obj.Selected = true;         //объект подсвечиваем
      }
    }
  );

}

SubPosition = Position.slice(TekBegin, 1000);  //Последняя позиция в строке. Присваиваем ей остаток строки
Model.forEach(function(obj) { //Функция перебирает все ОБЪЕКТЫ модели
  if (obj.ArtPos == SubPosition) {  //Если позиция объекта равна введенному значению
    obj.Selected = true;         //объект подсвечиваем
  }
});

if (Model.SelectionCount == 0) alert('Объектов с позициями ' + Position + ' нет в модели');