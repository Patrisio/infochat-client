import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { authSignIn } from '../../actions';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './SignInPage.module.scss';

export default function SignUpPage()  {
  const dispatch = useDispatch();

  const signInUser = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: { value: string },
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;
    const successCallback = (data: any) => {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }

      localStorage.setItem('token', data.accessToken);
      window.location.href = `/project/${data.projectId}/inbox/opened`;
    };

    dispatch(authSignIn({
      email,
      password,
      successCallback,
    }));
  };

  return (
    <div className={styles.formWrapper}>
      <form
        className={styles.form}
        method='POST'
        onSubmit={signInUser}
      >
        <h1 className={styles.h1}>Войдите в свой аккаунт</h1>
        <Input
          placeholder='E-mail'
          type='email'
          name='email'
          fluid
        />
        <Input
          placeholder='Пароль'
          type='password'
          name='password'
          fluid
        />
        <Button
          type='submit'
          fluid
        >
          Войти
        </Button>
        <p className={styles.formFooter}>
          Еще нет аккаунта? 
          <Link
            to='/signup'
            className={styles.link}
          >
            Зарегистрируйтесь
          </Link>
          , это бесплатно!
        </p>
      </form>
    </div>
  );
}