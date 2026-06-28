UnSelectAll();

Model.forEachPanel(function(panel) {
   if (panel.Contours.Count > 1) {      //Количество контуров больше одного. 99,9% есть внутренние контура. Но панель может быть из двух внешних контуров. 
      panel.Selected = true;
   }
   for (var i = 0; i < panel.Contour.Count; i++) {
      El = panel.Contour.Objects[i];
      if ((El.ElType == 2) || (El.ElType == 3)) { //Элемент контура окружность или дуга.
         panel.Selected = true;
         break;
      }
   }
});