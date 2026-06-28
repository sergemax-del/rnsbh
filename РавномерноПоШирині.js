//Равномерно по высоте
// Выбираем все панели которые надо сделать равномерно по высоте,
// включая


PosXMax1 = 0;
PosXMin1 =   0;
kPan=0;



  //alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan);


Model.forEachPanel(function(obj)

{
    if (obj.Selected == true)
   {

    //alert(obj.PositionY + ' --- ' + PosYMin);
  kPan=kPan+1;
     if  (kPan == 1)
    {
    PosXMax1 = obj.PositionX ;
    PosXMin1 = obj.PositionX ;

   // alert(PosYMax1 + ' --- ' + PosYMin1+ ' --- ' + kPan);
       };

     //alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan + ' --- ' + obj.PositionY);
    if  (PosXMax1 < obj.PositionX)
    {
    PosXMax1 = obj.PositionX
    //alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan + ' --- ' + obj.PositionY);
    };

    if  (PosXMin1 > obj.PositionX)
    {
    PosXMin1 = obj.PositionX
    //alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan);
    };

    //PosYMin1 = obj.PositionY;

    /// alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan);
   };

});

alert(PosXMax1 + ' --- ' + PosXMin1+ ' --- ' + kPan);

 rasst = (PosXMax1-PosXMin1)/ (kPan-1);

  //kPan=kPan-2; // количество панелей только между самой верхней и самой нижней

uroven = 1;
 NijnayaIzMejdu  = PosXMax1 ;
 while (kPan>0)
  {
 // определяем позицию нижней из между
  Model.forEachPanel(function(obj)

{
    if (obj.Selected == true)
   {
     if ((obj.PositionX != PosXMax1) &(obj.PositionX > PosXMin1))
   {
            if  (NijnayaIzMejdu>obj.PositionX) {NijnayaIzMejdu=obj.PositionX};
    }
  }
})
//  ------------определяем позицию нижней из между


// поставим  нижнюю на rasst  и Мин определим как это положение
  Model.forEachPanel(function(obj)

{
    if (obj.Selected == true)
   {
     if ((obj.PositionX == NijnayaIzMejdu) & (obj.PositionX != PosXMax1))
   {
          obj.PositionX = PosXMin1 + rasst;
          PosXMin1 =  obj.PositionX;
          NijnayaIzMejdu  = PosXMax1 ;
    }
  }
})
//  ------------определяем позицию нижней из между



 kPan--;
}