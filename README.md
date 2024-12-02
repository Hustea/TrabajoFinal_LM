Autor: Adrian Nicolas Hustea Spilca

Esta pagina web movil es un trabajo para la asignatura de "Lenguaje de Marcas" en primer año de Desarollo de Aplicaciones Multiplataformas.
Esta pagina web cumple el proposito de recopilar datos sobre cartas del juego "Magic The Gathering" utilizando una interfaz simple, colorida e intuitiva 
proporciono a los usuarios dos funciones claramente separadas en el menu principal que son las de buscar cartas sueltas y buscar mazos preconstruidos.

Buscar cartas:
Un buscador que recoge el impuut de los usuarios y lo utiliza para hacer peticiones a la api de la pagina Scryfall (una base de datos de cartas de magic)
devolviendo todas las cartas (ademas de sus tipos y su precio promedio de mercado) que en el nombre contengan la palabra sugeria.

Buscador de mazos:
Esta parta es algo diferente debido a que no existe ninguna api que tenga informacion sobre mazos preconstruidos, por lo tanto al buscar un mazo el codigo
JavaScript buscara en un archivo de texto que hay en el repositoorio llamado "Comander_Precons" donde estaran los nombres de los mazos seguidos de el
contenido de estos y utilizara el nombre de las cartas que encuentre ahi para hacer peticiones a la api anteriormente mencionada.
(Los datos de el archivo "Comander_Precons" los he recopilado haciento web scraping con Python)
