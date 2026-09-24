import { DOCUMENT } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';


@Component({
    selector: 'app-legal-information',
    imports: [],
    templateUrl: './legal-information.component.html'
})
export class LegalInformationComponent implements OnInit {

    private readonly document = inject(DOCUMENT);
    private readonly meta = inject(Meta);
    private readonly title = inject(Title);

    constructor(private readonly activatedRoute: ActivatedRoute) {}

    protected readonly personalDataOpened = this.activatedRoute.snapshot.fragment === 'personal-data';

    ngOnInit(): void {
        const pageTitle = 'Mentions légales | Hugo Eribon';
        const description = 'Mentions légales et informations relatives au traitement des données du portfolio de Hugo Eribon.';
        const url = 'https://hugoeribon.fr/legal-information';

        this.title.setTitle(pageTitle);
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:title', content: pageTitle });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);
    }
}
