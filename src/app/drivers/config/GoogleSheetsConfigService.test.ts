import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleSheetsConfigService } from './GoogleSheetsConfigService';
import { GoogleSheetsCredentials } from '../../../core/adapters/config/IGoogleSheetsConfig';

describe('GoogleSheetsConfigService', () => {
  let service: GoogleSheetsConfigService;
  let configService: ConfigService;

  const mockReadCredentials: GoogleSheetsCredentials = {
    type: 'service_account',
    project_id: 'test-read-project',
    private_key_id: 'test-read-key-id',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nTEST_READ_KEY\n-----END PRIVATE KEY-----\n',
    client_email: 'test-read@test-read-project.iam.gserviceaccount.com',
    client_id: '123456789',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/test-read%40test-read-project.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  };

  const mockWriteCredentials: GoogleSheetsCredentials = {
    type: 'service_account',
    project_id: 'test-write-project',
    private_key_id: 'test-write-key-id',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nTEST_WRITE_KEY\n-----END PRIVATE KEY-----\n',
    client_email: 'test-write@test-write-project.iam.gserviceaccount.com',
    client_id: '987654321',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/test-write%40test-write-project.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleSheetsConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleSheetsConfigService>(GoogleSheetsConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getReadCredentials', () => {
    it('should return parsed read credentials when valid JSON is provided', () => {
      const mockJson = JSON.stringify(mockReadCredentials);
      jest.spyOn(configService, 'get').mockReturnValue(mockJson);

      const result = service.getReadCredentials();

      expect(configService.get).toHaveBeenCalledWith(
        'GOOGLE_READ_CREDENTIALS_JSON',
      );
      expect(result).toEqual(mockReadCredentials);
    });

    it('should throw error when environment variable is not set', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      expect(() => service.getReadCredentials()).toThrow(
        'GOOGLE_READ_CREDENTIALS_JSON environment variable is not set',
      );
    });

    it('should throw error when JSON is invalid', () => {
      jest.spyOn(configService, 'get').mockReturnValue('invalid json');

      expect(() => service.getReadCredentials()).toThrow(
        'Error parsing GOOGLE_READ_CREDENTIALS_JSON. Make sure it is a valid JSON',
      );
    });
  });

  describe('getWriteCredentials', () => {
    it('should return parsed write credentials when valid JSON is provided', () => {
      const mockJson = JSON.stringify(mockWriteCredentials);
      jest.spyOn(configService, 'get').mockReturnValue(mockJson);

      const result = service.getWriteCredentials();

      expect(configService.get).toHaveBeenCalledWith(
        'GOOGLE_WRITE_CREDENTIALS_JSON',
      );
      expect(result).toEqual(mockWriteCredentials);
    });

    it('should throw error when environment variable is not set', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      expect(() => service.getWriteCredentials()).toThrow(
        'GOOGLE_WRITE_CREDENTIALS_JSON environment variable is not set',
      );
    });

    it('should throw error when JSON is invalid', () => {
      jest.spyOn(configService, 'get').mockReturnValue('invalid json');

      expect(() => service.getWriteCredentials()).toThrow(
        'Error parsing GOOGLE_WRITE_CREDENTIALS_JSON. Make sure it is a valid JSON',
      );
    });
  });

  describe('parseCredentials', () => {
    it('should parse valid JSON credentials', () => {
      const mockJson = JSON.stringify(mockReadCredentials);
      jest.spyOn(configService, 'get').mockReturnValue(mockJson);

      // Access private method through any for testing
      const result = (service as any).parseCredentials('TEST_CREDENTIALS_JSON');

      expect(result).toEqual(mockReadCredentials);
    });

    it('should throw error for invalid JSON', () => {
      jest.spyOn(configService, 'get').mockReturnValue('invalid json');

      expect(() =>
        (service as any).parseCredentials('TEST_CREDENTIALS_JSON'),
      ).toThrow(
        'Error parsing TEST_CREDENTIALS_JSON. Make sure it is a valid JSON',
      );
    });
  });
});
