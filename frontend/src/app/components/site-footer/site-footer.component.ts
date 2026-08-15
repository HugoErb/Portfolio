import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-site-footer',
    imports: [],
    templateUrl: './site-footer.component.html',
})
export class SiteFooterComponent implements OnDestroy {
    emailCopied = false;
    private emailCopyFeedbackTimeout?: ReturnType<typeof setTimeout>;

    constructor(
        private readonly router: Router,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnDestroy(): void {
        clearTimeout(this.emailCopyFeedbackTimeout);
    }

    navigateToSection(event: MouseEvent, sectionId: string): void {
        event.preventDefault();

        if (this.router.url.startsWith('/home')) {
            this.scrollToSection(sectionId);
            return;
        }

        this.router.navigate(['/home', { redirectionSection: sectionId }]);
    }

    async copyEmail(): Promise<void> {
        try {
            await navigator.clipboard.writeText('eribon.hugo@gmail.com');
            this.emailCopied = true;
            this.changeDetectorRef.markForCheck();

            clearTimeout(this.emailCopyFeedbackTimeout);
            this.emailCopyFeedbackTimeout = setTimeout(() => {
                this.emailCopied = false;
                this.changeDetectorRef.markForCheck();
            }, 2000);
        } catch {
            this.emailCopied = false;
        }
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
