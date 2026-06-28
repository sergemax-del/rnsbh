Left = 0;
Right = 0;
Top = 0;
Bottom = 0;

// если это не режим редактирования, то указываем границы
if (!ParametricBlock) {
    SetCamera(p3dFront);
    Left = GetEdge('Укажите первую вертикальную границу', AxisY).GFirst.x;
    Right = GetEdge('Укажите вторую вертикальную границу', AxisY).GFirst.x;
    Top = GetEdge('Укажите первую горизонтальную границу', AxisX).GFirst.y;
    Bottom = GetEdge('Укажите вторую горизонтальную границу', AxisX).GFirst.y;

    if (Left > Right) {
        aaa = Left
        Left = Right
        Right = aaa
    }
    if (Bottom > Top) {
        aaa = Bottom
        Bottom = Top
        Top = aaa
    }
}
MakeProp();

if (!ParametricBlock) {
    FileOptions = 'Save.xml';
    Action.Properties.Load(FileOptions);
    SzLeft.Value = Left;
    SzBottom.Value = Bottom;
    SzWidth.Value = Right - Left;
    SzHeight.Value = Top - Bottom;
    if (Bottom > 820)
        DepthVal.Value = 315;
    else
        DepthVal.Value = 550;
    Action.OnFinish = function() {
        Action.Properties.Save(FileOptions);
    }
}

BtnOK = NewButtonInput("Построить")
BtnOK.OnChange = function() {
    Action.Finish()
}

function MakeProp() {
    Prop = Action.Properties;

    //группа корпус
    Korp = Prop.NewGroup('Корпус');
    SzLeft = Korp.NewNumber('Лево', Left);
    SzLeft.Visible = false;
    SzBottom = Korp.NewNumber('Низ', Bottom);
    SzBottom.Visible = false;
    SzWidth = Korp.NewNumber('Ширина', Right - Left);
    SzHeight = Korp.NewNumber('Высота', Top - Bottom);
    DepthVal = Korp.NewNumber('Глубина');
    DepthVal.Value = 550
    SideMat = Korp.NewMaterial('ДСП корпуса');
    ButtC = Korp.NewButt('Кромка корпуса')

    //группа вставная полка
    PolkaVs = Prop.NewBool('Вставная полка')
    PolkaVs.Value = true
    PolkaVs.OnChange = function() {
        PolkaVs.ChildrenEnabled = PolkaVs.Value
    }
    CountPol = PolkaVs.NewNumber('Количество')
    CountPol.Value = 1
    ShelfOffset = PolkaVs.NewNumber('Отступ с боков');
    ShelfOffset.Value = 1
    ShelfZag = PolkaVs.NewNumber('Заглубление')
    ShelfZag.Value = 10

    //группа фасад
    Doors = Prop.NewBool('Двери')
    Doors.Value = true
    Doors.OnChange = function() {
        Doors.ChildrenEnabled = Doors.Value
    }

    MatFas = Doors.NewMaterial('Материал')
    ButtD = Doors.NewButt('Кромка')
    KolDv = Doors.NewCombo('Кол-во дверей',  '1\n2')
    PetliLeftRight = Doors.NewCombo('Петли', 'Слева\nСправа');
    if (SzWidth.Value > 600)
    {
        PetliLeftRight.Enabled = false;
        KolDv.Enabled = false;
    }
    else
    {
        if (SzWidth.Value == 600)
        {
            KolDv.Enabled = true;
            if (KolDv.ItemIndex == 0)
                PetliLeftRight.Enabled = true;
            else
                PetliLeftRight.Enabled = false;
        }
        else
        {
            KolDv.Enabled = false;
            PetliLeftRight.Enabled = true;
        }
    }

    //группа столешница
    Stolesh = Prop.NewBool('Столешница')
    Stolesh.Value = true
    Stolesh.OnChange = function() {
        Stolesh.ChildrenEnabled = Stolesh.Value
    }
    MatStol = Stolesh.NewMaterial('Материал')

    // группа фурнитура
    FurnGroup = Prop.NewGroup('Фурнитура');
    Ручка = FurnGroup.NewFurniture('Ручка');
    Angle = FurnGroup.NewCombo('Угол поворота ручки',  '0\n90')
    Опора = FurnGroup.NewFurniture('Опора');
    Петля = FurnGroup.NewFurniture('Петля');
    НавескаЛевая = FurnGroup.NewFurniture('Навеска Левая');
    НавескаПравая = FurnGroup.NewFurniture('Навеска Правая');
    if (SzHeight.Value > 820)
    {
        НавескаЛевая.Enabled = true;
        НавескаПравая.Enabled = true;
        Опора.Enabled = false;
    } else {
        НавескаЛевая.Enabled = false;
        НавескаПравая.Enabled = false;
        Опора.Enabled = true;
    }
    Евровинт = FurnGroup.NewFurniture('Евровинт');
    Полкодержатель = FurnGroup.NewFurniture('Полкодержатель');
    Шкант = FurnGroup.NewFurniture('Шкант');

    Btn = Prop.NewButton('Построить')
    //обработка нажатия кнокпи
    Btn.OnClick = function() {
        Action.Finish()
    }
}

