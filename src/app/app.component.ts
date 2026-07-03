import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
