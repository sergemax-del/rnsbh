Model.forEachPanel(function(panel) {
    if (panel.Selected){
        var list_butts = {};
        for (var i=0;i<panel.Butts.Count;++i){
        if ((panel.Butts[i].Material=='припуск')&&(panel.Butts[i].Sign=='припуск')){
                list_butts[panel.Butts[i].ElemIndex]=panel.Butts[i];
            }
        }
        for (var i=0;i<panel.Contour.Count;++i){
            if (!list_butts[i]){
            var new_butt = panel.Butts.Add();
            new_butt.ElemIndex=i;
            new_butt.Material='припуск';
            new_butt.Sign='припуск';
            new_butt.Thickness=0;
            new_butt.Overhung=0;
            new_butt.Allowance=5;
            }
        }
        panel.Build();
    }
});