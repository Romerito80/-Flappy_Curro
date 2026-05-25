# Flappy Curro Sevilla

Videojuego educativo inspirado en Flappy Bird, ambientado en Sevilla y construido con HTML5, CSS3, JavaScript Vanilla y Canvas API.

## Como ejecutar

Abre `index.html` en cualquier navegador moderno. Tambien puedes levantar un servidor estatico desde esta carpeta:

```bash
python -m http.server 8000
```

Despues visita `http://localhost:8000`.

## Controles

- Espacio o flecha arriba: salto.
- Click o toque en pantalla: salto.
- Boton de pausa, tecla `P` o `Esc`: pausar.
- Boton `Inicio` en pausa o Game Over: volver a la pantalla principal.
- Boton `Canjear`: gastar ensaladillas en curiosidades y cartas monumentales.
- Boton de copa: ver curiosidades y cartas desbloqueadas.

## Estructura

```text
Juego/
|-- index.html
|-- style.css
|-- script.js
|-- assets/
|   |-- sprites/
|   |   |-- curro.png
|   |   |-- giralda.png
|   |   |-- torre_del_oro.png
|   |   |-- torre_pelli.png
|   |   |-- fondo_sevilla.png
|   |   `-- suelo.png
|   `-- sounds/
|       |-- jump.wav
|       |-- hit.wav
|       `-- score.wav
`-- README.md
```

## Decisiones tecnicas

- El render se hace sobre un canvas logico de `432x768`, escalado por CSS para mantener el pixel art en escritorio, tablet y movil.
- `script.js` esta organizado por modulos logicos: configuracion, assets, audio, score, player/fisica, particulas, fondo, obstaculos, colisiones, render, input y estado de juego.
- El fondo se dibuja proceduralmente en Canvas con referencias pixel-art a Sevilla: Plaza de Espana, Giralda, Torre del Oro, Torre Pelli, puente, rio y naranjos.
- El fondo cambia segun la ubicacion actual: Ribera del Guadalquivir, Puerta de Jerez, Fuente de Hispalis y Plaza de Espana.
- Las fotos de ubicacion estan optimizadas en `assets/sprites/puerta_jerez.png`, `assets/sprites/fuente_hispalis.png` y `assets/sprites/plaza_espana_bonus.png`.
- La interfaz usa una estetica de terminal Linux retro: paneles oscuros, texto verde fosforo, scanlines y botones tipo consola.
- La puntuacion se representa tambien con botellines pixel-art estilo Cruzcampo, manteniendo el numero para que sea legible.
- La moneda acumulable se muestra como ensaladillas y se conserva con `localStorage`.
- Desde la pantalla de inicio se accede a `Canjear`, una pantalla propia para gastar ensaladillas en curiosidades por zonas.
- Hay 30 curiosidades coleccionables de Sevilla.
- Hay 12 cartas monumentales tipo coleccionable, inspiradas en lugares significativos de Sevilla, que cuestan 15 ensaladillas cada una.
- Las cartas usan fotos guardadas en `assets/cards/`.
- La coleccion de curiosidades y cartas se guarda con `localStorage` y se consulta desde el boton de copa en la pantalla de inicio.
- El himno de Sevilla se reproduce como musica de fondo en bucle y a volumen bajo al pulsar `Jugar`.
- Los obstaculos se generan proceduralmente con referencias sevillanas: Giralda, Torre del Oro, Torre Pelli, columnas, farolas y balcones.
- El record se guarda con `localStorage`.
- La animacion usa `requestAnimationFrame` y limita el delta temporal para evitar saltos bruscos si la pestana se pausa.
- Los sprites y sonidos incluidos son placeholders pixel-art generados localmente; el juego tambien dibuja formas de respaldo si algun asset falta.

## Objetivo educativo

El proyecto esta pensado para revisar conceptos de programacion de videojuegos sin frameworks: bucle principal, fisica simple, colisiones, estados, entrada de usuario, gestion de assets, audio y renderizado en Canvas.
