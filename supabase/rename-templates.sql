-- Simplifica los nombres de plantillas al nombre del evento, sin adjetivo
-- de estilo (el nombre ahora es lo único visible en la tarjeta, ya que se
-- quitó el tag de categoría duplicado).
update templates set name = 'Boda' where category = 'boda';
update templates set name = 'XV Años' where category = 'xv_anos';
update templates set name = 'Bautizo' where category = 'bautizo';
update templates set name = 'Baby Shower' where category = 'baby_shower';
