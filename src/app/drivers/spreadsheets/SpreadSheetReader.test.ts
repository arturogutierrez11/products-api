// import { SpreadSheetReader } from './SpreadSheetReader';
// import {
//   IGoogleSheetsConfig,
//   GoogleSheetsCredentials,
// } from '@core/adapters/config/IGoogleSheetsConfig';
//
// // Mock google-spreadsheet
// jest.mock('google-spreadsheet', () => {
//   return {
//     GoogleSpreadsheet: jest.fn().mockImplementation(() => ({
//       loadInfo: jest.fn().mockResolvedValue(undefined),
//       sheetsByTitle: {
//         unificacion_categories: {
//           headerValues: ['codigo', 'responsableDeCategoria', 'category'],
//           getRows: jest.fn().mockResolvedValue([
//             {
//               get: jest.fn().mockImplementation((header) => {
//                 const mockData = {
//                   codigo: 'TEST123',
//                   responsableDeCategoria: 'test@example.com',
//                   category: 'Test Category',
//                 };
//                 return mockData[header];
//               }),
//             },
//           ]),
//         },
//       },
//     })),
//   };
// });
//
// const SECONDS = 1000;
// jest.setTimeout(70 * SECONDS);
//
// const mockGoogleSheetsConfig: IGoogleSheetsConfig = {
//   getReadCredentials: (): GoogleSheetsCredentials => ({
//     type: 'service_account',
//     project_id: 'test-project-123',
//     private_key_id: 'mock-private-key-id-123',
//     private_key:
//       '-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY_FOR_TESTING\n-----END PRIVATE KEY-----\n',
//     client_email: 'test-service@test-project-123.iam.gserviceaccount.com',
//     client_id: '123456789012345678901',
//     auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//     token_uri: 'https://oauth2.googleapis.com/token',
//     auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//     client_x509_cert_url:
//       'https://www.googleapis.com/robot/v1/metadata/x509/test-service%40test-project-123.iam.gserviceaccount.com',
//     universe_domain: 'googleapis.com',
//   }),
//   getWriteCredentials: (): GoogleSheetsCredentials => ({
//     type: 'service_account',
//     project_id: 'test-write-project-456',
//     private_key_id: 'mock-write-private-key-id-456',
//     private_key:
//       '-----BEGIN PRIVATE KEY-----\nMOCK_WRITE_PRIVATE_KEY_FOR_TESTING\n-----END PRIVATE KEY-----\n',
//     client_email: 'test-write-service@test-write-project-456.iam.gserviceaccount.com',
//     client_id: '987654321098765432109',
//     auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//     token_uri: 'https://oauth2.googleapis.com/token',
//     auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//     client_x509_cert_url:
//       'https://www.googleapis.com/robot/v1/metadata/x509/test-write-service%40test-write-project-456.iam.gserviceaccount.com',
//     universe_domain: 'googleapis.com',
//   }),
// };
//
// describe('SpreadSheet Reader Tests', () => {
//   test('Should be able retrieve and spreadsheet as object', async () => {
//     const reader = new SpreadSheetReader(mockGoogleSheetsConfig);
//     const result = await reader.readAsObject(
//       '16w261XXVYo8tGMfg5mgYI8qgMs1t3tiVR3VxjGruUNo',
//       'unificacion_categories',
//     );
//     expect(result).toBeDefined();
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0].codigo).toBeDefined();
//     expect(result[0].responsableDeCategoria).toBeDefined();
//     expect(result[0].category).toBeDefined();
//   });
// });
