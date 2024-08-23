import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../common.service';
import { TechnologyComponent } from '../components/technology/technology.component';
import { CertificationComponent } from '../components/certification/certification.component';
import { HttpClient } from '@angular/common/http';

interface Technology {
    iconClass: string;
    label: string;
    description: string;
}

interface Certification {
    imgPath: string;
    label: string;
    link: string;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, TechnologyComponent, CertificationComponent],
    templateUrl: './home.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    // Objets génériques pour stocker les états et les méthodes liés aux technos et certifs
    elementsConfig = {
        technos: {
            items: [] as Technology[],
            visibleItems: [] as Technology[],
            currentPage: 0,
            itemsPerPage: 6,
            swipeLeftOut: false,
            swipeRightOut: false,
            swipeLeftIn: false,
            swipeRightIn: false,
            isTransitioning: false
        },
        certifs: {
            items: [] as Certification[],
            visibleItems: [] as Certification[],
            currentPage: 0,
            itemsPerPage: 3,
            swipeLeftOut: false,
            swipeRightOut: false,
            swipeLeftIn: false,
            swipeRightIn: false,
            isTransitioning: false
        }
    };

    ngOnInit() {
        this.loadAssets('technos');
        this.loadAssets('certifs');
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
    * Charge les données à partir du fichier JSON pour le type spécifié.
    * @param type - Le type d'éléments à charger ("technos" ou "certifs").
    */
    loadAssets(type: 'technos' | 'certifs'): void {
        const filePath = type === 'technos' ? '../../assets/data/technos.json' : '../../assets/data/certifs.json';
        this.http.get<any>(filePath).subscribe(data => {
            this.elementsConfig[type].items = data[type];
            this.updateVisibleElements(type);
        });
    }

    /**
     * Met à jour la liste des éléments visibles en fonction de la page actuelle.
     * @param type - Le type d'éléments à mettre à jour ("technos" ou "certifs").
     */
    updateVisibleElements(type: 'technos' | 'certifs'): void {
        const config = this.elementsConfig[type];
        const startIndex = config.currentPage * config.itemsPerPage;
        config.visibleItems = config.items.slice(startIndex, startIndex + config.itemsPerPage);
    }

    /**
     * Passe à la page suivante d'éléments (icônes ou images).
     * @param type - Le type d'éléments pour lequel passer à la page suivante ("technos" ou "certifs").
     */
    nextPage(type: 'technos' | 'certifs'): void {
        const config = this.elementsConfig[type];
        if (!config.isTransitioning && (config.currentPage + 1) * config.itemsPerPage < config.items.length) {
            config.isTransitioning = true;
            config.swipeLeftOut = true;

            setTimeout(() => {
                config.currentPage++;
                this.updateVisibleElements(type);
                config.swipeLeftOut = false;
                config.swipeLeftIn = true;

                setTimeout(() => {
                    config.swipeLeftIn = false;
                    config.isTransitioning = false;
                }, 125); // Durée de l'animation d'entrée
            }, 125); // Durée de l'animation de sortie
        }
    }

    /**
     * Retourne à la page précédente d'éléments (icônes ou images).
     * @param type - Le type d'éléments pour lequel retourner à la page précédente ("technos" ou "certifs").
     */
    prevPage(type: 'technos' | 'certifs'): void {
        const config = this.elementsConfig[type];
        if (!config.isTransitioning && config.currentPage > 0) {
            config.isTransitioning = true;
            config.swipeRightOut = true;

            setTimeout(() => {
                config.currentPage--;
                this.updateVisibleElements(type);
                config.swipeRightOut = false;
                config.swipeRightIn = true;

                setTimeout(() => {
                    config.swipeRightIn = false;
                    config.isTransitioning = false;
                }, 125); // Durée de l'animation d'entrée
            }, 125); // Durée de l'animation de sortie
        }
    }
}
