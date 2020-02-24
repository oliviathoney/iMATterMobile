import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthServiceProvider, User} from '../../../services/user/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import {ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ProfileService } from '../../../services/user/profile.service';

@Component({
  selector: 'app-recovery-code',
  templateUrl: './recovery-code.page.html',
  styleUrls: ['./recovery-code.page.scss'],
})
export class RecoveryCodePage implements OnInit {
	public loginForm: FormGroup;
    public loading: HTMLIonLoadingElement;
    private email: string;
    private password: string;
    private userID: string;
    private userEmail: boolean;
    private userPassword: string;
	private recoveryCode: string;
	private theCode: string;
	private wantedUserID: string;
	private recoveryPassword: string;
	

  public enterCodeForm: FormGroup;
  constructor(
      public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private authService: AuthServiceProvider,
        private router: Router,
        private formBuilder: FormBuilder,
        public afs: AngularFirestore,
        private toastCtrl: ToastController,
        private storage: Storage,
		private profileService: ProfileService
  ) {
    this.enterCodeForm = this.formBuilder.group({
      recoveryCode: [
        '',
        Validators.compose([Validators.required]),
      ],
	  recoveryPassword: [
        '',
        Validators.compose([Validators.required]),
      ],
    });
  }

  ngOnInit() {
  }
  
  
  
  validateUser(enterCodeForm: FormGroup) {
        this.recoveryCode = enterCodeForm.value.recoveryCode;
		this.recoveryPassword = enterCodeForm.value.recoveryPassword;
        var recoveryEmail;
		var theCode;
		console.log("1");
		console.log(this.recoveryCode);
		console.log("recoveryEmail");
		console.log(this.recoveryPassword);
        this.afs.firestore.collection('recovery_email').where('code', '==', this.recoveryCode)
            .get().then(snapshot => {
				console.log("2");
            if (snapshot.docs.length > 0) {
                console.log(('exists'));
				console.log("3");
				const recoveryRef = this.afs.firestore.collection('recovery_email');
				recoveryRef.get().then((result) => {
                    result.forEach(doc => {
                        this.userID = doc.id;
                        this.theCode = doc.get('code');
						console.log(this.theCode);
						console.log("4");
                        if ( this.theCode === this.recoveryCode) {
                            recoveryEmail = doc.get('email');
							console.log(recoveryEmail);
							console.log("5");
                            


                            //this.router.navigate(['/tabs/home/']);
                        } else {
                            //this.showToast('Password is incorrect');
                        }

                    });
                });
				//console.log(recoveryRef.email);
				console.log("?");
                const userRef = this.afs.firestore.collection('users');
                userRef.get().then((result) => {
                    result.forEach(doc => {
                        this.userID = doc.id;
                        this.userEmail = doc.get('email');
						this.password = doc.get('password');

                        if ( this.userEmail === recoveryEmail) {
                            //this.storage.set('userCode', this.userID);
                            //this.storage.set('authenticated', 'true');
                            //this.storage.set('username', doc.get('username'));
                            //this.storage.set('dueDate', doc.get('dueDate'));
                            //this.storage.set('cohort', doc.get('cohort'));
							console.log("Ya!");
							//updatePassword();
							//this.doc.password = "wordpass";
                            //this.storage.set('password', 'wordpass');
							//doc.password = 'wordpass';
							//console.log(doc.get('password'));
							//doc.update({
							//	password: 'wordpass'
							//});
							console.log(this.recoveryPassword);
							this.wantedUserID = this.userID;
							this.afs.firestore.collection('users').doc(this.wantedUserID).update({
								password: this.recoveryPassword
							});
							//this.router.navigate(['/tabs/home/']);
                        } else {
                            //this.showToast('Password is incorrect');
                        }

                    });
                });
				

            } else {
                console.log('Email does not exist');
                this.userEmail = false;
            }
        });
    }
	async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updatePassword(
                data.newPassword,
                data.oldPassword, this.userID
            );
          },
        },
      ],
    });
    await alert.present();
  }
	

}
