c==8


 - POST /players - нужно login, password, email в бади, регистрирует и дает токен
 - POST /players/auth - нужно login и password в бади, авторизует и дает токен
 - GET /players/me - дает инфу текущего пользователя
 - PUT /players/me/edit - берет name, lastname, city, hours(формат:{start:"number",end:"number"}) из бади и загоняет в монгу, респонсит обновленным пользователем
 - PUT /players/go - меняет готовность игрока к игре
 - DELETE /players/h - удаляет активные часы по их id в бади
 - GET /players/find?field=*govno*&value=*mocha* - находит игроков, field должен быть all/city/id, value - название города или айдишник челика. Если field==all возвращает всех игроков, если field==city и value==*город* находит всех челиков в указанном городе, если field==id и value==*_id челика* находит челика по его _id



 - GET /matchmaking/active?city=*suka* - находит всех игроков, готовых к игре в городе, указанном в юрле