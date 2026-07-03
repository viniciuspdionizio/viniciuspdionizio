import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SkillCategory, SkillsGridComponent } from '../../components/skills-grid/skills-grid.component';
import { TimelineComponent, TimelineItem } from '../../components/timeline/timeline.component';
import AboutComponent from '../about/about.component';
import ContactComponent from '../contact/contact.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    TimelineComponent,
    SkillsGridComponent,
    AboutComponent,
    ContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export default class HomeComponent {
  skillsCategories: SkillCategory[] = [
    {
      title: 'Front-End',
      skills: [
        { name: 'Angular', icon: 'bi bi-code-slash', level: 'Intermediário' },
        { name: 'TypeScript', icon: 'bi bi-filetype-tsx', level: 'Intermediário' },
        { name: 'Tailwind CSS', icon: 'bi bi-palette', level: 'Básico' },
        { name: 'HTML5 & CSS3', icon: 'bi bi-filetype-css', level: 'Intermediário' }
      ]
    },
    {
      title: 'Back-End & APIs',
      skills: [
        { name: 'Java', icon: 'bi bi-filetype-java', level: 'Intermediário' },
        { name: 'Spring Boot', icon: 'bi bi-filetype-java', level: 'Intermediário' },
        { name: 'REST APIs', icon: 'bi bi-braces', level: 'Intermediário' },
        { name: 'SQL / Databases', icon: 'bi bi-database', level: 'Intermediário' }
      ]
    },
    {
      title: 'Ferramentas & Métodos',
      skills: [
        { name: 'Git & GitHub', icon: 'bi bi-git', level: 'Intermediário' },
        { name: 'Docker', icon: 'bi bi-box', level: 'Básico' },
        { name: 'Metodologias Ágeis', icon: 'bi bi-kanban', level: 'Básico' },
        { name: 'UI / UX Design', icon: 'bi bi-vector-pen', level: 'Básico' }
      ]
    }
  ];

  timelineItems: TimelineItem[] = [
    {
      role: 'Desenvolvedor',
      company: 'Peti9',
      period: '2024 - Presente',
      description: 'Desenvolvimento e evolução do sistema PETI9, uma plataforma de gestão para o segmento pet. Atuação full-stack com Angular no frontend e Spring Boot no backend, contribuindo na criação de novas funcionalidades, manutenção evolutiva e corretiva, integrações entre serviços e sustentação da aplicação em produção. Foco em desempenho, segurança e regras de negócio.',
      type: 'work'
    },
    {
      role: 'Atleta Competidor de Kickboxing',
      company: 'K1, SFT',
      period: '2014 - Presente',
      description: 'Atuação em campeonatos de kickboxing com desenvolvimento contínuo de disciplina, controle emocional sob alta pressão, resiliência física e mental, e foco em performance competitiva.',
      type: 'sports'
    },
    {
      role: 'Desenvolvedor',
      company: 'Omega Sistemas',
      period: '2012 - 2020',
      description: 'Desenvolvimento de sistemas e integrações voltadas ao setor fiscal, com foco na comunicação entre software proprietário e a SEFAZ. Atuação também no ERP da empresa, participando da manutenção evolutiva e corretiva de sistemas legados, implementação de integrações via SOAP e uso de certificados digitais, garantindo conformidade e confiabilidade das operações.',
      type: 'work'
    },
    {
      role: 'Bacharel em Ciência da Computação',
      company: 'FEMA',
      period: '2009 - 2022',
      description: 'Formação em Ciência da Computação com base em arquitetura de sistemas, algoritmos, banco de dados, engenharia de software e desenvolvimento de aplicações. Início da graduação em 2009 e conclusão em 2022.',
      type: 'education'
    }
  ];

  scrollToSection(event: Event, targetId: string) {
    event.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
