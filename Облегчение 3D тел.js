//убираем поверхности
//оставляем только ребра
obj = Model.Selected;
if ((obj) && ((obj.toString() == '[object TImportedMesh]') || (obj.toString() == '[object TFastener]'))) {
    StartEditing(obj);
    for (var i = 0; i < obj.TriListsCount; ++i) {
        for (var r = 0; r < obj.TriLists[i].Count; ++r) {
            var p1 = obj.TriLists[i].Triangles[r].Vertex1;
            var p2 = obj.TriLists[i].Triangles[r].Vertex2;
            var p3 = obj.TriLists[i].Triangles[r].Vertex3;
            if (obj.TriLists[i].Triangles[r].Edge12) {
                obj.Edges.AddLine(p1, p2);
            }
            if (obj.TriLists[i].Triangles[r].Edge23) {
                obj.Edges.AddLine(p2, p3);
            }
            if (obj.TriLists[i].Triangles[r].Edge31) {
                obj.Edges.AddLine(p3, p1);
            }

        }
        obj.TriLists[i].Clear();
    }
    if (obj.toString() == '[object TFastener]') {
        obj.GenerateNewId();
    }
    obj.Build();
    Action.Commit();
}
alert('ok');
