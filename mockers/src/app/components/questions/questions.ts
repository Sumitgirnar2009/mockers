// questions.ts
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject, ViewChild, ElementRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuestionModel, QuestionData } from '../../models/question.model';
import { ModPipe } from '../../mod-pipe';
import { LatexPipe } from '../../pipes/latex-pipe';
import { Renderer2, HostListener } from '@angular/core';

declare var bootstrap: any;


@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [ModPipe, LatexPipe],
  templateUrl: './questions.html',
  styleUrl: './questions.css'
})
export class Questions implements OnInit, OnChanges {
  private sanitizer = inject(DomSanitizer);

  @Input() currentQuestionModel!: QuestionModel;
  @Input() currentQuestionData: QuestionData | null = null;
  @Input() attemptId!: string;
  @Input() quizId!: string;
  @Output() saveStatusAndNext = new EventEmitter<QuestionModel>();
  @Output() saveStatusAndPrev = new EventEmitter<number>();

  @ViewChild('imageModal') imageModal!: ElementRef;

  // Add to existing properties
zoomLevel: number = 1;
isDragging: boolean = false;
dragStartX: number = 0;
dragStartY: number = 0;
translateX: number = 0;
translateY: number = 0;
private dragListener: Function | null = null;
  
  selectedImage: string = '';
  private modalInstance: any;

  ngOnInit() {
    this.loadKatexStyles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentQuestionData'] && this.currentQuestionData) {
      // KaTeX will handle rendering automatically through our pipe
      // No need for manual rendering
    }
  }
  

  private loadKatexStyles() {
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }
  }

  /**
   * Open image in modal
   */
/**
 * Open image modal with zoom functionality
 */
openImageModal(imageSrc: string, event?: Event): void {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  
  this.selectedImage = imageSrc;
  this.zoomLevel = 1.2;
  this.translateX = 0;
  this.translateY = 0;
  
  if (!this.modalInstance && this.imageModal) {
    this.modalInstance = new bootstrap.Modal(this.imageModal.nativeElement);
  }
  
  if (this.modalInstance) {
    this.modalInstance.show();
    
    // Set up drag listeners
    setTimeout(() => this.setupDragListeners(), 100);
  }
}

/**
 * Zoom in functionality
 */
zoomIn(): void {
  this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3);
}

/**
 * Zoom out functionality
 */
zoomOut(): void {
  this.zoomLevel = Math.max(this.zoomLevel - 0.25, 0.5);
}

/**
 * Reset zoom
 */
resetZoom(): void {
  this.zoomLevel = 1.2;
  this.translateX = 0;
  this.translateY = 0;
}

/**
 * Handle mouse wheel zoom
 */
onImageWheel(event: WheelEvent): void {
  event.preventDefault();
  event.stopPropagation();
  
  const zoomFactor = 0.1;
  const delta = Math.sign(event.deltaY);
  
  if (delta < 0) {
    // Zoom in
    this.zoomLevel = Math.min(this.zoomLevel + zoomFactor, 3);
  } else {
    // Zoom out
    this.zoomLevel = Math.max(this.zoomLevel - zoomFactor, 0.5);
  }
}

/**
 * Start dragging image
 */
startDrag(event: MouseEvent): void {
  if (this.zoomLevel > 1) {
    this.isDragging = true;
    this.dragStartX = event.clientX - this.translateX;
    this.dragStartY = event.clientY - this.translateY;
    
    event.preventDefault();
    event.stopPropagation();
  }
}

/**
 * Setup drag listeners
 */
private setupDragListeners(): void {
  const modalElement = this.imageModal?.nativeElement;
  const imageElement = modalElement?.querySelector('.modal-img');
  
  if (!modalElement || !imageElement) return;
  
  // Clean up previous listeners
  if (this.dragListener) {
    this.dragListener();
  }
  
  const mouseMoveHandler = (event: MouseEvent) => {
    if (this.isDragging && this.zoomLevel > 1) {
      this.translateX = event.clientX - this.dragStartX;
      this.translateY = event.clientY - this.dragStartY;
      
      // Update image position
      imageElement.style.transform = `
        translate(${this.translateX}px, ${this.translateY}px)
        scale(${this.zoomLevel})
      `;
      
      event.preventDefault();
    }
  };
  
  const mouseUpHandler = () => {
    this.isDragging = false;
  };
  
  // Add new listeners
  modalElement.addEventListener('mousemove', mouseMoveHandler);
  modalElement.addEventListener('mouseup', mouseUpHandler);
  modalElement.addEventListener('mouseleave', mouseUpHandler);
  
  // Store cleanup function
  this.dragListener = () => {
    modalElement.removeEventListener('mousemove', mouseMoveHandler);
    modalElement.removeEventListener('mouseup', mouseUpHandler);
    modalElement.removeEventListener('mouseleave', mouseUpHandler);
  };
}

/**
 * Clean up on destroy
 */
ngOnDestroy(): void {
  if (this.dragListener) {
    this.dragListener();
  }
}
  /**
   * Safely gets text content, handling null/undefined values
   */
  getSafeText(text: string | null | undefined): string {
    return text ?? '';
  }
  

  /**
   * Sanitizes HTML content for safe rendering
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * Marks the current question for review and moves to next
   */
  markForReviewAndNext(): void {
    if (!this.currentQuestionModel) return;

    this.updateQuestionState({
      IsMarkedForReview: true,
      IsSaved: false,
      IsAnswered: this.currentQuestionModel.selectedOption !== -1
    });
    
    this.saveStatusAndNext.emit(this.currentQuestionModel);
  }

  /**
   * Saves the current answer and moves to next question
   */
  saveAndNext(): void {
    if (!this.currentQuestionModel) return;

    const isAnswered = this.currentQuestionModel.selectedOption !== -1;
    
    this.updateQuestionState({
      IsVisited: true,
      IsSaved: isAnswered,
      IsMarkedForReview: false,
      IsAnswered: isAnswered
    });

    // Only mark as saved if actually answered
    if (!isAnswered) {
      this.currentQuestionModel.IsSaved = false;
      this.currentQuestionModel.IsMarkedForReview = false;
    }

    this.saveStatusAndNext.emit(this.currentQuestionModel);
  }

  /**
   * Moves to previous question
   */
  previous(): void {
    if (this.currentQuestionModel) {
      this.saveStatusAndPrev.emit(this.currentQuestionModel.questionId);
    }
  }

  // Add this method to your Questions class
getOptionLetter(index: number): string {
  return String.fromCharCode(65 + index); // A, B, C, D, etc.
}

// Also add this method to handle loading states if needed
isLoading(): boolean {
  return !this.currentQuestionData;
}
  /**
   * Handles option selection
   */
  onOptionSelect(optionIndex: number): void {
    if (this.currentQuestionModel) {
      this.currentQuestionModel.selectedOption = optionIndex + 1;
    }
  }
  

  /**
   * Clears the current selection
   */
  clearSelection(): void {
    if (this.currentQuestionModel) {
      this.currentQuestionModel.selectedOption = -1;
    }
  }

  /**
   * Helper method to update question state
   */
  private updateQuestionState(state: Partial<QuestionModel>): void {
    Object.assign(this.currentQuestionModel, state);
    this.currentQuestionModel.attemptId = this.attemptId;
  }

  /**
   * Check if an option is currently selected
   */
  isOptionSelected(optionIndex: number): boolean {
    return this.currentQuestionModel?.selectedOption === optionIndex + 1;
  }
}