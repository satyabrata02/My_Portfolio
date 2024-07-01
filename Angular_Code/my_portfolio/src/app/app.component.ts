import { Component, OnInit, HostListener, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import emailjs from '@emailjs/browser';

declare var ScrollReveal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isMenu = false;
  msg! : string;
  isDarkMode1 = true;
  isDarkMode2 = false;
  private header!: HTMLElement;
  private scrollUpElement!: HTMLElement;
  activeSection!: any;

  constructor(private fb:FormBuilder, private elementRef: ElementRef) {
    let getMode = localStorage.getItem('mode');
    if (getMode === 'dark-theme') {
      document.body.classList.add('dark-theme');
      this.isDarkMode1 = false;
      this.isDarkMode2 = true;
    }
  }

  ngAfterViewInit(): void {
    this.activeSection = 'home';
    this.scrollActive();
    window.addEventListener('scroll', this.scrollActive.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollActive.bind(this));
  }
  private scrollActive(): void {
    const sections = this.elementRef.nativeElement.querySelectorAll('section[id]');
    const scrollDown = window.scrollY;

    sections.forEach((section: HTMLElement) => {
      const sectionTop = section.offsetTop - 58;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
        this.activeSection = sectionId;
      }
    });
  }
  isActive(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }

  // =========== MENU SHOW AND HIDE==========
  menu_btn(){
    this.isMenu = !this.isMenu;
  }
  
  ngOnInit(): void {
    // =============== SHADOW HEADER ===============
    this.header = document.getElementById('header') as HTMLElement;

    // =============== SHOW SCROLL UP ===============
    this.scrollUpElement = document.getElementById('scroll-up') as HTMLElement;

    // =============== SCROLL REVEAL ANIMATION ===============
    const sr = ScrollReveal({
      origin: 'top',
      distance: '60px',
      duration: 2500,
      delay: 400,
      reset: true
    });

    sr.reveal('.home__perfil, .about__image, .contact__mail, .section__title-2', { origin: 'right' });
    sr.reveal('.home__name, .home__info, .about__container, .section__title-1, .about__info, .contact__social, .contact__data', { origin: 'left' });
    sr.reveal('.services__card, .projects__card', { interval: 100 });
  }

  // =============== SHADOW HEADER ===============
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (window.scrollY >= 50) {
      this.header.classList.add('shadow-header');
    } else {
      this.header.classList.remove('shadow-header');
    }

    // =============== SHOW SCROLL UP ===============
    if (window.scrollY >= 350) {
      this.scrollUpElement.classList.add('show-scroll');
    } else {
      this.scrollUpElement.classList.remove('show-scroll');
    }
  }
  
  // =============== EMAIL JS ===============
  form:FormGroup = this.fb.group({
    user_name:'',
    user_email:'',
    user_subject:'',
    user_message:''
  });
  sendmail(){
    emailjs.init('z3iLNXGkGPQ07zHJ5') // publicKey
                    // serviceID - templateID 
    emailjs.send("service_058psfu","template_knscpwf",{
      user_name: this.form.value.user_name,
      user_email: this.form.value.user_email,
      user_subject: this.form.value.user_subject,
      user_message: this.form.value.user_message,
      }).then((response) => {
          this.msg = "Message sent successfully ✅"
        },
        (err) => {
          this.msg = "Message not sent (service error) ❌"
        },
      );
      this.form.reset();
  }

  // =============== DARK LIGHT THEME ===============
  darkOn(){
    this.isDarkMode1 = !this.isDarkMode1;
    this.isDarkMode2 = !this.isDarkMode2;
    document.body.classList.toggle('dark-theme');
    if (!document.body.classList.contains('dark-theme')) {
      localStorage.setItem('mode', 'light-theme');
    } else {
      localStorage.setItem('mode', 'dark-theme');
    }
  }

}
