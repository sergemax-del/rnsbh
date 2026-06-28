// st_giraf 0 анимация сдвига на Model
historyOperations.RegisterObjectChanging(Model, false);
currentFileData.article.SalonBlockType = 8;
currentFileData.article.Animation.AxisStart = {x: 0, y: 0, z: 0};
currentFileData.article.Animation.AxisEnd = {x: 0, y: 0, z: 0};
currentFileData.article.Animation.Duration = 1;
currentFileData.article.SalonBlockType = 0;
historyOperations.CommitCurrentChanges(`Установка анимации`);