function Primenit()
{
    if (SzWidth.Value > 600)
    {
        PetliLeftRight.Enabled = false;
        KolDv.Enabled = false;
    }
    else
    {
        if (SzWidth.Value == 600)
        {
            KolDv.Enabled = true;
            if (KolDv.ItemIndex == 0)
                PetliLeftRight.Enabled = true;
            else
                PetliLeftRight.Enabled = false;
        }
        else
        {
            KolDv.Enabled = false;
            PetliLeftRight.Enabled = true;
        }
    }

    if (SzHeight.Value > 820)
    {
        НавескаЛевая.Enabled = true;
        НавескаПравая.Enabled = true;
        Опора.Enabled = false;
    } else {
        НавескаЛевая.Enabled = false;
        НавескаПравая.Enabled = false;
        Опора.Enabled = true;
    }

    if (Angle.ItemIndex == 0)
        Fi = 0;
    else
        Fi = 90;

    if (DepthVal.Value <= 199)
        alert('Глубина копуса менее 200 мм!\nВедите значение заново.')
    else
        MakeShelf();
}

Action.OnStart = function()
{
    //обработка событий в любых полях ввода свойства
    Prop.OnChange = Primenit;
    Primenit();
};

Action.Continue();

function EvrAndShkant(Panel1, Panel2, X, Y, Z, Sdvig) {
    Евровинт.Value.Mount(Panel1, Panel2, X, Y, Z);
    Шкант.Value.Mount(Panel1, Panel2, X, Y, Z + Sdvig);
}

function Petlya(Panel1, Panel2, X, Y, Z) {
    Петля.Value.Mount(Panel1, Panel2, X, Y, Z);
}

function PetliLeft() {
    Petlya(LeftPanel, (DverL || DverR || DverL1), LeftX, Bottom + 102, Depth);
    Petlya(LeftPanel, (DverL || DverR || DverL1), LeftX, Top - 102, Depth);
}

function PetliRight() {
    Petlya(RightPanel, (DverL || DverR || DverL1), LeftX, Bottom + 102, Depth);
    Petlya(RightPanel, (DverL || DverR || DverL1), LeftX, Top - 102, Depth);
}

function Ruchka(Panel, X, Y, Z, S) {
    Ручка.Value.Mount1(Panel, X, Y, Z, S)
}

