Undo.RecursiveChanging(Model);
let arr = [];
Model.forEach(obj=>{
    if(obj instanceof TFurnBlock){
        arr.push(obj.UID);
        for(let i=0; i<obj.Count; i++){
            obj.Objects[i].Selected = true;
        }
    }
})
for(let j=0; j<Model.SelectionCount;j++){
    Model.Selections[j].ReTransform(Model.Selections[j].Owner,Model);
    Model.Selections[j].Owner = Model
}
UnSelectAll();
for(let k of arr){
    const _ = Model.DS.UIDGen.FindObject(k);
    DeleteObject(_);
}