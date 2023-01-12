import { Injectable } from '@angular/core';
import { onSnapshot, getFirestore, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { UserDetail } from 'src/app/interfaces/user.model';
import { FIRESTORE_DB_NAME } from 'src/app/utils/common-constants';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private db = getFirestore();
  constructor() {}

  getDataWithSnap(
    collectionName: string,
    docName: string
  ): Observable<unknown> {
    return new Observable((observer) => {
      onSnapshot(
        doc(this.db, collectionName, docName),
        (data) => observer.next(data.data()),
        (e) => observer.error(e)
      );
    });
  }

  saveUserData(id: string, data: UserDetail): Promise<void> {
    return setDoc(doc(this.db, FIRESTORE_DB_NAME.userCollection, id), data, {
      merge: true,
    });
  }
}
