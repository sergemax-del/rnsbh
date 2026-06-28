Угол = OpenFurniture('Уголок мебельный, пластик.f3d')

Угол.Mount(Пол, ЛБ, ЛБ.GabMax.x, 0, ЛБ.GabMin.z + 32);
Угол.Mount(Пол, ЛБ, ЛБ.GabMax.x, 0, ЛБ.GabMax.z - 32);
Угол.Mount(Пол, ПБ, ПБ.GabMin.x, 0, ПБ.GabMin.z + 32);
Угол.Mount(Пол, ПБ, ПБ.GabMin.x, 0, ПБ.GabMax.z - 32);
