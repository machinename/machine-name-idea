'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AccountModal.module.css';
import { useAppContext } from '../../providers/AppProvider';
import {
    InputAdornment
} from '@mui/material';

import {
    VisibilityOffOutlined, VisibilityOutlined
} from '@mui/icons-material';

import { StyledButton, FormTextField } from '../Styled';
import { useAuthContext } from '@/app/providers/AuthProvider';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    screen: string;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, screen }) => {
    const Router = useRouter(); 
    const { authError, user } = useAuthContext();

    const { setInfo } = useAppContext();

    const [deleteAccount, setDeleteAccount] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ displayName: '', email: '', password: '' });

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const clearValues = () => {
        setDeleteAccount('');
        setEmail('');
        setErrors({ displayName: '', email: '', password: '' });
        setNewDisplayName('');
        setPassword('');
        setShowPassword(false);
        onClose();
    }

    const handleRemoveDisplayName = () => {
        // updateUserDisplayName('');
        clearValues();
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ displayName: '', email: '', password: '' });

        try {
            console.log(screen);
            switch (screen) {
                case "email":
                    if (email === user?.email) {
                        setErrors({ ...errors, email: 'Email is the same as current email' });
                        return;
                    }
                    // await updateUserEmail(email, password);
                    clearValues();
                    setInfo('Please verify your new email address');
                    break;

                case "password":
                    if (user?.email) {
                        // await sendPasswordReset(user?.email);
                        clearValues();
                        setInfo('Password reset link sent to your email');
                    }
                    break;

                case "deleteAccount":
                    // await deleteUserAccount(password);
                    clearValues();
                    Router.push('/');
                    setInfo('Account deleted successfully');
                    break;

                case "displayName":
                    if (newDisplayName === user?.displayName) {
                        setErrors({ ...errors, displayName: 'Display name is the same as current display name' });
                        return;
                    }
                    // await updateUserDisplayName(newDisplayName);
                    clearValues();
                    setInfo('Display name updated successfully');
                    break;

                case "verification":
                    if (email !== user?.email) {
                        setErrors({ ...errors, email: 'Email is not the same as current email' });
                        return;
                    }
                    // await sendUserVerification();
                    clearValues();
                    setInfo('Please verify your new email address');
                    break;

                default:
                    console.error('Unknown screen:', screen);
            }
        } catch (error) {
            console.log(error);
            setInfo('An error occurred: ' + error);
        }
    };

    const isButtonEnabled = () => {
        if (screen === "email") {
            return email.trim() !== '' && password.trim() !== '';
        } else if (screen === "password") {
            return user?.email === email;
        } else if (screen === "delete") {
            return deleteAccount === "delete-my-account" && password.trim() !== '';
        } else if (screen === "displayName") {
            return newDisplayName.trim() !== '' && newDisplayName.length > 1;
        } else if (screen === "verification") {
            return email.trim() !== ''
        }
        return false;
    };

    const FormHeader: React.FC = (screen) => {
        switch (screen) {
            case "email":
                return (
                    <div className={styles.modalHeader}>
                        <h2>Update email</h2>
                        {
                            user?.email && (
                                <p>{user.email}</p>
                            )
                        }
                        <p>To continue, type your new email and your password below</p>
                    </div>
                );
            case "password":
                return (
                    <div className={styles.modalHeader}>
                        <h2>Reset password</h2>
                        <p>Password reset link will be sent to {user?.email}</p>
                        <p>To continue, type your email below</p>
                    </div>
                );
            case "delete":
                return (
                    <div className={styles.modalHeader}>
                        <h2>Delete account</h2>
                        <p>We will delete your account and all data associated with the email &apos;{user?.email}&apos;</p>
                        <p>To continue, type &apos;delete-my-account&apos; and your password below</p>
                    </div>
                );
            case "displayName":
                return (
                    <div className={styles.modalHeader}>
                        <h2>Update display name</h2>
                        {user?.displayName && (<p>{user.displayName}</p>)}
                        <p>To continue, type your new display name below</p>
                    </div>
                );
            case "verification":
                return (
                    <div className={styles.modalHeader}>
                        <h2>Email verification</h2>
                        <p>Email verification link will be sent to &apos;{user?.email}&apos;</p>
                        <p>To continue, type your email below</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        isOpen && (
            <div className={styles.modal}>
                <div className={styles.wrapperModal}>
                    {FormHeader(screen)}
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {screen === "verification" && (
                            <FormTextField
                                type="email"
                                id="verification"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="standard"
                                label="Email"
                                autoComplete='off'
                            />
                        )}
                        {screen === "email" && (
                            <FormTextField
                                type="email"
                                id={screen}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="standard"
                                label="New email"
                                autoComplete='off'
                            />
                        )}
                        {screen === "password" && (
                            <FormTextField
                                type='email'
                                id={screen}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="standard"
                                label="Email"
                                autoComplete='off'
                            />
                        )}
                        {screen === "delete" && (
                            <FormTextField
                                type="text"
                                id={screen}
                                value={deleteAccount}
                                onChange={(event) => setDeleteAccount(event.target.value)}
                                label="delete-my-account"
                                autoComplete='off'
                                variant="standard"
                            />
                        )}
                        {screen === "displayName" && (
                            <FormTextField
                                type="text"
                                id={screen}
                                value={newDisplayName}
                                onChange={(event) => setNewDisplayName(event.target.value)}
                                autoComplete='off'
                                variant="standard"
                                label="New display name"
                            />
                        )}
                        {screen !== "displayName" && screen !== "verification" && screen !== "password" && (
                            <FormTextField
                                type={showPassword ? 'text' : 'password'}
                                id="formPassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete='off'
                                variant="standard"
                                label="Password"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {showPassword ? <VisibilityOffOutlined onClick={handleClickShowPassword} sx={{ color: 'gray' }} /> : <VisibilityOutlined onClick={handleClickShowPassword} sx={{ color: 'gray' }} />}
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        )}
                        <div className={styles.modalFooter}>
                            {errors.email && (<p className={styles.textError} aria-live="polite">{errors.email}</p>)}
                            {errors.password && (<p className={styles.textError} aria-live="polite">{errors.password}</p>)}
                            {authError && (<p className={styles.textError} aria-live="polite">{authError}</p>)}
                            {                       
                                screen === "password" ?
                                    <StyledButton disabled={!isButtonEnabled()} type="submit">
                                        Send                      
                                    </StyledButton>
                                    :
                                    <StyledButton disabled={!isButtonEnabled()} type="submit">
                                        {screen === "verification" ? "Resend" : "Submit"}
                                    </StyledButton>
                            }
                            {
                                (screen === "displayName" && user?.displayName) && (
                                    <StyledButton className={styles.button} type="button" onClick={handleRemoveDisplayName}>
                                        Remove Display Name
                                    </StyledButton>
                                )
                            }
                            <StyledButton onClick={clearValues} type="reset">
                                Cancel
                            </StyledButton>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}
export default AccountModal;