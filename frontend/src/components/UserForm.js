import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';

const UserForm = ({ 
    visible, 
    onHide, 
    onAddUser, 
    users, 
    usernameLoading, 
    emailLoading,
    saveUserLoading,
    onMessage
}) => {
    const [newUser, setNewUser] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const [usernameExists, setUsernameExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        first_name: false,
        last_name: false,
        username: false,
        email: false,
        password: false
    });

    useEffect(() => {
        if (!usernameLoading && newUser.username) {
            const exists = users.some(user => user.username === newUser.username);
            setUsernameExists(exists);
            setValidationErrors(prev => ({ ...prev, username: exists }));
        } else {
            setUsernameExists(false);
            setValidationErrors(prev => ({ ...prev, username: false }));
        }
    }, [newUser.username, users, usernameLoading]);

    useEffect(() => {
        if (!emailLoading && newUser.email) {
            const exists = users.some(user => user.email === newUser.email);
            setEmailExists(exists);
            setValidationErrors(prev => ({ ...prev, email: exists }));
        } else {
            setEmailExists(false);
            setValidationErrors(prev => ({ ...prev, email: false }));
        }
    }, [newUser.email, users, emailLoading]);

    const handleSubmit = () => {
        setValidationErrors({
            first_name: false,
            last_name: false,
            username: false,
            email: false,
            password: false
        });

        if (emailExists) {
            setValidationErrors(prev => ({ ...prev, email: true }));
            onMessage({severity: 'error', summary: 'User Exists', detail: `User with email ${newUser.email} already exists.`});
            return;
        }
        
        if (usernameExists) {
            setValidationErrors(prev => ({ ...prev, username: true }));
            onMessage({severity: 'error', summary: 'Username Exists', detail: `Username ${newUser.username} is already taken.`});
            return;
        }

        if (!newUser.username) {
            setValidationErrors(prev => ({ ...prev, username: true }));
            onMessage({severity: 'error', summary: 'Validation Error', detail: 'Username is required.'});
            return;
        } else if (newUser.username.length < 4) {
            setValidationErrors(prev => ({ ...prev, username: true }));
            onMessage({severity: 'error', summary: 'Validation Error', detail: 'Username must be at least 4 characters long.'});
            return;
        }

        if (!newUser.first_name) {
            setValidationErrors(prev => ({ ...prev, first_name: true }));
            onMessage({severity: 'error', summary: 'Validation Error', detail: 'First name is required.'});
            return;
        }

        if (!newUser.last_name) {
            setValidationErrors(prev => ({ ...prev, last_name: true }));
            onMessage({severity: 'error', summary: 'Validation Error', detail: 'Last name is required.'});
            return;
        }

        const emailRegex = /^[^@]{1,64}@[^@]+\.[^@]+$/;
        if (!newUser.email) {
            setValidationErrors(prev => ({ ...prev, email: true }));
            onMessage({severity: 'error', summary: 'Validation Error', detail: 'Email is required.'});
            return;
        } else if (!emailRegex.test(newUser.email)) {
            setValidationErrors(prev => ({ ...prev, email: true }));
            onMessage({severity: 'error', summary: 'Validation Error', detail: 'Invalid email format.'});
            return;
        }
    
        if (!newUser.password) {
            setValidationErrors(prev => ({ ...prev, password: true }));
            onMessage({severity: 'error', summary: 'Validation Error', detail: 'Password is required.'});
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(newUser.password)) {
            setValidationErrors(prev => ({ ...prev, password: true }));
            onMessage({severity: 'error', summary: 'Validation Error', detail: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'});
            return;
        } 

        onAddUser(newUser);
    };

    const handleHide = () => {
        setNewUser({
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        });
        setValidationErrors({
            first_name: false,
            last_name: false,
            username: false,
            email: false,
            password: false
        });
        onHide();
    };

    return (
        <>
        <Dialog
            header="Add New User"
            visible={visible}
            style={{ width: '400px' }}
            modal
            className="p-fluid"
            onHide={handleHide}
        >
            <div className="field">
                <label className="text-sm" id="label-username">Username *</label>
                <InputText 
                    value={newUser.username} 
                    onChange={(e) => {
                        const val = e.target.value.slice(0, 40);
                        setNewUser({ ...newUser, username: val })
                    }}
                    style={{ borderColor: validationErrors.username ? 'red' : undefined }}
                    maxLength={40}
                    min={4}
                    aria-labelledby={`label-username`}
                />
                {usernameLoading ? (
                    <small className="p-text-secondary">Loading usernames...</small>
                ) : usernameExists ? (
                    <small className="p-error">Username already exists.</small>
                ) : null}
            </div>
            <div className="flex gap-4 field">
                <div className="w-1/2">
                    <label className="text-sm block mb-1" id="label-first-name">First Name *</label>
                    <InputText 
                        value={newUser.first_name} 
                        onChange={(e) => {
                            const val = e.target.value.slice(0, 40);
                            setNewUser({ ...newUser, first_name: val })
                        }}
                        style={{ borderColor: validationErrors.first_name ? 'red' : undefined }}
                        maxLength={40}
                        className="w-full"
                        aria-labelledby={`label-first-name`}
                    />
                    {validationErrors.first_name && (
                        <small className="p-error">First name is required.</small>
                    )}
                </div>
                <div className="w-1/2">
                    <label className="text-sm block mb-1" id="label-last-name">Last Name *</label>
                    <InputText 
                        value={newUser.last_name} 
                        onChange={(e) => {
                            const val = e.target.value.slice(0, 40);
                            setNewUser({ ...newUser, last_name: val })
                        }}
                        style={{ borderColor: validationErrors.last_name ? 'red' : undefined }}
                        maxLength={40}
                        className="w-full"
                        aria-labelledby={`label-last-name`}
                    />
                    {validationErrors.last_name && (
                        <small className="p-error">Last name is required.</small>
                    )}
                </div>
            </div>

            <div className="field">
                <label className="text-sm" id="label-email">Email *</label>
                <InputText 
                    value={newUser.email} 
                    onChange={(e) => { 
                        const val = e.target.value.slice(0, 255);
                        setNewUser({ ...newUser, email: val })
                    }}
                    style={{ borderColor: validationErrors.email ? 'red' : undefined }}
                    maxLength={255}
                    aria-labelledby={`label-email`}
                />
                {emailLoading ? (
                    <small className="p-text-secondary">Loading emails...</small>
                ) : emailExists ? (
                    <small className="p-error">Email already exists.</small>
                ) : validationErrors.email ? (
                    <small className="p-error">Invalid email format/Email is required.</small>
                ) : null}
            </div>
            <div className="field">
                <label className="text-sm" id="label-password">Password *</label>
                <Password 
                    value={newUser.password} 
                    onChange={(e) => {
                        const val = e.target.value.slice(0, 40);
                        setNewUser({ ...newUser, password: val })
                    }} 
                    toggleMask 
                    feedback={false}
                    invalid={validationErrors.password}
                    maxLength={40}
                    aria-labelledby={`label-password`}
                />
                {newUser.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newUser.password) ? (
                    <small className="p-error">Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.</small>
                ) : null}
            </div>
            <Button label="Add User" onClick={handleSubmit} className='unified-button' loading={saveUserLoading} />
        </Dialog>
        </>
    );
};

export default UserForm;
