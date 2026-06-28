Model.forEachPanel(
    function(Obj)
    {
      var Panel = Obj.AsPanel; //является ли выделенный объект панелью
         if (Panel.Selected)

        {
        StartEditing(Panel); //запись действия в историю, для отката
            if (Panel.TextureOrientation == 2) { //если вертикально, то 1 иначе 2
                Panel.TextureOrientation = 1; //горизонтально
            } else {
                Panel.TextureOrientation = 2; //вертикально
            }

        };
    }
);