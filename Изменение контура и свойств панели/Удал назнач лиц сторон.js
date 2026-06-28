Model.forEachPanel(function(panel) {
   if (panel.FrontFace != 2) {
       panel.FrontFace = 2;
       panel.Selected = true;
   }
})