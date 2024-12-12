import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerQrPage } from './scanner-qr.page';
import { ModalController } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';

describe('ScannerQrPage: StarScan()', () => {
  let component: ScannerQrPage;
  let fixture: ComponentFixture<ScannerQrPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUserId']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ScannerQrPage],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerQrPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería llamar a BarcodeScanner y publicar el resultado al escanear', async () => {
    const mockBarcode = { barcode: { displayValue: '12345' } };
    const mockUserId = 1;
    authServiceSpy.getCurrentUserId.and.returnValue(Promise.resolve(mockUserId));
    modalControllerSpy.create.and.returnValue({
      present: jasmine.createSpy('present'),
      onWillDismiss: () => Promise.resolve({ data: mockBarcode }),
    } as any);

    spyOn(BarcodeScanner, 'checkPermissions').and.returnValue(Promise.resolve({ camera: 'granted' }));
    spyOn(BarcodeScanner, 'requestPermissions').and.returnValue(Promise.resolve({ camera: 'granted' }));


    await component.StarScan();
    
    const req = httpMock.expectOne('https://asisduoc-api-77f03f161fc1.herokuapp.com/admitirAlumno');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ id_alumno: mockUserId, codigo: '12345' });

    req.flush({ success: true });
  });

  afterEach(() => {
    httpMock.verify();
  });

});