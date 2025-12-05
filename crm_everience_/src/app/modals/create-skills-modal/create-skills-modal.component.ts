import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeesService } from '../../services/crm/employees.service';
//import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Definizione del tipo per le aree
type AreaType = 'sviluppatore' | 'help desk' | 'sistemista' | 'network';

@Component({
  selector: 'app-create-skills-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './create-skills-modal.component.html',
  styleUrl: './create-skills-modal.component.scss',
})
export class CreateSkillsModalComponent {
  @Input() employee: any;
  @Output() skillsCreated = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  newSkills: any = {
    skills: '',
    skills_valuation: '',
    area: '',
    customSkill: '',
    showCustomInput: false,
    isLocked: false,
  };

  // AGGIUNTO: Variabili separate per la sezione lingua (solo per visualizzazione)

  selectedLanguage = '';
  languageValuation = '';

  // var per gestire il campo personalizzato
  customSkill = '';
  showCustomInput = false;

  // var per accumulare le skills
  skillsList: any[] = [];
  addMoreSkills = false;

  // var per lingua diversa
  customLanguage = '';
  showCustomLanguageInput = false;

  singleSkill: boolean = true;

  //var che indica se la modalità multipla è attiva
  isMultipleMode = false;
  hasAddedFirstSkill = false;

  skillExists: boolean = false;

  dataSource = this.newSkills;

  // filtro per skills con tipizzazione corretta
  skillsByArea: Record<AreaType, { value: string; label: string }[]> = {
    sviluppatore: [
      { value: 'java', label: 'java' },
      { value: 'javascript', label: 'javascript' },
      { value: 'python', label: 'python' },
      { value: 'nodejs', label: 'node.js' },
      { value: 'php', label: 'php' },
      { value: 'csharp', label: 'c#' },
      { value: 'sql', label: 'sql' },
      { value: 'html css', label: 'html&css' },
      { value: 'react', label: 'react' },
      { value: 'angular', label: 'angular' },
      { value: 'bootstrap', label: 'bootstrap' },
      { value: 'comunicazione efficace', label: 'comunicazione efficace' },
      { value: 'lavoro squadra', label: 'lavoro di squadra' },
      { value: 'problem solving', label: 'problem solving' },
      { value: 'adattabilita', label: 'adattabilità' },
      { value: 'proattivita', label: 'proattività' },
    ],
    'help desk': [
      { value: 'microsoft_office_365', label: 'microsoft office 365' },
      { value: 'power platform', label: 'power platform' },
      { value: 'power_bi', label: 'power bi' },
      { value: 'itsm', label: 'it service management tool (itsm)' },
      { value: 'active directory', label: 'active directory (ad)' },
      { value: 'mdm', label: 'mobile device management (mdm)' },
      { value: 'troubleshooting hardware', label: 'troubleshooting hardware' },
      { value: 'troubleshooting software', label: 'troubleshooting software' },
      { value: 'comunicazione efficace', label: 'comunicazione efficace' },
      { value: 'lavoro squadra', label: 'lavoro di squadra' },
      { value: 'problem solving', label: 'problem solving' },
      { value: 'adattabilita', label: 'adattabilità' },
      { value: 'proattivita', label: 'proattività' },
    ],
    sistemista: [
      { value: 'linux', label: 'linux' },
      { value: 'storage', label: 'storage' },
      { value: 'virtualizzazione', label: 'virtualizzazione' },
      { value: 'monitoring', label: 'monitoring' },
      { value: 'security', label: 'security' },
      { value: 'cloud', label: 'cloud' },
      { value: 'active directory', label: 'active directory (ad)' },
      { value: 'troubleshooting_hardware', label: 'troubleshooting hardware' },
      { value: 'troubleshooting_software', label: 'troubleshooting software' },
      { value: 'comunicazione efficace', label: 'comunicazione efficace' },
      { value: 'lavoro squadra', label: 'lavoro di squadra' },
      { value: 'problem solving', label: 'problem solving' },
      { value: 'adattabilita', label: 'adattabilità' },
      { value: 'proattivita', label: 'proattività' },
    ],
    network: [
      { value: 'network di_base', label: 'network di base' },
      { value: 'switching route', label: 'switching route' },
      { value: 'firewall', label: 'firewall' },
      { value: 'monitoring', label: 'monitoring' },
      { value: 'security', label: 'security' },
      { value: 'troubleshooting hardware', label: 'troubleshooting hardware' },
      { value: 'comunicazione efficace', label: 'comunicazione efficace' },
      { value: 'lavoro squadra', label: 'lavoro di squadra' },
      { value: 'problem solving', label: 'problem solving' },
      { value: 'adattabilita', label: 'adattabilità' },
      { value: 'proattivita', label: 'proattività' },
    ],
  };

