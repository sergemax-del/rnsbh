//Равномерно по высоте
// Выбираем все панели которые надо сделать равномерно по высоте,
// включая


PosYMax1 = 0;
PosYMin1 =   0;
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
    PosYMax1 = obj.PositionY ;
    PosYMin1 = obj.PositionY ;

   // alert(PosYMax1 + ' --- ' + PosYMin1+ ' --- ' + kPan);
       };

     //alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan + ' --- ' + obj.PositionY);
    if  (PosYMax1 < obj.PositionY)
    {
    PosYMax1 = obj.PositionY
    //alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan + ' --- ' + obj.PositionY);
    };

    if  (PosYMin1 > obj.PositionY)
    {
    PosYMin1 = obj.PositionY
    //alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan);
    };

    //PosYMin1 = obj.PositionY;

    /// alert(PosYMin1 + ' --- ' + PosYMin1+ ' --- ' + kPan);
   };

});

alert(PosYMax1 + ' --- ' + PosYMin1+ ' --- ' + kPan);

 rasst = (PosYMax1-PosYMin1)/ (kPan-1);

  //kPan=kPan-2; // количество панелей только между самой верхней и самой нижней

uroven = 1;
 NijnayaIzMejdu  = PosYMax1 ;
 while (kPan>0)
  {
 // определяем позицию нижней из между
  Model.forEachPanel(function(obj)

{
    if (obj.Selected == true)
   {
     if ((obj.PositionY != PosYMax1) &(obj.PositionY > PosYMin1))
   {
            if  (NijnayaIzMejdu>obj.PositionY) {NijnayaIzMejdu=obj.PositionY};
    }
  }
})
//  ------------определяем позицию нижней из между


// поставим  нижнюю на rasst  и Мин определим как это положение
  Model.forEachPanel(function(obj)

{
    if (obj.Selected == true)
   {
     if ((obj.PositionY == NijnayaIzMejdu) & (obj.PositionY != PosYMax1))
   {
          obj.PositionY = PosYMin1 + rasst;
          PosYMin1 =  obj.PositionY;
          NijnayaIzMejdu  = PosYMax1 ;
    }
  }
})
//  ------------определяем позицию нижней из между



 kPan--;
}