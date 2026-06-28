arr = [];
Model.forEach(obj=>{
    if(obj instanceof TFurnBlock && (obj.Count==1 || !obj.Count)){
        arr.push(obj.UID);
    }
});
for(let i of arr){
    DeleteObject(Model.DS.UIDGen.FindObject(i))
}