  listLanguage: string[] = [
    'afrikaans',
    'albanese',
    'amarico',
    'arabo',
    'armeno',
    'assamese',
    'azero',
    'basco',
    'bengalese',
    'birmano',
    'bosniaco',
    'bulgaro',
    'catalano',
    'ceco',
    'cinese (mandarino)',
    'coreano',
    'croato',
    'danese',
    'ebraico',
    'estone',
    'filippino',
    'finlandese',
    'francese',
    'georgiano',
    'greco',
    'gujarati',
    'hindi',
    'indonesiano',
    'islandese',
    'italiano',
    'giapponese',
    'kannada',
    'kazako',
    'khmer',
    'kirghiso',
    'lao',
    'lettone',
    'lituano',
    'macedone',
    'malayalam',
    'malese',
    'marathi',
    'moldavo',
    'mongolo',
    'nepalese',
    'norvegese',
    'olandese',
    'pashtu',
    'persiano',
    'polacco',
    'portoghese',
    'punjabi',
    'rumeno',
    'russo',
    'serbo',
    'singalese',
    'slovacco',
    'sloveno',
    'somalo',
    'spagnolo',
    'svedese',
    'swahili',
    'tagalog',
    'tamil',
    'tedesco',
    'telugu',
    'thai',
    'tibetano',
    'turco',
    'ucraino',
    'ungherese',
    'urdu',
    'uzbeco',
    'vietnamita',
    'zulu',
  ];

  filteredLanguages: string[] = [];
  typedLanguage: string = '';

  constructor(
    private employeeService: EmployeesService,
    private dialog: MatDialog
  ) {}

  //metodo per salvare una sola skills più controllo se la skills esiste già
  saveSingleSkill(): void {
    // Verifica prima che tutti i campi siano compilati
    if (
      !this.newSkills.area ||
      !this.newSkills.skills ||
      !this.newSkills.skills_valuation
    ) {
      alert('Inserire tutti i campi richiesti');
      return;
    }

    const skillToSave = {
      skills: this.newSkills.skills.toLowerCase(),
      skills_valuation: this.newSkills.skills_valuation,
      area: this.newSkills.area,
    };

    console.log('Tentativo di salvare skill:', skillToSave);

    // Verifica tramite API se la skill esiste già
    this.employeeService.getSkills(this.employee.id).subscribe({
      next: (existingSkills: any[]) => {
        console.log('Skills esistenti ricevute:', existingSkills);

        this.skillExists = existingSkills.some(
          (existingSkill) =>
            existingSkill.skills.toLowerCase() ===
            skillToSave.skills.toLowerCase()
        );

        if (!this.skillExists) {
          // Se non esiste, procedi con il salvataggio
          this.employeeService
            .postSkillsEployee(skillToSave, this.employee.id)
            .subscribe({
              next: (res: any) => {
                console.log('Skills inserita correttamente', res);
                this.skillsCreated.emit(skillToSave);
                this.closeModal();
              },
              error: (error: any) => {
                console.error('ERRORE nel salvataggio:', error);
                alert('Errore durante il salvataggio');
              },
            });
        } else {
          this.skillExists = true;
        }
      },
    });
  }

  closeModal() {
    const modal = document.querySelector('.modal-skills-container');
    modal?.classList.remove('active');
    this.resetForm();
    this.close.emit();
  }

  resetForm() {
    this.newSkills = {
      skills: '',
      skills_valuation: '',
      area: '',
    };
    // AGGIUNTO: Reset delle variabili per la lingua
    this.selectedLanguage = '';
    this.languageValuation = '';
    this.customSkill = '';
    this.showCustomInput = false;
    this.skillsList = [];
    this.addMoreSkills = false;
    this.customLanguage = '';
    this.showCustomLanguageInput = false;
  }

  // Restituisce le skills filtrate per l'area selezionata
  getFilteredSkills(): { value: string; label: string }[] {
    if (!this.newSkills.area) {
      return [];
    }
    return this.skillsByArea[this.newSkills.area as AreaType] || [];
  }