function Dver1() //установка оной двери с петлями и ручкой
{
    DB1 = BeginBlock("Дверь");
    MatFas.SetActive();
    DverL = AddFrontPanel(Left + Fuga, Bottom + Fuga, Right - Fuga, Top - Fuga, Depth);
    DverL.TextureOrientation = ftoVertical; //направление текстуры
    DverL.AddButt(ButtD, 0);
    DverL.AddButt(ButtD, 1);
    DverL.AddButt(ButtD, 2);
    DverL.AddButt(ButtD, 3);

    if (PetliLeftRight.ItemIndex == 0) {
        if (Bottom > 820) {
            Ruchka((DverL || DverR || DverL1), RightX - 30, Y2 + 114, DepthDver, Fi);
            DverL.Name = 'Дверь левая';
            EndBlock();
            DB1.AnimType = AnimationType.DoorLeft;
            PetliLeft();
        } else {
            Ruchka((DverL || DverR || DverL1), RightX - 30, Y1 - 114, DepthDver, Fi);
            DverL.Name = 'Дверь левая';
            EndBlock();
            DB1.AnimType = AnimationType.DoorLeft;
            PetliLeft();
        }
    } else {
        if (Bottom > 820) {
            Ruchka((DverL || DverR || DverL1), LeftX + 30, Y2 + 114, DepthDver, Fi);
            DverL.Name = 'Дверь правая';
            EndBlock();
            DB1.AnimType = AnimationType.DoorRight;
            PetliRight();
        } else {
            Ruchka((DverL || DverR || DverL1), LeftX + 30, Y1 - 114, DepthDver, Fi);
            DverL.Name = 'Дверь правая';
            EndBlock();
            DB1.AnimType = AnimationType.DoorRight;
            PetliRight();
        }
    }
}

function Dver2() //установка двух дверей с петлями и ручками
{
    MatFas.SetActive()
    DB2 = BeginBlock("Дверь")
    DverL = AddFrontPanel(Left + Fuga, Bottom + Fuga, CentrX - Fuga, Top - Fuga, Depth);
    DverL.TextureOrientation = ftoVertical; //направление текстуры
    DverL.AddButt(ButtD, 0);
    DverL.AddButt(ButtD, 1);
    DverL.AddButt(ButtD, 2);
    DverL.AddButt(ButtD, 3);
    DverL.Name = 'Дверь левая';
    if (Bottom > 820) {
        Ruchka(DverL, CentrX - 30, Y2 + 114, DepthDver, Fi);
        EndBlock();
        DB2.AnimType = AnimationType.DoorLeft;
        PetliLeft();
    } else {
        Ruchka(DverL, CentrX - 30, Y1 - 114, DepthDver, Fi);
        EndBlock();
        DB2.AnimType = AnimationType.DoorLeft;
        PetliLeft();
    }

    DB3 = BeginBlock("Дверь");
    DverR = AddFrontPanel(CentrX + Fuga, Bottom + Fuga, Right - Fuga, Top - Fuga, Depth);
    DverR.TextureOrientation = ftoVertical; //направление текстуры
    DverR.AddButt(ButtD, 0);
    DverR.AddButt(ButtD, 1);
    DverR.AddButt(ButtD, 2);
    DverR.AddButt(ButtD, 3);
    DverR.Name = 'Дверь правая';
    if (Bottom > 820) {
        Ruchka(DverR, CentrX + 30, Y2 + 114, DepthDver, Fi);
        EndBlock();
        DB3.AnimType = AnimationType.DoorRight;
        PetliRight();
    } else {
        Ruchka(DverR, CentrX + 30, Y1 - 114, DepthDver, Fi);
        EndBlock();
        DB3.AnimType = AnimationType.DoorRight;
        PetliRight();
    }
}

