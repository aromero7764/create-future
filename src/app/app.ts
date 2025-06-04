import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Carga dinámica de GSAP para SSR
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Esperar a que la imagen cargue
      await this.waitForImageLoad();

      this.initParallaxAnimation(gsap);
    }
  }

  private waitForImageLoad(): Promise<void> {
    return new Promise((resolve) => {
      const img = document.querySelector(
        '.image-container img'
      ) as HTMLImageElement;
      if (img.complete) {
        resolve();
      } else {
        img.addEventListener('load', () => resolve());
      }
    });
  }

  private initParallaxAnimation(gsap: any) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.wrapper',
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      })
      .to('.image-container img', {
        scale: 2,
        z: 350,
        transformOrigin: 'center center',
        ease: 'power1.inOut',
      })
      .to(
        '.section.hero',
        {
          scale: 1.1,
          transformOrigin: 'center center',
          ease: 'power1.inOut',
        },
        '<' // Mismo tiempo que la animación anterior
      )
      .to(
        '.gradient-purple',
        {
          opacity: 1,
          duration: 0.5,
        },
        '>0.5'
      );
  }
}
