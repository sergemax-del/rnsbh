//-- window Window1
Window1 = { Form : NewForm() };
Props = Window1.Form.Properties;
Window1.Form.Width = 334;
Window1.Form.Height = 331;
Window1.Form.Caption = "Изменить чекбоксы объектов";
Window1.Form.MinHeight = 180;
//-- window Window1 properties

Window1.doc = Props.NewBool("Учитывать в документации  ",false);
Window1.doc.SetLayout(7, 13, 228, 22);
Window1.estimate = Props.NewBool("Учитывать в Базис - Смете   ",false);
Window1.estimate.SetLayout(7, 35, 255, 22);
Window1.cutting = Props.NewBool("Учитывать в Базис - Раскрое",false);
Window1.cutting.SetLayout(7, 57, 242, 22);
Window1.cnc = Props.NewBool("Учитывать в Базис - ЧПУ       ",false);
Window1.cnc.SetLayout(7, 79, 255, 22);
Window1.all = Props.NewButton("Все");
Window1.all.SetLayout(7, 269, 77, 22);
Window1.Button1 = Props.NewButton("Выделенные");
Window1.Button1.SetLayout(103, 269, 96, 22);
Window1.Button2 = Props.NewButton("Отмена");
Window1.Button2.SetLayout(217, 269, 100, 22);
Window1.Label1 = Props.NewLabel("-------------------------------------------------------------------------------------");
Window1.Label1.SetLayout(0, 101, 333, 22);
Window1.bl = Props.NewBool("Блоки   ",false);
Window1.bl.SetLayout(118, 123, 117, 22);
Window1.pan = Props.NewBool("Панели ",false);
Window1.pan.SetLayout(118, 189, 117, 22);
Window1.furn = Props.NewBool("Фурнитура",false);
Window1.furn.SetLayout(101, 233, 114, 22);
Window1.prof = Props.NewBool("Профили  ",false);
Window1.prof.SetLayout(106, 211, 111, 22);
Window1.draft = Props.NewBool("Полуфабрикаты",false);
Window1.draft.SetLayout(75, 145, 159, 22);
Window1.asm = Props.NewBool("Покупные изделия",false);
Window1.asm.SetLayout(62, 167, 159, 22);
//-- window Window1 events

Window1.all.OnClick = function(){
    Undo.RecursiveChanging(Model);    
    Model.forEach(obj=>{
        rekursChange(obj);
    })
    Window1.Form.Close();
    Action.Finish();
}
Window1.Button1.OnClick = function(){
    Undo.RecursiveChanging(Model);
    Model.forEach(obj=>{
        if(obj.Selected){
            rekursChange(obj,true);
        }
    })
    Window1.Form.Close();
    Action.Finish();
}
Window1.Button2.OnClick = function(){
    Window1.Form.Close();
    Action.Finish();
}

//-- window Window1 ends
Window1.Form.ShowModal();

function rekursChange(obj,flag){
    if(obj.Count){
        for(let i=0; i < obj.Count; i++){
            rekursChange(obj[i])
        }
    }
    this.flag = flag;
    let isBlock = (Window1.bl.Value   ) ? obj instanceof TFurnBlock     : false;
    let isPanel = (Window1.pan.Value  ) ? obj instanceof TFurnPanel     : false;
    let isFurn  = (Window1.furn.Value ) ? obj instanceof TFastener      : false;
    let isProf  = (Window1.prof.Value ) ? obj instanceof TExtrusionBody : false;
    let isDraft = (Window1.draft.Value) ? obj instanceof TDraftBlock    : false;
    let isAsm   = (Window1.asm.Value  ) ? obj instanceof TFurnAsm       : false;
   
    if(isFurn || isAsm || flag){
        obj.UseInEstimate = Window1.estimate.Value;
        obj.UseInDocs     = Window1.doc.Value;
    }

    if(isProf || flag){
        obj.UseInEstimate = Window1.estimate.Value;
        obj.UseInCutting  = Window1.cutting.Value;
    }

    if(isBlock || isPanel || isDraft || flag){
        obj.UseInDocs     = Window1.doc.Value;
        obj.UseInCNC      = Window1.cnc.Value;
        obj.UseInCutting  = Window1.cutting.Value;
        obj.UseInEstimate = Window1.estimate.Value;
    }
}

