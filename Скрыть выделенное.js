//Скрыть выделенное
Model.forEach(function (obj) {
    if (obj.Selected == true) {
        obj.Visible = false;
    }
});
UnSelectAll();
//var mainForm = Action.Control.Owner.Owner;
//var est = mainForm.FindComponent('a3ViewShadeAndLines');
//est.Execute();