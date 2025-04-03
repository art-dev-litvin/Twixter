import { Settings } from '@google-cloud/firestore';

export type FirestoreModuleOptions = {
  imports: any[];
  useFactory: (...args: any[]) => Settings;
  inject: any[];
};

export type FirestoreConfig = {
  projectId: string;
  keyFilename: string;
};
