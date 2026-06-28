arr = [];
Model.forEach(obj=>{
    let isAsm = obj instanceof TFurnAsm;
    let isBlock = obj instanceof TFurnBlock;
    let isDraft = obj instanceof  TDraftBlock;
    if((isBlock||isAsm||isDraft) && obj.Count==1 && obj[0] instanceof TModelLimits ){
        arr.push(obj.UID);
    }
});
for(let i of arr){DeleteObject(Model.DS.UIDGen.FindObject(i))}