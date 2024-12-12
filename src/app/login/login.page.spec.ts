import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { AuthService } from '../auth.service';
import { NavController, AlertController, ToastController, IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: jasmine.SpyObj<AuthService>;
  let navCtrl: jasmine.SpyObj<NavController>;
  let toastController: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getUserRole']);
    const navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateRoot']);
    const toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastControllerSpy.create.and.returnValue(Promise.resolve({ present: () => Promise.resolve() })); // Simulamos el método create y present

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(), // Importa IonicModule para evitar errores relacionados con Ionic
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        AlertController,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    navCtrl = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    fixture.detectChanges();
  });

  it('debería mostrar un toast de éxito si el login es exitoso', async () => {
    component.formLogin.setValue({ Nombre: 'testuser', contraseña: 'password123' });
    authService.login.and.returnValue(Promise.resolve(true));
    authService.getUserRole.and.returnValue(Promise.resolve('user'));

    // Simulamos el ToastElement completo con las propiedades mínimas necesarias
    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastController.create.and.returnValue(Promise.resolve(toastSpy));

    await component.ingresar();

    expect(toastController.create).toHaveBeenCalled();
    expect(toastSpy.present).toHaveBeenCalled(); // Verifica que el toast se haya mostrado
  });

  it('debería mostrar un mensaje de error si el formulario es inválido (campos vacíos)', async () => {
    component.formLogin.setValue({ Nombre: '', contraseña: '' });  // Campos vacíos
    await component.ingresar();
    
    expect(component.fail).toBeTrue();  // Fail debe ser verdadero cuando el formulario es inválido
    expect(component.mensaje).toContain('Campos inválidos');  // Mensaje de error cuando no se completan los campos
  });

  it('debería establecer fail en verdadero y mostrar el error si el login falla por error del servidor', async () => {
    component.formLogin.setValue({ Nombre: 'testuser', contraseña: 'password123' });
    authService.login.and.returnValue(Promise.reject(new Error('Error del servidor')));

    await component.ingresar();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(component.fail).toBeTrue();  // fail debe ser true cuando ocurre un error
    expect(component.mensaje).toContain('Error del servidor');  // El mensaje debe contener el error
  });

  it('no debería llamar a login si el formulario es inválido', async () => {
    component.formLogin.setValue({ Nombre: '', contraseña: '' }); // Formulario inválido
    await component.ingresar();
    expect(authService.login).not.toHaveBeenCalled(); // No debe llamar a login
  });

  it('debería navegar a la raíz y mostrar el toast de éxito si el login es exitoso', async () => {
    component.formLogin.setValue({ Nombre: 'testuser', contraseña: 'password123' });
    authService.login.and.returnValue(Promise.resolve(true));
    authService.getUserRole.and.returnValue(Promise.resolve('user'));

    // Simulamos el ToastElement completo
    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastController.create.and.returnValue(Promise.resolve(toastSpy));

    // Ejecutamos la función ingresar()
    await component.ingresar();

    // Verificamos que las llamadas se realizaron correctamente
    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(navCtrl.navigateRoot).toHaveBeenCalledWith('');
    expect(toastSpy.present).toHaveBeenCalled();  // Verifica que el método present haya sido llamado
  });

  it('debería establecer fail en verdadero si el login falla', async () => {
    component.formLogin.setValue({ Nombre: 'testuser', contraseña: 'wrongpassword' });
    authService.login.and.returnValue(Promise.reject(new Error('Usuario o contraseña incorrectos')));

    await component.ingresar();
    expect(authService.login).toHaveBeenCalledWith('testuser', 'wrongpassword');
    expect(component.fail).toBeTrue();
    expect(component.mensaje).toContain('Usuario o contraseña incorrectos');
  });
});
