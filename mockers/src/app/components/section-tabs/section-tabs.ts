import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-section-tabs',
  imports: [],
  templateUrl: './section-tabs.html',
  styleUrl: './section-tabs.css'
})
export class SectionTabs {
  @Output() currentSection = new EventEmitter<string>();
  
  selectedSection: string = "Physics"

  ngOnInit() {;
    this.currentSection.emit(this.selectedSection);
    console.log("Selected section:", this.selectedSection);
  }

  onSectionChange(section: string) {
    this.selectedSection = section;
    this.currentSection.emit(this.selectedSection);
    console.log("Selected section:", this.selectedSection);
  }
}
