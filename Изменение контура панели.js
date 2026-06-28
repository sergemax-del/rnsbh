var Panel;

MakeProperties();
Action.Continue();

function Select () {
	Panel = GetPanel("Выберите панель");
    //запоминание первоначального контура панели
    Contour = Panel.Contour;
    OldContour = NewContour();
    OldContour.AddList(Contour.MakeCopy());
    Make();
}


function MakeProperties() {
    Prop = Action.Properties;
    SizesVerh = Prop.NewGroup('Вырез');
    WW = SizesVerh.NewNumber('Отступ выреза от края', 100);

    btStart = Prop.NewButton('Выбор панели');
	btStart.OnClick = function() {
		Panel = undefined;
		Action.AsyncExec(Select);
        Make();
	}

    OkBtn = Prop.NewButton('Выход');
    OkBtn.OnClick = function () {
        Action.Finish();
    };

    Prop.OnChange = function () {
        //добавлено
        if (Panel != undefined) {
            //восстановление первоначального контура панели
            StartEditing(Panel);
            Panel.Contour.Clear();
            Panel.Contour.AddList(OldContour.MakeCopy());
            Panel.Build();
         }
         Make();
    };

    Make();
 };


/**рисование выреза */
function Make() {
    Action.BlinkHint = '';
    if (Panel == undefined) {
        Action.BlinkHint = 'Панель не выбрана';
        return;
    }
    //внести в историю изменений панели, для возможности отката назад
    Undo.Changing(Panel);	
    //DeleteNewObjects(); //удалять новые объекты не нужно - их нет, работа с только Panel
    StartEditing(Panel);
    Cont = Panel.Contour;
    Hole = NewContour();
    Hole.AddRoundRect(20, WW.Value, 420, WW.Value + 400, 0);
    Cont.Subtraction(Hole);
    Panel.Build();
}
