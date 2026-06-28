Model.forEach ( function(obj) {
    if (obj.IsAssemblyUnit && obj == '[object TFurnBlock]'){
        StartEditing(obj);
        obj.ArtPos = obj.Name
    }
})