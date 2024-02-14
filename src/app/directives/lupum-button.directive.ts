import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[lupumButton]',
  standalone: true
})
export class LupumButton {
  @Input() color: string = 'none';

  constructor(
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.elementRef.nativeElement
      .classList.add(`bg-${this.color}-600`,
        `hover:bg-${this.color}-500`,
        'rounded-md',
        'px-3', 'py-2',
        'text-sm', 'font-semibold', 'focus-visible:outline-offset-2');

  }



}
