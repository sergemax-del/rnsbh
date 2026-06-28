Model.forEach ( function(obj) {
    if ( obj instanceof TFurnBlock){
        StartEditing(obj);
        obj.ArtPos = obj.Name;
    }
})