  // Si attiva quando cambia l'area selezionata
  onAreaChange(): void {
    // Reset della skill quando cambia l'area
    this.newSkills.skills = '';
    this.customSkill = '';
    this.showCustomInput = false;
  }

  // //  Si attiva quando l'utente finisce di digitare (clicca fuori dal campo)
  // onCustomLanguageFinish(): void {
  //   // Togli spazi vuoti dall'inizio e dalla fine
  //   if (this.customLanguage.trim() !== '') {
  //     // Se c'è del testo salva la lingua inserita
  //     this.selectedLanguage = this.customLanguage.trim();
  //   } else {
  //     this.selectedLanguage = '';
  //      // Nasconde l'input e rimostra la select
  //     this.showCustomLanguageInput = false;
  //   }

  // }

  // // Si attiva quando l'utente preme un tasto nell'input lingua
  // onLanguageKeyPress(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     // Salva subito la lingua
  //     this.onCustomLanguageFinish();
  //   }
  // }

  // metodo per gestire la skill personalizzata
  onSkillChange(): void {
    if (this.newSkills.skills === 'altro') {
      // nasconde la select e mostra l'input personalizzato
      this.showCustomInput = true;
      // pulisce il campo di input per una nuova digitazione
      this.customSkill = '';
      // Focus sull'input dopo che Angular ha aggiornato il DOM
      setTimeout(() => {
        const input = document.querySelector(
          '#customSkillInput'
        ) as HTMLInputElement;
        if (input) input.focus();
      }, 0);
    }
  }

  // si attiva quando l'utente finisce di digitare (clicca fuori dal campo)
  onCustomSkillFinish(): void {
    // togli spazi vuoti dall'inizio e dalla fine
    if (this.customSkill.trim() !== '') {
      // se c'è del testo salva la skills inserita
      this.newSkills.skills = this.customSkill.trim();
    } else {
      // se il campo è vuoto resetta
      this.newSkills.skills = '';
      // nasconde l'input e rimostra la select
      this.showCustomInput = false;
    }
  }

