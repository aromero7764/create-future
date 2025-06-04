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
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      await this.waitForImageLoad();

      this.initParallaxAnimation(gsap);
      this.initTextAnimations(gsap);
      this.initBackgroundParallax(gsap);
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
        filter: 'blur(2px)',
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
        '<'
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

  private initTextAnimations(gsap: any) {
    gsap.utils.toArray('.gradient-content').forEach((content: any) => {
      const elements = content.querySelectorAll('h2, p');

      // Entrada de los textos
      gsap.from(elements, {
        scrollTrigger: {
          trigger: content,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
      });
    });
  }

  private initBackgroundParallax(gsap: any) {
    gsap.utils
      .toArray('.gradient-purple, .gradient-blue')
      .forEach((section: any) => {
        gsap.to(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          backgroundPosition: '100% 50%',
          ease: 'none',
        });
      });
  }
}
