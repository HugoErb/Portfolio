import { ChangeDetectorRef, Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../common.service';
import { TechnologyComponent } from '../components/technology/technology.component';
import { CertificationComponent } from '../components/certification/certification.component';
import { ProjectComponent } from '../components/project/project.component';
import { HttpClient } from '@angular/common/http';
import { PageNavigationButtonComponent } from '../components/page-navigation-button/page-navigation-button.component';
import { SvgPageNavigationButtonComponent } from '../components/svg-page-navigation-button/svg-page-navigation-button.component';

interface Technology {
    iconClass: string;
    label: string;
    description: string;
}

interface Certification {
    imgPath: string;
    srcSet?: string;
    label: string;
    link: string;
}

interface Project {
    imgPath: string;
    srcSet?: string;
    name: string;
    description: string;
    link: string;
}

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        TechnologyComponent,
        CertificationComponent,
        ProjectComponent,
        PageNavigationButtonComponent,
        SvgPageNavigationButtonComponent,
    ],
    templateUrl: './home.component.html'
})
export class HomeComponent {
	private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	constructor(
		private activatedRoute: ActivatedRoute,
		private http: HttpClient,
		private changeDetectorRef: ChangeDetectorRef,
		protected commonService: CommonService,
	) {}

	yearsExperience: number = 4;

	// Objets génériques pour stocker les états et les méthodes liés aux technos, aux certifs et aux projets
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
			isTransitioning: false,
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
			isTransitioning: false,
		},
		projects: {
			items: [] as Project[],
			visibleItems: [] as Project[],
			currentPage: 0,
			itemsPerPage: 4,
			swipeLeftOut: false,
			swipeRightOut: false,
			swipeLeftIn: false,
			swipeRightIn: false,
			isTransitioning: false,
		},
	};

	ngOnInit() {
		this.yearsExperience = this.calculateExperience();

		if (this.isBrowser) {
			this.loadAssets('projects');
			this.loadAssets('technos');
			this.loadAssets('certifs');
			this.updateItemsPerPage();

			if (this.activatedRoute.snapshot.params.hasOwnProperty('redirectionSection')) {
				this.scrollToSection(this.activatedRoute.snapshot.params['redirectionSection']);
			}
		}
	}

	/**
	 * Écoute les événements de redimensionnement de la fenêtre et ajuste
	 * dynamiquement le nombre d'éléments par page pour les projets en fonction
	 * de la taille de l'écran.
	 *
	 * @param event - L'événement de redimensionnement de la fenêtre.
	 */
	@HostListener('window:resize')
	onResize() {
		this.updateItemsPerPage();
	}

	/**
	 * Met à jour la propriété `itemsPerPage` pour les projets en fonction de la
	 * largeur actuelle de l'écran. Si la largeur de la fenêtre est inférieure
	 * ou égale à 1280 pixels (seuil mobile), `itemsPerPage` est réduit à 2.
	 * Au-delà de cette largeur, `itemsPerPage` est défini sur 4.
	 */
	updateItemsPerPage() {
		const screenWidth = window.innerWidth;
		if (screenWidth <= 1280) {
			this.elementsConfig.projects.itemsPerPage = 2;
			this.updateVisibleElements('projects');
		} else {
			this.elementsConfig.projects.itemsPerPage = 4;
			this.updateVisibleElements('projects');
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
		setTimeout(() => {
			const section = document.getElementById(sectionId);
			if (section) {
				const sectionTop = section.getBoundingClientRect().top + window.scrollY;
				const headerHeight = 64;
				const position = sectionTop - headerHeight;
				const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
				window.scrollTo({ top: position, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
			}
		}, 50);
	}

	/**
	 * Charge toutes les données d'un fichier JSON et les stocke dans `elementsConfig[type].items`.
	 * @param type - Le type d'éléments à charger ("technos", "certifs" ou "projects").
	 */
	loadAssets(type: 'technos' | 'certifs' | 'projects'): void {
		const filePath = {
			technos: '../../assets/data/technos.json',
			certifs: '../../assets/data/certifs.json',
			projects: '../../assets/data/projects.json',
		}[type];

		this.http.get<any>(filePath).subscribe({
			next: (data) => {
				this.elementsConfig[type].items = data[type];
				this.updateVisibleElements(type);
				this.changeDetectorRef.markForCheck();
			},
			error: (err) => console.error(`Erreur lors du chargement de ${type} :`, err),
		});
	}

	/**
	 * Met à jour les éléments visibles pour la ressource donnée.
	 * @param resourceType - Le type de ressource pour lequel mettre à jour les éléments visibles.
	 */
	updateVisibleElements(resourceType: 'projects' | 'technos' | 'certifs') {
		const config = this.elementsConfig[resourceType];
		const startIndex = config.currentPage * config.itemsPerPage;
		config.visibleItems = config.items.slice(startIndex, startIndex + config.itemsPerPage);
	}

	/**
	 * Passe à la page suivante d'éléments (icônes ou images).
	 * @param type - Le type d'éléments pour lequel passer à la page suivante ("technos", "certifs" ou "projects").
	 */
	nextPage(type: 'technos' | 'certifs' | 'projects' = 'projects'): void {
		const config = this.elementsConfig[type];
		if (!config.isTransitioning && (config.currentPage + 1) * config.itemsPerPage < config.items.length) {
			config.isTransitioning = true;
			config.swipeLeftOut = true;

			setTimeout(() => {
				config.currentPage++;
				this.updateVisibleElements(type);
				config.swipeLeftOut = false;
				config.swipeLeftIn = true;
				this.changeDetectorRef.markForCheck();

				setTimeout(() => {
					config.swipeLeftIn = false;
					config.isTransitioning = false;
					this.changeDetectorRef.markForCheck();
				}, 125); // Durée de l'animation d'entrée
			}, 125); // Durée de l'animation de sortie
		}
	}

	/**
	 * Retourne à la page précédente d'éléments (icônes ou images).
	 * @param type - Le type d'éléments pour lequel retourner à la page précédente ("technos", "certifs" ou "projects").
	 */
	prevPage(type: 'technos' | 'certifs' | 'projects' = 'projects'): void {
		const config = this.elementsConfig[type];
		if (!config.isTransitioning && config.currentPage > 0) {
			config.isTransitioning = true;
			config.swipeRightOut = true;

			setTimeout(() => {
				config.currentPage--;
				this.updateVisibleElements(type);
				config.swipeRightOut = false;
				config.swipeRightIn = true;
				this.changeDetectorRef.markForCheck();

				setTimeout(() => {
					config.swipeRightIn = false;
					config.isTransitioning = false;
					this.changeDetectorRef.markForCheck();
				}, 125); // Durée de l'animation d'entrée
			}, 125); // Durée de l'animation de sortie
		}
	}

	/**
	 * Calcule dynamiquement le nombre d'années d'expérience professionnelle
	 * depuis le début de carrière (février 2022).
	 *
	 * @returns {number} Nombre d'années complètes d'expérience
	 */
	private calculateExperience(): number {
		const start = new Date(2022, 1); // février 2022
		const now = new Date();

		let years = now.getFullYear() - start.getFullYear();
		const monthDiff = now.getMonth() - start.getMonth();

		if (monthDiff < 0) {
			years--;
		}

		return years;
	}
}
