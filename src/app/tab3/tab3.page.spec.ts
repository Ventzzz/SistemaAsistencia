import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tab3Page } from './tab3.page';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastController, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let httpClientSpy: { get: jasmine.Spy };
  let toastControllerSpy: { create: jasmine.Spy };
  let routerSpy: { navigate: jasmine.Spy };

  beforeEach(async () => {
    httpClientSpy = { get: jasmine.createSpy('get') };
    toastControllerSpy = { create: jasmine.createSpy('create') };
    routerSpy = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      declarations: [ Tab3Page ],
      imports: [ HttpClientModule, IonicModule.forRoot() ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
  });

  it('debería llamar a obtenerAsistencia en ngOnInit', () => { 
    spyOn(component, 'obtenerAsistencia');
    component.ngOnInit();
    expect(component.obtenerAsistencia).toHaveBeenCalled();
  });

  it('debería llenar el arreglo de clases cuando obtenerAsistencia sea exitoso', () => { //prueba obtenerAsistencia
    const mockResponse = [
      { clase_id: 1, alumno_id: 123, hora: '10:00' },
      { clase_id: 2, alumno_id: 456, hora: '11:00' }
    ];
  
    httpClientSpy.get.and.returnValue(of(mockResponse)); // Simula respuesta exitosa
  
    component.obtenerAsistencia();
  
    expect(component.clases).toEqual(mockResponse);
  });
  
  it('debería mostrar un mensaje de toast cuando obtenerAsistencia falle', () => { 
    const errorResponse = new ErrorEvent('API Error', { message: 'Error al obtener los datos' });
  
    httpClientSpy.get.and.returnValue(throwError(() => errorResponse)); // Simula error
  
    component.obtenerAsistencia();
  
    expect(toastControllerSpy.create).toHaveBeenCalledWith({
      message: 'Error al cargar las asistencias.',
      duration: 2000,
      position: 'bottom'
    });
  });
  
  it('debería llamar a toastController.create con los parámetros correctos', async () => { //prueba presentToast
    const mockMessage = 'Test message';
    const toastSpy = jasmine.createSpyObj('Toast', ['present']);
  
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));
  
    await component.presentToast(mockMessage);
  
    expect(toastControllerSpy.create).toHaveBeenCalledWith({
      message: mockMessage,
      duration: 2000,
      position: 'bottom'
    });
    expect(toastSpy.present).toHaveBeenCalled();
  });

  it('debería navegar a /scanner-qr cuando se llame a abrirPaginaQr', () => {
    component.abrirPaginaQr();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/scanner-qr']);
  });
  
});
