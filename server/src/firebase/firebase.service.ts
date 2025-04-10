import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceAccount } from 'src/types/ServiceAccount';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      const accountPath = this.configService.get<string>('SA_KEY');

      if (!accountPath) {
        throw new Error(
          'Service account key path is not defined in the environment variables.',
        );
      }

      const serviceAccount: ServiceAccount = JSON.parse(
        fs.readFileSync(accountPath, 'utf8'),
      );

      const adminConfig: admin.ServiceAccount = {
        projectId: serviceAccount.project_id,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
      };

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        databaseURL: `https://${adminConfig.projectId}.firebaseio.com`,
        storageBucket: `gs://${adminConfig.projectId}.firebasestorage.app`,
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  getAuth = (): admin.auth.Auth => {
    return this.firebaseApp.auth();
  };
}
