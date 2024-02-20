import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

/**
 * NOT IMPLEMENTED, I WAS LEARNING TAILWIND AND SOMEDAY I'LL CONTINUE
 * 
 * @author Vinicius de Paiva Dionizio
 */
@Directive({
  selector: '[lupum-button]',
  standalone: true
})
export class CustomButtonDirective implements OnInit {
  @Input() color: string = 'primary';

  constructor(
    protected renderer: Renderer2,
    protected elementRef: ElementRef
  ) {

  }

  ngOnInit(): void {
    this.elementRef.nativeElement
      .classList.add(`bg-${this.color}`,
        `hover:bg-${this.color}-hover`,
        'rounded-none',
        'px-7', 'py-3',
        'flex', 'justify-center',
        // text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        'text-sm', 'font-semibold', 'focus-visible:outline-offset-2');
  }

  public addClasses(classes: string[]) {
    classes.forEach(c => {
      this.renderer.addClass(this.elementRef.nativeElement, c);
    });
  }

  public removeClasses(regex: any) {
    let classes = this.elementRef.nativeElement.getAttribute('class').split(' '); // get all classes
    classes.forEach((c: string) => {
      if (c.match(regex)) {
        this.renderer.removeClass(this.elementRef.nativeElement, c);
      }
    });
  }
}


@Directive({
  selector: '[lupum-rounded-button]',
  standalone: true
})
export class RoundedButtonDirective extends CustomButtonDirective {

  override ngOnInit(): void {
    super.ngOnInit();
    this.removeClasses('rounded*');
    this.addClasses([
      `bg-${this.color}-600`,
      `hover:bg-${this.color}-500`,
      'rounded-full',
    ]);
  }
}

@Directive({
  selector: '[lupum-stroked-button]',
  standalone: true
})
export class StrokedButtonDirective extends CustomButtonDirective {

  override ngOnInit(): void {
    super.ngOnInit();
    const el = this.elementRef;
    this.removeClasses('bg*');
    this.removeClasses('rounded*');
    this.addClasses([
      'bg-none',
      'hover:bg-none',
      'border-solid',
      'border-2',
      'font-semibold',
      'rounded-md',
      `border-${this.color}-hover`,
      `text-p-foreground-600`,
      `hover:text-${this.color}-hover`,
    ]);
  }
}