  // si attiva quando l'utente preme un tasto nell'input
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      // salva subito la skill
      this.onCustomSkillFinish();
    }
  }

  onCheckboxChange(event: any): void {
    const isChecked = event.target.checked;

    const skillToAdd = {
      skills: this.newSkills.skills.toLowerCase(),
      skills_valuation: this.newSkills.skills_valuation,
      area: this.newSkills.area,
    };

    if (isChecked) {
      // Verifica che i campi siano compilati
      // if (!this.newSkills.area || !this.newSkills.skills || !this.newSkills.skills_valuation) {
      //   this.isMultipleMode = true;
      //   alert('Inserire tutti i campi richiesti prima di spuntare la checkbox');
      //   event.target.checked = false;
      //   return;
      // }

      this.employeeService.getSkills(this.employee.id).subscribe({
        next: (existingSkills: any[]) => {
          console.log('Skills esistenti ricevute:', existingSkills);

          this.skillExists = existingSkills.some(
            (existingSkill) =>
              existingSkill.skills.toLowerCase() ===
              skillToAdd.skills.toLowerCase()
          );

          if (!this.skillExists) {
            // Se non esiste, procedi con il salvataggio
            // Aggiungi automaticamente la skill corrente alla lista
            this.skillsList.push(skillToAdd);
            this.hasAddedFirstSkill = true;
            this.singleSkill = false;
            this.isMultipleMode = true;

            console.log('Skill aggiunta automaticamente:', skillToAdd);
            console.log('Lista skills totale:', this.skillsList);

            // Reset dei campi per la prossima skill
            this.resetSkillFields();

            // Reset la checkbox per permettere di spuntarla di nuovo
            event.target.checked = false;
          } else {
            this.skillExists = true;
            // // Deseleziona la checkbox se la skill esiste già
            setTimeout(() => {
              event.target.checked = false;
              this.resetSkillFields();
            }, 1500);
          }
        },
      });

      // this.skillsList.push(skillToAdd);
      // this.hasAddedFirstSkill = true;
      // this.singleSkill = false;
      // this.isMultipleMode = true;

      // console.log('Skill aggiunta automaticamente:', skillToAdd);
      // console.log('Lista skills totale:', this.skillsList);

      // // Reset dei campi per la prossima skill
      //  this.resetSkillFields();

      // // Reset la checkbox per permettere di spuntarla di nuovo
      // event.target.checked = false;
    }
  }

  //  aggiungi skills alla lista prima di salvare
  addSkillToList(): void {
    // Determina quale sezione stiamo aggiungendo
    const isSkillSection =
      this.newSkills.skills &&
      this.newSkills.skills_valuation &&
      this.newSkills.area;
    this.singleSkill = false;

    if (!isSkillSection) {
      alert('inserire tutti i campi richiesti per la skill');
      return;
    }

    let skillToAdd;

    skillToAdd = {
      skills: this.newSkills.skills.toLowerCase(),
      skills_valuation: this.newSkills.skills_valuation,
      area: this.newSkills.area,
    };

    this.skillsList.push(skillToAdd);
    // Segna che è stata aggiunta la prima skill
    this.hasAddedFirstSkill = true;

    // Reset l'errore se c'era
    this.skillExists = false;

    console.log('Skill aggiunta alla lista:', skillToAdd);
    console.log('Lista skills:', this.skillsList);

    // Reset solo dei campi skill
    this.resetSkillFields();
  }

  // resetta campi di skills
  resetSkillFields(): void {
    this.newSkills.skills = '';
    this.newSkills.skills_valuation = '';
    this.selectedLanguage = '';
    this.languageValuation = '';
    this.customSkill = '';
    this.showCustomInput = false;
    this.customLanguage = '';
    this.showCustomLanguageInput = false;
    // this.isMultipleMode = false;
    // this.hasAddedFirstSkill = false;
    this.skillExists = false;
  }

  // Versione migliorata con ciclo for e async/await
  async saveMultipleSkills(): Promise<void> {
    const totalSkills = this.skillsList.length;
    const savedSkills: any[] = [];
    const errors: any[] = [];

    // Ciclo for sequenziale (una skill alla volta)
    for (let i = 0; i < totalSkills; i++) {
      try {
        console.log(`Salvo skill ${i + 1}/${totalSkills}:`, this.skillsList[i]);

        const result = await this.employeeService
          .postSkillsEployee(this.skillsList[i], this.employee.id)
          .toPromise();

        savedSkills.push(result);
        console.log(`✓ Skill ${i + 1}/${totalSkills} salvata con successo`);
      } catch (error) {
        console.error(
          `✗ Errore salvando skill ${i + 1}/${totalSkills}:`,
          error
        );
        errors.push({ index: i + 1, skill: this.skillsList[i], error });
      }
    }

    // Gestione finale dei risultati
    if (errors.length === 0) {
      console.log('✓ Tutte le skills salvate con successo!');
      this.skillsCreated.emit({
        skills: savedSkills,
        count: savedSkills.length,
        success: true,
      });
      this.closeModal();
    } else if (savedSkills.length > 0) {
      // Alcune skills salvate, alcune con errori
      console.warn(
        `⚠️ ${savedSkills.length}/${totalSkills} skills salvate. ${errors.length} errori.`
      );
      alert(
        `${savedSkills.length} skills salvate con successo. ${errors.length} skills non sono state salvate a causa di errori.`
      );
      this.skillsCreated.emit({
        skills: savedSkills,
        count: savedSkills.length,
        success: false,
        errors: errors.length,
      });
    } else {
      // Tutti errori
      console.error('✗ Nessuna skill è stata salvata');
      alert('Errore: nessuna skill è stata salvata. Riprova.');
    }
  }

  // // Verifica se la skill corrente è personalizzata (non nelle opzioni predefinite)
  // isCustomSkill(): boolean {
  //   if (!this.newSkills.skills || this.showCustomInput) {
  //     return false;
  //   }
  //   const filteredSkills = this.getFilteredSkills();
  //   return !filteredSkills.some(skill => skill.value === this.newSkills.skills) &&
  //          this.newSkills.skills !== 'altro';
  // }

  // Rimuovi skill dalla lista
  removeSkillFromList(index: number): void {
    this.skillsList.splice(index, 1);
    console.log('Skill rimossa. Lista aggiornata:', this.skillsList);
  }

  applyFilter(query: string): void {
    const normalized = query.trim().toLowerCase();
    this.filteredLanguages =
      normalized.length < 2
        ? []
        : this.listLanguage.filter((lang) =>
            lang.toLowerCase().includes(normalized)
          );
  }

  selectLanguage(lang: string): void {
    this.newSkills.skills = lang;
    this.typedLanguage = lang;
    this.filteredLanguages = []; // chiudi suggerimenti
  }

  onLanguageSelect(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectLanguage(selectedValue);
  }
}
