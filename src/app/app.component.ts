import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
    selector: 'app-root',
    imports: [RouterModule, NgxSonnerToaster],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
