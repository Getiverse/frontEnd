import { Preferences } from '@capacitor/preferences';
import { RegistrationStates } from '../registrationStates';

export const setRegistrationState = async (state: RegistrationStates) => {
    await Preferences.set({
        key: 'registration',
        value: state,
    });
};

export const getRegistrationState = async () => {
    const { value } = await Preferences.get({ key: 'registration' });
    return value;
};

export const removeRegitrationState = async () => {
    await Preferences.remove({ key: 'registration' });
};