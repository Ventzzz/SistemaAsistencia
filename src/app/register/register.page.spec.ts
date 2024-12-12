import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';

// Creación de espías usando jasmine.createSpyObj
describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    // Creamos los espías con los métodos esperados de cada servicio
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateRoot']);

    // Definimos el comportamiento de los espías
    authServiceSpy.register.and.returnValue(Promise.resolve(true));  // Simula una promesa resuelta
    navControllerSpy.navigateRoot.and.returnValue(Promise.resolve(true));  // Simula una navegación exitosa

    await TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },  // Usamos el espía aquí
        { provide: NavController, useValue: navControllerSpy }  // Usamos el espía aquí
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a authService.register y navegar a login si el formulario es válido', async () => {
    // Arrange: Simulamos un formulario válido
    component.formRegister.setValue({
      Nombre: 'Test User',
      contraseña: 'password123',
      role: 'user',
      id: ''
    });

    // Act: Llamamos al método registrar
    await component.registrar();  // Usamos 'await' ya que la función 'register' devuelve una promesa

    // Assert: Verificamos que se haya llamado al servicio de registro
    expect(authServiceSpy.register).toHaveBeenCalledWith('Test User', 'password123', 'user');
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith('/login');
  });

  it('no debería llamar a authService.register si el formulario es inválido', async () => {
    // Arrange: Dejamos el formulario inválido (campos vacíos)
    component.formRegister.setValue({
      Nombre: '',
      contraseña: '',
      role: '',
      id: ''
    });

    // Act: Llamamos al método registrar
    await component.registrar();

    // Assert: Verificamos que no se haya llamado al servicio de registro
    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateRoot).not.toHaveBeenCalled();
  });

  it('debería mostrar un mensaje de error si el formulario es inválido (campos requeridos)', async () => {
    // Arrange: Dejamos el formulario con un campo requerido vacío (por ejemplo, nombre)
    component.formRegister.setValue({
      Nombre: '',  // Nombre vacío
      contraseña: 'password123',
      role: 'user',
      id: ''
    });

    // Act: Llamamos al método registrar
    await component.registrar();

    // Assert: Verificamos que el servicio no se llame y que se muestre un mensaje de error
    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.fail).toBeTrue();  // Se activa el flag 'fail' cuando el formulario es inválido
    expect(component.mensaje).toContain('Campos inválidos');  // El mensaje de error debe ser el correcto
  });

  it('debería manejar el error si el registro falla', async () => {
    // Arrange: Simulamos un error en el servicio de registro
    const errorMessage = 'Error en el servidor';
    authServiceSpy.register.and.returnValue(Promise.reject(new Error(errorMessage)));  // Simula un error

    // Act: Llamamos al método registrar con datos válidos
    component.formRegister.setValue({
      Nombre: 'Test User',
      contraseña: 'password123',
      role: 'user',
      id: ''
    });

    await component.registrar();

    // Assert: Verificamos que se haya manejado el error correctamente
    expect(authServiceSpy.register).toHaveBeenCalledWith('Test User', 'password123', 'user');
    expect(component.fail).toBeTrue();  // Se activa el flag 'fail' con el error
    expect(component.mensaje).toContain(errorMessage);  // El mensaje debe contener el error
  });

  it('debería navegar a la página de login después de un registro exitoso', async () => {
    // Arrange: Simulamos un formulario válido
    component.formRegister.setValue({
      Nombre: 'Test User',
      contraseña: 'password123',
      role: 'user',
      id: ''
    });

    // Act: Llamamos al método registrar
    await component.registrar();

    // Assert: Verificamos que se haya navegado a la página de login después del registro
    expect(authServiceSpy.register).toHaveBeenCalledWith('Test User', 'password123', 'user');
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith('/register');  // Aseguramos que la navegación ocurra
  });
});