function MakeShelf() {
    DeleteNewObjects();

    // границы теперь возьмем из параметров (т.к. они сохраняютя)
    Left = SzLeft.Value;
    Bottom = SzBottom.Value;
    Right = SzLeft.Value + SzWidth.Value;
    Top = SzBottom.Value + SzHeight.Value;

    if (Bottom > 820)
        NameBL = 'Полка ';
    else
        NameBL = 'Тумба ';

    SH = Right - Left;
    SH1 = SH.toFixed().toString();
    BL = BeginParametricBlock(NameBL + SH1);
    Depth = DepthVal.Value;
    Offset = ShelfOffset.Value;
    SideMat.SetActive();
    DepthDver = Depth + SideMat.Thickness;
    LeftX = Left + SideMat.Thickness;
    RightX = Right - SideMat.Thickness;
    Y1 = Top - SideMat.Thickness;
    Y2 = Bottom + SideMat.Thickness;
    Z1 = 16;
    ActiveMaterial.Make('ДВП Серая', 4);
    Zadst = AddFrontPanel(LeftX - 5, Y1 + 5, RightX + 5, Y2 - 5, Z1); //установка задней стенки
    Smech = Z1 + Zadst.Thickness;
    CZ = Zadst.Contour;
    SideMat.SetActive();
    Fuga = 2; //зазаор для дверей
    CentrX = ((Right - Left) * 0.5 + Left);
    Odds = SH.toFixed(); //ширина корпуса
    LeftPanel = AddVertPanel(0, Bottom, Depth, Top, Left); //установка левого бока
    RightPanel = AddVertPanel(0, Bottom, Depth, Top, RightX); //установка правого бока
    Dno = AddHorizPanel(LeftX, 0, RightX, Depth, Bottom); // установка дна
    PosY = Bottom;
    YInc = ((Top - Bottom) - SideMat.Thickness) / 2;
    ShLeft = LeftX + Offset; //зазор для вкалдной полки слева
    ShRight = RightX - Offset; //зазор для вкалдной полки справа
    Prol = ((Y1 - Y2) - SideMat.Thickness * CountPol.Value) / (CountPol.Value + 1)

    //задание текстур для панелей
    LeftPanel.TextureOrientation = ftoVertical;
    RightPanel.TextureOrientation = ftoVertical;
    Dno.TextureOrientation = ftoHorizontal;
    Zadst.TextureOrientation = ftoVertical;

    //пазы на панелях
    Cut1 = LeftPanel.AddCut('Паз 16 (4х6)');
    Cut1.Trajectory.AddLine(18, 0, 18, LeftPanel.ContourHeight);
    Cut1.Contour.AddRectangle(-2, 0, 2, 6);
    Cut2 = RightPanel.AddCut('Паз 16 (4х6)');
    Cut2.Trajectory.AddLine(18, 0, 18, RightPanel.ContourHeight);
    Cut2.Contour.AddRectangle(-2, RightPanel.Thickness, 2, RightPanel.Thickness - 6)
    Cut3 = Dno.AddCut('Паз 16 (4х6)');
    Cut3.Trajectory.AddLine(0, -18, Dno.ContourWidth, -18);
    Cut3.Contour.AddRectangle(-2, Dno.Thickness - 6, 2, Dno.Thickness);

    //кромка на панелях
    LeftPanel.AddButt(ButtC, 0);
    LeftPanel.AddButt(ButtC, 1);
    LeftPanel.AddButt(ButtC, 2);
    LeftPanel.AddButt(ButtC, 3);
    RightPanel.AddButt(ButtC, 0);
    RightPanel.AddButt(ButtC, 1);
    RightPanel.AddButt(ButtC, 2);
    RightPanel.AddButt(ButtC, 3);
    Dno.AddButt(ButtC, 0);
    Dno.AddButt(ButtC, 2);

    LeftPanel.Name = 'Бок левый';
    RightPanel.Name = 'Бок правый';
    Zadst.Name = 'Задняя стенка';

    if (Bottom > 820) {
        Planka = AddHorizPanel(LeftX, 0, RightX, Depth, Top - SideMat.Thickness); // установка крышки сверху
        Planka.TextureOrientation = ftoHorizontal; //направление текстуры
        Cut4 = Planka.AddCut('Паз 16 (4х6)'); //паз
        Cut4.Trajectory.AddLine(0, -18, Planka.ContourWidth, -18);
        Cut4.Contour.AddRectangle(-2, 0, 2, 6);
        Planka.AddButt(ButtC, 0);
        Planka.AddButt(ButtC, 2);
        Planka.Name = 'Полка'
    } else {
        PlankaZ = AddHorizPanel(LeftX, 0, RightX, 103, Top - SideMat.Thickness); //установка задней планки
        PlankaP = AddHorizPanel(LeftX, Depth, RightX, Depth - 103, Top - SideMat.Thickness); //установка передней планки
        PlankaP.TextureOrientation = ftoHorizontal; //направление текстуры
        PlankaZ.TextureOrientation = ftoHorizontal; //направление текстуры
        Cut5 = PlankaZ.AddCut('Паз 16 (4х6)'); //паз
        Cut5.Trajectory.AddLine(0, -18, PlankaZ.ContourWidth, -18);
        Cut5.Contour.AddRectangle(-2, 0, 2, 6);
        PlankaZ.AddButt(ButtC, 0);
        PlankaZ.AddButt(ButtC, 2);
        PlankaP.AddButt(ButtC, 0);
        PlankaP.AddButt(ButtC, 2);
        PlankaP.Name = 'Планка передняя';
        PlankaZ.Name = 'Планка задняя';
    }

    if (Doors.Value == true) {
        if (Odds == 600) //корпус равен строго 600 мм установка дверей, петель и ручек
        {
            if (KolDv.ItemIndex == 0 /*confirm('Установить одну дверь?\nНет - установятся две двери!')*/)
                Dver1()
            else
                Dver2()
        } else { //корпус не равен 600 мм
            if (Odds < 600)
                Dver1()
            else
                Dver2()
        }
    }
    A1 = Depth - 37; //установка первого евровинта
    A2 = A1 % 32; //остаток от глубины корпуса
    Zag = ShelfZag.Value; //заглубление вставной полки спереди
    WidthPol = Depth - Smech - ShelfZag.Value
    //установка вставной полки
    if (ShelfZag.Value < 0 || WidthPol <= 142) {
        alert('Значение заглубления полки не корректно!\nВедите значение заново.')
    } else {
        if (PolkaVs.Value == true) {
            for (var k = 0; k < CountPol.Value; k++)
                if (ShelfOffset.Value < 0 || ShelfOffset.Value > 5) {
                    alert('Значение отступа полки не корректно!\nВведите значение заново.')
                } else {
                    if (ShelfOffset.Value > 0) {
                        Y2 += Prol;
                        SideMat.SetActive();
                        Zpol = Depth - Zag;
                        Polka = AddHorizPanel(ShLeft, Smech, ShRight, Zpol, Y2);
                        ZPD1 = A2 + 64; //отв под полкодержатель сзади
                        OstFase = (Zpol - ZPD1) % 32;
                        ZPD2 = Zpol - OstFase - 32
                        Polka.TextureOrientation = ftoHorizontal;
                        Polka.AddButt(ButtC, 0);
                        Polka.AddButt(ButtC, 1);
                        Polka.AddButt(ButtC, 2);
                        Polka.AddButt(ButtC, 3);
                        Polka.Name = 'Полка вставная';
                        Polkoder = Полкодержатель.Value;
                        Polkoder.Mount(Polka, LeftPanel, ShLeft, Y2, ZPD1);
                        Polkoder.Mount(Polka, RightPanel, ShRight, Y2, ZPD1);
                        Polkoder.Mount(Polka, LeftPanel, ShLeft, Y2, ZPD2);
                        Polkoder.Mount(Polka, RightPanel, ShRight, Y2, ZPD2);
                        Y2 += SideMat.Thickness;
                    } else {
                        Y2 += Prol;
                        SideMat.SetActive();
                        Zpol = Depth - Zag;
                        Polka = AddHorizPanel(ShLeft, Smech, ShRight, Zpol, Y2);
                        ZPD1 = A2 + 64; //отв под полкодержатель сзади
                        OstFase = (Zpol - ZPD1) % 32;
                        ZPD2 = Zpol - OstFase - 32
                        Polka.TextureOrientation = ftoHorizontal;
                        Polka.AddButt(ButtC, 2);
                        Polka.Name = 'Полка';
                        EvrAndShkant(Polka, LeftPanel, LeftX, PosY, (A2 + 32), 32);
                        EvrAndShkant(Polka, RightPanel, RightX, PosY, (A2 + 32), 32);
                        EvrAndShkant(Polka, LeftPanel, LeftX, PosY, ZPD2, -32);
                        EvrAndShkant(Polka, RightPanel, RightX, PosY, ZPD2, -32);
                        Y2 += SideMat.Thickness;
                    }
                }
        }
    }
    if (Bottom > 820) //построения для глубины меньше 315
    {
        Dno.Name = 'Полка';

        CZ.Clear();
        CZ.AddLine(0, -Zadst.GSize.y, 0, -43);
        CZ.AddLine(0, -43, 16, -43);
        CZ.AddLine(16, -43, 16, 0);
        CZ.AddLine(16, 0, Zadst.GSize.x - 16, 0);
        CZ.AddLine(Zadst.GSize.x - 16, 0, Zadst.GSize.x - 16, -43);
        CZ.AddLine(Zadst.GSize.x - 16, -43, Zadst.GSize.x, -43);
        CZ.AddLine(Zadst.GSize.x, -43, Zadst.GSize.x, -Zadst.GSize.y);
        CZ.AddLine(Zadst.GSize.x, -Zadst.GSize.y, 0, -Zadst.GSize.y);

        EvrAndShkant(Dno, LeftPanel, LeftX, Y2, (A2 + 32), 32);
        EvrAndShkant(Dno, RightPanel, RightX, Y2, (A2 + 32), 32);
        EvrAndShkant(Dno, LeftPanel, LeftX, Y2, (Depth - 37), -32);
        EvrAndShkant(Dno, RightPanel, RightX, Y2, (Depth - 37), -32);
        EvrAndShkant(Planka, LeftPanel, LeftX, PosY, (A2 + 32), 32);
        EvrAndShkant(Planka, RightPanel, RightX, PosY, (A2 + 32), 32);
        EvrAndShkant(Planka, LeftPanel, LeftX, PosY, (Depth - 37), -32);
        EvrAndShkant(Planka, RightPanel, RightX, PosY, (Depth - 37), -32);
        NavesL = НавескаЛевая.Value;
        NavesL.Mount(Planka, LeftPanel, LeftX, Y1, Smech);
        NavesR = НавескаПравая.Value;
        NavesR.Mount(Planka, RightPanel, RightX, Y1, Smech);
    } else //построения для глубины больше 315
    {
        Dno.Name = 'Дно';
        if (Stolesh.Value == true) {
            MatStol.SetActive()
            Stol = AddExtrusion();
            SK = Stol.Contour;
            LS1 = SK.AddLine(0, 0, 0, 38);
            LS2 = SK.AddLine(0, 38, Depth + 50, 38);
            LS3 = SK.AddLine(Depth + 50, 38, Depth + 50, 0);
            LS4 = SK.AddLine(Depth + 50, 0, 0, 0);
            SK.RoundingEx(LS2, LS3, Depth + 50 - 1, 38 - 1, 9);
            Stol.Rotate(AxisY, -90);
            Stol.Contour.Move(0, Top);
            Stol.PositionX = Left;
            Stol.Thickness = (Left - Right);
            Stol.Name = 'Столешница';
            Stol.Build();
        }

        EvrAndShkant(Dno, LeftPanel, LeftX, Y2, (A2 + 32), 32);
        EvrAndShkant(Dno, RightPanel, RightX, Y2, (A2 + 32), 32);
        EvrAndShkant(Dno, LeftPanel, LeftX, Y2, (Depth - 37), -32);
        EvrAndShkant(Dno, RightPanel, RightX, Y2, (Depth - 37), -32);
        EvrAndShkant(PlankaZ, LeftPanel, LeftX, PosY, (A2 + 32), 32);
        EvrAndShkant(PlankaZ, RightPanel, RightX, PosY, (A2 + 32), 32);
        EvrAndShkant(PlankaP, LeftPanel, LeftX, PosY, (Depth - 37), -32);
        EvrAndShkant(PlankaP, RightPanel, RightX, PosY, (Depth - 37), -32);
        Opora = Опора.Value;
        Opora.Mount1(Dno, LeftX + 50, -10, Depth - 69, 0);
        Opora.Mount1(Dno, LeftX + 50, -10, A2 + 64, 0);
        Opora.Mount1(Dno, RightX - 50, -10, Depth - 69, 0);
        Opora.Mount1(Dno, RightX - 50, -10, A2 + 64, 0);
    }
    BL = EndParametricBlock();
}