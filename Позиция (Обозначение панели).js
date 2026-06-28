Model.forEachPanel(function (panel) {
        if (panel.ArtPos.indexOf('(') < 0)
            panel.ArtPos = panel.ArtPos + ' (' + panel.Designation + ')';
}
)