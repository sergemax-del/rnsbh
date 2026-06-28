var sss;

function AddNameOwner(obj) {
    if (obj.Owner != undefined) {
        if ((obj.Owner.Name == 'Model') && (Model.Name != '')) sss = Article.Name + '/' + sss
        else
            sss = obj.Owner.Name + '/' + sss;
        AddNameOwner(obj.Owner);
    }    
}

    Model.forEach(function(obj) {
    if (obj.ArtPos != '') {
        sss = obj.Name;
        AddNameOwner(obj);
        obj.ArtPos = sss;                                 //В позицию записывается текстовое обозначение панели
        obj.UserProperty['Текстовое обозначение'] = sss;  //В пользовательское свойство 'Текстовое обозначение' записывается текстовое обозначение панели
    }
});