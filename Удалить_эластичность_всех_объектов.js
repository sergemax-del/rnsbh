Undo.RecursiveChanging(Model);
function DeleteElastic(list) {
    for (var i = 0; i < list.Count; ++i) {
        if (list.Objects[i].ParamSectionNode('Elastic') !== undefined) {
            list.Objects[i].ParamRemoveSection('Elastic');
        }
        DeleteElastic(list.Objects[i]);
    }
}
let ConfirmDelete = confirm("Удалить эластичность?");
if(ConfirmDelete){
    DeleteElastic(Model);
}

