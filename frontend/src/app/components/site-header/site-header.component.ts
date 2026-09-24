import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
    selector: 'app-site-header',
    imports: [],
    templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent {
    burgerMenuOpened = false;

    @ViewChild('menuBurger') menuBurger?: ElementRef<HTMLElement>;

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

    toggleBurgerMenu(event: MouseEvent): void {
        event.stopPropagation();
        this.burgerMenuOpened = !this.burgerMenuOpened;
    }
}
