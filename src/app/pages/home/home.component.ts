
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
    HeaderComponent,
    FooterComponent,
    TimelineComponent,
    SkillsGridComponent,
    AboutComponent,
    ContactComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  // Nomes de tecnologias (Angular, Java, Docker...) são termos técnicos
  // internacionais e ficam iguais nos dois idiomas — só título da categoria
  // e nível de proficiência são traduzidos.
  private readonly intermediate = $localize`:@@skills.level.intermediate:Intermediário`;
  private readonly basic = $localize`:@@skills.level.basic:Básico`;

  skillsCategories: SkillCategory[] = [
    {
      title: $localize`:@@skills.category.frontend:Front-End`,
      skills: [
        { name: 'Angular', icon: 'bi bi-code-slash', level: this.intermediate },
        { name: 'TypeScript', icon: 'bi bi-filetype-tsx', level: this.intermediate },
        { name: 'Tailwind CSS', icon: 'bi bi-palette', level: this.basic },
        { name: 'HTML5 & CSS3', icon: 'bi bi-filetype-css', level: this.intermediate }
      ]
    },
    {
      title: $localize`:@@skills.category.backend:Back-End & APIs`,
      skills: [
        { name: 'Java', icon: 'bi bi-filetype-java', level: this.intermediate },
        { name: 'Spring Boot', icon: 'bi bi-filetype-java', level: this.intermediate },
        { name: 'REST APIs', icon: 'bi bi-braces', level: this.intermediate },
        { name: 'SQL / Databases', icon: 'bi bi-database', level: this.intermediate }
      ]
    },
    {
      title: $localize`:@@skills.category.tools:Ferramentas & Métodos`,
      skills: [
        { name: 'Git & GitHub', icon: 'bi bi-git', level: this.intermediate },
        { name: 'Docker', icon: 'bi bi-box', level: this.basic },
        { name: $localize`:@@skills.agile:Metodologias Ágeis`, icon: 'bi bi-kanban', level: this.basic },
        { name: 'UI / UX Design', icon: 'bi bi-vector-pen', level: this.basic }
      ]
    }
  ];

  private readonly developer = $localize`:@@timeline.role.developer:Desenvolvedor`;

  timelineItems: TimelineItem[] = [
    {
      role: this.developer,
      company: 'Peti9',
      period: $localize`:@@timeline.peti9.period:2024 - Presente`,
      description: $localize`:@@timeline.peti9.description:Desenvolvimento e evolução do sistema PETI9, uma plataforma de gestão para o segmento pet. Atuação full-stack com Angular no frontend e Spring Boot no backend, contribuindo na criação de novas funcionalidades, manutenção evolutiva e corretiva, integrações entre serviços e sustentação da aplicação em produção. Foco em desempenho, segurança e regras de negócio.`,
      type: 'work'
    },
    {
      role: $localize`:@@timeline.kickboxing.role:Atleta Competidor de Kickboxing`,
      company: 'K1, SFT',
      period: $localize`:@@timeline.kickboxing.period:2014 - Presente`,
      description: $localize`:@@timeline.kickboxing.description:Atuação em campeonatos de kickboxing com desenvolvimento contínuo de disciplina, controle emocional sob alta pressão, resiliência física e mental, e foco em performance competitiva.`,
      type: 'sports'
    },
    {
      role: this.developer,
      company: 'Omega Sistemas',
      period: '2012 - 2020',
      description: $localize`:@@timeline.omega.description:Desenvolvimento de sistemas e integrações voltadas ao setor fiscal, com foco na comunicação entre software proprietário e a SEFAZ. Atuação também no ERP da empresa, participando da manutenção evolutiva e corretiva de sistemas legados, implementação de integrações via SOAP e uso de certificados digitais, garantindo conformidade e confiabilidade das operações.`,
      type: 'work'
    },
    {
      role: $localize`:@@timeline.fema.role:Bacharel em Ciência da Computação`,
      company: 'FEMA',
      period: '2009 - 2022',
      description: $localize`:@@timeline.fema.description:Formação em Ciência da Computação com base em arquitetura de sistemas, algoritmos, banco de dados, engenharia de software e desenvolvimento de aplicações. Início da graduação em 2009 e conclusão em 2022.`,
      type: 'education'
    }
  ];
}
