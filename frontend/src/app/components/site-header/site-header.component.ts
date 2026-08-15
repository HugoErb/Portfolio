import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-site-header',
    imports: [],
    templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent {
    burgerMenuOpened = false;

    @ViewChild('menuBurger') menuBurger?: ElementRef<HTMLElement>;

    constructor(private readonly router: Router) {}

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent): void {
        if (this.burgerMenuOpened && !this.menuBurger?.nativeElement.contains(event.target as Node)) {
            this.burgerMenuOpened = false;
        }
    }

    @HostListener('document:keydown.escape')
    onEscapeKey(): void {
        this.burgerMenuOpened = false;
    }

    navigateToSection(sectionId: string): void {
        this.burgerMenuOpened = false;

        if (this.router.url.startsWith('/home')) {
            this.scrollToSection(sectionId);
            return;
        }

        this.router.navigate(['/home', { redirectionSection: sectionId }]);
    }

    toggleBurgerMenu(event: MouseEvent): void {
        event.stopPropagation();
        this.burgerMenuOpened = !this.burgerMenuOpened;
    }

    private scrollToSection(sectionId: string): void {
        const section = document.getElementById(sectionId);
        if (!section) {
            return;
        }

        const headerHeight = 64;
        const position = section.getBoundingClientRect().top + window.scrollY - headerHeight;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: position, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
}
