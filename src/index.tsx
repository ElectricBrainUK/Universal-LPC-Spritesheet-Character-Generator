import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import CharacterCreator from "./CharacterCreator";
import {IonApp, IonPage, IonRouterOutlet} from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";

ReactDOM.render(
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet id="main">
                <IonPage><CharacterCreator/></IonPage>
            </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
