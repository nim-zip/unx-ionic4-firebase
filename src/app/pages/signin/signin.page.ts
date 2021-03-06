import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit, OnDestroy {

	isLoading: boolean = false;

  data = { 
		email: '', 
		password: '' 
	};

  constructor(
    private router: Router,
    public alertController: AlertController
  ) { }

  async ngOnInit() {
		await firebase.auth().signOut();
		this.data.email = '';
		this.data.password = '';
  }

	ngOnDestroy() {
		this.data.email = '';
		this.data.password = '';
	}

  async signIn() {
		this.isLoading = true;
    try {
      await firebase.auth().signInWithEmailAndPassword(this.data.email, this.data.password).then(() => console.log("signed in"));
				firebase.auth().onAuthStateChanged(async user => {
					if (user) {
						if (firebase.auth().currentUser.email.indexOf("unx.life") !== -1) {
							this.router.navigate(['/adminhome'])
						}
						else {
							var type: string;
							await firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/currentState").once("value", snapshot => {
									type = snapshot.val();
							}).then(() => console.log("type: ", type));
							if (type === "mentor") this.router.navigate(['/mentorhome'])
							else if (type === "mentee") this.router.navigate(['/menteehome'])
							else console.log("error");
						}
					} else console.log("error/////");
				})
			// var activeUser: any;
			// activeUser.email = firebase.auth().currentUser.email;
			// activeUser.key = firebase.auth().currentUser.uid;
				
    } catch (error) {
			this.isLoading = false;
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.message,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  signUp() {
    this.router.navigate(['/signup']);
  }

}
