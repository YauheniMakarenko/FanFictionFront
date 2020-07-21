import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorSchemeService {

  private renderer: Renderer2;
  private colorScheme: string;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }


  setColorScheme(scheme) {
    this.colorScheme = scheme;
    // Save prefers-color-scheme to localStorage
    localStorage.setItem('prefers-color', scheme);
  }

  getColorScheme() {
    // Check if any prefers-color-scheme is stored in localStorage
    if (localStorage.getItem('prefers-color')) {
      // Save prefers-color-scheme from localStorage
      this.colorScheme = localStorage.getItem('prefers-color');
    }
  }

  load() {
    this.getColorScheme();
    this.renderer.addClass(document.body, this.colorScheme);
  }

  update(scheme) {
    this.setColorScheme(scheme);
    // Remove the old color-scheme class
    this.renderer.removeClass( document.body, (this.colorScheme === 'dark' ? 'light' : 'dark') );
    // Add the new / current color-scheme class
    this.renderer.addClass(document.body, scheme);
  }
}
