Model.forEach(function(obj) { 
    if ((obj.Selected) && obj.List) {
        for (var i = 0; i < obj.Count; ++i) {
            if (obj.ParamSectionNode('Elastic') !== undefined) {
                Undo.RecursiveChanging(obj);
                obj.ParamRemoveSection('Elastic');
            }
        }
    }
});
