import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'form-field',
  standalone: true,
})
export class FormFieldDirective {
  private children;


  constructor(
    private elementRef: ElementRef,
  ) {
    this.children = this.elementRef.nativeElement.children;
  }

  ngAfterViewInit(): void {

    console.log(this.children[0]);

  }

}
