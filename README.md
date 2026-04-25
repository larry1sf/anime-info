# 🎌 Anime Info - Buscador y Enciclopedia de Anime

![Banner/Preview](./preview.png) <!-- Sugerencia: Añade aquí una captura de pantalla de tu proyecto -->

Este proyecto es una aplicación web diseñada para buscar, explorar y mostrar información detallada sobre animes. Desarrollado como parte de mi **portafolio personal**, este sitio demuestra mi capacidad para construir interfaces web modernas, rápidas y dinámicas enfocadas en la experiencia de usuario y el rendimiento.

## 🚀 Características Principales

*   **Exploración de Animes:** Encuentra información completa y detallada sobre tus series favoritas de anime.
*   **Sección de Detalles Completos:** Accede a detalles específicos que incluyen la sinopsis, lista de personajes, actores de voz y otros animes relacionados.
*   **Arquitectura Híbrida (Astro + React):** Utiliza la potencia de Astro para maximizar la velocidad de carga (HTML estático) y delega a React la interactividad de los componentes clave.
*   **Diseño Minimalista y Moderno:** Interfaz limpia enfocada en la usabilidad utilizando buenas prácticas de UI/UX.
*   **Esqueletos de Carga (Skeletons):** Experiencia de usuario transparente mediante indicadores de carga (skeleton loaders) mientras los datos de la API son procesados.

## 🛠️ Tecnologías y Herramientas Utilizadas

*   **Framework Principal:** [Astro](https://astro.build/) - Para generar un sitio ultra rápido aprovechando su arquitectura de islas.
*   **Interactividad:** [React](https://react.dev/) - Librería base para la interactividad, filtros, estado de visualización, etc.
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) - Utilidades atómicas de CSS que agilizan el diseño responsivo y a medida.
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Tipado estático para asegurar un código robusto, escalable y libre de errores.
*   **Consumo de Datos:** [Jikan API](https://docs.jikan.moe/) - La API REST no oficial de MyAnimeList.
*   **Iconografía:** [Tabler Icons](https://tabler.io/icons) para enriquecer el diseño visual.

## ⚙️ Arquitectura del Proyecto

Este proyecto aplica de forma práctica el patrón **Island Architecture** propuesto por Astro:
- Componentes de estructura básica, SEO y "layout" se renderizan en el servidor (`.astro`), evitando enviar JavaScript pesado al navegador cuando no es necesario.
- Los componentes que demandan estado como el enrutador del menú o la respuesta de la información (`Context` e interactividad `tsx`) quedan aislados y son controlados mediante React.

## 💻 Instalación y Despliegue Local

Para correr este proyecto en tu entorno, sigue los siguientes pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd anime-info
    ```

2.  **Instala las dependencias:**
    ```bash
    pnpm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    pnpm run dev
    ```

4.  **Abre en tu navegador:**
    Navega hacia `http://localhost:4321` (el puerto de Astro por defecto) para ver la app en acción.

## 🌟 Lo que aprendí desarrollando este proyecto

Durante la creación de esta pieza de mi portafolio puse en práctica e interioricé conceptos como:
*   La correcta combinación de **Astro y React** para obtener lo mejor de dos mundos: velocidad inicial de SEO/estática más las experiencias ricas y fluidas de cliente.
*   Manejo de estado complejo en React utilizando contexto global y `useReducer` asegurados por la rigidez de **TypeScript**.
*   Patrones limpios de iteración visual e implementación de diseño estético utilizando colores modernos y micro-animaciones en TailwindCSS.

## 📞 Contacto

Si quieres conocer más sobre mi perfil o mis proyectos, encuéntrame en:

*   **🌐 Portafolio:** [Enlace a tu portafolio personal]
*   **💼 LinkedIn:** [Enlace a tu perfil]
*   **💻 GitHub:** [larry-ceballos](https://github.com/larry-ceballos)

---
*Desarrollado con pasión para mi portafolio. Los datos provienen de [Jikan.moe API](https://jikan.moe).*