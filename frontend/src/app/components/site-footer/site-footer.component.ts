import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-site-footer',
    imports: [],
    templateUrl: './site-footer.component.html',
})
export class SiteFooterComponent implements OnDestroy {
    emailCopied = false;
    private emailCopyFeedbackTimeout?: ReturnType<typeof setTimeout>;

    constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

    ngOnDestroy(): void {
        clearTimeout(this.emailCopyFeedbackTimeout);
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
}
