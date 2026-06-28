StartEditing(Model);
for(let i=0; i<Model.SelectionCount;i++){
    let panel = Model.Selections[i];
    (panel instanceof TFurnPanel)?panel.Owner=AddBlock(panel.Name):false;
}

