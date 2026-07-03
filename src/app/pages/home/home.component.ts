import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Project, ProjectCardComponent } from '../../components/project-card/project-card.component';
import { TimelineComponent, TimelineItem } from '../../components/timeline/timeline.component';
import { SkillCategory, SkillsGridComponent } from '../../components/skills-grid/skills-grid.component';
import AboutComponent from '../about/about.component';
import ContactComponent from '../contact/contact.component';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        HeaderComponent,
        FooterComponent,
        ProjectCardComponent,
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
        { name: 'Angular', icon: 'bi bi-code-slash', level: 'Avançado' },
        { name: 'TypeScript', icon: 'bi bi-filetype-tsx', level: 'Avançado' },
        { name: 'Tailwind CSS', icon: 'bi bi-palette', level: 'Avançado' },
        { name: 'HTML5 & CSS3', icon: 'bi bi-filetype-css', level: 'Avançado' }
      ]
    },
    {
      title: 'Back-End & APIs',
      skills: [
        { name: 'Node.js', icon: 'bi bi-terminal', level: 'Intermediário' },
        { name: 'Express', icon: 'bi bi-server', level: 'Intermediário' },
        { name: 'REST APIs', icon: 'bi bi-braces', level: 'Avançado' },
        { name: 'SQL / Databases', icon: 'bi bi-database', level: 'Básico' }
      ]
    },
    {
      title: 'Ferramentas & Métodos',
      skills: [
        { name: 'Git & GitHub', icon: 'bi bi-git', level: 'Avançado' },
        { name: 'Docker', icon: 'bi bi-box', level: 'Básico' },
        { name: 'Metodologias Ágeis', icon: 'bi bi-kanban', level: 'Intermediário' },
        { name: 'UI / UX Design', icon: 'bi bi-vector-pen', level: 'Intermediário' }
      ]
    }
  ];

  projects: Project[] = [
    {
      title: 'Lupum Task Manager',
      description: 'Gerenciador de tarefas corporativo projetado para equipes de alta performance. Conta com quadro Kanban interativo, métricas de produtividade semanais e interface ultra moderna.',
      tags: ['Angular', 'TypeScript', 'Tailwind CSS', 'RxJS'],
      githubUrl: 'https://github.com/viniciuspdionizio',
      liveUrl: 'https://github.com/viniciuspdionizio'
    },
    {
      title: 'Combat Analytics',
      description: 'Plataforma de estatísticas voltada para atletas de kickboxing. Permite registrar dados de lutas, analisar a eficiência dos golpes aplicados e acompanhar o volume de treinamento físico.',
      tags: ['Angular', 'Chart.js', 'Express', 'Node.js'],
      githubUrl: 'https://github.com/viniciuspdionizio',
      liveUrl: 'https://github.com/viniciuspdionizio'
    },
    {
      title: 'Dev Portfolio V2',
      description: 'Refatoração completa do portfólio pessoal focada em desempenho e design moderno. Conta com layout responsivo mobile-first, efeito de glassmorphism e animações fluidas.',
      tags: ['Angular 17', 'Tailwind CSS', 'Sass', 'SSR'],
      githubUrl: 'https://github.com/viniciuspdionizio',
      liveUrl: 'https://github.com/viniciuspdionizio'
    }
  ];

  timelineItems: TimelineItem[] = [
    {
      role: 'Desenvolvedor Front-End',
      company: 'Lupum',
      period: '2024 - Presente',
      description: 'Desenvolvimento e refatoração de aplicações web complexas usando Angular, TypeScript e Tailwind CSS. Foco na criação de componentes reaproveitáveis de alta performance, melhoria de UX/UI e integração com APIs robustas.',
      type: 'work'
    },
    {
      role: 'Atleta Competidor de Kickboxing',
      company: 'Eventos Oficiais / WGP / CBKB',
      period: '2021 - Presente',
      description: 'Participação ativa em campeonatos de kickboxing. Prática de autodisciplina contínua, resiliência extrema sob condições extremas de fadiga e habilidade vital de manter a calma sob pressão.',
      type: 'sports'
    },
    {
      role: 'Desenvolvedor Web (Estágio)',
      company: 'Lupum',
      period: '2023 - 2024',
      description: 'Auxílio na implementação de layouts responsivos, correção de bugs em templates do Angular, estilização com Tailwind/CSS e consumo de rotas de APIs REST.',
      type: 'work'
    },
    {
      role: 'Tecnologia em Análise e Des. de Sistemas',
      company: 'FEMA / Estácio',
      period: '2022 - 2025',
      description: 'Formação superior focada em arquitetura de sistemas, algoritmos, modelagem de banco de dados, engenharia de software e práticas ágeis de desenvolvimento.',
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
