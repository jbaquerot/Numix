# Numix

Numix es un juego web para practicar operaciones combinadas, pensado para niñas de 9 a 12 años. Se puede jugar de forma individual o con varias jugadoras en un mismo dispositivo.

## Desarrollo local

Numix no necesita un servidor ni un proceso de compilación. Abre `index.html` en un navegador o sirve la carpeta con cualquier servidor de archivos estáticos durante el desarrollo.

Para ejecutar las pruebas automatizadas se necesita Node.js 22 o posterior:

```bash
npm test
```

## Despliegue en GitHub Pages

El proyecto está preparado como un sitio estático. Para publicarlo, configura GitHub Pages para desplegar desde la rama `main` y la carpeta raíz (`/`). GitHub Pages servirá `index.html` junto con los recursos relativos de `styles.css` y `js/`.

No requiere backend, base de datos, cuentas ni variables de entorno.

## Documentación del proyecto

- [Constitution](.specify/memory/constitution.md)
- [Especificación funcional](.specify/specs/001-juego-numix/spec.md)
- [Plan técnico](.specify/specs/001-juego-numix/plan.md)
- [Tareas de implementación](.specify/specs/001-juego-numix/tasks.md)
