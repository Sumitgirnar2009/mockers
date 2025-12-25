// latex.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import * as katex from 'katex';

@Pipe({
  name: 'latex',
  standalone: true
})
export class LatexPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    // Handle null/undefined values
    if (!value) return '';
    
    // Trim the value
    const trimmedValue = value.trim();
    
    // Check if the entire string is a LaTeX expression (starts and ends with $)
    if (this.isPureLatex(trimmedValue)) {
      return this.renderPureLatex(trimmedValue);
    }
    
    // Check if the string contains LaTeX patterns
    if (this.containsLatex(trimmedValue)) {
      return this.renderMixedContent(trimmedValue);
    }
    
    // Return plain text as is (with HTML escaping for safety)
    return this.escapeHtml(trimmedValue);
  }

  private isPureLatex(text: string): boolean {
    // Check if the entire string is wrapped in $...$ or $$...$$
    return (/^\$[^$].*[^$]\$$/.test(text) || /^\$\$.*\$\$$/.test(text));
  }

  private renderPureLatex(text: string): string {
    try {
      const isDisplayMode = text.startsWith('$$');
      const latexContent = isDisplayMode ? text.slice(2, -2) : text.slice(1, -1);
      
      return katex.renderToString(latexContent, {
        throwOnError: false,
        displayMode: isDisplayMode
      });
    } catch (error) {
      console.error('LaTeX rendering error:', error);
      return this.escapeHtml(text);
    }
  }

  private containsLatex(text: string): boolean {
    const latexPatterns = [
      /\$[^$]+\$/,
      /\$\$[^$]+\$\$/,
      /\\[a-zA-Z]+\{/,
      /\\\(.*\\\)|\\\[.*\\\]/,
      /\\alpha|\\beta|\\gamma|\\delta|\\frac|\\sqrt|\\sum|\\int|\\prod/
    ];
    
    return latexPatterns.some(pattern => pattern.test(text));
  }

  private renderMixedContent(text: string): string {
    const parts = text.split(/(\$[^$]+\$|\$\$[^$]+\$\$)/);
    
    return parts.map(part => {
      if (part.startsWith('$') && part.endsWith('$')) {
        try {
          const isDisplay = part.startsWith('$$') && part.endsWith('$$');
          const latexContent = isDisplay ? part.slice(2, -2) : part.slice(1, -1);
          return katex.renderToString(latexContent, {
            throwOnError: false,
            displayMode: isDisplay
          });
        } catch (error) {
          return this.escapeHtml(part);
        }
      } else {
        return this.escapeHtml(part);
      }
    }).join('');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}