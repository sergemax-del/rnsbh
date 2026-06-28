Model.forEach(function (obj) {
    if (obj.Name == "Параллельная линия"){
    obj.Visible = !obj.Visible;
    }
    if (obj.Name == "Биссектриса"){
    obj.Visible = !obj.Visible;
    }
    if (obj.Name == "Перпендикулярная линия"){
    obj.Visible = !obj.Visible;
    }
    if (obj.Name == "Линия под углом"){
    obj.Visible = !obj.Visible;
    }
    if (obj.Name == "Линия пересечения"){
    obj.Visible = !obj.Visible;
    }
}
);
