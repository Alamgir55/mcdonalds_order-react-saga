
import { put, call, delay } from 'redux-saga/effects';
import axios from '../.././axios-orders';

import * as actions from '../actions/index';

export function* logoutSaga(action){
    yield call([localStorage, 'removeItem'], "token");
    yield call([localStorage, 'removeItem'], "expirationData");
    yield call([localStorage, 'removeItem'], "userId");
    yield put(actions.logoutSucceed());
};

export function* checkAuthTimeoutSaga(action){
    yield delay(action.expirationTime * 1000);
    yield put(actions.logout());
};

export function* authUserSaga(action){
    put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD9O3SOOlb6PZEsJy_fOuc3MbG328FfhMM';
    if(!action.isSignup){
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9O3SOOlb6PZEsJy_fOuc3MbG328FfhMM';
    }
    try{
        const response = yield axios.post(url, authData)
            // console.log(response);
            const expirationData = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationData', expirationData);
            localStorage.setItem('userId', response.data.localId);
            yield put(actions.authSuccess(response.data.idToken, response.data.localId));
            yield put(actions.checkAuthTimeout(response.data.expiresIn));
    }catch(error){
        yield put(actions.authFail(error.response.data.error));
    }
}

export function* authCheckStateSaga(action){
        const token = yield localStorage.getItem('token');
        if(!token){
            yield put(actions.logout());
        } else{
            const expirationData = yield new Date(localStorage.getItem('expirationData'));
            if(expirationData <= new Date()){
                yield put(actions.logout())
            } else {
                const userId = yield localStorage.getItem('userId');
                yield put(actions.authSuccess(token, userId));
                yield put(actions.checkAuthTimeout((expirationData.getTime() - new Date().getTime()) / 1000));
            }   
        }
}