import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../common.service';
import { IconCardComponent } from '../components/icon-card/icon-card.component';
import { HttpClient } from '@angular/common/http';

interface Icon {
    iconClass: string;
    label: string;
    isSvg: boolean;
    viewBox: string;
    path: string;
    description: string;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, IconCardComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    constructor(private router: Router, private http: HttpClient, protected commonService: CommonService) { }

    burgerMenuOpened: boolean = false;

    // Variables pour le mail
    @ViewChildren('inputField') inputFields!: QueryList<ElementRef>;
    public inputLabelMap = new Map<string, string>();
    nameMail: string = "";
    emailMail: string = "";
    phoneNumberMail: string = "";
    messageMail: string = "";

    // Icônes de la partie "technologies"
    icons: Icon[] = [];
    visibleIcons: Icon[] = [];
    currentPage = 0;
    iconsPerPage = 6;
    swipeLeft = false;
    swipeRight = false;

    ngOnInit() {
        this.loadIcons();
    }

    /**
    * Navigue vers un composant spécifié.
    *
    * @param {string} composant - Le nom du composant vers lequel naviguer. Cela doit être le chemin ou
    *                             la route associée au composant cible dans la configuration de routage Angular.
    */
    navigateTo(component: string) {
        this.router.navigate([component]).then(() => {
            window.scrollTo(0, 0);
        });
    }

    /**
    * Gère les clics à l'extérieur du menu burger pour fermer le menu.
    * 
    * Cette méthode est déclenchée par un écouteur d'événements qui surveille tous les clics dans le document.
    * Si le menu burger est ouvert et que le clic n'est pas dans le menu burger,
    * alors le menu sera fermé. Ceci est vérifié en utilisant la méthode `contains` sur l'élément natif du menu burger.
    * 
    * @param event L'objet MouseEvent associé au clic du document.
    */
    @ViewChild('menuContainerRef') menuContainerRef!: ElementRef;
    @ViewChild('menuBurger') menuBurger!: ElementRef;
    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
        if (this.burgerMenuOpened && !this.menuBurger.nativeElement.contains(event.target)) {
            this.burgerMenuOpened = false;
        }
    }

    /**
    * Permet la navigation vers différentes sections de la page en utilisant un défilement fluide.
    * Si le menu burger est ouvert, il est d'abord fermé avant de procéder au défilement.
    * La méthode recherche l'élément de section par son identifiant. Si l'élément est trouvé, elle calcule la position de l'élément
    * en tenant compte de la hauteur fixe de l'en-tête et déplace le défilement à cette position avec un comportement fluide.
    *
    * @param sectionId L'identifiant de l'élément HTML vers lequel défiler.
    */
    scrollToSection(sectionId: string): void {
        if (this.burgerMenuOpened) {
            this.burgerMenuOpened = !this.burgerMenuOpened;
        }

        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                const headerHeight = 64;
                const position = sectionTop - headerHeight;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        }, 50);
    }

    /**
    * Sert à ouvrir ou fermer le menu burger en inversant l'état actuel du menu. 
    * Elle arrête également la propagation de l'événement de clic pour éviter des interactions indésirables avec d'autres éléments de l'interface utilisateur.
    * 
    * @param {MouseEvent} event - L'événement de clic qui a déclenché l'appel de la méthode. Utilisé pour arrêter la propagation de l'événement.
    */
    toggleBurgerMenu(event: MouseEvent): void {
        event.stopPropagation();
        this.burgerMenuOpened = !this.burgerMenuOpened;
    }

    /**
    * Prépare et envoie un email en utilisant le service commun.
    * Si l'envoi de l'email réussit, on réinitialise les champs de saisie.
    *
    * @returns {Promise<void>} Une promesse qui se résout une fois que l'email a été envoyé et que les 
    * champs de saisie ont été réinitialisés en cas de succès.
    */
    async sendMail(): Promise<void> {
        this.getDataIntoDictionary();
        if (await this.commonService.sendMail(this.inputLabelMap, false)) {
            this.resetInputFields();
        }
    }

    /**
    * Parcourt les champs de saisie dans le HTML et mappe leurs valeurs à leurs labels correspondants.
    * La méthode utilise `inputFields` pour obtenir une liste des éléments de saisie. Pour chaque champ de saisie, elle récupère
    * le label associé en utilisant son attribut 'id'. Si un label est trouvé pour une valeur de champ, la méthode les mappent dans `inputLabelMap`.
    */
    private getDataIntoDictionary() {
        this.inputFields.forEach(input => {
            const label = document.querySelector(`label[for="${input.nativeElement.id}"]`);
            if (label) {
                this.inputLabelMap.set(label.textContent!.trim(), input.nativeElement.value);
            }
        });
    }

    /**
    * Réinitialise les valeurs de tous les champs de saisie marqués avec la directive locale #inputField.
    * En l'occurence, la méthode permet de réinitialiser la valeur des champs de l'envoi de mail.
    */
    resetInputFields() {
        this.inputFields.forEach(field => {
            if (field.nativeElement instanceof HTMLInputElement || field.nativeElement instanceof HTMLTextAreaElement) {
                field.nativeElement.value = '';
            }
        });
    }

    /**
    * Charge les icônes à partir du fichier JSON.
    * 
    * Cette méthode récupère les données des icônes depuis un fichier JSON local
    * situé dans le dossier `assets`. Une fois les données chargées, elle les assigne
    * à la variable `icons` et initialise l'affichage des icônes visibles.
    */
    loadIcons(): void {
        this.http.get<any>('../../assets/data/technoIcons.json').subscribe(data => {
            this.icons = data.icons;
            this.updateVisibleIcons();
        });
    }

    /**
    * Met à jour la liste des icônes visibles en fonction de la page actuelle.
    * Cette méthode calcule les icônes à afficher pour la page en cours
    * en utilisant l'index de début basé sur `currentPage` et `iconsPerPage`.
    */
    updateVisibleIcons(): void {
        const startIndex = this.currentPage * this.iconsPerPage;
        this.visibleIcons = this.icons.slice(startIndex, startIndex + this.iconsPerPage);
    }

    nextPage(): void {
        /**
         * Passe à la page suivante d'icônes. Applique l'animation `swipeLeft` avant de mettre à jour
         * la liste des icônes visibles.
         * L'animation dure 300 ms avant que la page ne soit réellement changée.
         */
        if ((this.currentPage + 1) * this.iconsPerPage < this.icons.length) {
            this.swipeLeft = true;
            setTimeout(() => {
                this.currentPage++;
                this.updateVisibleIcons();
                this.resetAnimations();
            }, 500); // La durée de l'animation doit correspondre à celle définie dans Tailwind CSS
        }
    }

    prevPage(): void {
        /**
         * Retourne à la page précédente d'icônes. Applique l'animation `swipeRight` avant de mettre à jour
         * la liste des icônes visibles.
         * L'animation dure 300 ms avant que la page ne soit réellement changée.
         */
        if (this.currentPage > 0) {
            this.swipeRight = true;
            setTimeout(() => {
                this.currentPage--;
                this.updateVisibleIcons();
                this.resetAnimations();
            }, 500); // La durée de l'animation doit correspondre à celle définie dans Tailwind CSS
        }
    }

    /**
    * Réinitialise les animations en mettant les booléens `swipeLeft` et `swipeRight` à `false`.
    * Cela permet de réappliquer les animations lors du prochain changement de page.
    */
    resetAnimations(): void {
        this.swipeLeft = false;
        this.swipeRight = false;
    }
}
