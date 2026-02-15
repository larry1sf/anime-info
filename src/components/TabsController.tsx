import { useState, useEffect } from "react";

type Section = "anime" | "top/anime" | "recommendations/anime";

interface TabButton {
  label: string;
  slug: Section;
}

/**
 * Componente controlador de pestañas
 * Maneja la navegación entre secciones de anime
 * Solo renderiza la navegación, el contenido está en componentes Astro
 */
export default function TabsController() {
  const optionButtons: TabButton[] = [
    { label: "anime series", slug: "anime" },
    { label: "top anime", slug: "top/anime" },
    { label: "recommendations", slug: "recommendations/anime" },
  ];

  const [activeSection, setActiveSection] = useState<Section>("anime");
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Maneja el cambio de pestaña
   * Incluye una pequeña animación de transición
   */
  const handleSectionChange = (slug: Section) => {
    if (slug === activeSection || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Pequeña demora para transición suave
    setTimeout(() => {
      setActiveSection(slug);
      setIsTransitioning(false);
    }, 150);
  };

  /**
   * Efecto para actualizar la visibilidad de las pestañas
   * Se ejecuta cada vez que cambia la pestaña activa
   */
  useEffect(() => {
    const updateTabVisibility = () => {
      const tabs = document.querySelectorAll('.tab-content');
      tabs.forEach((tab) => {
        const tabElement = tab as HTMLElement;
        const tabName = tabElement.getAttribute('data-tab');
        if (tabName === activeSection) {
          tabElement.classList.remove('hidden');
          tabElement.classList.add('animate-fade-in');
        } else {
          tabElement.classList.add('hidden');
          tabElement.classList.remove('animate-fade-in');
        }
      });
    };

    updateTabVisibility();
  }, [activeSection]);

  return (
    <nav className="flex justify-evenly my-8 py-4 mx-auto bg-primary rounded-full text-bg shadow-lg shadow-primary/20">
      {optionButtons.map(({ label, slug }) => {
        const isActive = activeSection === slug;
        return (
          <button
            key={slug}
            type="button"
            onClick={() => handleSectionChange(slug)}
            disabled={isTransitioning}
            className={`
              px-4 py-2 rounded-2xl transition-all duration-300 capitalize font-medium
              ${isActive 
                ? "bg-white text-primary scale-105 shadow-md" 
                : "hover:contrast-90 hover:scale-105"
              }
              ${isTransitioning ? "cursor-not-allowed opacity-70" : ""}
            `}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
