import { Injectable } from '@angular/core';
import { MailService } from './mail.service';
import type { SweetAlertOptions } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(private mailService: MailService) { }

    /**
    * Filtre et formate la saisie d'un numéro de téléphone dans un champ de saisie HTML.
    * Seules les valeurs numériques sont conservées, et un espace est ajouté tous les deux chiffres.
    * Limite la saisie à un maximum de 10 chiffres.
    * 
    * @param event L'événement d'entrée déclenché lors de la saisie dans le champ de saisie.
    *              L'événement doit être de type `Event`.
    */
    formatAndRestrictPhoneInput(event: Event): string {
        let input = event.target as HTMLInputElement;
        let value = input.value;
        let formattedValue = '';

        // Supprimer tout caractère non numérique et appliquer le formatage
        let numbers = value.replace(/\D/g, '');

        // Limiter à 10 chiffres
        numbers = numbers.slice(0, 10);

        // Ajouter des espaces tous les deux chiffres
        for (let i = 0; i < numbers.length; i++) {
            if (i !== 0 && i % 2 === 0) {
                formattedValue += ' ';
            }
            formattedValue += numbers[i];
        }

        // Mettre à jour la valeur du modèle et de l'input
        input.value = formattedValue;
        return formattedValue;
    }

   /**
   * Prépare et envoie un email à l'aide d'un service de messagerie. 
   * Avant l'envoi, on vérifie les entrées pour s'assurer qu'elles sont valides en utilisant la méthode `validateInputs`. 
   * Si les validations échouent, l'envoi est interrompu. Si les validations réussissent, les données sont envoyées au service de messagerie. 
   * Les réactions aux réponses du service de messagerie, qu'elles soient réussies ou en erreur, sont gérées via des alertes à l'utilisateur.
   */
    async sendMail(inputLabelMap: Map<string, string>): Promise<boolean> {

        // On vérifie les données
        const areInputsValid = await this.validateInputs(inputLabelMap);
        if (!areInputsValid) {
            return false;
        }

        const mailData = this.createMailData(inputLabelMap);

        return new Promise((resolve, reject) => {
            this.mailService.sendMail(mailData).subscribe({
                next: (response) => {
                    void this.showAlert({
                        position: 'top-end',
                        toast: true,
                        icon: 'success',
                        html: '<span class="font-medium text-xl">Message envoyé !</span>',
                        showConfirmButton: false,
                        width: 'auto',
                        timer: 3500
                    });
                    resolve(true);
                },
                error: (error) => {
                    void this.showAlert({
                        position: 'top-end',
                        toast: true,
                        icon: 'error',
                        html: '<span class="font-medium text-xl">Erreur lors de l\'envoi du message.</span>',
                        showConfirmButton: false,
                        width: 'auto',
                        timer: 3500
                    });
                    reject(false);
                }
            });
        });
    }


    /**
   * Vérifie que les champs remplis par l'utilisateur pour l'envoi dans le mail sont dans un format correct.
   * 
   * @returns {Promise<boolean>} Retourne une promesse avec `true` si toutes les validations sont passées, sinon `false`.
   */
    async validateInputs(inputLabelMap: Map<string, string>): Promise<boolean> {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const phoneNumberRegex = /^(0[1-9]) (\d{2}) (\d{2}) (\d{2}) (\d{2})$/;

        for (const [label, value] of inputLabelMap.entries()) {
            const trimmedValue = value.trim();
            const lowerCaseLabel = label.toLowerCase();

            // Vérification des champs obligatoires
            if (!trimmedValue) {
                if (lowerCaseLabel.includes('téléphone')) {
                    continue;
                }
                this.showValidationError(`Le champ "${label}" est obligatoire.`);
                return false;
            }

            // Vérifications pour l'email
            if (lowerCaseLabel.includes('email')) {
                if (!emailRegex.test(trimmedValue)) {
                    this.showValidationError('Le format de l\'adresse email est invalide.');
                    return false;
                }
            }
            // Vérification pour le numéro de téléphone
            else if (lowerCaseLabel.includes('téléphone')) {
                if (!phoneNumberRegex.test(trimmedValue)) {
                    this.showValidationError('Le format du numéro de téléphone est invalide.');
                    return false;
                }
            }
        }

        return true;
    }

    /**
    * Affiche une erreur de validation avec un message spécifique.
    * 
    * @param message Le message à afficher dans l'alerte.
    */
    private showValidationError(message: string): void {
        void this.showAlert({
            icon: 'error',
            title: 'Erreur de saisie',
            text: message,
            confirmButtonColor: "#3B82F6"
        });
    }

    private async showAlert(options: SweetAlertOptions): Promise<void> {
        const { default: Swal } = await import('sweetalert2');
        await Swal.fire(options);
    }

    /**
    * Crée un objet de données mail en mappant les labels des champs de saisie à leurs valeurs.
    *
    * @returns {any} L'objet `mailData` contenant les données des champs sous forme d'objets avec des clés appropriées.
    *                Les clés sont des versions normalisées des labels des champs, et les valeurs sont celles entrées par l'utilisateur.
    */
    public createMailData(inputLabelMap: Map<string, string>): any {
        const mailData: any = {};
        inputLabelMap.forEach((value, key) => {
            const objectKey = this.convertLabelToObjectKey(key);
            mailData[objectKey] = value;
        });
        return mailData;
    }

    /**
    * Convertit un label textuel en une clé d'objet utilisable.
    * Cette méthode normalise le label pour retirer les accents et autres signes diacritiques,
    * puis convertit le texte en minuscules et élimine les espaces blancs pour former une clé d'objet.
    *
    * @param {string} label - Le label textuel à convertir en clé d'objet.
    * @returns {string} La clé d'objet obtenue après la normalisation, le nettoyage des diacritiques,
    *                   la mise en minuscules et la suppression des espaces.
    */
    convertLabelToObjectKey(label: string): string {
        const normalizedLabel = label.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
        return normalizedLabel.toLowerCase().replace(/\s+/g, '');
    }


    /**
    * Affiche une modal spécifiée par son identifiant.
    * 
    * @param {string} id - L'identifiant de l'élément modal à afficher.
    */
    showModal(id: string) {
        const modal = document.getElementById(id) as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }
}
